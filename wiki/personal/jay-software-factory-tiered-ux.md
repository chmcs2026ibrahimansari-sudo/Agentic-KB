---
id: 01M0V3DQX8S6TKPZK7Z6F19AE3
title: "Jay: Tiered UX for Software Factory / Mission Control"
type: personal
tags: [personal, jay-stack, agents, orchestration, workflow]
created: 2026-08-15
updated: 2026-08-15
visibility: private
confidence: speculative
source: clippings/2026-08-15T20-57-05__apple-notes__software-factory-review-vs-super-simple-software-factory-tie__b1d28b23.md
related: [software-factory, summary-super-simple-software-factory]
---

# Jay: Tiered UX for Software Factory / Mission Control

## Context
While reviewing [disler/super-simple-software-factory](https://github.com/disler/super-simple-software-factory) (repo + screenshot + video transcript), Jay flagged it as a benchmark to compare against his own "software factory / mission control" setup. Action item captured in raw note: turn the comparison into a Codex prompt with concrete suggestions, recommendations, features, and improvements.

## Key Idea: Basic / Intermediate / Advanced Toggle
Jay's own addition to the concept (not from the source video): his software factory / mission control UI needs a **complexity toggle** with three tiers so users aren't overwhelmed:

- **Basic** — minimal surface area, sane defaults, few knobs.
- **Intermediate** — more configuration exposed (e.g. model selection per step, some observability).
- **Advanced** — full feature set: multi-model orchestration, full swim-lane observability, custom agent chaining, etc. (mirrors what the reference [software factory](../concepts/software-factory.md) exposes by default).

## Action Items
- [ ] Review super-simple-software-factory repo + screenshot against current mission control implementation.
- [ ] Draft a Codex prompt summarizing: gaps, recommended features, and the basic/intermediate/advanced toggle design.
- [ ] Decide which features (observability swim-lanes, multi-model orchestration) belong in which tier.

## See Also
- [software-factory](../concepts/software-factory.md)
- [summary-super-simple-software-factory](../summaries/summary-super-simple-software-factory.md)
