---
id: 01M06B447ZFBX5V4BTP35MYC5P
title: "Librarian Pattern (Agentic Wiki Navigation, No RAG)"
type: pattern
tags: [agents, knowledge-base, memory, retrieval, orchestration, obsidian]
created: 2026-04-07
updated: 2026-04-07
visibility: public
confidence: medium
source: transcript/farzapedia-personal-wiki.md
---

# Librarian Pattern (Agentic Wiki Navigation, No RAG)

## When to Use
Use this pattern when you have a personal or team knowledge base composed of many small, interlinked markdown files (a wiki) and you want an agent to answer questions or retrieve context *without* standing up a vector database or embedding pipeline. It's well suited to personal knowledge management use cases — e.g. compiling a wiki from iMessages, Apple Notes, and diary entries — where the corpus is small-to-medium, highly interlinked, and updated incrementally.

## Structure
The core idea, drawn from the Farzapedia personal wiki (built on the [[andrej-karpathy]] `llm-wiki` pattern), is:

1. Maintain a single **`index.md`** that acts as a table of contents / entry point into the wiki.
2. A **WikiQuery agent** ('the librarian') reads `index.md` first, then **navigates** the wiki agentically — following wikilinks (`[[page-name]]`) from article to article — the same way a human researcher would browse a card catalog and pull related volumes off the shelf.
3. No embeddings, no similarity search, no RAG pipeline. Retrieval is replaced by **agentic traversal** of an explicit link graph.
4. Articles are compiled incrementally from raw personal data sources (messages, notes, diary entries) into structured wiki pages, mirroring how this KB itself compiles raw documents into `wiki/` pages.

## Example
> "Personal wiki from iMessages, Apple Notes, diary entries using [[andrej-karpathy]] [[llm-wiki]] pattern. WikiQuery agent reads index.md, navigates articles agentically - no RAG. Librarian pattern."

In practice: a user asks the WikiQuery agent a question about a past decision. Instead of embedding the query and running similarity search over chunks, the agent opens `index.md`, identifies likely-relevant pages by title/tags, opens those pages, follows any `[[wikilinks]]` to related pages as needed, and synthesizes an answer from the pages it actually read.

## Trade-offs
- **Pros**: No embedding/indexing infrastructure; retrieval is transparent and inspectable (you can see exactly which pages the agent visited); works well when the corpus is well-linked and human-curated; avoids RAG failure modes like chunk fragmentation losing context.
- **Cons**: Doesn't scale gracefully to very large or poorly-linked corpora — navigation cost grows with hops needed to find relevant info; depends heavily on `index.md` and cross-links being kept up to date and accurate; slower per-query than a vector lookup for large KBs; relies on the compiling process (see this KB's own compile behavior) to keep the graph well-formed.

## Related Patterns
- [[agent-memory-runtime]] — long-term memory storage that a librarian-style agent could read from.
- [[agent-loops]] — the navigation described here is itself a form of agent loop (read → decide next page → read → synthesize).
- Compare to standard RAG-based retrieval patterns (not yet documented in this KB) — the librarian pattern is explicitly an alternative to RAG for structured, link-rich corpora.

## See Also
- [Farzapedia Personal Wiki summary](../summaries/summary-farzapedia-personal-wiki.md)
- [concepts/agent-memory-runtime.md](../concepts/agent-memory-runtime.md)
