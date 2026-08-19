---
id: 01M06A6E0CRMFB75R2J3F03W0F
title: "LangSmith"
type: framework
tags: [evaluation, observability, frameworks, langchain, agents]
created: 2026-04-18
updated: 2026-04-18
visibility: public
confidence: medium
related: [agent-evaluation, agent-observability]
source: framework-docs/langsmith.md
---

# LangSmith

LangSmith is LangChain Inc.'s evaluation and observability platform for LLM applications, covering both development-time testing and production monitoring.

## What It Does

LangSmith provides two complementary evaluation surfaces:

- **Offline evaluation** ("test before you ship") — run an application against curated datasets to support benchmarking, unit tests, regression testing, and backtesting. Workflow: create dataset → define evaluators → run experiment → analyse.
- **Online evaluation** ("monitor in production") — real-time quality detection via safety checks, format validation, and quality heuristics on live traffic, with sampling rates and filtering to control cost. Supports multi-turn conversation monitoring via threads.

## Key Concepts

- **Datasets** — collections of test cases (inputs + reference outputs), sourced from manual curation, historical traces, or synthetic generation.
- **Evaluators** — scoring functions: human review, code-based rules, LLM-as-judge, or pairwise comparison.
- **Experiments** — the results of running an application against a dataset, configurable for repetitions, concurrency, and caching.
- **Traces / Runs** — individual execution records (inputs, outputs, intermediate steps) that serve as the primary observability primitive.

## When to Use It

- You're already building with LangChain or [[framework-langgraph|LangGraph]] and want native, low-friction eval + tracing.
- You need a workflow that turns production traces directly into evaluation datasets (trace-to-dataset loop).
- You want both offline (pre-ship) and online (in-production) evaluation in one platform rather than stitching together separate tools.
- Standalone use is possible via the `langsmith` SDK (Python + TypeScript) even outside the LangChain ecosystem.

## Limitations

- Fetched documentation did not cover: specific agent trajectory/tool-call evaluation APIs, "Insights Agent" capabilities, full LangGraph integration details, self-hosted tier differences, pricing specifics, or a minimal code example — these are known gaps pending deeper research.
- Primarily a SaaS product (cloud-hosted by default); self-hosted option exists but details are unclear from current sources.
- Deepest value is realized inside the LangChain/LangGraph ecosystem — non-LangChain users get less integration benefit.

## Position in Ecosystem

LangSmith competes with OSS alternatives: promptfoo (CLI-based), DeepEval (Pytest-based), and Inspect AI (framework with a stronger sandbox story). Its main differentiator is tight LangChain/LangGraph integration plus the production-trace-to-dataset workflow, which OSS competitors don't natively offer.

## See Also

- [Agent Evaluation](../concepts/agent-evaluation.md)
- [Agent Observability](../concepts/agent-observability.md)
