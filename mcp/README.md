# Agentic KB — MCP Server

Exposes the knowledge base as MCP tools for Claude Desktop, Claude Code, and any agent.

## Tools

37 tools in five groups. Private scopes and write-side admin tools are
PIN-gated (`PRIVATE_PIN` env; unset = private access disabled).

### Wiki

| Tool | Description |
|------|-------------|
| `search_wiki` | Full-text search across articles (scoped public/private/all) |
| `read_article` | Read a specific article by slug (private requires PIN) |
| `read_index` | Get the master catalog |
| `list_articles` | List articles in a section |
| `query_wiki` | AI-powered WikiQuery via streaming API |
| `compile_wiki` | Compile raw docs into wiki pages (incremental or full) |
| `lint_wiki` | Contradiction / orphan / staleness health check |

### Agent runtime

| Tool | Description |
|------|-------------|
| `list_agents` | List all agent contracts |
| `load_agent_context` | Scoped context bundle per contract (tier, budget, includes) |
| `close_agent_task` | Transactional end-of-task writeback (atomic, rolls back) |
| `agent_dry_run_close_task` | Full write plan for a close payload, no writes |
| `agent_trace` | Recent runtime traces (context loads, close-task writes) |

### Task lifecycle

| Tool | Description |
|------|-------------|
| `agent_start_task` | Create working-memory file + active-task pointer |
| `agent_active_task` | Current active task metadata |
| `agent_status` | Lifecycle status: active task, issues, close policy, traces |
| `agent_append_task_state` | Append timestamped state to the active task |
| `agent_verify_state` | Detect broken pointers / orphan working files |
| `agent_repair_state` | Safe repair of lifecycle state |
| `agent_abandon_task` | Mark active task abandoned, clear pointer |

### Bus & promotion

| Tool | Description |
|------|-------------|
| `publish_bus_item` | Publish to a bus channel (discovery, escalation, ...) |
| `list_agent_bus_items` | List channel items, optionally by status |
| `promote_learning` | Promote a bus item to a knowledge location with provenance |
| `merge_rewrite` | Merge an approved rewrite into the canonical document |

### Repo runtime

| Tool | Description |
|------|-------------|
| `list_repos` | Tracked repos with sync status and doc counts |
| `get_repo_home` | Repo home page / overview |
| `sync_repo_markdown` | Sync docs from GitHub into `repo-docs/` |
| `search_repo_docs` | Full-text search within one repo namespace |
| `load_repo_context` | Prioritized context bundle for repo work |
| `append_repo_progress` | Append to `progress.md` |
| `write_repo_task_log` | Append a per-task log entry |
| `close_repo_task` | Transactional repo-scoped close-task |
| `dry_run_close_repo_task` | Write plan for a repo close payload, no writes |
| `write_rewrite_artifact` | Create a rewrite draft (prds/specs/plans/test-plans) |
| `publish_repo_discovery` | Publish a repo discovery bus item |
| `publish_repo_escalation` | Publish a repo escalation bus item |
| `list_repo_bus_items` | List repo bus items by channel/status |
| `promote_repo_learning` | Promote a repo bus item with provenance |

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

The 2026-07-28 revision (finalized July 2026) is the largest since
launch. What matters for this server:

- **Stateless protocol core** — the initialization handshake is removed;
  protocol version, `clientInfo`, and capabilities travel in `_meta` on
  every request instead of being negotiated once per session.
- **`Mcp-Session-Id` header removed** — no session identity to hold onto;
  irrelevant for this stdio server, which never depended on it.
- **Tasks moved to an extension** — long-running work (a natural fit for
  `compile_wiki` runs) is opt-in rather than core.

No migration is needed until `@modelcontextprotocol/sdk` ships support —
the SDK is expected to handle the `_meta` negotiation details, and this
server keeps no per-session state of its own, so the stateless core is a
non-event here. When upgrading the SDK, revisit:
- long-running tools (`compile_wiki`, `query_wiki`) → Tasks extension
- `PRIVATE_PIN` gating → OAuth-aligned authorization

Already implemented ahead of the RC: W3C Trace Context passthrough. If a
client sends `traceparent` (and optionally `tracestate`) in `_meta` on a
tool call, the server records it in `logs/agent-runtime.log` as a
`type: mcp-tool-call` entry, so KB operations can be correlated with the
caller's distributed trace. Clients that send no trace context see no
change.
