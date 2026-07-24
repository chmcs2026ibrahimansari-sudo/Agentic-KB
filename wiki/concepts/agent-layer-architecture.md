---
id: 01KX98MD1M1HQDB94788VKP88B
title: "Agent Layer Architecture"
type: concept
tags: [agents, architecture, memory, evaluation, mcp]
created: 2026-05-23
updated: 2026-05-23
visibility: public
confidence: medium
source: "x-twitter — voxyz_ai thread, captured 2026-05-23"
related: [12-layer-agent-map, agent-memory-runtime, agent-evaluation, agent-observability]
---

# Agent Layer Architecture

## Definition

Agent layer architecture is the practice of decomposing an AI agent system into **discrete functional layers**, each responsible for a specific concern. Rather than treating an agent as a single reasoning loop, this view recognises that production agents consist of separable subsystems that can be built, tested, swapped, and failed independently.

Key named layers include:

- **Reasoning Layer** — The LLM or inference engine; the cognitive core that interprets inputs and produces outputs.
- **Protocol Layer** — Structured communication interfaces between agent components or external services (e.g. [MCP — Model Context Protocol](../concepts/mcp.md)).
- **Memory Layer** — Persistence and retrieval of information across interactions; the agent's "notebook." See [Agent Memory at Runtime](../concepts/agent-memory-runtime.md).
- **Evaluation Layer** — Assessment of agent outputs for correctness, safety, or quality; the "health check." See [Agent Evaluation](../concepts/agent-evaluation.md).
- **Control Plane** — Authorization, orchestration, and access governance; the "keycard" that determines what the agent may do and when.

These five are the most clearly articulated in the [12-Layer Agent Map](../frameworks/12-layer-agent-map.md); a full decomposition extends to tool use, planning, data/retrieval, identity, observability, and human-in-the-loop handoff.

## Why It Matters

**Most agent failures are boundary failures**, not model intelligence failures. When layers are implicit or undifferentiated, breakdowns at the seams — between memory and reasoning, between eval and control — are hard to detect, diagnose, or assign ownership to.

Explicit layer architecture:
1. Makes failure modes locatable (which layer broke?)
2. Enables independent testing and verification of each layer
3. Allows tooling to be compared and selected at the right level of abstraction
4. Supports incremental system improvement without full rewrites

## Example

A customer support agent might have:
- **Reasoning**: Claude 3.5 Sonnet interpreting tickets
- **Memory**: Vector store of past interactions + customer CRM data
- **Protocol**: MCP exposing CRM read/write tools
- **Eval**: Automated classifier checking response tone and policy compliance
- **Control Plane**: Role-based permissions limiting which agents can issue refunds

A failure where the agent gives incorrect refund amounts might be traced to the control plane (wrong permission scope) rather than the reasoning layer (the LLM answer was actually correct given what it could see).

## ⚠️ Contradictions

> ⚠️ **Contradiction**: Modern LLM products like ChatGPT increasingly bundle reasoning, memory, tool use, and self-evaluation into a single product surface. This blurs the clean layer separation that layer architecture proposes. The framework is most useful as an analytical and diagnostic lens rather than a strict implementation boundary.

## See Also

- [12-Layer Agent Map](../frameworks/12-layer-agent-map.md)
- [Agent Memory at Runtime](../concepts/agent-memory-runtime.md)
- [Agent Evaluation](../concepts/agent-evaluation.md)
- [Agent Failure Modes](../concepts/agent-failure-modes.md)
- [Agent Observability](../concepts/agent-observability.md)
