# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-14 03:15 PDT
- **Failed stage:** pre-run dirty-worktree safety check
- **Reason:** Worktree contains dirty files outside the Refinery run's expected write paths and outside the two exact noisy log exceptions allowed by the user instruction.

## Files read
- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`
- Hermes skill: `unattended-cron-operations`

## Dirty-worktree result
Command run from `/Users/jaywest/Agentic-KB`:

```text
M .night-shift/state/editor-state.json
 M wiki/daily-systems/logs/2026-08-13.md
 M wiki/lint-report.md
?? briefings/2026-08-13.md
?? briefings/errors/agentic-kb-scout-run-2026-08-13-2305.md
```

## Classification
Allowed by the user-level Refinery instruction:
- `.night-shift/state/editor-state.json` — under `.night-shift/state/`
- `briefings/2026-08-13.md` — under `briefings/`
- `briefings/errors/agentic-kb-scout-run-2026-08-13-2305.md` — under `briefings/`

Blocking dirty files:
- `wiki/daily-systems/logs/2026-08-13.md` — outside expected Refinery write paths
- `wiki/lint-report.md` — outside expected Refinery write paths

Note: The playbook lists additional local exceptions, but the cron instruction is narrower and controlling for this run. Only `logs/web-server-error.log` and `logs/web-server.log` may be ignored as noisy logs.

## Files written or attempted
- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-14-0315.md`
- No raw files were read for processing.
- No wiki pages, index, log, or state files were modified by this run.

## Files that may need review
- `wiki/daily-systems/logs/2026-08-13.md`
- `wiki/lint-report.md`
- Existing allowed dirty files may also need normal review/commit hygiene:
  - `.night-shift/state/editor-state.json`
  - `briefings/2026-08-13.md`
  - `briefings/errors/agentic-kb-scout-run-2026-08-13-2305.md`

## Rollback guidance
- This run only created this error briefing. To roll back this run, remove `briefings/errors/agentic-kb-refinery-run-2026-08-14-0315.md`.
- Do not modify or clean the pre-existing dirty files unless Jay explicitly chooses to keep, discard, or commit them.

## Safest next action
Review the two blocking wiki files, then either commit/stash/discard them intentionally or expand the Refinery dirty-worktree policy if those paths should be expected outputs. Re-run the Refinery only after `git status --porcelain` has no blocking dirty files.
