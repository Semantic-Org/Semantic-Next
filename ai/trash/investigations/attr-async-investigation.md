# Investigation: Test 13 Failure - Attribute-Driven Re-render with Async

## Test Summary

**File:** `packages/renderer/test/browser/subtree-caching.test.js`
**Test:** "13. Attribute-driven re-render with async" -> "should preserve async content when a setting attribute changes"

The test defines a component with:
- `defaultSettings: { label: 'initial' }`
- An `{#async formatLabel as result}` block where `formatLabel(lbl = settings.label)` returns a formatted string after a 50ms delay
- After initial render + resolution, it changes the attribute via `el.setAttribute('label', 'updated')`
- Expects: old content preserved while new promise is pending, then new content after resolution

**Failing assertion:** Line 413 - `expect(shadowText(el)).toContain('formatted:updated')` after 100ms wait
**Actual value:** `<span>formatted:initial</span>` - the new content never appears

## Comparison: Test 1 (passing) vs Test 13 (failing)

| Aspect | Test 1 (passes) | Test 13 (fails pre-fix) |
|--------|-----------------|------------------------|
| Trigger | `state.darkMode.set(true)` | `el.setAttribute('label', 'updated')` |
| Wrapper | `{#rerender darkMode}` wraps `{#async}` | Standalone `{#async}` |
| Reactive source | State signal (directly tracked) | Settings shadow signal (proxy-mediated) |
| Re-render path | Rerender directive -> `content()` -> `cachedRender` -> `bumpDataVersion()` | Settings signal -> invalidates async reaction directly |

## The Fix: Commit `9d0bf455`

**Message:** "When async reloads without {loading} preserve content until promise"

Three changes in `reactive-async.js`:

### 1. Removed eager `resolvedValue` clearing

```diff
  handleExpressionResult(result, asyncCondition) {
    const currentGeneration = ++this.generation;
-   // Reset state
+   // Preserve previous resolved value for stale-while-revalidate
    this.state = 'loading';
-   this.resolvedValue = null;
    this.error = null;
```

**Before:** When a new expression result arrived (due to reactive change), `resolvedValue` was immediately nullified. This destroyed the stale value that could be shown while the new promise is pending.

**After:** `resolvedValue` is preserved during loading. It is only cleared on error (moved to `.catch` handler).

### 2. Moved `resolvedValue = null` to error handler only

```diff
  .catch((error) => {
    if (currentGeneration < this.generation) { return; }
    this.state = 'error';
+   this.resolvedValue = null;
    this.error = error;
```

### 3. Added stale-while-revalidate in loading state

```diff
  case 'loading':
    if (asyncCondition.loadingContent) {
      return asyncCondition.loadingContent();
    }
+   // No loading block: preserve previous content if available
+   if (this.resolvedValue !== null && asyncCondition.content) {
+     const successData = this.createSuccessDataContext(asyncCondition);
+     return asyncCondition.content(successData);
+   }
    return noChange;
```

**Before:** When no `{loading}` block was defined, `renderCurrentState` returned `noChange` during loading. Combined with the nullified `resolvedValue`, there was no way to show stale content.

**After:** If `resolvedValue` is still available (not null) and no explicit loading block exists, the directive renders the previously resolved content. This implements stale-while-revalidate semantics.

## Root Cause Analysis

### The reactive pathway works correctly

The attribute change DOES trigger the async reaction:

1. `el.setAttribute('label', 'updated')` fires `attributeChangedCallback` synchronously
2. `super.attributeChangedCallback` sets `this.label = 'updated'` via Lit's property system
3. `adjustPropertyFromAttribute` reaches the no-componentSpec path (line 249):
   ```js
   if (!componentSpec && properties?.[attribute]) {
       setSetting(attribute, attributeValue);
   }
   ```
4. `setSetting` triggers the settings proxy SET trap, which calls `signal.set('updated')` on the shadow signal for `label`
5. The signal change invalidates the async directive's reaction (which subscribed to this signal during its first run via `settings.label` in the default parameter of `formatLabel`)
6. The reaction is scheduled and runs during `Reaction.flush()`

### The actual failure: new content never renders

The reaction re-runs and starts a new promise with the updated value. However, in the pre-fix code, the combination of:

1. `this.resolvedValue = null` in `handleExpressionResult` (destroys stale value)
2. `return noChange` in the loading state (no stale content to show)
3. The Lit re-render cycle (triggered by `super.attributeChangedCallback`'s `requestUpdate()`)

creates a scenario where the async directive's `this.setValue()` call from the reaction propagates `noChange`, and then when the promise resolves 50ms later, the subsequent `this.setValue(rendered)` call commits the new template result. However, the template result from `renderCurrentState -> asyncCondition.content(successData)` renders the content subtree via `renderContent`, which uses the subtree cache. The cached subtree's `cachedRender` updates data and bumps `dataVersion`, but the reactive data expressions within the subtree may not properly propagate through the Lit part tree after the intervening Lit update cycle has re-committed the root template.

**In essence:** The pre-fix code path creates a state where `resolvedValue` is null during loading, the `renderCurrentState` returns `noChange`, and the interplay between the reaction's `setValue(noChange)` and the subsequent Lit re-render creates a condition where the promise resolution's `setValue(rendered)` either doesn't reach the DOM or gets overwritten.

### Why Test 1 is immune

Test 1 wraps the async block in `{#rerender darkMode}`. When the state changes:
- The rerender directive fires and calls `content()` which triggers `cachedRender` on the subtree
- `cachedRender` calls `bumpDataVersion()` which ensures the data expressions in the subtree are refreshed
- The async directive within the rerender block benefits from this explicit subtree re-evaluation
- The rerender directive's `setValue()` commits fresh content through a clean path

In Test 13, the standalone async directive relies entirely on its own reaction and `setValue()` to update the DOM, without the intermediate rerender directive to orchestrate the subtree update.

## Verification

The fix has been committed (`9d0bf455`) and all 17 tests in `subtree-caching.test.js` pass, including Test 13.

```
Test Files  1 passed (1)
     Tests  17 passed (17)
```

## Key Files

- `packages/renderer/src/lit/directives/reactive-async.js` - The async directive (fixed)
- `packages/renderer/src/lit/directives/reactive-rerender.js` - Rerender directive (comparison)
- `packages/renderer/src/lit/renderer.js` - `evaluateAsync`, `renderContent`, subtree caching
- `packages/component/src/web-component.js` - Settings proxy with shadow signals
- `packages/component/src/helpers/adjust-property-from-attribute.js` - Attribute -> settings sync
- `packages/component/src/define-component.js` - `attributeChangedCallback` orchestration
