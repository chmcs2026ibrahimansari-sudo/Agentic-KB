# Agentic-KB Editor Run Error Briefing — 2026-07-27 06:25

## Job
- **Name:** agentic-kb-editor-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-07-27T06:25:50-0700

## Failed Stage
Pre-run dirty-worktree safety gate, before reading editor state or making normal Editor Run changes.

## Error / Blocked Reason
`git status --porcelain` found dirty files outside the active Editor Run allowlist.

Active allowlist for this user-invoked run:
- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`
- exactly `logs/web-server-error.log`
- exactly `logs/web-server.log`

Blocking dirty paths:
- `raw/.ingest-hashes.json`
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md`
- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`
- `missions/`

Non-blocking dirty paths observed because they are within allowed Editor write paths:
- `.night-shift/state/scout-processed.json`
- prior files under `briefings/` and `briefings/errors/`

## Files Read
- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-editor-run-notes.md`

## Files Written or Attempted
- Written: `briefings/errors/agentic-kb-editor-run-2026-07-27-0625.md`
- Not attempted due to safety block:
  - `.night-shift/state/editor-state.json`
  - `briefings/2026-07-27.md`
  - any `wiki/syntheses/` page

## Files That May Need Review
- `raw/.ingest-hashes.json`
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md`
- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`
- `missions/`
- Prior untracked briefings under `briefings/errors/` from 2026-07-24 through 2026-07-26 may also indicate repeated blocked runs.

## Rollback Guidance
No normal Editor Run wiki/state changes were made. To remove this error report only, delete:
- `briefings/errors/agentic-kb-editor-run-2026-07-27-0625.md`

Do not delete or modify the blocking raw files automatically; `raw/` is source-of-truth and scheduled jobs must not clean it.

## Safest Next Action
Review and either commit, intentionally stage, move, or otherwise resolve the dirty `raw/` and `missions/` paths. After the worktree is clean outside the active allowlist, rerun the Editor Run.
