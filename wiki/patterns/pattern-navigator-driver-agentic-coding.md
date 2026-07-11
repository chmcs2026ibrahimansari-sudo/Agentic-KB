---
title: Navigator-Driver Agentic Coding
type: pattern
category: orchestration
problem: Developers use agents as autocomplete or isolated chat assistants, leaving the human to still perform coordination, review, and artifact assembly.
solution: Make the human/orchestrator the navigator who sets direction, constraints, and acceptance criteria while one or more agents act as drivers that materialize reviewable code/doc artifacts.
tradeoffs:
  - pro: Lets one operator steer multiple isolated work lanes
  - pro: Keeps human judgment focused on direction and review
  - pro: Produces concrete artifacts instead of conversational summaries
  - con: Requires strong artifact specs and verification gates
  - con: Parallel lanes can create merge/conflict overhead
  - con: Weak context packets produce low-quality driver output
tags: [agentic, orchestration, multi-agent, coding, human-in-the-loop]
confidence: medium
sources:
  - raw/framework-docs/www-linkedin-com-posts-linasbeliunas-these-are-2-senior-staff-engineers-at-airbnb-ugcpost-.md
  - raw/framework-docs/sierra-ai-blog-ai-pilling-our-company-lessons-learned.md
created: 2026-07-10
updated: 2026-07-10
---

# Pattern: Navigator-Driver Agentic Coding

## Problem

Most agentic coding adoption stalls because teams treat the model as a better typing tool. The human still decomposes work, switches context, assembles outputs, checks correctness, and tracks what changed.

That leaves the hard work with the human and gives the agent the easy part.

## Solution

Move the human/operator into a **navigator** role and agents into **driver** roles.

The navigator owns:

- target outcome;
- decomposition;
- constraints;
- acceptance criteria;
- risk boundaries;
- review decisions;
- final synthesis.

The driver agent owns:

- isolated implementation lane;
- code/doc changes;
- tests/checks;
- receipts;
- exception report.

```text
Navigator: “Implement this slice. Touch only these files. Verify with this command. Return diff + risks.”
Driver: creates artifact, runs checks, returns receipts.
Navigator: reviews, merges, dispatches next slice.
```

## Implementation Sketch

Use this dispatch packet:

```yaml
goal: exact outcome
system_of_record: GitHub | Taskmaster | Agentic-KB | docs | cron
files_or_scope: allowed paths
constraints: what not to touch
acceptance_checks: commands, content checks, UI checks, or human criteria
artifact_required: diff | PR | markdown page | task update | audit report
risk_boundary: when to stop and ask
receipt_required:
  - changed files
  - commands run
  - output paths
  - failures/skips
```

For parallel work, run each driver in an isolated worktree/lane and require a merge/reconciliation step.

## Tradeoffs

| Upside | Cost |
|---|---|
| One operator can steer multiple work lanes | Needs clearer task specs |
| Human attention shifts to judgment and review | Poor specs cause wasted agent work |
| Agents produce concrete artifacts | Merge conflicts can increase |
| Verification becomes explicit | Not worth it for trivial edits |

## When To Use

Use when:

- a task can produce a concrete artifact;
- scope can be isolated by files, subsystem, or stage;
- review criteria are knowable before dispatch;
- parallelism or context isolation helps;
- the human should not be typing every line.

## When NOT To Use

Avoid when:

- the task is mostly strategic ambiguity;
- the artifact cannot be specified;
- the repo/system state is unknown;
- the cost of verifying agent output exceeds the task value.

## Real Examples

- Hermes as orchestrator dispatching repo changes to Turing/Codex lanes while preserving final review authority.
- Agentic-KB Scout/Refinery/Editor jobs: each lane produces raw captures, summaries, syntheses, or briefings with receipts.
- SellerFi implementation tasks where one driver updates backend logic while another updates docs/tests, then Hermes reconciles.

## Related Patterns

- [[syntheses/synthesis-agentic-engineering-operating-model]]
- [[patterns/pattern-agent-proof-of-work-loop]]
- [[patterns/pattern-shared-agent-workspace]]
- [[concepts/multi-agent-systems]]
- [[mocs/orchestration]]
