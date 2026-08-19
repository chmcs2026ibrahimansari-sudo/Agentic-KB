---
id: 01M0D2M8KDRKZNYY6R7356JB14
title: "LangGraph"
type: framework
tags: [orchestration, agents, patterns, architecture, workflow]
created: 2026-08-19
updated: 2026-08-19
visibility: public
confidence: high
related: [agent-loops, state-graph-checkpointing]
source: handbook-vinodspattar-in-learn-modules-07-langgraph.md
---

# LangGraph

## What It Does

LangGraph turns the classic hand-rolled agent loop — a `while` loop, a step budget, and a tool executor, as covered in the [agent loops](../concepts/agent-loops.md) concept — into an explicit, typed **state graph**. Instead of control flow living implicitly in code structure (only existing while the process runs), LangGraph makes control flow into *data*: an inspectable, visualizable graph structure that can be checkpointed after every step.

> "The framework earns its complexity from checkpointing, not from the graph syntax."

## Key Concepts

LangGraph maps directly onto the pieces of a hand-rolled agent loop:

| Hand-rolled loop | LangGraph concept |
|---|---|
| Shared context passed between steps | **State** — a typed structure (typically a `TypedDict`) every node reads and updates |
| Decide/act steps | **Nodes** — functions that compute a partial state update |
| "Loop back or finish" | **Edges**, including conditional edges that inspect state to pick the next node |

**Reducers.** Each state key can declare a *reducer* controlling how a node's partial update merges into existing state. The default behavior is overwrite; a common alternative is append (e.g., for a message-history list). Forgetting to declare an append reducer on a list-valued key is called out as **the single most common LangGraph bug** — each node's update silently *replaces* the message history instead of extending it.

**Checkpointing.** A checkpointer persists state after every node executes. This single addition on top of the standard decide → route → act → loop-back shape is what enables resumability and human-in-the-loop pausing — see [state graph checkpointing](../concepts/state-graph-checkpointing.md) for why this matters as a distinct idea.

## When to Use It

Use LangGraph when you need any of the properties checkpointing unlocks: crash resumability, persistence across steps, or human-in-the-loop approval gates. These become "the exact same mechanism" once state transitions are explicit, rather than two separate systems you'd otherwise have to build by hand.

## Limitations

A `StateGraph` is not inherently better than a hand-rolled agent loop for the same observe-decide-act shape — it's simply more code and concepts to learn. If you don't need persistence, resumability, or human-in-the-loop pausing, the hand-rolled loop from [agent loops](../concepts/agent-loops.md) is a perfectly reasonable choice. The append-reducer footgun on list-valued state keys is a known source of subtle bugs (see [agent failure modes](../concepts/agent-failure-modes.md)).

## See Also
- [Agent Loops](../concepts/agent-loops.md)
- [State Graph Checkpointing](../concepts/state-graph-checkpointing.md)
- [Agent Failure Modes](../concepts/agent-failure-modes.md)
