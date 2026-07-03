# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** not provided by cron context
- **Timestamp:** 2026-07-03T01:54:33-0500
- **Phase/stage failed:** pre-run dirty-worktree safety check, before fetching URLs or writing raw captures
- **Status:** blocked; no Scout source capture attempted

## Blocked reason

The Scout playbook requires `git status --porcelain` before writes and blocks on dirty files outside the exact Scout allowlist.

Allowed Scout dirty/write paths are exactly:
- `.night-shift/state/`
- `briefings/`
- `raw/framework-docs/`
- `raw/transcripts/`
- `raw/code-examples/`
- `logs/web-server-error.log`
- `logs/web-server.log`
- `logs/audit.log`
- `logs/kb-dev-server.log`
- `raw/reading-list.md`

Observed dirty files outside that allowlist:

```text
 M raw/.ingest-hashes.json
 M wiki/lint-report.md
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__1c894f4d.md
```

Full `git status --porcelain` output at block time:

```text
 M .night-shift/state/editor-state.json
 M .night-shift/state/refinery-processed.json
 M logs/audit.log
 M logs/kb-dev-server.log
 M raw/.ingest-hashes.json
 M wiki/lint-report.md
?? briefings/errors/agentic-kb-editor-run-2026-07-02-0825.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-02-0542.md
?? briefings/refinery-2026-07-01.md
?? briefings/scout-2026-07-01.md
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__1c894f4d.md
```

The files under `.night-shift/state/`, `briefings/`, and the named logs are allowed for Scout. The three files listed above are not allowed exceptions for this scheduled run.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`

## Files written or attempted

- Wrote this error briefing: `briefings/errors/agentic-kb-scout-run-2026-07-03-0154.md`

No raw capture files were written. No URLs were fetched. No state file was modified.

## Files that may need review

- `raw/.ingest-hashes.json` — dirty but outside Scout allowlist.
- `wiki/lint-report.md` — dirty but outside Scout allowlist.
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__1c894f4d.md` — untracked raw clipping outside Scout allowed raw subfolders.

## Rollback guidance

No Scout changes need rollback except this error briefing if Jay wants to remove the audit artifact. Do **not** automatically reset or delete the dirty files above; they may belong to another job or manual work.

## Safest next action

Review the three blocked dirty paths and either commit/stash them, intentionally add them to the relevant job allowlist, or rerun Scout after the worktree is clean outside Scout-approved paths.
