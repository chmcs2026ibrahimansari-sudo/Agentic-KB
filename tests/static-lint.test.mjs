/**
 * Tests for scripts/static-lint.mjs — the no-PIN, no-API local wiki lint.
 *
 * Run with: node --test tests/static-lint.test.mjs
 *
 * The script is exercised via subprocess with KB_ROOT pointed at a sandbox
 * tree, so the real wiki/ and wiki/system/reports/ are never touched.
 */

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT = path.join(REPO, 'scripts', 'static-lint.mjs')

let sandbox

const TODAY = () => new Date().toISOString().slice(0, 10)
const REPORT = () => path.join(sandbox, 'wiki', 'system', 'reports', `static-lint-${TODAY()}.md`)

function run(extraArgs = [], { expectStatus = 0 } = {}) {
  const r = spawnSync(process.execPath, [SCRIPT, ...extraArgs], {
    encoding: 'utf8',
    env: { ...process.env, KB_ROOT: sandbox },
  })
  assert.equal(r.status, expectStatus, `unexpected exit ${r.status}: ${r.stderr}\n${r.stdout}`)
  return r
}

function write(rel, body) {
  const abs = path.join(sandbox, 'wiki', rel)
  fs.mkdirSync(path.dirname(abs), { recursive: true })
  fs.writeFileSync(abs, body)
  return abs
}

before(() => {
  sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-static-lint-'))

  // index links to hub; hub links to leaf; loner is linked from nowhere.
  write('index.md', '# Index\n[[hub]]\n')
  write('hub.md', '---\ntitle: Hub\n---\n# Hub\n[[leaf]]\n')
  write('leaf.md', '---\ntitle: Leaf\n---\n# Leaf\n')
  write('loner.md', '---\ntitle: Loner\n---\n# Loner\nno inbound links\n')

  // Stale by frontmatter `updated`, plus a fresh page that must not be flagged.
  write('concepts/ancient.md', '---\ntitle: Ancient\nupdated: 2020-01-01\n---\n# Ancient\n')
  write('concepts/fresh.md', `---\ntitle: Fresh\nupdated: ${TODAY()}\n---\n# Fresh\n`)

  // The PIN-plaintext layer and dotted dirs are not wiki content.
  write('_private/therapy-themes.md', '---\ntitle: Private\n---\n# Private\n')
  write('.obsidian/workspace-notes.md', '# Dot dir\n')
})

after(() => {
  fs.rmSync(sandbox, { recursive: true, force: true })
})

describe('static-lint', () => {
  it('reports orphans and leaves linked pages alone', () => {
    const out = run().stdout
    assert.match(out, /Orphans: {7}\d+/)
    assert.match(out, /loner\.md/)
    assert.doesNotMatch(out, /^ {2}hub\.md$/m)
  })

  it('flags pages stale by frontmatter `updated` and spares fresh ones', () => {
    const stale = run().stdout.split('--- top 1 stale ---')[1]
    assert.ok(stale, 'expected a stale section')
    assert.match(stale, /2020-01-01 {2}concepts\/ancient\.md/)
    assert.doesNotMatch(stale, /concepts\/fresh\.md/)
  })

  it('never scans wiki/_private or dotted dirs', () => {
    const out = run().stdout
    assert.doesNotMatch(out, /_private/)
    assert.doesNotMatch(out, /therapy-themes/)
    assert.doesNotMatch(out, /\.obsidian/)
  })

  it('writes no report without --apply', () => {
    run()
    assert.equal(fs.existsSync(REPORT()), false)
  })

  it('--apply lands a report that excludes private pages', () => {
    run(['--apply'])
    const report = fs.readFileSync(REPORT(), 'utf8')
    assert.match(report, /^orphans: \d+$/m)
    assert.match(report, /loner\.md/)
    assert.match(report, /`concepts\/ancient\.md` \(updated 2020-01-01\)/)
    assert.doesNotMatch(report, /_private/)
    assert.doesNotMatch(report, /therapy-themes/)
    // Atomic write leaves no tmp files behind.
    const dir = path.dirname(REPORT())
    assert.equal(fs.readdirSync(dir).filter(f => f.includes('.tmp-')).length, 0)
  })

  it('--stale-days is honored', () => {
    const wide = run(['--stale-days', '99999']).stdout
    assert.match(wide, /Stale \(>99999d\): 0/)
  })
})
