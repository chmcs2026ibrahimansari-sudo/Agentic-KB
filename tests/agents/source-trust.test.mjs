// Direct tests for source-trust scoring. Trust scores weight context ranking
// and promotion evidence quality; the frontmatter cache must also invalidate
// when a file changes on disk or agents keep trusting stale metadata.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import {
  scoreTrust,
  trustLabel,
  resolveConfidence,
  getContractWeights,
  DEFAULT_CLASS_WEIGHTS,
  CONFIDENCE_MULTIPLIERS,
} from '../../lib/agent-runtime/source-trust.mjs'

function makeRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'trust-'))
}

function writePage(root, rel, fm = '') {
  const full = path.join(root, rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, `---\n${fm}\n---\nbody\n`)
  return full
}

test('scoreTrust: class weight x confidence multiplier', () => {
  const root = makeRoot()
  writePage(root, 'wiki/concepts/a.md', 'confidence: high')
  const r = scoreTrust(root, 'wiki/concepts/a.md')
  assert.equal(r.memClass, 'canonical')
  assert.ok(Math.abs(r.score - DEFAULT_CLASS_WEIGHTS.canonical * CONFIDENCE_MULTIPLIERS.high) < 1e-9)
})

test('scoreTrust: missing confidence field falls to the unverified multiplier', () => {
  const root = makeRoot()
  writePage(root, 'wiki/concepts/b.md', 'title: b')
  const r = scoreTrust(root, 'wiki/concepts/b.md')
  assert.equal(r.confidenceMultiplier, CONFIDENCE_MULTIPLIERS.unverified)
})

test('scoreTrust: verified bonus applies and total is capped at 1.0', () => {
  const root = makeRoot()
  writePage(root, 'wiki/agents/workers/w1/profile.md', 'confidence: high\nverified: true')
  const r = scoreTrust(root, 'wiki/agents/workers/w1/profile.md')
  assert.equal(r.verified, true)
  // profile weight 1.0 * high 1.0 * bonus 1.10 → clamped
  assert.equal(r.score, 1.0)
})

test('scoreTrust: missing file scores as unverified, not a throw', () => {
  const root = makeRoot()
  const r = scoreTrust(root, 'wiki/concepts/does-not-exist.md')
  assert.equal(r.confidenceMultiplier, CONFIDENCE_MULTIPLIERS.unverified)
  assert.ok(r.score > 0)
})

test('scoreTrust: contract weight override wins over defaults', () => {
  const root = makeRoot()
  writePage(root, 'wiki/concepts/c.md', 'confidence: high')
  const r = scoreTrust(root, 'wiki/concepts/c.md', { contractWeights: { canonical: 0.5, unknown: 0.1 } })
  assert.ok(Math.abs(r.classWeight - 0.5) < 1e-9)
})

test('frontmatter cache invalidates when the file changes on disk', () => {
  const root = makeRoot()
  const full = writePage(root, 'wiki/concepts/d.md', 'confidence: low')
  const before = scoreTrust(root, 'wiki/concepts/d.md')
  assert.equal(before.confidenceMultiplier, CONFIDENCE_MULTIPLIERS.low)

  fs.writeFileSync(full, '---\nconfidence: high\n---\nbody\n')
  // Force a distinct mtime even on coarse-grained filesystems
  const future = new Date(Date.now() + 5000)
  fs.utimesSync(full, future, future)

  const after = scoreTrust(root, 'wiki/concepts/d.md')
  assert.equal(after.confidenceMultiplier, CONFIDENCE_MULTIPLIERS.high)
})

test('trustLabel thresholds', () => {
  assert.equal(trustLabel(0.9), 'trusted')
  assert.equal(trustLabel(0.7), 'reliable')
  assert.equal(trustLabel(0.5), 'uncertain')
  assert.equal(trustLabel(0.2), 'unverified')
})

test('resolveConfidence: numeric passthrough clamps, strings map, contract overrides', () => {
  assert.equal(resolveConfidence(0.42), 0.42)
  assert.equal(resolveConfidence(7), 1.0)
  assert.equal(resolveConfidence(-1), 0)
  assert.equal(resolveConfidence('high'), 1.0)
  assert.equal(resolveConfidence('HIGH'), 1.0)
  assert.equal(resolveConfidence(undefined), 0.30)
  assert.equal(resolveConfidence('nonsense'), 0.30)
  const contract = { governance_policy: { confidence_scores: { high: 0.9, unverified: 0.2 } } }
  assert.equal(resolveConfidence('high', contract), 0.9)
  assert.equal(resolveConfidence('mystery', contract), 0.2)
})

test('getContractWeights falls back to defaults when policy is absent', () => {
  assert.equal(getContractWeights(null), DEFAULT_CLASS_WEIGHTS)
  const custom = { governance_policy: { source_trust_weights: { canonical: 0.7 } } }
  assert.equal(getContractWeights(custom).canonical, 0.7)
})
