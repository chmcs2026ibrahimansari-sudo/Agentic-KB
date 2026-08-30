---
title: "LangChain Open SWE — Asynchronous Coding Agent Framework"
type: summary
source_file: raw/framework-docs/langchain-ai-open-swe.md
source_url: "https://github.com/langchain-ai/open-swe"
author: "LangChain AI"
date_published: unknown
date_ingested: 2026-08-30
tags: [agentic, coding-agents, orchestration, langgraph, deepagents, sandboxed-execution]
key_concepts: [open-swe, deep-agents-harness, sandboxed-execution, managed-agents, subagents, mcp]
confidence: high
---

# LangChain Open SWE — Asynchronous Coding Agent Framework

## Source
- Raw source: `raw/framework-docs/langchain-ai-open-swe.md`
- URL: https://github.com/langchain-ai/open-swe
- Capture note: evaluate for cloud coding-agent control-plane patterns, not direct adoption.

## TL;DR
Open SWE is LangChain's open-source internal coding-agent framework: Deep Agents + LangGraph server, isolated cloud sandboxes, Slack/Linear/GitHub invocation, subagents, dashboard/admin surfaces, and PR creation, designed as a customizable org agent rather than a shrink-wrapped product.

## Key Points
- Open SWE targets the internal coding-agent pattern used by engineering orgs: engineers invoke work from Slack, Linear, GitHub, or dashboard surfaces; the agent works in a sandbox and closes the loop with a PR/comment.
- It composes on **Deep Agents** and **LangGraph**, preserving an upgrade path while allowing org-specific tools, middleware, prompts, triggers, and sandboxes.
- Each task runs in an isolated cloud sandbox. Supported providers include LangSmith, Daytona, Runloop, E2B, Modal, and a local development mode. The source warns that `local` has no isolation and should be development-only with HITL enabled.
- Tooling is curated rather than accumulated: shell execution, fetch/http tools, Linear/Slack communication tools, `gh` inside the sandbox through a proxy, built-in Deep Agents file/search/execute/subagent tools, and optional browser automation via Stagehand/Browserbase.
- Observability tools are server-side and credential-scoped: Datadog and read-only LangSmith tools can be loaded only for authorized runs, with credentials encrypted at rest and never placed in the sandbox. The source still flags observability data as attacker-influenced content that can carry prompt injection.
- Corridor guardrails can be loaded as a server-side MCP with only `analyzePlan` exposed; token handling is normalized to Authorization headers rather than query-token URLs.
- Context engineering uses repo-local `AGENTS.md`, source issue/thread context, and optional org-wide `default_prompt.md`. Loading order is default prompt, system prompt sections, then per-repo AGENTS.md.
- Middleware hooks include tool-error handling, mid-run message queue injection, empty-message repair, and step-limit notifications. The source says there is intentionally no after-agent middleware opening PRs; the agent is responsible for commit/push/PR/reply unless a fork adds deterministic backstops.
- Security and governance surfaces include GitHub App permissions, user mappings, allowed org/repo gates, dashboard admin lists, token encryption/rotation, preview/prod separation, and distinct mention handles for preview deployments.
- Deployment is non-trivial: backend LangGraph/FastAPI plus dashboard, GitHub App/OAuth, Slack/Linear webhooks, LangSmith sandbox snapshots, Postgres/Redis, env secrets, and production auth boundaries.

## KB Updates / Links
- Existing page: [[frameworks/framework-open-swe]].
- Related: [[frameworks/framework-deepagents]], [[frameworks/framework-managed-deep-agents]], [[concepts/deep-agents-harness]], [[concepts/sandboxed-execution]], [[patterns/pattern-backend-sandbox-separation]], [[patterns/pattern-credential-gateway]], [[frameworks/framework-mcp]].

## Conservative Notes
- The repo/source is primary, so architecture claims are high-confidence for stated design. No local install or execution was performed in this scheduled pass.
- Adoption risk is setup/ops burden and LangChain ecosystem coupling; the KB should mine patterns before considering direct adoption.
