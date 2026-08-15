#!/usr/bin/env node
/**
 * static-lint.mjs
 *
 * Local-only wiki lint that does NOT require ANTHROPIC_API_KEY or PIN.
 * Runs the static checks from lib/wiki-lint.mjs:
 *   - orphans (no inbound links from any other wiki page)
 *   - stale (frontmatter `updated` older than N days, default 30; pages
 *     with no `updated` are never stale)
 *
 * Skips contradiction detection (that's the AI-driven /api/lint route).
 *
 * Output: wiki/system/reports/static-lint-{date}.md
 *
 * Flags:
 *   --stale-days N   override default 30
 *   --apply          write report file
 *   --top N          how many entries to print to stdout (default 20)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseFrontmatter } from '../lib/agent-runtime/frontmatter.mjs'
import { buildInboundLinkMap, isOrphanCandidate, isStalePage, DEFAULT_STALE_AFTER_DAYS } from '../lib/wiki-lint.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// KB_ROOT env override lets tests point the scan + report write at a sandbox
// tree (same convention as candidates-ttl / graph-scan / sofie-watch).
const KB = process.env.KB_ROOT
  ? path.resolve(process.env.KB_ROOT)
  : path.resolve(__dirname, '..')
const WIKI = path.join(KB, 'wiki')

const argv = process.argv.slice(2)
const get = (flag, fallback) => {
  const i = argv.indexOf(flag); return i >= 0 ? argv[i + 1] : fallback
}
const STALE = parseInt(get('--stale-days', String(DEFAULT_STALE_AFTER_DAYS)), 10)
const TOP = parseInt(get('--top', '20'), 10)
const apply = argv.includes('--apply')

// Directories whose contents must never reach the report. The report lands in
// wiki/system/reports/ — a committed path — while wiki/_private/*.md is the
// gitignored PIN plaintext layer. Listing those pages as orphans/stale
// published their filenames (therapy themes, client names) straight into git.
// Dotted dirs (.obsidian, .git) are skipped for the same reason /api/lint
// skips them: they are not wiki content.
const SKIP_DIRS = new Set(['_private'])

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory() && (e.name.startsWith('.') || SKIP_DIRS.has(e.name))) continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) yield* walk(full)
    else if (e.name.endsWith('.md')) yield full
  }
}

const WIKILINK_RE = /\[\[([^\]]+)\]\]/g

const pages = []
for (const f of walk(WIKI)) {
  const rel = path.relative(WIKI, f).replace(/\\/g, '/')
  try {
    const raw = fs.readFileSync(f, 'utf8')
    const { data, content } = parseFrontmatter(raw)
    const links = []
    for (const m of content.matchAll(WIKILINK_RE)) links.push(m[1])
    pages.push({ rel, relPath: rel, data, content, links })
  } catch {}
}

const inbound = buildInboundLinkMap(pages)

const orphans = pages
  .filter(p => isOrphanCandidate(p.rel))
  .filter(p => (inbound.get(p.rel) || []).length === 0)
  .map(p => p.rel)
const stale = pages
  .filter(p => {
    const merged = { ...p.data, relPath: p.rel, staleAfterDays: STALE }
    return isStalePage(merged)
  })
  .map(p => ({ rel: p.rel, updated: String(p.data.updated).slice(0, 10) }))
  .sort((a, b) => a.updated.localeCompare(b.updated))

console.log(`Pages scanned: ${pages.length}`)
console.log(`Orphans:       ${orphans.length}`)
console.log(`Stale (>${STALE}d): ${stale.length}`)

if (orphans.length > 0) {
  console.log(`\n--- top ${Math.min(TOP, orphans.length)} orphans ---`)
  for (const o of orphans.slice(0, TOP)) console.log(`  ${o}`)
}
if (stale.length > 0) {
  console.log(`\n--- top ${Math.min(TOP, stale.length)} stale ---`)
  for (const s of stale.slice(0, TOP)) console.log(`  ${s.updated}  ${s.rel}`)
}

if (!apply) {
  console.log(`\n(report not written; pass --apply to land wiki/system/reports/static-lint-${new Date().toISOString().slice(0, 10)}.md)`)
  process.exit(0)
}

const today = new Date().toISOString().slice(0, 10)
const reportDir = path.join(KB, 'wiki/system/reports')
fs.mkdirSync(reportDir, { recursive: true })
const reportPath = path.join(reportDir, `static-lint-${today}.md`)
const lines = [
  '---',
  `title: Static Wiki Lint — ${today}`,
  'type: report',
  `date: ${today}`,
  `pages_scanned: ${pages.length}`,
  `orphans: ${orphans.length}`,
  `stale_days: ${STALE}`,
  `stale: ${stale.length}`,
  '---',
  '',
  `# Static Wiki Lint — ${today}`,
  '',
  `Pages scanned: ${pages.length}.`,
  `Orphans (no inbound wikilinks): **${orphans.length}**.`,
  `Stale (>${STALE}d unchanged): **${stale.length}**.`,
  '',
  '## Orphans',
  '',
  ...orphans.map(o => `- \`${o}\``),
  '',
  '## Stale pages',
  '',
  ...stale.map(s => `- \`${s.rel}\` (updated ${s.updated})`),
  '',
]
// tmp + rename, same class as the /api/lint report fix (Aug 9).
const reportTmp = reportPath + '.tmp-' + process.pid
fs.writeFileSync(reportTmp, lines.join('\n'))
fs.renameSync(reportTmp, reportPath)
console.log(`\n✓ Wrote ${path.relative(KB, reportPath)}`)
