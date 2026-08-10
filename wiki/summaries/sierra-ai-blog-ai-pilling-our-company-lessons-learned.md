---
title: Sierra — AI-pilling Our Company: Lessons Learned
type: summary
source_file: raw/framework-docs/sierra-ai-blog-ai-pilling-our-company-lessons-learned.md
source_url: https://sierra.ai/blog/ai-pilling-our-company-lessons-learned
author: Neil Rahilly
date_published: 2026-07-09
date_ingested: 2026-08-10
tags: [agentic, orchestration, mcp, context-management, evaluation, human-in-the-loop]
key_concepts: [single-agent-front-door, proactive-agents, mcp-gateway, systems-of-record, outcome-metrics]
confidence: high
---

# Sierra — AI-pilling Our Company: Lessons Learned

## Source

- Raw source: `raw/framework-docs/sierra-ai-blog-ai-pilling-our-company-lessons-learned.md`
- URL: https://sierra.ai/blog/ai-pilling-our-company-lessons-learned
- Author/date: Neil Rahilly, 2026-07-09

## TL;DR

Sierra argues that enterprise agent adoption works best through one visible agent front door, persistent/proactive workflows, permissioned business context via an MCP gateway, artifacts written back to systems of record, and outcome metrics beyond activity counts.

## Key Points

- Sierra started with multiple role-specific internal agents, then collapsed them into a single agent, Pinecone, because employees should not need to remember which bot maps to which function and because important work crosses department boundaries.
- Pinecone is designed to persist across days or weeks of work and become proactive when a webhook, Linear task, review, or other artifact creates the next step.
- Sierra frames business context — not model intelligence — as the bottleneck. Their MCP Gateway gives agents access to 37 systems while inheriting employee access, enforcing policy at each tool call, isolating customer data, and leaving audit trails.
- The agent is the UI and systems of record remain the backend: GitHub holds PRs, Salesforce holds accounts, Linear holds issues, and artifacts are edited in place rather than described in chat.
- Sierra reports 75,000+ Pinecone sessions, 600+ users, and 70% of PRs opened through it, but explicitly warns that sessions, tool calls, token usage, and PR counts are adoption/activity metrics — not proof of business value.

## Reusable Ideas for Agentic-KB

- Reinforces [[syntheses/synthesis-agentic-engineering-operating-model]]: Hermes should be the visible control surface, with specialized agents and scheduled jobs as backend lanes.
- Strengthens [[patterns/pattern-agent-as-ui-system-of-record-backend]]: useful agent output should land in the backend system where the work belongs, not remain as chat.
- Supports [[patterns/pattern-outcome-metrics-for-agent-adoption]]: adoption telemetry is useful early, but the real evaluation target is cycle time, quality, issue resolution, user time saved, or business outcome movement.
- Connects to credential/context safety concerns in [[patterns/pattern-sandbox-auth-proxy]] and [[concepts/multi-tenancy-agents]] through Sierra's MCP Gateway claims.

## Caveats

- Adoption and PR percentage metrics are source-reported by Sierra and not independently verified in this KB.
- Sierra promises deeper architecture posts on Pinecone, MCP Gateway, and Agency; those primary technical details are not yet captured.
