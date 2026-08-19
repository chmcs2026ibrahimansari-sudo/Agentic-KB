---
id: 01M0BQJ2N2E496AR06QMNS2EEX
title: "Foundry Capture Pipeline"
type: concept
tags: [automation, workflow, knowledge-base, tools]
created: 2026-05-16
updated: 2026-05-16
visibility: public
confidence: speculative
source: clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__57c523ba.md
---

# Foundry Capture Pipeline

## Definition
The **Foundry Capture pipeline** (invoked via `/foundry-capture`) is the ingestion step of the morning-review workflow that pulls quick captures (e.g. Apple Notes) into the knowledge base's `raw/clippings/` directory. It is part of a broader **morning-review pipeline** that routes newly captured notes into a **KB Inbox folder** before they are processed into structured wiki pages.

A known implementation detail: the capture script **skips bodies shorter than 10 characters**, meaning trivially short notes will silently fail to be captured. This is a useful guardrail against empty or accidental captures, but also a gotcha worth remembering when debugging "missing capture" issues.

## Why It Matters
This pipeline is the entry point for all raw material entering the knowledge base — if it fails silently (e.g. due to the 10-character minimum) or misroutes notes, downstream compilation into concepts/patterns/summaries never happens. Verifying it with deliberate test notes (like this one) is a lightweight but important QA practice for KB infra.

## Example
A test note titled `test-capture-2026-05-16` was authored by Claude on 2026-05-16, immediately after creating the **KB Inbox folder**, specifically to verify that `/foundry-capture` correctly writes an entry to `raw/clippings/`. The note documents its own disposability: once the capture pipeline confirms success by producing the `raw/clippings/` entry, the source test note is safe to delete.

## Related Entities
- **Morning-review pipeline** — the parent workflow this capture step belongs to.
- **KB Inbox folder** — staging location created prior to capture testing.
- **Claude** — authored the verification note and created the inbox folder.

## See Also
- [agent-observability](agent-observability.md)
- [agent-evaluation](agent-evaluation.md)
