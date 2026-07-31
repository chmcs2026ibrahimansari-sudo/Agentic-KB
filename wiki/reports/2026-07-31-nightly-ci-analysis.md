# Nightly CI Analysis — 2026-07-31

Run at 2026-07-31 ~13:08 UTC. Scope: workflow runs in the past 24h across
jaydubya818/sellerfi, jaydubya818/missioncontrol, jaydubya818/twinz.

**Infra note:** the Cowork Linux sandbox was unusable this run (host disk full —
`useradd: No space left on device` on every bash call). Analysis and this commit
were executed on the local Mac via Desktop Commander (gh 2.86.0, git 2.48.1),
using /tmp/work_kb as scratch. No other deviation from the task procedure.

## Summary

Total runs in window: 16 — 5 passed, 6 failed, 0 in progress, 5 skipped.
- sellerfi: 1 failure (recurring)
- missioncontrol: 5 failures, all subsequently resolved overnight
- twinz: no runs in past 24h (last activity 2026-05-30)

No PRs opened this run — neither failure is a low-risk mechanical workflow fix.

## Failures

### 1. sellerfi — "Vercel Environment Check" on main (run 30621743547) — RECURRING
- Failed 2026-07-31 09:56Z and 2026-07-30 09:52Z (daily scheduled check, 2 days running).
- Root cause: **expired/invalid VERCEL_TOKEN secret**. Exact error:
  `❌ Vercel API request failed with HTTP 403` /
  `{"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}`
- Category: dependency/credentials issue — not a code bug.
- Action: **report-only.** Fix requires rotating a secret, which is out of
  scope for auto-fix per hard rules. Jay: generate a new Vercel token
  (Vercel → Settings → Tokens) and update the `VERCEL_TOKEN` repo secret in
  sellerfi (Settings → Secrets and variables → Actions).
- Blocking: not blocking any PR (scheduled check on main), but it will fail
  daily and the workflow's issue-creation step never runs because the script
  exits on the 403 before the missing-var check.

### 2. missioncontrol — "CI — Mission Control" Lint/typecheck (5 runs) — RESOLVED
- Failed runs 00:12–01:13Z on main (x2), codex/task-attempt-scheduler-pr2,
  codex/production-receipt-test-fix, fix/ci-commandcenter-test-mock.
- Root cause: Convex schema drift — generated types missing fields referenced
  in code. Representative errors:
  `error TS2339: Property 'releaseDeploymentId' does not exist on type ...`,
  `'enabled' does not exist in type 'PatchValue<...>'`,
  `Argument of type '"releaseGateEvaluations"' is not assignable to parameter of type 'TableNamesInDataModel<...>'`
  across convex/factory/*, convex/governance/*, convex/context/evals.ts,
  src/DeploymentsView.tsx.
- Category: type error (schema drift), same error across multiple branches →
  recurring within the window, then fixed.
- Action: **report-only — already fixed.** Branch `codex/fix-release-schema-drift`
  passed at 01:23Z; main green at 01:26Z and 01:33Z; previously failing
  branch codex/task-attempt-scheduler-pr2 green at 01:28Z/01:31Z.
- Blocking: no longer blocking anything.

### twinz
- No workflow runs in the past 24h. Repo idle since 2026-05-30. All clear.

## Commits/PRs created this run
- No fix PRs (no mechanical failures).
- This report: `docs(reports): nightly CI analysis 2026-07-31` → Agentic-KB main.

## Action items for Jay
1. Rotate VERCEL_TOKEN in sellerfi repo secrets (2 days of failures, will
   continue failing daily until rotated).
2. Free disk space on the Cowork sandbox host if the useradd/no-space error
   persists on the next scheduled run.
