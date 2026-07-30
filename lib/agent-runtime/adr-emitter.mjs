// ADR auto-emit — on Sofie close-task with decisions[], also drop an ADR
// page in wiki/decisions/ADR-NNN-{slug}.md. Bidirectional: vault decision
// + KB ADR with backlinks.
import fs from 'fs'
import path from 'path'

function nextAdrNumber(kbRoot) {
  const dir = path.join(kbRoot, 'wiki/decisions')
  if (!fs.existsSync(dir)) return 1
  const nums = fs.readdirSync(dir)
    .map(f => f.match(/^ADR-(\d+)/))
    .filter(Boolean)
    .map(m => parseInt(m[1], 10))
  return nums.length === 0 ? 1 : Math.max(...nums) + 1
}

// Decision fields land on single-line frontmatter keys; a title or author
// containing a newline would terminate the value early and inject arbitrary
// frontmatter keys into the ADR (same class of bug fixed in the ingest routes).
function oneLine(s) {
  return String(s).replace(/[\r\n]+/g, ' ').trim()
}

function slugify(s) {
  return String(s || 'decision')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

/**
 * Plan KB-side ADR write ops parallel to Sofie's vault decision writes.
 * Returned ops match the writeback planWrites contract:
 *   { op: 'create', path, content, reason }
 */
export function planAdrOpsForDecisions(kbRoot, contract, decisions = []) {
  if (!Array.isArray(decisions) || decisions.length === 0) return []
  const today = new Date().toISOString().slice(0, 10)
  let nextN = nextAdrNumber(kbRoot)
  const ops = []
  for (const d of decisions) {
    if (!d || !d.title) continue
    const n = String(nextN++).padStart(3, '0')
    const title = oneLine(d.title)
    const status = oneLine(d.status || 'accepted')
    const author = oneLine(d.decided_by || contract.agent_id)
    const confidence = oneLine(d.confidence || 'medium')
    const slug = slugify(title)
    const rel = `wiki/decisions/ADR-${n}-${slug}.md`
    const vaultRel = `06 - Decisions/${today} - ${slug}.md`
    const fm = [
      '---',
      // JSON.stringify escapes quotes and backslashes so the YAML value
      // round-trips (a title ending in a backslash previously produced \\"
      // which broke the closing quote).
      `title: ${JSON.stringify(`ADR-${n}: ${title}`)}`,
      'type: decision',
      `date: ${today}`,
      `status: ${status}`,
      `author: ${author}`,
      `vault_decision: "${vaultRel}"`,
      'reviewed: false',
      'reviewed_date: ""',
      `confidence: ${confidence}`,
      '---',
    ].join('\n')
    const body = [
      '',
      `# ADR-${n} — ${title}`,
      '',
      '## Status',
      d.status || 'Accepted',
      '',
      '## Context',
      d.context || d.body || '_(see decision body)_',
      '',
      '## Decision',
      d.body || d.summary || '',
      '',
      '## Rationale',
      d.rationale || '_(not provided)_',
      '',
      '## Consequences',
      d.consequences || '_(to be assessed)_',
      '',
      '## Related',
      `- Vault decision: \`${vaultRel}\``,
      `- Author: ${author}`,
      '',
    ].join('\n')
    ops.push({
      op: 'create',
      path: rel,
      content: fm + body,
      reason: 'ADR auto-emit',
    })
  }
  return ops
}
