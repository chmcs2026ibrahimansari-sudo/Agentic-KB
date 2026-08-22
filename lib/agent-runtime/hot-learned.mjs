// Hot → Learned summarization hook.
// Runs after every successful closeTask that touched hot.md.
// Writes a dated learned snapshot to wiki/agents/{tier}s/{agent}/learned/hot-digest/.
// Summarizer is pluggable; default is heading/bullet extraction (zero dep, no LLM).
import fs from 'fs'
import path from 'path'
import { parseFrontmatter, serializeFrontmatter } from './frontmatter.mjs'
import { timestamp } from './ids.mjs'

let SUMMARIZER = defaultSummarizer

// Cap on digest length. Named so the number that drops content is legible at
// the point the loss is reported, rather than buried in a slice().
const DIGEST_LINE_CAP = 60

function countLines(text) {
  return String(text || '').split('\n').filter(l => l.trim()).length
}

export function registerHotLearnedSummarizer(fn) {
  if (typeof fn === 'function') SUMMARIZER = fn
}

export function resetHotLearnedSummarizer() { SUMMARIZER = defaultSummarizer }

// Extract headings + first-line-of-bullet as digest. Deterministic, zero-dep.
function defaultSummarizer({ content }) {
  const { content: body } = parseFrontmatter(content)
  const lines = (body || content).split('\n')
  const out = []
  for (const raw of lines) {
    const l = raw.trim()
    if (!l) continue
    if (/^#{1,6}\s+/.test(l)) out.push(l)
    else if (/^[-*+]\s+/.test(l)) out.push(l)
  }
  // Cap to keep digests small.
  return out.slice(0, DIGEST_LINE_CAP).join('\n')
}

export function summarizeHotToLearned(kbRoot, contract, { minWords = 40 } = {}) {
  const tier = contract.tier
  const agentId = contract.agent_id
  const hotRel = `wiki/agents/${tier}s/${agentId}/hot.md`
  const hotFull = path.join(kbRoot, hotRel)
  if (!fs.existsSync(hotFull)) return { skipped: true, reason: 'no hot.md' }
  const content = fs.readFileSync(hotFull, 'utf8')
  const words = content.split(/\s+/).filter(Boolean).length
  if (words < minWords) return { skipped: true, reason: 'below minWords', words }

  const summary = SUMMARIZER({ content, agent_id: agentId, tier, kbRoot })
  if (!summary || !summary.trim()) return { skipped: true, reason: 'empty summary' }

  // How much of hot.md survived. This digest is written into learned/, where
  // the context loader picks it up and a later agent reads it as durable
  // knowledge — the source is not consulted again. Without a loss measure a
  // digest that kept 3 of 33 lines was indistinguishable from one that kept
  // everything: same frontmatter keys, same shape, no signal.
  //
  // Line counts are a coarse proxy, not per-claim fidelity. They make the loss
  // *visible*, which is the cheap half of the trade; they do not quantify it.
  // They are computed here rather than inside the summarizer so a custom
  // (e.g. LLM) summarizer registered via registerHotLearnedSummarizer is
  // measured the same way.
  const sourceLines = countLines(parseFrontmatter(content).content || content)
  const digestLines = countLines(summary)
  const linesDropped = Math.max(0, sourceLines - digestLines)

  const ts = timestamp()
  const learnedRel = `wiki/agents/${tier}s/${agentId}/learned/hot-digest/${ts}.md`
  const learnedFull = path.join(kbRoot, learnedRel)
  fs.mkdirSync(path.dirname(learnedFull), { recursive: true })
  const fm = {
    memory_class: 'learned',
    agent_id: agentId,
    source: hotRel,
    generated_at: new Date().toISOString(),
    contract_hash: contract.contract_hash || null,
    summarizer: SUMMARIZER === defaultSummarizer ? 'default-heading-bullet' : 'custom',
    // Loss report — structured fields, deliberately outside the prose body so
    // a reader can check them without parsing the digest.
    source_lines: sourceLines,
    digest_lines: digestLines,
    lines_dropped: linesDropped,
    truncated: linesDropped > 0,
  }
  const digest = serializeFrontmatter(fm, '\n# Hot digest — ' + ts + '\n\n' + summary + '\n')
  // Exclusive create with bounded suffix retry: timestamp() is only unique
  // within one process, so two processes closing tasks in the same second
  // (MCP server + CLI/web) would silently overwrite each other's digest.
  let finalRel = learnedRel
  let finalFull = learnedFull
  for (let n = 2; ; n++) {
    try {
      fs.writeFileSync(finalFull, digest, { flag: 'wx' })
      break
    } catch (err) {
      if (err.code !== 'EEXIST' || n > 20) throw err
      finalRel = learnedRel.replace(/\.md$/, `-${n}.md`)
      finalFull = path.join(kbRoot, finalRel)
    }
  }
  return {
    learnedPath: finalRel,
    words,
    summarizer: fm.summarizer,
    source_lines: sourceLines,
    digest_lines: digestLines,
    lines_dropped: linesDropped,
    truncated: fm.truncated,
  }
}
