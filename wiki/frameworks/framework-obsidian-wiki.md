---
id: 01KX98SS7A9AAK56ZK1FXPGED3
title: "obsidian-wiki (Ar9av)"
type: framework
tags: [agents, memory, knowledge-base, obsidian, tools]
created: 2026-06-18
updated: 2026-06-18
visibility: public
confidence: high
source: "https://github.com/Ar9av/obsidian-wiki"
related: [concepts/agent-memory-runtime, concepts/agent-loops]
---

# obsidian-wiki (Ar9av)

A framework for turning an [Obsidian](https://obsidian.md) vault into a persistent, agent-maintained knowledge base — a "digital brain" that any AI coding agent can read, update, and query.

> "A digital brain you grow with your AI agent. It remembers what you figure out, connects it to what you already know, and answers when you ask."

The project is directly inspired by Andrej Karpathy's [LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): compile knowledge once into interconnected markdown files and keep them current, rather than repeatedly querying an LLM or running RAG on every question.

## What It Does

- Installs **skills** (markdown files encoding reusable agent behaviours) into AI coding agents (Claude Code, Cursor, Windsurf, Codex, Gemini CLI, Kiro, Pi, and others)
- Points those agents at an Obsidian vault as the backing store
- The agent reads skills, writes/updates vault pages on request, and answers questions from accumulated knowledge
- Skills are symlinked to the installed package so `pip install -U obsidian-wiki` upgrades them everywhere

## Key Concepts

| Concept | Description |
|---|---|
| **Vault** | Any directory (or existing Obsidian vault) that acts as the persistent brain |
| **Skill** | A markdown file that describes a reusable agent capability; read directly by supported agents |
| **`obsidian-wiki setup`** | CLI command that writes config, installs skills, and wires up all detected agents |
| **AGENTS.md** | Project-local file dropped by `setup --project` to describe wiki skills to the agent |

## Installation

```bash
# via pip (recommended)
pip install obsidian-wiki
obsidian-wiki setup --vault /path/to/vault

# via Skills CLI
npx skills add Ar9av/obsidian-wiki

# via git
git clone https://github.com/Ar9av/obsidian-wiki.git && bash setup.sh
```

After setup, open your agent and say **"set up my wiki"** to initialise.

## When to Use It

- You want a **persistent, human-readable memory layer** across agent sessions without a vector database
- You already use Obsidian and want agents to contribute to the same vault
- You prefer **compile-once** knowledge over repeated RAG lookups for stable facts
- You work across multiple AI coding environments and want a single skill/config source of truth

## Limitations

- Relies on agents faithfully reading and writing markdown — no built-in validation or conflict resolution
- Obsidian-specific graph features (canvas, plugins) are not leveraged by the agent layer
- Skill quality depends on how well each skill file is authored; there is no automated quality gate
- Not designed for high-frequency, low-latency retrieval at scale (RAG may still be preferable for large corpora)

## See Also

- [Agent Memory at Runtime](../concepts/agent-memory-runtime.md) — broader concept of how agents manage memory across sessions
- [Agent Loops](../concepts/agent-loops.md) — the underlying read-act-write loop that skills plug into
