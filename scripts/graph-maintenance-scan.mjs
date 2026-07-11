#!/usr/bin/env node
/**
 * graph-maintenance-scan.mjs — read-only living-graph scan for personal Obsidian vault.
 * Writes receipt to briefings/ and .night-shift/state/. No vault writes.
 */
import fs from 'fs'
import path from 'path'
import os from 'os'

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const VAULT_ROOT = process.env.OBSIDIAN_VAULT_ROOT || path.join(os.homedir(), 'Documents', 'Obsidian Vault')
const STATE_PATH = path.join(REPO_ROOT, '.night-shift/state/graph-maintenance-state.json')
const SKIP_DIRS = new Set(['.git', '.obsidian', 'assets', 'scripts', '99 - Templates'])

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function walkMdFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue
      walkMdFiles(full, out)
    } else if (ent.name.endsWith('.md')) {
      out.push(full)
    }
  }
  return out
}

function relVaultPath(abs) {
  return path.relative(VAULT_ROOT, abs).split(path.sep).join('/')
}

function extractWikilinks(content) {
  const links = new Set()
  const re = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g
  let m
  while ((m = re.exec(content)) !== null) {
    links.add(m[1].trim())
  }
  return links
}

function stemVariants(name) {
  const base = name.replace(/\.md$/i, '')
  return new Set([base, base.toLowerCase()])
}

function resolveLinkTarget(link, fileIndex) {
  const norm = link.replace(/\\/g, '/')
  if (fileIndex.byRel.has(norm)) return fileIndex.byRel.get(norm)
  if (fileIndex.byRel.has(norm + '.md')) return fileIndex.byRel.get(norm + '.md')
  const leaf = norm.split('/').pop()
  if (fileIndex.byStem.has(leaf)) return fileIndex.byStem.get(leaf)
  if (fileIndex.byStem.has(leaf.toLowerCase())) return fileIndex.byStem.get(leaf.toLowerCase())
  return null
}

function buildFileIndex(files) {
  const byRel = new Map()
  const byStem = new Map()
  for (const abs of files) {
    const rel = relVaultPath(abs)
    byRel.set(rel, abs)
    const stem = path.basename(rel, '.md')
    if (!byStem.has(stem)) byStem.set(stem, abs)
    const lower = stem.toLowerCase()
    if (!byStem.has(lower)) byStem.set(lower, abs)
  }
  return { byRel, byStem }
}

function scanVault() {
  const files = walkMdFiles(VAULT_ROOT)
  const index = buildFileIndex(files)
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const notes = []

  for (const abs of files) {
    const rel = relVaultPath(abs)
    if (rel.startsWith('00 - Dashboards/')) continue
    const stat = fs.statSync(abs)
    const content = fs.readFileSync(abs, 'utf8')
    const outlinks = [...extractWikilinks(content)]
    notes.push({
      rel,
      abs,
      mtime: stat.mtimeMs,
      ctime: stat.ctimeMs,
      outlinks,
    })
  }

  const inlinkCounts = new Map()
  for (const n of notes) inlinkCounts.set(n.rel, 0)

  for (const n of notes) {
    for (const link of n.outlinks) {
      const target = resolveLinkTarget(link, index)
      if (!target) continue
      const targetRel = relVaultPath(target)
      inlinkCounts.set(targetRel, (inlinkCounts.get(targetRel) || 0) + 1)
    }
  }

  const enriched = notes.map(n => ({
    ...n,
    inlinks: inlinkCounts.get(n.rel) || 0,
    outlinkCount: n.outlinks.length,
  }))

  const orphans = enriched.filter(n => n.inlinks === 0 && n.outlinkCount === 0)
  const deadEnds = enriched.filter(n => n.outlinkCount === 0 && n.inlinks > 0)
  const hubs = enriched.filter(n => n.inlinks > 3).sort((a, b) => b.inlinks - a.inlinks).slice(0, 20)
  const createdThisWeek = enriched.filter(n => n.ctime >= weekAgo).sort((a, b) => b.ctime - a.ctime)
  const modifiedThisWeek = enriched.filter(n => n.mtime >= weekAgo).sort((a, b) => b.mtime - a.mtime)

  const tagCounts = new Map()
  for (const abs of files) {
    const content = fs.readFileSync(abs, 'utf8')
    const fm = content.match(/^---\n([\s\S]*?)\n---/)
    if (!fm) continue
    const tagsLine = fm[1].match(/^tags:\s*(.+)$/m)
    if (!tagsLine) continue
    const raw = tagsLine[1].trim()
    const tags = raw.startsWith('[')
      ? [...raw.matchAll(/["']?([\w-]+)["']?/g)].map(m => m[1]).filter(t => t !== 'tags')
      : raw.split(/[,\s]+/).filter(Boolean)
    for (const t of tags) tagCounts.set(t, (tagCounts.get(t) || 0) + 1)
  }
  const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25)

  return {
    vault_root: VAULT_ROOT,
    scanned_at: new Date().toISOString(),
    notes_scanned: enriched.length,
    created_this_week: createdThisWeek.length,
    modified_this_week: modifiedThisWeek.length,
    orphan_count: orphans.length,
    dead_end_count: deadEnds.length,
    orphans: orphans.map(n => n.rel).slice(0, 50),
    dead_ends: deadEnds.map(n => n.rel).slice(0, 30),
    hubs: hubs.map(n => ({ path: n.rel, inlinks: n.inlinks })),
    created_this_week_paths: createdThisWeek.map(n => n.rel).slice(0, 40),
    modified_this_week_paths: modifiedThisWeek.map(n => n.rel).slice(0, 30),
    top_tags: topTags.map(([tag, count]) => ({ tag, count })),
    link_suggestions: [],
    writes_performed: [],
    writes_deferred: [],
  }
}

function loadState() {
  if (!fs.existsSync(STATE_PATH)) return null
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'))
  } catch {
    return null
  }
}

function writeReceipt(receipt) {
  const date = todayStr()
  const briefingDir = path.join(REPO_ROOT, 'briefings')
  fs.mkdirSync(briefingDir, { recursive: true })
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true })

  const briefingPath = path.join(briefingDir, `graph-maintenance-${date}.md`)
  const md = formatBriefing(receipt)
  fs.writeFileSync(briefingPath, md)

  const state = {
    last_run: receipt.scanned_at,
    last_briefing: path.relative(REPO_ROOT, briefingPath),
    receipt,
    status: 'ok',
  }
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n')
  return { briefingPath, statePath: STATE_PATH }
}

function formatBriefing(r) {
  const lines = [
    `# Graph Maintenance — ${todayStr()}`,
    '',
    '## Vault Pulse',
    `- notes_scanned: ${r.notes_scanned}`,
    `- created_this_week: ${r.created_this_week}`,
    `- modified_this_week: ${r.modified_this_week}`,
    `- orphans: ${r.orphan_count}`,
    `- dead_ends: ${r.dead_end_count}`,
    '',
    '## Top Tags',
    ...r.top_tags.slice(0, 10).map(t => `- \`${t.tag}\` (${t.count})`),
    '',
    '## Orphan Flags (sample)',
    ...(r.orphans.length ? r.orphans.slice(0, 15).map(p => `- [[${p}]]`) : ['- none']),
    '',
    '## Hub Nodes',
    ...(r.hubs.length ? r.hubs.slice(0, 10).map(h => `- [[${h.path}]] (${h.inlinks} backlinks)`) : ['- none']),
    '',
    '## Link Suggestions',
    '- _Run Hermes with [[wiki/prompt-library/graph-maintenance|Graph Maintenance Prompt]] to populate._',
    '',
    '## Writes Performed',
    ...(r.writes_performed.length ? r.writes_performed.map(w => `- ${w}`) : ['- none (scan-only run)']),
    '',
    '## Deferred For Review',
    ...(r.writes_deferred.length ? r.writes_deferred.map(w => `- ${w}`) : ['- none']),
    '',
    `Receipt: \`.night-shift/state/graph-maintenance-state.json\``,
    '',
  ]
  return lines.join('\n')
}

function verifyReceipt() {
  const state = loadState()
  if (!state) {
    console.error('FAIL: no graph-maintenance-state.json')
    process.exit(1)
  }
  const briefingRel = state.last_briefing
  const briefingAbs = path.join(REPO_ROOT, briefingRel)
  if (!fs.existsSync(briefingAbs)) {
    console.error(`FAIL: briefing missing: ${briefingRel}`)
    process.exit(1)
  }
  const r = state.receipt
  if (!r || typeof r.notes_scanned !== 'number') {
    console.error('FAIL: receipt missing notes_scanned')
    process.exit(1)
  }
  console.log('OK: graph maintenance receipt verified')
  console.log(`  last_run: ${state.last_run}`)
  console.log(`  notes_scanned: ${r.notes_scanned}`)
  console.log(`  orphans: ${r.orphan_count}`)
  console.log(`  briefing: ${briefingRel}`)
}

function main() {
  const args = new Set(process.argv.slice(2))
  if (args.has('--verify-receipt')) {
    verifyReceipt()
    return
  }
  if (!fs.existsSync(VAULT_ROOT)) {
    console.error(`Vault not found: ${VAULT_ROOT}`)
    process.exit(1)
  }
  const receipt = scanVault()
  const prev = loadState()
  if (prev?.receipt) {
    receipt.link_suggestions = []
    receipt.writes_performed = []
    receipt.writes_deferred = []
    const unchanged =
      prev.receipt.notes_scanned === receipt.notes_scanned &&
      prev.receipt.orphan_count === receipt.orphan_count &&
      prev.receipt.modified_this_week === receipt.modified_this_week
    if (unchanged) receipt.status = 'no-op'
  }
  if (args.has('--write-receipt') || args.has('--receipt')) {
    const { briefingPath } = writeReceipt(receipt)
    console.log(`Wrote ${path.relative(REPO_ROOT, briefingPath)}`)
    console.log(`Wrote ${path.relative(REPO_ROOT, STATE_PATH)}`)
  } else {
    console.log(JSON.stringify(receipt, null, 2))
  }
}

main()
