# Agentic-KB Editor Run — Blocked/Error Briefing

- **Job name:** agentic-kb-editor-run
- **Job ID:** unavailable
- **Timestamp:** 2026-08-06 09:26:30 EDT (-0400)
- **Failed stage:** pre-run dirty-worktree safety check
- **Status:** blocked before normal Editor processing

## Error or Blocked Reason
The Editor Run stopped before reading state, reviewing recent wiki changes, or writing normal outputs because `git status --porcelain` showed dirty files outside the user-authorized Editor write paths.

User-authorized Editor write paths for this run:
- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`

User-authorized dirty-worktree exceptions:
- `logs/web-server-error.log`
- `logs/web-server.log`

Blocking dirty files found outside that allowlist:
- `M raw/reading-list.md`
- `M web/next-env.d.ts`
- `?? wiki/daily-systems/logs/2026-08-04.md`
- `?? wiki/daily-systems/logs/2026-08-05.md`

Non-blocking dirty files observed inside expected `briefings/` paths, but still worth human review because they are untracked prior run artifacts:
- `?? briefings/errors/agentic-kb-editor-run-2026-08-02-0625.md`
- `?? briefings/errors/agentic-kb-editor-run-2026-08-03-0625.md`
- `?? briefings/errors/agentic-kb-editor-run-2026-08-05-0926.md`
- `?? briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md`
- `?? briefings/errors/agentic-kb-refinery-run-2026-08-03-0316.md`
- `?? briefings/errors/agentic-kb-refinery-run-2026-08-05-0619.md`
- `?? briefings/errors/agentic-kb-refinery-run-2026-08-06-0620.md`
- `?? briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md`
- `?? briefings/errors/agentic-kb-scout-run-2026-08-02-2306.md`
- `?? briefings/errors/agentic-kb-scout-run-2026-08-03-2305.md`
- `?? briefings/errors/agentic-kb-scout-run-2026-08-05-0220.md`
- `?? briefings/scout-2026-07-31.md`

## Files Read
- `AGENTS.md` — available in loaded project context; direct read attempt returned a binary-file warning from the file reader.
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- Hermes Obsidian Knowledge Loop reference: `references/agentic-kb-editor-run-notes.md`
- `git status --porcelain` output

## Files Written or Attempted
- Wrote this error briefing: `briefings/errors/agentic-kb-editor-run-2026-08-06-0926.md`

No normal briefing was written. No `.night-shift/state/editor-state.json` update was attempted. No `wiki/syntheses/` files were created or modified. No `raw/` files were modified by this run.

## Files That May Need Review
Blocking files:
- `raw/reading-list.md` — outside this run's user-authorized allowlist, even though the playbook has a broader historical Scout-intake exception.
- `web/next-env.d.ts`
- `wiki/daily-systems/logs/2026-08-04.md`
- `wiki/daily-systems/logs/2026-08-05.md`

Also review the untracked `briefings/errors/` backlog and `briefings/scout-2026-07-31.md`; these do not block under the current path allowlist, but they indicate prior jobs have been generating uncommitted artifacts.

## Rollback Guidance
If this error briefing is not wanted, remove only:
- `briefings/errors/agentic-kb-editor-run-2026-08-06-0926.md`

Do **not** automatically clean, stash, or delete the blocking dirty files from an unattended run. They may be user work or outputs from other scheduled jobs.

## Safest Next Action for Jay
Review the blocking dirty files, then either commit/stash/resolve them or explicitly expand the Editor Run allowlist. After the worktree is clean except for approved paths, rerun the Agentic-KB Editor Run.
