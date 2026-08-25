---
id: 01M0V37VND63H7N7JKDDA4GBVE
title: "Jay's Project: Agentic Software Factory"
type: personal
tags: [personal, jay-stack, agents, orchestration, automation]
created: 2026-07-31
updated: 2026-07-31
visibility: private
confidence: speculative
related: [agent-loops, agent-layer-architecture, agent-harness-model-context]
source: apple-notes (My Project - Agentic Software Factory business)
---

# Jay's Project: Agentic Software Factory

Personal project concept for a business built around an "Agentic Software Development Harness" — a system where every developer manages a fleet of agents rather than writing code directly.

## Core Idea

> "Everyone will be responsible for managing a fleet of agents."

Developers shift from writers of code to **operators of agent fleets**:
- During business hours: plan, review implementation plans, review code changes, approve PRs.
- Agents execute during the day and overnight.
- Next morning: developer reviews completed work and merges.
- An operator's job becomes: see what needs attention, make a governed decision, dispatch work, inspect proof.

Each developer runs **multiple epics concurrently** and uses a mix of:
- Long-running cloud agent tasks
- Local LLM inference (open-weight models) for cheap/fast loops
- Frontier lab models for planning and high-stakes execution

### Example model routing (as sketched by Jay)
- **Fable** — planning
- **Composer** — executing tasks
- **Opus** — reviewing coding tasks
- **Local model** — QA, automation, doc writing
- **Cloud agents** (model chosen by task complexity) — long-running work over nights/weekends

## Three Structural Primitives

The note sketches three mechanisms for scaling agentic work, echoing ideas from [agent loops](../concepts/agent-loops.md) and multi-agent orchestration:

1. **Loop (Iteration)** — a single agent runs experiments inside an executable harness (e.g. Karpathy's autoresearch pattern), using a "ratchet" mechanism that retains only metric-improving changes.
2. **Swarm (Parallelism)** — agents run concurrently; frameworks like Anthropic's Dynamic Workflows spawn parallel sub-agents for specialized tasks.
3. **Graph (Persistence)** — knowledge graphs and DAGs externalize shared memory, experiment lineage, and provenance so systems can scale without depending solely on transcript context (see the [Graph Engineering pipeline](../recipes/recipe-graph-engineering-pipeline.md) recipe for how this is built in practice).

## Business Framing

Jay describes himself as:

> "a developer who builds AI systems and automation pipelines that turn technology into real income."

The working name for the business is **AI Software Factory** — an "Agentic Software Development Harness" combining local open-weight models, foundational/frontier models, and RAG + knowledge graphs as the backbone for memory and provenance.

## Open Questions / Next Steps
- Define governance model for what decisions require human approval vs. autonomous agent action.
- Decide on graph DB / retrieval stack (see Graph Engineering recipe).
- Formalize the "ratchet" mechanism for the Loop primitive.

## See Also
- [Agent Loops](../concepts/agent-loops.md)
- [Agent Layer Architecture](../concepts/agent-layer-architecture.md)
- [Agent Harness & Model Context](../concepts/agent-harness-model-context.md)
- [Graph Engineering Pipeline](../recipes/recipe-graph-engineering-pipeline.md)
