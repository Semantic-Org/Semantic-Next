# defineBlock — Mount-Cost Reduction

> Eliminate per-dispatch closure construction in `defineBlock`. Originally framed as a per-fire perf change (incorrectly); the reviewer corrected the framing — the closures are built once per block dispatch (mount or render-cycle), not on every Reaction fire. Still worth doing, just under the right banner.
>
> Source review path: `~/lit/packages/lit-html/src/directives/repeat.ts` for the parts-stable-across-update pattern; `~/lit/packages/lit-html/src/lit-html.ts` for ChildPart instance-field capture.
>
> **Source-of-truth audit trail:** the verdict, corrected framing, and code citations were established by `ai/workspace/artifacts/native-renderer-per-fire-perf-review.md` (Item B section). The original plan that this extracts from is archived at `ai/workspace/plans/archive/native-renderer-per-fire-perf.md`.

---

## Outcome

`defineBlock`'s dispatch path stops constructing 4 closures per block instance dispatch. Closures move to a per-Renderer-instance helper bound once at construction. Block authors call helper functions with explicit `data` / `scope` / `isSVG` arguments instead of relying on captured-in-closure state.

After the change:
- Mount-heavy workloads (krausest `create-1000`, `create-10000`, large `each` first-render) pay 4 fewer closure allocations per block dispatch.
- Block author API surface changes: `renderAST`, `lookupExpression`, `hydrateInnerContent`, `hydrateInto` become explicit-arg calls instead of partial-applied closures.
- No change to the steady-state per-Reaction-fire path. (Original plan misframed this as per-fire savings; reviewer corrected.)

---

## Why now

The reviewer caught that `define-block.js`'s closures (lines 78-96 — verified, original plan said 56-68) are constructed inside `dispatch(ctx)` but **only called from the block's hooks**. The dispatch runs once per block instance per render-cycle (mount, then per update), not once per Reaction fire. So the cost is mount-cost, not steady-state.

Three reasons it's still worth doing:

1. **Mount cost matters.** Krausest `create-1000` and `create-10000` benches measure exactly this path. With nested blocks (each containing if), closure construction multiplies: 1000 outer dispatches × N inner dispatches × 4 closures each.
2. **GC pressure.** Allocated-then-orphaned closures stress the young generation. Not user-visible at small N, measurable at large N (krausest's create-10000 is N=10000).
3. **API consistency.** Other framework primitives pass renderer state via `this.something`. Block hooks are the outlier with closure-captured renderer state.

Item is independent of the expression-block-unification refactor and of the perf-wins bundle.

---

## Item B: Eliminate per-dispatch closure construction

### Verdict — ACCEPT WITH MODIFICATIONS

Modifications:
- Reframe as **mount-cost optimization**, not per-fire. Plan as originally written claimed per-fire savings; that's wrong.
- Verification gate updated from "≥5% improvement on per-fire benches" to **"measurable improvement on krausest `create-1000` / `create-10000`."**
- Audit closure usage per block before committing — `template.js` (verified) does not use `lookupExpression` or `hydrateInnerContent` from the bag, so eliminating those for the template block is no-cost.

### Current code

`packages/renderer/src/engines/native/define-block.js:78-96` builds four closures **per block dispatch**:

```js
const lookupExpression = (expression) => renderer.lookupExpression(expression, data);
const renderAST = ({ ast, scope: childScope = scope, data: childData = data, isSVG: childIsSVG = isSVG } = {})
  => renderer.readAST({ ast, scope: childScope, data: childData, isSVG: childIsSVG });
const hydrateInnerContent = ({ ownedNodes, innerAST, data: innerData = data, scope: innerScope = scope } = {})
  => renderer.hydrateInnerContent({ ownedNodes, innerAST, data: innerData, scope: innerScope });
const hydrateInto = ({ innerAST, data: innerData = data, scope: innerScope = scope, asChild } = {})
  => renderer.hydrateInto({ region, innerAST, data: innerData, scope: innerScope, asChild });
```

The bag includes these as fields (`define-block.js:bag construction`). Block hooks receive the bag, call the closures from inside their own hook bodies.

### Per-block closure usage (audited)

- `each.js`: uses `lookupExpression` (line 439 — `resolveItems`), `renderAST` (lines 144, 530, 569). All four closures used.
- `conditional.js`: uses `lookupExpression` (lines 22, 29 — `selectBranch`), `renderAST` (line 87 in render hook), `hydrateInto` (line 99 in hydrate hook). Three of four.
- `async.js`: uses `lookupExpression` (line 49). One of four.
- `rerender.js`: uses `lookupExpression` (line 19), `renderAST` (line 25). Two of four.
- `template.js`: uses `renderAST` (line 345), but **not** `lookupExpression` or `hydrateInnerContent` from the bag (uses `self.evaluator` directly). Two of four.

Average: ~2.4 of 4 closures actually used per block instance. Constructing all 4 is wasteful even before counting allocation cost.

### What changes

Move closures to a per-Renderer-instance helper object, constructed once. Block hooks take `data` / `scope` / `isSVG` as explicit arguments.

```js
// renderer.js — once per Renderer instance, in the constructor
this.bindings = {
  lookupExpression: (expression, data) => this.lookupExpression(expression, data),
  renderAST: ({ ast, scope, data, isSVG }) => this.readAST({ ast, scope, data, isSVG }),
  hydrateInnerContent: ({ ownedNodes, innerAST, data, scope }) =>
    this.hydrateInnerContent({ ownedNodes, innerAST, data, scope }),
  hydrateInto: ({ region, innerAST, data, scope, asChild }) =>
    this.hydrateInto({ region, innerAST, data, scope, asChild }),
};

// define-block.js — bag references the helper, doesn't construct per-dispatch
const bag = {
  node, data, scope, region, isSVG, serverMeta,
  self,
  lookupExpression: renderer.bindings.lookupExpression,
  renderAST: renderer.bindings.renderAST,
  hydrateInnerContent: renderer.bindings.hydrateInnerContent,
  hydrateInto: renderer.bindings.hydrateInto,
  hook: null, err: null,
};
```

Block authors update their call sites — explicit args instead of relying on closure capture:

```js
// each.js — Before:
const fragment = renderAST({ ast: node.content });

// each.js — After:
const fragment = renderAST({ ast: node.content, data, scope, isSVG });
```

The bag still carries `data`, `scope`, `isSVG` as fields, so block authors typically write `renderAST({ ast: node.content, data: bag.data, scope: bag.scope, isSVG: bag.isSVG })` or destructure first.

### Lit analog

Lit's parts are stable across updates. The same `ChildPart` instance handles the same item across reconciles — its `_$setValue` method captures references to `_$startNode`, `_$endNode`, etc. via instance fields, not via per-call closures.

`~/lit/packages/lit-html/src/directives/repeat.ts:339-344` (corrected from original plan's 341-344):

```ts
} else if (oldKeys[oldHead] === newKeys[newHead]) {
  // Old head matches new head; update in place
  newParts[newHead] = setChildPartValue(
    oldParts[oldHead]!,
    newValues[newHead]
  );
```

Reuses the same `ChildPart` instance — no fresh closure-bag construction per item.

`~/lit/packages/lit-html/src/lit-html.ts:1382-1400` (ChildPart constructor) captures references as instance fields:

```ts
this._$startNode = startNode;
this._$endNode = endNode;
this._$parent = parent;
this.options = options;
```

`_update` at `lit-html.ts:1267-1292` iterates parts and calls `_$setValue(values[i])` per part — no closure construction per dispatch. Per-part dispatch is just a property access + method call on a stable instance.

SUI's per-dispatch closure construction is the equivalent of allocating a fresh ChildPart per dispatch — exactly what Lit explicitly avoids.

### Performance profile

- **Direction:** faster at mount; flat steady-state.
- **Magnitude per block dispatch:** 4 closure allocations × ~24 bytes each (V8 closure size) = ~96 bytes per dispatch saved. Plus the GC cost of those 96 bytes of orphaned-after-hook-completes objects.
- **Krausest `create-1000`:** 1000 each-block items × 1 each dispatch + 1000 inner-block dispatches per item if nested. At 1 outer + 1 inner per item × 4 closures: 8000 closures = ~192KB allocated, then GC'd. Expect ~3–8% improvement on the create benches.
- **Krausest `create-10000`:** scales linearly. Expect ~5–12% improvement.
- **Krausest `update-every-10th` and `swap-rows`:** flat or marginal — these don't construct new block instances.
- **Where it's invisible:** steady-state (per-Reaction-fire benches), `bench-todo` rename loops, FGR per-key isolation benches.

### API surface decision

The change makes block author calls more verbose. Two ways to handle:

**Option 1 (recommended): Clean break.** All block files updated to explicit-args. ~5 call sites per block × 5 blocks = ~25 call sites. Mechanical edit. Block authors outside the framework currently don't exist, so no compat concern.

**Option 2 (compat path): Deprecated overload.** Keep the closure-shape API as an alias for one release. New explicit-args API alongside. Bench would show closure overhead is paid only on the deprecated path. Adds API surface and complicates `defineBlock`'s implementation.

Recommended: Option 1. The block author API has zero external consumers today; adding compat paths now would entrench an API we already know is suboptimal.

### Risk

**R1 — Block author files break in unforeseen ways.** Each block file's calls to `renderAST`, `lookupExpression`, etc. need updating. If any path uses defaults that the old closure capture provided silently (e.g., a call site that omits `isSVG` and gets the bag's default), the explicit-args version will fail unless every site is audited.

**Mitigation:** the block files are SUI-internal and well-tested. Update each, run the existing test suite per block. The audit per block is small (~5 sites per file).

**R2 — Per-dispatch overhead replaced by indirection.** The new closures live on `renderer.bindings` and dispatch through there. V8's hidden-class for `bindings` should stay stable across all renderers; verify by inspection that no code mutates it post-construction.

**Mitigation:** freeze `renderer.bindings` post-construction or use `Object.create(null)` for predictable shape.

---

## Verification gates

### Gate B-1

- All renderer + templating tests pass.
- All block tests pass — per-block API change preserves behavior.
- Bench: krausest `create-1000` and `create-10000` show measurable improvement (target ≥3%, not below the tachometer noise floor).
- Bench: per-fire benches (`bench-todo` rename, FGR per-key) flat (no regression).

---

## What stays the same

- `defineBlock` signature for the user-facing API (block author's `defineBlock({ name, render, hydrate, update, destroy, ... })` is unchanged).
- AST, compiler, every other framework component.
- The expression-block-unification plan (independent; this change applies whether or not that lands).
- Hydration semantics.

---

## Estimated scope

- **Files touched:** 6 (renderer.js, define-block.js, the 5 block files).
- **LOC delta:** roughly net-neutral; ~25 lines net change across block call-site updates.
- **Tests:** zero new; existing tests cover the refactor.
- **Time:** 1 focused session.

---

## Open questions (not blocking)

- Whether to extend this same treatment to the expression-block-unification's commit/compute helpers (currently planned to be constructed per binding). Same pattern applies. Defer until both this and the unification plan are scheduled.
- Whether to also drop closures that are unused per-block (e.g., `template.js` doesn't use `lookupExpression`). Probably not worth the conditional-bag-construction complexity. Defer.
- Item A from the original per-fire-perf plan (split `lookupExpression`) was reframed as API-clarity, not perf. If it's worth doing, fold as a related cleanup in this same PR. If not, drop.

## Dependencies

**Blocked on:** [FGR — As-Mode Per-Field Isolation](active/fgr-as-mode-per-field-isolation.md) merging.

This plan touches `each.js` along with the other 4 block files (renderAST/lookupExpression call-site updates). The fgr-each-as branch is also editing `each.js`. Shipping in parallel would create merge conflicts on `each.js` and tangle bench attribution. Land after fgr-each-as merges; rebase against main; then file as its own PR.

Review trail: `ai/workspace/artifacts/native-renderer-per-fire-perf-review.md` (Item B section — verdict `ACCEPT WITH MODIFICATIONS`, key correction was reframing from per-fire to mount-cost). Originating comparative review: reframe agent's recommendation B in `ai/workspace/artifacts/lit-review-reframe.md`.

## Status

Scoped — design concrete, code citations verified at `define-block.js:78-96`, per-block closure usage audited. Ready to execute *after* fgr-each-as merges.
