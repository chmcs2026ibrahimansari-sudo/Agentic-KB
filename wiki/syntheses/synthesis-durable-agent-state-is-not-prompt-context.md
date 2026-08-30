---
title: "Durable Agent State Is Not Prompt Context"
type: synthesis
sources:
  - "[[summaries/anthropic-com-engineering-managed-agents]]"
  - "[[summaries/handbook-vinodspattar-in-learn-modules-07-langgraph]]"
  - "[[summaries/disler-super-simple-software-factory]]"
  - "[[summaries/langchain-ai-open-swe]]"
  - "[[summaries/dev-to-himanshuai-playwright-ai-agent-the-complete-engineering-guide-to-autonomous-browser-automatio]]"
question: "Recent managed-agent, LangGraph, software-factory, Open SWE, and browser-agent sources all persist different run artifacts. What is the common architecture rule, and why is prompt context the wrong place to store agent state?"
tags: [agentic, orchestration, state-management, context-management, observability, human-in-the-loop, evaluation]
created: 2026-08-30
updated: 2026-08-30
reviewed: false
reviewed_date: ""
---

# Durable Agent State Is Not Prompt Context

## Question

Recent sources landed from five different directions: Anthropic managed agents, LangGraph checkpointing, Disler's software-factory repo, LangChain Open SWE, and a Playwright browser-agent guide. They do not share a product surface. They do share a runtime lesson: useful agent systems persist state somewhere other than the model prompt. What is the common architecture rule, and why does it matter?

## Argument

The common rule is simple: **the prompt is a working set, not the system of record.** Long-running agents need durable state that can be replayed, sliced, audited, resumed, evaluated, and handed to a replacement harness. Prompt context can contain a selected view of that state, but it cannot be the place where the state lives.

[[summaries/anthropic-com-engineering-managed-agents]] states the rule most directly. Anthropic splits the agent runtime into **session**, **harness**, and **sandbox**. The session is an append-only event log outside the harness; the harness can wake from that log, fetch positional slices, rewind around events, and continue after harness or sandbox failure. Crucially, the source says the session is **not** the model context window. That is the architecture boundary this KB should preserve: compaction and prompt organization are harness concerns layered over durable events, not substitutes for durable events.

[[summaries/handbook-vinodspattar-in-learn-modules-07-langgraph]] reaches the same boundary from a framework angle. LangGraph is not justified by graph syntax alone; it earns its complexity when checkpointing, crash recovery, and human approval matter. Persisting state after each node means "resume after crash" and "pause before sensitive action" use the same mechanism. That is the durable-state version of human-in-the-loop: the human gate sits on a saved state transition, not on a transcript fragment the model might summarize differently on retry.

[[summaries/disler-super-simple-software-factory]] gives the implementation discipline: deterministic code owns sequencing, retries, gates, and trace capture; agents work inside bounded phases and pass typed JSON envelopes across seams. This is what prevents prompt context from becoming an untyped junk drawer. A phase output becomes a typed artifact with validation and a trace row, not a sentence the next agent is expected to remember correctly.

[[summaries/langchain-ai-open-swe]] shows why this matters operationally. Open SWE is designed for asynchronous coding work launched from Slack, Linear, GitHub, or a dashboard, running in isolated sandboxes and returning via PR/comment surfaces. That operating mode cannot depend on one chat context staying alive. It needs task state, repo context, credentials, sandbox state, user mappings, and observability data to survive outside the prompt and outside any one sandbox.

[[summaries/dev-to-himanshuai-playwright-ai-agent-the-complete-engineering-guide-to-autonomous-browser-automatio]] adds the evaluation-side version: browser agents need bounded loops, structured observations, self-healing logs, and deterministic final-state assertions. If a browser agent "heals" around a selector failure but only the final prompt state remembers that fact, the system has hidden a product regression. The heal must be a first-class event that later evaluation can count.

## Evidence

| Source | Durable artifact | Why prompt context is insufficient |
|---|---|---|
| [[summaries/anthropic-com-engineering-managed-agents]] | Append-only session event log outside harness and sandbox | A replacement harness must replay/slice/recover from events after failures; prompt context is only a selected view |
| [[summaries/handbook-vinodspattar-in-learn-modules-07-langgraph]] | Checkpointed state graph keyed by thread/run | Crash recovery and human approval need a saved transition, not a regenerated summary |
| [[summaries/disler-super-simple-software-factory]] | Typed envelopes, gate results, SQLite trace | Phase seams need parseable artifacts and deterministic gates, not implicit transcript carryover |
| [[summaries/langchain-ai-open-swe]] | Async task/runtime state across Slack/Linear/GitHub/dashboard and sandbox providers | Work may outlive one chat, one sandbox, one trigger surface, or one operator session |
| [[summaries/dev-to-himanshuai-playwright-ai-agent-the-complete-engineering-guide-to-autonomous-browser-automatio]] | Structured action/observation logs and deterministic final assertions | Self-reported success and hidden self-heals cannot be evaluated or debugged later |

## Design Rule

For governed agent systems, split runtime information into three layers:

1. **Durable source events** — event log, checkpoints, trace rows, typed envelopes, gate results, approvals, and observations. This is the audit/replay/eval substrate.
2. **Task working set** — the selected slice of durable state plus current instructions that the harness loads into the model for this step.
3. **Ephemeral model context** — the current prompt/completion window. It can reason over state, but it must not be the only holder of state.

The dangerous shortcut is calling a good compaction strategy a state strategy. It is not. Compression can make a working set affordable; it does not make it authoritative. This is the same principle [[syntheses/synthesis-agentic-engineering-operating-model]] already states for systems of record, now applied inside the agent runtime itself.

## Counter-arguments & Gaps

**Small agents may not need this.** A one-shot script or disposable research prompt does not need a session log, checkpoint database, sandbox lifecycle, or trace UI. [[summaries/handbook-vinodspattar-in-learn-modules-07-langgraph]] explicitly says a hand-rolled loop is fine when persistence, resumability, and HITL pauses are not first-order.

**Durable state can become bloat.** Saving every DOM snapshot, every full prompt, or every file tree can make the trace too expensive to use. The LangGraph source warns that checkpoint cost scales with state size and recommends lean state with references/IDs. The rule is not "persist everything"; it is "persist the authoritative event and enough references to replay or inspect it."

**Some source claims are still vendor/practitioner claims.** Anthropic and Open SWE are primary sources for their own architectures, but no scheduled run locally validated their runtime behavior. The Playwright guide is practitioner advice, not a benchmark. This synthesis is high confidence as an architecture pattern, not as proof that any named implementation meets its claims in Jay's stack.

**Where the state lives is still an implementation decision.** The sources variously point to append-only event logs, checkpointers, SQLite, Postgres/Redis, dashboard state, and structured logs. The KB has not chosen a canonical storage substrate for MissionControl/Hermes. That choice should be driven by replay/debug needs, not by which framework is fashionable.

## Conclusion

The current multi-source thread is strong enough to promote as a synthesis: managed agents, state graphs, software factories, coding-agent frameworks, and browser agents are all converging on the same separation. Durable agent state belongs in event logs, checkpoints, envelopes, traces, and system-of-record backends. Prompt context is a lossy working view over that state. For MissionControl/Hermes, the next architecture question is not "how do we fit more context?" It is: **what is the durable event model every harness can replay, audit, and evaluate?**

## Sources

- [[summaries/anthropic-com-engineering-managed-agents]] — raw source: `raw/framework-docs/anthropic-com-engineering-managed-agents.md`
- [[summaries/handbook-vinodspattar-in-learn-modules-07-langgraph]] — raw source: `raw/framework-docs/handbook-vinodspattar-in-learn-modules-07-langgraph.md`
- [[summaries/disler-super-simple-software-factory]] — raw source: `raw/framework-docs/disler-super-simple-software-factory.md`
- [[summaries/langchain-ai-open-swe]] — raw source: `raw/framework-docs/langchain-ai-open-swe.md`
- [[summaries/dev-to-himanshuai-playwright-ai-agent-the-complete-engineering-guide-to-autonomous-browser-automatio]] — raw source: `raw/framework-docs/dev-to-himanshuai-playwright-ai-agent-the-complete-engineering-guide-to-autonomous-browser-automatio.md`
- [[syntheses/synthesis-agentic-engineering-operating-model]]
