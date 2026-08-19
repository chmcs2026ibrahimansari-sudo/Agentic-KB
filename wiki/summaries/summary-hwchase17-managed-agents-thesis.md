---
id: 01M0BQZGEAKXH4D576HYXGKRVF
title: "Summary: Why Managed Agents Are the Next Big Thing in Agent Building"
type: summary
tags: [agents, orchestration, architecture, deployment, mcp]
created: 2026-08-19
updated: 2026-08-19
visibility: public
confidence: medium
related: [managed-agents, agent-layer-architecture]
source: https://x.com/hwchase17/status/2085780032031760694
---

# Summary: Why Managed Agents Are the Next Big Thing in Agent Building

Source: X/Twitter long-form post by Harrison Chase (LangChain), announcing the launch of "Managed Deep Agents" and laying out a thesis on the evolution of agent building.

## Key Ideas

1. **Eras of agent building**: early AI frameworks/apps (LangChain Oct 2022, ChatGPT Nov 2022, AutoGPT 2023) → mature control frameworks (LangGraph, Google ADK, Vercel AI SDK, 2024–2025) → true agents once models could reliably run "in a loop calling tools" (early-mid 2025), seen in Manus, Deep Research, Claude Code.
2. **Agent harnesses** (Claude Code, Pi, Deep Agents) emerged once the loop became a stable primitive to build on — adding the right tools/environment around it. LangChain's own Deep Agents launched roughly a year prior as an early general-purpose harness.
3. **Two learnings shaped the next step**: (a) common infrastructure primitives — durable execution and sandboxing ("separating the brain and hands"); (b) emerging standards for driving harnesses — AGENTS.md, [[mcp]], and skills for progressive context disclosure.
4. **Three-part split for building agents**: business logic (always custom) + harness (increasingly off-the-shelf) + production infrastructure (runtime durability/resumability, streaming to UI, sandboxing, auth, memory, eval). "Managed agents" run the harness on managed infra so builders only supply business logic.
5. This convergence is framed as unlocking the next wave of production agent building.

> "Off-the-shelf harnesses like Deep Agents have made it easier to get started. But there's lots of challenges you face when trying to run an agent in production!"

## See Also
- [Managed Agents](../concepts/managed-agents.md)
- [Agent Layer Architecture](../concepts/agent-layer-architecture.md)
