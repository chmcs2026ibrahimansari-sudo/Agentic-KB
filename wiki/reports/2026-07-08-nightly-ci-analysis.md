# Nightly CI Analysis — 2026-07-08

Scope: workflow runs in the past 24 hours across jaydubya818/sellerfi, jaydubya818/missioncontrol, jaydubya818/twinz.

## Summary

Total runs in window: 1 — 0 passed, 1 failed, 0 in progress.

- **missioncontrol**: no runs in the past 24h (latest run 2026-06-11, success).
- **twinz**: no runs in the past 24h (latest run 2026-05-30, success).
- **sellerfi**: 1 failed run.

## Failure detail

### sellerfi — main — "Vercel Environment Check" (run 28933602728, 2026-07-08 09:50 UTC)

**Root cause:** credential issue — the workflow's Vercel API call fails auth:

```
❌ Vercel API request failed with HTTP 403
{"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
##[error]Process completed with exit code 1.
```

The `VERCEL_TOKEN` secret used by the scheduled env-var check is invalid, expired, or revoked. The workflow script itself behaves correctly (exits 1 on non-200 as designed).

**Recurring:** yes — same workflow has failed daily on `main` for at least 10 consecutive days (2026-06-29 → 2026-07-08), consistent with a token that expired around then.

**Action taken:** report-only. Fix requires rotating a secret, which is outside the auto-fix policy (no new secrets / infra config without Jay).

**Suggested fix (manual, ~2 min):**
1. Create a new token at vercel.com → Account Settings → Tokens (scoped to the SellerFi project/team).
2. Update the repo secret: `gh secret set VERCEL_TOKEN --repo jaydubya818/sellerfi`.
3. Re-run the workflow to confirm green.

**Blocking a PR:** no — scheduled run on `main`, not attached to any PR.

## Commits/PRs created this run

- No fix PRs opened (single failure is secret-related, report-only).
- This report committed to Agentic-KB `main` (`docs(reports): nightly CI analysis 2026-07-08`).
