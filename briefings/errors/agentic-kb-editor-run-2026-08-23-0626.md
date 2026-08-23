# Agentic-KB Editor Run — Blocked

- **Job name:** agentic-kb-editor-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-23T06:26:12-0700 PDT
- **Failed stage:** Pre-run dirty-worktree safety gate

## Blocked Reason

`git status --porcelain` reported dirty paths outside this run's allowed Editor paths.

Allowed by the user instruction:
- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`
- exactly `logs/web-server-error.log`
- exactly `logs/web-server.log`

Blocking dirty paths:
- `M wiki/log.md` — outside the user-specified Editor write-path allowlist for this run
- `?? state/notes-to-factory/` — outside the user-specified Editor write-path allowlist

Non-blocking dirty paths observed inside allowed Editor paths:
- `M .night-shift/state/editor-state.json`
- `M wiki/syntheses/harness-vs-meta-harness-vs-self-improving-harness.md`
- `?? briefings/2026-08-22.md`
- `?? briefings/errors/agentic-kb-refinery-run-2026-08-23-0315.md`
- `?? briefings/errors/agentic-kb-scout-run-2026-08-22-2306.md`

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- `wiki/log.md`
- `.night-shift/state/editor-state.json`

## Files Written or Attempted

- `briefings/errors/agentic-kb-editor-run-2026-08-23-0626.md`

No normal briefing, synthesis update, or state update was attempted after the block.

## Files That May Need Review

- `wiki/log.md`
- `state/notes-to-factory/`
- `.night-shift/state/editor-state.json`
- `wiki/syntheses/harness-vs-meta-harness-vs-self-improving-harness.md`
- `briefings/2026-08-22.md`
- `briefings/errors/agentic-kb-refinery-run-2026-08-23-0315.md`
- `briefings/errors/agentic-kb-scout-run-2026-08-22-2306.md`

## Rollback Guidance

Do not reset or clean automatically. These look like pre-existing edits from prior Night Shift runs or adjacent automation. Review with:

```bash
git status --porcelain
git diff -- wiki/log.md .night-shift/state/editor-state.json wiki/syntheses/harness-vs-meta-harness-vs-self-improving-harness.md
```

For the untracked directory, inspect before removing or committing:

```bash
find state/notes-to-factory -maxdepth 2 -type f -print
```

## Safest Next Action for Jay

Decide whether `wiki/log.md` and `state/notes-to-factory/` should be committed, moved into an approved state path, or intentionally discarded. After the worktree is clean except for allowed Editor paths/noisy logs, rerun the Editor Run.
