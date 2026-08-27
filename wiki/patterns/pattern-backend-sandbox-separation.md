---
id: 01M0D346CZ52TGKP93EW3Z1Q9P
title: "Backend/Sandbox Separation (Brains vs. Hands)"
type: pattern
tags: [agents, architecture, orchestration, deployment, mcp]
created: 2026-08-19
updated: 2026-08-27
visibility: public
confidence: medium
related: [framework-deepagents, agent-layer-architecture, agent-loops, agent-memory-architecture]
source: [[summaries/x-twitter-2089029054611837324]]
---

# Backend/Sandbox Separation (Brains vs. Hands)

## When to Use
Use this pattern when you want a single agent loop implementation to run across multiple deployment contexts — local dev tools, cloud production services, chat interfaces — without rewriting the agent's core reasoning logic for each environment. It's especially useful for coding agents and any agent that needs persistent, file-like state or code execution.

## Structure
The agent loop ("brains") is kept strictly separate from the execution environment ("hands"), which is called the **backend**:

- **Backend**: exposes filesystem-like operations (read/write/edit). Can be backed by a real filesystem, a database, or object storage.
- **Sandbox**: a backend variant that also exposes an `execute` command for running code.
- **Fake backend**: a lightweight backend that supports file-like state for context engineering without full sandboxed code execution — useful when an agent needs structured memory/context but not code execution.
- The agent loop communicates with whichever backend is configured, unaware of its underlying implementation, enabling swap-in/swap-out of environments.

This mirrors the architecture described in Anthropic's [managed agents](https://www.anthropic.com/engineering/managed-agents) writeup: separating planning/reasoning from action execution.

## Example
[DeepAgents](../frameworks/framework-deepagents.md) (built on LangGraph) implements this pattern in three deployment shapes:
1. **Local TUI coding agent**: local sandbox in the working directory + DeepAgents behind a lightweight local server + TUI frontend (e.g., dcode).
2. **Cloud coding agent**: DeepAgents deployed on LangSmith deployments, connected to a remote sandbox (Modal, Daytona, or E2B); both a web UI and Slack connect to the same backend, allowing users to switch surfaces seamlessly (e.g., open-swe).
3. **Non-coding agent**: swap in a "fake" backend for file-like context management without needing a full sandbox, when code execution is overkill.

Because DeepAgents is LangGraph-based, the backend/agent-loop split also enables standard deployment via MCP and A2A endpoints. The captured source is summarized at [[summaries/x-twitter-2089029054611837324]]; treat it as medium-confidence design intent and corroborate implementation details against official docs before depending on API behavior.

## Trade-offs
- **Pros**: portability across environments; a single agent implementation can serve local dev, cloud production, and chat surfaces; enables safer sandboxing since execution is isolated from reasoning; simplifies swapping infrastructure providers (e.g., different sandbox vendors) without touching agent logic.
- **Cons**: adds an abstraction layer and integration surface (backend must faithfully implement the expected filesystem-like API); state synchronization between agent loop and backend needs careful design; choosing a "fake" backend risks under-provisioning capabilities if the agent's needs grow to require real execution later.

## Related Patterns
- [[summaries/x-twitter-2089029054611837324]]
- [agent-layer-architecture](../concepts/agent-layer-architecture.md)
- [agent-loops](../concepts/agent-loops.md)
- [agent-memory-architecture](../concepts/agent-memory-architecture.md)
- [framework-deepagents](../frameworks/framework-deepagents.md)
