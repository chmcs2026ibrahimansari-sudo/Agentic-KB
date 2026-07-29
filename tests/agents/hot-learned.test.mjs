// Direct tests for lib/agent-runtime/hot-learned.mjs — the hot → learned
// digest hook that runs after every closeTask touching hot.md. Previously
// only exercised indirectly through writeback.
import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  summarizeHotToLearned,
  registerHotLearnedSummarizer,
  resetHotLearnedSummarizer,
} from '../../lib/agent-runtime/hot-learned.mjs'
import { parseFrontmatter } from '../../lib/agent-runtime/frontmatter.mjs'

const CONTRACT = { agent_id: 'test-agent', tier: 'worker', contract_hash: 'abc123' }

let kbRoot

function writeHot(content) {
  const dir = path.join(kbRoot, 'wiki/agents/workers/test-agent')
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'hot.md'), content)
}

beforeEach(() => {
  kbRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hot-learned-'))
})

afterEach(() => {
  resetHotLearnedSummarizer()
  fs.rmSync(kbRoot, { recursive: true, force: true })
})

test('skips when hot.md does not exist', () => {
  const r = summarizeHotToLearned(kbRoot, CONTRACT)
  assert.equal(r.skipped, true)
  assert.equal(r.reason, 'no hot.md')
})

test('skips below the minWords threshold', () => {
  writeHot('# Short\n- one bullet\n')
  const r = summarizeHotToLearned(kbRoot, CONTRACT)
  assert.equal(r.skipped, true)
  assert.equal(r.reason, 'below minWords')
})

test('writes a dated learned snapshot with provenance frontmatter', () => {
  const bullets = Array.from({ length: 30 }, (_, i) => `- learned fact number ${i} about the system`).join('\n')
  writeHot(`# Hot notes\n\n${bullets}\n\nSome prose paragraph that should not appear in the digest.\n`)

  const r = summarizeHotToLearned(kbRoot, CONTRACT)
  assert.ok(!r.skipped)
  assert.match(r.learnedPath, /^wiki\/agents\/workers\/test-agent\/learned\/hot-digest\/.+\.md$/)
  assert.equal(r.summarizer, 'default-heading-bullet')

  const written = fs.readFileSync(path.join(kbRoot, r.learnedPath), 'utf8')
  const { data, content } = parseFrontmatter(written)
  assert.equal(data.memory_class, 'learned')
  assert.equal(data.agent_id, 'test-agent')
  assert.equal(data.source, 'wiki/agents/workers/test-agent/hot.md')
  assert.equal(data.contract_hash, 'abc123')
  assert.ok(content.includes('# Hot notes'))
  assert.ok(content.includes('- learned fact number 0 about the system'))
  assert.ok(!content.includes('Some prose paragraph'))
})

test('default digest is capped at 60 lines', () => {
  const bullets = Array.from({ length: 200 }, (_, i) => `- bullet ${i} with enough words to pass`).join('\n')
  writeHot(`${bullets}\n`)
  const r = summarizeHotToLearned(kbRoot, CONTRACT)
  assert.ok(!r.skipped)
  const { content } = parseFrontmatter(fs.readFileSync(path.join(kbRoot, r.learnedPath), 'utf8'))
  const digestLines = content.split('\n').filter(l => l.startsWith('- '))
  assert.equal(digestLines.length, 60)
})

test('custom summarizer is used and recorded, empty output skips the write', () => {
  const words = Array.from({ length: 50 }, (_, i) => `word${i}`).join(' ')
  writeHot(words)

  registerHotLearnedSummarizer(() => 'CUSTOM DIGEST')
  const r = summarizeHotToLearned(kbRoot, CONTRACT)
  assert.ok(!r.skipped)
  assert.equal(r.summarizer, 'custom')
  const { content } = parseFrontmatter(fs.readFileSync(path.join(kbRoot, r.learnedPath), 'utf8'))
  assert.ok(content.includes('CUSTOM DIGEST'))

  registerHotLearnedSummarizer(() => '   ')
  const r2 = summarizeHotToLearned(kbRoot, CONTRACT)
  assert.equal(r2.skipped, true)
  assert.equal(r2.reason, 'empty summary')

  // Non-function registrations are ignored rather than breaking the hook
  registerHotLearnedSummarizer('not a function')
  const r3 = summarizeHotToLearned(kbRoot, CONTRACT)
  assert.equal(r3.skipped, true)

  resetHotLearnedSummarizer()
  const r4 = summarizeHotToLearned(kbRoot, CONTRACT)
  // Default summarizer on prose-only content: no headings/bullets → empty digest
  assert.equal(r4.skipped, true)
  assert.equal(r4.reason, 'empty summary')
})
