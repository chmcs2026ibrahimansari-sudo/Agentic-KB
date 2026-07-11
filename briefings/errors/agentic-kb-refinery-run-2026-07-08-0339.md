# Agentic-KB Refinery Run — Blocked

- **Job name:** Agentic-KB Refinery Run
- **Job ID:** unavailable in cron prompt
- **Timestamp:** 2026-07-08T03:39:59-0700
- **Failed stage:** pre-run dirty-worktree safety check, before any Refinery processing or wiki/state writes

## Blocked Reason

`git status --porcelain` showed a dirty file outside the user-approved Refinery write paths and outside the two exact noisy log exceptions allowed by this run:

```text
M logs/kb-dev-server.log
?? briefings/errors/agentic-kb-editor-run-2026-07-07-0626.md
?? briefings/scout-2026-07-07.md
```

The run instructions allowed dirty-worktree safety to ignore only:

- `logs/web-server-error.log`
- `logs/web-server.log`

They explicitly said **do not ignore `logs/` broadly**. `logs/kb-dev-server.log` is therefore a blocker, even though the local playbook has a broader exception list. The user-level job instruction is controlling.

The untracked files under `briefings/` are inside an expected Refinery write path and did not block this run.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill: `hermes-obsidian-knowledge-loop/SKILL.md`
- Hermes skill reference: `references/agentic-kb-refinery-run-notes.md`

## Files Written or Attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-07-08-0339.md`
- No wiki pages, summaries, raw files, or state files were modified.

## Files That May Need Review

- `logs/kb-dev-server.log` — dirty and not allowed by this job's dirty-worktree policy.
- `briefings/errors/agentic-kb-editor-run-2026-07-07-0626.md` — untracked but inside expected briefing paths.
- `briefings/scout-2026-07-07.md` — untracked but inside expected briefing paths.

## Rollback Guidance

No rollback is needed for Refinery content because the job stopped before processing sources. If this error briefing itself is not wanted, remove only:

- `briefings/errors/agentic-kb-refinery-run-2026-07-08-0339.md`

Do not clean or modify `logs/kb-dev-server.log` unless Jay explicitly wants that local runtime log handled.

## Safest Next Action

Decide whether `logs/kb-dev-server.log` should be added to this cron job's explicit dirty-worktree allowlist or cleaned/ignored through repo hygiene. Then rerun the Refinery job. Until then, keep blocking to avoid silently operating over unexpected local changes.
