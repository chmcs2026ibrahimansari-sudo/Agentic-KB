---
title: "The Episodic Judgment Log Is the Ground-Truth Oracle obsidian-wiki's Gate Is Missing"
type: synthesis
sources:
  - "[[syntheses/synthesis-skillopt-gate-obsidian-wiki-governance]]"
  - "[[patterns/pattern-episodic-judgment-log]]"
  - "[[syntheses/synthesis-episodic-judgment-as-freshness-signal]]"
  - "[[syntheses/synthesis-headroom-compression-episodic-judgment-signal]]"
question: "Should obsidian-wiki-style vault-write gating validate against the Episodic Judgment Log's human correction events instead of a generic held-out fixture set?"
tags: [agentic, memory, evaluation, safety, knowledge-base, judgment]
created: 2026-08-13
updated: 2026-08-13
reviewed: false
reviewed_date: ""
---

# The Episodic Judgment Log Is the Ground-Truth Oracle obsidian-wiki's Gate Is Missing

## Question

[[syntheses/synthesis-skillopt-gate-obsidian-wiki-governance]] argues obsidian-wiki needs a SkillOpt-style validation gate before agent vault writes land, but leaves open what that gate validates *against* — it proposes a held-out fixture set with no defined provenance. Meanwhile [[patterns/pattern-episodic-judgment-log]] is already established as the KB's highest-authority record of human corrections and judgment. Should the vault gate's ground truth be the episodic log rather than a synthetic fixture set?

## Argument

The gate-transplant synthesis imported SkillOpt's *mechanism* (held-out validation before accepting an edit) but not its *signal*: SkillOpt validates against task rollouts with checkable outcomes, and the vault adaptation substituted "fixture questions answered from the vault" — a set someone still has to author, maintain, and keep honest. That is new infrastructure with no connection to what humans have actually corrected. The Episodic Judgment Log closes exactly this gap. Its contradiction and correction events are, per [[syntheses/synthesis-episodic-judgment-as-freshness-signal]], the highest-trust freshness signal in the system: each entry records a case where a human overrode or corrected recorded knowledge, with structured reasoning attached. Wiring those events into the vault gate means a proposed agent edit is checked against the accumulated record of human judgment — an edit that re-introduces a claim a human already corrected gets vetoed or downgraded before commit, rather than passing a fixture set that never encoded that correction.

This is a wiring decision, not a build. Both components exist: the gate architecture is specified in the SkillOpt-transplant synthesis (asynchronous, nightly, stage-then-review), and the log is append-only JSONL with structured fields agents already query. The change is to source the gate's validation cases from `failures.jsonl` and correction-tagged entries instead of (or in addition to) hand-authored fixtures. It also completes the 4-node cluster the last five syntheses built — Headroom, SkillOpt, obsidian-wiki, and the episodic log — whose only unwritten edge was obsidian-wiki ↔ episodic log.

## Evidence

- [[syntheses/synthesis-skillopt-gate-obsidian-wiki-governance]] — proposes the gate but concedes the mechanism transfer "is argued from design, not evidence," and its fixture set has no defined source of ground truth.
- [[patterns/pattern-episodic-judgment-log]] — append-only JSONL logs of decisions, failures, and corrections with structured reasoning fields; the failures log "encodes pattern recognition that took real pain to acquire."
- [[syntheses/synthesis-episodic-judgment-as-freshness-signal]] — establishes episodic correction events as the top of the KB's freshness-authority hierarchy.
- [[syntheses/synthesis-headroom-compression-episodic-judgment-signal]] — treats the episodic log as the trust anchor that compression must not corrupt, reinforcing its oracle status.

## Counter-arguments & Gaps

- **Coverage is sparse and biased.** The episodic log only covers what humans bothered to correct. A gate validating solely against it will pass any error class that has never been corrected before — it prevents *regression*, not novel error. A fixture set, for all its arbitrariness, can cover ground the log has never touched. The strongest design is probably hybrid, which this synthesis does not specify.
- **Judgment events are not fixtures.** Log entries record contextual human decisions, not question–answer pairs. Converting a correction event into a checkable validation case requires an extraction step whose reliability is unproven — no source in the KB demonstrates it.
- **Anchoring risk transfers.** The pattern page itself warns judgment logs "anchor the agent to past patterns." A gate built on them may reject legitimate updates that supersede an old correction (the correction itself can go stale), reproducing the ossification concern already flagged for strict-improvement gates.
- **`[UNVERIFIED]` chain.** Every page this synthesis rests on is itself unreviewed and flagged as architectural inference; no deployment has been observed. The empirical test proposed in [[syntheses/synthesis-skillopt-gate-episodic-judgment-log]] — a gated-fixture run over 20–30 historical episodic events — would also validate or falsify this wiring, and should run before any build.

## Conclusion

Sourcing the vault gate's validation cases from the Episodic Judgment Log is the cheapest version of the governance layer obsidian-wiki lacks: no new fixture infrastructure, ground truth that is human-attested by construction, and direct veto power over re-introducing corrected errors. Its known blind spot — no protection against never-before-seen error classes — argues for a hybrid gate (episodic events first, thin fixture set for coverage). Untested; the 20–30-event historical replay already proposed for the sibling syntheses is the shared falsification path.

## Sources

- [[syntheses/synthesis-skillopt-gate-obsidian-wiki-governance]]
- [[patterns/pattern-episodic-judgment-log]]
- [[syntheses/synthesis-episodic-judgment-as-freshness-signal]]
- [[syntheses/synthesis-headroom-compression-episodic-judgment-signal]]
- [[syntheses/synthesis-skillopt-gate-episodic-judgment-log]] — sibling transplant whose proposed experiment doubles as this synthesis's test
