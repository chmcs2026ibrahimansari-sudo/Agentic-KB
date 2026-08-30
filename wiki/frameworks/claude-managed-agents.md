---
id: 01M0D2B9BMEXYNPMFR261S9N8Y
title: "Claude Managed Agents"
type: framework
tags: [agents, orchestration, architecture, claude, deployment]
created: 2026-08-19
updated: 2026-08-19
visibility: public
source: https://www.anthropic.com/engineering/managed-agents
---

# Claude Managed Agents

## What It Does
Managed Agents is a hosted service on the Claude Platform that runs long-horizon agents on a user's behalf. Rather than shipping a fixed harness implementation, Anthropic exposes a small set of stable interfaces — **session**, **harness**, and **sandbox** — designed to outlast any particular implementation underneath them, including the ones Anthropic runs today.

The motivating problem: harness code encodes assumptions about what Claude *can't* do on its own, and those assumptions go stale as models improve (a version of [the Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)). For example, Claude Sonnet 4.5 exhibited "context anxiety" — wrapping up tasks prematurely as it sensed its context limit approaching — which Anthropic patched with context resets in the harness. When the same harness ran Claude Opus 4.5, the behavior disappeared and the resets became dead weight. Managed Agents is built to absorb this kind of churn without breaking client integrations.

## Key Concepts
- **Session** — the append-only log of everything that happened in an agent's run (its durable record/history).
- **Harness** — the loop that calls Claude and routes Claude's tool calls to the relevant infrastructure. See [agent loops](../concepts/agent-loops.md).
- **Sandbox** — the execution environment where Claude runs code and edits files.

Anthropic explicitly virtualizes these three components the way operating systems virtualized hardware into *process* and *file* abstractions — general enough to support implementations "as yet unthought of." The interfaces are opinionated; what runs behind them is not.

An early design mistake, described as "adopting a pet" (per the [pets vs. cattle](https://cloudscaling.com/blog/cloud-computing/the-history-of-pets-vs-cattle/) analogy), was placing session, harness, and sandbox in a single shared container. This simplified file edits (direct syscalls, no service boundaries) but meant a single container failure destroyed the whole session — an unrecoverable, hand-tended "pet" rather than interchangeable, replaceable "cattle."

## When to Use It
Use Managed Agents when building long-running, tool-using Claude agents where you want infrastructure (compute, recovery, sandboxing) to be Anthropic-hosted and decoupled from your own application logic — and where you expect underlying model behavior/harness needs to shift over model versions without requiring you to rewrite your integration.

## Limitations
- The excerpted source cuts off mid-explanation of the container-coupling failure mode; full failure/recovery mechanics are not fully captured here.
- As a hosted, opinionated interface, it trades some flexibility (e.g., direct syscall file edits in a shared container) for resilience and decoupling.
- Confidence on some architectural details is based on a partial capture of the source article.

## See Also
- [Refinery summary: Anthropic — Scaling Managed Agents](../summaries/anthropic-com-engineering-managed-agents.md)
- [Decoupled Agent Architecture pattern](../patterns/pattern-decoupled-agent-architecture.md)
- [Agent loops](../concepts/agent-loops.md)
- [Agent layer architecture](../concepts/agent-layer-architecture.md)
- [Agent failure modes](../concepts/agent-failure-modes.md)
- [Summary: Anthropic Managed Agents](../summaries/summary-anthropic-managed-agents.md)
