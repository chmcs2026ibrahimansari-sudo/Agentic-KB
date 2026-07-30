# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unknown
- **Timestamp:** 2026-07-27T03:16:22-0700
- **Failed stage:** pre-run dirty-worktree safety check, before any Refinery writes or raw processing

## Blocked Reason
The worktree has dirty files outside the user-approved Refinery write paths and outside the two exact noisy log exceptions (`logs/web-server-error.log`, `logs/web-server.log`). Per the run instructions and Night Shift rules, the Refinery must stop instead of processing raw sources.

Disallowed dirty paths from `git status --porcelain`:

```text
 M raw/.ingest-hashes.json
?? missions/
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md
?? raw/framework-docs/x-twitter-2075854920738021682.md
?? raw/framework-docs/x-twitter-2076018000570785847.md
?? raw/framework-docs/x-twitter-2076231055443440105.md
```

Dirty paths inside allowed write areas were observed but are not the blocker:

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
?? briefings/errors/agentic-kb-scout-run-2026-07-26-2305.md
?? briefings/scout-2026-07-23.md
```

## Files Read
- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`

## Files Written or Attempted
- Written: `briefings/errors/agentic-kb-refinery-run-2026-07-27-0316.md`
- No wiki pages, state files, or raw files were written by this run.

## Files That May Need Review
- `raw/.ingest-hashes.json`
- `missions/`
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md`
- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`

## Rollback Guidance
This run only created this error briefing. To roll back the run itself, remove:

```bash
rm briefings/errors/agentic-kb-refinery-run-2026-07-27-0316.md
```

Do **not** remove or modify the disallowed dirty files unless Jay confirms their provenance and desired disposition.

## Safest Next Action
Review and either commit, stash, or intentionally approve the disallowed dirty paths. Then rerun the Refinery. The raw files may be legitimate new intake from Scout/capture, but the current job instruction does not allow proceeding while they are untracked/modified outside the expected Refinery write paths.
