#!/usr/bin/env bash
# scripts/morning-review-preflight.sh — cheap gate run before the
# morning-review-daily scheduled task does any real work.
#
# ## Why
#
# Four failure modes have each cost a full run, and all are detectable in a
# couple of seconds:
#
#   1. Anthropic credits exhausted. The compile gate's plan phase is local and
#      always "succeeds", so the run looked healthy while its write phase died
#      every time. 16 consecutive compile runs graduated 0 themes this way,
#      and the cause was misattributed to PIN for months.
#   2. Contact PII in a freshly captured raw/ file. Uncommittable by the
#      pre-commit guard, and the night-shift playbooks refuse to run while
#      raw/ is dirty — 41 blocked Refinery runs from one vendor phone number.
#   3. The KB web server down or erroring. `kb compile`'s write phase is an
#      HTTP POST to it; the gate's plan phase is local and prints a healthy
#      "PROMOTE: N" regardless. On 2026-08-21 every route had been 500ing since
#      a `next dev` run left web/.next with no production build.
#   4. A dirty worktree left by an earlier job. This does not block *this*
#      job — it blocks tonight's night-shift jobs — so it warns, it does not
#      change the exit code. See the exit-code note below.
#
# Checking first turns a 6-minute run that silently accomplishes nothing into
# a 2-second exit with a specific reason.
#
# Usage:
#   ./scripts/morning-review-preflight.sh          # check and auto-fix PII
#   ./scripts/morning-review-preflight.sh --check  # report only, never write
#
# Exit codes (the caller should alert on anything non-zero):
#   0  clear to run
#   1  degraded  — safe to run the pipeline, but the compile/apply phase will
#                  fail. Run Steps 1-4, skip Step 5's compile, say so.
#   2  blocked   — do not run. Worktree or PII needs a human.
#   3  fatal     — environment broken (no repo, no key, no node).
#
# ## Exit code 1 means one thing only: the compile/apply phase cannot succeed
#
# Until 2026-08-21 a dirty worktree also returned 1, so the caller could not
# tell "the API is dead, skip the compile" from "someone left a file
# uncommitted". On 2026-08-21 the tree was dirty, the API was healthy, and the
# caller correctly followed the documented branch and skipped a compile that
# would have worked. A dirty tree does not stop this job compiling — this job
# commits at the end anyway (Step 5.8) — it only threatens tonight's
# night-shift jobs, which is a different audience and a different deadline.
#
# So worktree state is now reported as a WARN line and does NOT affect the
# exit code. Callers that care should grep for `WARN: worktree-dirty`. The
# RESULT line names its cause so no future run has to guess which check fired.
set -uo pipefail

REPO="${KB_REPO:-/Users/jaywest/Agentic-KB}"
CHECK_ONLY=0
[ "${1:-}" = "--check" ] && CHECK_ONLY=1

cd "$REPO" || { echo "FATAL: cannot cd to $REPO"; exit 3; }

status=0
reasons=""
note() { echo "  $*"; }
# worse <code> <slug> — raise the exit status and record which check caused it,
# so the RESULT line can name its cause instead of leaving the caller to guess.
worse() {
  [ "$1" -gt "$status" ] && status="$1"
  case ",$reasons," in *",$2,"*) ;; *) reasons="${reasons:+$reasons,}$2" ;; esac
  return 0
}

echo "morning-review preflight — $(date +%F\ %H:%M)"

# --- 1. API key present -----------------------------------------------------
if [ -z "${ANTHROPIC_API_KEY:-}" ] && [ -f "${REPO}/.env" ]; then
  # shellcheck disable=SC1091
  set -a; . "${REPO}/.env" 2>/dev/null; set +a
fi

if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
  note "✗ ANTHROPIC_API_KEY unset and not in .env"
  echo "RESULT: fatal — no API key"
  exit 3
fi

# --- 2. API reachable and funded --------------------------------------------
# Smallest possible real request. A 400 mentioning credit balance is the
# signal we care about; 401/403 means the key itself is bad.
api_body=$(curl -s --max-time 30 https://api.anthropic.com/v1/messages \
  -H "x-api-key: ${ANTHROPIC_API_KEY}" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-haiku-4-5-20251001","max_tokens":1,"messages":[{"role":"user","content":"."}]}' 2>/dev/null)

if [ -z "$api_body" ]; then
  note "✗ Anthropic API unreachable (network or timeout)"
  worse 1 api-unreachable
elif printf '%s' "$api_body" | grep -qi 'credit balance is too low'; then
  note "✗ Anthropic credit balance exhausted — compile/apply WILL fail"
  note "  → top up at console.anthropic.com, then re-run"
  worse 1 api-credits
elif printf '%s' "$api_body" | grep -qiE '"type" *: *"(authentication|permission)_error"'; then
  note "✗ Anthropic key rejected (auth/permission)"
  worse 1 api-auth
elif printf '%s' "$api_body" | grep -q '"type"[[:space:]]*:[[:space:]]*"error"'; then
  note "! Anthropic API returned an error (non-credit):"
  note "  $(printf '%s' "$api_body" | head -c 200)"
  worse 1 api-error
else
  note "✓ Anthropic API reachable and funded"
fi

# --- 2b. KB web server healthy ----------------------------------------------
# `kb compile`'s write phase POSTs to ${KB_API_URL}/api/compile. On 2026-08-21
# that route had been returning 500 on every request since a `next dev` run
# left web/.next with no production build, so `next start` served an error page
# for every route. The plan phase is local and still printed "PROMOTE: 28", so
# the run looked healthy while nothing was ever written. The API being *funded*
# says nothing about the server being *up* — check both.
#
# Probe /api/compile itself with a GET. The route is POST-only, so a healthy
# server answers 405 — which proves the exact route the write phase needs is
# mounted, without triggering a compile. A broken build answers 5xx here (as it
# did all day on 2026-08-21) and a dead server answers nothing. Anything that
# is not 5xx/000 means the route is reachable.
kb_api="${KB_API_URL:-http://localhost:3002}"
api_code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "${kb_api}/api/compile" 2>/dev/null || echo 000)
case "$api_code" in
  000)
    note "✗ KB web server unreachable at ${kb_api} — compile/apply WILL fail"
    note "  → launchctl kickstart -k gui/\$(id -u)/com.jaywest.agentic-kb-web"
    worse 1 kb-server-down ;;
  5*)
    note "✗ KB web server returning HTTP ${api_code} at ${kb_api} — compile/apply WILL fail"
    note "  → usually web/.next has no production build (a 'next dev' run wipes it)"
    note "  → (cd web && npm run build) && launchctl kickstart -k gui/\$(id -u)/com.jaywest.agentic-kb-web"
    note "  → check logs/web-server-error.log"
    worse 1 kb-server-${api_code} ;;
  *)
    note "✓ KB web server healthy (${kb_api}, /api/compile → ${api_code})" ;;
esac

# --- 3. raw/ PII ------------------------------------------------------------
if [ "$CHECK_ONLY" -eq 1 ]; then
  scrub_out=$(node scripts/scrub-raw-pii.mjs 2>&1); scrub_rc=$?
else
  scrub_out=$(node scripts/scrub-raw-pii.mjs --execute 2>&1); scrub_rc=$?
fi

if [ "$scrub_rc" -eq 0 ]; then
  note "✓ raw/ carries no uncommittable contact PII"
elif [ "$scrub_rc" -eq 2 ]; then
  # Exit 2 after --execute means something needs a human (report-only match).
  note "! raw/ has PII needing review:"
  printf '%s\n' "$scrub_out" | sed 's/^/    /'
  worse 2 raw-pii
else
  note "✗ scrub-raw-pii failed:"
  printf '%s\n' "$scrub_out" | sed 's/^/    /'
  worse 2 scrub-failed
fi

# --- 4. Worktree cleanliness ------------------------------------------------
# The night-shift playbooks block on anything dirty outside their own write
# paths, so a dirty tree here means tonight's Refinery/Scout/Editor are already
# doomed. Report it now rather than discovering it in an error briefing.
dirty=$(git status --porcelain 2>/dev/null | grep -vE '^\?\? briefings/' || true)
if [ -n "$dirty" ]; then
  note "! worktree dirty — will block tonight's night-shift jobs:"
  printf '%s\n' "$dirty" | sed 's/^/    /'
  note "  → commit or revert these before the run ends (Step 5.8)"
  # Deliberately does NOT call worse(). This job commits at the end anyway, so
  # a dirty tree cannot stop it compiling. Raising the exit code here made the
  # caller skip a healthy compile on 2026-08-21. Machine-readable WARN instead.
  worktree_dirty=1
else
  note "✓ worktree clean"
  worktree_dirty=0
fi

# --- 5. Concurrent runner check ---------------------------------------------
# On 2026-08-30 the launchd agent com.morningreview.daily fired at 06:00 and
# this job launched a second pipeline at 06:03. Two concurrent runs append to
# the same daily note. The collision was caught by chance; make it structural.
running=$(pgrep -f 'src\.main' 2>/dev/null | wc -l | tr -d ' ')
if [ "${running:-0}" -gt 0 ]; then
  note "! a Morning Review pipeline is ALREADY RUNNING (${running} process(es)):"
  pgrep -f 'src\.main' 2>/dev/null | while read -r p; do
    printf '    pid %s started %s\n' "$p" "$(ps -o lstart= -p "$p" 2>/dev/null | xargs)"
  done
  note "  → do NOT launch another; poll the existing one or abort"
  worse 2 concurrent-run
else
  note "✓ no Morning Review pipeline currently running"
fi

# --- 6. Web server error log ------------------------------------------------
# The compile route logged `Controller is already closed` on every incremental
# run from May to 2026-08-30 while three separate investigations chased a
# phantom outage. Nobody read this file. Surface it so that cannot recur.
weblog="$REPO/logs/web-server-error.log"
if [ -f "$weblog" ]; then
  recent_errs=$(find "$weblog" -newermt '24 hours ago' 2>/dev/null | wc -l | tr -d ' ')
  if [ "${recent_errs:-0}" -gt 0 ] && grep -qE '⨯|Error|TypeError' "$weblog" 2>/dev/null; then
    note "! web-server-error.log has recent entries — last 3 distinct:"
    grep -E '⨯|TypeError' "$weblog" 2>/dev/null | tail -3 | sed 's/^/    /'
    note "  → read these BEFORE diagnosing any API failure as 'server down'"
  else
    note "✓ web-server-error.log quiet"
  fi
fi

[ "$worktree_dirty" -eq 1 ] && echo "WARN: worktree-dirty"

case "$status" in
  0) echo "RESULT: clear" ;;
  1) echo "RESULT: degraded (${reasons}) — run Steps 1-4; the compile/apply phase WILL fail" ;;
  2) echo "RESULT: blocked (${reasons}) — needs a human before this job can run safely" ;;
esac
exit "$status"
