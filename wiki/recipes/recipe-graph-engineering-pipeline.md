---
id: 01M0V37VNGEW1JJREX7FMGA8ED
title: "Recipe: Graph Engineering Pipeline (Docs → Knowledge Graph → Retrieval)"
type: recipe
tags: [knowledge-base, rag, retrieval, memory, architecture]
created: 2026-07-31
updated: 2026-07-31
visibility: public
confidence: medium
related: [agent-harness-model-context, agent-layer-architecture]
source: apple-notes (My Project - Agentic Software Factory business)
---

# Recipe: Graph Engineering Pipeline

A step-by-step pipeline for turning raw documents into a queryable knowledge graph that an LLM (e.g. Claude) can reason over via [MCP](../concepts/agent-harness-model-context.md) or direct API. Captured from notes referencing an external pipeline description (attributed source: X/Twitter post, @Sprytixl).

> "LLM knows words. Knowledge graph knows relationships. The most powerful AI systems appear when both work together."

## When to Use
Use this pipeline when an agent system needs durable, structured memory that survives beyond a single context window — e.g. tracking entities, relationships, and provenance across many ingested documents (papers, emails, reports, database exports).

## Structure

| Step | Action |
|---|---|
| 1 | **Collect raw documents** — PDFs, emails, reports, database exports |
| 2 | **Extract entities** — people, companies, products, events, concepts |
| 3 | **Extract relationships** — who did what to whom, when, why, how |
| 4 | **Build schema** — define entity types and relationship types |
| 5 | **Deduplicate and normalize** — e.g. "Microsoft Corp" and "MSFT" resolve to one entity |
| 6 | **Store in graph database** — Neo4j, Amazon Neptune, or PostgreSQL with a graph extension |
| 7 | **Build retrieval layer** — local search (specific entities) + global search (patterns across the whole graph) |
| 8 | **Connect model** — Claude (or other LLM) queries the graph via MCP or direct API |
| 9 | **Update continuously** — new documents expand the graph; contradictions get flagged for review |

### The Five Core Prompts
The pipeline is prompt-driven at each stage, not prompt-free. Two of the five prompts documented so far:

**Prompt 1 — Extraction**
```
Extract all organizations, people, products and events.

For each entity return:
- canonical_name
- type
- description
- source

For each relationship return:
- source_entity
- relation_type
- target_entity
- evidence
- confidence_score
```

**Prompt 2 — Normalization**
```
Compare the following entities.
Determine whether they refer to:
- the same entity
- related but different entities
- unrelated entities
```
(Remaining prompts — schema-building, retrieval routing, and continuous-update/contradiction-flagging — were referenced but not fully captured in the source note.)

## Example
A fleet of agents ingesting internal engineering docs could run this pipeline nightly: extract entities/relationships from new PRs and design docs, normalize against existing graph nodes, and flag any claims that contradict prior graph state — directly analogous to how this wiki's own compile process is expected to flag contradictions rather than overwrite silently.

## Trade-offs
- **Pro**: Externalizes memory outside the transcript/context window, enabling long-running and multi-agent systems to share state reliably.
- **Pro**: Supports both local (entity-specific) and global (pattern-across-graph) retrieval.
- **Con**: Requires ongoing maintenance — schema drift, deduplication errors, and stale entities accumulate without continuous updates.
- **Con**: Adds infrastructure complexity (graph DB, retrieval layer) compared to simple vector-store RAG.

## Related Patterns
- [Agent Harness & Model Context](../concepts/agent-harness-model-context.md)
- [Agent Layer Architecture](../concepts/agent-layer-architecture.md)
- [Jay's Agentic Software Factory project](../personal/jay-agentic-software-factory.md), which proposes this pipeline as the "Graph (Persistence)" primitive for scaling agent fleets

## See Also
- [Jay's Agentic Software Factory project](../personal/jay-agentic-software-factory.md)
- [Agent Harness & Model Context](../concepts/agent-harness-model-context.md)
