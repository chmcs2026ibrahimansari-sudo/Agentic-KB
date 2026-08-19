# Agentic-KB Scout Run — Blocked

- **Job name:** Agentic-KB Scout Run
- **Job ID:** Not available from cron context
- **Timestamp:** 2026-08-17 23:05 PDT (-0700)
- **Phase/stage failed:** Pre-run dirty-worktree safety check, before fetching URLs or writing raw captures

## Blocked Reason

Scout did not proceed because `git status --porcelain` found dirty files outside the Scout allowed write paths/exceptions.

Allowed Scout paths/exceptions per `playbooks/scout-run.md`:
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

Dirty files outside those allowed paths:

```text
 M raw/.compiled-log.json
 M raw/.ingest-hashes.json
 M wiki/_meta/compile-log.md
 M wiki/concepts/context-management.md
 M wiki/concepts/foundry-capture-pipeline.md
 M wiki/entities/andrej-karpathy.md
 M wiki/index.md
 M wiki/log.md
 M wiki/patterns/pattern-librarian-agent.md
 M wiki/patterns/pattern-llm-wiki.md
 M wiki/syntheses/synthesis-headroom-compression-proof-of-work-receipts.md
?? raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__57c523ba.md
?? wiki/concepts/agentic-sdlc.md
?? wiki/concepts/claude-md-pattern.md
?? wiki/concepts/html-as-agent-output-format.md
?? wiki/concepts/progressive-disclosure.md
?? wiki/concepts/skill-optimization.md
?? wiki/daily-systems/logs/2026-08-17.md
?? wiki/entities/gsd-ui-checker.md
?? wiki/frameworks/agent-orchestrator.md
?? wiki/frameworks/hermes-desktop.md
?? wiki/frameworks/langsmith.md
?? wiki/frameworks/openconnector.md
?? wiki/frameworks/skillopt.md
?? wiki/frameworks/web-interface-guidelines.md
?? wiki/patterns/pattern-agent-skill-authoring.md
?? wiki/patterns/pattern-credential-gateway.md
?? wiki/patterns/pattern-forward-deployed-engineering.md
?? wiki/patterns/pattern-raw-inbox-workflow.md
?? wiki/recipes/web-design-guidelines-skill.md
?? wiki/summaries/summary-farzapedia-personal-wiki.md
?? wiki/summaries/summary-garrytan-meta-meta-prompting.md
?? wiki/summaries/summary-karpathy-llm-wiki.md
?? wiki/summaries/summary-langchain-rag-from-scratch.md
```

Dirty files observed but allowed/expected for Scout safety evaluation:

```text
 M .night-shift/state/editor-state.json
 M raw/reading-list.md
?? briefings/2026-08-16.md
```

## Files Read

- `/Users/jaywest/Agentic-KB/AGENTS.md`
- `/Users/jaywest/Agentic-KB/house-rules.md`
- `/Users/jaywest/Agentic-KB/playbooks/night-shift-map.md`
- `/Users/jaywest/Agentic-KB/playbooks/scout-run.md`
- Git worktree state via `git status --porcelain`

## Files Written or Attempted

- Wrote this error briefing: `briefings/errors/agentic-kb-scout-run-2026-08-17-2305.md`

No raw captures were fetched or written. No URL state was updated.

## Files That May Need Review

Review the dirty files listed above, especially:
- `raw/.compiled-log.json`
- `raw/.ingest-hashes.json`
- `raw/clippings/2026-05-16T15-40-32__apple-notes__test-capture-2026-05-16__57c523ba.md`
- all dirty/untracked `wiki/` pages

These appear to be output from other KB workflows and need to be committed, stashed, or explicitly cleared before Scout can safely add new raw captures.

## Rollback Guidance

No Scout raw capture work occurred, so there is no Scout-specific rollback needed.

If this error briefing itself should not be retained, remove only:

```text
briefings/errors/agentic-kb-scout-run-2026-08-17-2305.md
```

Do not bulk-reset the worktree without first reviewing the pre-existing dirty `wiki/`, `raw/`, and state files.

## Safest Next Action

Review and either commit or stash the existing KB changes outside Scout's allowed paths, then rerun the Agentic-KB Scout Run. If those files are expected ongoing outputs from another automation, update the relevant playbook deliberately rather than broadening Scout's dirty-worktree allowlist ad hoc.
