# Agentic-KB Scout Run — Blocked Error Briefing

- **Job name:** Agentic-KB Scout Run
- **Job ID:** unknown (scheduled Hermes cron)
- **Timestamp:** 2026-07-25 23:05:45 PDT -0700
- **Phase/stage failed:** Pre-run dirty-worktree gate, before URL fetching or raw/state mutation

## Blocked reason

Scout stopped because `git status --porcelain` showed dirty files outside the allowed Scout write paths/exceptions.

Allowed Scout paths/exceptions for this run:

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

Blocking dirty paths observed:

```text
 M raw/.ingest-hashes.json
?? missions/
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md
```

Allowed dirty paths also observed, but not treated as blockers:

```text
 M .night-shift/state/scout-processed.json
?? briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-07-25-0626.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-25-0315.md
?? briefings/errors/agentic-kb-scout-run-2026-07-24-2305.md
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

## Files written or attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-07-25-2305.md`

No URLs were fetched. No raw captures were created. No Scout state was mutated by this run.

## Files that may need review

- `raw/.ingest-hashes.json` — modified outside Scout's allowed paths.
- `missions/` — untracked directory outside Scout's allowed paths.
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md` — untracked raw capture outside Scout's allowed raw capture folders.

## Rollback guidance

Do not rollback automatically from Scout. Review the three blocking paths and decide whether each should be committed, moved into an expected intake path, or removed. If they are intentional, land them before the next scheduled Scout run. If accidental, stash or clean them manually after confirming they are not needed.

## Safest next action for Jay

Inspect the blocking paths with `git status --porcelain` and resolve them before the next Scout run. Once the worktree only contains allowed Scout paths/exceptions, rerun Scout; the queue itself does not need editing because processed URL idempotency lives in `.night-shift/state/scout-processed.json`.
