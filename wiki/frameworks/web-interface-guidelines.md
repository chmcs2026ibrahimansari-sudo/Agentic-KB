---
id: 01M06B0QQQ9T0WNJ9S6D4TRK6H
title: "Web Interface Guidelines"
type: framework
tags: [frameworks, accessibility, ui-review, web-design]
created: 2026-08-16
updated: 2026-08-16
visibility: public
source: my-skills/web-design-guidelines-skill.md
---

# Web Interface Guidelines

## What It Does
Web Interface Guidelines is a set of externally hosted rules covering UI/UX best practices — accessibility, layout, interaction, and design compliance — maintained by [Vercel](../entities/vercel.md) in the `vercel-labs/web-interface-guidelines` GitHub repository. Rather than being vendored or cached, the guidelines are designed to be fetched fresh from source immediately before every review, ensuring reviewers always apply the current rule set rather than a potentially stale local copy.

## Key Concepts
- **Single source of truth**: The canonical rules live in a raw markdown file — `command.md` — hosted at `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`.
- **Fetch-before-review**: Guidelines are retrieved via [WebFetch](../concepts/webfetch.md) at the start of each review, not cached between sessions.
- **Self-describing output format**: The fetched content includes not just rules but also the expected output format instructions (see [file:line output format](../patterns/pattern-file-line-output-format.md)), so the rule source and reporting convention evolve together.

## When to Use It
Apply these guidelines whenever reviewing UI code for accessibility, UX quality, or general design best-practice compliance — typically invoked through the [web-design-guidelines skill](../recipes/web-design-guidelines-skill.md).

## Limitations
- Requires live network access to GitHub at review time; no offline fallback is defined.
- Because rules are fetched dynamically, review output can change over time even for identical input files if the upstream guidelines are updated.
- No versioning/pinning is specified — reviews always target `main`, which may introduce non-reproducible results across reviews run on different dates.

## See Also
- [web-design-guidelines skill](../recipes/web-design-guidelines-skill.md)
- [pattern: file:line output format](../patterns/pattern-file-line-output-format.md)
