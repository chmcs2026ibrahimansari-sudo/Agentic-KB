# Nightly CI Analysis — 2026-08-12

Window: past 24 hours (2026-08-11 ~09:30 UTC → 2026-08-12 ~09:30 UTC)
Repos: jaydubya818/sellerfi, jaydubya818/missioncontrol, jaydubya818/twinz

## Summary

- Total runs in window: 13 → **10 passed, 1 failed, 2 skipped, 0 in progress**
- missioncontrol: 10/10 success ("CI — Mission Control", main + codex/* branches)
- twinz: no workflow runs in window (last run 2026-05-30)
- sellerfi: 1 failure, 2 skipped (Post-Deploy Production Smoke — skipped by design)

## Failure detail

### sellerfi / main / Vercel Environment Check (run 31582995651, 2026-08-12T09:27Z)

- **Root cause:** dependency/credentials issue. The daily env-var audit calls the Vercel REST API
  (`/v9/projects/$VERCEL_PROJECT_ID/env`) and gets:
  `❌ Vercel API request failed with HTTP 403` /
  `{"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}`
  → the `VERCEL_TOKEN` repo secret is invalid or expired.
- **Recurring:** yes — identical failure on the same workflow/branch on 2026-08-11 (run 31477394807).
  Daily scheduled check on `main`; it will fail every day until the token is rotated.
- **Blocking a PR:** no — scheduled run on `main`, not attached to any PR.
- **Action taken: report-only.** Fix requires a new Vercel token (secret rotation), which is outside
  the auto-fix policy (no new secrets / infra config). Suggested fix for Jay:
  1. Create a new token at vercel.com/account/tokens (scope: the SellerFi team).
  2. `gh secret set VERCEL_TOKEN --repo jaydubya818/sellerfi`
  3. Re-run the workflow to confirm green.
- Side note (non-blocking): `actions/checkout@v4` / `actions/setup-node@v4` emit Node 20
  deprecation warnings on this workflow; a bump would silence them. Not applied — unrelated to
  the failure and out of scope for this run.

## Commits / PRs created this run

- No code-repo PRs opened (only failure needs a secret rotation, not a code change).
- This report: `docs(reports): nightly CI analysis 2026-08-12` pushed to Agentic-KB `main`.
