// Regression tests for scripts/autolink.py — later (shorter) phrases must not
// corrupt wikilinks inserted earlier in the same pass, and protected regions
// (code, existing links, frontmatter) must survive untouched.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT = path.join(REPO, 'scripts', 'autolink.py')

const havePython = spawnSync('python3', ['--version'], { encoding: 'utf8' }).status === 0

function runAutolink(files, entityMap) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'autolink-'))
  const vault = path.join(dir, 'vault')
  fs.mkdirSync(vault, { recursive: true })
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(vault, name), content)
  }
  const mapPath = path.join(dir, 'entity-map.json')
  fs.writeFileSync(mapPath, JSON.stringify(entityMap, null, 2))
  const reportPath = path.join(dir, 'report.md')
  const r = spawnSync('python3', [
    SCRIPT, '--vault', vault, '--entity-map', mapPath, '--write', '--report', reportPath,
  ], { encoding: 'utf8' })
  assert.equal(r.status, 0, `autolink.py failed: ${r.stderr}`)
  const out = {}
  for (const name of Object.keys(files)) {
    out[name] = fs.readFileSync(path.join(vault, name), 'utf8')
  }
  return out
}

const NESTING_MAP = {
  'Fan-out Worker': { target: '[[pattern-fan-out-worker]]', aliases: ['fan-out'] },
  'Andrej Karpathy': { target: '[[andrej-karpathy]]', aliases: ['Karpathy'] },
}

test('shorter alias does not corrupt a link inserted by the longer phrase', { skip: !havePython && 'python3 not available' }, () => {
  const out = runAutolink(
    { 'note.md': 'Talked to Andrej Karpathy about the Fan-out Worker pattern.\n' },
    NESTING_MAP,
  )
  assert.equal(
    out['note.md'],
    'Talked to [[andrej-karpathy]] about the [[pattern-fan-out-worker]] pattern.\n',
  )
  assert.ok(!out['note.md'].includes('[[pattern-[['), 'no nested corrupted links')
})

test('alias still links on its own; code spans and existing links untouched', { skip: !havePython && 'python3 not available' }, () => {
  const out = runAutolink(
    { 'note.md': 'Karpathy said fan-out helps. See [[andrej-karpathy]] and `fan-out` in code.\n' },
    NESTING_MAP,
  )
  assert.equal(
    out['note.md'],
    '[[andrej-karpathy]] said [[pattern-fan-out-worker]] helps. See [[andrej-karpathy]] and `fan-out` in code.\n',
  )
})

test('frontmatter is never autolinked', { skip: !havePython && 'python3 not available' }, () => {
  const out = runAutolink(
    { 'note.md': '---\ntitle: Fan-out Worker\n---\n\nBody mentions Fan-out Worker.\n' },
    NESTING_MAP,
  )
  assert.ok(out['note.md'].startsWith('---\ntitle: Fan-out Worker\n---\n'), 'frontmatter untouched')
  assert.ok(out['note.md'].includes('Body mentions [[pattern-fan-out-worker]].'))
})
