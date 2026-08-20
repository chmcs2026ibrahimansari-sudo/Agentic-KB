# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-20 03:15:18 PDT -0700
- **Failed stage:** pre-run dirty-worktree safety check, before any Refinery processing or wiki/state writes

## Blocked reason

`git status --porcelain` found dirty files outside the user-approved Refinery write paths and outside the two exact noisy log exceptions (`logs/web-server-error.log`, `logs/web-server.log`). Per the job instruction, the run stopped before processing raw sources.

Dirty files reported:

```text
?? briefings/errors/agentic-kb-scout-run-2026-08-19-2305.md
?? raw/framework-docs/lumay-ai.md
?? wiki/daily-systems/logs/2026-08-19.md
```

Blocking files:
- `raw/framework-docs/lumay-ai.md` — dirty `raw/` file; Refinery is not allowed to ignore or modify raw originals during scheduled runs.
- `wiki/daily-systems/logs/2026-08-19.md` — dirty wiki path outside the expected Refinery write paths.

Allowed but pre-existing dirty file noted:
- `briefings/errors/agentic-kb-scout-run-2026-08-19-2305.md` — under `briefings/`, so not a blocker for Refinery, but it remains untracked.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- `.night-shift/state/refinery-processed.json`

## Files written or attempted

- `briefings/errors/agentic-kb-refinery-run-2026-08-20-0315.md` — this error briefing.

No wiki pages, state files, or raw files were modified by this run.

## Files that may need review

- `raw/framework-docs/lumay-ai.md`
- `wiki/daily-systems/logs/2026-08-19.md`
- `briefings/errors/agentic-kb-scout-run-2026-08-19-2305.md`

## Rollback guidance

No Refinery content changes were made. If Jay wants a clean baseline, review and intentionally stage/commit, move, or remove the three pre-existing untracked files above. Do not delete `raw/framework-docs/lumay-ai.md` without confirming whether Scout intentionally captured it.

## Safest next action

Review the untracked `raw/framework-docs/lumay-ai.md` and `wiki/daily-systems/logs/2026-08-19.md`, then either commit them or move them out of the worktree. Re-run Refinery after `git status --porcelain` is clean except for allowed Refinery paths and the two exact noisy log files.
