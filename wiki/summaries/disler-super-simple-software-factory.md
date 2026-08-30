---
title: "Disler — Super Simple Software Factory"
type: summary
source_file: raw/framework-docs/disler-super-simple-software-factory.md
source_url: "https://github.com/disler/super-simple-software-factory"
author: "disler / IndyDevDan"
date_published: unknown
date_ingested: 2026-08-30
tags: [agentic, orchestration, software-factory, observability, evaluation]
key_concepts: [software-factory, code-owns-control-plane, agent-observability, typed-envelopes, verification]
confidence: high
---

# Disler — Super Simple Software Factory

## Source
- Raw source: `raw/framework-docs/disler-super-simple-software-factory.md`
- URL: https://github.com/disler/super-simple-software-factory

## TL;DR
Super Simple Software Factory packages a repeatable agents-plus-code workflow as a Claude skill, but its core architectural rule is broader: deterministic code owns sequencing, retries, acceptance, and trace capture; agents operate only inside bounded phases.

## Key Points
- The repo's controlling claim is that repeatability comes from moving the control plane out of the prompt and into Python: "Agent proposes, code disposes."
- An ADW script (AI Developer Workflow) owns phase sequencing, retries, gates, and acceptance. Agents are named phase workers, not owners of the overall loop.
- Known invocations such as `bun test` or `ruff check` should be code phases, not agent phases; paying an agent to rediscover deterministic commands adds cost and variance.
- Context crosses phase seams via typed JSON envelopes, not implicit transcript carryover. Output contracts must stay synchronized across the Python type, prompt report example, and call-site `output_type`.
- Gates verify claims after the agent returns: artifacts exist, files are non-empty, JSON parses, diffs match claims, and tests pass. If parsing/gates fail, the same agent session receives a correction instead of cold restarting.
- Observability is SQLite-first: events stream live into a WAL database with sessions, phases, events, envelopes, gate results, agent sessions, and processes. The UI polls SQLite; raw JSONL/files remain rebuildable source records.
- The skill stamps a configurable roster, prompts, harness extensions, starter ADWs, a justfile, and a visualizer into target repos. It is designed to be customized, not trusted unchanged.
- The README explicitly calls out placeholder test commands as a failure mode: the factory ships demo quality blocks that exit 0 until users wire real project commands.
- Other caveats: v1 is Pi-only despite `claude_code` being schema-valid; it runs on the current branch, without sandbox, branch-per-run, merge step, or HITL approval phase unless users add them.

## KB Updates / Links
- Existing pages: [[frameworks/super-simple-software-factory]], [[patterns/pattern-code-owns-control-plane]], [[concepts/software-factory]].
- Related: [[concepts/agent-observability]], [[concepts/agent-failure-modes]], [[patterns/pattern-agent-proof-of-work-loop]], [[syntheses/harness-vs-meta-harness-vs-self-improving-harness]].

## Conservative Notes
- High confidence on the repo's stated architecture; no independent run was executed during this Refinery pass.
- For Jay's MissionControl work, the useful pattern is not the specific toolchain; it is the enforceable seam: code controls the workflow and agents return typed, checkable envelopes.
