// Tests for the repo-sync file filter: which repo paths get imported as docs.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { shouldInclude } from '../../lib/repo-runtime/sync.mjs'

test('shouldInclude accepts top-level and docs-tree markdown', () => {
  assert.equal(shouldInclude('README.md'), true)
  assert.equal(shouldInclude('CLAUDE.md'), true)
  assert.equal(shouldInclude('notes.mdx'), true)
  assert.equal(shouldInclude('docs/guide.md'), true)
  assert.equal(shouldInclude('docs/a/b/deep.md'), true)
  assert.equal(shouldInclude('docs/api/reference.mdx'), true)
  assert.equal(shouldInclude('specs/auth.md'), true)
  assert.equal(shouldInclude('plans/q3/roadmap.md'), true)
  assert.equal(shouldInclude('reports/2026/perf.md'), true)
  assert.equal(shouldInclude('architecture/overview.md'), true)
})

test('shouldInclude rejects non-markdown and unlisted trees', () => {
  assert.equal(shouldInclude('src/index.js'), false)
  assert.equal(shouldInclude('docs/diagram.png'), false)
  // Markdown outside the included patterns must not sneak in
  assert.equal(shouldInclude('src/notes.md'), false)
  assert.equal(shouldInclude('packages/foo/README.md'), false)
})

test('shouldInclude rejects vendored/build dirs at the repo root', () => {
  assert.equal(shouldInclude('node_modules/pkg/README.md'), false)
  assert.equal(shouldInclude('dist/README.md'), false)
  assert.equal(shouldInclude('build/docs.md'), false)
  assert.equal(shouldInclude('coverage/summary.md'), false)
  assert.equal(shouldInclude('.next/cache.md'), false)
})

test('shouldInclude rejects vendored/build dirs nested under included trees', () => {
  assert.equal(shouldInclude('docs/node_modules/pkg/README.md'), false)
  assert.equal(shouldInclude('specs/dist/generated.md'), false)
  assert.equal(shouldInclude('reports/coverage/lcov.md'), false)
})

test('shouldInclude normalizes Windows separators', () => {
  assert.equal(shouldInclude('docs\\guide.md'), true)
  assert.equal(shouldInclude('node_modules\\pkg\\README.md'), false)
})
