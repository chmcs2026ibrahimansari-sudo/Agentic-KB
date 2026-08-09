# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-05 02:20:23 EDT
- **Phase/stage failed:** Pre-run dirty-worktree gate, before fetching URLs or writing raw/state captures

## Blocked reason

`git status --porcelain` showed dirty files outside the Scout allowlist. The local playbook requires Scout to stop before fetch/write/state mutation when any dirty file appears outside the exact allowed paths.

Blocking dirty paths:

```text
 M web/next-env.d.ts
?? wiki/daily-systems/logs/2026-08-04.md
```

Allowed dirty paths observed but not considered blockers:

```text
 M raw/reading-list.md
?? briefings/errors/agentic-kb-editor-run-2026-08-02-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-08-03-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-03-0316.md
?? briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md
?? briefings/errors/agentic-kb-scout-run-2026-08-02-2306.md
?? briefings/errors/agentic-kb-scout-run-2026-08-03-2305.md
?? briefings/scout-2026-07-31.md
```

## Files read

- `AGENTS.md` — terminal preview read after `read_file` classified it as binary; enough to confirm the local schema and raw immutability rules.
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-08-05-0220.md`
- No raw captures written.
- No state updates written.
- No URLs fetched.

## Files that may need review

- `web/next-env.d.ts` — dirty outside Scout's allowed paths.
- `wiki/daily-systems/logs/2026-08-04.md` — untracked outside Scout's allowed paths.

## Rollback guidance

Scout made no raw/state changes before blocking. To unblock the next run, Jay should inspect the two blocking paths and either commit, intentionally keep, move, or stash them. Do not blindly delete or revert without checking ownership, especially because `wiki/daily-systems/logs/2026-08-04.md` may be from another scheduled workflow.

## Safest next action

Review the two blocking files, then rerun Scout after the worktree is clean except for the Scout allowlist paths.
