---
id: 01M0BQRG9X055RT90STR9YG51J
title: "Single-Agent Front Door"
type: pattern
tags: [agents, orchestration, architecture, enterprise]
created: 2026-07-10
updated: 2026-07-10
visibility: public
confidence: medium
source: "framework-docs/sierra-ai-blog-ai-pilling-our-company-lessons-learned.md"
---

# Single-Agent Front Door

## When to Use
Use this pattern when an organization has deployed multiple role-specific agents (e.g. one per department or job function) and is finding that the most valuable work spans roles rather than sitting neatly inside one. It's especially relevant for internal company tooling and customer-facing agent platforms where users shouldn't need to know which "agent" handles which request.

## Structure
Instead of building a fleet of narrow, role-specific agents (support agent, data-analyst agent, engineering agent, sales agent), collapse them into a single agent with:
- One entry point (one Slack handle, one URL)
- One unbroken conversation thread from question to finished result
- Internal logic that determines which systems/tools to pull from and what actions to take, hidden from the end user

The complexity of routing and system integration is absorbed by the agent itself, not exposed to the human as a menu of choices.

## Example
Sierra's internal AI acceleration team originally built four role-specific agents — PINE (support), Pinewood (data analyst), Pinecone (engineer), and Reggie Jr (sales) — but found employees struggled to remember which agent did what, and that the highest-value work crossed team boundaries (e.g. shipping a product touches engineering, sales, marketing, legal, and ops). They collapsed all of these into a single agent, Pinecone, that figures out which systems to pull from and what to do with a request.

> "Collapsing everything into one agent gets you much closer to where the value in a company lies — the jobs to be done. Every improvement benefits the entire business, so everyone gets better, faster." — Sierra, *AI-pilling our company: lessons learned*

Sierra draws an explicit parallel to their customer-facing product design philosophy: agents built on the Sierra platform are full-service, handling everything from product discovery to billing, rather than acting like an old-school IVR ("press one for sales, press two for support").

## Trade-offs
- **Pro**: Removes the cognitive burden of remembering which agent to talk to; concentrates engineering investment so every improvement compounds across the whole business.
- **Pro**: Better mirrors how real organizational work actually happens — across teams, not within silos.
- **Con**: Technically harder — the single agent must reliably determine intent and route across many systems, which raises the bar on context management, tool selection, and reliability compared to narrow single-purpose agents.
- **Con**: A single front door creates a single point of failure/bottleneck if the underlying routing or tool-selection logic breaks down.

## Related Patterns
- Related to ideas in [agent-layer-architecture](../concepts/agent-layer-architecture.md) and [agent-loops](../concepts/agent-loops.md) for how a single agent maintains context and executes multi-step work.
- See also [summary-sierra-ai-pilling-lessons](../summaries/summary-sierra-ai-pilling-lessons.md) for the broader context this pattern came from.

## See Also
- [summary-sierra-ai-pilling-lessons](../summaries/summary-sierra-ai-pilling-lessons.md)
- [agent-layer-architecture](../concepts/agent-layer-architecture.md)
