# Agentic-KB Editor Run — Blocked

- **Job name:** agentic-kb-editor-run
- **Job ID:** Not available in cron context
- **Timestamp:** 2026-07-23T20:49:52-0700
- **Failed stage:** Pre-run dirty-worktree safety gate
- **Status:** blocked

## Reason
The Editor Run stopped before making normal wiki/state/briefing changes because `git status --porcelain` showed dirty files outside the user-authorized Editor write paths.

User-authorized Editor write paths for this run:
- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`

User-authorized noisy-log exceptions for this run:
- `logs/web-server-error.log`
- `logs/web-server.log`

Dirty files outside that active allowlist:

```text
 M .cursor/hooks/state/continual-learning.json
 M logs/agent-runtime.log
 M raw/.compiled-log.json
 M raw/reading-list.md
 M wiki/_meta/compile-log.md
 M wiki/_meta/proposals.md
 M wiki/candidates.md
 M wiki/frameworks/framework-obsidian-wiki.md
 M wiki/log.md
?? wiki/concepts/agent-layer-architecture.md
?? wiki/concepts/capture-pipeline.md
?? wiki/concepts/compile-once-knowledge.md
?? wiki/concepts/foundry-capture-pipeline.md
?? wiki/concepts/kb-inbox-workflow.md
?? wiki/concepts/kb-inbox.md
?? wiki/concepts/knowledge-vault-feedback-loop.md
?? wiki/concepts/morning-review-pipeline.md
?? wiki/concepts/solo-founder-ai-leverage.md
?? wiki/entities/garry-tan.md
?? wiki/entities/hermes-agent.md
?? wiki/frameworks/12-layer-agent-map.md
?? wiki/frameworks/gbrain.md
?? wiki/frameworks/headroom.md
?? wiki/patterns/layer-evidence-verification.md
?? wiki/patterns/pattern-morning-review.md
?? wiki/patterns/pattern-specialist-agent-team.md
?? wiki/recipes/five-agent-business-ops.md
?? wiki/recipes/obsidian-smart-vault-setup.md
```

Also present but inside expected/error paths:

```text
?? briefings/errors/agentic-kb-editor-run-2026-07-12-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-12-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-23-2045.md
?? briefings/errors/agentic-kb-scout-run-2026-07-11-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-12-2306.md
?? briefings/errors/agentic-kb-scout-run-2026-07-14-2325.md
?? wiki/syntheses/synthesis-compression-vs-trajectory-eval.md
?? wiki/syntheses/synthesis-provenance-freshness-infrastructure.md
?? wiki/syntheses/synthesis-skillopt-pow-writeback.md
```

## Files read
- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-editor-run-notes.md`
- `.night-shift/state/editor-state.json`
- `wiki/log.md` (read attempt returned first 1,065 lines before truncation)

## Files written or attempted
- Written: `briefings/errors/agentic-kb-editor-run-2026-07-23-2049.md`
- Not attempted due to safety block:
  - normal `briefings/2026-07-23.md`
  - `.night-shift/state/editor-state.json` update
  - any `wiki/syntheses/` creation/update

## Files that may need review
Review the dirty files listed above before rerunning the Editor Run, especially:
- `raw/.compiled-log.json` and `raw/reading-list.md` because scheduled Editor runs must not mutate raw/source paths.
- `wiki/log.md`, `wiki/candidates.md`, `wiki/_meta/*`, and untracked wiki pages because they may represent an unfinished Scout/Refinery/compile operation.
- `logs/agent-runtime.log` because it is a log file outside the two exact noisy-log exceptions authorized by the user.

## Rollback guidance
This run made no normal wiki/state changes and did not modify `raw/`. The only file created by this run is this error briefing.

To restore a clean baseline, inspect the pre-existing dirty files with `git diff` / `git status`, then either commit intentional changes or stash/revert unintended ones. Do not delete untracked wiki pages until their provenance is checked.

## Safest next action
Resolve or intentionally commit/stash the dirty files outside `.night-shift/state/`, `briefings/`, `wiki/syntheses/`, `logs/web-server-error.log`, and `logs/web-server.log`, then rerun `agentic-kb-editor-run`.
