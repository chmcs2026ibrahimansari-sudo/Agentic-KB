# Agentic-KB Refinery Run — Blocked/Error Briefing

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-06 06:20:16 EDT
- **Failed stage:** pre-run dirty-worktree safety gate, before any Refinery processing or wiki/state mutation

## Error / blocked reason

The Refinery run is blocked by dirty worktree entries outside the user-approved Refinery write paths and outside the two exact noisy log exceptions.

User-approved exceptions for this run:
- Expected Refinery write paths: `.night-shift/state/`, `briefings/`, `wiki/summaries/`, `wiki/concepts/`, `wiki/patterns/`, `wiki/frameworks/`, `wiki/recipes/`, `wiki/evaluations/`, `wiki/personal/`, `wiki/index.md`, `wiki/log.md`
- Exact noisy logs only: `logs/web-server-error.log`, `logs/web-server.log`

Blocking dirty entries from `git status --porcelain`:
```text
 M raw/reading-list.md
 M web/next-env.d.ts
```

Notes:
- `raw/reading-list.md` is an intake/source file and was not included in the user-level dirty-worktree allowlist for this run, even though the playbook contains a broader local exception. The user instruction is narrower and controlling.
- `web/next-env.d.ts` is outside all approved Refinery write paths.
- No raw originals were edited, moved, deleted, archived, truncated, overwritten, or marked ingested by this run.

## Files read

- `AGENTS.md` — available as loaded project context; direct `read_file` returned a binary-display warning, so processing did not depend on additional AGENTS parsing beyond the loaded context.
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- `.night-shift/state/refinery-processed.json`
- `raw/inbox/` listing
- `raw/` search for `status: unprocessed`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-06-0620.md`
- No wiki pages, raw files, state records, or normal Refinery briefing were written.

## Files that may need review

- `raw/reading-list.md`
- `web/next-env.d.ts`
- Existing untracked briefing/log-style files shown by `git status --porcelain` may also need cleanup or commit review, but they are inside expected reporting/wiki paths and were not the primary blockers:
  - `briefings/errors/agentic-kb-editor-run-2026-08-02-0625.md`
  - `briefings/errors/agentic-kb-editor-run-2026-08-03-0625.md`
  - `briefings/errors/agentic-kb-editor-run-2026-08-05-0926.md`
  - `briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md`
  - `briefings/errors/agentic-kb-refinery-run-2026-08-03-0316.md`
  - `briefings/errors/agentic-kb-refinery-run-2026-08-05-0619.md`
  - `briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md`
  - `briefings/errors/agentic-kb-scout-run-2026-08-02-2306.md`
  - `briefings/errors/agentic-kb-scout-run-2026-08-03-2305.md`
  - `briefings/errors/agentic-kb-scout-run-2026-08-05-0220.md`
  - `briefings/scout-2026-07-31.md`
  - `wiki/daily-systems/logs/2026-08-04.md`
  - `wiki/daily-systems/logs/2026-08-05.md`

## Rollback guidance

This run only wrote the error briefing above. To roll back this run specifically, delete or revert:

```bash
git checkout -- briefings/errors/agentic-kb-refinery-run-2026-08-06-0620.md
```

If the file is untracked, remove it manually instead:

```bash
rm briefings/errors/agentic-kb-refinery-run-2026-08-06-0620.md
```

Do not run broad cleanup commands against `raw/` or `web/`; those changes pre-existed this blocked run and need human review.

## Safest next action for Jay

Decide whether the existing changes to `raw/reading-list.md` and `web/next-env.d.ts` should be committed, reverted, or explicitly allowed for the next Refinery run. After the worktree is clean or the allowlist is intentionally updated, re-run the Refinery job.
