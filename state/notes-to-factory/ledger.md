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
