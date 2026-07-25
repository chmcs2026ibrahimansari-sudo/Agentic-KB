# Agentic KB — MCP Server

Exposes the knowledge base as MCP tools for Claude Desktop, Claude Code, and any agent.

## Tools

| Tool | Description |
|------|-------------|
| `search_wiki` | Full-text search across articles |
| `read_article` | Read a specific article by slug |
| `read_index` | Get the master catalog |
| `list_articles` | List articles in a section |
| `query_wiki` | AI-powered WikiQuery via streaming API |

## Setup (Claude Desktop)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agentic-kb": {
      "command": "node",
      "args": ["/Users/jaywest/Agentic-KB/mcp/server.js"],
      "env": {
        "KB_API_URL": "http://localhost:3002",
        "PRIVATE_PIN": "<your-private-pin>"
      }
    }
  }
}
```

## Setup (Claude Code / any MCP client)

```bash
node /Users/jaywest/Agentic-KB/mcp/server.js
```

## CLI

```bash
# Search public wiki
node /Users/jaywest/Agentic-KB/cli/kb.js search "multi-agent orchestration"

# Search including private
PRIVATE_PIN=<your-private-pin> node /Users/jaywest/Agentic-KB/cli/kb.js search "tool design" --scope all

# Ask a question
node /Users/jaywest/Agentic-KB/cli/kb.js query "What is the best pattern for supervisor-worker agents?"

# Read an article
node /Users/jaywest/Agentic-KB/cli/kb.js read concepts/tool-use

# List a section
node /Users/jaywest/Agentic-KB/cli/kb.js list frameworks

# Check pending ingestion queue
node /Users/jaywest/Agentic-KB/cli/kb.js pending
```

## Symlink for convenience

```bash
sudo ln -sf /Users/jaywest/Agentic-KB/cli/kb.js /usr/local/bin/kb
```

Then just: `kb search "tool use"` from anywhere.

## Input validation

All path-forming tool arguments are validated before any filesystem access:

- `slug` / `section` / `repo` args go through `validateSlug` + `safeJoin`
  (no `..`, no absolute paths, resolved path must stay inside the vault).
- Bus `channel` args must match the known channel lists; bus `id` and
  `task_id` args reject path separators and dot-dot segments.
- Promotion / merge targets (`target`, `rewrite_path`, `canonical_path`,
  `supersedes`) are checked in `lib/agent-runtime/promotion.mjs` before
  any write.

If you add a tool that turns a client-supplied string into a path, route
it through `validateSlug`/`safeJoin` (or the equivalent lib-level guard)
— the guards live in the libraries, so CLI and web callers inherit them.

## Spec compatibility

This server targets the stable MCP spec via `@modelcontextprotocol/sdk` ^1.x.

The 2026-07-28 release candidate is the largest revision since launch:
stateless core (protocol version + client info carried in `_meta` on every
request), a new `server/discover` method, MCP Apps (server-rendered UIs),
a Tasks extension for long-running work (a natural fit for `compile_wiki`
runs), OAuth-aligned authorization, and a formal deprecation policy.

No migration should happen until the spec and SDK are GA; the SDK is
expected to handle the negotiation details. When upgrading, revisit:
- long-running tools (`compile_wiki`, `query_wiki`) → Tasks extension
- `PRIVATE_PIN` gating → OAuth-aligned authorization

Already implemented ahead of the RC: W3C Trace Context passthrough. If a
client sends `traceparent` (and optionally `tracestate`) in `_meta` on a
tool call, the server records it in `logs/agent-runtime.log` as a
`type: mcp-tool-call` entry, so KB operations can be correlated with the
caller's distributed trace. Clients that send no trace context see no
change.
