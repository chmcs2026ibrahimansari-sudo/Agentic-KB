# Agentic-KB Scout Run — BLOCKED

- **Job name:** Agentic-KB Scout Run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-21 23:05:29 PDT -0700
- **Phase/stage:** Pre-run dirty-worktree safety gate, before fetch/raw capture/state mutation
- **Status:** Blocked; Scout did not fetch URLs or mutate state.

## Blocked reason

`git status --porcelain` reported a dirty file outside the Scout allowlist:

```text
?? wiki/daily-systems/logs/2026-08-21.md
```

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

`wiki/daily-systems/logs/2026-08-21.md` is outside those paths, so the run stopped per `playbooks/scout-run.md`.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-08-21-2305.md`
- Attempted Scout captures: none
- Attempted Scout state updates: none

## Files that may need review

- `wiki/daily-systems/logs/2026-08-21.md` — pre-existing untracked file outside Scout's allowed write paths.

## Rollback guidance

No Scout raw captures or state changes were made. The only file created by this blocked run is this error briefing. If desired, remove this briefing after reviewing the blocked condition.

## Safest next action

Review and either commit, move, or intentionally clean up `wiki/daily-systems/logs/2026-08-21.md`. Re-run Scout after `git status --porcelain` contains only allowed Scout paths or is clean.
