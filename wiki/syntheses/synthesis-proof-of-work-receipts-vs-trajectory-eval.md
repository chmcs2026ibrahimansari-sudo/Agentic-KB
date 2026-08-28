---
title: "Proof-of-Work Receipts Are Self-Reported Trajectories, and That Is Exactly Their Weakness"
type: synthesis
sources:
  - "[[patterns/pattern-agent-proof-of-work-loop]]"
  - "[[concepts/trajectory-evaluation]]"
  - "[[concepts/llm-as-judge]]"
  - "[[concepts/goal-vs-task-completion]]"
  - "[[concepts/agent-failure-modes]]"
question: "The Orchestration/Evaluation stack has two independent verification philosophies — the proof-of-work loop, where the agent produces its own receipts before claiming completion, and trajectory evaluation, where an external judge scores the agent's full execution path. Is proof-of-work a cheap substitute for trajectory eval, a pre-filter before it, or the same evidence scored by an untrusted party?"
tags: [agentic, evaluation, orchestration, observability, human-in-the-loop, receipts, trajectory, error-handling]
created: 2026-08-28
updated: 2026-08-28
reviewed: false
reviewed_date: ""
---

# Proof-of-Work Receipts Are Self-Reported Trajectories, and That Is Exactly Their Weakness

## Question

[[patterns/pattern-agent-proof-of-work-loop]] closes an agent workflow with verification, receipts, exception review, and a learning update — the agent proves its own work before declaring completion. [[concepts/trajectory-evaluation]] scores the entire sequence of agent actions from the outside, treating the decision path as a first-class evaluation target. Both claim to catch false completion. Neither page references the other, and no synthesis reconciles them. Are they the same mechanism at different price points, or does one have a blind spot the other closes?

## Argument

They collect the same evidence and differ only in who is trusted to produce it — and that difference is the whole argument. A proof-of-work receipt is a trajectory: files changed, commands run, outputs, links, exclusions, residual risks (`wiki/patterns/pattern-agent-proof-of-work-loop.md`). Trajectory evaluation consumes exactly that — "every tool call, reasoning step, and intermediate state" (`wiki/concepts/trajectory-evaluation.md`). The structural difference is provenance: the receipt is authored by the agent under evaluation; the trajectory is captured by instrumentation the agent does not control.

That provenance gap is not cosmetic, because it maps precisely onto the failure class both mechanisms exist to catch. The canonical trajectory-eval example is an agent that "hallucinates that it ran the tests (tool call to a nonexistent tool), reports success, and leaves the code in a broken state that looks syntactically correct" (`wiki/concepts/trajectory-evaluation.md`). An agent capable of hallucinating a test run is equally capable of writing a receipt saying it ran the tests. [[concepts/agent-failure-modes]] makes this worse: silent refusals "show up as a normal successful response, not an error" — a well-formed receipt is exactly what a silent refusal produces. Self-reported verification cannot detect a failure mode whose signature is a confident, correctly-formatted success claim.

So the correct relationship is not substitute-vs-rigorous. It is **cheap filter, expensive audit** — with a hard constraint the KB has not written down: proof-of-work catches *omission*, trajectory eval catches *fabrication*. The receipt reliably surfaces the failures listed on the pattern page — stale sources, ignored constraints, untested fixes — because those are cases where the agent honestly cannot fill a required field. It cannot surface the case where the agent fills the field with something untrue. That is precisely the [[concepts/goal-vs-task-completion]] gap: "summaries document intent, not verified reality." A receipt is a summary the agent wrote about itself.

This implies a routing rule the two pages should share. Route to receipts when the cost of a missed failure is a rework cycle, when the loop runs on every task, and when a human reviews exceptions anyway. Route to trajectory eval — and to [[concepts/llm-as-judge]] for the open-ended dimensions — when the receipt itself is the artifact being trusted downstream, when no human is in the exception path, or when the agent's output feeds another agent. The last condition is the sharp one: an unaudited receipt consumed by a downstream agent converts a self-report into an inherited fact, which is the "downstream agents inherit false assumptions" failure named on `wiki/concepts/goal-vs-task-completion.md`.

## Evidence

| Dimension | Proof-of-work loop | Trajectory evaluation |
|---|---|---|
| Evidence author | The agent under evaluation | External instrumentation |
| Runs | Every task, inline | Offline / sampled, on a dataset |
| Catches omission (stale source, untested fix) | Yes | Yes |
| Catches fabrication (hallucinated tool call, silent refusal) | **No** | Yes |
| Cost | "Small overhead to every workflow" (pattern page tradeoffs) | Dataset construction + judge calls |
| Failure when misapplied | "Can become bureaucratic if applied to trivial one-shot tasks" (pattern page) | Sampling gap — bad trajectories between samples ship |

Key claims:

- **Receipts are trajectory artifacts.** `pattern-agent-proof-of-work-loop` step 4: "Agent leaves receipts: files changed, commands run, outputs, links, screenshots, logs, exclusions, and residual risks." That is a trajectory record in prose form.
- **Trajectory eval exists because outcomes lie.** `concepts/trajectory-evaluation`: under outcome-only evaluation "both agents 'passed'"; only trajectory scoring flags the hallucinated tool call.
- **The shared failure taxonomy is already written.** `concepts/agent-failure-modes` is listed under Core Concepts in `wiki/mocs/evaluation.md` as "useful as eval criteria scaffold" — the same taxonomy the proof-of-work loop's exception review implicitly screens against, without saying so.
- **Both sit in the Evaluation MoC already.** `pattern-agent-proof-of-work-loop` is filed under Patterns in `wiki/mocs/evaluation.md` (category `evaluation` in its own frontmatter), alongside `concepts/trajectory-evaluation` and `concepts/llm-as-judge` under Core Concepts — co-located but never connected.

## Counter-arguments & Gaps

**The provenance distinction may be weaker than argued.** If receipts are machine-emitted (a hook writes the command log, not the agent's prose), the trust gap narrows sharply — a tool-call log emitted by the harness is external instrumentation regardless of who claims completion. `pattern-agent-proof-of-work-loop` does not specify whether receipts are agent-authored or harness-captured, and the distinction changes the verdict. This is the single highest-value thing to pin down.

**Trajectory eval is not fabrication-proof either.** [[concepts/llm-as-judge]] carries known bias and calibration problems (its own page flags rubric design, bias, and calibration as open dimensions), and a judge scoring a trace still relies on the trace being complete. If the harness does not capture a side effect, no judge sees it. "External" is a spectrum, not a guarantee.

**No measurement supports the cost claim.** The assertion that receipts are the cheap filter and trajectory eval the expensive audit is inferred from the pattern page's tradeoff list ("small overhead") and from trajectory eval's dataset requirements. The KB contains no measured overhead figure for either. `pattern-agent-proof-of-work-loop` is `confidence: medium` with two X/Twitter sources and one Obsidian note — thin ground for a routing rule. [UNVERIFIED]

**The routing rule is untested.** Nothing in the KB records a case where a receipt passed and a trajectory eval subsequently caught a fabrication in the same task. Without that, the "omission vs fabrication" split is a plausible decomposition, not an observed one.

**What would resolve it:** run one adversarial fixture — an agent instructed to claim a test run it did not perform — through both mechanisms on the same task, and record whether the receipt passed while the trajectory eval failed. That single experiment converts this synthesis from argument to evidence, and simultaneously answers whether the receipts in question are agent-authored or harness-captured.

## Conclusion

Proof-of-work receipts and trajectory evaluation are the same evidence with different authorship, and authorship is the entire safety margin. Receipts should stay as the inline default because they catch omission cheaply and produce the audit artifacts trajectory eval needs. Trajectory eval — with an LLM judge for open-ended dimensions — is required wherever a receipt is consumed without a human in the exception path, because that is the only place fabrication survives. The open question is whether the KB's receipts are agent-authored (in which case the gap is real) or harness-captured (in which case it mostly closes), and `pattern-agent-proof-of-work-loop` does not currently say.

## Sources

- [[patterns/pattern-agent-proof-of-work-loop]]
- [[concepts/trajectory-evaluation]]
- [[concepts/llm-as-judge]]
- [[concepts/goal-vs-task-completion]]
- [[concepts/agent-failure-modes]]
- [[mocs/evaluation]]
- [[syntheses/synthesis-verifier-as-goal-completion-benchmark]]
- [[syntheses/synthesis-failure-escalation-as-mistake-log-trigger]]
