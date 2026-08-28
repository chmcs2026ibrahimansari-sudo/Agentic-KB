# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** Not provided by cron context
- **Timestamp:** 2026-08-27 23:05:34 PDT (-0700) / 2026-08-28T06:05:34Z
- **Phase/stage failed:** Pre-run dirty-worktree safety gate
- **Status:** Blocked before fetch, raw capture, or state mutation

## Blocked Reason

`git status --porcelain` reported dirty files outside the Scout Run allowlist.

Allowed Scout paths/exceptions are exactly:

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

Dirty files found outside that allowlist:

```text
M state/notes-to-factory/ledger.md
?? wiki/daily-systems/logs/2026-08-27.md
```

Per `playbooks/scout-run.md`, Scout stopped before processing any URLs.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`

## Files Written or Attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-08-27-2305.md`
- Not attempted: URL fetches
- Not attempted: raw captures
- Not attempted: `.night-shift/state/scout-processed.json` mutation
- Not attempted: `briefings/scout-2026-08-27.md`

## Files That May Need Review

- `state/notes-to-factory/ledger.md`
- `wiki/daily-systems/logs/2026-08-27.md`

## Rollback Guidance

No Scout data writes occurred, so there is no Scout raw/state rollback needed.

If Jay wants to remove this blocked-run audit artifact after review, remove only:

- `briefings/errors/agentic-kb-scout-run-2026-08-27-2305.md`

Do **not** clean or revert the dirty files above unless Jay confirms they are safe to discard.

## Safest Next Action

Inspect the two out-of-allowlist dirty files, then either commit, stash, move, or deliberately bless them under the Scout dirty-worktree policy. After that, rerun Agentic-KB Scout Run.
