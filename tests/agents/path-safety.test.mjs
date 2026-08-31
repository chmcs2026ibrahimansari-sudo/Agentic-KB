// Characterization tests for lib/agent-runtime/path-safety.mjs.
//
// checkUnsafePath is the shared reject-list behind BOTH write guards
// (lib/agent-runtime/paths.mjs assertWriteAllowed and vault-writeback.mjs),
// and lib/repo-runtime/paths.mjs assertSafeSegment runs every repo name,
// tier, agent id, bus channel and rewrite type through it before those values
// are interpolated into a wiki/repos/* path.
//
// tests/agents/fuzz-paths.test.mjs already proves that adversarial paths are
// rejected *somewhere* in assertWriteAllowed. It does not pin which rule fired
// or what reason string came back, and it never exercises the accept side.
// The reason string is caller-visible (it is returned as `reason` on a denied
// write and surfaces in CLI/MCP errors), so it is behaviour, not a detail.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { checkUnsafePath, UNSAFE_CHECKS } from '../../lib/agent-runtime/path-safety.mjs'

test('a plain relative markdown path is accepted', () => {
  assert.equal(checkUnsafePath('wiki/agents/workers/dev-1/gotchas.md'), null)
  assert.equal(checkUnsafePath('a.md'), null)
})

test('each reject rule returns its own reason string', () => {
  const expected = [
    [null, 'non-string path'],
    [undefined, 'non-string path'],
    [42, 'non-string path'],
    ['', 'empty path'],
    ['a\0b', 'null byte in path'],
    ['a\nb', 'newline in path'],
    ['a\rb', 'newline in path'],
    ['a\\b', 'backslash in path'],
    ['a%2e%2e/b', 'url-encoded traversal characters'],
    ['a%2Fb', 'url-encoded traversal characters'],
    ['/etc/passwd', 'absolute path (leading slash)'],
    ['C:/windows', 'windows drive letter'],
    ['c:x', 'windows drive letter'],
    ['~/x', 'home-directory expansion'],
    ['file:///etc/passwd', 'url scheme'],
    ['https://example.com/x', 'url scheme'],
    ['a//b', 'double slash'],
    ['../x', 'dot-segment traversal'],
    ['a/./b', 'dot-segment traversal'],
    ['.', 'dot-segment traversal'],
    ['..', 'dot-segment traversal'],
    ['a..b', 'parent-traversal substring'],
  ]
  for (const [input, reason] of expected) {
    assert.equal(checkUnsafePath(input), reason, JSON.stringify(input))
  }
})

test('rule order is stable: the first matching rule wins', () => {
  // A path that trips several rules reports the earliest one. Callers log this
  // string, so reordering UNSAFE_CHECKS is an observable change.
  assert.equal(checkUnsafePath('/../a\\b'), 'backslash in path')
  assert.equal(checkUnsafePath('..\n'), 'newline in path')
  assert.equal(checkUnsafePath('/..'), 'absolute path (leading slash)')
})

test('every declared check is a [predicate, reason] pair with a distinct reason', () => {
  assert.ok(UNSAFE_CHECKS.length > 0)
  const reasons = new Set()
  for (const entry of UNSAFE_CHECKS) {
    assert.equal(entry.length, 2)
    assert.equal(typeof entry[0], 'function')
    assert.equal(typeof entry[1], 'string')
    reasons.add(entry[1])
  }
  // 'newline in path' is shared by \r and \n inside one predicate, so the
  // reason count equals the rule count.
  assert.equal(reasons.size, UNSAFE_CHECKS.length)
})

test('the parent-traversal substring rule catches .. that is not a whole segment', () => {
  // The dot-segment rule only looks at whole components; the substring rule is
  // what stops 'a..b' and 'wiki/x..' from reaching a filesystem call.
  assert.equal(checkUnsafePath('wiki/x..'), 'parent-traversal substring')
  assert.equal(checkUnsafePath('wiki/..x/y.md'), 'parent-traversal substring')
})

test('known accepted inputs: the list is a reject-list, not a charset allow-list', () => {
  // Pinned deliberately. These all pass checkUnsafePath today. None of them
  // escape a root once the caller resolves them, but they are also not names
  // any legitimate producer in this repo emits, and a future tightening should
  // have to change a test rather than silently alter guard semantics.
  //
  //  - single-level %2e/%2f are rejected above, double-encoded ones are not;
  //    nothing in this repo URL-decodes a path after the check, so this is a
  //    latent gap rather than a live bypass.
  //  - only \r and \n are treated as control characters; \t and \f are not.
  //  - '~' is only rejected in leading position (no shell ever sees the path).
  //  - a trailing slash and a leading dot are both allowed.
  for (const accepted of [
    '%252e%252e/x',
    'a\tb.md',
    'a\fb.md',
    'wiki/~backup/x.md',
    '.hidden/x.md',
    'wiki/x/',
    'a b.md',
    'x%5cy.md',
  ]) {
    assert.equal(checkUnsafePath(accepted), null, JSON.stringify(accepted))
  }
})
