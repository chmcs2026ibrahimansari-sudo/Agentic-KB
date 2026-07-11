---
title: Defer Smart Connections — Use Hermes/MCP Link Suggestions
type: personal
category: decision
confidence: high
date: 2026-06-01
tags: [obsidian, smart-connections, hermes, graph-maintenance, decision]
reviewed: false
reviewed_date: ""
---

# Defer Smart Connections — Use Hermes/MCP Link Suggestions

## TL;DR

Smart Connections stays **deferred**. Link suggestions run through Hermes (connection-finder workflow) with human review and Sofie-governed writeback — not local semantic auto-suggest inside Obsidian.

## Decision

| Option | Verdict |
|--------|---------|
| Install Smart Connections for in-vault semantic suggestions | **Deferred** |
| Hermes/MCP daily graph-maintenance scan + review gate | **Adopted** |
| Automatic vault edits from any AI plugin | **Forbidden** |

## Rationale

The personal vault already has a governed bridge:

- **Read path:** `scripts/sofie-watch-obsidian.mjs` stages vault notes into Agentic-KB `raw/transcripts/`
- **Suggest path:** Hermes runs `playbooks/graph-maintenance-run.md` with `wiki/prompt-library/graph-maintenance.md`
- **Write path:** Sofie `close-task` only — `config/agents/sofie.yaml` `vault_writes` surface

Smart Connections would duplicate the suggest layer while adding:

- A second embedding index to maintain
- No integration with Sofie dedupe/contradiction guards
- Temptation to accept suggestions without audit trail

Hermes/MCP keeps suggestions external, reviewable, and receipt-logged in Agentic-KB.

## When To Revisit

Re-evaluate Smart Connections if:

- Jay wants offline/in-Obsidian semantic browse without opening Cursor
- Hermes link suggestions prove too slow or too noisy for daily use
- Smart Connections adds a read-only API that can feed receipts without auto-edit

## Operating Rule

**AI suggests, Jay decides.** No plugin or agent may rewrite personal vault notes automatically.

## Related

- [[prompt-library/graph-maintenance|Graph Maintenance Prompt]]
- [[mocs/knowledge-workflows|Knowledge Workflows]]
- [[personal/hermes-apple-notes-setup-review-2026-06-01|Hermes Setup Review]]
