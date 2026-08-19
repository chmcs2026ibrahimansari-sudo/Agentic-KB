---
title: An Agent-Maintained Vault Compiled Through a Compression Layer Inherits Lossy Knowledge It Cannot Later Detect
type: synthesis
sources:
  - "[[frameworks/framework-headroom]]"
  - "[[frameworks/framework-obsidian-wiki]]"
  - "[[syntheses/synthesis-headroom-compression-skillopt-signal]]"
  - "[[syntheses/synthesis-headroom-compression-episodic-judgment-signal]]"
  - "[[syntheses/synthesis-headroom-compression-proof-of-work-receipts]]"
  - "[[syntheses/synthesis-skillopt-gate-obsidian-wiki-governance]]"
  - "[[syntheses/synthesis-proof-of-work-receipts-obsidian-wiki-audit-trail]]"
question: If Headroom compresses the source material an agent compiles into an Obsidian vault, does the resulting wiki page record knowledge or a lossy impression of it?
tags: [agentic, context-management, memory, knowledge-base, obsidian, compression, provenance]
created: 2026-08-18
updated: 2026-08-18
reviewed: false
reviewed_date: ""
---

# An Agent-Maintained Vault Compiled Through a Compression Layer Inherits Lossy Knowledge It Cannot Later Detect

## Question

If [[frameworks/framework-headroom]] compresses the papers, transcripts, tool outputs, and prior pages an agent reads before that agent writes or updates a vault page under [[frameworks/framework-obsidian-wiki]], does the resulting page record the source knowledge — or a compressed impression of it that no downstream reader can distinguish from the real thing?

## Argument

This is the tenth and last unwritten edge in the five-node governance cluster (Headroom, SkillOpt, obsidian-wiki, episodic-judgment-log, proof-of-work-receipts), and it is the one with the longest blast radius. The other nine edges concern signals that are consumed and then discarded — a training gradient, a freshness timestamp, a receipt. A vault page is different: `obsidian-wiki` is explicitly a *compile-once* architecture, positioned against repeated RAG lookups, so a page written today is read as settled fact for months. Compression damage to a transient signal decays; compression damage to a compiled page compounds, because every later page that cites it inherits the loss without inheriting the warning.

The two frameworks are structurally incompatible in exactly one place. Headroom's guarantee is **reversibility**: CCR caches originals locally and exposes retrieval when the compressed view proves insufficient. That guarantee holds only for an agent still inside the session that did the compressing. `obsidian-wiki`'s output outlives that session by design — the vault is read by different agents, in different tools (Claude Code, Cursor, Codex, Gemini CLI), weeks later, with no handle on the CCR cache and no field in the page recording that a compressed view was ever involved. Reversibility that expires at session boundary is not reversibility from the vault's point of view; it is one-way truncation on a delay.

The failure shape is the one this KB has now diagnosed four times: **compression is safe for consumption and unsafe for adjudication or durable record**. [[syntheses/synthesis-headroom-compression-skillopt-signal]] found it corrupting a training signal, [[syntheses/synthesis-headroom-compression-episodic-judgment-signal]] a freshness signal, and [[syntheses/synthesis-headroom-compression-proof-of-work-receipts]] a verification claim. Each concluded the same way — the lossy view produces output whose format has no channel for "I was working from a summary." A vault page is the most acute instance because `obsidian-wiki`'s own documented limitation is that it "relies on agents faithfully reading and writing markdown — no built-in validation or conflict resolution." There is no gate to catch it, and unlike a receipt, nobody is looking for one.

The mitigation follows the same shape as the receipt fix and costs about as little: a `context_fidelity` frontmatter field on any LLM-authored page, set to `compressed` when a compression layer sat upstream of the compile, plus a rule that page-writing reads from the CCR cache rather than the compressed view. This KB's own schema already has the hook — Rule 9 requires `[UNVERIFIED]` markers for unsourced claims and Rule 12 births every LLM-authored page `reviewed: false`. A compression flag is the same idea applied to a different failure mode: not "no source" but "degraded source."

## Evidence

- **Headroom compresses before the model sees anything.** Its architecture routes "prompts, tool outputs, logs, RAG chunks, files" through ContentRouter → SmartCrusher/CodeCompressor/Kompress-base before the provider call ([[frameworks/framework-headroom]]). The compile step of a wiki build is exactly this traffic.
- **Reversibility is session-scoped.** CCR "stores originals locally and exposes retrieval when compressed content is insufficient" ([[frameworks/framework-headroom]]) — a retrieval affordance for the running agent, not a provenance record attached to the artifact.
- **obsidian-wiki has no validation gate.** Its stated limitations include "no built-in validation or conflict resolution" and "no automated quality gate" ([[frameworks/framework-obsidian-wiki]]).
- **obsidian-wiki is compile-once by design.** It is "directly inspired by Andrej Karpathy's LLM Wiki gist: compile knowledge once into interconnected markdown files and keep them current, rather than repeatedly querying an LLM or running RAG on every question" ([[frameworks/framework-obsidian-wiki]]) — which is what makes the durability of the loss matter.
- **The KB already flags the eval-trace version of this risk.** `framework-headroom`'s Weaknesses section names "compression can remove evidence needed for trajectory-evaluation unless traces are preserved separately."
- **Three prior syntheses establish the pattern.** [[syntheses/synthesis-headroom-compression-skillopt-signal]], [[syntheses/synthesis-headroom-compression-episodic-judgment-signal]], and [[syntheses/synthesis-headroom-compression-proof-of-work-receipts]] each isolate the consumption-vs-adjudication split independently.

## Counter-arguments & Gaps

- **Nobody has actually run this configuration.** `[UNVERIFIED]` — no deployment in the KB puts Headroom upstream of an `obsidian-wiki` compile. Every claim here is architectural inference from two independently-read framework pages, not observation. `framework-headroom` records `jay_experience: none`.
- **Compression may be well-matched to wiki compilation specifically.** Wiki pages are themselves summaries. If a page is a 600-word distillation of a 40-page paper, a Kompress-base pass that drops boilerplate may remove nothing the page would have kept. The lossy step and the intended step could substantially overlap — in which case the flag is bookkeeping, not safety.
- **Content-aware routing may already protect the load-bearing cases.** Headroom's ContentRouter sends code through an AST-aware CodeCompressor and JSON through SmartCrusher. The material most likely to carry a decisive detail — a code example, a benchmark table — travels the structure-preserving paths, not the prose path.
- **The counter-argument to the mitigation is real.** A `context_fidelity: compressed` field that is almost always set to `compressed` conveys no information and becomes ignored ceremony — the same objection [[syntheses/synthesis-skillopt-gate-episodic-judgment-log]] raised against transplanting gates. A flag is only useful if it is sometimes absent.
- **Rule 11 check — what the evidence does not show.** It does not show that any wiki page anywhere has been degraded by compression; it does not quantify a loss rate; and it does not establish that the compile path reads compressed content at all rather than raw files off disk. If `obsidian-wiki` reads sources via direct filesystem access outside the proxied request path, Headroom never touches them and this entire synthesis is moot.
- **Resolving experiment.** Compile the same ten raw sources twice — once through a Headroom-wrapped agent, once unwrapped — and diff the resulting pages for dropped claims, dropped citations, and confidence drift. Fewer than roughly two material omissions across ten pages argues the flag is ceremony; more argues it is mandatory. This is cheap, and it is the same experiment the other three syntheses in this chain each deferred for want of a live deployment.

## Conclusion

Open question, leaning toward a mandatory provenance field. The argument that a compile-once vault is the worst place to accept silent lossiness is strong on structure and weak on evidence — it is inference from two framework pages, not from anything observed. The tenth edge closes the cluster, but it closes it on the same unresolved empirical core as the other nine: none of these tensions can be settled without one deployment where compression, compile, and gate all run over the same sources. That single experiment now resolves five syntheses at once, which is the strongest argument yet for running it.

## Sources

- [[frameworks/framework-headroom]]
- [[frameworks/framework-obsidian-wiki]]
- [[syntheses/synthesis-headroom-compression-skillopt-signal]]
- [[syntheses/synthesis-headroom-compression-episodic-judgment-signal]]
- [[syntheses/synthesis-headroom-compression-proof-of-work-receipts]]
- [[syntheses/synthesis-skillopt-gate-obsidian-wiki-governance]]
- [[syntheses/synthesis-proof-of-work-receipts-obsidian-wiki-audit-trail]]
- [[syntheses/synthesis-episodic-judgment-obsidian-wiki-gate]]
