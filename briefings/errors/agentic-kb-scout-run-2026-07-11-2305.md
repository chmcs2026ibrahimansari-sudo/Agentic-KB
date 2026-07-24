# Agentic-KB Scout Run — Blocked Error Briefing

- **Job name:** Agentic-KB Scout Run
- **Job ID:** not available in runtime context
- **Timestamp:** 2026-07-11 23:05:31 -0700
- **Phase/stage failed:** pre-run dirty-worktree safety check, before fetching URLs or writing raw captures/state
- **Status:** blocked; no Scout URL processing attempted

## Blocked Reason

Scout is only allowed to proceed when dirty worktree entries are limited to these paths/exceptions:

- `.night-shift/state/`
- `briefings/`
- `raw/framework-docs/`
- `raw/transcripts/`
- `raw/code-examples/`
- `logs/web-server-error.log`
- `logs/web-server.log`
- `logs/audit.log`
- `logs/kb-dev-server.log`
- `raw/reading-list.md`

`git status --porcelain` showed dirty files outside that allowlist, so the scheduled run stopped before making source captures.

## Dirty Files Blocking the Run

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
?? wiki/syntheses/synthesis-compression-vs-trajectory-eval.md
?? wiki/syntheses/synthesis-provenance-freshness-infrastructure.md
?? wiki/syntheses/synthesis-skillopt-pow-writeback.md
```

Notable: `logs/agent-runtime.log`, `raw/.compiled-log.json`, `web/next-env.d.ts`, `.cursor/hooks/state/continual-learning.json`, and the listed `wiki/` files are outside Scout's allowed dirty-path set. The playbook explicitly says not to ignore `logs/` or `raw/` broadly.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/` listing for `scout-processed.json`

## Files Written or Attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-07-11-2305.md`
- Attempted raw captures: none
- Attempted state writes: none
- Attempted reading-list edits: none

## Files That May Need Review

Review the dirty files listed above, especially:

- `raw/.compiled-log.json` — raw-path dirty file outside Scout's permitted raw capture folders.
- `wiki/log.md` plus the untracked `wiki/` pages — likely outputs from another KB job that need confirmation before Scout writes new raw sources.
- `logs/agent-runtime.log` — log file not in the Scout allowlist.
- `web/next-env.d.ts` and `.cursor/hooks/state/continual-learning.json` — unrelated generated/state files outside Scout's scope.

## Rollback Guidance

No Scout raw capture, state, or reading-list mutation was performed. To undo this blocked-run artifact only, remove this error briefing after reviewing it:

```bash
rm briefings/errors/agentic-kb-scout-run-2026-07-11-2305.md
```

Do **not** clean or revert the dirty files automatically; they may belong to another active job or manual workstream.

## Safest Next Action for Jay

Decide whether the existing dirty worktree entries are intentional. Commit, stash, or otherwise resolve the non-Scout changes, then rerun Scout. If these files are expected recurring outputs, update `playbooks/scout-run.md` deliberately with a narrower allowlist; do not broaden the Scout job to ignore `logs/`, `raw/`, or `wiki/` wholesale.
