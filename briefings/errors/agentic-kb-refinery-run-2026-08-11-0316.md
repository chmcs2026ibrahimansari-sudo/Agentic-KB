# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable
- **Timestamp:** 2026-08-11 03:16 PDT
- **Failed stage:** Pre-run dirty-worktree safety check

## Blocked reason

The Refinery run stopped before processing sources because `git status --porcelain` reported dirty files outside the user-approved Refinery write paths and outside the two exact noisy log exceptions.

User-approved dirty-worktree exceptions for this run:
- Expected Refinery write paths: `.night-shift/state/`, `briefings/`, `wiki/summaries/`, `wiki/concepts/`, `wiki/patterns/`, `wiki/frameworks/`, `wiki/recipes/`, `wiki/evaluations/`, `wiki/personal/`, `wiki/index.md`, `wiki/log.md`
- Exact noisy logs: `logs/web-server-error.log`, `logs/web-server.log`

Dirty files that blocked the run:
- `raw/reading-list.md` — outside this run's user-approved exceptions; `raw/` is protected during scheduled Refinery runs.
- `wiki/syntheses/synthesis-agentic-engineering-operating-model.md` — outside expected Refinery write paths.
- `wiki/daily-systems/logs/2026-08-10.md` — outside expected Refinery write paths.

Dirty files observed but allowed by this run's rules:
- `.night-shift/state/editor-state.json`
- `wiki/log.md`
- `briefings/2026-08-10.md`
- `briefings/errors/agentic-kb-scout-run-2026-08-10-2305.md`

No raw files were read for ingestion, modified, moved, marked ingested, archived, truncated, or overwritten.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Git status output from `/Users/jaywest/Agentic-KB`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-11-0316.md`

## Files that may need review

- `raw/reading-list.md`
- `wiki/syntheses/synthesis-agentic-engineering-operating-model.md`
- `wiki/daily-systems/logs/2026-08-10.md`
- Existing allowed dirty files if they were not expected from prior jobs:
  - `.night-shift/state/editor-state.json`
  - `wiki/log.md`
  - `briefings/2026-08-10.md`
  - `briefings/errors/agentic-kb-scout-run-2026-08-10-2305.md`

## Rollback guidance

No Refinery wiki/source processing was performed. To undo this blocked-run artifact only, remove:

- `briefings/errors/agentic-kb-refinery-run-2026-08-11-0316.md`

Do not reset or clean the other dirty files automatically; they appear to belong to prior Scout/Editor/manual activity and need owner review.

## Safest next action

Review and either commit, stash, or intentionally discard the blocking files, especially `raw/reading-list.md`, `wiki/syntheses/synthesis-agentic-engineering-operating-model.md`, and `wiki/daily-systems/logs/2026-08-10.md`. Then rerun the Refinery job.
