# Agentic-KB Editor Run — Blocked Error Briefing

- **Job name:** agentic-kb-editor-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-05T09:26:43-0400
- **Failed stage:** pre-run dirty-worktree safety gate, before Editor synthesis/state writes
- **Status:** blocked

## Blocked Reason
The Editor Run stopped before making normal changes because `git status --porcelain` showed dirty files outside the active allowlist.

Active allowlist for this user-invoked run:
- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`
- exactly `logs/web-server-error.log`
- exactly `logs/web-server.log`

Dirty files reported:

```text
 M raw/reading-list.md
 M web/next-env.d.ts
?? briefings/errors/agentic-kb-editor-run-2026-08-02-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-08-03-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-03-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-05-0619.md
?? briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md
?? briefings/errors/agentic-kb-scout-run-2026-08-02-2306.md
?? briefings/errors/agentic-kb-scout-run-2026-08-03-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-08-05-0220.md
?? briefings/scout-2026-07-31.md
?? wiki/daily-systems/logs/2026-08-04.md
```

Blocking files outside the active allowlist:
- `raw/reading-list.md`
- `web/next-env.d.ts`
- `wiki/daily-systems/logs/2026-08-04.md`

Notes:
- The untracked files under `briefings/` are inside the Editor expected write path and were not treated as blockers.
- Although `playbooks/editor-run.md` mentions additional exceptions (`logs/audit.log`, `logs/kb-dev-server.log`, and `raw/reading-list.md`), the user instruction for this run is stricter and only allows the two exact web-server log files.

## Files Read
- `AGENTS.md` (read via Python fallback because the text reader classified it as binary despite zero NUL bytes)
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- Hermes skill: `hermes-obsidian-knowledge-loop`
- Hermes skill reference: `references/agentic-kb-editor-run-notes.md`
- Hermes skill: `unattended-cron-operations`

## Files Written or Attempted
- Written: `briefings/errors/agentic-kb-editor-run-2026-08-05-0926.md`
- Not attempted due to block: `.night-shift/state/editor-state.json`
- Not attempted due to block: `briefings/2026-08-05.md`
- Not attempted due to block: `wiki/syntheses/*`

## Files That May Need Review
- `raw/reading-list.md` — dirty source/intake file outside this run's active allowlist
- `web/next-env.d.ts` — dirty application-generated TypeScript file outside Editor scope
- `wiki/daily-systems/logs/2026-08-04.md` — untracked wiki file outside `wiki/syntheses/`
- Existing untracked `briefings/errors/*` and `briefings/scout-2026-07-31.md` — allowed path, but should be reviewed/committed or intentionally ignored to reduce recurring noise

## Rollback Guidance
This run only wrote this error briefing. To roll back this run, remove:

```bash
rm briefings/errors/agentic-kb-editor-run-2026-08-05-0926.md
```

Do not modify or discard the blocking files unless Jay confirms their intended state.

## Safest Next Action
Resolve or intentionally commit/stash the blocking files, especially `web/next-env.d.ts` and `wiki/daily-systems/logs/2026-08-04.md`. Then rerun the Editor Run. If `raw/reading-list.md` should be a standing exception, update the cron instruction/allowlist explicitly; this run correctly followed the stricter user-provided allowlist.
