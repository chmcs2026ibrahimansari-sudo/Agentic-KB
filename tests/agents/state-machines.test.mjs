// Direct tests for lib/agent-runtime/state-machines.mjs — the module that
// gates every bus / standards / rewrite status change. Previously only
// exercised indirectly through bus transitions.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MACHINES, canTransition, transition } from '../../lib/agent-runtime/state-machines.mjs'

test('every declared transition target is itself a known state', () => {
  for (const [name, machine] of Object.entries(MACHINES)) {
    const states = Object.keys(machine.transitions)
    assert.ok(states.includes(machine.initial), `${name}: initial state missing`)
    for (const [from, targets] of Object.entries(machine.transitions)) {
      for (const to of targets) {
        assert.ok(states.includes(to), `${name}: ${from} -> ${to} targets unknown state`)
      }
    }
  }
})

test('terminal states have no outgoing transitions', () => {
  for (const [name, machine] of Object.entries(MACHINES)) {
    assert.deepEqual(machine.transitions.archived, [], `${name}: archived must be terminal`)
  }
})

test('canTransition allows legal moves and rejects illegal ones', () => {
  assert.equal(canTransition('bus', 'open', 'resolved'), true)
  assert.equal(canTransition('bus', 'resolved', 'open'), false)
  assert.equal(canTransition('standards', 'approved', 'active'), true)
  assert.equal(canTransition('standards', 'active', 'draft'), false)
  assert.equal(canTransition('rewrite', 'approved', 'merged'), true)
  assert.equal(canTransition('rewrite', 'merged', 'draft'), false)
})

test('canTransition throws on unknown machine', () => {
  assert.throws(() => canTransition('nope', 'open', 'resolved'), /Unknown state machine/)
})

test('canTransition rejects prototype-key statuses instead of crashing', () => {
  // Statuses come from file frontmatter: "constructor"/"toString" used to
  // resolve to Object.prototype members and throw a TypeError.
  assert.equal(canTransition('bus', 'constructor', 'archived'), false)
  assert.equal(canTransition('bus', 'toString', 'archived'), false)
  assert.equal(canTransition('bus', 'open', 'constructor'), false)
})

test('canTransition throws cleanly on prototype-key machine names', () => {
  assert.throws(() => canTransition('constructor', 'open', 'resolved'), /Unknown state machine/)
})

test('transition falls back to the initial state when currentState is empty', () => {
  const r = transition('bus', null, 'open', 'tester')
  assert.equal(r.status, 'open')
  assert.equal(r.status_history_entry.from, 'draft')
  assert.equal(r.status_history_entry.to, 'open')
  assert.equal(r.status_history_entry.actor, 'tester')
  assert.ok(!Number.isNaN(Date.parse(r.status_history_entry.at)))
})

test('transition throws Illegal transition (not TypeError) for crafted statuses', () => {
  assert.throws(() => transition('bus', 'constructor', 'archived', 'x'), /Illegal transition/)
})

test('transition throws Unknown state machine for unknown machines', () => {
  assert.throws(() => transition('missing', 'open', 'resolved', 'x'), /Unknown state machine/)
  assert.throws(() => transition('hasOwnProperty', 'open', 'resolved', 'x'), /Unknown state machine/)
})

test('transition defaults actor to unknown', () => {
  const r = transition('rewrite', 'draft', 'submitted')
  assert.equal(r.status_history_entry.actor, 'unknown')
})
