---
id: 01M0BS7JQTN7ZSM9WRPRM9CNDN
title: "Summary: Set Up Your LLM Knowledge Base in 5 Minutes (Nate Herk)"
type: summary
tags: [llm-wiki, knowledge-base, obsidian, claude-code, second-brain]
created: 2026-04-25
updated: 2026-04-25
visibility: public
confidence: medium
related: [llm-wiki, pattern-hot-cache]
source: transcripts/nate-herk-llm-wiki.md
---

# Summary: Set Up Your LLM Knowledge Base in 5 Minutes

Nate Herk's walkthrough responds to [[andrej-karpathy]]'s viral post on X about LLM-readable wikis, showing a 5-minute setup for turning raw notes into an agent-navigable [[llm-wiki]].

## Key Ideas
- **Simplicity over infrastructure**: No vector DB, no embeddings — just a folder of markdown files (`raw/`, `wiki/`, `CLAUDE.md`, `index.md`, `log.md`).
- **Ingestion tooling**: Obsidian Web Clipper pulls articles in directly; Obsidian's graph view visualizes page relationships.
- **Token efficiency**: One reported case cut token usage by 95% after converting 383 files and 100+ meeting transcripts from RAG-style retrieval into a wiki.
- **[[pattern-hot-cache]]**: A ~500-character cache of recent/high-use context, reducing full wiki crawls — especially useful for executive assistant agents.
- **Linting**: Scheduled or on-demand LLM health checks catch inconsistencies, fill gaps via web search, and surface candidate new pages.
- **Two vault types**: a topic-specific KB (36 YouTube video transcripts) versus a personal second brain ("Herk Brain").
- **Scale guidance**: wiki-graph approach is fine for hundreds of well-indexed pages; traditional RAG still wins at millions-of-documents scale.

## Notable Quote
> "You don't need a fancy vector database, embeddings, or complex infrastructure. It's literally just a folder with markdown files."

## Reported Ingestion Benchmarks
- One AI2027 article → 23 wiki pages (6 people, 5 orgs, 1 AI system, plus concepts/analysis) in ~10 minutes.
- 36 YouTube video transcripts batch-ingested in ~14 minutes.

## See Also
- [[llm-wiki]]
- [[pattern-hot-cache]]
