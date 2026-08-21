# Lossy boundaries

Every place in this codebase where a **producer** hands work to a **consumer**
through a step that can drop, summarize or cap content. At each of those steps
the consumer trusts what it receives and generally does not re-read the source,
so anything lost in transit is lost for good.

Two properties are tracked per boundary:

- **Provenance survives** — does the artifact carry *where it came from* as
  structured fields (frontmatter keys, trace fields), **outside** the
  natural-language payload? Provenance embedded in prose is not checkable.
- **Loss is detectable** — can the consumer tell a complete artifact from a
  truncated one *without* going back to the source?

The second is the one that actually matters. A boundary can have perfect
provenance and still be dangerous if a lossy pass and a lossless pass produce
byte-identical shapes.

Written 2026-08-21 applying `syntheses/synthesis-telephone-game-per-claim-confidence`.
Diff against this file on the next run rather than re-deriving it.

---

## Summary

| # | Boundary | Provenance | Loss detectable | Verdict |
|---|----------|-----------|-----------------|---------|
| 1 | `loadAgentContext` | yes | yes | PASS (pre-existing) |
| 2 | `loadRepoContext` | yes | **yes (fixed 2026-08-21)** | was FAIL |
| 3 | `summarizeHotToLearned` | yes | **yes (fixed 2026-08-21)** | was FAIL |
| 4 | `fetchRepoMarkdown` / `syncRepo` | yes | **yes (fixed 2026-08-21)** | was FAIL |
| 5 | `promoteDiscovery` | partial | n/a | **FINDING — not fixed** |
| 6 | `mergeRewrite` | yes | yes | PASS |
| 7 | `compactHotMemory` | yes | yes | PASS |
| 8 | `publishBusItem` / `publishRepoBusItem` | yes | yes | PASS |
| 9 | `listBusItems` / `listRepoBusItems` / `searchRepoDocs` | yes | no | FINDING — low severity |

Three of nine leaked. Three were fixed this run, one is blocked, one is a
low-severity pagination note, and four were already correct.

---

## 1. `loadAgentContext` — PASS

`lib/agent-runtime/context-loader.mjs:loadAgentContext`

Producer: the wiki. Consumer: an agent reasoning over the bundle.
Drops files for four reasons — namespace isolation, `read_denylist`,
staleness (`freshness_days`), and `budget_bytes`.

Already correct, and it is the reference implementation for the others.
The trace carries `truncated`, `excluded[]` (each with `path` + `reason`),
`budget_used`, `budget_remaining` and `warnings[]`, and a `required: true`
include rule that resolves nothing escalates to a warning rather than
vanishing. A consumer checks one boolean.

## 2. `loadRepoContext` — was FAIL, fixed

`lib/repo-runtime/context-loader.mjs:loadRepoContext`

Producer: a repo's canonical docs, progress page, policy includes, caller-named
source docs and bus items. Consumer: `load_repo_context` (MCP) → an agent.

Five separate budget checks each dropped files with a bare `continue` and
recorded nothing. The returned `{ files, trace }` had the same shape whether
the bundle was whole or was missing most of the repo.

`budget_remaining` was not a proxy for this and reading it as one was actively
misleading: a file is dropped *because* it is larger than what remains, so a
truncated bundle normally ends with a healthy-looking non-zero remainder. A
probe dropped 5 of 7 files and still reported 964 bytes free.

Fixed by mirroring `loadAgentContext`'s field names rather than inventing new
ones: `trace.excluded[]` (`path`, `reason`, `bytes`), `trace.dropped_count`,
`trace.truncated`. Rejected `source_files` traversal segments are reported too —
the caller named those files by hand, and silence made "rejected as unsafe"
look like "not found". All fields are always present.

## 3. `summarizeHotToLearned` — was FAIL, fixed

`lib/agent-runtime/hot-learned.mjs:summarizeHotToLearned`

The most literal instance in the repo. Producer: `hot.md`. Consumer: a later
agent that loads `learned/hot-digest/*.md` through the context loader and never
re-reads the source. The default summarizer keeps only headings and bullets and
caps the result at 60 lines; a custom summarizer may be registered via
`registerHotLearnedSummarizer`, in which case the loss is unbounded.

Provenance was good — `source`, `generated_at`, `contract_hash`, `summarizer` —
but there was no measure of fidelity, so digests keeping 100%, 30% and 9% of
their source were shape-identical. A 33-line `hot.md` produced a 3-line digest
that said nothing about the 30 dropped claims.

Fixed with `source_lines`, `digest_lines`, `lines_dropped` and `truncated` in
the digest frontmatter, returned to the caller as well. Counts are taken
*outside* the summarizer so a custom/LLM summarizer is measured identically.

Line counts are a coarse proxy, deliberately. They make the loss visible; they
do not quantify it per claim. The per-claim version is what the source article
costs out as too expensive for routine use.

## 4. `fetchRepoMarkdown` / `syncRepo` — was FAIL, fixed

`lib/repo-runtime/sync.mjs`

Producer: GitHub. Consumer: `repo-docs/` on disk, the registry record, and
every later `loadRepoContext` that bundles those docs.

Two independent drop paths: the `git/trees` API caps large listings
(`treeData.truncated`), and any individual blob fetch can fail. Both were
reported only via `console.warn` — stderr on a stdio MCP server, which nothing
reads — and the function returns a plain array, so a short result looked exactly
like a complete one. A probe with a capped listing and three 502s returned
`trace.errors: []` and wrote `markdown_file_count: 7` to the registry.

This one had a second-order consequence, which is the whole argument in
miniature: the archive pass computed "removed upstream" as "absent from the
fetch result" — the very set the dropped blobs were missing from. A transient
502 therefore made `syncRepo` unlink the local copy of a doc that still existed
upstream. Invisible loss became real data loss one step downstream.

Fixed with an optional `opts.loss` collector on `fetchRepoMarkdown`
(`listing_truncated`, `candidates`, `fetched`, `fetch_failures[]`; the return
value is unchanged), surfaced as `trace.source` and `trace.partial`, plus
`partial_sync` on the registry record so `markdown_file_count` is not read as
authoritative. The archive pass is skipped entirely when the source is known to
be partial, with `trace.archive_skipped_reason` recording why.

## 5. `promoteDiscovery` — FINDING, not fixed

`lib/agent-runtime/promotion.mjs:promoteDiscovery` (and its `promoteLearning` alias)

Producer: a bus item. Consumer: a promoted wiki page that the context loader
later bundles as durable `learned`/`canonical` knowledge.

Provenance is otherwise excellent — `promoted_from`, `source_channel`,
`source_path`, `promoted_by`, `promoted_at`, `promotion_score`,
`promotion_decision`, `contradiction_status`, `explicit_approval`, `supersedes`.

**But three fields present on the source bus item are absent from the promoted
page: `confidence`, `related_sources` and `evidence_count`.** All three are read
during promotion (the scorer and the contradiction check consume them) and then
dropped on the floor. The result is that a `confidence: low` observation and a
`confidence: high` one promote into pages that are indistinguishable, and a
reader of the promoted page sees no confidence marker at all — so an uncertain
claim reads as unqualified fact. The evidence links that justified it are gone
from the page too.

The loss is *recoverable* (one hop back via `source_path`) but not *visible*,
which is the failure mode this document is about. It is also the single place in
this codebase where the article's specific prescription — carry per-claim
confidence across a summarization boundary — maps onto real existing fields
rather than requiring a new system to be built. Carrying three fields forward is
a small change.

**Not fixed this run**: `lib/agent-runtime/promotion.mjs` is one of the five
files on the unmerged `nightly/2026-08-20-improvements` branch. Editing it here
produces work that cannot be delivered cleanly. Tracked in `NIGHTLY-BACKLOG.md`;
unblocked as soon as that branch merges.

## 6. `mergeRewrite` — PASS

`lib/agent-runtime/promotion.mjs:mergeRewrite`

Not actually a summarization step — the rewrite body is copied whole
(`rwBody.trim()`), not reduced. Provenance is written into the new canonical
(`merged_from`, `merged_by`, `merged_at`, `source_task_id`, `supersedes`), the
audit chain records `before_hash`/`after_hash`, and the *previous* canonical is
snapshotted to `wiki/archive/merges/` with an exclusive create before being
overwritten.

The strongest example in the repo: the loss is not merely detectable, it is
fully reversible.

## 7. `compactHotMemory` — PASS

`lib/agent-runtime/retention.mjs:compactHotMemory`

Snapshots the full `hot.md` to `wiki/archive/hot-snapshots/` *before* touching
it, then writes `needs_compaction: true` and `last_snapshot: <path>` into the
live file's frontmatter. The consumer sees an explicit flag and a path back to
the complete original. Correct by construction.

## 8. `publishBusItem` / `publishRepoBusItem` — PASS

`lib/agent-runtime/bus.mjs`, `lib/repo-runtime/bus.mjs`

`title` is derived by truncating the first line of the body to 80 characters,
which is lossy — but the full body is preserved in the same file, so nothing is
actually lost, and `confidence`, `related_sources`, `contradiction_status`,
`evidence_count`, `from`, `from_tier` and `status_history` are all structured
frontmatter keys outside the prose payload.

This is the producer end that boundary 5 fails to carry forward. The fields
exist and are populated; only promotion drops them.

## 9. `listBusItems` / `listRepoBusItems` / `searchRepoDocs` — FINDING, low severity

`lib/agent-runtime/bus.mjs:listBusItems` (`limit = 100`),
`lib/repo-runtime/queries.mjs:searchRepoDocs` (`limit = 20`)

All three sort and then `.slice(0, limit)` without reporting a total, so a
caller cannot tell "20 results" from "20 of 400". Standard pagination shape and
low severity — the source is a directory the caller can re-scan, and no artifact
is written from the truncated set.

Not fixed: all three return bare arrays, so reporting a total means changing
the return type, which is a breaking interface change for a low-severity issue.
`searchRepoDocs` additionally lives in `lib/repo-runtime/queries.mjs`, which is
on the unmerged `nightly/2026-08-20-improvements` branch.

---

## Out of scope

- `compile_wiki` (`mcp/server.js`) proxies to `POST /api/compile` and collects
  the SSE stream into a text blob for display. The summarization happens
  web-side, and `web/` has no test suite (see `NIGHTLY-BACKLOG.md`), so nothing
  here is regression-testable today.
- `closeTask` / `_planWrites` (`lib/agent-runtime/writeback.mjs`) is a write
  path, not a summarization boundary, and is already fail-closed: any rejected
  write aborts the entire close, and `writes_rejected`, `guard_decisions`,
  `plan_error` and `rollback` are all on the trace.
