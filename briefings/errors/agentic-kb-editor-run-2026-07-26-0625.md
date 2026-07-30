# Agentic-KB Editor Run — BLOCKED

- **Job name:** agentic-kb-editor-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-07-26T06:25:40-0700
- **Failed stage:** pre-run dirty-worktree gate
- **Status:** blocked before normal Editor processing

## Reason
The Editor Run must stop if `git status --porcelain` shows dirty files outside the active Editor allowlist.

Active allowlist for this user-invoked run:
- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`
- exactly `logs/web-server-error.log`
- exactly `logs/web-server.log`

`git status --porcelain` reported dirty/untracked files outside that allowlist:

```text
 M .night-shift/state/scout-processed.json
 M raw/.ingest-hashes.json
?? briefings/errors/agentic-kb-editor-run-2026-07-24-0625.md
?? briefings/errors/agentic-kb-editor-run-2026-07-25-0626.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-24-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-25-0315.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-26-0316.md
?? briefings/errors/agentic-kb-scout-run-2026-07-24-2305.md
?? briefings/errors/agentic-kb-scout-run-2026-07-25-2305.md
?? briefings/scout-2026-07-23.md
?? missions/
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md
?? raw/framework-docs/x-twitter-2075854920738021682.md
?? raw/framework-docs/x-twitter-2076018000570785847.md
?? raw/framework-docs/x-twitter-2076231055443440105.md
```

Blocking paths:
- `raw/.ingest-hashes.json` — raw-path mutation outside Editor scope.
- `missions/` — untracked directory outside Editor scope.
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md` — untracked raw capture outside Editor scope.
- `raw/framework-docs/x-twitter-2075854920738021682.md` — untracked raw source outside Editor scope.
- `raw/framework-docs/x-twitter-2076018000570785847.md` — untracked raw source outside Editor scope.
- `raw/framework-docs/x-twitter-2076231055443440105.md` — untracked raw source outside Editor scope.

Allowed-but-dirty paths observed:
- `.night-shift/state/scout-processed.json` — under `.night-shift/state/`.
- `briefings/errors/*.md` — under `briefings/`.
- `briefings/scout-2026-07-23.md` — under `briefings/`.

## Files Read
- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- `wiki/log.md`
- `.night-shift/state/editor-state.json`
- Hermes skill: `hermes-obsidian-knowledge-loop`
- Hermes skill reference: `references/agentic-kb-editor-run-notes.md`

## Files Written or Attempted
- Written: `briefings/errors/agentic-kb-editor-run-2026-07-26-0625.md`
- No state, wiki, synthesis, raw, or normal daily briefing files were modified by this run.

## Files Needing Review
Review the blocking paths before rerunning Editor:
- `raw/.ingest-hashes.json`
- `missions/`
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__28da9fb8.md`
- `raw/framework-docs/x-twitter-2075854920738021682.md`
- `raw/framework-docs/x-twitter-2076018000570785847.md`
- `raw/framework-docs/x-twitter-2076231055443440105.md`

Also review whether the accumulated untracked error/scout briefings under `briefings/` should be committed as audit artifacts.

## Rollback Guidance
This run only wrote this error briefing. To roll back this run alone:

```bash
git rm --cached briefings/errors/agentic-kb-editor-run-2026-07-26-0625.md 2>/dev/null || true
rm briefings/errors/agentic-kb-editor-run-2026-07-26-0625.md
```

Do **not** delete or clean the raw or `missions/` paths automatically; they may be real intake artifacts from Scout/Refinery or another process.

## Safest Next Action
Commit/stash or intentionally classify the blocking raw and `missions/` changes, then rerun `agentic-kb-editor-run`. The Editor should not synthesize against a worktree where upstream raw/state mutations are unresolved.
