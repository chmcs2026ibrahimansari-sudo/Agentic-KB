---
id: 01M0D2B9BRAJRKNMFPQH6TW71W
title: "Decoupled Agent Architecture (Session / Harness / Sandbox)"
type: pattern
tags: [patterns, architecture, agents, orchestration]
created: 2026-08-19
updated: 2026-08-19
visibility: public
confidence: medium
source: https://www.anthropic.com/engineering/managed-agents
---

# Decoupled Agent Architecture (Session / Harness / Sandbox)

## When to Use
Use this pattern when building long-running agent infrastructure that must survive frequent changes to model behavior, harness logic, or execution environments — without breaking the contract with calling applications. It's especially relevant when a single harness implementation is expected to become obsolete as models improve (e.g., workarounds for model limitations that disappear in later model versions).

## Structure
Decompose an agent system into three independently swappable components, each behind a stable interface:

1. **Session** — an append-only log of everything that happened during the agent's run. Acts as the durable source of truth, independent of any single running process.
2. **Harness** — the control loop that calls the model and routes its tool calls to backing infrastructure. See [agent loops](../concepts/agent-loops.md).
3. **Sandbox** — an isolated execution environment where the model can run code and edit files.

Each component can be reimplemented or swapped without disturbing the others, similar to how operating systems virtualized hardware into `process` and `file` abstractions that outlasted specific hardware generations.

## Example
Anthropic's Claude Managed Agents service implements this pattern: it initially ran all three components in a single shared container (simpler, but fragile — a container crash destroyed the entire session, an anti-pattern the team calls "adopting a pet" per the [pets vs. cattle](https://cloudscaling.com/blog/cloud-computing/the-history-of-pets-vs-cattle/) analogy). They moved toward separating session, harness, and sandbox behind stable interfaces so failures in one component (e.g., an unresponsive sandbox) don't destroy the whole run. See [Claude Managed Agents](../frameworks/claude-managed-agents.md) for the full case study.

A related real failure mode this pattern helps address: "context anxiety," where a model (Claude Sonnet 4.5) prematurely wraps up tasks as it senses its context window filling. A harness-level patch (context resets) fixed this for one model version but became unnecessary — and potentially harmful — dead weight once Claude Opus 4.5 no longer exhibited the behavior. Decoupling the harness from session/sandbox makes it easier to retire such patches without a full system rewrite.

## Trade-offs
- **Pro**: Resilience — component failure (e.g., sandbox crash) doesn't necessarily destroy the session or require restarting the whole agent.
- **Pro**: Future-proofing — harness logic encoding today's model limitations can be swapped out as models improve, without breaking the session/sandbox contract.
- **Con**: Added complexity — service boundaries between session, harness, and sandbox must be explicitly designed (vs. direct syscalls when everything shares one container).
- **Con**: Requires committing to stable interface contracts early, which is a genuinely hard design problem ("programs as yet unthought of").

## Related Patterns
- [Agent loops](../concepts/agent-loops.md)
- [Agent layer architecture](../concepts/agent-layer-architecture.md)
- [Agent memory architecture](../concepts/agent-memory-architecture.md)
- [Agent failure modes](../concepts/agent-failure-modes.md)
