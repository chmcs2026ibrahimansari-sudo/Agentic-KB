// End-to-end coverage for `kb bus list|publish|transition`.
//
// cli/kb.js derives its KB root from its own location, so the harness builds a
// throwaway root containing a copy of the CLI and a symlink to lib/, and runs
// the real script against fixture data.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
import { execFileSync } from 'node:child_process'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

function makeCliFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-cli-'))
  fs.mkdirSync(path.join(root, 'cli'), { recursive: true })
  fs.mkdirSync(path.join(root, 'wiki/repos/demo/bus/discovery'), { recursive: true })
  fs.copyFileSync(path.join(REPO_ROOT, 'cli/kb.js'), path.join(root, 'cli/kb.js'))
  fs.symlinkSync(path.join(REPO_ROOT, 'lib'), path.join(root, 'lib'), 'dir')
  return root
}

function kb(root, ...args) {
  return execFileSync(process.execPath, [path.join(root, 'cli/kb.js'), ...args], {
    encoding: 'utf8',
    // Keep the CLI off the network and out of the developer's real .env.
    env: { ...process.env, KB_API_URL: 'http://127.0.0.1:1', PRIVATE_PIN: '' },
  })
}

test('kb bus publish reports the allocated id, not [object Object]', () => {
  const root = makeCliFixture()
  const out = kb(root, 'bus', 'publish', 'demo', 'discovery', '--from', 'agent-a', '--body', 'first finding')
  assert.match(out, /ID: discovery-\d{4}-\d{2}-\d{2}-\d{3}/)
  assert.doesNotMatch(out, /\[object Object\]/)
})

test('kb bus list prints the id, status and author of each item', () => {
  const root = makeCliFixture()
  kb(root, 'bus', 'publish', 'demo', 'discovery', '--from', 'agent-a', '--body', 'first finding')
  const out = kb(root, 'bus', 'list', 'demo', 'discovery')
  assert.doesNotMatch(out, /undefined/)
  assert.match(out, /discovery-\d{4}-\d{2}-\d{2}-\d{3} \[open\] from=agent-a/)
  assert.match(out, /first finding/)
})

test('kb bus transition records the acting identity in status_history', () => {
  const root = makeCliFixture()
  const published = kb(root, 'bus', 'publish', 'demo', 'discovery', '--from', 'agent-a', '--body', 'needs review')
  const id = published.match(/ID: (\S+)/)[1]

  kb(root, 'bus', 'transition', 'demo', 'discovery', id, 'acknowledged', '--actor', 'lead-1')

  const file = path.join(root, 'wiki/repos/demo/bus/discovery', `${id}.md`)
  const raw = fs.readFileSync(file, 'utf8')
  assert.match(raw, /status: acknowledged/)
  assert.match(raw, /"actor":"lead-1"/)
  assert.doesNotMatch(raw, /"actor":"unknown"/)
})

test('kb bus transition without --actor is attributed to the CLI, never "unknown"', () => {
  const root = makeCliFixture()
  const published = kb(root, 'bus', 'publish', 'demo', 'discovery', '--from', 'agent-a', '--body', 'no actor given')
  const id = published.match(/ID: (\S+)/)[1]

  kb(root, 'bus', 'transition', 'demo', 'discovery', id, 'acknowledged')

  const raw = fs.readFileSync(path.join(root, 'wiki/repos/demo/bus/discovery', `${id}.md`), 'utf8')
  assert.match(raw, /"actor":"cli:[^"]+"/)
  assert.doesNotMatch(raw, /"actor":"unknown"/)
})
