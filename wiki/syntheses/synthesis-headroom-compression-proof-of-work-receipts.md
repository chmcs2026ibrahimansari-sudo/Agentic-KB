---
title: Context Compression Upstream of a Proof-of-Work Receipt Can Certify a Check That Never Really Happened
type: synthesis
sources:
  - "[[frameworks/framework-headroom]]"
  - "[[patterns/pattern-agent-proof-of-work-loop]]"
  - "[[syntheses/synthesis-headroom-compression-skillopt-signal]]"
  - "[[syntheses/synthesis-headroom-compression-episodic-judgment-signal]]"
  - "[[syntheses/synthesis-proof-of-work-receipts-obsidian-wiki-audit-trail]]"
question: If Headroom compresses the tool outputs and transcripts an agent verifies against, is the resulting proof-of-work receipt still evidence of verification?
tags: [agentic, context-management, evaluation, observability, receipts, human-in-the-loop]
created: 2026-08-16
updated: 2026-08-16
reviewed: false
reviewed_date: ""
---

# Context Compression Upstream of a Proof-of-Work Receipt Can Certify a Check That Never Really Happened

## Question

If [[frameworks/framework-headroom]] compresses the tool outputs, logs, and file contents an agent reads before that agent fills in the `verified_by` and `output` fields of a [[patterns/pattern-agent-proof-of-work-loop]] review packet, is the resulting receipt still evidence that verification occurred — or only evidence that the agent believed it occurred?

## Argument

A proof-of-work receipt is a claim about evidence, not the evidence itself, so its trustworthiness is bounded by the fidelity of the view the agent held when it wrote the claim. Headroom sits precisely there: it compresses tool outputs, RAG chunks, files, and conversation history *before they reach the model*, caching originals for later retrieval. An agent running the closed loop — execute, verify, write review packet — therefore verifies against the compressed view and signs the receipt against the compressed view, while the receipt itself carries no record that compression intervened. The failure is silent by construction: a `verified_by` field reading "re-ran the failing test, output clean" is indistinguishable on the page whether the agent read the full log or a SmartCrusher summary of it that dropped the one stack frame that mattered.

This is not a novel risk; it is the same risk the KB has already diagnosed twice in adjacent contexts. [[syntheses/synthesis-headroom-compression-skillopt-signal]] found compression corrupting SkillOpt's training signal, and [[syntheses/synthesis-headroom-compression-episodic-judgment-signal]] found it corrupting the episodic log's freshness authority. Both share a shape: compression is safe for *consumption* and unsafe for *adjudication*. Anything that reads compressed context to form an impression degrades gracefully; anything that reads compressed context to render a verdict degrades silently, because the verdict's output format has no channel for "I was working from a lossy view."

The stakes rose on 2026-08-15, when [[syntheses/synthesis-proof-of-work-receipts-obsidian-wiki-audit-trail]] made the receipt the audit trail for the entire gate → write → log pipeline. That synthesis argues the gate's accept decision is itself an agent completion claim deserving a receipt — but it does not ask whether the receipt's own contents are trustworthy if compression sat upstream. The audit trail the cluster just finished designing inherits an unexamined single point of failure identical to the one already found in the two signals it depends on. An audit trail whose entries can be confidently wrong is worse than no audit trail, because it converts an unknown into a false known.

The mitigation is cheap and follows from Headroom's own design. Headroom caches originals; the receipt schema is extensible. Adding a `context_fidelity` field to the review packet — recording whether compression was active, which compressor path ran, and the cache handle for the original — costs one line per receipt and makes the failure loud instead of silent. The stronger rule: **verification steps read from the cache, not the compressed view.** Compression is a budget optimization for the execute phase; the verify phase should pay full price, because that is the phase whose output other systems will trust without re-deriving.

## Evidence

| Source | Key claim | Bearing on the question |
|---|---|---|
| [[frameworks/framework-headroom]] | Compresses "tool outputs, logs, RAG chunks, files, and conversation history before they reach the model, while caching originals for retrieval when detail is needed" | Establishes that compression is upstream of everything the agent reasons over — including verification — and that originals remain retrievable, which is what makes the mitigation cheap |
| [[patterns/pattern-agent-proof-of-work-loop]] | Review packet requires `changed`, `output`, `verified_by`, `exceptions`, `next_action`, `learning_update`; human "reviews exceptions only, not every artifact" | Exception-only review is the amplifier: if compression suppresses the signal that would have populated `exceptions`, no human ever looks |
| [[patterns/pattern-agent-proof-of-work-loop]] | `confidence: medium`; When-To-Use includes "long-running work needs auditability" and "work has external side effects" | The pattern's own trigger conditions are exactly the cases where a silently-degraded receipt does the most damage |
| [[syntheses/synthesis-headroom-compression-skillopt-signal]] | Compression can silently corrupt SkillOpt's eval scores | First instance of the generalization: compression + adjudication = silent corruption |
| [[syntheses/synthesis-headroom-compression-episodic-judgment-signal]] | Compression can silently corrupt the episodic log's freshness signal | Second instance — two independent confirmations make the third a prediction, not a guess |
| [[syntheses/synthesis-proof-of-work-receipts-obsidian-wiki-audit-trail]] | Receipts are the audit trail for the gate → write → log pipeline; calls the untested version "theater" | Raises the cost of the gap: the receipt is now load-bearing for the whole cluster |

## Counter-arguments & Gaps

**The risk may be theoretical.** [UNVERIFIED] No source in the KB documents a proof-of-work receipt that was actually falsified by compression. Both prior compression syntheses are themselves reasoned arguments, not measured results, so this page is a third-order inference from two unmeasured claims. It could be that Headroom's ContentRouter reliably preserves exactly the error strings, diffs, and assertion output that verification depends on — its CodeCompressor is AST-aware, which is evidence of type-sensitivity — and that the lossy paths only ever touch prose an agent would not verify against anyway.

**Compression may improve verification rather than degrade it.** A 200k-token log that overflows the context window and gets truncated at an arbitrary boundary is strictly worse evidence than a 20k-token structured compression of the same log. If the realistic alternative to compression is truncation or omission, Headroom raises receipt quality. This page assumes the counterfactual is "full fidelity," which may not be available at the context budgets these agents actually run at.

**`jay_experience: none`.** [[frameworks/framework-headroom]] is `last_checked: 2026-06-25` with no hands-on validation, and [[patterns/pattern-agent-proof-of-work-loop]] is `confidence: medium` sourced from two tweets and one Obsidian review note. Neither leg of this bridge is strongly grounded. The argument is coherent but the evidence base is thin and single-lineage.

**The proposed fix has an unpriced cost.** "Verify against the cache, not the compressed view" reintroduces the exact context pressure Headroom exists to relieve, and does so at the phase where transcripts are longest. If verification is the token-expensive phase, the mitigation may make the loop unaffordable — in which case the honest answer is a narrower one: compress during verify, but record `context_fidelity` so the degradation is at least legible.

**What would resolve it.** Run one workflow twice — once with Headroom in the path, once without — over a fixture set containing known defects, and compare the resulting receipts. If the compressed run's `exceptions` field misses defects the uncompressed run catches, the risk is real and measurable. This is the same shape of pilot the leverage question for this cluster already proposes, so it can ride along with it rather than needing its own budget.

## Conclusion

Treat compression as unsafe upstream of any verification step whose output another system will trust. The narrow, defensible position today is not "Headroom breaks receipts" — the evidence does not support that — but "a receipt that does not record its own context fidelity cannot be audited," which is true regardless of whether Headroom is in the path. Add `context_fidelity` to the review packet schema now, because it is nearly free and makes the open question answerable; defer the stronger "verify against the cache" rule until the two-run comparison above shows the degradation is real and the token cost is worth paying.

## Sources

- [[frameworks/framework-headroom]]
- [[patterns/pattern-agent-proof-of-work-loop]]
- [[syntheses/synthesis-headroom-compression-skillopt-signal]]
- [[syntheses/synthesis-headroom-compression-episodic-judgment-signal]]
- [[syntheses/synthesis-proof-of-work-receipts-obsidian-wiki-audit-trail]]
- [[syntheses/synthesis-proof-of-work-receipts-episodic-judgment-ingestion]]
