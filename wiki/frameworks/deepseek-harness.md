---
id: 01M0D2CFK4346TGGRWS0ECHEKD
title: "DeepSeek Harness (dsh)"
type: framework
tags: [agents, frameworks, orchestration, tools, deployment]
created: 2026-08-19
updated: 2026-08-19
visibility: public
confidence: medium
source: https://github.com/deepseek-ai/deepseek-harness
---

# DeepSeek Harness (dsh)

DeepSeek Harness (`dsh`) is an open-source agent harness developed by DeepSeek AI, currently in **developer preview** with breaking changes expected. Its defining architectural principle is stated directly in the repo description:

> "DeepSeek Harness: Everything is a Plugin."

The harness is powered by [Cordis](https://github.com/cordiverse/cordis), a framework whose design comes from the paper *A Programming Paradigm for Spatiotemporal Composability*. This plugin-first design means models, tools, sessions, and the agent loop itself are all swappable components rather than hardcoded parts of the system — an architectural stance relevant to [agent-layer-architecture](../concepts/agent-layer-architecture.md) and [agent-loops](../concepts/agent-loops.md).

## What It Does

- Provides a runnable agent harness accessible via `npx @deepseek-ai/dsh web`, which launches a local Web UI (default `http://127.0.0.1:3080`).
- Lets a user configure a model provider (DeepSeek API key, or other OpenAI-compatible endpoints) through **Settings → Models** without restarting the server.
- Requires selecting a **workspace** (a filesystem directory) before a session can be started; the session composer is disabled until a workspace is chosen.
- Once running, the agent can read/edit workspace files, run shell commands, delegate work (suggesting some form of sub-agent or task delegation capability), and maintain a plan.
- Enforces a permission policy — the Web UI prompts for approval before operations that require it, similar in spirit to human-in-the-loop patterns used elsewhere in agent design.

## Key Concepts

- **Plugin-based composability**: every capability (model backend, tool, session handling, agent loop) is a plugin, discoverable via the `dsh-plugin` GitHub topic — this enables a marketplace-like ecosystem rather than a monolithic framework.
- **Cordis runtime**: the underlying composability engine that manages plugin lifecycle and "spatiotemporal" composition (plugins can be added/removed dynamically).
- **Workspace-scoped sessions**: the harness binds a session to a specific directory, scoping file operations and agent context to that workspace.
- **Permission policy**: a built-in gate for approval-required operations, i.e. a safety/control layer between agent intent and execution.

## When to Use It

- Teams wanting an open-source, self-hostable coding-agent harness with a Web UI, rather than a closed IDE-integrated assistant.
- Developers who want to swap in custom models (via OpenAI-compatible endpoints) or write custom plugins for tools/session behavior.
- Early adopters comfortable with a fast-moving developer preview and compatibility-breaking changes.

## Limitations

- Explicitly a **developer preview** — no stability guarantees; breaking changes are expected.
- Requires Node.js and a local run (via `npx` or building from source with `pnpm`); no hosted/managed offering described in the source.
- Documentation captured is partial (README, contributing guide, dev/architecture docs, AGENTS.md, agent-lifecycle docs, API gateway docs were found, but deeper architecture and plugin API details were not included in this excerpt).
- No benchmark or evaluation data available yet to compare it against other agent harnesses.

## See Also

- [agent-loops](../concepts/agent-loops.md)
- [agent-layer-architecture](../concepts/agent-layer-architecture.md)
- [agent-memory-architecture](../concepts/agent-memory-architecture.md)
