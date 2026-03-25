# Spurious Expression Re-evaluation in `{#each}` — Root Cause Analysis

## Failing Test

**File:** `packages/renderer/test/browser/subtree-spurious.test.js`
**Test:** "re-rendering each list should not re-evaluate per-item static expressions in untouched items" (line 298)

The test creates a 3-item each loop where each item renders `{staticSpy}`, a function that increments a counter. After initial render (3 calls), the list source signal changes but only item 1's data actually changes (label `'first'` -> `'updated'`). Items 2 and 3 are semantically identical. The test expects `spyTotal` to be `countAfterRender + 1` (only the changed item re-evaluates), but ALL items re-evaluate, making the count `countAfterRender + 3`.

---

## Exact Call Chain: Signal Change to Spurious Evaluation

```
1. state.version.set(1)
   │
2. ReactiveEachDirective reaction fires (reactive-each.js:40-49)
   │  — The reaction body calls this.getItems(), which calls eachCondition.over(),
   │    which calls evaluateExpression → lookupExpressionValue → getItems(),
   │    which reads state.version.get(), triggering the reaction.
   │
3. renderItems() is called (reactive-each.js:47)
   │
4. repeat(items, keyFn, templateFn) is called (reactive-each.js:75-79)
   │
5. Lit's RepeatDirective._getValuesAndKeys() runs (lit-html repeat.js:26-46)
   │  — Iterates ALL items and calls templateFn(item, index) for EVERY item.
   │  — This happens BEFORE any key-based diffing.
   │  ┌─────────────────────────────────────────────────────┐
   │  │  THIS IS THE FIRST ROOT CAUSE.                      │
   │  │  Lit's repeat() eagerly evaluates the template      │
   │  │  function for every item to build the values array. │
   │  │  Diffing only decides which DOM parts to update,    │
   │  │  not which template functions to call.               │
   │  └─────────────────────────────────────────────────────┘
   │
6. For each item, getTemplate() calls eachCondition.content(templateData, key)
   │  (reactive-each.js:93-97 → renderer.js:263-271)
   │
7. content() calls renderContent({ ast, data, key: eachKey })
   │  (renderer.js:691)
   │
8. renderContent() looks up the subtree cache by contentID = getID({ ast, key })
   │  — For items 2 and 3, cached subtrees exist from the initial render.
   │  — Calls existingTree.cachedRender(data) (renderer.js:698)
   │
9. cachedRender(data) UNCONDITIONALLY calls bumpDataVersion() (renderer.js:76-82)
   │  — The `data` argument is always truthy (it's a merged object)
   │  — updateData() returns whether data actually changed, but
   │    cachedRender IGNORES the return value
   │  ┌─────────────────────────────────────────────────────┐
   │  │  THIS IS THE SECOND ROOT CAUSE.                     │
   │  │  bumpDataVersion() fires even when no data changed. │
   │  └─────────────────────────────────────────────────────┘
   │
10. bumpDataVersion() increments this.dataVersion signal (renderer.js:84-85)
    │
11. Every reactiveData directive in the subtree has a reaction whose
    │  value() getter calls this.dataVersion.get() (renderer.js:388-395)
    │  — This means EVERY expression in the subtree depends on dataVersion,
    │    regardless of what the expression actually reads.
    │  ┌─────────────────────────────────────────────────────┐
    │  │  THIS IS THE THIRD ROOT CAUSE.                      │
    │  │  dataVersion is a coarse-grained invalidation signal │
    │  │  that couples ALL expressions in a subtree together. │
    │  └─────────────────────────────────────────────────────┘
    │
12. The dataVersion change triggers the reactiveData reaction to re-run
    │  (reactive-data.js:53-61)
    │
13. getReactiveValue() → expression.value() → lookupExpressionValue('staticSpy')
    │  → resolves to the staticSpy function → wrapFunction(value)() calls it
    │
14. staticSpy() runs → spyTotal++ → SPURIOUS EVALUATION
```

---

## Three Contributing Factors

### Factor 1: Lit's `repeat()` eagerly calls the template function for ALL items

**File:** `node_modules/lit-html/development/directives/repeat.js`, lines 26-46

The `_getValuesAndKeys` method is called in both `render()` and `update()`. It iterates the entire items array and calls `template(item, index)` for every item to build the `values` array. The key-based diffing algorithm only determines which DOM parts to move/create/remove — the template function has already executed for every item by that point.

This is inherent to Lit's `repeat` design. It produces new template results for all items, relying on Lit's dirty-checking at the DOM level to avoid unnecessary DOM mutations. But in this framework, the template function triggers reactive side effects.

### Factor 2: `cachedRender()` bumps `dataVersion` unconditionally

**File:** `packages/renderer/src/lit/renderer.js`, lines 76-82

```javascript
cachedRender(data) {
    if (data) {
      this.updateData(data);
      this.bumpDataVersion();  // Always bumps, even if updateData found no changes
    }
    return this.litTemplate;
}
```

`updateData()` returns a boolean indicating whether any data actually changed, but `cachedRender` ignores it. Even for items 2 and 3 (whose semantic data is identical), `bumpDataVersion()` fires because:
- The `data` argument is always truthy (it's a merged object `{ ...this.data, ...eachData }`)
- The `item` property in `eachData` is a **new object reference** each time `getItems()` returns fresh objects, so `updateData` would also report changes based on reference inequality — but even if it didn't, the bump is unconditional

### Factor 3: `dataVersion` is an all-or-nothing invalidation mechanism

**File:** `packages/renderer/src/lit/renderer.js`, lines 386-395

Every expression rendered as a directive (`asDirective: true`) wraps its value getter with `this.dataVersion.get()`:

```javascript
value: () => {
    this.dataVersion.get();  // Creates dependency on the subtree's dataVersion
    return this.lookupExpressionValue(expression, this.data);
},
```

This means the `dataVersion` signal acts as a **broadcast invalidation** — when it changes, every expression reaction in that subtree re-fires, regardless of whether the expression reads any state or signals that actually changed. A `staticSpy` that reads zero signals is treated identically to an expression that reads the changed data.

---

## Is This Inherent or Fixable?

**Both factors contribute, but the problem is fixable** without rearchitecting the system.

1. **Lit's `repeat` design** makes it impossible to skip calling the template function for unchanged items. This is a foundational constraint. However, in vanilla Lit, calling the template function with the same tagged template is cheap because Lit's dirty-checking prevents DOM updates. The problem is only costly here because the template function triggers reactive side effects via `bumpDataVersion`.

2. **The framework's caching layer** (specifically `cachedRender` + `bumpDataVersion`) turns a cheap no-op into an expensive broadcast. Even though `cachedRender` returns the same `litTemplate` for unchanged items (correctly avoiding re-rendering), it unconditionally increments `dataVersion`, which causes every `reactiveData` directive in the subtree to re-evaluate.

---

## Potential Fix Approaches (Description Only)

### Approach A: Conditional `bumpDataVersion` in `cachedRender`

Use the return value of `updateData()` to skip the version bump when data hasn't actually changed:

```javascript
cachedRender(data) {
    if (data) {
      const changed = this.updateData(data);
      if (changed) {
        this.bumpDataVersion();
      }
    }
    return this.litTemplate;
}
```

**Limitation:** `updateData` uses reference equality (`this.data[name] !== value`). Since `getItems()` returns fresh objects, the `item` property will always be a new reference even when its contents are identical. `updateData` will report `changed = true` for every item. To fix this, the comparison would need structural/deep equality — either by modifying `updateData` to support it, or by adding a pre-check in `cachedRender`.

### Approach B: Per-item data comparison in `ReactiveEachDirective`

Cache the last-seen item data per key inside the each directive. In `getTemplate()`, compare the new item data against the cached data for that key using structural equality. If unchanged, return the previously cached lit template result directly without calling `content()` at all. This prevents entering `renderContent` → `cachedRender` → `bumpDataVersion` for unchanged items.

This is the most targeted fix — it addresses the problem at the exact layer where per-item granularity should be enforced, and avoids the Lit `repeat` eager-evaluation problem entirely.

### Approach C: Decouple expression reactivity from `dataVersion`

Remove or reduce the dependency on `dataVersion` in expression evaluation. Instead of having every expression depend on a single coarse-grained signal, have expressions depend only on the specific data properties they read. This would require more sophisticated per-property dependency tracking.

### Approach D: Replace Lit's `repeat` with a custom directive

Write a custom repeat-like directive that performs key-based diffing *before* calling template functions, only invoking the template for items that are new or whose data has changed. This sidesteps the `_getValuesAndKeys` eager-evaluation entirely.

### Recommended Path

**Approach A + B combined** offers the best balance. Approach A (conditional bump) is simple and catches cases where data truly hasn't changed. Approach B (per-item caching in the each directive) handles the `repeat` eager-evaluation problem by short-circuiting before `renderContent` is called. Together they eliminate spurious evaluations for both the "identical data, new references" case and the "completely unchanged item" case.
