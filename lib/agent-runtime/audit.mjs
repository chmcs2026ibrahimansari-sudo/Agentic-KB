// Shared JSONL audit writer — hash-chained for tamper-evidence.
// Schema stays backwards-compatible (consumers tolerate extra fields).
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const GENESIS = '0'.repeat(16)

function hashEntry(prev, body) {
  return crypto.createHash('sha256').update(prev + '|' + body, 'utf8').digest('hex').slice(0, 16)
}

// Read only the tail of the log to find the last line — appendAudit is called
// on every runtime operation and the log grows unbounded, so a full-file read
// here makes each append O(file size). The window doubles until it contains a
// newline boundary (a single entry can exceed 8KB, e.g. error arrays).
function lastLine(full) {
  let fd
  try {
    fd = fs.openSync(full, 'r')
    const size = fs.fstatSync(fd).size
    if (size === 0) return null
    let window = 8192
    while (true) {
      const start = Math.max(0, size - window)
      const buf = Buffer.alloc(size - start)
      fs.readSync(fd, buf, 0, buf.length, start)
      const text = buf.toString('utf8').trimEnd()
      if (!text) return null
      const idx = text.lastIndexOf('\n')
      if (idx >= 0) return text.slice(idx + 1)
      if (start === 0) return text
      window *= 2
    }
  } catch {
    return null
  } finally {
    if (fd !== undefined) { try { fs.closeSync(fd) } catch {} }
  }
}

function lastHash(full) {
  const last = lastLine(full)
  if (!last) return GENESIS
  try {
    const rec = JSON.parse(last)
    return rec.entry_hash || GENESIS
  } catch { return GENESIS }
}

export function appendAudit(kbRoot, entry) {
  try {
    const dir = path.join(kbRoot, 'logs')
    fs.mkdirSync(dir, { recursive: true })
    const full = path.join(dir, 'audit.log')
    const prev = lastHash(full)
    const base = { ts: new Date().toISOString(), ...entry, prev_hash: prev }
    const body = JSON.stringify(base)
    const entry_hash = hashEntry(prev, body)
    fs.appendFileSync(full, JSON.stringify({ ...base, entry_hash }) + '\n')
  } catch (err) {
    console.error('[audit] appendAudit failed:', err && err.message ? err.message : err)
  }
}

export function appendRuntimeTrace(kbRoot, trace) {
  // Escape hatch for read-only tooling (snapshot tests, dry-run inspectors)
  // that loads real contracts against the live repo: without it every run
  // appends context-load entries to the tracked runtime log and dirties the
  // working tree. Only the observability log is gated — the hash-chained
  // audit log (appendAudit) can NOT be suppressed.
  if (process.env.AGENTIC_KB_SUPPRESS_RUNTIME_TRACE === '1') return
  try {
    const dir = path.join(kbRoot, 'logs')
    fs.mkdirSync(dir, { recursive: true })
    const line = JSON.stringify({ ts: new Date().toISOString(), ...trace })
    fs.appendFileSync(path.join(dir, 'agent-runtime.log'), line + '\n')
  } catch (err) {
    console.error('[audit] appendRuntimeTrace failed:', err && err.message ? err.message : err)
  }
}

export function readRuntimeTraces(kbRoot, limit = 50, filter = {}) {
  try {
    const file = path.join(kbRoot, 'logs', 'agent-runtime.log')
    if (!fs.existsSync(file)) return []
    const lines = fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean)
    const parsed = lines.map(l => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
    let out = parsed
    if (filter.agent_id) out = out.filter(t => t.agent_id === filter.agent_id)
    if (filter.type) out = out.filter(t => t.type === filter.type)
    return out.slice(-limit).reverse()
  } catch (err) {
    console.error('[audit] readRuntimeTraces failed:', err && err.message ? err.message : err)
    return []
  }
}

export function readRecentAudit(kbRoot, limit = 50, filter = {}) {
  try {
    const file = path.join(kbRoot, 'logs', 'audit.log')
    if (!fs.existsSync(file)) return []
    const lines = fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean)
    const parsed = lines.map(l => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
    let out = parsed
    if (filter.agent_id) out = out.filter(e => e.agent_id === filter.agent_id)
    if (filter.op) out = out.filter(e => e.op === filter.op)
    return out.slice(-limit).reverse()
  } catch { return [] }
}

/**
 * Verify audit.log hash chain.
 * Returns { ok, scanned, signed, legacy, firstBreakAt?, reason? }.
 * Legacy (pre-chain) entries are tolerated — ok stays true unless a *signed*
 * entry breaks the chain.
 */
export function verifyAuditChain(kbRoot) {
  const file = path.join(kbRoot, 'logs', 'audit.log')
  if (!fs.existsSync(file)) return { ok: true, scanned: 0, signed: 0, legacy: 0 }
  const lines = fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean)
  let prev = GENESIS
  let signed = 0
  let legacy = 0
  let chainStarted = false
  for (let i = 0; i < lines.length; i++) {
    let rec
    try { rec = JSON.parse(lines[i]) } catch { return { ok: false, scanned: i, signed, legacy, firstBreakAt: i, reason: 'json parse' } }
    if (rec.prev_hash == null || rec.entry_hash == null) {
      if (chainStarted) return { ok: false, scanned: i, signed, legacy, firstBreakAt: i, reason: 'unsigned entry after chain start' }
      legacy++
      continue
    }
    if (!chainStarted) { prev = GENESIS; chainStarted = true }
    if (rec.prev_hash !== prev) return { ok: false, scanned: i, signed, legacy, firstBreakAt: i, reason: 'prev_hash mismatch' }
    const { entry_hash, ...rest } = rec
    const expected = hashEntry(prev, JSON.stringify(rest))
    if (entry_hash !== expected) return { ok: false, scanned: i, signed, legacy, firstBreakAt: i, reason: 'entry_hash mismatch' }
    prev = entry_hash
    signed++
  }
  return { ok: true, scanned: lines.length, signed, legacy }
}
