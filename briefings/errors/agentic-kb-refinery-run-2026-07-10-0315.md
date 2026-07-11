# Agentic-KB Refinery Run — Blocked/Error Briefing

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-07-10 03:15 PDT
- **Failed stage:** pre-run dirty-worktree safety check

## Blocked reason
The run stopped before processing raw sources because `git status --porcelain` showed dirty files outside the user-approved dirty-worktree allowlist.

User-level dirty-worktree policy for this run allowed only:
- Expected Refinery write paths: `.night-shift/state/`, `briefings/`, `wiki/summaries/`, `wiki/concepts/`, `wiki/patterns/`, `wiki/frameworks/`, `wiki/recipes/`, `wiki/evaluations/`, `wiki/personal/`, `wiki/index.md`, `wiki/log.md`
- Exact noisy log exceptions: `logs/web-server-error.log`, `logs/web-server.log`

Blocking dirty files found:
- `logs/audit.log`
- `logs/kb-dev-server.log`

Dirty files observed inside expected write paths and not treated as blockers:
- `briefings/errors/agentic-kb-editor-run-2026-07-07-0626.md`
- `briefings/errors/agentic-kb-editor-run-2026-07-08-0705.md`
- `briefings/errors/agentic-kb-editor-run-2026-07-09-0626.md`
- `briefings/errors/agentic-kb-refinery-run-2026-07-08-0339.md`
- `briefings/errors/agentic-kb-refinery-run-2026-07-09-0316.md`
- `briefings/scout-2026-07-07.md`
- `briefings/scout-2026-07-08.md`
- `briefings/scout-2026-07-09.md`

## Files read
- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`

## Files written or attempted
- Written: `briefings/errors/agentic-kb-refinery-run-2026-07-10-0315.md`

## Files that may need review
- `logs/audit.log`
- `logs/kb-dev-server.log`

## Rollback guidance
If this error briefing is not desired, it can be removed before committing. No `raw/` files or wiki pages were modified by this run.

## Safest next action
Decide whether `logs/audit.log` and `logs/kb-dev-server.log` should be committed, reverted, cleaned, or added to the explicit dirty-worktree allowlist for future scheduled Refinery runs. Then rerun the Refinery job.
