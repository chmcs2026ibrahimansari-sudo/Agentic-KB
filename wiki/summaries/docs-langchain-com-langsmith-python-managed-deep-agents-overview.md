---
title: "LangChain Managed Deep Agents — Overview"
type: summary
source_file: raw/framework-docs/docs-langchain-com-langsmith-python-managed-deep-agents-overview.md
source_url: https://docs.langchain.com/langsmith/python/managed-deep-agents-overview
author: LangChain
date_published: ""
date_ingested: 2026-08-27
tags: [agentic, langchain, langsmith, deployment, mcp]
key_concepts: [managed-deep-agents, deep-agents-harness, skills, tools, middleware]
confidence: medium
---

# LangChain Managed Deep Agents — Overview

## Source

- Raw source: `raw/framework-docs/docs-langchain-com-langsmith-python-managed-deep-agents-overview.md`
- URL: https://docs.langchain.com/langsmith/python/managed-deep-agents-overview
- Captured context: Jay flagged this for managed DeepAgents deployment/runtime/sandbox/context patterns.

## TL;DR

Managed Deep Agents lets developers define an agent as a project folder — model config, instructions, skills, tools, middleware, MCP connectors, sandbox, memory, identity, channels, schedules, and evals — while LangSmith runs the harness and managed runtime.

## Key Points

- **Project-as-agent:** The source frames an agent as a directory of files rather than a bespoke server: `agent.py`, `instructions.md`, `skills/`, `tools/`, `middleware/`, and `connectors/`.
- **Harness/runtime split:** Developers write instructions, tools, skills, middleware, and model configuration. LangSmith provides the Deep Agents harness and Agent Server runtime that keeps sessions running across restarts.
- **Deep Agents harness capabilities:** Planning, tool calls, filesystem management, and subagent delegation are supplied by the harness.
- **Middleware hooks:** The example uses `wrap_tool_call` to log before and after tool execution, showing a hook point for audit/observability policy.
- **MCP connectors:** Managed agents can define remote MCP servers and include only selected tools, keeping the connector surface explicit.
- **Production surfaces:** The capability table includes sandbox, memory, identity, channels, schedules, and evals, pointing to a managed-agent product that spans runtime, user identity, recurring jobs, and quality gates.

## Extracted KB Updates

- Supports [[frameworks/framework-managed-deep-agents]] as the canonical page for the LangSmith-managed deployment form.
- Supports [[concepts/deep-agents-harness]] for the reusable planning/tool/filesystem/subagent loop underneath the product.
- Related to [[frameworks/framework-langsmith]] because runtime hosting, tracing, and evals live in the LangSmith ecosystem.

## Jay-Relevant Takeaway

Managed Deep Agents is a clean example of separating agent business logic from runtime ownership. For MissionControl/WAID thinking, the interesting abstraction is not “managed LangChain” — it is folder-defined agent behavior plus a governed runtime that owns sessions, identity, schedules, channels, and evals.

## Caveats

- The captured page is an overview. Pricing, scaling limits, isolation details, skill-selection mechanics, and eval semantics require deeper docs before production comparison.

## Sources

- `raw/framework-docs/docs-langchain-com-langsmith-python-managed-deep-agents-overview.md`
