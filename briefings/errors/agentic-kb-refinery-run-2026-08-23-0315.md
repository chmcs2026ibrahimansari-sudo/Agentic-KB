# Agentic-KB Refinery Run — Blocked

- **Job name:** Agentic-KB Refinery Run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-23 03:15:44 PDT -0700
- **Failed stage:** pre-run dirty-worktree safety check, before any Refinery processing or wiki writes

## Blocked reason

`git status --porcelain` found dirty files outside the allowed Refinery write paths and outside the two exact noisy log exceptions allowed by the job prompt.

Dirty status observed:

```text
 M .night-shift/state/editor-state.json
 M wiki/log.md
 M wiki/syntheses/harness-vs-meta-harness-vs-self-improving-harness.md
?? briefings/2026-08-22.md
?? briefings/errors/agentic-kb-scout-run-2026-08-22-2306.md
?? state/notes-to-factory/
```

Allowed by this Refinery run's dirty-worktree policy:
- `.night-shift/state/editor-state.json`
- `wiki/log.md`
- `briefings/2026-08-22.md`
- `briefings/errors/agentic-kb-scout-run-2026-08-22-2306.md`

Blocking paths:
- `wiki/syntheses/harness-vs-meta-harness-vs-self-improving-harness.md` — outside expected Refinery write paths.
- `state/notes-to-factory/` — outside expected Refinery write paths. Current visible files:
  - `state/notes-to-factory/last-run.json`
  - `state/notes-to-factory/ledger.md`

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Git status output via `git status --porcelain`
- Directory listing for `state/notes-to-factory/`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-23-0315.md`
- No wiki pages, raw files, state hashes, index, or log files were modified by this run.

## Files that may need review

- `wiki/syntheses/harness-vs-meta-harness-vs-self-improving-harness.md`
- `state/notes-to-factory/last-run.json`
- `state/notes-to-factory/ledger.md`
- Existing pre-run dirty files listed above if they were not expected from another job.

## Rollback guidance

No Refinery content changes were made. If Jay wants to unblock the next Refinery run, review or commit/stash the blocking paths. Do not delete or reset them blindly; they appear to be produced by another workflow and may contain useful state.

## Safest next action

Review the two blocking paths, then either commit/stash them or expand the scheduled job's explicit dirty-worktree allowlist only if those paths are intentionally shared across Night Shift jobs.
