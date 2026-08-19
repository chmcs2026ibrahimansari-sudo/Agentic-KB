---
id: 01M0BQV8V160YH30AMB0FPFNZD
title: "Embedded Graduation Model (Netflix Ntech SRE)"
type: pattern
tags: [reliability, orchestration, workflow, enterprise, architecture]
created: 2026-08-19
updated: 2026-08-19
visibility: public
confidence: medium
source: www-linkedin-com-pulse-copy-netflix-ntech-sre-purpose-built-approach-reliability-scale-ozc.md
---

# Embedded Graduation Model (Netflix Ntech SRE)

## When to Use
Use this pattern when a central team of specialists (e.g. SRE, security, platform engineering) needs to scale expertise across many product/feature teams without either (a) hiring a dedicated specialist per team, which doesn't scale, or (b) offering only remote/consulting-style support, which fails to build real capability or trust. It is especially suited to reliability, security, or infrastructure disciplines where deep contextual knowledge of a team's systems is required before generalizable tooling or guidance can be effective.

## Structure
The model has four repeating phases:

1. **Embed** — A small number of specialists join a partner team directly: attending their standups, joining their incident channels, and co-owning incident response. This is not advisory from a distance; it's hands-on participation.
2. **Build Capability** — While embedded, the specialists teach the team's own engineers the practices and mental models needed (e.g. incident command, reliability engineering habits), rather than just fixing problems for them.
3. **Graduate** — Once the partner team has internalized the practices and can operate independently, the embedded specialists formally exit, freeing them to move to the next team needing support.
4. **Centralize & Generalize** — Insights and repeated patterns gathered across multiple embeds are converted into central tooling and shared practices that benefit all teams, not just the ones directly embedded with.

Netflix describes this as originating from a strategic tension: leadership wanted a centralized team with deep expertise and broad impact, but the team had just proven that deep, local embedding was essential for teams starting from zero on reliability practices. The Embedded Graduation Model resolves this tension by treating embedding as a temporary, capability-transferring phase rather than a permanent staffing model.

## Example
Netflix's Ntech (enterprise-focused) SRE team started with three engineers embedded directly onto a single struggling team — joining channels, attending standups, and commanding incidents jointly with the team's own engineers. The embedded engineers deliberately brought the host team's engineers "along for the ride" so they would learn incident response and reliability practices firsthand. Positive feedback from that team led other teams to request the same support, which forced the strategic question of how to scale a scarce, high-expertise resource across an entire enterprise without diluting it. The resulting answer was the graduation model: embed until independence, then move on, while feeding lessons learned into centralized tooling built from real, repeated patterns across teams (rather than tooling designed in the abstract).

> "We couldn't start with a traditional centralized SRE model and offer consulting from afar. These teams needed hands-on help to tackle the challenges they were facing." — Molly Struve, Netflix Ntech SRE

## Trade-offs
- **Pro:** Builds durable, internalized reliability capability in each team rather than creating a permanent dependency on the central team.
- **Pro:** Central tooling built from real embedded experience tends to be more broadly useful than tooling designed without direct team context.
- **Pro:** Scales a scarce pool of specialists across many teams over time, rather than requiring 1:1 dedicated headcount.
- **Con:** Slower initial ramp — embedding deeply with one team at a time is not immediately parallelizable across the whole enterprise.
- **Con:** Requires clear "graduation" criteria; without discipline, embeds can become permanent and reintroduce the scaling problem the model was meant to solve.
- **Con:** Depends on strong buy-in from partner team leadership to accept embedded specialists into their day-to-day workflows (standups, incidents, channels).

## Related Patterns
This pattern shares structural DNA with mentorship/rotation models used in platform and DevOps enablement teams, and with [[agent-layer-architecture]] concepts around specialized roles handing off responsibility as systems mature. It may also be relevant to multi-agent orchestration patterns where a supervisor role trains and then withdraws from worker agents once they demonstrate independent competence — worth comparing against orchestrator/worker patterns as the KB's agent-pattern library grows.

## See Also
- [[concepts/agent-layer-architecture]]
- [[concepts/agent-observability]]
- [[concepts/agent-failure-modes]]
