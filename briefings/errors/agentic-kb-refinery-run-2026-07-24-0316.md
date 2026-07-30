# Agentic-KB Refinery Run — Blocked

- **Job name:** Agentic-KB Refinery Run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-07-24T10:16:25Z
- **Failed stage:** pre-run dirty-worktree safety check
- **Status:** blocked before processing sources

## Blocked reason

`git status --porcelain` showed dirty files outside the user-approved Refinery write paths and outside the two exact noisy log exceptions.

User-approved ignored noisy logs for this run:
- `logs/web-server-error.log`
- `logs/web-server.log`

Dirty files observed:

```text
M .night-shift/state/scout-processed.json
?? briefings/scout-2026-07-23.md
?? raw/framework-docs/x-twitter-2075854920738021682.md
?? raw/framework-docs/x-twitter-2076018000570785847.md
?? raw/framework-docs/x-twitter-2076231055443440105.md
```

The `.night-shift/state/` and `briefings/` paths are within expected Refinery write paths and would not block by themselves. The three untracked `raw/framework-docs/` files are outside expected Refinery write paths. Because scheduled Refinery runs must not ignore `raw/` broadly and must not modify raw originals, the run stopped before making wiki/state changes.

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`
- Git status output from `/Users/jaywest/Agentic-KB`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md`
- No wiki pages, raw files, or state files were modified by this run.

## Files needing review

- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`
- `.night-shift/state/scout-processed.json`
- `briefings/scout-2026-07-23.md`

## Rollback guidance

No Refinery wiki/state changes were made. If the untracked raw files are intended Scout outputs, review and commit or otherwise account for them before rerunning Refinery. If they are accidental, remove or relocate them only with explicit human approval; do not let an unattended Refinery job clean raw files.

## Safest next action

Review the three untracked `raw/framework-docs/x-twitter-*.md` files and either commit them as legitimate Scout captures or clear them manually. Then rerun the Refinery job.
