---
id: 01M0V398Q3EFC8YPARSY2JNC30
title: "Workday Agent Platform"
type: entity
tags: [agents, orchestration, architecture, mcp, enterprise]
created: 2026-07-31
updated: 2026-07-31
visibility: public
confidence: medium
source: apple-notes clipping (2026-07-31T19-55-22, "The Opportunity — Workday Agent Platform SEM role")
---

# Workday Agent Platform

Workday's **AI Platform** organization includes an **Agent Platform** team that owns the agent-specific infrastructure layer every agent at Workday depends on. This page captures architectural claims and organizational context surfaced in a job description for a Senior Engineering Manager role leading this team.

## What It Does

The Agent Platform team builds and operates the "paved path" that internal agent developers build on top of, plus the runtimes for workloads the general platform can't reach (including at "member scale" — likely referring to Workday's large enterprise customer base). Per the source:

> "The Agent Platform team owns the agent-specific layer that every agent at Workday depends on: the runtime and execution environment, memory, identity and permissioning, discovery and registry, evaluation, and the tool/MCP interfaces agents use to act."

## Key Concepts

The platform's charter spans six layers, which map closely to concepts already tracked in this KB:

- **Runtime and execution environment** — related to [agent-loops](../concepts/agent-loops.md)
- **Memory** — cross-run memory that "compounds" over time
- **Identity and permissioning** — access control for agents acting on behalf of users/systems
- **Discovery and registry** — how agents/tools are found and composed
- **Evaluation** — see [agent-evaluation](../concepts/agent-evaluation.md) and [agent-evaluation-gaming](../concepts/agent-evaluation-gaming.md)
- **Tool / MCP interfaces** — see [Model Context Protocol](../concepts/agent-harness-model-context.md) conventions; ties to the `mcp` tag

A notable emphasis in the source is turning agent experience into durable primitives:

> "The most durable problems in this space are the ones that let agents get better from their own experience: capturing each run's full reasoning-and-tool-call trajectory as structured, replayable data; turning real-world outcomes into evaluation signal; memory that compounds across runs; and a feedback loop that turns that signal into improved behavior, promoted behind eval gates and safe rollout."

This frames evaluation not as a one-off benchmark but as a continuous feedback loop with "eval gates" for safe rollout — relevant to [agent-failure-modes](../concepts/agent-failure-modes.md) and [agent-evaluation](../concepts/agent-evaluation.md).

## When to Use It

As a reference point for how a large enterprise SaaS company (HR/finance systems) is organizing agent infrastructure as a distinct platform layer, separate from application-level agent development. Useful for comparing platform layering strategies against [agent-layer-architecture](../concepts/agent-layer-architecture.md).

## Limitations

- This is sourced from a single job posting/personal note, not technical documentation — treat architectural claims as directional, not verified implementation detail.
- No public technical specs, benchmarks, or diagrams are included in the source.
- Confidence: medium (stated intent/charter, not observed system behavior).

## See Also
- [agent-layer-architecture](../concepts/agent-layer-architecture.md)
- [agent-evaluation](../concepts/agent-evaluation.md)
- [agent-harness-model-context](../concepts/agent-harness-model-context.md)
