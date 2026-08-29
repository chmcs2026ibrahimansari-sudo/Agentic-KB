// Repo-scoped bus channels. Mirrors agent-runtime/bus.mjs.
import fs from 'fs'
import path from 'path'
import { parseFrontmatter, serializeFrontmatter, updateFrontmatter } from '../agent-runtime/frontmatter.mjs'
import { timestamp, todayStamp } from '../agent-runtime/ids.mjs'
import { transition } from '../agent-runtime/state-machines.mjs'
import { appendAudit } from '../agent-runtime/audit.mjs'
import { compareBusItemsByCreatedAt } from '../agent-runtime/bus.mjs'
import { repoBusRoot } from './paths.mjs'

export const REPO_CHANNELS = ['discovery', 'escalation', 'standards', 'handoffs']

function ensureDir(full) {
  fs.mkdirSync(path.dirname(full), { recursive: true })
}

function nextRepoId(kbRoot, repoName, channel) {
  const day = todayStamp()
  const dir = path.join(kbRoot, repoBusRoot(repoName, channel))
  let max = 0
  try {
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) {
        // \d{3,}: see nextBusId in agent-runtime/ids.mjs — ids past 999 are
        // four digits and an exact-3 match makes every later publish collide.
        const m = f.match(new RegExp(`^${channel}-${day}-(\\d{3,})\\.md$`))
        if (m) max = Math.max(max, parseInt(m[1], 10))
      }
    }
  } catch {}
  const n = String(max + 1).padStart(3, '0')
  return `${channel}-${day}-${n}`
}

export function publishRepoBusItem(kbRoot, repoName, { channel, from, from_tier, to, project, type, priority, body, promote_candidate, sla_deadline, source_task, source_rewrite, tags, skipAudit = false }) {
  if (!REPO_CHANNELS.includes(channel)) throw new Error(`Unknown repo bus channel: ${channel}`)

  const id = nextRepoId(kbRoot, repoName, channel)
  const now = new Date().toISOString()
  const fm = {
    id,
    repo_name: repoName,
    from,
    from_tier: from_tier || null,
    to: to || null,
    project: project || null,
    type: type || channel,
    priority: priority || 'medium',
    status: 'open',
    promote_candidate: promote_candidate === true,
    sla_deadline: sla_deadline || null,
    source_task: source_task || null,
    source_rewrite: source_rewrite || null,
    tags: tags || [],
    created_at: now,
    status_history: [{ from: 'draft', to: 'open', actor: from, at: now }],
    memory_class: 'bus',
    title: `[${channel}] ${(body || '').split('\n')[0].slice(0, 80)}`,
  }

  const content = serializeFrontmatter(fm, '\n' + (body || '') + '\n')
  const relPath = `${repoBusRoot(repoName, channel)}/${id}.md`
  const full = path.join(kbRoot, relPath)
  ensureDir(full)
  try {
    // Exclusive create: concurrent publishers can compute the same scanned id;
    // a plain write would silently overwrite the first item.
    fs.writeFileSync(full, content, { flag: 'wx' })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
    for (let attempt = 0; attempt < 20; attempt++) {
      const retryId = nextRepoId(kbRoot, repoName, channel)
      const retryRel = `${repoBusRoot(repoName, channel)}/${retryId}.md`
      const retryContent = serializeFrontmatter({ ...fm, id: retryId }, '\n' + (body || '') + '\n')
      try {
        fs.writeFileSync(path.join(kbRoot, retryRel), retryContent, { flag: 'wx' })
        if (!skipAudit) appendAudit(kbRoot, { op: 'repo-bus-publish', repo: repoName, channel, id: retryId, from, to, project, path: retryRel })
        return { id: retryId, path: retryRel }
      } catch (retryErr) {
        if (retryErr.code !== 'EEXIST') throw retryErr
      }
    }
    throw new Error(`publishRepoBusItem: could not allocate a unique id for ${repoName}/${channel}`)
  }
  if (!skipAudit) {
    appendAudit(kbRoot, { op: 'repo-bus-publish', repo: repoName, channel, id, from, to, project, path: relPath })
  }
  return { id, path: relPath }
}

// Repo bus ids look like `discovery-2026-07-12-001` — path separators or
// dot-dot segments are traversal attempts, not ids.
function assertSafeRepoBusId(id) {
  if (typeof id !== 'string' || id.length === 0 || /[/\\]|\.\./.test(id) || id.includes('\0')) {
    throw new Error(`Invalid repo bus item id: ${String(id).slice(0, 80)}`)
  }
}

export function readRepoBusItem(kbRoot, repoName, channel, id) {
  if (!REPO_CHANNELS.includes(channel)) throw new Error(`Unknown repo bus channel: ${channel}`)
  assertSafeRepoBusId(id)
  const relPath = `${repoBusRoot(repoName, channel)}/${id}.md`
  const full = path.join(kbRoot, relPath)
  if (!fs.existsSync(full)) return null
  const content = fs.readFileSync(full, 'utf8')
  const { data, content: body } = parseFrontmatter(content)
  return { path: relPath, meta: data, body }
}

export function listRepoBusItems(kbRoot, repoName, channel, { status, limit = 100 } = {}) {
  if (!REPO_CHANNELS.includes(channel)) throw new Error(`Unknown repo bus channel: ${channel}`)
  const dir = path.join(kbRoot, repoBusRoot(repoName, channel))
  if (!fs.existsSync(dir)) return []
  const items = []
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md')) continue
    const id = f.replace(/\.md$/, '')
    const item = readRepoBusItem(kbRoot, repoName, channel, id)
    if (!item) continue
    if (status && item.meta.status !== status) continue
    items.push(item)
  }
  items.sort(compareBusItemsByCreatedAt)
  return items.slice(0, limit)
}

export function transitionRepoBusItem(kbRoot, repoName, channel, id, toState, actor, extraMeta = {}) {
  const item = readRepoBusItem(kbRoot, repoName, channel, id)
  if (!item) throw new Error(`Repo bus item not found: ${repoName}/${channel}/${id}`)
  const result = transition('bus', item.meta.status, toState, actor)
  const history = Array.isArray(item.meta.status_history) ? item.meta.status_history : []
  history.push(result.status_history_entry)
  const abs = path.join(kbRoot, item.path)
  const updated = updateFrontmatter(
    fs.readFileSync(abs, 'utf8'),
    { ...extraMeta, status: result.status, status_history: history }
  )
  // Atomic tmp + rename, same as transitionBusItem in agent-runtime/bus.mjs:
  // a reader racing a plain in-place write can observe a torn file.
  const tmp = abs + '.tmp-' + process.pid + '-' + Date.now()
  fs.writeFileSync(tmp, updated)
  fs.renameSync(tmp, abs)
  appendAudit(kbRoot, { op: 'repo-bus-transition', repo: repoName, channel, id, from: item.meta.status, to: toState, actor })
  return { path: item.path, status: result.status }
}
