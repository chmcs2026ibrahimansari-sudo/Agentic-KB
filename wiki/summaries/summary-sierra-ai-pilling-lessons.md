---
id: 01M0BQRGA058RPTDZ7WTTBM8KR
title: "Summary: AI-Pilling Our Company — Lessons Learned (Sierra)"
type: summary
tags: [agents, orchestration, enterprise, mcp, architecture]
created: 2026-07-10
updated: 2026-07-10
visibility: public
confidence: medium
source: "https://sierra.ai/blog/ai-pilling-our-company-lessons-learned"
---

# Summary: AI-Pilling Our Company — Lessons Learned (Sierra)

A July 2026 blog post from Sierra (by Neil Rahilly) describing what a six-person internal "AI acceleration team" learned trying to bring agentic productivity gains (engineers were seeing ~5X output using parallel agents with git worktrees, Claude Code, and Codex) to the whole company via an internal agent called Pinecone.

## Key Ideas

1. **Agent, singular** — Sierra initially built role-specific agents (a support agent, data analyst, engineer, sales agent) but this failed: employees couldn't remember which agent did what, and more importantly the highest-value work cuts across departments, not within them. They collapsed everything into one agent (Pinecone) with a single Slack handle, single URL, and one continuous thread per task. See [pattern-single-agent-front-door](../patterns/pattern-single-agent-front-door.md) for the full pattern write-up.

2. **Proactive, not reactive** — Most real work unfolds over days or weeks, not a single session. An agent that only responds when prompted and forgets everything at session end has limited value. Pinecone is designed to persist across an entire process, carrying context forward rather than restarting each time. (Document excerpt cuts off mid-explanation of this section.)

3. **MCP gateway / context layer, systems-of-record-as-backend, outcome metrics** — Per source annotations, the fuller post also covers using an MCP (Model Context Protocol) gateway as a context layer, treating existing systems of record as the backend the agent operates against, and measuring success via outcome metrics rather than usage metrics. These points were referenced in source notes but not captured in the extracted excerpt — flagged here for follow-up if the full article is re-ingested.

> "Technology absorbs the complexity, not the employee." — Sierra

## Confidence Note
Items 1–2 are well-supported by the extracted text. Item 3 is based on a source annotation ("Apple Notes" capture note) rather than the extracted article body, so it is marked lower confidence pending a full re-capture of the document.

## See Also
- [pattern-single-agent-front-door](../patterns/pattern-single-agent-front-door.md)
- [sierra-ai](../entities/sierra-ai.md)
