---
title: "LangChain Deep Agents Code — Overview"
type: summary
source_file: raw/framework-docs/docs-langchain-com-oss-deepagents-code-overview.md
source_url: https://docs.langchain.com/oss/deepagents/code/overview
author: LangChain
date_published: ""
date_ingested: 2026-08-27
tags: [agentic, coding-agents, langchain, sandboxing, observability]
key_concepts: [deep-agents-code, coding-agent-frontends, approvals, context-compaction]
confidence: medium
---

# LangChain Deep Agents Code — Overview

## Source

- Raw source: `raw/framework-docs/docs-langchain-com-oss-deepagents-code-overview.md`
- URL: https://docs.langchain.com/oss/deepagents/code/overview
- Captured context: Jay flagged this for local coding-agent frontends backed by governed sandboxes.

## TL;DR

Deep Agents Code (`dcode`) is LangChain's terminal coding agent built on the Deep Agents SDK, with model/provider switching, persistent memory, skills, approval controls, remote sandboxes, subagents, context compaction, MCP tools, goals/rubrics, and LangSmith tracing.

## Key Points

- **Coding-agent frontend:** `dcode` is positioned as a terminal coding agent rather than a general web product.
- **Model/provider agnostic:** The overview says it works with any large language model and can switch providers/models.
- **Governed autonomy:** Approval controls gate code execution and other sensitive operations.
- **Remote execution:** Agent tools can run in remote sandboxes instead of the local machine.
- **Long-running context:** Persistent memory and context compaction keep project conventions, learned patterns, and older-session context available without leaving everything in the prompt.
- **Quality/control surfaces:** Goals/rubrics, subagents, MCP tools, and LangSmith tracing appear as built-in capabilities.

## Extracted KB Updates

- Supports [[frameworks/framework-deepagents-code]] as the local/TUI coding-agent surface in the DeepAgents ecosystem.
- Related to [[patterns/pattern-backend-sandbox-separation]] because `dcode` is the local frontend form of the separated brain/backend architecture.
- Related to [[concepts/agent-observability]] through LangSmith tracing.

## Jay-Relevant Takeaway

For MissionControl, `dcode` is another proof point that coding-agent UX is splitting into frontends plus runtime backends. The useful pattern is not the terminal itself; it is governed execution, remote sandbox support, persistent memory, rubrics, and traceability around a coding loop.

## Caveats

- The source is a short overview only. It does not specify approval granularity, trace schema, compaction policy, or sandbox isolation guarantees.

## Sources

- `raw/framework-docs/docs-langchain-com-oss-deepagents-code-overview.md`
