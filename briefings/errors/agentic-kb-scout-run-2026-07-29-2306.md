# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** unavailable (scheduled Hermes cron invocation)
- **Timestamp:** 2026-07-29 23:06:16 -0700 PDT
- **Phase/stage failed:** Pre-run dirty-worktree safety gate, before URL fetching or raw/state mutation
- **Status:** BLOCKED

## Blocked reason

The Scout playbook requires `git status --porcelain` before making changes. The worktree has dirty files outside the allowed Scout write paths/exceptions.

Allowed Scout paths/exceptions are exactly:

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

Blocking dirty paths outside that allowlist:

```text
 M raw/.ingest-hashes.json
?? missions/
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md
?? wiki/daily-systems/logs/2026-07-28.md
?? wiki/daily-systems/logs/2026-07-29.md
```

Allowed dirty paths observed but not treated as blockers:

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
?? briefings/errors/agentic-kb-scout-run-2026-07-28-2306.md
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
- Hermes skill: `hermes-obsidian-knowledge-loop`
- Hermes skill reference: `references/agentic-kb-scout-run-notes.md`
- Hermes skill: `web-extract`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-07-29-2306.md`
- No URL fetches attempted.
- No raw captures attempted.
- No Scout state mutations attempted.
- `raw/reading-list.md` was not modified.

## Files that may need review

Review/resolve these non-Scout dirty paths before the next unattended Scout run:

- `raw/.ingest-hashes.json`
- `missions/`
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md`
- `wiki/daily-systems/logs/2026-07-28.md`
- `wiki/daily-systems/logs/2026-07-29.md`

Also consider whether the accumulated untracked briefing/error files should be committed or intentionally ignored; they are allowed for Scout but still add noise to repository review.

## Rollback guidance

No Scout raw captures or state changes were made during this run. The only new file from this run is this error briefing. If you want to remove it after triage, delete:

```bash
rm briefings/errors/agentic-kb-scout-run-2026-07-29-2306.md
```

Do **not** blindly reset or clean the listed blocking paths; they may be user- or job-generated work from another workflow. Inspect them first.

## Safest next action for Jay

Run `git status --porcelain` in `/Users/jaywest/Agentic-KB`, then either commit, stash, explicitly approve, or move the non-Scout dirty paths outside the worktree. Once those are resolved, rerun Scout. The unchecked URLs in `raw/reading-list.md` are already recorded in `.night-shift/state/scout-processed.json`, so Scout would likely be a no-op unless new unchecked URLs are added or state is intentionally reset.
