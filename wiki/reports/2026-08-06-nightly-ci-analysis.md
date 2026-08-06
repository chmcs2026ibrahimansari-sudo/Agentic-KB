# Nightly CI Analysis — 2026-08-06

Window: past 24 hours (2026-08-05 ~10:00 UTC → 2026-08-06 ~10:00 UTC)
Repos: jaydubya818/sellerfi, jaydubya818/missioncontrol, jaydubya818/twinz

## Summary

Total runs in window: 4 — 1 passed, 1 failed, 2 skipped, 0 in progress.

| Repo | Runs (24h) | Status |
|------|-----------|--------|
| sellerfi | 3 (1 failed, 2 skipped) | FAIL: Vercel Environment Check |
| missioncontrol | 1 (passed) | Green |
| twinz | 0 (no runs since 2026-05-30) | Idle |

## Failure: sellerfi / Vercel Environment Check

- Run: https://github.com/jaydubya818/sellerfi/actions/runs/31091155248 — branch `main`, job "Check Vercel Environment Variables", 2026-08-06 09:55 UTC
- Root cause category: dependency/credential issue — expired or revoked secret. Not a code bug.
- Exact error:

  ```
  Vercel API request failed with HTTP 403
  {"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
  ```

  The workflow queries `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env` with the `VERCEL_TOKEN` secret; Vercel rejects the token outright (`invalidToken: true`).
- Recurring: yes — the same daily scheduled run has failed on main every day since at least 2026-08-03 (runs 30805182997, 30898444763, 30995251381, 31091155248).
- Blocking a PR: no — scheduled check on `main`, not attached to any PR.
- Action taken: report-only. The fix requires rotating the `VERCEL_TOKEN` repository secret, which is outside the auto-fix policy (secrets/infra config → report, don't commit).
- Suggested fix (manual, ~2 min):
  1. Create a new token at https://vercel.com/account/tokens (scoped to the team owning the SellerFi project).
  2. Update the repo secret: `gh secret set VERCEL_TOKEN --repo jaydubya818/sellerfi`
  3. Re-run the workflow to confirm.
  If the project moved teams, also verify `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` — though a 403 with `invalidToken` (vs 404) points at the token itself.

## Other notes

- sellerfi: two "Post-Deploy Production Smoke" runs on `nightly/2026-08-06-improvements` were skipped (gate condition not met) — normal, not failures.
- missioncontrol: CI green (run 31073211590, 2026-08-06 05:07 UTC).
- twinz: no workflow activity in the window; last run 2026-05-30. Nothing to analyze.
- Secondary observation (non-blocking): sellerfi workflow warns `actions/checkout@v4` / `actions/setup-node@v4` target deprecated Node 20. Worth bumping to v5 eventually; no PR opened this run since the failing job dies on the token before any action logic — a version bump would not change the outcome.

## Commits/PRs created this run

- PRs opened: none (sole failure is credential rotation — report-only per policy).
- Commits: this report → Agentic-KB main (`docs(reports): nightly CI analysis 2026-08-06`).
