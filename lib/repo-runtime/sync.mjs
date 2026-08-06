// GitHub markdown sync. Fetch, filter, compare, write, archive.
import fs from 'fs'
import path from 'path'
import { importedDocPath, repoDocsRoot, isImportedDoc } from './paths.mjs'
import { makeImportedFrontmatter } from './metadata.mjs'
import { serializeFrontmatter, parseFrontmatter, updateFrontmatter } from '../agent-runtime/frontmatter.mjs'
import { appendAudit } from '../agent-runtime/audit.mjs'

export const INCLUDED_PATTERNS = [
  '*.md',
  '*.mdx',
  'docs/**/*.md',
  'docs/**/*.mdx',
  'specs/**/*.md',
  'plans/**/*.md',
  'reports/**/*.md',
  'architecture/**/*.md',
  'CLAUDE.md',
  'README.md',
]

export const EXCLUDED_PREFIXES = [
  'node_modules/',
  'dist/',
  'build/',
  '.next/',
  'generated/',
  'coverage/',
  '.git/',
]

function matchGlob(filePath, pattern) {
  // Simple glob matching: * matches non-/, ** matches anything
  let re = ''
  let i = 0
  while (i < pattern.length) {
    const c = pattern[i]
    if (c === '*') {
      if (pattern[i + 1] === '*') {
        re += '.*'
        i += 2
        if (pattern[i] === '/') i++
      } else {
        re += '[^/]*'
        i++
      }
    } else if (c === '?') {
      re += '[^/]'
      i++
    } else if ('.+^$()|{}[]\\'.includes(c)) {
      re += '\\' + c
      i++
    } else {
      re += c
      i++
    }
  }
  return new RegExp('^' + re + '$').test(filePath)
}

export function shouldInclude(filePath) {
  const normalized = filePath.replace(/\\/g, '/')

  // Check excluded dirs first — both at the repo root and nested (the
  // docs/**/*.md pattern would otherwise happily sync vendored markdown
  // from e.g. docs/node_modules/pkg/README.md).
  for (const prefix of EXCLUDED_PREFIXES) {
    if (normalized.startsWith(prefix) || normalized.includes('/' + prefix)) return false
  }

  // Check included patterns
  for (const pattern of INCLUDED_PATTERNS) {
    if (matchGlob(normalized, pattern)) return true
  }

  return false
}

// Fetch tree and blobs from GitHub API.
export async function fetchRepoMarkdown(repoName, owner, opts = {}) {
  const { token, branch, commitSha } = opts
  const baseUrl = 'https://api.github.com/repos'
  const repo = `${owner}/${repoName}`

  // Fetch tree
  const treeBranch = commitSha || branch || 'main'
  const treeUrl = `${baseUrl}/${repo}/git/trees/${treeBranch}?recursive=1`

  const treeOpts = {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  }
  if (token) {
    treeOpts.headers['Authorization'] = `token ${token}`
  }

  let treeData
  try {
    const treeResp = await fetch(treeUrl, treeOpts)
    if (!treeResp.ok) {
      throw new Error(`GitHub tree fetch failed: ${treeResp.status} ${treeResp.statusText}`)
    }
    treeData = await treeResp.json()
  } catch (err) {
    throw new Error(`Failed to fetch tree from GitHub: ${err.message}`)
  }

  // The git/trees API silently caps huge trees; surface it instead of
  // syncing a partial doc set with no indication anything is missing.
  if (treeData.truncated) {
    console.warn(`GitHub tree listing for ${repo} was truncated; some markdown files may not be synced`)
  }

  // Filter to markdown files
  const files = (treeData.tree || []).filter(item => {
    return item.type === 'blob' && shouldInclude(item.path)
  })

  // Fetch blobs with bounded concurrency. The previous serial loop made a
  // full sync one round-trip per file end to end; 8-wide keeps large repos
  // fast without hammering the GitHub API. Result order still follows the
  // tree listing so downstream traces stay deterministic.
  const BLOB_CONCURRENCY = 8
  const results = new Array(files.length)
  let nextIndex = 0
  async function blobWorker() {
    while (true) {
      const i = nextIndex++
      if (i >= files.length) return
      const file = files[i]
      try {
        const blobUrl = `${baseUrl}/${repo}/git/blobs/${file.sha}`
        const blobResp = await fetch(blobUrl, treeOpts)
        if (!blobResp.ok) {
          console.warn(`Skipping ${file.path}: blob fetch failed ${blobResp.status}`)
          continue
        }
        const blobData = await blobResp.json()
        const content = Buffer.from(blobData.content, 'base64').toString('utf8')
        results[i] = {
          path: file.path,
          content,
          sha: file.sha,
          download_url: `https://raw.githubusercontent.com/${repo}/${treeBranch}/${file.path}`,
        }
      } catch (err) {
        console.warn(`Skipping ${file.path}: ${err.message}`)
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(BLOB_CONCURRENCY, files.length) }, blobWorker))

  return results.filter(Boolean)
}

// Resolve the commit SHA a branch currently points at. Returns null on failure
// (provenance metadata is best-effort; sync must not fail because of it).
export async function fetchCommitSha(repoName, owner, { token, branch = 'main' } = {}) {
  const headers = { 'Accept': 'application/vnd.github.v3+json' }
  if (token) headers['Authorization'] = `token ${token}`
  try {
    const resp = await fetch(`https://api.github.com/repos/${owner}/${repoName}/commits/${branch}`, { headers })
    if (!resp.ok) return null
    const data = await resp.json()
    return typeof data.sha === 'string' ? data.sha : null
  } catch {
    return null
  }
}

function ensureDir(full) {
  fs.mkdirSync(path.dirname(full), { recursive: true })
}

// Atomic tmp + rename (same stance as repo writeback/bus/registry): synced
// docs are rewritten in place on every sync, and the archive copy is written
// *before* the live doc is unlinked — either write torn mid-crash must not
// lose the only surviving copy of the content.
function atomicWrite(full, data) {
  const tmp = full + '.tmp-' + process.pid + '-' + Date.now()
  fs.writeFileSync(tmp, data)
  fs.renameSync(tmp, full)
}

// Write a single imported doc with full frontmatter.
export function writeImportedDoc(kbRoot, repoName, repoVisibility, branch, commitSha, sourceFile) {
  const relPath = importedDocPath(repoName, sourceFile.path)
  const full = path.join(kbRoot, relPath)

  const fm = makeImportedFrontmatter({
    repo_name: repoName,
    repo_visibility: repoVisibility,
    source_type: 'github',
    branch,
    commit_sha: commitSha,
    source_path: sourceFile.path,
    imported_at: new Date().toISOString(),
    source_url: sourceFile.download_url,
  })

  const { data, content: existingBody } = parseFrontmatter(sourceFile.content)
  const mergedFm = { ...data, ...fm }
  const content = serializeFrontmatter(mergedFm, '\n' + existingBody)

  ensureDir(full)
  atomicWrite(full, content)

  return relPath
}

// Move a file to archive and update frontmatter.
export function archiveRemovedDoc(kbRoot, repoName, relPath) {
  if (!isImportedDoc(relPath)) return null

  const full = path.join(kbRoot, relPath)
  if (!fs.existsSync(full)) return null

  const content = fs.readFileSync(full, 'utf8')
  const archived = updateFrontmatter(content, { archived_at: new Date().toISOString() })

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  // Preserve the path relative to repo-docs/: flattening to basename made
  // same-named docs from different subdirs (docs/a/README.md, docs/b/README.md)
  // overwrite each other in the same dated archive dir.
  const docsPrefix = `${repoDocsRoot(repoName)}/`
  const subPath = relPath.startsWith(docsPrefix) ? relPath.slice(docsPrefix.length) : path.basename(relPath)
  const archivePath = `wiki/archive/repos/${repoName}/${today}/${subPath}`
  const archiveFull = path.join(kbRoot, archivePath)

  ensureDir(archiveFull)
  atomicWrite(archiveFull, archived)
  // Actually move: without this the removed doc stayed live under repo-docs/
  // forever and was re-archived into a fresh dated dir on every sync.
  fs.unlinkSync(full)

  return archivePath
}

// Orchestrate the sync: fetch, compare, write, archive.
// Second arg can be a repo name string OR a full registry record object.
export async function syncRepo(kbRoot, repoNameOrRecord, opts = {}) {
  let repoRecord = repoNameOrRecord
  if (typeof repoNameOrRecord === 'string') {
    const { getRepo } = await import('./registry.mjs')
    repoRecord = getRepo(kbRoot, repoNameOrRecord)
    if (!repoRecord) throw new Error(`Repo not found in registry: ${repoNameOrRecord}`)
  }
  const repoName = repoRecord.repo_name
  const owner = repoRecord.owner
  const branch = repoRecord.default_branch || 'main'
  const visibility = repoRecord.visibility

  const trace = {
    repo_name: repoName,
    started_at: new Date().toISOString(),
    created: [],
    updated: [],
    archived: [],
    errors: [],
    commit_sha: null,
  }

  // Fetch from GitHub
  let sourceFiles
  try {
    sourceFiles = await fetchRepoMarkdown(repoName, owner, { ...opts, branch })
  } catch (err) {
    trace.errors.push({ type: 'fetch', message: err.message })
    appendAudit(kbRoot, { op: 'repo-sync-fetch-error', repo: repoName, error: err.message })
    return trace
  }

  // Record the branch's commit SHA for provenance. (Previously this recorded
  // sourceFiles[0].sha — a blob sha of an arbitrary file, not a commit.)
  trace.commit_sha = await fetchCommitSha(repoName, owner, { token: opts.token, branch })

  // Get existing docs
  const docsRoot = repoDocsRoot(repoName)
  const docsFull = path.join(kbRoot, docsRoot)
  const existingDocs = new Map()
  if (fs.existsSync(docsFull)) {
    function walkDocs(dir, prefix = '') {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const relName = prefix ? `${prefix}/${entry.name}` : entry.name
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          walkDocs(full, relName)
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
          existingDocs.set(relName, full)
        }
      }
    }
    walkDocs(docsFull)
  }

  // Write new/updated files
  const sourceSet = new Set()
  for (const sourceFile of sourceFiles) {
    try {
      const relPath = writeImportedDoc(kbRoot, repoName, visibility, branch, trace.commit_sha, sourceFile)
      sourceSet.add(relPath)

      // Check if this is new or updated
      if (existingDocs.has(path.relative(docsFull, path.join(kbRoot, relPath)))) {
        trace.updated.push(relPath)
      } else {
        trace.created.push(relPath)
      }
      appendAudit(kbRoot, { op: 'repo-doc-sync', repo: repoName, path: relPath, action: 'write' })
    } catch (err) {
      trace.errors.push({ type: 'write', path: sourceFile.path, message: err.message })
    }
  }

  // Archive removed docs
  for (const [relName, full] of existingDocs) {
    const relPath = `${docsRoot}/${relName}`
    if (!sourceSet.has(relPath)) {
      try {
        const archivePath = archiveRemovedDoc(kbRoot, repoName, relPath)
        if (archivePath) {
          trace.archived.push(relPath)
          appendAudit(kbRoot, { op: 'repo-doc-sync', repo: repoName, path: relPath, action: 'archive' })
        }
      } catch (err) {
        trace.errors.push({ type: 'archive', path: relPath, message: err.message })
      }
    }
  }

  // Record sync state in the registry so every caller sees it. Previously
  // only the web sync route called markSynced — `kb repo sync` and the MCP
  // sync_repo_markdown tool left last_sync_at/commit/file counts stale.
  try {
    const { getRepo, markSynced } = await import('./registry.mjs')
    if (getRepo(kbRoot, repoName)) {
      markSynced(kbRoot, repoName, {
        commit_sha: trace.commit_sha || '',
        file_count: trace.created.length + trace.updated.length,
      })
    }
  } catch (err) {
    trace.errors.push({ type: 'registry', message: err.message })
  }

  trace.completed_at = new Date().toISOString()
  return trace
}
