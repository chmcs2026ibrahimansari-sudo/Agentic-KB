# Agentic-KB Editor Run — Blocked

- **Job name:** agentic-kb-editor-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-11 06:25 PDT
- **Failed stage:** pre-run dirty-worktree safety gate
- **Status:** blocked before Editor synthesis review or state update

## Error / Blocked Reason

`git status --porcelain` showed dirty files outside the user-allowed Editor paths.

Allowed by this run:
- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`
- `logs/web-server-error.log`
- `logs/web-server.log`

Blocking dirty paths observed:
- `raw/reading-list.md` — raw/intake path is not allowed for this Editor run, and the user explicitly allowed only the two web-server log files beyond Editor write paths.
- `wiki/log.md` — outside this run's dirty-worktree allowlist.
- `wiki/daily-systems/logs/2026-08-10.md` — outside this run's dirty-worktree allowlist.

Additional dirty paths that are inside allowed Editor paths and did not themselves block:
- `.night-shift/state/editor-state.json`
- `wiki/syntheses/synthesis-agentic-engineering-operating-model.md`
- `briefings/2026-08-10.md`
- `briefings/errors/agentic-kb-refinery-run-2026-08-11-0316.md`
- `briefings/errors/agentic-kb-scout-run-2026-08-10-2305.md`

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- `wiki/log.md`
- `.night-shift/state/editor-state.json`

## Files Written or Attempted

- Written: `briefings/errors/agentic-kb-editor-run-2026-08-11-0625.md`
- Not attempted: `.night-shift/state/editor-state.json`
- Not attempted: `briefings/2026-08-11.md`
- Not attempted: `wiki/syntheses/*`

## Files Needing Review

Review or commit/stash these blocking dirty files before rerunning the Editor job:
- `raw/reading-list.md`
- `wiki/log.md`
- `wiki/daily-systems/logs/2026-08-10.md`

Also review the already-dirty allowed Editor artifacts from the previous run if they were not intentionally left uncommitted:
- `.night-shift/state/editor-state.json`
- `wiki/syntheses/synthesis-agentic-engineering-operating-model.md`
- `briefings/2026-08-10.md`

## Rollback Guidance

This run made no wiki, raw, or state changes. To roll back this run only, remove the error briefing:

```bash
rm briefings/errors/agentic-kb-editor-run-2026-08-11-0625.md
```

Do not clean or revert the blocking files automatically; they pre-existed this run and may contain legitimate Scout/Refinery or human changes.

## Safest Next Action

Inspect the blocking dirty files, decide whether to commit/stash/revert them, then rerun `agentic-kb-editor-run`. The highest-risk item is `raw/reading-list.md`; raw/intake changes should be treated as provenance-bearing and should not be modified by the Editor job.
