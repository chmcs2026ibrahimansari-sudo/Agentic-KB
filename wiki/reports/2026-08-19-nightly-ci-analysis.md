# Nightly CI Analysis — 2026-08-19

Scope: workflow runs in the last 24h across `jaydubya818/sellerfi`, `jaydubya818/missioncontrol`, `jaydubya818/twinz`.

## Summary

| Metric | Count |
|---|---|
| Passed | 3 |
| Failed | 1 |
| Cancelled | 2 |
| Skipped (no-op) | 6 |
| In progress | 0 |

Per repo (last 24h):

- **sellerfi** — 1 failure (`Vercel Environment Check`, main, scheduled), 6 `Post-Deploy Production Smoke` runs skipped (deployment_status events on `nightly/2026-08-19-improvements` that did not match the workflow's deploy-state filter — expected no-ops).
- **missioncontrol** — 1 pass on `main`, 2 passes on PR branches, 2 cancelled runs. No failures.
- **twinz** — no workflow activity in the window. Most recent run was 2026-05-30.

## Failures

### 1. sellerfi — `Vercel Environment Check` (run 32236437855, branch `main`, event: schedule)

**Root cause:** dependency/credential issue — the `VERCEL_TOKEN` repo secret is rejected by the Vercel API.

```
❌ Vercel API request failed with HTTP 403
{"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
##[error]Process completed with exit code 1.
```

The workflow's `Check Vercel Environment Variables` step calls the Vercel REST API to enumerate production env vars. The call returns 403 before any env-var comparison runs, so the job's actual purpose (detecting missing production variables) is not being exercised at all — it fails at authentication.

**Recurring:** yes. Identical failure on run 32120278782 (2026-08-18 09:11), same branch, same step, same HTTP 403. This is a daily scheduled job, so it will keep failing until the token is replaced.

**Action taken:** report-only. Fixing this requires rotating a secret (`VERCEL_TOKEN`), which is explicitly outside the auto-fix scope — no code change can resolve an expired credential.

**Suggested fix (Jay):**
1. Generate a new Vercel access token at https://vercel.com/account/settings/tokens with scope covering the SellerFi team/project.
2. Update the repo secret: `gh secret set VERCEL_TOKEN --repo jaydubya818/sellerfi`.
3. Re-run: `gh run rerun 32236437855 --repo jaydubya818/sellerfi`.
4. Also verify `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` still match the current project — `invalidToken: true` points at the token, but a team-scope mismatch produces the same 403 class.

**Blocking a PR:** no. Scheduled run on `main`; the only open PR (#198) is unaffected.

**Secondary observation (not a failure):** open issue [#186 "🚨 Missing Vercel Environment Variables"](https://github.com/jaydubya818/sellerfi/issues/186), filed 2026-05-05 by an earlier successful run of this same workflow, is still open. Worth closing or re-validating once the token is rotated, since the check has not produced trustworthy output since the token went bad.

## Cancelled runs (no action needed)

`missioncontrol` — `CI — Mission Control` runs 32225382868 and 32228326484 on `codex/production-factory-pilot-v2` (PR [#122](https://github.com/jaydubya818/missioncontrol/pull/122), titled "Production Factory Pilot V2 — BLOCKED"). Both were cancelled, not failed — consistent with concurrency-group supersession from rapid successive pushes. The PR is self-labelled BLOCKED, so the cancellations reflect work-in-progress, not CI health.

## Housekeeping notes

- **twinz is dormant.** No CI activity since 2026-05-30. Its historical `Auto Version Bump` failures (recurring across 2026-05-23 → 2026-05-28) sit outside the 24h window and were not re-analyzed. If the repo is being revived, that workflow should be looked at first — it failed on nearly every push to `master`.
- **Node 20 deprecation warning** on sellerfi's `Vercel Environment Check`: `actions/checkout@v4` and `actions/setup-node@v4` target Node 20 and are being force-run on Node 24. Not currently breaking anything; bumping both to `@v5` is the eventual fix. Not committed this run — it is unrelated to the failure and would be a drive-by change.

## Commits / PRs created this run

| Item | Repo | Link |
|---|---|---|
| Briefing report | Agentic-KB | `wiki/reports/2026-08-19-nightly-ci-analysis.md` |

No code PRs opened. The single failure requires a secret rotation, which is excluded from auto-fix.
