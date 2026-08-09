# Agentic-KB Scout Run — BLOCKED

- **Job name:** Agentic-KB Scout Run
- **Job ID:** scheduled cron job / unavailable in runtime context
- **Timestamp:** 2026-08-01 23:06:16 PDT
- **Phase/stage failed:** Pre-run dirty-worktree gate, before fetch/write/state mutation
- **Status:** Blocked; no URL fetches attempted

## Blocked reason

`git status --porcelain` reported a dirty file outside the Scout run's allowed write paths/exceptions:

```text
 M wiki/lint-report.md
?? briefings/scout-2026-07-31.md
```

Allowed Scout write paths/exceptions are exactly:

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

`briefings/scout-2026-07-31.md` is inside an allowed Scout path and is not a blocker. `wiki/lint-report.md` is outside the allowed paths, so the run stopped before making Scout changes.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md`
- Attempted raw captures: none
- Attempted state mutations: none
- Attempted reading-list mutations: none

## Files that may need review

- `wiki/lint-report.md` — modified outside Scout's allowed write paths; decide whether to keep, commit, revert, or move through the appropriate wiki/edit workflow.
- `briefings/scout-2026-07-31.md` — untracked but under allowed Scout path; likely a prior run artifact that should be reviewed/committed if valid.

## Rollback guidance

No Scout raw captures, state updates, or reading-list edits were made. To roll back this blocked run, remove only this error briefing if it is not useful:

```bash
rm briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md
```

Do **not** remove or alter `wiki/lint-report.md` as part of Scout rollback without Jay's explicit direction; it predates this run and belongs to another workflow.

## Safest next action for Jay

Resolve the non-Scout dirty file before the next scheduled Scout run:

```bash
cd /Users/jaywest/Agentic-KB
git status --porcelain
git diff -- wiki/lint-report.md
```

Then either commit the intended lint report change, move it through the proper audit/lint workflow, or revert it if accidental. After that, Scout can safely process only unchecked URLs not already recorded in `.night-shift/state/scout-processed.json`.
