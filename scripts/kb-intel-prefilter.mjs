#!/usr/bin/env node
/**
 * Pre-filters for the morning-review intelligence queries.
 *
 * Two of those queries have repeatedly produced answers that are wrong in a
 * way the model cannot detect from its own retrieval, because the corrective
 * fact lives in a file the query does not weight:
 *
 *   tensions     re-reports contradictions that were later RESOLVED. log.md is
 *                append-only, so a contradiction flagged in April and closed in
 *                June appears twice, and a linear read sees only the first. On
 *                2026-08-30 this told the run to re-flag `agentmemory`, closed
 *                2026-06-10 with confidence restored to `high`. Acting on it
 *                would have regressed resolved work; only a manual check
 *                stopped it.
 *
 *   connections  proposes syntheses that already exist. Observed three times
 *                (twice before 2026-08-30, once on it). The skill compensates
 *                with a "verify before drafting" instruction — a human guard
 *                around a machine-checkable fact.
 *
 * Both are cheap to check deterministically. This script emits the facts the
 * queries need as context, so the prompts stop relying on the model noticing.
 *
 * Usage:
 *   node scripts/kb-intel-prefilter.mjs resolved     # closed contradictions
 *   node scripts/kb-intel-prefilter.mjs syntheses    # existing synthesis pairs
 *   node scripts/kb-intel-prefilter.mjs all
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = process.env.KB_ROOT
  ? path.resolve(process.env.KB_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const WIKI = path.join(REPO, 'wiki')

/**
 * Scan the wiki for resolution markers. A contradiction is closed when the
 * page carries a RESOLVED block — that is the ground truth, not log.md, which
 * only records that it was once open.
 */
async function resolvedMarkers() {
  const hits = []
  const pattern = /\[(PROVENANCE RESOLVED|RESOLVED|CONTRADICTION RESOLVED)([^\]]*)\]/g

  async function walk(dir) {
    let entries
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) {
        if (e.name === '_private' || e.name === 'node_modules') continue
        await walk(full)
      } else if (e.name.endsWith('.md') && e.name !== 'log.md') {
        const text = await fs.readFile(full, 'utf8')
        for (const m of text.matchAll(pattern)) {
          const rel = path.relative(WIKI, full).replace(/\.md$/, '')
          const line = text.slice(m.index, m.index + 320).split('\n')[0]
          hits.push({ page: rel, marker: m[1] + m[2], excerpt: line })
        }
      }
    }
  }

  await walk(WIKI)
  return hits
}

/** Every existing synthesis and the pages it cites, so a proposed pair can be
 *  checked against what has already been written. */
async function synthesisPairs() {
  const dir = path.join(WIKI, 'syntheses')
  const out = []
  let files
  try {
    files = await fs.readdir(dir)
  } catch {
    return out
  }
  for (const f of files.filter((x) => x.endsWith('.md'))) {
    const text = await fs.readFile(path.join(dir, f), 'utf8')
    const fm = text.match(/^---\n([\s\S]*?)\n---/)
    const title = (text.match(/^title:\s*["']?(.+?)["']?\s*$/m) || [])[1] || f
    const created = (text.match(/^created:\s*(\S+)/m) || [])[1] || ''
    const cited = new Set()
    for (const m of (fm ? fm[1] : '').matchAll(/\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g)) {
      cited.add(m[1].trim())
    }
    out.push({ slug: f.replace(/\.md$/, ''), title, created, cites: [...cited] })
  }
  return out.sort((a, b) => (b.created || '').localeCompare(a.created || ''))
}

const mode = process.argv[2] || 'all'

if (mode === 'resolved' || mode === 'all') {
  const hits = await resolvedMarkers()
  console.log('## Already-resolved contradictions — DO NOT re-flag these\n')
  if (!hits.length) {
    console.log('_(none found)_\n')
  } else {
    console.log('The following pages carry an explicit resolution marker. `wiki/log.md`')
    console.log('is append-only and still contains the original open-contradiction entry')
    console.log('for each; that entry is stale. Treat these as CLOSED:\n')
    for (const h of hits) console.log(`- \`${h.page}\` — ${h.excerpt.slice(0, 200)}`)
    console.log('')
  }
}

if (mode === 'syntheses' || mode === 'all') {
  const pairs = await synthesisPairs()
  console.log('## Syntheses that already exist — do not propose these connections\n')
  console.log(`${pairs.length} synthesis pages. A connection whose two endpoints both appear`)
  console.log('in one row below is already written; propose something else.\n')
  for (const p of pairs) {
    console.log(`- \`${p.slug}\` (${p.created}) — cites: ${p.cites.join(', ') || '(none in frontmatter)'}`)
  }
  console.log('')
}
