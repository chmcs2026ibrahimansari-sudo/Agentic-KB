# Agentic-KB Refinery Run — Blocked

- **Job name:** Agentic-KB Refinery Run
- **Job ID:** unavailable in cron context
- **Timestamp:** 2026-08-16 03:15:58 PDT
- **Failed stage:** Pre-run dirty-worktree safety check

## Blocked Reason
The run stopped before processing sources because `git status --porcelain` reported dirty files outside the Refinery job's expected write paths and outside the two exact noisy log files allowed by the user-level instruction.

User-level allowed dirty paths for this run:
- `.night-shift/state/`
- `briefings/`
- `wiki/summaries/`
- `wiki/concepts/`
- `wiki/patterns/`
- `wiki/frameworks/`
- `wiki/recipes/`
- `wiki/evaluations/`
- `wiki/personal/`
- `wiki/index.md`
- `wiki/log.md`
- `logs/web-server-error.log`
- `logs/web-server.log`

Dirty files observed:
```text
 M .night-shift/state/editor-state.json
 M .night-shift/state/scout-processed.json
?? briefings/2026-08-15.md
?? briefings/scout-2026-08-15.md
?? raw/framework-docs/huggingface-agent-intrusion-technical-timeline.md
?? raw/framework-docs/linkedin-com-posts-maryammiradi-forward-deployed-engineering-101-for-share-7491586783273603072-ov8f.md
?? raw/framework-docs/linkedin-com-pulse-agentic-sdlc-how-ai-agents-reshaping-software-pavan-belagatti-rsthc.md
?? raw/framework-docs/untrivial-ai-agent-orchestrator.md
?? raw/framework-docs/x-twitter-2084542353344282850.md
?? raw/framework-docs/x-twitter-2085780032031760694.md
```

Blocking files:
```text
?? raw/framework-docs/huggingface-agent-intrusion-technical-timeline.md
?? raw/framework-docs/linkedin-com-posts-maryammiradi-forward-deployed-engineering-101-for-share-7491586783273603072-ov8f.md
?? raw/framework-docs/linkedin-com-pulse-agentic-sdlc-how-ai-agents-reshaping-software-pavan-belagatti-rsthc.md
?? raw/framework-docs/untrivial-ai-agent-orchestrator.md
?? raw/framework-docs/x-twitter-2084542353344282850.md
?? raw/framework-docs/x-twitter-2085780032031760694.md
```

## Files Read
- `AGENTS.md`
- `house-rules.md`
- `playbooks/night-shift-map.md`
- `playbooks/refinery-run.md`
- Hermes skill reference: `hermes-obsidian-knowledge-loop/references/agentic-kb-refinery-run-notes.md`

## Files Written or Attempted
- Written: `briefings/errors/agentic-kb-refinery-run-2026-08-16-0315.md`
- No wiki pages, state files, or raw files were modified by this run.

## Files That May Need Review
The untracked `raw/framework-docs/` files appear to be Scout output or newly captured raw sources. They may be legitimate, but the Refinery prompt did not allow dirty raw files during its pre-run gate:
- `raw/framework-docs/huggingface-agent-intrusion-technical-timeline.md`
- `raw/framework-docs/linkedin-com-posts-maryammiradi-forward-deployed-engineering-101-for-share-7491586783273603072-ov8f.md`
- `raw/framework-docs/linkedin-com-pulse-agentic-sdlc-how-ai-agents-reshaping-software-pavan-belagatti-rsthc.md`
- `raw/framework-docs/untrivial-ai-agent-orchestrator.md`
- `raw/framework-docs/x-twitter-2084542353344282850.md`
- `raw/framework-docs/x-twitter-2085780032031760694.md`

Pre-existing allowed dirty files also present:
- `.night-shift/state/editor-state.json`
- `.night-shift/state/scout-processed.json`
- `briefings/2026-08-15.md`
- `briefings/scout-2026-08-15.md`

## Rollback Guidance
Only this error briefing was created by the blocked Refinery run. If needed, remove:
- `briefings/errors/agentic-kb-refinery-run-2026-08-16-0315.md`

Do not modify or clean the untracked raw files without deciding whether they should be committed as Scout outputs, inspected, or discarded.

## Safest Next Action
Review the untracked `raw/framework-docs/` files. If they are legitimate Scout captures, commit them or otherwise bring the worktree to an allowed baseline, then rerun the Refinery job. If they are accidental, remove or relocate them intentionally before rerunning.
