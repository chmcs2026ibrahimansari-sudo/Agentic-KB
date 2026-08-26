---
title: "Promotion Scoring Measures Everything About a Claim Except Whether It Is True"
type: synthesis
sources:
  - "[[concepts/llm-as-judge]]"
  - "[[system/policies/promotion-rules]]"
  - "[[concepts/agent-evaluation]]"
  - "[[concepts/agent-evaluation-gaming]]"
  - "[[concepts/memory-lifecycle]]"
  - "[[system/policies/source-trust-policy]]"
  - "[[system/policies/freshness-policy]]"
question: "The Evaluation MoC owns judge-based scoring and the Memory MoC owns promotion policy. Should the promotion scorer that decides what becomes canonical actually invoke a judge, or is metadata-only scoring sufficient?"
tags: [evaluation, memory, agentic, promotion, llm-as-judge, governance, knowledge-management]
created: 2026-08-26
updated: 2026-08-26
reviewed: false
reviewed_date: ""
---

# Promotion Scoring Measures Everything About a Claim Except Whether It Is True

## Question

The Evaluation MoC owns judge-based scoring ([[concepts/llm-as-judge]], [[concepts/trajectory-evaluation]]). The Memory MoC owns promotion policy ([[system/policies/promotion-rules]]). Both use the word "scoring" for the same pipeline stage — the moment a candidate becomes canonical knowledge — yet neither page references the other. Should the promotion scorer invoke a judge, or is metadata-only scoring sufficient?

## Argument

The promotion scorer is not an evaluator. It is a metadata aggregator wearing an evaluator's vocabulary, and the distinction is the KB's largest unguarded governance seam.

Read the formula in [[system/policies/promotion-rules]] literally. Every one of its six terms — `evidence_score`, `confidence`, `freshness_score`, `trust_score`, `novelty_score`, `explicit_approval` — is a fact *about* the claim's provenance. Not one of them reads the claim. A page can clear the `≥ 0.75` canonical threshold without any process ever having assessed whether its content is correct, internally coherent, or even on-topic. The hard gates in Rule 4 are the same shape: they count sources, check timestamps, and verify path collisions. Counting is not judging.

Meanwhile [[concepts/llm-as-judge]] describes exactly the missing capability — rubric-based scoring of open-ended content where "exact-match or rule-based metrics" fail — and the KB already treats it as the answer to that class of problem in the evaluation domain. It is simply never called on the promotion path. The KB has the tool and has not wired it to the door it was built for.

The failure mode this permits is specific and non-obvious: **provenance and truth are independent variables, and the scorer only observes one of them.** A claim that is well-cited, recent, from a trusted source, and marked high-confidence scores ≥ 0.75 and goes canonical *whether or not it is right*. Symmetrically, a correct single-source insight scores below 0.45 and is deferred to `wiki/candidates.md` under the 2-source rule. The system is calibrated to reward well-documented claims, and it cannot distinguish those from well-documented wrong claims. Given that canonical pages are what later agents read as ground truth, an error admitted here compounds rather than decays.

[[concepts/agent-evaluation-gaming]] sharpens this from a quality problem into a safety one. A purely mechanical formula is a specification, and specifications are gameable. Any process that can emit two citations and a high `confidence` value can manufacture canonical status — including the KB's own automation, which authors most candidates. The scorer cannot tell a genuinely corroborated claim from one that was written to satisfy the scorer. Today's pattern query is a live instance: three themes surfaced as "ready to graduate" on the strength of 4–5 citing summaries that were themselves authored by the same scheduled task. The evidence count is real. The independence it implies is not.

## Evidence

| Source | What it establishes |
|---|---|
| [[system/policies/promotion-rules]] — Promotion Score Formula | All six weighted terms are provenance metadata; content quality has zero weight |
| [[system/policies/promotion-rules]] — Rule 4 | Canonical hard gates count sources and check freshness/collision; none inspect content |
| [[concepts/llm-as-judge]] | Rubric scoring exists precisely for "open-ended outputs where multiple valid answers exist" — the promotion case |
| [[concepts/llm-as-judge]] | Recommends "periodic human audits to calibrate the judge" — the calibration loop `reviewed:` already implies but does not close |
| [[concepts/agent-evaluation-gaming]] | Mechanical eval criteria are gameable by the systems being evaluated |
| [[system/policies/promotion-rules]] — Rule 6 | Contradiction detection blocks promotion — the one existing content-aware gate, and it is comparative, not evaluative |

Rule 6 is the exception that proves the argument. Contradiction checking *does* read content, but it can only detect conflict with something already canonical. It has nothing to say about a novel claim in an area the KB has not covered — which is precisely where new canonical pages are created.

## Counter-arguments & Gaps

**Metadata scoring may be deliberately chosen, not overlooked.** Provenance is cheap, deterministic, auditable, and reproducible; a judge is none of these. Rule 8's audit requirement is far easier to satisfy with a formula whose inputs can be replayed than with an LLM whose score varies run to run. Wiring a judge in trades auditability for accuracy, and the current design may be the correct side of that trade for an append-only KB where errors are recoverable.

**The human `reviewed:` flag is the intended judge.** Rule 12 makes every LLM-authored page born `reviewed: false`, which arguably *is* the content-quality gate — deferred to Jay rather than automated. Under that reading there is no gap, only a slow gate. The counter-counter: nothing prevents an unreviewed page from being cited by later automation as though vetted, and the KB's own lint workflow tracks unreviewed pages older than 30 days as a standing backlog — which suggests the human gate is not clearing at the rate pages arrive.

**A judge introduces a new failure mode rather than removing one.** Judges are themselves subject to [[concepts/agent-evaluation-gaming]], and an LLM judge scoring LLM-authored pages is a closed loop with correlated blind spots. It is not obvious this is better than an honest metadata score that makes no claim to assess truth.

**What the evidence does not show.** No source here demonstrates that a metadata-scored KB actually accumulates more errors than a judge-scored one. The argument is mechanistic, not empirical. `[UNVERIFIED]` — the KB holds no measurement of canonical-page error rate, so the size of this problem is unknown.

**What would resolve it.** Sample 20 canonical pages that scored ≥ 0.75, have a judge score them against a correctness rubric, and compare against `reviewed: true` human verdicts on the same set. Three outcomes are informative: agreement with humans (wire the judge in), disagreement with humans (do not), or a near-zero error rate in the sample (the gap is theoretical and deprioritized).

## Conclusion

The gap is real and correctly identified: promotion scoring and judge-based evaluation are the same pipeline stage held by two MoCs that do not reference each other. The remedy is not obvious. Adding an `evaluation_score` term to the formula is the cheap move, but it imports the judge's variance into an audit trail that depends on replayability, and it closes an LLM-scores-LLM loop.

The defensible next step is smaller than a design change: **measure first.** The 20-page calibration study above is the concrete verification step, and it is cheap. Until it runs, treat the metadata formula as what it honestly is — a provenance score, not a quality score — and stop reading `≥ 0.75` as an assertion that a page is correct.

## Sources

- [[concepts/llm-as-judge]]
- [[concepts/agent-evaluation]]
- [[concepts/agent-evaluation-gaming]]
- [[concepts/trajectory-evaluation]]
- [[concepts/memory-lifecycle]]
- [[system/policies/promotion-rules]]
- [[system/policies/source-trust-policy]]
- [[system/policies/freshness-policy]]
- [[mocs/evaluation]]
- [[mocs/memory]]
