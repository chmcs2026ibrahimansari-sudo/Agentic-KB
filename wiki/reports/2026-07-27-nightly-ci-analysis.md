# Nightly CI Analysis — 2026-07-27

Scope: workflow runs in the past 24h across jaydubya818/{sellerfi, missioncontrol, twinz}.

## Summary

- Total runs in window: 10 (all sellerfi) — 0 passed, 2 failed, 8 skipped, 0 in progress
- missioncontrol: no runs in past 24h (latest activity 2026-07-12)
- twinz: no runs in past 24h (latest activity 2026-05-30)

## Failures

### sellerfi — main — "Vercel Environment Check" (runs 30257746696, 30196951533)

- **Root cause:** dependency/credential issue — Vercel REST API returns `HTTP 403 {"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}`. The `VERCEL_TOKEN` repo secret is expired or revoked.
- **Recurrence:** failing every daily run since at least 2026-07-13 (15+ consecutive days, all on main). Not a new failure.
- **Blocking:** not blocking any PR — this is a scheduled daily env-audit workflow, not a PR gate.
- **Action taken:** report-only. Fix requires rotating a secret (`VERCEL_TOKEN`), which is outside the auto-fix policy (no new secrets / infra config changes).
- **Suggested fix (manual):**
  1. Create a new token at https://vercel.com/account/tokens (scoped to the SellerFi team/project).
  2. Update the repo secret: `gh secret set VERCEL_TOKEN --repo jaydubya818/sellerfi`.
  3. Re-run the workflow to confirm, then close related open issue #186 ("Missing Vercel Environment Variables") if stale.

## Skipped runs

8× "Post-Deploy Production Smoke" (sellerfi) skipped on branches `nightly/2026-07-27-improvements` and `claude/add-sellerfi-feature-DFXpi` — expected (deploy condition not met), no action.

## PRs / commits created this run

- No fix PRs opened (only failure requires a secret rotation — not auto-fixable).
- Agentic-KB: this report, commit `docs(reports): nightly CI analysis 2026-07-27` pushed to main.
