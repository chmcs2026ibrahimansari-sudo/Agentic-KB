---
title: "Maryam Miradi — Forward Deployed Engineering for Production AI Agents"
type: summary
source_file: raw/framework-docs/linkedin-com-posts-maryammiradi-forward-deployed-engineering-101-for-share-7491586783273603072-ov8f.md
source_url: "https://www.linkedin.com/posts/maryammiradi_forward-deployed-engineering-101-for-share-7491586783273603072-Ov8f/"
author: "Maryam Miradi, PhD"
date_published: 2026-08-08
date_ingested: 2026-08-30
tags: [agentic, deployment, product-management, human-in-the-loop, enterprise, social-source]
key_concepts: [forward-deployed-engineering, production-ai-agents, outcome-metrics, human-in-the-loop, agent-observability]
confidence: medium
---

# Maryam Miradi — Forward Deployed Engineering for Production AI Agents

## Source
- Raw source: `raw/framework-docs/linkedin-com-posts-maryammiradi-forward-deployed-engineering-101-for-share-7491586783273603072-ov8f.md`
- URL: https://www.linkedin.com/posts/maryammiradi_forward-deployed-engineering-101-for-share-7491586783273603072-Ov8f/

## TL;DR
The post frames forward-deployed engineering for AI agents as a customer-outcome pattern: build shared agent primitives first, put engineers close to the customer, configure rather than rebuild, and generalize repeated customer-specific patterns back into the platform.

## Key Points
- FDE is positioned as useful when the product is highly technical but the buyer cares about a business result, not the agent architecture.
- Step 1 is a gate: do not use FDE just because it is fashionable; use it when technical complexity and customer-specific workflow discovery justify embedded engineering.
- Step 2 is the key anti-consultancy rule: build reusable platform primitives first — tools, data access, auth, memory, evals, observability, and human approval.
- FDEs remain software engineers, but work directly with customers to discover workflows, constraints, exceptions, and the business context needed to translate a problem into a working agent system.
- The customization model is configure-not-rebuild: same runtime, different tools, rules, data, and approval paths; bespoke logic should be isolated.
- The outcome design sequence starts from the business result — faster incident resolution, safer operations, fewer manual steps — and works backward to the agent workflow.
- Repeated customer patterns should promote into the shared platform. The post describes FDE as a discovery engine for product, not a permanent bespoke-services arm.
- The production loop should evaluate real workflows, log decisions/tool calls, keep human gates for high-risk actions, and feed reusable learning back into the platform.
- Comments reinforce the same boundary: without shared auth/data/tool/eval/approval primitives, FDE becomes consulting; with them, deployments should reduce customization and time-to-value over time.

## KB Updates / Links
- Existing page: [[patterns/pattern-forward-deployed-engineering]].
- Related: [[patterns/pattern-outcome-metrics-for-agent-adoption]], [[patterns/pattern-embedded-graduation-model]], [[concepts/agent-observability]], [[concepts/agent-evaluation]], [[concepts/human-in-the-loop]].

## Conservative Notes
- Practitioner LinkedIn post; useful as a product/operating-model heuristic, not evidence that FDE is always the right go-to-market structure.
- Strongest Jay-relevant question: are MissionControl/Hopper agent primitives reusable enough that forward deployment would compound, or would it become bespoke customer engineering?
