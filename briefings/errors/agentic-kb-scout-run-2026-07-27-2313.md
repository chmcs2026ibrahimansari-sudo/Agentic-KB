# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** not available
- **Timestamp:** 2026-07-27 23:13:14 -0700
- **Phase/stage failed:** pre-run dirty-worktree safety check, before fetching URLs or writing raw captures

## Error / blocked reason
The Scout Run is blocked because `git status --porcelain` showed dirty files outside the Scout playbook's allowed write paths/exceptions.

Allowed Scout write paths/exceptions are exactly:
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

Blocking dirty paths detected:
- `raw/.ingest-hashes.json`
- `missions/`
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md`

Other dirty paths were within allowed Scout paths/exceptions and are not the blocker:
- `.night-shift/state/scout-processed.json`
- `briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md`
- `briefings/errors/agentic-kb-editor-run-2026-07-25-0626.md`
- `briefings/errors/agentic-kb-editor-run-2026-07-26-0625.md`
- `briefings/errors/agentic-kb-editor-run-2026-07-27-0625.md`
- `briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md`
- `briefings/errors/agentic-kb-refinery-run-2026-07-25-0315.md`
- `briefings/errors/agentic-kb-refinery-run-2026-07-26-0316.md`
- `briefings/errors/agentic-kb-refinery-run-2026-07-27-0316.md`
- `briefings/errors/agentic-kb-scout-run-2026-07-24-2305.md`
- `briefings/errors/agentic-kb-scout-run-2026-07-25-2305.md`
- `briefings/errors/agentic-kb-scout-run-2026-07-26-2305.md`
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

## Files written or attempted
- Written: `briefings/errors/agentic-kb-scout-run-2026-07-27-2313.md`
- Attempted: no raw captures, no state updates, no normal Scout briefing

## Files that may need review
- `raw/.ingest-hashes.json`
- `missions/`
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md`
- Existing untracked/modified Scout outputs may also need cleanup or committing, but they are inside allowed Scout paths.

## Rollback guidance
No Scout source capture or state mutation was performed in this run. To roll back this run only, remove this error briefing:

```bash
rm briefings/errors/agentic-kb-scout-run-2026-07-27-2313.md
```

Do not remove or reset the blocking files until Jay confirms whether they are expected work-in-progress, generated artifacts to commit, or accidental noise.

## Safest next action for Jay
Review and either commit, stash, or explicitly authorize ignoring the three blocking dirty paths above. Then rerun the Agentic-KB Scout Run.
