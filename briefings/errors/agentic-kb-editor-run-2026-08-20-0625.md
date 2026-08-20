# Agentic-KB Editor Run — Blocked

- **Job name:** agentic-kb-editor-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-20T06:25:53-0700
- **Phase/stage failed:** pre-run dirty-worktree safety gate
- **Status:** blocked before any Editor state or wiki synthesis changes

## Error / Blocked Reason

`git status --porcelain` reported a dirty file outside the active Editor allowlist:

```text
?? raw/framework-docs/lumay-ai.md
```

Per the user instruction for this run, dirty-worktree safety may ignore only:

- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`
- `logs/web-server-error.log`
- `logs/web-server.log`

The untracked file under `raw/framework-docs/` is outside those paths. Because scheduled jobs must not modify raw/source paths and must not proceed with unexpected dirty files, this run stopped before synthesis work.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-editor-run-notes.md`
- Hermes skill: `unattended-cron-operations`
- Hermes skill: `brain-ops`

## Files Written or Attempted

- Written: `briefings/errors/agentic-kb-editor-run-2026-08-20-0625.md`
- No `.night-shift/state/editor-state.json` update attempted.
- No `wiki/syntheses/` write attempted.
- No normal `briefings/2026-08-20.md` write attempted.
- No raw file modification attempted.

## Files That May Need Review

- `raw/framework-docs/lumay-ai.md` — untracked raw source file blocking the Editor Run.

## Rollback Guidance

No Editor content changes were made. If this error briefing itself needs to be removed after review, it can be deleted or reverted from git. Do not delete or move `raw/framework-docs/lumay-ai.md` unless Jay confirms whether it should be ingested, committed, or discarded.

## Safest Next Action

Review `raw/framework-docs/lumay-ai.md` and decide whether it is intentional intake for Scout/Refinery. If intentional, commit it or run the appropriate ingestion path. If accidental, remove or relocate it deliberately, then rerun the Editor Run.
