---
id: 01M0D32PX5CE5H94C41T35DTCJ
title: "Summary: Harrison Chase on Harness, Model, Context"
type: summary
tags: [agents, context, architecture, llm, orchestration]
created: 2026-08-18
updated: 2026-08-18
visibility: public
confidence: medium
related: [agent-harness-model-context, agent-failure-modes, agent-layer-architecture]
source: https://x.com/vartekxx/status/2088782821535981815
---

# Summary: Harrison Chase on Harness, Model, Context

A ~23 minute talk (referenced via a tweet from @vartekxx) featuring LangChain CEO Harrison Chase, framed around a talk on context engineering.

**Key ideas:**

1. Agent failures are almost never caused by the underlying model — they're caused by the context the model was given. This has become a core diagnostic heuristic for debugging agents.
2. An agent should be understood as three separable components: **harness** (orchestration/scaffolding), **model** (the LLM), and **context** (what's actually fed to the model). Builders tend to overweight the model and underweight the other two — see [The Harness, Model, Context Triad](../concepts/agent-harness-model-context.md).
3. Model providers train their models with different tool-use/file-editing conventions (OpenAI vs. Anthropic differ), so harnesses like LangChain's swap implementation details per model rather than using one universal approach.
4. Rule of thumb: the more out-of-distribution a task is relative to a model's training, the more custom harness engineering is required to compensate.

**Source note:** Captured for mining into MissionControl context-engineering work and "factory-memory" framing (per Jay's Apple Notes reference). Recommended to pair with a companion article on context engineering referenced in the same post.

## See Also
- [The Harness, Model, Context Triad](../concepts/agent-harness-model-context.md)
- [Agent Failure Modes](../concepts/agent-failure-modes.md)
