/**
 * Tests for scripts/ingest-dedup.mjs routing + dedup behavior.
 *
 * Run with: node --test tests/ingest-dedup.test.mjs
 *
 * The script is exercised via subprocess with KB_ROOT pointed at a tmp
 * fixture tree, so nothing under the real raw/ is touched.
 */

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT = path.join(REPO, 'scripts', 'ingest-dedup.mjs')

let root

function run(extraArgs = []) {
  const r = spawnSync(
    process.execPath,
    [SCRIPT, '--route', '--no-ingest', ...extraArgs],
    { encoding: 'utf8', env: { ...process.env, KB_ROOT: root } }
  )
  assert.equal(r.status, 0, `script failed: ${r.stderr}`)
  return r
}

function inbox(name, content) {
  fs.writeFileSync(path.join(root, 'raw', 'clippings', name), content)
}

before(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-ingest-dedup-'))
  fs.mkdirSync(path.join(root, 'raw', 'clippings'), { recursive: true })
})

after(() => {
  fs.rmSync(root, { recursive: true, force: true })
})

describe('ingest-dedup routing', () => {
  it('routes by detected type and records hashes', () => {
    inbox('some-note.md', '# hello\n')
    inbox('meeting-transcript.md', 'we talked\n')
    inbox('paper.pdf', '%PDF-1.4 stub')
    run()
    assert.ok(fs.existsSync(path.join(root, 'raw', 'articles', 'some-note.md')))
    assert.ok(fs.existsSync(path.join(root, 'raw', 'transcripts', 'meeting-transcript.md')))
    assert.ok(fs.existsSync(path.join(root, 'raw', 'papers', 'paper.pdf')))
    // inbox is drained
    assert.deepEqual(fs.readdirSync(path.join(root, 'raw', 'clippings')), [])
    // ledger is valid JSON with 3 entries
    const ledger = JSON.parse(fs.readFileSync(path.join(root, 'raw', '.ingest-hashes.json'), 'utf8'))
    assert.equal(Object.keys(ledger).length, 3)
  })

  it('skips a file whose content hash is already in the ledger', () => {
    inbox('renamed-copy.md', '# hello\n') // same bytes as some-note.md
    const r = run()
    assert.match(r.stdout, /Skipped 1/)
    // not routed, left in the inbox
    assert.ok(fs.existsSync(path.join(root, 'raw', 'clippings', 'renamed-copy.md')))
    assert.ok(!fs.existsSync(path.join(root, 'raw', 'articles', 'renamed-copy.md')))
    fs.rmSync(path.join(root, 'raw', 'clippings', 'renamed-copy.md'))
  })

  it('does not clobber an existing file with the same routed name', () => {
    inbox('some-note.md', '# different content\n')
    run()
    // original untouched, newcomer suffixed
    assert.equal(
      fs.readFileSync(path.join(root, 'raw', 'articles', 'some-note.md'), 'utf8'),
      '# hello\n'
    )
    assert.equal(
      fs.readFileSync(path.join(root, 'raw', 'articles', 'some-note-2.md'), 'utf8'),
      '# different content\n'
    )
    // ledger records the suffixed path
    const ledger = JSON.parse(fs.readFileSync(path.join(root, 'raw', '.ingest-hashes.json'), 'utf8'))
    const paths = Object.values(ledger).map((v) => v.path)
    assert.ok(paths.includes('raw/articles/some-note-2.md'))
  })

  it('is a no-op when the inbox is empty', () => {
    const r = run()
    assert.match(r.stdout, /Inbox is empty/)
  })
})
