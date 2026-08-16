// Redaction layer tests.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { redact, redactDefault, loadCustomRules, _DEFAULT_RULES } from '../../lib/agent-runtime/redaction.mjs'

test('redaction: emails scrubbed', () => {
  const r = redactDefault('Contact me at jay@example.com or jay+work@acme.io anytime.')
  assert.equal(r.redacted.includes('jay@example.com'), false)
  assert.equal(r.redacted.includes('jay+work@acme.io'), false)
  assert.equal(r.hits.find(h => h.rule === 'email').count, 2)
})

test('redaction: phone us format scrubbed', () => {
  const r = redactDefault('Call 555-123-4567 or (415) 555 9000.')
  assert.equal(r.redacted.includes('555-123-4567'), false)
  assert.ok(r.hits.find(h => h.rule === 'phone-us').count >= 1)
})

test('redaction: SSN scrubbed', () => {
  const r = redactDefault('SSN: 123-45-6789.')
  assert.equal(r.redacted.includes('123-45-6789'), false)
  assert.equal(r.hits.find(h => h.rule === 'ssn').count, 1)
})

test('redaction: JWT scrubbed', () => {
  const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYXkiLCJpYXQiOjEifQ.aaaaaaaaaaaaaaaaaaaa'
  const r = redactDefault(`token=${jwt}`)
  assert.equal(r.redacted.includes(jwt), false)
})

test('redaction: AWS key prefix scrubbed', () => {
  const r = redactDefault('key=AKIAIOSFODNN7EXAMPLE')
  assert.equal(r.redacted.includes('AKIAIOSFODNN7EXAMPLE'), false)
})

test('redaction: PEM private key scrubbed', () => {
  const block = '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----'
  const r = redactDefault(`leaked: ${block}`)
  assert.equal(r.redacted.includes('BEGIN RSA PRIVATE KEY'), false)
  assert.equal(r.redacted.includes('[PRIVATE_KEY]'), true)
})

test('redaction: hits never contain redacted content', () => {
  const r = redactDefault('jay@example.com 555-123-4567 123-45-6789')
  for (const h of r.hits) {
    assert.equal(typeof h.rule, 'string')
    assert.equal(typeof h.count, 'number')
    // hit objects should not leak content
    assert.equal(Object.keys(h).sort().join(','), 'count,rule')
  }
})

test('redaction: clean content untouched', () => {
  const r = redactDefault('Decision: pivot to Q3 onboarding. Owner: jay.')
  assert.equal(r.total, 0)
  assert.equal(r.redacted, 'Decision: pivot to Q3 onboarding. Owner: jay.')
})

test('redaction: custom rule via redact()', () => {
  const rules = [{ id: 'project-codename', re: /\bACME-X\b/g, replacement: '[CODENAME]' }]
  const r = redact('Project ACME-X launched.', rules)
  assert.equal(r.redacted.includes('ACME-X'), false)
  assert.equal(r.hits[0].rule, 'project-codename')
})

test('redaction: default rules list is non-empty', () => {
  assert.ok(_DEFAULT_RULES.length >= 5)
})

test('redaction: one invalid custom rule does not drop the others', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'redaction-'))
  fs.mkdirSync(path.join(dir, 'config'), { recursive: true })
  fs.writeFileSync(path.join(dir, 'config', 'redaction.yaml'), [
    'rules:',
    '  - id: good-before',
    '    pattern: "\\\\bBEFORE\\\\b"',
    '  - id: broken',
    '    pattern: "[unclosed"',
    '  - id: good-after',
    '    pattern: "\\\\bAFTER\\\\b"',
  ].join('\n'))
  const rules = loadCustomRules(dir)
  assert.deepEqual(rules.map(r => r.id), ['good-before', 'good-after'])
  const r = redact('BEFORE and AFTER', rules)
  assert.equal(r.redacted, '[GOOD-BEFORE] and [GOOD-AFTER]')
})

test('redaction placeholders do not swallow the following separator', () => {
  // The credit-card rule's trailing optional [ -] used to eat the space after
  // the match, gluing the placeholder to the next word in every redacted doc.
  const cases = [
    ['Timestamp 1755331200000 in the log', 'Timestamp [CARD] in the log'],
    ['card 4111 1111 1111 1111 ok', 'card [CARD] ok'],
    ['card 4111-1111-1111-1111 ok', 'card [CARD] ok'],
    ['Call me at 555-123-4567 tomorrow', 'Call me at [PHONE] tomorrow'],
    ['ssn 123-45-6789 filed', 'ssn [SSN] filed'],
    ['mail a@b.co now', 'mail [EMAIL] now'],
  ]
  for (const [input, expected] of cases) {
    assert.equal(redactDefault(input).redacted, expected, input)
  }
})

test('git SHA-1s survive the aws-secret heuristic', () => {
  // 40 chars from [A-Za-z0-9/+=] also describes every git SHA-1, so this rule
  // used to shred the commit hashes that architecture notes are built on.
  const sha = 'da39a3ee5e6b4b0d3255bfef95601890afd80709'
  const r = redactDefault(`Fixed in ${sha} — see the PR.`)
  assert.equal(r.redacted.includes(sha), true, 'a git SHA must not be redacted')
  assert.equal(r.total, 0)

  // …while a genuine AWS-shaped secret still is.
  const secret = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
  assert.equal(secret.length, 40)
  const s = redactDefault(`aws_secret_access_key = ${secret}`)
  assert.equal(s.redacted.includes(secret), false)
  assert.equal(s.hits.find(h => h.rule === 'aws-secret').count, 1)
})
