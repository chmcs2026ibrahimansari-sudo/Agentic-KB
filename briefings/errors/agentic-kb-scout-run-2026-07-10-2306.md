# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** not provided
- **Timestamp:** 2026-07-10 23:06 PDT
- **Phase/stage:** pre-run dirty-worktree safety check
- **Status:** blocked before fetching URLs or writing Scout captures

## Blocked reason

`git status --porcelain` found dirty files outside the Scout Run allowlist.

Scout allowlist from `playbooks/scout-run.md`:
- `.night-shift/state/`
- `briefings/`
- `raw/framework-docs/`
- `raw/transcripts/`
- `raw/code-examples/`
- `logs/web-server-error.log`
- `logs/web-server.log`
- `logs/audit.log`
- `logs/kb-dev-server.log`
- `raw/reading-list.md`

Dirty files outside that allowlist:

```text
 M wiki/index.md
 M wiki/log.md
 M wiki/mocs/orchestration.md
?? wiki/patterns/pattern-agent-as-ui-system-of-record-backend.md
?? wiki/patterns/pattern-navigator-driver-agentic-coding.md
?? wiki/patterns/pattern-outcome-metrics-for-agent-adoption.md
?? wiki/syntheses/synthesis-agentic-engineering-operating-model.md
```

Dirty files present but allowed for Scout safety evaluation:

```text
 M .night-shift/state/scout-processed.json
 M logs/audit.log
 M logs/kb-dev-server.log
 M raw/reading-list.md
?? briefings/errors/agentic-kb-editor-run-2026-07-07-0626.md
?? briefings/errors/agentic-kb-editor-run-2026-07-08-0705.md
?? briefings/errors/agentic-kb-editor-run-2026-07-09-0626.md
?? briefings/errors/agentic-kb-editor-run-2026-07-10-0626.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-08-0339.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-09-0316.md
?? briefings/errors/agentic-kb-refinery-run-2026-07-10-0315.md
?? briefings/scout-2026-07-07.md
?? briefings/scout-2026-07-08.md
?? briefings/scout-2026-07-09.md
?? briefings/scout-2026-07-10.md
?? raw/framework-docs/sierra-ai-blog-ai-pilling-our-company-lessons-learned.md
?? raw/framework-docs/www-linkedin-com-jobs-view-4438558062.md
?? raw/framework-docs/www-linkedin-com-posts-eordax-ai-claude-ugcpost-7480733978405109760-4xi.md
?? raw/framework-docs/www-linkedin-com-posts-linasbeliunas-these-are-2-senior-staff-engineers-at-airbnb-ugcpost-.md
?? raw/framework-docs/www-linkedin-com-pulse-copy-netflix-ntech-sre-purpose-built-approach-reliability-scale-ozc.md
```

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/scout-run.md`
- `raw/reading-list.md`
- `.night-shift/state/scout-processed.json`

## Files written or attempted

Written:
- `briefings/errors/agentic-kb-scout-run-2026-07-10-2306.md`

Attempted:
- none; the run stopped before URL fetch/capture writes.

## Files that may need review

Review or commit/stash the non-Scout wiki changes before the next unattended Scout run:

- `wiki/index.md`
- `wiki/log.md`
- `wiki/mocs/orchestration.md`
- `wiki/patterns/pattern-agent-as-ui-system-of-record-backend.md`
- `wiki/patterns/pattern-navigator-driver-agentic-coding.md`
- `wiki/patterns/pattern-outcome-metrics-for-agent-adoption.md`
- `wiki/syntheses/synthesis-agentic-engineering-operating-model.md`

Also review the already-created Scout outputs and state because `scout-processed.json` already lists all URLs in `raw/reading-list.md` as processed.

## Rollback guidance

No Scout capture files were written by this run. To roll back this run only, remove this error briefing:

```bash
rm briefings/errors/agentic-kb-scout-run-2026-07-10-2306.md
```

Do **not** roll back or delete the dirty wiki/raw/briefing files above unless Jay confirms they are unwanted; they appear to be pre-existing work from prior runs.

## Safest next action for Jay

Resolve the non-Scout dirty wiki changes by reviewing and committing/stashing them. Then rerun Scout. If those wiki changes are expected outputs from Refinery/Editor, land them as a batch before allowing more unattended Scout captures.
