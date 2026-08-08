// Direct tests for freshness scoring. Context ranking and canonical-promotion
// gates both consume these numbers — regressions here silently reorder every
// agent's context bundle or let stale sources into canonical pages.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import {
  decayScore,
  getAgeInDays,
  inferClass,
  scoreFreshness,
  isFreshForCanonical,
  freshnessLabel,
  FRESHNESS_PROFILES,
} from '../../lib/agent-runtime/freshness.mjs'

function makeRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'fresh-'))
}

function isoDaysAgo(days) {
  return new Date(Date.now() - days * 86400000).toISOString()
}

function writePage(root, rel, fm = '') {
  const full = path.join(root, rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, `---\n${fm}\n---\nbody\n`)
  return full
}

// ─── decayScore ─────────────────────────────────────────────────────────

test('decayScore: brand-new content scores 1.0, half-life halves the headroom', () => {
  const profile = { halfLifeDays: 60, floor: 0.40 }
  assert.equal(decayScore(0, profile), 1.0)
  assert.equal(decayScore(-5, profile), 1.0)
  // At exactly one half-life: floor + (1-floor)/2
  const atHalfLife = decayScore(60, profile)
  assert.ok(Math.abs(atHalfLife - 0.70) < 1e-9, `expected 0.70, got ${atHalfLife}`)
})

test('decayScore: never drops below the class floor, exempt classes always 1.0', () => {
  const profile = { halfLifeDays: 7, floor: 0.10 }
  assert.ok(decayScore(10000, profile) >= 0.10)
  assert.equal(decayScore(10000, { exempt: true }), 1.0)
  // No profile at all falls back to the default profile, not NaN
  const fallback = decayScore(30, undefined)
  assert.ok(Number.isFinite(fallback) && fallback > 0 && fallback <= 1)
  // A truthy-but-partial profile must also stay finite (missing halfLifeDays
  // previously produced NaN and poisoned every downstream freshness sort).
  const partial = decayScore(30, { floor: 0.3 })
  assert.ok(Number.isFinite(partial) && partial >= 0.3 && partial <= 1)
})

// ─── inferClass ─────────────────────────────────────────────────────────

test('inferClass maps paths to the documented memory classes', () => {
  assert.equal(inferClass('wiki/agents/workers/w1/profile.md'), 'profile')
  assert.equal(inferClass('wiki/agents/workers/w1/hot.md'), 'hot')
  assert.equal(inferClass('wiki/agents/workers/w1/working-memory/task-1.md'), 'working')
  assert.equal(inferClass('wiki/agents/workers/w1/learned/gotchas.md'), 'learned')
  assert.equal(inferClass('wiki/agents/workers/w1/notes.md'), 'learned')
  assert.equal(inferClass('wiki/personal/journal.md'), 'personal')
  assert.equal(inferClass('wiki/system/bus/discovery/disc-0001.md'), 'session')
  assert.equal(inferClass('raw/qa/2026-07-30-question.md'), 'session')
  assert.equal(inferClass('wiki/concepts/tool-use.md'), 'canonical')
  assert.equal(inferClass('random/other.md'), 'session')
})

// ─── getAgeInDays / scoreFreshness ──────────────────────────────────────

test('getAgeInDays prefers frontmatter updated: over mtime', () => {
  const root = makeRoot()
  const full = writePage(root, 'wiki/concepts/a.md', `updated: ${isoDaysAgo(100)}`)
  const age = getAgeInDays(full)
  assert.ok(age > 99 && age < 101, `expected ~100 days, got ${age}`)
})

test('getAgeInDays falls back to mtime when frontmatter has no usable date', () => {
  const root = makeRoot()
  const full = writePage(root, 'wiki/concepts/b.md', 'title: b\nupdated: not-a-date')
  const age = getAgeInDays(full)
  assert.ok(age >= 0 && age < 1, `fresh file via mtime, got ${age}`)
})

test('scoreFreshness: old canonical page is stale, exempt classes skip disk entirely', () => {
  const root = makeRoot()
  writePage(root, 'wiki/concepts/old.md', `updated: ${isoDaysAgo(400)}`)
  const old = scoreFreshness(root, 'wiki/concepts/old.md')
  assert.equal(old.memClass, 'canonical')
  assert.ok(old.score < 0.65, `expected stale-ish score, got ${old.score}`)
  assert.ok(old.score >= FRESHNESS_PROFILES.canonical.floor)

  // hot.md is exempt — never read, always fresh
  const hot = scoreFreshness(root, 'wiki/agents/workers/w1/hot.md')
  assert.deepEqual({ score: hot.score, label: hot.label }, { score: 1.0, label: 'fresh' })
})

// ─── isFreshForCanonical ────────────────────────────────────────────────

test('isFreshForCanonical enforces per-class staleDays', () => {
  const root = makeRoot()
  writePage(root, 'wiki/concepts/fresh.md', `updated: ${isoDaysAgo(30)}`)
  writePage(root, 'wiki/concepts/stale.md', `updated: ${isoDaysAgo(200)}`)
  assert.equal(isFreshForCanonical(root, 'wiki/concepts/fresh.md'), true)
  assert.equal(isFreshForCanonical(root, 'wiki/concepts/stale.md'), false)
  assert.equal(isFreshForCanonical(root, 'wiki/agents/workers/w1/hot.md'), true)
})

// ─── freshnessLabel ─────────────────────────────────────────────────────

test('freshnessLabel thresholds', () => {
  assert.equal(freshnessLabel(0.9), 'fresh')
  assert.equal(freshnessLabel(0.85), 'fresh')
  assert.equal(freshnessLabel(0.7), 'aging')
  assert.equal(freshnessLabel(0.5), 'stale')
  assert.equal(freshnessLabel(0.39), 'expired')
})
