---
id: 01M0V3JC8K5EHG85TQBQV5E25C
title: "Pattern: Governed Agent Lifecycle"
type: pattern
tags: [patterns, orchestration, safety, agents, workflow]
created: 2026-08-19
updated: 2026-08-19
visibility: public
source: clippings/2026-08-19T00-45-01__apple-notes__mission-control-full-repository-audit-and-e2e-qualification-__cff88980.md
confidence: medium
related: [mission-control]
---

# Pattern: Governed Agent Lifecycle

A staged pipeline for running autonomous coding/software-delivery agents under explicit human control, first observed in the [Mission Control](../entities/mission-control.md) project. The pattern treats agent output as **execution of bounded work that must pass independent verification before it can be trusted**, rather than treating "the agent said it's done" as a terminal state.

## When to Use

Use this pattern when building a system where autonomous agents perform consequential work (code changes, deployments, data mutations) and:

- Humans need to remain the final authority on acceptance.
- Agent self-reported completion is not sufficient evidence of correctness.
- Work needs to be traceable back to an originating intent (a "mission" or "constitution") rather than an ad-hoc prompt.
- The system needs to learn from past executions (a feedback/memory loop) rather than repeating the same mistakes.

It is overkill for single-shot, low-stakes agent tasks where a simple [agent loop](../concepts/agent-loops.md) with a human in the loop is sufficient.

## Structure

The lifecycle is a linear chain of stages, each producing an artifact consumed by the next:

```
Constitution → Mission → Specification → Plan → WorkOrder → Context →
Execution → Independent Verification → PR → Human Acceptance → Factory Learning
```

- **Constitution**: the durable, top-level rules/values the system must never violate (analogous to a system prompt / governing policy).
- **Mission**: a concrete high-level objective derived from the constitution.
- **Specification**: a detailed, checkable description of what "done" means for the mission.
- **Plan**: a decomposition of the specification into ordered steps.
- **WorkOrder**: a bounded unit of work assigned to an executing agent.
- **Context**: the harnessed information (files, memory, tools) given to the agent for that WorkOrder — see [agent harness model context](../concepts/agent-harness-model-context.md).
- **Execution**: the agent actually performing the bounded work.
- **Independent Verification**: a *separate* process/agent checks the execution against the specification — explicitly decoupled from the executing agent so that "agent says done" is never trusted on its own.
- **PR**: verified work is packaged into a reviewable artifact (e.g., a pull request).
- **Human Acceptance**: a human makes the final consequential decision to merge/ship.
- **Factory Learning**: outcomes (successes, defects, verification failures) feed back into a memory/learning system that improves future missions and plans.

## Example

In Mission Control, an audit directive instructs an agent to first build a full mental model of the repository (users, workflows, architecture, trust boundaries, verification semantics, execution lifecycle, recovery model, observability, and "factory learning" model) *before* touching code — explicitly enforcing the "understand before executing" discipline that the lifecycle depends on. The three principles called out as inviolable are a direct expression of this pattern's guarantees:

> Humans retain consequential authority. Agents execute bounded work. Agent completion does not equal verified success.

## Trade-offs

**Pros:**
- Strong safety/correctness guarantees via mandatory independent verification.
- Clear audit trail from top-level intent (Constitution/Mission) down to individual WorkOrders.
- Supports organizational learning via the Factory Learning stage, reducing repeat failures — connects to [agent evaluation](../concepts/agent-evaluation.md) and [agent evaluation gaming](../concepts/agent-evaluation-gaming.md) concerns (verification must be resistant to gaming).

**Cons:**
- High process overhead — not worth it for low-stakes or exploratory agent tasks.
- Requires building and maintaining several distinct subsystems (spec authoring, planning, verification, PR generation, memory/learning) rather than a single agent loop.
- Risk of the lifecycle stages becoming bureaucratic theater if verification isn't truly independent (see [agent evaluation gaming](../concepts/agent-evaluation-gaming.md)) or if "Human Acceptance" becomes a rubber stamp.

## Related Patterns

- [Agent layer architecture](../concepts/agent-layer-architecture.md)
- [Agent failure modes](../concepts/agent-failure-modes.md)
- [Agent harness model context](../concepts/agent-harness-model-context.md)
- [Mission Control entity page](../entities/mission-control.md)
