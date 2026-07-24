---
id: 01KX98CV20G5EBVKS315VQQRCQ
title: "KB Inbox"
type: concept
tags: [knowledge-base, workflow, automation, capture-pipeline]
created: 2026-05-16
updated: 2026-05-16
visibility: public
confidence: medium
related: [morning-review-pipeline]
---

# KB Inbox

## Definition

The **KB Inbox** is a designated landing zone folder within the knowledge base where raw captured content is deposited before processing. It serves as the first stop in the capture pipeline — a staging area for notes, clippings, and other inputs before they are reviewed, tagged, and routed to their final destination.

In the current system, the KB Inbox lives at `raw/clippings/` and is written to by the `foundry-capture` script.

## Why It Matters

Without a dedicated inbox, captured content either gets lost or lands in an unstructured heap. The KB Inbox enforces a clear boundary between **raw, unprocessed input** and **curated knowledge**. This separation makes it easier to:

- Process captures in batches (e.g. during a morning review)
- Avoid polluting structured wiki sections with noise
- Apply consistent ingestion rules (e.g. minimum body length) before content is promoted

## How It Works

1. A capture event triggers `foundry-capture` (e.g. from Apple Notes, a clipping tool, or manual input)
2. `foundry-capture` validates the entry — notably, the capture script **skips any note with a body shorter than 10 characters**
3. Valid entries are written as files into `raw/clippings/`
4. During the [morning-review pipeline](../concepts/morning-review-pipeline.md), the inbox is reviewed and items are compiled into structured wiki pages via `/api/compile`

## Example

A test note captured on 2026-05-16 was written to verify the pipeline end-to-end. The note body was intentionally kept above 10 characters so the capture script would not skip it. Once the `raw/clippings/` entry was confirmed written, the test note was marked safe to delete.

## See Also

- [Morning-Review Pipeline](../concepts/morning-review-pipeline.md)
- [Agent Observability](../concepts/agent-observability.md)
- [Agent Memory (Runtime)](../concepts/agent-memory-runtime.md)
