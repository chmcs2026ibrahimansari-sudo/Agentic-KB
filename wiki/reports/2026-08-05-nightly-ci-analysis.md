# Nightly CI Analysis — 2026-08-05

Window: past 24 hours (2026-08-04 ~11:00 UTC → 2026-08-05 ~11:00 UTC)
Repos: jaydubya818/sellerfi, jaydubya818/missioncontrol, jaydubya818/twinz

## Summary

Total runs in window: 3 — 0 passed, 1 failed, 2 skipped, 0 in progress.

| Repo | Runs (24h) | Result |
|------|-----------|--------|
| sellerfi | 3 | 1 failure, 2 skipped (Post-Deploy Production Smoke, gated) |
| missioncontrol | 0 | no runs (latest: 2026-08-03, green) |
| twinz | 0 | no runs (latest: 2026-05-30, green) |

## Failure detail

### sellerfi — Vercel Environment Check (main)

- Run: 30995251381, 2026-08-05 09:54 UTC, scheduled daily check
- Root cause category: **credential/secret failure** (not code)
- Exact error:
  ```
  ❌ Vercel API request failed with HTTP 403
  {"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
  ```
- The workflow's `VERCEL_TOKEN` secret is expired or revoked. The check never reaches the env-var comparison — it fails at the API auth step.
- **Recurring**: same failure on main on 2026-08-03, 2026-08-04, and 2026-08-05 (3 consecutive daily runs).
- Blocking: not blocking any PR (scheduled workflow on main).
- Action taken: **report-only.** Fix requires rotating a secret, which is outside auto-fix scope per standing rules.
- Suggested fix (manual, ~2 min):
  1. Create a new token at https://vercel.com/account/tokens
  2. `gh secret set VERCEL_TOKEN --repo jaydubya818/SellerFi` (or repo Settings → Secrets → Actions)
  3. Re-run the workflow to confirm.
- Related: open issue #186 "🚨 Missing Vercel Environment Variables" — likely stale/side-effect of earlier runs of this same workflow; review after token rotation.

## Notes

- sellerfi "Post-Deploy Production Smoke" runs (×2, nightly/2026-08-05-improvements) concluded **skipped** — gate condition not met, not failures.
- No open PR exists for the Vercel token issue (only open PR is #198, unrelated).
- twinz has had no CI activity since 2026-05-30.

## Commits/PRs created this run

- This report commit to Agentic-KB main (`docs(reports): nightly CI analysis 2026-08-05`).
- No fix PRs opened (sole failure requires a secret rotation — manual).
