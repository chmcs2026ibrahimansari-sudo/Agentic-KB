---
id: 01M06A09PJMX37TJW62NR8RNC7
title: "CLAUDE.md Pattern"
type: concept
tags: [agents, context, prompting, claude, patterns]
created: 2026-05-23
updated: 2026-05-23
visibility: public
confidence: medium
related: [agent-memory-runtime, agent-loops]
source: x-twitter (karpathy-claude-md-hits-100k-stars-on-github-trending)
---

# CLAUDE.md Pattern

## Definition
CLAUDE.md is a lightweight, project-level markdown file used to encode an operator's or team's philosophy for working with AI coding agents — conventions, guardrails, and 'how to think about building software with AI' rather than executable code or a framework. Andrej Karpathy popularized a ~65-line version of this file that surged to 100K+ stars on GitHub Trending, outranking full-blown agent frameworks, purely on the strength of its distilled principles rather than any tooling.

## Why It Matters
The popularity of a plain-text philosophy file over packaged frameworks signals that **context-setting for agents** (clear rules, constraints, and mental models handed to the model at the start of a session) can be higher-leverage than adding more tooling or abstraction layers. This reinforces the broader pattern of maintaining a durable, human-readable instruction file that persists across agent sessions — conceptually adjacent to [agent memory & runtime](agent-memory-runtime.md) and the way instructions shape [agent loops](agent-loops.md). It's also a proof point that developers increasingly value curated judgment/heuristics over more code.

## Example
Karpathy's file reportedly distills coding-with-AI practice into a small number of "brutally simple rules" (exact rules not captured in this source) rather than any executable logic. Community reaction (e.g., builders using AI to watch/summarize related Karpathy talks and turn them into reusable 'skills') suggests this philosophy is being operationalized as a template other teams copy into their own repos as a global `CLAUDE.md`.

> ⚠️ Note: This source is a secondhand social-media summary (via @divyansht91162 on X) of Karpathy's file; the actual "4 rules" content was not included in the raw capture and should be verified against the primary source before being treated as canonical.

## See Also
- [agent-memory-runtime](agent-memory-runtime.md)
- [agent-loops](agent-loops.md)
- [andrej-karpathy](../entities/andrej-karpathy.md)
