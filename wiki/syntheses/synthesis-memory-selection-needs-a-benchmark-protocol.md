---
title: Memory-System Selection Rests on a Benchmark With No Re-Verification Protocol
type: synthesis
sources:
  - "[[wiki/hot.md]]"
  - "[[evaluations/eval-memory-approaches]]"
  - "[[mocs/evaluation]]"
  - "[[mocs/memory]]"
  - "[[concepts/benchmark-design]]"
question: "How should the KB re-verify the LoCoMo benchmark result that drives its memory-system recommendations, and why does that procedure not currently exist?"
tags: [memory, evaluation, benchmark-design, agentic, provenance]
created: 2026-08-29
updated: 2026-08-29
reviewed: false
reviewed_date: ""
---

# Memory-System Selection Rests on a Benchmark With No Re-Verification Protocol

## Question

The hot cache tells every query to prefer Letta over Mem0 for "full control" memory, and it justifies that with one number. It also flags that number as possibly stale. What procedure resolves the flag — and why has no page ever defined one?

## Argument

The KB's memory-selection advice and its evaluation methodology were built on separate tracks and never joined. `wiki/hot.md` carries a Memory Systems Quick Guide whose load-bearing claim is a single cited result: "Letta's filesystem agents scored 74% using basic file operations, beating Mem0's specialized tools at 68.5%," followed by the self-aware caveat "*numbers from original benchmark — re-verify if comparing current versions*." That caveat is an instruction with no procedure attached. The Evaluation MoC owns exactly the machinery that would define one — `[[concepts/benchmark-design]]` (task suites, success criteria, repeatability), `[[concepts/llm-as-judge]]` (judge protocol and calibration), `[[concepts/rag-systems]]` (recall@k, precision@k, MRR) — and none of it is cross-linked from the memory side.

The gap is structural, not cosmetic. `[[evaluations/eval-memory-approaches]]` states its own methodology plainly: scores derive from "Jay's direct experience," "first-principles analysis of the architectural tradeoffs," and "published benchmarks where available." Two of those three are subjective by construction, and the third is the unverified LoCoMo citation. That is a legitimate methodology for a personal-KB decision — the page scopes itself explicitly to "a personal engineering knowledge base used as agent context injection, not a production RAG system." But `wiki/hot.md` strips the scoping when it compresses the finding into a recommendation, and the hot cache is, by `[[patterns/pattern-hot-cache]]`, the page "read first on every query." A scoped judgment became an unscoped default.

This makes the staleness flag a single point of failure at the top of the query funnel rather than a footnote on one evaluation page. It is also why the same leverage question has resurfaced in the daily notes repeatedly since May 2026 without moving: restating "is LoCoMo still valid?" produces no action, because answering it requires a re-verification protocol that no page defines. The fix is not another restatement. It is to write the protocol down once — sample size, task diversity, judge protocol, and the specific claim under test — and attach it to `[[evaluations/eval-memory-approaches]]`, so the hot-cache caveat points at something executable.

The generalizable lesson: when a compression layer (hot cache, MoC, quick guide) inherits a number from an evaluation page, it must inherit the evaluation's scope and its re-verification trigger, or the compression silently upgrades a conditional finding into a default.

## Evidence

| Claim | Source | Quote |
|---|---|---|
| Memory tiering advice rests on one benchmark | `wiki/hot.md` | "Letta's filesystem agents scored 74% using basic file operations, beating Mem0's specialized tools at 68.5%. Tool complexity matters less than reliable retrieval." |
| The KB knows the number may be stale | `wiki/hot.md` | "*Note: numbers from original benchmark — re-verify if comparing current versions.*" |
| Memory eval methodology is largely subjective by design | `[[evaluations/eval-memory-approaches]]` | Scores based on "Jay's direct experience... first-principles analysis of the architectural tradeoffs... published benchmarks where available" |
| The memory eval is explicitly scoped, the hot cache is not | `[[evaluations/eval-memory-approaches]]` | "this is evaluated for the specific use case of a **personal engineering knowledge base**... not a production RAG system for end users" |
| The methodology machinery exists on the evaluation side | `[[mocs/evaluation]]` | Lists `[[concepts/benchmark-design]]` — "Designing benchmarks for agentic tasks; task suites, success criteria, repeatability" |
| The hot cache is the highest-traffic read path | `[[patterns/pattern-hot-cache]]` via `wiki/hot.md` | "Read first on every query." |

## Counter-arguments & Gaps

**The scoping may be adequate and the alarm overstated.** `[[evaluations/eval-memory-approaches]]` is honest about its methodology and its scope. If a reader follows the MoC path rather than the hot cache, they encounter the caveats intact. The failure mode described here requires an agent to read `wiki/hot.md` and stop — which the hot-cache pattern deliberately encourages, but which is a property of the pattern, not a defect in either page.

**Re-verification may not be worth its cost.** Running a LoCoMo-style comparison across current Letta and Mem0 releases is real work — environment setup, task suite, judge calibration — for a decision that in practice is made once per project and is reversible. A cheaper resolution is to strip the specific percentages from `wiki/hot.md` and keep only the qualitative finding ("tool complexity matters less than reliable retrieval"), which is the part that generalizes and is least likely to have decayed. This synthesis does not establish that full re-verification beats deletion of the numbers.

**No evidence the number is actually wrong.** Nothing here shows the 74%/68.5% split has decayed. The argument is about the absence of a procedure, not about a demonstrated error. `[UNVERIFIED]` — whether current versions reproduce, invert, or widen the gap is unknown and untested by this KB.

**Both endpoint MoC bodies were read only in part.** The connections query that surfaced this pairing noted that `wiki/mocs/tool-use.md` and `wiki/mocs/evaluation.md` bodies were truncated in retrieval. Claims about what the Evaluation MoC does and does not cross-link rest on its concept listing and on inbound references, not on an exhaustive read. A full read could reveal an existing link that weakens the "never connected" claim.

**What would resolve it:** either (a) an executed re-run of the benchmark against pinned current versions of Letta and Mem0 with the protocol recorded, or (b) an explicit decision to drop the percentages from `wiki/hot.md` and retain only the qualitative claim. Either closes the flag; leaving it open is the only outcome that does not.

## Conclusion

The open question is not "is LoCoMo stale?" — it is "what would answering that even consist of?", and the KB has never written that down. The concrete next step is to attach a re-verification protocol to `[[evaluations/eval-memory-approaches]]` specifying the task suite, sample size, and judge protocol drawn from `[[concepts/benchmark-design]]`, then have `wiki/hot.md`'s caveat cite it. Until then the cheaper interim move is to demote the two percentages in `wiki/hot.md` to the qualitative finding they support, since that claim survives version drift and the numbers do not.

## Sources

- [[wiki/hot.md]]
- [[evaluations/eval-memory-approaches]]
- [[mocs/evaluation]]
- [[mocs/memory]]
- [[concepts/benchmark-design]]
- [[patterns/pattern-hot-cache]]
