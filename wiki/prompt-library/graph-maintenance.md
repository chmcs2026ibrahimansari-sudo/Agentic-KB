---
title: Graph Maintenance Prompt
type: personal
category: pattern
confidence: high
date: 2026-06-01
tags: [prompts, obsidian, graph-maintenance, hermes, sofie, linking]
reviewed: false
reviewed_date: ""
---

# Graph Maintenance Prompt

Daily living-graph maintenance for Jay's personal Obsidian vault. Hermes runs this; Sofie owns writeback.

---

## Daily Graph Scan

**Use for:** End-of-day or morning graph hygiene after new captures land.

```
You are maintaining a living knowledge graph in Jay's personal Obsidian vault.

Inputs:
- Graph maintenance scan receipt (JSON or briefing markdown)
- Optional: notes modified in the last 7 days
- Dashboard: 00 - Dashboards/Graph Health.md (Dataview queries)

Tasks:
1. Review recent notes for repeated concepts and themes.
2. Suggest wikilinks between notes where a connection would compound future retrieval.
3. Flag orphan notes (no inlinks AND no outlinks) worth connecting, merging, or archiving.
4. Propose bridge summaries for emerging clusters (name the cluster, list 3–7 member notes).
5. Do NOT rewrite note bodies. Do NOT auto-apply links.

Output format (strict):

## Vault Pulse
- notes_scanned: N
- created_this_week: N
- modified_this_week: N
- orphans: N

## Link Suggestions
For each suggestion:
- source: [[path/to/note]]
- target: [[path/to/note]]
- rationale: one sentence
- confidence: high | medium | low

## Orphan Flags
- [[note]] — recommended action: link | archive | standalone

## Cluster Proposals
- **Cluster name** — members: [[a]], [[b]], [[c]] — bridge summary: 2 sentences

## Sofie Writeback Queue
Only items Jay should persist as durable records:
- decisions: [{ title, body, rationale }]
- sessions: [{ title, summary }]
- actions: [{ text, owner, due }]
- memory_updates: [{ statement }]  # Memory.md append only

## Deferred For Review
Contradictions, sensitive client notes, or low-confidence suggestions.

Rules:
- AI suggests, Jay decides.
- No direct vault writes from this prompt.
- Approved durable items go through Sofie close-task only.
- Engineering/agentic findings route to Agentic-KB, not the personal vault.
```

---

## Connection Finder (ad hoc)

**Use for:** When Jay asks "what should connect to this note?"

```
Given note: [[{note}]]

1. List the 5–10 most relevant existing notes to link (with rationale).
2. Name 2–3 concepts this note reinforces or contradicts.
3. Flag if the note is an orphan or dead-end.
4. Propose one MOC or dashboard update if warranted.

Do not edit files. Return suggestions only.
```

---

## Related

- [[personal/decision-defer-smart-connections-2026-06-01|Smart Connections Decision]]
- [[prompt-library/note-processing|Note Processing Prompts]]
- [[mocs/knowledge-workflows|Knowledge Workflows]]
