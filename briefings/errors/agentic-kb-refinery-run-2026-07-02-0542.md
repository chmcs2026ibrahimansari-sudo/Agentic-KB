# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-07-02 05:42:18 CDT
- **Failed stage:** pre-run dirty-worktree safety check

## Blocked reason
The Refinery Run stopped before processing sources because `git status --porcelain` reported dirty files outside the user-approved dirty-worktree allowlist.

User-level allowlist for this run permits dirty files only under expected Refinery write paths plus exactly:
- `logs/web-server-error.log`
- `logs/web-server.log`

The following dirty files are outside that allowlist and therefore block unattended writes:

```text
 M logs/audit.log
 M logs/kb-dev-server.log
```

Other pre-existing dirty files are inside expected Refinery write paths and are not blockers:

```text
 M .night-shift/state/editor-state.json
 M .night-shift/state/refinery-processed.json
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
- Written: `briefings/errors/agentic-kb-refinery-run-2026-07-02-0542.md`
- No raw, wiki, index, log, or state files were written by this run.

## Files that may need review
- `logs/audit.log`
- `logs/kb-dev-server.log`
- `.night-shift/state/editor-state.json`
- `.night-shift/state/refinery-processed.json`
- `briefings/refinery-2026-07-01.md`
- `briefings/scout-2026-07-01.md`

## Rollback guidance
No content-processing writes occurred. If this error briefing itself is unwanted, remove only:

```bash
rm briefings/errors/agentic-kb-refinery-run-2026-07-02-0542.md
```

Do not clean or revert the dirty log/state/briefing files until their ownership is understood.

## Safest next action for Jay
Decide whether `logs/audit.log` and `logs/kb-dev-server.log` should be committed, reverted, or added to the explicit Refinery dirty-worktree allowlist. Then rerun the Refinery job.
