# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-26 03:15:19 PDT -0700
- **Failed stage:** pre-run dirty-worktree safety check

## Blocked Reason

The Refinery run stopped before processing sources because `git status --porcelain` showed a dirty file outside the allowed Refinery write paths and outside the two exact noisy log exceptions permitted by the run instruction.

```text
 M state/notes-to-factory/ledger.md
```

Allowed paths for this run were limited to:

- `.night-shift/state/`
- `briefings/`
- `wiki/summaries/`
- `wiki/concepts/`
- `wiki/patterns/`
- `wiki/frameworks/`
- `wiki/recipes/`
- `wiki/evaluations/`
- `wiki/personal/`
- `wiki/index.md`
- `wiki/log.md`
- `logs/web-server-error.log`
- `logs/web-server.log`

`state/notes-to-factory/ledger.md` is outside that allowlist, so continuing would risk mixing this scheduled job's writes with unrelated in-progress state.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`
- Hermes skill: `unattended-cron-operations`
- Hermes skill: `brain-ops`

## Files Written or Attempted

- Wrote this error briefing: `briefings/errors/agentic-kb-refinery-run-2026-08-26-0315.md`

No raw files, wiki pages, index, log, or Refinery state files were modified.

## Files Needing Review

- `state/notes-to-factory/ledger.md` — determine whether this change is expected, should be committed/stashed, or should be added to a future job-specific allowlist if appropriate.

## Rollback Guidance

If this error briefing is unwanted noise, it can be removed after review. Do **not** reset or clean `state/notes-to-factory/ledger.md` without confirming ownership of that change.

## Safest Next Action

Review `state/notes-to-factory/ledger.md`. Once the worktree is clean or the change is intentionally preserved outside this job, rerun the Agentic-KB Refinery Run.
