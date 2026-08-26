---
title: "Synthesis: Self-Improving Harnesses Are Memory Promotion Under a Different Name"
type: synthesis
sources:
  - "[[concepts/self-improving-harness]]"
  - "[[concepts/meta-harness]]"
  - "[[system/policies/promotion-rules]]"
  - "[[system/policies/freshness-policy]]"
  - "[[frameworks/blume-codes]]"
  - "[[patterns/pattern-factory-learning-loop]]"
  - "[[patterns/pattern-system-qualification-run]]"
  - "[[patterns/pattern-governed-agent-lifecycle]]"
question: "Are a self-improving harness's scaffolding edits and the memory stack's learned→canonical promotion the same mechanism, and should they share one governance layer?"
tags: [orchestration, memory, agentic, evaluation, self-improving-harness, knowledge-management]
created: 2026-08-25
updated: 2026-08-25
reviewed: false
reviewed_date: ""
---

# Self-Improving Harnesses Are Memory Promotion Under a Different Name

## Question

Are a [[concepts/self-improving-harness|self-improving harness]]'s scaffolding edits and the memory stack's `learned → canonical` promotion the same mechanism, and should they share one governance layer?

## Argument

They are the same mechanism, and the KB currently encodes it twice with incompatible guarantees. Both are answers to one question: *which accumulated run experience earns the right to become permanent, trusted structure, and which decays?* A self-improving harness observes failure traces, proposes an edit to the loop/tools/memory/permissions, runs a regression test, and keeps the edit if it survives. [[system/policies/promotion-rules|Promotion Rules]] observes candidate items, requires provenance and classification, scores them against evidence count and freshness, and promotes to canonical if they clear the gates. Replace "failure trace" with "candidate item" and "regression test" with "promotion score" and the two loops are structurally identical — an observation stream, a proposal step, a verification gate, and a durable write.

The difference is not the mechanism, it is the rigor. Promotion Rules imposes seven hard gates on a canonical write: provenance is mandatory (Rule 1), evidence must come from ≥2 independent sources (Rule 4), unresolved contradictions block promotion outright (Rule 6), stale evidence cannot support canonical promotion without revalidation (Rule 7), and every write is additive and auditable via `supersedes` / `merged_from` (Rule 8). A self-improving harness has exactly one gate — the regression test — and `self-improving-harness` names the consequence itself: the harness "reports what it repaired, but not what it may have broken elsewhere." That is Rule 6 (contradiction detection) and Rule 8 (auditable, non-destructive writes) missing from a system that writes durable structure every run.

The [[system/policies/freshness-policy|Freshness Policy]] exposes the second missing half. Memory assigns every class a half-life and a floor — `learned` decays with a 60-day half-life, `canonical` with 180 — so a promoted artifact loses weight unless revalidated, and drops out of context entirely below 0.40. Harness scaffolding has no decay function at all. An `AGENTS.md` rule added to patch a model's file-deletion habit persists indefinitely, and the concept page's own strongest empirical claim is that scaffolding fixes are *model-specific*: a generic config copied from another repo is "really just a fix for someone else's model's bad habits." A model-specific fix with no expiry against a model that ships a new version every few months is precisely the failure the freshness half-life exists to prevent. Swap the model and every accumulated harness edit silently becomes stale evidence still weighted as fresh.

[[frameworks/blume-codes|Blume]] is the concrete proof that this convergence is already happening in the wild, and that it stops short. Blume mines agent conversation history for recurring correction "signals," clusters them, and proposes rule/skill/hook edits with evidence attached — "in 4 conversations you asked agents to run tests." That evidence count is Rule 3's recurrence test (`insight recurred in 2+ sessions`) and Rule 4's `evidence_count ≥ 2` reimplemented independently, in a different codebase, with a different threshold and no vocabulary in common. Blume also gates on human preview-and-approve, which is Rule 5's treatment of personal-preference items — and note that Blume's signals are almost entirely personal preferences, the exact class Promotion Rules says "cannot auto-promote to canonical via the scorer alone." Blume built the right gate by instinct and has no way to say so in the KB's terms.

The practical consequence: the KB should treat harness scaffolding as a memory class, not a separate artifact type. A harness edit gets `created_by`, `created_at`, `confidence`, `sources` (the failure traces), a class, a half-life, and a contradiction pre-check. The immediate payoff is that scaffolding stops being write-only.

## Editor note — Mission Control makes the governance gate concrete

The 2026-08-25 Editor pass adds one important constraint from the newly compiled Mission Control pages: the `harness` memory class should not promote learning signals directly into configuration. [[patterns/pattern-factory-learning-loop]] gives the operational sequence — signals → clustering → improvement candidates → human review → governed experiment → promotion recommendation — and its source note explicitly hardens the loop so it "can't self-authorize," "can't directly mutate governance," and "can't bypass verification" (`raw/clippings/2026-08-16T18-28-43__apple-notes__factory-learning-v1-sequencing-and-system-qualification-run__f651153f.md`). That is not just another example of self-improvement; it is the missing authorization boundary between observation and durable write.

[[patterns/pattern-system-qualification-run]] supplies the verification side of the same boundary. Its qualification scenario forces a single Mission through the full pipeline — Mission → Plan → Factory Version → Context Package → execution Attempt → independent verification Attempt → receipts → human acceptance → Factory Learning signal → improvement candidate → experiment proposal — then injects faults, including a candidate/PR-head mismatch, verification failure, context miss, sandbox orphan, and an Improvement Candidate that cannot change production/config without a governed WorkOrder. That makes the regression gate broader than the generic [[concepts/self-improving-harness]] page: the test is not "did this edit pass a benchmark," it is "did the factory preserve authority, lineage, verification, and rollback invariants across subsystem boundaries."

[[patterns/pattern-governed-agent-lifecycle]] generalizes the same shape at the product level: Constitution → Mission → Specification → Plan → WorkOrder → Context → Execution → Independent Verification → PR → Human Acceptance → Factory Learning. The raw audit directive states the operating principles directly: "Humans retain consequential authority," "Agents execute bounded work," and "Agent completion does not equal verified success" (`raw/clippings/2026-08-19T00-45-01__apple-notes__mission-control-full-repository-audit-and-e2e-qualification-__cff88980.md`). Net update to this synthesis: the proposed `harness` memory class needs two gates, not one — a **learning-to-candidate** gate that clusters signals, and a **candidate-to-config** gate that requires WorkOrder authorization, independent verification, receipts, and human acceptance before any durable harness/config mutation.

## Evidence

| Mechanism | Self-improving harness | Memory promotion |
|---|---|---|
| Observation stream | failure traces from runs | candidate items from sessions |
| Recurrence test | none stated; Blume uses conversation count | Rule 3: recurred in 2+ sessions |
| Independent corroboration | none | Rule 4: `evidence_count ≥ 2` |
| Verification gate | regression test | promotion score ≥ threshold + confidence ≥ 0.80 |
| Conflict handling | **absent** — "does not report what it may have broken" | Rule 6: contradiction blocks auto-promotion |
| Audit trail | **absent** | Rule 8: `supersedes`, `merged_from`, logged to `wiki/log.md` |
| Decay | **absent** — edits persist indefinitely | exponential half-life, `expired` below 0.40 blocks canonical promotion |
| Human gate | Blume: preview/approve diff | Rule 5: review required for personal class |

Key citations:

- `[[concepts/self-improving-harness]]`: "freeze the underlying model, let an agent rewrite its own scaffolding based on failure traces, and keep only the edits that survive a regression test"; pitfall — "reports what it repaired, but not what it may have broken elsewhere."
- `[[concepts/self-improving-harness]]`: ablation finding that gains live "in tools, middleware, and memory — not in the system prompt," i.e. the durable-structure layer, which is exactly what promotion governs.
- `[[system/policies/promotion-rules]]` Rules 1, 3, 4, 5, 6, 8.
- `[[system/policies/freshness-policy]]`: half-life table (`learned` 60d / `canonical` 180d) and the `expired < 0.40` cutoff that "blocks canonical promotion."
- `[[frameworks/blume-codes]]`: "detects recurring corrective patterns… proposes concrete fixes… cites the number of conversations that exhibited the pattern… shows an exact diff before applying."

## Counter-arguments & Gaps

**The blast radius is not comparable, so the gates should not be either.** A bad canonical wiki page misleads a reader who can check the source. A bad harness edit silently changes every subsequent agent run. That asymmetry argues the harness needs *stricter* gates than promotion, not merely the same ones — but it equally supports the opposite reading: that a regression test executing against real behavior is a stronger verifier than a static `evidence_count ≥ 2`, and importing document-governance vocabulary would add ceremony without adding safety. This synthesis does not resolve which verifier is stronger; that requires running both on the same edit set.

**Latency mismatch.** Promotion is designed for knowledge that compounds over weeks; a harness search loop may propose and discard hundreds of edits per hour. A 60-day half-life is meaningless at that tempo. If the analogy holds, the harness class needs its own half-life — plausibly indexed to model version rather than wall-clock days — and no such class exists in the freshness table today. That is a real design gap, not a detail.

**The evidence is thin on one side.** `self-improving-harness` is `confidence: medium`, carries a single LinkedIn source, and cites the Stanford / Shanghai AI Lab / Fudan results secondhand without linking the papers. `blume-codes` is also `confidence: medium` from vendor documentation, and its "improve loop" is described in marketing terms — there is no independent trace showing Blume's suggestions actually reduce recurrence. Under Rule 4 this synthesis's own core claim would not clear canonical promotion, which is worth stating plainly.

**What the evidence does NOT show.** No source in the KB has run a harness self-improvement loop under promotion-style governance, so the claimed benefit — fewer silent regressions, decaying model-specific fixes — is predicted from structure, not measured. `[UNVERIFIED]` as an empirical claim.

**What would resolve it.** Instrument one self-improving harness run with the four missing fields (`sources` = failure trace IDs, `confidence`, a contradiction pre-check against existing scaffolding rules, and a `supersedes` chain), then compare regression-test pass rate and silent-breakage count against an ungoverned run on the same model. A second, cheaper test: take an existing `AGENTS.md` accumulated over 3+ months, apply the `learned` 60-day half-life to each rule by its add date, and check whether the expired rules are the ones that no longer match the current model's failure modes.

## Conclusion

The mechanisms are the same and the KB should say so, but the correct move is not to copy Promotion Rules wholesale onto harness scaffolding. It is to add a `harness` memory class with its own half-life keyed to model version, inherit Rules 1 (provenance), 6 (contradiction blocks) and 8 (additive, auditable writes) unchanged, and leave the regression test as the verification gate in place of the promotion score — because behavioral verification is genuinely stronger than evidence counting where behavior is what's being changed. Open question for the next round: whether contradiction detection across scaffolding rules is even tractable, since two harness rules can conflict only in a specific execution context rather than semantically on the page.

## Sources

- [[concepts/self-improving-harness]]
- [[concepts/meta-harness]]
- [[system/policies/promotion-rules]]
- [[system/policies/freshness-policy]]
- [[frameworks/blume-codes]]
- [[mocs/orchestration]]
- [[mocs/memory]]
- [[patterns/pattern-factory-learning-loop]]
- [[patterns/pattern-system-qualification-run]]
- [[patterns/pattern-governed-agent-lifecycle]]
- `raw/clippings/2026-08-16T18-28-43__apple-notes__factory-learning-v1-sequencing-and-system-qualification-run__f651153f.md`
- `raw/clippings/2026-08-19T00-45-01__apple-notes__mission-control-full-repository-audit-and-e2e-qualification-__cff88980.md`
