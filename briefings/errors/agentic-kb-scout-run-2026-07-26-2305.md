# Agentic-KB Scout Run Error Briefing — 2026-07-26 23:05

- **Job name:** Agentic-KB Scout Run
- **Job ID:** scheduled cron job; explicit job ID unavailable in runtime context
- **Timestamp:** 2026-07-26T23:05:48-0700
- **Phase/stage failed:** Pre-run dirty-worktree safety gate, before URL fetch, raw capture, or Scout state mutation
- **Status:** BLOCKED

## Blocked reason

`git status --porcelain` showed dirty files outside the Scout playbook's allowed write paths/exceptions. Per `playbooks/scout-run.md`, Scout must stop before fetching or writing source captures when any dirty file outside the allowed paths is present.

Allowed Scout paths/exceptions checked against:

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

Dirty files that blocked the run:

```text
 M raw/.ingest-hashes.json
?? missions/
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md
```

Dirty files observed but within allowed Scout paths/exceptions:

```text
 M .night-shift/state/scout-processed.json
?? briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-07-25-0626.md
?? briefings/errors/agentic-kb-editor-run-2026-07-26-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-25-0315.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-26-0316.md
?? briefings/errors/agentic-kb-scout-run-2026-07-24-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-25-2305.md
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
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files written or attempted

Written:

- `briefings/errors/agentic-kb-scout-run-2026-07-26-2305.md`

Attempted but not performed due to safety gate:

- No URL fetches
- No raw source captures
- No `.night-shift/state/scout-processed.json` mutation
- No `briefings/scout-2026-07-26.md` normal Scout report

## Files that may need review

- `raw/.ingest-hashes.json` — dirty and outside Scout allowed paths; likely belongs to Refinery/idempotency, not Scout.
- `missions/` — untracked directory outside Scout allowed paths; review whether this is intentional project state.
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md` — untracked raw folder/file outside Scout allowed capture folders; review provenance and intended workflow.
- `.night-shift/state/scout-processed.json` — dirty but allowed for Scout; review separately if unexpected.
- Untracked prior error briefings and `briefings/scout-2026-07-23.md` — allowed path but may need commit/cleanup.
- Untracked `raw/framework-docs/x-twitter-*.md` captures — allowed Scout path; likely prior captures needing commit or processing.

## Rollback guidance

No Scout fetches, raw captures, or state changes were performed in this run. The only intentional write from this run is this error briefing. If this briefing itself needs removal, remove only:

```bash
rm briefings/errors/agentic-kb-scout-run-2026-07-26-2305.md
```

Do **not** delete or modify the blocked dirty files automatically; they may be legitimate work from another job or user workflow.

## Safest next action for Jay

Review and either commit, move, or explicitly approve handling of the blocking dirty paths:

1. `raw/.ingest-hashes.json`
2. `missions/`
3. `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md`

After those are resolved, rerun Scout. The Scout queue was not touched.
