# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** not available
- **Timestamp:** 2026-08-14 23:06:03 PDT
- **Phase/stage failed:** pre-run dirty-worktree safety gate, before URL fetch/capture/state mutation
- **Status:** blocked; no Scout captures attempted

## Blocked Reason

`git status --porcelain` showed dirty files outside the Scout allowlist. The local playbook requires Scout to stop before fetching or writing source captures when any dirty file exists outside the exact allowed paths.

Observed dirty files:

```text
M .night-shift/state/editor-state.json
?? briefings/2026-08-14.md
?? wiki/daily-systems/logs/2026-08-14.md
```

Allowed for Scout:
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

The blocker is:

```text
?? wiki/daily-systems/logs/2026-08-14.md
```

The other dirty files are inside Scout-allowed paths, but the wiki daily-systems log is not.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files Written or Attempted

Written:
- `briefings/errors/agentic-kb-scout-run-2026-08-14-2306.md`

Attempted:
- No raw captures attempted.
- No Scout state mutation attempted.
- No reading-list mutation attempted.

## Files That May Need Review

- `wiki/daily-systems/logs/2026-08-14.md` — untracked and outside Scout's allowed write paths.
- `.night-shift/state/editor-state.json` — modified but allowed for Scout; likely from Editor state.
- `briefings/2026-08-14.md` — untracked but allowed for Scout; likely from another scheduled run.

## Rollback Guidance

Do not delete or clean the dirty files blindly. First determine whether `wiki/daily-systems/logs/2026-08-14.md` is expected output from another job. If it is valid, stage/commit it or update Scout's playbook intentionally to allow that path. If it is stray output, move or remove it only after confirming it is not needed.

This Scout run itself only created this error briefing. To roll back this run, remove:

```text
briefings/errors/agentic-kb-scout-run-2026-08-14-2306.md
```

## Safest Next Action

Review and resolve `wiki/daily-systems/logs/2026-08-14.md`. Then rerun Scout. It should resume from `.night-shift/state/scout-processed.json` and process only unchecked URLs not already recorded there.
