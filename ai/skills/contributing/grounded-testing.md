---
title: Grounded Testing
description: Methodology for writing tests that verify what typical users care about regressing — common-path behavior promised by user docs, examples, and skills, gathered exclusively through the Semantic UI MCP server (never grep), triangulated against source with detective skepticism, and arbitrated by the test outcome itself when sources disagree. Lead with the cases the majority of users will hit; defer edge cases to `red-team-testing`. Use this skill whenever writing tests for any user-facing feature, and ESPECIALLY when broadly asked to "fill in testing gaps" — the canonical failure mode this skill exists to prevent. Pairs with `testing` (mechanics) and `red-team-testing` (frequency-scored edge-case analysis).
keywords: [grounded testing, common-path testing, intent-first, MCP-first, triangulation, detective method, witness pool, labeled inference, test as arbiter, frequency heuristic, doc-code drift, tautological tests, fill the gap anti-pattern, TDD]
audience: contributing
skill: grounded-testing
type: skill
---

# Grounded Testing

> **Skill:** `grounded-testing`
> **Purpose:** Write tests grounded in what a typical user cares about regressing — by gathering context exclusively through the Semantic UI MCP server, building a labeled intent across docs, examples, and skills, verifying against source with skepticism, and using the test outcome itself as the arbiter when sources disagree.

---

## Golden Rule

**A test must verify behavior a typical user would notice if it broke.** Not internal returns. Not implementation paths. Not synthetic edge cases — those belong to `red-team-testing`. The bullseye is the common-path behavior the majority of users will actually hit, and would file a GitHub issue about if it stopped working.

To know what users notice, you have to know what was promised. To know what was promised, you triangulate: docs, API references, examples, authoring skills, source. All witnesses. None authoritative. Drift between them is the norm. Be skeptical of each. Let the test arbitrate.

---

## Why This Matters (Project-Critical)

This is open-source plumbing for thousands of downstream developers. Tests are the contract between the framework and its users. The single most damaging failure mode in test-writing on this repo is:

**"Fill in the testing gap" → green tautological tests.**

Asked to broadly add tests, agents read source, find untested paths, write tests that exercise those paths, and adjust expectations to match returned values. Every test passes. Coverage rises. The suite is bigger and carries no new information about whether the framework matches what users were promised. The project ends up *worse off* — false security against the regressions that actually matter (silent drift between docs and behavior).

The corrective lives in one question, asked of every test you add:

> *"What user-visible behavior would I notice regressing if this test failed?"*

If you can't answer in user terms — what a developer would observe, what a release-notes line would say — the test is wrong, regardless of what it asserts.

---

## Common Paths First (Edge Cases Belong to Red-Team)

This skill's bullseye is the **majority case** — behavior most users of a feature will actually exercise. Edge cases (boundary conditions, unusual inputs, less-typical configurations) belong to `red-team-testing` and are scored there by frequency. The two skills are complementary, not overlapping.

**The frequency heuristic.** When you find a candidate test or contradiction, ask:

> *"What percentage of end users will encounter this case?"*

| Frequency | Where it belongs |
|---|---|
| 80–100% — every user hits this | This skill. Test it. |
| 50–79% — common but not universal | This skill, with judgment for severity |
| 20–49% — occasional but legitimate | `red-team-testing` |
| 5–19% — rare but real | `red-team-testing` |
| 0–4% — theoretically possible | `red-team-testing` or document as known constraint |

**Why the calibration matters:** synthetic-looking contradictions are easy to discover and waste effort. A contradiction about behavior no typical user will observe (e.g., a parameter no developer in default mode would reach for) isn't a grounded-testing finding — it's a curiosity. The grounded-testing skill is for getting the bullseye right, not cataloguing every possible drift.

If a contradiction fails the frequency check, **don't surface it as a grounded-testing finding** — note it for red-team or for documentation cleanup, and move on.

---

## When to Use This Skill

Use whenever you're writing tests for behavior with any user-facing surface:

- Template syntax (helpers, modifiers, expression dialects)
- Event DSL keywords (`deep`, `global`, `bind`)
- Component lifecycle and `defineComponent` parameters
- Signal/Reaction methods and options
- Query methods
- Public spec and helper APIs
- Documented build/SSR/CDN behavior

And ESPECIALLY when given an open-ended request like *"fill in the testing gap in templating"* or *"add more tests for X"*. That's the request shape this skill exists to handle.

---

## MCP-First Discipline

You build the witness pool through the **Semantic UI MCP server**, not by reading directories or greping. MCP enforces what grep cannot: every fetch returns the *whole document*, and every `get_*` response includes a `related` field pointing at connected content. You build the pool by following relations until saturated. **This is non-negotiable** — agents who grep `docs/` or `ai/skills/` will miss the connective tissue (callouts, sibling concepts, contrast examples) that defines the contract.

### Start here

```
help()  — server orientation; read this once if unfamiliar with the MCP layout.
```

### Discovery — find what exists

```
search("deep event binding")
  — Wide net across components, examples, docs, skills, workflows. Start here when unsure.

list_user_docs()
  — All guides + API reference pages. Paths under `guides/*` are tutorials;
    `api/*` are reference (signatures, params, return types).

list_examples()
  — All examples, grouped by category (Framework / Templates / Query / etc.).

list_context(audience: 'contributing')
list_context(audience: 'authoring')
  — AI context docs (skills) for the relevant audience. Authoring skills often
    encode subtle rules absent from user docs.

list_skills(audience: 'authoring')
  — Comprehensive learning guides for major topics (templating, reactivity, etc.).

list_components()
  — UI component specs (button, card, modal, etc.).

list_workflows()
  — Step-by-step procedures (e.g., add-util-function).
```

### Fetch — read specific items (batch where possible)

```
get_user_doc(["guides/components/events", "guides/templates/slots"])
  — Batch-fetch user docs. Always pass an array when you need more than one.

get_example(["event-binding", "template-event-handlers", "global-events"])
  — Batch-fetch examples. Look at the contrast examples (without the feature
    you're testing) too — they show what the default behavior is.

get_context("authoring/component-events")
  — Authoring/contributing skill content. More precise than user docs on subtleties.

get_api("defineComponent")
get_api("each")
  — Quick lookup for a specific method. Returns the most relevant API page.

get_component(["button", "card"])
  — Full component spec — attributes, variations, slots, default state.

get_workflow("workflows/framework/add-util-function")
  — Step-by-step procedure.

use_skill("templating")
  — Load a comprehensive learning skill (returns a multi-page guide).
```

### Follow `related`

Every `get_*` response includes a `related` field with pointers to connected content:

```json
{
  "content": "...",
  "related": {
    "examples": ["event-binding", "global-events"],
    "skills": ["component-events"],
    "docs": ["guides/components/lifecycle"]
  }
}
```

**Always follow `related`** until you stop getting new material. This replaces the `grep -r` instinct and produces a more complete pool than keyword-search ever does.

### Source code is different

For implementation files (`packages/*/src/`), use `Read` — and read **whole files**, not greps. When the user names a file, read it in full. Grep on source for unknown symbols is acceptable; grep on source as a substitute for reading what was named is not.

### Forbidden moves

```
❌  grep -r "deep" docs/
❌  Greping ai/skills/ for an authoring skill name
❌  Reading one MCP doc and stopping (ignoring `related`)
❌  Greping packages/*/src/ to learn what a feature does (read the file)
✅  search("deep event binding") then batch-fetch the hits, then follow `related`
✅  Read the whole template.js when investigating event mechanics
```

---

## The Detective's Method

You are a detective. Every source is a witness with bias and incomplete information. Truth emerges from triangulation, not from any single source.

### 1. Build the witness pool (via MCP)

Use the commands above. For every feature, gather:

- **User-facing docs** — what was promised
- **API reference pages** — params, types, returns
- **Examples** — patterns the docs encourage, including contrast cases
- **Authoring/contributing skills** — subtle rules
- **Source** (whole file) — what the implementation does today
- **Recent commits** — `git log <file> | head -20` if behavior may have changed recently

### 2. Read every witness skeptically

Each kind of witness lies in characteristic ways:

| Witness | How it can mislead |
|---|---|
| Docs | Lag behind code; aspirational; vague language; oversimplified examples |
| Examples | May reflect old patterns; may not show contrast cases |
| Authoring skills | Often partial (covers one part of a feature, not all of it) |
| Source | May have bugs; may not implement what was intended; comments may be stale |
| Recent commits | Author-perspective; may omit subtle behavior changes |

No single witness is authoritative. Drift between any pair is the norm.

### 3. Articulate intent with labeled moves

Don't write a paragraph saying "the feature does X." Build the intent claim by claim, **labeling the source of each claim**. The labels make your reasoning auditable, and force discipline — you can't smuggle a guess in as a doc claim.

| Label | Meaning |
|---|---|
| `[doc]` | Direct quote or paraphrase from a user-facing doc page |
| `[example]` | Pattern shown in a code example |
| `[skill]` | Claim from an authoring/contributing skill |
| `[inference]` | Logical step from existing claims (e.g., "keyword exists to modify default → absence implies inverse") |
| `[synthesis]` | Unified mental model abstracted from multiple claims |
| `[source]` | Behavior observed in the implementation |
| `[contradiction]` | Two witnesses disagree (subject to frequency check before becoming a finding) |

The `[synthesis]` move is where testing gets powerful. Once you've named the unifying mental model — "boundary escape control," "lazy materialization," "structural equality" — you can derive cases the docs never enumerated. The synthesis predicts behavior; the test verifies the prediction.

### 4. Trace common paths through the synthesis

Walk concrete cases through your model and write down what you expect — **leading with the cases the majority of users will encounter.** Don't enumerate edge cases here; that's red-team's job.

For `deep` synthesized as "boundary escape control":
- Click on own-template element matching selector → fires (every author hits this)
- Click on slotted content matching selector, default → does NOT fire (the safety contract — every consumer hits this)
- Click on slotted content, deep → fires (every author who uses `deep` hits this)
- Click in nested child shadow DOM, default → does NOT fire (safety again)
- Click in nested child shadow DOM, deep → fires

Stop here. Cases like "what if the developer wraps deep in a try/catch" or "what if the selector is malformed" are red-team territory.

### 5. Read source as verification, not authority

You read source AFTER the labeled intent is built. **Compare; don't update silently.** Where source agrees with your trace, your understanding is reinforced. Where source disagrees on a common-path case, mark `[contradiction]` and let the test arbitrate. Where source disagrees on an edge case, note for red-team and move on.

The order is intent → source → test → user (when needed). Never source → test → intent — that's the failure mode.

### 6. Tests as arbiter

Tests aren't confirmations. They're decisions. When trace and source disagree on a common path, the test outcome decides what the codebase actually promises:

- **Test passes when you expected fail** → your trace missed nuance. Update the trace; reflect on what you missed; the test guards future regressions.
- **Test fails when you expected pass** → your trace was right; the implementation diverges. The test catches a real bug.
- **Test passes when you expected pass** → trace and source agree. Test guards future regressions.

Both pass and fail teach. **Never silently rewrite an expectation to match what the code returned.**

### 7. Surface only when it matters

When a test outcome contradicts your traced expectation in a way that affects the contract for typical users — stop and surface before locking the test. Apply the frequency heuristic FIRST: would 50%+ of users actually hit this case? If not, it's not a grounded-testing surface — flag for red-team or doc cleanup.

When the threshold is met, surface in plain user terms:

> "I traced from the events guide that without `deep`, slotted content does NOT trigger handlers — that's the safety contract. The test confirms this for `<button class='submit'>` slotted into a component with `'click .submit'` handler. Source agrees. No surface needed.
>
> Separately, I noticed the implementation filters out `isDeep=true` events for default-mode handlers — but a default-mode developer wouldn't be reading `isDeep` in the first place, so this is an edge case for red-team or doc cleanup, not a grounded-testing finding."

The surface threshold: **common-path contract ambiguity**. The user knows what they intended; you don't. Mechanical drift below threshold can be noted in the PR description.

---

## The Anti-Pattern That Defines This Skill

**"Fill in the testing gap"** — the request that produces tautological tests by default.

The agent's natural response:

1. Read source
2. Find paths without coverage
3. Write tests exercising those paths
4. Adjust expectations to match returned values
5. All green; declare done

Every step is reasonable in isolation. The aggregate is tests that mirror source. The suite cannot fail unless the source changes. It will not catch the bug class that matters: drift between user-facing contract and implementation.

The corrective is the orientation question: *"what user-visible behavior would I notice regressing if this test failed?"* If the answer is "an internal function would return a different value" — the test is mirror, not contract.

---

## Other Anti-Patterns

### Implementation-vocabulary test names
```
❌  it('sets options.pierceShadow = true')
❌  it('returns when isDeepEnabled is false')
✅  it('fires on slotted content when deep is set')
✅  it('does NOT fire on slotted content by default')
```

A test name should read like a sentence from a release note.

### Mirror tests
Asserting whatever the function returns. Passes by construction. Catches nothing.

### Skipping the negative case (on common paths)
Testing only "with `deep`, slotted content fires" without "without `deep`, slotted content does NOT fire." Half a test. The negative case IS the contract — and on common paths, the negative case is *load-bearing*.

### Silently aligning with source
Trace says A. Source does B. You write the test for B because that's what passes. The drift is now hidden in your test. Future readers can't tell.

### Reading source before building labeled intent
Once you've read source, you can't un-read it. Your "expected" values silently become the function's outputs. Build the labeled intent first. Read source as verification, not as discovery.

### Ignoring the changelog
Behavior may have changed recently. A doc that says X for a feature whose implementation just changed to Y is the most common drift in active codebases. Skim recent commits when the witness pool feels thin or the docs feel stale.

### Greping when told to read
When the user names a file, read it whole. Grep produces fragments without context.

### Synthetic-edge-case findings
A contradiction about behavior <20% of users will observe is noise from this skill's perspective. Flag it and move on. Don't lead a report with a synthetic-looking finding when the common-path tests are the actual story.

---

## Worked Example: The `deep` Event Keyword

End-to-end execution of the method.

### Step 1 — Witness pool (via MCP)

```
search("deep event binding")
get_user_doc(["guides/components/events", "guides/templates/slots", "guides/query/shadow-dom"])
get_example(["event-binding", "template-event-handlers", "global-events", "event-data"])
get_context("authoring/component-events")
Read("packages/templating/src/template.js")
git log --oneline -- packages/templating/src/template.js | head -20
```

Then follow `related` from each `get_*` response until no new material appears.

### Step 2-3 — Labeled intent

```
[doc]       Events guide: "use the deep keyword to attach events to nested
            web components or slotted content."
[doc]       Events guide callout: "By default selectors will only match the DOM
            of your component's template. This will prevent the handler from
            firing if the user slots content which also matches your selectors."
[doc]       isDeep parameter: "the event occurred on a nested web component
            or slot."
[skill]     component-events: "isDeep — true if the event came from inside
            a child component's shadow DOM" (omits 'or slot' — partial)
[inference] Keywords exist to modify default behavior. Therefore the absence
            of `deep` means events do NOT fire on slotted/nested. The doc
            callout confirms this directly.
[synthesis] The `deep` keyword controls whether events ESCAPE the component's
            ownership boundary. Default = stay inside (safety). Deep = allow
            escape. The keyword exists to give authors explicit consent over
            cross-boundary event capture.
[source]    template.js:418-431 — eventType parsed from leading keyword;
            default eventType is 'delegate'.
[source]    template.js:600-603 — default and deep both attach delegation at
            renderRoot (same attachment); the difference is purely runtime
            filtering.
[source]    template.js:543-546 — runtime filter: default mode skips events
            whose target is outside the matched selector; deep does not skip.
```

### Step 4 — Trace common paths

| Common-path case | Trace expects | Source predicts |
|---|---|---|
| Click on own-template element matching selector, default | fires | Agrees |
| Click on slotted content matching selector, default | does NOT fire (safety contract) | Agrees |
| Click in nested child shadow DOM matching selector, default | does NOT fire (safety contract) | Agrees |
| Click on own-template element matching selector, deep | fires | Agrees |
| Click on slotted content matching selector, deep | fires | Agrees |
| Click in nested child shadow DOM matching selector, deep | fires | Agrees |
| `isDeep` parameter on slotted/nested fire (deep mode) | true | Agrees (closest(selector) is empty after re-targeting → length 0 → true) |
| `isDeep` parameter on own-template fire | false | Agrees |

All common-path cases align between trace and source.

### Step 5 — Sketch tests (common path only)

```js
describe('deep keyword — boundary escape control', () => {
  // Default mode: the safety contract that protects component encapsulation
  it('fires on own-template elements (default mode)');
  it('does NOT fire on slotted content (default mode)');
  it('does NOT fire inside nested child shadow DOM (default mode)');

  // Deep mode: events escape the component boundary as authored
  it('fires on own-template elements (deep mode)');
  it('fires on slotted content (deep mode)');
  it('fires inside nested child shadow DOM (deep mode)');

  // isDeep parameter — for the cases users will actually hit
  it('passes isDeep=false on own-template fire (deep mode)');
  it('passes isDeep=true on slotted-content fire (deep mode)');
  it('passes isDeep=true on nested-child-shadow fire (deep mode)');
});
```

### Step 6 — Run

Tests run; common-path expectations all confirmed. The `isDeep` test for slotted content also resolves the partial authoring-skill claim — `isDeep` IS true on slotted content, not just nested-child shadow.

### Step 7 — Surface (or not)

> All common-path tests pass. The synthesized contract — `deep` controls whether events escape the component boundary — is upheld. The authoring skill's description of `isDeep` (omitting 'or slot') is partial; tests confirm the user-facing doc is accurate. Worth a follow-up to align the authoring skill, but not blocking.
>
> Separately: source filters out `isDeep=true` events for default-mode handlers, so a default-mode handler can never observe `isDeep=true`. Frequency check: a default-mode developer wouldn't reach for `isDeep` (the parameter is meaningful only when escape is opted into). <5% would hit this. Edge case for red-team or doc cleanup, not a grounded-testing surface.

---

## When to Surface vs. Just Document

| Situation | Action |
|---|---|
| Common-path drift between docs and source (≥50% of users) | Surface to user — they decide whether to fix code or docs |
| Authoring skill is partial but user-facing docs are accurate | Note in PR; offer to align the skill |
| Edge-case drift (<20% of users) | Note for red-team or doc cleanup; don't surface as grounded-testing |
| Trace expectations all met by source | Write tests; no surfacing needed |
| Mechanical drift (param naming, internal vocab) | Below threshold; ignore |

The surface threshold is **common-path contract ambiguity**, not just any disagreement.

---

## Tests Before Source vs. After

The strongest version is TDD-flavored: build the labeled intent, sketch tests, *then* write implementation against the spec.

Most work in this repo is brownfield. Same discipline applies:

- **Greenfield (TDD):** Build labeled intent → sketch tests → write code → tests are the spec.
- **Brownfield (existing code):** Build labeled intent from MCP-fetched docs/examples/skills *first*, including inference moves → read source as verification → run tests as arbiter → surface common-path contradictions.

The rule both ways: **labeled intent precedes source reading.** If you read source first, the trace is contaminated.

---

## Relationship to Other Skills

| When... | Use... |
|---|---|
| You're verifying the common-path behavior most users hit | **`grounded-testing`** (this skill) |
| You're hunting frequency-scored edge cases | `red-team-testing` |
| You need test mechanics — environments, Vitest, file placement | `testing` |
| You need test infrastructure — configs, CI, coverage | `testing-internals` |

`grounded-testing` and `red-team-testing` are complementary — they divide the test-design space by frequency. This skill covers the bullseye (the 80%+ cases every user hits). `red-team-testing` covers the rim (frequency-scored edge cases, surfaced as a structured report).

`testing` and `testing-internals` are about how to *run* tests. Load `grounded-testing` first when you're designing tests; load `testing` alongside it when you're translating sketches into runnable Vitest files.

---

## Quick Reference

**The orientation:** every test answers — *"what user-visible behavior would I notice regressing if this test failed?"*

**MCP-first witness pool:**
```
help()                                          — orientation
search("topic")                                 — wide net
list_user_docs() / get_user_doc([paths])        — guides + API ref
list_examples() / get_example([ids])            — code examples
list_context(audience) / get_context(id)        — authoring/contributing skills
get_api(method)                                 — method lookup
list_components() / get_component([names])      — UI specs
list_workflows() / get_workflow(id)             — procedures
use_skill(name)                                 — comprehensive learning skill
```
Follow `related` until no new material appears. **Never grep `docs/` or `ai/skills/`.**

**Source:** `Read` whole files. Never grep when told to read.

**Labels:** `[doc]`, `[example]`, `[skill]`, `[inference]`, `[synthesis]`, `[source]`, `[contradiction]`. Every claim in your intent doc carries one.

**The synthesis:** name the unifying mental model in one sentence ("`deep` controls whether events escape the component boundary"). Synthesis lets you derive cases the docs never enumerate.

**Frequency heuristic:** ≥80% of users → test it; 50–79% → judgment; <50% → red-team or doc cleanup.

**Test as arbiter:** when trace and source disagree on a common path, the test decides. Pass-when-expected-fail teaches; fail-when-expected-pass catches drift; both productive. Never silently rewrite expectations.

**Surface trigger:** common-path contract ambiguity AND ≥50% frequency. Below that, flag for red-team or doc cleanup; don't escalate.

**The canonical anti-pattern:** "fill in the testing gap" → all-green tautological tests. Counter with the orientation question.
