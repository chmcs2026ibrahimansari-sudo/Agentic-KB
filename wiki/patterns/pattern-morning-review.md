---
id: 01KX97WC7CEPMQ0J6CRWKH387B
title: "Morning-Review Pipeline"
type: pattern
tags: [workflow, automation, knowledge-base, agents]
created: 2026-05-16
updated: 2026-05-16
visibility: public
confidence: medium
---

# Morning-Review Pipeline

## When to Use

Use this pattern when you have a continuous stream of captured notes (from tools like `foundry-capture`) that need to be triaged, processed, and routed into the right part of the knowledge base on a regular cadence. It works best as a recurring daily or session-start ritual.

## Structure

1. **Capture** — Notes from external sources (Apple Notes, browser clips, voice) land in a designated `KB Inbox` folder and are ingested by [foundry-capture](../concepts/foundry-capture-pipeline.md) into `raw/clippings/`.
2. **Review** — A review agent or manual pass scans `raw/clippings/` for new entries.
3. **Triage** — Each clipping is assessed: discard, defer, or compile into a wiki page.
4. **Compile** — Actionable clippings are passed to `/api/compile` (or equivalent) to generate structured wiki pages.
5. **Archive** — Processed clippings are moved out of the inbox to avoid reprocessing.

## Example

Each morning, the pipeline checks `raw/clippings/` for entries written overnight by `foundry-capture`. A test note (`test-capture-2026-05-16`) was placed in the KB Inbox to verify the pipeline end-to-end — once the `raw/clippings/` entry is confirmed, the test note is deleted as a disposable artifact.

## Trade-offs

| Pro | Con |
|---|---|
| Keeps the KB fresh with minimal manual effort | Requires discipline to run the review consistently |
| Centralises intake via a single `raw/clippings/` location | Short or malformed notes may be silently dropped by the capture script |
| Composable — capture and compile steps are independent | Test/smoke-test artifacts can accumulate if not pruned |

## Related Patterns

- [Foundry Capture Pipeline](../concepts/foundry-capture-pipeline.md) — the upstream capture step this pattern depends on
- [Agent Loops](../concepts/agent-loops.md) — the broader loop pattern this morning-review cycle exemplifies
- [Agent Observability](../concepts/agent-observability.md) — useful for monitoring whether captures and reviews are completing successfully

## See Also

- [Foundry Capture Pipeline](../concepts/foundry-capture-pipeline.md)
- [Agent Loops](../concepts/agent-loops.md)
- [Agent Memory Runtime](../concepts/agent-memory-runtime.md)
