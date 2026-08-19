// Coverage for lib/repo-runtime/queries.mjs — the read-only repo lookups the
// CLI (`kb repo show/status/docs/search`, `kb rewrite list`,
// `kb canonical list/show`) depends on.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import os from 'os'

import * as repoRt from '../../lib/repo-runtime/index.mjs'

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-q-'))
  const dirs = [
    'config/repos',
    'wiki/repos/Demo-Repo/repo-docs/docs',
    'wiki/repos/Demo-Repo/canonical',
    'wiki/repos/Demo-Repo/rewrites/plans',
  ]
  for (const d of dirs) fs.mkdirSync(path.join(root, d), { recursive: true })

  const w = (rel, body) => fs.writeFileSync(path.join(root, rel), body)

  w('config/repos/registry.json', JSON.stringify({
    version: '1.0',
    repos: [{
      repo_name: 'Demo-Repo',
      status: 'active',
      last_synced_commit: 'abc1234',
      last_sync_at: '2026-08-01T00:00:00.000Z',
      markdown_file_count: 99,
    }],
  }, null, 2))

  w('wiki/repos/Demo-Repo/repo-docs/README.md', '# Readme\n\nauthentication flow overview\n')
  w('wiki/repos/Demo-Repo/repo-docs/docs/api.md', '# API\n\nendpoints and authentication tokens\n')
  w('wiki/repos/Demo-Repo/repo-docs/docs/notes.txt', 'not markdown, must be ignored')

  w('wiki/repos/Demo-Repo/canonical/PRD.md',
    '---\ntitle: Product Requirements — Demo\ndoc_type: prd\nstatus: draft\n---\n\nbody\n')
  w('wiki/repos/Demo-Repo/canonical/TECH_STACK.md',
    '---\ntitle: Tech Stack — Demo\ndoc_type: tech_stack\nstatus: current\n---\n\nstack\n')

  w('wiki/repos/Demo-Repo/rewrites/plans/2026-04-10-migration.md',
    '---\ntitle: Migration Plan\ntype: repo-plan\nproject: demo\nstatus: proposed\n---\n\nplan\n')

  return root
}

// ─── resolveRepoWikiDir ───────────────────────────────────────────────────

test('resolveRepoWikiDir matches the on-disk directory case-insensitively', () => {
  const root = makeFixture()
  const exact = repoRt.resolveRepoWikiDir(root, 'Demo-Repo')
  const lower = repoRt.resolveRepoWikiDir(root, 'demo-repo')
  assert.equal(exact, path.join(root, 'wiki/repos/Demo-Repo'))
  assert.equal(lower, exact)
})

test('resolveRepoWikiDir returns null for an unknown repo', () => {
  const root = makeFixture()
  assert.equal(repoRt.resolveRepoWikiDir(root, 'nope'), null)
})

test('resolveRepoWikiDir rejects a traversal segment', () => {
  const root = makeFixture()
  assert.throws(() => repoRt.resolveRepoWikiDir(root, '../..'), /invalid repo name/)
})

// ─── loadRepoMetadata ─────────────────────────────────────────────────────

test('loadRepoMetadata returns the registry record with a live doc count', () => {
  const root = makeFixture()
  const meta = repoRt.loadRepoMetadata(root, 'Demo-Repo')
  assert.equal(meta.repo_name, 'Demo-Repo')
  assert.equal(meta.last_synced_commit, 'abc1234')
  // Two .md files under repo-docs; the .txt is not counted.
  assert.equal(meta.docCount, 2)
  assert.equal(meta.wiki_dir, 'wiki/repos/Demo-Repo')
})

test('loadRepoMetadata falls back to a case-insensitive repo_name match', () => {
  const root = makeFixture()
  assert.equal(repoRt.loadRepoMetadata(root, 'demo-repo').repo_name, 'Demo-Repo')
})

test('loadRepoMetadata returns null for an unregistered repo', () => {
  const root = makeFixture()
  assert.equal(repoRt.loadRepoMetadata(root, 'ghost'), null)
})

// ─── listRepoDocs ─────────────────────────────────────────────────────────

test('listRepoDocs lists markdown only, relative to repo-docs, sorted', () => {
  const root = makeFixture()
  const docs = repoRt.listRepoDocs(root, 'Demo-Repo')
  assert.deepEqual(docs.map(d => d.path), ['README.md', 'docs/api.md'])
  assert.ok(docs.every(d => d.bytes > 0))
})

test('listRepoDocs narrows to a section', () => {
  const root = makeFixture()
  assert.deepEqual(repoRt.listRepoDocs(root, 'Demo-Repo', 'docs').map(d => d.path), ['docs/api.md'])
})

test('listRepoDocs rejects a section that escapes repo-docs', () => {
  const root = makeFixture()
  assert.throws(() => repoRt.listRepoDocs(root, 'Demo-Repo', '../canonical'), /escapes root/)
})

test('listRepoDocs returns empty for an unknown repo', () => {
  const root = makeFixture()
  assert.deepEqual(repoRt.listRepoDocs(root, 'ghost'), [])
})

// ─── searchRepoDocs ───────────────────────────────────────────────────────

test('searchRepoDocs scores one point per matching term', () => {
  const root = makeFixture()
  const hits = repoRt.searchRepoDocs(root, 'Demo-Repo', 'authentication tokens')
  assert.equal(hits.length, 2)
  assert.equal(hits[0].path, 'docs/api.md')  // matches both terms
  assert.equal(hits[0].score, 2)
  assert.equal(hits[1].score, 1)
})

test('searchRepoDocs honours limit and an empty query', () => {
  const root = makeFixture()
  assert.equal(repoRt.searchRepoDocs(root, 'Demo-Repo', 'authentication', { limit: 1 }).length, 1)
  assert.deepEqual(repoRt.searchRepoDocs(root, 'Demo-Repo', '   '), [])
})

// ─── rewrites and canonical ───────────────────────────────────────────────

test('listRepoRewrites reads frontmatter for each artifact', () => {
  const root = makeFixture()
  const rewrites = repoRt.listRepoRewrites(root, 'Demo-Repo')
  assert.equal(rewrites.length, 1)
  assert.equal(rewrites[0].status, 'proposed')
  assert.equal(rewrites[0].project, 'demo')
  assert.equal(rewrites[0].type, 'repo-plan')
  assert.equal(rewrites[0].path, 'wiki/repos/Demo-Repo/rewrites/plans/2026-04-10-migration.md')
})

test('listRepoCanonical lists docs by name with titles', () => {
  const root = makeFixture()
  const docs = repoRt.listRepoCanonical(root, 'Demo-Repo')
  assert.deepEqual(docs.map(d => d.name), ['PRD', 'TECH_STACK'])
  assert.equal(docs[0].title, 'Product Requirements — Demo')
  assert.equal(docs[1].status, 'current')
})

test('readRepoCanonical resolves a doc name case-insensitively, with or without .md', () => {
  const root = makeFixture()
  assert.match(repoRt.readRepoCanonical(root, 'Demo-Repo', 'PRD'), /Product Requirements/)
  assert.match(repoRt.readRepoCanonical(root, 'Demo-Repo', 'prd'), /Product Requirements/)
  assert.match(repoRt.readRepoCanonical(root, 'Demo-Repo', 'prd.md'), /Product Requirements/)
})

test('readRepoCanonical returns null for a missing doc and rejects traversal', () => {
  const root = makeFixture()
  assert.equal(repoRt.readRepoCanonical(root, 'Demo-Repo', 'NOPE'), null)
  assert.equal(repoRt.readRepoCanonical(root, 'Demo-Repo', ''), null)
  assert.throws(() => repoRt.readRepoCanonical(root, 'Demo-Repo', '../../../etc/passwd'), /escapes root/)
})
