# Expression Block Unification

> Refactor plan. Native renderer's `expression` AST node is currently dispatched outside the block model via `reactive-data.js`'s three exports. This plan folds expression handling into the existing `defineBlock` + `registerBlock` primitive that all other AST node types use, by adding a framework-supplied **commit hook** that handles position-specific placement.
>
> **Status of contents.** Outcome / Why / Constraints sections are *recommendations* — the implementer may challenge them if a better approach surfaces. Verification gates are *fixed* — each step must pass its gate before the next ships.

---

## Outcome

Native renders every AST node type through one primitive: `getBlock(type)(bag)`.

Expression becomes a block named `'expression'`, registered alongside `if`, `each`, `async`, `rerender`, `template`. Its render is trivial — set up a Reaction, call `commit(compute())`. It doesn't know about positions.

The framework owns position-specific knowledge. `bindMarkers` constructs a `compute()` closure and a `commit(value)` closure based on `entry.classification` (the existing PartInfo facsimile, computed once by `buildHTMLString`'s `analyzePosition`). Closures are passed to the expression block via the bag. Classification stays internal to the framework.

After the refactor:
- `reactive-data.js` deletes.
- `bindAttribute`, `bindTextExpression`, `bindRawTextContent` no longer exist as separate functions.
- `bindMarkers` has one dispatch path: `getBlock(type)(bag)`.
- AST-to-block is 1:1 for every AST node type.
- Native's dispatch shape matches the Lit engine's `readAST` dispatch shape.
- The block author API is unchanged. `defineBlock` is not generalized. There is no "handler" abstraction.

---

## Why now

1. **The asymmetry is purely historical.** `reactive-data.js` predates the block model and has never been migrated. Every dispatch concern that block authoring solved (lifecycle, registry, recovery, hydration) is duplicated inside `reactive-data.js` and inside `bindMarkers`'s manual dispatch. There's no design reason for the duplication.

2. **The Lit engine already does this.** `engines/lit/renderer.js readAST` dispatches one block per AST type; expression maps to the `reactiveData` directive whose `getReactiveValue()` returns a value and lets Lit's framework place it via Part subclasses. Native is the outlier.

3. **Per-binding perf items have a canonical home.** Dirty-check (last-value compare), `toggleAttribute` for booleans, form-state property mirror — each lives in one `make*Commit` factory after this lands. Today they're scattered across branches inside `bindAttribute`.

4. **Future extension surfaces line up.** A user-facing directive layer (if ever pursued) plugs into `registerBlock` + a stable `commit(value)` contract. No new abstraction required.

---

## Constraints

**Preserve unchanged:**
- AST shape and node types (engine-agnostic invariant).
- `template-compiler.js` (no compiler changes).
- `engines/lit/` (Lit engine reads the same AST).
- `defineBlock` signature and behavior (region remains required for callers that pass it; expression block doesn't go through `defineBlock`-with-region).
- All existing block authors (`if`, `each`, `async`, `rerender`, `template`): zero file changes.
- All public behavior: every component template, every binding kind, every hydration adoption case must render identically.
- All existing tests must pass without modification.

**Out of scope:**
- New features, new directives, new AST node types.
- Performance optimizations not intrinsic to the unification (the seven recommendations from the comparative review are separate work; some become trivially easier post-refactor).
- Compiler changes.
- Naming changes (`defineBlock`, `registerBlock`).
- Generalizing `defineBlock` to make region optional. Expression block does not use `defineBlock`-with-region; it's a raw dispatch function registered the same way. Both authoring shapes coexist.

---

## Architecture

### The bag, before and after

For region-managing blocks (`if`, `each`, `async`, `rerender`, `template`) — **unchanged**:

```js
{ entry, node, data, scope, region, isSVG, serverMeta, hydrating,
  renderAST, lookupExpression, hydrateInnerContent, hydrateInto, self, ... }
```

For value-emitting blocks (`expression`, `rawText`) — **new shape**:

```js
{ entry, node, data, scope, renderer, hydrating,
  compute,    // () => value     (PartInfo-aware lookup, framework-supplied)
  commit,     // (value) => void  (position-specific placement, framework-supplied) }
```

Each block uses the half of the bag that applies to it. The framework decides which half to construct based on the entry's shape.

### Framework infrastructure

New module `commit-hooks.js` (or similar) with two factory entry points:

```js
// makeCompute({ entry, parts, entries, data, renderer }) → () => value
// Consumes entry.classification and entry.node flags to pick the right lookup:
//   - event-position OR entry.node.literalValue → lookupTokenValue (no auto-invoke)
//   - interpolated attribute (parts.length > 1)  → walk parts, join into string
//   - everything else                             → lookupExpression
```

```js
// makeCommit({ entry, node, parts, entries, scope, renderer, data }) → (value) => void
// Consumes entry.classification and entry.node flags to pick the right placement:
//   - text + unsafeHTML  → anchor + ownedNodes, parse + swap on each call
//   - text + literalValue → one-shot textNode
//   - text + default      → mutate textNode.data
//   - attribute property  → element[name] = value
//   - attribute event     → stable listener via closure-stored handler
//   - attribute boolean   → toggleAttribute + form-state property mirror
//   - attribute single    → setAttribute(name, formatAttr(value))
//   - attribute interpolated → setAttribute(name, value)  (value already joined by compute)
```

Each branch is a small factory returning a closure. Last-value dedup, `checked`/`selected`/`value` property mirror, anchor/ownedNodes management — all encapsulated in the relevant `make*Commit` branch.

### `bindMarkers` after

```js
bindMarkers(root, entries, data, scope) {
  if (entries.length === 0) return;

  const processedAttrIDs = new Set();
  const deferredComments = [];
  const walker = ...;

  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      for (const attr of node.attributes) {
        if (!attr.value.includes(ATTR_MARKER_PREFIX)) continue;
        const { parts, markerIDs } = parseAttributeParts(attr.value);
        for (const id of markerIDs) processedAttrIDs.add(id);
        const entry = entries[markerIDs[0]];
        dispatchValueBlock({ entry, node, parts, entries, data, scope, renderer: this, hydrating: false });
      }
    } else {
      deferredComments.push(node);
    }
  }

  for (const comment of deferredComments) {
    const text = comment.data;
    let id, key;
    if (isExpressionMarker(text))   { id = parseExpressionID(text); key = 'expression'; }
    else if (isRawTextMarker(text)) { id = parseRawTextID(text); key = 'rawText'; }
    else if (isBlockOpen(text))     { id = parseBlockOpenID(text); /* key from entry */ }
    else continue;

    if (key === 'expression' && processedAttrIDs.has(id)) continue;

    const entry = entries[id];
    if (key === 'expression' || key === 'rawText') {
      dispatchValueBlock({ entry, node: comment, data, scope, renderer: this, hydrating: false });
    } else {
      // Region-managing block — existing path
      const region = new DynamicRegion(comment.parentNode, comment);
      getBlock(entry.node.type)({ entry, node: comment, data, scope, region, isSVG: entry.isSVG, hydrating: false, renderer: this });
    }
  }
}

function dispatchValueBlock({ entry, node, parts, entries, data, scope, renderer, hydrating }) {
  const compute = makeCompute({ entry, parts, entries, data, renderer });
  const commit  = makeCommit({ entry, node, parts, entries, scope, renderer, data });
  const block = getBlock(entry.node?.type ?? entry.type);  // 'expression' or 'rawText'
  block({ entry, node, data, scope, renderer, hydrating, compute, commit });
}
```

### The expression block

```js
// blocks/expression.js
import { registerBlock } from './registry.js';

const expression = function expression({ entry, node, scope, compute, commit }) {
  // literalValue is one-shot — no Reaction
  if (entry.node.literalValue) {
    commit(compute());
    return;
  }
  scope.reaction(node, (comp) => {
    const value = compute();
    if (comp.firstRun && /* hydrating */ false) return; // detail handled inside commit
    commit(value);
  });
};

registerBlock('expression', expression);
```

That's the whole block. Compute and commit are the framework's; the block just runs the loop.

### The raw-text block

```js
// blocks/raw-text.js
import { registerBlock } from './registry.js';

const rawText = function rawText({ entry, node: comment, data, scope, renderer }) {
  let element = comment.previousSibling;
  while (element && element.nodeType === Node.TEXT_NODE) {
    element = element.previousSibling;
  }
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    comment.remove();
    return;
  }
  comment.remove();
  scope.reaction(element, () => {
    element.textContent = renderer.evaluateRawTextNodes(entry.nodes, data);
  });
};

registerBlock('rawText', rawText);
```

`rawText` is structurally simple enough that it doesn't benefit from the compute/commit split — it directly mutates `element.textContent`. The block is registered alongside expression for dispatch uniformity.

---

## File-level changes

### Added

```
packages/renderer/src/engines/native/
├── commit-hooks.js                # makeCompute, makeCommit factories — ~150 lines
└── blocks/
    ├── expression.js              # ~25 lines, just compute/commit loop
    └── raw-text.js                # ~25 lines
```

### Modified

```
packages/renderer/src/engines/native/
└── renderer.js                    # bindMarkers + hydrateMarkers route via getBlock; legacy methods deleted
```

### Deleted

```
packages/renderer/src/engines/native/
└── reactive-data.js               # content split between commit-hooks.js and blocks/{expression,raw-text}.js
```

### Untouched

- `define-block.js`
- `dynamic-region.js`
- `reaction-scope.js`
- `blocks/registry.js`
- `blocks/{conditional,each,async,rerender,template}.js`
- `engines/lit/`
- `compiler/`
- AST shape

---

## Steps

Each step is independently shippable, each leaves the codebase green, and each has its own verification gate.

### Step 1 — Add `commit-hooks.js`

**New:** `commit-hooks.js`. Define `makeCompute` and `makeCommit` factories. Each returns a closure. Logic ported verbatim from `reactive-data.js`'s branches, just reorganized as factories instead of dispatched-from-handler.

Particular care for:
- `makeUnsafeHTMLCommit`: anchor + ownedNodes + last-value dedup. Currently inline in `reactive-data.js:131-143`.
- `makeBooleanCommit`: `toggleAttribute(name, !!value)` + property mirror for `checked`/`selected`/`value` (preserves the form-state fallback at `reactive-data.js:81-92`).
- `makeEventCommit`: stable listener via closure-stored handler. `addEventListener` runs once in the factory; `commit(value)` just updates the stored handler. `scope.onDispose` removes.
- `makeAttributeStringCommit`: handles single-expression and `parts`-driven interpolation. `value` arriving in commit is already joined (compute does the part-walking); commit just `setAttribute(name, value)`.
- `makeTextCommit`: replaces comment with text node, mutates `textNode.data` on each call, last-value dedup.

**Not yet wired.** Module exists but no caller. Existing tests pass unchanged.

**Verification gate:** module compiles; no behavioral change.

### Step 2 — Add `blocks/raw-text.js` and route via registry

**New:** `blocks/raw-text.js`. Registers as `'rawText'` via `registerBlock`.

**Edit:** `bindMarkers` — comment marker matching `sui-rawtext:v1:` no longer calls `bindRawTextContent` directly; instead constructs the value-block bag and calls `getBlock('rawText')(bag)`.

**Verification gate:** existing tests covering `<script>`, `<style>`, `<textarea>`, `<title>` content rendering pass without modification.

### Step 3 — Add `blocks/expression.js` (text position only)

**New:** `blocks/expression.js`. Registers as `'expression'` via `registerBlock`. Initial body handles only the text-position case.

**Edit:** `bindMarkers` text-position comment dispatch (markers matching `sui:v1:`) — call `getBlock('expression')(bag)` with framework-constructed `compute` and `commit`. Attribute-position dispatch continues to call legacy `bindAttribute` directly during this step.

**Verification gate:** all text-expression tests pass (default, `unsafeHTML`/`{#html}`, `{#fn}` literal value), including hydration text-adoption (`ssr-hydration.test.js` server-text merge cases).

### Step 4 — Migrate attribute-position expressions

**Edit:** `bindMarkers` element-attribute path — replace direct `bindAttribute` call with `getBlock('expression')(bag)` using framework-constructed `compute` and `commit`.

This step relies entirely on the `make*Commit` factories from step 1. The expression block in `blocks/expression.js` doesn't need to change — its compute/commit loop already handles whatever the factories produce.

**Verification gate:**
- All attribute binding flavors render identically: property (`<x .foo=>`), event (`<x @click=>`), boolean (`<x disabled={x}>`), interpolated string (`<x class="a {x} b {y}">`), single-expression string (`<x value="{x}">`), `ifDefined`.
- Form-state attributes (`<input checked={isOn}>`, `<select value={selected}>`) update the DOM property after user interaction — the property-mirror fallback in `makeBooleanCommit` is load-bearing.
- Hydration adoption tests pass (`data-sui-bind` fast-path included).

### Step 5 — Unify `hydrateMarkers` dispatch

**Edit:** `hydrateAttributes` and `hydrateMarkers` in `renderer.js` — dispatch via `getBlock(...)({ ..., hydrating: true })`.

The hydration text-expression case has elaborate adoption logic (split server text node at value boundary at `reactive-data.js:200-217`). That logic moves into `makeTextCommit`'s hydrating branch, controlled by the `hydrating` flag in the bag (passed through commit-construction-time).

**Verification gate:**
- `ssr-hydration.test.js` passes in full.
- Mismatch-warning cases trigger correctly.
- `data-sui-bind` fast-path hydration unaffected.

### Step 6 — Delete `reactive-data.js`

After all callers migrated, delete the file.

**Edit:** `renderer.js` — drop now-dead methods on the Renderer class:
- `bindAttributeExpression`
- `bindTextExpression`
- `bindRawTextContent`
- `bindBlock`
- `hydrateTextExpression`

Drop now-dead imports. The dispatch in `bindMarkers` and `hydrateMarkers` is the only consumer of `getBlock` for value-blocks.

**Verification gate:** full test suite passes. No imports of `reactive-data.js` remain anywhere.

### Step 7 — Final verification

- Full browser test suite green on native engine.
- Lit engine tests unaffected (engine wasn't touched).
- Full hydration test suite.
- Bench against `main`: krausest, `bench-todo`, `bench-data-blob`, `subtemplate-*`. Tolerance: each metric within ±5% reporter verdict, no `slower` ≥ 5%.

---

## Verification gates summary

| Step | Gate |
|---|---|
| 1 | New module compiles; no behavioral change |
| 2 | Raw-text tests pass |
| 3 | Text-expression tests + text hydration pass |
| 4 | All attribute-binding flavors + form-state property mirror + attribute hydration pass |
| 5 | Full hydration suite passes |
| 6 | Full test suite passes; no `reactive-data.js` references remain |
| 7 | Cross-package full suite + perf gate |

Each step ships independently behind its gate. If a step's gate fails, prior steps stay shipped — no cross-step rollback needed.

---

## Risks

### R1 — Hydration text-adoption semantics drift

`hydrateTextExpression` has specific logic for splitting the server-rendered merged text node at the value boundary (`reactive-data.js:200-217`). Moving this into `makeTextCommit`'s hydrating branch must preserve the boundary-split behavior exactly.

**Mitigation:** copy the logic verbatim in step 1, with an inline comment marking it load-bearing. Verify against `ssr-hydration.test.js` text-merge cases.

### R2 — Closure construction allocation per binding

The `make*Commit` factories allocate one closure per binding at mount. For a 1000-row table × 5 expressions per row, that's 5000 closure allocations at mount. Each is small but compounds.

**Mitigation:** verify by bench at step 7. If material, factor common-case factories to share closure scope (e.g., a single `commit` function that reads from a small per-binding state object), eliminating per-binding closure allocation.

### R3 — Event commit's stable-listener pattern

The current `bindAttribute` event branch does `lookupTokenValue` on every event fire. The new `makeEventCommit` registers a stable listener that calls a closure-stored handler; commit just updates the stored handler. Behavior should be identical for stable handlers (instance methods); for handlers that change reactively per render, the new pattern updates the stored handler reactively rather than re-resolving on each event fire.

**Mitigation:** verify event-binding tests pass identically. Consider preserving the lookup-per-fire pattern if any test depends on it (probably none — the contract is "the handler from the data context is called" and both patterns satisfy that).

### R4 — `processedAttrIDs` Set retained semantics

The current `bindMarkers` uses `processedAttrIDs` to dedup attribute markers from the comment-walker pass. The refactor preserves this Set verbatim — it remains a `bindMarkers`-internal concern. Document that this is unchanged.

### R5 — `literalValue` is one-shot, not reactive

The expression block special-cases `entry.node.literalValue` to skip Reaction setup. This preserves today's one-shot behavior (`reactive-data.js:145-149`). Ensure the special-case branch fires before the generic Reaction path.

**Mitigation:** test coverage for `{#fn handler}` bindings. The literal value should not re-evaluate on data changes.

---

## What stays the same

- AST shape: identical. No new node types, no new fields on existing types.
- `template-compiler.js`: zero changes.
- `engines/lit/`: zero changes.
- `defineBlock` signature and behavior: unchanged.
- All existing block authors (`if`, `each`, `async`, `rerender`, `template`): zero changes — same registration, same bag.
- Hydration semantics: identical. SSR HTML output unchanged.
- Component-author API: every `defineComponent` call works unchanged.
- Test suite: no test changes required (refactor is observably equivalent).
- `processedAttrIDs` Set in `bindMarkers`: stays.
- `entry.classification` shape: unchanged. Computed by `analyzePosition` at `buildHTMLString` time. Now consumed only inside `make*Commit` and `make*Compute` factories — invisible to block authors.

---

## After the refactor

The seven recommendations from `lit-comparative-renderer-review.md` either dissolve or fold into the new structure:

| Item | Disposition |
|---|---|
| #1 entry-driven walker | Orthogonal — still applies if pursued |
| #2 forward-state scanner | Orthogonal — still applies if pursued |
| #3 cache collapse | Orthogonal — still applies |
| #4 module walker | Orthogonal — still applies |
| #5 dirty-check | Folds into `makeTextCommit` and `makeAttributeStringCommit` (last-value dedup is one line in each factory) |
| #6 toggleAttribute + form-state mirror | Lives in `makeBooleanCommit` (step 1 already handles this) |
| #7 WeakBlockRef | Orthogonal; `defineBlock`-side perf change doesn't conflict |

The refactor is the structural cleanup; the perf items become local edits inside specific factories.

A future user-facing directive layer (not currently planned) would extend `registerBlock` with a public alias and a stable `compute`/`commit` contract.

---

## Estimated scope

- **Files touched:** 1 modified, 3 added, 1 deleted.
- **LOC delta:** approximately net-neutral or slightly negative. `reactive-data.js` (~250 lines) splits into `commit-hooks.js` (~150 lines, more focused factories), `blocks/expression.js` (~25 lines), `blocks/raw-text.js` (~25 lines). `renderer.js` shrinks by ~80 lines (deleted methods + simplified dispatch).
- **New tests required:** zero. The refactor is observably equivalent; existing tests are the verification.
- **Time:** 1-2 focused sessions. Steps 1+2 are a session; steps 3+4 are a session; steps 5+6+7 fit in either.

---

## Open questions (not blocking)

- Naming: `commit-hooks.js` vs `commit-strategies.js` vs co-locating factories inside `renderer.js`. Defer.
- Whether `entry.classification` should be moved off the entry into the binding bag at construction time (visible only inside the framework). Defer — current placement on entry is adequate.
- Whether `makeCompute` and `makeCommit` should be merged into a single `makeBindingHooks({ entry, ... }) → { compute, commit }`. Defer — separation matches the conceptual split (compute = value lookup; commit = placement).

## Dependencies

None — independent of FGR work, of `expression-block-unification`'s own predecessors, and of the perf-wins / mount-cost bundles.

## Status

Scoped — design decisions made, implementation steps concrete, audit trail preserved. Ready to execute.

---

# Second-Reviewer Notes

> Cold read by a separate Claude session. Plan-author and reviewer are different agents. Surfacing concerns the plan-as-written either downplays or doesn't argue explicitly. Treat as adversarial review — reject anything that doesn't survive scrutiny.

## Verdict

Net negative at this point in the project. Architecturally clean idea, but the upside is mostly aesthetic and the perf risk is structural rather than peripheral. Flips to net positive if either of two things become true: (a) a user-facing directive system gets onto the roadmap (the `compute`/`commit` contract preempts that work), or (b) `reactive-data.js` becomes a recurring source of regressions (hydration adoption being the prime candidate).

## Where the plan understates risk

### The "no new abstraction" framing is wrong

The plan asserts there is no new "handler" abstraction. `compute()` / `commit(value)` IS a callback-pair contract. Renaming it to "factories" doesn't change what it is — the framework hands the block a pair of closures, the block invokes them, the contract is the new surface. Argue it as a contract, not as the absence of one. Two bag shapes, not one.

### R2 (closure allocation) is the load-bearing concern, not a side-channel

Today's `bindAttribute` / `bindTextExpression` / `bindRawTextContent` route through methods on the Renderer class. No per-binding closure allocation. The new factory shape allocates `makeCompute(...)` plus `makeCommit(...)` at every binding site at mount. For `bench-data-blob` (~100 bindings) × N records, that compounds. For each-block subtemplates, that compounds again per-record-mount.

The plan's mitigation reads "factor common-case factories to share closure scope (e.g. a single `commit` function that reads from a small per-binding state object)." That mitigation is "abandon the factory shape if it loses the bench" — at which point the architecture has been redesigned into the class-method dispatch it started from. The factory shape might not survive the perf gate.

**Recommended addition:** a Step 0 that ports a single representative factory (`makeAttributeStringCommit` is a good candidate) and benches it against today's class-method dispatch on `bench-data-blob`. Decision gate before steps 1-6 commit. If the cost per-binding is non-trivial, redesign the contract before any irreversible work.

### R3 (event commit) is a behavior change, not just a refactor

Today's path does lookup-per-fire — `lookupTokenValue` runs on every event. The new `makeEventCommit` registers a stable listener that calls a closure-stored handler that gets reactively updated. For a binding like `onClick={state.handler}` where `state.handler` is a Signal, the two patterns can diverge. Old: reads the current value at fire time. New: reads the value at last reactive flush.

Tests probably don't cover the divergence (the contract "the handler from the data context fires" satisfies both). But this is a real behavior change that should be a documented decision, not an emergent property of the refactor. Either preserve lookup-per-fire (different closure shape, slower fire path) or document stable-listener semantics as an intentional API change.

### Hydration text-adoption (R1) loses locality

The mitigation "copy verbatim with a load-bearing comment" is correct. But the seam moves from a method on the Renderer class to a closure branch inside a factory inside `commit-hooks.js`. For someone debugging an SSR adoption mismatch, the call stack got deeper and the relevant code is further from the dispatch site. Add a navigation comment at the dispatch in `bindMarkers` pointing at the exact file:line for the hydrating branch — without it, the seam is harder to find on a 2am debugging session than today's reactive-data.js layout.

## Where the plan overstates upside

### Item #4 (extension surface) is theoretical

"A user-facing directive layer (if ever pursued)" — directives aren't on the roadmap. Items #1-3 in §Why are real, item #4 is speculative. Don't sell the speculative win as load-bearing motivation. The honest framing is items #1-3.

### "After this lands" perf items dissolve too easily

The §After the refactor table sells items #5 (dirty-check) and #6 (toggleAttribute + form-state mirror) as folding into the new structure. Both ARE one-line additions inside `makeTextCommit` / `makeAttributeStringCommit` / `makeBooleanCommit`. So bundle them. The plan as-written defers them to "separate work," which means the refactor might land structurally with no measurable upside captured — worst-shape outcome (audit surface grew, perf flat).

**Recommended:** add Step 1.5 (or fold into Step 1) that includes #5 last-value dirty-check and #6 toggleAttribute mirror inside the new factories. Use the existing perf bench to demonstrate the captured win. If the win materializes, the refactor's case strengthens. If it doesn't, that's a useful signal too.

### Indirection trade isn't argued

Today's `reactive-data.js` is verbose but linear — top-to-bottom read, no contract layer, dispatch lives where it's invoked. The new shape splits one file into three (`commit-hooks.js`, `blocks/expression.js`, `blocks/raw-text.js`) plus modified `renderer.js`, and dispatch hops through a factory contract. For new contributors learning the renderer, the question is whether the symmetry-with-other-blocks gain offsets the call-stack-depth loss. Plan doesn't argue this trade-off — assumes symmetry is the dominant good. Worth being explicit.

## Recommended sequence if pursued

1. **Step 0 (new):** Port `makeAttributeStringCommit` factory in isolation, bench against today's `bindAttribute` string path on `bench-data-blob`. Decision gate. If allocation cost is material, abandon factory shape or redesign before any structural commits.
2. **Step 1:** Build `commit-hooks.js`, including the items #5 and #6 wins inside the relevant factories. The bench delta from those wins is the case for the refactor. If the bench is flat, reconsider whether the refactor pays for itself.
3. **Step 2-6:** As written.
4. **Step 7:** As written, but with explicit comparison against the Step 0 baseline — both individual benchmarks and aggregate.

## When this should ship

After the framework hits 1.0 OR after a directive system gets prioritized. Pre-1.0 with components 10/80 done and homepage not built, internal refactors compete with shipping capability. This refactor doesn't unlock anything users can see. The right time is when the framework's public surface is stable enough that internal cleanup is the marginal next step, not when there's a backlog of user-facing work that needs the same engineering hours.
