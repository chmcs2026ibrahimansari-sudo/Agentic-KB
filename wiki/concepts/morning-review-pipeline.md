---
id: 01KX98DZFVW52QXD76BZVZBF1A
title: "Morning-Review Pipeline"
type: concept
tags: [workflow, automation, knowledge-base, capture-pipeline]
created: 2026-05-16
updated: 2026-05-16
visibility: public
confidence: medium
related: [kb-inbox-workflow]
---

# Morning-Review Pipeline

## Definition

The morning-review pipeline is a semi-automated workflow that processes notes captured overnight (or since the last run) and surfaces them for human review each morning. It is anchored by **foundry-capture**, which handles ingestion from sources such as Apple Notes and writes entries to `raw/clippings/`.

## Why It Matters

Capture is only valuable if captured material is actually reviewed and integrated into the knowledge base. A scheduled, predictable morning review creates a forcing function: nothing rots in the inbox, and knowledge surfaces on a human-readable cadence rather than piling up indefinitely.

## Example

The pipeline was verified on 2026-05-16 by writing a test note to the KB Inbox folder after its creation. The foundry-capture script wrote a corresponding `raw/clippings/` entry, confirming end-to-end connectivity.

## Pipeline Components

| Component | Role |
|---|---|
| KB Inbox folder | Landing zone for new captures |
| foundry-capture / capture script | Validates and writes `raw/clippings/` entries |
| `raw/clippings/` directory | Staging area for morning review |
| Morning review step | Human (or agent) reads, tags, promotes entries |

## Key Constraints

- The capture script **skips entries with bodies shorter than 10 characters** — any test or verification note must meet this minimum.
- Entries in `raw/clippings/` are considered safe to delete once the morning review has processed them.

## See Also

- [KB Inbox Workflow](kb-inbox-workflow.md)
- [Agent Loops](agent-loops.md)
- [Agent Memory at Runtime](agent-memory-runtime.md)
