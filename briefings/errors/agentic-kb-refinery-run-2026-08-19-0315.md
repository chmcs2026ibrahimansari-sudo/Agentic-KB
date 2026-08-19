# Agentic-KB Refinery Run — Blocked

- **Job name:** agentic-kb-refinery-run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-19 03:15:49 PDT (-0700)
- **Failed stage:** pre-run dirty-worktree safety check, before any Refinery processing or wiki writes

## Blocked reason

The Refinery run was stopped because `git status --porcelain` showed dirty files outside the user-approved Refinery write paths and outside the two exact noisy log exceptions (`logs/web-server-error.log`, `logs/web-server.log`).

The blocking files are untracked `raw/framework-docs/` captures. Scheduled Refinery is not allowed to proceed while raw/source paths are dirty under the current job instruction, because raw originals are immutable and should not be mixed with unattended wiki writes without an explicit clean baseline or accepted Scout handoff.

## Dirty worktree observed

Allowed / non-blocking dirty paths under the Refinery instruction:

```text
M .night-shift/state/scout-processed.json
?? briefings/scout-2026-08-18.md
```

Blocking dirty paths:

```text
?? raw/framework-docs/anthropic-com-engineering-managed-agents.md
?? raw/framework-docs/deepseek-ai-deepseek-harness.md
?? raw/framework-docs/dev-to-himanshuai-playwright-ai-agent-the-complete-engineering-guide-to-autonomous-browser-automatio.md
?? raw/framework-docs/disler-super-simple-software-factory.md
?? raw/framework-docs/docs-langchain-com-langsmith-python-managed-deep-agents-overview.md
?? raw/framework-docs/docs-langchain-com-oss-deepagents-code-overview.md
?? raw/framework-docs/handbook-vinodspattar-in-learn-modules-07-langgraph.md
?? raw/framework-docs/langchain-ai-open-swe.md
?? raw/framework-docs/linkedin-com-posts-danielnrocha-harness-meta-harness-self-improving-harness-share-749404682264734105.md
?? raw/framework-docs/linkedin-com-posts-reshmawithai-ai-isnt-failing-in-your-company-your-ai-share-7493986243802738688-w9.md
?? raw/framework-docs/linkedin-com-posts-ruben-hassid-stop-over-organizing-claude-it-slows-you-share-7493980931716939776-k.md
?? raw/framework-docs/lumay-ai.md
?? raw/framework-docs/opensandbox-group-OpenSandbox.md
?? raw/framework-docs/opensourceprojects-dev-post-simba.md
?? raw/framework-docs/x-twitter-2087607558626582741.md
?? raw/framework-docs/x-twitter-2088359756096532965.md
?? raw/framework-docs/x-twitter-2088713006095994930.md
?? raw/framework-docs/x-twitter-2088782821535981815.md
?? raw/framework-docs/x-twitter-2089029054611837324.md
```

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`

## Files written or attempted

Written:

- `briefings/errors/agentic-kb-refinery-run-2026-08-19-0315.md`

Attempted:

- No wiki, raw, state, index, or log writes were attempted.

## Files needing review

- `raw/framework-docs/*.md` files listed above: likely Scout outputs that need either a clean git baseline or an explicit Scout→Refinery handoff policy.
- `.night-shift/state/scout-processed.json`: modified from Scout; allowed by Refinery path policy but should be reviewed with the Scout outputs.
- `briefings/scout-2026-08-18.md`: untracked Scout briefing; allowed by Refinery path policy but should be included in the same baseline decision.

## Rollback guidance

No Refinery wiki/state changes were made. To undo this blocked-run artifact only, remove:

```text
briefings/errors/agentic-kb-refinery-run-2026-08-19-0315.md
```

Do not delete or alter the raw/framework-docs files unless Jay explicitly chooses to roll back the Scout capture batch.

## Safest next action

Create a clean handoff point for the Scout outputs before rerunning Refinery: either commit/stage the Scout-created `raw/framework-docs/` files plus Scout state/briefing, or explicitly approve Refinery to treat those specific untracked raw files as expected Scout handoff inputs for this run. Then rerun the Refinery job.
