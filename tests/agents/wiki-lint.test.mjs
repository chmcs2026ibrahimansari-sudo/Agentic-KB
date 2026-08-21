import test from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizeLinkTarget,
  buildInboundLinkMap,
  isOrphanCandidate,
  isStalePage,
  selectAnalysisPages,
  reconcileFindings,
  findingKey,
  rankOrphans,
  rankStalePages,
} from '../../lib/wiki-lint.mjs'

test('normalizeLinkTarget strips wiki prefix, alias, anchors, and extension', () => {
  assert.equal(normalizeLinkTarget('[[wiki/action-tracker|Action Tracker]]'), 'action-tracker')
  assert.equal(normalizeLinkTarget('./concepts/agent-failure-modes.md#taxonomy'), 'concepts/agent-failure-modes')
})

test('buildInboundLinkMap counts wiki-prefixed links as inbound links', () => {
  const pages = [
    { relPath: 'index.md', links: ['[[wiki/action-tracker|Action Tracker]]'] },
    { relPath: 'action-tracker.md', links: [] },
  ]

  const inbound = buildInboundLinkMap(pages)
  assert.deepEqual(inbound.get('action-tracker.md'), ['index.md'])
})

test('isOrphanCandidate ignores operational and generated pages', () => {
  assert.equal(isOrphanCandidate('system/bus/discovery/discovery-2026-04-25-001.md'), false)
  assert.equal(isOrphanCandidate('agents/workers/w1/working-memory/task-1.md'), false)
  assert.equal(isOrphanCandidate('agents/workers/w1/profile.md'), false)
  assert.equal(isOrphanCandidate('concepts/agent-failure-modes.md'), true)
})

test('isStalePage respects stale_after_days override', () => {
  const fourHundredDaysAgo = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  assert.equal(isStalePage({ relPath: 'patterns/pattern-a.md', updated: fourHundredDaysAgo }), true)
  assert.equal(
    isStalePage({ relPath: 'patterns/pattern-a.md', updated: fourHundredDaysAgo, staleAfterDays: 730 }),
    false,
  )
})

test('isOrphanCandidate ignores append-only daily logs and generated indexes', () => {
  assert.equal(isOrphanCandidate('daily-systems/logs/2026-08-18.md'), false)
  assert.equal(isOrphanCandidate('_meta/compile-log.md'), false)
  assert.equal(isOrphanCandidate('candidates.md'), false)
  assert.equal(isOrphanCandidate('daily-systems/pattern-morning-review.md'), true)
})

const fakePages = (n, updated) =>
  Array.from({ length: n }, (_, i) => ({
    relPath: `p${String(i).padStart(3, '0')}.md`,
    updated: updated?.(i),
  }))

test('selectAnalysisPages covers the whole vault across a rotation cycle', () => {
  const pages = fakePages(250)
  const seen = new Set()
  let cursor = 0

  // ceil(250 / 60) = 5 runs should touch every page at least once.
  for (let run = 0; run < 5; run++) {
    const result = selectAnalysisPages(pages, { budget: 60, cursor })
    assert.equal(result.selected.length, 60)
    for (const p of result.selected) seen.add(p.relPath)
    cursor = result.nextCursor
  }

  assert.equal(seen.size, 250, 'every page should be examined within one cycle')
})

test('selectAnalysisPages prioritises pages changed since the last run', () => {
  const lastRunAt = '2026-08-19T00:00:00.000Z'
  // p000 and p001 are fresh; everything else predates the last run.
  const pages = fakePages(100, i => (i < 2 ? '2026-08-20' : '2026-01-01'))

  const result = selectAnalysisPages(pages, { budget: 10, cursor: 50, lastRunAt })
  const paths = result.selected.map(p => p.relPath)

  assert.equal(result.hotCount, 2)
  assert.ok(paths.includes('p000.md'))
  assert.ok(paths.includes('p001.md'))
  assert.equal(result.selected.length, 10)
  assert.equal(new Set(paths).size, 10, 'hot pages must not be duplicated by the cold rotation')
})

test('selectAnalysisPages caps the hot set so a bulk ingest cannot starve rotation', () => {
  const lastRunAt = '2026-08-19T00:00:00.000Z'
  const pages = fakePages(100, () => '2026-08-20') // everything is fresh
  const result = selectAnalysisPages(pages, { budget: 20, cursor: 0, lastRunAt })

  assert.equal(result.hotCount, 10, 'hot set capped at half the budget')
  assert.equal(result.coldCount, 10)
})

test('selectAnalysisPages handles a budget larger than the vault', () => {
  const result = selectAnalysisPages(fakePages(3), { budget: 60, cursor: 0 })
  assert.equal(result.selected.length, 3)
})

test('reconcileFindings keeps a finding open until its pages are re-examined', () => {
  const open = [{
    key: findingKey({ pages: ['a.md', 'b.md'] }),
    pages: ['a.md', 'b.md'],
    description: 'A says X, B says Y',
    firstSeen: '2026-08-01',
  }]

  // Run 2 examined neither page — the finding must survive the rotation.
  const rotated = reconcileFindings(open, [], new Set(['z.md']))
  assert.equal(rotated.open.length, 1)
  assert.equal(rotated.resolved.length, 0)
  assert.equal(rotated.open[0].firstSeen, '2026-08-01')

  // Run 3 re-examined both pages and did not re-report it — now it clears.
  const cleared = reconcileFindings(open, [], new Set(['a.md', 'b.md']))
  assert.equal(cleared.open.length, 0)
  assert.equal(cleared.resolved.length, 1)
})

test('reconcileFindings preserves firstSeen when a finding is re-reported', () => {
  const open = [{
    key: findingKey({ pages: ['a.md', 'b.md'] }),
    pages: ['a.md', 'b.md'],
    description: 'old wording',
    firstSeen: '2026-08-01',
  }]
  const fresh = [{ pages: ['b.md', 'a.md'], description: 'new wording' }]

  const result = reconcileFindings(open, fresh, new Set(['a.md', 'b.md']))
  assert.equal(result.open.length, 1, 'page order must not create a duplicate finding')
  assert.equal(result.open[0].firstSeen, '2026-08-01')
  assert.equal(result.open[0].description, 'new wording')
})

test('rankOrphans surfaces substantial pages and drops stubs', () => {
  const orphans = [
    { relPath: 'stub.md', title: 'Stub', wordCount: 40 },
    { relPath: 'big.md', title: 'Big', wordCount: 2000 },
    { relPath: 'mid.md', title: 'Mid', wordCount: 300 },
  ]

  const ranked = rankOrphans(orphans, 10)
  assert.deepEqual(ranked.map(p => p.relPath), ['big.md', 'mid.md'])
})

test('rankStalePages puts depended-on pages first and ignores leaves', () => {
  const now = new Date('2026-08-20').getTime()
  const stale = [
    { relPath: 'leaf.md', updated: '2020-01-01' },   // ancient but nothing links to it
    { relPath: 'hub.md', updated: '2026-05-01' },    // recent-ish but 3 dependents
    { relPath: 'minor.md', updated: '2026-04-01' },  // 1 dependent
  ]
  const inbound = new Map([
    ['leaf.md', []],
    ['hub.md', ['a.md', 'b.md', 'c.md']],
    ['minor.md', ['a.md']],
  ])

  const ranked = rankStalePages(stale, inbound, 10, now)
  assert.deepEqual(ranked.map(x => x.page.relPath), ['hub.md', 'minor.md'])
  assert.equal(ranked[0].inbound, 3)
})

test('rankStalePages breaks inbound ties by age', () => {
  const now = new Date('2026-08-20').getTime()
  const stale = [
    { relPath: 'newer.md', updated: '2026-06-01' },
    { relPath: 'older.md', updated: '2025-01-01' },
  ]
  const inbound = new Map([['newer.md', ['x.md']], ['older.md', ['y.md']]])

  const ranked = rankStalePages(stale, inbound, 10, now)
  assert.deepEqual(ranked.map(x => x.page.relPath), ['older.md', 'newer.md'])
})
