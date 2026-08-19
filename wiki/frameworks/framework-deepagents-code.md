---
id: 01M0D2JPPJXF4JCM6MQ07729JB
title: "Deep Agents Code (dcode)"
type: framework
tags: [agents, orchestration, tools, memory, deployment]
created: 2026-08-19
updated: 2026-08-19
visibility: public
confidence: medium
source: docs-langchain-com-oss-deepagents-code-overview.md
---

# Deep Agents Code (dcode)

## What It Does
Deep Agents Code (`dcode`) is an open source **terminal coding agent** built on LangChain's Deep Agents SDK. It is provider/model agnostic — it works with any LLM and supports switching providers or models — and is installed via a curl script into an interactive CLI/TUI session:

```
curl -LsSf https://langch.in/dcode | bash
dcode
```

It positions itself as a governed, extensible frontend for agentic coding work rather than a single fixed model integration.

## Key Concepts
- **Persistent memory** — carries context (project conventions, learned patterns) across conversations/sessions, not just within a single run.
- **Skills** — customizable, extensible instructions/expertise that shape agent behavior for specific domains or tasks.
- **Approval controls / human-in-the-loop** — gates code execution and sensitive tool operations behind human sign-off, a governance layer on top of autonomous action.
- **Remote sandboxes** — agent tools can run remotely instead of on the local machine, decoupling execution environment from the control plane.
- **Goals and rubrics** — measurable objectives or grading criteria the agent can check against to self-assess completion.
- **Subagents** — task-specific delegation for parallel execution of subtasks.
- **Context compaction** — summarizes older messages and offloads originals to storage, managing context window growth over long sessions.
- **MCP tools** — loads external tools from Model Context Protocol servers, extending capability without custom integration code.
- **Tracing** — integrates with LangSmith for observability and debugging of agent operations.

These capabilities combine a [[concepts/agent-memory-architecture|memory architecture]] (persistent memory + context compaction) with governance primitives (approval controls, rubrics) and extensibility primitives (skills, MCP tools, subagents).

## When to Use It
- Building or evaluating a **local/terminal coding-agent frontend** that needs to support multiple LLM providers.
- Scenarios requiring **governed autonomy**: agents that can execute code but must pause for human approval on sensitive operations.
- Long-running or multi-session coding work where persistent memory and context compaction matter more than one-shot completions.
- Teams already using LangSmith for tracing who want end-to-end observability into agent tool calls.

## Limitations
- Documentation captured here is an overview page only (~340 words); no architectural internals, pricing, or benchmark data are provided.
- No detail on how context compaction decides what to summarize vs. discard, or how rubrics are authored/validated.
- Governance model (approval controls) is described only at a high level — no detail on granularity (per-tool vs. per-command) or audit trail.
- Built on the Deep Agents SDK, so capabilities are bounded by that SDK's design; not evaluated independently here.

## See Also
- [Agent Memory Architecture](../concepts/agent-memory-architecture.md)
- [Agent Loops](../concepts/agent-loops.md)
- [Agent Layer Architecture](../concepts/agent-layer-architecture.md)
