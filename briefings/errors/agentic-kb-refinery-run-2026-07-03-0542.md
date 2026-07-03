# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-07-03T05:42:47-0500
- **Failed stage:** pre-run dirty-worktree safety check
- **Status:** blocked before processing sources

## Blocked reason

The run was stopped before making Refinery changes because `git status --porcelain` showed dirty files outside the user-approved Refinery write paths and outside the two exact noisy log exceptions (`logs/web-server-error.log`, `logs/web-server.log`).

Dirty files outside the allowed set:

```text
 M logs/audit.log
 M logs/kb-dev-server.log
 M raw/.ingest-hashes.json
 M wiki/lint-report.md
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__1c894f4d.md
```

Dirty files inside expected Refinery paths, not blocking but pre-existing:

```text
 M .night-shift/state/editor-state.json
 M .night-shift/state/refinery-processed.json
?? briefings/errors/agentic-kb-editor-run-2026-07-02-0825.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-02-0542.md
?? briefings/errors/agentic-kb-scout-run-2026-07-03-0154.md
?? briefings/refinery-2026-07-01.md
?? briefings/scout-2026-07-01.md
```

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-07-03-0542.md`
- Attempted: no wiki, state, or raw writes were attempted.

## Files that may need review

- `logs/audit.log`
- `logs/kb-dev-server.log`
- `raw/.ingest-hashes.json`
- `wiki/lint-report.md`
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__1c894f4d.md`

## Rollback guidance

No Refinery processing was performed. To roll back this blocked run artifact only, remove this error briefing after confirming it has been reviewed:

```bash
rm briefings/errors/agentic-kb-refinery-run-2026-07-03-0542.md
```

Do not clean or reset the dirty files above without Jay's explicit direction; some may be outputs from other jobs or human captures.

## Safest next action

Review the dirty files outside the allowed set and either commit/stash/restore them, or explicitly expand the Refinery dirty-worktree allowlist if those files are expected for scheduled runs. Then rerun the Refinery job.
