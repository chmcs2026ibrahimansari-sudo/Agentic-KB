# Agentic-KB Refinery Run — Blocked

- **Job name:** Agentic-KB Refinery Run
- **Job ID:** unavailable in cron prompt
- **Timestamp:** 2026-07-31T03:16:04-0700
- **Failed stage:** pre-run dirty-worktree safety check

## Blocked Reason

Refinery stopped before processing because `git status --porcelain` showed a dirty file outside the Refinery expected write paths and outside the two exact user-allowed noisy log exceptions.

Raw `git status --porcelain` output:

```text
 M .night-shift/state/editor-state.json
 M wiki/log.md
 M wiki/syntheses/synthesis-agentic-engineering-operating-model.md
?? briefings/2026-07-30.md
?? briefings/errors/agentic-kb-scout-run-2026-07-30-2306.md
```

Allowed by this run's user instruction:
- `.night-shift/state/editor-state.json` — inside `.night-shift/state/`
- `wiki/log.md` — expected Refinery path
- `briefings/2026-07-30.md` — inside `briefings/`
- `briefings/errors/agentic-kb-scout-run-2026-07-30-2306.md` — inside `briefings/`

Blocking dirty file:
- `wiki/syntheses/synthesis-agentic-engineering-operating-model.md` — outside expected Refinery write paths. Refinery is not permitted to ignore `wiki/syntheses/` for this run.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`

## Files Written or Attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-07-31-0316.md`
- No raw, wiki, summary, index, log, or state files were modified by this Refinery run.

## Files Needing Review

- `wiki/syntheses/synthesis-agentic-engineering-operating-model.md`

Also note pre-existing allowed dirty files that were not touched by this run:
- `.night-shift/state/editor-state.json`
- `wiki/log.md`
- `briefings/2026-07-30.md`
- `briefings/errors/agentic-kb-scout-run-2026-07-30-2306.md`

## Rollback Guidance

This run only wrote the error briefing above. To roll back this run, remove:

```bash
rm briefings/errors/agentic-kb-refinery-run-2026-07-31-0316.md
```

Do not reset or clean the other dirty files unless Jay confirms they are disposable.

## Safest Next Action

Review `wiki/syntheses/synthesis-agentic-engineering-operating-model.md` and either commit/stash it or explicitly authorize Refinery to run with `wiki/syntheses/` as an allowed dirty path. After that, rerun the Agentic-KB Refinery Run.
