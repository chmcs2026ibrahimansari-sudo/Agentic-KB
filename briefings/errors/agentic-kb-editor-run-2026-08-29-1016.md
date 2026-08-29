# Agentic-KB Editor Run — Blocked/Error Briefing

- **Job name:** agentic-kb-editor-run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-29T10:16:36-0700 PDT
- **Failed stage:** Pre-run dirty-worktree safety gate, before Editor writes
- **Status:** blocked

## Error / Blocked Reason

The Editor Run stopped before synthesis or state writes because `git status --porcelain` showed dirty files outside the user-authorized Editor write paths.

User-authorized Editor write paths for this run:
- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`

User-authorized noisy-log exceptions:
- `logs/web-server-error.log`
- `logs/web-server.log`

Blocking dirty paths found at the pre-run gate:

```text
 M wiki/_meta/compile-log.md
 M wiki/candidates.md
?? scripts/tmp-append-daily-20260829.sh
?? scripts/tmp-kb-intel-20260829.sh
```

Non-blocking dirty paths also present at the pre-run gate because they are under `briefings/`:

```text
?? briefings/errors/agentic-kb-refinery-run-2026-08-29-1015.md
?? briefings/errors/agentic-kb-scout-run-2026-08-29-1010.md
```

Post-write validation detected additional dirty paths that appeared after the initial gate / during the surrounding Night Shift window:

```text
 M raw/.compiled-log.json
 M wiki/index.md
 M wiki/log.md
?? wiki/personal/roofclaim-recovery-business-plan.md
```

Those additional paths are also outside the Editor run's authorized write scope, and `raw/.compiled-log.json` violates the raw-preservation guard if caused by an automated job. This Editor Run did not intentionally modify those files; it only wrote this error briefing.

## Files Read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- `.night-shift/state/editor-state.json`
- `wiki/log.md`
- Hermes skill: `unattended-cron-operations`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-editor-run-notes.md`

## Files Written or Attempted

- Written: `briefings/errors/agentic-kb-editor-run-2026-08-29-1016.md`
- Attempted but skipped: no `wiki/syntheses/` writes, no `.night-shift/state/editor-state.json` update, no normal `briefings/2026-08-29.md` briefing.

## Files That May Need Review

- `wiki/_meta/compile-log.md` — modified before this Editor Run; outside Editor's authorized synthesis path.
- `wiki/candidates.md` — modified before this Editor Run; outside Editor's authorized synthesis path.
- `raw/.compiled-log.json` — raw-area state file is dirty; review carefully because scheduled jobs must not modify raw/source-of-truth paths.
- `wiki/index.md` — modified after the initial dirty gate; outside Editor's authorized synthesis path for this run.
- `wiki/log.md` — modified after the initial dirty gate; outside Editor's authorized synthesis path for this run.
- `wiki/personal/roofclaim-recovery-business-plan.md` — untracked personal page appeared after the initial dirty gate; outside Editor's authorized synthesis path for this run.
- `scripts/tmp-append-daily-20260829.sh` — untracked temporary script; outside Editor's authorized write scope.
- `scripts/tmp-kb-intel-20260829.sh` — untracked temporary script; outside Editor's authorized write scope.
- `briefings/errors/agentic-kb-refinery-run-2026-08-29-1015.md` — upstream Refinery appears to have written an error briefing immediately before this run.
- `briefings/errors/agentic-kb-scout-run-2026-08-29-1010.md` — upstream Scout appears to have written an error briefing immediately before this run.

## Validation Receipts

- Read-back of this error briefing succeeded.
- `git diff --name-only -- raw` returned `raw/.compiled-log.json`, so the raw tree is not clean.
- `git diff --check` returned no whitespace errors.

## Rollback Guidance

Do not rollback blindly. First inspect the blocking diffs, raw diff, and tmp scripts:

```bash
git diff -- wiki/_meta/compile-log.md wiki/candidates.md wiki/index.md wiki/log.md raw/.compiled-log.json
git status --porcelain -- scripts/tmp-append-daily-20260829.sh scripts/tmp-kb-intel-20260829.sh wiki/personal/roofclaim-recovery-business-plan.md
```

If those changes are intentional outputs from a prior job, commit or otherwise reconcile them before re-running the Editor. If the tmp scripts are disposable run artifacts, remove them after confirming they contain no unique state. Treat the raw diff as highest-risk: either revert it if accidental or explicitly decide it is an accepted operational-state exception.

## Safest Next Action for Jay

Review the upstream Scout/Refinery error briefings first, then decide whether to keep or discard the dirty compile/candidate/index/log/personal/raw/script changes. Re-run `agentic-kb-editor-run` only after `git status --porcelain` contains no dirty paths outside `.night-shift/state/`, `briefings/`, `wiki/syntheses/`, and the two exact noisy log exceptions.
