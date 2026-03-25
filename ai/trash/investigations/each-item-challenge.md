# Each-Item Granularity: Architecture Challenge

## The Failing Test

**File:** `packages/renderer/test/browser/subtree-spurious.test.js`, line 298-341

**Test:** "re-rendering each list should not re-evaluate per-item static expressions in untouched items"

**Expected:** `spyTotal === countAfterRender + 1` (only item 1's expression re-evaluates because its label changed)
**Actual:** `spyTotal === 9` (all 3 items re-evaluate, so 3 initial + 6 spurious = 9 instead of 3 + 1 = 4)

**Real-world impact:** In the todo-list example (`docs/src/examples/framework/todo-list/`), checking a todo item mutates the `todos` signal, which triggers `getVisibleTodos` to re-evaluate, which causes the `{#each}` to re-render ALL items. This means every `todoItem` sub-template gets `cachedRender` called, which bumps `dataVersion` on every subtree, which triggers every `reactiveData` directive in every item to re-evaluate its expression. The checkbox that was just clicked loses focus because its entire subtree re-evaluates.

---

## The Chain of Causation

Here is the exact sequence that causes all items to re-evaluate when only one item changes:

### Step 1: Signal mutation triggers the each directive's reaction
When `state.version.set(1)` fires, the `ReactiveEachDirective`'s `Reaction` reruns (because `getItems` reads `state.version`).

### Step 2: `renderItems()` calls `repeat()` with the template function for ALL items
In `reactive-each.js` line 75-79:
```js
return repeat(
  items,
  (item, indexOrKey) => this.getItemID(item, indexOrKey, collectionType),
  (item, indexOrKey) => this.getTemplate(item, indexOrKey, collectionType),
);
```
Lit's `repeat` directive calls the template function for every item during its `_getValuesAndKeys` phase (line 58 in the source: `values[index] = template!(item, index)`). This happens **before** the reconciliation algorithm runs. Lit's repeat always calls the template function for every item on every update -- it uses the keys only for DOM reuse, not to skip template evaluation.

### Step 3: `getTemplate` calls `renderContent` which calls `cachedRender` on each subtree
In `reactive-each.js` line 93-97:
```js
getTemplate(item, indexOrKey, collectionType) {
  const templateData = this.getEachData(item, indexOrKey, collectionType, this.eachCondition);
  const key = this.getItemID(item, indexOrKey, collectionType);
  return this.eachCondition.content(templateData, key);
}
```
This calls `eachCondition.content(templateData, key)` which is the closure from `renderer.js` line 268-275 that calls `this.renderContent({ast: value, data, key: eachKey})`.

### Step 4: `renderContent` finds the cached subtree and calls `cachedRender(data)`
In `renderer.js` line 695-703:
```js
if (existingTree) {
  return existingTree.cachedRender(data);
}
```

### Step 5: `cachedRender` ALWAYS bumps dataVersion
In `renderer.js` line 80-86:
```js
cachedRender(data) {
  if (data) {
    this.updateData(data);
    this.bumpDataVersion();
  }
  return this.litTemplate;
}
```
It bumps `dataVersion` unconditionally whenever data is provided, even if the data hasn't actually changed.

### Step 6: `bumpDataVersion` invalidates every `reactiveData` directive in the subtree
In `renderer.js` line 88-97, `bumpDataVersion` increments the signal and cascades to child subtrees.

In `renderer.js` line 393, every expression reads `this.dataVersion.get()`:
```js
literalValue: () => {
  this.dataVersion.get();
  return this.lookupTokenValue(expression, this.data);
},
```
When `dataVersion` increments, every `ReactiveDataDirective` that subscribed to it in its `Reaction` gets invalidated and re-runs, regardless of whether the data it actually reads changed.

**This is the fundamental flaw: `dataVersion` is a single monotonic counter that acts as a coarse "everything changed" signal. It cannot express "only item 1's data changed."**

---

## Challenging the Architecture

### Is `bumpDataVersion` the right mechanism?

**No. It is fundamentally flawed for per-item granularity.**

`dataVersion` is a single `Signal(0)` on each `LitRenderer` subtree. When any data changes, ALL expressions in that subtree re-evaluate. It's a broadcast mechanism -- the equivalent of invalidating an entire L1 cache when one line is dirty.

The reason `dataVersion` exists is that the framework's data context is a plain object (`this.data`), not a reactive signal graph. When `updateData` mutates `this.data.todo`, no signal fires for expressions that read `todo.text`. `dataVersion` was introduced as a workaround: "I changed the data object, so bump this counter to tell all expressions to re-check."

This works fine for top-level component re-renders (where the data context is stable and expressions have their own `Reaction`s that track the actual signals they read). But inside `{#each}`, every item gets its own subtree, and `cachedRender` bumps `dataVersion` on ALL of them whenever the list re-renders -- even for items whose data is identical.

### Is caching each item even necessary?

**The subtree caching is doing useful work, but it's doing it at the wrong layer.**

The subtree cache (`renderTrees`) correctly avoids re-running `readAST` and rebuilding the Lit `TemplateResult` from scratch. That's valuable. But `cachedRender` then defeats the purpose by bumping `dataVersion`, which forces every expression to re-evaluate anyway.

The cache should be a **skip** mechanism: "this item's data hasn't changed, so return the cached template AND skip re-evaluation." Currently it's a **shortcut** mechanism: "don't re-parse the AST, but still re-evaluate everything."

### Could the each directive skip unchanged items BEFORE repeat processes them?

**Yes, and this is the most promising approach.**

Lit's `repeat` always calls the template function for every item (it has to -- it doesn't know what changed). But the `ReactiveEachDirective` controls what template function it passes to `repeat`. It could:

1. **Track previous item data per key** (a `Map<key, itemData>`)
2. **Compare new item data against previous** before calling the template function
3. **Return `noChange` for unchanged items** -- Lit's `setChildPartValue` (used in repeat's reconciliation) respects `noChange` and leaves the DOM untouched

This would mean unchanged items never call `renderContent`, never call `cachedRender`, never bump `dataVersion`, and never trigger expression re-evaluation. The DOM stays completely untouched.

### Is there a simpler architecture that avoids this problem entirely?

**Yes. Two complementary changes would eliminate the problem:**

#### Change 1: Make `cachedRender` data-aware (minimal fix)
```js
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
`updateData` already returns a boolean indicating if anything changed (line 757-772). Currently `cachedRender` ignores this return value. Simply checking it would prevent bumping `dataVersion` when item data is identical.

**This alone would fix the failing test.** When items 2 and 3 have the same label, `updateData` returns `false`, `bumpDataVersion` is skipped, and their expressions don't re-evaluate.

#### Change 2: Skip template evaluation for unchanged items in the each directive (optimal fix)
Even with Change 1, Lit's `repeat` still calls the template function for every item, which means `renderContent` and `cachedRender` run for every item (even if they're now no-ops). For large lists, this is O(n) function calls that could be O(changed items).

In `reactive-each.js`, the directive could maintain a `Map<key, {data, result}>` and return the cached result directly when item data hasn't changed:
```js
getTemplate(item, indexOrKey, collectionType) {
  const templateData = this.getEachData(item, indexOrKey, collectionType, this.eachCondition);
  const key = this.getItemID(item, indexOrKey, collectionType);

  // Skip template evaluation for unchanged items
  const cached = this.itemCache?.get(key);
  if (cached && shallowEqual(cached.data, templateData)) {
    return cached.result;
  }

  const result = this.eachCondition.content(templateData, key);
  if (!this.itemCache) this.itemCache = new Map();
  this.itemCache.set(key, { data: { ...templateData }, result });
  return result;
}
```

This means Lit's `repeat` still runs its O(n) reconciliation (unavoidable), but the template function returns instantly for unchanged items, and `cachedRender`/`bumpDataVersion` are never called.

---

## Why Change 1 (`cachedRender` checking `updateData` return value) Is Insufficient

At first glance, `updateData` already returns a `changed` boolean, so we could guard `bumpDataVersion`:
```js
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

**This does NOT fix the failing test.** Here's why:

The test's `getItems()` creates new object literals every call:
```js
return [
  { id: 1, label: v === 0 ? 'first' : 'updated' },
  { id: 2, label: 'second' },  // new object reference every time
  { id: 3, label: 'third' },   // new object reference every time
];
```

The each data for item 2 is `{ item: {id:2, label:'second'}, index: 1 }`. On re-render, `item` is a **new object** with identical contents. `updateData` does reference equality (`this.data[name] !== value`), so it sees `{id:2, label:'second'} !== {id:2, label:'second'}` as `true` (different references). `changed` is `true` for all items. `bumpDataVersion` fires for all items. Nothing improves.

This is the common case in real apps too -- `getVisibleTodos()` in the todo app creates new filtered arrays with new object references every render.

---

## Recommendation: The Fix Must Happen in the Each Directive

The only place with enough information to determine "this item hasn't meaningfully changed" is the `ReactiveEachDirective` itself. It knows the previous items, the new items, and the keys.

### Approach: Item-level caching in `getTemplate`

The each directive should maintain a `Map<key, {data, result}>`. When the template function is called for an item, it compares the new item data against the cached data using shallow equality on the each-data properties. If unchanged, it returns the cached `TemplateResult` directly -- `cachedRender` is never called, `bumpDataVersion` is never called, and no expressions re-evaluate.

```js
getTemplate(item, indexOrKey, collectionType) {
  const templateData = this.getEachData(item, indexOrKey, collectionType, this.eachCondition);
  const key = this.getItemID(item, indexOrKey, collectionType);

  const cached = this.itemCache?.get(key);
  if (cached && shallowEqualEachData(cached.data, templateData)) {
    return cached.result;
  }

  const result = this.eachCondition.content(templateData, key);
  if (!this.itemCache) this.itemCache = new Map();
  this.itemCache.set(key, { data: snapshotData(templateData), result });
  return result;
}
```

Where `shallowEqualEachData` does a shallow comparison appropriate for each-item data: compare the `as` value (the item itself) by checking its own enumerable properties, and compare the index by value.

**Why this works:**
- Lit's `repeat` still calls the template function for every item (unavoidable), but it returns instantly for unchanged items
- The returned `TemplateResult` is the exact same object reference, so Lit's `setChildPartValue` sees no change and skips DOM work
- `renderContent`/`cachedRender`/`bumpDataVersion` are never invoked for unchanged items
- The `Reaction`s inside unchanged items' `ReactiveDataDirective`s never fire

**Why shallow equality is sufficient here:**
Each-item data has a predictable shape: `{ [as]: item, [indexAs]: number }`. The `item` value is typically a plain object with primitive properties (like `{id: 1, label: 'second'}`). Shallow-comparing the item's own properties catches the common case where the item is recreated with identical values. For the index, it's always a number (value equality).

### Complementary: Also fix `cachedRender`

Even with the each-directive fix, `cachedRender` should still be guarded for correctness in other subtree scenarios (conditionals, snippets, etc.):

```js
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

This is a defense-in-depth change that prevents spurious `bumpDataVersion` calls anywhere subtrees receive identical data by reference.

---

## Why the Todo App Loses Focus

In the todo-list example:

1. User clicks checkbox on a todo item
2. `toggleCompleted()` calls `todos.setProperty(todo._id, 'completed', !todo.completed)`
3. This mutates the `todos` signal
4. `getVisibleTodos()` re-evaluates (reads `todos`)
5. `{#each todo in getVisibleTodos}` re-renders ALL items
6. ALL todo items get `cachedRender` called with new data (new object references)
7. `bumpDataVersion` fires on ALL subtrees (because reference equality fails)
8. Every `{todo.text}`, `{todo.completed}`, `{classMap getClasses}` expression in every item re-evaluates
9. The `{#if editing}` conditional re-evaluates for all items
10. The checkbox DOM gets reconstructed even for the item that was just clicked
11. Focus is lost

With the each-directive item cache: only the toggled item's template would re-evaluate (its `completed` property changed). All other items return cached results. The checked checkbox's DOM stays untouched. Focus is preserved.

---

## Summary of Root Causes

| Layer | Problem | Impact |
|-------|---------|--------|
| `repeat` (Lit) | Always calls template function for every item | Can't be avoided -- it's how Lit works |
| `reactive-each.js` | No item-level caching; calls `content()` for every item every time | Every item's subtree gets `cachedRender` |
| `renderer.js` `cachedRender` | Bumps `dataVersion` unconditionally when data is provided | Every expression in every subtree re-evaluates |
| `renderer.js` `updateData` | Uses reference equality (`!==`) not structural equality | New-but-identical objects trigger false positives |
| `reactive-data.js` | Reads `dataVersion.get()` -- a global counter, not per-expression | One bump invalidates all expressions in the subtree |

**The correct fix is primarily in `reactive-each.js`**: add item-level caching so that unchanged items never enter the `cachedRender`/`bumpDataVersion` pipeline at all. The `cachedRender` guard is a secondary defense.
