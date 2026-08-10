---
title: Embedded Graduation Model
type: pattern
category: deployment
problem: Central expert teams either stay too far from product teams to change behavior or embed permanently and become an unscalable dependency.
solution: Embed deeply for a bounded engagement, build team capability, graduate the team to independence, then convert repeated pain points into centralized tooling.
tradeoffs:
  - pro: Transfers capability instead of creating permanent service dependency
  - pro: Gives central experts real field evidence before building platform tools
  - pro: Creates a flywheel from embedded learnings to reusable automation
  - con: Requires months, not weeks, for durable behavior change
  - con: Fails when partner teams do not allocate time or lean in
  - con: Graduation criteria must be capability-based, not checklist theater
tags: [agentic, deployment, observability, reliability, operating-model, human-in-the-loop]
confidence: medium
sources:
  - [[summaries/www-linkedin-com-pulse-copy-netflix-ntech-sre-purpose-built-approach-reliability-scale-ozc]]
created: 2026-08-10
updated: 2026-08-10
---

# Pattern: Embedded Graduation Model

## Problem

Central expert teams face a scaling trap.

If they stay centralized and consult from a distance, they lack enough local context to change team behavior. If they embed permanently, they become the team's outsourced reliability/AI/platform function and cannot scale to the next team.

## Solution

Use a bounded embed → capability-build → graduation loop.

```text
select partner team
  → embed deeply in real work
  → assess gaps and build trust
  → coach through progressively harder operational work
  → graduate when the team can run independently
  → extract repeated pain points into central tooling/templates
  → move to the next team
```

The central team is not there to be needed forever. It is there to make the partner team capable without it.

## Implementation Sketch

```yaml
engagement:
  entry:
    - join team channels/standups/reviews
    - perform capability assessment
    - define 6-12 month roadmap
  build:
    - central expert initially drives high-risk work
    - partner engineers shadow, then lead low-risk work
    - expert shifts from directives to coaching questions
  graduation_criteria:
    - team detects issues through its own signals
    - team runs incidents/agent workflows with clear communication
    - knowledge is distributed across members
    - operational concerns appear in architecture/design review
    - team improves from failures without daily expert help
  scale_loop:
    - identify repeated friction
    - build shared tooling/templates/scorecards
    - reduce effort for future engagements
```

## Tradeoffs

| Upside | Cost |
|---|---|
| Builds durable team capability | Slow enough to require leadership patience |
| Prevents expert team from becoming permanent ops staff | Requires explicit end-state and graduation criteria |
| Central tooling is grounded in real team pain | Tooling can lag if learnings are not harvested |
| Creates a scalable enablement flywheel | Fails if teams do not commit time to capability building |

## When To Use

Use when:

- an expert capability must spread across many teams;
- local context matters too much for generic training;
- permanent embedded staffing would not scale;
- success is behavior/capability change, not a one-time deliverable;
- repeated team friction can feed shared platform tooling.

## When NOT To Use

Avoid when:

- the team only needs a short advisory review;
- leadership will not allocate time for capability building;
- the target capability is still too immature to teach;
- the central team lacks a mechanism to harvest learnings into shared tools.

## Real Examples

- Netflix NTech SRE embedded with teams, coached incident/reliability practices, graduated teams to independence, and converted repeated alerting/SLO/incident friction into central tooling such as alert management, maturity scorecards, SLO templates, and Slack incident automation.
- WAID / Workday AI enablement should use the same posture: embed long enough to transfer operating muscle, then graduate teams instead of becoming an AI service desk.

## Related Patterns

- [[patterns/pattern-outcome-metrics-for-agent-adoption]]
- [[patterns/pattern-agent-proof-of-work-loop]]
- [[patterns/pattern-agent-as-ui-system-of-record-backend]]
- [[concepts/human-in-the-loop]]
