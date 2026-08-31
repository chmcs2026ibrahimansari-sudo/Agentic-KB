// Characterization tests for lib/agent-runtime/safe-path.mjs.
//
// These two functions are the traversal chokepoint for every caller-supplied
// slug/section/repo/type token in the repo: cli/kb.js (wiki read/write,
// repo progress), mcp/server.js (read_article, list_articles, get_repo_home,
// search_repo_docs, write_rewrite_artifact) and lib/repo-runtime/queries.mjs.
// web/src/lib/safe-path.ts is a byte-identical TypeScript twin used by the
// /api/article, /api/process, /api/compile and /api/query routes.
//
// Until now the module had no direct test — it was only exercised incidentally
// through call sites. These tests pin CURRENT behaviour, including the two
// places where it is deliberately permissive (see the divergence test at the
// bottom), so that a future edit to either copy has to state its intent.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'

import { safeJoin, validateSlug } from '../../lib/agent-runtime/safe-path.mjs'
import { checkUnsafePath } from '../../lib/agent-runtime/path-safety.mjs'

const ROOT = path.resolve('/tmp/safe-path-root')

test('safeJoin returns a resolved path under the root', () => {
  assert.equal(safeJoin(ROOT, 'a', 'b.md'), path.join(ROOT, 'a', 'b.md'))
  assert.equal(safeJoin(ROOT, 'a/b.md'), path.join(ROOT, 'a', 'b.md'))
})

test('safeJoin with no parts returns the root itself', () => {
  // joined === resolvedRoot is explicitly allowed by the guard, so callers
  // that pass a possibly-empty tail do not get a spurious escape error.
  assert.equal(safeJoin(ROOT), ROOT)
  assert.equal(safeJoin(ROOT, ''), ROOT)
})

test('safeJoin resolves the root, so a relative root still anchors correctly', () => {
  assert.equal(safeJoin('.', 'x.md'), path.join(path.resolve('.'), 'x.md'))
})

test('safeJoin rejects a segment that escapes the root', () => {
  assert.throws(() => safeJoin(ROOT, '..', 'x'), /escapes root/)
  assert.throws(() => safeJoin(ROOT, '../x'), /escapes root/)
  assert.throws(() => safeJoin(ROOT, 'a', '../../x'), /escapes root/)
})

test('safeJoin rejects a sibling directory that shares the root prefix', () => {
  // The guard compares against `resolvedRoot + path.sep`, not a bare prefix,
  // so /tmp/safe-path-root-evil must not pass as "inside" /tmp/safe-path-root.
  assert.throws(() => safeJoin(ROOT, '../safe-path-root-evil/x'), /escapes root/)
})

test('safeJoin rejects absolute, null-byte and non-string segments', () => {
  assert.throws(() => safeJoin(ROOT, '/etc/passwd'), /absolute segment/)
  assert.throws(() => safeJoin(ROOT, 'a\0b'), /null byte in segment/)
  assert.throws(() => safeJoin(ROOT, 5), /non-string segment/)
  assert.throws(() => safeJoin(ROOT, null), /non-string segment/)
  assert.throws(() => safeJoin(ROOT, undefined), /non-string segment/)
})

test('safeJoin normalizes an interior dot-segment instead of rejecting it', () => {
  // Documented, not accidental: the check is "where did it land", not "how did
  // it get there". `a/../b` resolves back inside the root, so it is allowed and
  // silently normalized. Callers that need the literal path rejected must run
  // checkUnsafePath() first — see the divergence test below.
  assert.equal(safeJoin(ROOT, 'a/../b'), path.join(ROOT, 'b'))
  assert.equal(safeJoin(ROOT, './a'), path.join(ROOT, 'a'))
})

test('validateSlug accepts alphanumerics plus . _ - and /', () => {
  assert.equal(validateSlug('agentic-kb'), 'agentic-kb')
  assert.equal(validateSlug('a-b_c.d/e'), 'a-b_c.d/e')
  assert.equal(validateSlug('MixedCase123'), 'MixedCase123')
  assert.equal(validateSlug('a'.repeat(200)), 'a'.repeat(200))
})

test('validateSlug requires an alphanumeric first character', () => {
  for (const bad of ['-x', '_x', '.x', '/x', ' x']) {
    assert.throws(() => validateSlug(bad), /must match/, bad)
  }
})

test('validateSlug rejects empty, over-long and non-string input', () => {
  assert.throws(() => validateSlug(''), /empty or too long/)
  assert.throws(() => validateSlug('a'.repeat(201)), /empty or too long/)
  assert.throws(() => validateSlug(null), /empty or too long/)
  assert.throws(() => validateSlug(42), /empty or too long/)
})

test('validateSlug rejects .. anywhere, not just as a whole segment', () => {
  assert.throws(() => validateSlug('a/../b'), /contains \.\./)
  assert.throws(() => validateSlug('a..b'), /contains \.\./)
  assert.throws(() => validateSlug('x..'), /contains \.\./)
})

test('validateSlug rejects the characters that make a slug more than a name', () => {
  for (const bad of ['a\0b', 'a\nb', 'a\\b', 'a%2e', 'a b', 'a:b', 'a*', 'a?']) {
    assert.throws(() => validateSlug(bad), /must match/, JSON.stringify(bad))
  }
})

test('validateSlug reports the caller-supplied kind in its error', () => {
  assert.throws(() => validateSlug('!x', 'repo name'), /invalid repo name:/)
  assert.throws(() => validateSlug('', 'section'), /invalid section:/)
})

test('validateSlug is more permissive than checkUnsafePath on empty segments', () => {
  // Known divergence between the two guards, pinned so a future consolidation
  // has to decide deliberately rather than discover it. `a//b` and `a/` both
  // pass validateSlug (the regex allows repeated and trailing '/') while
  // checkUnsafePath rejects the first as a double slash. Neither escapes the
  // root once it reaches safeJoin, so this is a naming-hygiene gap and not a
  // traversal, but the two are documented as the same chokepoint.
  assert.equal(validateSlug('a//b'), 'a//b')
  assert.equal(validateSlug('a/'), 'a/')
  assert.equal(checkUnsafePath('a//b'), 'double slash')
  assert.equal(checkUnsafePath('a/'), null)

  assert.equal(safeJoin(ROOT, validateSlug('a//b')), path.join(ROOT, 'a', 'b'))
})
