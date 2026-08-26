/**
 * source-trust.mjs — V2 source trust scoring
 *
 * Computes a 0.0–1.0 trust score for a knowledge source based on:
 *   - Memory class (profile > canonical > hot > learned > session > working > bus)
 *   - Confidence frontmatter field (high/medium/low/unverified)
 *   - Verification status (verified: true in frontmatter)
 *
 * Used by: context-loader.mjs (ranking), promotion-scorer.mjs (evidence quality)
 */

import fs from 'fs'
import path from 'path'
import { parseFrontmatter } from './frontmatter.mjs'
import { inferClass } from './freshness.mjs'

// ── Default class weights (can be overridden via contract governance_policy) ─
export const DEFAULT_CLASS_WEIGHTS = {
  profile:   1.00,
  canonical: 0.95,
  hot:       0.90,
  learned:   0.80,
  personal:  0.80, // wiki/personal/** — high for context, personal gate for promo
  session:   0.50,
  working:   0.40,
  bus:       0.35,
  unknown:   0.30,
}

// ── Confidence field → multiplier ─────────────────────────────────────────────
export const CONFIDENCE_MULTIPLIERS = {
  high:       1.00,
  medium:     0.75,
  low:        0.50,
  unverified: 0.30,
}

// ── Cache for frontmatter reads (keyed by absPath, evicted on new mtime) ─────
const _fmCache = new Map()

function readFrontmatterCached(absPath) {
  try {
    const mtime = fs.statSync(absPath).mtimeMs
    const cached = _fmCache.get(absPath)
    if (cached && cached.mtime === mtime) return cached.entry

    // Read the full file: a fixed byte cap cuts long frontmatter (many tags/
    // sources) before the closing '---', which parses as {} and silently
    // downgrades the file to the 'unverified' confidence multiplier.
    const raw = fs.readFileSync(absPath, 'utf8')
    const parsed = parseFrontmatter(raw)
    // parseFrontmatter returns { data, content, raw } — extract .data for fields
    const fm = parsed?.data || parsed || {}
    // Only the boolean is cached, not the body: this cache is keyed by path with
    // no eviction, and holding every page's text would grow without bound.
    const body = typeof parsed?.content === 'string' ? parsed.content : ''
    const entry = { fm, bodyUnverified: body.includes('[UNVERIFIED]') }
    _fmCache.set(absPath, { mtime, entry })
    return entry
  } catch (_) {
    return { fm: {}, bodyUnverified: false }
  }
}

// ── Primary API ───────────────────────────────────────────────────────────────
/**
 * Score trust for a single source file.
 *
 * @param {string} kbRoot
 * @param {string} relPath - Relative path within KB
 * @param {object} [opts]
 * @param {object} [opts.contractWeights] - Override class weights from governance_policy
 * @returns {{ score: number, label: string, classWeight: number, confidenceMultiplier: number, verified: boolean }}
 */
export function scoreTrust(kbRoot, relPath, { contractWeights } = {}) {
  const cls = inferClass(relPath)
  const weights = contractWeights || DEFAULT_CLASS_WEIGHTS
  const classWeight = weights[cls] ?? weights.unknown ?? 0.30

  const absPath = path.join(kbRoot, relPath)
  const { fm, bodyUnverified } = readFrontmatterCached(absPath)

  // Confidence multiplier
  const confField = (fm.confidence || '').toLowerCase()
  const confidenceMultiplier = CONFIDENCE_MULTIPLIERS[confField] ?? CONFIDENCE_MULTIPLIERS.unverified

  // Verification bonus (capped at 1.0)
  const verified = fm.verified === true || fm.verified === 'true'
  // The second half of this used to read `fm.body`. `fm` is the frontmatter data
  // map — the document text is `parsed.content`, which was parsed and thrown
  // away — so `fm.body` was undefined for every real page and the branch was
  // dead. It matters because `[UNVERIFIED]` is an *inline body marker* in this
  // vault, not a tag: 34 pages carry it in their text and none carry it in
  // `tags`, so the 0.80 penalty this policy defines had never once applied.
  const hasUnverifiedTag = (fm.tags || []).includes('[UNVERIFIED]') || bodyUnverified
  const verificationBonus = verified ? 1.10 : (hasUnverifiedTag ? 0.80 : 1.00)

  const rawScore = classWeight * confidenceMultiplier * verificationBonus
  const score = Math.max(0, Math.min(1.0, rawScore))
  const label = trustLabel(score)

  return { score, label, classWeight, confidenceMultiplier, verified, memClass: cls }
}

/**
 * Human-readable trust label.
 *
 * @param {number} score 0.0–1.0
 * @returns {'trusted'|'reliable'|'uncertain'|'unverified'}
 */
export function trustLabel(score) {
  if (score >= 0.85) return 'trusted'
  if (score >= 0.65) return 'reliable'
  if (score >= 0.40) return 'uncertain'
  return 'unverified'
}

/**
 * Get trust weights from a loaded contract's governance_policy.
 * Falls back to DEFAULT_CLASS_WEIGHTS if not configured.
 *
 * @param {object} contract
 * @returns {object} weight map
 */
export function getContractWeights(contract) {
  return contract?.governance_policy?.source_trust_weights || DEFAULT_CLASS_WEIGHTS
}

/**
 * Get numeric confidence from a contract's governance_policy.confidence_scores,
 * given a string like 'high' | 'medium' | 'low' | 0.75 (pass-through).
 *
 * @param {string|number} conf
 * @param {object} [contract]
 * @returns {number} 0.0–1.0
 */
export function resolveConfidence(conf, contract) {
  if (typeof conf === 'number') return Math.max(0, Math.min(1.0, conf))
  const map = contract?.governance_policy?.confidence_scores || {
    high: 1.00, medium: 0.75, low: 0.50, unverified: 0.30,
  }
  return map[(conf || '').toLowerCase()] ?? map.unverified ?? 0.30
}

/**
 * Batch-score trust for a list of files.
 *
 * @param {string} kbRoot
 * @param {Array<{path: string}>} files
 * @param {object} [opts]
 * @returns {Array<{path, score, label, memClass}>}
 */
export function batchScoreTrust(kbRoot, files, opts = {}) {
  return files.map(f => ({
    path: f.path,
    ...scoreTrust(kbRoot, f.path, opts),
  }))
}
