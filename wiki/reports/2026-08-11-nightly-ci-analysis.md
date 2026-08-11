# Nightly CI Analysis — 2026-08-11

Window: past 24 hours (2026-08-10 ~09:30 UTC → 2026-08-11 ~09:30 UTC)
Repos: jaydubya818/sellerfi, jaydubya818/missioncontrol, jaydubya818/twinz

## Summary

Total runs in window: 9 — 1 passed, 1 failed, 7 skipped, 0 in progress.

| Repo | Runs (24h) | Status |
|------|-----------|--------|
| sellerfi | 8 (1 failed, 7 skipped) | ❌ 1 failure |
| missioncontrol | 1 (passed) | ✅ green |
| twinz | 0 (no runs since 2026-05-30) | — idle |

## Failures

### sellerfi — Vercel Environment Check (main)

- **Run:** [31477394807](https://github.com/jaydubya818/sellerfi/actions/runs/31477394807) — 2026-08-11 09:22 UTC, job "Check Vercel Environment Variables"
- **Root cause:** credential issue — the Vercel API rejects the token before any env-var check runs:
  ```
  ❌ Vercel API request failed with HTTP 403
  {"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
  ```
  The `VERCEL_TOKEN` repo secret is invalid or expired (or lacks access to the org/project in `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID`).
- **Recurring:** yes — identical 403/invalidToken failure on the 2026-08-10 scheduled run ([31375243630](https://github.com/jaydubya818/sellerfi/actions/runs/31375243630)). Daily scheduled check on `main`; it will fail every day until the token is rotated.
- **Blocking a PR:** no — scheduled workflow on `main`, not attached to any PR.
- **Action taken:** report-only. Not a mechanical workflow fix — requires a new secret (per task rules, secrets are out of scope for auto-fix). Suggested fix:
  1. Create a fresh token at https://vercel.com/account/tokens (scoped to the SellerFi team/project).
  2. Update the secret: `gh secret set VERCEL_TOKEN --repo jaydubya818/sellerfi`.
  3. Re-run the workflow to confirm.
- **Minor note (non-blocking):** the workflow emits Node 20 deprecation warnings for `actions/checkout@v4` / `actions/setup-node@v4`; bumping versions later would silence them. Not touched this run — unrelated to the failure.

## Non-failures of note

- sellerfi "Post-Deploy Production Smoke" ran 7× on `nightly/2026-08-11-improvements` / `nightly/2026-08-10-improvements`, all concluded **skipped** (gating condition not met) — not failures.
- missioncontrol: 1 run in window, "CI — Mission Control" on `mc/2pkhjh8c6bqj`, passed.
- twinz: no workflow activity in the window (last run 2026-05-30).

## Commits/PRs created this run

- No fix PRs opened (the single failure needs secret rotation, not a code change; sellerfi's open PR #198 is unrelated).
- Agentic-KB: `docs(reports): nightly CI analysis 2026-08-11` — this report, pushed to `main`.

## Ops note

Yesterday's run left `/tmp/work_kb` owned by another uid; today's `rm -rf`/clone into that path failed silently with permission errors. Worked around by cloning to a fresh path (`/tmp/kb_20260811`). Consider using a date-suffixed clone path in the task going forward.
