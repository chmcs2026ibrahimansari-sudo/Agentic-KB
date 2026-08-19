---
id: 01M0D2NHBVWDZQAW8ST3BD2MH3
title: "Open SWE (LangChain)"
type: framework
tags: [agents, orchestration, frameworks, automation, workflow]
created: 2026-08-19
updated: 2026-08-19
visibility: public
confidence: medium
related: [agent-layer-architecture, agent-loops]
source: framework-docs/langchain-ai-open-swe.md
---

# Open SWE (LangChain)

## What It Does
Open SWE is LangChain's open-source framework for building an **internal asynchronous coding agent** — the kind of Slackbot/CLI/web-app coding assistant that engineering orgs like Stripe (Minions), Ramp (Inspect), and Coinbase (Cloudbot) have built internally. It provides cloud sandboxes, Slack/Linear invocation, subagent orchestration, and automatic PR creation out of the box, intended to be customized rather than adopted wholesale.

> "Open-source framework for building your org's internal coding agent."
> — Open SWE README

It is built on top of two other LangChain projects:
- [LangGraph](https://langchain-ai.github.io/langgraph/) — the underlying graph-based agent runtime
- [Deep Agents](https://github.com/langchain-ai/deepagents) — the harness/orchestration layer Open SWE composes on top of, rather than forking

## Key Concepts
- **Agent harness via composition, not forking**: Open SWE composes on Deep Agents (similar to how Ramp built on OpenCode) rather than writing an agent loop from scratch. This preserves an upgrade path to pull in upstream harness improvements while still allowing org-specific customization of tools, orchestration, and middleware.
- **Control-plane pattern**: the agent is invoked from where engineers already work (Slack, Linear) rather than a dedicated UI, and operates against cloud sandboxes with defined permissioning and safety boundaries so it can run with minimal human oversight.
- **Subagent orchestration**: the system decomposes coding tasks across subagents rather than a single monolithic agent loop, connecting to internal tools (`http_request`, `fetch_url`, `linear_comment`, `slack_thread_reply`) via a configurable model/tool/prompt harness.
- **Automatic PR creation**: the end output of a task is a pull request, closing the loop from chat-based task invocation to shipped code change.

## When to Use It
Useful as a reference architecture for teams evaluating **cloud coding-agent control planes** — i.e., systems that need chat-based invocation, sandboxed execution, and subagent orchestration for internal engineering automation. Best suited for orgs willing to customize a harness rather than needing a fully packaged product.

## Limitations
- Documentation available at ingestion time was partial (README + customization/installation/preview-env docs only; no top-level docs/overview page captured).
- Tightly coupled to the LangChain ecosystem (LangGraph + Deep Agents), which raises lock-in considerations for teams not already on that stack.
- Captured via a scouting note flagged for **evaluation of patterns, not direct adoption** — treat specifics as directional rather than a vetted recommendation.

## See Also
- [Agent Layer Architecture](../concepts/agent-layer-architecture.md)
- [Agent Loops](../concepts/agent-loops.md)
