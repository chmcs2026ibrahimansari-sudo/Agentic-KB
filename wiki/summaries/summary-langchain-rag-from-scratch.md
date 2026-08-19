---
id: 01M06A5E32FWEBH5NN7H95A1T5
title: "RAG From Scratch (LangChain AI)"
type: summary
tags: [rag, retrieval, llm, knowledge-base]
created: 2026-06-18
updated: 2026-06-18
visibility: public
confidence: medium
source: https://github.com/langchain-ai/rag-from-scratch
---

# RAG From Scratch (LangChain AI)

## Overview
This is a companion repository of notebooks (paired with a YouTube video playlist) from LangChain that builds up an understanding of retrieval augmented generation (RAG) starting from the basics: indexing, retrieval, and generation. It's positioned as an educational resource rather than a production framework.

## Key Ideas
- LLMs are trained on a large but **fixed** corpus, which limits their ability to reason about private or recent information.
- **Fine-tuning** is one mitigation, but the source notes it is often not well-suited for factual recall and can be costly to maintain.
- **RAG** is presented as the more popular and powerful mechanism for expanding an LLM's effective knowledge: it grounds generation in documents retrieved from an external data source via in-context learning, rather than baking facts into model weights.
- The notebooks progressively build RAG understanding across three core stages: **indexing** (preparing/embedding documents), **retrieval** (fetching relevant chunks), and **generation** (using retrieved context to produce grounded answers).

> "Retrieval augmented generation (RAG) has emerged as a popular and powerful mechanism to expand an LLM's knowledge base, using documents retrieved from an external data source to ground the LLM generation via in-context learning." — RAG From Scratch README

## Why It's Useful
This resource is a good reference point for refreshing RAG-related recipes and evaluations in the KB — it lays out the canonical three-stage mental model (index → retrieve → generate) that most RAG pipeline implementations follow, and articulates why fine-tuning alone is a weaker choice for factual/recency needs.

## Gaps / Follow-ups
- No specific implementation details, code patterns, or evaluation results are included in this README — the substance lives in the linked notebooks and video playlist, which should be reviewed separately to produce a dedicated `patterns/pattern-rag-pipeline.md` or `recipes/` page once concrete steps are captured.

## See Also
- [concepts/agent-memory-runtime.md](../concepts/agent-memory-runtime.md)
- [concepts/agent-evaluation.md](../concepts/agent-evaluation.md)
