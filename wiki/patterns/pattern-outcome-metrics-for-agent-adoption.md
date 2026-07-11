---
title: Outcome Metrics for Agent Adoption
type: pattern
category: evaluation
problem: Agent programs optimize for easy activity metrics like sessions, tool calls, tokens, or PR count without proving that work got faster, better, safer, or less burdensome.
solution: Use activity metrics only as adoption telemetry; evaluate agent systems by artifact quality, cycle-time movement, review burden, defect rate, handoff reduction, and business/user outcome changes.
tradeoffs:
  - pro: Prevents AI adoption theater
  - pro: Aligns agents to business and operator value
  - pro: Separates habit formation from real impact
  - con: Outcome metrics are harder to instrument
  - con: Causal attribution can be messy
  - con: Some early-stage workflows need temporary activity proxies
tags: [agentic, evaluation, observability, metrics, adoption]
confidence: medium
sources:
  - raw/framework-docs/sierra-ai-blog-ai-pilling-our-company-lessons-learned.md
  - raw/framework-docs/www-linkedin-com-jobs-view-4438558062.md
created: 2026-07-10
updated: 2026-07-10
---

# Pattern: Outcome Metrics for Agent Adoption

## Problem

Agent adoption is easy to fake with activity metrics:

- number of sessions;
- tool calls;
- tokens consumed;
- PRs opened;
- automations triggered;
- “AI-assisted” labels.

These prove people touched the system. They do not prove the system improved work.

A team can increase agent usage while cycle time, defects, review debt, customer outcomes, or operator burden stay flat.

## Solution

Track a two-layer metric model:

1. **Adoption telemetry** — are people forming the habit?
2. **Outcome metrics** — did the work improve?

Do not confuse the two.

## Metric Ladder

| Level | Metric type | Examples | Use |
|---|---|---|---|
| 1 | Exposure | enabled users, available workflows | rollout coverage |
| 2 | Activity | sessions, tool calls, tokens, generated drafts | habit formation |
| 3 | Artifact | PRs merged, KB pages created, tasks closed, reports shipped | concrete output |
| 4 | Quality | defect rate, review comments, citation accuracy, eval score | trust and correctness |
| 5 | Flow | lead time, cycle time, handoffs removed, unblock time | operational leverage |
| 6 | Outcome | deal closed faster, customer issue resolved, user time saved | actual value |

## Implementation Sketch

For each agent workflow define:

```yaml
workflow: name
activity_signal: what shows usage
artifact_signal: what object should exist
quality_signal: how correctness is checked
flow_signal: what got faster/easier
outcome_signal: what user/business result changed
review_cadence: weekly | monthly | per release
```

Example:

```yaml
workflow: Agentic-KB Scout
activity_signal: scout run count
artifact_signal: raw source captures + state entries
quality_signal: source URL preserved, word count, no overwrite, no orphaned state
flow_signal: fewer manual source-preservation steps
outcome_signal: new durable patterns available to Hermes/repo work
```

## When To Use

Use when:

- agents are recurring infrastructure;
- leadership/stakeholders may ask “is this working?”;
- usage is growing but value is unclear;
- AI work risks becoming theater.

## When NOT To Use

For a brand-new pilot, activity metrics may be acceptable for a short habit-formation phase. But define the outcome metric before declaring the pilot successful.

## Real Examples

- Hermes weekly Notes review should not be judged by number of notes read. Judge it by safe setup improvements, KB/source updates, reduced repeated context setup, and fewer missed actionable signals.
- SellerFi agent workflows should not be judged by generated text volume. Judge them by qualification speed, transaction readiness, defect reduction, and real deal progress.
- Coding agents should not be judged by PR count alone. Judge cycle time, escaped defects, review churn, and merged artifact quality.

## Related Patterns

- [[syntheses/synthesis-agentic-engineering-operating-model]]
- [[patterns/pattern-agent-proof-of-work-loop]]
- [[concepts/trajectory-evaluation]]
- [[concepts/llm-as-judge]]
- [[mocs/evaluation]]
