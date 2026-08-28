# notes-to-factory ledger

## 2026-08-22 — shakeout run (push held by operator)

- HELD    MissionControl 32b6f94 `ntf/2026-08-22-notes-backlog` — seeds docs/NIGHTLY-BACKLOG.md from notes p7000/p6971/p7018/p6972 — not pushed
- INGEST  Agentic-KB a95f0d0 — 6 apple-notes clippings (local commit, not pushed)
- REJECT  p7018, p6971, p7000 — Large multi-phase subsystem directives → backlog, not implemented
- REJECT  p6972 — tiered UX toggle already implemented in `factoryExperience/` → checked-not-applicable
- REJECT  p6926 — business idea, no repo mapping → KB only
- REJECT  ~22 notes — image-only or link-dump, no actionable text
- REFUSE  p1808, p7005 — credential content; not ingested, not logged

## 2026-08-22 — run 2 (off-cycle, 12:30 PDT; ~2h window since run 1)

- HARVEST 0 new notes in window. 1 note touched (p1808) — refused at credential screen, not fetched.
- CHECK   OpenRouter key from p7005 grepped across all 8 repos' tracked trees — not committed anywhere. No rotation forced.
- MERGE   twinz ddceb11 (fast-forward → master) — seed docs/NIGHTLY-BACKLOG.md — revert: `git -C /Users/jaywest/Twinz push origin ddceb11^:master`
- MERGE   morning-review 173e1f6 (--no-ff → main) — seed docs/NIGHTLY-BACKLOG.md — preflight exit 0 — revert: `git -C /Users/jaywest/morning-review revert -m 1 173e1f6 && git ... push`
- MERGE   ai-software-factory-mastery 92aa508 (--no-ff → main) — seed docs/NIGHTLY-BACKLOG.md (created docs/) — revert: `git -C /Users/jaywest/ai-software-factory-mastery revert -m 1 92aa508 && git ... push`
- ABORT   Agentic-Pi-Harness — backlog file already on origin/main with 20 entries; seed would have destroyed them. Subagent refused. Nothing written.
- ABORT   hermes-harness-missioncontrol — backlog file already on origin/main with 19 entries; same. Subagent refused. Nothing written.
- DEFECT  This job's gap detection checked the LOCAL tree, not origin. 2 of 6 premises false. Gate as specified cannot detect a destructive whole-file overwrite. Both corrections recorded in last-run.json → skillCorrectionsNeeded.
- BACKLOG SellerFi + MissionControl still lack the file on origin; both PR-only, no stub PR opened.
- BACKLOG Pre-existing backlog files in Agentic-KB / Agentic-Pi-Harness / hermes-* lack a `## Format` section documenting the `Source: apple-note <id>` provenance convention. Small additive edit. Proposed, not implemented.
- HOLD    Run 1's held items still unpushed: MissionControl ntf/2026-08-22-notes-backlog @32b6f94, Agentic-KB a95f0d0. Not pushed by this run — another run's deliberate hold.
- HYGIENE All 5 worktrees created and removed; every repo returned to baseline (4,1,1,1,1). /tmp/ntf empty. MissionControl 92→93 from an EXTERNAL process at 12:52, not this job.

### 2026-08-22 run 2 — addendum (operator delegated judgement; held items released)

- PUSH    Agentic-KB f96433b — the held a95f0d0 cherry-picked onto current origin/main (local was 1 ahead / 18 behind, tree dirty from other jobs, so an isolated worktree was used). Credential scan clean; scripts/hooks/pre-commit PII guard exit 0. Local main still carries the redundant a95f0d0; a later pull --rebase drops it.
- PR      MissionControl #129 https://github.com/jaydubya818/MissionControl/pull/129 — held branch was NOT a fast-forward (origin/main moved to d902fae); cherry-picked as ntf/2026-08-22-notes-backlog-v2. PR not merge, per the repo's own invariant (p6971). Full docs gate run: all 3 cited paths and all 5 cited symbols verified present.
- PR      SellerFi #203 https://github.com/jaydubya818/SellerFi/pull/203 c4bb642 — confirmed ABSENT on origin first. PR-only due to ruleset on main; the constraint is now recorded inside the file so future runs don't retry a direct push.
- DONE    Backlog-registry gap closed fleet-wide: 6 repos have the file on origin, 2 pending PR.
- SKIP    `## Format` section for the 3 pre-existing backlog files — deliberately NOT done. Convention already lives in this job's skill file, so the section is human documentation, not a functional dependency; editing 3 files with real content for cosmetic consistency is poor risk/benefit on the day a whole-file overwrite nearly destroyed 39 entries. Remains a proposal.
- PATCH   Skill corrections written to outputs/notes-to-factory-SKILL-patch-2026-08-22.md (origin-vs-local existence check; docs gate must reject net deletion of tracked files; notesSeen[] is required not optional). Skill file NOT edited — operator's scheduled-task definition.
- HYGIENE All worktrees returned to baseline; /tmp/ntf empty; only the 2 PR branches kept. MissionControl 92→90: external process added 1 at 12:52, and cleanup `worktree prune` cleared 3 stale registrations for already-missing directories — no files deleted, no in-flight work touched. Still ~90 worktrees and detached HEAD; deliberate cleanup still recommended.

## 2026-08-23 (scheduled 08:20 PDT)

- 2026-08-23 — HARVEST — 20 note ids evaluated (5 in window + 15 previously unseen); 14 rejected under 120 bytes; 0 new credential-shaped notes.
- 2026-08-23 — INGEST — 4 clippings written with --source-id: p7068, p6759, p6826, p6819.
- 2026-08-23 — REFUSE — p6818: Agentic-KB PII pre-commit guard matched a deny-list phrase in the note body. File removed; NOT committed with --no-verify.
- 2026-08-23 — REFUSE — p6827 "Phil": third-party personal HR data (named individuals, coaching-plan status). Not ingested by judgment; no automated screen caught it.
- 2026-08-23 — MERGE — Agentic-KB 2dff0ad on main. Cherry-picked onto origin/main in worktree /tmp/ntf/kb-clippings; local main was 19 behind with 2 other jobs' commits. Gate: PII guard exit 0, parse verified, +723/-0. Revert: git -C /Users/jaywest/Agentic-KB revert 2dff0ad && git -C /Users/jaywest/Agentic-KB push
- 2026-08-23 — PROPOSAL — p7068 "Book Factory / IP → Software Factory" → MissionControl → BACKLOG (Large). New rights gate + media capability class + cross-mission learning surface. Not implementable nightly.
- 2026-08-23 — PUSH — MissionControl 5ad7a27 appended to open PR #129 branch ntf/2026-08-22-notes-backlog-v2 (+2 lines, additive). PR comment left flagging the branch move.
- 2026-08-23 — PROPOSAL — p6759 "Agentic Software Factory business" → NOT_APPLICABLE (KB item, maps to no single repo). Ingested as clipping only.
- 2026-08-23 — DECISION — 0 work orders. No item reached Small/Medium. Sizing bar not lowered.
- 2026-08-23 — ACTION REQUIRED — Agentic-KB dirty-worktree gate has blocked refinery (x2), scout and editor since 2026-08-22; error briefings are themselves untracked, making the condition self-sustaining. Not acted on (other jobs' in-flight files).
- 2026-08-23 — HYGIENE — 2 worktrees created, 2 removed. All 8 repos returned to baseline (Agentic-KB 3, MissionControl 89, Agentic-Pi-Harness 4, others 1 or 3). /tmp/ntf removed.

### 2026-08-23 remediation (operator-instructed, same day)

- 2026-08-23 — UNBLOCK — Agentic-KB dirty-worktree gate cleared. Root cause: the 2026-08-22 Editor Run produced its synthesis/log/briefing/state output and never committed it; briefings/errors/ is a tracked dir (115 files), so each blocked run's own briefing kept the tree dirty and guaranteed the next block. Nothing discarded. Commits 0639a14 (Editor Run output) and f09ed30 (error briefings + notes-to-factory state). Also rebased+pushed 7183dab (kb-daily-lint 2026-08-23, previously unpushed). Tree now 0 dirty, 0 ahead, 0 behind.
- 2026-08-23 — GUARD — the PII pre-commit guard rejected this ledger because the entry QUOTED the deny-listed phrase while describing a rejection. Reworded to reference note ids only. --no-verify not used. Recorded in skillCorrectionsNeeded.
- 2026-08-23 — MERGE — MissionControl PR #129 merged b3dfcee (merge commit, 12/12 checks). Human-authorized by Jay; repo governance "humans merge PRs" was satisfied, not bypassed. Revert: git -C /Users/jaywest/MissionControl revert -m 1 b3dfcee
- 2026-08-23 — MERGE — SellerFi PR #203 merged 852ccb2 (SQUASH — main ruleset rejects merge commits despite repo settings allowing them). Revert: git -C /Users/jaywest/SellerFi revert 852ccb2
- 2026-08-23 — STATE — docs/NIGHTLY-BACKLOG.md now present on origin/main in all 8 repos. Backlog dedup functional everywhere.
- 2026-08-23 — HYGIENE — MissionControl worktrees 89 -> 55. Removed 34 classified SAFE (clean tree AND 0 commits ahead of origin/main), deepest-first; 0 failures. Protected 4 SAFE parents containing in-flight children. Left 15 DIRTY + 35 UNMERGED untouched. No branches deleted — removals reversible via git worktree add.
- 2026-08-23 — HYGIENE — 191 gitignored .env/.env.local files (9 distinct variants) in removed worktrees backed up to /Users/jaywest/mission-control-worktree-env-backup-2026-08-23.tar.gz before removal.
- 2026-08-23 — DISK — 46 GiB -> 63 GiB free (95% -> 93%). Cleared Yarn/go-build/pip/pypoetry caches (~12 GiB). Earlier 25 GiB worktree estimate was wrong: du -s double-counts nested worktrees; actual worktree reclaim ~5 GiB.
- 2026-08-23 — OPEN — real disk consumer is ~/Library/Caches at 45.6 GiB (vs MissionControl's 19 GiB total). Left DeepSeekHarness 6.07, ms-playwright 5.13, com.openai.codex 2.69, Google 2.47, pnpm 1.98, ShipIt 1.72 GiB untouched — each has runtime implications. Also 8.09 GiB node_modules across 318 dirs in the 55 remaining (in-flight) worktrees. Needs Jay's call.
- 2026-08-23 — OPEN — dirty-worktree gate will re-trigger whenever any job is blocked or interrupted, since a halted job leaves its briefing untracked. Durable fix is in each scheduled-task prompt (allow briefings/errors/, or commit the briefing before exiting on the blocked path), not in the repo.

## 2026-08-24 (scheduled 08:20 PDT)

- Preflight: no HALT. Data volume 94%, 62 GiB free (improved from 46). Parallel subagents viable.
- Harvest: 14 notes evaluated (13 unseen + p7039 modified). 7 skipped empty body (<120B). 6 refused third-party/personal data. 1 ingested (p7069).
- Refused credential-titled notes again without fetching: p1808, p7005. p7005 still has a live OpenRouter key as its TITLE — leaks via list_notes metadata.
- Refused third-party personal data: p6335 (named individual's talking scripts, title-screened, body never fetched); p7106/p7108/p7114/p7082/p7039 (five iterative drafts of Adobe recruiter-screen prep, naming a third-party talent partner and containing employer-internal platform detail).
- Ingested p7069 -> raw/clippings/2026-08-23T18-33-20__apple-notes__what-if-the-future-of-enterprise-ai-is-not-one-super-agent__7e77e67e.md. Written to working tree, NOT committed; nothing pushed to any remote this run.
- KB sources: wiki/candidates.md all single-source, none graduated. wiki/action-tracker.md empty in all three sections.
- Triage: 0 items survived cheap filter 1. No ImprovementProposal written. Sizing bar not lowered, no work manufactured.
- Work orders: 0. Merges: 0. PRs: 0. Worktrees created: 0; all counts at baseline.
- NEAR MISS: first backlog-coverage probe reported all 8 repos MISSING. False — the probe ran from a script file with an unusable PATH, so `git` was not found and every check failed open. Verified by hand: all 8 repos HAVE the file on origin (282 lines total). The seed work order is a whole-file write and would have destroyed all of it. Fix: run coverage probes inline, never from a script file; verify one repo by hand before believing MISSING.
- RESOLVED since last run: Agentic-KB dirty-worktree deadlock cleared; Agentic-KB main in sync with origin (f9a6f65 no longer unpushed); MissionControl PR #129 and SellerFi PR #203 both merged 2026-08-23T19:09Z; MissionControl worktrees 89 -> 55 externally.
- Standing: third consecutive zero-work-order run, 72 notes cumulative. Constraint is upstream — Notes is used for thinking and drafting, not ticket filing. Recommend a capture convention or a reframing of success criteria around triage.

## 2026-08-25
- HARVEST: 8 new notes; 2 empty-body, 3 refused Screen 3 (third-party personal data: p7124/p7122/p7119), 3 read and not code-actionable (p7125/p7120/p7117). 0 ingested. 0 credential-shaped notes fetched.
- COVERAGE: docs/NIGHTLY-BACKLOG.md verified HAS on origin for all 8 repos (inline probe, explicit PATH). No seed work order.
- KB: candidates.md all at 1 source, nothing at graduation threshold. action-tracker Open empty. PROP-160/161 read and NOT routed — KB's own detector, gated on PROP-157, Large, already recorded in wiki/_meta/proposals.md.
- PROPOSAL: "a second clipping writer bypasses clipping-write.mjs dedup" (Agentic-KB) → BACKLOG. sofie-watch-obsidian.mjs does not route through clipping-write.mjs and carries no source-id; 11 duplicate test-capture-2026-05-16 clippings on disk. Not Small; second half is a raw/-immutability call for Jay. Source: KB wiki/log.md 2026-08-25.
- MERGE: Agentic-KB a147272 (docs-only, backlog persistence not a work order). Revert: git -C /Users/jaywest/Agentic-KB revert -m 1 a147272 && git push
- WORK ORDERS: 0. Fourth consecutive zero — correct for this input stream, not a shortfall.
- HYGIENE: 1 worktree created and removed; all 8 repos confirmed at baseline. No pre-existing worktree or branch touched. Other jobs' uncommitted Agentic-KB work left in place.
- ACTION REQUIRED: p7005 OpenRouter key still live in a note title (4th run unchanged); MissionControl 55 worktrees; raw/-immutability ruling needed on the 11 duplicates.

## 2026-08-25 (addendum — Jay-directed, same day)
- CONTEXT: Jay asked what was committed today and asked for more daily throughput. Fleet committed 20 times; this job 2 (docs only).
- FINDING: at least 4 scheduled jobs shared the git author "Jay West (notes-to-factory)". The 06:10, 07:06, 22:45-23:17 commits carried this job's name and were not its work. `git log --author` could not answer Jay's question.
- SKILL CHANGE 1: added Phase 2e — drain existing backlogs when the harvest yields <2 work orders. Target 1-3/run. Merge gate UNCHANGED. Agentic-KB Open items noted as all-Large; real Small stock is in Agentic-Pi-Harness and hermes-harness-missioncontrol.
- SKILL CHANGE 2: git identity is now `notes-to-factory <jaydubya818+notes-to-factory@gmail.com>`. Other jobs still need the same treatment.
- SKILL CHANGE 3: recorded that NODE_ENV=production is exported globally, so plain `npm ci` yields no node_modules/.bin and test steps fail with "vitest: command not found". Use `NODE_ENV=development npm ci --include=dev`. Other nightly jobs may be silently running dev-dep-free installs with non-functioning test gates.
- DRAIN #1: Agentic-Pi-Harness 9e4db95 — metrics.json now canonical-sorted. Full gate met with observed evidence: identical counters in opposite increment orders now produce byte-identical output (cmp exit 0, matching sha256), pre-change control differs at char 11. Suite 373 -> 374 pass. Backlog item moved Open -> Closed. Revert: git -C /Users/jaywest/Agentic-Pi-Harness revert -m 1 9e4db95 && git push
- UNFILED, for next run: Agentic-Pi-Harness writes metrics.json as a bare counters record while src/schemas/metricsSnapshot.ts defines {schemaVersion, sessionId, counters, capturedAt}. Real discrepancy, deliberately not folded into the drain, not yet in any backlog.

## 2026-08-26 (scheduled 08:20 PDT)

- 2026-08-26 — preflight — HALT absent; disk 45 GiB free (95% used, down 29 GiB in a day, still above the 30 GiB wave-split threshold); backlog coverage re-derived against origin, 8/8 HAS.
- 2026-08-26 — harvest — 6 notes in window, 0 ingested, 0 work orders. Fifth consecutive zero harvest and correct each time.
- 2026-08-26 — p7169 — SKIP — Screen 2, body is two LinkedIn short-links, ~55 bytes of plaintext.
- 2026-08-26 — p7168 — REFUSE — Screen 3, draft message addressed to a named recruiter. Not fetched.
- 2026-08-26 — p7124 — REFUSE — Screen 3, re-modified in window, disposition unchanged from prior run.
- 2026-08-26 — p7167 — NOT_ACTIONABLE — 23 KB interview debrief naming a third party throughout.
- 2026-08-26 — p7134 — NOT_ACTIONABLE — verbatim Adobe job description.
- 2026-08-26 — p7120 — NOT_ACTIONABLE — re-read in full after a 15:55Z re-modification; conceptual harness-vs-factory explainer written for a personal, non-repo purpose [personal context redacted per PII guard]. No request, no repo reference, no defect claim.
- 2026-08-26 — Phase 2e engaged (harvest under 2 work orders). Drained hermes-harness-missioncontrol; Twinz `## Open` is genuinely empty, Agentic-Pi-Harness deliberately skipped (three unmerged nightly branches whose own merge note tells later runs to stack rather than branch from main).
- 2026-08-26 — hermes-harness-missioncontrol — IMPLEMENT → MERGED `62369e1` — console "Execute current step" / "Mark step complete" gated on the current step via a new tested `isCurrentStepActionable` in api.ts, following the 2026-08-25 `isStepRetryable` precedent. Full gate: typecheck 0, no lint script exists, suite 271→275 13/13, build 0, failing-then-passing verified red, acceptance evidence observed, fresh clone clean. Source: backlog 2026-08-26.
- 2026-08-26 — hermes-harness-missioncontrol — IMPLEMENT → PR #19 — hydration normalization of legacy persisted runs (closes 2026-08-21 timestamps + 2026-08-23 artifact dedupe). Gate green, 271→272, both halves of acceptance evidence observed (200-stale → 201-new on an id-less artifact POST). Not merged: the fix made an existing test fail — the one pinning the closed 2026-08-21 date-filter item — because `run.updated_at` is now always populated and `inDateRange`'s no-value branch became unreachable. Retiring an assertion that pins an earlier closed finding is a human call. Merge-gate condition 6 doing its job.
- 2026-08-26 — hermes-harness-missioncontrol — BACKLOG (annotated, merged `dd0fd3f`) — `safeRelativePath` `.` normalization. Its only consumer is `assertAllowedRepoWrite`, a write-authorization gate → unconditionally on the auto-merge exclusion list. Separately, naive `..` stripping would loosen the gate (`a/../../etc` → `a/etc`). Both reasons written into the entry so no later run re-derives them or plans an auto-merge that cannot happen.
- 2026-08-26 — hermes-harness-missioncontrol — BACKLOG — approvals `actor` filter. Self-declared blocked on a design decision. Phase 2e rule 3.
- 2026-08-26 — Agentic-Pi-Harness — BACKLOG — `SessionMetricsSchema` has no producer or consumer. Self-declared blocked: wants a ruling on whether `metrics.json` is Tier A contract surface.
- 2026-08-26 — Agentic-Pi-Harness — NOT_APPLICABLE (this run) — persist `LoopResult.sanitizations`. Viable, but landing it means stacking on an unmerged nightly branch, i.e. gating against unreviewed code.
- 2026-08-26 — hygiene — 5 worktrees created, 5 removed, count returned to baseline 1; `/tmp/ntf` deleted. No pre-existing worktree or branch pruned. `origin/nightly/2026-08-26-improvements` left untouched.
- 2026-08-26 — 1 subagent dispatched, 1 returned. Nothing silently dropped.

## 2026-08-27

- HARVEST — 10 notes in window, 0 survived cheap filter 1. 5 empty body (screenshot only), 2 link dumps, 3 personal/private-layer (2 refused for third-party personal data, 1 link dump). 0 ingested. Sixth consecutive zero harvest; correct result.
- REFUSED — p7179, p7174: personal-context notes naming and characterising identifiable third parties. Same judgment as p7168/p7124.
- COVERAGE — backlog file present on origin for 8/8 repos, re-derived inline.
- DRAIN — Agentic-Pi-Harness, backlog 2026-08-27 (diffEffectLogs compares final per-path state). Decision IMPLEMENT, Small, docs-only.
- MERGE — Agentic-Pi-Harness a1eb43af82e2df54224e75d0da04530be99ee999. Docstring corrected to state final-per-path semantics; backlog entry annotated and deliberately left Open (the contract decision is untouched). Gate: typecheck 0, lint 0, 75 files / 380 tests pass, build 0, fresh clone clean, acceptance evidence observed (grep -c 'every mutating tool call' -> 0). Revert: git -C /Users/jaywest/Agentic-Pi-Harness revert -m 1 a1eb43af82e2df54224e75d0da04530be99ee999 && git -C /Users/jaywest/Agentic-Pi-Harness push
- SKIPPED — Agentic-KB freshness.mjs 2026-08-25. Second half (inferClass substring match) is Small and takeable; first half (scoreFreshness fail-open) is a policy question for Jay. Conservative reading taken per the Phase 2e blocked-entry rule.
- FINDING — Phase 2e has drained the stock. After this item, no repo in the fleet holds a Small unblocked backlog entry. Four repos have an empty ## Open; the other four hold only Large or decision-blocked items. ~2/3 of the ~41 remaining items name a decision only Jay can make.
- CORRECTION — Agentic-Pi-Harness origin/nightly/2026-08-23, -08-24, -08-25 are all contained in origin/main and are dead refs never deleted. Only -08-26 and -08-27 are genuinely unmerged.
- HYGIENE — 2 worktrees created under /tmp/ntf, both removed, pruned, branch deleted. Agentic-Pi-Harness returned to baseline 4. MissionControl 55 -> 58, not touched. Disk 45 -> 54 GiB free.
- ACTION REQUIRED — p7005 / p1808 credential rotation, sixth consecutive report. No committed copy of the OpenRouter value in any of the eight repos. PR #19 still open.

## 2026-08-28 (scheduled 08:20 PDT)

- PREFLIGHT — HALT absent. Disk 40 GiB free (96% used, down 14 GiB from yesterday's 54 GiB; still above the 30 GiB wave-split threshold but trending down two days running). Worktree baselines match last run exactly on all eight repos. Backlog coverage re-derived inline against origin: 8/8 HAS (fourth consecutive run).
- HARVEST — 4 notes in window, 0 work orders. SEVENTH consecutive zero harvest from Notes; correct each time. 2 link dumps (p7216, p7217, 26-byte bodies, Screen 2), 1 re-modified interview-prep note already dispositioned (p7039, 15 KB, NOT_ACTIONABLE, unchanged), 1 ingested.
- INGEST — p7203 "Tony" (3.5 KB, RoofClaim Recovery business proposition) → `raw/clippings/2026-08-27T19-33-06__apple-notes__tony__b825219b.md`, committed `235389d`. Screen 3 considered and cleared: a first name in a business-partner context with no contact details and no characterisation of the person is below the bar that refused p7168/p7179/p7174. PII pre-commit guard passed. Not a code item — no repo mapping, so no work order, which is the correct disposition rather than a miss.
- TOOL DEFECT — `mcp__Read_and_Write_Apple_Notes__list_notes` returned the **wrong id** for a note: it listed "Adobe interview" under `p7216`, which is actually the `lnkd.in/p/gy_5Gg6M` link note. The real id is `p7039`. The skill already forbids `get_note_content` because it keys on name; this run establishes that the **ids from `list_notes` are also unreliable**. Enumerate in-window notes with a direct `osascript` loop over `notes` filtered on `modification date` instead. Had the listing been trusted, p7039 would have been re-ingested under the wrong identity.
- PHASE 2E — engaged (harvest under 2 work orders). Read the `## Open` section of all three non-empty backlogs in full. **Stock still drained**: Agentic-KB 20 open, Agentic-Pi-Harness 10, hermes-harness-missioncontrol 15, and every one is self-declared Large or names a decision only Jay can make. Twinz, morning-review, ai-software-factory-mastery, SellerFi have an empty `## Open`. MissionControl 5, all Large. Second consecutive run at the floor. Note the counts moved (KB 11→20) because `daily-repo-improvement` files nightly; none of the new items are Small.
- DRAIN — Agentic-KB, backlog 2026-08-25 (`scoreFreshness` fails open, and `inferClass` matches by substring). Decision **BACKLOG with correction**, not IMPLEMENT. This is the entry this job's own run state has carried for three consecutive runs as "genuinely Small and takeable on its own — say the word and it is a one-run fix". Read both functions this time instead of the entry describing them, and **retracted that claim**: `inferClass` and `classFor` are not twins (different class vocabularies — `personal|session|canonical` vs `rewrite|bus` — and a deliberate disagreement on `^wiki/system/bus/`), so "make them agree" is not a valid acceptance criterion and the obvious test would be wrong to write. Reachability is zero on the tracked tree, not merely latent: no path matches `/profile.md` as a non-suffix and **no `.mdx` file is tracked in the repo at all**, so the entry's "`.mdx` is live here" describes the repo-docs sync path, not this repo's content. What remains is a small design question — whether the exemption should be anchored *and* scoped to `wiki/agents/` — which is Jay's call. Entry left Open.
- MERGE — Agentic-KB `db49b75a9949d566c0733ac9b1b95959dce464f8`. Docs-only, +5 lines, additive. Gate: all four cited files exist, both cited symbols exist, cited line numbers `freshness.mjs:22-23`, `sync.mjs:11,13,340`, `context-loader.mjs:21` all verified to say what the prose claims; markdown structural parse clean, fences balanced, open-item count unchanged at 20. Acceptance evidence observed: the two `git ls-tree` greps that ground the reachability claim were run against `origin/main` and returned no matches and `0` respectively. Revert: `git -C /Users/jaywest/Agentic-KB revert -m 1 db49b75a9949d566c0733ac9b1b95959dce464f8 && git -C /Users/jaywest/Agentic-KB push`
- SELF-INFLICTED DEFECT FOUND, **NOT** FIXED — two of this KB's own controls are in direct conflict, and the result is that this job blocked another job. `briefings/errors/agentic-kb-editor-run-2026-08-28-0625.md` records that the 06:25 `agentic-kb-editor-run` aborted at its pre-run dirty-worktree safety gate, naming `M state/notes-to-factory/ledger.md` as a blocking dirty file. The first guess — "Phase 5 says append and never says commit" — was wrong. The real chain, established by attempting the commit:
  - `ledger.md` is **tracked** (`last-run.json` was gitignored for this same collision on `454133a`, "regenerated machine state that trips the PII guard").
  - This job's honest triage reasons necessarily name the *class* of a refused note. The 2026-08-27 entries say a note was refused as recruiting-interview material — and `scripts/hooks/pre-commit:49` carries that exact two-word phrase in its deny-list.
  - So `git commit` on `ledger.md` is **refused by the PII guard**. Two lines trip it. This is not a forgotten commit; it is an uncommittable file. Last successful commit was `2b4f370` on 2026-08-26, whose entries happened not to contain the phrase.
  - The tracked-and-uncommittable file leaves the KB working tree permanently dirty, which trips `agentic-kb-editor-run`'s dirty-worktree gate. One control disables another.
  - **Deliberately not resolved autonomously.** `--no-verify` bypasses a security control. Rewording the 08-27 entries edits an append-only audit record. Loosening the regex is the fourth loosening commit in this hook's history, and this repo's own backlog entry on retiring that denylist warns in terms against exactly that ("Do not add pattern #25"). All three are Jay's call. In ACTION REQUIRED with the options.
  - Today's entries were written to avoid adding new trigger phrases, so the problem does not grow — but the file stays dirty and the editor run stays blocked.
- NOT MINE, STILL BLOCKING — `?? wiki/daily-systems/logs/2026-08-27.md` is the second dirty file named in that briefing and belongs to another job (`morning-review-daily`). Deliberately not committed — not this job's file. So even if the ledger collision above were resolved, **the editor run stays blocked until someone commits that file too**. Both dirty paths have to clear.
- HYGIENE — 1 worktree created under `/tmp/ntf`, removed and pruned, branch deleted, Agentic-KB returned to baseline 3. No pre-existing worktree or branch touched. MissionControl 58, detached HEAD, unchanged this run and untouched. No subagents dispatched (single docs-only work order; the worktree already provides the isolation).
- ACTION REQUIRED — p7005 / p1808 credential rotation, seventh consecutive report, neither note fetched. PR #19 in hermes-harness-missioncontrol still open. Five unmerged nightly branches on Agentic-KB (08-25/08-26 lockfile conflict, take 08-26 first); three on hermes. No workflow patches needed.
