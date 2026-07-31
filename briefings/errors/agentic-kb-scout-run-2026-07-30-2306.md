# Agentic-KB Scout Run — BLOCKED

- **Job name:** Agentic-KB Scout Run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-07-30 23:06:26 PDT
- **Phase/stage failed:** Pre-run dirty-worktree gate, before URL fetch, raw capture, or Scout state mutation
- **Status:** blocked; no Scout queue items processed

## Blocked Reason

`git status --porcelain` found dirty files outside the Scout run's allowed write paths.

Scout is allowed to tolerate changes only under:

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

The following dirty files are outside that allowlist and therefore blocked the run:

```text
 M wiki/log.md
 M wiki/syntheses/synthesis-agentic-engineering-operating-model.md
```

Other dirty files observed were within Scout-allowed paths and were not treated as blockers:

```text
 M .night-shift/state/editor-state.json
?? briefings/2026-07-30.md
```

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`
- Hermes skill: `web-extract`

## Files Written or Attempted

Written:

- `briefings/errors/agentic-kb-scout-run-2026-07-30-2306.md`

Not attempted because the run was blocked before fetch/write/state mutation:

- No raw captures written
- No `.night-shift/state/scout-processed.json` update
- No `briefings/scout-2026-07-30.md` report
- No `raw/reading-list.md` changes

## Files That May Need Review

- `wiki/log.md`
- `wiki/syntheses/synthesis-agentic-engineering-operating-model.md`
- `.night-shift/state/editor-state.json`
- `briefings/2026-07-30.md`

## Rollback Guidance

No Scout raw captures or Scout state mutations were made, so there is no Scout-specific rollback needed.

Do not delete or clean the dirty wiki files automatically. Review the existing wiki changes, then either commit them, stash them, or intentionally revert them before rerunning Scout.

## Safest Next Action

Resolve the two non-Scout dirty files:

```text
wiki/log.md
wiki/syntheses/synthesis-agentic-engineering-operating-model.md
```

Then rerun the Agentic-KB Scout Run. The queue in `raw/reading-list.md` was left untouched.
