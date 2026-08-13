# Agentic-KB Refinery Run — Blocked

- **Job name:** Agentic-KB Refinery Run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-13 03:15:38 PDT -0700
- **Failed stage:** Pre-run dirty-worktree safety check, before Refinery processing or wiki writes
- **Status:** Blocked; no raw sources processed

## Blocked reason

`git status --porcelain` showed dirty files outside the Refinery allowed write paths and outside the two exact noisy log exceptions (`logs/web-server-error.log`, `logs/web-server.log`). Per the user instruction and Night Shift rules, the run stopped before making Refinery changes.

Unexpected dirty files that block this run:

```text
?? raw/clippings/2026-08-12T20-30-49__apple-notes__test-capture-2026-05-16__ee78ee45.md
?? wiki/daily-systems/logs/2026-08-12.md
```

Allowed-but-pre-existing dirty files observed and not treated as blockers:

```text
M .night-shift/state/editor-state.json
?? briefings/2026-08-12.md
?? briefings/errors/agentic-kb-scout-run-2026-08-12-2305.md
```

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-13-0315.md`
- No wiki pages, raw files, or Refinery state files were modified.

## Files needing review

- `raw/clippings/2026-08-12T20-30-49__apple-notes__test-capture-2026-05-16__ee78ee45.md` — unexpected raw-side dirty file. Raw is protected during scheduled jobs; confirm whether this is an intentional capture that should be committed or moved through the correct intake flow by a separate action.
- `wiki/daily-systems/logs/2026-08-12.md` — outside Refinery's expected write paths. Confirm whether this belongs to another job and should be committed/staged separately.
- `.night-shift/state/editor-state.json`, `briefings/2026-08-12.md`, and `briefings/errors/agentic-kb-scout-run-2026-08-12-2305.md` — allowed paths but pre-existing dirty state; review separately if this persists across runs.

## Rollback guidance

No Refinery processing changes were made. The only new artifact from this run is this error briefing. If you need a perfectly clean rollback of this run, remove or revert only:

```text
briefings/errors/agentic-kb-refinery-run-2026-08-13-0315.md
```

Do not edit, move, or delete the raw clipping as part of rollback unless Jay explicitly approves it.

## Safest next action

Review and either commit, stash, or intentionally route the unexpected dirty files outside the Refinery path. After the worktree contains only allowed Refinery paths plus the two exact noisy log files, rerun the Agentic-KB Refinery Run.
