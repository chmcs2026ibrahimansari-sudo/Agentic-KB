---
title: Delta Tracking and Provenance Tagging Operationalize the Freshness Policy
type: synthesis
sources:
  - "[[summaries/ar9av-obsidian-wiki]]"
  - "[[system/policies/freshness-policy]]"
  - "[[patterns/pattern-per-claim-confidence]]"
question: What infrastructure does the Freshness Policy's decay model need to run automatically instead of by manual audit?
tags: [agentic, memory, provenance, knowledge-management]
created: 2026-07-11
updated: 2026-07-11
reviewed: false
reviewed_date: ""
---

# Delta Tracking and Provenance Tagging Operationalize the Freshness Policy

## Question

The [[system/policies/freshness-policy|Freshness Policy]] defines exponential decay with half-lives per memory class — but decay requires knowing when each source was last processed and which claims trace to it. Where does that data come from?

## Argument

Ar9av's obsidian-wiki delta-tracking manifest and per-claim provenance tagging are the concrete implementation primitives the Freshness Policy currently lacks. The policy defines decay semantics; obsidian-wiki's `.manifest.json` and provenance blocks are the write path that makes those semantics executable at KB scale. Without them the policy is a formula executed by hand.

## Evidence

- [[summaries/ar9av-obsidian-wiki]]: `.manifest.json` records every ingested source, its timestamp, and the pages it produced — exactly the per-source decay clock the Freshness Policy needs.
- Provenance tagging (extracted / inferred / ambiguous) maps onto the Source Trust Policy's confidence multipliers, letting freshness decay claims differently by epistemic status.
- Delta tracking re-processes only changed material, which answers the policy's core operational question — *what has gone stale?* — without re-scoring the entire vault.
- Downstream: [[patterns/pattern-per-claim-confidence]] stayed at `medium` because of a single-source provenance gap discovered retroactively; ingest-time provenance blocks would have prevented that class of gap structurally.

## Counter-arguments & Gaps

- obsidian-wiki's `_raw/` promotion/removal behavior conflicts with Agentic-KB's raw-immutability rule (flagged unresolved in `wiki/log.md` 2026-06-25). Adopting its manifest primitives does not require adopting its raw-mutation behavior, but the KB has not verified the two are separable in the actual implementation.
- Single-source basis: the manifest/provenance design is described only by `ar9av-obsidian-wiki`. Whether it scales past a few hundred sources is `[UNVERIFIED]`.
- A manifest tracks *source* freshness; claim-level decay still needs a claim→source index the policy assumes but no source fully specifies.

## Conclusion

Adopt the manifest + provenance-block primitives as the Freshness Policy's execution layer, implemented natively (not by importing obsidian-wiki's pipeline) to sidestep the raw-immutability conflict. That conflict itself still needs Jay's policy ruling.

## Sources

- [[summaries/ar9av-obsidian-wiki]]
- [[system/policies/freshness-policy]]
- [[patterns/pattern-per-claim-confidence]]
