# Nightly CI Analysis — 2026-07-02

**Window:** last 24 hours (2026-07-01 ~10:05 UTC → 2026-07-02 ~10:05 UTC)

## Summary

| Repo | Runs | Passed | Failed | In Progress |
|------|------|--------|--------|-------------|
| sellerfi | 1 | 0 | 1 | 0 |
| missioncontrol | 0 | — | — | — |
| twinz | 0 | — | — | — |
| **Total** | **1** | **0** | **1** | **0** |

---

## Failures

### ❌ sellerfi — `main` — Vercel Environment Check

**Run ID:** 28581917384 (2026-07-02T10:04:36Z)

**Root cause:** Expired/revoked `VERCEL_TOKEN` secret.

The workflow calls the Vercel REST API (`GET /v9/projects/{id}/env`) using `secrets.VERCEL_TOKEN`. The API returned HTTP 403:

```
❌ Vercel API request failed with HTTP 403
{"error":{"code":"forbidden","message":"Not authorized","invalidToken":true}}
```

This is a credential issue, not a code or workflow YAML bug. The token in GitHub Actions secrets is no longer valid.

**Recurrence:** Failing every day for 10+ consecutive days (at least since 2026-06-23). Chronic unresolved issue.

**Existing issue:** GitHub issue #186 "🚨 Missing Vercel Environment Variables" has been open since 2026-05-05 — created by the workflow's own error handler, still unresolved.

**Blocking a PR?** No. Scheduled daily check on `main`; no open PRs affected.

**Action taken:** ⚠️ **Report-only** — cannot fix via code commit. Requires secret rotation.

**Suggested fix (manual — Jay must do this):**
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens) — generate a new token.
2. In GitHub → jaydubya818/sellerfi → Settings → Secrets → `VERCEL_TOKEN` — update the value.
3. Re-run the workflow manually to confirm it clears.

---

## Green Repos

- **missioncontrol** — No runs in window. Last run: 2026-06-11 ✅ passing.
- **twinz** — No runs in window. Last run: 2026-05-30 ✅ passing.

---

## PRs / Commits Created

None — only fixable failure requires secret rotation, not a code change.
