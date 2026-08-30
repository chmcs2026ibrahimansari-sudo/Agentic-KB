---
id: 01M06A7QYP1FD2VM9C08ZD2Q2B
title: "Forward Deployed Engineering for Production AI Agents"
type: pattern
tags: [agents, deployment, architecture, workflow, enterprise]
created: 2026-08-16
updated: 2026-08-16
visibility: public
confidence: medium
related: [agent-layer-architecture, agent-observability, agent-evaluation]
source: linkedin-com-posts-maryammiradi-forward-deployed-engineering-101-for-share-7491586783273603072-ov8f.md
---

# Forward Deployed Engineering for Production AI Agents

Forward Deployed Engineering (FDE) is an organizational and technical pattern for shipping highly technical AI agent products to customers who care about business outcomes, not architecture. It embeds engineers directly with customers while keeping the underlying agent platform shared and reusable.

> ⚠️ **Note on source**: This page is compiled from a LinkedIn post (Maryam Miradi, PhD) summarizing a 7-step FDE roadmap for production AI agents. It is a practitioner opinion piece, not a peer-reviewed source — treat claims as directional guidance rather than established best practice.

## When to Use

- The product/platform is highly technical (complex agent orchestration, tool integration, custom data access) but the buyer is not technical.
- Customers have specific, varied workflows that a one-size-fits-all agent can't satisfy out of the box.
- You need a repeatable way to translate ambiguous business problems into working agent deployments without rebuilding from scratch each time.
- Do **not** adopt FDE just because it's trendy — if the product is simple enough for self-serve configuration, plain customer success or solutions engineering may suffice.

## Structure

The pattern follows a 7-step roadmap from customer problem to production agent:

1. **Check if you need FDE** — confirm the product is technical enough and the buyer isn't, to justify embedded engineering.
2. **Build the platform first** — create reusable agent primitives: tools, data access, auth, memory, evals, observability, human-approval gates. This shared foundation is what separates FDE from a bespoke dev shop.
3. **Put engineers with customers** — FDEs remain software engineers but work directly with customers to discover workflows, constraints, and edge cases, translating business context into working systems.
4. **Configure, don't rebuild** — reuse the platform maximally; isolate only the truly customer-specific bespoke logic (same agent runtime, different tools/rules/data/approval paths).
5. **Build for the outcome** — start from the desired business result (faster claims, safer operations, fewer manual steps) and design the agent workflow backwards from it, rather than selling architecture.
6. **Generalize what repeats** — patterns that recur across customers get promoted from bespoke logic into the shared platform, turning FDE into a discovery engine for the core product team.

## Example

An operations leader wants faster incident resolution — not an explanation of agent orchestration. The FDE embeds with that customer, configures the shared agent platform's tools/data-access/approval paths for their specific incident workflow, and ships a working agent without starting from a blank repo. If several customers need the same approval pattern, it gets generalized into the platform's shared primitives.

## Trade-offs

- **Pro**: Keeps customer-facing engineering effort scoped to configuration rather than reinvention, which scales better than a pure custom-dev model.
- **Pro**: Feeds real-world usage patterns back into the core platform, improving it over time.
- **Con**: Requires significant upfront investment in shared primitives (tools, memory, evals, [observability](../concepts/agent-observability.md), human-approval gates) before FDE can be efficient — premature FDE without a platform just becomes a dev shop.
- **Con**: Relies on engineers who can operate as "customer-facing software engineers," a hybrid skill set that's hard to hire for.
- **Con**: Risk of bespoke logic sprawl if step 6 (generalize what repeats) isn't disciplined.

## Related Patterns

- [Agent layer architecture](../concepts/agent-layer-architecture.md) — the shared primitives (tools, memory, evals) referenced in Step 2 map onto layered agent architecture concepts.
- [Agent observability](../concepts/agent-observability.md) — observability is called out explicitly as a required shared primitive.
- [Agent evaluation](../concepts/agent-evaluation.md) — evals are part of the reusable platform foundation FDE depends on.

## See Also

- [Refinery summary: Maryam Miradi — Forward Deployed Engineering for Production AI Agents](../summaries/linkedin-com-posts-maryammiradi-forward-deployed-engineering-101-for-share-7491586783273603072-ov8f.md)
- [Agent layer architecture](../concepts/agent-layer-architecture.md)
- [Agent observability](../concepts/agent-observability.md)
- [Agent evaluation](../concepts/agent-evaluation.md)
