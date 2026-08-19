---
id: 01M06ADNB6DRKS8CB1EDPQ0NKS
title: "Skill Optimization"
type: concept
tags: [agents, evaluation, automation, llm, patterns]
created: 2026-06-18
updated: 2026-06-18
visibility: public
confidence: medium
source: https://github.com/microsoft/SkillOpt
related: [skillopt, agent-evaluation, agent-failure-modes]
---

# Skill Optimization

## Definition
Skill optimization is the practice of iteratively improving an agent's **skill document** (a prompt/markdown artifact describing how to perform a task) using a structured, gated training loop — analogous to how gradient-based optimizers train neural network weights, but operating entirely in text space. A typical loop: rollout candidate behavior → reflect on results → aggregate scored trajectories → propose bounded edits (add/delete/replace) → validate against a held-out set → accept only strictly-improving edits.

This differs from three more common approaches to agent skill improvement:
1. **Hand-crafted skills** — manually written and rarely revised.
2. **One-shot LLM generation** — a strong model writes the skill once, with no iterative validation.
3. **Loosely controlled self-revision** — an agent edits its own skill/prompt without a rigorous acceptance gate, risking silent regressions.

## Why It Matters
Skill optimization offers a middle path between static prompt engineering and full model fine-tuning: it lets teams iteratively improve agent behavior without touching model weights, keeps the deployed artifact small and auditable (a single markdown skill file), and — critically — adds **zero inference-time cost** at deployment since the optimization happens offline/nightly, not during live inference. The validation-gate discipline (only accept edits that strictly improve a held-out score) is the key mechanism that prevents drift or regression, which is a common failure mode in naive self-revising agents (see [agent failure modes](agent-failure-modes.md)).

A notable design stance from early adopters: treat this as a **nightly evaluation gate** rather than a live auto-mutation mechanism — i.e., validated skill updates are reviewed/batched offline rather than applied continuously mid-session, reducing risk of runtime regressions in production agents.

## Example
[SkillOpt](../frameworks/skillopt.md) implements this pattern concretely: it produces a compact `best_skill.md` (300–2,000 tokens) through a rollout → reflect → aggregate → select → update → evaluate loop, gated by held-out validation scores, textual learning-rate budgets, and a rejected-edit buffer. Its preview feature **SkillOpt-Sleep** applies this nightly to coding agents (Claude Code, Codex, Copilot), replaying past sessions offline to consolidate validated skill improvements.

## Common Pitfalls
- Treating skill optimization as safe for continuous, in-session auto-mutation rather than a nightly/batch gated process — increases risk of runtime regressions.
- Relying on self-reported benchmark improvements without independent replication before trusting a large accuracy lift.
- Skipping the held-out validation gate in favor of pure self-revision, which reintroduces the drift problem this pattern is meant to solve.

## See Also
- [SkillOpt (Microsoft)](../frameworks/skillopt.md)
- [Agent evaluation](agent-evaluation.md)
- [Agent failure modes](agent-failure-modes.md)
