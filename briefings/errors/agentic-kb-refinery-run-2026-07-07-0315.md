# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-07-07 03:15:32 PDT
- **Failed stage:** pre-run dirty-worktree safety check
- **Status:** blocked before source processing; no raw files processed

## Blocked reason

`git status --porcelain` showed dirty files outside the user-approved dirty-worktree allowlist.

```text
M logs/kb-dev-server.log
?? briefings/scout-2026-07-06.md
```

The user instruction for this run allowed ignoring only these exact noisy log files:

- `logs/web-server-error.log`
- `logs/web-server.log`

It also allowed expected Refinery write paths, including `briefings/`. Therefore:

- `briefings/scout-2026-07-06.md` is inside an expected write path and did not block the run.
- `logs/kb-dev-server.log` is outside the user-approved allowlist and blocked the run.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-07-07-0315.md`
- No wiki pages, state files, or raw files were written.

## Files that may need review

- `logs/kb-dev-server.log` — pre-existing dirty runtime log blocked this scheduled run under the narrower user-level allowlist.
- `briefings/scout-2026-07-06.md` — pre-existing untracked briefing under an expected write path; did not block, but should be committed/triaged if it is intended to persist.

## Rollback guidance

No source-processing changes were made. If this error briefing itself is not needed, it can be removed after review. Do not modify `raw/` to resolve this block.

## Safest next action

Decide whether `logs/kb-dev-server.log` should be reverted, committed, or explicitly added to the Refinery dirty-worktree allowlist in the job instruction. Then rerun the Refinery job.
