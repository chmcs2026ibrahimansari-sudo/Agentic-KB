/**
 * Tests for scripts/compile-2source-gate.mjs plan/execute behavior.
 *
 * Run with: node --test tests/compile-2source-gate.test.mjs
 *
 * The script is exercised via subprocess with KB_ROOT pointed at a tmp
 * fixture tree, so the real wiki/ is never touched. In the sandbox there is
 * no cli/kb.js, so --execute's shell-out to `kb compile` fails with a
 * non-zero exit — the gate's own writes (candidates.md, compile-log.md)
 * must land before that, which is exactly what these tests assert.
 */

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT = path.join(REPO, 'scripts', 'compile-2source-gate.mjs')

let root

const SUMMARIES = () => path.join(root, 'wiki', 'summaries')
const CANDIDATES = () => path.join(root, 'wiki', 'candidates.md')
const COMPILE_LOG = () => path.join(root, 'wiki', '_meta', 'compile-log.md')

function run(extraArgs = []) {
  return spawnSync(process.execPath, [SCRIPT, ...extraArgs], {
    encoding: 'utf8',
    env: { ...process.env, KB_ROOT: root },
  })
}

function writeSummary(slug, concepts) {
  fs.writeFileSync(
    path.join(SUMMARIES(), `${slug}.md`),
    `---\ntitle: ${slug}\nkey_concepts: [${concepts.join(', ')}]\n---\n\nBody of ${slug}.\n`
  )
}

before(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-compile-gate-'))
  fs.mkdirSync(SUMMARIES(), { recursive: true })
})

after(() => {
  fs.rmSync(root, { recursive: true, force: true })
})

describe('compile-2source-gate', () => {
  it('plan mode defers a single-source theme and touches nothing', () => {
    writeSummary('s1', ['theme-x'])
    const r = run(['--plan'])
    assert.equal(r.status, 0, `plan failed: ${r.stderr}`)
    assert.match(r.stdout, /DEFER: 1/)
    assert.match(r.stdout, /theme-x \(sources: s1\)/)
    assert.equal(fs.existsSync(CANDIDATES()), false, 'plan must not write candidates.md')
    assert.equal(fs.existsSync(COMPILE_LOG()), false, 'plan must not write compile-log.md')
  })

  it('execute records the deferral in candidates.md and the compile log', () => {
    // The sandbox has no cli/kb.js, so the trailing `kb compile` shell-out
    // fails — the gate's own state writes must already have landed.
    const r = run(['--execute'])
    assert.notEqual(r.status, 0, 'execute should propagate the failed compile exit')
    const candidates = fs.readFileSync(CANDIDATES(), 'utf8')
    assert.match(candidates, /^- theme-x {2}\(1 source: s1\)$/m)
    const log = fs.readFileSync(COMPILE_LOG(), 'utf8')
    assert.match(log, /- defer: {4}1/)
    assert.match(log, /- graduate: 0/)
    assert.equal(
      fs.readdirSync(path.dirname(CANDIDATES())).filter((f) => f.includes('.tmp-')).length,
      0,
      'no orphaned tmp files from the atomic rewrite'
    )
  })

  it('graduates the theme once a second source lands', () => {
    writeSummary('s2', ['theme-x'])
    const r = run(['--plan'])
    assert.equal(r.status, 0, `plan failed: ${r.stderr}`)
    assert.match(r.stdout, /GRADUATE: 1/)
    assert.match(r.stdout, /theme-x \(now: s1, s2\)/)
    assert.match(r.stdout, /PROMOTE: 0/)
  })

  it('a theme never deferred promotes straight through at two sources', () => {
    writeSummary('s3', ['theme-y'])
    writeSummary('s4', ['theme-y'])
    const r = run(['--plan'])
    assert.equal(r.status, 0, `plan failed: ${r.stderr}`)
    assert.match(r.stdout, /PROMOTE: 1/)
    assert.match(r.stdout, /theme-y \(sources: s3, s4\)/)
  })
})
