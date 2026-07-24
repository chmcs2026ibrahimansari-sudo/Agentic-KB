---
id: 01KX98MD1M9RJ2D0MSAY7EEP6C
title: "Layer Evidence Verification"
type: pattern
tags: [agents, evaluation, observability, patterns, architecture]
created: 2026-05-23
updated: 2026-05-23
visibility: public
confidence: medium
source: "x-twitter — voxyz_ai thread (community reply), captured 2026-05-23"
related: [12-layer-agent-map, agent-layer-architecture, agent-evaluation, agent-observability, agent-failure-modes]
---

# Layer Evidence Verification

## When to Use

Use this pattern when building or auditing an agent system where **silent failures at layer boundaries** are a risk. It is especially valuable when:

- Multiple teams own different layers of the agent stack
- The agent performs consequential actions (writes, API calls, financial ops)
- Debugging past failures has been difficult due to lack of observability
- You are extending the [12-Layer Agent Map](../frameworks/12-layer-agent-map.md) into an operational runbook

## Structure

For each layer in the agent architecture, define a mandatory **evidence artifact** that proves the layer functioned correctly before downstream layers proceed. The artifact types are:

| Evidence Type | What It Proves | Example |
|---|---|---|
| **Logs** | Layer executed and produced output | Structured trace with layer ID, input, output, latency |
| **Tests** | Layer output meets quality/correctness threshold | Eval harness asserting output format and factual checks |
| **Permissions** | Control plane authorised the operation | Auth token / RBAC decision log |
| **Rollback** | A recovery path exists if the layer fails | Snapshot before mutation, undo queue |
| **Human signoff** | A human reviewed and approved the output | Approval record with reviewer ID and timestamp |

The full pattern looks like an augmented layer table:

```
| Layer         | Responsibility       | Missing → breaks      | Evidence artifact     |
|---------------|----------------------|-----------------------|-----------------------|
| Reasoning     | Generate output      | No useful response    | Output log + eval     |
| Memory        | Persist/retrieve ctx | Context amnesia       | Read/write logs       |
| Protocol      | Structured comms     | Integration failures  | Request/response logs |
| Eval          | Quality gate         | Bad output ships      | Eval score + test run |
| Control Plane | Auth & orchestration | Unauthorised actions  | Permission audit log  |
```

## Example

A code-generation agent runs a task. Layer evidence verification means:

1. **Reasoning layer** logs the full prompt + completion with a trace ID
2. **Memory layer** records which context chunks were retrieved and from where
3. **Eval layer** runs a static analysis check and a unit test harness; result is logged as `pass/fail` with details
4. **Control plane** records that the agent was authorised to write to the target repo branch
5. **Human signoff** is required (and logged) before the PR is merged

If a bad commit ships, the trace allows pinpointing exactly which layer's evidence is missing or shows a failure.

## Trade-offs

**Pros**
- Transforms invisible boundary failures into detectable, attributable events
- Creates an audit trail for compliance and post-mortems
- Forces explicit ownership: who is responsible for each layer's evidence?

**Cons**
- Adds overhead to every layer — latency and storage costs
- Evidence can become checkbox theatre if not actively reviewed
- Defining meaningful evidence for fuzzy layers (e.g. reasoning quality) is non-trivial
- Human signoff steps add latency and don't scale to fully autonomous pipelines

## Related Patterns

- [12-Layer Agent Map](../frameworks/12-layer-agent-map.md) — the layer decomposition this pattern extends
- [Agent Layer Architecture](../concepts/agent-layer-architecture.md) — conceptual foundation
- [Agent Evaluation](../concepts/agent-evaluation.md) — the eval layer in depth
- [Agent Observability](../concepts/agent-observability.md) — broader observability tooling
- [Agent Failure Modes](../concepts/agent-failure-modes.md) — what goes wrong at boundaries
