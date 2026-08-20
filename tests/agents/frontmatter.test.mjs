// Tests for the zero-dep frontmatter codec used by sync, writeback, and bus.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  parseFrontmatter,
  serializeFrontmatter,
  updateFrontmatter,
} from '../../lib/agent-runtime/frontmatter.mjs'

test('parseFrontmatter reads scalars, lists, and body', () => {
  const doc = [
    '---',
    'title: Hello',
    'count: 3',
    'ratio: 1.5',
    'active: true',
    'empty: null',
    'tags: [a, b, c]',
    'steps:',
    '  - first',
    '  - second',
    '---',
    '',
    'Body text',
  ].join('\n')
  const { data, content } = parseFrontmatter(doc)
  assert.equal(data.title, 'Hello')
  assert.equal(data.count, 3)
  assert.equal(data.ratio, 1.5)
  assert.equal(data.active, true)
  assert.equal(data.empty, null)
  assert.deepEqual(data.tags, ['a', 'b', 'c'])
  assert.deepEqual(data.steps, ['first', 'second'])
  assert.equal(content.trim(), 'Body text')
})

test('parseFrontmatter handles CRLF documents', () => {
  const doc = '---\r\ntitle: Windows\r\n---\r\n\r\nBody'
  const { data } = parseFrontmatter(doc)
  assert.equal(data.title, 'Windows')
})

test('parseFrontmatter returns empty data without frontmatter', () => {
  const { data, content } = parseFrontmatter('Just a body')
  assert.deepEqual(data, {})
  assert.equal(content, 'Just a body')
})

test('round-trip preserves types and special-character strings', () => {
  const original = {
    quoted: 'He said "hi" to me',
    multiline: 'line1\nline2',
    boolLike: 'true',
    numLike: '42',
    nullLike: 'null',
    emptyStr: '',
    realBool: false,
    realNum: 7,
    realNull: null,
    list: ['x', 'true', 3],
    colon: 'key: value',
  }
  const { data } = parseFrontmatter(serializeFrontmatter(original, 'body'))
  assert.deepEqual(data, original)
})

test('updateFrontmatter patches keys and keeps the body', () => {
  const doc = serializeFrontmatter({ status: 'open', owner: 'a1' }, '\nBody here')
  const updated = updateFrontmatter(doc, { status: 'closed' })
  const { data, content } = parseFrontmatter(updated)
  assert.equal(data.status, 'closed')
  assert.equal(data.owner, 'a1')
  assert.match(content, /Body here/)
})

test('YAML indicator characters survive a real YAML parser', async () => {
  const { parse: yamlParse } = await import('yaml')
  // These all round-tripped through this codec but broke gray-matter / `yaml`:
  // "*" read as an alias (throw), "&"/"!" as anchor/tag (null / ""),
  // "|" and ">" as block-scalar headers (throw), "@" "`" "%" as reserved (throw).
  const original = {
    star: '*star',
    anchor: '&anchor',
    tag: '!tag',
    at: '@mention',
    tick: '`code`',
    pct: '%directive',
    pipe: '|pipe',
    gt: '>gt',
    question: '?query',
    comma: ',lead',
  }
  const doc = serializeFrontmatter(original, 'body\n')
  assert.deepEqual(parseFrontmatter(doc).data, original)

  const header = doc.slice(4, doc.indexOf('\n---', 4))
  assert.deepEqual(yamlParse(header), original)
})

test('leading and trailing whitespace is preserved', () => {
  const original = { lead: '  indented', trail: 'trailing  ' }
  assert.deepEqual(parseFrontmatter(serializeFrontmatter(original, 'body')).data, original)
})

test('a UTF-8 BOM does not hide the frontmatter block', () => {
  // A BOM-prefixed page failed startsWith('---\n'), parsed as data:{}, and
  // every writer then prepended a second frontmatter block on top of the
  // original -- same failure mode CRLF had.
  const src = '\uFEFF---\ntitle: Guide\nmemory_class: hot\n---\n\n# Guide\n'
  const { data, content } = parseFrontmatter(src)
  assert.equal(data.title, 'Guide')
  assert.equal(data.memory_class, 'hot')
  assert.equal(content, parseFrontmatter(src.slice(1)).content, 'body identical to the BOM-less source')

  const rewritten = updateFrontmatter(src, { status: 'active' })
  assert.equal(rewritten.match(/^---$/gm).length, 2, 'exactly one frontmatter block')
  assert.ok(!rewritten.includes('\uFEFF'), 'BOM must not survive into the body')
})

test('hyphenated frontmatter keys survive a parse/serialize round-trip', () => {
  // review-cadence-days and source-trust are real wiki keys. The key class
  // excluded '-', so the line was skipped and the next updateFrontmatter
  // dropped the key from the file entirely.
  const src = '---\ntitle: G\nreview-cadence-days: 30\n---\n\nbody\n'
  const { data } = parseFrontmatter(src)
  assert.equal(data['review-cadence-days'], 30)

  const rewritten = updateFrontmatter(src, { status: 'active' })
  assert.match(rewritten, /review-cadence-days: 30/)
  assert.equal(parseFrontmatter(rewritten).data['review-cadence-days'], 30)
})
