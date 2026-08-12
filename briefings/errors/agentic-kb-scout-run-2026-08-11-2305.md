# Agentic-KB Scout Run — Blocked

- **Job name:** agentic-kb-scout-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-11 23:05:33 PDT
- **Phase/stage failed:** pre-run dirty-worktree safety gate, before URL fetch, raw capture, or Scout state mutation

## Blocked reason

Scout stopped because `git status --porcelain` showed dirty files outside the Scout allowlist.

Allowed Scout paths are exactly:

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

Dirty files outside that allowlist:

```text
 M wiki/log.md
 M wiki/syntheses/synthesis-agentic-engineering-operating-model.md
?? wiki/daily-systems/logs/2026-08-10.md
?? wiki/daily-systems/logs/2026-08-11.md
```

Dirty files observed but within the Scout allowlist/exceptions:

```text
 M .night-shift/state/editor-state.json
 M raw/reading-list.md
?? briefings/2026-08-10.md
?? briefings/errors/agentic-kb-editor-run-2026-08-11-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-11-0316.md
?? briefings/errors/agentic-kb-scout-run-2026-08-10-2305.md
```

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-scout-run-2026-08-11-2305.md`
- No raw captures attempted.
- No `.night-shift/state/scout-processed.json` mutation attempted.
- No URL fetch attempted.

## Files that may need review

- `wiki/log.md`
- `wiki/syntheses/synthesis-agentic-engineering-operating-model.md`
- `wiki/daily-systems/logs/2026-08-10.md`
- `wiki/daily-systems/logs/2026-08-11.md`

## Rollback guidance

No Scout rollback is needed because Scout did not fetch URLs, write raw captures, or update Scout state. This briefing is the only Scout write from this run.

To unblock the next Scout run, review the dirty wiki files above and either commit, stash, or intentionally clean them. Do not remove or edit `raw/reading-list.md` just to unblock Scout; it is an allowed human/agent-maintained queue.

## Safest next action for Jay

Review the four dirty wiki paths outside Scout's allowlist and decide whether they belong to the prior Editor/Refinery work. Once they are committed or otherwise resolved, rerun Scout so it can process the remaining unchecked URLs after `https://x.com/Jason/status/2076231055443440105`.
