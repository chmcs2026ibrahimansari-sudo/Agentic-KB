# Nightly CI Analysis — 2026-08-29 (UTC)

## Summary
Runs (24h): 3 — 1 passed, 0 failed, 2 skipped, 0 in progress
New failures: 0 · Recurring: 0 in-window · Suspected flaky: 0
PRs opened: 0 · Report-only: 1 (out-of-window)
Health: **partial** — sandbox unavailable, completed via operator-local fallback

**No CI failures in the last 24 hours across all repos.** That result is verified,
not assumed: the run window was cross-checked against an unfiltered run list to
confirm "all clear" was not a silently broken filter.

## Failures

### In-window
None.

### [twinz] Auto Version Bump — master — OUT OF WINDOW, surfaced deliberately
- Fingerprint: `e90110b2` — **RECURRING** (2nd occurrence, first 2026-05-28, last 2026-08-22)
- Root cause: `permissions/config` — `version-bump.yml` declares no `permissions:`
  block, so `GITHUB_TOKEN` is read-only. The job commits a version bump and pushes
  tags to `master`, which 403s:

      remote: Write access to repository not granted.
      fatal: unable to access 'https://github.com/jaydubya818/twinz/': ... error: 403

- Location: `.github/workflows/version-bump.yml` (no `permissions:` key; line 24 passes
  the read-only `secrets.GITHUB_TOKEN` to `actions/checkout@v3`)
- Blocking a PR: no — blocks every release version bump on `master`
- Action: **skipped — open PR already exists** →
  https://github.com/jaydubya818/twinz/pull/7

**Why this is the headline.** The fix is already written. PR #7
(`fix(ci): grant write perms to Auto Version Bump + clean stale gitlinks`) adds
`permissions: contents: write` at both workflow and job level, and removes two orphan
gitlinks (`EvenCode`, self-referential `twinz`) that cause the companion error
`fatal: No url found for submodule path 'EvenCode' in .gitmodules`. It is 3 files,
+5/−2, and has been **open and unreviewed since 2026-05-20 — 101 days**.

The workflow failed again on 2026-08-22 *because that PR was never merged*. This is
not an unfixed bug; it is an unmerged fix. No second PR was opened — §5 dedupe
(open PR → skip) correctly prevented a duplicate.

> Note: the fingerprint-derived branch name (`fix/ci-e90110b2`) does **not** match
> PR #7's branch (`fix/ci-auto-version-bump`), which predates the fingerprint scheme.
> Exact `head.ref` matching would have missed it and opened a duplicate. Dedupe was
> caught here by listing all `fix/ci-*` branches. Worth hardening in §5.

## Resolved since last run

- **[sellerfi] Vercel Environment Check** (`4a7e8e5e`) — was `open`, 2 consecutive
  failures on 8/21–8/22 with `{"code":"forbidden","invalidToken":true}`. Passed on
  `main` at 2026-08-28T12:53:56Z in 23s. `VERCEL_TOKEN` appears rotated. Marked `fixed`.

## Performance
No regressions. Insufficient in-window samples for a meaningful median comparison
(1 successful run). Not a finding — a consequence of low activity.

## Repo activity (24h window)
| Repo | Runs | Note |
|---|---|---|
| sellerfi | 3 | 1 success, 2 skipped |
| missioncontrol | 0 | last run 2026-08-27T18:16Z, just outside window |
| twinz | 0 | dormant since 2026-08-22 |

`twinz` being dormant is why its only real failure can never surface through a
24-hour window. Recommend the window be supplemented by a "last known failure per
workflow" sweep, independent of recency.

## Changes this run
- Agentic-KB — `docs(reports): nightly CI analysis 2026-08-29`
- No code-repo PRs opened.

## Notes — infrastructure, and this is the real problem

1. **Sandbox provisioning failed 3× identically** (`useradd: exit status 12: cannot
   create directory /sessions/...`). Per §1a this is durable, not transient.
   This is the **5th+ occurrence since 2026-08-20** (8/20, 8/22, 8/26, 8/28, 8/29),
   tracked in Agentic-KB#5, still open, last updated 2026-08-24.

2. **The heartbeat had been stale since 2026-08-22 — seven days dark.** Reports stop
   at `2026-08-22-nightly-ci-analysis.md`. Anything reading `last-run.json` to detect
   silent death would have been reading a 7-day-old date. `ci-heartbeat-watch` either
   is not firing or its alert is not reaching anyone. **That is a worse bug than any
   CI failure in this report** and should be fixed before the sandbox itself.

3. **§8 Track A did not fire again.** Hermes `conversations_list` and the agentic-kb
   MCP write were both denied/interrupted this run, so the abort path produced no
   signal — the third consecutive run where the death-reporting mechanism itself
   failed. §8 was rewritten specifically to survive sandbox loss; it is now failing
   on MCP permission grants instead. The dependency simply moved.

4. **Blast radius.** `kb-daily-lint`, `daily-repo-improvement`, `notes-to-factory`,
   and `kb-autocommit` all shell out and are presumed equally dark. `notes-to-factory`
   last committed 2026-08-28, so it is at least partly alive — worth an explicit audit
   rather than assumption.

5. **`GH_TOKEN` is still the unrotated `gho_` user-OAuth token**, flagged 2026-08-20,
   now 9 days old across ~5 flagged runs. Full account scope, plaintext in `SKILL.md`,
   read into model context every run. Unrelated to today's failure, but it is the
   highest-severity open item in this file and it is not getting done by being
   re-flagged. Replace with a fine-grained PAT scoped to the 4 repos with
   `Actions: read`, `Contents: read/write`, `PRs: read/write`, `Issues: read/write`.

6. **Judgment calls made this run** (unattended → recorded, not asked):
   - Ran via operator-local fallback (Desktop Commander) after sandbox death. This
     matches the precedent set by the 2026-08-22 run.
   - Held §5 auto-fix to **report-only** because the execution environment changed
     from the reviewed sandbox to the operator's own machine. Per the task file's
     "when uncertain, downgrade to report-only rather than acting."
   - Extended triage **beyond** the 24h window for `twinz`, since a dormant repo
     makes the window structurally blind. Flagged clearly as out-of-window.
