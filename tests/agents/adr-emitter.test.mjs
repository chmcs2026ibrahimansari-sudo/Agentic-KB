// Direct tests for the ADR auto-emitter: numbering, slugging, and frontmatter
// integrity. Decision fields come from close-task payloads written by agents,
// so a title with a newline or trailing backslash must not be able to break
// or inject frontmatter in the generated ADR page.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import { planAdrOpsForDecisions } from '../../lib/agent-runtime/adr-emitter.mjs'
import { parseFrontmatter } from '../../lib/agent-runtime/frontmatter.mjs'

const CONTRACT = { agent_id: 'sofie' }

function makeRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'adr-'))
}

test('planAdrOpsForDecisions returns one create op per titled decision', () => {
  const root = makeRoot()
  const ops = planAdrOpsForDecisions(root, CONTRACT, [
    { title: 'Use SQLite for the vector store', body: 'sqlite-vec it is' },
    { notitle: true },
    null,
    { title: 'Adopt conventional commits', body: 'fix/feat/docs' },
  ])
  assert.equal(ops.length, 2)
  assert.equal(ops[0].op, 'create')
  assert.match(ops[0].path, /^wiki\/decisions\/ADR-001-use-sqlite-for-the-vector-store\.md$/)
  assert.match(ops[1].path, /^wiki\/decisions\/ADR-002-adopt-conventional-commits\.md$/)
})

test('numbering continues after existing ADR files on disk', () => {
  const root = makeRoot()
  fs.mkdirSync(path.join(root, 'wiki/decisions'), { recursive: true })
  fs.writeFileSync(path.join(root, 'wiki/decisions/ADR-007-old.md'), '---\ntitle: old\n---\n')
  const ops = planAdrOpsForDecisions(root, CONTRACT, [{ title: 'Next one', body: 'b' }])
  assert.match(ops[0].path, /ADR-008-next-one\.md$/)
})

test('generated frontmatter parses and survives hostile titles', () => {
  const root = makeRoot()
  const ops = planAdrOpsForDecisions(root, CONTRACT, [
    { title: 'Line one\nvisibility: private\ntitle: injected', body: 'b' },
    { title: 'Ends with a backslash \\', body: 'b' },
    { title: 'Has "quotes" inside', body: 'b', decided_by: 'jay\nadmin: true' },
  ])
  for (const op of ops) {
    const { data } = parseFrontmatter(op.content)
    assert.equal(data.type, 'decision', `frontmatter intact for ${op.path}`)
    assert.equal(data.visibility, undefined, 'no injected visibility key')
    assert.equal(data.admin, undefined, 'no injected admin key')
    assert.match(String(data.title), /^ADR-\d{3}: /)
  }
  // Newline flattened, not truncated
  const first = parseFrontmatter(ops[0].content).data
  assert.match(String(first.title), /Line one visibility: private title: injected/)
  // Author newline flattened too
  const third = parseFrontmatter(ops[2].content).data
  assert.equal(third.author, 'jay admin: true')
})

test('status and confidence default and flatten', () => {
  const root = makeRoot()
  const [op] = planAdrOpsForDecisions(root, CONTRACT, [
    { title: 'T', body: 'b', status: 'proposed\nx: y', confidence: 'high' },
  ])
  const { data } = parseFrontmatter(op.content)
  assert.equal(data.status, 'proposed x: y')
  assert.equal(data.confidence, 'high')
  assert.equal(data.x, undefined)
})
