# Each Item Re-evaluation Optimization

## Problem

When any item in an `{#each}` loop changes, ALL items re-evaluate their expressions, not just the changed one. This causes O(n) work for O(1) changes and real-world bugs like focus loss in the todo-list example when checking off an item.

## Root Cause (Two Layers)

### Layer 1: Lit's `repeat` eagerly calls ALL template functions

Lit's `repeat` directive, used internally by `reactive-each.js`, calls the template function for **every item** on every update to produce its `newValues` array (`_getValuesAndKeys`, line 37-39 of repeat.js):

```javascript
for (const item of items) {
    values[index] = template(item, index);  // called for ALL items
    index++;
}
```

Each call flows through: `getTemplate` -> `eachCondition.content(data, key)` -> `renderContent` -> `cachedRender(data)` -> `bumpDataVersion()`. This increments the subtree's `dataVersion` signal, which triggers all `reactiveData` reactions within that subtree.

**Result:** Every item's subtree gets a `dataVersion` bump, causing every expression to re-evaluate.

### Layer 2: Double evaluation for changed items

For items that DID change, expressions evaluate **twice**:

1. **Lit's template commit path:** `repeat` passes the template result to `setChildPartValue`, which calls `_commitTemplateResult` -> `_update(values)` -> `ReactiveDataDirective.render()` -> evaluates expression.

2. **Reaction path:** `bumpDataVersion()` increments `dataVersion` (scheduled as microtask via `Scheduler`), reaction fires -> `getReactiveValue()` -> evaluates expression again.

## Trace: "One item changes" -> "All items re-evaluate"

```
Signal changes (e.g., state.version.set(1))
  -> reactive-each reaction fires (subscribed to the signal via over())
    -> renderItems()
      -> repeat(items, keyFn, templateFn)
        -> templateFn called for EVERY item (Lit's repeat behavior)
          -> getTemplate(item, index)
            -> content(templateData, key)    [renderer.js evaluateEach]
              -> renderContent({ast, data, key})
                -> cachedRender(data)           [for cached subtrees]
                  -> updateData(data)           [copies new data to subtree]
                  -> bumpDataVersion()          [increments dataVersion signal]
                    -> All reactiveData reactions in subtree fire
                      -> getReactiveValue() -> expression.value()
                        -> dataVersion.get() + lookupExpressionValue()
                          -> USER EXPRESSION EVALUATED (spy count++)
                  -> returns litTemplate
        -> setChildPartValue(oldPart, litTemplate)  [Lit re-commits]
          -> _commitTemplateResult -> _update(values)
            -> ReactiveDataDirective.render()
              -> getReactiveValue()     [SECOND evaluation for changed items]
```

## Fix (Two Parts)

### Part 1: Item-level snapshot caching in `reactive-each.js`

**File:** `/packages/renderer/src/lit/directives/reactive-each.js`

Cache a deep-cloned snapshot of each item keyed by its repeat ID. In `getTemplate`, compare the current item against its snapshot using structural equality (`isEqual`). If unchanged, return Lit's `noChange` sentinel instead of calling the template function.

This prevents `repeat` from triggering `renderContent` -> `cachedRender` -> `bumpDataVersion` for items whose data hasn't actually changed. Handles both new-object-same-values (common in functional patterns) and in-place mutations (detected because the snapshot is a separate clone).

Snapshots are pruned when items are removed and cleared when the list empties (to handle empty/populated transitions where Lit destroys and recreates parts).

### Part 2: Deduplicate expression evaluation in `reactive-data.js`

**File:** `/packages/renderer/src/lit/directives/reactive-data.js`

When `ReactiveDataDirective.render()` is called by Lit and a reaction already exists, return `noChange` instead of evaluating the expression. This follows the same pattern already used by `ReactiveConditionalDirective` (line 18-20 of `reactive-conditional.js`).

The reaction system handles updates: when `dataVersion` is bumped, the reaction fires (via microtask) and calls `this.setValue(newValue)`, which pushes the update to Lit. Returning `noChange` from `render()` prevents the redundant synchronous evaluation that previously caused double-counting.

## Impact

| Scenario | Before | After |
|----------|--------|-------|
| 3-item list, 1 item changes, static spy per item | 9 evaluations (3 initial + 6 extra) | 4 evaluations (3 initial + 1 for changed item) |
| Todo checkbox toggle | All items re-render, focus lost | Only toggled item re-renders, focus preserved |
| N-item list, 1 change | O(n) expression evaluations | O(1) expression evaluations for unchanged items |

## Files Changed

- `packages/renderer/src/lit/directives/reactive-each.js` — Item snapshot caching + `noChange` for unchanged items
- `packages/renderer/src/lit/directives/reactive-data.js` — Return `noChange` from `render()` when reaction handles updates

## Files NOT Changed

- `packages/renderer/src/lit/renderer.js` — `cachedRender`, `bumpDataVersion`, `updateData` remain as-is. The fix is entirely at the directive level.

## Test Results

All 208 browser tests pass, including the 10 new spurious-evaluation tests. No regressions.
