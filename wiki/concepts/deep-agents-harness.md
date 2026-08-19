---
id: 01M0D2HJ06MZTTAMY5VQ5BP0Z2
title: "Deep Agents Harness"
type: concept
tags: [agents, orchestration, architecture, tools, memory]
created: 2026-08-19
updated: 2026-08-19
visibility: public
confidence: high
source: docs-langchain-com-langsmith-python-managed-deep-agents-overview
related: [framework-managed-deep-agents, agent-loops, agent-memory-architecture]
---

# Deep Agents Harness

## Definition
The Deep Agents harness is the reusable "agent loop" component that LangChain's [Managed Deep Agents](../frameworks/framework-managed-deep-agents.md) framework provides underneath a developer's business logic. It handles four core responsibilities: **planning**, **tool calling**, **filesystem management**, and **delegation to subagents**. Rather than each project re-implementing this loop, the harness is supplied as infrastructure, and the developer only supplies configuration (model, instructions, skills, tools, middleware, MCP connectors) that plugs into it.

## Why It Matters
This is a concrete instance of separating an agent's *intelligence* (prompts, tools, skills) from its *execution substrate* (the loop that actually plans and acts). It relates directly to [agent-loops](agent-loops.md) as a generic concept, but adds two distinctive elements worth tracking across the KB:

- **Filesystem as agent state**: the harness manages a filesystem the agent can read/write during execution, functioning as working memory/scratch space beyond the context window — relevant to [agent-memory-architecture](agent-memory-architecture.md).
- **Skills as procedural knowledge units**: a `SKILL.md` file (name, description, numbered steps) is a lightweight, file-based way to inject reusable procedures into an agent's behavior without hardcoding them into the system prompt. This is a distinct pattern from tool definitions — skills describe *when and how* to combine tools/reasoning steps for a class of tasks, not a single callable action.
- **Subagent delegation**: the harness natively supports spawning/calling subagents as part of the loop, suggesting deep agents are architected for multi-agent decomposition by default rather than as an add-on.

## Example
From the source, a research-assistant agent is composed of:
- an `internet_search` tool,
- a `research` skill ("gather and synthesize context before answering complex questions" — search docs when relevant, summarize before responding),
- an audit middleware that logs every tool call via `wrap_tool_call`,
- and an MCP connector exposing a `search_docs_by_lang_chain` tool from a remote LangChain docs MCP server.

The harness is what actually runs this composition as a live agent loop — deciding when to invoke the skill, call the tool, or delegate — while the developer only declared the pieces.

## See Also
- [Managed Deep Agents (LangChain)](../frameworks/framework-managed-deep-agents.md)
- [Agent Loops](agent-loops.md)
- [Agent Memory Architecture](agent-memory-architecture.md)
