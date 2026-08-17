// Direct tests for the V2 promotion scorer: provenance hard-gate, weighted
// decision routing, canonical hard gates, and the contradiction pre-check.
// promotion.mjs runs this before every wiki write — a regression here either
// blocks all promotions or lets weak candidates straight into canonical.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import {
  scorePromotion,
  checkContradictions,
  DECISIONS,
} from '../../lib/agent-runtime/promotion-scorer.mjs'

function makeRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'scorer-'))
}

function candidate(overrides = {}) {
  return {
    created_by: 'w1',
    created_at: new Date().toISOString(),
    title: 'A finding',
    body: 'some finding',
    memory_class: 'bus',
    ...overrides,
  }
}

// ─── Provenance hard gate ───────────────────────────────────────────────

test('missing provenance is a hard reject regardless of other signals', () => {
  const root = makeRoot()
  const noAuthor = scorePromotion(root, candidate({ created_by: undefined, agent_id: undefined, evidence_count: 8, confidence: 'high' }), { explicitApproval: true })
  assert.equal(noAuthor.decision, DECISIONS.REJECT)
  assert.match(noAuthor.reasons[0], /provenance/)

  const noDate = scorePromotion(root, candidate({ created_at: undefined }))
  assert.equal(noDate.decision, DECISIONS.REJECT)
})

// ─── Evidence curve ─────────────────────────────────────────────────────

test('evidence score is asymptotic: 0 → 0, 1 → 0.5, 2 → 0.75', () => {
  const root = makeRoot()
  const e0 = scorePromotion(root, candidate({ evidence_count: 0 }))
  const e1 = scorePromotion(root, candidate({ evidence_count: 1 }))
  const e2 = scorePromotion(root, candidate({ evidence_count: 2 }))
  assert.equal(e0.breakdown.evidence, 0)
  assert.ok(e0.reasons.includes('no evidence sources'))
  assert.equal(e1.breakdown.evidence, 0.5)
  assert.equal(e2.breakdown.evidence, 0.75)
})

// ─── Freshness on cited sources ─────────────────────────────────────────

test('cited sources that do not exist score 0 freshness, not 1.0', () => {
  const root = makeRoot()
  // getAgeInDays returns 0 for an unstattable path ("treat as fresh"), so a
  // phantom citation used to bank a perfect 1.00 on 0.20 of the score.
  const phantom = scorePromotion(root, candidate({
    related_sources: ['wiki/concepts/never-written.md'],
  }))
  assert.equal(phantom.breakdown.freshness, 0)
  assert.ok(phantom.reasons.some(r => /do not exist/.test(r)))

  fs.mkdirSync(path.join(root, 'wiki/concepts'), { recursive: true })
  fs.writeFileSync(
    path.join(root, 'wiki/concepts/real.md'),
    `---\nupdated: ${new Date().toISOString()}\n---\n\nbody\n`,
  )
  const real = scorePromotion(root, candidate({ related_sources: ['wiki/concepts/real.md'] }))
  assert.ok(real.breakdown.freshness > 0.9, `expected fresh, got ${real.breakdown.freshness}`)
})

test('the canonical freshness gate fails on a source that is not on disk', () => {
  const root = makeRoot()
  const r = scorePromotion(root, candidate({
    memory_class: 'canonical',
    evidence_count: 8,
    confidence: 'high',
    related_sources: ['wiki/concepts/never-written.md'],
  }), {
    targetPath: 'wiki/concepts/new-page.md',
    explicitApproval: true,
    contract: { agent_id: 'a1', tier: 'lead', governance_policy: { freshness_required_for_canonical: true } },
  })

  assert.notEqual(r.decision, DECISIONS.CANONICAL)
  assert.ok(r.reasons.some(r2 => /not found/.test(r2)), JSON.stringify(r.reasons))
})

// ─── Decision routing ───────────────────────────────────────────────────

test('strong candidate with passing hard gates lands canonical', () => {
  const root = makeRoot()
  const r = scorePromotion(root, candidate({
    memory_class: 'canonical',
    evidence_count: 8,
    confidence: 'high',
  }), { targetPath: 'wiki/concepts/new-page.md', explicitApproval: true })
  assert.equal(r.decision, DECISIONS.CANONICAL)
  assert.ok(r.score >= r.floors.canonical)
  assert.equal(r.breakdown.novelty, 1.0, 'nonexistent target is fully novel')
})

test('canonical-score candidate failing hard gates is routed to review', () => {
  const root = makeRoot()
  // High score but only 1 evidence source → fails min_evidence_for_canonical (2)
  const r = scorePromotion(root, candidate({
    memory_class: 'canonical',
    evidence_count: 1,
    confidence: 'high',
  }), { targetPath: 'wiki/concepts/new-page.md', explicitApproval: true })
  assert.ok(r.score >= r.floors.canonical, `needs canonical-level score, got ${r.score}`)
  assert.equal(r.decision, DECISIONS.REVIEW)
  assert.ok(r.reasons.some(x => /evidence count 1 below canonical minimum/.test(x)))
})

test('mid-range scores route to learned, review, and working-only in order', () => {
  const root = makeRoot()
  const learned = scorePromotion(root, candidate({ evidence_count: 1, confidence: 'medium' }))
  assert.equal(learned.decision, DECISIONS.LEARNED)

  const review = scorePromotion(root, candidate({ evidence_count: 1, confidence: 'low' }))
  assert.equal(review.decision, DECISIONS.REVIEW)

  const working = scorePromotion(root, candidate({ evidence_count: 0, confidence: 'unverified' }))
  assert.equal(working.decision, DECISIONS.WORKING_ONLY)
})

test('contract governance_policy floors override the defaults', () => {
  const root = makeRoot()
  const contract = { governance_policy: { promotion_score_floor: { learned: 0.99, review: 0.98, canonical: 0.995 } } }
  const r = scorePromotion(root, candidate({ evidence_count: 2, confidence: 'high' }), { contract })
  assert.equal(r.floors.learned, 0.99)
  assert.equal(r.decision, DECISIONS.WORKING_ONLY, 'raised floors demote an otherwise-learned candidate')
})

// ─── Contradiction handling ─────────────────────────────────────────────

test('suspected contradiction knocks 0.10 off the effective score', () => {
  const root = makeRoot()
  const clean = scorePromotion(root, candidate({ evidence_count: 2, confidence: 'high' }))
  const sus = scorePromotion(root, candidate({ evidence_count: 2, confidence: 'high' }), { contradictionStatus: 'suspected' })
  assert.ok(Math.abs((clean.score - 0.10) - sus.score) < 1e-9)
  assert.equal(sus.rawScore, clean.rawScore)
  assert.match(sus.contradictionNote, /reduced 0.10/)
})

test('confirmed contradiction blocks canonical and routes to review', () => {
  const root = makeRoot()
  const r = scorePromotion(root, candidate({
    memory_class: 'canonical',
    evidence_count: 8,
    confidence: 'high',
  }), { targetPath: 'wiki/concepts/new-page.md', explicitApproval: true, contradictionStatus: 'confirmed' })
  assert.equal(r.decision, DECISIONS.REVIEW)
  assert.ok(r.reasons.some(x => /confirmed contradiction/.test(x)))
})

// ─── checkContradictions ────────────────────────────────────────────────

test('checkContradictions flags hot.md term overlap as suspected', () => {
  const root = makeRoot()
  fs.mkdirSync(path.join(root, 'wiki'), { recursive: true })
  fs.writeFileSync(path.join(root, 'wiki/hot.md'), 'We always format everywhere with prettier.\n')
  const r = checkContradictions(root, candidate({ title: 'Always format everywhere', body: 'use the formatter' }))
  assert.equal(r.status, 'suspected')
  assert.deepEqual(r.conflictingPages, ['wiki/hot.md'])
})

test('checkContradictions escalates to confirmed on negation + opposing pair', () => {
  const root = makeRoot()
  fs.mkdirSync(path.join(root, 'wiki'), { recursive: true })
  fs.writeFileSync(path.join(root, 'wiki/hot.md'), 'We always format everywhere with prettier.\n')
  const r = checkContradictions(root, candidate({
    title: 'Always format everywhere',
    body: 'Do not run prettier: always was wrong, never run it on generated files.',
  }))
  assert.equal(r.status, 'confirmed')
})

test('a self-contained negation does not escalate to confirmed on its own', () => {
  // _hasStrongConflict used to read the candidate's own body twice, so any
  // prose carrying a negation plus both halves of an opposing pair confirmed
  // itself against a page it merely shared title words with — and 'confirmed'
  // hard-blocks canonical promotion.
  const root = makeRoot()
  fs.mkdirSync(path.join(root, 'wiki'), { recursive: true })
  fs.writeFileSync(path.join(root, 'wiki/hot.md'), 'Notes about formatting everywhere with prettier.\n')
  const r = checkContradictions(root, candidate({
    title: 'Formatting everywhere with prettier',
    body: 'Do not skip this: always run the formatter, never commit unformatted code.',
  }))
  assert.equal(r.status, 'suspected', JSON.stringify(r))
})

test('checkContradictions returns none when nothing overlaps', () => {
  const root = makeRoot()
  const r = checkContradictions(root, candidate({ title: 'Entirely unrelated topic', body: 'benign' }))
  assert.deepEqual(r, { status: 'none', conflictingPages: [] })
})
