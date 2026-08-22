// Repo registry CRUD. Reads/writes config/repos/registry.json.
import fs from 'fs'
import path from 'path'
import { withLock } from '../agent-runtime/locks.mjs'

const REGISTRY_PATH = 'config/repos/registry.json'

function ensureDir(full) {
  fs.mkdirSync(path.dirname(full), { recursive: true })
}

// A *missing* registry is legitimately empty — nothing has been registered yet.
// A registry that exists but cannot be parsed is not empty, it is damaged, and
// the two must not look alike to a caller. Returning [] for damage made the
// exact failure saveRegistry's comment warns about survivable-looking and then
// permanent: loadRegistry -> [] -> upsertRepo pushes one record -> saveRegistry
// writes a one-repo registry over the damaged file, destroying every other
// record and the evidence at the same time. Reproduced with a half-truncated
// registry.json: three repos in, one repo out, exit status 0.
export function loadRegistry(kbRoot) {
  const full = path.join(kbRoot, REGISTRY_PATH)
  if (!fs.existsSync(full)) return []
  let raw
  try {
    raw = fs.readFileSync(full, 'utf8')
  } catch (err) {
    throw new Error(`repo registry ${REGISTRY_PATH} is unreadable: ${err.message}`)
  }
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    throw new Error(
      `repo registry ${REGISTRY_PATH} is present but not valid JSON (${err.message}). ` +
      'Refusing to treat it as an empty registry — a write would overwrite every ' +
      'surviving record. Repair or delete the file to continue.'
    )
  }
  // Support both plain array format and wrapped { version, repos: [...] } format
  if (Array.isArray(parsed)) return parsed
  if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.repos)) return parsed.repos
    // A wrapper with no `repos` key at all is a hand-initialised file, not
    // damage — saveRegistry always writes the key.
    if (!('repos' in parsed)) return []
  }
  throw new Error(
    `repo registry ${REGISTRY_PATH} has an unrecognised shape (expected an array ` +
    'or { repos: [...] }). Refusing to treat it as an empty registry.'
  )
}

export function saveRegistry(kbRoot, records) {
  const full = path.join(kbRoot, REGISTRY_PATH)
  ensureDir(full)
  // Read existing wrapper metadata if present, otherwise create fresh
  let wrapper = { version: '1.0' }
  if (fs.existsSync(full)) {
    try {
      const existing = JSON.parse(fs.readFileSync(full, 'utf8'))
      if (existing && !Array.isArray(existing)) wrapper = existing
    } catch { /* ignore */ }
  }
  wrapper.repos = records
  wrapper.updated_at = new Date().toISOString()
  // Atomic tmp + rename (same stance as bus/task-lifecycle writes): a crash
  // mid-write must not leave a truncated registry.json — loadRegistry parses
  // it as empty and the next save would silently drop every record.
  const tmp = full + '.tmp-' + process.pid + '-' + Date.now()
  fs.writeFileSync(tmp, JSON.stringify(wrapper, null, 2) + '\n')
  fs.renameSync(tmp, full)
}

export function getRepo(kbRoot, repoName) {
  const records = loadRegistry(kbRoot)
  return records.find(r => r.repo_name === repoName) || null
}

// The whole registry lives in one file, so load -> mutate -> save is a
// read-modify-write over shared state. `POST /api/repos` and a concurrent
// syncRepo -> markSynced would interleave and the loser's record silently
// vanished (or reverted to its pre-sync state). Serialize on a single
// registry lock — same stance as the per-repo lock around writeback.
export function upsertRepo(kbRoot, record) {
  return withLock(kbRoot, 'repo-registry', () => {
    const records = loadRegistry(kbRoot)
    const idx = records.findIndex(r => r.repo_name === record.repo_name)
    if (idx >= 0) {
      records[idx] = { ...records[idx], ...record }
    } else {
      records.push(record)
    }
    saveRegistry(kbRoot, records)
    return records[idx >= 0 ? idx : records.length - 1]
  })
}

export function listRepos(kbRoot) {
  return loadRegistry(kbRoot)
}

export function markSynced(kbRoot, repoName, { commit_sha, file_count, partial_sync = false }) {
  // Existence check only; upsertRepo re-reads the registry under the lock so
  // this read cannot go stale in a way that loses a concurrent write.
  const record = getRepo(kbRoot, repoName)
  if (!record) throw new Error(`Repo not found: ${repoName}`)
  return upsertRepo(kbRoot, {
    repo_name: repoName,
    last_sync_at: new Date().toISOString(),
    last_synced_commit: commit_sha,
    markdown_file_count: file_count,
    // markdown_file_count is a floor rather than a total when the fetch that
    // produced it dropped docs. Always written, so its absence on a record
    // cannot be mistaken for "this count is complete".
    partial_sync: partial_sync === true,
    status: 'active',
  })
}
