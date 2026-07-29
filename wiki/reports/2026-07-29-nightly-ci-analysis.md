# Nightly CI Analysis — 2026-07-29

Window: past 24h (2026-07-28 17:40 UTC → 2026-07-29 17:40 UTC)
Repos: jaydubya818/sellerfi, jaydubya818/missioncontrol, jaydubya818/twinz

## Summary

Total runs in window: 11 — 10 passed, 1 failed, 0 in progress.

- missioncontrol: 10/10 passed (CI — Mission Control; branches: main, codex/fix-docs-workspace-routing, codex/task-workorder-linkage-pr1, codex/automation-control-plane-v1)
- twinz: no workflow runs in window (last activity 2026-05-30)
- sellerfi: 1 failure

## Failures

### sellerfi — main — "Vercel Environment Check" (run 30441587789)

- Root cause: dependency/infra — the `VERCEL_TOKEN` repo secret is invalid or expired. The workflow's curl to `https://api.vercel.com/v9/projects/$VERCEL_PROJECT_ID/env` returns:
  `❌ Vercel API request failed with HTTP 403`
  `{"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}`
- Recurring: yes — same daily scheduled workflow failed on main 07-27, 07-28, and 07-29 (identical failure mode).
- Blocking a PR: no — scheduled daily check on main; does not gate any open PR.
- Action taken: report-only. Fix requires rotating a secret, which is excluded from auto-fix per standing rules (no new secrets, no infra config).
- Suggested fix: generate a new token in Vercel (Account Settings → Tokens) with access to the SellerFi project/team, then update the `VERCEL_TOKEN` secret in GitHub (SellerFi repo → Settings → Secrets and variables → Actions). If VERCEL_ORG_ID/VERCEL_PROJECT_ID changed, update those too. Related: open issue #186 "Missing Vercel Environment Variables" (2026-05-05) — worth closing or refreshing once the token is fixed.
- Existing open PRs checked: only PR #198 (functional test report), unrelated — no duplicate fix PR exists.

## Commits/PRs created this run

- No fix PRs opened (single failure is secret-rotation, not mechanical).
- Agentic-KB: this briefing committed as `docs(reports): nightly CI analysis 2026-07-29`.
