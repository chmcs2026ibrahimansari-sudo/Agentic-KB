# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable in cron prompt/environment
- **Timestamp:** 2026-07-25 03:15 PDT
- **Failed stage:** Pre-run dirty-worktree safety check
- **Status:** Blocked before processing or wiki writes

## Blocked Reason

The Refinery run must stop before making changes when `git status --porcelain` shows dirty files outside the expected Refinery write paths and outside the two exact noisy log exceptions (`logs/web-server-error.log`, `logs/web-server.log`).

The worktree contains dirty raw-source files and a legacy ingest hash file outside the allowed Refinery write paths:

```text
 M .night-shift/state/scout-processed.json
 M raw/.ingest-hashes.json
?? briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md
?? briefings/errors/agentic-kb-scout-run-2026-07-24-2305.md
?? briefings/scout-2026-07-23.md
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md
?? raw/framework-docs/x-twitter-2075854920738021682.md
?? raw/framework-docs/x-twitter-2076018000570785847.md
?? raw/framework-docs/x-twitter-2076231055443440105.md
```

Files under `.night-shift/state/` and `briefings/` are within expected/allowed job paths, but the dirty files under `raw/` and `raw/.ingest-hashes.json` are not allowed for this scheduled Refinery run. Because raw originals are immutable for Night Shift jobs, this run did not modify, move, mark, archive, truncate, or process any raw source.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`
- Hermes skill: `brain-ops`
- Git status output from `git status --porcelain`

## Files Written or Attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-07-25-0315.md`
- No wiki pages, summaries, index entries, log entries, or Refinery state records were written.

## Files That May Need Review

- `raw/.ingest-hashes.json`
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md`
- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`

Also review whether these currently dirty but allowed paths should be committed or left as expected Night Shift outputs:

- `.night-shift/state/scout-processed.json`
- `briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md`
- `briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md`
- `briefings/errors/agentic-kb-scout-run-2026-07-24-2305.md`
- `briefings/scout-2026-07-23.md`

## Rollback Guidance

No Refinery processing occurred. To roll back this job only, remove this error briefing file:

```bash
rm briefings/errors/agentic-kb-refinery-run-2026-07-25-0315.md
```

Do not remove or edit the dirty `raw/` files unless Jay explicitly decides how those captures should be handled.

## Safest Next Action

Review and either commit, intentionally preserve, or manually resolve the dirty `raw/` files and `raw/.ingest-hashes.json`. After the worktree is clean except for allowed Refinery paths and the two exact noisy logs, rerun the Refinery job.
