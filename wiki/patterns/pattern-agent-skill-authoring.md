---
id: 01M06AC2DHVZYEA01M273M8RJ2
title: "Agent Skill Authoring"
type: pattern
tags: [agents, tools, context, patterns, claude, mcp]
created: 2026-06-18
updated: 2026-06-18
visibility: public
confidence: high
related: [progressive-disclosure, agent-memory-runtime, agent-layer-architecture]
source: framework-docs/mgechev-skills-best-practices.md
---

# Agent Skill Authoring

## When to Use
Use this pattern when packaging reusable capabilities (procedures, scripts, reference material) for an LLM agent to discover and invoke on demand — e.g. Claude "Agent Skills" or similar tool/skill systems. It's appropriate whenever you want an agent to reliably perform a specialized, repeatable task without bloating the base system prompt or context window.

## Structure
A skill is a self-contained directory with a strict, shallow layout:

```
skill-name/
├── SKILL.md      # Required: metadata + core instructions (<500 lines)
├── scripts/      # Executable code (Python/Bash) as tiny CLIs
├── references/   # Supplementary context (schemas, cheatsheets), one level deep
└── assets/       # Templates or static output files
```

Key rules:
- **SKILL.md is the "brain"** — navigation and high-level procedure only, kept lean (<500 lines).
- **Frontmatter is the only discoverability surface.** The `name` and `description` fields are all the agent sees before triggering a skill:
  - `name`: 1–64 chars, lowercase letters/numbers/hyphens only, no consecutive hyphens, and **must exactly match the parent directory name**.
  - `description`: up to 1,024 chars, written in third person, describing the capability *and* explicit negative triggers (when NOT to use it).
- **References stay one level deep** (`references/schema.md`, not `references/db/v1/schema.md`) and are linked explicitly from SKILL.md.
- **Scripts are for fragile/deterministic operations**, not general library code — they should behave like tiny CLIs.
- **No human-facing docs inside skills**: no `README.md`, `CHANGELOG.md`, or install guides. Skills are for agents, not humans, and every extra file costs context tokens.
- **Just-in-Time loading**: SKILL.md must explicitly instruct the agent when to read a reference file (e.g. "See `references/auth-flow.md` for error codes") — the agent won't proactively read subdirectory files otherwise.
- **Explicit relative pathing** with forward slashes, regardless of OS.

## Example
A "Bad" description: `"React skills."` — too vague, the agent can't decide when to trigger it or avoid misfiring on adjacent frameworks.

A "Good" description:
> "Creates and builds React components using Tailwind CSS. Use when the user wants to update component styles or UI logic. Don't use it for Vue, Svelte, or vanilla CSS projects."

This follows the [progressive disclosure](../concepts/progressive-disclosure.md) approach: SKILL.md holds only the high-level trigger and procedure, while detailed schemas/cheatsheets live in `references/` and are pulled in only when explicitly cited.

## Trade-offs
- **Pro:** Keeps the base context window pristine — agents only pay the token cost of a skill when it's actually relevant and triggered.
- **Pro:** Strict naming/description constraints force authors to write for machine routing, not human readability, improving discoverability at scale.
- **Con:** Requires discipline to keep SKILL.md under 500 lines and references flat; over time, teams may be tempted to nest reference material or bundle general library code into `scripts/`, both of which degrade the pattern.
- **Con:** No built-in human documentation means onboarding new skill authors requires a separate best-practices reference (like this one) rather than in-repo docs.
- The source recommends validating skills with an LLM-based grader (e.g. [skillgrade](https://github.com/mgechev/skillgrade)) to catch regressions in description quality and structure — this is a testing practice worth adopting for any skill authoring pipeline.

## Related Patterns
- [Progressive Disclosure](../concepts/progressive-disclosure.md)
- [Agent Memory & Runtime](../concepts/agent-memory-runtime.md)
- [Agent Layer Architecture](../concepts/agent-layer-architecture.md)

## See Also
- [Claude Agent Skills best practices docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [skillgrade](https://github.com/mgechev/skillgrade) — LLM-based skill evaluation/regression tool
