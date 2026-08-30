---
id: 01M0GY6XSZRN0GSZYGM69QT8B0
title: "Super Simple Software Factory"
type: framework
tags: [agents, orchestration, workflow, architecture, automation]
created: 2026-08-18
updated: 2026-08-18
visibility: public
source: https://github.com/disler/super-simple-software-factory
---

# Super Simple Software Factory

An open-source (MIT) skill by disler that packages a repeatable "agents-plus-code" workflow which can be stamped into any repo. It is built around a strict division of labor: deterministic Python owns the control graph (sequencing, retries, acceptance), while coding agents act as bounded nodes that do work inside named phases. 697 stars, 165 forks at time of capture.

## What It Does

The factory replaces a single freeform agent loop with an explicit **ADW script** (AI Developer Workflow) written in Python. The ADW:

- Sequences phases (e.g. engineer, planner, builder, reviewer)
- Handles retries without discarding agent progress (a correction is cheaper than a restart because the session stays alive)
- Defines and checks acceptance criteria ("gates") rather than relying on the agent declaring itself done
- Streams every event into a SQLite trace database live, giving an inspectable, replayable record instead of a transcript to read "like a novel"

Context crosses phase boundaries only via **typed JSON envelopes**, never via implicit shared state or prompt history bleed.

> **"Agent proposes, code disposes."**

> **"The fix is not a better prompt. The fix is deciding, deliberately, that code owns sequencing, retries, and acceptance, and the agent owns only the work inside one bounded phase."**

## Key Concepts

- **Phases** — the unit of the trace; each phase is a bounded scope of agent work
- **Envelopes** — typed JSON, the only mechanism for passing context across a phase seam
- **Gates** — code-checked acceptance criteria that define "done," replacing the agent's self-report
- **Trace DB** — a SQLite store that every event streams into as it happens, enabling live UI polling and post-hoc debugging

This is a concrete implementation of the broader pattern described in [pattern: code owns the control plane](../patterns/pattern-code-owns-control-plane.md).

## When to Use It

- You need the same multi-step coding workflow (plan → build → test → review → document) to produce consistent results run after run
- You want to debug failures by phase rather than by re-reading an entire agent transcript
- You're building or evaluating something like an [[gsd-executor]]-style pipeline and want a lighter-weight reference implementation of phase-bounded agents

## Limitations

- Documented as "the skill alone" on the main branch — a working example with real traces lives on a separate `example` branch, so the core repo alone doesn't demonstrate a full run
- Assumes you're willing to invest in explicit Python control code rather than relying purely on prompting; the README is explicit that leverage scales with this investment ("chain two agents together and hope" at the low end vs. a full agent-plus-code system at the high end)
- Not evaluated here against other orchestration frameworks (e.g. [[framework-crewai]], [[framework-autogen]]) — no direct comparison data captured

## See Also
- [Refinery summary: Disler — Super Simple Software Factory](../summaries/disler-super-simple-software-factory.md)
- [pattern: code owns the control plane](../patterns/pattern-code-owns-control-plane.md)
- [agents/workers/gsd-executor/profile.md](../agents/workers/gsd-executor/profile.md)
- [concepts/agent-loops.md](../concepts/agent-loops.md)
