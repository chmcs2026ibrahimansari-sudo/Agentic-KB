#!/usr/bin/env node
/**
 * backfill-ids.mjs — add a stable `id: <ulid>` to every markdown file in
 * wiki/ and raw/ that doesn't have one. Idempotent.
 *
 * Usage: node scripts/backfill-ids.mjs [vaultRoot]
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const VAULT = path.resolve(process.argv[2] || process.cwd())
const SCAN = ['wiki', 'raw']
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function enc(n, len) {
  let o = ''
  for (let i = 0; i < len; i++) { o = CROCKFORD[Number(n & 31n)] + o; n >>= 5n }
  return o
}
function ulid() {
  const t = enc(BigInt(Date.now()), 10)
  let r = 0n
  for (const b of crypto.randomBytes(10)) r = (r << 8n) | BigInt(b)
  return t + enc(r, 16)
}
// tmp+rename in the same directory: a crash mid-write must not truncate a
// wiki article (same rule the web id-backfill route follows).
function writeAtomic(abs, content) {
  const tmp = `${abs}.tmp-${process.pid}`
  fs.writeFileSync(tmp, content, 'utf8')
  fs.renameSync(tmp, abs)
}
function* walk(dir) {
  let ents
  try { ents = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
  for (const e of ents) {
    if (e.name.startsWith('.')) continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) yield* walk(full)
    else if (e.isFile() && e.name.endsWith('.md')) yield full
  }
}

let added = 0, skipped = 0, noFm = 0
for (const sub of SCAN) {
  const base = path.join(VAULT, sub)
  if (!fs.existsSync(base)) continue
  for (const abs of walk(base)) {
    const content = fs.readFileSync(abs, 'utf8')
    // \r?\n, not \n: a CRLF file (Windows-authored, or synced from GitHub
    // into wiki/repos/*/repo-docs/) failed the LF-only match, fell into the
    // "no frontmatter" branch and got a *second* frontmatter block prepended.
    // parseFrontmatter then read only the injected block, so title/type/status
    // were lost — and because the file now has a valid `id:`, a re-run skips
    // it and the damage is permanent. Reconstruct with the file's own EOL so
    // the rest of the bytes are untouched.
    const eol = content.includes('\r\n') ? '\r\n' : '\n'
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (fmMatch) {
      if (/^id:\s*\S/m.test(fmMatch[1])) { skipped++; continue }
      const updated = `---${eol}id: ${ulid()}${eol}${fmMatch[1]}${eol}---${content.slice(fmMatch[0].length)}`
      writeAtomic(abs, updated)
      added++
    } else {
      // prepend minimal frontmatter
      const updated = `---${eol}id: ${ulid()}${eol}---${eol}${eol}${content}`
      writeAtomic(abs, updated)
      noFm++
      added++
    }
  }
}
console.log(`backfill-ids: added=${added} skipped=${skipped} (no-frontmatter=${noFm}) vault=${VAULT}`)
