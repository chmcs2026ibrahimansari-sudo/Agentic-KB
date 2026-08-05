// Vault-writeback — writes from a sanctioned KB-side agent (Sofie) into the
// Obsidian write-vault. Sanctioned exception to Rule 13 (compile-vault read-only)
// limited to agents with an explicit `vault_writes` contract field.
//
// Safety:
//   - Opt-in per contract (no `vault_writes` = vault writes blocked entirely)
//   - Hardened path checks identical to assertWriteAllowed
//   - Every vault path resolved + verified to live under OBSIDIAN_VAULT root
//   - All vault writes audited
//   - Atomic write (tmp + rename); rollback recreates pre-state
import fs from 'fs'
import path from 'path'
import os from 'os'
import { globToRegex, expandVars } from './paths.mjs'
import { appendAudit } from './audit.mjs'
import { checkUnsafePath } from './path-safety.mjs'

export function vaultRoot() {
  return process.env.OBSIDIAN_VAULT_ROOT || path.join(os.homedir(), 'Documents', 'Obsidian Vault')
}

export function assertVaultWriteAllowed(relPath, contract, vars = {}) {
  const u = checkUnsafePath(relPath)
  if (u) return { allowed: false, reason: `unsafe vault path: ${u}`, rule: null }
  if (!Array.isArray(contract.vault_writes) || contract.vault_writes.length === 0) {
    return { allowed: false, reason: 'no vault_writes configured', rule: null }
  }
  for (const p of contract.vault_writes) {
    const expanded = expandVars(p, vars)
    if (globToRegex(expanded).test(relPath)) return { allowed: true, reason: 'matched vault_writes', rule: p }
  }
  return { allowed: false, reason: 'not in vault_writes', rule: null }
}

function ensureUnderVault(absPath, vault) {
  const a = path.resolve(absPath)
  const v = path.resolve(vault)
  if (a !== v && !a.startsWith(v + path.sep)) throw new Error(`path escapes vault: ${absPath}`)
  return a
}

function atomicWrite(fullPath, content) {
  fs.mkdirSync(path.dirname(fullPath), { recursive: true })
  const tmp = fullPath + '.tmp-' + process.pid + '-' + Date.now()
  fs.writeFileSync(tmp, content)
  fs.renameSync(tmp, fullPath)
}

// Allocate a non-existing sibling path by numeric suffix (name.md → name-2.md).
function uniqueVaultPath(vault, relPath) {
  const ext = path.extname(relPath)
  const stem = ext ? relPath.slice(0, -ext.length) : relPath
  for (let i = 2; i < 1000; i++) {
    const candidate = `${stem}-${i}${ext}`
    if (!fs.existsSync(path.join(vault, candidate))) return candidate
  }
  throw new Error(`could not allocate unique vault path for ${relPath}`)
}

/**
 * Plan + commit a single vault write op.
 * op:
 *   { kind: 'create', path, content }       — fail if exists (unless force;
 *                                             unique: true suffixes -2, -3…)
 *   { kind: 'overwrite', path, content }    — replace
 *   { kind: 'append', path, content, sep }  — append after sep
 *
 * Returns { committed: true, rollback: {...} } or throws.
 */
export function commitVaultWrite(op, contract, vars = {}) {
  const guard = assertVaultWriteAllowed(op.path, contract, vars)
  if (!guard.allowed) throw new Error(`vault write blocked: ${guard.reason} (${op.path})`)

  const vault = vaultRoot()
  if (!fs.existsSync(vault)) throw new Error(`vault root missing: ${vault}`)
  let relPath = op.path
  let full = ensureUnderVault(path.join(vault, relPath), vault)
  let existed = fs.existsSync(full)
  let previousContent = existed ? fs.readFileSync(full, 'utf8') : null

  if (op.kind === 'create') {
    if (existed && !op.force) {
      if (!op.unique) throw new Error(`vault file exists: ${op.path}`)
      // Two same-day ops slugging to the same filename (e.g. duplicate
      // decision titles) previously aborted the entire fanout transaction.
      relPath = uniqueVaultPath(vault, op.path)
      const reguard = assertVaultWriteAllowed(relPath, contract, vars)
      if (!reguard.allowed) throw new Error(`vault write blocked: ${reguard.reason} (${relPath})`)
      full = ensureUnderVault(path.join(vault, relPath), vault)
      existed = false
      previousContent = null
    }
    atomicWrite(full, op.content)
  } else if (op.kind === 'overwrite') {
    atomicWrite(full, op.content)
  } else if (op.kind === 'append') {
    const sep = op.sep ?? '\n'
    const merged = existed
      ? (previousContent.endsWith('\n') ? previousContent + sep + op.content + '\n' : previousContent + '\n' + sep + op.content + '\n')
      : op.content + (op.content.endsWith('\n') ? '' : '\n')
    atomicWrite(full, merged)
  } else {
    throw new Error(`unknown vault op kind: ${op.kind}`)
  }

  return {
    committed: true,
    path: relPath,
    rollback: { path: relPath, full, existed, previousContent },
  }
}

export function rollbackVaultWrite(rb) {
  try {
    if (rb.existed) fs.writeFileSync(rb.full, rb.previousContent ?? '')
    else if (fs.existsSync(rb.full)) fs.unlinkSync(rb.full)
    return true
  } catch { return false }
}

// ─── Sofie automation rules ───────────────────────────────────────────────────
// Map closeTask payload extras to vault writes. Returns array of vault ops
// (NOT yet committed — caller plans + guards + commits in transaction).

// Payload fields land on single-line frontmatter keys in the hand-built
// vault notes below. A value containing a newline would terminate the key
// early and inject arbitrary frontmatter into the note (same class of bug
// fixed in the ADR emitter and the ingest routes).
function oneLine(s) {
  return String(s).replace(/[\r\n]+/g, ' ').trim()
}

export function planSofieVaultOps(payload) {
  const ops = []
  const today = new Date().toISOString().slice(0, 10)

  for (const d of payload.decisions || []) {
    if (!d || !d.title) continue
    const slug = String(d.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'decision'
    const body = [
      '---',
      `date: ${today}`,
      `decided_by: ${oneLine(d.decided_by || 'sofie')}`,
      d.related ? `related: ${oneLine(d.related)}` : null,
      '---',
      '',
      `# ${d.title}`,
      '',
      '## Decision',
      d.body || d.summary || '',
      d.rationale ? `\n## Rationale\n\n${d.rationale}` : '',
      '',
    ].filter(l => l !== null).join('\n')
    ops.push({ kind: 'create', path: `06 - Decisions/${today} - ${slug}.md`, content: body, force: false, unique: true })
  }

  for (const a of payload.actions || []) {
    if (!a || !a.task) continue
    const line = `- [ ] ${a.task}${a.owner ? ` — owner: ${a.owner}` : ''}${a.deadline ? ` — due: ${a.deadline}` : ''}${a.source ? ` — src: ${a.source}` : ''}`
    ops.push({ kind: 'append', path: `07 - Tasks/Action Tracker.md`, content: line, sep: '' })
  }

  if (payload.sessionSummary && payload.sessionSummary.body) {
    const ss = payload.sessionSummary
    const slug = (ss.title || 'session').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
    const body = [
      '---',
      `date: ${today}`,
      `type: session`,
      // Array.isArray guard: a string tags value would .join()-throw and
      // abort the entire fanout; each tag is flattened to one line.
      Array.isArray(ss.tags) && ss.tags.length > 0 ? `tags: [${ss.tags.map(oneLine).join(', ')}]` : null,
      '---',
      '',
      `# ${ss.title || 'Session'} — ${today}`,
      '',
      ss.body,
      '',
    ].filter(l => l !== null).join('\n')
    ops.push({ kind: 'create', path: `04 - Sessions/${today}-${slug}.md`, content: body, force: false, unique: true })
  }

  for (const cu of payload.clientUpdates || []) {
    if (!cu || !cu.client || !cu.body) continue
    const safeClient = String(cu.client).replace(/[^A-Za-z0-9 _-]/g, '_')
    ops.push({
      kind: 'append',
      path: `01 - Clients/${safeClient}.md`,
      content: `\n## ${today}\n\n${cu.body}\n`,
      sep: '',
    })
  }

  // Memory.md update — vault-canonical onboarding doc.
  // Sofie appends timestamped entries under "## Updates" section.
  if (payload.memoryUpdate) {
    const m = payload.memoryUpdate
    const body = typeof m === 'string' ? m : (m.body || '')
    const heading = typeof m === 'object' && m.heading ? m.heading : `${today}`
    if (body.trim()) {
      ops.push({
        kind: 'append',
        path: `Memory.md`,
        content: `\n### ${heading}\n\n${body.trim()}\n`,
        sep: '',
      })
    }
  }

  return ops
}

/**
 * Run Sofie's vault fan-out as a transaction. All-or-nothing.
 * Returns { ok, committed, rolled_back, ops }.
 */
export function runSofieVaultFanout(kbRoot, contract, payload) {
  const ops = planSofieVaultOps(payload)
  if (ops.length === 0) return { ok: true, committed: 0, ops: [] }

  // Guard all first
  for (const op of ops) {
    const g = assertVaultWriteAllowed(op.path, contract)
    if (!g.allowed) return { ok: false, error: `blocked: ${op.path} — ${g.reason}`, ops }
  }

  // Commit + rollback on first failure
  const rollbacks = []
  try {
    for (const op of ops) {
      const r = commitVaultWrite(op, contract)
      rollbacks.push(r.rollback)
      appendAudit(kbRoot, {
        op: 'vault-write',
        agent_id: contract.agent_id,
        contract_hash: contract.contract_hash || null,
        kind: op.kind,
        vault_path: r.path,
      })
    }
    return { ok: true, committed: rollbacks.length, ops }
  } catch (err) {
    let undone = 0
    for (let i = rollbacks.length - 1; i >= 0; i--) {
      if (rollbackVaultWrite(rollbacks[i])) undone++
    }
    appendAudit(kbRoot, {
      op: 'vault-write-rollback',
      agent_id: contract.agent_id,
      error: err.message,
      rolled_back: undone,
    })
    return { ok: false, error: err.message, committed: 0, rolled_back: undone, ops }
  }
}
