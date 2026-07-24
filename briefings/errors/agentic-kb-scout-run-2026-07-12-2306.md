# Agentic-KB Scout Run Error Briefing — 2026-07-12 23:06

- **Job name:** Agentic-KB Scout Run
- **Job ID:** scheduled cron job; runtime job ID not available in this session
- **Timestamp:** 2026-07-12 23:06:12 -0700
- **Phase/stage failed:** Pre-run dirty-worktree safety check
- **Status:** BLOCKED before Scout writes or URL fetches

## Error / blocked reason

Scout must stop before making changes when `git status --porcelain` shows dirty files outside its allowed write paths.

Allowed Scout paths/exceptions for this run were exactly:

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

The worktree had dirty files outside those paths:

```text
 M .cursor/hooks/state/continual-learning.json
 M logs/agent-runtime.log
 M raw/.compiled-log.json
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

Allowed dirty/untracked files that did not cause the block:

```text
?? briefings/errors/agentic-kb-editor-run-2026-07-12-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-12-0316.md
?? briefings/errors/agentic-kb-scout-run-2026-07-11-2305.md
```

`raw/reading-list.md` and `.night-shift/state/scout-processed.json` were read. All unchecked URLs currently listed in `raw/reading-list.md` are already present in `.night-shift/state/scout-processed.json`, but Scout still blocked because the pre-run dirty-worktree policy is mandatory before any scheduled write/fetch cycle.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-07-12-2306.md`
- No raw captures written.
- No state file changes written.
- No URL fetches attempted after the dirty-worktree block.

## Files that may need review

Review or intentionally preserve/commit/stash the dirty files outside Scout's allowed paths, especially:

- `.cursor/hooks/state/continual-learning.json`
- `logs/agent-runtime.log`
- `raw/.compiled-log.json`
- `wiki/_meta/compile-log.md`
- `wiki/_meta/proposals.md`
- `wiki/candidates.md`
- `wiki/frameworks/framework-obsidian-wiki.md`
- `wiki/log.md`
- the untracked `wiki/` concept/entity/framework/pattern/recipe/synthesis files listed above

## Rollback guidance

No Scout data changes were made beyond this error briefing. To roll back this Scout run only, remove:

```bash
rm briefings/errors/agentic-kb-scout-run-2026-07-12-2306.md
```

Do **not** roll back or delete the dirty wiki/raw/log files from this job context; they pre-existed this Scout run and need owner review.

## Safest next action for Jay

Decide whether the pre-existing dirty `wiki/`, `raw/.compiled-log.json`, `.cursor/`, and non-allowlisted log changes should be committed, stashed, or reverted. After the worktree is clean except for explicitly allowed Scout paths, rerun Scout. Since the current reading list appears fully represented in `scout-processed.json`, the next clean Scout run will likely produce a no-op briefing unless new unchecked URLs are added.
