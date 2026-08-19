---
id: 01M0BQKG3DSXZ2SRHRZQQ76VEX
title: "Remember-Cite-Forget Framework"
type: framework
tags: [agents, memory, architecture, patterns]
created: 2026-05-23
updated: 2026-05-23
visibility: public
confidence: medium
related: [agent-memory-runtime, agent-layer-architecture]
source: clippings/2026-05-23T11-54-30__x-twitter__voxyz-ai-remember-cite-forget-memory-framework-hermes-critiq__fcf7a929.md
---

# Remember-Cite-Forget Framework

A compact functional decomposition of agent memory, proposed by X/Twitter user `voxyz_ai` as a reaction against naive memory-capacity expansion in agent systems. The claim is that agent memory is never doing just one job — it's simultaneously doing three:

## What It Does

The framework breaks agent memory into three simultaneous jobs, then maps each job to a concrete operational check an architecture must implement:

| Job | Operational Check | Question it Answers |
|---|---|---|
| **Remember** | Layer | Where does this memory live (short-term, episodic, long-term, etc.)? |
| **Cite** | Source | Where did this fact come from — is it traceable/provenanced? |
| **Forget** | Expiry | When does this stop being valid or useful? |

> "agent memory is doing three jobs at once: Remember, Cite, Forget. that's the whole framework."
> "turned the three jobs into three checks: layer, source, expiry."
> "packed the three checks into one [schema/table]" — *voxyz_ai*

The original thread implies these three checks were consolidated into a single schema/table for practical implementation, though the source material was truncated before showing that artifact.

## Key Concepts

- **Layer**: which memory tier/store an item belongs in — connects directly to layered agent architectures. See [agent-layer-architecture](../concepts/agent-layer-architecture.md).
- **Source**: provenance and citation tracking for stored facts, so an agent can justify or invalidate a memory based on where it came from.
- **Expiry**: an explicit freshness/forgetting policy, rather than unbounded accumulation.

The framework was posted as a secondary entry in the same thread as a "12-Layer Agent Map" — suggesting it's part of a broader effort to formalize agent architecture into discrete, checkable layers.

## When to Use It

Use this framework when designing or auditing an agent's memory system — especially before adding more memory capacity. It's a lightweight diagnostic: for any memory write, ask which layer it belongs to, what its source is, and when it expires. If an architecture can't answer all three, it risks becoming disorganized.

## Limitations

- The source thread is a short, informal X/Twitter post — the framework is stated at a high level with no worked implementation shown (the schema/table detail was truncated).
- No empirical validation is provided; the argument is anecdotal (based on the Hermes/OpenClaw experience).
- Confidence is marked **medium** pending fuller documentation of the schema referenced in the original thread.

## See Also
- [Agent Memory Architecture](../concepts/agent-memory-architecture.md)
- [agent-memory-runtime](../concepts/agent-memory-runtime.md)
- [agent-layer-architecture](../concepts/agent-layer-architecture.md)
