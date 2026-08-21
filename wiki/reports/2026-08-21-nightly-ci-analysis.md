# Nightly CI Analysis — 2026-08-21 (UTC)

> **Degraded run.** The Cowork Linux sandbox failed to provision
> (`useradd: exit status 12: cannot create directory /sessions/...`), the same
> failure mode as 2026-08-20. Four identical retries. The run was completed via an
> operator-local shell fallback, so CI status below **is** real and verified — but
> auto-fix was deliberately held to report-only (see Notes).

## Summary

Runs (24h): 5 — 4 passed, 1 failed, 0 cancelled, 0 in progress
New failures: 1 · Recurring: 0 · Suspected flaky: 0
PRs opened: 0 · Report-only: 1
Health: **partial**

## Failures

### [SellerFi] Vercel Environment Check — main

- Fingerprint: `4a7e8e5e` — **NEW** (no prior state; this is the first run to
  successfully write `state/nightly-ci/`)
- Root cause: **permissions/config** — the `VERCEL_TOKEN` repository secret is no
  longer accepted by the Vercel API. The token is present and non-empty (it is
  masked in the log), so this is expiry or revocation, not a missing secret.
- Location: `.github/workflows/` → job *Check Vercel Environment Variables*,
  step *Check Production Environment Variables*
- Trigger: `schedule` · run [32466926148](https://github.com/jaydubya818/SellerFi/actions/runs/32466926148) · sha `9611a3b4`
- Blocking a PR: no (scheduled run on `main`)
- Action: **report-only** — the fix is a credential rotation, which §5 Tier B
  places out of scope for auto-fix ("anything requiring a new secret").

Exact error:

```
Checking Vercel production environment variables...
❌ Vercel API request failed with HTTP 403
{"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
##[error]Process completed with exit code 1.
```

**Suggested fix (one step):** mint a new Vercel access token at
<https://vercel.com/account/tokens> with read access to the SellerFi project, then
update the `VERCEL_TOKEN` repository secret:

```
gh secret set VERCEL_TOKEN --repo jaydubya818/SellerFi
```

Re-run the workflow to confirm. No workflow-file change is needed — the workflow
logic is correct and failed loudly and correctly.

**Note the masking failure mode:** because the check `exit 1`s on the API error
*before* reaching its `gh issue create` block, a dead token silently suppresses the
env-var reporting this workflow exists to produce. Open issue
[SellerFi#186](https://github.com/jaydubya818/SellerFi/issues/186)
("🚨 Missing Vercel Environment Variables") is from an earlier run when the token
still worked — treat its contents as **stale**, since the check has not been able to
read Vercel state since the token died. Consider distinguishing "vars missing" from
"cannot check" with different exit paths.

## Performance

No duration regressions. Only 5 runs in the window and `durations.json` was
bootstrapped empty this run, so there is no 14-day baseline yet; regression
detection becomes meaningful from roughly 2026-09-04.

## Changes this run

- No pull requests opened.
- Agentic-KB — `docs(reports): nightly CI analysis 2026-08-21`
  (bootstraps `state/nightly-ci/{failures,durations,last-run}.json`)

## Notes

- **Sandbox provisioning failed** (`useradd` exit 12 on `/sessions`). This is
  host-side and not repairable from inside the job. Retried 4×, identical error.
- **Auto-fix was downgraded to report-only for the whole run** as a judgment call.
  The fallback shell is the operator's own workstation, not the disposable sandbox
  the auto-fix path in §5 was designed around — different git identity, different
  credential material, non-disposable filesystem. Per §5's own guidance ("when
  uncertain, downgrade to report-only rather than acting"), no repo was cloned or
  written to. In practice this cost nothing: the single failure was Tier B anyway.
- **§8 did not fire on 2026-08-20.** There is no open `ci-nightly-abort` issue in
  Agentic-KB and no report for that date, so yesterday's abort was fully silent —
  exactly the failure §8 was written to prevent. The abort protocol needs an
  execution path that does not depend on the sandbox it is reporting the death of.
- **Two credentials are now implicated.** `VERCEL_TOKEN` is confirmed dead, and the
  `GH_TOKEN` in this task file remains an unrotated plaintext `gho_` user token
  flagged on 2026-08-20. It is valid as of this run (verified, HTTP 200 as
  `jaydubya818`), but it carries full account scope and is read into model context
  on every run. Rotating it to a fine-grained PAT is still outstanding.
- Prior auto-fix PRs #167, #179 and #182 are all **closed unmerged**. Per §5 dedupe
  rules those fingerprints should be treated as `wontfix` and never re-proposed;
  they predate this state file, so they are not yet recorded as such.
- `twinz` had zero workflow runs in the window — not an error, just inactive.
