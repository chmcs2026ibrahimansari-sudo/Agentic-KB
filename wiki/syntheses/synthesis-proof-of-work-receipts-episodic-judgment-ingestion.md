---
title: Proof-of-Work Receipts as the Episodic Judgment Log's Ingestion Contract
type: synthesis
sources:
  - "[[patterns/pattern-agent-proof-of-work-loop]]"
  - "[[patterns/pattern-episodic-judgment-log]]"
  - "[[syntheses/synthesis-episodic-judgment-obsidian-wiki-gate]]"
  - "[[syntheses/synthesis-episodic-judgment-as-freshness-signal]]"
question: Where do the Proof-of-Work Loop's "learning updates" actually live — and is the Episodic Judgment Log their missing write target?
tags: [agentic, evaluation, memory, receipts, judgment, pattern-memory, observability]
created: 2026-08-14
updated: 2026-08-14
reviewed: false
reviewed_date: ""
---

# Proof-of-Work Receipts as the Episodic Judgment Log's Ingestion Contract

## Question

The [[patterns/pattern-agent-proof-of-work-loop|Agent Proof-of-Work Loop]] mandates that agents "convert failures into learning updates before claiming completion" but never specifies where those updates are stored. The [[patterns/pattern-episodic-judgment-log|Episodic Judgment Log]] is treated across the August 2026 gate-cluster syntheses as a ground-truth oracle, but no page specifies how entries get written. Are these the two halves of one mechanism?

## Argument

The Proof-of-Work Loop's step 6 — "System captures the learning as a skill, memory, test, rule, or workflow update" — is an ingestion contract with no storage backend, and the Episodic Judgment Log is a storage backend with no ingestion contract. Wiring them together closes both gaps: the loop's review packet (`changed`, `verified_by`, `exceptions`, `learning_update`) maps almost field-for-field onto the log's `failures.jsonl` schema (`what_failed`, `root_cause`, `prevention`, `outcome`), and the loop's verification step provides exactly the at-the-time-of-experience capture discipline the log pattern names as its binding constraint ("value is zero if entries aren't written at the time of the experience").

This matters beyond tidiness. The entire August 2026 governance cluster — [[syntheses/synthesis-skillopt-gate-episodic-judgment-log]], [[syntheses/synthesis-episodic-judgment-obsidian-wiki-gate]], [[syntheses/synthesis-episodic-judgment-as-freshness-signal]] — treats the episodic log as the KB's highest-authority trust anchor while leaving unexamined how entries acquire that authority. If log entries are written ad hoc by humans under logging-discipline pressure, the oracle's ground truth is as reliable as human diligence. If instead every agent workflow that completes under the Proof-of-Work Loop emits its learning update as a structured append to the log, the oracle inherits the loop's verification guarantees: every entry arrives with receipts (what changed, how it was verified, what the exception was). The log stops being a diary and becomes an audit-backed event stream.

The dependency also runs in reverse. The Proof-of-Work Loop's weakest point is that "learning updates" without a defined destination decay into chat-scroll — noted, never retrieved. Giving the loop the log's append-only JSONL schemas as its required output format makes step 6 verifiable in the loop's own terms: the receipt for a learning update is the appended line itself.

## Evidence

- `pattern-agent-proof-of-work-loop.md` review packet includes `learning_update:` as a required field but the page names no storage location; "Related Patterns" links evaluation and orchestration pages, not memory pages.
- `pattern-episodic-judgment-log.md` specifies three append-only JSONL logs with structured reasoning fields, and its own failures example (`fail-2026-007`) is a proof-of-work-shaped record: what failed, root cause, contributing factors, prevention, outcome.
- `synthesis-episodic-judgment-obsidian-wiki-gate.md` calls the log "the ground-truth oracle" for vault-write gating without an ingestion contract — the gap this synthesis fills.
- The two pattern pages sit in different categories (`evaluation` vs `memory`) and currently share no cross-link, despite being added 7 weeks apart from independent sources (Eric Siu/EXM7777 threads vs Koylan's Personal Brain OS).

## Counter-arguments & Gaps

- **Independence may be a feature.** The gate-cluster syntheses derive the log's authority partly from it being *human*-authored judgment. Auto-appending agent-generated learning updates could dilute exactly the signal that makes the log a trustworthy oracle — an agent writing its own report card. A mitigating design (separate `agent-learnings.jsonl`, or a `source: agent|human` field) is proposed here but `[UNVERIFIED]` — no source in this KB has tested it.
- **Schema fit is close, not exact.** The loop's receipts cover artifacts and verification; the log's experience entries carry `emotional_weight` and subjective lessons no agent should fabricate. Only the `failures.jsonl` mapping is clean; forcing all three logs into the loop would over-apply the pattern.
- **Single-source lineage on each side.** Both pattern pages are `confidence: medium` with thin sourcing (two tweets + one vault note; one blog-derived writeup). The bridged claim inherits that weakness.
- **No deployment evidence.** Nothing in the KB shows a running system where proof-of-work receipts feed an episodic log. The 2026-05-30 Apple Notes link review (cited in the loop page) produced receipts but did not append to any judgment log.

## Conclusion

The connection is real and load-bearing: the Proof-of-Work Loop supplies the ingestion contract the Episodic Judgment Log assumes, and the log supplies the storage target the loop omits. The open design question is authority separation — whether agent-emitted learning updates belong in the same stream as human judgment entries or in a parallel, clearly-labeled log. A small pilot (route one week of Hermes workflow completions into a `source:`-tagged `failures.jsonl`, then audit entry quality against the human-written baseline) would resolve it and directly de-risk the oracle proposals in the gate cluster.

## Sources

- [[patterns/pattern-agent-proof-of-work-loop]]
- [[patterns/pattern-episodic-judgment-log]]
- [[syntheses/synthesis-episodic-judgment-obsidian-wiki-gate]]
- [[syntheses/synthesis-episodic-judgment-as-freshness-signal]]
