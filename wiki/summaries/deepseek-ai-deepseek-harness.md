---
title: "DeepSeek Harness — Everything Is a Plugin"
type: summary
source_file: raw/framework-docs/deepseek-ai-deepseek-harness.md
source_url: https://github.com/deepseek-ai/deepseek-harness
author: DeepSeek AI
date_published: ""
date_ingested: 2026-08-27
tags: [agentic, harness, plugins, architecture, typescript]
key_concepts: [plugin-composability, cordis, agent-loop, session-log, api-gateway]
confidence: medium
---

# DeepSeek Harness — Everything Is a Plugin

## Source

- Raw source: `raw/framework-docs/deepseek-ai-deepseek-harness.md`
- URL: https://github.com/deepseek-ai/deepseek-harness
- Captured context: Jay flagged this as a plugin-based open coding-agent harness with swappable model/tool/session/agent-loop architecture.

## TL;DR

DeepSeek Harness (`dsh`) is an open-source developer-preview agent harness built around the principle “everything is a plugin,” using Cordis to compose model adapters, tools, sessions, filesystems, sandboxing, permissions, UI, and the agent loop through extension points rather than a fixed privileged core.

## Key Points

- **Developer preview:** The README warns that compatibility-breaking changes are expected.
- **Plugin architecture:** Cordis underpins a plugin tree where profiles, bundles, and patches compose model adapters, tools, persistence, sandboxing, approval policy, settings, credentials, telemetry, web UI, and headless modes.
- **Workspace-scoped UI:** `npx @deepseek-ai/dsh web` launches a local web UI; users configure model providers and choose a workspace before sessions can run.
- **Agent lifecycle:** The docs model durable `session/event` records and live `agent/*` events. The session log is the source for model-visible context, replay, fork/resume, transcripts, telemetry, and persistence.
- **Tool execution pipeline:** Tool calls pass through pre-execute, execute, and post-execute stages, creating clear interception points for policy, telemetry, and auditing.
- **Capability seams:** Filesystem, subprocess, sandbox, terminal, jobs, commands, settings, and remote API calls are modeled as swappable services rather than baked-in globals.
- **API gateway/remote contract:** The docs describe generated Host/Client remote method contracts, strict validation, lookup/context resolution, and a typed API Gateway over the client connection.
- **Doc discipline:** The captured docs include strict documentation tiers, generated references, type-equivalence checks, and budget rules — a sign that the harness treats docs as part of the product contract.

## Extracted KB Updates

- Supports [[frameworks/deepseek-harness]] as an agent-harness architecture snapshot.
- Related to [[concepts/agent-layer-architecture]] because DSH decomposes runtime concerns into composable services and event domains.
- Related to [[concepts/agent-observability]] because durable session events and replayable transcript data are first-class design elements.

## Jay-Relevant Takeaway

DeepSeek Harness is worth watching for MissionControl because it pushes the harness boundary down into plugin composition and event contracts. The strategic question is whether MissionControl should adopt similar seams for tools/filesystems/sandboxes/remotes, not whether to copy DSH wholesale.

## Caveats

- No local run or benchmark was performed. The captured repo/docs are authoritative for stated architecture but not for stability, ecosystem maturity, or operational reliability.
- The repository is explicitly pre-stable; avoid building hard dependencies on API details without version pinning.

## Sources

- `raw/framework-docs/deepseek-ai-deepseek-harness.md`
