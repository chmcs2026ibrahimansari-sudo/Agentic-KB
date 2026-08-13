# Nightly CI Analysis — 2026-08-13

Window: past 24 hours (2026-08-12 ~09:30 UTC → 2026-08-13 ~09:30 UTC)
Repos: jaydubya818/sellerfi, jaydubya818/missioncontrol, jaydubya818/twinz

## Summary

- Total runs in window: 13 — **10 passed, 1 failed, 0 in progress, 2 skipped**
  - sellerfi: 1 failed, 2 skipped (Post-Deploy Production Smoke on nightly/2026-08-13-improvements — skipped by design)
  - missioncontrol: 10/10 success (latest: CI — Mission Control on codex/browser-governed-factory-dispatch, 2026-08-12 22:13 UTC)
  - twinz: no workflow runs in the past 24h (last activity 2026-05-30)

## Failures

### sellerfi — main — "Vercel Environment Check" (run 31686705783)

- **Root cause:** credentials/secrets — the Vercel REST API call returns:
  ```
  ❌ Vercel API request failed with HTTP 403
  {"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
  ```
  The `VERCEL_TOKEN` repo secret is invalid or expired. The workflow script itself is correct (fails cleanly at the HTTP-status guard in `.github/workflows` "Check Vercel Environment Variables" step).
- **Recurring:** yes — identical 403/invalidToken failure on 2026-08-11 (run 31477394807), 2026-08-12 (run 31582995651), and 2026-08-13. Failing daily since at least Aug 11.
- **Action taken: report-only.** Fix requires rotating a secret, which is outside the auto-fix policy (no new secrets rule). Suggested fix:
  1. Create a new token at https://vercel.com/account/tokens (scope: the team/org that owns the SellerFi project).
  2. Update the repo secret: `gh secret set VERCEL_TOKEN --repo jaydubya818/sellerfi`.
  3. Re-run the workflow to confirm green.
- **Blocking a PR:** no — scheduled daily run on main; not attached to any PR. Note: because the check exits at the API-error guard, it never evaluates the required env vars, so drift in `BLOB_READ_WRITE_TOKEN` / `DATABASE_URL` / `NEXTAUTH_SECRET` / `NEXTAUTH_URL` is currently going unchecked. Related open issue: sellerfi #186 "🚨 Missing Vercel Environment Variables".

## Commits/PRs created this run

- No fix PRs opened (single failure is secret-rotation, report-only).
- Agentic-KB: `docs(reports): nightly CI analysis 2026-08-13` pushed to main (this report).

## Notes

- twinz "Auto Version Bump" failures visible in run history are from May 2026, outside the 24h window; not analyzed.
- sellerfi open PR #198 (chore/full-functional-test-report-2026-06-18) is unrelated to this failure.
