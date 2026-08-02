// Bus channels: publish, list, read, transition.
import fs from 'fs'
import path from 'path'
import { parseFrontmatter, serializeFrontmatter, updateFrontmatter } from './frontmatter.mjs'
import { nextBusId } from './ids.mjs'
import { transition } from './state-machines.mjs'
import { appendAudit } from './audit.mjs'

// V1 channels + V2 governance channels
export const CHANNELS = ['discovery', 'escalation', 'standards', 'handoffs', 'review', 'corrections']

// V2: publish a review item for contradiction resolution or human sign-off
export function publishReviewItem(kbRoot, {
  from,
  candidatePath,
  conflictingPages = [],
  contradictionStatus = 'suspected',
  title,
  body,
  confidence,
  proposedTargetPath = null,
  scoreResult = null,
}) {
  const now = new Date().toISOString()
  const fm = {
    channel: 'review',
    from,
    candidate_path: candidatePath,
    conflicting_pages: conflictingPages,
    contradiction_status: contradictionStatus,
    proposed_target_path: proposedTargetPath,
    confidence: confidence || 'medium',
    promotion_score: scoreResult?.score ?? null,
    promotion_decision_pre_review: scoreResult?.decision ?? null,
    status: 'open',
    created_at: now,
    resolved_at: null,
    resolved_by: null,
    resolution: null,
    memory_class: 'bus',
    title: title || `[review] ${(body || '').split('\n')[0].slice(0, 80)}`,
  }
  // Exclusive create with rescan-retry, same as publishBusItem: two
  // concurrent publishers can scan the same directory state and compute
  // identical ids — this path previously threw EEXIST at the caller instead
  // of retrying with the next id.
  for (let attempt = 0; attempt < 20; attempt++) {
    const id = nextBusId(kbRoot, 'review')
    const relPath = `wiki/system/bus/review/${id}.md`
    const full = path.join(kbRoot, relPath)
    fs.mkdirSync(path.dirname(full), { recursive: true })
    const content = serializeFrontmatter({ ...fm, id }, '\n' + (body || '') + '\n')
    try {
      writeBusFileExclusive(full, content)
    } catch (err) {
      if (err.code === 'EEXIST') continue
      throw err
    }
    appendAudit(kbRoot, { op: 'bus-publish', channel: 'review', id, from, path: relPath })
    return { id, path: relPath }
  }
  throw new Error('publishReviewItem: could not allocate a unique id for channel review')
}

// Exclusive create: two concurrent publishers can scan the same directory
// state and compute identical ids; a plain write would silently overwrite the
// first item. 'wx' surfaces the collision so callers can regenerate the id.
function writeBusFileExclusive(full, content) {
  fs.writeFileSync(full, content, { flag: 'wx' })
}

export function publishBusItem(kbRoot, { channel, from, to, project, type, priority, body, promote_candidate, sla_deadline, from_tier, title, confidence, related_sources, proposed_target_path, contradiction_status, evidence_count }) {
  const skipAudit = arguments[1]?.skipAudit === true
  if (!CHANNELS.includes(channel)) throw new Error(`Unknown bus channel: ${channel}`)
  const now = new Date().toISOString()
  const id = nextBusId(kbRoot, channel)
  const fm = {
    id,
    channel,
    from,
    from_tier: from_tier || null,
    to: to || null,
    project: project || null,
    type: type || channel,
    priority: priority || 'medium',
    status: 'open',
    promote_candidate: promote_candidate === true,
    sla_deadline: sla_deadline || null,
    created_at: now,
    status_history: [{ from: 'draft', to: 'open', actor: from, at: now }],
    memory_class: 'bus',
    // V2 fields
    title: title || `[${channel}] ${(body || '').split('\n')[0].slice(0, 80)}`,
    confidence: confidence || null,
    related_sources: related_sources || [],
    proposed_target_path: proposed_target_path || null,
    contradiction_status: contradiction_status || 'none',
    evidence_count: evidence_count || 0,
  }
  const content = serializeFrontmatter(fm, '\n' + (body || '') + '\n')
  const relPath = `wiki/system/bus/${channel}/${id}.md`
  const full = path.join(kbRoot, relPath)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  try {
    writeBusFileExclusive(full, content)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
    // Concurrent publisher won the id — rescan (which now sees their file),
    // take the next id, and write that. One retry is enough in practice; keep
    // a small bound to avoid spinning if the directory is churning.
    let done = false
    for (let attempt = 0; attempt < 20 && !done; attempt++) {
      const retryId = nextBusId(kbRoot, channel)
      const retryRel = `wiki/system/bus/${channel}/${retryId}.md`
      const retryContent = serializeFrontmatter({ ...fm, id: retryId }, '\n' + (body || '') + '\n')
      try {
        writeBusFileExclusive(path.join(kbRoot, retryRel), retryContent)
        if (!skipAudit) appendAudit(kbRoot, { op: 'bus-publish', channel, id: retryId, from, to, project, path: retryRel })
        return { id: retryId, path: retryRel }
      } catch (retryErr) {
        if (retryErr.code !== 'EEXIST') throw retryErr
      }
    }
    throw new Error(`publishBusItem: could not allocate a unique id for channel ${channel}`)
  }
  if (!skipAudit) {
    appendAudit(kbRoot, { op: 'bus-publish', channel, id, from, to, project, path: relPath })
  }
  return { id, path: relPath }
}

// Bus ids look like `disc-0001` — anything with a path separator or dot-dot
// is a traversal attempt, not an id.
function assertSafeBusId(id) {
  if (typeof id !== 'string' || id.length === 0 || /[/\\]|\.\./.test(id) || id.includes('\0')) {
    throw new Error(`Invalid bus item id: ${String(id).slice(0, 80)}`)
  }
}

export function readBusItem(kbRoot, channel, id) {
  if (!CHANNELS.includes(channel)) throw new Error(`Unknown bus channel: ${channel}`)
  assertSafeBusId(id)
  const relPath = `wiki/system/bus/${channel}/${id}.md`
  const full = path.join(kbRoot, relPath)
  if (!fs.existsSync(full)) return null
  const content = fs.readFileSync(full, 'utf8')
  const { data, content: body } = parseFrontmatter(content)
  return { path: relPath, meta: data, body }
}

export function listBusItems(kbRoot, channel, { status, limit = 100 } = {}) {
  if (!CHANNELS.includes(channel)) throw new Error(`Unknown bus channel: ${channel}`)
  const dir = path.join(kbRoot, 'wiki', 'system', 'bus', channel)
  if (!fs.existsSync(dir)) return []
  const items = []
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md')) continue
    const id = f.replace(/\.md$/, '')
    const item = readBusItem(kbRoot, channel, id)
    if (!item) continue
    if (status && item.meta.status !== status) continue
    items.push(item)
  }
  items.sort((a, b) => String(b.meta.created_at).localeCompare(String(a.meta.created_at)))
  return items.slice(0, limit)
}

export function transitionBusItem(kbRoot, channel, id, toState, actor) {
  const item = readBusItem(kbRoot, channel, id)
  if (!item) throw new Error(`Bus item not found: ${channel}/${id}`)
  const result = transition('bus', item.meta.status, toState, actor)
  const history = Array.isArray(item.meta.status_history) ? item.meta.status_history : []
  history.push(result.status_history_entry)
  // Single read + atomic rename. Avoids the second read in updateFrontmatter racing
  // against another writer and avoids torn-write between the write and a reader.
  const abs = path.join(kbRoot, item.path)
  const raw = fs.readFileSync(abs, 'utf8')
  const updated = updateFrontmatter(raw, { status: result.status, status_history: history })
  const tmp = abs + '.tmp-' + process.pid + '-' + Date.now()
  fs.writeFileSync(tmp, updated)
  fs.renameSync(tmp, abs)
  appendAudit(kbRoot, { op: 'bus-transition', channel, id, from: item.meta.status, to: toState, actor })
  return { path: item.path, status: result.status }
}
