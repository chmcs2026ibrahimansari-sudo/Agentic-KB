# Agentic-KB Scout Run Error Briefing

- **Job name:** Agentic-KB Scout Run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-24 23:05:41 PDT -0700
- **Phase/stage failed:** pre-run dirty-worktree safety gate, before any URL fetch, raw capture, or Scout state mutation

## Blocked reason

Scout is required to stop when `git status --porcelain` shows dirty files outside the exact Scout allowlist. The pre-run check returned:

```text
?? wiki/daily-systems/logs/2026-08-24.md
```

`wiki/daily-systems/logs/2026-08-24.md` is outside the Scout allowed write paths/exceptions:

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

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`

## Files written or attempted

- Wrote this error briefing: `briefings/errors/agentic-kb-scout-run-2026-08-24-2305.md`
- No raw captures attempted.
- No `.night-shift/state/scout-processed.json` mutation attempted.
- No `raw/reading-list.md` edits attempted.

## Files that may need review

- `wiki/daily-systems/logs/2026-08-24.md` — untracked pre-existing file outside Scout's allowed paths.

## Rollback guidance

No Scout raw/state changes were made, so there is no Scout rollback required. If this error briefing is unwanted noise after the dirty file is resolved, it can be removed or left as an audit artifact under `briefings/errors/`.

## Safest next action

Inspect `wiki/daily-systems/logs/2026-08-24.md`, then either commit it, intentionally keep it with an updated Scout allowlist/playbook if appropriate, or move/stash it outside the working tree. Re-run Scout after `git status --porcelain` has no dirty files outside the Scout allowlist.
