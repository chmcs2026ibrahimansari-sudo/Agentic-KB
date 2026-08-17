# Nightly CI Analysis — 2026-08-17

**Window:** 2026-08-16 17:51 UTC → 2026-08-17 17:51 UTC
**Repos:** jaydubya818/sellerfi, jaydubya818/missioncontrol, jaydubya818/twinz

## Summary

**Total runs: 18 passed, 3 failed, 0 in progress**

| Repo | Passed | Failed | In progress |
|---|---|---|---|
| sellerfi | 0 | 1 | 0 |
| missioncontrol | 18 | 2 | 0 |
| twinz | 0 | 0 | 0 |

twinz had no workflow activity in the window (most recent run: 2026-05-30).

---

## Failure 1 — sellerfi / main / Vercel Environment Check

- **Run:** [32014425762](https://github.com/jaydubya818/sellerfi/actions/runs/32014425762) (scheduled, 09:17 UTC)
- **Workflow:** `.github/workflows/vercel-env-check.yml`, step "Check Production Environment Variables"
- **Root cause category:** credential / secret expiry (not a code defect)

The Vercel REST API call rejects the token:

```
❌ Vercel API request failed with HTTP 403
{"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
```

`invalidToken: true` means the `VERCEL_TOKEN` repository secret is expired or revoked. The workflow logic itself is correct — it fails fast on non-200 before reaching the missing-variable comparison, so this run tells us nothing about whether the four required vars (`BLOB_READ_WRITE_TOKEN`, `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`) are actually present in Vercel Production.

**Recurring:** yes — identical HTTP 403 / `invalidToken` on main for at least 5 consecutive days (08-13, 08-14, 08-15, 08-16, 08-17). Same branch, same scheduled trigger. The daily env check has effectively been dead for ≥5 days.

**Action taken:** report-only. The fix is rotating a secret, which the hard rules exclude from auto-commit. No PR opened.

**Suggested fix (manual, ~2 min):**
1. Generate a fresh token at https://vercel.com/account/settings/tokens with scope covering the SellerFi team.
2. `gh secret set VERCEL_TOKEN --repo jaydubya818/sellerfi`
3. Re-run: `gh run rerun 32014425762 --repo jaydubya818/sellerfi`
4. Also confirm `VERCEL_ORG_ID` — if the project sits under a personal account rather than a team, the appended `&teamId=` param will itself produce a 403 even with a valid token.

**Blocking a PR:** no. Scheduled-only workflow, not a required check on any open PR.

**Related noise:** open issue [#186 "🚨 Missing Vercel Environment Variables"](https://github.com/jaydubya818/sellerfi/issues/186) was auto-filed by this workflow. Its title is misleading — the current failure is auth, not missing variables. Worth closing or retitling once the token is rotated.

---

## Failure 2 — missioncontrol / codex/release-dependency-hardening-v1 / CI — Mission Control

- **Runs:** [32050452815](https://github.com/jaydubya818/missioncontrol/actions/runs/32050452815) (17:28), [32050690546](https://github.com/jaydubya818/missioncontrol/actions/runs/32050690546) (17:31) — both `pull_request` events on PR #116
- **Failing jobs:** TypeScript Type Check, E2E Tests, Build (UI + workspaces) — all at the "Setup pnpm" step
- **Root cause category:** action version / config conflict

```
Error: Multiple versions of pnpm specified:
  - version 9 in the GitHub Action config with the key "version"
  - version pnpm@9.0.0 in the package.json with the key "packageManager"
Remove one of these versions to avoid version mismatch errors like ERR_PNPM_BAD_PM_VERSION
```

PR #116 ("Release hardening and System Qualification V2") pins `pnpm/action-setup` from `@v2` to the v4 SHA `f40ffcd9`. v4 treats a `version:` input alongside `packageManager` in `package.json` as a hard error; v2 tolerated it. `package.json` has carried `"packageManager": "pnpm@9.0.0"` on main all along, so the conflict surfaced the moment the action was upgraded. This is why main stays green on the same `package.json`.

**Recurring:** no — new, confined to this one branch, two commits (`fda98924`, `c0e1b101`).

**Action taken:** report-only — **already resolved by the PR author**. Commit `27b739a9` (branch head) drops the `version: 9` input from all nine `action-setup` blocks; runs [32050898675](https://github.com/jaydubya818/missioncontrol/actions/runs/32050898675) and [32051654507](https://github.com/jaydubya818/missioncontrol/actions/runs/32051654507) are green. No PR opened — there is nothing left to fix.

**Blocking a PR:** was blocking PR #116; now unblocked (`mergeStateStatus: CLEAN`, still draft).

**Carry-forward note:** main's `.github/workflows/ci.yml` still uses `pnpm/action-setup@v2` with `version: 9` in six places. Whenever main is upgraded to v4 — independently of #116 — it will hit this identical error. Merging #116 resolves it; upgrading the action anywhere else without dropping `version:` will reproduce it.

---

## Commits / PRs created this run

| Item | Link |
|---|---|
| Agentic-KB report commit | `docs(reports): nightly CI analysis 2026-08-17` |

No code-repo PRs were opened. Both failures fell outside the mechanical auto-fix criteria: one requires a secret rotation, the other was already fixed upstream by the author before this run executed.
