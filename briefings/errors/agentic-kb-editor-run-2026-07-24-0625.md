# Agentic-KB Editor Run — Blocked

- **Job name:** agentic-kb-editor-run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-07-24T06:25:50-0700
- **Failed stage:** pre-run dirty-worktree safety gate
- **Status:** blocked before Editor processing or synthesis writes

## Error / Blocked Reason

`git status --porcelain` showed dirty files outside the active Editor Run allowlist.

Active allowlist for this user-invoked run:
- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`
- exactly `logs/web-server-error.log`
- exactly `logs/web-server.log`

Blocking dirty files:
- `raw/.ingest-hashes.json`
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md`
- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`

Allowed but pre-existing dirty files observed:
- `.night-shift/state/scout-processed.json`
- `briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md`
- `briefings/scout-2026-07-23.md`

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-editor-run-notes.md`

## Files Written or Attempted

- `briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md`

No wiki synthesis, normal briefing, raw, or Editor state writes were attempted.

## Files That May Need Review

Review the blocking dirty raw files before rerunning the Editor job:
- `raw/.ingest-hashes.json`
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md`
- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`

These may be legitimate Scout/Refinery outputs, but the Editor Run is not allowed to proceed while raw files are dirty under the stricter user allowlist.

## Rollback Guidance

Do not delete or clean these files blindly. First determine whether the raw additions and hash update belong to a prior Scout/Refinery run and should be committed, reviewed, or reverted. If they are valid, land or stash them before rerunning Editor. If they are invalid, revert only the specific raw paths after confirming provenance.

## Safest Next Action

Inspect and resolve the dirty `raw/` changes, then rerun `agentic-kb-editor-run`. The Editor job should proceed only after `git status --porcelain` contains no dirty files outside the active allowlist.
