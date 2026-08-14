# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** Not provided by scheduler
- **Timestamp:** 2026-08-13 23:05 PDT
- **Phase/stage:** Pre-run dirty-worktree safety gate
- **Status:** Blocked before URL fetch, raw capture, or state mutation

## Blocked reason

`git status --porcelain` reported dirty files outside the Scout Run allowed write paths.

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
 M wiki/daily-systems/logs/2026-08-13.md
 M wiki/lint-report.md
?? briefings/2026-08-13.md
```

Blocking files outside the allowed Scout paths:

```text
 M wiki/daily-systems/logs/2026-08-13.md
 M wiki/lint-report.md
```

The other observed dirty files are within Scout-allowed paths:

```text
 M .night-shift/state/editor-state.json
?? briefings/2026-08-13.md
```

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- Hermes skill: `unattended-cron-operations`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`
- Git status output from `/Users/jaywest/Agentic-KB`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-08-13-2305.md`
- Not attempted: URL fetches from `raw/reading-list.md`
- Not attempted: raw captures under `raw/framework-docs/`, `raw/transcripts/`, or `raw/code-examples/`
- Not attempted: `.night-shift/state/scout-processed.json` mutation
- Not attempted: normal Scout briefing `briefings/scout-2026-08-13.md`

## Files that may need review

- `wiki/daily-systems/logs/2026-08-13.md`
- `wiki/lint-report.md`
- `.night-shift/state/editor-state.json`
- `briefings/2026-08-13.md`

## Rollback guidance

No Scout source captures or Scout state mutations were made. To rollback this blocked run only, remove this error briefing after review if desired:

```bash
rm briefings/errors/agentic-kb-scout-run-2026-08-13-2305.md
```

Do **not** blindly reset the blocking wiki files; they appear to be pre-existing work from another run or manual edit. Inspect their diffs first.

## Safest next action for Jay

Review or commit/stash the two blocking wiki changes, then rerun Scout:

```bash
git diff -- wiki/daily-systems/logs/2026-08-13.md wiki/lint-report.md
git status --porcelain
```

Once the worktree is clean except for Scout-allowed paths, the Scout Run can safely process unchecked URLs from `raw/reading-list.md`.
