# Agentic-KB Scout Run Error Briefing — 2026-08-25 23:05 PDT

## Job
- **Job name:** Agentic-KB Scout Run
- **Job ID:** not available from cron context
- **Timestamp:** 2026-08-25 23:05:47 PDT -0700

## Phase / Stage Failed
Pre-run dirty-worktree gate, before page fetches, raw captures, or state mutation.

## Error / Blocked Reason
`git status --porcelain` found dirty files outside the Scout run's allowed write paths.

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

Dirty files observed:

```text
 M .night-shift/state/editor-state.json
 M state/notes-to-factory/last-run.json
 M state/notes-to-factory/ledger.md
 M web/next-env.d.ts
 M wiki/log.md
 M wiki/syntheses/synthesis-harness-self-improvement-as-memory-promotion.md
?? briefings/2026-08-25.md
?? wiki/daily-systems/logs/2026-08-25.md
```

Allowed / non-blocking entries:
- `.night-shift/state/editor-state.json`
- `briefings/2026-08-25.md`

Blocking entries:
- `state/notes-to-factory/last-run.json`
- `state/notes-to-factory/ledger.md`
- `web/next-env.d.ts`
- `wiki/log.md`
- `wiki/syntheses/synthesis-harness-self-improvement-as-memory-promotion.md`
- `wiki/daily-systems/logs/2026-08-25.md`

Because those files are outside Scout's allowed write paths, the run stopped before fetching unchecked URLs or writing raw captures.

## Files Read
- `/Users/jaywest/Agentic-KB/AGENTS.md`
- `/Users/jaywest/Agentic-KB/house-rules.md`
- `/Users/jaywest/Agentic-KB/playbooks/night-shift-map.md`
- `/Users/jaywest/Agentic-KB/playbooks/scout-run.md`
- `/Users/jaywest/Agentic-KB/raw/reading-list.md`
- `/Users/jaywest/Agentic-KB/.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files Written or Attempted
- Written: `/Users/jaywest/Agentic-KB/briefings/errors/agentic-kb-scout-run-2026-08-25-2305.md`
- No raw captures attempted.
- No Scout state mutation attempted.
- No `briefings/scout-2026-08-25.md` written because the run blocked before normal completion.

## Files That May Need Review
- `state/notes-to-factory/last-run.json`
- `state/notes-to-factory/ledger.md`
- `web/next-env.d.ts`
- `wiki/log.md`
- `wiki/syntheses/synthesis-harness-self-improvement-as-memory-promotion.md`
- `wiki/daily-systems/logs/2026-08-25.md`

## Rollback Guidance
Do not rollback automatically from Scout. These changes appear to belong to other workflows. Review the dirty files and either commit, stash, or deliberately revert them before rerunning Scout.

Suggested inspection command from the vault:

```bash
git status --porcelain
```

Then inspect the blocking paths with normal git diff / file review before deciding.

## Safest Next Action for Jay
Resolve or intentionally preserve the non-Scout dirty files, then rerun the Agentic-KB Scout Run. Scout did not fetch, overwrite, or mutate raw captures in this blocked run.
