---
id: 01KX97ZK65R4HFVGQPBENJC22J
title: "Five-Agent Business Operations System"
type: recipe
tags: [agents, workflow, automation, orchestration, patterns]
created: 2026-07-11
updated: 2026-07-11
visibility: public
confidence: medium
related: [patterns/pattern-specialist-agent-team.md, concepts/agent-loops.md]
source: articles/cyrilxbt-5-employees-agent.md
---

# Five-Agent Business Operations System

A concrete implementation of the [Specialist Agent Team pattern](../patterns/pattern-specialist-agent-team.md) that covers five common business functions: research, content, customer communications, operations, and analytics.

> "Five specialized agents running in parallel produce better output in every category than one generalist agent doing everything."
> — @cyrilxbt

## Overview

| Agent | Replaces | Estimated Build Time |
|---|---|---|
| Research Agent | Junior researcher | 3 hours |
| Content Agent | Content writer | 3–4 hours |
| Comms Agent | Customer support rep | 4 hours |
| Operations Agent | Operations coordinator | 3 hours |
| Analytics Agent | Data analyst | 3–4 hours |

**Stack**: Claude (API or subscription), N8N for scheduling/orchestration, Obsidian as the shared knowledge base/vault.

---

## Agent 1: Research Agent

**Function**: Monitors topics, synthesises sources, surfaces the non-obvious insight.

**Trigger**: N8N cron at 6 AM daily, pulling topic list from Obsidian vault.

**System prompt skeleton**:
```
You are a specialist research agent. Your only job is to produce Research Briefs.

When you receive a research request:
1. Identify the core question
2. Search for the most relevant and recent sources
3. Cross-reference at least 3 independent sources for any factual claim
4. Identify the key insight most people miss on this topic
5. Identify the counterintuitive angle that creates genuine interest
6. Find 3 specific examples, statistics, or stories that support the insight

Output ONLY in this exact format:
CORE INSIGHT: [one sentence]
SUPPORTING EVIDENCE: [3 specific examples with sources]
COUNTERINTUITIVE ANGLE: [what most people get wrong]
KEY DATA: [2-3 specific numbers or quotes]
CONTENT ANGLES: [3 ranked angles for content creation]

Never editorialize. Never add commentary outside the format.
Produce the brief and stop.
```

**Output**: Structured brief deposited in `/research` folder of Obsidian vault.

---

## Key Implementation Principles

1. **Rigid output formats** — each agent writes to a fixed schema so downstream agents and humans can parse output reliably without additional cleaning
2. **One function per agent** — resist the temptation to give an agent a secondary task; quality degrades immediately with context-switching
3. **Shared knowledge base** — all agents read from and write to the same vault; this is the connective tissue of the system
4. **Scheduled triggers, not manual** — the value comes from agents running without human initiation; automate every trigger from day one
5. **Parallel execution** — agents should not block on each other unless there is an explicit dependency (e.g. content agent may optionally consume research briefs, but should not wait for them)

---

## Setup Steps

1. Create one Claude project (or API key) per agent, or use system prompt switching within a single API integration
2. Configure N8N with one workflow per agent, each with its own cron trigger
3. Set up Obsidian with a folder structure mirroring agent outputs: `/research`, `/content`, `/comms`, `/ops`, `/analytics`
4. Write and test each system prompt in isolation before connecting workflows
5. Run each agent manually for one week before enabling full automation — catch prompt failures early
6. Add a daily digest workflow that summarises all agent outputs into a single morning briefing

---

## Limitations

- Agents cannot replace human judgment on high-stakes decisions, relationships, or novel situations
- Quality depends entirely on prompt quality — invest time here before scaling
- N8N requires self-hosting or a paid plan for production reliability
- Claude tool use (web search) requires API access, not the base subscription

## See Also

- [Specialist Agent Team pattern](../patterns/pattern-specialist-agent-team.md) — the architectural pattern this recipe implements
- [Agent Loops](../concepts/agent-loops.md) — how each individual agent's execution loop works
- [Agent Failure Modes](../concepts/agent-failure-modes.md) — what goes wrong and how to catch it early
