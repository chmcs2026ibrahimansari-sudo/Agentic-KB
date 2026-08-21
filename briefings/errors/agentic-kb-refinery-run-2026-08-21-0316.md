# Agentic-KB Refinery Run — Blocked/Error Briefing

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-21 03:16:06 PDT -0700
- **Failed stage:** Pre-run dirty-worktree safety check, before any Refinery writes
- **Result:** Blocked; no raw sources processed

## Blocked Reason

`git status --porcelain` showed a dirty file outside the user-allowed Refinery write paths and outside the two exact noisy-log exceptions:

```text
M .night-shift/state/scout-processed.json
?? briefings/scout-2026-08-20.md
?? raw/framework-docs/blume-codes.md
```

The first two paths are inside allowed scheduled-job write areas (`.night-shift/state/` and `briefings/`). The untracked raw source `raw/framework-docs/blume-codes.md` is outside the expected Refinery write paths. The job instructions explicitly require stopping and writing this error briefing when any dirty file exists outside the expected Refinery paths and outside exactly `logs/web-server-error.log` / `logs/web-server.log`.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- `.night-shift/state/refinery-processed.json`
- `wiki/index.md`
- `wiki/log.md`
- Directory scan: `raw/inbox/`
- Content scan: `raw/` for frontmatter `status: unprocessed`

## Files Written or Attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-21-0316.md`
- No wiki pages, raw files, state files, index, or log entries were modified by this Refinery run.

## Files Needing Review

- `raw/framework-docs/blume-codes.md` — untracked raw file from a prior Scout/intake flow; review, commit, or intentionally remove/stage outside this job before the next mutable Refinery run.
- `.night-shift/state/scout-processed.json` — pre-existing modified Scout state, allowed for this safety gate but should be committed or reviewed.
- `briefings/scout-2026-08-20.md` — pre-existing untracked Scout briefing, allowed for this safety gate but should be committed or reviewed.

## Rollback Guidance

No Refinery content changes were made beyond this error briefing. If this briefing itself needs to be rolled back, remove only:

- `briefings/errors/agentic-kb-refinery-run-2026-08-21-0316.md`

Do **not** modify or delete `raw/framework-docs/blume-codes.md` from this scheduled job context.

## Safest Next Action for Jay

Review the Scout-created raw file and decide whether to keep it. If valid, commit it together with the Scout state/briefing so the worktree is clean enough for the next Refinery run. Then rerun Refinery; it should be able to process up to 10 unhandled raw sources without crossing the raw-immutability guard.
