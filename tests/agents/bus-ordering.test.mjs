
// Ordering of `listBusItems` / `listRepoBusItems`. The comparator used to be
// `String(b.created_at).localeCompare(String(a.created_at))`, which sorted
// items with no `created_at` ("undefined") above every real ISO date and
// deferred to the runtime's default locale. Both are pinned here: a listing
// that silently reorders pushes real items off the end of `slice(0, limit)`.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import { listBusItems, compareBusItemsByCreatedAt } from '../../lib/agent-runtime/bus.mjs'
import { listRepoBusItems } from '../../lib/repo-runtime/bus.mjs'
import { serializeFrontmatter } from '../../lib/agent-runtime/frontmatter.mjs'

function makeRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'bus-ordering-'))
}

// Written directly rather than via publishBusItem: these fixtures need
// malformed and absent `created_at` values, which no publisher will emit.
function writeItem(dir, id, meta) {
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(
    path.join(dir, `${id}.md`),
    serializeFrontmatter({ id, status: 'open', ...meta }, 'body\n')
  )
}

const ids = (items) => items.map((i) => i.meta.id)

test('listBusItems sorts a missing created_at last, not first', () => {
  const root = makeRoot()
  const dir = path.join(root, 'wiki', 'system', 'bus', 'discovery')
  writeItem(dir, 'disc-no-date', { channel: 'discovery' })
  writeItem(dir, 'disc-older', { channel: 'discovery', created_at: '2026-01-01T00:00:00.000Z' })
  writeItem(dir, 'disc-newer', { channel: 'discovery', created_at: '2026-08-01T00:00:00.000Z' })

  assert.deepEqual(ids(listBusItems(root, 'discovery')), ['disc-newer', 'disc-older', 'disc-no-date'])
})

test('a malformed created_at does not consume the limit window', () => {
  // The failure this pins: with "undefined" sorting first, `limit: 1` returned
  // the undated item and hid the genuinely newest one.
  const root = makeRoot()
  const dir = path.join(root, 'wiki', 'system', 'bus', 'escalation')
  writeItem(dir, 'esc-junk', { channel: 'escalation', created_at: 'not-a-date' })
  writeItem(dir, 'esc-real', { channel: 'escalation', created_at: '2026-08-01T00:00:00.000Z' })

  assert.deepEqual(ids(listBusItems(root, 'escalation', { limit: 1 })), ['esc-real'])
})

test('listBusItems orders by instant, not by lexical string', () => {
  // Same moment, two offsets: a string compare calls 06:00-05:00 the older of
  // the two, but they are equal instants and the id must break the tie.
  const root = makeRoot()
  const dir = path.join(root, 'wiki', 'system', 'bus', 'standards')
  writeItem(dir, 'std-b', { channel: 'standards', created_at: '2026-08-01T11:00:00.000Z' })
  writeItem(dir, 'std-a', { channel: 'standards', created_at: '2026-08-01T06:00:00.000-05:00' })

  assert.deepEqual(ids(listBusItems(root, 'standards')), ['std-a', 'std-b'])
})

test('ties are broken on id so the order is total and readdir-independent', () => {
  const at = '2026-08-01T00:00:00.000Z'
  const items = [
    { meta: { id: 'c', created_at: at } },
    { meta: { id: 'a', created_at: at } },
    { meta: { id: 'b', created_at: at } },
  ]
  assert.deepEqual([...items].sort(compareBusItemsByCreatedAt).map((i) => i.meta.id), ['a', 'b', 'c'])
  // Same input in a different starting order must produce the same result.
  assert.deepEqual([...items].reverse().sort(compareBusItemsByCreatedAt).map((i) => i.meta.id), ['a', 'b', 'c'])
})

test('the comparator does not depend on the default locale', () => {
  // localeCompare() on these two strings differs between locales; Date.parse
  // does not. Guard against a regression back to a locale-sensitive compare.
  const older = { meta: { id: 'x', created_at: '2026-01-01T00:00:00.000Z' } }
  const newer = { meta: { id: 'y', created_at: '2026-08-01T00:00:00.000Z' } }
  assert.ok(compareBusItemsByCreatedAt(newer, older) < 0)
  assert.ok(compareBusItemsByCreatedAt(older, newer) > 0)
  assert.equal(compareBusItemsByCreatedAt(older, older), 0)
})

test('listRepoBusItems applies the same ordering as its agent-runtime twin', () => {
  const root = makeRoot()
  const dir = path.join(root, 'wiki', 'repos', 'test-repo', 'bus', 'discovery')
  writeItem(dir, 'rd-no-date', { channel: 'discovery' })
  writeItem(dir, 'rd-older', { channel: 'discovery', created_at: '2026-01-01T00:00:00.000Z' })
  writeItem(dir, 'rd-newer', { channel: 'discovery', created_at: '2026-08-01T00:00:00.000Z' })

  assert.deepEqual(
    ids(listRepoBusItems(root, 'test-repo', 'discovery')),
    ['rd-newer', 'rd-older', 'rd-no-date']
  )
})
