// Read-only queries over a repo's wiki namespace.
//
// `kb repo show/status/docs/search`, `kb rewrite list` and `kb canonical
// list/show` have always called loadRepoMetadata / listRepoDocs /
// searchRepoDocs / listRepoRewrites / listRepoCanonical / readRepoCanonical
// on the repo runtime, but none of them were ever exported — every one of
// those subcommands died with "rt.<fn> is not a function".
import fs from 'fs'
import path from 'path'
import { parseFrontmatter } from '../agent-runtime/frontmatter.mjs'
import { safeJoin } from '../agent-runtime/safe-path.mjs'
import { repoWikiRoot } from './paths.mjs'
import { loadRegistry } from './registry.mjs'

/**
 * Resolve the on-disk wiki namespace for a repo.
 *
 * Registry `repo_name` and the actual directory under wiki/repos/ have drifted
 * apart in case ("Agentic-KB" vs wiki/repos/agentic-kb, "MissionControl" vs a
 * registry wiki_path of wiki/repos/missioncontrol that does not exist), so fall
 * back to a case-insensitive match against the real directory listing rather
 * than trusting either field. The exact name is validated by repoWikiRoot
 * first, and the fallback name comes from readdir — never from the caller.
 *
 * @returns {string|null} absolute directory path, or null when nothing matches
 */
export function resolveRepoWikiDir(kbRoot, repoName) {
  const abs = path.join(kbRoot, repoWikiRoot(repoName))
  if (fs.existsSync(abs)) return abs

  const parent = path.join(kbRoot, 'wiki', 'repos')
  let entries
  try {
    entries = fs.readdirSync(parent, { withFileTypes: true })
  } catch {
    return null
  }
  const wanted = String(repoName).toLowerCase()
  const hit = entries.find(e => e.isDirectory() && e.name.toLowerCase() === wanted)
  return hit ? path.join(parent, hit.name) : null
}

// Collect *.md / *.mdx under `dir`. isFile() excludes symlinks: readdir does
// not follow them but readFileSync does, so a *.md symlink pointing outside
// the vault would otherwise be listed and read.
function walkMarkdown(dir, out = []) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walkMarkdown(full, out)
    else if (entry.isFile() && /\.mdx?$/.test(entry.name)) out.push(full)
  }
  return out
}

function readMeta(absPath) {
  try {
    return parseFrontmatter(fs.readFileSync(absPath, 'utf8')).data || {}
  } catch {
    return {}
  }
}

function relPosix(from, to) {
  return path.relative(from, to).split(path.sep).join('/')
}

// Deterministic ordering. localeCompare() honours the runtime's default
// locale, so the same listing sorts differently on different machines.
function byString(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
}

/**
 * Registry record for a repo, plus a live doc count from disk.
 * Falls back to a case-insensitive repo_name match (see resolveRepoWikiDir).
 *
 * @returns {object|null}
 */
export function loadRepoMetadata(kbRoot, repoName) {
  const wanted = String(repoName)
  const records = loadRegistry(kbRoot)
  const record =
    records.find(r => r && r.repo_name === wanted) ||
    records.find(r => r && String(r.repo_name).toLowerCase() === wanted.toLowerCase())
  if (!record) return null

  const wikiDir = resolveRepoWikiDir(kbRoot, record.repo_name)
  const docCount = wikiDir ? walkMarkdown(path.join(wikiDir, 'repo-docs')).length : 0
  return { ...record, wiki_dir: wikiDir ? relPosix(kbRoot, wikiDir) : null, docCount }
}

/**
 * Imported docs for a repo, optionally narrowed to a subdirectory.
 *
 * @returns {Array<{path: string, bytes: number}>} paths relative to repo-docs/
 */
export function listRepoDocs(kbRoot, repoName, section = null) {
  const wikiDir = resolveRepoWikiDir(kbRoot, repoName)
  if (!wikiDir) return []
  const docsRoot = path.join(wikiDir, 'repo-docs')

  let base = docsRoot
  if (section) {
    // section is caller input; safeJoin rejects absolute segments, null bytes
    // and anything that resolves outside repo-docs/.
    base = safeJoin(docsRoot, String(section))
  }

  return walkMarkdown(base)
    .map(full => {
      let bytes = 0
      try {
        bytes = fs.statSync(full).size
      } catch { /* raced away between readdir and stat */ }
      return { path: relPosix(docsRoot, full), bytes }
    })
    .sort((a, b) => byString(a.path, b.path))
}

/**
 * Term-frequency search over a repo's imported docs. Mirrors the scoring the
 * MCP search_repo_docs handler uses: one point per query term present.
 *
 * @returns {Array<{path: string, snippet: string, score: number}>}
 */
export function searchRepoDocs(kbRoot, repoName, query, { limit = 20 } = {}) {
  const terms = String(query || '').toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []

  const wikiDir = resolveRepoWikiDir(kbRoot, repoName)
  if (!wikiDir) return []
  const docsRoot = path.join(wikiDir, 'repo-docs')

  const results = []
  for (const full of walkMarkdown(docsRoot)) {
    // Per-file try/catch: one unreadable doc must not abort the whole search.
    let content
    try {
      content = fs.readFileSync(full, 'utf8')
    } catch {
      continue
    }
    const lower = content.toLowerCase()
    let score = 0
    for (const term of terms) if (lower.includes(term)) score++
    if (score === 0) continue

    const hit = lower.indexOf(terms[0])
    const start = hit >= 0 ? Math.max(0, hit - 60) : 0
    results.push({ path: relPosix(docsRoot, full), snippet: content.slice(start, start + 200), score })
  }

  results.sort((a, b) => b.score - a.score || byString(a.path, b.path))
  const n = Number(limit)
  return results.slice(0, Number.isFinite(n) && n > 0 ? Math.floor(n) : 20)
}

/**
 * Rewrite artifacts for a repo, across every rewrite type directory.
 *
 * @returns {Array<{path: string, type: string, project: string, status: string, title: string}>}
 */
export function listRepoRewrites(kbRoot, repoName) {
  const wikiDir = resolveRepoWikiDir(kbRoot, repoName)
  if (!wikiDir) return []
  const rewritesRoot = path.join(wikiDir, 'rewrites')

  return walkMarkdown(rewritesRoot)
    .map(full => {
      const rel = relPosix(rewritesRoot, full)
      const meta = readMeta(full)
      return {
        path: relPosix(kbRoot, full),
        // First path segment is the rewrite type directory (plans, prd, ...).
        type: meta.type || (rel.includes('/') ? rel.split('/')[0] : 'unknown'),
        project: meta.project || meta.repo_name || repoName,
        status: meta.status || 'unknown',
        title: meta.title || path.basename(rel).replace(/\.mdx?$/, ''),
      }
    })
    .sort((a, b) => byString(a.path, b.path))
}

/**
 * Canonical docs for a repo (PRD, TECH_STACK, IMPLEMENTATION_PLAN, ...).
 *
 * @returns {Array<{name: string, title: string, doc_type: string, status: string}>}
 */
export function listRepoCanonical(kbRoot, repoName) {
  const wikiDir = resolveRepoWikiDir(kbRoot, repoName)
  if (!wikiDir) return []
  const canonicalRoot = path.join(wikiDir, 'canonical')

  return walkMarkdown(canonicalRoot)
    .map(full => {
      const name = relPosix(canonicalRoot, full).replace(/\.mdx?$/, '')
      const meta = readMeta(full)
      return {
        name,
        title: meta.title || name,
        doc_type: meta.doc_type || 'canonical',
        status: meta.status || 'unknown',
      }
    })
    .sort((a, b) => byString(a.name, b.name))
}

/**
 * Read one canonical doc. `doc` may be given with or without the .md suffix
 * and is matched case-insensitively against the directory listing, so
 * `kb canonical show <repo> prd` finds PRD.md.
 *
 * @returns {string|null} file contents, or null when absent
 */
export function readRepoCanonical(kbRoot, repoName, doc) {
  const wikiDir = resolveRepoWikiDir(kbRoot, repoName)
  if (!wikiDir) return null
  const canonicalRoot = path.join(wikiDir, 'canonical')

  const wanted = String(doc || '').replace(/\.mdx?$/, '')
  if (!wanted) return null
  // safeJoin rejects traversal before any readdir/read happens.
  safeJoin(canonicalRoot, `${wanted}.md`)

  for (const full of walkMarkdown(canonicalRoot)) {
    const name = relPosix(canonicalRoot, full).replace(/\.mdx?$/, '')
    if (name.toLowerCase() !== wanted.toLowerCase()) continue
    try {
      return fs.readFileSync(full, 'utf8')
    } catch {
      return null
    }
  }
  return null
}
