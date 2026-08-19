---
id: 01M0BS2PRNJVEYDH5T9B7TKGY6
title: "Summary: LLM Wiki v2 (Rohit Ghumare)"
type: summary
tags: [knowledge-base, memory, agents, retrieval]
created: 2026-05-16
updated: 2026-05-16
visibility: public
source: https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
related: [memory-lifecycle, pattern-hybrid-search-retrieval, agent-memory-architecture]
---

# Summary: LLM Wiki v2

A fork/extension of Andrej Karpathy's original LLM Wiki idea, written by Rohit Ghumare after building [agentmemory](https://github.com/rohitg00/agentmemory), a persistent memory engine for AI coding agents. It keeps the original's core thesis intact — "stop re-deriving, start compiling" — but adds what breaks when the pattern is run in production at scale.

## Key Ideas

- **Memory needs a lifecycle, not just accumulation.** Facts should carry confidence scores that decay over time and strengthen with reinforcement (Ebbinghaus-style forgetting curve). See [Memory Lifecycle](../concepts/memory-lifecycle.md).
- **Supersession over silent overwrite.** Contradicting or updated claims should explicitly supersede prior ones — linked, timestamped, old version preserved but marked stale.
- **Consolidation tiers**: working memory → episodic memory → semantic memory → procedural memory, with increasing compression and durability at each tier.
- **Flat wiki pages don't scale past ~100–500 docs.** A knowledge graph (entities + typed relationships like "depends on," "contradicts," "supersedes") should augment pages for navigation, while hybrid search (BM25 + vector + graph traversal, fused via reciprocal rank fusion) handles retrieval. See [Hybrid Search & Retrieval](../patterns/pattern-hybrid-search-retrieval.md).
- **Automation via event-driven hooks**: auto-ingest on new source, context-load on session start, compression on session end, contradiction checks on memory write, and periodic lint/consolidation/decay on schedule — with a human kept in the loop for curation decisions.

> "RAG retrieves and forgets. A wiki accumulates and compounds."

## Why It Matters

This is a direct production-lessons addendum to the wiki-as-agent-memory pattern this KB itself follows — it's essentially describing failure modes and fixes for the exact system this document is being compiled into.

## See Also
- [Memory Lifecycle](../concepts/memory-lifecycle.md)
- [Hybrid Search & Retrieval Pattern](../patterns/pattern-hybrid-search-retrieval.md)
- [Agent Memory Architecture](../concepts/agent-memory-architecture.md)
