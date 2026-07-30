# Agentic-KB Refinery Run — Blocked

- **Job name:** Agentic-KB Refinery Run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-07-28T03:15:59-0700
- **Failed stage:** pre-run dirty-worktree safety check
- **Status:** blocked before any Refinery processing or wiki/state mutation

## Blocked Reason

The worktree contained dirty files outside the Refinery expected write paths and outside the two user-allowed noisy log exceptions (`logs/web-server-error.log`, `logs/web-server.log`). Per the run instruction and Night Shift rules, Refinery must stop before processing sources.

Disallowed dirty paths detected by `git status --porcelain`:

```text
 M raw/.ingest-hashes.json
?? missions/
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md
?? raw/framework-docs/x-twitter-2075854920738021682.md
?? raw/framework-docs/x-twitter-2076018000570785847.md
?? raw/framework-docs/x-twitter-2076231055443440105.md
```

Allowed/expected dirty paths that did not block this run but were present:

```text
 M .night-shift/state/scout-processed.json
?? briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-07-25-0626.md
?? briefings/errors/agentic-kb-editor-run-2026-07-26-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-07-27-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-25-0315.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-26-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-27-0316.md
?? briefings/errors/agentic-kb-scout-run-2026-07-24-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-25-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-26-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-27-2313.md
?? briefings/scout-2026-07-23.md
```

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`
- `git status --porcelain` output

## Files Written or Attempted

- `briefings/errors/agentic-kb-refinery-run-2026-07-28-0315.md`

No raw files, wiki pages, normal briefings, or Refinery state files were modified by this run.

## Files That May Need Review

- `raw/.ingest-hashes.json` — modified raw-side state file; raw is supposed to be immutable for scheduled runs.
- `missions/` — untracked directory outside expected Refinery write paths.
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md` — untracked raw clipping.
- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`

## Rollback Guidance

No Refinery content work was performed, so there is no Refinery-specific rollback. The only new artifact from this run is this error briefing. If needed, remove or commit this briefing after reviewing the dirty-worktree issue.

Do not automatically revert or delete the dirty raw/mission files: they may be human captures or outputs from another job. Review provenance first.

## Safest Next Action

Decide whether the disallowed dirty paths should be committed, moved into an expected workflow, or reverted. After the worktree is clean outside allowed Refinery paths, rerun the Agentic-KB Refinery job.
