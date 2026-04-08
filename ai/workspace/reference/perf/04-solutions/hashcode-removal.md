# Remove hashCode from Native Renderer Constructor

## Status: Ready to implement

## Problem

The native `Renderer` constructor (line 58 of `renderer.js`) assigns `this.id = ++Renderer._nextId`. This was changed from the original `hashCode({ ast, data, isSVG })` call which cost ~1.4ms per construction due to FNV-1a hashing over JSON-serialized AST+data objects.

However, the current sequential ID implementation is also broken: `Renderer._nextId` is never initialized as a static property, so `++undefined` evaluates to `NaN`. Every native Renderer instance has `this.id = NaN`.

## Analysis

### Where is `this.id` read?

**Native Renderer:** Nowhere. Exhaustive search confirms:
- `this.id` is assigned on line 58 and never read by any code path
- No test asserts on `Renderer.id`
- No external code accesses `.renderer.id`
- The `template.id` references on lines 868, 871, 928, 1011, 1013 all refer to `Template.id` (from `@semantic-ui/templating`, set via `generateID()`), not `Renderer.id`
- `hashCode` is still imported but only referenced in a comment (line 53)

**Lit Renderer:** Two consumers:
1. **Constructor** (line 59): `this.id = LitRenderer.getID({ ast, data, isSVG })` — stored on instance
2. **`renderContent()`** (line 448): `LitRenderer.getID({ ast, key, position, isSVG })` — used as cache key for subtree WeakRef deduplication in `this.renderTrees[contentID]`

The Lit renderer's `this.id` (assigned in constructor) is itself never read by external code either. The only `getID` call that matters is the one in `renderContent()`, which computes a fresh `contentID` from the subtree's AST/key/position — it does not use the parent's `this.id`.

### LitRenderer.getID also has dead parameters

```javascript
static getID({ ast, key, position, isSVG } = {}) {
    if (key !== undefined) return hashCode({ ast, key });
    if (position !== undefined) return hashCode({ ast, position });
    return hashCode({ ast });
}
```

- `isSVG` is destructured but never included in any hash computation
- The constructor passes `data` which isn't even in the destructuring — completely ignored
- Only `ast`, `key`, and `position` affect the hash

### Why does the Lit renderer need subtree caching?

The Lit renderer creates a new `LitRenderer` subtree instance for every conditional branch, each-loop iteration, snippet invocation, and SVG block. Without caching, re-renders would reconstruct Lit tagged template literals from scratch, losing Lit's internal DOM diffing state. The `renderTrees` WeakRef map (keyed by `contentID`) lets `renderContent()` return `existingTree.cachedRender(data)` — updating data in place without reconstructing the Lit template.

The native renderer does not have this problem. It uses `DynamicRegion` and `ReactionScope` for fine-grained DOM updates rather than subtree re-creation, so there is no equivalent caching layer to key into.

### Additional dead code: `hashCode` import

The native renderer imports `hashCode` from `@semantic-ui/utils` (line 8) but never calls it. The only reference is in a comment on line 53.

### Additional dead code: `__hydPerf` instrumentation

The `eval()` method (lines 88-99) contains `performance.now()` timing and `globalThis.__hydPerf` accumulation. This is debug instrumentation left from profiling work — it adds two `performance.now()` calls per expression evaluation and a global object mutation. Not related to `hashCode` but worth noting as adjacent cleanup.

## Recommendation: Remove `this.id` and unused `hashCode` import from native Renderer

### What to change

1. **Remove line 58** (`this.id = ++Renderer._nextId`) from the native Renderer constructor
2. **Remove `hashCode` from the import** on line 8 (it is not called anywhere)
3. **Remove the explanatory comment** on lines 52-57 (references the removed code)

### What NOT to change

- **LitRenderer.getID** and its `this.id` assignment — the `getID` method is actively used by `renderContent()` for subtree caching. The constructor's `this.id` is technically dead but removing it could break assumptions if external code ever inspects renderer identity. Low risk to leave; zero cost since the hash is already computed for `renderContent`.
- **LitRenderer.getID's dead `isSVG` parameter** — cosmetic cleanup, not a perf issue, and changing the signature could break callers.

### Performance impact

The sequential ID (`++Renderer._nextId`) is nearly free — a single increment. But it's dead code that produces `NaN`, which is worse than useless: it signals intent that doesn't exist. Removing it eliminates one property allocation per Renderer instance and removes a misleading import.

The real win was the prior change from `hashCode({ ast, data, isSVG })` to the sequential ID, which eliminated ~1.4ms of JSON serialization + FNV-1a hashing per Renderer construction. That win is already captured. This cleanup removes the vestigial remnant.

### Secondary cleanup opportunity

The `hashCode` removal unblocks removing the entire `@semantic-ui/utils` `hashCode` import if no other call sites exist in this file. After the edit, the import line should be updated to exclude `hashCode`.

## Files

| File | Change |
|------|--------|
| `packages/renderer/src/engines/native/renderer.js:8` | Remove `hashCode` from import |
| `packages/renderer/src/engines/native/renderer.js:52-58` | Remove comment block and `this.id` assignment |
