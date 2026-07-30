# Agentic-KB Refinery Run — Blocked Error Briefing

- **Job name:** Agentic-KB Refinery Run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-07-26T03:16:13-0700
- **Failed stage:** Pre-run dirty-worktree safety gate, before any Refinery processing or wiki/state mutation
- **Blocked reason:** `git status --porcelain` reported dirty files outside the user-approved Refinery write paths and outside the two exact noisy log exceptions (`logs/web-server-error.log`, `logs/web-server.log`). Per Night Shift rules and the job instruction, the run stopped instead of processing raw sources.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`

## Dirty-worktree output

```text
 M .night-shift/state/scout-processed.json
 M raw/.ingest-hashes.json
?? briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-07-25-0626.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-25-0315.md
?? briefings/errors/agentic-kb-scout-run-2026-07-24-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-25-2305.md
?? briefings/scout-2026-07-23.md
?? missions/
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md
?? raw/framework-docs/x-twitter-2075854920738021682.md
?? raw/framework-docs/x-twitter-2076018000570785847.md
?? raw/framework-docs/x-twitter-2076231055443440105.md
```

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-07-26-0316.md`
- Attempted but not written: none

## Files needing review

Blocking/unapproved paths:

- `raw/.ingest-hashes.json` — modified raw-side state file; Refinery is not allowed to mutate raw paths.
- `missions/` — untracked directory outside expected Refinery paths.
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md` — untracked raw capture; not an allowed dirty path for this run.
- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`

Allowed-by-path but pre-existing dirty files to be aware of:

- `.night-shift/state/scout-processed.json`
- Existing untracked `briefings/errors/*` files
- `briefings/scout-2026-07-23.md`

## Rollback guidance

No wiki pages, raw files, summaries, index, log, or Refinery state were changed by this run. To remove only this run's artifact, delete:

```bash
rm briefings/errors/agentic-kb-refinery-run-2026-07-26-0316.md
```

Do **not** clean or reset the listed dirty raw/mission files unless Jay explicitly approves; they may represent another worker's captures or in-progress state.

## Safest next action for Jay

Review and either commit/stash/classify the dirty files outside the approved Refinery paths, especially `raw/.ingest-hashes.json`, `missions/`, and the untracked raw captures. After the worktree is clean or the unapproved paths are intentionally handled, rerun the Refinery job.
