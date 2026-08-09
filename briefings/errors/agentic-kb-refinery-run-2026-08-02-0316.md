# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-02T03:16:22-0700
- **Failed stage:** pre-run dirty-worktree safety check, before source processing or wiki writes

## Blocked reason

`git status --porcelain` showed a dirty file outside the expected Refinery write paths and outside the two exact noisy log exceptions allowed by the job prompt.

```text
 M wiki/lint-report.md
?? briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md
?? briefings/scout-2026-07-31.md
```

Blocking file:

- `wiki/lint-report.md` — not an expected Refinery write path.

Non-blocking pre-existing dirty files observed inside allowed Refinery write paths:

- `briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md`
- `briefings/scout-2026-07-31.md`

Per the job instruction, dirty-worktree safety may ignore exactly `logs/web-server-error.log` and `logs/web-server.log` as noisy logs, and expected Refinery write paths. It may not ignore `wiki/lint-report.md`, so the run stopped before processing sources.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md`
- No wiki pages, raw files, state files, index, or log files were modified by this run.

## Files needing review

- `wiki/lint-report.md` — decide whether this pre-existing modification should be committed, reverted, moved into an expected audit output path, or otherwise reconciled.
- `briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md` — pre-existing untracked Scout error briefing, allowed but should be reviewed/committed if valid.
- `briefings/scout-2026-07-31.md` — pre-existing untracked Scout briefing, allowed but should be reviewed/committed if valid.

## Rollback guidance

This run only created this error briefing. If needed, remove:

```bash
rm briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md
```

Do not change `raw/` to unblock the job.

## Safest next action

Review `wiki/lint-report.md` and either commit it, revert it, or move its content into an expected Night Shift output path. Then rerun the Refinery job.