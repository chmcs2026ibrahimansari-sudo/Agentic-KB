#!/usr/bin/env node
/**
 * scrub-raw-pii — keep raw/ committable so the night jobs' dirty-worktree
 * gate can never deadlock.
 *
 * ## Why this exists
 *
 * Scout captures public web pages into `raw/`. Marketing pages routinely carry
 * a sales phone number or a contact email. `scripts/hooks/pre-commit` (rightly)
 * refuses to commit those strings, and the Refinery/Scout/Editor playbooks
 * (rightly) refuse to run while `raw/` is dirty. The result is a deadlock: the
 * file can neither be committed nor ignored, and every night job blocks on it
 * forever. On 2026-08-20 `raw/framework-docs/lumay-ai.md` — one vendor's public
 * sales number — had blocked 41 consecutive Refinery runs this way.
 *
 * ## Scope: dirty files only
 *
 * The pre-commit hook scans the *staged diff*, not whole files, so content
 * already in history never re-triggers it. Only new or modified files can
 * deadlock a commit. This script therefore operates strictly on what
 * `git status --porcelain` reports as dirty under `raw/`, which keeps the blast
 * radius to the handful of files a capture job just wrote. Use `--audit` to
 * report across all of raw/ without writing anything.
 *
 * ## Redact vs. report
 *
 * Only unambiguous *contact* PII is auto-redacted: US phone numbers and email
 * addresses. These carry no analytical value in a captured framework doc, so
 * removing them costs the KB nothing.
 *
 * Anything else the hook objects to — compensation figures, personal, family or
 * therapy context — is reported and left alone. Those patterns are prone to
 * false positives on third-party quotes (the hook's own comments record
 * `summary-garrytan-meta-meta-prompting.md` being wrongly blocked on 2026-08-18
 * over a hypothetical "$300/hour therapist"), and their meaning depends on the
 * exact text. Mangling or moving them automatically would be worse than
 * blocking, so the script exits non-zero and lets a human decide.
 *
 * ## Rule 1
 *
 * Before any in-place edit, the pristine original is copied to
 * `.pii-quarantine/` (gitignored, and outside raw/ so no raw-walker indexes
 * it). Nothing is destroyed — "raw is the source of truth" is preserved
 * byte-for-byte on disk, and the redacted file carries a `pii_original:`
 * pointer back to it.
 *
 * ## Coupling note
 *
 * The patterns below mirror a subset of the deny-list in
 * `scripts/hooks/pre-commit`. If you add a contact-PII pattern there, add it
 * here too, or raw/ can deadlock again.
 *
 * Usage:
 *   node scripts/scrub-raw-pii.mjs             # dry run over dirty raw/ files
 *   node scripts/scrub-raw-pii.mjs --execute   # apply redactions
 *   node scripts/scrub-raw-pii.mjs --audit     # report over ALL of raw/, never writes
 *   node scripts/scrub-raw-pii.mjs --json      # machine-readable summary
 *
 * Exit codes:
 *   0  nothing blocking a commit, or --execute completed successfully
 *   1  unexpected error
 *   2  found something needing attention (dry run with hits, or any
 *      non-redactable match). Useful as a preflight gate.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')
const RAW_DIR = path.join(REPO_ROOT, 'raw')
// Deliberately OUTSIDE raw/. A first attempt used raw/_quarantine/ and the
// compiler immediately picked the pristine copies up as new sources ("Found
// 171 raw docs, compiling 3"), which would have produced duplicate summaries.
// Every raw/ walker in the repo — compile, refinery, scout, ingest-dedup —
// would need its own exclusion. Keeping the quarantine out of the tree is one
// change instead of N, and cannot be forgotten by a future walker.
const QUARANTINE_REL = '.pii-quarantine'
const QUARANTINE_DIR = path.join(REPO_ROOT, QUARANTINE_REL)

const REDACTION = '[PII-REDACTED]'

// Contact PII — safe to redact in place, no analytical value in a capture.
const REDACTABLE = [
  {
    name: 'us-phone',
    // Mirrors the hook's phone pattern, plus an optional leading country-code
    // prefix so it is consumed whole rather than leaving a stray "+1" behind.
    re: /(?:\+?1[-. ]?)?\(?\b[0-9]{3}\)?[-. ][0-9]{3}[-. ][0-9]{4}\b/g,
  },
  {
    name: 'email',
    re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  },
]

// Meaning-bearing sensitive content — reported, never auto-rewritten.
const REPORT_ONLY = [
  { name: 'compensation', re: /\$[0-9]{3},?[0-9]{3}\b|\$[0-9]+[kK]\b/ },
  { name: 'personal-family', re: /\b(my|our) (kids|children|parents|spouse|wife|husband)\b/i },
  { name: 'personal-therapy', re: /\b(my|our|jay'?s) therap(y|ist)\b|\bemdr\b/i },
  { name: 'interview-context', re: /\b(hiring manager|interview) (cycle|prep|round|cheat ?sheet)\b/i },
]

function parseArgs(argv) {
  const args = new Set(argv.slice(2))
  return {
    execute: args.has('--execute'),
    audit: args.has('--audit'),
    json: args.has('--json'),
  }
}

/** Dirty (untracked or modified) files under raw/, per git. */
async function dirtyRawFiles() {
  // `--untracked-files=all` is load-bearing. Porcelain's default (`normal`)
  // collapses a wholly-untracked directory to a single entry ending in `/` —
  // a capture into a new `raw/<category>/` reports as `?? raw/<category>/`,
  // which fails the `.md` extension test below and is dropped. Every file in
  // that directory then goes unscanned and the script prints "raw/ has no
  // dirty files" and exits 0, which is the exact deadlock it exists to
  // prevent. `=all` lists each file individually.
  const args = ['status', '--porcelain', '--untracked-files=all', '--', 'raw']
  const { stdout } = await execFileAsync('git', args, {
    cwd: REPO_ROOT,
    maxBuffer: 10 * 1024 * 1024,
  })
  const files = []
  for (const line of stdout.split('\n')) {
    if (!line.trim()) continue
    // Porcelain v1: XY <path>, or XY <old> -> <new> for renames.
    let p = line.slice(3).trim()
    const arrow = p.indexOf(' -> ')
    if (arrow !== -1) p = p.slice(arrow + 4)
    p = p.replace(/^"|"$/g, '')
    if (!p.startsWith('raw/')) continue
    if (p.startsWith(`${QUARANTINE_REL}/`)) continue
    if (!/\.(md|markdown|txt)$/i.test(p)) continue
    files.push(path.join(REPO_ROOT, p))
  }
  return files
}

async function walkAll(dir, acc = []) {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch (err) {
    if (err.code === 'ENOENT') return acc
    throw err
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (full === QUARANTINE_DIR) continue
    if (entry.isDirectory()) await walkAll(full, acc)
    else if (entry.isFile() && /\.(md|markdown|txt)$/i.test(entry.name)) acc.push(full)
  }
  return acc
}

function findRedactable(content) {
  const hits = []
  for (const { name, re } of REDACTABLE) {
    const matches = content.match(new RegExp(re.source, re.flags))
    if (matches && matches.length) hits.push({ name, count: matches.length })
  }
  return hits
}

function findReportOnly(content) {
  return REPORT_ONLY.filter(({ re }) => re.test(content)).map(({ name }) => name)
}

function applyRedactions(content) {
  let out = content
  for (const { re } of REDACTABLE) {
    out = out.replace(new RegExp(re.source, re.flags), REDACTION)
  }
  return out
}

/**
 * Insert or refresh `pii_redacted` / `pii_original` in the YAML frontmatter.
 * Files with no frontmatter get a minimal block rather than losing provenance.
 */
function stampFrontmatter(content, relOriginal) {
  const stamp = [
    'pii_redacted: true',
    `pii_original: "${relOriginal}"`,
    'pii_redacted_by: "scripts/scrub-raw-pii.mjs"',
    `pii_redacted_date: "${new Date().toISOString().slice(0, 10)}"`,
  ]

  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!fmMatch) return `---\n${stamp.join('\n')}\n---\n\n${content}`

  const body = fmMatch[1]
    .split('\n')
    .filter((line) => !/^pii_(redacted|original|redacted_by|redacted_date):/.test(line))
    .join('\n')
    .replace(/\n+$/, '')

  return content.replace(fmMatch[0], `---\n${body}\n${stamp.join('\n')}\n---\n`)
}

async function copyToQuarantine(absFile) {
  const rel = path.relative(RAW_DIR, absFile)
  const dest = path.join(QUARANTINE_DIR, rel)
  await fs.mkdir(path.dirname(dest), { recursive: true })
  // Never clobber an existing pristine original — the first capture wins.
  try {
    await fs.access(dest)
  } catch {
    await fs.copyFile(absFile, dest)
  }
  return path.relative(REPO_ROOT, dest)
}

async function main() {
  const { execute, audit, json } = parseArgs(process.argv)

  if (audit && execute) {
    console.error('scrub-raw-pii: --audit is report-only and cannot be combined with --execute')
    process.exit(1)
  }

  const files = audit ? await walkAll(RAW_DIR) : await dirtyRawFiles()
  const redacted = []
  const flagged = []

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8')
    const rel = path.relative(REPO_ROOT, file)

    const reportOnly = findReportOnly(content)
    if (reportOnly.length) flagged.push({ file: rel, triggers: reportOnly })

    const hits = findRedactable(content)
    if (!hits.length) continue

    if (execute && !reportOnly.length) {
      const originalPath = await copyToQuarantine(file)
      await fs.writeFile(file, stampFrontmatter(applyRedactions(content), originalPath), 'utf8')
      redacted.push({ file: rel, hits, originalPath })
    } else {
      redacted.push({ file: rel, hits, originalPath: null })
    }
  }

  const summary = {
    mode: audit ? 'audit' : execute ? 'execute' : 'dry-run',
    scope: audit ? 'all raw/' : 'dirty raw/ files',
    scanned: files.length,
    redacted,
    flagged,
  }

  if (json) {
    console.log(JSON.stringify(summary, null, 2))
  } else {
    console.log(`scrub-raw-pii — ${summary.mode} (${summary.scope})`)
    console.log(`  scanned:   ${files.length} file(s)`)
    console.log(`  ${execute ? 'redacted:' : 'redactable:'}  ${redacted.length}`)
    console.log(`  flagged:   ${flagged.length} (needs a human)`)

    for (const r of redacted) {
      console.log(`    · ${r.file} — ${r.hits.map((h) => `${h.name}×${h.count}`).join(', ')}`)
      if (r.originalPath) console.log(`        original preserved → ${r.originalPath}`)
    }
    for (const f of flagged) {
      console.log(`    ! ${f.file} — ${f.triggers.join(', ')}`)
      console.log('        not auto-redactable; review by hand (may be a false positive)')
    }

    if (!files.length) {
      console.log('\n  raw/ has no dirty files — nothing to do.')
    } else if (!redacted.length && !flagged.length) {
      console.log('\n  Dirty raw/ files carry no contact PII — safe to commit.')
    } else if (!execute && !audit) {
      console.log('\n  Re-run with --execute to apply redactions.')
    }
  }

  if (flagged.length) process.exit(2)
  if (!execute && redacted.length) process.exit(2)
  process.exit(0)
}

main().catch((err) => {
  console.error(`scrub-raw-pii failed: ${err.stack || err.message}`)
  process.exit(1)
})
