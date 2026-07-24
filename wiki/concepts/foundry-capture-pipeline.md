---
id: 01KX98AB7YTEESVBRCTAGD6YQ6
title: "Foundry Capture Pipeline"
type: concept
tags: [automation, workflow, knowledge-base, obsidian]
created: 2026-05-16
updated: 2026-05-16
visibility: public
confidence: medium
related: [concepts/agent-memory-runtime, concepts/agent-observability]
---

# Foundry Capture Pipeline

## Definition

The **foundry-capture pipeline** is an automated ingestion system that reads notes from source applications (e.g. Apple Notes) and writes structured entries into a `raw/clippings/` directory within the knowledge base. It serves as the front door for raw material entering the KB before compilation or review.

Each captured entry is stored as a markdown file with frontmatter metadata (title, source, captured timestamp, canonical hash, and type hint).

## Why It Matters

Capture is the first stage of any knowledge pipeline. Without a reliable, low-friction capture step, raw ideas and clippings never make it into the KB at all. The foundry-capture system automates this so that notes written anywhere (e.g. Apple Notes during a morning review) are reliably pulled in without manual copy-paste.

This mirrors the broader pattern of separating **capture** from **compilation** — raw material lands in `raw/clippings/`, and a separate compile step (`/api/compile`) transforms it into structured wiki pages.

## Key Behaviours

- **Minimum body length**: The capture script skips any note whose body is fewer than 10 characters. This prevents empty or trivial entries from polluting the clippings directory.
- **Source tagging**: Each clipping records its origin application (e.g. `apple-notes`) so provenance is always traceable.
- **Canonical hashing**: A SHA-256-style hash of the note content is stored in frontmatter, enabling deduplication on future runs.
- **KB Inbox integration**: A designated `KB Inbox` folder must exist in the source application before capture runs; the script reads from this inbox and writes to `raw/clippings/`.

## Example

A morning-review note written in Apple Notes and placed in the KB Inbox folder is picked up by foundry-capture and written as:

```
raw/clippings/2026-05-16T08-40-32__apple-notes__test-capture-2026-05-16__9680bdbb.md
```

The resulting file contains YAML frontmatter (title, source, captured_at, canonical_hash) and the raw note body. It is then available for the compile step to process into a structured wiki page.

## Common Pitfalls

- **Forgetting the KB Inbox folder**: If the inbox folder doesn't exist in the source app, the script has nothing to read from. Always create the inbox folder before running capture.
- **Notes under 10 characters**: Test notes or stubs will be silently skipped. Ensure any note intended for capture has a meaningful body.
- **Stale test artifacts**: Verification notes written to test the pipeline (like the one that generated this page) should be deleted after confirming the clippings entry was written, to avoid polluting the compile queue.

## See Also

- [Agent Memory at Runtime](concepts/agent-memory-runtime.md) — how ingested knowledge is made available to agents
- [Agent Observability](concepts/agent-observability.md) — monitoring pipelines like foundry-capture for failures
