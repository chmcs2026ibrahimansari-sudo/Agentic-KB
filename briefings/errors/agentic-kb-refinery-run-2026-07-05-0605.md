---
title: Agentic-KB Refinery Run Blocked
job: agentic-kb-refinery-run
timestamp: 2026-07-05 06:05:38 -0500
status: blocked
---

# Agentic-KB Refinery Run Blocked

## Job
- **Job name:** agentic-kb-refinery-run
- **Job ID:** not available in cron prompt
- **Timestamp:** 2026-07-05 06:05:38 -0500

## Failed stage
Pre-run dirty-worktree safety check, before any Refinery writes to wiki/state/normal briefing outputs.

## Blocked reason
`git status --porcelain` reported a dirty file outside the user-approved Refinery write paths and outside the two exact noisy log exceptions allowed by the job prompt.

Dirty files reported:

```text
 M logs/kb-dev-server.log
?? briefings/errors/agentic-kb-editor-run-2026-07-04-0922.md
?? briefings/scout-2026-07-04.md
```

The two untracked briefing files are under `briefings/`, which is an expected Refinery write path. They are noted but not blocking.

The blocking file is:
- `logs/kb-dev-server.log`

The job prompt allowed ignoring exactly:
- `logs/web-server-error.log`
- `logs/web-server.log`

It explicitly said not to ignore `logs/` broadly. Although `playbooks/refinery-run.md` lists `logs/kb-dev-server.log` as an exception, the job prompt is narrower and controlling for this run.

## Files read
- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`

## Files written or attempted
- Written: `briefings/errors/agentic-kb-refinery-run-2026-07-05-0605.md`
- No wiki, raw, or state files were modified.

## Files that may need review
- `logs/kb-dev-server.log` — decide whether this should be committed, reverted, ignored, or explicitly allowed by the Refinery job prompt.
- `briefings/errors/agentic-kb-editor-run-2026-07-04-0922.md` — pre-existing untracked briefing file.
- `briefings/scout-2026-07-04.md` — pre-existing untracked briefing file.

## Rollback guidance
No Refinery processing occurred. To roll back this blocked-run artifact only, remove:

```bash
rm briefings/errors/agentic-kb-refinery-run-2026-07-05-0605.md
```

Do not delete or edit the raw source files; none were touched.

## Safest next action
Resolve or intentionally allow `logs/kb-dev-server.log`, then rerun the Agentic-KB Refinery job. If this log is expected runtime noise, update the user-level scheduled job instruction to include it explicitly; otherwise revert or commit it before rerunning.
