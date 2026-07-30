// Direct tests for correction capture: validation, file layout, frontmatter
// integrity, and the list/get filters. Corrections are the raw signal the
// learning loop promotes from — losing or misfiling them silently drops the
// "Jay corrected this" signal.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import {
  captureCorrection,
  listCorrections,
  getCorrection,
  CORRECTION_TYPES,
} from '../../lib/agent-runtime/correction-capture.mjs'

const CONTRACT = { agent_id: 'sofie', tier: 'lead' }

function makeRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'corr-'))
}

test('captureCorrection validates type and required fields', () => {
  const root = makeRoot()
  assert.throws(
    () => captureCorrection(root, CONTRACT, { type: 'vibe-correction', original: 'a', correctedTo: 'b' }),
    /Invalid correction type/
  )
  assert.throws(
    () => captureCorrection(root, CONTRACT, { type: 'tone-correction', original: 'a' }),
    /requires both original and correctedTo/
  )
})

test('captureCorrection writes under wiki/agents/{tier}s/{agent}/corrections/', () => {
  const root = makeRoot()
  const { correctionId, path: rel } = captureCorrection(root, CONTRACT, {
    type: 'tone-correction',
    original: 'too formal',
    correctedTo: 'more direct',
    confidence: 'high',
    sources: ['wiki/personal/style.md'],
  })
  assert.match(rel, /^wiki\/agents\/leads\/sofie\/corrections\/correction-.+\.md$/)
  const raw = fs.readFileSync(path.join(root, rel), 'utf8')
  assert.match(raw, new RegExp(`correction_id: ${correctionId}`))
  assert.match(raw, /type: tone-correction/)
  assert.match(raw, /## Original\n\ntoo formal/)
  assert.match(raw, /## Corrected To\n\nmore direct/)
  assert.match(raw, /- wiki\/personal\/style\.md/)
})

test('durability defaults come from the contract memory_policy', () => {
  const root = makeRoot()
  const contract = { ...CONTRACT, memory_policy: { correction_durability_default: 'learned' } }
  const { path: rel } = captureCorrection(root, contract, {
    type: 'workflow-correction', original: 'a', correctedTo: 'b',
  })
  assert.match(fs.readFileSync(path.join(root, rel), 'utf8'), /durability: learned/)

  // Explicit durability wins over the contract default
  const { path: rel2 } = captureCorrection(root, contract, {
    type: 'workflow-correction', original: 'a', correctedTo: 'b', durability: 'canonical',
  })
  assert.match(fs.readFileSync(path.join(root, rel2), 'utf8'), /durability: canonical/)
})

test('two captures in a row do not collide', () => {
  const root = makeRoot()
  const a = captureCorrection(root, CONTRACT, { type: 'factual-correction', original: 'x', correctedTo: 'y' })
  const b = captureCorrection(root, CONTRACT, { type: 'factual-correction', original: 'x2', correctedTo: 'y2' })
  assert.notEqual(a.correctionId, b.correctionId)
  assert.notEqual(a.path, b.path)
})

test('listCorrections filters by type, durability, and promote candidates', () => {
  const root = makeRoot()
  captureCorrection(root, CONTRACT, { type: 'tone-correction', original: 'a', correctedTo: 'b', durability: 'session' })
  captureCorrection(root, CONTRACT, { type: 'factual-correction', original: 'c', correctedTo: 'd', durability: 'learned', promoteCandidate: true })
  captureCorrection(root, CONTRACT, { type: 'factual-correction', original: 'e', correctedTo: 'f', durability: 'session' })

  assert.equal(listCorrections(root, CONTRACT).length, 3)
  assert.equal(listCorrections(root, CONTRACT, { type: 'factual-correction' }).length, 2)
  assert.equal(listCorrections(root, CONTRACT, { durability: 'learned' }).length, 1)

  const candidates = listCorrections(root, CONTRACT, { promoteCandidatesOnly: true })
  assert.equal(candidates.length, 1)
  assert.equal(candidates[0].type, 'factual-correction')
  assert.equal(candidates[0].promoteCandidate, true)
})

test('listCorrections since filter and empty-dir behavior', () => {
  const root = makeRoot()
  assert.deepEqual(listCorrections(root, CONTRACT), [])
  captureCorrection(root, CONTRACT, { type: 'preference-correction', original: 'a', correctedTo: 'b' })
  assert.equal(listCorrections(root, CONTRACT, { since: Date.now() - 60000 }).length, 1)
  assert.equal(listCorrections(root, CONTRACT, { since: Date.now() + 60000 }).length, 0)
})

test('getCorrection round-trips metadata and returns null for unknown ids', () => {
  const root = makeRoot()
  const { correctionId } = captureCorrection(root, CONTRACT, {
    type: 'architecture-correction', original: 'monolith', correctedTo: 'modular monolith',
    taskId: 'task-42', confidence: 'low',
  })
  const got = getCorrection(root, CONTRACT, correctionId)
  assert.equal(got.meta.correctionId, correctionId)
  assert.equal(got.meta.taskId, 'task-42')
  assert.equal(got.meta.type, 'architecture-correction')
  assert.match(got.content, /modular monolith/)

  assert.equal(getCorrection(root, CONTRACT, 'correction-nope'), null)
})

test('every documented correction type is accepted', () => {
  const root = makeRoot()
  for (const type of CORRECTION_TYPES) {
    const r = captureCorrection(root, CONTRACT, { type, original: 'o', correctedTo: 'c' })
    assert.ok(r.correctionId)
  }
  assert.equal(listCorrections(root, CONTRACT).length, CORRECTION_TYPES.length)
})
