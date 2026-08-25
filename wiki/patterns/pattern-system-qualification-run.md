---
id: 01M0V3FWXFQTRMPK8RN6YZWP9Z
title: "Pattern: Full System E2E Qualification Run"
type: pattern
tags: [evaluation, architecture, safety, orchestration, agents]
created: 2026-08-16
updated: 2026-08-16
visibility: private
confidence: medium
related: [mission-control-factory-system, pattern-factory-learning-loop]
source: apple-notes (Factory Learning V1 sequencing and System Qualification Run)
---

# Pattern: Full System E2E Qualification Run

## When to Use
Use once individual subsystems of an agentic control plane are built and working in isolation, and you need to prove the *entire system* behaves correctly as one coherent whole — not just that each component works alone. This is a heavier-weight test than a normal golden-path integration test; it's a qualification gate for the whole architecture.

## Structure
Define a single realistic "Mission" that traverses every major subsystem end-to-end, e.g.:

```
Mission → Plan → recipe recommendation → Factory Version → Context Package →
worker lease → sandbox/local execution → trace/observability → source Attempt →
candidate PR → independent verification Attempt → exact Verification Subject →
frozen Verification Plan → evidence/receipts → exact-current eligibility →
human acceptance → Factory Learning signal generation → improvement candidate →
experiment proposal
```

Then deliberately inject faults to prove negative paths are also handled correctly, not just the happy path:
- stale worker lease
- candidate/PR-head mismatch
- verification failure
- retry / new Attempt lineage
- context miss
- deterministic gate failure
- sandbox cleanup failure or simulated orphan
- model-routing override
- a repeated correction that becomes a Learning Signal
- an Improvement Candidate that cannot directly change production/config without a governed WorkOrder

Critically: **the goal is not "the app works" — it's proving the architectural invariants survive across subsystem boundaries** (e.g., governance can't be bypassed, verification can't be skipped, nothing self-authorizes).

## Example
Once all in-flight work is finished, spin up one dedicated coordinating thread to create a fresh, isolated worktree (e.g. `codex/system-factory-e2e-qualification-v1`) that becomes the single authoritative integration/qualification stream. No new product features are allowed in that worktree unless the qualification run itself exposes a real defect — keeping the qualification effort focused and uncontaminated by feature work.

## Trade-offs
- **Pro**: Forces explicit verification of cross-subsystem invariants (governance, verification, self-authorization limits) that unit/integration tests of individual components can't catch.
- **Pro**: Fault injection surfaces failure-mode handling (retries, lineage, cleanup) before they occur in production.
- **Con**: Expensive and slow to run relative to normal tests; best reserved for qualification milestones, not every commit.
- **Con**: Requires a dedicated, isolated worktree/stream to avoid feature work contaminating the qualification signal — adds process overhead.

## Related Patterns
- [Factory Learning Loop](../patterns/pattern-factory-learning-loop.md) — one of the subsystems this qualification run must prove works correctly, including its governance constraints.
- [Mission Control / Governed Autonomous Software Factory](../entities/mission-control-factory-system.md) — the system under qualification.
