# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-07-24 23:05:59 PDT
- **Phase/stage failed:** pre-run dirty-worktree gate, before Scout fetch/raw capture/state mutation
- **Status:** blocked; no URL fetches attempted

## Blocked reason

`git status --porcelain` reported dirty files outside the Scout run's allowed write paths/exceptions.

Allowed Scout paths/exceptions per `playbooks/scout-run.md` and the scheduled job instruction are exactly:

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
 M .night-shift/state/scout-processed.json
 M raw/.ingest-hashes.json
?? briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md
?? briefings/scout-2026-07-23.md
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md
?? raw/framework-docs/x-twitter-2075854920738021682.md
?? raw/framework-docs/x-twitter-2076018000570785847.md
?? raw/framework-docs/x-twitter-2076231055443440105.md
```

Blocking dirty files outside the allowed Scout paths:

- `raw/.ingest-hashes.json` — modified; not an allowed Scout path.
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md` — untracked; not an allowed Scout path.

Non-blocking dirty files within allowed Scout paths/exceptions:

- `.night-shift/state/scout-processed.json`
- `briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md`
- `briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md`
- `briefings/scout-2026-07-23.md`
- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files written or attempted

Written:

- `briefings/errors/agentic-kb-scout-run-2026-07-24-2305.md`

Attempted but not written:

- No raw captures.
- No Scout state mutation.
- No normal Scout briefing.

## Queue/state observation

`raw/reading-list.md` still contains unchecked URLs. The state file currently records all visible queue URLs as processed, including the three X/Twitter URLs captured on 2026-07-23. Because the job blocked at the dirty-worktree gate, this run did not validate or repair the prior untracked captures.

## Files that may need review

- `raw/.ingest-hashes.json`
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md`
- `.night-shift/state/scout-processed.json`
- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`
- `briefings/scout-2026-07-23.md`

## Rollback guidance

No Scout raw captures or state changes were made by this run. If rollback is needed, remove only this error briefing:

```bash
rm briefings/errors/agentic-kb-scout-run-2026-07-24-2305.md
```

Do **not** remove or modify the dirty raw/state files unless Jay explicitly decides how to handle them.

## Safest next action for Jay

Decide whether `raw/.ingest-hashes.json` and the untracked `raw/clippings/...test-capture...md` file are expected outputs from another workflow. If yes, commit/stash them or add an explicit playbook allowance for the responsible job. If not, inspect and clean them manually. Then rerun Scout.
