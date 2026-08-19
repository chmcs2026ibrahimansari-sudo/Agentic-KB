# Agentic-KB Editor Run — Blocked

- **Job name:** agentic-kb-editor-run
- **Job ID:** unavailable from cron context
- **Timestamp:** 2026-08-19 06:25 PDT -0700
- **Failed stage:** pre-run dirty-worktree safety gate
- **Status:** blocked before Editor writes

## Blocked reason

`git status --porcelain` showed dirty files outside the Editor Run allowlist.

Allowed for this user-invoked run:
- `.night-shift/state/`
- `briefings/`
- `wiki/syntheses/`
- exactly `logs/web-server-error.log`
- exactly `logs/web-server.log`

Blocking dirty paths observed:

```text
M raw/.compiled-log.json
M wiki/_meta/compile-log.md
M wiki/_meta/proposals.md
M wiki/candidates.md
M wiki/concepts/reciprocal-rank-fusion.md
M wiki/index.md
M wiki/log.md
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
?? web/logs/
?? wiki/concepts/agent-harness-model-context.md
?? wiki/concepts/context-window-bloat.md
?? wiki/concepts/deep-agents-harness.md
?? wiki/concepts/state-graph-checkpointing.md
?? wiki/frameworks/claude-managed-agents.md
?? wiki/frameworks/deepseek-harness.md
?? wiki/frameworks/framework-deepagents-code.md
?? wiki/frameworks/framework-deepagents.md
?? wiki/frameworks/framework-managed-deep-agents.md
?? wiki/frameworks/framework-open-swe.md
?? wiki/frameworks/langgraph.md
?? wiki/frameworks/lumay-ai.md
?? wiki/frameworks/opensandbox.md
?? wiki/frameworks/playwright.md
?? wiki/frameworks/simba.md
?? wiki/patterns/pattern-backend-sandbox-separation.md
?? wiki/patterns/pattern-browser-automation-agent.md
?? wiki/patterns/pattern-decoupled-agent-architecture.md
?? wiki/patterns/pattern-minimal-context-setup.md
?? wiki/patterns/pattern-software-factory.md
?? wiki/summaries/summary-anthropic-managed-agents.md
?? wiki/summaries/summary-harrison-chase-harness-model-context.md
```

Non-blocking paths under the Editor allowlist were also present and were left untouched:

```text
M .night-shift/state/scout-processed.json
?? briefings/errors/agentic-kb-refinery-run-2026-08-19-0315.md
?? briefings/scout-2026-08-18.md
?? wiki/syntheses/synthesis-headroom-compression-reciprocal-rank-fusion.md
```

## Files read

- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/editor-run.md`
- `.night-shift/state/editor-state.json`

## Files written or attempted

- Written: `briefings/errors/agentic-kb-editor-run-2026-08-19-0625.md`
- Attempted: no wiki synthesis, state, index, log, or normal briefing writes attempted

## Files that may need review

Review the blocking dirty paths above before re-running Editor. The highest-risk paths are:
- `raw/.compiled-log.json`
- untracked `raw/framework-docs/*`
- `wiki/index.md`
- `wiki/log.md`
- untracked `wiki/concepts/*`, `wiki/frameworks/*`, `wiki/patterns/*`, and `wiki/summaries/*`
- `web/logs/`

## Rollback guidance

No Editor changes were made outside this error briefing. To roll back this run only, remove:

```bash
rm briefings/errors/agentic-kb-editor-run-2026-08-19-0625.md
```

Do not clean or reset the other dirty files without first deciding whether they are expected outputs from Scout/Refinery or manual work.

## Safest next action for Jay

Inspect and either commit/stash/approve the Scout/Refinery-generated raw and wiki changes, then re-run the Agentic-KB Editor Run. If these dirty files are expected pipeline outputs, consider narrowing the Editor dirty-worktree policy to allow the specific upstream run outputs only after they are verified.
