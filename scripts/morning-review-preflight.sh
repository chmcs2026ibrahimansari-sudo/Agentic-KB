#!/usr/bin/env bash
# scripts/morning-review-preflight.sh — cheap gate run before the
# morning-review-daily scheduled task does any real work.
#
# ## Why
#
# Three failure modes have each cost a full run, and all three are detectable
# in under two seconds:
#
#   1. Anthropic credits exhausted. The compile gate's plan phase is local and
#      always "succeeds", so the run looked healthy while its write phase died
#      every time. 16 consecutive compile runs graduated 0 themes this way,
#      and the cause was misattributed to PIN for months.
#   2. Contact PII in a freshly captured raw/ file. Uncommittable by the
#      pre-commit guard, and the night-shift playbooks refuse to run while
#      raw/ is dirty — 41 blocked Refinery runs from one vendor phone number.
#   3. A dirty worktree left by an earlier job, which blocks the same gate.
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
set -uo pipefail

REPO="${KB_REPO:-/Users/jaywest/Agentic-KB}"
CHECK_ONLY=0
[ "${1:-}" = "--check" ] && CHECK_ONLY=1

cd "$REPO" || { echo "FATAL: cannot cd to $REPO"; exit 3; }

status=0
note() { echo "  $*"; }
worse() { [ "$1" -gt "$status" ] && status="$1"; return 0; }

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
  worse 1
elif printf '%s' "$api_body" | grep -qi 'credit balance is too low'; then
  note "✗ Anthropic credit balance exhausted — compile/apply WILL fail"
  note "  → top up at console.anthropic.com, then re-run"
  worse 1
elif printf '%s' "$api_body" | grep -qiE '"type" *: *"(authentication|permission)_error"'; then
  note "✗ Anthropic key rejected (auth/permission)"
  worse 1
elif printf '%s' "$api_body" | grep -q '"type"[[:space:]]*:[[:space:]]*"error"'; then
  note "! Anthropic API returned an error (non-credit):"
  note "  $(printf '%s' "$api_body" | head -c 200)"
  worse 1
else
  note "✓ Anthropic API reachable and funded"
fi

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
  worse 2
else
  note "✗ scrub-raw-pii failed:"
  printf '%s\n' "$scrub_out" | sed 's/^/    /'
  worse 2
fi

# --- 4. Worktree cleanliness ------------------------------------------------
# The night-shift playbooks block on anything dirty outside their own write
# paths, so a dirty tree here means tonight's Refinery/Scout/Editor are already
# doomed. Report it now rather than discovering it in an error briefing.
dirty=$(git status --porcelain 2>/dev/null | grep -vE '^\?\? briefings/' || true)
if [ -n "$dirty" ]; then
  note "! worktree dirty — will block tonight's night-shift jobs:"
  printf '%s\n' "$dirty" | sed 's/^/    /'
  note "  → commit or revert these before the run ends"
  # Not fatal to *this* job, which commits at the end anyway.
  worse 1
else
  note "✓ worktree clean"
fi

case "$status" in
  0) echo "RESULT: clear" ;;
  1) echo "RESULT: degraded — run Steps 1-4; expect the compile/apply phase to fail" ;;
  2) echo "RESULT: blocked — needs a human before this job can run safely" ;;
esac
exit "$status"
