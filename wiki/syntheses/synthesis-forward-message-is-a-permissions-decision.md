---
title: "`forward_message` Is a Permissions Decision Wearing an Orchestration Costume"
type: synthesis
sources:
  - "[[patterns/pattern-supervisor-worker]]"
  - "[[patterns/pattern-minimal-permissions]]"
  - "[[concepts/tool-design]]"
  - "[[syntheses/synthesis-telephone-game-per-claim-confidence]]"
  - "[[mocs/tool-use]]"
question: "The Telephone Game fix is a tool that lets a worker's raw output bypass supervisor synthesis. The Orchestration MoC treats it as a fidelity fix. Why has the Tool Use MoC never scored it as a permissions change?"
tags: [orchestration, tool-use, safety, multi-agent, agentic, permissions]
created: 2026-08-30
updated: 2026-08-30
reviewed: false
reviewed_date: ""
---

# `forward_message` Is a Permissions Decision Wearing an Orchestration Costume

## Question

[[patterns/pattern-supervisor-worker]] answers the Telephone Game Problem — supervisors silently degrading worker output through paraphrase — with a `forward_message` tool that returns a worker's response to the caller without synthesis. The Orchestration MoC scores this as a fidelity fix, and [[syntheses/synthesis-telephone-game-per-claim-confidence]] extends the argument into the Memory MoC. Neither treats the obvious third fact: `forward_message` widens what a sub-agent can put in front of a user. Why has the Tool Use MoC never scored it as a permissions change?

## Argument

`forward_message` does not add a capability to the supervisor. It removes one from the supervisor's control path, and that is a permissions edit even though it is authored as an orchestration fix. In the default supervisor-worker topology, the supervisor's synthesis step is load-bearing twice over: it compresses, and it is the only place a worker's raw output is read by something with wider context before it reaches the caller. Deleting the hop to fix the first function silently deletes the second. Whatever review, redaction, or sanity-check the supervisor was performing — implicitly, as a side effect of having to read the text in order to paraphrase it — stops happening.

[[patterns/pattern-minimal-permissions]] already names this exact risk in general terms and then does not follow it here. Its own Problem section warns that in multi-agent systems "if Agent A with broad permissions delegates to Agent B, Agent B inherits the same blast radius even if it only needs read access." `forward_message` is the reciprocal case, and the sharper one: Agent B inherits Agent A's *output channel* rather than its tool set. Blast radius, as that page defines it, is the set of all possible effects of all available tools. A tool whose effect is "place unreviewed sub-agent text in front of the principal" belongs in that set. It is currently in nobody's set, because the Orchestration MoC classified it by the problem it solves rather than by what it can do.

[[concepts/tool-design]] supplies the frame that makes this legible. Its central claim is that a tool definition is a contract between a deterministic system and a non-deterministic agent, and that the contract must be unambiguous about *when* the tool applies. `forward_message` fails that test in a specific and predictable way. Its trigger condition — "use this when the worker's answer is final and synthesis would only degrade it" — requires the supervisor to judge, before synthesizing, that synthesis is unnecessary. That is a judgment about content the supervisor has not yet processed. The tool is therefore most likely to be invoked exactly where the supervisor is least calibrated, which is the failure profile [[concepts/tool-design]] predicts for any tool whose selection criterion depends on information the caller does not have at selection time.

The correction is not to remove the tool. It is to stop filing it under orchestration alone. A `forward_message`-class tool should be scoped like any other privileged tool: enumerated in the task's tool set rather than always-on, restricted to worker classes whose output is already trusted or already instrumented, and paired with a visible marker in the forwarded payload so the principal can see that no supervisor read it. That last item is the cheap one and the one the KB is already equipped to build — [[syntheses/synthesis-telephone-game-per-claim-confidence]] argues for instrumenting the lossy channel rather than deleting it, and a "forwarded unreviewed" flag is the permissions-layer instance of the same move.

## Evidence

| Page | Claim it supplies | What it stops short of |
|---|---|---|
| [[patterns/pattern-supervisor-worker]] | `forward_message` bypasses supervisor synthesis to preserve worker fidelity | Never scores the bypass as a change in who reviews output |
| [[patterns/pattern-minimal-permissions]] | Blast radius = union of effects of all available tools; delegation propagates blast radius | Treats delegation as inherited *tool sets*, not inherited *output channels* |
| [[concepts/tool-design]] | Tool contracts must be unambiguous about when the tool applies; ambiguity becomes a failure mode | Does not evaluate any orchestration-layer tool against its own criteria |
| [[syntheses/synthesis-telephone-game-per-claim-confidence]] | Instrumenting a lossy channel generalizes; bypassing it does not | Argues the case at the Memory layer only; no permissions treatment |

The three MoC-level pages agree on the underlying principle — least privilege, explicit tool scoping, unambiguous invocation contracts — and none of them has been applied to the one tool in the KB that is explicitly designed to skip a review step.

## Counter-arguments & Gaps

**The supervisor is not a reviewer, so nothing is lost.** The strongest objection is that treating supervisor synthesis as a safety control is retrofitting. Nothing in [[patterns/pattern-supervisor-worker]] claims the supervisor validates or redacts; it summarizes. If the supervisor never inspected worker output for anything but compressibility, then `forward_message` removes a compression step and no review, and this synthesis has invented a control in order to argue about its removal. This objection is not resolved here. Resolving it requires evidence about what supervisors in real deployments actually catch during synthesis — a measurement nobody in this KB has taken.

**Scoping the tool may cost more than the failure it prevents.** [[patterns/pattern-minimal-permissions]] lists "friction for trusted agents" as an explicit tradeoff of its own pattern. If `forward_message` is invoked on the majority of worker returns, per-task scoping becomes ceremony, and the KB has no data on invocation frequency.

**No incident evidence.** The argument is derived from first principles and from the internal logic of three existing pages. There is no logged case in `raw/` of a `forward_message`-style bypass surfacing content a supervisor would have caught. The claim that the bypass carries real permission risk is therefore `[UNVERIFIED]` in the strict sense — coherent, and untested.

**What would change the verdict.** A trace study of supervisor-worker runs measuring (a) how often supervisors materially alter worker output beyond compression, and (b) whether any of those alterations are redactions or corrections rather than restatements. If (b) is near zero, `forward_message` is correctly filed as an orchestration concern and this page should be downgraded to a note on [[patterns/pattern-supervisor-worker]].

## Conclusion

`forward_message` should be cross-filed into the Tool Use MoC and evaluated against [[patterns/pattern-minimal-permissions]] and [[concepts/tool-design]], not because the bypass is known to be dangerous but because it is currently unscored by the only pages equipped to score it. The concrete, low-cost action is a provenance marker on forwarded payloads indicating no supervisor read them; the open question — whether supervisor synthesis performs any review function worth preserving — is empirical and unanswered.

## Sources

- [[patterns/pattern-supervisor-worker]]
- [[patterns/pattern-minimal-permissions]]
- [[concepts/tool-design]]
- [[syntheses/synthesis-telephone-game-per-claim-confidence]]
- [[mocs/tool-use]]
- [[mocs/orchestration]]
