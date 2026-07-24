# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** scheduled cron job; no explicit job ID provided
- **Timestamp:** 2026-07-23 20:45:19 PDT
- **Failed stage:** pre-run dirty-worktree safety gate
- **Status:** blocked before processing raw sources

## Reason

The Refinery run was stopped before processing because `git status --porcelain` showed dirty files outside the user-approved Refinery write paths and outside the two exact noisy log exceptions.

The controlling prompt allowed dirty-worktree safety to ignore only:

- `logs/web-server-error.log`
- `logs/web-server.log`

Expected Refinery write paths were limited to:

- `.night-shift/state/`
- `briefings/`
- `wiki/summaries/`
- `wiki/concepts/`
- `wiki/patterns/`
- `wiki/frameworks/`
- `wiki/recipes/`
- `wiki/evaluations/`
- `wiki/personal/`
- `wiki/index.md`
- `wiki/log.md`

Dirty files outside that allowed set:

```text
M .cursor/hooks/state/continual-learning.json
M logs/agent-runtime.log
M raw/.compiled-log.json
M raw/reading-list.md
M wiki/_meta/compile-log.md
M wiki/_meta/proposals.md
M wiki/candidates.md
?? wiki/entities/garry-tan.md
?? wiki/entities/hermes-agent.md
?? wiki/syntheses/synthesis-compression-vs-trajectory-eval.md
?? wiki/syntheses/synthesis-provenance-freshness-infrastructure.md
?? wiki/syntheses/synthesis-skillopt-pow-writeback.md
```

Additional dirty files existed inside allowed Refinery paths and were not treated as blockers:

```text
M wiki/frameworks/framework-obsidian-wiki.md
M wiki/log.md
?? briefings/errors/agentic-kb-editor-run-2026-07-12-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-12-0316.md
?? briefings/errors/agentic-kb-scout-run-2026-07-11-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-12-2306.md
?? briefings/errors/agentic-kb-scout-run-2026-07-14-2325.md
?? wiki/concepts/agent-layer-architecture.md
?? wiki/concepts/capture-pipeline.md
?? wiki/concepts/compile-once-knowledge.md
?? wiki/concepts/foundry-capture-pipeline.md
?? wiki/concepts/kb-inbox-workflow.md
?? wiki/concepts/kb-inbox.md
?? wiki/concepts/knowledge-vault-feedback-loop.md
?? wiki/concepts/morning-review-pipeline.md
?? wiki/concepts/solo-founder-ai-leverage.md
?? wiki/frameworks/12-layer-agent-map.md
?? wiki/frameworks/gbrain.md
?? wiki/frameworks/headroom.md
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
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`

## Files written or attempted

- Wrote this error briefing: `briefings/errors/agentic-kb-refinery-run-2026-07-23-2045.md`

No raw files were modified. No wiki processing was performed.

## Files needing review

Review the dirty files listed above, especially the blocker paths under:

- `.cursor/hooks/state/`
- `logs/agent-runtime.log`
- `raw/`
- `wiki/_meta/`
- `wiki/candidates.md`
- `wiki/entities/`
- `wiki/syntheses/`

These may be legitimate work from another job or user session, but they are outside the current Refinery run's allowed mutation surface.

## Rollback guidance

Do not blindly reset the worktree. First inspect ownership and intent:

```bash
git status --porcelain
git diff -- .cursor/hooks/state/continual-learning.json logs/agent-runtime.log raw/.compiled-log.json raw/reading-list.md wiki/_meta/compile-log.md wiki/_meta/proposals.md wiki/candidates.md
```

For untracked files, inspect before deciding whether to add, move, or remove them:

```bash
git status --porcelain --untracked-files=all
```

If these changes are expected outputs from another scheduled job, either commit them, move them into that job's allowed paths, or update the relevant playbook/user-level dirty-worktree allowlist explicitly.

## Safest next action

Decide whether the dirty blocker files should be committed, cleaned, or added to an explicit job-specific allowlist. After the worktree is clean or the allowlist is intentionally expanded, rerun the Refinery job.
