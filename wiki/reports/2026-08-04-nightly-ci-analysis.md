# Nightly CI Analysis — 2026-08-04

Scope: workflow runs in the past 24h across jaydubya818/sellerfi, missioncontrol, twinz.

## Summary

Total runs in window: 3 — 2 passed, 1 failed, 0 in progress.

| Repo | Runs (24h) | Status |
|---|---|---|
| sellerfi | 1 | ❌ 1 failure |
| missioncontrol | 2 | ✅ all green |
| twinz | 0 | — no runs since 2026-05-30 |

## Failure: sellerfi — Vercel Environment Check (main)

- Run: [30898444763](https://github.com/jaydubya818/sellerfi/actions/runs/30898444763), 2026-08-04 09:55 UTC, branch `main`
- Root cause category: **credential failure** (not test/build/lint). The workflow's curl to the Vercel REST API (`/v9/projects/{id}/env`) returns:
  ```
  HTTP 403 {"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
  ```
  The `VERCEL_TOKEN` repo secret is expired or revoked.
- Recurrence: **recurring daily** — same failure on 2026-08-01, 08-02, 08-03, 08-04 (scheduled run on `main`, ~09:41–09:55 UTC daily).
- Blocking: not blocking any PR (scheduled job on main), but the env-var drift check has been blind for ≥4 days.
- Action taken: **report-only.** Fix requires rotating a secret, which is outside the auto-fix policy (no new secrets, no judgment calls). No existing open PR addresses it (only open PR is `chore/full-functional-test-report-2026-06-18`, unrelated).
- Suggested fix (manual, ~2 min):
  1. Create a new token at vercel.com → Account Settings → Tokens (scope: the team owning the SellerFi project).
  2. `gh secret set VERCEL_TOKEN --repo jaydubya818/sellerfi` (or GitHub UI → Settings → Secrets → Actions).
  3. Re-run the workflow to confirm; then review open issue [#186 "🚨 Missing Vercel Environment Variables"](https://github.com/jaydubya818/sellerfi/issues/186) — it predates this token failure and may be stale.

## Notes

- missioncontrol: failure at 2026-08-03 06:07 (run 30789132136) is outside the 24h window and self-recovered — the two subsequent runs on `main` (15:47, 20:17 UTC) both passed. No action.
- twinz: no workflow activity in the window; last runs May 2026 (old Auto Version Bump failures, out of scope).
- sellerfi "Post-Deploy Production Smoke" runs show `skipped` conclusions (conditional job) — not failures.

## Commits/PRs created this run

- Agentic-KB: `docs(reports): nightly CI analysis 2026-08-04` (this report) — pushed to main.
- No fix PRs opened (single failure is secret-rotation, report-only).
