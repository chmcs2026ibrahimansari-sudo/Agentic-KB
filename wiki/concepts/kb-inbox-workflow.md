---
id: 01KX98DZFTQZ1643BPQEASG1N9
title: "KB Inbox Workflow"
type: concept
tags: [knowledge-base, workflow, automation, capture-pipeline]
created: 2026-05-16
updated: 2026-05-16
visibility: public
confidence: medium
related: [morning-review-pipeline]
---

# KB Inbox Workflow

## Definition

The KB Inbox Workflow is the entry-point layer of the foundry-capture pipeline. Newly captured notes land in a designated **KB Inbox folder**, where the capture script picks them up, validates them, and writes processed entries to the `raw/clippings/` directory for downstream review.

## Why It Matters

Without a structured inbox, captured content scatters across the filesystem and gets lost before it can be processed. The inbox acts as a controlled landing zone with a single well-known path, making automation reliable and auditable.

## Key Behaviours

- **Minimum body length**: The capture script skips any note whose body is fewer than 10 characters, filtering out accidental or empty captures.
- **Output target**: Valid entries are written as files under `raw/clippings/`, timestamped and hashed for deduplication.
- **Trigger**: The script monitors (or is pointed at) the KB Inbox folder; notes written there are eligible for the next capture run.

## Example

A note captured from Apple Notes on 2026-05-16 arrives in the KB Inbox folder. The capture script reads it, confirms the body is ≥ 10 characters, and writes a corresponding entry to `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__ff2752c5.md`.

## Lifecycle of a Captured Note

```
Source (Apple Notes, web clip, etc.)
  └─▶ KB Inbox folder          ← landing zone
        └─▶ capture script     ← validates, skips <10-char bodies
              └─▶ raw/clippings/  ← written entry, ready for morning review
```

## See Also

- [Morning-Review Pipeline](morning-review-pipeline.md)
- [Agent Loops](agent-loops.md)
- [Agent Observability](agent-observability.md)
