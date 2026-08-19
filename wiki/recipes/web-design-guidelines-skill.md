---
id: 01M06B0QQSYZZCHQAK9DF616TC
title: "web-design-guidelines Skill"
type: recipe
tags: [tools, automation, workflow, accessibility, ui-review]
created: 2026-08-16
updated: 2026-08-16
visibility: public
source: my-skills/web-design-guidelines-skill.md
related: [web-interface-guidelines]
---

# web-design-guidelines Skill

A skill (authored by [Vercel](../entities/vercel.md)) that reviews UI code for compliance with the [Web Interface Guidelines](../frameworks/web-interface-guidelines.md). It is triggered by natural-language requests such as "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".

## Steps
1. **Fetch fresh guidelines.** Before every review, use [WebFetch](../concepts/webfetch.md) to pull the latest rules from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`. The skill never relies on a cached or local copy.
2. **Identify target files.** Read the file or pattern the user specified. If no files were given, the skill asks the user which files to review rather than assuming a default scope.
3. **Apply all fetched rules.** Check the target files against every rule contained in the fetched guidelines document.
4. **Report findings.** Output results using the terse [file:line output format](../patterns/pattern-file-line-output-format.md) — the exact format is itself specified inside the fetched guidelines content, so the skill defers to whatever convention is defined upstream.

## Why Fetch-Fresh Matters
Because the guidelines source can change independently of the skill definition, fetching at review time (rather than embedding a static copy) keeps audits aligned with the latest accessibility and UX standards without requiring the skill itself to be updated.

> "Fetch the latest guidelines from the source URL below... Use WebFetch to retrieve the latest rules. The fetched content contains all the rules and output format instructions." — web-design-guidelines skill definition

## Trade-offs
- **Pro**: Always current with upstream best practices; no drift between skill and guideline source.
- **Con**: Network-dependent, non-deterministic across time, no offline mode.

## See Also
- [Web Interface Guidelines](../frameworks/web-interface-guidelines.md)
- [pattern: file:line output format](../patterns/pattern-file-line-output-format.md)
