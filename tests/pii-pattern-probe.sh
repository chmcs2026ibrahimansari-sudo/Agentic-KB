#!/bin/bash
# Probe for the interview-related PII patterns in scripts/hooks/pre-commit.
#
# Asserts both directions:
#   - real prep content is still blocked after the 2026-08-28 narrowing
#   - this repo's own audit meta-commentary is no longer blocked
#
# All fixtures are SYNTHETIC. Do not paste real note titles or real names in
# here: this file is not on the hook's exemption list, so real content would
# make the probe itself uncommittable — which is the same class of bug the
# 2026-08-28 narrowing exists to fix.

set -u

PATTERNS=(
  '\bmichelle\b'
  'hiring manager interview'
  'interview cycle'
  'interview cheat ?sheet'
  '\b(my|our|his|her|jay.?s) interview prep\b'
  'interview prep (for|with|at|sheet|notes|doc|document)\b'
  'hiring manager round'
  '(netflix|google|meta|amazon|apple|microsoft|openai|anthropic|adobe).{0,40}(interview|hiring|offer|recruit)'
)

fails=0

check () { # $1=label  $2=text  $3=expect(BLOCK|PASS)
  local hit="" got="PASS"
  for p in "${PATTERNS[@]}"; do
    if printf '%s' "$2" | grep -Eiq "$p"; then hit="$p"; break; fi
  done
  [ -n "$hit" ] && got="BLOCK"
  if [ "$got" = "$3" ]; then
    echo "  ok   [$got] $1"
  else
    echo "  FAIL [got $got, want $3] $1"
    fails=$((fails + 1))
  fi
}

echo "Real prep content — must stay BLOCKED:"
check "cheat sheet, spaced"      "PEER ENGINEERING MANAGER INTERVIEW CHEAT SHEET" BLOCK
check "cheat sheet, unspaced"    "Final Interview Cheatsheet Aug 24"              BLOCK
check "possessive framing"       "my interview prep for tomorrow"                 BLOCK
check "concrete referent"        "interview prep for the platform role"           BLOCK
check "prep document"            "interview prep notes from the recruiter call"   BLOCK
check "company + interview"      "adobe interview loop scheduled"                 BLOCK
check "company + recruiter"      "netflix recruiter reached out"                  BLOCK
check "hiring manager round"     "hiring manager interview on Thursday"           BLOCK
check "active cycle"             "active interview cycle at three places"         BLOCK

echo "Audit meta-commentary — must now PASS:"
check "disposition tally"        "3 interview prep, 2 refused for third-party personal data, 1 link dump" PASS
check "refusal reason"           "refused: interview prep naming identifiable third parties"              PASS
check "category count"           "1 re-modified interview prep note already dispositioned"                PASS

if [ "$fails" -ne 0 ]; then
  echo "FAILED: $fails case(s)"
  exit 1
fi
echo "All cases passed."
