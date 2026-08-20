import path from 'path'

export const DEFAULT_STALE_AFTER_DAYS = 30

const ORPHAN_EXCLUDE_PATTERNS = [
  /^index\.md$/,
  /(?:^|\/)log\.md$/,
  /(?:^|\/)lint-report\.md$/,
  // Generated / append-only operational pages. Same class as log.md above:
  // written by the pipeline, never linked to. A new daily log lands every
  // morning, which permanently ratcheted the orphan count (45 -> 85 between
  // 2026-08-06 and 2026-08-19, a large share of it just these files).
  /^daily-systems\/logs\//,
  /^_meta\/compile-log\.md$/,
  /^candidates\.md$/,
  /^archive\//,
  /^system\/bus\//,
  /^agents\/[^/]+\/[^/]+\/active-task\.md$/,
  /^agents\/[^/]+\/[^/]+\/profile\.md$/,
  /^agents\/[^/]+\/[^/]+\/gotchas\.md$/,
  /^agents\/[^/]+\/[^/]+\/task-log\.md$/,
  /^agents\/[^/]+\/[^/]+\/working-memory\//,
  /^agents\/[^/]+\/[^/]+\/rewrites\//,
  /^repos\/[^/]+\/progress\.md$/,
  /^repos\/[^/]+\/repo-docs\//,
  /^repos\/[^/]+\/rewrites\//,
]

export function normalizeLinkTarget(link) {
  if (!link) return ''

  let target = String(link).trim()
  if (target.startsWith('[[') && target.endsWith(']]')) {
    target = target.slice(2, -2)
  }

  target = target.split('|')[0]
  target = target.split('#')[0]
  target = target.replace(/^\.\//, '').replace(/^\//, '')

  while (target.startsWith('../')) {
    target = target.slice(3)
  }

  target = path.posix.normalize(target)
  target = target.replace(/^\.\//, '').replace(/^\//, '')
  target = target.replace(/^wiki\//, '')
  target = target.replace(/\.(md|mdx)$/i, '')

  return target === '.' ? '' : target
}

function pageKeys(relPath) {
  const normalized = normalizeLinkTarget(relPath)
  const keys = new Set()
  if (!normalized) return keys

  keys.add(normalized)
  const base = path.posix.basename(normalized)
  if (base) keys.add(base)

  if (base === 'index') {
    const parent = path.posix.dirname(normalized)
    if (parent && parent !== '.') keys.add(parent)
  }

  return keys
}

export function buildInboundLinkMap(pages) {
  const inbound = new Map()
  const keyToPaths = new Map()

  for (const page of pages) {
    inbound.set(page.relPath, [])
    for (const key of pageKeys(page.relPath)) {
      if (!keyToPaths.has(key)) keyToPaths.set(key, [])
      keyToPaths.get(key).push(page.relPath)
    }
  }

  for (const page of pages) {
    for (const rawLink of page.links || []) {
      const normalized = normalizeLinkTarget(rawLink)
      if (!normalized) continue

      const matches = new Set(keyToPaths.get(normalized) || [])
      if (matches.size === 0) {
        for (const [key, relPaths] of keyToPaths.entries()) {
          if (normalized.endsWith(`/${key}`) || key.endsWith(`/${normalized}`)) {
            for (const relPath of relPaths) matches.add(relPath)
          }
        }
      }

      for (const relPath of matches) {
        if (relPath === page.relPath) continue
        const refs = inbound.get(relPath)
        if (refs && !refs.includes(page.relPath)) refs.push(page.relPath)
      }
    }
  }

  return inbound
}

export function isOrphanCandidate(relPath) {
  return !ORPHAN_EXCLUDE_PATTERNS.some(pattern => pattern.test(relPath))
}

export function isStalePage(page, now = Date.now()) {
  if (!page?.updated) return false
  if (!isOrphanCandidate(page.relPath) && /^system\/bus\//.test(page.relPath)) return false

  const staleAfterDays = Number(page.staleAfterDays ?? page.reviewCadenceDays ?? DEFAULT_STALE_AFTER_DAYS)
  if (!Number.isFinite(staleAfterDays) || staleAfterDays <= 0) return false

  const updatedAt = new Date(page.updated)
  if (Number.isNaN(updatedAt.getTime())) return false

  const cutoff = now - staleAfterDays * 24 * 60 * 60 * 1000
  return updatedAt.getTime() < cutoff
}

// ---------------------------------------------------------------------------
// Analysis window selection
//
// The AI half of the lint (contradictions + knowledge gaps) can only be shown
// a bounded number of pages per run. Until 2026-08-20 it was hard-coded to
// `pages.slice(0, 40)`, and because collectWikiSummaries walks in directory
// order that meant the SAME ~40 alphabetically-first pages every single day.
// With 761 pages in the vault, 95% of the wiki was never examined — which is
// why every report from 2026-08-06 onward said "0 contradictions, 0 gaps".
//
// Selection is now hot-set + cold-rotation:
//   hot  — pages updated since the previous run. Contradictions are introduced
//          by edits, so recently-touched pages are the highest-yield sample.
//   cold — a rotating window over everything else, advanced by a persisted
//          cursor so the full vault is covered over ceil(total/budget) runs.
// ---------------------------------------------------------------------------

export const DEFAULT_ANALYSIS_BUDGET = 60

export function selectAnalysisPages(pages, options = {}) {
  const {
    budget = DEFAULT_ANALYSIS_BUDGET,
    cursor = 0,
    lastRunAt = null,
    hotShare = 0.5,
  } = options

  // Deterministic ordering so the cursor means the same thing across runs.
  const ordered = [...pages].sort((a, b) => a.relPath.localeCompare(b.relPath))
  const total = ordered.length
  if (total === 0) return { selected: [], nextCursor: 0, hotCount: 0, coldCount: 0, total: 0 }

  const effectiveBudget = Math.max(1, Math.min(budget, total))
  const hotCap = Math.max(0, Math.floor(effectiveBudget * hotShare))

  const lastRunTime = lastRunAt ? new Date(lastRunAt).getTime() : NaN
  const hot = []
  if (Number.isFinite(lastRunTime) && hotCap > 0) {
    for (const page of ordered) {
      if (!page.updated) continue
      const updatedAt = new Date(page.updated).getTime()
      if (Number.isNaN(updatedAt) || updatedAt < lastRunTime) continue
      hot.push(page)
    }
    // Newest first, so a large ingest surfaces the freshest pages.
    hot.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
    hot.length = Math.min(hot.length, hotCap)
  }

  const hotPaths = new Set(hot.map(p => p.relPath))
  const selected = [...hot]

  // Cold rotation: walk forward from the cursor, wrapping, skipping hot pages.
  let index = ((cursor % total) + total) % total
  let scanned = 0
  let coldCount = 0
  while (selected.length < effectiveBudget && scanned < total) {
    const page = ordered[index]
    if (!hotPaths.has(page.relPath)) {
      selected.push(page)
      coldCount++
    }
    index = (index + 1) % total
    scanned++
  }

  return { selected, nextCursor: index, hotCount: hot.length, coldCount, total }
}

// ---------------------------------------------------------------------------
// Open-findings ledger
//
// A rotating window means a contradiction found on day 3 is not re-examined
// until the cursor comes back around. Without persistence it would silently
// vanish from the next morning's report and never get acted on. The ledger
// keeps findings open until a run that actually re-examined every page they
// reference fails to re-report them.
// ---------------------------------------------------------------------------

export function findingKey(finding) {
  if (finding?.pages?.length) {
    return 'contradiction:' + [...finding.pages].map(p => String(p).trim()).sort().join('|')
  }
  return 'gap:' + String(finding?.topic || '').trim().toLowerCase()
}

export function reconcileFindings(openFindings, freshFindings, examinedPaths, now = new Date()) {
  const examined = examinedPaths instanceof Set ? examinedPaths : new Set(examinedPaths || [])
  const stamp = now.toISOString().slice(0, 10)
  const byKey = new Map()

  for (const existing of openFindings || []) {
    byKey.set(existing.key || findingKey(existing), { ...existing })
  }

  for (const fresh of freshFindings || []) {
    const key = findingKey(fresh)
    const prior = byKey.get(key)
    byKey.set(key, {
      ...fresh,
      key,
      firstSeen: prior?.firstSeen || stamp,
      lastSeen: stamp,
    })
  }

  const freshKeys = new Set((freshFindings || []).map(findingKey))
  const resolved = []
  const open = []

  for (const [key, finding] of byKey.entries()) {
    if (freshKeys.has(key)) { open.push(finding); continue }

    // Only a run that re-examined every referenced page can clear a finding.
    // Gaps reference no pages, so they clear on any run that covered the
    // window they were first raised in.
    const refs = finding.pages || []
    const fullyReExamined = refs.length > 0 && refs.every(p => examined.has(p))
    if (fullyReExamined) {
      resolved.push({ ...finding, resolvedOn: stamp })
    } else {
      open.push(finding)
    }
  }

  return { open, resolved }
}
