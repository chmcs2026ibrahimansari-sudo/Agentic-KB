/**
 * Tests for scripts/generate-stats.mjs.
 *
 * Run with: node --test tests/generate-stats.test.mjs
 *
 * The script is exercised via subprocess with --kb-root pointed at a tmp
 * fixture tree, so the real wiki/ is never touched.
 */

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT = path.join(REPO, 'scripts', 'generate-stats.mjs')

let root

function run() {
  const r = spawnSync(process.execPath, [SCRIPT, '--kb-root', root], { encoding: 'utf8' })
  assert.equal(r.status, 0, `script failed: ${r.stderr}`)
  return r
}

function writePage(rel, frontmatter, body) {
  const full = path.join(root, 'wiki', rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  const fm = Object.entries(frontmatter).map(([k, v]) => `${k}: ${v}`).join('\n')
  fs.writeFileSync(full, `---\n${fm}\n---\n\n${body}\n`)
}

before(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-generate-stats-'))
  writePage('concepts/alpha.md', { title: 'Alpha', type: 'concept', confidence: 'high' }, 'Alpha links to [[beta]].')
  writePage('concepts/beta.md', { title: 'Beta', type: 'concept' }, 'Beta has no outbound links.')
  writePage('patterns/pattern-gamma.md', { title: 'Gamma', type: 'pattern', visibility: 'private' }, 'Gamma links to [[alpha]] and [[beta]].')
  // Excluded namespaces must not be counted
  writePage('agents/leads/sofie/profile.md', { title: 'Sofie', type: 'agent' }, 'Not a knowledge page.')
  writePage('system/bus/discovery/item-1.md', { title: 'Item', type: 'discovery', status: 'open' }, 'Bus item.')
})

after(() => {
  fs.rmSync(root, { recursive: true, force: true })
})

describe('generate-stats', () => {
  it('writes stats.md with correct page, section, and type counts', () => {
    run()
    const stats = fs.readFileSync(path.join(root, 'wiki', 'stats.md'), 'utf8')
    // agents/ and system/bus/ pages are excluded → 3 knowledge pages
    assert.match(stats, /\| Total wiki pages \| \*\*3\*\* \|/)
    assert.match(stats, /\| concepts \| 2 \|/)
    assert.match(stats, /\| patterns \| 1 \|/)
    assert.match(stats, /\| concept \| 2 \|/)
    assert.match(stats, /\| pattern \| 1 \|/)
    // confidence: one high, two unset
    assert.match(stats, /\| high \| 1 \|/)
    assert.match(stats, /\| unset \| 2 \|/)
  })

  it('detects orphans (no inbound links) and counts links', () => {
    run()
    const stats = fs.readFileSync(path.join(root, 'wiki', 'stats.md'), 'utf8')
    // alpha and beta both have inbound links; gamma has none
    assert.match(stats, /\| Orphan pages \| 1 \|/)
    assert.match(stats, /- \[\[patterns\/pattern-gamma\]\]/)
    assert.match(stats, /\| Total internal links \| 3 \|/)
  })

  it('is idempotent and leaves no tmp files behind', () => {
    run()
    run()
    const leftovers = fs.readdirSync(path.join(root, 'wiki')).filter(f => f.includes('.tmp-'))
    assert.deepEqual(leftovers, [])
    // stats.md excludes itself from its own counts on re-run
    const stats = fs.readFileSync(path.join(root, 'wiki', 'stats.md'), 'utf8')
    assert.match(stats, /\| Total wiki pages \| \*\*3\*\* \|/)
  })

  it('counts bus items per channel', () => {
    run()
    const stats = fs.readFileSync(path.join(root, 'wiki', 'stats.md'), 'utf8')
    assert.match(stats, /\| discovery \| 1 \|/)
  })
})

describe('generate-stats — orphan edge cases', () => {
  let root2

  function run2() {
    const r = spawnSync(process.execPath, [SCRIPT, '--kb-root', root2], { encoding: 'utf8' })
    assert.equal(r.status, 0, `script failed: ${r.stderr}`)
    return r
  }

  before(() => {
    root2 = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-generate-stats-orphan-'))
    const write = (rel, body) => {
      const full = path.join(root2, 'wiki', rel)
      fs.mkdirSync(path.dirname(full), { recursive: true })
      fs.writeFileSync(full, `---\ntitle: ${path.basename(rel, '.md')}\ntype: concept\n---\n\n${body}\n`)
    }
    // narcissus links only to itself — nobody else links to it.
    write('concepts/narcissus.md', 'See [[narcissus]] for more.')
    write('concepts/lonely.md', 'No links at all.')
  })

  after(() => {
    fs.rmSync(root2, { recursive: true, force: true })
  })

  it('a self-link does not rescue a page from the orphan list', () => {
    run2()
    const stats = fs.readFileSync(path.join(root2, 'wiki', 'stats.md'), 'utf8')
    assert.match(stats, /\| Orphan pages \| 2 \|/)
    assert.match(stats, /- \[\[concepts\/narcissus\]\]/)
    assert.match(stats, /- \[\[concepts\/lonely\]\]/)
  })

  it('--kb-root with no value fails with a clear message', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--kb-root'], { encoding: 'utf8' })
    assert.equal(r.status, 1)
    assert.match(r.stderr, /--kb-root requires a path argument/)
    assert.doesNotMatch(r.stderr, /ERR_INVALID_ARG_TYPE/)
  })
})
