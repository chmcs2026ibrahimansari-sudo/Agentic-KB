# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** not available in cron context
- **Timestamp:** 2026-08-15 03:15:36 PDT
- **Failed stage:** pre-run dirty-worktree safety check
- **Status:** blocked before processing raw sources

## Blocked reason

`git status --porcelain` reported a dirty file outside the Refinery run's allowed write paths and outside the two exact noisy log exceptions allowed by the user instruction.

Dirty status observed:

```text
M .night-shift/state/editor-state.json
?? briefings/2026-08-14.md
?? briefings/errors/agentic-kb-scout-run-2026-08-14-2306.md
?? wiki/daily-systems/logs/2026-08-14.md
```

Allowed by this run:
- `.night-shift/state/editor-state.json` — under `.night-shift/state/`
- `briefings/2026-08-14.md` — under `briefings/`
- `briefings/errors/agentic-kb-scout-run-2026-08-14-2306.md` — under `briefings/`

Blocking file:
- `wiki/daily-systems/logs/2026-08-14.md` — outside expected Refinery write paths: `.night-shift/state/`, `briefings/`, `wiki/summaries/`, `wiki/concepts/`, `wiki/patterns/`, `wiki/frameworks/`, `wiki/recipes/`, `wiki/evaluations/`, `wiki/personal/`, `wiki/index.md`, `wiki/log.md`; also not one of the exact noisy log exceptions `logs/web-server-error.log` or `logs/web-server.log`.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-15-0315.md`
- No wiki pages, raw sources, or state files were modified by this Refinery run.

## Files that may need review

- `wiki/daily-systems/logs/2026-08-14.md`
- `.night-shift/state/editor-state.json`
- `briefings/2026-08-14.md`
- `briefings/errors/agentic-kb-scout-run-2026-08-14-2306.md`

## Rollback guidance

No Refinery content changes were made before the block. If this error briefing is not needed after review, remove only this file. Do not clean, move, or commit the blocking file without confirming whether it belongs to another job's expected output.

## Safest next action

Review `wiki/daily-systems/logs/2026-08-14.md` and either commit/stash it, move its generation into an approved playbook path, or update the Refinery allowed-path policy if this file is intentionally produced by scheduled jobs. Then rerun the Refinery job.
