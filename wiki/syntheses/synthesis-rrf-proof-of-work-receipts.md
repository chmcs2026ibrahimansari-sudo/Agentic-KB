---
title: A Proof-of-Work Receipt Cannot Certify a Fused Ranking, Because RRF Discards the Only Channel a Receipt Could Read
type: synthesis
sources:
  - "[[concepts/reciprocal-rank-fusion]]"
  - "[[patterns/pattern-agent-proof-of-work-loop]]"
  - "[[syntheses/synthesis-headroom-compression-reciprocal-rank-fusion]]"
  - "[[syntheses/synthesis-headroom-compression-proof-of-work-receipts]]"
  - "[[syntheses/synthesis-rrf-as-rlm-fusion-stage]]"
  - "[[concepts/rlm-pipeline]]"
question: If an agent emits a proof-of-work receipt for a retrieval step whose results were merged by Reciprocal Rank Fusion, does that receipt constitute evidence that the ranking was sound?
tags: [agentic, evaluation, retrieval, rag-systems, observability, receipts, memory]
created: 2026-08-20
updated: 2026-08-20
reviewed: false
reviewed_date: ""
---

# A Proof-of-Work Receipt Cannot Certify a Fused Ranking, Because RRF Discards the Only Channel a Receipt Could Read

## Question

[[patterns/pattern-agent-proof-of-work-loop]] requires an agent to record `output` and `verified_by` before claiming a step is complete. [[concepts/reciprocal-rank-fusion]] merges retriever outputs using rank position alone, discarding raw scores. If a retrieval step ends in an RRF fusion and the agent signs a receipt for it, is that receipt evidence the ranking was sound — or only evidence that a list was produced?

## Argument

The receipt is evidence that a list was produced, and nothing more. A proof-of-work receipt is a claim about evidence rather than the evidence itself; its informational content is bounded by what the certified step actually exposes. RRF exposes almost nothing. It reads only each document's position in each retriever's list, computes `1 / (k + rank_i)` with `k = 60`, and emits an ordered list of document IDs. Confidence, margin, score dispersion, retriever disagreement — all of it is discarded by design, because discarding magnitude is precisely how RRF merges BM25's 0–20 with cosine's 0.0–1.0 without normalization. A `verified_by` field attached to that stage can honestly say "fusion executed, 40 candidates in, 10 out" and can say nothing about whether those 10 were the right 10. The receipt's output format is byte-identical for a healthy fusion and a degenerate one.

This is the fifth appearance of a rule the KB has now derived four times independently: compression is safe for consumption and unsafe for adjudication, because adjudication outputs have no channel for "I was working from a degraded view" ([[syntheses/synthesis-headroom-compression-proof-of-work-receipts]]). The RRF case sharpens it into a stronger claim. In the prior four cases the adjudicating stage *had* a channel and simply failed to use it — the fix was to add a `context_fidelity` field. Here the channel does not exist to be annotated. RRF's score-blindness is not an oversight in its receipt schema; it is the algorithm's defining property. You cannot annotate a fused list with retriever confidence without changing RRF into something that is no longer RRF.

That makes the RRF ↔ receipts pairing the one place in this cluster where the standard mitigation fails, and it explains a gap the cluster left open. [[syntheses/synthesis-headroom-compression-reciprocal-rank-fusion]] established that a single compressor upstream of multiple retrievers introduces one *correlated* perturbation that every retriever inherits — BM25 loses the lexical hit, the embedding shifts, and the graph edge weakens together — which RRF's math reads as strong cross-retriever consensus and amplifies rather than dampens. [[syntheses/synthesis-headroom-compression-proof-of-work-receipts]] established that a receipt over a compressed view can certify a check that never really happened. Compose the two and the failure is worse than either alone: the receipt certifies a fusion that was not merely degraded but *confidently wrong in a specific direction*, and the human doing exception-only review sees a clean packet, because the exception field was populated from the same corrupted ranking.

The practical consequence is a boundary rule for where receipts belong. Receipts are worth emitting at stages whose output carries a verifiable property — a test that passed, a file that was written, a diff that applied. They are close to worthless at stages whose output is an ordering with no attached confidence, because there is nothing for a downstream auditor to re-derive short of re-running the whole retrieval. If receipts are to cover retrieval at all, they must be emitted *upstream* of fusion — one per retriever, recording that retriever's own score distribution and whether it read cached or compressed chunks — and the fusion stage should record only the input receipt handles rather than making an independent soundness claim. This inverts the natural instinct to place the receipt at the stage boundary the pipeline cares about, and it is the specific design correction this pair produces that neither parent page states.

## Evidence

| Source | Key claim | Bearing on the question |
|---|---|---|
| [[concepts/reciprocal-rank-fusion]] | `RRF_score(doc) = Σ 1/(k + rank_i)`, `k = 60`; "uses position in each list, not raw scores"; deliberately discards magnitude so incompatible scales can merge | The mechanism: no score survives fusion, so no confidence signal exists for a receipt to record |
| [[concepts/reciprocal-rank-fusion]] | RRF rewards *consistent cross-retriever relevance* — a document placing 2nd/1st/2nd beats one placing 1st once | Establishes that RRF's virtue depends on retriever independence, which is exactly what a shared upstream stage destroys |
| [[patterns/pattern-agent-proof-of-work-loop]] | Review packet requires `changed`, `output`, `verified_by`, `exceptions`; human "reviews exceptions only, not every artifact" | Exception-only review means an uninformative receipt is not merely useless but actively load-bearing — it consumes the review budget |
| [[patterns/pattern-agent-proof-of-work-loop]] | `confidence: medium`, sourced from two tweets and one review note | The pattern leg of this bridge is thinly grounded; conclusions inherit that weakness |
| [[syntheses/synthesis-headroom-compression-reciprocal-rank-fusion]] | Compression upstream of RRF "adds bias that RRF's fusion math is specifically built to amplify" | Supplies the failure mode that the receipt would need to catch and demonstrably cannot |
| [[syntheses/synthesis-headroom-compression-proof-of-work-receipts]] | "A receipt that does not record its own context fidelity cannot be audited"; proposes a `context_fidelity` field | The standard mitigation — which this page argues is unavailable at the fusion stage specifically |
| [[syntheses/synthesis-rrf-as-rlm-fusion-stage]] / [[concepts/rlm-pipeline]] | Fusion is a hard cut in the pipeline; documents below the cutoff are absent, not degraded | Raises the stakes: a fusion error is unrecoverable downstream, unlike a summarization error |

## Counter-arguments & Gaps

**Receipts at this stage may be a straw man.** [UNVERIFIED] No source in the KB documents anyone actually emitting a proof-of-work receipt for a fusion step. [[patterns/pattern-agent-proof-of-work-loop]]'s worked examples are code and file operations, where outputs are verifiable. It is possible that no practitioner would place a receipt here, in which case this page diagnoses a failure nobody was going to have.

**RRF's score-blindness is defensible on its own terms.** The argument treats discarded scores as lost audit signal, but they were discarded because they were *not comparable* — a BM25 score of 8.4 and a cosine of 0.84 do not jointly express confidence in any well-defined sense. Preserving them would give a receipt something to record without giving it anything meaningful to record. The honest framing may be that retrieval confidence is not measurable at the fusion stage by any method, not that RRF specifically destroyed it.

**The per-retriever receipt proposal is untested and may not compose.** Emitting one receipt per retriever multiplies receipt volume by the number of retrievers at the highest-frequency stage in the pipeline, and the review packet schema has no defined semantics for a receipt that references other receipts rather than making its own claim. Whether that is cheap plumbing or a schema redesign is unknown.

**Both legs are thinly grounded, and the chain is long.** [[patterns/pattern-agent-proof-of-work-loop]] is `confidence: medium` from tweet-level sources with `jay_experience: none`, and this page reasons from two prior syntheses that are themselves unmeasured arguments. This is a fourth-order inference. [[concepts/reciprocal-rank-fusion]] is the one solid leg — `confidence: high`, corroborated to Cormack et al. (SIGIR 2009).

**What would resolve it.** Run a fixture set of queries through the retrieval pipeline twice — once with full-fidelity chunks, once with compression upstream of the retrievers — and diff the fused top-k. If the top-k differs materially while a receipt emitted at the fusion stage is identical across both runs, the claim is demonstrated rather than argued. This is the same two-run pilot the compression cluster's leverage question already proposes and can ride along with it.

## Conclusion

Do not emit proof-of-work receipts at a fusion stage and treat them as verification. The defensible position is narrow: a receipt can only certify what its stage exposes, and RRF exposes an ordering and nothing else, so a fusion receipt is a timestamp wearing the costume of an audit. Move retrieval receipts upstream to the individual retrievers where score distributions and chunk provenance still exist, and let the fusion stage record input handles rather than a soundness claim. This holds regardless of whether compression is in the path; compression makes it urgent rather than true.

## Sources

- [[concepts/reciprocal-rank-fusion]]
- [[patterns/pattern-agent-proof-of-work-loop]]
- [[syntheses/synthesis-headroom-compression-reciprocal-rank-fusion]]
- [[syntheses/synthesis-headroom-compression-proof-of-work-receipts]]
- [[syntheses/synthesis-rrf-as-rlm-fusion-stage]]
- [[concepts/rlm-pipeline]]
