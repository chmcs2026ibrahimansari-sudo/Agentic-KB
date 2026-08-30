---
id: 01M0JH0TBQAW3TRYJF14XWMMXS
title: "Blume — Coding Agent Sidecar"
type: framework
tags: [agents, tools, deployment, automation, frameworks]
created: 2026-08-21
updated: 2026-08-21
visibility: public
confidence: medium
source: framework-docs/blume-codes.md
related: [agent-harness-model-context, agent-loops, agent-evaluation]
---

# Blume — Coding Agent Sidecar

Blume is a local desktop "sidecar" app for macOS (Apple Silicon) that sits alongside coding agent harnesses — Claude Code, Cursor, Codex — to give a unified view of what each agent is doing, track hidden config files that shape agent behavior, and propose improvements to an agent's rules/skills/hooks based on observed friction.

## What It Does

- **Agent overview**: Shows real-time status of running agents (running, needs approval, finished) across multiple harnesses (Cursor, Claude Code, Codex).
- **Setup tracking**: Aggregates every skill, rule, and agent config file scattered across different harnesses into one place.
- **Usage tracking**: Monitors provider usage/token burn against plan limits (Claude, Codex) before hitting a wall.
- **Improve loop**: Reviews rules/skills/hooks on-device, detects recurring corrective patterns in conversations (e.g. users repeatedly asking agents to run tests before declaring done), and proposes concrete fixes — new rules, new skills, or edits — that the user previews and approves/dismisses before they land.
- Runs entirely local-first: conversation history stored on-device.

## Key Concepts

- **Signals / Clusters**: Blume mines agent conversation history for recurring correction patterns ("signals"), groups them into "clusters," and surfaces them as suggested rule/skill improvements.
- **Suggestions with evidence**: Each proposed fix cites the number of conversations that exhibited the pattern (e.g. "in 4 conversations you asked agents to run tests") and shows an exact diff before applying.
- **Roadmap tiers**: Current features (agent overview, hidden files/rules, usage tracking) vs. "soon" (auto-fixes, analytics on setup drift) vs. "next" (local/central domain model as a team-wide source of truth for intent, team conflict resolution).

## When to Use It

Useful for teams or individuals running multiple coding-agent harnesses simultaneously who want a single control plane to catch instruction drift, avoid re-explaining the same corrections repeatedly, and keep agent "rulebooks" (system prompts, skills, hooks) consistent and up to date — conceptually similar to an observability + auto-improvement loop layered on top of [agent harness context](../concepts/agent-harness-model-context.md).

## Limitations

- Several flagship features (auto-fixes, analytics on setup improvement/degradation, domain model) are marked "soon"/"next" and not yet shipped as of capture.
- macOS/Apple Silicon only; no stated support for other OSes.
- Improvement suggestions rely on conversation volume — sparse usage yields fewer/no signals ("0 found" clusters until enough data accumulates).
- No public detail yet on how corrections are diffed against team-shared config in multi-user setups (positioned as future "central domain model").

## See Also
- [Refinery summary: Blume Sidecar](../summaries/blume-codes.md)
- [agent-harness-model-context](../concepts/agent-harness-model-context.md)
- [agent-loops](../concepts/agent-loops.md)
- [agent-evaluation](../concepts/agent-evaluation.md)
