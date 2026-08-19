---
id: 01M0BS2PRR9N49Y0FY99WJMH86
title: "Hybrid Search & Retrieval (BM25 + Vector + Graph)"
type: pattern
tags: [retrieval, rag, knowledge-base, memory, architecture]
created: 2026-05-16
updated: 2026-05-16
visibility: public
source: https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
related: [memory-lifecycle, agent-memory-architecture, summary-llm-wiki-v2-rohitg]
---

# Hybrid Search & Retrieval

## When to Use
Use this pattern once a wiki, memory store, or document collection grows past the point where a flat index (e.g. a single `index.md` or naive keyword search) can reliably surface the right content — roughly 100–500 documents, per production experience reported in "LLM Wiki v2." Also use it when queries need both exact-term precision (proper nouns, code identifiers) and semantic/conceptual matching, plus awareness of entity relationships.

## Structure
Three retrieval mechanisms run in parallel and are fused into a single ranked result set:

1. **BM25 (keyword matching)** — precise term/phrase matches, good for names, IDs, exact phrases.
2. **Vector search (semantic similarity)** — embedding-based nearest neighbor search, good for conceptual/paraphrased queries.
3. **Graph traversal (entity-aware)** — walks typed relationship edges ("depends on," "uses," "caused," "supersedes") outward from matched entities to catch connections keyword or vector search miss.

Results from all three are combined using **reciprocal rank fusion (RRF)** to produce a single ranked list.

## Example
In `agentmemory` (the reference implementation behind this pattern), all three retrieval mechanisms run together and reportedly achieve 95.2% on the LongMemEval-S benchmark. A query like "what broke after the auth refactor" benefits from: BM25 matching "auth refactor" literally, vector search surfacing semantically related incident notes that don't use the same words, and graph traversal following "caused" edges from the refactor entity to downstream bug reports.

## Trade-offs
- **Pros**: covers precision (BM25), recall/paraphrase (vector), and relational/multi-hop queries (graph) that any single method misses alone.
- **Cons**: three subsystems to build, maintain, and keep in sync (index updates, embedding refresh, graph updates on ingest); fusion tuning (RRF weighting) adds another parameter surface; graph extraction requires reliable entity/relationship extraction on ingest, which is itself failure-prone.
- Best paired with automated event-driven hooks (on-ingest entity extraction, on-schedule reindexing) rather than manual maintenance, per the source document.

## Related Patterns
- [Memory Lifecycle](../concepts/memory-lifecycle.md) — governs which facts are worth indexing/graphing versus decaying out
- [Agent Memory Architecture](../concepts/agent-memory-architecture.md) — the broader tiered-memory context this retrieval layer serves

## See Also
- [Summary: LLM Wiki v2](../summaries/summary-llm-wiki-v2-rohitg.md)
