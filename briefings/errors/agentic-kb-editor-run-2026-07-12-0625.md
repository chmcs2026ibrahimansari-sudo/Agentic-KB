# Agentic-KB Editor Run — Blocked

- **Job name:** agentic-kb-editor-run
- **Job ID:** not available in cron context
- **Timestamp:** 2026-07-12T06:25:41-0700
- **Failed stage:** Pre-run dirty-worktree gate, before Editor writes
- **Status:** blocked

## Reason

The Editor Run was blocked because `git status --porcelain` showed dirty files outside the user-approved Editor write paths.

Approved Editor write paths for this run:
- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`

Approved noisy log exceptions for this run:
- `logs/web-server-error.log`
- `logs/web-server.log`

Dirty files outside those paths/exceptions:

```text
 M .cursor/hooks/state/continual-learning.json
 M logs/agent-runtime.log
 M raw/.compiled-log.json
 M web/next-env.d.ts
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

Note: existing dirty files under `briefings/` and `wiki/syntheses/` were not blocking because they are within the expected Editor write paths. They may still need human review before the next clean run.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- `wiki/log.md`
- `.night-shift/state/editor-state.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-editor-run-notes.md`

## Files Written or Attempted

- Written: `briefings/errors/agentic-kb-editor-run-2026-07-12-0625.md`
- Attempted: none else

## Files Needing Review

Review and either commit, stash, or intentionally classify the blocking dirty files listed above. Pay special attention to:

- `raw/.compiled-log.json` — raw path changed; scheduled jobs must not mutate raw/source paths.
- `wiki/log.md`, `wiki/_meta/compile-log.md`, `wiki/_meta/proposals.md`, `wiki/candidates.md` — likely from another automation lane; should be reconciled before Editor synthesis.
- New untracked wiki pages under `wiki/concepts/`, `wiki/entities/`, `wiki/frameworks/`, `wiki/patterns/`, and `wiki/recipes/` — these are outside the Editor write scope and may represent an incomplete Refinery/compile run.
- `logs/agent-runtime.log` — not one of the two user-approved noisy log exceptions.

## Rollback Guidance

No Editor synthesis/state updates were made. To rollback this blocked run, remove only this error briefing if desired:

```bash
rm briefings/errors/agentic-kb-editor-run-2026-07-12-0625.md
```

Do **not** clean, reset, or delete the blocking dirty files until their source run is understood.

## Safest Next Action

Triage the dirty worktree first. Recommended sequence:

1. Inspect the blocking wiki/raw changes to determine whether they came from Scout, Refinery, compile, or manual work.
2. Commit or stash a coherent batch if the changes are valid.
3. Revert only files confirmed to be accidental or generated noise.
4. Re-run the Editor Run after `git status --porcelain` contains only approved Editor paths plus the two exact noisy logs.
