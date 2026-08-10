// Per-agent file lock — prevents concurrent closeTask/compaction interleaving.
// Uses fs.openSync with O_EXCL; stale locks (PID dead or older than maxAgeMs) auto-cleared.
import fs from 'fs'
import path from 'path'

const DEFAULT_MAX_AGE_MS = 60_000
const STALE_PARSE_GRACE_MS = 2_000
const LOCK_DIR = '.locks'
const SLEEP_BUF = new Int32Array(new SharedArrayBuffer(4))

function lockPath(kbRoot, key) {
  const safe = String(key).replace(/[^a-zA-Z0-9._-]/g, '_')
  return path.join(kbRoot, LOCK_DIR, `${safe}.lock`)
}

function pidAlive(pid) {
  try { process.kill(pid, 0); return true } catch (e) { return e.code === 'EPERM' }
}

// Atomically remove a lock file judged stale. A bare unlinkSync here is racy:
// two waiters can both read the same stale record, waiter A unlinks and
// acquires, then waiter B's unlink deletes A's *fresh* lock and B acquires
// too — two holders. rename() to a unique tomb first: only one contender wins
// the rename (the loser gets ENOENT = someone else already cleared it), so at
// most one waiter ever removes any given lock file incarnation.
function stealLock(full) {
  const tomb = `${full}.stale-${process.pid}-${Date.now()}`
  try {
    fs.renameSync(full, tomb)
  } catch {
    // Already stolen/released by someone else — treat as cleared and retry.
    return true
  }
  try { fs.unlinkSync(tomb) } catch {}
  return true
}

function tryClearStale(full, maxAgeMs) {
  try {
    const raw = fs.readFileSync(full, 'utf8')
    const rec = JSON.parse(raw)
    const age = Date.now() - (rec.ts || 0)
    if (age > maxAgeMs) return stealLock(full)
    if (rec.pid && !pidAlive(rec.pid)) return stealLock(full)
  } catch {
    // Unreadable or unparseable lock file. This can be a *live* lock caught
    // between the holder's openSync('wx') and writeSync (file still empty),
    // so only clear it once it is older than a short grace window — never
    // steal a lock mid-creation.
    try {
      const mtimeMs = fs.statSync(full).mtimeMs
      if (Date.now() - mtimeMs > Math.min(maxAgeMs, STALE_PARSE_GRACE_MS)) {
        return stealLock(full)
      }
    } catch {
      // stat failed — lock vanished (holder released); safe to retry acquire
      return true
    }
    return false
  }
  return false
}

/**
 * Acquire an exclusive lock for `key` (typically agent_id).
 * Returns a handle with .release(). Throws if busy after retries.
 */
export function acquireLock(kbRoot, key, { maxAgeMs = DEFAULT_MAX_AGE_MS, retries = 10, retryDelayMs = 50, waitMs = 0 } = {}) {
  const full = lockPath(kbRoot, key)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  const ts = Date.now()
  const payload = JSON.stringify({ pid: process.pid, ts, key })

  const deadline = Date.now() + Math.max(waitMs, retries * retryDelayMs)
  let attempt = 0
  while (true) {
    try {
      const fd = fs.openSync(full, 'wx')
      fs.writeSync(fd, payload)
      fs.closeSync(fd)
      return {
        key,
        path: full,
        // Only remove the lock if it is still *ours*. If this holder ran past
        // maxAgeMs, a waiter may have legitimately stolen the lock and
        // re-acquired — an unconditional unlink here would delete the new
        // holder's lock. (The read-then-unlink window is not fully atomic,
        // but it shrinks the race from "always" to a few microseconds.)
        release() {
          try {
            const rec = JSON.parse(fs.readFileSync(full, 'utf8'))
            if (rec.pid === process.pid && rec.ts === ts) fs.unlinkSync(full)
          } catch {}
        },
      }
    } catch (err) {
      if (err.code !== 'EEXIST') throw err
      if (tryClearStale(full, maxAgeMs)) continue
      attempt++
      if (Date.now() >= deadline) {
        throw new Error(`lock busy: ${key} (held by another process)`)
      }
      // Sleep between retries without burning CPU. Atomics.wait on a
      // never-notified address is a true blocking sleep in sync code.
      Atomics.wait(SLEEP_BUF, 0, 0, retryDelayMs)
    }
  }
}

/** Run `fn` under exclusive lock on `key`; always releases. */
export function withLock(kbRoot, key, fn, opts) {
  const lock = acquireLock(kbRoot, key, opts)
  try { return fn() } finally { lock.release() }
}
