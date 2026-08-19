---
id: 01M0BS2PRQKDNPHW50XM3F55G2
title: "Memory Lifecycle (Confidence, Supersession, Forgetting)"
type: concept
tags: [memory, agents, knowledge-base, architecture]
created: 2026-05-16
updated: 2026-05-16
visibility: public
source: https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
related: [agent-memory-architecture, summary-llm-wiki-v2-rohitg]
---

# Memory Lifecycle

## Definition

Memory lifecycle is the idea that facts in an agent's or wiki's knowledge store are not permanently and equally valid — they should carry a **confidence score**, be subject to **supersession** when contradicted or updated, and **decay** (be forgotten) if unused, similar to human memory consolidation. This treats knowledge as versioned and time-sensitive rather than a static accumulation.

Four components, as described in "LLM Wiki v2":

- **Confidence scoring** — each fact tracks how many sources support it, how recently it was confirmed, and whether anything contradicts it. Confidence decays with time and strengthens with reinforcement.
- **Supersession** — new information that contradicts or updates an existing claim explicitly supersedes it: linked, timestamped, with the old version preserved but marked stale (version control for knowledge).
- **Forgetting** — a retention curve modeled on Ebbinghaus's forgetting curve: retention decays exponentially with time, but each reinforcement (access or re-confirmation) resets the curve. Architecture decisions decay slowly; transient bugs decay fast.
- **Consolidation tiers** — working memory (recent observations) → episodic memory (session summaries) → semantic memory (cross-session facts) → procedural memory (workflows/patterns). Each tier is more compressed, more confident, and longer-lived than the last.

## Why It Matters

Without a lifecycle, a wiki-as-memory system accumulates stale, contradictory, or low-value facts indefinitely, and retrieval quality degrades. This directly extends the concept of [Agent Memory Architecture](agent-memory-architecture.md) by specifying *how* memory should age and update rather than just what tiers exist. It's also a natural evolution of this KB's own compile process — the schema's contradiction-flagging convention is a lightweight form of supersession, but doesn't yet implement decay or confidence scoring.

## Example

An agent notes "Project uses PostgreSQL" (confidence 0.9, 3 sources). A month later a new source says "Migrated to Supabase." Under this model, the new fact supersedes the old one — the Postgres fact is marked stale and linked to its replacement rather than deleted or silently overwritten. Meanwhile, an unused note like "debug flag X was flaky on Tuesday" decays out of active memory within weeks since it's never reinforced.

## See Also
- [Agent Memory Architecture](agent-memory-architecture.md)
- [Summary: LLM Wiki v2](../summaries/summary-llm-wiki-v2-rohitg.md)
- [Hybrid Search & Retrieval Pattern](../patterns/pattern-hybrid-search-retrieval.md)
