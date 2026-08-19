---
title: "Deep Agents Code - Docs by LangChain"
source_url: "https://docs.langchain.com/oss/deepagents/code/overview"
captured: 2026-08-18T23:09:03-0700
captured_by: hermes-agentic-kb-scout
word_count: 340
status: unprocessed
---

Source note: Apple Notes 2026-08-16 via @hwchase17: DeepAgents code/TUI architecture; extract patterns for local coding-agent frontends backed by governed sandboxes.
Extraction method: direct-html
Extraction attempts: jina:401; direct:200:text/html; charset=utf-8

# Deep Agents Code

Copy pageCopy page

Terminal coding agent built on the Deep Agents SDK

Copy pageCopy page

Deep Agents Code (`dcode`) is an open source coding agent built on the [Deep Agents SDK](/oss/python/deepagents/quickstart).
It works with any large language model and supports switching providers or models.
Persistent memory carries context across conversations, customizable skills shape behavior, and approval controls gate code execution.

## [​](#get-started) Get started

Run the following command to install Deep Agents Code and launch an interactive session:

```
curl -LsSf https://langch.in/dcode | bash
dcode
```

See the [Quickstart](/oss/deepagents/code/quickstart) to add provider credentials, run your first task, and learn interactive mode.

[Your browser does not support the video tag.](https://mintcdn.com/langchain-5e9cc07a/RVTbVyxmLiI04cgS/oss/images/deepagents/dcode-small.mp4?fit=max&auto=format&n=RVTbVyxmLiI04cgS&q=85&s=0d35e29a34f349183e83bd3d1eceb68b)

## [​](#capabilities) Capabilities

## Remote sandboxes

Run agent tools remotely instead of on your local machine.

## Goals and rubrics

Define measurable objectives or grading criteria so the agent can check whether work is done.

## Subagents

Delegate work to task-specific subagents for parallel execution.

## Memory

Store and retrieve information across sessions, including project conventions and learned patterns.

## Context compaction

Summarize older messages and offload originals to storage.

## Human-in-the-loop

Require human approval for sensitive tool operations.

## Skills

Extend agent capabilities with custom expertise and instructions.

## MCP tools

Load external tools from Model Context Protocol servers.

## Tracing

Trace agent operations in LangSmith for observability and debugging.

## [​](#next-steps) Next steps

## Quickstart

Install Deep Agents Code, run your first task, and use interactive or non-interactive modes.

## Configuration

Set up credentials, `config.toml`, environment variables, hooks, and CLI flags.

---

[Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.

[Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/deepagents/code/overview.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).

Was this page helpful?

YesNo

[Quickstart

Next](/oss/deepagents/code/quickstart)

⌘I
