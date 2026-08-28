# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** not available in cron context
- **Timestamp:** 2026-08-28 03:16:10 PDT -0700
- **Failed stage:** pre-run dirty-worktree safety check, before any refinery processing or wiki/state writes

## Blocked Reason

`git status --porcelain` reported dirty files outside the user-allowed Refinery write paths and outside the two exact noisy log exceptions (`logs/web-server-error.log`, `logs/web-server.log`):

```text
 M state/notes-to-factory/ledger.md
?? wiki/daily-systems/logs/2026-08-27.md
```

Per the scheduled-run instructions, Refinery must stop rather than write summaries, index/log updates, or processed-state entries when unexpected dirty files are present.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- `.night-shift/state/refinery-processed.json`
- `wiki/index.md`
- `wiki/log.md` (first 500 lines)
- `raw/inbox/README.md` was identified as the only inbox file, but not read for processing

## Discovery Performed Before Block

- Current time captured via `date`: `2026-08-28 03:16:10 PDT -0700`
- Dirty-worktree check captured via `git status --porcelain`
- Raw candidates discovered but not processed:
  - 1 item under `raw/inbox/`: `raw/inbox/README.md`
  - 42 `status: unprocessed` matches under `raw/`; some are already present in `.night-shift/state/refinery-processed.json` and would require hash comparison before processing

## Files Written or Attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-28-0316.md`
- No wiki summaries, concept/pattern/framework pages, `wiki/index.md`, `wiki/log.md`, or `.night-shift/state/refinery-processed.json` updates were attempted.
- No files under `raw/` were modified.

## Files Needing Review

- `state/notes-to-factory/ledger.md` — modified outside allowed Refinery paths
- `wiki/daily-systems/logs/2026-08-27.md` — untracked outside allowed Refinery paths

## Rollback Guidance

No Refinery content changes were made. If this error briefing itself is not needed after review, it can be removed in a normal cleanup/commit flow, but do not delete it automatically from this unattended job.

For the pre-existing dirty files, review ownership before taking action:

```bash
git diff -- state/notes-to-factory/ledger.md
git status --porcelain -- wiki/daily-systems/logs/2026-08-27.md
```

Then either commit/stash those changes, add them to an explicitly approved allowlist for the relevant job, or rerun Refinery from a clean/expected worktree.

## Safest Next Action

Review the two dirty files, decide whether they should be committed, stashed, or ignored by a different job-specific policy, then rerun `agentic-kb-refinery-run`. Do not rerun Refinery until the dirty-worktree gate passes under the narrower user-level allowlist.
