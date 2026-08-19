---
id: 01M06B21YVN26DFRJRCR4ZR7TJ
title: "Summary: Andrej Karpathy's LLM Wiki"
type: summary
tags: [memory, knowledge-base, rag, retrieval, research]
created: 2026-04-07
updated: 2026-04-07
visibility: public
confidence: medium
source: note/andrej-karpathy-thinks-rag-is-broken.md
related: [pattern-llm-wiki, agent-memory-runtime]
---

# Summary: Andrej Karpathy's LLM Wiki

Andrej Karpathy released a project called **LLM Wiki**, gaining 5,000 GitHub stars in 48 hours, positioned as a replacement for traditional RAG (retrieval-augmented generation).

**Key ideas:**
- **RAG re-derives knowledge every query**: it searches documents, pieces fragments together, then forgets — starting from scratch on the next question.
- **LLM Wiki compiles knowledge once and maintains it**: when a new source is added, an LLM reads it, extracts information, updates entity and topic pages, revises summaries, flags contradictions, and strengthens the overall synthesis. A single source can update 10–15 pages at once.
- **Compounding, not re-fetching**: knowledge accumulates permanently across sources rather than being reconstructed transiently per query — described as the core structural difference from RAG, NotebookLM, and ChatGPT file uploads.
- **Framing**: "Obsidian is the IDE. The LLM is the programmer. The wiki is the codebase." Humans source material and ask questions; the AI performs all wiki maintenance.
- **Use cases** highlighted: personal tracking (goals/health/psychology), long-term research synthesis, book/fan wikis built while reading, and business knowledge bases fed by Slack/meetings/calls.

This pattern is formalized in the wiki as the [LLM Wiki pattern](../patterns/pattern-llm-wiki.md) and relates closely to existing thinking on [agent memory and runtime](../concepts/agent-memory-runtime.md).

> "RAG re-discovers knowledge on every question. LLM Wiki compiles it once and keeps it current."

## See Also
- [LLM Wiki Pattern](../patterns/pattern-llm-wiki.md)
