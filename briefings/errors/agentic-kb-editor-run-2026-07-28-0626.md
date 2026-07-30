# Agentic-KB Editor Run — Blocked Error Briefing

- **Job name:** agentic-kb-editor-run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-07-28 06:26:15 PDT
- **Failed stage:** Pre-run dirty-worktree safety gate, before synthesis review or state mutation
- **Status:** blocked

## Blocked Reason

`git status --porcelain` from `/Users/jaywest/Agentic-KB` showed dirty files outside the active Editor Run allowlist.

Active allowlist from the user instruction:
- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`
- exactly `logs/web-server-error.log`
- exactly `logs/web-server.log`

The playbook includes broader exceptions (`logs/audit.log`, `logs/kb-dev-server.log`, `raw/reading-list.md`), but the user instruction is stricter, so the stricter allowlist was applied.

Blocking dirty paths outside the allowlist:

```text
 M raw/.ingest-hashes.json
?? missions/2026/mission-command-center-validation/runs/run-20260725152355/outputs/artifacts/.pi-hermes/events.jsonl
?? missions/2026/mission-command-center-validation/runs/run-20260725152355/outputs/artifacts/.pi-hermes/hermes.raw.log
?? missions/2026/mission-command-center-validation/runs/run-20260725152355/outputs/artifacts/.pi-hermes/request.json
?? missions/2026/mission-command-center-validation/runs/run-20260725152355/outputs/artifacts/.pi-hermes/result.json
?? missions/2026/mission-command-center-validation/runs/run-20260725152355/outputs/request.json
?? missions/2026/mission-missioncontrol-factory-e2e/runs/run-pi-review/outputs/.pi-hermes/events.jsonl
?? missions/2026/mission-missioncontrol-factory-e2e/runs/run-pi-review/outputs/.pi-hermes/hermes.raw.log
?? missions/2026/mission-missioncontrol-factory-e2e/runs/run-pi-review/outputs/.pi-hermes/request.json
?? missions/2026/mission-missioncontrol-factory-e2e/runs/run-pi-review/outputs/.pi-hermes/result.json
?? missions/2026/mission-missioncontrol-factory-e2e/runs/run-pi-review/outputs/pi_review_validation_report.md
?? missions/2026/mission-missioncontrol-repo-review/runs/run-2026-07-27T14-52-13-0700/outputs/artifacts/.pi-hermes/events.jsonl
?? missions/2026/mission-missioncontrol-repo-review/runs/run-2026-07-27T14-52-13-0700/outputs/artifacts/.pi-hermes/hermes.raw.log
?? missions/2026/mission-missioncontrol-repo-review/runs/run-2026-07-27T14-52-13-0700/outputs/artifacts/.pi-hermes/request.json
?? missions/2026/mission-missioncontrol-repo-review/runs/run-2026-07-27T14-52-13-0700/outputs/artifacts/.pi-hermes/result.json
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md
?? raw/framework-docs/x-twitter-2075854920738021682.md
?? raw/framework-docs/x-twitter-2076018000570785847.md
?? raw/framework-docs/x-twitter-2076231055443440105.md
```

Dirty paths observed inside the Editor allowlist and therefore not blocking by themselves:

```text
 M .night-shift/state/scout-processed.json
?? briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-07-25-0626.md
?? briefings/errors/agentic-kb-editor-run-2026-07-26-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-07-27-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-25-0315.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-26-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-27-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-28-0315.md
?? briefings/errors/agentic-kb-scout-run-2026-07-24-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-25-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-26-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-27-2313.md
?? briefings/scout-2026-07-23.md
```

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- `wiki/log.md` first 200 lines, including recent 2026-07-10 and 2026-06-25 entries
- `.night-shift/state/editor-state.json`
- Hermes skill: `hermes-obsidian-knowledge-loop`
- Hermes skill reference: `references/agentic-kb-editor-run-notes.md`

## Files Written or Attempted

- Wrote this error briefing: `briefings/errors/agentic-kb-editor-run-2026-07-28-0626.md`
- Did **not** update `.night-shift/state/editor-state.json` because the run was blocked before normal Editor processing.
- Did **not** create or update any `wiki/syntheses/` pages.
- Did **not** modify `raw/`.

## Files That May Need Review

- `raw/.ingest-hashes.json` — modified inside immutable/raw-adjacent processing metadata; verify whether this was produced by a previous Refinery run and should be committed, moved to `.night-shift/state/`, or reverted.
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md` — untracked raw capture; decide whether to commit as intentional intake or remove if test debris.
- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`
- `missions/2026/...` untracked Pi/Hermes mission output artifacts — decide whether `missions/` is intended to be versioned, gitignored, or relocated outside the Agentic-KB vault.
- Prior untracked error briefings from Scout/Refinery/Editor runs under `briefings/errors/`, which are allowed for this job but indicate the Night Shift pipeline has been blocked for several consecutive days.

## Rollback Guidance

This run only added the current error briefing. To roll back this run specifically, remove:

```text
briefings/errors/agentic-kb-editor-run-2026-07-28-0626.md
```

Do not bulk-clean the worktree until Jay has reviewed whether the untracked `raw/` and `missions/` files are intentional records.

## Safest Next Action

Resolve the dirty-worktree gate before rerunning Editor:

1. Review and either commit, move, gitignore, or revert the blocking `raw/` and `missions/` changes.
2. Decide whether `raw/.ingest-hashes.json` should remain under `raw/` or move into `.night-shift/state/` to match Night Shift idempotency rules.
3. Rerun `agentic-kb-editor-run` after `git status --porcelain` shows no dirty paths outside the Editor allowlist.
