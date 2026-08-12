# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-10 23:05:38 PDT
- **Phase/stage failed:** pre-run dirty-worktree gate, before URL fetch/raw capture/state mutation
- **Status:** blocked; no Scout URL processing attempted

## Blocked reason

`git status --porcelain` showed dirty files outside the Scout allowlist.

Allowed Scout paths/exceptions are exactly:

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

Observed dirty files:

```text
 M .night-shift/state/editor-state.json
 M raw/reading-list.md
 M wiki/log.md
 M wiki/syntheses/synthesis-agentic-engineering-operating-model.md
?? briefings/2026-08-10.md
?? wiki/daily-systems/logs/2026-08-10.md
```

Blocking files outside the Scout allowlist:

```text
 M wiki/log.md
 M wiki/syntheses/synthesis-agentic-engineering-operating-model.md
?? wiki/daily-systems/logs/2026-08-10.md
```

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`
- Hermes skill: `unattended-cron-operations`
- Hermes skill: `web-extract`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-08-10-2305.md`
- No raw captures attempted.
- No state updates attempted.
- No URL fetches attempted.

## Files that may need review

- `wiki/log.md`
- `wiki/syntheses/synthesis-agentic-engineering-operating-model.md`
- `wiki/daily-systems/logs/2026-08-10.md`
- Also review allowed-but-dirty context if needed:
  - `.night-shift/state/editor-state.json`
  - `raw/reading-list.md`
  - `briefings/2026-08-10.md`

## Rollback guidance

Do not roll back blindly. These appear to be edits from another workflow, not Scout-owned files. Review the diff, then either commit/stash the unrelated wiki changes or intentionally discard them if they are known bad.

Safe inspection commands:

```bash
git status --porcelain
git diff -- wiki/log.md wiki/syntheses/synthesis-agentic-engineering-operating-model.md
git diff --stat -- wiki/daily-systems/logs/2026-08-10.md
```

## Safest next action for Jay

Clear or commit the non-Scout dirty wiki changes, then rerun Scout. The next Scout run should resume from `.night-shift/state/scout-processed.json` and process only unchecked URLs not already recorded there.
