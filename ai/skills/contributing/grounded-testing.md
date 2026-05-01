---
title: Grounded Testing
description: Methodology for writing tests that verify what users care about regressing — by building a labeled understanding of intent from MCP-served sources (docs, examples, skills, plans) before reading source, and treating the test outcome itself as the arbiter when sources disagree. Lead with the typical use case (common path); include edge cases when documented; defer gap-finding and adversarial probing to `red-team-testing`. Use this skill whenever writing tests for any user-facing feature, and ESPECIALLY when broadly asked to "fill in testing gaps" — the canonical failure mode this skill exists to prevent. Pairs with `testing` (mechanics) and `red-team-testing` (gap-finding and questioning).
keywords: [grounded testing, common-path-first, intent-first, MCP-first, witness pool, labeled inference, empty label slot, test as arbiter, doc-code drift, tautological tests, fill the gap anti-pattern, cross-framework priors, repo novelty]
audience: contributing
skill: grounded-testing
type: skill
---

# Grounded Testing

> **Skill:** `grounded-testing`
> **Purpose:** Write tests grounded in what a user cares about regressing — by building a labeled understanding of intent from MCP-served sources before reading implementation, and using the test outcome itself as the arbiter when sources disagree.

---

## Golden Rule

**A test must verify behavior a user would notice if it broke.** Not internal returns. Not implementation paths. Behavior visible to a downstream developer using the published packages — the kind of breakage that lands as a GitHub issue.

To know what users notice, you have to know what was promised. To know what was promised, you triangulate: docs, API references, examples, authoring skills, plans, source. All witnesses. None authoritative. Drift between them is the norm. Be skeptical of each. Let the test arbitrate.

---

## Why This Matters (Project-Critical)

This is open-source plumbing for thousands of downstream developers. Tests are the contract between the framework and its users. The single most damaging failure mode in test-writing on this repo is:

**"Fill in the testing gap" → green tautological tests.**

Asked to broadly add tests, agents read source, find untested paths, write tests that exercise those paths, and adjust expectations to match returned values. Every test passes. Coverage rises. The suite is bigger and carries no new information about whether the framework matches what users were promised. The project ends up *worse off* — false security against the regressions that actually matter (silent drift between docs and behavior).

The corrective lives in one question, asked of every test you add:

> *"What user-visible behavior would I notice regressing if this test failed?"*

If you can't answer in user terms — what a developer would observe, what a release-notes line would say — the test is wrong, regardless of what it asserts.

---

## Why This Is Hard (You Are Fighting Your Own Defaults)

This codebase is novel in ways your training data doesn't cover. The `{#each}` reconciler uses a heuristic key chain (`_id || id || key || hash || _hash || value || index`) — not React's explicit `key={...}`. Reactivity is Tracker-style, not signals-as-React-hooks. Templates have a dual Lisp + JS expression dialect. Event DSL has `deep`/`global`/`bind` modifiers with subtle semantics. None of this maps cleanly to React, Vue, Svelte, or Lit — and your strongest priors are loudest precisely where the surface *looks* superficially similar.

The defaults this skill is designed to override:

- **Grep over read.** Token efficiency favors fragments over whole files; produces shallow takes.
- **"I know this" over verification.** Confident-completion bias produces fluent claims about features you've never fetched a doc for.
- **Cross-framework imports.** When a surface looks React-shaped, React semantics leak in. (`@key` is not a thing here. Neither is `useEffect`-style cleanup.)
- **Symmetric-looking output.** Producing a tidy table that *looks* structured isn't the same as having reasoned through whether the structure makes sense.
- **Synthesis-narrowing.** When a topic has a clean sub-feature with one tidy synthesis and a messier dominant surface with multiple sub-concepts, the agent reaches for the clean one. The dominant surface is what users hit; the clean sub-feature is a footnote. The doc's structure resolves this every time.

The skill leans on **structural** defenses against these defaults, not behavioral exhortations:

1. **MCP gating** — you can't grep what you must fetch. The MCP-served directories (`docs/`, `ai/skills/`, `ai/research/`, `ai/plans/`) are off-limits to grep; whole-document fetches enforce thoroughness.
2. **Labeled claims** — every assertion in your intent doc must carry a `[label]`. An unsourced claim shows up as an *empty label slot*, which is the trip-wire: stop, verify, or strike the claim.
3. **Common-path-first ordering** — sketches lead with the typical use case, surfacing the load-bearing tests where they belong.
4. **Source-after-intent rule** — once you've read implementation, you can't un-read it. The labeled intent is built first.

These structural defenses only work if you actually use them. The Detective's Method below isn't a checklist of polite suggestions; it's a guard rail.

---

## Grounded vs. Red-Team: Same Space, Different Orientation

Grounded-testing and `red-team-testing` operate on the same testable surface — both produce tests, both care about user-facing behavior. The difference is **orientation**:

- **Grounded-testing** *uncovers what to test* from documented intent. You start from docs/examples/skills/plans, build a labeled understanding of the contract, and sketch tests that verify it. You cover the surface that the user-facing doc covers, in proportion to how the doc covers it.
- **Red-team-testing** *questions and fills in*. It runs against the existing test surface and asks: where are the gaps? Which cases didn't the feature agent think about? It's frequency-scored to prioritize edge-case findings.

### The doc IS the priority order

When the user prompt names a topic ("events," "loops," "reactivity"), the canonical user-facing doc for that topic *is* the priority specification. Read it top-to-bottom. Whatever the doc:

- **leads with** is the most common path
- **dedicates the most space to** is the dominant pattern
- **shows the most code examples for** is what users will write
- **covers in subsections** are first-class features within the topic
- **mentions in passing or under "Inside Templates" / "Advanced"** is secondary

A feature that occupies ten lines and one subsection of a doc that runs three hundred lines is **not** the common path, no matter how clean its synthesis is. If the feature you're considering scoping to occupies 5% of the doc, you've narrowed too far.

**Concrete rule:** before deciding scope, read the primary user-facing doc straight through, in order. Then your scope must mirror the doc's coverage in rough proportion. If the doc gives 80% of its body to surface A and 20% to surface B, your test sketch covers both — not one.

### Edge cases inside that scope

When you discover an edge case during grounded-testing:

- **Documented contract** → include in the sketch (it's part of the bullseye)
- **Real edge case, broad impact** → consider including; lean toward inclusion if severity is high
- **Real edge case, narrow impact** → flag for red-team
- **Purely synthetic (no real user would observe)** → note and skip

These are judgment calls. There is no numerical partition between this skill and red-team.

---

## When to Use This Skill

Use whenever you're writing tests for behavior with any user-facing surface:

- Template syntax (helpers, modifiers, expression dialects, `{#each}` reconciliation)
- Event DSL keywords (`deep`, `global`, `bind`)
- Component lifecycle and `defineComponent` parameters
- Signal/Reaction methods and options
- Query methods
- Public spec and helper APIs
- Documented build/SSR/CDN behavior

And ESPECIALLY when given an open-ended request like *"fill in the testing gap in templating"* or *"add more tests for X"*. That's the request shape this skill exists to handle.

---

## MCP-First Discipline

You build the witness pool through the **Semantic UI MCP server**, not by reading directories. MCP enforces what grep cannot: every fetch returns the *whole document*, and every `get_*` response includes a `related` field pointing at connected content. You build the pool by following relations until saturated. **Curated directories are off-limits to grep** — agents who grep `docs/` or `ai/skills/` miss the connective tissue (callouts, sibling concepts, contrast examples) that defines the contract.

### Read the primary doc top-to-bottom — first, in order

Before any batch-fetching or `related`-following, identify the canonical user-facing doc for the topic the prompt names ("events" → `guides/components/events`; "loops" → `guides/templates/loops`; etc.) and read it straight through. **The doc's structure encodes priority** — what it leads with, the volume of body it dedicates to each subsection, the number of code examples per topic, are all signals you need before deciding scope.

```
list_user_docs()                                — find the canonical doc for the topic
get_user_doc("guides/components/events")        — READ TOP TO BOTTOM, IN ORDER
```

If you skip this step and jump straight into `search` + batch-fetch + follow-related, you lose the doc's priority signal. You'll have all the same content but no sense of what's leading and what's tucked into a subsection. That's how scope decisions get made backwards.

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
  — Batch-fetch examples. Look at contrast examples (without the feature
    you're testing) too — they show what default behavior is.

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

### Plans — what's in flight

```
ls ai/plans/                    — index of active and recent plans
Read("ai/plans/<plan>.md")     — read whole; plans describe in-flight features
                                  (the explicit-keys plan would have caught the
                                  "@key doesn't exist" hallucination immediately)
```

Plans are part of the witness pool when behavior is in flux or when a feature you're testing has a stated direction beyond what's currently shipped. Read whole, no grep on `ai/plans/`.

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

### Source code rules

Implementation files (`packages/*/src/`):

- **Read whole files** when learning a feature's shape, when the user names a file, or when verifying intent.
- **Grep for known symbols** (e.g., `grep -n "getItemID" packages/renderer/src/engines/native/blocks/each.js`) when you already understand the file shape and need a specific definition. Source grep is legitimate and often the fastest path.

### Forbidden moves

```
❌  grep -r "deep" docs/
❌  grep -r "boundary" ai/skills/
❌  grep on ai/plans/ or ai/research/
❌  Reading one MCP doc and stopping (ignoring `related`)
❌  Reading source before building labeled intent (contaminates the trace)
❌  Asserting a feature exists or behaves like its analogue in another framework

✅  search("deep event binding") then batch-fetch the hits, then follow `related`
✅  Read the whole template.js when investigating event mechanics
✅  grep -n "getItemID" packages/.../each.js when you know the symbol
```

---

## The Detective's Method

You are a detective. Every source is a witness with bias and incomplete information. Truth emerges from triangulation, not from any single source.

### 1. Build the witness pool

**Step 1a — Read the canonical user-facing doc top-to-bottom, first.** Identify it from the prompt's topic (events → `guides/components/events`, etc.) and read it in order before doing anything else. The doc's structure tells you what the priority order is. **Do not skip this** — the rest of the witness pool fills in around it.

**Step 1b — Follow the trail.** With the priority order clear, expand:

- **User-facing docs** — what was promised
- **API reference pages** — params, types, returns
- **Examples** — patterns the docs encourage, including contrast cases. Look at every example tagged with the topic; volume of examples per pattern is a usage signal.
- **Authoring/contributing skills** — subtle rules, internal patterns
- **Plans** (`ai/plans/*.md`) — in-flight features, planned syntax, design constraints. **Always run `ls ai/plans/`** even when no plan seems relevant; an unread plan is a known failure mode.
- **Source** (whole file) — what the implementation does today
- **Recent commits** — `git log <file> | head -20` if behavior may have changed recently

### 2. Read every witness skeptically

Each kind of witness lies in characteristic ways:

| Witness | How it can mislead |
|---|---|
| Docs | Lag behind code; aspirational; vague language; oversimplified examples |
| Examples | May reflect old patterns; may not show contrast cases |
| Authoring skills | Often partial (covers one part of a feature, not all of it) |
| Plans | Describe intended behavior, not necessarily shipped behavior |
| Source | May have bugs; may not implement what was intended; comments may be stale |
| Recent commits | Author-perspective; may omit subtle behavior changes |

No single witness is authoritative. Drift between any pair is the norm.

### 3. Articulate intent with labeled moves

Don't write a paragraph saying "the feature does X." Build the intent claim by claim, **labeling the source of each claim**. The labels make your reasoning auditable, and force discipline — you can't smuggle a guess in as a doc claim, because there's no label for it.

| Label | Meaning |
|---|---|
| `[doc]` | Direct quote or paraphrase from a user-facing doc page |
| `[example]` | Pattern shown in a code example |
| `[skill]` | Claim from an authoring/contributing skill |
| `[plan]` | Claim from a plan file (`ai/plans/*`) — note this is intended, not necessarily shipped |
| `[inference]` | Logical step from existing claims (e.g., "keyword exists to modify default → absence implies inverse") |
| `[synthesis]` | Unified mental model abstracted from multiple claims |
| `[source]` | Behavior observed in the implementation |
| `[contradiction]` | Two witnesses disagree |

**The empty label slot is a trip-wire.** When you find yourself writing a confident assertion and no label fits — *that is the signal*. The claim is a prior, not a fact. STOP and verify via MCP, or strike the claim. The `@key` failure that prompted this skill's revision was an empty-slot moment that was not respected: a confident assertion (`@key` is the keying syntax) with no `[doc]`, no `[example]`, no `[skill]`, no `[source]` to back it. Just an unlabeled prior from React.

The `[synthesis]` move is where testing gets powerful. Once you've named the unifying mental model — "boundary escape control," "heuristic-keyed reconciliation," "structural equality" — you can derive cases the docs never enumerated. The synthesis predicts behavior; the test verifies the prediction.

### 4. Trace common paths through the synthesis

Walk concrete cases through your model and write down what you expect — **leading with the cases the typical user will encounter.** "Typical user" is anchored to the doc's structure (Step 1a), not your own sense of what's clean.

**Scope must mirror the doc's coverage in rough proportion.** If the canonical doc gives 80% of its body to surface A and 20% to surface B, your test sketch covers both, with weight A:B ≈ doc's. If you find yourself scoping to a sub-feature that occupies <10% of the doc, stop — you've narrowed too far. Reread the doc; pick the dominant surface; widen.

For `deep` synthesized as "boundary escape control":
- Click on own-template element matching selector → fires (every author hits this)
- Click on slotted content matching selector, default → does NOT fire (the safety contract — every consumer hits this)
- Click on slotted content, deep → fires (every author who uses `deep` hits this)
- Click in nested child shadow DOM, default → does NOT fire (safety again)
- Click in nested child shadow DOM, deep → fires

(Note: this worked example is intentionally narrow because the prompt was about *one keyword* — `deep`. If the prompt had been "events," the scope would expand to cover the whole events surface in the doc's proportion.)

If a case feels purely synthetic — no real user would observe it — flag it for red-team and don't include in the sketch.

### 5. Read source as verification, not authority

You read source AFTER the labeled intent is built. **Compare; don't update silently.** Where source agrees with your trace, your understanding is reinforced. Where source disagrees, mark `[contradiction]` and let the test arbitrate (or, for clearly-edge disagreements, flag for red-team or doc cleanup and move on).

The order is intent → source → test → user (when needed). Never source → test → intent — that's the failure mode this skill prevents.

### 6. Tests as arbiter

Tests aren't confirmations. They're decisions. When trace and source disagree on a documented contract, the test outcome decides what the codebase actually promises:

- **Test passes when you expected fail** → your trace missed nuance. Update the trace; reflect on what you missed; the test guards future regressions.
- **Test fails when you expected pass** → your trace was right; the implementation diverges. The test catches a real bug.
- **Test passes when you expected pass** → trace and source agree. Test guards future regressions.

Both pass and fail teach. **Never silently rewrite an expectation to match what the code returned.**

### 7. Surface only when it matters

When a test outcome contradicts your traced expectation in a way that affects the contract — stop and surface before locking the test. The trigger is **contract ambiguity**, not numerical frequency: ask yourself, *"would a downstream developer be confused or surprised if it shipped this way?"*

- **Yes, on a documented behavior** → surface to the user; they decide whether to fix code, fix docs, or both
- **Yes, on something docs don't speak to but users will reasonably expect** → surface, framed as "this isn't documented but here's what users will assume"
- **No — disagreement is about something docs don't speak to and users won't reasonably notice** → flag for red-team or doc cleanup; don't escalate

When the threshold is met, surface in plain user terms, citing what doc/skill/plan grounded the expectation:

> "I traced from the events guide that without `deep`, slotted content does NOT trigger handlers — that's the safety contract. Test confirms. Source agrees. No surface needed.
>
> Separately: source filters out `isDeep=true` events for default-mode handlers, so a default-mode handler can never observe `isDeep=true`. A default-mode developer would have no reason to read `isDeep` (the parameter is meaningful only when escape is opted into) — flagging as a doc-cleanup item, not a grounded-testing surface."

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

### Synthesis-narrowing — the canonical methodology failure

"Pick the cleanest synthesis" is **not** the rule. The canonical failure mode of this skill is an agent who reads the doc, sees a multi-section topic, picks the smallest sub-section because its synthesis is cleanest or its coverage gap is most acute, and produces a methodologically tidy report on ~5% of the surface. Tidy report, useless test push.

Recognize this when:
- You're about to scope to a sub-feature occupying <10% of the canonical doc
- Your justification is "the synthesis is cleanest here" or "the gap is most acute here"
- The dominant doc surface has multiple sub-concepts (delegation, modifiers, lifecycle, etc.) and you'd have to write multiple `[synthesis]` lines instead of one

The fix: widen. The synthesis can be plural. Multiple `[synthesis]` lines for a multi-section topic is normal — one per major sub-concept the doc highlights. The methodology serves the test push, not the other way around.

### Cross-framework priors

Don't assume a feature exists or behaves a certain way based on similar frameworks (React, Vue, Svelte, Lit). The repo has genuinely novel features that look superficially similar but aren't:

- **React's `key={...}` for keyed list rendering** → here, `{#each}` reconciles via a heuristic chain (`_id || id || key || hash || _hash || value || index`); `key` is also the iterator variable for object iteration. Explicit user-controlled keying is a planned feature with `key=expression` syntax (not `@key`).
- **React's `useEffect` cleanup** → here, callbacks use AbortController auto-cleanup tied to component lifetime.
- **Vue's `:key` / Svelte's `{#each items as item (key)}`** → not present; see the heuristic above.
- **`@`-prefixed syntax** → reserved for events (`@click={fn}`); not generic markup metadata.

The failure mode: a confident claim about a feature with no `[doc]`, `[example]`, `[skill]`, or `[source]` label. The empty label slot IS the signal. STOP and verify via MCP before proceeding.

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

### Symmetric-looking structure substituting for reasoning

Producing a tidy table or numbered list isn't the same as having reasoned through whether the structure maps to anything real. (The frequency-band table that previously sat in this file imported red-team's internal scoring and pretended it partitioned skills — it didn't, and the symmetry made the error harder to see.) When you're tempted to produce a clean partition, ask whether the partition reflects a real division or just looks like one.

### Ignoring the changelog

Behavior may have changed recently. A doc that says X for a feature whose implementation just changed to Y is the most common drift in active codebases. Skim recent commits when the witness pool feels thin or the docs feel stale.

---

## Worked Example: The `deep` Event Keyword

End-to-end execution of the method.

### Step 1 — Witness pool (via MCP)

```
search("deep event binding")
get_user_doc(["guides/components/events", "guides/templates/slots", "guides/query/shadow-dom"])
get_example(["event-binding", "template-event-handlers", "global-events", "event-data"])
get_context("authoring/component-events")
ls ai/plans/   — none touching event DSL
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

### Step 5 — Sketch tests (common path leads)

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
> Separately: source filters out `isDeep=true` events for default-mode handlers, so a default-mode handler can never observe `isDeep=true`. A default-mode developer would have no reason to read `isDeep` (the parameter is meaningful only when escape is opted into). Doc-cleanup item, not a grounded-testing surface.

---

## When to Surface vs. Just Document

| Situation | Action |
|---|---|
| Test outcome contradicts a documented contract | Surface — user decides whether to fix code, fix docs, or both |
| Test outcome reveals undocumented behavior users would reasonably expect | Surface — frame as "not documented but here's what users will assume" |
| Authoring skill is partial; user-facing doc is accurate | Note in PR; offer to align the skill |
| Disagreement is about an edge case the docs don't speak to | Flag for red-team or doc cleanup; don't escalate |
| Mechanical drift (param naming, internal vocab) | Below threshold; ignore |
| Trace expectations all met by source | Write tests; no surfacing needed |

The surface threshold is **contract ambiguity that affects user expectations**, not just any disagreement.

---

## Tests Before Source vs. After

The strongest version is TDD-flavored: build the labeled intent, sketch tests, *then* write implementation against the spec.

Most work in this repo is brownfield. Same discipline applies:

- **Greenfield (TDD):** Build labeled intent → sketch tests → write code → tests are the spec.
- **Brownfield (existing code):** Build labeled intent from MCP-fetched docs/examples/skills/plans *first*, including inference moves → read source as verification → run tests as arbiter → surface contradictions that affect contract.

The rule both ways: **labeled intent precedes source reading.** If you read source first, the trace is contaminated.

---

## Relationship to Other Skills

| When... | Use... |
|---|---|
| You're uncovering what to test from documented intent | **`grounded-testing`** (this skill) |
| You're questioning existing tests, finding gaps, hunting edge cases | `red-team-testing` |
| You need test mechanics — environments, Vitest, file placement | `testing` |
| You need test infrastructure — configs, CI, coverage | `testing-internals` |

`grounded-testing` and `red-team-testing` operate on the same testable surface. The orientation differs: this skill establishes the test plan from documented intent (uncovers); red-team questions the plan and fills in gaps (hunts). Together they form the test-design loop.

`testing` and `testing-internals` are about how to *run* tests. Load `grounded-testing` first when you're designing tests; load `testing` alongside it when you're translating sketches into runnable Vitest files.

---

## Quick Reference

**The orientation:** every test answers — *"what user-visible behavior would I notice regressing if this test failed?"*

**MCP-first witness pool (curated directories — never grep):**
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
ls ai/plans/ + Read(plan)                       — in-flight features
```
Follow `related` until no new material appears. **Never grep `docs/`, `ai/skills/`, `ai/research/`, `ai/plans/`.**

**Source:** `Read` whole files when learning shape or when the user names a file. `grep` for known symbols when you already understand the file shape.

**Labels:** `[doc]`, `[example]`, `[skill]`, `[plan]`, `[inference]`, `[synthesis]`, `[source]`, `[contradiction]`. Every claim in your intent doc carries one. **An empty label slot is a trip-wire** — STOP, verify via MCP, or strike the claim.

**Cross-framework priors are forbidden.** If a claim feels confident but you can't label it, it's a React/Vue/Svelte/Lit prior leaking in. Verify via MCP before proceeding.

**The synthesis:** name the unifying mental model in one sentence ("`deep` controls whether events escape the component boundary"). Synthesis lets you derive cases the docs never enumerate.

**Test as arbiter:** when trace and source disagree on a documented contract, the test decides. Pass-when-expected-fail teaches; fail-when-expected-pass catches drift; both productive. Never silently rewrite expectations.

**Surface trigger:** contract ambiguity that affects user expectations. Doc-vs-source disagreement on documented behavior → surface. Edge-case disagreement docs don't speak to → flag for red-team or doc cleanup.

**Common path first** is anchored to the canonical user-facing doc's structure. Read the doc top-to-bottom before scoping. Scope must mirror doc coverage in rough proportion — leading section ≫ trailing subsection. If you're scoping to <10% of the doc's content, you've narrowed too far.

**Grounded vs. red-team:** same space, different orientation. Grounded uncovers what to test from documented intent. Red-team questions and fills gaps in coverage. No numerical partition between them.

**The canonical anti-pattern:** "fill in the testing gap" → all-green tautological tests. Counter with the orientation question.
