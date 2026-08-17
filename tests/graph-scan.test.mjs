/**
 * Tests for scripts/graph-maintenance-scan.mjs — scan output, receipt
 * writing, and receipt verification.
 *
 * Run with: node --test tests/graph-scan.test.mjs
 *
 * The script is exercised via subprocess with OBSIDIAN_VAULT_ROOT pointed at
 * a fixture vault and KB_ROOT at a sandbox tree, so neither the real vault
 * nor the repo's briefings/ and .night-shift/ are ever touched.
 */

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT = path.join(REPO, 'scripts', 'graph-maintenance-scan.mjs')

let vault
let sandbox

const STATE = () => path.join(sandbox, '.night-shift', 'state', 'graph-maintenance-state.json')

function run(extraArgs = [], { expectStatus = 0 } = {}) {
  const r = spawnSync(process.execPath, [SCRIPT, ...extraArgs], {
    encoding: 'utf8',
    env: { ...process.env, OBSIDIAN_VAULT_ROOT: vault, KB_ROOT: sandbox },
  })
  assert.equal(r.status, expectStatus, `unexpected exit ${r.status}: ${r.stderr}\n${r.stdout}`)
  return r
}

before(() => {
  vault = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-graph-scan-vault-'))
  sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-graph-scan-repo-'))

  // hub: linked from two notes, links out to one
  fs.writeFileSync(path.join(vault, 'hub.md'), '---\ntags: [alpha, beta]\n---\n# Hub\n[[leaf]]\n')
  // leaf: linked, no outlinks → dead end
  fs.writeFileSync(path.join(vault, 'leaf.md'), '---\ntags: alpha\n---\n# Leaf\n')
  // linker: links to hub (also via anchor + alias forms)
  fs.writeFileSync(path.join(vault, 'linker.md'), '# Linker\n[[hub#Hub|the hub]]\n')
  // loner: no links in either direction → orphan
  fs.writeFileSync(path.join(vault, 'loner.md'), '# Loner\nno links here\n')
  // dashboard: excluded from notes, tags still counted
  fs.mkdirSync(path.join(vault, '00 - Dashboards'), { recursive: true })
  fs.writeFileSync(path.join(vault, '00 - Dashboards', 'd.md'), '---\ntags: [dash]\n---\n# D\n')
})

after(() => {
  fs.rmSync(vault, { recursive: true, force: true })
  fs.rmSync(sandbox, { recursive: true, force: true })
})

describe('graph-maintenance-scan', () => {
  it('scans the vault: orphans, dead ends, tags, dashboard exclusion', () => {
    const r = run()
    const receipt = JSON.parse(r.stdout)

    assert.equal(receipt.notes_scanned, 4) // dashboard excluded
    assert.deepEqual(receipt.orphans, ['loner.md'])
    assert.equal(receipt.orphan_count, 1)
    assert.deepEqual(receipt.dead_ends, ['leaf.md'])

    const tags = Object.fromEntries(receipt.top_tags.map(t => [t.tag, t.count]))
    assert.equal(tags.alpha, 2)
    assert.equal(tags.beta, 1)
    assert.equal(tags.dash, 1) // dashboard tags still counted
  })

  it('resolves anchored and aliased wikilinks to the target note', () => {
    const r = run()
    const receipt = JSON.parse(r.stdout)
    // hub is linked by linker via [[hub#Hub|the hub]] — hub must not be an orphan
    assert.ok(!receipt.orphans.includes('hub.md'))
  })

  it('--write-receipt lands briefing + state in the sandbox, not the repo', () => {
    const r = run(['--write-receipt'])
    assert.match(r.stdout, /Wrote briefings\/graph-maintenance-/)

    const state = JSON.parse(fs.readFileSync(STATE(), 'utf8'))
    assert.equal(state.status, 'ok')
    assert.equal(state.receipt.notes_scanned, 4)

    const briefing = fs.readFileSync(path.join(sandbox, state.last_briefing), 'utf8')
    assert.match(briefing, /# Graph Maintenance —/)
    assert.match(briefing, /- notes_scanned: 4/)

    // no tmp leftovers from the atomic writes
    const briefingDir = path.join(sandbox, 'briefings')
    assert.deepEqual(fs.readdirSync(briefingDir).filter(f => f.includes('.tmp-')), [])
  })

  it('--verify-receipt passes after a write and fails on a missing briefing', () => {
    run(['--write-receipt'])
    const ok = run(['--verify-receipt'])
    assert.match(ok.stdout, /OK: graph maintenance receipt verified/)

    const state = JSON.parse(fs.readFileSync(STATE(), 'utf8'))
    fs.unlinkSync(path.join(sandbox, state.last_briefing))
    const fail = run(['--verify-receipt'], { expectStatus: 1 })
    assert.match(fail.stderr, /FAIL: briefing missing/)
  })

  it('--verify-receipt reports a state file with no last_briefing', () => {
    // path.join(REPO_ROOT, undefined) threw ERR_INVALID_ARG_TYPE, so a
    // partial state file crashed the verifier on a stack trace instead of
    // reporting the failure it exists to report.
    run(['--write-receipt'])
    const state = JSON.parse(fs.readFileSync(STATE(), 'utf8'))
    delete state.last_briefing
    fs.writeFileSync(STATE(), JSON.stringify(state, null, 2))

    const fail = run(['--verify-receipt'], { expectStatus: 1 })
    assert.match(fail.stderr, /FAIL: state has no last_briefing/)
    assert.doesNotMatch(fail.stderr, /ERR_INVALID_ARG_TYPE/)
  })

  it('exits 1 when the vault does not exist', () => {
    const r = spawnSync(process.execPath, [SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, OBSIDIAN_VAULT_ROOT: path.join(vault, 'nope'), KB_ROOT: sandbox },
    })
    assert.equal(r.status, 1)
    assert.match(r.stderr, /Vault not found/)
  })
})
