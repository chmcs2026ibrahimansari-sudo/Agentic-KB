# Graph Maintenance Run

Schedule: daily, after morning capture and before or alongside Agentic-KB Night Shift Editor.

Purpose: living-graph hygiene for Jay's **personal Obsidian vault** — scan, suggest links, flag orphans, propose clusters. **No automatic vault edits.**

## Job

1. Read `playbooks/graph-maintenance-run.md`, `wiki/prompt-library/graph-maintenance.md`, and `config/agents/sofie.yaml` (`vault_writes`).
2. Run the read-only scan:

```bash
node scripts/graph-maintenance-scan.mjs --write-receipt
```

3. Hermes reviews scan output + recent notes (last 7 days) using the graph-maintenance prompt.
4. Produce a **review packet** only — link suggestions, orphan flags, cluster proposals. Do not edit vault files directly.
5. Jay approves selected items.
6. Route approved durable outputs through Sofie `close-task` / `kb agent close-task` (decisions, sessions, action tracker, client notes, Memory.md).
7. Route engineering/agentic discoveries to Agentic-KB bus or INGEST — never dump raw transcripts into the personal vault.

## Pre-run checks

- Personal vault path: `$OBSIDIAN_VAULT_ROOT` or `~/Documents/Obsidian Vault`
- Dataview dashboard live at `00 - Dashboards/Graph Health.md`
- Smart Connections: **deferred** — see `wiki/personal/decision-defer-smart-connections-2026-06-01.md`

## Receipt

Every run writes:

- `briefings/graph-maintenance-YYYY-MM-DD.md` — human-readable summary
- `.night-shift/state/graph-maintenance-state.json` — idempotency + machine receipt

Verify with:

```bash
node scripts/graph-maintenance-scan.mjs --verify-receipt
```

## Error briefing rule

On failure, write `briefings/errors/graph-maintenance-run-YYYY-MM-DD-HHMM.md` with job name, timestamp, phase, files read/written, rollback guidance, and next action.

## Rules

- Never write to the personal vault except via Sofie close-task.
- Never modify Agentic-KB `raw/` originals during graph maintenance.
- Sensitive client/financial notes: draft only; escalate to Jay before Sofie writeback.
- If scan finds zero changes since last run, write a short no-op receipt.

## Briefing format

### Vault Pulse
Notes scanned, created this week, modified this week, orphan count, hub count.

### Link Suggestions (review required)
For each: source note, target note, rationale, confidence.

### Orphan Flags
Notes with zero inlinks and zero outlinks worth connecting or archiving.

### Cluster Proposals
Emerging themes that may deserve a bridge summary or MOC update.

### Writes Performed
Sofie close-task receipts only — list paths and op kinds.

### Deferred For Review
Contradictions, sensitive notes, low-confidence suggestions.
