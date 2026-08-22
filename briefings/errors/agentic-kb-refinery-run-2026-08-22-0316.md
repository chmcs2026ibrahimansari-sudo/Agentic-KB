# Agentic-KB Refinery Run — BLOCKED

- **Job name:** `agentic-kb-refinery-run`
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-22 03:16:08 PDT (-0700)
- **Failed stage:** Pre-run dirty-worktree safety check, before any Refinery writes or raw-source processing

## Blocked reason

`git status --porcelain` reported dirty files outside the user-allowed Refinery write paths.

Observed status:

```text
?? briefings/errors/agentic-kb-scout-run-2026-08-21-2305.md
?? wiki/daily-systems/logs/2026-08-21.md
```

The Scout error briefing is under `briefings/`, which is an expected mutable path for this workflow. The file `wiki/daily-systems/logs/2026-08-21.md` is outside the expected Refinery write paths:

- `.night-shift/state/`
- `briefings/`
- `wiki/summaries/`
- `wiki/concepts/`
- `wiki/patterns/`
- `wiki/frameworks/`
- `wiki/recipes/`
- `wiki/evaluations/`
- `wiki/personal/`
- `wiki/index.md`
- `wiki/log.md`

It is also not one of the two exact noisy log exceptions allowed by the user instruction:

- `logs/web-server-error.log`
- `logs/web-server.log`

Per the scheduled-run guardrail, the Refinery stopped before processing any sources.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- `.night-shift/state/refinery-processed.json`
- `wiki/index.md`
- `wiki/log.md`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-22-0316.md`
- No wiki pages, raw files, or state files were written.
- No raw files were moved, edited, deleted, archived, truncated, overwritten, or marked ingested.

## Files needing review

- `wiki/daily-systems/logs/2026-08-21.md` — untracked file outside Refinery's allowed write paths. Decide whether to keep, move into an approved path, commit, or remove.
- `briefings/errors/agentic-kb-scout-run-2026-08-21-2305.md` — untracked but inside `briefings/`; does not block Refinery, but should likely be reviewed/committed with Scout outputs.

## Rollback guidance

No Refinery content writes occurred before the block. To roll back this blocked run, remove only this error briefing if it is not wanted:

```bash
rm briefings/errors/agentic-kb-refinery-run-2026-08-22-0316.md
```

Do not modify `raw/` as part of rollback.

## Safest next action

Review the untracked `wiki/daily-systems/logs/2026-08-21.md` file. If it is valid work, commit it or move it through the appropriate workflow. Then rerun `agentic-kb-refinery-run`.
