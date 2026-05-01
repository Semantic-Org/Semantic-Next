---
title: Coverage Campaign — Orchestrating Greenfield Tests
description: Multi-stage workflow for an orchestrating agent to coordinate greenfield test coverage of a near-uncovered file or feature using parallel grounded-testing and red-team-testing subagents with stage-gated user input. Use when asked to fill a coverage gap on a file with little or no existing tests, where a single agent can't hold the whole surface in context and parallel exploration is faster than serial.
keywords: [coverage campaign, orchestration, parallel subagents, greenfield testing, test coverage, multi-stage workflow, grounded-testing, red-team-testing, fan-out, intent reconciliation]
audience: contributing
type: workflow
workflow: coverage-campaign
---

# Coverage Campaign — Orchestrating Greenfield Tests

> **Skill:** `coverage-campaign`
> **Purpose:** Multi-stage workflow for an orchestrating agent to coordinate greenfield test coverage using parallel grounded-testing and red-team subagents, with stage gates for human input on contract ambiguity.

---

## When to Use

- A file or feature area has near-zero test coverage and the user asks you to fill the gap
- The surface is large enough that a single agent can't hold the whole intent in working memory
- Parallel exploration of disjoint sub-surfaces would be faster than serial sweep
- There is a canonical user-facing doc (or set of docs) that defines the contract

Canonical example: `packages/templating/src/template.js` (~1,150 lines, one trivial existing test, multiple documented surfaces — events, lifecycle, dispatch, attachEvent, key bindings, DOM scoping, subtemplate plumbing).

## When NOT to Use

- Single bounded feature with rich docs → use `grounded-testing` directly, no orchestration needed
- Post-PR audit of an already-tested feature → use `red-team-testing` directly
- The file has no documented contract and you'd be inventing the spec → escalate to the user; this workflow can't resolve that

---

## The Stages

Five stages, three of them user-gated. **Parallelism is within a stage; stages are sequential.** This isn't bureaucracy — each stage produces synthesis the next stage depends on, and the gates exist at points where blind continuation would compound errors.

```
Stage 0  Survey & Partition          [orchestrator]
Stage 1  Parallel Intent Mapping     [N grounded-testing subagents]
Stage 1.5 Intent Reconciliation      [USER GATE — contract decisions]
Stage 2  Parallel Test Writing       [N test-writing subagents]
Stage 2.5 Failure Triage             [USER GATE — real bugs vs drift]
Stage 3  Parallel Red-Team Review    [N red-team subagents]
Stage 3.5 Gap Synthesis              [orchestrator + optional follow-up subagents]
Stage 4  Final Pass                  [orchestrator]
```

---

### Stage 0 — Survey and Partition

**Orchestrator only.** No subagents yet. You're preparing the partition that will drive every parallel fan-out below.

1. **Read canonical user-facing docs top-to-bottom** for the topic. Use MCP (`list_user_docs`, `get_user_doc`) — never grep `docs/`. Read in order; the doc's structure is the priority order.
2. **Read source whole** — `Read` the file under test, no grep substitution.
3. **Read existing tests.** Note what's covered (likely little).
4. **Identify major surfaces** from doc structure. Each top-level subsection of the canonical doc is a candidate surface. Aim for 3–10 surfaces; collapse adjacent subsections if the doc is granular, split if a subsection is unusually deep.
5. **Partition with no overlap and no orphans.** Every documented behavior maps to exactly one surface. Note explicitly what's out-of-scope (private helpers, internal data path machinery — these are tested transitively, not directly).
6. **Estimate weight.** Per the canonical doc's coverage proportion. Lifecycle taking 25% of doc body → roughly 25% of the test budget.

**Output:** a partition document at `ai/workspace/<area>/partition.md` listing surfaces, their doc-coverage weights, the source-file region each touches, and explicit out-of-scope items.

```markdown
# Partition — packages/templating/src/template.js

## Surfaces (each maps to one Stage-1 subagent)

| # | Surface | Doc weight | Source range |
|---|---|---:|---|
| 1 | Events DSL — delegation + keywords + teardown | ~25% | l. 418–612 |
| 2 | Lifecycle — created/rendered/updated/destroyed + promises | ~25% | l. 195–270, 876–914 |
| ...| ...| ...| ...|

## Out of scope (tested transitively)
- `getDataContext`, `buildCallParams` shape — covered by lifecycle param tests
- `isNodeInTemplate`, `getRootChild` — covered by `$`/`$$` filter tests
```

---

### Stage 1 — Parallel Intent Mapping

**Fan out one `grounded-testing` subagent per surface.** Spawn them in a single message for true concurrency.

Each subagent:
- Loads `grounded-testing` skill via MCP
- Receives the partition's entry for ITS surface (not the whole partition)
- Returns: labeled intent + trace table + sketch tests + surface-section findings
- Does **not** write tests to disk

**Subagent prompt template:**

```
You are a grounded-testing subagent. Your scope is the {SURFACE_NAME} surface
in {FILE_PATH}. Other surfaces of this file are owned by parallel subagents
— stay in your scope.

Load and follow the skill at:
ai/skills/contributing/grounded-testing.md

Canonical user-facing doc for this surface: {DOC_PATH}
Source range: {SOURCE_RANGE}

Out of scope (other agents own these): {OTHER_SURFACES}

Save your report to: {WORKSPACE}/intent/{SURFACE_NAME}.md

Follow the skill's prescribed report format. Be tight; the orchestrator will
read N of these and reconcile. Convergent findings across surfaces are high
signal, so be specific about what you flag.
```

**Orchestrator while running:** can prepare the test environment scaffolding (engine stub, fixture helpers, `beforeEach` cleanup patterns) — independent of subagent output, parallelizes the wait.

---

### Stage 1.5 — Intent Reconciliation [USER GATE — conditional]

**Where the orchestrator earns its keep.** Determining intent often — but not always — requires the user.

**Off-ramp.** If Stage-1 reports surface no convergent ambiguities, no doc-vs-source disagreements that affect the contract, and no cross-surface tensions, proceed directly to Stage 2. The gate exists for decisions, not ceremony. Most campaigns will gate; not all need to.

**Re-partition if Stage 1 revealed the partition was wrong.** A surface bleeding into another, or two surfaces that should have been one, surfaces here. Re-partition before spawning Stage 2 — the cost of one re-spawn is far less than the cost of two subagents writing overlapping or conflicting tests.

When the gate IS warranted:

1. **Read every Stage-1 report.** Don't skim; the labeled claims matter.
2. **Build an aggregated findings table** — one row per surface-flagged contract ambiguity, doc-vs-source drift, or ambiguous spec. Tag rows where multiple surfaces independently flagged the same thing (convergent findings = high confidence).
3. **Identify cross-surface tensions.** Surface A's claim may conflict with Surface B's. Resolve by reading source, or surface to user if unresolvable.
4. **Identify shared scaffolding needs.** If three subagents all sketched a "fresh-component fixture" pattern, the orchestrator should write that helper once and broadcast it to Stage 2 spawns (see "Sharing between subagents" below).
5. **Surface to user, in one batch:**
   - Convergent findings (highest confidence — "three subagents flagged X")
   - Doc-vs-source disagreements that affect the contract
   - Cross-surface ambiguities that need a decision
   - **Don't ask one question at a time** — batch and present a structured decision document
6. **Wait for user decisions.** Update the partition + sketches with resolved contracts. Note explicitly which sketches changed and why.

**Aggregated-findings template:**

```markdown
# Stage 1 Findings — Decisions Needed

## Convergent (multi-surface confidence)
1. **`return false` / `'cancel'` documented but not honored by `@event=`** — flagged
   independently by Events surface and Subtemplate surface.
   - Source: not implemented in `template.js` event handler closure
   - Docs: events guide explicitly documents both
   - **Decision needed:** fix code, fix docs, or doc-cleanup partition between
     `events:` object DSL (honors) and `@event=` template attr (doesn't)?

## Single-surface findings worth surfacing
2. **Default engine doc says `lit`, source says `native`** (Construction surface)
   - Already known; doc cleanup likely

## Cross-surface tensions resolved by orchestrator (FYI)
3. ...
```

**Output:** Updated `partition.md` + per-surface sketch files with reconciled contracts.

---

### Stage 2 — Parallel Test Writing

**Fan out one test-writing subagent per surface.** Each takes the reconciled sketch and writes runnable Vitest.

**Subagent prompt template:**

```
You are a test-writing subagent for the {SURFACE_NAME} surface in {FILE_PATH}.

Test design (sketch, with user-resolved contract decisions inline):
{SKETCH_PATH}

Test mechanics skill: ai/skills/contributing/testing.md
Existing test patterns to follow: {PEER_TEST_FILES}

Write runnable Vitest tests at:
{TEST_FILE_PATH}

Run them via:
{TEST_COMMAND}

Report:
- Tests written (count)
- Tests passing
- Tests failing (with the failure mode classified: real source bug / contract
  ambiguity / test setup error / unexpected behavior worth surfacing)
- Any deviation from the sketch (with reason)

Save report to: {WORKSPACE}/written/{SURFACE_NAME}.md

Do NOT silently align failing test expectations with what the code returned.
Report the divergence — the orchestrator will triage.
```

**Why parallel test-writing is safe here:** each subagent owns one test file (or one `describe` block in a shared file with no overlap). No merge conflicts. Subagent runs its own tests in isolation; orchestrator aggregates pass/fail counts.

---

### Stage 2.5 — Failure Triage [USER GATE]

**Orchestrator + user.** Most failures fall into one of four buckets:

| Bucket | Action |
|---|---|
| Test setup error (mock wrong, fixture missing) | Orchestrator fixes inline or asks subagent to retry |
| Real source bug | **Surface to user** — they decide fix scope |
| Contract ambiguity user already resolved in Stage 1.5 | Align test with the resolved contract; note in commit |
| New contract ambiguity not seen before | **Surface to user** — they resolve |

**Build a triaged failure report:**

```markdown
# Stage 2 Failures — Triage

## Real source bugs (surface to user)
- `template.js:573` does not stop propagation on `return false` — confirms
  the Stage 1.5 finding. Test pinned current behavior; fix would land here.

## Test setup errors (orchestrator fixed inline)
- Lifecycle suite: `await el.rendered` was missing; added.

## Contract ambiguities to resolve
(none new this round)
```

After this gate, all Stage-2 tests should be green. If they aren't, you have an unresolved bug or contract decision — don't proceed.

---

### Stage 3 — Parallel Red-Team Review

**Fan out one `red-team-testing` subagent per surface.** Each reviews the now-passing Stage-2 tests for gaps.

**Subagent prompt template:**

```
You are a red-team-testing subagent for the {SURFACE_NAME} surface.

Existing tests (now passing): {TEST_FILE_PATH}
Source under test: {SOURCE_RANGE}
Canonical doc: {DOC_PATH}

Load and follow the skill at:
ai/skills/contributing/red-team-testing.md

You are running in inline mode (the skill describes both subagent and inline
modes — the methodology is identical). Apply the frequency-scored gap-finding
methodology to the existing test surface.

Save report to: {WORKSPACE}/redteam/{SURFACE_NAME}.md

Do not write tests — return findings.
```

---

### Stage 3.5 — Gap Synthesis

**Orchestrator.** Aggregate red-team findings across surfaces.

1. **Sort by frequency × severity.** Red-team scores frequency natively; the orchestrator weights by severity (data loss > silent wrong behavior > confusing error > cosmetic).
2. **Decide action per finding:**
   - **High-priority gaps** (≥50% frequency or any severity ≥ silent-wrong-behavior): spawn another small fan-out of test-writing subagents to cover them
   - **Low-priority gaps** (<50% frequency, low severity): document for backlog or skip
   - **"Won't hit in practice"** findings: skip with note
3. **Run the augmented suite** until green.

If high-priority gaps require a Stage-2-style spawn, treat that as a focused mini-iteration — same prompt template, narrower scope.

**Cap at one mini-iteration.** A second round of red-team after the gap-fillers is the limit; remaining findings go to backlog with a brief note, not into a third loop. The campaign isn't trying for completeness — it's trying for honest first-pass coverage with documented residue. Diminishing returns on a third pass are real, and the user can re-spawn red-team later when the residue list earns its own attention.

---

### Stage 4 — Final Pass

**Orchestrator.** Mostly mechanical:

1. Run the full suite end-to-end. Confirm green.
2. Run coverage if useful — identify any unintentional gaps.
3. Compose a summary report:
   - Total tests added (per surface)
   - Contract decisions resolved with the user (Stage 1.5, 2.5)
   - Real source bugs surfaced + status (fixed in this branch / filed for follow-up)
   - Doc-cleanup items surfaced (pending PR or filed)
   - Backlog of red-team gaps deferred

Hand off to the user for review and merge.

---

## Determining Intent — When to Loop the User

**The skill prescribes when to surface; this workflow says how to batch.**

Do NOT one-question-at-a-time. The orchestrator's job is to gather all decision-needing items from a stage, present them as a single coherent decision document, get answers, and move forward. Specifically:

| Stage | What to batch |
|---|---|
| 1.5 | Convergent contract ambiguities + cross-surface tensions + scope reconfirmations |
| 2.5 | Real source bugs + new contract ambiguities discovered through test failures |
| 3.5 | (rarely) high-severity red-team findings that suggest a contract is wrong |

Inside a stage, individual subagents may flag findings. The orchestrator collects, dedupes, ranks by confidence (convergent = high), and presents in a structured table. The user makes one pass through the table; the orchestrator updates downstream artifacts.

**Sharing between subagents:** broadcast shared *scaffolding* freely between stages — fixtures, stub patterns, helpers, "every test needs an engine stub; here's the pattern." If Stage 1 surfaced it, every Stage 2 subagent should get it at spawn time rather than rediscover it. The orchestrator owns this distribution; that's the point of having an orchestrator.

What to NOT share is *intent traces* mid-stage. Stage-1 subagents are independent witnesses; cross-pollinating their findings before reconciliation collapses the convergent-finding signal into orchestrator suggestion. Convergence is high-confidence only when it's independent.

So: scaffolding crosses freely between stages; claims do not cross within a stage.

---

## Anti-Patterns

### Parallel-everything

Spawning N subagents to do all stages in parallel sounds fast but loses the synthesis between stages. The Stage-1.5 reconciliation can't happen if Stage-2 has already started. Stage gates are not bureaucracy — they're where compounding errors get caught.

### Orchestrator as worker

If the orchestrator starts writing tests itself, it's no longer orchestrating. The whole point of fan-out is breadth in parallel; an orchestrator-as-worker serializes the work without adding any synthesis value.

### Fan-out without partitioning

N subagents on the same broad scope produces N overlapping test designs and merge hell. Partition first. Each subagent owns a disjoint slice; no surface has two owners; no documented behavior has zero owners.

### Skipping Stage 1.5

It is *very* tempting to read the Stage-1 reports and start writing tests immediately. Don't. Real findings get buried, contract ambiguities silently bake into tests, the user discovers them at PR review. The 5-minute gate prevents 2 hours of rework.

### Asking the user one question at a time

Drip-feeding decisions wastes the user's attention and breaks their flow. Batch all of a stage's decisions, present in a structured document, wait for one batch of answers.

### Mistaking convergence for consensus

Three subagents independently flagging the same thing IS high signal. But not always — sometimes a convergent finding is just convergent priors. Verify against source before treating it as load-bearing. Especially for cross-framework-prior findings (the canonical hallucination class).

---

## Quick Reference

```
0   Survey & partition (orchestrator only)
1   Parallel grounded-testing subagents (fan-out, one per surface)
1.5 Aggregate findings → batch user decisions [USER GATE]
2   Parallel test-writing subagents (fan-out, one per surface)
2.5 Triage failures → real bugs vs drift [USER GATE]
3   Parallel red-team-testing subagents (fan-out, one per surface)
3.5 Gap synthesis → optional follow-up writes
4   Run full suite, summarize, hand off
```

**Parallelism rule:** within a stage, fan out aggressively. Across stages, sequential.

**User-input rule:** batch per stage. Never drip-feed decisions.

**Partition rule:** each documented behavior owned by exactly one subagent. No overlap, no orphans.

**Convergent-findings rule:** multi-subagent agreement is high signal, but verify against source before promoting.

**Orchestrator-isn't-a-worker rule:** if you find yourself writing tests, you've left the workflow. Spawn a subagent.

---

## Related Skills

| Skill | Used by | When |
|---|---|---|
| **`grounded-testing`** | Stage-1 subagents | Test design from documented intent |
| **`red-team-testing`** | Stage-3 subagents | Frequency-scored gap finding |
| **`testing`** | Stage-2 subagents | Test mechanics — Vitest, environments, file placement |
| **`testing-internals`** | Orchestrator (rarely) | Only if changing test infra during the campaign |
| **`fresh-take`** | Optional Stage-1.5 helper | If you need a bias-free second opinion on contract reconciliation |
