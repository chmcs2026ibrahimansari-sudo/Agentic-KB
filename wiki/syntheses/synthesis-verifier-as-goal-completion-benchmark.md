---
title: "The Plan-Execute-Verify Verifier Is a Runtime Implementation of Goal-vs-Task Completion"
type: synthesis
sources:
  - "[[patterns/pattern-plan-execute-verify]]"
  - "[[concepts/goal-vs-task-completion]]"
  - "[[patterns/pattern-goal-backward-planning]]"
  - "[[concepts/goal-backward-verification]]"
  - "[[concepts/agent-failure-modes]]"
question: "Is the Plan-Execute-Verify verifier role the runtime implementation of the goal-vs-task-completion distinction, and can it therefore be turned into a reusable benchmark-design template?"
tags: [orchestration, evaluation, agentic, verification, benchmark-design, goal-vs-task-completion]
created: 2026-08-22
updated: 2026-08-22
reviewed: false
reviewed_date: ""
---

# The PEV Verifier Is a Runtime Implementation of Goal-vs-Task Completion

The verifier in [[patterns/pattern-plan-execute-verify]] and the concept in [[concepts/goal-vs-task-completion]] are the same idea expressed at two different layers, and neither page says so. The orchestration side owns a working mechanism with no eval vocabulary; the evaluation side owns the vocabulary with no reference implementation. Connecting them converts the verifier's acceptance-criteria loop into a reusable benchmark-design template.

## Question

Is the Plan-Execute-Verify verifier role the runtime implementation of the goal-vs-task-completion distinction, and can it therefore be turned into a reusable benchmark-design template?

## Argument

The PEV verifier is defined by one instruction: *"Do not assume the execution report is accurate — verify independently."* Its system prompt gives it read-only tools and forbids implementation. It reads files rather than trusting the executor's report, and runs tests rather than trusting the executor's test output. That is precisely the antidote [[concepts/goal-vs-task-completion]] prescribes when it warns against **trusting SUMMARY.md** — "summaries describe intent, not verified state." The GSD verifier's own framing, quoted on the concept page, is the identical sentence written from the eval side: *"Task completion ≠ Goal achievement."*

The mapping is structural, not merely rhetorical. Goal-backward verification decomposes into three levels — Truth, Existence, Wiring — and each maps cleanly onto a field the PEV plan schema already emits. `AgentPlan.goal` is the Truth level: the one-sentence outcome that must hold. `PlanStep.expected_output` and `PlanStep.target` are the Existence level: the concrete artifacts the executor must produce. `AgentPlan.acceptance_criteria` and `constraints` are where Wiring lives — the connections that must be live for the artifacts to function. The plan is therefore already a machine-readable goal-backward verification spec; the KB just never labeled it as one.

That labeling matters because it makes benchmarking cheap. Trajectory-eval work in the KB ([[syntheses/synthesis-deepeval-metrics-as-trajectory-vocabulary]], [[syntheses/synthesis-react-as-native-trajectory-eval]]) argues that ReAct is uniquely evaluable because its production loop *is* the eval trace, and treats Plan-Execute-Verify as the awkward case whose reasoning is scattered across three processes. That judgment is right about *trajectory* eval and wrong about *outcome* eval. PEV emits something ReAct does not: a pre-declared, structured statement of what success means, written before execution and by a different agent than the one who executes. Pre-declared acceptance criteria are exactly what a benchmark is. PEV is trajectory-hostile and benchmark-native; ReAct is the reverse.

The practical consequence is a template: harvest `acceptance_criteria` from historical plans, classify each as Truth / Existence / Wiring, and score executor runs against them. Criteria that pass at Existence but fail at Truth or Wiring are the "stub file" failure the concept page names, and they are the highest-signal benchmark items because they are precisely the cases task-completion metrics score as successes.

## Evidence

| Source | Claim | Relevance |
|---|---|---|
| [[patterns/pattern-plan-execute-verify]] | Verifier receives read-only tools and NO write tools; "assume the executor may have missed something" | The role is structurally defined as an independent outcome check, not a task-closure check |
| [[patterns/pattern-plan-execute-verify]] | `AgentPlan` carries `goal`, `acceptance_criteria`, `constraints`; `PlanStep` carries `expected_output` | Pre-declared success definition — the raw material of a benchmark |
| [[concepts/goal-vs-task-completion]] | "A task `create chat component` can be marked complete when the component is a placeholder" | Names the exact failure the verifier's independent read is designed to catch |
| [[concepts/goal-vs-task-completion]] | Truth / Existence / Wiring verification table | A three-level scoring rubric that maps onto PEV plan fields |
| [[syntheses/synthesis-react-as-native-trajectory-eval]] | PEV "executes the plan as discrete subprocesses... reconstructing the per-step trace requires correlating timestamps" | Establishes PEV's trajectory-eval weakness — the gap this synthesis argues is offset by outcome-eval strength |
| [[syntheses/synthesis-eval-metrics-to-failure-modes]] | DeepEval metrics operationalize the agent-failure-modes taxonomy | Prior art for the same move (concept taxonomy → measurable gate); this synthesis applies it to a different pair |

## Counter-arguments & Gaps

**The verifier is not calibrated, so it is not yet a benchmark.** [[patterns/pattern-plan-execute-verify]] lists "verifier can be wrong too" as an explicit tradeoff. A benchmark whose scorer is an uncalibrated LLM inherits every [[concepts/llm-as-judge]] failure mode. Nothing in the KB measures PEV verifier agreement against human judgment, so the claim that its criteria make good benchmark items is [UNVERIFIED] — it rests on the *shape* of the artifact, not on demonstrated scoring reliability.

**Acceptance criteria are written by a planner that has never seen the codebase.** Goal-backward verification assumes the goal is correctly decomposed. A planner that mis-states the Truth level produces a plan whose criteria are internally consistent and externally wrong, and the verifier will happily pass it. This is a failure mode neither page addresses, and it is the strongest argument that PEV criteria should be *seeds* for benchmark items reviewed by a human, not benchmark items themselves.

**Harvesting criteria requires plan persistence nobody has confirmed.** The template assumes historical `AgentPlan` objects are retained and queryable. The KB has no page establishing that GSD or any other PEV implementation durably stores plans in a form suitable for retrospective harvesting. If plans are ephemeral, the whole template collapses to "write benchmarks by hand."

**Selection bias in the resulting benchmark.** Criteria harvested from real plans over-represent tasks the team already knew how to specify. The failure modes worth benchmarking most — the ones in [[concepts/agent-failure-modes]] that arise from unanticipated situations — are by construction absent from plans, because a plan that anticipated them would have prevented them.

**What would change the verdict:** a run of ≥30 historical PEV verifications scored independently by a human, reporting verifier/human agreement per Truth-Existence-Wiring level. Agreement above ~0.8 at the Existence level and materially lower at Truth/Wiring would confirm the core claim (the verifier detects the distinction but scores it unevenly). Uniform agreement would suggest the three-level decomposition adds nothing and page-level pass/fail is sufficient.

## Conclusion

The verifier role and the goal-vs-task-completion concept describe one mechanism from two sides, and the PEV plan schema is already a goal-backward verification spec in machine-readable form. The reusable move is to treat `acceptance_criteria` as candidate benchmark items classified by Truth / Existence / Wiring, with the Existence-passes-but-Truth-fails cases as the highest-signal set. This is not yet actionable as an automated gate: the verifier's own calibration is unmeasured, and plan persistence is unconfirmed. The open question for the next round is narrow and answerable — do any of Jay's PEV-shaped pipelines durably persist their plans, and if so, what is verifier/human agreement on a sample of them?

## Sources

- [[patterns/pattern-plan-execute-verify]]
- [[concepts/goal-vs-task-completion]]
- [[patterns/pattern-goal-backward-planning]]
- [[concepts/goal-backward-verification]]
- [[concepts/agent-failure-modes]]
- [[concepts/llm-as-judge]]
- [[syntheses/synthesis-react-as-native-trajectory-eval]]
- [[syntheses/synthesis-deepeval-metrics-as-trajectory-vocabulary]]
- [[syntheses/synthesis-eval-metrics-to-failure-modes]]
- [[wiki/mocs/orchestration]]
- [[wiki/mocs/evaluation]]
