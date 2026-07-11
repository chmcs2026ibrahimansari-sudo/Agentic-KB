# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unknown / not provided by scheduler
- **Timestamp:** 2026-07-09 03:16:23 PDT
- **Failed stage:** pre-run dirty-worktree safety check

## Blocked reason
The run stopped before processing raw sources because `git status --porcelain` showed dirty files outside the user-approved Refinery dirty-worktree allowlist.

User-approved ignore exceptions for this run were exactly:
- `logs/web-server-error.log`
- `logs/web-server.log`

Dirty files that block the run:

```text
 M logs/audit.log
 M logs/kb-dev-server.log
```

The playbook lists broader local exceptions, but the user-level cron instruction is narrower and controls this run.

## Full pre-run git status

```text
 M logs/audit.log
 M logs/kb-dev-server.log
?? briefings/errors/agentic-kb-editor-run-2026-07-07-0626.md
?? briefings/errors/agentic-kb-editor-run-2026-07-08-0705.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-08-0339.md
?? briefings/scout-2026-07-07.md
?? briefings/scout-2026-07-08.md
```

The existing untracked `briefings/` files are inside the expected Refinery write path and did not block the run.

## Files read
- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill: `hermes-obsidian-knowledge-loop`
- Hermes skill reference: `references/agentic-kb-refinery-run-notes.md`

## Files written or attempted
- Written: `briefings/errors/agentic-kb-refinery-run-2026-07-09-0316.md`
- No wiki pages, raw files, summaries, index, log, or state files were modified.

## Files needing review
- `logs/audit.log`
- `logs/kb-dev-server.log`

## Rollback guidance
No Refinery content changes were made. If this error briefing itself is not useful, it can be removed after review; otherwise keep it as the audit record for the blocked run.

## Safest next action
Decide whether `logs/audit.log` and `logs/kb-dev-server.log` should be committed, reverted, or explicitly included in the Refinery dirty-worktree allowlist. After that, rerun the Refinery job.
