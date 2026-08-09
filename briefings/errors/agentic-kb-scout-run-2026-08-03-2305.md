# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-03 23:05 PDT
- **Phase/stage failed:** pre-run dirty-worktree safety gate, before URL fetches, raw captures, or state mutation

## Blocked reason

Scout was blocked because `git status --porcelain` showed a dirty file outside the Scout allowed write paths/exceptions:

```text
 M raw/reading-list.md
 M web/next-env.d.ts
?? briefings/errors/agentic-kb-editor-run-2026-08-02-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-08-03-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-03-0316.md
?? briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md
?? briefings/errors/agentic-kb-scout-run-2026-08-02-2306.md
?? briefings/scout-2026-07-31.md
```

Allowed Scout dirty/write paths are exactly:

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

`web/next-env.d.ts` is outside the allowed set, so the run stopped before Scout processing.

## Files read

- `AGENTS.md` — available as loaded project context for this cron run; direct `read_file` reported the file as binary
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files written or attempted

- Wrote this error briefing: `briefings/errors/agentic-kb-scout-run-2026-08-03-2305.md`
- No raw captures attempted
- No state mutation attempted
- No Scout daily briefing attempted because the run blocked before processing

## Files that may need review

- `web/next-env.d.ts` — dirty outside Scout's allowed write paths; decide whether to commit, revert, or intentionally allow in a future playbook change.
- Existing untracked `briefings/errors/*.md` and `briefings/scout-2026-07-31.md` are inside the allowed `briefings/` path and were not treated as blockers.
- `raw/reading-list.md` is dirty but explicitly allowed as the human/agent-maintained Scout intake queue.

## Rollback guidance

No Scout data writes were made besides this error briefing. To return to the pre-run state, remove only this file if desired:

```bash
rm briefings/errors/agentic-kb-scout-run-2026-08-03-2305.md
```

Do not remove or modify the other dirty files unless Jay explicitly decides how to handle them.

## Safest next action for Jay

Resolve the unexpected dirty file before the next Scout run:

1. Inspect `web/next-env.d.ts`.
2. Commit it if intentional, or revert it if generated/noisy.
3. Re-run Scout after `git status --porcelain` contains only the allowed Scout paths/exceptions.
