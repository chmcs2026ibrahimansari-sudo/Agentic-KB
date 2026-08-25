---
title: "MCP Carries Two Consumption Patterns — Action Execution and Memory Retrieval — and Only One Has a Permission Model"
type: synthesis
sources:
  - "[[frameworks/framework-mcp]]"
  - "[[mocs/tool-use]]"
  - "[[mocs/memory]]"
  - "[[concepts/permission-modes]]"
  - "[[concepts/tool-use]]"
  - "[[entities/mcp-ecosystem]]"
question: "MCP is documented in the Tool Use MoC as a protocol for exposing callable actions and in the Memory MoC as an interface for exposing the KB as queryable agent memory. Are these the same thing under one protocol, and should memory-read servers inherit the same permission scrutiny as action servers?"
tags: [mcp, tool-use, memory, safety, permission-modes, agentic, retrieval]
created: 2026-08-24
updated: 2026-08-24
reviewed: false
reviewed_date: ""
---

# MCP Is Two Interfaces Wearing One Protocol

[[mcp-ecosystem]] transports two structurally different consumption patterns over the same JSON-RPC contract: an *imperative* one, where the model calls a tool to change the world, and a *retrieval* one, where the model queries a corpus to change its own context. The Tool Use MoC documents the first. The Memory MoC documents the second. Neither page acknowledges the other, and the permission vocabulary in [[concepts/permission-modes]] was built entirely for the first — which means memory-read servers are currently governed by a model that was never designed for them.

## Question

MCP appears in [[mocs/tool-use]] as "the standard for exposing tools to LLMs; JSON-RPC, tool schemas, server lifecycle" and in [[mocs/memory]] as an "[[mcp-ecosystem]] server exposing KB as queryable agent memory." Are these the same thing under one protocol, and should memory-read servers inherit the same permission scrutiny as action servers?

## Argument

They are not the same thing, and the difference is where the risk sits. An action tool's blast radius is external and legible — it writes a file, posts a message, moves money — so per-tool approval gates, allow/deny lists, and human-in-the-loop confirmation are well-matched countermeasures. A memory-retrieval tool's blast radius is internal and largely invisible: it decides what enters the context window, which silently determines every downstream claim the agent makes. Approving a retrieval call once tells you nothing about what it will return on the thousandth call, because the corpus is mutable and the ranking is opaque.

[[frameworks/framework-mcp]] already names the composition hazard — "a tool that reads arbitrary files + a tool that posts to the internet = an exfiltration vector" — but frames it as a property of the *action* half. The framing understates the case. When the read side is a knowledge base that agents also write to, the retrieval interface becomes a persistence channel: content injected into the KB on one run is retrieved as authoritative context on the next. That is precisely the surface the Memory MoC's promotion policies and the `reviewed: false` convention exist to police, and it lives on the retrieval side of the protocol where the permission model has nothing to say.

The practical consequence is that MCP's uniformity, which is its main virtue for tool exposure, is a liability for governance. Because both consumption patterns arrive as `mcp__<server>__<tool>` with an identical schema shape, the host cannot distinguish "this call mutates the world" from "this call mutates my beliefs" without out-of-band knowledge. The protocol offers a hint it does not enforce: MCP's **Resources** capability was designed for read-only data exposure, distinct from **Tools**. In practice, per `framework-mcp`, "most production MCP servers focus on tools" — so retrieval gets implemented as a tool call and loses the one type-level signal the protocol provides.

## Evidence

| Claim | Source | Detail |
|---|---|---|
| MCP is documented as an action-exposure protocol | [[mocs/tool-use]], [[mocs/orchestration]] | "the standard for exposing tools to LLMs"; "protocol layer for tool exposure across orchestrators" |
| MCP is separately documented as a memory interface | [[mocs/memory]] | "[[mcp-ecosystem]] server exposing KB as queryable agent memory" |
| The protocol distinguishes Tools from Resources at the type level | [[frameworks/framework-mcp]] | Tools = "callable functions the model can invoke"; Resources = "file/data sources the model can read" |
| That distinction is discarded in practice | [[frameworks/framework-mcp]] | "Most production MCP servers focus on **tools**" |
| The trust model is scoped to capability, not to context effect | [[frameworks/framework-mcp]] | "Registered servers are trusted to their stated capability scope — but the model can be tricked into calling them with malicious inputs" |
| Permission vocabulary is action-shaped | [[concepts/permission-modes]], [[concepts/human-in-the-loop]] | Permission tiers, allow/deny lists, "approval gates for destructive or irreversible tool calls" |
| Tool Use is the least cross-linked MoC | `wiki/index.md` sweep, 2026-08-24 | No existing synthesis bridges [[mocs/tool-use]] to any other MoC |

## Counter-arguments & Gaps

**The strongest objection is that this is a category error about where governance belongs.** Retrieval quality is a retrieval problem — solved by provenance fields, per-claim confidence, `reviewed:` gating, and RRF ranking — not a permissions problem. On this view the permission system is correctly scoped to side effects, memory hygiene is correctly scoped to the KB's own schema, and inventing a "read permission tier" adds a gate that fires on every query and gets approved reflexively, which is worse than no gate. This objection has real force, and the KB's existing provenance machinery is evidence for it.

**A second objection: the asymmetry may be adequately handled already.** If a memory server is read-only by construction and the KB enforces `reviewed: false` on LLM-authored pages, the injection channel is already gated at write time, not read time. Adding read-side scrutiny would then be redundant.

**Gaps in the evidence.** [UNVERIFIED] No source in this KB measures whether memory-retrieval MCP servers actually cause more incorrect downstream claims than direct file reads — the risk argument above is derived from first principles, not observation. [UNVERIFIED] The claim that Resources-vs-Tools typing would help assumes hosts surface that distinction in their permission UI; whether [[framework-claude-code]] does so is not documented on `framework-mcp`. No source here covers MCP spec versions after the `1.x (2025)` line recorded on `framework-mcp` (`last_checked: 2026-04-04`), so the protocol may have added capability negotiation that changes this analysis.

**What would resolve it.** Two things. First, re-check the current MCP spec for whether Resources carry distinct permission semantics in major hosts. Second, an A/B on the KB itself: route the same set of queries through a memory MCP server versus direct grep-and-read, and compare downstream claim accuracy and citation validity. If retrieval-mediated answers show measurably worse provenance, the case for read-side governance is empirical rather than theoretical.

## Conclusion

MCP's single contract hides two consumption patterns whose risk profiles do not match, and the KB's permission vocabulary covers only one of them. The resolved position is narrow and defensible: **memory-read MCP servers do not need action-style approval gates, but they do need to be labelled as a distinct class** so that retrieval-mediated context can be traced when a downstream claim turns out to be wrong. The open question — whether that labelling should ride on MCP's Resources type or on KB-side provenance fields — stays open pending the spec re-check and the A/B above.

## Related

- [[concepts/context-management]] — what enters the window is the shared stake
- [[patterns/pattern-two-step-ingest]] — separating tool-calling from generation, the closest existing mitigation
- [[syntheses/synthesis-telephone-game-per-claim-confidence]] — the same provenance concern, one layer up
- [[syntheses/synthesis-retrieval-and-tool-permissions-as-co-enforced-boundary]] — adjacent framing of the boundary question

## Sources

- [[frameworks/framework-mcp]]
- [[mocs/tool-use]]
- [[mocs/memory]]
- [[mocs/orchestration]]
- [[concepts/permission-modes]]
- [[concepts/tool-use]]
- [[entities/mcp-ecosystem]]
