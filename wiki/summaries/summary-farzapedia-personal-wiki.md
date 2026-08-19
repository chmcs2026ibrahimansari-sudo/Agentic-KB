---
id: 01M06B44818YWN13KGVHYBXK5A
title: "Summary: Farzapedia Personal Wiki"
type: summary
tags: [personal, knowledge-base, obsidian, memory, retrieval]
created: 2026-04-07
updated: 2026-04-07
visibility: public
confidence: medium
source: transcript/farzapedia-personal-wiki.md
---

# Summary: Farzapedia Personal Wiki

Source: X post by [@farzaa](https://x.com/farzaa), ingested 2026-04-07.

## Key Ideas
- Farza built a **personal wiki** ('Farzapedia') compiled from raw personal data: iMessages, Apple Notes, and diary entries.
- The wiki follows the pattern popularized by [[andrej-karpathy]]'s `llm-wiki` approach — turning unstructured personal logs into structured, navigable articles.
- Retrieval is handled by a **WikiQuery agent** that reads an `index.md` entry point and then **navigates the wiki agentically**, following links between articles rather than performing vector search.
- This is explicitly framed as a **no-RAG** approach — dubbed the **Librarian pattern** — where an agent behaves like a librarian browsing a well-organized card catalog rather than a search engine ranking document chunks.

## Why It Matters
This is a small but concrete real-world data point supporting agentic-navigation-over-RAG as a viable retrieval strategy for personal knowledge management, and it directly parallels the design of this KB itself (compiling raw documents into linked wiki pages navigated by agents).

## See Also
- [Librarian Pattern](../patterns/pattern-librarian-agent.md)
- [concepts/agent-memory-runtime.md](../concepts/agent-memory-runtime.md)
