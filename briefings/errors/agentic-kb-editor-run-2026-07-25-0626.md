# Agentic-KB Editor Run Error Briefing — 2026-07-25 06:26 PDT

## Job
- **Job name:** agentic-kb-editor-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-07-25 06:26:11 PDT -0700

## Failed Stage
Pre-run dirty-worktree safety check, before Editor Run content changes.

## Error / Blocked Reason
The Editor Run was blocked because `git status --porcelain` showed dirty files outside the active allowlist.

Active allowlist from the user instruction:
- Expected Editor write paths: `.night-shift/state/`, `briefings/`, `wiki/syntheses/`
- Noisy logs allowed exactly: `logs/web-server-error.log`, `logs/web-server.log`

Blocking dirty files outside that allowlist:
- `M raw/.ingest-hashes.json`
- `?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md`
- `?? raw/framework-docs/x-twitter-2075854920738021682.md`
- `?? raw/framework-docs/x-twitter-2076018000570785847.md`
- `?? raw/framework-docs/x-twitter-2076231055443440105.md`

Dirty files observed inside allowed Editor paths, not treated as blockers:
- `M .night-shift/state/scout-processed.json`
- `?? briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md`
- `?? briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md`
- `?? briefings/errors/agentic-kb-refinery-run-2026-07-25-0315.md`
- `?? briefings/errors/agentic-kb-scout-run-2026-07-24-2305.md`
- `?? briefings/scout-2026-07-23.md`

## Files Read
- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- Hermes skill: `hermes-obsidian-knowledge-loop/SKILL.md`
- Hermes skill reference: `references/agentic-kb-editor-run-notes.md`

## Files Written or Attempted
- Written: `briefings/errors/agentic-kb-editor-run-2026-07-25-0626.md`
- No wiki, raw, synthesis, or state files were modified by this Editor Run before blocking.

## Files That May Need Review
- `raw/.ingest-hashes.json`
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md`
- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`

## Rollback Guidance
Do not run the Editor Run against this dirty raw state until the raw changes are intentionally handled.

Suggested review commands from `/Users/jaywest/Agentic-KB`:
```bash
git status --porcelain
git diff -- raw/.ingest-hashes.json
git diff --name-only -- raw
```

For untracked raw files, decide whether they are legitimate captured sources that should be staged/committed or accidental files that should be removed by a human/operator. This job did not edit or delete them.

## Safest Next Action
Review and either commit, intentionally preserve, or clean the dirty `raw/` files. Then rerun `agentic-kb-editor-run` so it can safely review recent wiki changes, update `.night-shift/state/editor-state.json`, and write the normal daily briefing.
