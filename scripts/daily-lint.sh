#!/usr/bin/env bash
# scripts/daily-lint.sh — daily Agentic-KB wiki health check
#
# Replaces the ~40 lines of bash that used to live inline in the scheduled-task
# prose, where it was re-interpreted by the agent every morning and free to
# drift. The scheduled task should now be: run this script, relay its summary.
#
#   ./scripts/daily-lint.sh
#
# Guarantees:
#   - a commit is pushed on EVERY run (heartbeat), success or failure
#   - the lint report is PII-redacted before staging
#   - only wiki/lint-report.md is ever staged, never other pending work
#
# Exit codes (the caller alerts on anything non-zero):
#   0  healthy
#   1  attention needed  (contradictions open, or orphans grew by > ORPHAN_ALERT)
#   2  degraded          (lint ran, AI analysis failed; counts still valid)
#   3  failed            (server unreachable or lint call failed entirely)
set -uo pipefail

REPO="${KB_REPO:-/Users/jaywest/Agentic-KB}"
PORT="${KB_PORT:-3009}"
BASE="http://localhost:${PORT}"
LOG="${REPO}/logs/kb-dev-server.log"
REPORT="wiki/lint-report.md"
ORPHAN_ALERT="${ORPHAN_ALERT:-5}"
# The 2026-08-13 run failed because a 180s client timeout cut off a server call
# that went on to finish in 4.4 minutes. Give it real headroom.
LINT_TIMEOUT="${LINT_TIMEOUT:-600}"

cd "$REPO" || { echo "FATAL: cannot cd to $REPO"; exit 3; }
mkdir -p "${REPO}/logs"

# The daily commit is a heartbeat: it must happen even if this script dies on an
# unexpected error. The first version aborted on an unbound variable partway
# through and silently produced no commit at all, which is precisely the failure
# the heartbeat exists to make visible.
COMMITTED=""
on_exit() {
  local rc=$?
  if [ -z "$COMMITTED" ]; then
    echo "ALERT: script exited (rc=${rc}) before committing — writing marker"
    git commit -q --allow-empty -m "chore: daily wiki lint $(date +%F) — SKIPPED (script aborted, rc=${rc})" 2>/dev/null \
      && git push -q origin main 2>/dev/null \
      && echo "pushed marker: $(git log -1 --format=%h)"
  fi
}
trap on_exit EXIT

http_code() { curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$1" 2>/dev/null || echo "000"; }

# --- alerting ---------------------------------------------------------------
# Deliberately zero-config and local. A daily job whose failures are only
# visible by reading the scheduler's transcript is a job that fails unnoticed —
# 2 of the 15 runs before 2026-08-20 were dead and nobody found out. macOS
# notifications need no credentials and cannot spam anyone but the user.
alert() {
  local msg="$1"
  echo "ALERT: ${msg}"
  printf '%s\t%s\n' "$(date -Iseconds)" "$msg" >> "${REPO}/logs/lint-alerts.log"
  osascript -e "display notification \"${msg//\"/}\" with title \"KB daily lint\"" 2>/dev/null || true
}

# Cheapest possible probe: 1 output token. Catches an exhausted credit balance
# in ~1s instead of walking 763 pages and burning 30s to reach the same answer.
# Mirrors the check in scripts/morning-review-preflight.sh.
credits_exhausted() {
  local key body
  key="$(grep '^ANTHROPIC_API_KEY=' "${REPO}/web/.env.local" 2>/dev/null | cut -d= -f2- | tr -d '\r\n')"
  [ -n "$key" ] || return 1   # can't tell; let the real call decide
  body="$(curl -s --max-time 20 https://api.anthropic.com/v1/messages \
    -H "x-api-key: ${key}" -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{"model":"claude-haiku-4-5-20251001","max_tokens":1,"messages":[{"role":"user","content":"hi"}]}' 2>/dev/null)"
  printf '%s' "$body" | grep -qi 'credit balance is too low'
}

# --- commit heartbeat -------------------------------------------------------
# Always leaves a commit on main. Success mode stages only the report.
commit_and_push() {
  local mode="$1" msg="$2"

  if [ "$mode" = "success" ]; then
    # Pre-commit PII guard blocks any report line referencing _private/.
    sed -i '' '/_private\//d' "$REPORT" 2>/dev/null || true
    git add "$REPORT"
    if git diff --cached --quiet -- "$REPORT"; then
      git reset -q HEAD -- "$REPORT"
      mode="empty"
      msg="${msg} (report unchanged)"
    elif ! git commit -q -m "$msg" -- "$REPORT"; then
      # Never --no-verify past the guard; fall back to a marker commit.
      git reset -q HEAD -- "$REPORT"
      mode="empty"
      msg="chore: daily wiki lint $(date +%F) — SKIPPED (PII guard blocked report)"
      echo "ALERT: pre-commit PII guard rejected the lint report"
    fi
  fi

  [ "$mode" = "empty" ] && git commit -q --allow-empty -m "$msg"
  COMMITTED=1   # disarms the EXIT-trap heartbeat

  if git push -q origin main 2>&1; then
    echo "pushed: $(git log -1 --format=%h) $msg"
  else
    echo "PUSH FAILED (not force-pushing; resolve manually): $msg"
  fi
}

fail() {
  echo "$1"
  echo "--- last 20 lines of ${LOG} ---"
  tail -20 "$LOG" 2>/dev/null || echo "(no server log)"
  commit_and_push empty "chore: daily wiki lint $(date +%F) — SKIPPED ($2)"
  exit 3
}

# --- 1. ensure the dev server is up -----------------------------------------
if [ "$(http_code "${BASE}/api/pending-count")" != "200" ]; then
  echo "server down, starting..."
  ( cd "${REPO}/web" && nohup npm run dev > "$LOG" 2>&1 < /dev/null & disown ) || true

  up=""
  for _ in $(seq 1 30); do
    sleep 3
    [ "$(http_code "${BASE}/api/pending-count")" = "200" ] && { up=1; break; }
  done
  [ -n "$up" ] || fail "server did not come up within 90s" "server unreachable on :${PORT}"
  echo "server up"
fi

# --- 2. run the lint --------------------------------------------------------
# Fail fast on an exhausted balance. The lint would still produce valid orphan
# and stale counts via the degraded path, so this is not a hard stop — but it
# turns a vague 502 buried in JSON into an unambiguous "top up your credits".
if credits_exhausted; then
  alert "Anthropic credits exhausted — contradiction/gap analysis will be skipped. Top up at console.anthropic.com"
fi

PIN="$(grep '^PRIVATE_PIN=' "${REPO}/web/.env.local" 2>/dev/null | cut -d= -f2- | tr -d '\r\n')"
RESP="$(curl -s --max-time "$LINT_TIMEOUT" -X POST \
  -H "Content-Type: application/json" \
  -d "{\"pin\":\"${PIN}\"}" "${BASE}/api/lint" 2>/dev/null)"

echo "$RESP" | jq -e '.ok == true' >/dev/null 2>&1 \
  || fail "lint call failed: ${RESP:0:400}" "lint API error"

# --- 3. summarise -----------------------------------------------------------
# One jq call per field. A single @sh template is denser but nests shell quotes
# inside a jq string literal, which is how the first version of this script
# silently produced a compile error and skipped the heartbeat commit entirely.
jqf() { echo "$RESP" | jq -r "${1} // ${2}" 2>/dev/null || echo "$2"; }

PAGES=$(jqf '.pagesScanned' 0)
CONTRA=$(jqf '.contradictions' 0)
ORPHANS=$(jqf '.orphans' 0)
STALE=$(jqf '.stalePages' 0)
GAPS=$(jqf '.gaps' 0)
ODELTA=$(jqf '.orphanDelta' 0)
EXAMINED=$(jqf '.analysisWindow.examined' 0)
DEGRADED=$(jqf '.degraded' false)
REASON=$(echo "$RESP" | jq -r '.degradedReason // ""' 2>/dev/null | tr -d '\n' | cut -c1-200)

echo "pages=${PAGES} contradictions=${CONTRA} orphans=${ORPHANS} (Δ${ODELTA}) stale=${STALE} gaps=${GAPS}"
echo "analysis window: ${EXAMINED}/${PAGES} pages"

status=0
if [ "$DEGRADED" = "true" ]; then
  alert "degraded run — ${REASON}"
  status=2
else
  [ "$CONTRA" -gt 0 ] && { alert "${CONTRA} open contradiction(s) in the wiki"; status=1; }
  [ "$ODELTA" -gt "$ORPHAN_ALERT" ] && { alert "orphans grew by ${ODELTA} since the last run"; status=1; }
fi

# --- 4. commit --------------------------------------------------------------
if [ "$DEGRADED" = "true" ]; then
  commit_and_push success "chore: daily wiki lint $(date +%F) — DEGRADED, ${PAGES} pages, ${ORPHANS} orphans, ${STALE} stale"
else
  commit_and_push success "chore: daily wiki lint $(date +%F) — ${PAGES} pages, ${CONTRA} contradictions, ${ORPHANS} orphans, ${STALE} stale"
fi

exit $status
