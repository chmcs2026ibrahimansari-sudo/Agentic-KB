---
id: 01M0GY6XT0W5PN8NFPNMYEYTDW
title: "Code Owns the Control Plane"
type: pattern
tags: [agents, orchestration, architecture, workflow, agent-failure-modes]
created: 2026-08-18
updated: 2026-08-18
visibility: public
source: https://github.com/disler/super-simple-software-factory
---

# Pattern: Code Owns the Control Plane

## When to Use
Use this pattern whenever you need a multi-step agentic workflow (e.g. plan → build → test → review) to be **repeatable** and **debuggable**, not just occasionally impressive. It's especially valuable when a single freeform agent loop has produced inconsistent results across runs, or when failures are hard to localize because the only record is a full transcript.

## Structure
The core move is separating *sequencing/retries/acceptance* from *the actual work*:

- **Deterministic code (e.g. Python)** owns the graph: it decides what phase runs next, how retries happen, and what counts as "done"
- **Agents are bounded nodes** inside named phases — they do work, but do not control sequencing or self-certify completion
- **Typed JSON envelopes** are the only way context crosses a phase boundary, preventing implicit state leakage
- **Gates** (code-checked acceptance criteria) replace the agent's own claim of completion
- **Every event streams into a trace store** (e.g. SQLite) live, so a run can be inspected phase-by-phase rather than read as a narrative transcript

This is summarized as: **"Agent proposes, code disposes."**

## Example
[Super Simple Software Factory](../frameworks/super-simple-software-factory.md) implements this literally: an "ADW script" (AI Developer Workflow) written in Python sequences phases like engineer, planner, builder, and reviewer. Each phase is a bounded agent task; a retry resumes the live session instead of cold-starting, because the correction is cheaper than a restart. All events land in a SQLite trace DB that a UI polls in real time.

## Trade-offs
**Pros:**
- Failures are localizable to a specific phase instead of an opaque end-to-end run
- Retries are cheap corrections, not full restarts, preserving agent context/progress
- Runs become reproducible instead of "run it twice, get two different systems"
- Acceptance is a named, checkable gate instead of "the agent stopped talking"

**Cons / costs:**
- Requires upfront investment in writing and maintaining deterministic control code — this is explicitly framed as the source of "leverage": more investment in the code side yields more consistency
- Adds architectural overhead (envelopes, gates, trace infrastructure) that may be unnecessary for simple, one-off agent tasks — the source itself notes "agents are great, you do not always need one"
- Requires discipline to keep the agent's scope bounded to a single phase; blurring this boundary reintroduces the original problem (no seams, no acceptance criteria)

## Related Patterns
- Related to phase/gate-based execution seen in [agents/workers/gsd-executor](../agents/workers/gsd-executor/profile.md) and [agents/workers/gsd-verifier](../agents/workers/gsd-verifier/profile.md), which similarly separate execution from verification
- Contrasts with a single large agent "owning its own loop with no phase boundary and no acceptance," which the source explicitly identifies as the failure mode this pattern fixes — see [concepts/agent-failure-modes.md](../concepts/agent-failure-modes.md)
- Complements [concepts/agent-evaluation.md](../concepts/agent-evaluation.md) by making acceptance criteria explicit and code-checked rather than agent self-reported

## See Also
- [Super Simple Software Factory](../frameworks/super-simple-software-factory.md)
- [concepts/agent-loops.md](../concepts/agent-loops.md)
- [concepts/agent-failure-modes.md](../concepts/agent-failure-modes.md)
