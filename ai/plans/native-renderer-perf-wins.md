# Native Renderer — Perf Wins

> Three small, low-risk changes that survived the comparative review's rater pass *and* the fresh-take re-verification. Each lands independently. Together they form one shippable bundle.
>
> Source review path: `~/lit/packages/lit-html/src/lit-html.ts` for cache layer and walker pattern; `~/lit/packages/lit-html/src/directives/unsafe-html.ts` for the dirty-check pattern. SUI source paths inline.
>
> **Source-of-truth audit trail:** the verdicts and code citations in this plan were established by `ai/workspace/artifacts/native-renderer-quick-wins-review.md`. The original (less-grounded) plan that this consolidates from is archived at `ai/workspace/plans/archive/native-renderer-quick-wins.md`.

---

## Outcome

Three local edits inside `packages/renderer/src/engines/native/`:

1. **Collapse `templateCache` into `buildStringCache`** (Option A — keep a string cache for the unsafeHTML callsite). One Map lookup per render on the hot AST-driven path.
2. **Module-scoped TreeWalker** (3 hot call sites). Eliminates per-render walker allocation. Direct Lit-pattern parity.
3. **`unsafeHTML` dirty-check.** Skip HTML reparse + DOM swap when the value hasn't changed. **Highest-impact item by far** — ~10,000× savings ratio on hot reactive HTML.

All three preserve observable behavior — no test changes required.

---

## Why now

These three are the residual quick wins from `lit-comparative-renderer-review.md` after both the rater pass and the fresh-take re-verification pruned items with correctness regressions or specification gaps. They're independent of FGR work and independent of the expression-block-unification refactor.

Item 3 alone justifies the bundle. Items 1 and 2 are architectural cleanups that pair well — they touch the same `renderer.js` neighborhood and ship cleanly together.

---

## Item 1: Collapse cache layers (Option A)

### Verdict — ACCEPT WITH MODIFICATIONS

Cache collapse is sound for the AST-driven path (`readAST` callsite). It cannot apply to the unsafeHTML callsite, which keys by user-runtime string content with no AST identity. Keep a string-keyed cache in some form for that branch.

### Current code

`renderer.js:32-50` declares two caches:

```js
const templateCache = createCache({ maxSize: 1000, eviction: 'flush' });   // string → <template>
const buildStringCache = new WeakMap();                                       // ast → { html, svg }
```

`renderer.js:175-195` consumes both via `parseHTML`:

```js
parseHTML(htmlString, isSVG = false) {
  const cacheKey = isSVG ? `svg:${htmlString}` : htmlString;
  let cached = templateCache.get(cacheKey);
  if (!cached) { /* allocate <template>, populate, set */ }
  return cached.content.cloneNode(true);
}
```

Two Map lookups per render on the AST-driven path: one in `cachedBuildHTMLString`, one in `parseHTML`.

### `parseHTML` consumers — both real

`grep -rn "parseHTML" packages/renderer/src/engines/native/`:

- `renderer.js:155` — `readAST` (Phase 2). HTML string is derived from AST via `cachedBuildHTMLString`. **Cacheable by AST identity.**
- `reactive-data.js:138` — `bindTextExpression` (unsafeHTML, fresh path). Receives `String(value)` from a user signal. **No AST identity.**
- `reactive-data.js:188` — `hydrateTextExpression` (unsafeHTML, hydrate path). Same shape.

The original plan's framing "Bind sites in `readAST` already have the entry available" elided that two of the three call sites do not. The unsafeHTML branch is keyed on opaque user content; the only valid key is the string itself.

### `templateCache` semantics (verified)

`packages/utils/src/cache.js:22-140`. `createCache({ maxSize: 1000, eviction: 'flush' })` is **flush-bounded, not LRU**. On `set` when `store.size >= maxSize`, `evict()` calls `cache.clear()` (lines 104-107). All entries dropped at once. The original plan called it "LRU bounded" — that's wrong; the prose was right ("memory ceiling") but the strategy mislabel matters because flush behavior is much more catastrophic than LRU under saturation.

For SUI's normal usage (hundreds of components × one template each = hundreds of unique strings), the limit is rarely hit. For unsafeHTML on user content, hitting the limit is more plausible (e.g., a user pasting many distinct HTML chunks).

### What changes

Two-track cache: AST-keyed slot for the readAST path; string-keyed cache retained for unsafeHTML.

```js
// renderer.js
const buildCache = new WeakMap();   // ast → { html, svg }; each slot { htmlString, entries, template }

// Retained for unsafeHTML user-string path.
const unsafeHTMLCache = createCache({ maxSize: 1000, eviction: 'flush' });

function cachedBuildHTMLString(ast, options) {
  let entry = buildCache.get(ast);
  if (!entry) buildCache.set(ast, entry = { html: null, svg: null });
  const slot = options.isSVG ? 'svg' : 'html';
  if (entry[slot] === null) {
    const result = buildHTMLStringPure(ast, options);
    const template = parseHTMLString(result.htmlString, options.isSVG);
    entry[slot] = { ...result, template };
  }
  return entry[slot];
}

readAST({ ast, data, scope, isSVG = this.isSVG }) {
  const slot = cachedBuildHTMLString(ast, { snippets: this.snippets, isSVG });
  if (!slot.htmlString && slot.entries.length === 0) return document.createDocumentFragment();
  const fragment = slot.template.content.cloneNode(true);
  this.bindMarkers(fragment, slot.entries, data, scope, ast);
  return fragment;
}

// parseHTML for unsafeHTML branch — string-keyed (unchanged in behavior)
parseHTML(htmlString) {
  let cached = unsafeHTMLCache.get(htmlString);
  if (!cached) {
    cached = document.createElement('template');
    cached.innerHTML = htmlString;
    unsafeHTMLCache.set(htmlString, cached);
  }
  return cached.content.cloneNode(true);
}
```

### Lit analog

`~/lit/packages/lit-html/src/lit-html.ts:687-688`:

```ts
const templateCache = new WeakMap<TemplateStringsArray, Template>();
```

Single template cache keyed on the frozen `TemplateStringsArray`. Lit has no second cache because there's no other identity to key on. SUI's AST is the structural equivalent of TSA — immutable, identity-stable post-compile, fine as a WeakMap key.

Lit doesn't face the unsafeHTML problem at this level because Lit's unsafeHTML directive (`~/lit/packages/lit-html/src/directives/unsafe-html.ts`) returns a value that flows through Lit's normal Part placement; the parsing happens inside the directive's own caching scope. SUI's two-track approach is the right adaptation given the architectural difference.

### Performance profile

- **Direction:** faster, but barely measurable.
- **Magnitude:** ~30–100ns saved per `readAST` (one Map.get + cache key string concat avoided).
- **Krausest 1k-row:** ~30–100μs total. Below tachometer noise floor (~1ms reporter resolution).
- **Where it shows:** mount-heavy benches with many distinct templates. None of SUI's existing benches stress this.
- **Where it's invisible:** everywhere user-visible.
- **Architectural value > perf value.** Ship for the cleanup, not the metrics.

---

## Item 2: Module-scoped TreeWalker

### Verdict — ACCEPT

Direct Lit-pattern parity. Reentrancy invariant is real but documented-not-guarded matches Lit's own choice.

### Current code

Three sites in `renderer.js` allocate a fresh walker per call:

- `renderer.js:218-221` — `bindMarkers`
- `renderer.js:359-360` — `hydrateMarkers`
- `renderer.js:412-415` — `hydrateAttributes`

Three walker allocations per render+hydrate cycle.

Two additional walker call sites exist in `packages/component/src/engines/native/base.js:103, :175` (`canHydrate`, `removeMarkers`). One-shot per lifecycle, not worth cross-package extract; out of scope for this item.

### What changes

Hoist module-level walkers, reset `currentNode` per use, restore to `document` after.

```js
// renderer.js — module scope
const SHARED_WALKER = document.createTreeWalker(
  document, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT,
);
const SHARED_COMMENT_WALKER = document.createTreeWalker(
  document, NodeFilter.SHOW_COMMENT,
);

// In bindMarkers / hydrateMarkers / hydrateAttributes:
SHARED_WALKER.currentNode = root;
let node;
while ((node = SHARED_WALKER.nextNode())) { ... }
SHARED_WALKER.currentNode = document;   // release tree reference
```

### Reentrancy invariant (corrected from original plan)

Original plan said "Phase A may not recursively use the walker" — too strict. The actual invariant per the reviewer:

> **Phase A walker iteration must complete before any work that recursively invokes `bindMarkers` runs.**

`bindMarkers` Phase A iterates the walker. Element-attribute bindings register via `scope.reaction(...)`; the Reaction body just writes attributes, no recursion.

Phase B iterates a materialized array (`renderer.js:272`), not the walker. Block.render → renderAST recursion is safe even though it clobbers `walker.currentNode`, because Phase B has already snapshot the comment list before any recursion happens.

Documenting the invariant via comment at the walker hoist site is sufficient. Lit ships without a reentrancy guard either — `~/lit/packages/lit-html/src/lit-html.ts:1106-1108` has Lit's own comment explaining why a guard isn't worth it.

### Lit analog

`~/lit/packages/lit-html/src/lit-html.ts:730-733`:

```ts
const walker = d.createTreeWalker(
  d,
  129 /* NodeFilter.SHOW_{ELEMENT|COMMENT} */
);
```

Module-scoped, reused via `walker.currentNode = ...` at call sites. `_clone` resets `walker.currentNode = d` at end (`lit-html.ts:1263`); `Template` constructor explicitly does NOT reset (`lit-html.ts:1106-1108`, with a comment explaining the choice).

Same pattern, same trade-off.

### Performance profile

- **Direction:** faster, but bench-invisible.
- **Magnitude:** ~200–400ns saved per `createTreeWalker` allocation.
- **Krausest 1k-row:** ~300μs total. Visible in microbench, drowned in tachometer.
- **Where it shows:** mount-heavy benches with many small fragments (`each` block expanding 1000 items, each a small per-row fragment).
- **Where it's invisible:** everywhere with tachometer-grade tools.
- **Architectural value:** matches Lit's pattern, removes per-render allocation. Ship as cleanup.

---

## Item 3: `unsafeHTML` dirty-check

### Verdict — ACCEPT

This is the only one of the three with a measurable user-visible payoff.

### Current code

`packages/renderer/src/engines/native/reactive-data.js:129-143`:

```js
if (exprNode.unsafeHTML) {
  const anchor = document.createTextNode('');
  comment.replaceWith(anchor);
  const ownedNodes = [];
  scope.reaction(anchor, () => {
    for (const n of ownedNodes) { n.remove(); }
    ownedNodes.length = 0;
    const value = renderer.lookupExpression(exprNode.value, data);
    if (value != null && value !== '') {
      const parsed = renderer.parseHTML(String(value));
      const nodes = [...parsed.childNodes];
      anchor.after(parsed);
      ownedNodes.push(...nodes);
    }
  });
}
```

Each Reaction fire reparses HTML and swaps owned nodes — even when the value hasn't changed.

### What changes

Cache last value in the closure; skip when equal.

```js
if (exprNode.unsafeHTML) {
  const anchor = document.createTextNode('');
  comment.replaceWith(anchor);
  let ownedNodes = [];
  let lastValue;
  scope.reaction(anchor, () => {
    const value = renderer.lookupExpression(exprNode.value, data);
    if (value === lastValue) return;
    lastValue = value;
    for (const n of ownedNodes) { n.remove(); }
    ownedNodes = [];
    if (value != null && value !== '') {
      const parsed = renderer.parseHTML(String(value));
      ownedNodes = [...parsed.childNodes];
      anchor.after(parsed);
    }
  });
}
```

Same change applies to `hydrateTextExpression`'s unsafeHTML branch at `reactive-data.js:166-194`.

### Lit analog

Lit dedupes at three layers (per the reviewer's verification):

1. **Inside the directive itself** — `~/lit/packages/lit-html/src/directives/unsafe-html.ts:45` short-circuits when the value matches the cached previous value. **This is the dominant short-circuit.**
2. **At the part level** — `~/lit/packages/lit-html/src/lit-html.ts:1474-1477` dirty-checks `value !== this._$committedValue` before committing.
3. **Inside the SUI Lit-engine wrapper** — `engines/lit/directives/reactive-data.js:131-133` returns the directive result, which Lit's framework dedupes via the part.

The originally-cited Lit dirty-check at `lit-html.ts:1474-1477` is real but secondary. The architectural equivalent of Lit's primary short-circuit is exactly what Item 3 proposes: a closure-level dirty-check inside the binding that handles unsafeHTML specifically.

### Performance profile

- **Direction:** dramatically faster on the case where `value === lastValue`.
- **Magnitude saved per skipped fire:**
  - Skipped: `parseHTML` (cache hit: ~5μs `cloneNode`; cache miss: ~50–200μs `innerHTML` parse) + N owned-node removals + DOM swap. Total: ~30–200μs per skipped fire.
  - Added: 1 equality check (~5ns).
  - **Savings ratio: ~10,000× when value is unchanged.**
- **Where it shows:** any reactive `{#html}` binding whose Signal fires more often than the value actually changes. Common with derived signals (`Signal.computed`) where upstream Signals fire but the computed output stays stable.
- **Where it's invisible:** unsafeHTML bindings whose value genuinely changes every fire. Then the dirty-check pays its 5ns cost with no savings — but 5ns is in the noise.
- **No risk of false positive** (skipping a real change). String reference equality is value equality (strings are immutable in JS).

### Edge case (verified)

If `value` goes `'<b>x</b>' → null → '<b>x</b>'`: after the first transition, `lastValue = null`. The second transition sees `value !== null` and proceeds. Safe.

---

## Verification gates

### Per-item gates

**Item 1 (cache collapse):**
- Full SUI test suite passes.
- SVG-content tests pass — verify the dual `html`/`svg` slots work correctly.
- unsafeHTML tests pass — verify the retained `unsafeHTMLCache` path still dedupes.
- Specifically: `node-types.test.js:32-77, :285-330`, `html-output.test.js:514-530`, `ssr-hydration.test.js:1656-1687, :585-605`.

**Item 2 (module walker):**
- Full SUI test suite passes.
- Hydration tests pass (`hydrateMarkers` / `hydrateAttributes` use the same hoisting).
- Verify by inspection that no Phase A code path recursively enters the walker before Phase A completes.

**Item 3 (unsafeHTML dirty-check):**
- `{#html content}` tests pass — verify reactive content updates still propagate.
- Tests covering `null`/`undefined`/empty-string transitions pass.
- Test the cycle `value → null → value` to confirm dedup doesn't suppress real changes.

### Combined gate

All three: full SUI test suite green, no `slower` ≥ 5% in tachometer reporter against `main`. Item 3 should show measurably faster on any bench with reactive unsafeHTML re-rendering at unchanged values; Items 1 and 2 should be flat.

---

## Risks

### R1 (Item 1) — Dynamic AST construction unbounded

If any internal code path or user pattern dynamically constructs ASTs (e.g., template-as-settings with a fresh AST per call), the WeakMap cache grows unboundedly because the AST objects stay live as long as their owners do. Audit by grepping for `new TemplateCompiler` and checking if the result-AST is ever fresh-per-call.

**Mitigation:** keep the LRU bound semantics if audit finds dynamic construction; otherwise rely on WeakMap GC.

### R2 (Item 2) — Future Phase A recursion

A future contributor adds an inline `readAST` call from Phase A (e.g., to evaluate something during attribute binding setup). The walker's `currentNode` gets clobbered mid-iteration; outer iteration finds wrong nodes; bindings bind to wrong elements. Silent data corruption.

**Mitigation:** invariant comment at the walker hoist site. The reviewer noted Lit ships without a runtime guard either; comment-not-guard matches Lit's own choice.

### R3 (Item 3) — None identified

Reviewer confirmed: string equality is value equality, the `value → null → value` cycle is handled correctly, no interaction with `parseHTML`'s own cache (still a cache hit, just paid less often).

---

## What stays the same

- AST shape, compiler, every block, every other binding kind.
- `defineBlock`, `DynamicRegion`, `ReactionScope`.
- All non-unsafeHTML expression binding behavior.
- All hydration semantics.
- The `processedAttrIDs` Set in `bindMarkers` (orthogonal cleanup if pursued later).
- All existing tests (the changes are observably equivalent on the paths they preserve).

---

## Estimated scope

- **Files touched:** 2 (renderer.js, reactive-data.js).
- **LOC delta:** -10 to -20 net (cache restructure removes more than the walker change adds; Item 3 adds ~3 lines per branch).
- **Tests:** zero new.
- **Time:** half a session for all three.

---

## Ship order

Independent; ship in any order. Recommended:

1. **Item 3** first — biggest payoff, smallest blast radius, no architectural ripple.
2. **Item 2** second — one-line change once the invariant is documented.
3. **Item 1** third — slightly larger surface (touches cache wiring) but isolated to `renderer.js`.

---

## Open questions (not blocking)

- Whether `unsafeHTMLCache` should keep `eviction: 'flush'` or switch to true LRU semantics for the user-string case. Probably fine as-is given typical usage.
- Whether to ship the walker invariant guard (R2) in dev mode. Defer; matches Lit's choice.

## Dependencies

None — independent of FGR work, of expression-block-unification, and of defineblock-mount-cost.

Review trail: `ai/workspace/artifacts/native-renderer-quick-wins-review.md` (per-item verdicts grounded in source citations). Originating comparative review: `ai/workspace/artifacts/lit-comparative-renderer-review.md` (Items #3, #4, and the unsafeHTML sub-case of #5).

## Status

Scoped — three items, each with concrete code, verification gates, and Lit-source-grounded patterns. Ready to execute. Can ship as one PR or split (Item 3 standalone is the recommended decomposition for clean bench attribution).
