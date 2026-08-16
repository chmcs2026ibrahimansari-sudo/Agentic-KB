/**
 * freshness.mjs — V2 freshness scoring for context loading and promotion
 *
 * Computes a 0.0–1.0 freshness score using exponential decay from the
 * last-updated date. Each memory class has its own half-life and floor.
 *
 * Used by: context-loader.mjs (ranking), promotion-scorer.mjs (gate checks)
 */

import fs from 'fs'
import path from 'path'
import { parseFrontmatter } from './frontmatter.mjs'

// ── Half-life and floor by memory class ──────────────────────────────────────
export const FRESHNESS_PROFILES = {
  canonical: { halfLifeDays: 180, floor: 0.40, staleDays: 180 },
  personal:  { halfLifeDays:  90, floor: 0.50, staleDays:  90 },
  learned:   { halfLifeDays:  60, floor: 0.40, staleDays:  60 },
  session:   { halfLifeDays:   7, floor: 0.10, staleDays:   7 },
  working:   { halfLifeDays:   1, floor: 0.00, staleDays:   1 },
  // Exempt classes — always return 1.0
  profile:   { exempt: true },
  hot:       { exempt: true },
}

const DEFAULT_PROFILE = { halfLifeDays: 90, floor: 0.40, staleDays: 90 }

// ── Core decay formula ────────────────────────────────────────────────────────
/**
 * Compute freshness score for a given age in days.
 * score = floor + (1 - floor) * exp(-ln(2) * ageDays / halfLifeDays)
 *
 * @param {number} ageDays - Age in fractional days
 * @param {object} profile - { halfLifeDays, floor }
 * @returns {number} 0.0–1.0
 */
export function decayScore(ageDays, profile) {
  if (profile?.exempt) return 1.0
  // Destructure with per-field fallbacks: a truthy-but-partial profile (e.g.
  // { floor: 0.3 }) would otherwise leave halfLifeDays undefined and yield NaN.
  const {
    halfLifeDays = DEFAULT_PROFILE.halfLifeDays,
    floor = DEFAULT_PROFILE.floor,
  } = profile || {}
  if (ageDays <= 0) return 1.0
  const raw = floor + (1.0 - floor) * Math.exp(-Math.LN2 * ageDays / halfLifeDays)
  return Math.max(floor, Math.min(1.0, raw))
}

// ── Age extraction ────────────────────────────────────────────────────────────
/**
 * Get age in days for a file.
 * Uses frontmatter `updated:` field first, falls back to file mtime.
 *
 * @param {string} absPath - Absolute file path
 * @returns {number} Age in fractional days (0 = just now)
 */
// Frontmatter lives in the first few hundred bytes; getAgeInDays only needs
// the date fields out of it. Reading the whole page was ~2x the bytes and
// ~14x the wall time across a 694-page wiki, on a path that context-loader
// and batchScoreFreshness walk for every file on every load. Descriptor is
// closed in `finally` so a readSync throw (EISDIR, file swapped mid-scan)
// cannot leak it — same shape as readHead() in web/src/lib/ranking.ts.
const FM_HEAD_BYTES = 4096

function readFrontmatterHead(absPath) {
  let fd
  try {
    fd = fs.openSync(absPath, 'r')
    const buf = Buffer.alloc(FM_HEAD_BYTES)
    const bytes = fs.readSync(fd, buf, 0, FM_HEAD_BYTES, 0)
    const head = buf.subarray(0, bytes).toString('utf8')
    // Frontmatter longer than the window would parse as "no frontmatter" and
    // silently fall through to mtime, so re-read in full in that rare case.
    if (bytes === FM_HEAD_BYTES && head.startsWith('---') && head.indexOf('\n---', 3) === -1) {
      return fs.readFileSync(absPath, 'utf8')
    }
    return head
  } finally {
    if (fd !== undefined) { try { fs.closeSync(fd) } catch { /* already closed */ } }
  }
}

export function getAgeInDays(absPath) {
  let refDate = null

  // Try frontmatter updated/created field
  try {
    const parsed = parseFrontmatter(readFrontmatterHead(absPath))
    // parseFrontmatter returns { data, content, raw } — access .data for fields
    const fm = parsed?.data || parsed || {}
    const dateStr = fm.updated || fm.last_validated_at || fm.created || fm.date
    if (dateStr) {
      const d = new Date(dateStr)
      if (!isNaN(d.getTime())) refDate = d
    }
  } catch (_) { /* ignore */ }

  // Fall back to mtime
  if (!refDate) {
    try {
      const stat = fs.statSync(absPath)
      refDate = stat.mtime
    } catch (_) {
      return 0 // can't determine age, treat as fresh
    }
  }

  const ageMsec = Date.now() - refDate.getTime()
  return Math.max(0, ageMsec / 86_400_000)
}

// ── Memory class inference from path ─────────────────────────────────────────
/**
 * Infer memory class from a relative wiki path.
 *
 * @param {string} relPath
 * @returns {string} memory class name
 */
export function inferClass(relPath) {
  if (relPath.includes('/profile.md')) return 'profile'
  if (relPath.includes('/hot.md')) return 'hot'
  if (relPath.includes('working-memory/') || relPath.includes('active-task')) return 'working'
  if (relPath.includes('/learned/')) return 'learned'
  if (relPath.startsWith('wiki/personal/')) return 'personal'
  if (relPath.startsWith('wiki/agents/')) return 'learned'
  if (relPath.startsWith('wiki/system/bus/')) return 'session'
  if (relPath.startsWith('raw/qa/') || relPath.startsWith('raw/transcripts/')) return 'session'
  if (relPath.startsWith('wiki/')) return 'canonical'
  return 'session'
}

// ── Primary API ───────────────────────────────────────────────────────────────
/**
 * Score freshness for a file.
 *
 * @param {string} kbRoot - Absolute KB root
 * @param {string} relPath - Relative path within KB
 * @param {string} [memClass] - Override memory class (else inferred)
 * @returns {{ score: number, label: string, ageDays: number, profile: object }}
 */
export function scoreFreshness(kbRoot, relPath, memClass) {
  const cls = memClass || inferClass(relPath)
  const profile = FRESHNESS_PROFILES[cls] || DEFAULT_PROFILE

  if (profile.exempt) {
    return { score: 1.0, label: 'fresh', ageDays: 0, profile, memClass: cls }
  }

  const absPath = path.join(kbRoot, relPath)
  const ageDays = getAgeInDays(absPath)
  const score = decayScore(ageDays, profile)
  const label = freshnessLabel(score)

  return { score, label, ageDays, profile, memClass: cls }
}

/**
 * Is this file fresh enough for canonical promotion?
 * Returns false if stale (age > staleDays for its class).
 *
 * @param {string} kbRoot
 * @param {string} relPath
 * @param {string} [memClass]
 * @returns {boolean}
 */
export function isFreshForCanonical(kbRoot, relPath, memClass) {
  const cls = memClass || inferClass(relPath)
  const profile = FRESHNESS_PROFILES[cls] || DEFAULT_PROFILE
  if (profile.exempt) return true

  const absPath = path.join(kbRoot, relPath)
  const ageDays = getAgeInDays(absPath)
  return ageDays <= (profile.staleDays ?? 999)
}

/**
 * Human-readable freshness label from score.
 *
 * @param {number} score 0.0–1.0
 * @returns {'fresh'|'aging'|'stale'|'expired'}
 */
export function freshnessLabel(score) {
  if (score >= 0.85) return 'fresh'
  if (score >= 0.65) return 'aging'
  if (score >= 0.40) return 'stale'
  return 'expired'
}

/**
 * Batch-score a list of files.
 *
 * @param {string} kbRoot
 * @param {Array<{path: string, class?: string}>} files
 * @returns {Array<{path, score, label, ageDays}>}
 */
export function batchScoreFreshness(kbRoot, files) {
  return files.map(f => ({
    path: f.path,
    ...scoreFreshness(kbRoot, f.path, f.class),
  }))
}
