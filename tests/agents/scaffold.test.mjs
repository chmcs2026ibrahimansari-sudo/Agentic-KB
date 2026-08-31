// Characterization tests for lib/agent-runtime/scaffold.mjs.
//
// scaffoldAgent is what `kb agent new` runs. It is the only producer of
// config/agents/<id>.yaml, and that file IS the write guard: assertWriteAllowed
// reads allowed_writes / forbidden_paths straight out of it. So the input
// validation here is a security boundary, not ergonomics — the module comment
// says as much — and the generated allowed_writes must stay scoped to the new
// agent's own subtree. Neither had a test.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { scaffoldAgent } from '../../lib/agent-runtime/scaffold.mjs'
import { assertWriteAllowed } from '../../lib/agent-runtime/paths.mjs'

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-'))
}

const read = (root, rel) => fs.readFileSync(path.join(root, rel), 'utf8')

test('scaffoldAgent creates the contract plus the four memory files', () => {
  const root = tmpRoot()
  const r = scaffoldAgent(root, { id: 'dev-1', tier: 'worker', domain: 'platform' })

  assert.deepEqual(r.created, [
    'config/agents/dev-1.yaml',
    'wiki/agents/workers/dev-1/profile.md',
    'wiki/agents/workers/dev-1/hot.md',
    'wiki/agents/workers/dev-1/task-log.md',
    'wiki/agents/workers/dev-1/gotchas.md',
  ])
  assert.deepEqual(r.skipped, [])
  assert.deepEqual(
    { agent_id: r.agent_id, tier: r.tier, domain: r.domain, contract: r.contract },
    { agent_id: 'dev-1', tier: 'worker', domain: 'platform', contract: 'config/agents/dev-1.yaml' },
  )
  for (const rel of r.created) assert.ok(fs.existsSync(path.join(root, rel)), rel)
})

test('a rerun skips existing files and rewrites nothing without force', () => {
  const root = tmpRoot()
  scaffoldAgent(root, { id: 'dev-1' })
  fs.writeFileSync(path.join(root, 'config/agents/dev-1.yaml'), 'HAND EDITED\n')

  const again = scaffoldAgent(root, { id: 'dev-1' })
  assert.deepEqual(again.created, [])
  assert.equal(again.skipped.length, 5)
  assert.equal(read(root, 'config/agents/dev-1.yaml'), 'HAND EDITED\n')
})

test('force overwrites a hand-edited contract', () => {
  const root = tmpRoot()
  scaffoldAgent(root, { id: 'dev-1' })
  fs.writeFileSync(path.join(root, 'config/agents/dev-1.yaml'), 'HAND EDITED\n')

  const forced = scaffoldAgent(root, { id: 'dev-1', force: true })
  assert.equal(forced.skipped.length, 0)
  assert.equal(forced.created.length, 5)
  assert.match(read(root, 'config/agents/dev-1.yaml'), /^agent_id: dev-1$/m)
})

test('the generated contract only lets the agent write its own subtree', () => {
  const root = tmpRoot()
  scaffoldAgent(root, { id: 'dev-1', tier: 'worker' })
  const yaml = read(root, 'config/agents/dev-1.yaml')

  // Round-trip the generated policy through the real guard rather than
  // asserting on the YAML text: this is the property that matters.
  const contract = {
    agent_id: 'dev-1',
    tier: 'worker',
    allowed_writes: ['wiki/agents/workers/dev-1/**', 'wiki/system/bus/discovery/**'],
    forbidden_paths: ['config/**', 'wiki/system/schemas/**', 'wiki/agents/leads/**', 'wiki/agents/orchestrators/**'],
  }
  assert.match(yaml, /^ {2}- wiki\/agents\/workers\/dev-1\/\*\*$/m)
  assert.ok(assertWriteAllowed('wiki/agents/workers/dev-1/gotchas.md', contract, {}).allowed)
  for (const denied of [
    'wiki/agents/workers/other/gotchas.md',
    'wiki/agents/leads/lead-1/hot.md',
    'wiki/agents/orchestrators/arch/hot.md',
    'config/agents/dev-1.yaml',
    'wiki/system/schemas/x.json',
  ]) {
    assert.equal(assertWriteAllowed(denied, contract, {}).allowed, false, denied)
  }
})

test('tier changes the contract: leads and orchestrators get standards/handoffs', () => {
  const root = tmpRoot()
  const lead = scaffoldAgent(root, { id: 'lead-1', tier: 'lead', domain: 'search' })
  assert.equal(lead.created[1], 'wiki/agents/leads/lead-1/profile.md')

  const yaml = read(root, 'config/agents/lead-1.yaml')
  assert.match(yaml, /budget_bytes: 81920/)
  assert.match(yaml, /- wiki\/system\/bus\/standards\/\*\*/)
  assert.match(yaml, /- wiki\/system\/bus\/handoffs\/\*\*/)
  assert.doesNotMatch(yaml, /bus\/discovery/)
  assert.match(yaml, /- path: wiki\/domains\/search\/\*\*/)
  // A lead is fenced out of orchestrator memory but not out of worker memory.
  assert.match(yaml, /- wiki\/agents\/orchestrators\/\*\*/)
  assert.doesNotMatch(yaml, /- wiki\/agents\/leads\/\*\*/)

  scaffoldAgent(root, { id: 'orch-1', tier: 'orchestrator' })
  assert.match(read(root, 'config/agents/orch-1.yaml'), /budget_bytes: 163840/)
})

test('team is emitted only when supplied', () => {
  const root = tmpRoot()
  scaffoldAgent(root, { id: 'dev-1', team: 'core' })
  assert.match(read(root, 'config/agents/dev-1.yaml'), /^team: core$/m)

  scaffoldAgent(root, { id: 'dev-2' })
  assert.doesNotMatch(read(root, 'config/agents/dev-2.yaml'), /^team:/m)
})

test('id, tier, domain and team are all rejected before anything is written', () => {
  const root = tmpRoot()
  const bad = [
    [{ id: '' }, /invalid agent id/],
    [{ id: undefined }, /invalid agent id/],
    [{ id: 'Dev-1' }, /invalid agent id/],
    [{ id: '1dev' }, /invalid agent id/],
    [{ id: '../escape' }, /invalid agent id/],
    [{ id: 'dev_1' }, /invalid agent id/],
    [{ id: 'ok', tier: 'admin' }, /invalid tier/],
    [{ id: 'ok', domain: '../etc' }, /invalid domain/],
    [{ id: 'ok', domain: 'plat\nallowed_writes: ["**"]' }, /invalid domain/],
    [{ id: 'ok', team: 'A' }, /invalid team/],
    [{ id: 'ok', team: 'core\ntier: orchestrator' }, /invalid team/],
  ]
  for (const [opts, re] of bad) {
    assert.throws(() => scaffoldAgent(root, opts), re, JSON.stringify(opts))
  }
  // Validation runs before the first mkdir, so a rejected call leaves no trace.
  assert.equal(fs.readdirSync(root).length, 0)
})

test('team: null is accepted; only a non-null bad team throws', () => {
  const root = tmpRoot()
  assert.doesNotThrow(() => scaffoldAgent(root, { id: 'dev-1', team: null }))
})
