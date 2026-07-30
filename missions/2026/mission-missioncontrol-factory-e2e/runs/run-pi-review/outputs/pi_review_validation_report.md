# MissionControl Factory E2E Pi-Lane Validation

Request: req_mc_factory_e2e_review_4
Session: sess_9ab31676565e
Execution: exec_5c02eda67970
Mission/run/step: mis_mc_factory_e2e / run_mc_factory_e2e / pi_review
Repo: /Users/jaywest/hermes-harness-missioncontrol
Branch reviewed: feat/factory-v0.1-contract-foundation

## Verdict

Partially coherent, not end-to-end Pi-runtime coherent yet.

The UI/API changes create a coherent fixture-backed MissionControl factory project flow: a Factory tab can create a demo project from WAID-42, the API creates a MissionControl project/mission/run/binding, attaches a context-packet artifact, persists state, and exposes updated factory and mission read models.

But Pi is currently represented as a health/status lane only. The create-project flow does not dispatch an execution envelope to Pi, does not record Pi as execution source, and does not consume a Pi result/receipt. This is acceptable for a dry-run/system-of-record slice, but it should not be called true factory E2E with Pi as runtime lane until the dispatch/result boundary is wired.

## Flow reviewed

1. Console Factory tab reads:
   - `GET /api/read-models/factory/overview`
   - `GET /api/read-models/factory/work-items?team=WAID`
   - `GET /api/read-models/factory/throughput?team=WAID`
   - `GET /api/read-models/factory/pi-bridge`

2. Console action posts:
   - `POST /api/factory/projects/demo`
   - payload hardcodes `work_item_key: WAID-42`, repo path `/Users/jaywest/hermes-harness-missioncontrol`, and `preferred_model: mock`.

3. API creates:
   - `FactoryProject`
   - `Mission`
   - started `WorkflowRun`
   - `FactoryMissionBinding`
   - context-packet artifact
   - events: mission.created, run.started, step.started, artifact.created, run status

4. Read models surface:
   - active factory projects
   - bindings per work item
   - mission/run linkage
   - Pi bridge status metadata when token is configured

## Findings

### Blocking for true Pi E2E

1. No Pi dispatch/result loop exists in the factory project path.

Evidence:
- `apps/orchestrator-api/src/index.ts:1647-1686` creates the project/mission/run/binding and context packet, then persists and returns. It does not call the Pi bridge or dispatch an execution envelope.
- `apps/orchestrator-api/src/index.ts:695-728` only builds a Pi bridge read model from `/healthz` and `/meta`.
- `packages/contracts/docs/factory-v0.1.md:28-33` defines Pi as the governed execution supervisor/runtime, but `packages/contracts/docs/factory-v0.1.md:127-134` says Pi runtime consumption is intentionally deferred.

Impact:
MissionControl remains the system of record, but Pi is not yet the runtime lane in this flow. The UI copy says Pi is the governed runtime lane; the implementation only verifies bridge visibility.

Recommendation:
Keep this as “factory project dry-run with Pi bridge visibility,” or add the next slice: dispatch the current run step through the Pi bridge, persist Pi-origin execution events, ingest artifacts/result, and link the receipt packet to the returned Pi result.

Confidence: high.

2. The console hardcoded repo path is outside the API default allowed repo root, so follow-on execution can fail envelope validation.

Evidence:
- UI posts `repo_path: /Users/jaywest/hermes-harness-missioncontrol` at `apps/harness-console/src/App.tsx:201-209`.
- API default `ALLOWED_REPO_ROOT` is `/Users/jaywest/projects` at `apps/orchestrator-api/src/index.ts:23`.
- Execution envelope validation requires `workspace_root` and `repo_scope.root_path` to be inside `ALLOWED_REPO_ROOT` at `apps/orchestrator-api/src/index.ts:225-240`.
- The repo reviewed is `/Users/jaywest/hermes-harness-missioncontrol`, not under `/Users/jaywest/projects`.

Impact:
The create-project button succeeds, but a later `execute-current` for that run can fail with `path escapes allowed root` unless the environment overrides `ALLOWED_REPO_ROOT`. That breaks the perceived end-to-end path.

Recommendation:
Either make the demo repo path configurable from the API/env and aligned with `ALLOWED_REPO_ROOT`, or validate/reject the repo path at project creation time so the UI does not create a run that cannot execute.

Confidence: high.

### Should-fix before calling it factory E2E

3. The API accepts arbitrary `repo_path` on demo project creation without immediate validation.

Evidence:
- `apps/orchestrator-api/src/index.ts:1651-1657` parses and stores `repo_path` through `createFactoryMissionForProject`.
- The path is only validated later during `buildStepExecutionRequest` / `validateExecutionEnvelope`.

Impact:
Invalid factory projects can be persisted and shown as active even though they cannot run.

Recommendation:
Reuse envelope/path validation at creation time or expose a lightweight repo-path validation endpoint for the UI.

Confidence: high.

4. Pi bridge read model is status-only and not tied to the specific factory run.

Evidence:
- `GET /api/read-models/factory/pi-bridge` returns global bridge health/meta, not run-scoped state.
- Factory project creation does not store Pi bridge session/execution identifiers.

Impact:
The UI can show “Bridge online” while the created run has never entered Pi. Operators may read this as stronger evidence than it is.

Recommendation:
For the next slice, show per-run runtime lane state: not-dispatched, dispatched-to-pi, running, awaiting approval, completed/failed, with Pi execution/session id and receipt URI.

Confidence: medium-high.

## Positive validation

- State model extension is backward-compatible: `factory_projects` and `factory_bindings` default to empty arrays and are loaded with null-safe fallbacks.
- Read models tie work items to dynamic bindings and active projects.
- Operator auth is respected on `POST /api/factory/projects/demo` through `requireOperator`.
- Pi token is not exposed in the read model; the test asserts no token property is returned.
- The contract docs preserve the correct authority boundary: MissionControl owns the lifecycle ledger; Pi is runtime; GitHub remains code/PR truth; Agentic-KB is reviewed-learning truth.

## Verification run

Commands executed read-only against the repo:

- `git status --short --branch`
- `git diff -- apps/harness-console/src/App.tsx apps/orchestrator-api/src/index.ts apps/orchestrator-api/src/index.test.ts`
- `pnpm --filter orchestrator-api typecheck`
- `pnpm --filter harness-console typecheck`
- `pnpm --filter orchestrator-api test -- --run src/index.test.ts`

Results:

- orchestrator-api typecheck: passed
- harness-console typecheck: passed
- orchestrator-api tests: passed, 34 tests
- Repo status after verification matched the pre-existing modified/untracked state; no repo files were intentionally modified by this review.

## Bottom line

This is a solid MissionControl factory dry-run/read-model slice. It is coherent with the intended authority model, but it is not yet coherent as a full Pi-runtime E2E lane. The next useful implementation slice should be run-scoped Pi dispatch + receipt ingestion, with repo-path validation fixed before dispatch.
