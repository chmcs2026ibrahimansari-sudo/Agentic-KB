# Agentic-KB Scout Run — BLOCKED

- **Job name:** Agentic-KB Scout Run
- **Job ID:** scheduled cron job (ID not available in runtime)
- **Timestamp:** 2026-08-02 23:06:26 PDT
- **Phase/stage failed:** Pre-run dirty-worktree gate, before fetch/raw capture/state mutation
- **Status:** Blocked; no Scout fetches were attempted

## Blocked reason

`git status --porcelain` reported a dirty file outside the Scout allowed write paths/exceptions:

```text
 M web/next-env.d.ts
?? briefings/errors/agentic-kb-editor-run-2026-08-02-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md
?? briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md
?? briefings/scout-2026-07-31.md
```

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

The untracked files under `briefings/` are within the allowed Scout path. The blocker is `web/next-env.d.ts`.

## Files read

- `AGENTS.md` — loaded as project context; direct `read_file` attempt returned binary-file warning
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files written or attempted

- Wrote this error briefing: `briefings/errors/agentic-kb-scout-run-2026-08-02-2306.md`

No raw captures, reading-list edits, or Scout state updates were attempted.

## Files that may need review

- `web/next-env.d.ts` — dirty outside Scout's allowed paths; decide whether to keep, commit, or revert.
- Existing untracked briefing files:
  - `briefings/errors/agentic-kb-editor-run-2026-08-02-0625.md`
  - `briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md`
  - `briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md`
  - `briefings/scout-2026-07-31.md`

## Rollback guidance

No Scout data changes need rollback. This run only wrote the error briefing above.

If this error briefing is not wanted, remove `briefings/errors/agentic-kb-scout-run-2026-08-02-2306.md`. Do not modify raw captures or `.night-shift/state/scout-processed.json` for this run; they were not changed.

## Safest next action for Jay

Resolve the unrelated dirty file before the next Scout run:

```bash
cd /Users/jaywest/Agentic-KB
git diff -- web/next-env.d.ts
# then commit, stash, or restore it intentionally
```

After `git status --porcelain` contains only Scout-allowed paths/exceptions, rerun Scout.
