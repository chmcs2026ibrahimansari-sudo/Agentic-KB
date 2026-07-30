# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** scheduled cron job; no explicit job ID provided
- **Timestamp:** 2026-07-28 23:06:32 PDT
- **Phase/stage failed:** pre-run dirty-worktree safety gate, before fetching URLs or mutating Scout state/raw captures
- **Status:** blocked; no source URLs fetched

## Blocked reason

`git status --porcelain` showed dirty files outside the Scout allowed write paths/exceptions.

Scout allowed paths/exceptions for this run were exactly:

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

Blocking dirty paths:

```text
 M raw/.ingest-hashes.json
?? missions/
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md
?? wiki/daily-systems/logs/2026-07-28.md
```

Allowed/non-blocking dirty paths observed:

```text
 M .night-shift/state/scout-processed.json
?? briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-07-25-0626.md
?? briefings/errors/agentic-kb-editor-run-2026-07-26-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-07-27-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-07-28-0626.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-25-0315.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-26-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-27-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-28-0315.md
?? briefings/errors/agentic-kb-scout-run-2026-07-24-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-25-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-26-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-27-2313.md
?? briefings/scout-2026-07-23.md
?? raw/framework-docs/x-twitter-2075854920738021682.md
?? raw/framework-docs/x-twitter-2076018000570785847.md
?? raw/framework-docs/x-twitter-2076231055443440105.md
```

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-07-28-2306.md`
- No raw capture files attempted.
- No state mutation attempted.
- No URL fetch attempted.

## Files that may need review

- `raw/.ingest-hashes.json` — modified, outside Scout's allowed paths.
- `missions/` — untracked directory, outside Scout's allowed paths.
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md` — untracked raw clipping outside Scout capture folders.
- `wiki/daily-systems/logs/2026-07-28.md` — untracked wiki/daily-systems log outside Scout's allowed paths.
- Existing untracked Scout raw captures and prior briefings under allowed paths should still be reviewed/committed separately, but they did not block this Scout run.

## Rollback guidance

No Scout-side raw/state changes were made during this run, so there is nothing from this run to roll back except this error briefing if Jay chooses to remove it.

Do **not** clean or reset the blocking files blindly. Review their origin first, then either commit/stash them, add the relevant path to the correct job-specific allowlist if appropriate, or move them into the vault's established intake path with explicit intent.

## Safest next action for Jay

Review and resolve the four blocking paths above. Once the worktree is clean except Scout-allowed paths, rerun Scout so it can process any unchecked URLs not already listed in `.night-shift/state/scout-processed.json`.
