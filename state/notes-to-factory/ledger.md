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
