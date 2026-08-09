# Agentic-KB Scout Run Error Briefing — 2026-08-08 02:05 EDT

## Job
- Job name: Agentic-KB Scout Run
- Job ID: unavailable from cron context
- Timestamp: 2026-08-08 02:05:54 EDT
- Workdir: `/Users/jaywest/Agentic-KB`

## Phase / Stage Failed
Pre-run dirty-worktree gate, before Scout fetches, raw captures, or state mutation.

## Error / Blocked Reason
Scout run blocked because `git status --porcelain` found dirty files outside the allowed Scout write paths/exceptions.

Allowed Scout paths/exceptions for this run are exactly:
- `.night-shift/state/`
- `briefings/`
- `raw/framework-docs/`
- `raw/transcripts/`
- `raw/code-examples/`
- `logs/web-server-error.log`
- `logs/web-server.log`
- `logs/audit.log`
- `logs/kb-dev-server.log`
- `raw/reading-list.md`

Blocking dirty files outside that allowlist:
- `M web/next-env.d.ts`
- `?? wiki/daily-systems/logs/2026-08-04.md`
- `?? wiki/daily-systems/logs/2026-08-05.md`

Non-blocking dirty files observed because they are inside allowed paths/exceptions:
- `M raw/reading-list.md`
- `?? briefings/errors/agentic-kb-editor-run-2026-08-02-0625.md`
- `?? briefings/errors/agentic-kb-editor-run-2026-08-03-0625.md`
- `?? briefings/errors/agentic-kb-editor-run-2026-08-05-0926.md`
- `?? briefings/errors/agentic-kb-editor-run-2026-08-06-0926.md`
- `?? briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md`
- `?? briefings/errors/agentic-kb-refinery-run-2026-08-03-0316.md`
- `?? briefings/errors/agentic-kb-refinery-run-2026-08-05-0619.md`
- `?? briefings/errors/agentic-kb-refinery-run-2026-08-06-0620.md`
- `?? briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md`
- `?? briefings/errors/agentic-kb-scout-run-2026-08-02-2306.md`
- `?? briefings/errors/agentic-kb-scout-run-2026-08-03-2305.md`
- `?? briefings/errors/agentic-kb-scout-run-2026-08-05-0220.md`
- `?? briefings/scout-2026-07-31.md`

## Files Read
- `/Users/jaywest/Agentic-KB/AGENTS.md` — provided in project context; direct `read_file` attempt reported binary/incompatible text extraction.
- `/Users/jaywest/Agentic-KB/house-rules.md`
- `/Users/jaywest/Agentic-KB/playbooks/night-shift-map.md`
- `/Users/jaywest/Agentic-KB/playbooks/scout-run.md`
- `/Users/jaywest/Agentic-KB/raw/reading-list.md`
- `/Users/jaywest/Agentic-KB/.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files Written or Attempted
- Written: `/Users/jaywest/Agentic-KB/briefings/errors/agentic-kb-scout-run-2026-08-08-0205.md`
- No raw captures were attempted.
- No state mutation was attempted.
- No URL fetches were attempted because the run blocked at the dirty-worktree gate.

## Files That May Need Review
- `web/next-env.d.ts`
- `wiki/daily-systems/logs/2026-08-04.md`
- `wiki/daily-systems/logs/2026-08-05.md`
- Existing untracked `briefings/errors/*.md` files and `briefings/scout-2026-07-31.md` are non-blocking for Scout but may indicate previous scheduled jobs are producing reports that have not been committed or intentionally ignored.

## Rollback Guidance
No Scout raw/source/state changes were made, so there is no Scout ingestion rollback required.

If this error briefing itself needs removal, delete only:
`briefings/errors/agentic-kb-scout-run-2026-08-08-0205.md`

Do not delete or modify the blocking files until their ownership is understood.

## Safest Next Action for Jay
Resolve or intentionally commit/stash the blocking dirty files outside the Scout allowlist:
1. `web/next-env.d.ts`
2. `wiki/daily-systems/logs/2026-08-04.md`
3. `wiki/daily-systems/logs/2026-08-05.md`

Then rerun the Agentic-KB Scout Run. The URL queue and Scout processed-state file were left unchanged.
