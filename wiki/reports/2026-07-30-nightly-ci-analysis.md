# Nightly CI Analysis — 2026-07-30

Window: 2026-07-29T13:08Z → 2026-07-30T13:08Z
Repos: jaydubya818/sellerfi, jaydubya818/missioncontrol, jaydubya818/twinz

## Summary

- Total runs (24h): 21 — 0 passed, 1 failed, 20 skipped, 0 in progress
  - sellerfi: 21 (1 failure, 20 skipped "Post-Deploy Production Smoke" on `nightly/2026-07-30-improvements`)
  - missioncontrol: 0 runs in window (last runs 2026-07-29 ~05:22Z, all green)
  - twinz: 0 runs in window (dormant since 2026-05-30)

## Failure: sellerfi — Vercel Environment Check

- Run: 30532415476, branch `main`, scheduled (daily), job "Check Vercel
  Environment Variables", step "Check Production Environment Variables"
- Root cause category: dependency/credential issue (expired or revoked secret)
- Exact error:

  ```
  ❌ Vercel API request failed with HTTP 403
  {"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
  ```

- The workflow curls `https://api.vercel.com/v9/projects/$VERCEL_PROJECT_ID/env`
  with `Authorization: Bearer $VERCEL_TOKEN`; Vercel rejects the token
  (`invalidToken: true`). The `VERCEL_TOKEN` repo secret is invalid — expired,
  revoked, or scoped to the wrong team.
- Recurring: 8 consecutive daily failures (2026-07-23 → 2026-07-30). Not new.
- Blocking a PR: no — scheduled run on `main`, not attached to any PR.
- Action taken: **report-only.** Fix requires rotating a secret
  (`VERCEL_TOKEN`), which is outside the auto-fix rules (no new secrets).
- Suggested fix (manual, ~2 min):
  1. Vercel Dashboard → Account Settings → Tokens → create a new token
     (scope: team that owns the SellerFi project).
  2. `gh secret set VERCEL_TOKEN --repo jaydubya818/sellerfi`
  3. Re-run: `gh workflow run "Vercel Environment Check" --repo jaydubya818/sellerfi`
  4. Related: open issue #186 "🚨 Missing Vercel Environment Variables" was
     filed by this workflow's issue-creation path on an earlier run — close it
     once the check passes.

## Notes

- The 20 "Post-Deploy Production Smoke" runs on
  `nightly/2026-07-30-improvements` all skipped (deploy-gated); no action.
- No auto-fix PRs opened this run; no duplicate-PR risk. Existing open PR
  #198 is unrelated (functional test report).
- Ops note: the Cowork sandbox was wedged (host disk full — `useradd: No
  space left on device`); this run executed via local shell fallback instead
  of the sandbox. gh 2.86.0 local was used rather than the sandbox install.

## Commits/PRs created this run

- Agentic-KB: `docs(reports): nightly CI analysis 2026-07-30` (this file)
- No code-repo PRs.
