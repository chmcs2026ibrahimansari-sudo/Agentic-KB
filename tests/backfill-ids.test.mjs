// scripts/backfill-ids.mjs runs on import and takes the vault root as argv[2],
// so it is exercised as a subprocess against a throwaway vault.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
import { execFileSync } from 'node:child_process'

import { parseFrontmatter } from '../lib/agent-runtime/frontmatter.mjs'

const SCRIPT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'backfill-ids.mjs')

function makeVault() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'backfill-'))
  fs.mkdirSync(path.join(root, 'wiki'), { recursive: true })
  return root
}

function run(root) {
  return execFileSync(process.execPath, [SCRIPT, root], { encoding: 'utf8' })
}

const countFrontmatterBlocks = s => (s.match(/^---\r?$/gm) || []).length / 2

test('backfill-ids adds an id to an LF file without disturbing its fields', () => {
  const root = makeVault()
  const f = path.join(root, 'wiki/lf.md')
  fs.writeFileSync(f, '---\ntitle: LF Page\ntype: concept\n---\n\nbody\n')

  run(root)

  const out = fs.readFileSync(f, 'utf8')
  const { data } = parseFrontmatter(out)
  assert.equal(countFrontmatterBlocks(out), 1)
  assert.equal(data.title, 'LF Page')
  assert.equal(data.type, 'concept')
  assert.match(String(data.id), /^[0-9A-HJKMNP-TV-Z]{26}$/)
})

test('backfill-ids does not double-prepend frontmatter on a CRLF file', () => {
  // A CRLF page (Windows-authored, or synced from GitHub into
  // wiki/repos/*/repo-docs/) missed the LF-only match and got a whole second
  // frontmatter block, hiding title/type from every reader — permanently,
  // since the re-run then sees a valid id and skips.
  const root = makeVault()
  const f = path.join(root, 'wiki/crlf.md')
  fs.writeFileSync(f, '---\r\ntitle: CRLF Page\r\ntype: concept\r\n---\r\n\r\nbody\r\n')

  run(root)

  const out = fs.readFileSync(f, 'utf8')
  assert.equal(countFrontmatterBlocks(out), 1, 'exactly one frontmatter block')
  const { data } = parseFrontmatter(out)
  assert.equal(data.title, 'CRLF Page')
  assert.equal(data.type, 'concept')
  assert.match(String(data.id), /^[0-9A-HJKMNP-TV-Z]{26}$/)
  assert.ok(out.includes('body'), 'body survives')
})

test('backfill-ids is idempotent', () => {
  const root = makeVault()
  const f = path.join(root, 'wiki/page.md')
  fs.writeFileSync(f, '---\ntitle: P\n---\n\nbody\n')

  run(root)
  const first = fs.readFileSync(f, 'utf8')
  const second = run(root)

  assert.equal(fs.readFileSync(f, 'utf8'), first, 'second pass must not rewrite')
  assert.match(second, /added=0 skipped=1/)
})

test('backfill-ids prepends frontmatter to a bare file and leaves no tmp files', () => {
  const root = makeVault()
  fs.writeFileSync(path.join(root, 'wiki/bare.md'), 'just a body\n')

  const out = run(root)

  assert.match(out, /added=1/)
  assert.match(out, /no-frontmatter=1/)
  const written = fs.readFileSync(path.join(root, 'wiki/bare.md'), 'utf8')
  assert.equal(countFrontmatterBlocks(written), 1)
  assert.ok(written.endsWith('just a body\n'))
  assert.deepEqual(fs.readdirSync(path.join(root, 'wiki')).filter(n => n.includes('.tmp-')), [])
})
