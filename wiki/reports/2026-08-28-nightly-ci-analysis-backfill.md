# Nightly CI Analysis — BACKFILL 2026-08-23 → 2026-08-28 (UTC)

> **Retrospective.** The nightly job did not run between 2026-08-22 and 2026-08-29
> (sandbox provisioning failures, Agentic-KB#5). This report reconstructs that window
> from the GitHub Actions API on 2026-08-29. Window: `2026-08-23T00:00:00Z` →
> `2026-08-28T03:09:04Z`, which abuts the 2026-08-29 report exactly — no gap, no overlap.
> Logs were still retained, so this is real analysis, not reconstruction from memory.

## Summary
Runs: **40** — 24 passed, **6 failed**, 10 skipped
New failures: 5 fingerprints · Recurring: 1 · Suspected flaky: 1
PRs opened: **0** (all Tier B or already-resolved) · Report-only: 5
Health: retrospective

**The week was not quiet.** Six failures went unreported because the job was dark.
Two have since self-resolved; three are still open; one is flaky.

## Failures

### [SellerFi] Production CI/CD Pipeline — main — 2026-08-23 — RESOLVED
- Fingerprint: `37d1af29` — **NEW** → now `fixed`
- Root cause: `permissions/config` — Vercel deploy could not authenticate:

      Error! Could not retrieve Project Settings.
      To link your Project, remove the `.vercel` directory and deploy again.

- **Same root cause as `4a7e8e5e`** (`VERCEL_TOKEN` → `{"code":"forbidden","invalidToken":true}`,
  8/21–8/22). One credential problem, three symptoms, three days.
- **Cascade:** the failed deploy fired `deployment_status`, which ran *Post-Deploy
  Production Smoke* at 19:36 → `Homepage loads correctly` failed (1 failed / 22 passed,
  through retry 2). That smoke failure is **not independent** — it is downstream of the
  deploy. Counting it separately overstates the number of distinct problems.
- Status: **resolved without intervention.** `Vercel Environment Check` has been green
  8/24–8/28 (19s, 19s, 18s, 18s, 17s). Token appears rotated.

### [SellerFi] Auto Version Bump — main — 2026-08-23 — OPEN
- Fingerprint: `9172abb4` — **NEW**
- Root cause: `permissions/config` — push to `main` rejected by a repository ruleset:

      remote: error: GH013: Repository rule violations found for refs/heads/main.
      ! [remote rejected] main -> main (push declined due to repository rule violations)

- Action: **report-only (Tier B).** The fix is a **ruleset bypass for the bot actor** in
  repo settings — not a workflow-file edit, so it falls outside `AUTOFIX_PATH_ALLOWLIST`.
- Suggested fix: Settings → Rules → the ruleset covering `main` → add the Actions bot
  (or `github-actions[bot]`) to the bypass list. Alternatively drop the auto-bump job if
  version bumping is no longer wanted on `main`.

> **Cross-repo pattern worth naming.** `Auto Version Bump` is broken in **both**
> SellerFi (`9172abb4`, ruleset) and twinz (`e90110b2`, missing `permissions:`).
> Different root causes, same symptom: version-bump automation cannot write to the
> default branch. Both have been failing silently for months. If release tagging is
> supposed to be automatic anywhere, it currently is not automatic anywhere.

### [MissionControl] CI — Mission Control — codex/* — 8/26, 8/27 — OPEN
- Fingerprint: `7a81dce6` — **RECURRING** (2 occurrences, 2 branches)
- Root cause: `build error` — the runtime-contract guard, working exactly as designed:

      Runtime contract guard: FAIL
      Public Convex contracts changed without incrementing RUNTIME_CONTRACT_VERSION
      (base v33, current v33).
        - qcRuns:execute: removed
        - webhooks:deliverPending: removed
        - workflows:install: removed

- Location: `convex/lib/runtimeContract.ts` — `RUNTIME_CONTRACT_VERSION`
- Branches: `codex/software-factory-production-convergence`,
  `codex/remove-uncalled-public-actions`
- Fails **two jobs per run** (`Lint`, `System Qualification V2`) from one root cause.
  Six job failures, one bug.
- Action: **report-only (Tier B — source code).**
- Suggested fix: bump `RUNTIME_CONTRACT_VERSION` v33 → v34 on the branch. The branch
  name (`remove-uncalled-public-actions`) says the removals are intentional, so this is
  a one-line change, not a design question.

### [MissionControl] CI — Mission Control — codex/v1-factory-safety-golden-path-closeout — 8/26 — RESOLVED
- Fingerprint: `9239b89f` — **NEW** → now `fixed`
- Root cause: `lint error` — `skill-lint --min-score 80` gate:
  `mission-control-record-memory`, `mission-control-request-approval`, and
  `mission-control-task-lifecycle` each scored **38/100** (validation 40, implementation 98,
  activation 100). The validation sub-score alone sank them.
- Status: **resolved on-branch.** By 8/27 all 10 skills scored 100/100. No action needed.

### [SellerFi] Production CI/CD Pipeline — E2E Full Chromium — 8/23 — FLAKY
- Fingerprint: `6ad700bc` — **NEW**, classified `flaky test`
- 493 passed, 78 skipped, **6 flaky**, 2.1h wall clock:
  `auth-session-continuity`, `seller-listing-workflows`, `deal-close-full-flow`,
  `analytics-verified-traffic`, `entitlements`, `tier-validation`
- Action: **report-only.** §5 forbids auto-fixing flaky tests, correctly.
- Note: a 2.1-hour E2E suite that reports 6 flaky tests on a single run is a signal in
  itself. Worth a dedicated look at test isolation rather than chasing them one by one.

## Performance
`missioncontrol/CI — Mission Control` — median **392.5s** over 20 runs (8/23–8/27),
range 298–459s. Stable; no regression against `DURATION_REGRESSION_X = 1.5`.
Backfilled 24 duration samples across 7 workflows into `durations.json`.

## Activity by day
| Day | SellerFi | MissionControl | twinz |
|---|---|---|---|
| 08-23 | 10 | 2 | 0 |
| 08-24 | 1 | 0 | 0 |
| 08-25 | 4 | 0 | 0 |
| 08-26 | 3 | 12 | 0 |
| 08-27 | 2 | 6 | 0 |

twinz: zero runs all week — dormant since 2026-08-22.

## Changes this run
- Agentic-KB — `docs(reports): backfill nightly CI analysis 2026-08-23..2026-08-28`
- `failures.json`: +5 fingerprints (2 already `fixed`), now 7 tracked
- `durations.json`: +24 samples
- No code-repo PRs opened.

## Notes

1. **Nothing here needed a PR, and that is the honest result.** Two failures self-resolved;
   two are Tier B by rule (repo settings, source code); one is flaky and explicitly
   never auto-fixable. Zero PRs is the correct output for this window, not an
   under-delivery. Had the job been running nightly, it would have opened zero PRs on
   each of these days too.

2. **The cost of the outage was visibility, not fixes.** Six failures went unseen for
   up to six days. The Vercel cascade (8/21→8/23) would have been diagnosed as one
   credential problem on day one instead of appearing as five unrelated red runs.

3. **Two failures resolved with no human action.** Worth knowing — it means some share
   of nightly noise is self-clearing, and a report that only ever lists open problems
   overstates urgency.

4. **`RUNTIME_CONTRACT_VERSION` is the only actionable item here**, and it is one line.

5. Backfill scope was limited to the three repos in `REPOS`. The 2026-08-22 run also
   covered `Agentic-KB` and `Agentic-Pi-Harness`; those are outside current config and
   were not reconstructed. Flagging the config drift rather than silently widening scope.
