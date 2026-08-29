# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-29 10:10:04 PDT -0700
- **Phase/stage:** Pre-run dirty-worktree safety gate, before URL fetch/capture/state mutation
- **Status:** Blocked

## Blocked reason

`git status --porcelain` reported a dirty file outside the Scout allowed write paths/exceptions:

```text
?? scripts/tmp-kb-intel-20260829.sh
```

Scout allowed paths/exceptions for this run are exactly:

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

Because `scripts/tmp-kb-intel-20260829.sh` is outside those paths, the scheduled run stopped before fetching unchecked URLs or writing raw captures.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-08-29-1010.md`
- No raw captures attempted.
- No state mutation attempted.
- No reading-list mutation attempted.

## Files that may need review

- `scripts/tmp-kb-intel-20260829.sh` — untracked file outside Scout's allowed write paths.

## Rollback guidance

This run only created this error briefing. To roll back the run artifact, remove:

```text
briefings/errors/agentic-kb-scout-run-2026-08-29-1010.md
```

Do **not** delete or modify `scripts/tmp-kb-intel-20260829.sh` automatically from Scout; it may be an intentional human or agent scratch artifact.

## Safest next action for Jay

Review `scripts/tmp-kb-intel-20260829.sh`. If it is intentional, commit it, move it to an allowed scratch location, or remove it manually. Then rerun the Scout job so it can process the remaining unchecked URLs in `raw/reading-list.md` that are not already listed in `.night-shift/state/scout-processed.json`.
