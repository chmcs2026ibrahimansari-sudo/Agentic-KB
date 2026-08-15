---
title: "The Proof-of-Work Receipt Is the Audit Trail the Gated Vault Never Specified"
type: synthesis
sources:
  - "[[patterns/pattern-agent-proof-of-work-loop]]"
  - "[[frameworks/framework-obsidian-wiki]]"
  - "[[syntheses/synthesis-skillopt-gate-obsidian-wiki-governance]]"
  - "[[syntheses/synthesis-proof-of-work-receipts-episodic-judgment-ingestion]]"
  - "[[syntheses/synthesis-episodic-judgment-obsidian-wiki-gate]]"
question: "What gets permanently recorded when a gated vault write is accepted — and is the Proof-of-Work receipt schema the missing answer?"
tags: [agentic, memory, evaluation, observability, safety, knowledge-base, receipts]
created: 2026-08-15
updated: 2026-08-15
reviewed: false
reviewed_date: ""
---

# The Proof-of-Work Receipt Is the Audit Trail the Gated Vault Never Specified

## Question

[[syntheses/synthesis-skillopt-gate-obsidian-wiki-governance]] argues that agent-writable vaults need a validation gate, and specifies in detail what should *block* a write. It never specifies what gets *recorded* when a write is accepted. [[patterns/pattern-agent-proof-of-work-loop]] defines a structured completion record — `changed`, `output`, `verified_by`, `exceptions`, `next_action`, `learning_update` — for exactly the class of work that has external side effects. Is that receipt schema the commit record the gated vault is missing, and does adopting it close the gate → write → receipt → log pipeline the surrounding syntheses argue for pairwise?

## Argument

A gate without a receipt is only half a governance mechanism. [[frameworks/framework-obsidian-wiki|obsidian-wiki]] concedes it has "no built-in validation or conflict resolution" and "no automated quality gate"; the SkillOpt transplant answers the validation half by rejecting writes that regress a held-out fixture set. But an accepted write under that scheme is indistinguishable from an ungated one after the fact — the vault records the new page content and nothing about how it came to be trusted. That is precisely the failure mode [[patterns/pattern-agent-proof-of-work-loop]] was written against: "'I ran the workflow' but no one can tell what changed." The gate's accept decision is itself an agent completion claim with external side effects, which is the pattern's stated trigger condition.

The schemas fit without adaptation. A gated vault write produces exactly the fields the review packet asks for: `changed` is the page diff, `verified_by` is the fixture set and its scores, `exceptions` is the rejected-edit buffer entry or the pages the gate could not fixture-test, `learning_update` is the new or amended fixture question. Under this mapping the receipt is not extra bookkeeping bolted onto the gate — it is a serialization of the decision the gate already made and currently discards.

This is also the edge that completes the cluster. [[syntheses/synthesis-episodic-judgment-obsidian-wiki-gate]] argues the vault gate should validate against the episodic log's correction events; [[syntheses/synthesis-proof-of-work-receipts-episodic-judgment-ingestion]] argues Proof-of-Work receipts should feed the episodic log. Writing the direct obsidian-wiki ↔ Proof-of-Work edge makes those two into one pipeline rather than two overlapping proposals: the gate consults the log to decide, the accepted write emits a receipt, and that receipt *is* the ingestion event the log needs. One artifact serves as commit record, audit trail, and training signal.

## Evidence

- [[patterns/pattern-agent-proof-of-work-loop]] — review packet schema (`changed`, `output`, `verified_by`, `exceptions`, `next_action`, `learning_update`) and the five minimum review questions; "When To Use" names work with external side effects, multi-file scope, and long-running auditability needs.
- [[frameworks/framework-obsidian-wiki]] — Limitations: "no built-in validation or conflict resolution"; "there is no automated quality gate."
- [[syntheses/synthesis-skillopt-gate-obsidian-wiki-governance]] — specifies the rejection criterion and the rejected-edit buffer, and recommends an asynchronous nightly pass; specifies no record for accepted writes.
- [[syntheses/synthesis-proof-of-work-receipts-episodic-judgment-ingestion]] — establishes receipts as the ingestion contract into [[patterns/pattern-episodic-judgment-log]], and flags the loop's own pages as `confidence: medium` with thin sourcing.
- Agentic-KB's own `wiki/log.md` and `wiki/_meta/compile-log.md` are a working, coarser instance: every compile run appends what was promoted, deferred, and why. The receipt proposal generalizes an append-only audit convention already in production here.

## Counter-arguments & Gaps

- **The pattern page is thin.** [[patterns/pattern-agent-proof-of-work-loop]] carries `confidence: medium` and rests largely on two social-media sources plus one of Jay's own vault notes. No source in the KB demonstrates receipt-emitting vault writes; the schema fit is argued from design, not from evidence that it works at vault scale.
- **Receipts on every write may cost more than they return.** The pattern's own "When NOT To Use" warns against applying it where "the cost of receipts exceeds the risk of error." A vault absorbs many small appends; a receipt per write could easily exceed the content it documents. The likely resolution is receipt-per-gate-run (nightly batch) rather than per-write, matching the asynchronous recommendation in the sibling synthesis — but that weakens the claim that the receipt is a *commit* record.
- **Where do receipts live?** If they land in the vault they inflate the artifact the gate is protecting and become inputs to future retrieval, risking a feedback loop where the KB reasons about its own bookkeeping. If they land outside it, the audit trail is severable from the content — which is what makes today's git history insufficient in the first place. No source resolves this.
- **Git may already be sufficient.** A commit message plus diff already answers "what changed" and "when." The marginal value of the receipt is concentrated in `verified_by` and `exceptions` — the fields git cannot express. That narrows the proposal considerably and is the honest version of the claim.
- **Unfalsified.** Nothing here has been piloted. The cheapest test: run one nightly gate pass over a single folder, emit one receipt for the batch, and check after a month whether any receipt was ever read to answer a real question. If not, the audit trail is theater.

## Conclusion

The receipt schema is a clean structural fit for the gap the gated-vault proposal leaves open, and adopting it collapses three pairwise syntheses into one gate → write → receipt → log pipeline. The strong form of the claim — a receipt per vault write — does not survive its own cost objection; the defensible form is a batch receipt per nightly gate run, carrying the two fields git cannot (`verified_by`, `exceptions`) and doubling as the episodic log's ingestion event. Both the pattern page's thin sourcing and the storage-location question remain open, and the one-folder pilot above is the cheapest falsification path.

## Sources

- [[patterns/pattern-agent-proof-of-work-loop]]
- [[frameworks/framework-obsidian-wiki]]
- [[syntheses/synthesis-skillopt-gate-obsidian-wiki-governance]]
- [[syntheses/synthesis-proof-of-work-receipts-episodic-judgment-ingestion]]
- [[syntheses/synthesis-episodic-judgment-obsidian-wiki-gate]]
