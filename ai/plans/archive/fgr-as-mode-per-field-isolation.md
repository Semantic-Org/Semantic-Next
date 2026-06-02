# FGR — Per-Field Isolation in `as`-Mode `{#each}`

## Goal

Close the per-FIELD isolation gap inside `{#each item in items}` where mutating one field of an item fans out to every binding reading that item, instead of only the binding reading the mutated field. Two `it.fails` contract tests in `subtree-spurious.test.js` (lines 720, 865) pin the gap; this plan makes them pass without regressing the 28 currently-passing FGR contracts or the per-record mount budget.

A fast-follow to [Fine-Grained Reactivity](fine-grained-reactivity.md) (PR #183), which delivered per-key isolation across the three documented sites (each items / subtemplate `reactiveData` / snippet args). Per-FIELD inside the as-key was a known follow-on at PR-merge time — the architecture intentionally shipped without it so #183 could land at the structural floor on its remaining mount-cost regressions (`bulk-add-500` +18%, `remove-last-100` +24%, `each-mount-1000` +11-14%).

## Background

The shape this plan reaches for already exists in the codebase: `createSettingsProxy` at `packages/component/src/component-helpers.js:247-276`. Settings exposes dynamic property names (`settings.X`) where the framework can't enumerate the read set ahead of time — bindings and createComponent code decide which settings they care about at runtime. The proxy intercepts each `.X` access, lazy-creates a per-property reactive primitive in a `Map<name, primitive>`, and registers the active Reaction.

The 2a.2 plan applies that pattern to the as-key value in `{#each item in items}`. Same problem: bindings access `item.X` for various X that the framework cannot enumerate in advance (helper bodies, deeper expressions, anything past a runtime boundary). Same primitive: a Proxy on the item, lazy field-dep allocation in a Map, dep registered on get, fired by reconcile when the snapshot diff sees a changed key.

The original draft predated `b485010aa` ("Refactor: Swap buildArgsProxy for native getter records") and framed Option A as "reintroducing a Proxy after we removed one." That framing was incorrect. `buildArgsRecord` operates on subtemplate args where the template author *declares* the key set at the call site (`{>child a=expr b=expr}` → compiler emits `node.reactiveData = { a, b }`). The framework iterates that AST artifact at clone time and installs descriptors for known keys. Item field access has no analogous declaration — fields are read in user-authored binding code at runtime, behind helper boundaries the renderer can't see through. The two access patterns call for two different primitives, and the codebase already chose the right one for each: descriptors for declared args, Proxy for dynamic names.

## The gap

`{#each todo in todos}` puts the whole item under one key on the per-record `ReactiveDataContext` (RDC). `getEachData` at `packages/renderer/src/engines/native/shared/each.js:32-44` returns:

```js
return as
  ? { [as]: item, [indexAs]: indexOrKey }
  : { ...item, this: item, [indexAs]: indexOrKey };
```

Spread mode (`!node.as`) flattens each item field into its own RDC key. A binding reading `text` registers a per-key dep on `'text'`; mutating one field fires only that dep. Per-field isolation works.

As-mode wraps the item under one as-key. A binding reading `todo.completed` does:

1. `proxy.todo` → RDC `trapGet` (`reactive-context.js:94-105`) → registers per-key dep on `'todo'` → returns the item
2. `.completed` → plain object access on the item — no dep registration

Reconcile detects in-place mutation via snapshot diff and routes through `notifyKey(node.as)` at `each.js:360-361`. **Every** binding that read `todo.X` wakes, regardless of which field actually changed. Spread-mode at `each.js:363-368` calls `setKey(key, item[key])` per changed field and only the matching field-bound bindings wake — that path is correct.

The bench-todo composition at `subtree-spurious.test.js:865` extends the same gap through a subtemplate boundary: `{#each todo in todos}{>todoItem id=todo._id title=todo.title completed=todo.completed}{/each}`. Each `reactiveData` getter (`buildArgsRecord` at `template.js:121-178`) re-evaluates `todo.X` on the parent data — meaning each subtemplate binding registers the SAME per-record `'todo'` dep, and one mutation wakes all three. The composition does not introduce a new architectural site; it surfaces the same as-mode gap one layer deeper.

## Constraints

- The 28 currently-passing FGR contract tests stay passing. No regressing isolation on the working sites.
- Spread-mode behavior unchanged. Per-field isolation already works there.
- `each-mount-1000`, `bulk-add-500`, `remove-last-100` do not regress further. Per-record allocation cost is the load-bearing axis; the cleanest fix shape may not be the cheapest, and the plan must respect that floor.
- Both `it.fails` markers come off (`subtree-spurious.test.js:720`, `:865`).
- `notifyKey('this')` for spread-mode (`each.js:367`) keeps working — readers of the whole-item key (`{this}` or spread closures) still wake on in-place mutation.
- Hydration path (`adoptServerItems` in `each.js:451-562`) inherits the same record shape — whatever solution lands has to flow through hydration without additional adoption cost.

## Design

### Recommendation: Option A — settings-proxy pattern at the as-key

**Wrap the item in a lazy-allocated Proxy at the RDC's as-key fetch site.** When a Reaction reads `proxy.todo`, RDC's `trapGet` returns an item-tracking proxy whose `get` registers per-FIELD deps. When reconcile's snapshot diff sees changed keys it calls `notifyField(asKey, fieldName)` per change; only field-bound bindings wake.

This is the same primitive `createSettingsProxy` uses for the same reason. The framework cannot enumerate which fields a binding will read on the item: bindings can do `item.X`, helpers can do `(t) => t.X`, deeper expressions can do `item.tags[0]`. All of those run in user-authored code, often behind helper boundaries the renderer cannot see through. Dep registration has to fire at the moment of `.X` access, dispatched dynamically. Proxy is the language's native primitive for that.

The RDC at the each-record level is already a Proxy by design — that's where per-key reactivity lives. The proposed item proxy is one level deeper, lazily allocated when a Reaction reads the as-key. It doesn't change the subtemplate-side `buildArgsRecord` layer or its IC story.

### Why not Option D (getter-descriptor item wrapper)

Considered: build a getter-descriptor wrapper around the item at record-creation time, mirroring `buildArgsRecord`'s shape. Walk `Object.keys(item)`, install a getter per field that calls `dep.depend(); return item[field]`. Same primitive, no new Proxy.

Rejected because **the framework can't enumerate the read set** for items. `buildArgsRecord` works because subtemplate args are template-declared at the call site (`{>child a=expr b=expr}` → compiler emits `node.reactiveData = { a, b }`); the renderer iterates that AST artifact at clone time and installs descriptors for every key the bindings could read. There's no analogous declaration for item field access. A binding's read set is encoded in the binding's own code, sometimes inside helper bodies the compiler can't see through. A descriptor wrapper would have to enumerate fields by walking `Object.keys(item)` at creation, which catches only fields present at that moment — a binding reading a field added later via `setProperty` would silently never wake. The Proxy's get trap dispatches on any property access, so registration works the same regardless of whether the field exists yet.

### Why not Option B (spread under as-key)

Considered: have `getEachData` spread item fields into per-record RDC keys *and* keep an as-key, with evaluator awareness routing `todo.completed` to the spread fields. Rejected for the same reason the draft rejected it — collision risk between as-key and field names, and it requires breaking the renderer/evaluator separation. Verifying against current code: `evaluator.lookupExpressionValue` routes through `parentData` opaquely; teaching it the as-key concept would couple the evaluator to a renderer-internal shape. Architectural cost stays high.

### Why not Option C (compile-time hoisting)

Compiler walks each-body AST, finds `todo.X` accesses, emits per-field RDC keys at each-block creation. Rejected because the bench-todo failing test at line 865 uses helper-mediated access where the compiler cannot see `.X` through the helper boundary — and the verbose-syntax bench-todo test threads `todo.X` through subtemplate `reactiveData` expressions evaluated at runtime, still on the parent data context. Compile-time hoisting would need to be paired with A or B for the missed cases.

## Implementation

### 1. RDC extension — `packages/renderer/src/engines/native/reactive-context.js`

Add an `asKey` constructor option. When `prop === asKey` in `trapGet`:

- Lazy-allocate an item-tracking proxy on first read (cached on the RDC instance; cleared when the as-key value replaces or the record is disposed).
- The item proxy's `get` trap registers a per-field dep keyed by `(asKey, fieldName)` on the active Reaction, then returns `item[fieldName]`.
- Per-field deps live in a null-prototype object on the RDC: `target.fieldDeps[asKey][fieldName] = Dependency`. Lazy-allocate the inner map on first reactive field read. Match the existing `target.values`/`target.deps` shape — both are eager at the record level for IC stability, but field-level deps are only allocated when a binding actually subscribes to a field.

Add a method `notifyField(asKey, fieldName)`:

- Fires the per-field dep for `(asKey, fieldName)` if present.
- No-op if no Reaction has subscribed to that field — common case, cheap.

The "any-field" fallback dep that the draft proposed for whole-item closures: I do not believe it is needed. A closure that captures `todo` and reads `.X` later still dispatches through the proxy and registers the per-field dep at its read-time Reaction. A closure that examines item *identity* (===) is unaffected by in-place mutation (same ref). Worth confirming during implementation; flag as Open Question 1 below.

### 2. Each-block reconcile — `packages/renderer/src/engines/native/blocks/each.js:339-368`

In the same-ref + snapshot-diff branch, when `node.as` is set:

- Replace the single `record.dataContext.notifyKey(node.as)` with a loop over `changedKeys` calling `record.dataContext.notifyField(node.as, key)`.
- Spread-mode branch (`!node.as`) untouched — it keeps `setKey(key, item[key])` per changed key and `notifyKey('this')`.

`createRecord` and `adoptServerItems` (`each.js:139-176`, `:451-562`) pass `asKey: node.as` into the RDC constructor. No other changes at the call sites.

### 3. Tests — `packages/renderer/test/browser/subtree-spurious.test.js`

- Remove `it.fails` from the test at line 720 (each-block per-FIELD isolation).
- Remove `it.fails` from the test at line 865 (subtemplate-inside-each composition / bench-todo shape).
- Add a positive test: bindings reading `todo.text` do NOT wake when `todo.completed` mutates (sibling-field isolation within the same item, as a finer-grained version of the existing sibling-record test at line 764).
- Add a closure-capture test: a helper `(todo) => todo.text` invoked from inside a binding registers the per-field dep correctly when invoked through the proxy, and survives in-place mutation of a different field without re-firing.

### 4. Bench

- `each-mount-1000` should stay flat. Lazy item-proxy allocation defers the cost past the mount pass — a record's item proxy is only built on first reactive read, which happens during binding render and is already accounted for in current mount costs. Verify by running before/after on the existing bench, expecting variance ≤ ±2%.
- `bench-todo` `toggle-*` and `edit-*` metrics should improve modestly — currently each toggle wakes every binding reading the item; per-FIELD cuts the wake to one binding per mutated field. Magnitude depends on binding count per item; the bench-todo template has three subtemplate bindings per todo, so the upper bound is ~3x reduction in spurious work for single-field toggles.
- `bulk-add-500` and `remove-last-100` should not regress. These are mount/dispose-dominant, and the lazy proxy is not allocated during pure mount. If they DO regress, revisit the lazy boundary — possibly defer the per-field dep allocation to the FIRST reactive field read rather than the first as-key read.

No new bench is needed for the per-FIELD contract — the failing tests pin the contract directly. A `subtree-spurious`-style metric was considered and dropped as redundant.

## Composition: subtemplate-inside-each

The bench-todo failing test at line 865 is a composition of two architectural layers: the each-block RDC and the subtemplate's `buildArgsRecord`. The flow under this plan:

1. `setProperty('a', 'completed', true)` → array Signal fires.
2. Each-block `update` → reconcile → snapshot diff returns `changedKeys = ['completed']`.
3. As-mode branch fires `notifyField('todo', 'completed')`.
4. The subtemplate's `readCompleted` binding registered a per-field dep on `('todo', 'completed')` when its getter evaluated `todo.completed` against the parent data — that's where the proxy intercepts.
5. Only `readCompleted` wakes. `readId` and `readTitle` registered per-field deps on `('todo', '_id')` and `('todo', 'title')` — those deps did not fire.

The composition works because the subtemplate's getter-descriptor record looks up `todo.X` on the parent data context (the each-record's RDC proxy), and that proxy is the per-FIELD interception point. The fix lives at the each-block layer; the subtemplate layer needs no change. **This is the angle the original draft did not explicitly verify.** It does check out — the draft's recommendation handles it correctly, but the path through the subtemplate boundary deserves to be stated explicitly so the implementer can reason about it.

## Open Questions

1. **Is the "any-field" fallback dep needed?** The draft's recommendation included a `'$ANY:asKey'` dep for whole-item closures. My read of the proxy semantics says it is not needed — proxies dispatch on `.X` access regardless of when the closure was captured, and identity-based reads (===) are unaffected by in-place mutation. Resolve in-session by writing the closure-capture test (Step 3, fourth bullet) and seeing whether it passes without the fallback. If it fails, restore the fallback dep with a single any-field dep per as-key, fired on every `notifyField` call.

2. **Late-added field handling.** `setProperty(id, 'newKey', x)` adds a key to an item that was not present at record creation. Snapshot diff already detects added keys (`each.js:67-69`). The proposed plan registers per-field deps lazily on first reactive read — a binding reading a field that does not yet exist registers a dep on `(asKey, fieldName)`, then `notifyField` fires that dep when the field is added. Confirm this works end-to-end with a test: render a binding for `todo.flag` where `flag` is initially absent, then `setProperty(id, 'flag', true)` and assert the binding fires.

3. **Hydration parity.** `adoptServerItems` constructs the RDC with the same options as `createRecord` (currently `registerItemContext: true, sealKeysAfterReplace: !!node.as`). Adding `asKey: node.as` extends both call sites identically. Confirm during implementation that hydrated bindings register per-field deps on first run — not a design question, an implementation sanity check.

## Dependencies

- [Fine-Grained Reactivity](fine-grained-reactivity.md) — must merge first. This plan extends the RDC primitive that #183 introduces, modifies the each-block reconcile path #183 establishes, and removes contract markers #183 left in place.

## Sessions (estimated)

1. **Land RDC + each-block changes** (~2-3h pair). Extend `ReactiveDataContext` with `asKey` and `notifyField`; thread `asKey: node.as` through `createRecord` and `adoptServerItems`; replace `notifyKey(node.as)` in reconcile with per-field loop; remove `it.fails` markers; add the new positive/closure-capture tests; run the renderer test suite green.

2. **Bench verification** (~1h pair). Run `each-mount-1000`, `bulk-add-500`, `remove-last-100`, `bench-todo` against the prior session's baseline. Lock in the lazy boundary (Open Question 2) based on what bulk-add and remove-last show. If regressions exceed the structural floor, defer field-dep allocation further or accept the trade as documented.

## Completion

> Computed from git log; verify breaks.

- **Estimated:** 3-4h pair
- **Actual:** ~10-12h active across ~4 bursts over ~32h wall-clock (2026-05-08 09:47 EDT → 2026-05-09 17:44 EDT). Merged as [PR #191](https://github.com/Semantic-Org/Semantic-Next/pull/191) at 2026-05-09 17:45 EDT.
- **Completed:** 2026-05-09
- **Delta notes:** ~3x the estimate. Each session 1 land surfaced additional contracts not in the original scope: object-iteration as-mode (gated branch + per-FIELD wakeup for non-array iterables), primitive→object item morphs, item-proxy iteration / stringify correctness (devtools showed the RDC instead of the item), and a JS-expression boundary fix for the unwrap protocol. Several perf attempts on the as-mode dep-allocation hot path were applied and reverted (skip-until-first-mutation, drop-dead-dep-registration) before the final shape — eager primitive dep + lazy object-item dep — settled.

## Status

Shipped 2026-05-09.
