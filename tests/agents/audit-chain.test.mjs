// Direct coverage for the hash-chained audit log (lib/agent-runtime/audit.mjs).
// This is the tamper-evidence layer under every runtime operation; until now
// it was only exercised indirectly through closeTask/bus tests.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import { appendAudit, verifyAuditChain, readRecentAudit } from '../../lib/agent-runtime/audit.mjs'

function makeRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'audit-'))
}

function logPath(root) {
  return path.join(root, 'logs', 'audit.log')
}

function readLines(root) {
  return fs.readFileSync(logPath(root), 'utf8').trim().split('\n')
}

test('appendAudit chains entries and verifyAuditChain accepts them', () => {
  const root = makeRoot()
  appendAudit(root, { op: 'a', agent_id: 'w1' })
  appendAudit(root, { op: 'b', agent_id: 'w1' })
  appendAudit(root, { op: 'c', agent_id: 'w2' })

  const lines = readLines(root)
  assert.equal(lines.length, 3)
  const [e1, e2, e3] = lines.map(l => JSON.parse(l))
  assert.equal(e1.prev_hash, '0'.repeat(16))
  assert.equal(e2.prev_hash, e1.entry_hash)
  assert.equal(e3.prev_hash, e2.entry_hash)

  const v = verifyAuditChain(root)
  assert.equal(v.ok, true)
  assert.equal(v.signed, 3)
  assert.equal(v.legacy, 0)
})

test('verifyAuditChain detects a tampered entry body', () => {
  const root = makeRoot()
  appendAudit(root, { op: 'a' })
  appendAudit(root, { op: 'b' })

  const lines = readLines(root)
  const tampered = JSON.parse(lines[0])
  tampered.op = 'evil'
  lines[0] = JSON.stringify(tampered)
  fs.writeFileSync(logPath(root), lines.join('\n') + '\n')

  const v = verifyAuditChain(root)
  assert.equal(v.ok, false)
  assert.equal(v.firstBreakAt, 0)
  assert.equal(v.reason, 'entry_hash mismatch')
})

test('verifyAuditChain detects a deleted middle entry', () => {
  const root = makeRoot()
  appendAudit(root, { op: 'a' })
  appendAudit(root, { op: 'b' })
  appendAudit(root, { op: 'c' })

  const lines = readLines(root)
  lines.splice(1, 1) // drop the middle entry
  fs.writeFileSync(logPath(root), lines.join('\n') + '\n')

  const v = verifyAuditChain(root)
  assert.equal(v.ok, false)
  assert.equal(v.reason, 'prev_hash mismatch')
})

test('legacy unsigned entries before the chain are tolerated; after it, flagged', () => {
  const root = makeRoot()
  fs.mkdirSync(path.join(root, 'logs'), { recursive: true })
  // Two pre-chain legacy lines (no prev_hash/entry_hash)
  fs.writeFileSync(logPath(root), JSON.stringify({ ts: 't0', op: 'legacy-1' }) + '\n' + JSON.stringify({ ts: 't1', op: 'legacy-2' }) + '\n')
  appendAudit(root, { op: 'signed-1' })

  let v = verifyAuditChain(root)
  assert.equal(v.ok, true)
  assert.equal(v.legacy, 2)
  assert.equal(v.signed, 1)

  // An unsigned entry appended AFTER the chain started is a break
  fs.appendFileSync(logPath(root), JSON.stringify({ ts: 't9', op: 'unsigned-late' }) + '\n')
  v = verifyAuditChain(root)
  assert.equal(v.ok, false)
  assert.equal(v.reason, 'unsigned entry after chain start')
})

test('chain survives an entry larger than the 8KB tail-read window', () => {
  const root = makeRoot()
  appendAudit(root, { op: 'big', blob: 'x'.repeat(20000) })
  appendAudit(root, { op: 'after-big' })
  const v = verifyAuditChain(root)
  assert.equal(v.ok, true)
  assert.equal(v.signed, 2)
})

test('readRecentAudit filters by agent_id and op, newest first', () => {
  const root = makeRoot()
  appendAudit(root, { op: 'x', agent_id: 'w1' })
  appendAudit(root, { op: 'y', agent_id: 'w2' })
  appendAudit(root, { op: 'x', agent_id: 'w1' })

  const byAgent = readRecentAudit(root, 50, { agent_id: 'w1' })
  assert.equal(byAgent.length, 2)
  const byOp = readRecentAudit(root, 50, { op: 'y' })
  assert.equal(byOp.length, 1)
  assert.equal(byOp[0].agent_id, 'w2')

  const limited = readRecentAudit(root, 1)
  assert.equal(limited.length, 1)
  assert.equal(limited[0].op, 'x') // newest entry first
})

test('missing log verifies clean and reads empty', () => {
  const root = makeRoot()
  assert.deepEqual(verifyAuditChain(root), { ok: true, scanned: 0, signed: 0, legacy: 0 })
  assert.deepEqual(readRecentAudit(root), [])
})
