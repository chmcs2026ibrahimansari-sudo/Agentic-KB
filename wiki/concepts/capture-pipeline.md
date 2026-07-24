---
id: 01KX98BGRKP618PES8D40385E2
title: "Capture Pipeline (foundry-capture)"
type: concept
tags: [knowledge-base, workflow, automation, obsidian]
created: 2026-05-16
updated: 2026-05-16
visibility: public
confidence: medium
---

# Capture Pipeline (foundry-capture)

## Definition

The **foundry-capture** pipeline is a capture-and-ingestion workflow that takes raw notes (e.g. from Apple Notes, clippings, or other sources) and writes structured entries into the `raw/clippings/` directory for downstream processing. It is the entry point for unstructured knowledge entering the KB.

The pipeline pairs with a **morning-review workflow** in which captured clippings are triaged, annotated, and promoted into the appropriate wiki section.

## Why It Matters

Without a reliable capture layer, knowledge created in transient contexts (mobile notes, browser clips, voice memos) is lost before it can be structured. foundry-capture standardises the ingestion path so the KB inbox always has a consistent shape to process.

## Key Mechanics

- **Minimum body length**: The capture script skips any note whose body content is fewer than **10 characters**. Notes must meet this threshold to be written to `raw/clippings/`.
- **Source tagging**: Each captured entry is tagged with its origin (e.g. `source-apple-notes`) and assigned a canonical hash for deduplication.
- **KB Inbox**: A dedicated inbox folder is created as part of the capture setup. Entries land here before morning review routes them onward.
- **Safe-to-delete test notes**: Verification notes written solely to exercise the pipeline (e.g. to confirm the `raw/clippings/` write succeeds) are explicitly marked safe to delete once the entry is confirmed.

## Example

A test note authored on 2026-05-16 read:

> *Morning-review pipeline test note for /foundry-capture verification — written by Claude after creating KB Inbox folder. Body must be ≥10 chars so capture script does not skip it. Safe to delete after the capture writes raw/clippings/ entry.*

This note passed the 10-character threshold, was tagged `quick-capture` and `source-apple-notes`, and produced a `raw/clippings/` entry with a SHA-256 canonical hash.

## Common Pitfalls

- **Sub-threshold notes silently dropped**: Any note body under 10 characters is skipped without error — easy to miss during manual capture.
- **type_hint mismatch**: The `type_hint` field on clippings (e.g. `paper`) may not match the actual content type; downstream compile steps should not trust it blindly.
- **Test notes persisting**: Verification notes should be deleted promptly after the pipeline is confirmed, or they pollute the morning-review queue.

## See Also

- [Agent Loops](agent-loops.md) — the broader agentic loop that morning review fits into
- [Agent Observability](agent-observability.md) — monitoring pipeline health and dropped captures
- [KB Inbox](kb-inbox.md) — the inbox concept that foundry-capture populates
