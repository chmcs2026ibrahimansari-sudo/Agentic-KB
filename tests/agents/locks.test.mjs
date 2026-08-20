// Tests for the per-agent file lock: acquire/release, staleness clearing,
// and the grace window that protects freshly-created (not-yet-written) locks.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import { acquireLock, withLock } from '../../lib/agent-runtime/locks.mjs'

function makeRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'locks-'))
}

function lockFile(root, key) {
  return path.join(root, '.locks', `${key}.lock`)
}

test('acquireLock creates and release removes the lock file', () => {
  const root = makeRoot()
  const lock = acquireLock(root, 'agent-a')
  assert.ok(fs.existsSync(lockFile(root, 'agent-a')))
  const rec = JSON.parse(fs.readFileSync(lockFile(root, 'agent-a'), 'utf8'))
  assert.equal(rec.pid, process.pid)
  lock.release()
  assert.ok(!fs.existsSync(lockFile(root, 'agent-a')))
})

test('withLock runs fn under lock and always releases', () => {
  const root = makeRoot()
  const result = withLock(root, 'agent-b', () => {
    assert.ok(fs.existsSync(lockFile(root, 'agent-b')))
    return 42
  })
  assert.equal(result, 42)
  assert.ok(!fs.existsSync(lockFile(root, 'agent-b')))

  assert.throws(() => withLock(root, 'agent-b', () => { throw new Error('boom') }), /boom/)
  assert.ok(!fs.existsSync(lockFile(root, 'agent-b')))
})

test('lock held by a dead pid is cleared and re-acquired', () => {
  const root = makeRoot()
  fs.mkdirSync(path.join(root, '.locks'), { recursive: true })
  // PID 2^30 is far above any real pid space — process.kill throws ESRCH.
  fs.writeFileSync(lockFile(root, 'agent-c'), JSON.stringify({ pid: 2 ** 30, ts: Date.now(), key: 'agent-c' }))
  const lock = acquireLock(root, 'agent-c', { retries: 2, retryDelayMs: 10 })
  assert.ok(lock)
  lock.release()
})

test('freshly-created unreadable lock is NOT stolen (grace window)', () => {
  const root = makeRoot()
  fs.mkdirSync(path.join(root, '.locks'), { recursive: true })
  // Simulate a holder caught between openSync('wx') and writeSync: the lock
  // file exists but is empty (JSON.parse fails). It must not be cleared.
  fs.writeFileSync(lockFile(root, 'agent-d'), '')
  assert.throws(
    () => acquireLock(root, 'agent-d', { retries: 2, retryDelayMs: 10 }),
    /lock busy/,
  )
  assert.ok(fs.existsSync(lockFile(root, 'agent-d')), 'live lock must survive the failed acquire')
})

test('old unreadable lock IS cleared once past the grace window', () => {
  const root = makeRoot()
  fs.mkdirSync(path.join(root, '.locks'), { recursive: true })
  const file = lockFile(root, 'agent-e')
  fs.writeFileSync(file, 'not json')
  // Age the file well past the grace window (and past maxAgeMs).
  const past = (Date.now() - 10_000) / 1000
  fs.utimesSync(file, past, past)
  const lock = acquireLock(root, 'agent-e', { maxAgeMs: 500, retries: 2, retryDelayMs: 10 })
  assert.ok(lock)
  lock.release()
})

test('release does not remove a lock that was stolen and re-acquired', () => {
  const root = makeRoot()
  const lock = acquireLock(root, 'agent-steal')
  // Simulate: this holder overran maxAgeMs, a waiter stole the lock and
  // re-acquired it (different pid/ts now owns the file).
  fs.writeFileSync(lockFile(root, 'agent-steal'), JSON.stringify({ pid: 2 ** 30, ts: Date.now(), key: 'agent-steal' }))
  lock.release()
  assert.ok(fs.existsSync(lockFile(root, 'agent-steal')), 'release must not delete another holder\'s lock')
  const rec = JSON.parse(fs.readFileSync(lockFile(root, 'agent-steal'), 'utf8'))
  assert.equal(rec.pid, 2 ** 30)
})

test('stale steal leaves no tomb files behind in .locks/', () => {
  const root = makeRoot()
  fs.mkdirSync(path.join(root, '.locks'), { recursive: true })
  fs.writeFileSync(lockFile(root, 'agent-tomb'), JSON.stringify({ pid: 2 ** 30, ts: Date.now() - 120_000, key: 'agent-tomb' }))
  const lock = acquireLock(root, 'agent-tomb', { retries: 2, retryDelayMs: 10 })
  lock.release()
  const leftovers = fs.readdirSync(path.join(root, '.locks'))
  assert.deepEqual(leftovers, [], 'no .stale-* tombs or lock files should remain')
})

test('a live holder is not evicted just because its lock is older than maxAgeMs', () => {
  const root = makeRoot()
  fs.mkdirSync(path.join(root, '.locks'), { recursive: true })
  // This process is unambiguously alive, and the record is far older than
  // maxAgeMs. Age alone used to win, so the lock was stolen and a second
  // holder acquired the same key while the first was still in its critical
  // section.
  const file = lockFile(root, 'agent-long')
  fs.writeFileSync(file, JSON.stringify({ pid: process.pid, ts: Date.now() - 600_000, key: 'agent-long' }))
  assert.throws(
    () => acquireLock(root, 'agent-long', { maxAgeMs: 100, retries: 2, retryDelayMs: 10 }),
    /lock busy/,
  )
  assert.ok(fs.existsSync(file), "a live holder's lock must survive")
  const rec = JSON.parse(fs.readFileSync(file, 'utf8'))
  assert.equal(rec.pid, process.pid, 'the original record must be untouched')
})

test('acquireLock gives up instead of spinning when the lock path is a dangling symlink', () => {
  const root = makeRoot()
  fs.mkdirSync(path.join(root, '.locks'), { recursive: true })
  // openSync('wx') reports EEXIST on a symlink, but readFileSync and statSync
  // both report ENOENT because the target is missing. tryClearStale therefore
  // reports "cleared" on every pass; the retry loop used to `continue` past
  // the deadline check and never terminate.
  fs.symlinkSync(path.join(root, 'no-such-target'), lockFile(root, 'agent-dangle'))
  const started = Date.now()
  assert.throws(
    () => acquireLock(root, 'agent-dangle', { retries: 2, retryDelayMs: 10, waitMs: 200 }),
    /lock busy/,
  )
  assert.ok(Date.now() - started < 5_000, 'must respect the deadline rather than spin')
})
