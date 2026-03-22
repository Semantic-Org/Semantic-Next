# Subtemplate Focus Investigation: Each Loop + Subtemplate DOM Destruction

## Test Under Investigation

**File:** `packages/renderer/test/browser/subtree-caching.test.js`
**Test:** "16. Subtemplate inside each" → "should not destroy subtemplate DOM when sibling item data changes"

**Setup:** An `{#each}` loop renders 3 todo items, each using a subtemplate `{>itemTemplate todo=todo}`. The test focuses input[1] (item B), then toggles item A's `completed` property, and checks whether item B's input retains focus.

**Result:** The test currently **passes**. The guard at line 106 of `render-template.js` prevents unnecessary Template re-cloning.

---

## Full Signal-to-DOM Trace

### Step 1: Signal Mutation
```
el.component.toggleItem('a')
  → todos.setProperty('a', 'completed', true)
    → Signal.setArrayProperty(index, 'completed', true)
      → this.peek().map(mutate matching item) → this.set(newArray)
```
Key detail: `setArrayProperty` creates a **new array** via `.map()` but reuses the **same item object references** (just mutates the property on the matching item). Items B and C are the same objects with no property changes.

### Step 2: Each Directive Reaction Fires
The `ReactiveEachDirective` reaction (line 41-51 of `reactive-each.js`) detects the `todos` signal change and calls `this.renderItems()`.

### Step 3: Item Snapshot Optimization
`renderItems()` calls `getTemplate()` for each item. The **snapshot optimization** (lines 110-116 of `reactive-each.js`) compares each item against its stored clone:

- **Item A (`_id: 'a'`):** `completed` changed → `isEqual(snapshot, item)` returns `false` → content callback fires
- **Item B (`_id: 'b'`):** no changes → `isEqual(snapshot, item)` returns `true` → returns `noChange`
- **Item C (`_id: 'c'`):** no changes → returns `noChange`

`noChange` causes lit's `repeat()` directive to skip updating those items entirely. **Items B and C are completely untouched.**

### Step 4: Changed Item A's Content Callback
For item A, the each directive calls `this.eachCondition.content(templateData, key)`, which triggers `evaluateEach`'s content callback in `renderer.js` (lines 268-275):

```javascript
content: (eachData, eachKey) => {
    data = { ...this.data, ...eachData };
    return this.renderContent({ ast: value, data, key: eachKey });
}
```

### Step 5: Subtree Cache Hit
`renderContent()` (line 695 of `renderer.js`) computes a `contentID` from `hashCode({ ast, key: 'a' })` and finds the existing cached subtree LitRenderer via `WeakRef`. It calls `existingTree.cachedRender(data)`.

### Step 6: cachedRender → dataVersion Bump
`cachedRender(data)` (line 80) updates the subtree's data and calls `bumpDataVersion()`, which increments the subtree's `dataVersion` signal. This signal is tracked by `reactiveData` directives inside the subtree's `litTemplate`.

`cachedRender` returns `this.litTemplate` — the **same TemplateResult object** created during the initial render.

### Step 7: Lit Processes the TemplateResult
Lit's `repeat()` directive receives the TemplateResult for item A. Since the key ('a') matches between old and new arrays (head-match), lit calls `setChildPartValue(oldPart, newValue)`.

Lit's `_commitTemplateResult` (line 1004 of `lit-html.js`) checks whether the template structure matches:
```javascript
if (this._$committedValue?._$template === template) {
    this._$committedValue._update(values);  // UPDATE path — preserves DOM
}
```
It matches (same tagged template literal), so lit takes the **update path**, not the replace path. Existing DOM nodes are preserved.

### Step 8: Directive Re-invocation
`_update(values)` iterates through all parts and calls `_$setValue` for each. For the `renderTemplate` directive part, lit calls `resolveDirective()` which reuses the existing `RenderTemplateDirective` instance and calls `directive.update(part, props)` → `directive.render(args)`.

### Step 9: RenderTemplateDirective.render()
`render()` is called again. It:
1. Calls `watchChanges()` — creates a **new Reaction** (line 26), overwriting `this.reaction` without stopping the old one (**reaction leak**)
2. Calls `maybeCreateTemplate()` — the **guard at line 106** detects that `this.templateID === template.id` and **returns early** without cloning

### Step 10: Template Reuse
Since `maybeCreateTemplate()` returns early, the existing Template instance is preserved. `renderTemplate()` (line 73) updates the Template's data context and calls `template.render()`, which re-renders with the updated data. The DOM is updated in-place; no destruction occurs.

---

## Why the Test Passes

The guard at line 105-108 of `render-template.js` is the critical protection:

```javascript
// reuse existing clone if template definition hasn't changed
if (this.template && this.templateID === template.id) {
    return;
}
```

This prevents `template.clone()` from being called on every data update, which would destroy and recreate the Template (with new state, new events, new LitRenderer, new DOM).

Combined with the **snapshot optimization** in `reactive-each.js`, unchanged items are completely skipped, and changed items have their subtemplates updated in-place without DOM destruction.

---

## Identified Issues (Not Causing Test Failure)

### 1. Reaction Leak in `render()`

Every time lit re-invokes `RenderTemplateDirective.render()`, `watchChanges()` creates a new `Reaction.create()` without stopping the previous one. The old reaction reference is overwritten but the reaction itself continues running.

**Impact:** Memory leak; multiple reactions fire for the same directive, causing redundant `renderTemplate()` calls.

**Fix pattern:** Add a guard like `reactive-async.js` does (line 22-24):
```javascript
render(...) {
    // Reuse existing reaction
    if (this.reaction) {
        return noChange;  // or update data and return existing render
    }
    ...
}
```

### 2. Double Update Path

When item A changes, two update mechanisms fire:
1. **Synchronous:** `cachedRender` → lit processes TemplateResult → `RenderTemplateDirective.render()` → `renderTemplate()`
2. **Asynchronous:** `bumpDataVersion()` → triggers the reaction in `watchChanges()` → `maybeCreateTemplate()` + `renderTemplate()`

The subtemplate renders twice per data change. The second render is redundant.

### 3. `watchChanges()` Reaction Dependencies

The reaction in `watchChanges()` tracks `dataVersion` through `getTemplate()` → `evaluateExpression()` → `this.dataVersion.get()`. This creates a coupling where any `dataVersion` bump on the parent subtree triggers the reaction, even when only the data (not the template reference) changed. The reaction was designed for detecting template switches (e.g., dynamic `{>someExpr}`) but fires for all data changes.

---

## Architecture Diagram

```
Signal change (todos.setProperty)
  │
  ▼
ReactiveEachDirective reaction fires
  │
  ├─ Item B (unchanged): isEqual → noChange → DOM untouched ✓
  ├─ Item C (unchanged): isEqual → noChange → DOM untouched ✓
  │
  └─ Item A (changed): content callback
       │
       ▼
     renderContent({ key: 'a' })
       │
       ▼
     Cached subtree found → cachedRender(data)
       │
       ├─ updateData() → bumpDataVersion() ──┐
       │                                      │ (async: reaction fires later)
       └─ returns same litTemplate            │
            │                                 │
            ▼                                 │
          lit repeat() processes item A       │
            │                                 │
            ▼                                 │
          _commitTemplateResult               │
            │                                 │
            ▼                                 │
          Template matches → _update(values)  │
            │                                 │
            ▼                                 │
          RenderTemplateDirective.render()     │
            │                                 │
            ├─ watchChanges() [LEAK: new rxn] │
            ├─ maybeCreateTemplate()          │
            │   └─ templateID matches → SKIP  │
            └─ renderTemplate()               │
                 └─ Template.render() [1st]   │
                                              │
                      ┌───────────────────────┘
                      ▼
                 Reaction fires (from bumpDataVersion)
                   ├─ maybeCreateTemplate() → SKIP (same ID)
                   └─ renderTemplate()
                        └─ Template.render() [2nd, redundant]
```

---

## Key Files

| File | Role |
|------|------|
| `packages/renderer/src/lit/directives/render-template.js` | Subtemplate directive; **line 106 guard** prevents re-cloning |
| `packages/renderer/src/lit/directives/reactive-each.js` | Each directive; **snapshot optimization** skips unchanged items |
| `packages/renderer/src/lit/renderer.js` | LitRenderer; `renderContent` caches subtrees; `cachedRender`/`bumpDataVersion` update path |
| `packages/templating/src/template.js` | Template class; `clone()` creates new instance; `setDataContext`/`render` for updates |
| `packages/renderer/src/lit/directives/reactive-async.js` | Reference for correct reaction-guard pattern (line 22-24) |
