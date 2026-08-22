# Nightly CI Analysis — 2026-08-22 (UTC)

> **Degraded run — 3rd consecutive day.** Cowork sandbox still fails to provision
> (`useradd: exit status 12`). Now tracked durably in
> [Agentic-KB#5](https://github.com/jaydubya818/Agentic-KB/issues/5). Completed via
> operator-local fallback; CI findings below are verified and real.

## Summary

Runs (24h): 7 — 4 passed, 1 failed, 2 skipped, 0 in progress
New failures: 0 · Recurring: 1 · Suspected flaky: 0
PRs opened: 0 · Report-only: 1
Health: **partial**
Coverage: **expanded 3 → 5 repos** (added `Agentic-KB`, `Agentic-Pi-Harness`)

## Failures

### [SellerFi] Vercel Environment Check — main

- Fingerprint: `4a7e8e5e` — **RECURRING** (2nd occurrence since 2026-08-21)
- Root cause: **permissions/config** — `VERCEL_TOKEN` rejected by the Vercel API.
- Run [32564142732](https://github.com/jaydubya818/SellerFi/actions/runs/32564142732)
  · sha `9611a3b4` · `schedule` · identical error to yesterday:

```
❌ Vercel API request failed with HTTP 403
{"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
```

- Action: **report-only** (§5 Tier B — credential rotation).
- Fix: `gh secret set VERCEL_TOKEN --repo jaydubya818/SellerFi`

Note the sha is unchanged from yesterday (`9611a3b4`) — this is the same scheduled
check against the same commit, not new breakage. It will recur every night until the
token is rotated. There is nothing to fix in the repo.

### Considered and rejected for auto-fix

The workflow's `exit 1` on API error fires *before* its `gh issue create` block, so a
dead token suppresses the very reporting this check exists to produce. That is a real
defect and the diff would be small and inside `.github/workflows/**` — but it fails
the §5 Tier A test "you can state exactly why the error goes away," because it would
**not** make this failure go away. The token would still be dead; the job would still
fail, just more informatively. Filing it as an unrequested PR alongside a failure it
doesn't fix is scope creep, so it is recorded here instead:

> Split the failure modes — exit with a distinct message and label for *"cannot
> reach Vercel / token invalid"* versus *"reached Vercel, variables missing."*
> Only the second should file the "Missing Vercel Environment Variables" issue.

Open issue [SellerFi#186](https://github.com/jaydubya818/SellerFi/issues/186) is a
product of the first mode masquerading as the second and remains **stale**.

## Performance

No regressions. `durations.json` now holds 2 days; the 14-day baseline that makes
`DURATION_REGRESSION_X` meaningful lands around 2026-09-04.

## Newly monitored

- `Agentic-KB` — 2 workflows, 2/2 green. Note it is now both a monitored repo and
  the KB target, so §6's own briefing commit triggers its workflows and the next run
  analyses runs this job caused.
- `Agentic-Pi-Harness` — 1 workflow, 1/1 green.
- Excluded (zero workflows, nothing to analyse): `obsidian-vault`, `agentic_hr`,
  `hermes-harness-missioncontrol`, `ai-software-factory-mastery`, `AI-FDE-Agent`,
  `morning-review`.
- `twinz` remains configured but has had no runs since 2026-06-02.

## Changes this run

- No pull requests opened.
- Agentic-KB [#5](https://github.com/jaydubya818/Agentic-KB/issues/5) — sandbox
  provisioning tracking issue (first durable §8 signal since the 2026-08-20 outage).
- Agentic-KB — `docs(reports): nightly CI analysis 2026-08-22`

## Notes

- **§8's circular dependency is the top structural finding.** The abort path needs
  the sandbox in order to report the sandbox's death, so three consecutive degraded
  runs produced zero signal until one was filed by hand. The abort protocol needs an
  execution path independent of the environment it reports on.
- Auto-fix remains held to report-only while running from the operator's workstation
  rather than a disposable sandbox — no repo was cloned or written to.
- `GH_TOKEN` in the task file is still an unrotated plaintext `gho_` user token
  (valid this run, HTTP 200). Two credentials are now implicated: this one and the
  dead `VERCEL_TOKEN`.
- Repo names in `REPOS` are deliberately left lowercase; fingerprints hash the repo
  string, so re-casing would silently reset all recurrence history.
