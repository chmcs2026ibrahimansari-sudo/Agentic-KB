---
title: "The Mistake Log Only Records Failures a Human Noticed"
type: synthesis
sources:
  - "[[patterns/pattern-mistake-log]]"
  - "[[concepts/agent-failure-modes]]"
  - "[[patterns/pattern-plan-execute-verify]]"
  - "[[patterns/pattern-episodic-judgment-log]]"
  - "[[concepts/memory-systems]]"
question: "The Orchestration layer defines a failure-escalation rule (3 failed fix attempts → document and move on) and the Memory layer defines an append-only mistake log. Neither names the other. What writes the escalation event to the log, and which failures never reach it at all?"
tags: [memory, orchestration, agentic, safety, reflection, error-handling, context-management]
created: 2026-08-27
updated: 2026-08-27
reviewed: false
reviewed_date: ""
---

# The Mistake Log Only Records Failures a Human Noticed

## Question

`wiki/hot.md` codifies a runtime escalation rule under GSD Deviation Rules (Executor): *"3 failed fix attempts on one task → document and move on. Never infinite fix loops."* It says to document, but not where. [[patterns/pattern-mistake-log]] in the Memory MoC is the KB's only append-only failure store — the obvious destination — yet the two pages have no link in either direction. What connects them, and what falls through the gap?

## Argument

The mistake log's write-trigger is a human correction, so the log is structurally blind to every failure a human did not catch. That is not a documentation gap. It is a selection bias baked into the KB's memory of its own errors.

Read [[patterns/pattern-mistake-log]]'s protocol literally. Its WRITE condition fires "immediately when user flags an error or says 'that's wrong' / 'you messed up'." Its Trigger Recognition section enumerates correction signals — direct statements, the user rewriting output, the user undoing an action, repeated feedback. Every entry in its own worked example is a quoted user correction. The pattern's `Correction` field is defined as "(user's words)". The log is therefore a record of *supervised* failure: it captures precisely the subset of errors that a watching human noticed, cared about, and voiced.

Now hold that against the two failure classes the orchestration and safety layers actually worry about. The GSD deviation rule describes a failure the agent detects *about itself* — three fix attempts, no success, abandon the task. No user necessarily says anything; the agent may report the abandonment as a well-formed status update. And [[concepts/agent-failure-modes]] names the sharper case: the **silent refusal**, where a model declines something benign and "it shows up as a normal successful response, not an error." Neither of these emits a correction signal. Under the mistake log's own trigger list, neither gets written. The failures most likely to recur unnoticed are exactly the ones the anti-recurrence mechanism cannot see.

This inverts the pattern's stated value. [[patterns/pattern-mistake-log]] claims its benefit is that "repeat errors decrease over time." That holds for the supervised class and only that class. For self-detected abandonment and silent refusal, the mistake log offers no protection while creating the *appearance* of coverage — a session-start read of `mistakes.md` returns clean, and the agent proceeds as though its error history were complete. An empty log is being read as evidence of correctness when it is only evidence of unobserved-ness.

The fix is a one-line addition to the trigger list, and it is cheap because the event already exists. The GSD rule's "document and move on" step is an agent-generated failure event with a timestamp, a task, and an attempt count — everything the log's `Date → Task → Mistake → Correction → Lesson` schema needs, except that `Correction` would hold the agent's own diagnosis rather than a user quote. Making the escalation event a first-class write-trigger converts a per-session policy into the compounding cross-session asset the Memory MoC already claims it to be, and it closes the loop without inventing any new machinery.

One caveat on scope: this widens *what* gets logged, not *whether* the log is trustworthy. An agent writing its own failure diagnoses is self-attesting, which is the same trust problem [[patterns/pattern-plan-execute-verify]] introduces a separate verifier role to solve. Broadening the trigger is necessary; it is not by itself sufficient.

## Evidence

| Source | What it establishes |
|---|---|
| `wiki/hot.md`, GSD Deviation Rules line 37 | The escalation rule exists and mandates documentation — "3 failed fix attempts on one task → document and move on" — but names no destination file or format. |
| [[patterns/pattern-mistake-log]], Solution + Trigger Recognition | WRITE fires on user correction signals only; `Correction` field is specified as "(user's words)". Both worked examples are quoted user corrections. |
| [[patterns/pattern-mistake-log]], tradeoffs | Claims "repeat errors decrease over time" and "requires agent discipline to log corrections in the moment" — the discipline named is about *timeliness*, not about unobserved failure classes. |
| [[concepts/agent-failure-modes]], Why It Matters | Silent refusal returns "a well-formed, 'successful' response rather than an error signal" — a failure that emits no correction signal and so cannot trigger the log. |
| [[concepts/agent-failure-modes]] frontmatter | `related:` lists `pattern-prompt-minimization`, `agent-evaluation`, `agent-loops` — no memory-layer page. The absent link is bidirectional. |
| [[patterns/pattern-mistake-log]] frontmatter | `related:` *does* list `[[concepts/agent-failure-modes]]`, so the Memory→Orchestration link exists one-way; the escalation rule in `hot.md` remains unlinked from either side. |

## Counter-arguments & Gaps

**The narrow trigger may be deliberate signal-hygiene.** A user correction is a high-precision signal that something genuinely mattered. Self-detected failures are far more numerous and much noisier — a fix loop can fail for environmental reasons (a flaky test, a network blip) that carry no transferable lesson. Widening the trigger risks the con the pattern already flags: a mistakes file that "grows large and dilutes context if not periodically reviewed/pruned." If agent-authored entries outnumber user-authored ones ten to one, session-start reads get more expensive and the high-value corrections are buried. A tiered log, or a severity field, may be required before widening — this synthesis does not resolve which.

**[[patterns/pattern-episodic-judgment-log]] may already be the correct sink.** The KB has a second append-only event store, and agent-generated events may belong there rather than in `mistakes.md`. If so, the missing link is escalation→episodic-log, and the mistake log stays deliberately human-scoped. Nothing in either page currently adjudicates the boundary between them. This is the most likely way the argument above is wrong, and it is unresolved.

**The evidence is architectural, not empirical.** Every claim here is derived from reading page contents and frontmatter. No data shows that silent refusals or abandoned fix loops actually recur in Jay's sessions, or at what rate — the failure is *possible* by construction, not *demonstrated*. Marked `[UNVERIFIED]`: the claim that unlogged failure classes measurably repeat.

**What would resolve it:** instrument one GSD run to emit escalation events to a scratch file for two weeks, then compare that file against `mistakes.md`. If the scratch file is near-empty, the gap is theoretical and the narrow trigger is correct. If it contains repeated entries for the same task shape, the gap is real and sized. That instrumentation step is the concrete next action.

## Conclusion

The connection is real and the gap is one-directional: the Memory layer knows about [[concepts/agent-failure-modes]], but the orchestration-layer escalation rule that should feed it has no named sink. The defensible near-term position is that the escalation event should be written somewhere durable and read at session start — but **whether that sink is [[patterns/pattern-mistake-log]] or [[patterns/pattern-episodic-judgment-log]] is genuinely open**, and picking wrong would either pollute the human-correction signal or fragment failure history across two stores. Resolve the sink question first, then instrument. Confidence: medium — the structural gap is well-evidenced, the recurrence claim behind its urgency is not.

## Sources

- [[patterns/pattern-mistake-log]]
- [[concepts/agent-failure-modes]]
- [[patterns/pattern-plan-execute-verify]]
- [[patterns/pattern-episodic-judgment-log]]
- [[concepts/memory-systems]]
- `wiki/hot.md` — GSD Deviation Rules (Executor)
