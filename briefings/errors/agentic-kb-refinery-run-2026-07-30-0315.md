# Agentic-KB Refinery Run — Blocked

- **Job name:** Agentic-KB Refinery Run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-07-30 03:15 PDT
- **Failed stage:** Pre-run dirty-worktree safety check, before any Refinery processing or wiki/state writes
- **Reason:** `git status --porcelain` showed dirty files outside the user-approved Refinery write paths and outside the two exact noisy log exceptions (`logs/web-server-error.log`, `logs/web-server.log`). Per the scheduled-run instructions, the job stopped instead of processing raw sources.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`

## Files written or attempted

- Wrote this error briefing: `briefings/errors/agentic-kb-refinery-run-2026-07-30-0315.md`
- No wiki pages, raw files, or Refinery state files were written.

## Dirty-worktree output

```text
 M .night-shift/state/scout-processed.json
 M raw/.ingest-hashes.json
?? briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-07-25-0626.md
?? briefings/errors/agentic-kb-editor-run-2026-07-26-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-07-27-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-07-28-0626.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-25-0315.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-26-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-27-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-28-0315.md
?? briefings/errors/agentic-kb-scout-run-2026-07-24-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-25-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-26-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-27-2313.md
?? briefings/errors/agentic-kb-scout-run-2026-07-28-2306.md
?? briefings/errors/agentic-kb-scout-run-2026-07-29-2306.md
?? briefings/scout-2026-07-23.md
?? missions/
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md
?? raw/framework-docs/x-twitter-2075854920738021682.md
?? raw/framework-docs/x-twitter-2076018000570785847.md
?? raw/framework-docs/x-twitter-2076231055443440105.md
?? wiki/daily-systems/logs/2026-07-28.md
?? wiki/daily-systems/logs/2026-07-29.md
```

## Files needing review

These dirty paths are outside the user-approved Refinery write paths and should be reviewed before the next unattended mutable Refinery run:

- `raw/.ingest-hashes.json` — modified raw-adjacent state file; Refinery must not write under `raw/`.
- `missions/` — untracked directory outside Refinery scope.
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md` — untracked raw source.
- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`
- `wiki/daily-systems/logs/2026-07-28.md`
- `wiki/daily-systems/logs/2026-07-29.md`

Dirty files inside expected or tolerated run-output areas were not blockers by themselves but remain part of the current worktree state:

- `.night-shift/state/scout-processed.json`
- existing untracked `briefings/errors/*.md`
- `briefings/scout-2026-07-23.md`

## Rollback guidance

- To remove only this run's artifact if needed: `rm briefings/errors/agentic-kb-refinery-run-2026-07-30-0315.md`
- Do **not** clean, reset, move, or delete the other dirty files until their provenance is confirmed.
- If Jay wants the queued raw/framework-docs and clippings retained, stage/commit them or adjust the scheduled job's dirty-worktree policy explicitly before rerunning Refinery.

## Safest next action

Review and either commit, intentionally ignore, or explicitly authorize handling of the out-of-scope dirty paths. Then rerun the Agentic-KB Refinery job so it can process at most 10 eligible sources with a clean safety boundary.
