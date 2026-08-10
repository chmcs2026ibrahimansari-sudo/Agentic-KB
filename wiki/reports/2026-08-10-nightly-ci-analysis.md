# Nightly CI Analysis — 2026-08-10

Automated scan of workflow runs in the past 24 hours across sellerfi, missioncontrol, twinz.

## Summary

- Total runs (24h window): 7 — 2 passed, 1 failed, 4 skipped, 0 in progress
- twinz: no workflow runs in the window (last activity 2026-05-30)

## Failures

### sellerfi — `Vercel Environment Check` (main)

- Run: https://github.com/jaydubya818/sellerfi/actions/runs/31375243630 (2026-08-10 09:34 UTC)
- Root cause: **dependency/credential issue** — the workflow's Vercel REST API call returns HTTP 403:
  `{"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}`
  The `VERCEL_TOKEN` repo secret is invalid or expired.
- Recurrence: **recurring** — identical daily failure on 2026-08-08, 2026-08-09, 2026-08-10 (scheduled check on main).
- Blocking: not blocking any PR (scheduled job on main).
- Action taken: **report-only.** Fix requires rotating a secret, which is outside auto-fix scope.
- Suggested fix: generate a new Vercel token (Vercel Dashboard → Settings → Tokens) with access to the SellerFi project/team, then update the `VERCEL_TOKEN` secret in the sellerfi repo (Settings → Secrets and variables → Actions). No workflow changes needed — the script itself is correct.

## Green

- missioncontrol: `CI — Mission Control` passed on both runs in the window (branches `codex/live-github-app-proof`, `mc/8aw15s8c7z3d`).
- sellerfi: `Post-Deploy Production Smoke` runs were skipped (expected — condition not met on nightly branches).

## Commits/PRs this run

- No fix PRs opened (single failure is credential-related, report-only).
- This report: `docs(reports): nightly CI analysis 2026-08-10` → Agentic-KB main.
