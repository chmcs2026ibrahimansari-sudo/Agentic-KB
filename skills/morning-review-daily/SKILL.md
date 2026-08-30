---
name: morning-review-daily
description: Run the Morning Review daily pipeline, append Agentic-KB intelligence to today's daily note, then APPLY the findings — generate promoted pages, persist proposals, draft a synthesis — committing each unit separately.
---

# morning-review-daily

Run Morning Review, append KB intelligence to today's daily note, then **change
the KB** — not just report on it.

**Commit as you go.** Each numbered step that writes anything ends with its own
commit. Do not batch the day's work into one commit at the end: a failure in
step 6 should not strand the pages step 4 already produced, and a per-unit
history is what makes a bad change revertable.

**Never pad the commit count.** A commit needs a real change behind it. If a step
produced nothing, say so and move on — an honest three-commit day beats a
fabricated eight.

---

## Step 0 — Preflight

```
/Users/jaywest/Agentic-KB/scripts/morning-review-preflight.sh
```

Branch on the exit code:

- **0 (clear)** — proceed.
- **1 (degraded)** — API unfunded or unreachable. Run steps 1–3, skip the compile
  in step 4, say so prominently at the top of the report. Still commit and push.
- **2 (blocked)** — needs a human. Report what it said and STOP.
- **3 (fatal)** — environment broken. Report and STOP.

Preflight also checks for a **concurrent pipeline** (exit 2 if one is live — do
not launch a second) and tails **`logs/web-server-error.log`**. If it prints web
server errors, read them before diagnosing any later API failure. Three separate
investigations called a `Controller is already closed` bug a dead server because
nobody opened that file.

Never work around a non-zero preflight by disabling a guard — no
`git commit --no-verify`, no editing the deny-list to make a match disappear.

---

## Step 1 — Morning Review pipeline

Preflight already confirmed nothing else is running. Launch in the background;
it takes 2–6 min and will exceed a single tool-call timeout.

```
bash -l -c "cd /Users/jaywest/morning-review && nohup bash -c 'source .env && .venv/bin/python -m src.main' > /tmp/mr-run-$(date +%Y%m%d).log 2>&1 & echo STARTED"
```

Poll the log every ~60s for "Morning Review complete". Verify status is
`completed`, the daily note exists at
`/Users/jaywest/Documents/Obsidian Vault/Daily Notes/<YYYY-MM-DD>.md`, and there
are no unhandled exceptions.

If "AppleScript timed out" appears, flag it prominently — that silently yields 0
notes. On failure: check `.env` for `ANTHROPIC_API_KEY`, check `.venv/bin/python`
exists, report the last 50 lines. **Do not proceed to step 3 if the daily note
was not written.**

---

## Step 2 — Stage captures

```
cd /Users/jaywest/Agentic-KB && node scripts/sofie-watch-obsidian.mjs --once
```

Then Apple Notes `KB Inbox` + Snipd per `.claude/commands/foundry-capture.md`.
**Check `raw/clippings/` for an existing copy before writing** — the write-time
hash varies per run, so an unchanged note can be captured repeatedly (one test
note currently has 11 copies). If anything genuinely new lands, run
`scripts/ingest-dedup.mjs`.

**Commit** if anything was staged: `chore(raw): stage N captures <date>`.

---

## Step 3 — Intelligence queries and daily note

Run the prefilters first — they supply facts the queries cannot derive from
their own retrieval:

```bash
cd /Users/jaywest/Agentic-KB
D=$(date +%Y%m%d)
node scripts/kb-intel-prefilter.mjs resolved  > /tmp/kb-resolved-$D.md
node scripts/kb-intel-prefilter.mjs syntheses > /tmp/kb-existing-$D.md
```

Then the five queries, launched from **a single shell script file** (inline
quoting has silently mangled these before, leaving files unwritten):

```bash
node cli/kb.js query "<connections>" > /tmp/kb-connections-$D.md
node cli/kb.js query "<patterns>"    > /tmp/kb-patterns-$D.md
node cli/kb.js query "<tensions>"    > /tmp/kb-tensions-$D.md
node cli/kb.js query "<leverage>"    > /tmp/kb-leverage-$D.md
node scripts/foundry-propose.mjs --top 3 > /tmp/kb-proposals-$D.md
```

**connections** — "Identify the 3 strongest cross-domain connections that do NOT
yet have a synthesis page. The full list of existing syntheses and what they cite
is below — a connection whose two endpoints both appear in one of those rows is
already written, so propose something else. Prefer connections bridging two
different MoCs. Anchor on wiki/index.md, wiki/hot.md and wiki/mocs/. For each:
one declarative sentence, the two pages it bridges, why it matters." *(append the
contents of `/tmp/kb-existing-$D.md`)*

**patterns** — "What recurring themes have appeared across 3+ recent summaries
but have no concept or pattern page? Start from wiki/candidates.md. Cluster
near-duplicate slugs as one theme."

**tensions** — "Reading wiki/log.md for the last 14 days, list contradictions
flagged but not resolved. log.md is append-only and still contains the original
entry for contradictions later closed — the list below names every one carrying
an explicit resolution marker, and those are CLOSED regardless of what log.md
says. For each genuinely open contradiction: the two opposing positions, the
sources, and what evidence would resolve it." *(append `/tmp/kb-resolved-$D.md`)*

**leverage** — "Using wiki/index.md and wiki/hot.md, what is the single
highest-leverage open question? One line, the pages it touches, a 2-sentence
reason."

If a query returns empty retrieval, retry once anchored on `wiki/index.md` and
`wiki/hot.md`. If it still fails, include the gap in the section.

**Escalate a repeating leverage question.** If the same question has appeared 3+
times in recent daily notes, it is a stalled task, not a question. Check
`wiki/_meta/proposals.md` first — if it is already filed (the LoCoMo question is
PROP-166), do **not** re-file it. Say it is unactioned and move on.

Append to today's daily note (check it does not already contain a
`## 🧠 KB Intelligence` heading for today):

```markdown

---

## 🧠 KB Intelligence

### Cross-domain connections from the last 7 days
<contents of /tmp/kb-connections-YYYYMMDD.md>

### Emerging patterns ready to graduate
<contents of /tmp/kb-patterns-YYYYMMDD.md>

### Unresolved contradictions
<contents of /tmp/kb-tensions-YYYYMMDD.md>

### Today's high-leverage question
<contents of /tmp/kb-leverage-YYYYMMDD.md>

### Active proposals
<contents of /tmp/kb-proposals-YYYYMMDD.md>

*Generated from Agentic-KB by morning-review-daily. Citations are wiki-link slugs — open in Obsidian to follow.*
```

**Commit the vault**: `morning-review-daily <date>`.

---

## Step 4 — Compile gate and promoted pages

```
node scripts/compile-2source-gate.mjs --execute
```

Run in the background to a log and poll. **Check the exit code** — it propagates
`cli/kb.js compile`'s status, so non-zero means nothing was promoted regardless
of what the plan printed. Skip entirely if preflight returned 1.

The gate's PROMOTE list is advisory. To actually create pages:

```
node scripts/promote-to-pages.mjs            # plan
node scripts/promote-to-pages.mjs --execute  # write, default cap 3/run
```

This is the drain on `candidates.md`. It writes schema-correct pages seeded with
**verbatim** evidence from the summaries that promoted them, links each from a
MoC, and updates `recently-added.md` and `log.md`. Pages are born
`reviewed: false`, `confidence: medium`, with an explicitly empty
Counter-arguments & Gaps section.

Three gates cut the list hard — dedup against existing pages, ≥1 prose bullet,
and ≥2 sources with prose. On 2026-08-30 that took 42 promoted themes to 2
page-worthy ones. **A low number is the tool working, not failing.** Do not raise
`--top` to manufacture commits.

**Commit**: `feat(wiki): promote N themes to pages <date>`.

---

## Step 5 — Synthesis and proposals

```
node scripts/foundry-propose.mjs --execute --top 3
```

Draft a synthesis for the **top verified-missing connection** (one per day max)
as `wiki/syntheses/synthesis-<slug>.md`, full schema, `reviewed: false`,
including the mandatory Counter-arguments & Gaps section. The step-3 prefilter
already listed existing syntheses — trust it, but if the model proposed a pair
anyway, check `ls wiki/syntheses/` before drafting.

For pages flagged with provenance gaps: add `[UNVERIFIED]` markers and downgrade
`confidence` to `medium`. **Check the page first** — if it carries a RESOLVED
marker (the prefilter lists these), re-flagging regresses closed work.

Update `wiki/index.md` and `wiki/recently-added.md` for anything created.

**Commit**: `docs(wiki): synthesis on <topic>` and/or
`chore(kb): persist proposals <date>`.

---

## Step 6 — Push and leave the tree clean

```
git push origin main                      # in Agentic-KB
git -C "/Users/jaywest/Documents/Obsidian Vault" push origin main
```

If a push is rejected, `git pull --rebase origin main` and push again — the
night-shift jobs also commit.

Re-run `git status --porcelain` in Agentic-KB. Anything still dirty blocks
tonight's Refinery, Scout and Editor, which abort on a dirty tree. Commit it or
report it explicitly.

If the pre-commit PII guard blocks, unstage the offending file and report it.
**Never `--no-verify`.** If the same file trips it every run, fix the generator
that writes it rather than working around it.

---

## Step 7 — Report

Lead with failures. A run where the compile gate failed is a failed run even if
everything else succeeded — say so in the first line.

- Preflight result and what it changed
- Morning Review: notes processed, findings, files written, any AppleScript timeout
- Captures staged and ingested (count by source)
- Intelligence: top connection, top pattern, top tension, leverage question
- **Compile exit code and whether pages were actually promoted**
- Pages generated by `promote-to-pages` (name them), and how many were gated out
- Proposals persisted, synthesis drafted, provenance edits
- **Every commit made, with its message** — and the push result
- Worktree state at exit
- Warnings needing attention

Then delete the `/tmp/kb-*-$D.md` files.

---

## Refuse list

- Do NOT skip Step 0 or ignore its exit code.
- Do NOT launch a pipeline when preflight reports one already running.
- Do NOT run Steps 3–5 on a day where morning-review failed and the daily note doesn't exist.
- Do NOT delete or rewrite existing wiki pages; apply actions are additive only.
- Do NOT flip `reviewed: true` on any page.
- Do NOT write to the personal Obsidian vault outside today's daily note.
- Do NOT bypass the pre-commit PII guard with `--no-verify`.
- Do NOT report the compile plan's promote count as applied work without a zero exit code.
- Do NOT re-flag a contradiction that carries a RESOLVED marker.
- Do NOT inflate `--top`, split a change across commits, or commit trivia to raise the commit count.
