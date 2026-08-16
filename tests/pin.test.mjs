// scripts/pin.mjs is the only thing standing between wiki/_private PII and a
// public GitHub push, and `pin lock` deletes the plaintext once the .enc lands.
// A silent regression here is unrecoverable data loss, so the round trip,
// the wrong-PIN rejection, and the drift guard all get direct coverage.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const PIN_SCRIPT = fileURLToPath(new URL('../scripts/pin.mjs', import.meta.url))

function makeRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pin-'))
  fs.mkdirSync(path.join(root, 'wiki', '_private'), { recursive: true })
  return root
}

function runPin(root, args, env = {}) {
  return spawnSync(process.execPath, [PIN_SCRIPT, ...args], {
    encoding: 'utf8',
    env: { ...process.env, KB_ROOT: root, AGENTIC_KB_PIN: '', ...env },
  })
}

const privDir = root => path.join(root, 'wiki', '_private')
const encDir = root => path.join(privDir(root), '.enc')

test('lock encrypts, removes plaintext, and unlock restores it byte-for-byte', () => {
  const root = makeRoot()
  const body = '# Stuck on\n\nSensitive: salary talks, "quoted", éàü, 🔒\n'
  fs.writeFileSync(path.join(privDir(root), 'stuck-on.md'), body)

  const lock = runPin(root, ['lock', 'hunter2'])
  assert.equal(lock.status, 0, lock.stderr)
  assert.equal(fs.existsSync(path.join(privDir(root), 'stuck-on.md')), false, 'plaintext must be removed')
  assert.equal(fs.existsSync(path.join(encDir(root), 'stuck-on.md.enc')), true)

  // The blob must not carry the plaintext.
  const blob = fs.readFileSync(path.join(encDir(root), 'stuck-on.md.enc'))
  assert.equal(blob.subarray(0, 4).toString('binary'), 'PIN\x01', 'magic header')
  assert.equal(blob.includes(Buffer.from('salary talks')), false, 'plaintext leaked into the blob')

  const unlock = runPin(root, ['unlock', 'hunter2'])
  assert.equal(unlock.status, 0, unlock.stderr)
  assert.equal(fs.readFileSync(path.join(privDir(root), 'stuck-on.md'), 'utf8'), body)

  fs.rmSync(root, { recursive: true, force: true })
})

test('unlock with the wrong PIN fails and writes no plaintext', () => {
  const root = makeRoot()
  fs.writeFileSync(path.join(privDir(root), 'secret.md'), 'top secret\n')
  assert.equal(runPin(root, ['lock', 'correct-pin']).status, 0)

  const bad = runPin(root, ['unlock', 'wrong-pin'])
  assert.notEqual(bad.status, 0, 'wrong PIN must exit non-zero')
  assert.match(bad.stderr, /decrypt failed/)
  assert.equal(fs.existsSync(path.join(privDir(root), 'secret.md')), false)

  fs.rmSync(root, { recursive: true, force: true })
})

test('read decrypts one file to stdout without materialising plaintext', () => {
  const root = makeRoot()
  fs.writeFileSync(path.join(privDir(root), 'notes.md'), 'line one\nline two\n')
  assert.equal(runPin(root, ['lock', 'hunter2']).status, 0)

  const read = runPin(root, ['read', 'notes', 'hunter2'])
  assert.equal(read.status, 0, read.stderr)
  assert.equal(read.stdout, 'line one\nline two\n')
  assert.equal(fs.existsSync(path.join(privDir(root), 'notes.md')), false, 'read must not write plaintext')

  fs.rmSync(root, { recursive: true, force: true })
})

test('lock --keep retains the plaintext', () => {
  const root = makeRoot()
  fs.writeFileSync(path.join(privDir(root), 'keepme.md'), 'still here\n')
  assert.equal(runPin(root, ['lock', 'hunter2', '--keep']).status, 0)
  assert.equal(fs.readFileSync(path.join(privDir(root), 'keepme.md'), 'utf8'), 'still here\n')
  fs.rmSync(root, { recursive: true, force: true })
})

test('unlock skips plaintext that is newer than its blob unless --force', () => {
  const root = makeRoot()
  const file = path.join(privDir(root), 'drift.md')
  fs.writeFileSync(file, 'v1\n')
  assert.equal(runPin(root, ['lock', 'hunter2', '--keep']).status, 0)

  // Local edit after the lock — unlocking must not clobber it.
  fs.writeFileSync(file, 'v2 local edit\n')
  const future = new Date(Date.now() + 60_000)
  fs.utimesSync(file, future, future)

  const guarded = runPin(root, ['unlock', 'hunter2'])
  assert.equal(guarded.status, 0, guarded.stderr)
  assert.equal(fs.readFileSync(file, 'utf8'), 'v2 local edit\n', 'drift guard must preserve local edits')
  assert.match(guarded.stdout, /skipped/)

  const forced = runPin(root, ['unlock', 'hunter2', '--force'])
  assert.equal(forced.status, 0, forced.stderr)
  assert.equal(fs.readFileSync(file, 'utf8'), 'v1\n', '--force discards the local edit')

  fs.rmSync(root, { recursive: true, force: true })
})

test('a PIN shorter than 4 chars is rejected before any plaintext is deleted', () => {
  const root = makeRoot()
  fs.writeFileSync(path.join(privDir(root), 'short.md'), 'do not lose me\n')
  const r = runPin(root, ['lock', '123'])
  assert.notEqual(r.status, 0)
  assert.equal(fs.readFileSync(path.join(privDir(root), 'short.md'), 'utf8'), 'do not lose me\n')
  fs.rmSync(root, { recursive: true, force: true })
})

test('a corrupted blob is rejected by the auth tag, not silently truncated', () => {
  const root = makeRoot()
  fs.writeFileSync(path.join(privDir(root), 'tamper.md'), 'authentic content\n')
  assert.equal(runPin(root, ['lock', 'hunter2']).status, 0)

  const encPath = path.join(encDir(root), 'tamper.md.enc')
  const blob = fs.readFileSync(encPath)
  blob[blob.length - 1] ^= 0xff // flip a ciphertext bit
  fs.writeFileSync(encPath, blob)

  const r = runPin(root, ['unlock', 'hunter2'])
  assert.notEqual(r.status, 0)
  assert.match(r.stderr, /decrypt failed/)
  fs.rmSync(root, { recursive: true, force: true })
})
