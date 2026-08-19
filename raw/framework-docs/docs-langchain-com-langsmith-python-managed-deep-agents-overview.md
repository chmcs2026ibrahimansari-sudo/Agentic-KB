---
title: "Managed Deep Agents - Docs by LangChain"
source_url: "https://docs.langchain.com/langsmith/python/managed-deep-agents-overview"
captured: 2026-08-18T23:09:03-0700
captured_by: hermes-agentic-kb-scout
word_count: 803
status: unprocessed
---

Source note: Apple Notes 2026-08-16 via @hwchase17/@caspar_br: managed deep agents; mine deployment/runtime/sandbox/context patterns.
Extraction method: direct-html
Extraction attempts: jina:401; direct:200:text/html; charset=utf-8

## On this page

- [Example agent](#example-agent)
- [Core capabilities](#core-capabilities)
- [Next steps](#next-steps)

[Get started](/langsmith/python/managed-deep-agents-overview)

# Managed Deep Agents

Copy pageCopy page

Build your agent as a directory of files while LangSmith runs the harness and runtime.

Copy pageCopy page

Managed Deep Agents (MDA) is the simplest way to build and deploy production agents. You focus on what your agent does. MDA runs it. There are no servers to run and no infrastructure to wire together.
You write the agent’s intelligence: its instructions, the tools it can call, the skills it follows, and you select the model that drives it. MDA provides everything underneath:

- **The Deep Agents harness**: The agent loop that plans, calls tools, manages a filesystem, and delegates to subagents. See [Deep Agents](/oss/python/deepagents/overview).
- **A managed runtime**: [LangSmith Deployment’s Agent Server](/langsmith/agent-server-overview) hosts and operates the agent, and keeps sessions running across restarts.

## [​](#example-agent) Example agent

A managed deep agent consists of a project folder that contains the business logic for its behavior:

- Model & configuration
- Instructions
- Skills
- Tools
- Middleware
- MCP Connectors

agent.py

```
from managed_deepagents import define_deep_agent

from middleware.audit import log_tool_calls
from tools.search import internet_search

agent = define_deep_agent(
    name="research-assistant",
    model="openai:gpt-5.5",
    tools=[internet_search],
    middleware=[log_tool_calls],
)
```

instructions.md

```
# Assistant

You are a helpful assistant.
```

skills/research/SKILL.md

```
---
name: research
description: Gather and synthesize context before answering complex questions.
---

# Research

Use this skill when a task needs more than a direct answer.

1. Identify what information is missing.
2. Search LangChain docs when the question is about LangChain, LangGraph, or LangSmith.
3. Summarize findings before responding to the user.
```

tools/search.py

```
from langchain.tools import tool


@tool(parse_docstring=True)
def internet_search(query: str) -> str:
    """Search the internet for relevant sources.

    Args:
        query: The search query.
    """
    return f"Results for: {query}"
```

middleware/audit.py

```
from collections.abc import Awaitable, Callable

from langchain.agents.middleware import wrap_tool_call
from langchain.messages import ToolMessage
from langchain.tools.tool_node import ToolCallRequest
from langgraph.types import Command


@wrap_tool_call
async def log_tool_calls(
    request: ToolCallRequest,
    handler: Callable[[ToolCallRequest], Awaitable[ToolMessage | Command]],
) -> ToolMessage | Command:
    print(f"Calling tool: {request.tool_call['name']}")
    result = await handler(request)
    print(f"Finished tool: {request.tool_call['name']}")
    return result
```

connectors/mcp.py

```
from managed_deepagents import connectors

connector = connectors.mcp(
    mcp_servers={
        "langchainDocs": {
            "transport": "http",
            "url": "https://docs.langchain.com/mcp",
            "include_tools": ["search_docs_by_lang_chain"],
        },
    },
)
```

When you upload this folder with the `mda` CLI, it will automatically run on managed LangSmith infrastructure.
You provide the business logic, and Managed Deep Agents provides the agent harness and production infrastructure.
To get started, see the [Managed Deep Agents quickstart](/langsmith/python/managed-deep-agents-quickstart).

## [​](#core-capabilities) Core capabilities

Each part of the agent maps to a file or directory. Add the ones your agent needs:


| Capability | Path | Description |
| --- | --- | --- |
| [Model and configuration](/langsmith/python/managed-deep-agents-agent-definition) | `agent.py` | The model and core options. Required. |
| [Instructions](/langsmith/python/managed-deep-agents-instructions) | `instructions.md` | The system prompt that defines how the agent behaves. |
| [Skills](/langsmith/python/managed-deep-agents-skills) | `skills/` | Task-specific playbooks the agent loads when they are relevant. |
| [Tools](/langsmith/python/managed-deep-agents-tools) | `tools/` | Functions the agent calls to run your application logic or reach external services. |
| [MCP connectors](/langsmith/python/managed-deep-agents-mcp-connectors) | `connectors/` | Remote MCP servers that provide tools to the agent. |
| [Middleware](/langsmith/python/managed-deep-agents-middleware) | `middleware/` | Custom logic that runs around model and tool calls. |
| [Sandbox](/langsmith/python/managed-deep-agents-sandboxes) | `sandbox/` | An isolated filesystem and shell for running agent-written code. |
| [Memory](/langsmith/python/managed-deep-agents-memory) | `memory.py` | Preferences and knowledge that persist across threads. |
| [Identity](/langsmith/python/managed-deep-agents-identity) | `identity.py` | Per-caller private threads, memory, and credentials for multi-user deployments. |
| [Channels](/langsmith/python/managed-deep-agents-channels) | `channels/` | Connections to messaging services, such as Slack, that start runs and receive responses. |
| [Schedules](/langsmith/python/managed-deep-agents-schedules) | `schedules/` | Managed cron schedules that run the agent on a recurring basis. |
| [Evals](/langsmith/python/managed-deep-agents-evals) | `evals/` | Harbor-style tasks that test the agent. |

For the full layout, see [Project structure](/langsmith/python/managed-deep-agents-project-structure).

## [​](#next-steps) Next steps

## Quickstart

Create and deploy your first Managed Deep Agent with the `mda` CLI.

## Tutorial

Add a custom search tool, durable memory, and a daily schedule.

---

[Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.

[Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/langsmith/managed-deep-agents-overview.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).

Was this page helpful?

YesNo

[Managed Deep Agents quickstart

Next](/langsmith/python/managed-deep-agents-quickstart)

⌘I
