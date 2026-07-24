# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-07-12 03:16:22 -0700
- **Failed stage:** pre-run dirty-worktree safety check
- **Status:** blocked before processing sources or writing wiki/state updates

## Blocked reason

`git status --porcelain` showed dirty files outside the expected Refinery write paths and outside the two explicitly allowed noisy log files (`logs/web-server-error.log`, `logs/web-server.log`). Per Night Shift rules and the user instruction for this scheduled run, the Refinery stopped before modifying the KB.

## Dirty files that blocked the run

```text
M .cursor/hooks/state/continual-learning.json
M logs/agent-runtime.log
M raw/.compiled-log.json
M web/next-env.d.ts
M wiki/_meta/compile-log.md
M wiki/_meta/proposals.md
M wiki/candidates.md
?? wiki/entities/garry-tan.md
?? wiki/entities/hermes-agent.md
?? wiki/frameworks/12-layer-agent-map.md
?? wiki/frameworks/gbrain.md
?? wiki/frameworks/headroom.md
?? wiki/syntheses/synthesis-compression-vs-trajectory-eval.md
?? wiki/syntheses/synthesis-provenance-freshness-infrastructure.md
?? wiki/syntheses/synthesis-skillopt-pow-writeback.md
```

Other dirty files are inside expected Refinery paths and were not blockers by themselves:

```text
M wiki/frameworks/framework-obsidian-wiki.md
M wiki/log.md
?? briefings/errors/agentic-kb-scout-run-2026-07-11-2305.md
?? wiki/concepts/agent-layer-architecture.md
?? wiki/concepts/capture-pipeline.md
?? wiki/concepts/compile-once-knowledge.md
?? wiki/concepts/foundry-capture-pipeline.md
?? wiki/concepts/kb-inbox-workflow.md
?? wiki/concepts/kb-inbox.md
?? wiki/concepts/knowledge-vault-feedback-loop.md
?? wiki/concepts/morning-review-pipeline.md
?? wiki/concepts/solo-founder-ai-leverage.md
?? wiki/patterns/layer-evidence-verification.md
?? wiki/patterns/pattern-morning-review.md
?? wiki/patterns/pattern-specialist-agent-team.md
?? wiki/recipes/five-agent-business-ops.md
?? wiki/recipes/obsidian-smart-vault-setup.md
```

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- `raw/inbox/` listing
- `raw/` search results for `status: unprocessed`
- `git status --porcelain` output

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-07-12-0316.md`
- No wiki pages, raw files, or state files were written.

## Files needing review

Review or intentionally preserve the blocking dirty files listed above before rerunning Refinery. Pay special attention to:

- `raw/.compiled-log.json` — raw path is outside scheduled Refinery write authority.
- `.cursor/hooks/state/continual-learning.json` — outside Agentic-KB Night Shift expected paths.
- `web/next-env.d.ts` — generated app file, outside Refinery scope.
- `logs/agent-runtime.log` — not one of the two explicitly allowed noisy logs for this run.
- `wiki/_meta/*`, `wiki/candidates.md`, `wiki/entities/*`, and `wiki/syntheses/*` — outside this Refinery run's expected write paths.

## Rollback guidance

No rollback is needed for Refinery changes because the job stopped before processing sources. The only new file from this run is this error briefing. If desired, remove it after reviewing the blocked state, but keeping it preserves the audit trail.

## Safest next action for Jay

Decide whether the blocking dirty files are intentional work-in-progress, generated noise to revert/ignore, or outputs from another job that should be committed. After the worktree is clean except for allowed Refinery paths and the two explicit noisy logs, rerun the Agentic-KB Refinery Run.
