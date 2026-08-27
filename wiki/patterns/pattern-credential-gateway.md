---
id: 01M06AREQVGVQPXQ9Z561SZJQP
title: "Credential Gateway Pattern"
type: pattern
tags: [agents, tools, safety, mcp, architecture]
created: 2026-07-23
updated: 2026-08-27
visibility: public
confidence: medium
related: [concepts/agent-observability, concepts/agent-failure-modes]
source: [[summaries/x-twitter-2075854920738021682]], [[summaries/opensandbox-group-OpenSandbox]]
---

# Credential Gateway Pattern

## When to Use
Use this pattern whenever an AI agent needs to call third-party APIs or apps (email, calendars, CRMs, cloud services) but should never see or hold the raw long-lived credentials for those services. It's especially relevant for autonomous or semi-autonomous agents that chain multiple tool calls, where a leaked API key could be replayed outside the agent's intended scope.

## Structure
Instead of injecting raw API keys directly into an agent's tool config or context window, a **gateway service** sits between the agent and the target APIs:

1. The gateway stores and manages the actual credentials (OAuth tokens, API keys, secrets).
2. The agent authenticates to the gateway with a scoped, revocable token instead of the real credential.
3. The agent issues a request through the gateway (e.g. "send this email," "query this CRM record").
4. The gateway performs the real API call using the stored credential, then returns a **safe, filtered result** to the agent — never the raw secret.

This effectively converts direct credential exposure into a broker/proxy relationship, similar in spirit to how [MCP](../concepts/agent-observability.md) servers mediate tool access, but focused specifically on secrets isolation rather than tool discovery.

## Example
OOMOL's **OpenConnector** is an open-source, self-hostable implementation of this pattern. Per its announcement:

> "Stop handing raw API keys to your AI agents. There's a cleaner way: a gateway that holds the credentials, so your agent only gets scoped access + safe results."

OpenConnector advertises MCP-native support and integration with 1,000+ apps, letting teams route agent tool calls through a credential-holding gateway rather than distributing raw keys into agent configs or prompts. This is conceptually adjacent to Hermes MCP's tool credential isolation approach and to "MissionControl"-style human approval boundaries, both of which aim to keep destructive or sensitive actions gated behind a control layer rather than embedded directly in agent context.

OpenSandbox's Credential Vault is a sandbox-level variant: the host writes real credentials to an egress sidecar while the sandbox sees fake or empty credential values; matching outbound HTTPS requests receive injected auth headers or scoped substitutions. This keeps real secrets out of sandbox environment variables, files, command lines, and logs, but makes the sidecar and outbound policy part of the trust boundary. See [[summaries/opensandbox-group-OpenSandbox]].

## Trade-offs
**Pros:**
- Removes raw secrets from agent context/prompts, reducing leak surface (prompt injection, log exposure, model output leakage).
- Centralizes revocation — killing a gateway-issued scoped token doesn't require rotating the underlying API key everywhere.
- Enables fine-grained scoping (read-only, single-endpoint, rate-limited) independent of what the underlying API key allows.

**Cons:**
- Adds a new infrastructure dependency and potential single point of failure/bottleneck.
- Gateway itself becomes a high-value attack target and must be hardened.
- Self-hosting requirement (as with OpenConnector) shifts operational burden onto the team running it.
- Does not eliminate all risk if the gateway's own scoping logic is misconfigured or overly permissive.

## Related Patterns
- Tool-use sandboxing / permission scoping for agent tool calls
- Human-in-the-loop approval gates (e.g. MissionControl-style approval boundaries) for high-risk actions
- MCP-based tool mediation layers

## See Also
- [[summaries/opensandbox-group-OpenSandbox]]
- [agent-observability](../concepts/agent-observability.md)
- [agent-failure-modes](../concepts/agent-failure-modes.md)
