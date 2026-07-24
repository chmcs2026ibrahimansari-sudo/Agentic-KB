# Nightly CI Analysis — 2026-07-24

Scope: workflow runs in the past 24 hours across jaydubya818/{sellerfi, missioncontrol, twinz}.

## Summary

- Total runs (24h): 8 — 0 passed, 1 failed, 7 skipped, 0 in progress
- sellerfi: 1 failure, 6 skipped (Post-Deploy Production Smoke — skips are expected gating behavior)
- missioncontrol: no runs in the last 24h (most recent activity 2026-07-12)
- twinz: no runs in the last 24h (most recent activity 2026-05-30)

## Failures

### sellerfi — Vercel Environment Check (main)

- Run: 30084010717, 2026-07-24T09:50Z, scheduled daily check on `main`
- Root cause category: dependency/credential issue (expired secret) — NOT a code bug
- Exact error:
  ```
  ❌ Vercel API request failed with HTTP 403
  {"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
  ```
- The workflow script and API call are correct; Vercel rejects the token itself (`invalidToken: true`). The `VERCEL_TOKEN` repo secret is expired, revoked, or no longer has access to the team/project.
- Recurrence: recurring — same daily failure on main on 07-21, 07-22, 07-23, and 07-24 (4 consecutive days).
- Blocking: not blocking any PR (scheduled job on main), but the env-var drift check has been blind for 4+ days.
- Action taken: report-only. Fix requires rotating a secret, which the nightly job must not do per policy.

**Suggested fix (manual, ~2 min):**
1. Create a new token at https://vercel.com/account/tokens (scope: the team owning the SellerFi project).
2. Update the repo secret: `gh secret set VERCEL_TOKEN --repo jaydubya818/sellerfi`.
3. Re-run the workflow to confirm: `gh run rerun 30084010717 --repo jaydubya818/sellerfi`.

Note: the workflow also warns that actions/checkout@v4 and actions/setup-node@v4 target deprecated Node 20; low priority, bump to @v5/@v6 when convenient.

## Auto-fix PRs opened this run

None — the single failure requires a secret rotation (out of scope for auto-fix per hard rules).

## Commits created this run

- Agentic-KB: `docs(reports): nightly CI analysis 2026-07-24` (this report)
