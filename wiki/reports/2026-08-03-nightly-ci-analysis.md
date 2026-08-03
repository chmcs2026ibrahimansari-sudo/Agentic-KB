# Nightly CI Analysis — 2026-08-03

Scope: workflow runs in the past 24h across jaydubya818/{sellerfi, missioncontrol, twinz}.

## Summary

Total runs (24h window): **7** — 0 passed, **2 failed**, 5 skipped, 0 in progress.

| Repo | Runs (24h) | Failures |
|---|---|---|
| sellerfi | 3 (1 failed, 2 skipped) | 1 |
| missioncontrol | 1 (1 failed) | 1 |
| twinz | 0 (no runs since 2026-05-30) | 0 |

## Failure 1 — sellerfi / Vercel Environment Check (main)

- **Run:** [30805182997](https://github.com/jaydubya818/sellerfi/actions/runs/30805182997) — 2026-08-03 10:20 UTC
- **Root cause (confidence: high):** infrastructure/auth — the workflow's Vercel API call returns **HTTP 403** (`❌ Vercel API request failed with HTTP 403`). The env-var check never runs; the token used (VERCEL_TOKEN secret) is expired, revoked, or lacks scope for the project/team.
- **Recurring:** yes — identical failure daily on main: 07-31, 08-01, 08-02, 08-03. This is a scheduled check, not tied to a PR, so it is **not blocking any PR**, but it has been dead for ≥4 days.
- **Action taken:** report-only. Fix requires rotating a secret, which is outside auto-fix scope.
- **Suggested fix:** generate a new Vercel token (correct team scope), update the `VERCEL_TOKEN` repo secret in sellerfi → Settings → Secrets → Actions. Optionally have the workflow distinguish 401/403 (token problem) from missing vars so the created issue is accurate.

## Failure 2 — missioncontrol / CI — Mission Control, Lint job (main)

- **Run:** [30789132136](https://github.com/jaydubya818/missioncontrol/actions/runs/30789132136) — 2026-08-03 06:07 UTC
- **Root cause (confidence: high):** contract-guard failure, introduced by the factory foundation merge to main (`9b043c8b` "Merge governed AI software factory foundation" / `8014d5af`). `scripts/check-runtime-contract.mjs` reports: *"Public Convex contracts changed without incrementing RUNTIME_CONTRACT_VERSION (base v4, current v4)"* — args changed on `context/changeRisk:*` and `context/verifiers:*`, `factory/configuration:*` added, and `loopEngineering:recordProjectionFailure` **removed** (renamed to `recordProjectionFailureFromService`).
- **Recurring:** new — previous main run (08-02 05:35) was green. A similar guard failure appeared once on `codex/company-control-plane-complete` (08-02) and was fixed on that branch.
- **Action taken:** report-only. The guard's own remediation is "Increment RUNTIME_CONTRACT_VERSION in `convex/lib/runtimeContract.ts` and ship the client/backend contract atomically" — but the change set includes a **removed public function**, so a bare version bump could paper over a client-breaking change. That's a judgment call, not a mechanical fix.
- **Suggested fix:** if the factory-merge contract changes are intentional, bump `RUNTIME_CONTRACT_VERSION` to v5 in `convex/lib/runtimeContract.ts` and verify no client still calls `loopEngineering:recordProjectionFailure`; land as `fix(ci): bump runtime contract to v5 after factory merge`.
- **Blocking:** main CI is red — this will fail CI for anything merging to main until resolved. Note PRs #32–34 (land/cbom, land/eval, land/executor) rebase onto this main.

## twinz

No workflow runs in the past 24h (last activity 2026-05-30). Nothing to analyze.

## Auto-fix PRs opened this run

None — both failures fall outside mechanical-fix scope (secret rotation; contract version judgment call).

## Commits this run

- `docs(reports): nightly CI analysis 2026-08-03` → Agentic-KB main (this file).
