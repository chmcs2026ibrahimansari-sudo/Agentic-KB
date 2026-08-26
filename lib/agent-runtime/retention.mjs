// Retention & compaction: hot compaction, bus TTL, task log rotation. Archive never delete.
import fs from 'fs'
import path from 'path'
import { parseFrontmatter, updateFrontmatter } from './frontmatter.mjs'
import { listBusItems, transitionBusItem } from './bus.mjs'
import { appendAudit } from './audit.mjs'
import { timestamp } from './ids.mjs'

// Atomic tmp + rename (same stance as writeback/bus/task-lifecycle): hot.md
// and task-log.md are rewritten in place here, and a crash mid-write must
// never leave the live file truncated — the snapshot alone doesn't help if
// nothing flags that the original was lost.
function atomicWrite(full, data) {
  const tmp = full + '.tmp-' + process.pid + '-' + Date.now()
  fs.writeFileSync(tmp, data)
  fs.renameSync(tmp, full)
}

// Exclusive-create snapshot with bounded -2/-3… suffixes. timestamp() is only
// unique within one process, so two processes compacting the same agent in
// the same second computed the same snapshot path — and the second plain
// write silently replaced the first snapshot right before the live file was
// truncated, destroying the only copy (same class as the hot-digest fix in
// hot-learned.mjs).
function exclusiveSnapshotWrite(kbRoot, snapshotRel, content) {
  let rel = snapshotRel
  for (let n = 2; ; n++) {
    const full = path.join(kbRoot, rel)
    fs.mkdirSync(path.dirname(full), { recursive: true })
    try {
      fs.writeFileSync(full, content, { flag: 'wx' })
      return rel
    } catch (err) {
      if (err.code !== 'EEXIST' || n > 20) throw err
      rel = snapshotRel.replace(/\.md$/, `-${n}.md`)
    }
  }
}

const DAY_MS = 86400000

// Exclusive-create move with bounded -2/-3… suffixes, for the same reason
// exclusiveSnapshotWrite has them: the archive is a flat namespace keyed by the
// source filename, so two different tasks can claim the same slot. A
// working-memory file is named after a caller-supplied task_id, and startTask's
// exclusive-create guard only protects the *live* file — once retention has
// archived that file the id is free again, so reusing it and completing a
// second time made copyFileSync overwrite the first task's only surviving
// record. In a module whose contract is "archive never delete", that was a
// silent, unrecoverable loss. COPYFILE_EXCL turns the collision into an error
// this loop can resolve, and the source is only unlinked once the copy landed.
export function archiveMove(kbRoot, relPath, archiveRel) {
  const src = path.join(kbRoot, relPath)
  let rel = archiveRel
  for (let n = 2; ; n++) {
    const dst = path.join(kbRoot, rel)
    fs.mkdirSync(path.dirname(dst), { recursive: true })
    try {
      fs.copyFileSync(src, dst, fs.constants.COPYFILE_EXCL)
      break
    } catch (err) {
      if (err.code !== 'EEXIST' || n > 20) throw err
      rel = /\.mdx?$/.test(archiveRel)
        ? archiveRel.replace(/(\.mdx?)$/, `-${n}$1`)
        : `${archiveRel}-${n}`
    }
  }
  fs.unlinkSync(src)
  appendAudit(kbRoot, { op: 'archive-move', from: relPath, to: rel })
  return rel
}

// Bus TTL: archive items older than N days unless pinned / promoted / in_progress.
export function runBusTTL(kbRoot, { ttlDays = 30, channels = ['discovery'] } = {}) {
  const archived = []
  const now = Date.now()
  for (const channel of channels) {
    // `listBusItems` parses every file in the channel and *then* sorts
    // newest-first and truncates to `limit`, so a limit here buys no work — it
    // only discards results. At 1000 it discarded exactly the wrong ones: a
    // channel holding more than 1000 items handed this sweep the 1000 *newest*,
    // which are by definition the ones not yet past TTL, and never showed it the
    // oldest — the only ones it exists to archive. The sweep then returned
    // `{ archived: [] }`, indistinguishable from "nothing was due".
    const items = listBusItems(kbRoot, channel, { limit: Infinity })
    for (const item of items) {
      if (item.meta.pinned) continue
      if (['promoted', 'in_progress', 'archived'].includes(item.meta.status)) continue
      // `Date.parse(x || 0)` parsed the *string* "0" for an item with no
      // created_at, which V8 resolves to 2000-01-01 — a truthy 26-year-old
      // timestamp. The `if (!createdAt) continue` guard was therefore dead:
      // every undated bus item passed the TTL check and archiveMove unlinked
      // it off the bus into wiki/archive/bus/<channel>/2000/.
      const createdAt = item.meta.created_at ? Date.parse(item.meta.created_at) : NaN
      if (!Number.isFinite(createdAt)) continue
      if (now - createdAt < ttlDays * DAY_MS) continue
      const year = new Date(createdAt).getFullYear()
      const archiveRel = `wiki/archive/bus/${channel}/${year}/${item.meta.id}.md`
      // transition first, then move
      try { transitionBusItem(kbRoot, channel, item.meta.id, 'archived', 'retention') } catch {}
      // Report where the file actually landed — archiveMove suffixes on collision.
      archived.push(archiveMove(kbRoot, item.path, archiveRel))
    }
  }
  return { archived }
}

// Hot memory compaction: snapshot current hot, truncate to header.
// Actual Claude-based compaction is a follow-up; this v1 snapshots and flags for review.
export function compactHotMemory(kbRoot, agentId, tier) {
  const rel = `wiki/agents/${tier}s/${agentId}/hot.md`
  const full = path.join(kbRoot, rel)
  if (!fs.existsSync(full)) return { skipped: true }
  const content = fs.readFileSync(full, 'utf8')
  const words = content.split(/\s+/).length
  if (words < 500) return { skipped: true, words }
  const snapshotRel = exclusiveSnapshotWrite(
    kbRoot, `wiki/archive/hot-snapshots/${agentId}/${timestamp()}.md`, content)
  // Leave a marker for Claude-side compaction to re-populate
  const stub = updateFrontmatter(content, { needs_compaction: true, last_snapshot: snapshotRel })
  atomicWrite(full, stub)
  appendAudit(kbRoot, { op: 'hot-compact', agent_id: agentId, snapshot: snapshotRel, words })
  return { snapshot: snapshotRel, words }
}

// ─── Task-local working-memory retention ─────────────────────────────────────

/**
 * Archive completed working-memory files older than olderThanDays.
 * Files with status: completed are safe to archive once the task is closed.
 * Files with status: active are never touched.
 * Returns { archived: string[], skipped: number }
 */
export function archiveCompletedTaskMemory(kbRoot, agentId, tier, { olderThanDays = 7 } = {}) {
  const wmDir = path.join(kbRoot, `wiki/agents/${tier}s/${agentId}/working-memory`)
  if (!fs.existsSync(wmDir)) return { archived: [], skipped: 0 }

  const cutoff = Date.now() - olderThanDays * DAY_MS
  const archived = []
  let skipped = 0

  for (const f of fs.readdirSync(wmDir)) {
    if (!f.endsWith('.md')) continue
    const full = path.join(wmDir, f)
    try {
      const content = fs.readFileSync(full, 'utf8')
      const fm = parseFrontmatter(content).data
      if (fm.status !== 'completed') { skipped++; continue }
      const completedAt = Date.parse(fm.completed_at || fm.updated || fm.created || '')
      // No parseable completion date → age is unknowable; never archive on a guess.
      if (!Number.isFinite(completedAt) || Date.now() - completedAt < olderThanDays * DAY_MS) { skipped++; continue }
      const rel = `wiki/agents/${tier}s/${agentId}/working-memory/${f}`
      const archiveRel = `wiki/archive/task-memory/${agentId}/${f}`
      archived.push(archiveMove(kbRoot, rel, archiveRel))
    } catch { skipped++ }
  }

  appendAudit(kbRoot, { op: 'task-memory-archive', agent_id: agentId, archived: archived.length, skipped })
  return { archived, skipped }
}

/**
 * Archive abandoned working-memory files older than olderThanDays.
 * Returns { archived: string[], skipped: number }
 */
export function archiveAbandonedTaskMemory(kbRoot, agentId, tier, { olderThanDays = 3 } = {}) {
  const wmDir = path.join(kbRoot, `wiki/agents/${tier}s/${agentId}/working-memory`)
  if (!fs.existsSync(wmDir)) return { archived: [], skipped: 0 }

  const archived = []
  let skipped = 0

  for (const f of fs.readdirSync(wmDir)) {
    if (!f.endsWith('.md')) continue
    const full = path.join(wmDir, f)
    try {
      const content = fs.readFileSync(full, 'utf8')
      const fm = parseFrontmatter(content).data
      if (fm.status !== 'abandoned') { skipped++; continue }
      const abandonedAt = Date.parse(fm.abandoned_at || fm.updated || '')
      // No parseable abandonment date → age is unknowable; never archive on a guess.
      if (!Number.isFinite(abandonedAt) || Date.now() - abandonedAt < olderThanDays * DAY_MS) { skipped++; continue }
      const rel = `wiki/agents/${tier}s/${agentId}/working-memory/${f}`
      const archiveRel = `wiki/archive/task-memory/abandoned/${agentId}/${f}`
      archived.push(archiveMove(kbRoot, rel, archiveRel))
    } catch { skipped++ }
  }

  appendAudit(kbRoot, { op: 'task-memory-abandoned-archive', agent_id: agentId, archived: archived.length, skipped })
  return { archived, skipped }
}

// Task log rotation at 10k lines
export function rotateTaskLog(kbRoot, agentId, tier, threshold = 10000) {
  const rel = `wiki/agents/${tier}s/${agentId}/task-log.md`
  const full = path.join(kbRoot, rel)
  if (!fs.existsSync(full)) return { skipped: true }
  const content = fs.readFileSync(full, 'utf8')
  const lines = content.split('\n').length
  if (lines < threshold) return { skipped: true, lines }
  const snapshotRel = exclusiveSnapshotWrite(
    kbRoot, `wiki/archive/hot-snapshots/${agentId}/task-log-${timestamp()}.md`, content)
  atomicWrite(full, `---\nmemory_class: working\nagent: ${agentId}\nrotated_at: ${new Date().toISOString()}\n---\n\n`)
  appendAudit(kbRoot, { op: 'task-log-rotate', agent_id: agentId, snapshot: snapshotRel, lines })
  return { snapshot: snapshotRel, lines }
}
