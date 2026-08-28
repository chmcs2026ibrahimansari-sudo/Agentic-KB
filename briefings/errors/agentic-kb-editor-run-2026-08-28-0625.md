# Agentic-KB Editor Run — Blocked

- **Job name:** agentic-kb-editor-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-28 06:25:40 PDT -0700 / 2026-08-28T13:25:40Z
- **Failed stage:** Pre-run dirty-worktree safety gate
- **Status:** blocked before wiki synthesis/state work

## Error / Blocked Reason

`git status --porcelain` found dirty files outside the active Editor Run write allowlist.

Allowed for this user-invoked run:
- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`
- exactly `logs/web-server-error.log`
- exactly `logs/web-server.log`

Blocking dirty files found:
- `M state/notes-to-factory/ledger.md`
- `?? wiki/daily-systems/logs/2026-08-27.md`

Per Night Shift rules, the Editor Run stopped before reading/updating `.night-shift/state/editor-state.json`, before reviewing changed wiki pages, and before writing the normal daily briefing.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-editor-run-notes.md`

## Files Written or Attempted

Written:
- `briefings/errors/agentic-kb-editor-run-2026-08-28-0625.md`

Not attempted because the dirty-worktree gate blocked the run:
- `.night-shift/state/editor-state.json`
- `briefings/2026-08-28.md`
- any `wiki/syntheses/*` page

## Files That May Need Review

- `state/notes-to-factory/ledger.md`
- `wiki/daily-systems/logs/2026-08-27.md`

## Rollback Guidance

No rollback was performed. This run only wrote this error briefing. If the two blocking dirty files are intentional, commit or stash them before rerunning the Editor Run. If they are accidental, inspect and restore them manually before rerun.

## Safest Next Action for Jay

Review the two blocking files, decide whether to keep/stash/revert them, then rerun `agentic-kb-editor-run` once the worktree contains only allowed Editor paths and the two explicitly allowed runtime logs.
