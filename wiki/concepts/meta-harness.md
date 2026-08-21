---
id: 01M0GY8V3PR6P8TD8H10PJGQ23
title: "Meta-Harness"
type: concept
tags: [agents, orchestration, architecture, tools]
created: 2026-08-21
updated: 2026-08-21
visibility: public
confidence: medium
related: [agent-harness-model-context, agent-layer-architecture, self-improving-harness]
source: https://www.linkedin.com/posts/danielnrocha_harness-meta-harness-self-improving-harness-share-7494046822647341056-q5N7/
---

# Meta-Harness

## Definition
A meta-harness is a control-plane layer that sits **above** individual agent [harnesses](../concepts/agent-harness-model-context.md) (e.g. Claude Code, Codex). Rather than living inside one vendor's CLI, policies, session state, and sandboxing move up a level so they can follow a user or team across every harness they use. Databricks open-sourced **Omnigent** in June 2026 as an example of this pattern.

## Why It Matters
As teams adopt multiple agent harnesses across different vendors and models, per-harness policy, auditing, and sandboxing logic gets duplicated and drifts. A meta-harness centralizes governance so:

- Sessions and permissions are portable across tools
- Audit and compliance logic lives in one place, not scattered inside each CLI
- Harnesses become swappable — you can change the underlying model or tool without rebuilding governance from scratch

> **Critically, a meta-harness makes no agent smarter.** It makes them swappable and governable. It solves sprawl, not quality.

This distinction matters because teams often conflate "adopting an orchestration layer" with genuine harness engineering — putting a meta-harness on the architecture diagram and declaring the reliability problem solved, when the actual model-specific failure modes are untouched.

## Example
A team running Claude, GPT, and an open-weight model across three different harnesses uses a meta-harness to enforce the same permission boundaries and logging everywhere, rather than re-implementing sandboxing three times. When they swap one model for another, the meta-harness layer doesn't need to change — only the underlying harness does.

## See Also
- [Harness / Model / Context](agent-harness-model-context.md)
- [Self-Improving Harness](self-improving-harness.md)
- [Agent Layer Architecture](agent-layer-architecture.md)
