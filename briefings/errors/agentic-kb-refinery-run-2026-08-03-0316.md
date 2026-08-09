# Agentic-KB Refinery Run — Blocked/Error Briefing

- **Job name:** Agentic-KB Refinery Run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-03 03:16 PDT
- **Failed stage:** Pre-run dirty-worktree safety check
- **Status:** Blocked before processing sources or making wiki/state changes

## Reason

The required pre-run `git status --porcelain` check found a dirty file outside the user-approved Refinery write paths and outside the two exact noisy log exceptions.

Blocking path:

```text
M web/next-env.d.ts
```

The user instruction allows dirty-worktree safety to ignore only:

```text
logs/web-server-error.log
logs/web-server.log
```

and expected Refinery write paths:

```text
.night-shift/state/
briefings/
wiki/summaries/
wiki/concepts/
wiki/patterns/
wiki/frameworks/
wiki/recipes/
wiki/evaluations/
wiki/personal/
wiki/index.md
wiki/log.md
```

`web/next-env.d.ts` is outside those paths, so the safest action is to stop before processing raw sources.

## Dirty files observed

```text
M web/next-env.d.ts
?? briefings/errors/agentic-kb-editor-run-2026-08-02-0625.md
?? briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md
?? briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md
?? briefings/errors/agentic-kb-scout-run-2026-08-02-2306.md
?? briefings/scout-2026-07-31.md
```

The untracked files under `briefings/` are inside an expected Refinery write path and did not cause the block. They may still be pre-existing outputs Jay should be aware of.

## Files read

- `AGENTS.md` — project context loaded; direct `read_file` attempt reported the file as binary, but the content was already available in the scheduled job context.
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`
- `git status --porcelain` output

## Files written or attempted

- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-03-0316.md`
- No wiki pages, raw files, state files, or normal Refinery briefing were written.

## Files that may need review

- `web/next-env.d.ts` — determine whether this change is intentional and should be committed, reverted, or regenerated.
- Existing untracked briefing outputs:
  - `briefings/errors/agentic-kb-editor-run-2026-08-02-0625.md`
  - `briefings/errors/agentic-kb-refinery-run-2026-08-02-0316.md`
  - `briefings/errors/agentic-kb-scout-run-2026-08-01-2306.md`
  - `briefings/errors/agentic-kb-scout-run-2026-08-02-2306.md`
  - `briefings/scout-2026-07-31.md`

## Rollback guidance

This run only created this error briefing. To roll back this run's own change:

```bash
git restore --staged briefings/errors/agentic-kb-refinery-run-2026-08-03-0316.md 2>/dev/null || true
rm briefings/errors/agentic-kb-refinery-run-2026-08-03-0316.md
```

Do not remove or revert `web/next-env.d.ts` unless Jay confirms whether that local change is disposable.

## Safest next action

Resolve or explicitly allow the dirty `web/next-env.d.ts` change, then rerun the Refinery job. The job should not process `raw/` while that unrelated dirty file is present.
