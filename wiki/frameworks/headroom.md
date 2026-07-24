---
id: 01KX98V9PBA2AD0PVF0F16TZCP
title: "Headroom"
type: framework
tags: [context, agents, llm, mcp, memory, retrieval]
created: 2026-06-18
updated: 2026-06-18
visibility: public
confidence: medium
source: https://github.com/chopratejas/headroom
related: [concepts/agent-memory-runtime, concepts/agent-resources-platform]
---

# Headroom

Headroom is a context compression layer for AI agents. It intercepts everything an agent reads — tool outputs, logs, RAG chunks, files, and conversation history — and compresses it before it reaches the LLM, claiming 60–95% token reduction with semantically equivalent results.

> ⚠️ **Personal note (Jay):** Tagged in Apple Notes for evaluation as a token-compression proxy for Hermes/local-agent cost reduction. Not yet enabled.

## What It Does

Headroom offers four integration modes:

- **Library** — `compress(messages)` inline, available in Python (`headroom-ai`) and TypeScript (`headroom-ai` npm)
- **Proxy** — `headroom proxy --port 8787` intercepts OpenAI-compatible API calls with zero code changes
- **Agent wrap** — `headroom wrap claude|codex|cursor|aider|copilot` wraps popular agent CLIs in one command
- **MCP server** — exposes `headroom_compress`, `headroom_retrieve`, and `headroom_stats` tools to any MCP client

Additional capabilities:
- **Cross-agent memory** — shared compressed store across Claude, Codex, Gemini with automatic deduplication
- **`headroom learn`** — mines failed sessions and writes corrections to `CLAUDE.md` / `AGENTS.md`
- **Output token reduction** — trims what the model writes back, not just what is sent in

## Key Concepts

| Feature | Detail |
|---|---|
| Algorithms | 6 compression algorithms (lossless to lossy) |
| Reversibility | Compression is reversible |
| Local-first | Runs entirely on-device; no data leaves the machine by default |
| Model | Uses `chopratejas/kompress-v2-base` (HuggingFace) |
| License | Apache 2.0 |

**Demonstrated performance:** 10,144 → 1,260 tokens on a log analysis task (same FATAL error found).

## When to Use It

- Agents that consume large tool outputs, long log files, or many RAG chunks per turn
- High-volume agentic pipelines where LLM API cost is a primary constraint
- Situations where context window pressure causes truncation or degraded reasoning
- Multi-agent setups (Claude + Codex + Gemini) that need a shared, deduplicated memory store

## Limitations

- Lossy compression modes may silently drop information; careful benchmarking required before production use
- Adds latency and an extra processing step to every LLM call
- `kompress-v2-base` model quality/behavior is not independently verified here
- Enterprise features and pricing are documented separately in `ENTERPRISE.md`
- Still early-stage; CI badges suggest active but not yet stable development

## See Also

- [Agent Memory at Runtime](../concepts/agent-memory-runtime.md) — how agents manage in-context vs. external memory
- [Agent Resources & Platform](../concepts/agent-resources-platform.md) — broader infrastructure considerations for agent deployments
