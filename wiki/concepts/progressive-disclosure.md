---
id: 01M06AC2DJXP2XYGR9161KF57K
title: "Progressive Disclosure (Context Management)"
type: concept
tags: [context, agents, memory, architecture, claude]
created: 2026-06-18
updated: 2026-06-18
visibility: public
confidence: high
related: [pattern-agent-skill-authoring, agent-memory-runtime, agent-observability]
source: framework-docs/mgechev-skills-best-practices.md
---

# Progressive Disclosure (Context Management)

## Definition
Progressive disclosure is the practice of loading information into an agent's context window only when it is actually needed, rather than front-loading everything up front. A lean top-level file (or prompt) handles navigation and high-level logic, while detailed material — schemas, cheatsheets, domain logic, templates — lives in separate resources that are pulled in just-in-time, explicitly, by instruction.

## Why It Matters
LLM agents have finite context windows, and every token spent on unused reference material is a token not available for reasoning or task-relevant content. As agents accumulate more tools, skills, and knowledge sources, naively concatenating all of it into the system prompt causes context bloat, higher latency/cost, and diluted attention on what's actually relevant to the current task.

Progressive disclosure keeps the "brain" (e.g. a `SKILL.md` file) small and focused, deferring bulk content to standard, shallow subdirectories:
- `references/` — API docs, cheatsheets, domain logic
- `scripts/` — executable code for deterministic tasks
- `assets/` — output templates, schemas, images

Critically, the agent will **not** discover or read these files unless explicitly told to — the top-level instructions must name the exact file and condition under which to consult it (e.g. "See `references/auth-flow.md` for specific error codes"). This is what distinguishes progressive disclosure from simply organizing files: the disclosure has to be *instructed*, not assumed.

## Example
In the [agent skill authoring pattern](../patterns/pattern-agent-skill-authoring.md), `SKILL.md` is capped at under 500 lines and contains only navigation and core procedure. A skill for React component generation might say: "For Tailwind class conventions, see `references/tailwind-cheatsheet.md`" — the agent only loads that cheatsheet when it hits a step requiring it, not on every invocation of the skill.

Common pitfalls:
- Nesting reference files more than one level deep (e.g. `references/db/v1/schema.md`), which breaks the simple, predictable lookup pattern.
- Forgetting to explicitly cite when a reference file should be read — the agent has no implicit visibility into subdirectories.
- Using absolute or OS-specific paths instead of relative forward-slash paths.

## See Also
- [Agent Skill Authoring pattern](../patterns/pattern-agent-skill-authoring.md)
- [Agent Memory & Runtime](agent-memory-runtime.md)
- [Agent Layer Architecture](agent-layer-architecture.md)
