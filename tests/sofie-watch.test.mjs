/**
 * Tests for scripts/sofie-watch-obsidian.mjs — the --once scan path:
 * staging, ledger idempotency, in-place re-ingest, basename collisions,
 * frontmatter escaping, and inbox updates.
 *
 * Run with: node --test tests/sofie-watch.test.mjs
 *
 * The script is exercised via subprocess with OBSIDIAN_VAULT_ROOT pointed at
 * a fixture vault and KB_ROOT at a sandbox tree, so neither the real vault
 * nor the repo's raw/ is ever touched.
 */

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT = path.join(REPO, 'scripts', 'sofie-watch-obsidian.mjs')

let vault
let sandbox

const TRANSCRIPTS = () => path.join(sandbox, 'raw', 'transcripts')
const LEDGER = () => path.join(sandbox, 'raw', '.obsidian-ingest-log.json')
const INBOX = () => path.join(sandbox, 'raw', '.sofie-inbox.json')

function run({ expectStatus = 0 } = {}) {
  const env = { ...process.env, OBSIDIAN_VAULT_ROOT: vault, KB_ROOT: sandbox }
  // Notifications must stay local in tests.
  delete env.SOFIE_TELEGRAM_BOT_TOKEN
  delete env.SOFIE_TELEGRAM_CHAT_ID
  delete env.SOFIE_WEBHOOK_URL
  const r = spawnSync(process.execPath, [SCRIPT, '--once'], { encoding: 'utf8', env })
  assert.equal(r.status, expectStatus, `unexpected exit ${r.status}: ${r.stderr}\n${r.stdout}`)
  return r
}

function listTranscripts() {
  if (!fs.existsSync(TRANSCRIPTS())) return []
  return fs.readdirSync(TRANSCRIPTS()).filter(f => f.endsWith('.md')).sort()
}

before(() => {
  vault = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-sofie-watch-vault-'))
  sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-sofie-watch-kb-'))
  fs.mkdirSync(path.join(vault, 'daily-notes'), { recursive: true })
  fs.mkdirSync(path.join(vault, 'Sessions'), { recursive: true })
})

after(() => {
  fs.rmSync(vault, { recursive: true, force: true })
  fs.rmSync(sandbox, { recursive: true, force: true })
})

describe('sofie-watch-obsidian --once', () => {
  it('stages a daily note with pending frontmatter, ledger, and inbox entry', () => {
    fs.writeFileSync(path.join(vault, 'daily-notes', 'standup.md'), '# Standup\ndid things\n')
    // Empty notes must be skipped, not staged.
    fs.writeFileSync(path.join(vault, 'daily-notes', 'blank.md'), '   \n')

    run()

    const files = listTranscripts()
    assert.equal(files.length, 1)
    const staged = fs.readFileSync(path.join(TRANSCRIPTS(), files[0]), 'utf8')
    assert.match(staged, /^title: "standup"$/m)
    assert.match(staged, /^type: daily-note$/m)
    assert.match(staged, /^ingest_status: pending$/m)
    assert.ok(staged.includes('did things'))

    const ledger = JSON.parse(fs.readFileSync(LEDGER(), 'utf8'))
    assert.equal(ledger.ingested['daily-notes/standup.md'].outFile, files[0])
    assert.ok(ledger.lastScanAt)

    const inbox = JSON.parse(fs.readFileSync(INBOX(), 'utf8'))
    assert.equal(inbox.pending.length, 1)
    assert.equal(inbox.pending[0].type, 'ingest-complete')
    assert.deepEqual(inbox.pending[0].files, files)
  })

  it('is idempotent: an unchanged vault stages nothing new', () => {
    const beforeFiles = listTranscripts()
    run()
    assert.deepEqual(listTranscripts(), beforeFiles)
    // No new inbox notification either.
    const inbox = JSON.parse(fs.readFileSync(INBOX(), 'utf8'))
    assert.equal(inbox.pending.length, 1)
  })

  it('re-ingests a modified note into the same staged file', () => {
    fs.writeFileSync(path.join(vault, 'daily-notes', 'standup.md'), '# Standup\nrevised agenda\n')
    const beforeFiles = listTranscripts()

    run()

    assert.deepEqual(listTranscripts(), beforeFiles) // same file, updated in place
    const staged = fs.readFileSync(path.join(TRANSCRIPTS(), beforeFiles[0]), 'utf8')
    assert.ok(staged.includes('revised agenda'))
    assert.ok(!staged.includes('did things'))
  })

  it('two vault files with the same basename get distinct staged files', () => {
    fs.writeFileSync(path.join(vault, 'daily-notes', 'recap.md'), 'daily recap\n')
    fs.writeFileSync(path.join(vault, 'Sessions', 'recap.md'), 'session recap\n')

    run()

    const recaps = listTranscripts().filter(f => f.includes('-recap'))
    assert.equal(recaps.length, 2)
    const contents = recaps.map(f => fs.readFileSync(path.join(TRANSCRIPTS(), f), 'utf8'))
    assert.ok(contents.some(c => c.includes('daily recap')))
    assert.ok(contents.some(c => c.includes('session recap')))
    // Sessions/ notes are typed sofie-session and carry no ingest_status.
    const session = contents.find(c => c.includes('session recap'))
    assert.match(session, /^type: sofie-session$/m)
    assert.ok(!/^ingest_status:/m.test(session))
  })

  it('escapes quotes in note names instead of breaking the YAML scalar', () => {
    fs.writeFileSync(path.join(vault, 'daily-notes', 'my "big" plan.md'), 'plans\n')

    run()

    const staged = listTranscripts()
      .map(f => fs.readFileSync(path.join(TRANSCRIPTS(), f), 'utf8'))
      .find(c => c.includes('plans'))
    assert.ok(staged, 'quoted-name note was staged')
    assert.ok(staged.includes(`title: ${JSON.stringify('my "big" plan')}`))
  })
})
