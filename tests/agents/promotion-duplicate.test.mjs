// Regression: findDuplicateTitle must report the directory the duplicate was
// actually found in. Previously a title match in standards/ was reported under
// the source channel's directory, pointing duplicateOf at a non-existent file.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import { promoteDiscovery } from '../../lib/agent-runtime/promotion.mjs'

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'promo-dup-'))
  for (const d of ['wiki/system/bus/discovery', 'wiki/system/bus/standards', 'logs']) {
    fs.mkdirSync(path.join(root, d), { recursive: true })
  }
  return root
}

function writeBusItem(root, channel, id, title) {
  fs.writeFileSync(
    path.join(root, `wiki/system/bus/${channel}/${id}.md`),
    `---\nid: ${id}\nchannel: ${channel}\nstatus: open\ntitle: ${title}\ncreated_at: 2026-07-01T00:00:00.000Z\n---\n\nbody\n`,
  )
}

test('duplicate found in standards/ is reported with the standards path', () => {
  const root = makeFixture()
  writeBusItem(root, 'discovery', 'disc-0001', 'Shared Insight')
  writeBusItem(root, 'standards', 'std-0001', 'Shared Insight')

  assert.throws(
    () => promoteDiscovery(root, { channel: 'discovery', id: 'disc-0001', approver: 'jay' }),
    err => {
      assert.match(err.message, /Duplicate title detected/)
      assert.match(err.message, /wiki\/system\/bus\/standards\/std-0001\.md/)
      return true
    },
  )
})

test('duplicate found in the source channel is reported with the channel path', () => {
  const root = makeFixture()
  writeBusItem(root, 'discovery', 'disc-0001', 'Channel Insight')
  writeBusItem(root, 'discovery', 'disc-0002', 'Channel Insight')

  assert.throws(
    () => promoteDiscovery(root, { channel: 'discovery', id: 'disc-0001', approver: 'jay' }),
    err => {
      assert.match(err.message, /wiki\/system\/bus\/discovery\/disc-0002\.md/)
      return true
    },
  )
})
