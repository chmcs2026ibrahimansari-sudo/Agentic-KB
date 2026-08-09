# Agentic-KB Editor Run — Blocked Error Briefing

- **Job name:** agentic-kb-editor-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-02 06:25:56 -0700 / 2026-08-02T13:25:56Z
- **Failed stage:** pre-run dirty-worktree safety gate
- **Status:** blocked before Editor writes

## Error / Blocked Reason

`git status --porcelain` showed a dirty file outside the active Editor Run allowlist:

```text
 M wiki/lint-report.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md
?? briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md
?? briefings/scout-2026-07-31.md
```

For this run, the user explicitly allowed only:

- Expected Editor write paths: `.night-shift/state/`, `briefings/`, `wiki/syntheses/`
- Noisy logs: `logs/web-server-error.log`, `logs/web-server.log`

`wiki/lint-report.md` is outside those paths, so the Editor Run stopped before reviewing recent changes, writing a normal daily briefing, updating `editor-state.json`, or modifying any synthesis pages. The untracked files under `briefings/` are inside the expected Editor write path and did not cause the block.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- `wiki/log.md`
- `.night-shift/state/editor-state.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-editor-run-notes.md`

## Files Written or Attempted

- Written: `briefings/errors/agentic-kb-editor-run-2026-08-02-0625.md`
- Not attempted because of block:
  - `.night-shift/state/editor-state.json`
  - `briefings/2026-08-02.md`
  - `wiki/syntheses/*`

## Files That May Need Review

- `wiki/lint-report.md` — pre-existing dirty modification outside Editor Run scope; review, commit, revert, or move into the correct job scope before rerunning Editor.
- `briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md` — untracked but under allowed `briefings/`; likely produced by a prior failed Refinery run.
- `briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md` — untracked but under allowed `briefings/`; likely produced by a prior failed Scout run.
- `briefings/scout-2026-07-31.md` — untracked but under allowed `briefings/`; likely prior Scout output.

## Rollback Guidance

No wiki, raw, synthesis, or state files were modified by this Editor Run. To roll back this blocked run only, remove this error briefing:

```bash
rm briefings/errors/agentic-kb-editor-run-2026-08-02-0625.md
```

Do not remove or rewrite `wiki/lint-report.md` without first deciding whether that dirty change should be kept.

## Safest Next Action

Inspect the dirty `wiki/lint-report.md` diff and either commit it as intentional lint output or revert it if stale/noisy. Then rerun `agentic-kb-editor-run` after `git status --porcelain` shows no dirty files outside `.night-shift/state/`, `briefings/`, `wiki/syntheses/`, `logs/web-server-error.log`, and `logs/web-server.log`.
