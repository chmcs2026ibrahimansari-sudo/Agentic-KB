---
title: The Telephone Game Problem Is a Retrieval-Fidelity Problem — Score It, Don't Just Bypass It
type: synthesis
sources:
  - [[patterns/pattern-supervisor-worker]]
  - [[patterns/pattern-per-claim-confidence]]
  - [[concepts/rlm-pipeline]]
  - [[concepts/reciprocal-rank-fusion]]
  - [[syntheses/synthesis-per-claim-confidence-as-rag-precision-layer]]
question: Can the memory stack's per-claim confidence machinery be reused to detect Telephone Game corruption in supervisor-worker orchestration, rather than only routing around it?
tags: [orchestration, memory, multi-agent, context-management, agentic, evaluation]
created: 2026-08-21
updated: 2026-08-21
reviewed: false
reviewed_date: ""
---

## Question

Can the memory stack's per-claim confidence machinery be reused to *detect* Telephone Game corruption in supervisor-worker orchestration, rather than only routing around it with a `forward_message` bypass?

## Argument

The Telephone Game Problem and lossy memory retrieval are the same failure mode wearing two costumes, and the Orchestration MoC currently solves it worse than the Memory MoC does. In [[patterns/pattern-supervisor-worker]] the supervisor paraphrases a worker's response and silently degrades it; the sanctioned fix is a `forward_message` tool that bypasses synthesis entirely when the worker's answer is final. That is an architectural workaround: it eliminates the lossy hop for the one case a human predicted in advance, and does nothing for the cases they did not. The Memory MoC faces the identical structure — a synthesis layer standing between a fact and its consumer — and answers it differently. [[patterns/pattern-per-claim-confidence]] annotates individual claims with a confidence score, source count, and last-verified date so that downstream synthesis can *weight* claims rather than trust pages wholesale, and [[concepts/rlm-pipeline]] carries those annotations through retrieval. One approach removes the lossy layer; the other instruments it.

Instrumentation generalizes and bypass does not. `forward_message` requires the supervisor to know, before synthesizing, that synthesis is unsafe — precisely the judgment that a degraded supervisor is least equipped to make. A per-claim confidence envelope inverts the burden: a worker returns claims already tagged with confidence and provenance, and the supervisor's paraphrase either preserves those tags or visibly drops them. Dropped tags are a detectable signal. This turns Telephone Game corruption from a silent, post-hoc bug into a checkable invariant at the orchestration boundary — the same move [[syntheses/synthesis-per-claim-confidence-as-rag-precision-layer]] makes for RAG precision, applied one layer up the stack.

The deeper point is that both MoCs are converging on the same primitive without naming it. Wherever a KB or an agent system inserts a summarization step between a producer and a consumer, the summarization is a lossy channel, and the only durable defenses are (a) delete the channel or (b) make the loss measurable. The Memory MoC has repeatedly picked (b) — per-claim confidence, provenance markers, freshness stamps. The Orchestration MoC has so far only picked (a). Naming the shared primitive lets orchestration borrow memory's measurement machinery instead of reinventing bypasses per call site.

## Evidence

- **The bypass framing is explicit.** `wiki/hot.md` records: "Beware the Telephone Game Problem: supervisors paraphrase sub-agent responses incorrectly. Fix with a `forward_message` tool that bypasses synthesis when the sub-agent's response is final." The fix is stated as routing-around, with no detection component.
- **The measurement framing is explicit.** [[patterns/pattern-per-claim-confidence]] states its problem as "Page-level confidence scoring is too coarse" and its solution as annotating individual claims with "their own confidence score, source count, and last-verified date," so that "LLM synthesis can weight individual claims correctly rather than trusting entire pages." Substitute "supervisor" for "LLM synthesis" and "worker response" for "page" and the sentence describes orchestration unchanged.
- **The same pattern already detects contradictions across a synthesis boundary.** Per-claim confidence is credited with enabling contradiction detection "at claim level, not just page level" — the exact capability missing at the supervisor boundary today.
- **A precedent for the transplant exists.** [[syntheses/synthesis-per-claim-confidence-as-rag-precision-layer]] already moves this machinery out of authoring and into retrieval scoring, establishing that the annotation is portable across pipeline stages rather than being a wiki-authoring convention.
- **The cost is documented and non-trivial.** [[patterns/pattern-per-claim-confidence]] lists "significant authoring and maintenance overhead" and "not worth it for most pages — high-effort, selective application required" as its standing tradeoffs.

## Counter-arguments & Gaps

- **No measurement either way.** [UNVERIFIED] Nothing in the KB measures how often supervisor paraphrase actually corrupts a worker response, or what fraction of those corruptions `forward_message` already catches. If the bypass covers most real cases, adding a confidence envelope is overhead for marginal recall.
- **The overhead objection transfers with the pattern.** Per-claim confidence is explicitly documented as too expensive for routine use. Orchestration hops are far more numerous than canonical wiki pages, so the cost argument is *stronger* against this transplant than against the original pattern, not weaker.
- **Confidence tags are themselves summarizable.** A supervisor that paraphrases badly may also paraphrase the confidence annotations badly, or fabricate them. The invariant is only checkable if tags are carried as structured fields outside the natural-language payload — which is an unstated requirement of this argument and may not hold in text-only agent protocols.
- **Bypass may be strictly correct for terminal responses.** When a worker's output is genuinely final, `forward_message` yields zero loss. Instrumentation cannot beat zero. The argument here only applies to the non-terminal case where synthesis is actually wanted.
- **Prior art unchecked.** [UNVERIFIED] No raw source in the KB shows a production multi-agent system carrying per-claim confidence across an orchestration boundary. This synthesis is a first-principles transplant, not a documented practice.
- **What would resolve it:** an instrumented supervisor-worker run that tags worker claims with confidence/provenance, logs how many tags survive supervisor synthesis, and compares corruption rates against a `forward_message`-only baseline. That single experiment decides whether this page is load-bearing.

## Conclusion

The Telephone Game Problem should be reclassified from an orchestration quirk to an instance of synthesis-layer fidelity loss, the same class [[patterns/pattern-per-claim-confidence]] and [[concepts/rlm-pipeline]] already address in the memory stack. The practical recommendation is additive, not replacing: keep `forward_message` for terminal responses, and add structured confidence/provenance fields to worker returns so that non-terminal synthesis becomes auditable rather than trusted. The open question is empirical — nobody in the KB has measured supervisor corruption rates, so the value of the added instrumentation is argued from structure rather than data.

## Sources

- [[patterns/pattern-supervisor-worker]]
- [[patterns/pattern-per-claim-confidence]]
- [[concepts/rlm-pipeline]]
- [[concepts/reciprocal-rank-fusion]]
- [[syntheses/synthesis-per-claim-confidence-as-rag-precision-layer]]
- [[mocs/orchestration]]
- [[mocs/memory]]
