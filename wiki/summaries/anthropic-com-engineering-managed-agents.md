---
title: "Anthropic — Scaling Managed Agents"
type: summary
source_file: raw/framework-docs/anthropic-com-engineering-managed-agents.md
source_url: "https://www.anthropic.com/engineering/managed-agents"
author: "Lance Martin, Gabe Cemaj, Michael Cohen"
date_published: unknown
date_ingested: 2026-08-30
tags: [agentic, orchestration, deployment, sandboxed-execution, context-management, anthropic]
key_concepts: [managed-agents, decoupled-agent-architecture, sandboxed-execution, credential-gateway, context-management]
confidence: high
---

# Anthropic — Scaling Managed Agents

## Source
- Raw source: `raw/framework-docs/anthropic-com-engineering-managed-agents.md`
- URL: https://www.anthropic.com/engineering/managed-agents
- Capture note: compare Managed Agents against MissionControl worker lease, sandbox, and context-package models.

## TL;DR
Anthropic frames Managed Agents as a hosted meta-harness built around stable interfaces for **session**, **harness**, and **sandbox**, so long-running agents can survive model changes, harness failures, sandbox failures, and context-window limits without coupling all state to one container.

## Key Points
- Harnesses encode assumptions about model limitations, but those assumptions can go stale as models improve. Anthropic cites a "context anxiety" workaround for Claude Sonnet 4.5 that became dead weight with Claude Opus 4.5.
- Managed Agents virtualizes three agent components: the **session** as append-only durable event log, the **harness** as the Claude-calling tool-routing loop, and the **sandbox** as the execution environment for code and file edits.
- Anthropic's early single-container design coupled session, harness, and sandbox into a fragile "pet": if the container failed, the session could be lost; if it was unresponsive, debugging required shell access into an environment that could hold user data.
- The decoupled design moves the harness outside the container. Sandboxes become replaceable tools behind `execute(name, input) -> string` and can be reprovisioned with `provision({resources})` when they die.
- The session log sits outside the harness, letting a replacement harness reboot with `wake(sessionId)`, fetch the event log with `getSession(id)`, and continue emitting events with `emitEvent(id, event)`.
- Security improves when credentials never become reachable from generated code. Anthropic describes repo access tokens wired into git remotes during sandbox initialization and custom-tool OAuth tokens held in a secure vault behind an MCP proxy, with the harness never seeing the credentials.
- The session is explicitly **not** the model context window. `getEvents()` lets the harness fetch positional slices, rewind around specific events, or reread context before an action; prompt compaction/organization remains a harness concern layered over durable source events.
- Decoupling "many brains" from "many hands" lets inference start before a sandbox is needed. Anthropic reports p50 TTFT dropped roughly 60% and p95 dropped over 90%; treat these as source-reported numbers, not independently verified benchmark results.

## KB Updates / Links
- Existing related pages: [[frameworks/claude-managed-agents]], [[patterns/pattern-decoupled-agent-architecture]], [[patterns/pattern-backend-sandbox-separation]], [[patterns/pattern-credential-gateway]], [[concepts/managed-agents]], [[concepts/sandboxed-execution]], [[concepts/context-management]].
- MissionControl implication: the durable-session / stateless-harness split is the architecture to compare against worker leases and context packages; context should be queryable from the session log, not only compressed into the prompt.

## Conservative Notes
- The TTFT improvement is source-reported by Anthropic and should not be treated as reproduced.
- This is an official vendor engineering blog; architectural claims are high-confidence for Anthropic's stated design intent, but product behavior still needs hands-on validation before adoption.
