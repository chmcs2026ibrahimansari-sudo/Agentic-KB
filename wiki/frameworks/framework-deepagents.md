---
id: 01M0D346CWMDEA7JTWEMEB3SF2
title: "DeepAgents"
type: framework
tags: [agents, architecture, deployment, mcp, frameworks]
created: 2026-08-19
updated: 2026-08-19
visibility: public
confidence: medium
related: [pattern-backend-sandbox-separation, agent-layer-architecture, agent-loops]
source: x-twitter-2089029054611837324.md
---

# DeepAgents

## What It Does
DeepAgents is a framework, built on top of LangGraph, for running agent loops that are architecturally decoupled from the environment they act on. The agent loop ("brains") connects to a separate "backend" ("hands") that exposes filesystem-like operations — read, write, edit — regardless of whether that backend is an actual filesystem, a database, or object storage. This decoupling lets the same agent loop be deployed across very different runtime environments (local TUI, cloud sandbox, Slack, web UI) without changing the agent's core logic.

## Key Concepts
- **Backend**: any system exposing filesystem-like read/write/edit operations. Not required to be a real filesystem.
- **Sandbox**: a specialized backend that additionally exposes an `execute` command for running code.
- **Brains vs. hands separation**: the agent loop (reasoning/planning) runs separately from the backend (action execution), referencing [Anthropic's managed agents architecture](https://www.anthropic.com/engineering/managed-agents). See [pattern-backend-sandbox-separation](../patterns/pattern-backend-sandbox-separation.md).
- **Standard deployment surfaces**: because it's built on LangGraph, DeepAgents can be exposed via MCP, A2A, and other standard agent protocol endpoints.
- **Fake backend**: for non-coding agents that don't need real code execution, a lightweight "fake" backend can still provide file-like context/state management without spinning up a full sandbox — useful for context engineering.

## When to Use It
- Building coding agents that need a TUI-like local experience (sandbox running locally, DeepAgents deployed behind a lightweight server, TUI as frontend) — e.g., dcode.
- Building cloud-scale coding agents: DeepAgents deployed on LangSmith deployments, connected to remote sandboxes (Modal, Daytona, E2B), with a shared backend accessible from both a web UI and Slack — e.g., [open-swe](https://github.com/langchain-ai/open-swe).
- Building non-coding agents that still benefit from structured, filesystem-like state/context without needing full code execution (via a fake backend). See "managed deepagents" for a simplified setup path.

## Limitations
- Source material is a single tweet thread (informal, not full documentation); some architectural details (e.g., how state syncs between backend and agent loop) are asserted but not deeply specified.
- No benchmark or performance data provided — this is an architectural description, not an evaluation.

> "this backend is SEPARATE from where the agent loop runs. this allows us to 'separate the brains from the hands'" — hwchase17 on X

## See Also
- [pattern-backend-sandbox-separation](../patterns/pattern-backend-sandbox-separation.md)
- [agent-layer-architecture](../concepts/agent-layer-architecture.md)
- [agent-loops](../concepts/agent-loops.md)
