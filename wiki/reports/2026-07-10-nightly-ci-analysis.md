# Nightly CI Analysis — 2026-07-10

Scope: workflow runs in the past 24 hours across jaydubya818/{sellerfi, missioncontrol, twinz}.

## Summary

- Total runs (past 24h): **1** — 0 passed, **1 failed**, 0 in progress
- missioncontrol: no runs in past 24h (last run 2026-06-11, success)
- twinz: no runs in past 24h (last run 2026-05-30, success)

## Failures

### sellerfi — `Vercel Environment Check` (main)

- **Run:** [29085426284](https://github.com/jaydubya818/SellerFi/actions/runs/29085426284), 2026-07-10T10:09Z, scheduled run on `main`
- **Root cause category:** dependency/credential issue — expired or revoked secret
- **Exact error:**
  ```
  ❌ Vercel API request failed with HTTP 403
  {"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
  ```
  The "Check Vercel Environment Variables" step calls
  `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env` with the
  `VERCEL_TOKEN` repo secret; Vercel rejects the token as invalid.
- **Recurring:** yes — same workflow has failed daily on `main` at least since 2026-07-01 (10 consecutive daily failures, same fingerprint).
- **Blocking a PR:** no — scheduled run on `main`, not attached to any open PR.
- **Action taken:** report-only. Fix requires rotating the `VERCEL_TOKEN` GitHub Actions secret — new secrets are outside auto-fix scope per standing rules.
- **Suggested fix (manual, ~2 min):**
  1. Create a new token at vercel.com → Account Settings → Tokens.
  2. `gh secret set VERCEL_TOKEN --repo jaydubya818/SellerFi` (or repo Settings → Secrets → Actions).
  3. Re-run the workflow; if 403 persists, verify `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` still match the project.

## PR de-dup check

Open PRs on sellerfi: only [#198](https://github.com/jaydubya818/SellerFi/pull/198) (functional test report) — unrelated; no existing PR addresses the token issue.

## Commits/PRs created this run

- No code-repo PRs (failure not auto-fixable — secret rotation required).
- This report committed to Agentic-KB `main` (`docs(reports): nightly CI analysis 2026-07-10`).
