---
id: 01M06AYA5D84AQYB1GWA2HFBA4
title: "Raw Inbox Workflow"
type: pattern
tags: [workflow, automation, knowledge-base, agents]
created: 2026-08-16
updated: 2026-08-16
visibility: public
source: inbox/README.md
---

# Raw Inbox Workflow

## When to Use
Use this pattern whenever agents need a durable, append-only staging area for unprocessed source material — thoughts, URLs, quotes, PDFs converted to markdown, transcripts, and snippets — that will later be summarized or compiled into structured knowledge base pages. It's especially important in systems with scheduled/automated runs where multiple agents may touch the same files over time.

## Structure
The pattern centers on a **Raw Inbox** directory (`inbox/`) governed by a small set of **Agent Rules**:

- Everything dropped into the inbox is treated as [Source Material](../concepts/source-material.md) — messy, unprocessed, and not to be cleaned up in place.
- Agents must **not edit or delete inbox files during scheduled runs**. The inbox is read-only from the perspective of automated processing cycles.
- Summaries and wiki updates are **derived elsewhere** (e.g. in `wiki/summaries/` or `wiki/syntheses/`) — the inbox itself is never the output location.
- Instead of moving or mutating processed files, agents record **processed markers** in `.night-shift/state/`. This decouples "have I processed this file" bookkeeping from the file itself, keeping the inbox stable and idempotent across runs.

```
inbox/
  README.md          <- rules for agents
  <raw-file-1>.md
  <raw-file-2>.pdf.md
.night-shift/
  state/
    <processed-marker-for-raw-file-1>
```

## Example
A scheduled compile job runs nightly. It scans `inbox/` for files, checks `.night-shift/state/` to see which have already been processed, and for each unprocessed file:
1. Reads the raw content (treating it purely as source material).
2. Compiles relevant wiki pages elsewhere in the KB.
3. Writes a processed marker to `.night-shift/state/` — it does **not** edit, move, or delete the original file in `inbox/`.

This means the same raw file can safely be re-read, re-diffed, or reprocessed by a different agent without risk of data loss or race conditions during concurrent scheduled runs.

## Trade-offs
**Pros:**
- Inbox stays a stable, append-only log — safe for concurrent/scheduled agent access.
- Decoupling "processed" state from the file itself avoids destructive edits and makes reprocessing/auditing easy.
- Clear separation of raw input vs. compiled output keeps the KB clean.

**Cons:**
- Inbox can grow unbounded if nothing ever prunes fully-processed files (no built-in archival step in this pattern).
- Requires all agents to consistently honor the "never edit/delete" rule — a single non-compliant agent breaks the guarantee.
- Processed-marker state lives outside the inbox, so the two must be kept in sync manually or via tooling.

## Related Patterns
- [Agent Loops](../concepts/agent-loops.md)
- [Agent Memory Runtime](../concepts/agent-memory-runtime.md)
- [Agent Observability](../concepts/agent-observability.md)

## See Also
- [Agent Loops](../concepts/agent-loops.md)
- [Agent Memory Runtime](../concepts/agent-memory-runtime.md)
