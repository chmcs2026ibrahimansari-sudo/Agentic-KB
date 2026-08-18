# Nightly CI Analysis — 2026-08-18

**Window:** 2026-08-17 13:27 UTC → 2026-08-18 13:27 UTC
**Repos:** jaydubya818/sellerfi, jaydubya818/missioncontrol, jaydubya818/twinz

## Summary

| | Passed | Failed | Skipped | Cancelled | In progress |
|---|---|---|---|---|---|
| sellerfi | 0 | 1 | 9 | 0 | 0 |
| missioncontrol | 14 | 4 | 0 | 1 | 0 |
| twinz | 0 | 0 | 0 | 0 | 0 |
| **Total** | **14** | **5** | **9** | **1** | **0** |

**Headline:** `main` is green on all three repos. The only live failure is sellerfi's daily Vercel Environment Check, which has an expired `VERCEL_TOKEN` — this needs a human to rotate the secret. The four missioncontrol failures were transient PR-iteration failures that the author already fixed on the same branches.

**No PRs were opened this run.** Reasoning is documented per-failure below.

---

## Failures

### 1. sellerfi — Vercel Environment Check (LIVE, recurring, needs human)

- **Run:** [32120278782](https://github.com/jaydubya818/sellerfi/actions/runs/32120278782) · branch `main` · trigger `schedule` · 2026-08-18 09:11 UTC
- **Root cause category:** credential/secret expiry (not a code defect)
- **Exact error:**
  ```
  ❌ Vercel API request failed with HTTP 403
  {"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
  ```
- **Location:** `.github/workflows/` — "Check Vercel Environment Variables" step, at the `curl` to the Vercel API. Fails before the missing-vars logic runs, so the workflow's `gh issue create` fallback never fires (no issue spam, but also no signal outside Actions).
- **New or recurring:** **Recurring — 4 consecutive days.** Confirmed identical `invalidToken: true` 403 on runs [32014425762](https://github.com/jaydubya818/sellerfi/actions/runs/32014425762) (08-17), [31938252478](https://github.com/jaydubya818/sellerfi/actions/runs/31938252478) (08-16), and [31876227942](https://github.com/jaydubya818/sellerfi/actions/runs/31876227942) (08-15). First failure in the visible window is 08-15.
- **Action taken:** **Report-only.** Per the standing hard rule, fixes requiring new/rotated secrets are not auto-committed.
- **Blocking a PR:** No. Scheduled-only workflow on `main`; does not gate PR #198.
- **Suggested fix (for Jay):** Generate a fresh Vercel access token with read scope on the SellerFi project and update the `VERCEL_TOKEN` repo secret. The token is genuinely rejected by Vercel (`invalidToken: true`), so this is expiry or revocation, not a scoping bug. Secondary hardening worth considering once the token is valid: have the 403 branch also open/update a GitHub issue so a dead token surfaces outside the Actions tab instead of silently failing for four days.

### 2. missioncontrol — CI, pnpm version conflict (SELF-RESOLVED)

- **Runs:** [32050452815](https://github.com/jaydubya818/missioncontrol/actions/runs/32050452815) (17:28) and [32050690546](https://github.com/jaydubya818/missioncontrol/actions/runs/32050690546) (17:31) · branch `codex/release-dependency-hardening-v1` · PR #116
- **Root cause category:** dependency/toolchain config error
- **Exact error** (all 9 jobs failed at the same `Setup pnpm` step):
  ```
  Error: Multiple versions of pnpm specified:
    - version 9 in the GitHub Action config with the key "version"
    - version pnpm@9.0.0 in the package.json with the key "packageManager"
  Remove one of these versions to avoid version mismatch errors like ERR_PNPM_BAD_PM_VERSION
  ```
- **New or recurring:** New, single-branch, short-lived.
- **Action taken:** **No fix needed — already resolved.** Verified `.github/workflows/ci.yml` on `main`: all four `pnpm/action-setup@v4` invocations now have no `version:` key, so `packageManager` in `package.json` is the single source of truth. The next two runs on the same branch ([32050898675](https://github.com/jaydubya818/missioncontrol/actions/runs/32050898675) 17:34, [32051654507](https://github.com/jaydubya818/missioncontrol/actions/runs/32051654507) 17:44) both passed.
- **Blocking a PR:** No — superseded by green runs on the same head branch.

### 3. missioncontrol — CI, E2E + browser/a11y gates (SELF-RESOLVED)

- **Runs:** [32062660165](https://github.com/jaydubya818/missioncontrol/actions/runs/32062660165) (19:51) and [32062901981](https://github.com/jaydubya818/missioncontrol/actions/runs/32062901981) (19:54) · branch `codex/autonomous-execution-routing-v1`
- **Failing jobs:** E2E Tests, Browser Security and Accessibility, and (19:51 run only) System Qualification V2
- **Root cause category:** test failure — Playwright locator assertion, element never rendered
- **Exact error:**
  ```
  1) [chromium] › tests/e2e/arm-ui.e2e.spec.ts:9:1 › retained operator routes resolve in Mission Control shell
     Error: expect(locator).toBeVisible() failed
     Error: element(s) not found
       at tests/e2e/arm-ui.e2e.spec.ts:17:97
  ```
- **File/line:** `tests/e2e/arm-ui.e2e.spec.ts:17` (assertion), test declared at line 9.
- **New or recurring:** New, single-branch. Failed on two consecutive pushes then passed — consistent with a real routing/render gap the author fixed, not flake (a flaky locator would not fail deterministically twice and then pass three times).
- **Action taken:** **No fix needed — already resolved.** Runs [32063266323](https://github.com/jaydubya818/missioncontrol/actions/runs/32063266323) (19:58), [32063939793](https://github.com/jaydubya818/missioncontrol/actions/runs/32063939793) (20:05), and [32068935751](https://github.com/jaydubya818/missioncontrol/actions/runs/32068935751) (21:01) on the same branch all passed. Would have required application code changes regardless — outside auto-fix scope.
- **Blocking a PR:** No.

### 4. missioncontrol — cancelled run (informational)

Run [32089333357](https://github.com/jaydubya818/missioncontrol/actions/runs/32089333357) on `codex/review-intelligence-alignment-v1-20260817` was cancelled, superseded by [32089352618](https://github.com/jaydubya818/missioncontrol/actions/runs/32089352618) which passed. Normal concurrency-group behaviour, no action.

### 5. twinz — no CI activity

Zero workflow runs in the window. Most recent activity is 2026-05-30. The repo appears dormant.

---

## Standing items worth Jay's attention

Not failures from this window, but surfaced while checking for duplicate PRs:

- **twinz has three stale open CI-fix PRs, two of which are duplicates.** [#8 `fix/version-bump-contents-write`](https://github.com/jaydubya818/twinz/pull/8) and [#7 `fix/ci-auto-version-bump`](https://github.com/jaydubya818/twinz/pull/7) both grant `contents: write` to the Auto Version Bump workflow. #8's CI passed on 2026-05-30; #7's failed. Suggest merging #8 and closing #7. Also open: [#5](https://github.com/jaydubya818/twinz/pull/5) (OPENAI_API_KEY for E2E), [#4](https://github.com/jaydubya818/twinz/pull/4). The historical `Auto Version Bump` failures on `master` (7 consecutive pushes, May 22–28) are what #8 fixes — they will recur the moment twinz sees a push.
- **missioncontrol has an open [PR #7 `fix/pnpm-lockfile-sync`](https://github.com/jaydubya818/missioncontrol/pull/7)** in the same problem area as failure #2. Worth confirming it is not now stale.

---

## Commits / PRs created this run

| Item | Link |
|---|---|
| Agentic-KB briefing commit | `wiki/reports/2026-08-18-nightly-ci-analysis.md` on `main` |

No code-repo PRs opened. The one live failure requires a secret rotation (excluded from auto-fix by standing rule); the remaining failures were already fixed by their authors before this run.
