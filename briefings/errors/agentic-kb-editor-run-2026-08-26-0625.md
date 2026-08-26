# Agentic-KB Editor Run — BLOCKED

- **Job name:** agentic-kb-editor-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-26 06:25:53 PDT -0700
- **Failed stage:** Pre-run dirty-worktree safety gate, before any Editor writes
- **Status:** blocked

## Error / Blocked Reason

`git status --porcelain` reported a dirty file outside the user-allowed Editor paths.

Allowed for this run:
- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`
- `logs/web-server-error.log`
- `logs/web-server.log`

Observed dirty paths:

```text
 M state/notes-to-factory/ledger.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-26-0315.md
```

Blocking path:
- `state/notes-to-factory/ledger.md` — outside allowed Editor write paths and outside the two exact noisy log exceptions.

Non-blocking but pre-existing path noted:
- `briefings/errors/agentic-kb-refinery-run-2026-08-26-0315.md` — under `briefings/`, so it is inside the Editor allowed path, but it was already untracked before this run.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- `wiki/log.md`
- `.night-shift/state/editor-state.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-editor-run-notes.md`

## Files Written or Attempted

- Written: `briefings/errors/agentic-kb-editor-run-2026-08-26-0625.md`
- No wiki pages were written.
- `.night-shift/state/editor-state.json` was not updated because the run stopped before the Editor processing phase.
- No raw files were modified.

## Files Needing Review

- `state/notes-to-factory/ledger.md` — determine whether this dirty change is expected, should be committed, should be moved under `.night-shift/state/`, or should be reverted.
- `briefings/errors/agentic-kb-refinery-run-2026-08-26-0315.md` — inspect/commit if it is the intended Refinery error artifact.

## Rollback Guidance

No Editor content changes were made beyond this error briefing. If this briefing is not useful, it can be removed after review. Do **not** blindly reset the worktree: first inspect `state/notes-to-factory/ledger.md` because it may contain state from another automation.

## Safest Next Action

Resolve or intentionally commit/stash `state/notes-to-factory/ledger.md`, then rerun the Editor job. If `state/notes-to-factory/ledger.md` is legitimate scheduled-job state, consider either moving that workflow state under `.night-shift/state/` or explicitly adding it to that job's own allowlist—not to the Editor allowlist by default.
