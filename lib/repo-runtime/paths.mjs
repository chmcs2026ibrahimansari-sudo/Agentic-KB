import { checkUnsafePath } from '../agent-runtime/path-safety.mjs'

// Repo-scoped path helpers.
// All functions return relative paths under the vault root — kbRoot is never needed here.

// Reject path segments that could traverse outside the repo namespace.
// Callers pass client-supplied repo names / channels / types straight into
// template strings, so this is the single chokepoint for wiki/repos/* paths.
function assertSafeSegment(value, kind) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`invalid ${kind}: empty or non-string`)
  }
  // A segment is one path component. A '/' inside it silently added depth,
  // which broke the guards that assume exactly one segment: isImportedDoc
  // matches `^wiki/repos/[^/]+/repo-docs/`, so a repo named "victim/sub"
  // produced wiki/repos/victim/sub/repo-docs/… — a path assertNotImportedDoc
  // no longer recognised, letting writeback overwrite synced docs directly.
  if (value.includes('/')) {
    throw new Error(`invalid ${kind}: path separator in a single segment`)
  }
  const unsafe = checkUnsafePath(value)
  if (unsafe) {
    throw new Error(`invalid ${kind}: ${unsafe}`)
  }
}

export function repoWikiRoot(repoName) {
  assertSafeSegment(repoName, 'repo name')
  return `wiki/repos/${repoName}`
}

export function repoDocsRoot(repoName) {
  return `${repoWikiRoot(repoName)}/repo-docs`
}

export function repoCanonicalRoot(repoName) {
  return `${repoWikiRoot(repoName)}/canonical`
}

export function repoAgentMemoryRoot(repoName, tier, agentId) {
  assertSafeSegment(tier, 'tier')
  assertSafeSegment(agentId, 'agent id')
  return `${repoWikiRoot(repoName)}/agent-memory/${tier}/${agentId}`
}

export function repoBusRoot(repoName, channel) {
  assertSafeSegment(channel, 'channel')
  return `${repoWikiRoot(repoName)}/bus/${channel}`
}

export function repoTasksRoot(repoName) {
  return `${repoWikiRoot(repoName)}/tasks`
}

export function repoRewritesRoot(repoName, type) {
  assertSafeSegment(type, 'rewrite type')
  return `${repoWikiRoot(repoName)}/rewrites/${type}`
}

// Map a source file path to the imported doc path under repo-docs.
// sourcePath comes from a remote GitHub tree response, so treat it as
// untrusted: a traversal segment here would let a compromised remote write
// outside wiki/repos/<repo>/repo-docs/.
export function importedDocPath(repoName, sourcePath) {
  const normalized = String(sourcePath).replace(/\\/g, '/')
  if (
    normalized.length === 0 ||
    normalized.includes('\0') ||
    normalized.startsWith('/') ||
    normalized.split('/').some(seg => seg === '' || seg === '.' || seg === '..')
  ) {
    throw new Error(`invalid source path: ${String(sourcePath).slice(0, 120)}`)
  }
  const ext = normalized.endsWith('.mdx') ? '.mdx' : '.md'
  const base = normalized.replace(/\.(md|mdx)$/, '')
  return `${repoDocsRoot(repoName)}/${base}${ext}`
}

// Check if a relative path is under wiki/repos/*/repo-docs/
export function isImportedDoc(relPath) {
  const normalized = relPath.replace(/\\/g, '/')
  return /^wiki\/repos\/[^/]+\/repo-docs\//.test(normalized)
}

// Check if a relative path is under wiki/repos/ but NOT repo-docs/
export function isOperationalDoc(relPath) {
  const normalized = relPath.replace(/\\/g, '/')
  if (!/^wiki\/repos\/[^/]+\//.test(normalized)) return false
  return !isImportedDoc(normalized)
}

// Throw if someone tries to write to an imported doc path.
export function assertNotImportedDoc(relPath) {
  if (isImportedDoc(relPath)) {
    throw new Error(`Cannot write directly to imported doc: ${relPath}. Use sync workflow instead.`)
  }
}
