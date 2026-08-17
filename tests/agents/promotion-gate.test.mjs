// Regression: promoteDiscovery must not write a candidate the scorer refused.
// The routing check was a REVIEW/REJECT deny-list, so the fifth decision —
// WORKING_ONLY, the weakest non-reject verdict — fell through to the wiki
// write. A candidate scoring 0.30 was promoted while a stronger one scoring
// 0.50 (REVIEW) was blocked: the gate was inverted for the worst inputs.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import { promoteDiscovery } from '../../lib/agent-runtime/promotion.mjs'
import { DECISIONS } from '../../lib/agent-runtime/promotion-scorer.mjs'

const CONTRACT = { agent_id: 'lead-1', tier: 'lead', domain: 'platform' }

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'promo-gate-'))
  for (const d of ['wiki/system/bus/discovery', 'wiki/system/bus/standards', 'wiki/system/bus/review', 'logs']) {
    fs.mkdirSync(path.join(root, d), { recursive: true })
  }
  return root
}

function writeBusItem(root, id, extraFm = '') {
  fs.writeFileSync(
    path.join(root, `wiki/system/bus/discovery/${id}.md`),
    `---\nid: ${id}\nchannel: discovery\nstatus: open\ntitle: Weak Finding ${id}\n` +
    `from: w1\nconfidence: low\nevidence_count: 0\ncreated_at: ${new Date().toISOString()}\n${extraFm}---\n\nweak body\n`,
  )
}

test('a working-only decision is blocked and routed to review, not written', () => {
  const root = makeFixture()
  writeBusItem(root, 'disc-0001')

  const result = promoteDiscovery(root, {
    channel: 'discovery',
    id: 'disc-0001',
    approver: 'jay',
    contract: CONTRACT,
  })

  assert.equal(result.blocked, true)
  assert.equal(result.decision, DECISIONS.WORKING_ONLY)
  assert.ok(result.reviewPath, 'a review item is published')
  assert.ok(fs.existsSync(path.join(root, result.reviewPath)))
  // Nothing landed in the wiki.
  assert.equal(
    fs.existsSync(path.join(root, 'wiki/system/bus/standards/promoted-disc-0001.md')),
    false,
    'a refused candidate must not be written to the wiki',
  )
})

test('a cleared candidate still promotes', () => {
  const root = makeFixture()
  fs.writeFileSync(
    path.join(root, 'wiki/system/bus/discovery/disc-0002.md'),
    `---\nid: disc-0002\nchannel: discovery\nstatus: open\ntitle: Strong Finding\n` +
    `from: w1\nconfidence: high\nevidence_count: 8\ncreated_at: ${new Date().toISOString()}\n---\n\nstrong body\n`,
  )

  const result = promoteDiscovery(root, {
    channel: 'discovery',
    id: 'disc-0002',
    approver: 'jay',
    contract: CONTRACT,
    explicitApproval: true,
  })

  assert.notEqual(result.blocked, true)
  assert.ok(fs.existsSync(path.join(root, 'wiki/system/bus/standards/promoted-disc-0002.md')))
})
