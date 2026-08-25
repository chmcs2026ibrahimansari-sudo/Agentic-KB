# Agentic-KB Refinery Run — Blocked

- **Job name:** Agentic-KB Refinery Run
- **Job ID:** `cron_f4bf62b0e7be_20260825_031504`
- **Timestamp:** 2026-08-25T03:15:23-0700 PDT
- **Failed stage:** Pre-run dirty-worktree safety check

## Blocked reason

The run stopped before processing raw sources because `git status --porcelain` showed a dirty file outside the Refinery expected write paths and outside the two exact noisy log exceptions allowed by the job instruction.

Observed dirty files:

```text
?? briefings/errors/agentic-kb-scout-run-2026-08-24-2305.md
?? wiki/daily-systems/logs/2026-08-24.md
```

Classification:

- `briefings/errors/agentic-kb-scout-run-2026-08-24-2305.md` is under `briefings/`, so it is within the job's allowed write-path family.
- `wiki/daily-systems/logs/2026-08-24.md` is outside the allowed Refinery paths: `.night-shift/state/`, `briefings/`, `wiki/summaries/`, `wiki/concepts/`, `wiki/patterns/`, `wiki/frameworks/`, `wiki/recipes/`, `wiki/evaluations/`, `wiki/personal/`, `wiki/index.md`, and `wiki/log.md`.

Per the Night Shift rules and the user-level instruction, the safest action was to stop and write this error briefing.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`
- Hermes skill: `cron/unattended-cron-operations`
- Hermes skill: `brain-ops`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-25-0315.md`

## Files needing review

- `wiki/daily-systems/logs/2026-08-24.md` — determine whether this untracked file is intentional and should be committed, moved into an allowed location by a human, or removed.
- `briefings/errors/agentic-kb-scout-run-2026-08-24-2305.md` — likely a valid prior error briefing, but still untracked.

## Rollback guidance

No raw files, wiki summaries, index, log, concepts, patterns, frameworks, recipes, evaluations, personal pages, or state files were modified by this run. To roll back this run only, remove this error briefing:

```bash
rm briefings/errors/agentic-kb-refinery-run-2026-08-25-0315.md
```

Do not remove or modify the pre-existing untracked files unless Jay explicitly decides their disposition.

## Safest next action

Review and resolve `wiki/daily-systems/logs/2026-08-24.md` first. Once the dirty worktree contains only allowed Refinery paths or committed/clean files, rerun the Agentic-KB Refinery job.
