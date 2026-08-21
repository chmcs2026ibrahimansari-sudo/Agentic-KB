#!/usr/bin/env node
/**
 * 2-source gate for /foundry-compile.
 *
 * Scans wiki/summaries/ for themes (key_concepts + related: wikilinks).
 * A theme with ≥2 backing summaries is PROMOTED.
 * A theme with 1 summary is DEFERRED to wiki/candidates.md.
 * Themes that were candidates and now have ≥2 summaries are GRADUATED.
 *
 * ## PROMOTE is advisory. Nothing applies it. (documented 2026-08-21)
 *
 * `--execute` writes candidates.md, appends the compile log, then shells out to
 * `kb compile` — which compiles *new raw/ documents* into wiki pages and never
 * receives `decision.promote`. So a theme can clear the 2-source bar and be
 * listed as PROMOTE on every run forever without any page being created or
 * updated, which is exactly what happened: 17 consecutive runs reported
 * "promote: 28-30, graduate: 0" and were read as work that had been applied.
 *
 * Building the generator that turns a promoted theme into a properly schema'd,
 * non-orphan concept/pattern/framework page is real work, not a missing wire —
 * there is no such machinery anywhere in the repo today. Tracked as PROP-157 in
 * wiki/_meta/proposals.md. Until it exists, the plan output and the compile log
 * both label the promote count ADVISORY so it stops being misread.
 *
 * Modes:
 *   --plan      Print the plan; touch nothing.
 *   --execute   Update wiki/candidates.md, append wiki/_meta/compile-log.md,
 *               then shell out to `kb compile`. Pass-through other args.
 *   --force     Allow single-source themes through (logged as bypass).
 *
 * Idempotent: re-running with no new summaries is a no-op.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { buildIndex as buildIndexCore, classify as classifyCore } from './lib/compile-gate-core.mjs'

// KB_ROOT env override lets tests run the gate against a sandbox tree
// (same convention as candidates-ttl.mjs).
const REPO = process.env.KB_ROOT
  ? path.resolve(process.env.KB_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SUMMARIES = path.join(REPO, 'wiki/summaries')
const CANDIDATES = path.join(REPO, 'wiki/candidates.md')
const COMPILE_LOG = path.join(REPO, 'wiki/_meta/compile-log.md')

const args = new Set(process.argv.slice(2))
const isPlan = args.has('--plan') || (!args.has('--execute'))
const isForce = args.has('--force')

const buildIndex = () => buildIndexCore(SUMMARIES)

/** Read prior candidate slugs to detect graduations. */
async function readPriorCandidates() {
  try {
    const text = await fs.readFile(CANDIDATES, 'utf8')
    const out = new Set()
    for (const m of text.matchAll(/^- (\S+)\s/gm)) out.add(m[1])
    return out
  } catch (e) {
    if (e.code === 'ENOENT') return new Set()
    throw e
  }
}

/** Detect themes that already have a wiki page (so promotion is just an update). */
async function listExistingPages() {
  const out = new Set()
  for (const dir of ['concepts', 'patterns', 'frameworks', 'recipes']) {
    const full = path.join(REPO, 'wiki', dir)
    try {
      const files = await fs.readdir(full)
      for (const f of files) if (f.endsWith('.md')) out.add(`${dir}/${f.replace(/\.md$/, '')}`)
    } catch (e) { /* dir may not exist */ }
  }
  return out
}

const classify = (themes, priorCandidates, existingPages) =>
  classifyCore(themes, priorCandidates, existingPages, { force: isForce })

function fmtBlock(label, items, fmtItem) {
  if (items.length === 0) return `  ${label}: 0\n`
  const lines = items.map(fmtItem).map((l) => `    - ${l}`).join('\n')
  return `  ${label}: ${items.length}\n${lines}\n`
}

function printPlan({ promote, defer, graduate }) {
  console.log('Compile plan (2-source gate):')
  // Keep the `PROMOTE: N` token exactly as-is — tests and downstream tooling
  // grep for it. The advisory warning goes on its own line instead.
  if (promote.length) console.log('  ⚠ PROMOTE is ADVISORY — nothing applies it (PROP-157)')
  process.stdout.write(fmtBlock('PROMOTE', promote, (i) => `${i.theme} (sources: ${i.sources.join(', ')})${i.forced ? ' [FORCED]' : ''}${i.hasPage ? ' [update]' : ' [new]'}`))
  process.stdout.write(fmtBlock('DEFER',    defer,    (i) => `${i.theme} (sources: ${i.sources.join(', ')})`))
  process.stdout.write(fmtBlock('GRADUATE', graduate, (i) => `${i.theme} (now: ${i.sources.join(', ')})`))
  if (promote.length) {
    console.log(
      `\n  NOTE: the ${promote.length} PROMOTE themes above are ADVISORY. Nothing applies them.\n` +
      `  --execute writes candidates.md, appends the compile log, then runs \`kb compile\`,\n` +
      `  which ingests new raw/ docs — it never receives this list. No page is created or\n` +
      `  updated from a promote decision. Building that generator is tracked as PROP-157.\n`
    )
  }
}

async function writeCandidates(defer) {
  const today = new Date().toISOString().slice(0, 10)
  const header = `---\ntitle: Compile Candidates\ntype: meta\nupdated: ${today}\n---\n\n# Compile Candidates\n\nSingle-source themes waiting for a second source. Re-run \`/foundry-compile\` after the next ingest to graduate any that now have ≥2 sources.\n\n`
  const lines = defer
    .sort((a, b) => a.theme.localeCompare(b.theme))
    .map((i) => `- ${i.theme}  (1 source: ${i.sources[0]})`)
    .join('\n')
  // tmp+rename: candidates.md is the gate's only memory of what was deferred.
  // A torn in-place write loses it, so every deferred theme re-enters as new
  // and no theme can ever GRADUATE on its next second source.
  const tmp = CANDIDATES + '.tmp-' + process.pid
  await fs.writeFile(tmp, header + lines + '\n')
  await fs.rename(tmp, CANDIDATES)
}

async function appendLog({ promote, defer, graduate }) {
  const ts = new Date().toISOString()
  const summary = `\n## ${ts}\n` +
    `- promote: ${promote.length} (ADVISORY — not applied; see PROP-157)${promote.some((p) => p.forced) ? ` (forced: ${promote.filter((p) => p.forced).length})` : ''}\n` +
    `- defer:    ${defer.length}\n` +
    `- graduate: ${graduate.length}\n` +
    (graduate.length ? `- graduated: ${graduate.map((g) => g.theme).join(', ')}\n` : '')
  await fs.mkdir(path.dirname(COMPILE_LOG), { recursive: true })
  await fs.appendFile(COMPILE_LOG, summary)
}

async function shellOutToCompile() {
  const passThrough = process.argv.slice(2).filter((a) => !['--plan', '--execute', '--force'].includes(a))
  const result = spawnSync('node', ['cli/kb.js', 'compile', ...passThrough], { cwd: REPO, stdio: 'inherit' })
  return result.status ?? 1
}

async function main() {
  const [themes, priorCandidates, existingPages] = await Promise.all([
    buildIndex(),
    readPriorCandidates(),
    listExistingPages(),
  ])
  const decision = classify(themes, priorCandidates, existingPages)
  printPlan(decision)
  if (isPlan) return 0
  await writeCandidates(decision.defer)
  await appendLog(decision)
  return await shellOutToCompile()
}

main().then((code) => process.exit(code)).catch((e) => { console.error(e); process.exit(1) })
