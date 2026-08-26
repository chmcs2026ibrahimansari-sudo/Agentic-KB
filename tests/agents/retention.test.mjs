// Direct tests for retention & compaction: bus TTL, working-memory archival,
// task-log rotation, hot compaction. These functions move files around —
// regressions here silently lose agent memory, so pin the rules.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import {
  runBusTTL,
  archiveCompletedTaskMemory,
  archiveAbandonedTaskMemory,
  rotateTaskLog,
  compactHotMemory,
} from '../../lib/agent-runtime/retention.mjs'
import { publishBusItem, readBusItem } from '../../lib/agent-runtime/bus.mjs'
import { serializeFrontmatter, parseFrontmatter, updateFrontmatter } from '../../lib/agent-runtime/frontmatter.mjs'

function makeRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'retention-'))
}

function isoDaysAgo(days) {
  return new Date(Date.now() - days * 86400000).toISOString()
}

function backdateBusItem(kbRoot, relPath, createdAt) {
  const full = path.join(kbRoot, relPath)
  const content = fs.readFileSync(full, 'utf8')
  fs.writeFileSync(full, updateFrontmatter(content, { created_at: createdAt }))
}

// ─── runBusTTL ──────────────────────────────────────────────────────────

test('runBusTTL archives only stale, unpinned, non-terminal items', () => {
  const root = makeRoot()
  const stale = publishBusItem(root, { channel: 'discovery', from: 'w1', body: 'stale finding' })
  const fresh = publishBusItem(root, { channel: 'discovery', from: 'w1', body: 'fresh finding' })
  const pinned = publishBusItem(root, { channel: 'discovery', from: 'w1', body: 'pinned finding' })

  backdateBusItem(root, stale.path, isoDaysAgo(45))
  backdateBusItem(root, pinned.path, isoDaysAgo(45))
  const pinnedFull = path.join(root, pinned.path)
  fs.writeFileSync(pinnedFull, updateFrontmatter(fs.readFileSync(pinnedFull, 'utf8'), { pinned: true }))

  const { archived } = runBusTTL(root, { ttlDays: 30 })

  assert.equal(archived.length, 1)
  assert.match(archived[0], /^wiki\/archive\/bus\/discovery\/\d{4}\//)
  // Stale item moved (not copied) into the archive.
  assert.equal(fs.existsSync(path.join(root, stale.path)), false)
  const archivedContent = fs.readFileSync(path.join(root, archived[0]), 'utf8')
  assert.ok(archivedContent.includes('stale finding'))
  // Fresh + pinned items untouched.
  assert.ok(readBusItem(root, 'discovery', fresh.id))
  assert.ok(fs.existsSync(pinnedFull))
})

test('runBusTTL skips items with a missing created_at', () => {
  // `Date.parse(undefined || 0)` resolves to 2000-01-01, so an undated item
  // used to read as 26 years old and got unlinked off the bus on the first
  // TTL sweep. A missing date must be treated as unknown, not ancient.
  const root = makeRoot()
  const item = publishBusItem(root, { channel: 'discovery', from: 'w1', body: 'undated' })
  const full = path.join(root, item.path)
  const { data, content } = parseFrontmatter(fs.readFileSync(full, 'utf8'))
  delete data.created_at
  fs.writeFileSync(full, serializeFrontmatter(data, content))

  const { archived } = runBusTTL(root, { ttlDays: 30 })

  assert.equal(archived.length, 0)
  assert.ok(fs.existsSync(full))
})

test('runBusTTL skips items with unparseable created_at', () => {
  const root = makeRoot()
  const item = publishBusItem(root, { channel: 'discovery', from: 'w1', body: 'no date' })
  backdateBusItem(root, item.path, 'not-a-date')
  const { archived } = runBusTTL(root, { ttlDays: 0 })
  assert.equal(archived.length, 0)
  assert.ok(fs.existsSync(path.join(root, item.path)))
})

test('runBusTTL sees the oldest items on a channel larger than the list window', () => {
  // listBusItems sorts newest-first and then truncates to `limit`. runBusTTL
  // asked for 1000, so on a channel with more than 1000 items it was handed the
  // newest 1000 — precisely the items that are *not* past TTL — and the genuinely
  // stale ones at the tail were never even examined. The sweep returned an empty
  // `archived`, which reads exactly like "nothing was due".
  const root = makeRoot()
  const dir = path.join(root, 'wiki', 'system', 'bus', 'discovery')
  fs.mkdirSync(dir, { recursive: true })

  // Written directly rather than via publishBusItem: id allocation rescans the
  // directory per publish, which is quadratic at this count.
  const writeItem = (id, createdAt) =>
    fs.writeFileSync(
      path.join(dir, `${id}.md`),
      serializeFrontmatter({ id, channel: 'discovery', status: 'open', created_at: createdAt }, 'body\n')
    )

  writeItem('disc-ancient', isoDaysAgo(400))
  for (let i = 0; i < 1000; i++) writeItem(`disc-fresh-${String(i).padStart(4, '0')}`, isoDaysAgo(0))

  const { archived } = runBusTTL(root, { ttlDays: 30 })

  assert.deepEqual(archived, [`wiki/archive/bus/discovery/${new Date(Date.now() - 400 * 86400000).getFullYear()}/disc-ancient.md`])
  assert.equal(fs.existsSync(path.join(dir, 'disc-ancient.md')), false)
  // Every fresh item is left alone.
  assert.equal(fs.readdirSync(dir).length, 1000)
})

// ─── working-memory archival ────────────────────────────────────────────

function writeWorkingMemory(root, agentId, name, fm) {
  const dir = path.join(root, `wiki/agents/workers/${agentId}/working-memory`)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, name), serializeFrontmatter(fm, '\nnotes\n'))
}

test('archiveCompletedTaskMemory archives only old completed files', () => {
  const root = makeRoot()
  writeWorkingMemory(root, 'w1', 'old-done.md', { status: 'completed', completed_at: isoDaysAgo(30) })
  writeWorkingMemory(root, 'w1', 'fresh-done.md', { status: 'completed', completed_at: isoDaysAgo(1) })
  writeWorkingMemory(root, 'w1', 'active.md', { status: 'active' })
  writeWorkingMemory(root, 'w1', 'dateless-done.md', { status: 'completed' })

  const { archived, skipped } = archiveCompletedTaskMemory(root, 'w1', 'worker', { olderThanDays: 7 })

  assert.deepEqual(archived, ['wiki/archive/task-memory/w1/old-done.md'])
  assert.equal(skipped, 3)
  assert.equal(fs.existsSync(path.join(root, 'wiki/agents/workers/w1/working-memory/old-done.md')), false)
  assert.ok(fs.existsSync(path.join(root, archived[0])))
  // Active + fresh + dateless files never touched.
  assert.ok(fs.existsSync(path.join(root, 'wiki/agents/workers/w1/working-memory/active.md')))
  assert.ok(fs.existsSync(path.join(root, 'wiki/agents/workers/w1/working-memory/fresh-done.md')))
  assert.ok(fs.existsSync(path.join(root, 'wiki/agents/workers/w1/working-memory/dateless-done.md')))
})

test('archiveCompletedTaskMemory never overwrites an existing archived record', () => {
  // The archive is a flat namespace keyed by the working-memory filename, i.e.
  // the caller-supplied task_id. startTask's exclusive-create guard only
  // protects the *live* file, so once retention has archived it the same id can
  // be started again — and archiving the second run used to silently replace
  // the first run's only surviving copy.
  const root = makeRoot()

  writeWorkingMemory(root, 'w1', 'fix-auth.md', { status: 'completed', completed_at: isoDaysAgo(30) })
  const first = archiveCompletedTaskMemory(root, 'w1', 'worker', { olderThanDays: 7 })
  assert.deepEqual(first.archived, ['wiki/archive/task-memory/w1/fix-auth.md'])
  fs.writeFileSync(path.join(root, first.archived[0]), 'FIRST RUN\n')

  // Same task id reused after the live file was archived away.
  writeWorkingMemory(root, 'w1', 'fix-auth.md', { status: 'completed', completed_at: isoDaysAgo(30) })
  const second = archiveCompletedTaskMemory(root, 'w1', 'worker', { olderThanDays: 7 })

  assert.deepEqual(second.archived, ['wiki/archive/task-memory/w1/fix-auth-2.md'])
  // The first record is intact, and the reported path is where the file landed.
  assert.equal(fs.readFileSync(path.join(root, 'wiki/archive/task-memory/w1/fix-auth.md'), 'utf8'), 'FIRST RUN\n')
  assert.ok(fs.existsSync(path.join(root, second.archived[0])))
  // The live file is still moved, not copied.
  assert.equal(fs.existsSync(path.join(root, 'wiki/agents/workers/w1/working-memory/fix-auth.md')), false)
})

test('archiveAbandonedTaskMemory archives only old abandoned files', () => {
  const root = makeRoot()
  writeWorkingMemory(root, 'w1', 'old-abandoned.md', { status: 'abandoned', abandoned_at: isoDaysAgo(10) })
  writeWorkingMemory(root, 'w1', 'completed.md', { status: 'completed', completed_at: isoDaysAgo(10) })

  const { archived } = archiveAbandonedTaskMemory(root, 'w1', 'worker', { olderThanDays: 3 })

  assert.deepEqual(archived, ['wiki/archive/task-memory/abandoned/w1/old-abandoned.md'])
  assert.ok(fs.existsSync(path.join(root, 'wiki/agents/workers/w1/working-memory/completed.md')))
})

// ─── task-log rotation ──────────────────────────────────────────────────

test('rotateTaskLog snapshots and truncates only past the threshold', () => {
  const root = makeRoot()
  const rel = 'wiki/agents/workers/w1/task-log.md'
  const full = path.join(root, rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })

  fs.writeFileSync(full, 'line\n'.repeat(3))
  assert.equal(rotateTaskLog(root, 'w1', 'worker', 10).skipped, true)

  const body = 'line\n'.repeat(20)
  fs.writeFileSync(full, body)
  const res = rotateTaskLog(root, 'w1', 'worker', 10)
  assert.ok(res.snapshot)
  assert.equal(fs.readFileSync(path.join(root, res.snapshot), 'utf8'), body)
  const rotated = fs.readFileSync(full, 'utf8')
  assert.ok(rotated.includes('rotated_at:'))
  assert.ok(!rotated.includes('line\nline'))
})

// ─── hot compaction ─────────────────────────────────────────────────────

test('compactHotMemory snapshots and flags large hot files', () => {
  const root = makeRoot()
  const rel = 'wiki/agents/workers/w1/hot.md'
  const full = path.join(root, rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })

  fs.writeFileSync(full, serializeFrontmatter({ memory_class: 'hot' }, '\nshort note\n'))
  assert.equal(compactHotMemory(root, 'w1', 'worker').skipped, true)

  const bigBody = '\n' + 'word '.repeat(600) + '\n'
  fs.writeFileSync(full, serializeFrontmatter({ memory_class: 'hot' }, bigBody))
  const res = compactHotMemory(root, 'w1', 'worker')
  assert.ok(res.snapshot)
  assert.ok(fs.existsSync(path.join(root, res.snapshot)))
  const { data } = parseFrontmatter(fs.readFileSync(full, 'utf8'))
  assert.equal(data.needs_compaction, true)
  assert.equal(data.last_snapshot, res.snapshot)
})
