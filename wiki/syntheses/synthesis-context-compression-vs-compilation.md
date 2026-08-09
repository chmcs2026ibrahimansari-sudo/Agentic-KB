---
title: Context Compression vs. Context Compilation
type: synthesis
sources: [wiki/frameworks/framework-headroom, wiki/frameworks/framework-obsidian-wiki, wiki/syntheses/synthesis-agentic-engineering-operating-model]
question: Are Headroom-style runtime compression and obsidian-wiki-style knowledge compilation substitutes or complements for managing context cost?
tags: [agentic, context-management, memory, cost-optimization]
created: 2026-08-08
updated: 2026-08-08
reviewed: false
reviewed_date: ""
---

# Context Compression vs. Context Compilation

## Question

Are [[frameworks/framework-headroom|Headroom]]-style runtime compression and [[frameworks/framework-obsidian-wiki|obsidian-wiki]]-style knowledge compilation substitutes or complements for managing context cost — and which class of content belongs to each?

## Argument

They are complements attacking the same bottleneck from opposite ends of the pipeline. Headroom treats context as a cost to be compressed at the moment of use — tool outputs, logs, RAG chunks, and conversation history are shrunk per-turn, with reversible CCR caching preserving fidelity. Obsidian-wiki treats context as a cost to be eliminated in advance: stable knowledge is compiled once into a durable vault so agents never re-retrieve or re-summarize it. Both target the "context is the bottleneck" pressure named as Principle 4 in [[syntheses/synthesis-agentic-engineering-operating-model]]. The routing rule that falls out: stable, compile-once facts (preferences, architecture decisions, prior findings) belong in a compiled vault; genuinely ephemeral, high-volume artifacts (tool call outputs, long transcripts, logs) belong to runtime compression.

Treating them as substitutes fails in a predictable direction each way. Routing durable knowledge through lossy runtime compression degrades exactly the fidelity Headroom's own docs warn about; routing ephemeral artifacts through the compile pipeline bloats the vault with content that will never be re-read, defeating the compile-once economics obsidian-wiki exists to provide.

## Evidence

- [[frameworks/framework-headroom]]: compresses tool outputs, logs, RAG chunks, and conversation history at use time; reversible CCR caching is the fidelity guarantee. Its benchmark claims carry a "requires reproduction" caveat.
- [[frameworks/framework-obsidian-wiki]]: compiles stable knowledge into a durable vault up front, eliminating repeat retrieval/summarization entirely.
- [[syntheses/synthesis-agentic-engineering-operating-model]] Principle 4: context economics is the binding constraint both frameworks independently answer.

## Counter-arguments & Gaps

- Both framework pages carry unverified, source-reported performance claims ([UNVERIFIED] pending the corroboration playbook validated on [[concepts/reciprocal-rank-fusion]]); the cost model behind "complements" is therefore directional, not measured.
- The boundary between "stable" and "ephemeral" content is asserted, not operationalized — no test exists yet for which bucket a given artifact belongs to (e.g., a recurring tool output that stabilizes over time).
- A third option is unaddressed: aggressive prompt-cache reuse at the API layer may capture much of Headroom's win for conversation history without a new dependency.
- Neither framework has been piloted in Jay's stack; this synthesis reasons from docs, not operation. What would change the verdict: a measured pilot showing compression fidelity loss on compiled-vault content is negligible, which would collapse the routing rule.

## Conclusion

Adopt the routing rule as the working position: compiled vault for stable knowledge, runtime compression for ephemeral high-volume artifacts, and never one as a substitute for the other. Before piloting either framework, run both through the provenance-corroboration playbook from [[patterns/pattern-per-claim-confidence]] to firm up their performance claims.

## Sources

- [[frameworks/framework-headroom]]
- [[frameworks/framework-obsidian-wiki]]
- [[syntheses/synthesis-agentic-engineering-operating-model]]
