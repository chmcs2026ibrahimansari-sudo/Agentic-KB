---
id: 01M0BS4P3FBXMAD4T48Y85QWCY
title: "Summary: Fable Prompting Tutorial (LinkedIn thread, Eduardo Ordax)"
type: summary
tags: [claude, prompting, llm, agents]
created: 2026-07-10
updated: 2026-07-10
visibility: public
confidence: medium
related: [pattern-prompt-minimization, agent-failure-modes]
source: https://www.linkedin.com/posts/eordax_ai-claude-ugcPost-7480733978405109760--4xi/
---

# Summary: Fable Prompting Tutorial (LinkedIn thread, Eduardo Ordax)

Eduardo Ordax shared a 15-minute tutorial from an Anthropic developer covering prompting for their newest model, referred to by the codename "Fable" and described as ranking alongside Sonnet 3.5 and Opus 4.5 in memorability/impact. The thread's discussion (31 comments) surfaced a consistent theme across practitioners.

## Key Ideas
- **Anthropic reportedly cut ~80% of Claude Code's system prompt** when adapting it for this newer model class, and the tutorial argues this new generation of models performs better with smaller prompts.
- **Fewer instructions, fewer examples, more room to reason** — the core prompting shift: stop over-specifying and trust the model's reasoning.
- **Move control outside the prompt**: commenters converged on the idea that reliability now comes from stronger external tools and verification layers rather than exhaustive in-prompt rules (see [prompt minimization](../patterns/pattern-prompt-minimization.md)).
- **New gotcha — silent refusals**: at least one commenter flagged that this model can decline benign requests while still returning a normal, non-error response, meaning error-handling built only around exceptions/failures will miss these cases (see [agent failure modes](../concepts/agent-failure-modes.md)).
- **Dissenting view**: not everyone was convinced — one commenter argued that ceding control to the model's reasoning means less consistency, and that quality gains will feel incremental ("nice but not wow") rather than transformative.

## Notable Quotes
> "Fable is one of those models you'll always remember. Like Sonnet 3.5 or Opus 4.5."

> "Cutting 80% of Claude Code's system prompt sounds wild but honestly not surprising anymore." — C J Teja Sai

> "Welcome to the aige of aiverage... No control is no consistency." — Bob Ballings

## Caveats
This is a secondhand account (LinkedIn post + comments) of a talk, not primary Anthropic documentation — treat specific figures (e.g. the "80%" system prompt cut) as reported-but-unverified pending a primary source.

## See Also
- [Prompt minimization](../patterns/pattern-prompt-minimization.md)
- [Agent failure modes](../concepts/agent-failure-modes.md)
