# Agentic-KB Refinery Run — Blocked

- **Job name:** Agentic-KB Refinery Run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-29T10:15:58-0700 PDT
- **Failed stage:** Pre-run dirty-worktree safety check, before any Refinery mutations

## Blocked reason

The worktree contains a dirty file outside the expected Refinery write paths and outside the two exact noisy log files allowed by the user-level job instruction.

`git status --porcelain` returned:

```text
?? briefings/errors/agentic-kb-scout-run-2026-08-29-1010.md
?? scripts/tmp-kb-intel-20260829.sh
```

Allowed by this run's policy:
- `briefings/errors/agentic-kb-scout-run-2026-08-29-1010.md` is under `briefings/`, an expected write path.

Blocking:
- `scripts/tmp-kb-intel-20260829.sh` is outside the expected Refinery write paths and is not one of the allowed noisy logs (`logs/web-server-error.log`, `logs/web-server.log`).

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`

## Files written or attempted

- Wrote this error briefing: `briefings/errors/agentic-kb-refinery-run-2026-08-29-1015.md`
- No `raw/` files were modified.
- No wiki pages, index, log, or Refinery state were modified.

## Files needing review

- `scripts/tmp-kb-intel-20260829.sh` — determine whether this is intentional work, a leftover temp script, or safe to remove.
- `briefings/errors/agentic-kb-scout-run-2026-08-29-1010.md` — pre-existing allowed briefing; not reviewed or modified by this run.

Post-write verification re-ran `git status --porcelain` and saw additional dirty paths that were not part of this run's intended work:

```text
 M wiki/_meta/compile-log.md
 M wiki/candidates.md
?? scripts/tmp-append-daily-20260829.sh
```

These appeared after the initial pre-run check and were not edited by this Refinery run. They also need review before rerunning unattended mutable jobs.

## Rollback guidance

If this blocked run should leave no trace, remove only this newly written error briefing:

```bash
rm briefings/errors/agentic-kb-refinery-run-2026-08-29-1015.md
```

Do not remove or alter `scripts/tmp-kb-intel-20260829.sh` without Jay's confirmation or a separate cleanup task.

## Safest next action

Review `scripts/tmp-kb-intel-20260829.sh`. If it is disposable, delete or move it intentionally, then rerun the Refinery job. If it is active work, commit/stash it or add a documented playbook exception before allowing unattended Refinery mutations.
