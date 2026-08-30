#!/usr/bin/env node
/**
 * PROMOTE → page generator (closes PROP-157).
 *
 * The 2-source gate has always been able to decide that a theme deserves a
 * page. Nothing ever turned that decision into one: `compile-2source-gate.mjs
 * --execute` writes candidates.md, appends the compile log, then shells out to
 * `kb compile`, which ingests raw/ docs and never receives the promote list.
 * So the gate printed "promote: 42" every run and the wiki gained nothing,
 * while candidates.md grew past 200 deferred themes with no drain.
 *
 * This script is the drain. For each promoted theme that has no page yet it
 * writes a properly-schema'd page seeded with real evidence pulled from the
 * summaries that promoted it, links it from a MoC so it is not an orphan, and
 * records it in recently-added.md and log.md.
 *
 * Deliberately NOT an LLM call. Every line of a generated page is either
 * fixed scaffolding or a verbatim bullet from a source summary, so the script
 * cannot hallucinate a claim or a citation (Rule 9). The pages are born
 * `reviewed: false` (Rule 12) and `confidence: medium` (Rule 8) because a
 * machine assembled them. They are review-ready drafts, not finished pages —
 * the honest output of a deterministic process.
 *
 * Usage:
 *   node scripts/promote-to-pages.mjs              # plan only, writes nothing
 *   node scripts/promote-to-pages.mjs --execute    # write pages
 *   node scripts/promote-to-pages.mjs --execute --top 5
 *
 * --top caps pages per run (default 3). The cap is the point: a daily trickle
 * of reviewable drafts beats one 42-page dump nobody reads.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildIndex, classify } from './lib/compile-gate-core.mjs'

const REPO = process.env.KB_ROOT
  ? path.resolve(process.env.KB_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const WIKI = path.join(REPO, 'wiki')
const SUMMARIES = path.join(WIKI, 'summaries')
const CANDIDATES = path.join(WIKI, 'candidates.md')
const RECENTLY_ADDED = path.join(WIKI, 'recently-added.md')
const LOG = path.join(WIKI, 'log.md')

const argv = process.argv.slice(2)
const args = new Set(argv)
const isExecute = args.has('--execute')
const TOP = (() => {
  const i = argv.indexOf('--top')
  const n = i >= 0 ? Number(argv[i + 1]) : NaN
  return Number.isFinite(n) && n > 0 ? n : 3
})()

const today = new Date().toISOString().slice(0, 10)

/** Route a bare theme slug to its wiki directory and page type. */
export function routeTheme(theme) {
  if (theme.includes('/')) {
    const [dir] = theme.split('/')
    return { dir, slug: theme.split('/').slice(1).join('/'), type: singular(dir) }
  }
  if (theme.startsWith('pattern-')) return { dir: 'patterns', slug: theme, type: 'pattern' }
  if (theme.startsWith('framework-')) return { dir: 'frameworks', slug: theme, type: 'framework' }
  if (theme.startsWith('recipe-')) return { dir: 'recipes', slug: theme, type: 'recipe' }
  return { dir: 'concepts', slug: theme, type: 'concept' }
}

function singular(dir) {
  return { concepts: 'concept', patterns: 'pattern', frameworks: 'framework', recipes: 'recipe' }[dir] || 'concept'
}

/** Turn a slug into a human title: `mcp-security` -> `MCP Security`. */
export function titleize(slug) {
  const acronyms = new Set(['mcp', 'llm', 'rag', 'api', 'cli', 'ci', 'cd', 'ui', 'ux', 'swe', 'rrf', 'sdk', 'hitl'])
  return slug
    .split('/').pop()
    .split('-')
    .map((w) => (acronyms.has(w.toLowerCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

/** Words a bullet must contain to count as evidence for this theme. */
function themeTerms(theme) {
  return theme.split('/').pop().split('-').filter((w) => w.length > 2)
}

/**
 * Pull verbatim `## Key Points` bullets that mention the theme, plus the
 * summary's own metadata. Verbatim is the whole point: no paraphrase means no
 * drift between the page and the source it cites.
 */
async function gatherEvidence(theme, sourceSlugs) {
  const terms = themeTerms(theme)
  const out = []
  for (const slug of sourceSlugs) {
    let text
    try {
      text = await fs.readFile(path.join(SUMMARIES, `${slug}.md`), 'utf8')
    } catch {
      continue
    }
    const titleMatch = text.match(/^title:\s*["']?(.+?)["']?\s*$/m)
    const urlMatch = text.match(/^source_url:\s*["']?(.+?)["']?\s*$/m)
    const tagsMatch = text.match(/^tags:\s*\[(.+?)\]\s*$/m)

    const keyPointsBlock = text.split(/^## Key Points\s*$/m)[1] || ''
    const nextSection = keyPointsBlock.split(/^## /m)[0] || ''
    const bullets = nextSection
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('- '))
      .map((l) => l.slice(2).trim())

    const hits = bullets.filter((b) => {
      const low = b.toLowerCase()
      return terms.some((t) => low.includes(t.toLowerCase()))
    })

    out.push({
      slug,
      title: titleMatch ? titleMatch[1] : slug,
      url: urlMatch ? urlMatch[1] : '',
      tags: tagsMatch ? tagsMatch[1].split(',').map((s) => s.trim()) : [],
      bullets: hits.slice(0, 4),
      bulletsFound: hits.length,
    })
  }
  return out
}

/** Pick the MoC whose name best matches the pooled tags of the sources. */
const MOC_TAGS = {
  orchestration: ['orchestration', 'multi-agent', 'supervisor', 'parallelization', 'coding-agents'],
  memory: ['memory', 'context-management', 'state-management', 'retrieval', 'rag'],
  'tool-use': ['tool-use', 'tools', 'mcp', 'permissions', 'sandboxed-execution', 'safety', 'security'],
  evaluation: ['evaluation', 'benchmark', 'observability', 'llm-as-judge', 'metrics'],
  automation: ['automation', 'deployment', 'ci', 'pipeline'],
}

export function pickMoc(tags) {
  const low = tags.map((t) => t.toLowerCase())
  let best = null
  let bestScore = 0
  for (const [moc, keys] of Object.entries(MOC_TAGS)) {
    const score = keys.filter((k) => low.some((t) => t.includes(k))).length
    if (score > bestScore) {
      bestScore = score
      best = moc
    }
  }
  return bestScore > 0 ? best : null
}

/** Render a concept/pattern page. Every required section is present, and any
 *  section a machine cannot honestly fill says so rather than being padded. */
function renderPage({ theme, type, title, evidence, moc }) {
  const tags = [...new Set(evidence.flatMap((e) => e.tags))].slice(0, 8)
  const sourceLinks = evidence.map((e) => `  - "[[summaries/${e.slug}]]"`).join('\n')
  const relatedMoc = moc ? `\n  - "[[mocs/${moc}]]"` : ''

  const fm = type === 'pattern'
    ? `---
title: ${title}
type: pattern
category: orchestration
problem: "[UNVERIFIED] Stated by ${evidence.length} sources; needs a one-line problem statement on review."
solution: "[UNVERIFIED] Needs a one-line solution statement on review."
tradeoffs: []
tags: [${tags.join(', ')}]
confidence: medium
sources:
${sourceLinks}
created: ${today}
updated: ${today}
reviewed: false
reviewed_date: ""
---`
    : `---
title: ${title}
type: concept
tags: [${tags.join(', ')}]
confidence: medium
sources:
${sourceLinks}
created: ${today}
updated: ${today}
related:${relatedMoc || ' []'}
status: evolving
reviewed: false
reviewed_date: ""
---`

  const evidenceBlocks = evidence.map((e) => {
    const cite = e.url ? `[[summaries/${e.slug}]] — ${e.url}` : `[[summaries/${e.slug}]]`
    const bullets = e.bullets.length
      ? e.bullets.map((b) => `- ${b}`).join('\n')
      : '- (No bullet in this summary names the theme directly; it was indexed via frontmatter `key_concepts`.)'
    return `### ${e.title}\n\nSource: ${cite}\n\n${bullets}`
  }).join('\n\n')

  return `${fm}

# ${title}

> **Generated draft — not yet reviewed.** Assembled by \`scripts/promote-to-pages.mjs\`
> on ${today} because ${evidence.length} independent summaries cite this theme
> (the 2-source gate, Rule 14). Every bullet below is quoted verbatim from the
> cited summary; nothing here was written or inferred by a model. The prose
> sections are deliberately empty until a human writes them.

## TL;DR

_To be written on review._ ${evidence.length} sources treat "${title}" as a distinct theme; the evidence they supply is collected below.

## What the sources say

${evidenceBlocks}

## Definition

_To be written on review._

## How It Works

_To be written on review._

## When To Use

_To be written on review._

## Risks & Pitfalls

_To be written on review._

## Counter-arguments & Gaps

_To be written on review._ Rule 11 makes this section mandatory, and a generator cannot supply it: knowing what the evidence does **not** show requires reading beyond these ${evidence.length} sources. Until a human fills this in, treat the page as a one-sided compilation — which is exactly what it is.

Open on review:
- Do these ${evidence.length} sources actually describe the same thing, or did they collide on a shared word?
- Is any of them derivative of another (two citations, one origin)?
- What would falsify the claim that this deserves its own page rather than a section on an existing one?

## Related

${moc ? `- [[mocs/${moc}]]` : '- _No MoC matched on tags; needs manual placement._'}

## Sources

${evidence.map((e) => `- [[summaries/${e.slug}]]`).join('\n')}
`
}

/** Add an inbound link so the new page is not born an orphan (Rule 3). */
async function linkFromMoc(moc, dir, slug, title) {
  const file = path.join(WIKI, 'mocs', `${moc}.md`)
  let text
  try {
    text = await fs.readFile(file, 'utf8')
  } catch {
    return false
  }
  const link = `- [[${dir}/${slug}]] — ${title} _(generated draft, unreviewed)_`
  if (text.includes(`[[${dir}/${slug}]]`)) return false

  const heading = '\n## Generated Drafts (unreviewed)\n'
  if (text.includes(heading)) {
    text = text.replace(heading, `${heading}\n${link}`)
  } else {
    text = `${text.trimEnd()}\n${heading}\n> Pages the 2-source gate promoted automatically. Each needs a human pass\n> before its claims can be relied on.\n\n${link}\n`
  }
  await fs.writeFile(file, text)
  return true
}

async function appendRecentlyAdded(created) {
  let text = await fs.readFile(RECENTLY_ADDED, 'utf8')
  const heading = `## ${today} (promote-to-pages)`
  const entries = created
    .map((c) => `- [[${c.dir}/${c.slug}|${c.title}]] — generated draft from ${c.evidence.length} sources (${c.evidence.map((e) => e.slug).join(', ')}). Unreviewed.`)
    .join('\n')
  const block = `\n${heading}\n\n${entries}\n\n---\n`
  const anchor = text.indexOf('\n## ')
  text = anchor >= 0 ? text.slice(0, anchor) + block + text.slice(anchor) : text + block
  await fs.writeFile(RECENTLY_ADDED, text)
}

async function appendLog(created, skipped) {
  const body = `
---

## ${today} — promote-to-pages

Ran the PROMOTE→page generator (PROP-157). Pages created: ${created.length} (cap: ${TOP}).

${created.map((c) => `- \`${c.dir}/${c.slug}.md\` — ${c.evidence.length} sources: ${c.evidence.map((e) => e.slug).join(', ')}${c.moc ? `; linked from [[mocs/${c.moc}]]` : '; **no MoC matched — orphan, needs manual placement**'}`).join('\n') || '- none'}

Eligible but not created this run (cap): ${skipped}. All pages born \`reviewed: false\`, \`confidence: medium\`, with verbatim-only evidence and an explicitly empty Counter-arguments & Gaps section for a human to complete.

`
  await fs.appendFile(LOG, body)
}

async function main() {
  const themes = await buildIndex(SUMMARIES)

  const priorCandidates = new Set()
  try {
    const text = await fs.readFile(CANDIDATES, 'utf8')
    for (const m of text.matchAll(/^- (\S+)\s/gm)) priorCandidates.add(m[1])
  } catch { /* first run */ }

  const existingPages = new Set()
  // Bare stems with the type prefix stripped, so theme `mcp` recognises the
  // existing `frameworks/framework-mcp` as the same subject. Without this the
  // generator happily creates `concepts/mcp` next to `frameworks/framework-mcp`
  // — two pages, one topic, which is the duplication the 2-source gate exists
  // to prevent.
  const existingStems = new Set()
  for (const dir of ['concepts', 'patterns', 'frameworks', 'recipes']) {
    try {
      for (const f of await fs.readdir(path.join(WIKI, dir))) {
        if (!f.endsWith('.md')) continue
        const bare = f.replace(/\.md$/, '')
        existingPages.add(`${dir}/${bare}`)
        existingPages.add(bare)
        existingStems.add(bare.replace(/^(pattern|framework|recipe|eval|synthesis)-/, ''))
      }
    } catch { /* dir may not exist */ }
  }

  const { promote } = classify(themes, priorCandidates, existingPages)

  // Only themes with no page anywhere, and with real summary backing.
  const eligible = []
  const noEvidence = []
  const duplicates = []
  for (const item of promote) {
    const { dir, slug, type } = routeTheme(item.theme)
    if (existingPages.has(`${dir}/${slug}`) || existingPages.has(slug)) continue
    const stem = slug.replace(/^(pattern|framework|recipe|eval|synthesis)-/, '')
    if (existingStems.has(stem)) { duplicates.push(slug); continue }
    try {
      await fs.access(path.join(WIKI, dir, `${slug}.md`))
      continue
    } catch { /* does not exist — good */ }
    // Evidence gate. buildIndex indexes themes from summary *frontmatter*, so
    // a theme can clear the 2-source bar without any source discussing it in
    // prose — two summaries listing the same generic word in `key_concepts` is
    // a collision, not corroboration. The first plan run proposed
    // `concepts/compile-pipeline` off four sources and zero prose bullets.
    // A page with no quotable evidence is worse than no page: it looks
    // researched and is not. Require at least one real bullet.
    const evidence = await gatherEvidence(item.theme, item.sources)
    const bullets = evidence.reduce((n, e) => n + e.bulletsFound, 0)
    // Two sources must *discuss* the theme in prose, not merely tag it. Rule 14
    // counts citations, but a citation from frontmatter alone is not
    // corroboration — the first execute run produced a `state-management` page
    // whose evidence came from one source while the other two contributed
    // "(no bullet names the theme directly)". That is a single-source page
    // wearing a three-source citation list, which is worse than no page.
    const sourcesWithProse = evidence.filter((e) => e.bulletsFound > 0).length
    if (sourcesWithProse < 2) {
      noEvidence.push({ ...item, dir, slug, sourcesWithProse })
      continue
    }
    eligible.push({ ...item, dir, slug, type, title: titleize(slug), evidence, bullets })
  }

  // Strongest evidence first — bullets, then source count. Source count alone
  // ranks frontmatter collisions above genuinely discussed themes.
  eligible.sort((a, b) => b.bullets - a.bullets || b.sources.length - a.sources.length || a.theme.localeCompare(b.theme))

  console.log(`promote-to-pages — ${today}`)
  console.log(`  promoted themes:     ${promote.length}`)
  console.log(`  no page + real evidence: ${eligible.length}`)
  console.log(`  gated (0 prose bullets): ${noEvidence.length}${noEvidence.length ? ` — ${noEvidence.slice(0, 6).map((n) => n.slug).join(', ')}${noEvidence.length > 6 ? ', …' : ''}` : ''}`)
  console.log(`  gated (dup of existing): ${duplicates.length}${duplicates.length ? ` — ${duplicates.slice(0, 6).join(', ')}${duplicates.length > 6 ? ', …' : ''}` : ''}`)
  console.log(`  cap this run:        ${TOP}`)
  console.log(`  mode:                ${isExecute ? 'EXECUTE' : 'PLAN (nothing written)'}\n`)

  const batch = eligible.slice(0, TOP)
  const created = []

  for (const item of batch) {
    const evidence = item.evidence
    const moc = pickMoc(evidence.flatMap((e) => e.tags))
    console.log(`  ${isExecute ? '[write]' : '[plan] '} ${item.dir}/${item.slug}.md`)
    console.log(`          sources: ${item.sources.join(', ')}`)
    console.log(`          evidence bullets: ${item.bullets}${moc ? ` | moc: ${moc}` : ' | moc: NONE (would be an orphan)'}`)

    if (!isExecute) continue

    const page = renderPage({ theme: item.theme, type: item.type, title: item.title, evidence, moc })
    const target = path.join(WIKI, item.dir, `${item.slug}.md`)
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, page, { flag: 'wx' })
    if (moc) await linkFromMoc(moc, item.dir, item.slug, item.title)
    created.push({ ...item, evidence, moc })
  }

  if (isExecute && created.length) {
    await appendRecentlyAdded(created)
    await appendLog(created, eligible.length - created.length)
    console.log(`\n  wrote ${created.length} page(s); ${eligible.length - created.length} still queued for future runs.`)
  } else if (!isExecute) {
    console.log('\n  --execute to write these.')
  } else {
    console.log('\n  nothing to create.')
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
