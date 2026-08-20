# Agentic-KB Scout Run — Blocked

- **Job name:** agentic-kb-scout-run
- **Job ID:** not available in environment (`HERMES_JOB_ID`, `CRON_JOB_ID`, `JOB_ID`, `HERMES_CRON_ID` were unset)
- **Timestamp:** 2026-08-19 23:05:41 PDT (-0700)
- **Phase/stage where it failed:** pre-run dirty-worktree gate, before fetching URLs or mutating Scout state

## Blocked reason

The Scout playbook requires the run to stop if `git status --porcelain` shows dirty files outside the allowed Scout paths.

`git status --porcelain` returned:

```text
?? raw/framework-docs/lumay-ai.md
?? wiki/daily-systems/logs/2026-08-19.md
```

Allowed Scout paths/exceptions include `.night-shift/state/`, `briefings/`, `raw/framework-docs/`, `raw/transcripts/`, `raw/code-examples/`, specific runtime log files, and `raw/reading-list.md`.

- `raw/framework-docs/lumay-ai.md` is inside an allowed Scout path.
- `wiki/daily-systems/logs/2026-08-19.md` is outside the allowed Scout paths, so the scheduled run was blocked.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-08-19-2305.md`
- Attempted: none before block beyond this error briefing

## Files that may need review

- `wiki/daily-systems/logs/2026-08-19.md` — outside Scout's allowed dirty-worktree paths and must be reviewed/committed/stashed/removed by Jay or an authorized workflow before Scout can run.
- `raw/framework-docs/lumay-ai.md` — inside Scout's allowed path, but still untracked; review whether it is an intended raw capture from a previous Scout/manual run.

## Rollback guidance

No URL fetches, raw captures, reading-list edits, or Scout state mutations were performed during this run. To roll back this run, remove only this error briefing if it is not wanted:

```bash
rm briefings/errors/agentic-kb-scout-run-2026-08-19-2305.md
```

Do not remove or alter the pre-existing dirty files unless Jay explicitly decides how to handle them.

## Safest next action for Jay

Resolve the unexpected dirty file `wiki/daily-systems/logs/2026-08-19.md` by reviewing and either committing, stashing, or intentionally removing it. Then rerun the Scout job.
