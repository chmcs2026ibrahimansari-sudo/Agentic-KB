---
id: 01M06AZMHDSYTEZHY7GC6KHZB0
title: "GSD UI Checker"
type: entity
tags: [agents, orchestration, evaluation, workflow, patterns]
created: 2026-08-16
updated: 2026-08-16
visibility: public
confidence: high
source: my-agents/gsd-ui-checker.md
related: [gsd-ui-researcher, gsd-ui-auditor]
---

# GSD UI Checker

`gsd-ui-checker` is a read-only validation subagent in the GSD (Get Stuff Done) agent system. It verifies that a `UI-SPEC.md` design contract is complete, consistent, and implementable **before** planning/execution begins. It is spawned by the `/gsd:ui-phase` orchestrator immediately after `gsd-ui-researcher` produces or revises `UI-SPEC.md`.

## What It Does

The checker reads the UI-SPEC (and supporting context) and produces one of three verdicts per finding:

- **BLOCK** — must-fix issue that would create design debt or ambiguity for the executor
- **FLAG** — should-fix issue, non-blocking but risky
- **PASS** — dimension satisfied

It never modifies `UI-SPEC.md` itself — it only reports findings back to `gsd-ui-researcher`, which owns the fix. This separation of "checker" (read-only critique) from "author" (read-write revision) mirrors a broader supervisor/critic pattern seen elsewhere in the GSD agent stack.

## Key Concepts

**Mandatory initial read**: if given a `<files_to_read>` block, the checker must load every listed file via the `Read` tool before doing anything else — this is treated as primary context, ahead of its own judgment.

**Project context discovery**: before verifying, it checks for `./CLAUDE.md` (project conventions) and `.claude/skills/` or `.agents/skills/` directories, loading only lightweight `SKILL.md` indexes and specific `rules/*.md` files as needed — explicitly avoiding loading full `AGENTS.md` files (100KB+) to control context cost.

**Upstream inputs**:
| Source | Role |
|---|---|
| `UI-SPEC.md` | Primary artifact under review |
| `CONTEXT.md` | Locked decisions (must be reflected) and deferred ideas (must NOT appear) |
| `RESEARCH.md` | Standard Stack section used to verify component library choice matches |

**Six verification dimensions** (first two documented in source excerpt):

1. **Copywriting** — BLOCKs generic CTA labels ("Submit", "OK", "Cancel"), missing/placeholder empty states ("No results"), and error copy without a solution path. FLAGs missing confirmation on destructive actions and single-word CTAs without a noun.
2. **Visuals** — FLAGs missing focal point declarations, icon-only actions without accessible label fallback, and absence of declared visual hierarchy.

(Additional dimensions — color, spacing/grid, typography scale, and third-party component safety gates — are referenced via its "critical mindset" checklist: accent colors reserved for "all interactive elements" defeat the purpose; more than 4 declared font sizes creates visual chaos; spacing not in multiples of 4 breaks grid alignment; third-party registry blocks need a safety gate.)

## When to Use It

Automatically invoked by the `/gsd:ui-phase` orchestrator as a gate between UI research/spec authoring and downstream planning — either on first spec creation or on re-verification after a researcher revision.

## Limitations

- Read-only by design — cannot self-heal issues it finds, creating a dependency on `gsd-ui-researcher` to act on findings
- Context cost is managed via skill-index loading, but relies on the existence of `CLAUDE.md`/skills directories being properly maintained
- Excerpt available does not fully enumerate all six quality dimensions (only Copywriting and Visuals fully specified in source)

## See Also
- [gsd-ui-researcher profile](../agents/workers/gsd-ui-researcher/profile.md)
- [gsd-ui-auditor profile](../agents/workers/gsd-ui-auditor/profile.md)
