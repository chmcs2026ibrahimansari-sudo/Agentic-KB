# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-05 06:19:28 EDT
- **Failed stage:** pre-run dirty-worktree safety check, before any Refinery processing or wiki/state writes

## Blocked Reason

`git status --porcelain` showed dirty files outside the user-approved Refinery write paths and outside the two exact noisy log exceptions (`logs/web-server-error.log`, `logs/web-server.log`). Per the scheduled-run instruction, the Refinery must stop before processing sources.

Blocking dirty files:

```text
 M raw/reading-list.md
 M web/next-env.d.ts
?? wiki/daily-systems/logs/2026-08-04.md
```

Notes:
- `raw/reading-list.md` is a Scout intake queue in the playbook, but the user-level instruction for this run allowed only expected Refinery write paths plus exactly `logs/web-server-error.log` and `logs/web-server.log`. User-level instruction is narrower and controlling.
- Existing untracked files under `briefings/` are inside an expected Refinery write path and did not block the run.

## Files Read

- `AGENTS.md` (decoded via terminal after `read_file` classified it as binary)
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- `.night-shift/state/refinery-processed.json`
- `wiki/index.md`
- `wiki/log.md`
- `raw/inbox/` listing
- `raw/` `status: unprocessed` search results

## Files Written or Attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-05-0619.md`
- No wiki pages, raw files, state files, or normal briefing files were changed.

## Files That May Need Review

Blocking:
- `raw/reading-list.md`
- `web/next-env.d.ts`
- `wiki/daily-systems/logs/2026-08-04.md`

Non-blocking but pre-existing/untracked under `briefings/`:
- `briefings/errors/agentic-kb-editor-run-2026-08-02-0625.md`
- `briefings/errors/agentic-kb-editor-run-2026-08-03-0625.md`
- `briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md`
- `briefings/errors/agentic-kb-refinery-run-2026-08-03-0316.md`
- `briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md`
- `briefings/errors/agentic-kb-scout-run-2026-08-02-2306.md`
- `briefings/errors/agentic-kb-scout-run-2026-08-03-2305.md`
- `briefings/errors/agentic-kb-scout-run-2026-08-05-0220.md`
- `briefings/scout-2026-07-31.md`

## Rollback Guidance

No Refinery content changes were made. To unblock a future run, inspect the blocking dirty files and either commit, stash, or intentionally revert them. Do not delete or overwrite `raw/reading-list.md`; it is source/intake material and should be handled deliberately.

## Safest Next Action

Jay or an attended agent should review the three blocking files, decide whether they are expected human/Scout output or accidental drift, and then rerun the Refinery after the worktree is clean outside the approved Refinery paths.
