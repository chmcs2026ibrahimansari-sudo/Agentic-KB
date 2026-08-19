---
id: 01M0D2B9BSPECDRWM7YBYF1CTR
title: "Summary: Scaling Managed Agents — Decoupling the Brain from the Hands (Anthropic)"
type: summary
tags: [claude, agents, architecture, orchestration]
created: 2026-08-19
updated: 2026-08-19
visibility: public
source: https://www.anthropic.com/engineering/managed-agents
---

# Summary: Scaling Managed Agents (Anthropic Engineering Blog)

Anthropic introduces **Managed Agents**, a hosted service on the Claude Platform for running long-horizon agents behind stable interfaces, designed to outlast any single implementation.

**Key ideas:**

- Agent harnesses encode assumptions about what Claude *can't* do — and those assumptions go stale as models improve. Example: Claude Sonnet 4.5 exhibited "context anxiety," prematurely wrapping up tasks as it sensed its context limit approaching; a harness fix (context resets) was added, but the same behavior vanished in Claude Opus 4.5, turning the fix into dead weight.
- Managed Agents virtualizes three agent components — **session** (append-only history log), **harness** (the Claude-calling loop that routes tool calls), and **sandbox** (code/file execution environment) — analogous to how operating systems virtualized hardware into durable `process`/`file` abstractions.
- Early architecture put all three components in one shared container. This was simple (direct syscalls, no service boundaries) but created a "pet" — a fragile, non-interchangeable resource where a single container failure destroyed the whole session, per the [pets vs. cattle](https://cloudscaling.com/blog/cloud-computing/the-history-of-pets-vs-cattle/) analogy.

> "We're opinionated about the shape of these interfaces, not about what runs behind them."

**Caveat**: This capture is a partial excerpt (source is ~2,280 words); the full article likely details the migration away from the single-container "pet" model and further failure-recovery mechanics not covered here.

## See Also
- [Claude Managed Agents](../frameworks/claude-managed-agents.md)
- [Decoupled Agent Architecture pattern](../patterns/pattern-decoupled-agent-architecture.md)
- [Agent failure modes](../concepts/agent-failure-modes.md)
