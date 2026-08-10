---
title: Agent as UI, System of Record as Backend
type: pattern
category: orchestration
problem: Agent systems create duplicate plans, duplicated state, and split-brain workflows when they store work outside the tools where the organization already operates.
solution: Treat the agent as the cross-system user interface and orchestration layer while preserving GitHub, Taskmaster/Linear, docs, vaults, and databases as authoritative backends.
tradeoffs:
  - pro: Avoids duplicate sources of truth
  - pro: Lets agents improve work without replacing mature tools
  - pro: Keeps humans able to inspect and continue work directly in native systems
  - con: Requires connectors/tooling for each backend
  - con: Permissioning and audit must be enforced per backend
  - con: Some workflows need careful conflict handling
tags: [agentic, orchestration, tool-use, systems-of-record, context-management]
confidence: medium
sources:
  - raw/framework-docs/sierra-ai-blog-ai-pilling-our-company-lessons-learned.md
  - [[summaries/sierra-ai-blog-ai-pilling-our-company-lessons-learned]]
created: 2026-07-10
updated: 2026-08-10
---

# Pattern: Agent as UI, System of Record as Backend

## Problem

Agents often produce useful work in the wrong place: chat. The result is a second, weaker source of truth that competes with the mature system where the work actually belongs.

Examples:

- A coding agent describes changes instead of opening a PR/diff.
- A planning agent creates a side-channel task list instead of updating Taskmaster/Linear.
- A research agent summarizes sources without preserving raw source text.
- A meeting agent writes takeaways but does not update the decision log or follow-up tasks.

This splits the organization: some people operate through the agent, others operate in the original tools, and state diverges.

## Solution

Use the agent as the **UI/orchestration surface** and the mature system as the **backend/source of truth**.

```text
human request
  → agent interprets/routes
  → backend systems provide context
  → agent writes finished artifact back to source of truth
  → verification proves the backend changed correctly
```

## Backend Mapping

| Work type | System of record | Agent artifact |
|---|---|---|
| Code | GitHub/git repo | branch, diff, PR, tests |
| Tasks | Taskmaster/Linear/Kanban | task update, status, dependency |
| Durable knowledge | Agentic-KB/wiki | raw capture, summary, pattern, synthesis |
| Preferences/environment | Hermes memory | compact declarative memory |
| Automation | Hermes cron/config | job update, script, audit report |
| Product docs | repo docs / vault page | markdown doc with links |
| External comms | email/chat/docs | draft, not sent without approval |

## Implementation Sketch

For every agent workflow, require:

```yaml
source_of_truth: where final state must live
read_context_from: exact backend/tool/file set
write_artifact_to: exact backend/tool/file path
verify_with: command, readback, status check, link, screenshot, or diff
chat_summary: only receipt and next action
```

## When To Use

Use when:

- work must be inspectable later;
- multiple humans/agents may continue the task;
- the artifact has operational or business value;
- the native system already has permissions, history, review, or audit.

## When NOT To Use

Avoid over-building when:

- the task is purely exploratory;
- the user explicitly asked for a throwaway brainstorm;
- no system of record exists yet and the right one is unclear.

## Real Examples

- Agentic-KB Scout writes source captures under `raw/` and state under `.night-shift/state/`, not just a chat summary.
- Hermes skill updates land in `~/.hermes/skills/`, then `skill_view` verifies the behavior changed.
- SellerFi repo work should land as code/docs/tests in the repo, with chat only reporting changed files and verification.
- Sierra's Pinecone writeup states the agent should update the deck, PR, account, issue, or other artifact where the work belongs instead of creating a parallel chat-only output ([[summaries/sierra-ai-blog-ai-pilling-our-company-lessons-learned]]).

## Related Patterns

- [[syntheses/synthesis-agentic-engineering-operating-model]]
- [[patterns/pattern-agent-proof-of-work-loop]]
- [[patterns/pattern-compounding-loop]]
- [[patterns/pattern-shared-agent-workspace]]
- [[concepts/tool-use]]
