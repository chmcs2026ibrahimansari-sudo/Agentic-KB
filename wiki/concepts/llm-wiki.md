---
id: 01M0BS7JQNDJJHNY7S493G38MT
title: "LLM Wiki (Markdown Knowledge Base)"
type: concept
tags: [llm-wiki, knowledge-base, rag, obsidian, context, token-efficiency]
created: 2026-04-25
updated: 2026-04-25
visibility: public
confidence: medium
related: [pattern-hot-cache, agent-memory-architecture]
source: transcripts/nate-herk-llm-wiki.md
---

# LLM Wiki

## Definition
An LLM wiki is a lightweight knowledge base built entirely from markdown files organized into folders (typically `raw/`, `wiki/`, plus `CLAUDE.md`, `index.md`, and `log.md`), designed to be read directly by an LLM agent instead of retrieved via embeddings. Instead of similarity search over vector embeddings, an LLM wiki relies on explicit links between pages, index files, and a graph-like structure that an agent can traverse — reading indexes, following links, and searching only when necessary.

## Why It Matters
The core pitch, per Nate Herk's walkthrough (building on [[andrej-karpathy]]'s viral post), is radical simplicity and cost efficiency:

> "You don't need a fancy vector database, embeddings, or complex infrastructure. It's literally just a folder with markdown files."

One cited case turned 383 scattered files and 100+ meeting transcripts into a compact wiki and dropped token usage by **95%** compared to querying with traditional RAG. The comparison breaks down as:

| Dimension | LLM Wiki | Traditional RAG |
|---|---|---|
| Retrieval | Reads indexes, follows links | Similarity search |
| Relationships | Explicit links | Implicit proximity |
| Infrastructure | Markdown files | Vector DB + embeddings |
| Cost | Tokens only | Compute + storage |
| Maintenance | Run lint | Re-embed on change |
| Scale | Hundreds of pages (fine) | Millions of docs |

A key caveat: this approach scales to "hundreds of pages with good indexes" but traditional RAG is still preferred once a corpus reaches millions of documents.

Maintenance happens via **linting** — running LLM-based health checks (weekly or on demand) to find inconsistent data, impute missing data via web search, and surface new article candidates from interesting connections.

## Example
A practical setup: an Obsidian vault split into a `raw/` folder (source transcripts/articles) and a `wiki/` folder (compiled pages), with a `CLAUDE.md` file pointing an agent at the vault path. The agent is instructed to read a [[pattern-hot-cache]] file first, then the top-level index, then a domain subindex, then search only if needed — with the explicit rule: "Don't read from the wiki unless you actually need it." One reported ingest: a single AI2027 article was compiled into 23 wiki pages (6 people, 5 orgs, 1 AI system profile, plus concepts and analysis) in about 10 minutes; 36 YouTube video transcripts were batch-ingested in 14 minutes.

## See Also
- [[pattern-hot-cache]]
- [Agent memory architecture](agent-memory-architecture.md)
