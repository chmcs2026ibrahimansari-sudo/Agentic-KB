---
id: 01M06ADNB5W0W2K2S7AW2ZJ9SF
title: "SkillOpt (Microsoft)"
type: framework
tags: [frameworks, agents, evaluation, automation, llm]
created: 2026-06-18
updated: 2026-06-18
visibility: public
confidence: medium
source: https://github.com/microsoft/SkillOpt
related: [skill-optimization, agent-evaluation]
---

# SkillOpt (Microsoft)

## What It Does
SkillOpt is an open-source framework (PyPI: `skillopt`) from Microsoft that treats an agent's **skill document** — not the underlying model's weights — as the trainable artifact. It runs a training loop (rollout → reflect → aggregate → select → update → evaluate) that produces bounded add/delete/replace edits to a single skill markdown file. A candidate edit is only accepted if it strictly improves a held-out validation score, borrowing concepts from deep-learning optimization (epochs, learning-rate budgets, validation gates) but applying them to text-based skills instead of model parameters.

The deployed output is a compact `best_skill.md` file (typically 300–2,000 tokens) that runs against an unmodified target model — meaning it adds **zero inference-time model calls** at deployment.

> "Train agent skills like you train neural networks — with epochs, (mini-)batchsize, learning rates, and validation gates — but without touching model weights."

## Key Concepts
- **Skill document as trainable state**: the frozen agent's behavior is modulated entirely through a prompt/skill artifact, not fine-tuning.
- **Optimizer model**: a separate model proposes bounded edits (add/delete/replace) to the skill document based on scored rollouts.
- **Validation gate**: edits are only accepted when they strictly improve a held-out score — analogous to a training/validation split, preventing regressions.
- **Textual learning-rate budget & rejected-edit buffer**: constrains how aggressively the optimizer can rewrite the skill per epoch, and tracks rejected edits to avoid repeat attempts, improving training stability.
- **Epoch-wise slow/meta update**: a slower, higher-level update pass runs across epochs for meta-level consolidation.
- **SkillOpt-Sleep (preview)**: a nightly, offline self-evolution companion for local coding agents (Claude Code, Codex, Copilot) that reviews past sessions, replays recurring tasks, and consolidates validated skills behind the same held-out gate — explicitly designed as a nightly gate rather than live auto-mutation.

Reported results: across six benchmarks, seven target models, and three execution harnesses (direct chat, Codex CLI, Claude Code CLI), SkillOpt was best-or-tied-best on all 52 evaluated (model, benchmark, harness) cells, and on GPT-5.5 lifted average no-skill accuracy by +23.5 points (direct chat), +24.8 points (Codex agentic loop), and +19.1 points (Claude Code).

## When to Use It
- You want to iteratively improve a reusable agent skill/prompt artifact without fine-tuning the underlying model.
- You need a disciplined, gated process (nightly or batch) for evolving skills based on real usage sessions rather than ad-hoc self-revision.
- You're running coding agents (Claude Code, Codex, Copilot) and want a nightly consolidation pass that only promotes skills validated against held-out tasks — a good fit as an **evaluation gate**, per the source's own framing, rather than for direct in-the-loop auto-mutation.

## Limitations
- Supports multiple backends (OpenAI / Azure / Claude / Qwen / MiniMax) but still requires running an optimizer model as part of the training loop (though not at deployment time).
- Early-stage project (v0.1.0, released 2026-06-02); benchmark claims are self-reported by the source and not yet independently replicated in this KB.
- Best suited to nightly/offline gating rather than continuous live self-mutation, per internal usage notes ("evaluate for nightly skill improvement gates, not direct auto-mutation").

## See Also
- [Skill optimization (concept)](../concepts/skill-optimization.md)
- [Agent evaluation](../concepts/agent-evaluation.md)
- [Agent failure modes](../concepts/agent-failure-modes.md)
