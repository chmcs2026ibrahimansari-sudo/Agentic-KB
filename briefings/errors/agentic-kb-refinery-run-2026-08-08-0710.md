# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-08 07:10:37 EDT
- **Failed stage:** pre-run dirty-worktree safety check

## Blocked reason
The run stopped before processing sources because `git status --porcelain` showed dirty files outside the Refinery expected write paths and outside the user-approved noisy-log allowlist.

User-approved dirty-worktree ignore list for this run:
- `logs/web-server-error.log`
- `logs/web-server.log`

Expected Refinery write paths:
- `.night-shift/state/`
- `briefings/`
- `wiki/summaries/`
- `wiki/concepts/`
- `wiki/patterns/`
- `wiki/frameworks/`
- `wiki/recipes/`
- `wiki/evaluations/`
- `wiki/personal/`
- `wiki/index.md`
- `wiki/log.md`

Dirty files that blocked the run:
```text
 M raw/reading-list.md
 M web/next-env.d.ts
?? wiki/daily-systems/logs/2026-08-04.md
?? wiki/daily-systems/logs/2026-08-05.md
```

Dirty files observed but not blockers because they are under the expected `briefings/` path:
```text
?? briefings/errors/agentic-kb-editor-run-2026-08-02-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-08-03-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-08-05-0926.md
?? briefings/errors/agentic-kb-editor-run-2026-08-06-0926.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-03-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-05-0619.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-06-0620.md
?? briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md
?? briefings/errors/agentic-kb-scout-run-2026-08-02-2306.md
?? briefings/errors/agentic-kb-scout-run-2026-08-03-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-08-05-0220.md
?? briefings/errors/agentic-kb-scout-run-2026-08-08-0205.md
?? briefings/scout-2026-07-31.md
```

## Files read
- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`

## Files written or attempted
- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-08-0710.md`
- No raw, wiki, or state files were modified by this run.

## Files needing review
- `raw/reading-list.md` — modified intake file; not allowed by the user-specific dirty-worktree allowlist for this Refinery run.
- `web/next-env.d.ts` — modified file outside Refinery scope.
- `wiki/daily-systems/logs/2026-08-04.md` — untracked file outside Refinery expected write paths.
- `wiki/daily-systems/logs/2026-08-05.md` — untracked file outside Refinery expected write paths.
- Existing untracked files under `briefings/` should also be reviewed/committed or intentionally left as generated reports, but they did not block this run.

## Rollback guidance
No rollback is needed for Refinery content because the run stopped before source processing. To remove only this blocked-run report, delete:

```bash
rm briefings/errors/agentic-kb-refinery-run-2026-08-08-0710.md
```

Do not clean, checkout, or delete the dirty files listed above unless Jay confirms they are safe to discard.

## Safest next action
Review and either commit, stash, or explicitly allow the out-of-scope dirty files. Then rerun the Agentic-KB Refinery Run.
