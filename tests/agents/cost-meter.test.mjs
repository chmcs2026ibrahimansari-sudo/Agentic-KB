// Tests for the API cost meter: model-family pricing and summary rollups.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import { computeCost, recordApiCall, summary, spendForDay } from '../../lib/agent-runtime/cost-meter.mjs'

function makeRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'cost-'))
}

const MTOK = { input_tokens: 1_000_000 }

test('known model ids use their exact pricing', () => {
  assert.equal(computeCost(MTOK, 'claude-sonnet-4-5-20250929'), 3.00)
  assert.equal(computeCost(MTOK, 'claude-opus-4-6'), 15.00)
  assert.equal(computeCost(MTOK, 'claude-haiku-4-5'), 0.80)
})

test('unknown opus/haiku ids fall back to family pricing, not sonnet default', () => {
  // Regression: claude-opus-4-8 previously matched nothing and was priced at
  // the sonnet-level default ($3/mtok) — a 5x undercount against the cap.
  assert.equal(computeCost(MTOK, 'claude-opus-4-8'), 15.00)
  assert.equal(computeCost(MTOK, 'claude-haiku-4-6'), 0.80)
  assert.equal(computeCost(MTOK, 'claude-sonnet-9-9'), 3.00)
  assert.equal(computeCost(MTOK, 'totally-unknown-model'), 3.00)
})

test('summary aggregates today/month/by-model from a single log', () => {
  const root = makeRoot()
  recordApiCall(root, { model: 'claude-opus-4-8', usage: { input_tokens: 1_000_000 } })
  recordApiCall(root, { model: 'claude-sonnet-4-6', usage: { output_tokens: 1_000_000 } })
  // Malformed line must not break aggregation
  fs.appendFileSync(path.join(root, 'logs', 'api-cost.log'), '{"cost_usd": 1}\n')

  const s = summary(root)
  assert.equal(s.total_calls, 3)
  assert.equal(s.today_usd, 30) // 15 opus input + 15 sonnet output
  assert.equal(s.month_usd, 30)
  assert.equal(s.by_model['claude-opus-4-8'], 15)
  assert.equal(s.by_model['claude-sonnet-4-6'], 15)
  assert.equal(s.by_model.unknown, 1) // counted by model, but not by day (no ts)
  assert.equal(spendForDay(root), 30)
})
