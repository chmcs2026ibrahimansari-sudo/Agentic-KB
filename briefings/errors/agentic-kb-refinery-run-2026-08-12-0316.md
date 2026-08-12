# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-12 03:16:05 PDT
- **Failed stage:** pre-run dirty-worktree safety check, before any Refinery writes or source processing

## Blocked reason

The Refinery run was stopped because `git status --porcelain` showed dirty files outside the user-approved Refinery write paths and outside the two exact noisy log exceptions.

User-approved dirty-worktree allowances for this run:
- Expected Refinery write paths: `.night-shift/state/`, `briefings/`, `wiki/summaries/`, `wiki/concepts/`, `wiki/patterns/`, `wiki/frameworks/`, `wiki/recipes/`, `wiki/evaluations/`, `wiki/personal/`, `wiki/index.md`, `wiki/log.md`
- Exact noisy log exceptions: `logs/web-server-error.log`, `logs/web-server.log`

Blocking dirty files:
- `raw/reading-list.md` — raw/intake file outside the user-approved allowances for this run
- `wiki/syntheses/synthesis-agentic-engineering-operating-model.md` — synthesis path outside expected Refinery write paths
- `wiki/daily-systems/logs/2026-08-10.md` — daily-systems path outside expected Refinery write paths
- `wiki/daily-systems/logs/2026-08-11.md` — daily-systems path outside expected Refinery write paths

Non-blocking dirty files observed because they are inside approved paths:
- `.night-shift/state/editor-state.json`
- `wiki/log.md`
- `briefings/2026-08-10.md`
- `briefings/errors/agentic-kb-editor-run-2026-08-11-0625.md`
- `briefings/errors/agentic-kb-refinery-run-2026-08-11-0316.md`
- `briefings/errors/agentic-kb-scout-run-2026-08-10-2305.md`
- `briefings/errors/agentic-kb-scout-run-2026-08-11-2305.md`

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`
- Git status output from `/Users/jaywest/Agentic-KB`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-12-0316.md`
- No wiki pages, state files, or raw files were written.
- No raw sources were processed.

## Files that may need review

- `raw/reading-list.md`
- `wiki/syntheses/synthesis-agentic-engineering-operating-model.md`
- `wiki/daily-systems/logs/2026-08-10.md`
- `wiki/daily-systems/logs/2026-08-11.md`

## Rollback guidance

Only this error briefing was created by the blocked run. To roll back this run, remove:

- `briefings/errors/agentic-kb-refinery-run-2026-08-12-0316.md`

Do not alter `raw/reading-list.md` or other pre-existing dirty files unless Jay explicitly asks.

## Safest next action

Review or commit/stash the blocking dirty files, or explicitly broaden the Refinery dirty-worktree allowance if these paths are intended to coexist with scheduled Refinery runs. Then re-run the Refinery job.
