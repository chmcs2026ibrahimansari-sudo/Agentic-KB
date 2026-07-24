---
id: 01KX98HN3BDSMXK7F50EQJNB8W
title: "GBrain"
type: framework
tags: [agents, frameworks, personal-ai, open-source, voice-ai]
created: 2026-05-23
updated: 2026-05-23
visibility: public
confidence: medium
source: https://x.com/garrytan/status/2058053659527913566
related: [concepts/agent-loops.md, concepts/agent-memory-runtime.md]
---

# GBrain

GBrain is an open-source personal AI agent framework created by **Garry Tan** (YC president) and released under the MIT License. Tan describes it as "my gift to you so you can have the same personal AI that I do" — positioning it as a democratised version of his own personal AI stack.

## What It Does

GBrain provides a personal AI brain layer that integrates with agent frameworks (primarily **OpenClaw** and **Hermes**) to give them persistent memory, tool access, and — as of v0.40.0 — a voice interface. It is designed to function as a continuously improving personal AI companion and executive assistant.

Key capabilities:
- **Full brain access**: persistent context and memory across interactions
- **Tool use**: integrates with agent frameworks for extended task execution
- **Voice agent** (v0.40.0+): real-time voice interaction powered by Gemini Live
- **Persona system**: ships with named agent personas (see below)

## Key Concepts

### Agent Personas
GBrain includes two built-in named personas:
- **Mars** — positioned as "a friend"; conversational and relational in tone
- **Venus** — positioned as "your EA" (executive assistant); task-oriented and professional

### Voice Agent (v0.40.0)
Shipped in v0.40.0, the voice capability is built on top of **Google's Gemini Live** technology. Gemini Live was chosen for its large context window and strong tool-use capabilities, enabling the voice agent to retain full brain access during spoken interactions.

> "GBrain just shipped v0.40.0 gives your OpenClaw/Hermes Agent + GBrain a voice agent. It's based on Gemini Live. Large context, great tool use, full brain access."
> — Garry Tan, X/Twitter announcement

### Integrations
- **OpenClaw**: agent framework that GBrain extends with memory and voice
- **Hermes**: agent framework paired with OpenClaw in the GBrain ecosystem

## When to Use It

- You want a self-hostable, open-source personal AI stack you fully control
- You need persistent memory and context across agent interactions
- You want to add voice interaction to an existing OpenClaw or Hermes agent setup
- You prefer MIT-licensed software with no vendor lock-in

## Limitations

- Described as "experimental" by its creator — not production-hardened
- Voice capability depends on Google's Gemini Live (external dependency, potential API costs/availability)
- Documentation and ecosystem are early-stage; community is small relative to larger frameworks
- Tightly coupled to OpenClaw/Hermes — portability to other agent frameworks is unclear

## See Also

- [Agent Loops](../concepts/agent-loops.md)
- [Agent Memory & Runtime](../concepts/agent-memory-runtime.md)
- [Agent Resources & Platform](../concepts/agent-resources-platform.md)
