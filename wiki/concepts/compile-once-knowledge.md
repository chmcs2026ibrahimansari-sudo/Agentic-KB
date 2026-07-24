---
id: 01KX98SS7AW2TQ2EPM06V0GDWN
title: "Compile-Once Knowledge (LLM Wiki Pattern)"
type: concept
tags: [memory, knowledge-base, agents, prompting, obsidian]
created: 2026-06-18
updated: 2026-06-18
visibility: public
confidence: high
source: "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f"
related: [frameworks/framework-obsidian-wiki, concepts/agent-memory-runtime]
---

# Compile-Once Knowledge (LLM Wiki Pattern)

## Definition

The **compile-once knowledge** pattern (popularised by Andrej Karpathy's LLM Wiki gist) proposes that stable, hard-won knowledge should be distilled into persistent, interconnected markdown files **once** — and then kept current — rather than being re-derived by an LLM on every query or retrieved via RAG each time.

The result is a human-readable, version-controlled "wiki" that the agent (and the human) can read, edit, and trust.

## Why It Matters

- **Reduces redundant computation**: Asking an LLM the same question repeatedly wastes tokens and risks inconsistent answers. A compiled wiki page is deterministic.
- **Accumulates insight over time**: Each agent run can add to or refine the wiki, creating compounding value.
- **Human-in-the-loop friendly**: Markdown files are readable and editable by the human owner, unlike vector embeddings.
- **Complements RAG, doesn't replace it**: RAG is still better for large, dynamic corpora. Compile-once is best for stable, curated knowledge (your own decisions, conventions, mental models).

## Example

A developer discovers the optimal chunking strategy for their pipeline. Instead of re-experimenting next session, they ask their agent to write a wiki page: `chunking-strategy.md`. Future sessions load that page directly — no re-derivation needed.

The [obsidian-wiki framework](../frameworks/framework-obsidian-wiki.md) operationalises this pattern using Obsidian as the vault and AI coding agents as the writers.

## Common Pitfalls

- **Staleness**: Compiled knowledge can drift from ground truth if the domain changes and the wiki isn't updated.
- **Over-compilation**: Trying to compile everything produces a bloated, unmaintainable wiki. Best reserved for stable, reusable knowledge.
- **No conflict resolution**: Multiple agents writing to the same vault can produce contradictions unless a curation step is enforced.

## See Also

- [obsidian-wiki Framework](../frameworks/framework-obsidian-wiki.md) — a concrete implementation of this pattern
- [Agent Memory at Runtime](../concepts/agent-memory-runtime.md) — broader taxonomy of agent memory strategies
