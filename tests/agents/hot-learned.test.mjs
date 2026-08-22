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

test('the digest records how much of hot.md it dropped', () => {
  // summarizeHotToLearned is a summarization step between a producer (hot.md)
  // and a consumer (an agent that later loads learned/ and never re-reads the
  // source). A digest that kept 3 of 33 lines had the same frontmatter keys
  // and the same shape as one that kept everything, so the consumer had no
  // way to tell a faithful digest from a lossy one.
  const bullets = ['- kept one', '- kept two', '- kept three'].join('\n')
  const prose = Array.from({ length: 30 },
    (_, i) => `The deploy step for service ${i} requires a manual approval.`).join('\n\n')
  writeHot(`${bullets}\n\n${prose}\n`)

  const r = summarizeHotToLearned(kbRoot, CONTRACT)
  assert.ok(!r.skipped)
  const { data } = parseFrontmatter(fs.readFileSync(path.join(kbRoot, r.learnedPath), 'utf8'))

  assert.equal(data.source_lines, 33, 'every non-empty source line is counted')
  assert.equal(data.digest_lines, 3, 'only the three bullets survived')
  assert.equal(data.lines_dropped, 30)
  assert.equal(data.truncated, true, 'a lossy digest must say so in structured frontmatter')
  // Same values reach the caller, not only the written page.
  assert.equal(r.lines_dropped, 30)
  assert.equal(r.truncated, true)
})

test('a digest that lost nothing reports truncated: false', () => {
  // The signal is only useful if it distinguishes. An all-bullet source under
  // the line cap round-trips whole, and the digest must say so rather than
  // omit the field — an absent flag would read as "no loss" by default.
  const bullets = Array.from({ length: 10 },
    (_, i) => `- an observed fact number ${i} about the system`).join('\n')
  writeHot(`${bullets}\n`)

  const r = summarizeHotToLearned(kbRoot, CONTRACT)
  const { data } = parseFrontmatter(fs.readFileSync(path.join(kbRoot, r.learnedPath), 'utf8'))
  assert.equal(data.source_lines, 10)
  assert.equal(data.digest_lines, 10)
  assert.equal(data.lines_dropped, 0)
  assert.equal(data.truncated, false)
})

test('the 60-line cap is reported as loss, not applied silently', () => {
  const bullets = Array.from({ length: 200 }, (_, i) => `- bullet ${i} with enough words to pass`).join('\n')
  writeHot(`${bullets}\n`)

  const r = summarizeHotToLearned(kbRoot, CONTRACT)
  const { data } = parseFrontmatter(fs.readFileSync(path.join(kbRoot, r.learnedPath), 'utf8'))
  assert.equal(data.source_lines, 200)
  assert.equal(data.digest_lines, 60)
  assert.equal(data.lines_dropped, 140)
  assert.equal(data.truncated, true)
})

test('a custom summarizer is measured the same way as the default', () => {
  // registerHotLearnedSummarizer accepts an arbitrary (potentially LLM)
  // summarizer whose loss is unbounded and unknowable from inside. The
  // measurement is taken outside the summarizer so it applies regardless.
  const lines = Array.from({ length: 40 }, (_, i) => `- source line ${i} of the hot memory`).join('\n')
  writeHot(`${lines}\n`)

  registerHotLearnedSummarizer(() => 'one surviving line')
  const r = summarizeHotToLearned(kbRoot, CONTRACT)
  const { data } = parseFrontmatter(fs.readFileSync(path.join(kbRoot, r.learnedPath), 'utf8'))
  assert.equal(data.summarizer, 'custom')
  assert.equal(data.source_lines, 40)
  assert.equal(data.digest_lines, 1)
  assert.equal(data.truncated, true)
})
