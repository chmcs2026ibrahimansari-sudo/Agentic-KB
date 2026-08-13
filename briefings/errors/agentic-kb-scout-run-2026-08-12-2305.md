# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** unavailable
- **Timestamp:** 2026-08-12 23:05:55 PDT
- **Phase/stage failed:** pre-run dirty-worktree safety gate, before URL fetch, raw capture, or state mutation

## Blocked Reason

Scout stopped because `git status --porcelain` showed dirty files outside the Scout playbook's allowed write paths.

Allowed Scout write paths/exceptions are exactly:

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

Dirty-worktree output:

```text
 M .night-shift/state/editor-state.json
?? briefings/2026-08-12.md
?? raw/clippings/2026-08-12T20-30-49__apple-notes__test-capture-2026-05-16__ee78ee45.md
?? wiki/daily-systems/logs/2026-08-12.md
```

Allowed / non-blocking dirty paths:

- `.night-shift/state/editor-state.json`
- `briefings/2026-08-12.md`

Blocking dirty paths:

- `raw/clippings/2026-08-12T20-30-49__apple-notes__test-capture-2026-05-16__ee78ee45.md`
- `wiki/daily-systems/logs/2026-08-12.md`

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-scout-run-notes.md`

## Files Written or Attempted

Written:

- `briefings/errors/agentic-kb-scout-run-2026-08-12-2305.md`

Not attempted because the run blocked before mutation:

- no URL fetches
- no raw captures
- no `.night-shift/state/scout-processed.json` update
- no normal `briefings/scout-2026-08-12.md` report

## Files That May Need Review

- `raw/clippings/2026-08-12T20-30-49__apple-notes__test-capture-2026-05-16__ee78ee45.md`
- `wiki/daily-systems/logs/2026-08-12.md`

These may be legitimate outputs from another workflow, but they are outside Scout's authorized dirty-path allowlist, so Scout cannot safely proceed unattended.

## Rollback Guidance

Do **not** auto-delete or clean these files from Scout. Review the two blocking paths and either:

1. commit them if intentional,
2. move them through the workflow that owns those paths,
3. stash them if temporary, or
4. explicitly expand Scout's dirty-worktree allowlist if those paths are expected for this job.

## Safest Next Action

Jay should inspect the two blocking dirty files, decide whether they are valid, and clear or commit them. After the worktree is clean outside Scout's allowed paths, rerun the Agentic-KB Scout Run.
