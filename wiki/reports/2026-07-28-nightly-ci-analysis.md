# Nightly CI Analysis — 2026-07-28

Window: past 24h (2026-07-27 ~13:00 UTC → 2026-07-28 13:00 UTC)
Repos: sellerfi, missioncontrol, twinz

## Summary

Runs in window: **7 total — 0 passed, 3 failed, 4 skipped, 0 in progress.**
Two distinct failure classes. One fixed via PR, one report-only (needs secret rotation).

| Repo | Branch | Workflow | Conclusion |
|---|---|---|---|
| sellerfi | main | Vercel Environment Check (30348575228) | failure |
| sellerfi | nightly/2026-07-28-improvements | Post-Deploy Production Smoke ×2 | skipped |
| missioncontrol | main | CI — Mission Control (30308203968) | failure |
| missioncontrol | feat/docs-eos-pi-bridge-demo-v2 | CI — Mission Control ×2 (30301099727, 30301090540) | failure |
| twinz | — | no runs in window (last run 2026-05-30) | — |

## Failure 1 — missioncontrol: CommandCenterView unit tests (FIXED — PR opened)

- **Repo/branch/workflow:** missioncontrol, `main` + `feat/docs-eos-pi-bridge-demo-v2`, "CI — Mission Control" / Unit Tests
- **Root cause:** test/mock drift (category: test failure). `CommandCenterView` was updated to query `api.eos.projections.getHealthSignals` / `getRecommendations` (and, via subviews, `api.analytics.schematicOverview`), but the vitest mock of `convex/_generated/api` in `apps/mission-control-ui/src/eos/views/CommandCenterView.test.tsx` was never updated → `api.eos` undefined at render: `TypeError: Cannot read properties of undefined (reading 'projections')`. Secondary: the view now renders two "Command Center" headings, making the `getByRole` assertion ambiguous.
- **Recurring:** yes — identical error on `main` and the feature branch (3 runs).
- **Blocking:** yes — blocks CI on `main` and any PR branch until merged.
- **Action taken:** PR opened — https://github.com/jaydubya818/MissionControl/pull/36 (`fix/ci-commandcenter-test-mock`, commit a324627). Test-only change (+10/−1). Verified locally: full mission-control-ui vitest suite 97/97 green.
- **Judgment call:** fix touches a test file rather than workflow YAML. Treated as mechanical/low-risk (mock sync + assertion disambiguation; zero app-code changes), consistent with the auto-fix mandate. Flagging for review regardless — do not merge blind.

## Failure 2 — sellerfi: Vercel Environment Check (REPORT-ONLY — needs secret rotation)

- **Repo/branch/workflow:** sellerfi, `main`, "Vercel Environment Check" (daily cron, 09:00 UTC)
- **Root cause:** dependency/credentials issue. `❌ Vercel API request failed with HTTP 403` from `GET https://api.vercel.com/v9/projects/$VERCEL_PROJECT_ID/env`. The `VERCEL_TOKEN` secret is expired/revoked, or lacks access to the team (`VERCEL_ORG_ID` is passed as `teamId`).
- **Recurring:** yes — identical failure 2026-07-27 (run 30257746696) and 2026-07-28 (run 30348575228). Daily since at least yesterday.
- **Blocking:** no — scheduled job on main; does not gate PRs. But env-drift monitoring is effectively down.
- **Action taken:** report-only. Fix requires a new secret (hard rule: no secrets handling by the nightly job).
- **Suggested fix:** create a fresh Vercel token (Account → Settings → Tokens, scoped to the team owning the SellerFi project), then `gh secret set VERCEL_TOKEN --repo jaydubya818/sellerfi`. Verify `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` still match the project. Re-run via `gh workflow run vercel-env-check.yml --repo jaydubya818/sellerfi`.

## Notes

- sellerfi "Post-Deploy Production Smoke" runs were **skipped** (condition not met), not failures.
- twinz: idle — no workflow runs in the window.
- missioncontrol PR #7 (`fix/pnpm-lockfile-sync`) is open but unrelated to this failure.

## Commits/PRs created this run

1. https://github.com/jaydubya818/MissionControl/pull/36 — fix(ci): sync CommandCenterView test mock with component queries
2. Agentic-KB: `docs(reports): nightly CI analysis 2026-07-28` (this report)
