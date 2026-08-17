// Regression: every GitHub request made during a repo sync must be bounded.
// Node's fetch has no default timeout, so a socket that is accepted but never
// answered wedged syncRepo (and its MCP/CLI caller) forever.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { githubFetch } from '../../lib/repo-runtime/sync.mjs'

test('githubFetch aborts and reports the deadline', async () => {
  const realFetch = globalThis.fetch
  let sawSignal = null
  globalThis.fetch = (url, init) => {
    sawSignal = init.signal
    return new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () => {
        const err = new Error('aborted')
        err.name = 'AbortError'
        reject(err)
      })
    })
  }
  try {
    await assert.rejects(
      githubFetch('https://api.github.com/never-answers', {}, 25),
      /GitHub API did not respond within 25ms/,
    )
    assert.ok(sawSignal, 'an abort signal is passed through to fetch')
    assert.equal(sawSignal.aborted, true)
  } finally {
    globalThis.fetch = realFetch
  }
})

test('githubFetch clears its timer and passes through non-abort failures', async () => {
  const realFetch = globalThis.fetch
  globalThis.fetch = () => Promise.reject(Object.assign(new Error('ECONNREFUSED'), { name: 'TypeError' }))
  try {
    await assert.rejects(githubFetch('https://api.github.com/x', {}, 5_000), /ECONNREFUSED/)
  } finally {
    globalThis.fetch = realFetch
  }
})

test('githubFetch resolves normally inside the deadline', async () => {
  const realFetch = globalThis.fetch
  globalThis.fetch = () => Promise.resolve({ ok: true, status: 200 })
  try {
    const res = await githubFetch('https://api.github.com/x', {}, 5_000)
    assert.equal(res.status, 200)
  } finally {
    globalThis.fetch = realFetch
  }
})
