---
title: "Blume Sidecar — Monitor and Improve Coding Agents"
type: summary
source_file: raw/framework-docs/blume-codes.md
source_url: "https://blume.codes/"
author: "Blume"
date_published: unknown
date_ingested: 2026-08-30
tags: [agentic, observability, context-management, tool-use, macos]
key_concepts: [meta-harness, self-improving-harness, agent-observability, context-management]
confidence: medium
---

# Blume Sidecar — Monitor and Improve Coding Agents

## Source
- Raw source: `raw/framework-docs/blume-codes.md`
- URL: https://blume.codes/
- Capture note: local agent control plane / auto-improvement monitor; compare with Hermes/MissionControl observability and improvement recommendation loops.

## TL;DR
Blume is a local macOS sidecar for coding agents that watches agent status, hidden rule/skill/config files, usage limits, and recurring correction signals, then proposes human-approved rule or skill changes instead of silently self-mutating the setup.

## Key Points
- Blume positions itself around agent visibility: seeing what each coding agent is doing, when it finishes, and when it needs approval.
- It tracks hidden setup surfaces across Claude Code, Cursor, Codex, and related harnesses: skills, rules, hooks, and agent files.
- The current improvement loop is evidence-backed and approval-gated: Blume detects recurring patterns in conversations, shows the number of conversations behind the suggestion, previews an exact diff, and asks the user to apply, dismiss, or save it.
- The examples are operationally concrete: one suggestion adds a verification section after repeated user corrections to run tests/typecheck; another converts a repeated desktop release checklist into a reusable skill.
- The source states local-first storage for conversation history on the user's device.
- Roadmap language separates current capabilities from future ones: auto-fixes, analytics, local domain model, central domain model, team conflict resolution, and auto-improve mode are marked "soon," "next," or "on the horizon." Do not treat those as shipped.

## KB Updates / Links
- Existing page: [[frameworks/blume-codes]].
- Related synthesis: [[syntheses/harness-vs-meta-harness-vs-self-improving-harness]] classifies Blume as a human-approved meta-harness / improvement queue, not proof of fully autonomous self-improvement.
- Related concepts: [[concepts/meta-harness]], [[concepts/self-improving-harness]], [[concepts/agent-observability]], [[concepts/context-management]].

## Conservative Notes
- Vendor/marketing source; no independent evidence in the capture that Blume's suggestions reduce future correction frequency.
- Strongest durable pattern: mine repeated corrections into proposed skill/rule edits, but require preview and approval before writeback.
