---
id: 01M06B21YTX39J394NNVXXAAHX
title: "LLM Wiki Pattern"
type: pattern
tags: [memory, knowledge-base, rag, retrieval, agents]
created: 2026-04-07
updated: 2026-04-07
visibility: public
confidence: medium
source: note/andrej-karpathy-thinks-rag-is-broken.md
related: [agent-memory-runtime, agent-observability, agent-loops]
---

# LLM Wiki Pattern

## When to Use
Use this pattern when an agent needs to accumulate and refine knowledge over time from a stream of incoming sources (papers, transcripts, notes, Slack threads, meeting recordings) rather than answering one-off queries against a static document store. It's suited to long-running personal knowledge management, ongoing research tracking, fan/reference wikis built while reading, and business contexts where source material (calls, meetings, docs) arrives continuously and must stay current.

## Structure
The pattern, popularized by Andrej Karpathy's "LLM Wiki" project (5,000 GitHub stars in 48 hours per the source note), inverts the standard retrieval flow:

1. **Ingest**: A source (article, paper, transcript, notes) is dropped into a raw collection.
2. **Compile**: An LLM reads the source, writes a summary, and updates a master index.
3. **Propagate**: The LLM updates every relevant entity and topic page across the wiki — a single source can touch 10–15 pages simultaneously.
4. **Cross-reference**: Links between pages are built automatically.
5. **Flag**: Contradictions between sources are surfaced rather than silently overwritten.
6. **Query & file-back**: Questions asked against the wiki that produce good answers get filed back in as new pages, so exploration itself compounds the knowledge base.

Karpathy's framing: *"Obsidian is the IDE. The LLM is the programmer. The wiki is the codebase."* The human sources material and asks questions; the LLM does all the writing and maintenance.

## Example
Cited use cases from the source note:
- **Personal**: File journal entries and articles to build a structured picture of yourself (goals, health, psychology) over time.
- **Research**: Read papers for months, building a wiki with an evolving thesis.
- **Reading a book**: Build a fan wiki as you go — characters, themes, plot threads, all cross-referenced.
- **Business**: Feed it Slack threads, meeting transcripts, and customer calls so the wiki stays current without manual upkeep.

This KB itself (Agentic KB) is effectively an implementation of this pattern — raw docs are compiled into structured pages with cross-references and contradiction flags, following the same compile → propagate → flag workflow.

## Trade-offs
- **Pro**: Knowledge compounds permanently instead of being re-derived (and forgotten) on every query — a key weakness of standard RAG.
- **Pro**: Automatic cross-referencing and contradiction detection reduce manual curation burden.
- **Con**: Requires an LLM compile step per source, which is more expensive and slower than simple vector-search retrieval.
- **Con**: Quality depends heavily on the compiler's judgment (what counts as "relevant" pages to update); errors or hallucinated updates can silently corrupt the wiki over time if not reviewed.
- **Con**: Touching 10–15 pages per source raises consistency and merge-conflict risks at scale.

## Related Patterns
- [Agent Memory & Runtime](../concepts/agent-memory-runtime.md) — the underlying persistent-state problem this pattern addresses.
- [Agent Observability](../concepts/agent-observability.md) — relevant for tracking how/why wiki pages get updated.
- [Agent Loops](../concepts/agent-loops.md) — the compile/query/file-back cycle is itself a loop.

## See Also
- [Summary: Karpathy's LLM Wiki](../summaries/summary-karpathy-llm-wiki.md)
