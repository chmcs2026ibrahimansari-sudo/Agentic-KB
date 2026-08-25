---
id: 01M0V3FWXEYPDJM2ZVD8K85NFZ
title: "Pattern: Factory Learning Loop"
type: pattern
tags: [agents, orchestration, workflow, evaluation, safety, governance]
created: 2026-08-16
updated: 2026-08-16
visibility: private
confidence: medium
related: [mission-control-factory-system, pattern-system-qualification-run]
source: apple-notes (Factory Learning V1 sequencing and System Qualification Run)
---

# Pattern: Factory Learning Loop

## When to Use
Use this pattern once an agentic system has enough operational substrate (multiple working subsystems, traces, evaluations) that the next highest-value investment is closing the feedback loop — turning observed operational signals into governed, verified improvements — rather than adding more standalone components.

## Structure
The loop is sequenced in stages, each gating the next:

1. **Signals** — raw operational data (corrections, failures, repeated patterns) is captured.
2. **Clustering** — signals are grouped into candidate patterns.
3. **Improvement candidates** — clusters are turned into concrete proposed changes.
4. **Human review** — a human checks candidates before anything runs.
5. **Governed experiment** — the candidate is tested in a sandboxed/governed experiment, not applied directly.
6. **Promotion recommendation** — if the experiment succeeds, a recommendation (not an automatic action) is produced.

A hardening layer wraps the whole loop with explicit constraints:
- The loop **cannot self-authorize** changes.
- It **cannot directly mutate governance**.
- It **cannot bypass verification**.
- It **cannot become a token sink** (i.e., must be resource-bounded).

A UX layer then tiers how much of this is surfaced to different users:
- **Basic**: a few high-confidence recommendations only.
- **Intermediate**: recommendations plus evidence/impact data.
- **Advanced**: raw traces, evals, config drift, and full experiment history.

## Example
A repeated human correction to agent output is captured as a signal, clustered with similar corrections, turned into an improvement candidate, reviewed by a human, tested via a governed experiment, and — if successful — surfaced as a promotion recommendation. It never directly modifies production; any real change requires a separate governed WorkOrder, per the [Mission Control system](../entities/mission-control-factory-system.md)'s core invariant.

## Trade-offs
- **Pro**: Prevents runaway self-modification; every step is checked before the next.
- **Pro**: Tiered UX lets different audiences get appropriately-scoped visibility without overwhelming casual users.
- **Con**: Adds significant latency between "pattern observed" and "change applied" — by design, since speed is traded for governance safety.
- **Con**: Requires mature upstream substrate (signals, traces, evals) to be worth building; premature to adopt before those exist.

## Related Patterns
- [System Qualification Run](../patterns/pattern-system-qualification-run.md) — the E2E test that proves this loop (and everything else) works together as one system.
- [Mission Control / Governed Autonomous Software Factory](../entities/mission-control-factory-system.md) — the broader system this loop is embedded in.
