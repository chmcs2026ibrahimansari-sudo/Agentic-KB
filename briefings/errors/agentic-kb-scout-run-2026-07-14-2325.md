# Agentic-KB Scout Run — Blocked Error Briefing

- **Job name:** Agentic-KB Scout Run
- **Job ID:** scheduled cron job; no explicit job ID available in runtime context
- **Timestamp:** 2026-07-14 23:25 local
- **Phase/stage failed:** Pre-run dirty-worktree safety check, before any Scout fetch/write/state mutation
- **Status:** Blocked; no URLs fetched, no raw captures written, no scout state updated

## Blocked reason

`git status --porcelain` showed dirty files outside the Scout run's allowed write paths/exceptions.

Allowed Scout write paths/exceptions per `playbooks/scout-run.md`:

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

Dirty files observed:

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
?? briefings/errors/agentic-kb-editor-run-2026-07-12-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-12-0316.md
?? briefings/errors/agentic-kb-scout-run-2026-07-11-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-12-2306.md
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

Allowed dirty paths observed were `raw/reading-list.md` and existing untracked files under `briefings/errors/`. The blocking files are the dirty paths outside Scout's allowed paths/exceptions: `.cursor/hooks/state/continual-learning.json`, `logs/agent-runtime.log`, `raw/.compiled-log.json`, and modified/untracked `wiki/**` files.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`

Note: `read_file` unexpectedly returned file-not-found for several existing vault files, so a read-only Python diagnostic was used from `/Users/jaywest/Agentic-KB` to verify and print the required local instructions.

## Files written or attempted

- Wrote this error briefing: `briefings/errors/agentic-kb-scout-run-2026-07-14-2325.md`

No raw capture files were attempted. No state file updates were attempted.

## Files that may need review

Review or intentionally stage/commit/park the blocking dirty files listed above before the next unattended Scout run. The highest-risk blockers for Scout are:

- `.cursor/hooks/state/continual-learning.json`
- `logs/agent-runtime.log` — not one of Scout's allowed noisy logs
- `raw/.compiled-log.json` — raw-side mutation outside allowed capture folders
- `wiki/**` modified/untracked pages — likely from prior Refinery/Editor work

## Rollback guidance

No Scout data mutations occurred. To roll back this run only, remove this one generated error briefing if desired:

```bash
rm briefings/errors/agentic-kb-scout-run-2026-07-14-2325.md
```

Do **not** bulk clean or reset the other dirty files without reviewing them; they appear to be pre-existing work from other jobs or manual edits.

## Safest next action for Jay

Decide whether the listed dirty files are expected in-progress KB work. If yes, commit or otherwise checkpoint them. If not, inspect and selectively revert them. Then rerun the Scout job; it should process the three still-unprocessed URLs at the bottom of `raw/reading-list.md` that are not yet present in `.night-shift/state/scout-processed.json`.
