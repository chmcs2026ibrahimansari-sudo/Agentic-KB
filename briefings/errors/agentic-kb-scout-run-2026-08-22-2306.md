# Agentic-KB Scout Run Error Briefing

- **Job name:** Agentic-KB Scout Run
- **Job ID:** not available in cron context
- **Timestamp:** 2026-08-22 23:06:06 PDT
- **Phase/stage failed:** pre-run dirty-worktree safety gate, before Scout fetch/write/state mutation

## Blocked reason

Scout did not run because `git status --porcelain` showed dirty files outside the allowed Scout write paths/exceptions.

Allowed paths/exceptions for this Scout run are exactly:

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

Dirty files observed:

```text
 M .night-shift/state/editor-state.json
 M wiki/log.md
 M wiki/syntheses/harness-vs-meta-harness-vs-self-improving-harness.md
?? briefings/2026-08-22.md
?? state/notes-to-factory/
```

Allowed/noisy for Scout:

- `.night-shift/state/editor-state.json`
- `briefings/2026-08-22.md`

Blocking dirty paths:

- `wiki/log.md`
- `wiki/syntheses/harness-vs-meta-harness-vs-self-improving-harness.md`
- `state/notes-to-factory/`

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-08-22-2306.md`
- Attempted raw captures: none
- Attempted Scout state mutation: none
- Attempted reading-list mutation: none

## Files that may need review

- `wiki/log.md`
- `wiki/syntheses/harness-vs-meta-harness-vs-self-improving-harness.md`
- `state/notes-to-factory/`
- Optional context: `.night-shift/state/editor-state.json`, `briefings/2026-08-22.md`

## Rollback guidance

No Scout raw captures or Scout state changes were made. If this error briefing is not useful after review, it can be removed as the only file created by this blocked run.

## Safest next action

Review and either commit, stash, or intentionally move/clean the blocking dirty paths outside Scout's allowed write set, then rerun the Scout job. Do not force Scout through the dirty gate while wiki synthesis/log files and top-level `state/` files are unreviewed.
