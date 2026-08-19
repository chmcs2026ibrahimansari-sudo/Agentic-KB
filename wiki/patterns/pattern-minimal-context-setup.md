---
id: 01M0D2TB2QNM613QSGMRZKN9A6
title: "Minimal Context Setup for Claude"
type: pattern
tags: [claude, context, prompting, memory, agents]
created: 2026-08-19
updated: 2026-08-19
visibility: public
confidence: speculative
source: linkedin-com-posts-ruben-hassid-stop-over-organizing-claude-it-slows-you-share-7493980931716939776-k.md
---

# Minimal Context Setup for Claude

## When to Use
Use this pattern when a Claude (or similar LLM agent) setup has accumulated clutter — unused prompt libraries, skills, connectors, projects, and long-running chat threads — and responses have become slow, generic, or forgetful. It's a decluttering pattern for personal/professional agent configuration rather than a technical architecture pattern.

## Structure
Delete nearly everything, keep six things:

1. **One "about-me" file** — a single `.md` file describing role, tone, and non-negotiables, read once instead of maintaining a prompt library.
2. **State goals, not steps** — give the desired outcome and let the model figure out the approach, rather than micromanaging instructions.
3. **Force clarifying questions** — add an instruction like "Before you answer, ask me questions first" so the model pulls missing context from the user instead of guessing.
4. **Self-critique loop** — follow up first drafts with "What's wrong with this? Now fix it," treating the first answer as a draft, not the final output.
5. **Fresh chat per task** — avoid letting long threads drag stale prior messages into every new reply.
6. **Delegate the hardest tasks** — hand over the messy, time-consuming work rather than only the quick 5-minute jobs.

Everything else — prompt libraries, one-off skills, "just in case" connectors, long prompting guides, screenshots, unused subscriptions, nested folders, unfinished "perfect setups," old chat histories, partially watched tutorials, unused custom styles, abandoned projects, bloated global instructions, unnecessary high-reasoning-effort settings for trivial queries, and rarely used plugins — is flagged for deletion.

## Example
From the source post:

> "A 40-message chat is dragging 39 old messages into every reply - that's why it gets slow, forgetful, & generic. New task = new chat."

> "The more you micromanage, the dumber the output."

> "Claude critiquing Claude beats Claude on the first try. The first draft is a draft, not the answer."

The author's summary: "One file. 6 habits. 0 folders."

## Trade-offs
- **Pros**: faster and less generic responses, lower setup/maintenance overhead, forces clarity about what actually matters, reduces stale context polluting reasoning.
- **Cons**: discarding saved prompt libraries and skills may require rebuilding useful workflows later; asking clarifying questions first adds a round-trip; starting fresh chats per task loses conversational continuity for genuinely multi-turn work; the advice is a single anecdotal social-media source, not a benchmarked or peer-reviewed practice — treat as a heuristic, not a proven optimization.

## Related Patterns
- [Agent memory architecture](../concepts/agent-memory-architecture.md)
- [Agent loops](../concepts/agent-loops.md)
- [Context window bloat](../concepts/context-window-bloat.md)

## See Also
- [Agent failure modes](../concepts/agent-failure-modes.md)
