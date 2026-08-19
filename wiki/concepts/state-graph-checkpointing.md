---
id: 01M0D2M8KJEKHYWXFH1F1ZQRQZ
title: "State Graph Checkpointing"
type: concept
tags: [orchestration, agents, architecture, patterns, memory]
created: 2026-08-19
updated: 2026-08-19
visibility: public
confidence: high
related: [agent-loops, langgraph]
source: handbook-vinodspattar-in-learn-modules-07-langgraph.md
---

# State Graph Checkpointing

## Definition

State graph checkpointing is the practice of persisting an agent's state after every node/step of its control flow executes, made possible by representing control flow as explicit **data** (a typed state graph) rather than as implicit structure inside a running loop. Once state transitions are explicit and inspectable, "resume after a crash" and "pause for human approval" collapse into the *same* mechanism — reloading the last checkpointed state — instead of requiring two separately engineered systems.

## Why It Matters

A hand-rolled agent loop (see [agent loops](../concepts/agent-loops.md)) already implements the observe-decide-act shape, but its control flow only exists while the process is running — there's nothing to resume from if it crashes, and no clean point to pause for a human review. By modeling the loop as a graph of nodes and edges with a checkpointer attached, every node execution becomes a durable save point. This is the actual justification for adopting a framework like [LangGraph](../frameworks/langgraph.md) over a simpler hand-rolled loop:

> "The framework earns its complexity from checkpointing, not from the graph syntax."

Without a need for persistence, resumability, or human-in-the-loop gating, checkpointing adds cost (more concepts, more code) without corresponding benefit — a hand-rolled loop remains reasonable in that case.

## Example

In LangGraph's architecture, a `decide` node calls the model, a conditional edge routes on the resulting state to either a `tools` node (executes a tool call) or `END` (final answer), and a checkpointer saves state after both the `decide` and `tools` nodes run. If the process crashes mid-loop, or a human needs to approve a tool call before it executes, the system resumes from the last checkpoint rather than restarting the whole loop or requiring bespoke pause/resume logic.

A common pitfall when implementing this pattern: state keys that should *accumulate* (like a message history list) need an explicit append reducer declared; otherwise each node's partial update silently overwrites prior history instead of extending it — see [agent failure modes](../concepts/agent-failure-modes.md).

## See Also
- [LangGraph](../frameworks/langgraph.md)
- [Agent Loops](../concepts/agent-loops.md)
- [Agent Failure Modes](../concepts/agent-failure-modes.md)
