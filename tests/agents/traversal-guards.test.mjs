// Regression tests for path-traversal guards added to bus, promotion,
// task-lifecycle, and repo-runtime path helpers.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import { readBusItem, listBusItems } from '../../lib/agent-runtime/bus.mjs'
import { loadContract, isSafeAgentId } from '../../lib/agent-runtime/contracts.mjs'
import { promoteLearning, mergeRewrite } from '../../lib/agent-runtime/promotion.mjs'
import { workingMemoryPath } from '../../lib/agent-runtime/task-lifecycle.mjs'
import {
  repoWikiRoot,
  repoBusRoot,
  repoRewritesRoot,
  repoAgentMemoryRoot,
} from '../../lib/repo-runtime/paths.mjs'
import {
  readRepoBusItem,
  listRepoBusItems,
} from '../../lib/repo-runtime/bus.mjs'
import { appendRepoProgress, writeRepoTaskLog } from '../../lib/repo-runtime/writeback.mjs'

function makeRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'traversal-'))
}

const CONTRACT = { agent_id: 'w1', tier: 'worker', domain: 'eng' }

// ─── agent bus ──────────────────────────────────────────────────────────

test('readBusItem rejects unknown channel (traversal)', () => {
  assert.throws(() => readBusItem(makeRoot(), '../../personal', 'x'), /Unknown bus channel/)
})

test('readBusItem rejects id with path separators', () => {
  assert.throws(() => readBusItem(makeRoot(), 'discovery', '../../../personal/note'), /Invalid bus item id/)
})

test('listBusItems rejects unknown channel', () => {
  assert.throws(() => listBusItems(makeRoot(), '../personal'), /Unknown bus channel/)
})

test('listBusItems still works for valid empty channel', () => {
  assert.deepEqual(listBusItems(makeRoot(), 'discovery'), [])
})

// ─── promotion targets ──────────────────────────────────────────────────

test('promoteLearning rejects traversal targetPath', () => {
  assert.throws(
    () => promoteLearning(makeRoot(), { channel: 'discovery', id: 'disc-0001', approver: 'jay', targetPath: '../../outside.md' }),
    /invalid targetPath/,
  )
})

test('promoteLearning rejects absolute targetPath', () => {
  assert.throws(
    () => promoteLearning(makeRoot(), { channel: 'discovery', id: 'disc-0001', approver: 'jay', targetPath: '/etc/x.md' }),
    /invalid targetPath/,
  )
})

test('mergeRewrite rejects traversal rewritePath and canonicalPath', () => {
  const root = makeRoot()
  assert.throws(
    () => mergeRewrite(root, { rewritePath: '../../evil.md', canonicalPath: 'wiki/x.md', approver: 'jay' }),
    /invalid rewritePath/,
  )
  assert.throws(
    () => mergeRewrite(root, { rewritePath: 'wiki/r.md', canonicalPath: '../../evil.md', approver: 'jay' }),
    /invalid canonicalPath/,
  )
})

// ─── task ids ───────────────────────────────────────────────────────────

test('workingMemoryPath rejects task ids with separators or dot-dot', () => {
  for (const bad of ['../x', 'a/b', 'a\\b', '..', '']) {
    assert.throws(() => workingMemoryPath(CONTRACT, bad), /Invalid task id/)
  }
})

test('workingMemoryPath accepts normal task ids', () => {
  assert.match(workingMemoryPath(CONTRACT, 'task-2026-07-12-001'), /working-memory\/task-2026-07-12-001\.md$/)
})

test('writeRepoTaskLog rejects traversal task ids', () => {
  assert.throws(
    () => writeRepoTaskLog(makeRoot(), 'test-repo', '../../../evil', 'w1', 'body'),
    /Invalid task id/,
  )
})

// ─── repo path helpers ──────────────────────────────────────────────────

test('repo path helpers reject unsafe repo names', () => {
  for (const bad of ['../other', '/abs', '~home', 'a\\b', '']) {
    assert.throws(() => repoWikiRoot(bad), /invalid repo name/)
  }
})

test('repo path helpers reject unsafe channel/type/tier segments', () => {
  assert.throws(() => repoBusRoot('r', '../x'), /invalid channel/)
  assert.throws(() => repoRewritesRoot('r', '../x'), /invalid rewrite type/)
  assert.throws(() => repoAgentMemoryRoot('r', '../x', 'w1'), /invalid tier/)
  assert.throws(() => repoAgentMemoryRoot('r', 'worker', '../x'), /invalid agent id/)
})

test('repo path helpers accept normal names', () => {
  assert.equal(repoWikiRoot('Agentic-KB'), 'wiki/repos/Agentic-KB')
  assert.equal(repoBusRoot('r', 'discovery'), 'wiki/repos/r/bus/discovery')
})

// ─── repo bus ───────────────────────────────────────────────────────────

test('readRepoBusItem rejects unknown channel and unsafe id', () => {
  assert.throws(() => readRepoBusItem(makeRoot(), 'r', '../../x', 'id'), /Unknown repo bus channel/)
  assert.throws(() => readRepoBusItem(makeRoot(), 'r', 'discovery', '../../x'), /Invalid repo bus item id/)
})

test('listRepoBusItems rejects unknown channel', () => {
  assert.throws(() => listRepoBusItems(makeRoot(), 'r', '../../x'), /Unknown repo bus channel/)
})

// ─── repo writeback ─────────────────────────────────────────────────────

test('appendRepoProgress rejects traversal repo name, works for valid', () => {
  const root = makeRoot()
  assert.throws(() => appendRepoProgress(root, '../../escape', 'entry', 'w1'), /invalid repo name/)
  const rel = appendRepoProgress(root, 'ok-repo', 'first entry', 'w1')
  assert.equal(rel, path.join('wiki', 'repos', 'ok-repo', 'progress.md'))
  assert.ok(fs.readFileSync(path.join(root, rel), 'utf8').includes('first entry'))
})

// ─── contract loading ───────────────────────────────────────────────────

test('loadContract rejects agent ids that escape config/agents/', () => {
  const root = makeRoot()
  // Plant a yaml outside config/agents/ that a traversal id would reach.
  fs.writeFileSync(path.join(root, 'evil.yaml'), 'tier: orchestrator\n')
  fs.mkdirSync(path.join(root, 'config', 'agents'), { recursive: true })
  assert.equal(loadContract(root, '../../evil'), null)
  assert.equal(loadContract(root, '../evil'), null)
  assert.equal(loadContract(root, 'a/b'), null)
  assert.equal(loadContract(root, 'a\\b'), null)
  assert.equal(loadContract(root, '.hidden'), null)
  assert.equal(loadContract(root, ''), null)
  assert.equal(loadContract(root, undefined), null)
})

test('loadContract still loads well-formed agent ids', () => {
  const root = makeRoot()
  const dir = path.join(root, 'config', 'agents')
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'w1.yaml'), [
    'agent_id: w1',
    'tier: worker',
    'domain: eng',
  ].join('\n') + '\n')
  const contract = loadContract(root, 'w1')
  assert.ok(contract)
  assert.equal(contract.agent_id, 'w1')
  assert.equal(isSafeAgentId('architecture-agent'), true)
  assert.equal(isSafeAgentId('../evil'), false)
})
