// Regression: a profile/hot file pulled in by an explicit `path:` include rule
// must still sort into its canonical bucket. Path rules produce candidates
// with no `class` and a reason of `policy path …`, which matched none of
// bucketRank's branches and fell through to rank 999 — behind bus
// subscriptions, and first to be dropped under budget pressure.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import { loadAgentContext } from '../../lib/agent-runtime/context-loader.mjs'

function write(root, rel, body) {
  const full = path.join(root, rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, body)
}

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ctx-order-'))
  write(root, 'wiki/agents/leads/lead-1/profile.md', '---\ntitle: Profile\n---\n\nrole\n')
  write(root, 'wiki/agents/leads/lead-1/hot.md', '---\ntitle: Hot\n---\n\nnow\n')
  write(root, 'wiki/system/bus/discovery/disc-0001.md', '---\nid: disc-0001\nstatus: open\n---\n\nfinding\n')
  return root
}

const CONTRACT = {
  agent_id: 'lead-1',
  tier: 'lead',
  domain: 'platform',
  context_policy: {
    // Explicit path rules — deliberately *not* class rules.
    include: [
      { path: 'wiki/agents/leads/lead-1/profile.md', priority: 10 },
      { path: 'wiki/agents/leads/lead-1/hot.md', priority: 20 },
    ],
    subscriptions: { bus: [{ channel: 'discovery', status: 'open' }] },
  },
}

test('path-rule profile and hot rank ahead of bus subscriptions', () => {
  const root = makeFixture()
  const bundle = loadAgentContext(root, CONTRACT, { project: 'p', domain: 'platform', agent: 'lead-1' })
  const order = bundle.files.map(f => f.path)

  const profileIdx = order.indexOf('wiki/agents/leads/lead-1/profile.md')
  const hotIdx = order.indexOf('wiki/agents/leads/lead-1/hot.md')
  const busIdx = order.indexOf('wiki/system/bus/discovery/disc-0001.md')

  assert.ok(profileIdx >= 0, `profile missing from bundle: ${JSON.stringify(order)}`)
  assert.ok(hotIdx >= 0, `hot missing from bundle: ${JSON.stringify(order)}`)
  assert.ok(busIdx >= 0, `bus item missing from bundle: ${JSON.stringify(order)}`)

  assert.ok(profileIdx < hotIdx, 'profile before hot')
  assert.ok(hotIdx < busIdx, 'hot before bus subscriptions')
})
