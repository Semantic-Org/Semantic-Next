# Snippet Position Fix: Investigation Findings

## The Failing Test

**Test:** `15c3. Same snippet called at multiple call sites` in `packages/renderer/test/browser/subtree-caching.test.js`

```
{#snippet label}<span>[{text}]</span>{/snippet}
{>label text=getTitle}
{>label text=getSubtitle}
```

**Expected:** `[Title-A]` and `[Sub-A]` rendered distinctly.
**Actual:** `<span>[Sub-A]</span><span>[Sub-A]</span>` -- both show the second invocation's data.

## Root Cause

The subtree cache in `LitRenderer.renderContent()` uses `getID({ ast, key, position })` to compute cache keys. When two snippet call sites reference the same snippet, both pass `snippet.content` (the same AST reference) to `renderContent`. Without a distinguishing `key` or `position`, both produce the same cache ID:

```javascript
static getID({ ast, key, position, isSVG } = {}) {
    if (key !== undefined) return hashCode({ ast, key });
    if (position !== undefined) return hashCode({ ast, position });
    return hashCode({ ast });  // <-- both snippet calls land here
}
```

The second call finds the first's cached subtree, calls `cachedRender(data)`, which overwrites the first subtree's data with the second invocation's data. Both DOM positions then reflect the second invocation's content.

## Why the Attempted Fix Doesn't Work

The position feature was added to `optimizeAST` in the **wrong file**:

| File | Has position code | Used at runtime |
|------|:-:|:-:|
| `packages/templating/src/compiler/template-compiler.js` | Yes | **No** |
| `packages/compiler/src/template-compiler.js` | No | **Yes** |

The `@semantic-ui/templating` package re-exports `TemplateCompiler` from `@semantic-ui/compiler` (see `packages/templating/src/index.js` line 1). The `Template` class also imports from `@semantic-ui/compiler` (see `packages/templating/src/template.js` line 23). The modified file in `packages/templating/src/compiler/` is a pre-refactoring copy that is never imported.

**Additionally**, the browser test environment uses the `"browser"` export condition from `package.json`, which points to `dist/bundle/index.min.js`. This dist bundle was built before the position change and also lacks it. Even if the source file were corrected, the dist would need rebuilding for browser tests.

### Verified via debug logging

Injecting `console.log` into `evaluateSnippet` confirmed:
- `node.position` is `undefined` for all AST nodes
- `Object.keys(node)` returns only `["type", "name", "reactiveData"]` -- no `position`
- The packed data resolves correctly: `Title-A` for the first call, `Sub-A` for the second
- But both share the same cache entry, so the second overwrites the first

## Is the Position Approach Fundamentally Sound?

**It works mechanically** -- if positions were actually assigned, `getID` would produce distinct hashes and each call site would get its own subtree. But there are architectural concerns:

1. **Cross-package coupling.** The renderer's caching correctness depends on a compiler output detail (the `position` property). If any AST transformation strips or fails to propagate positions, caching breaks silently.

2. **Overkill.** Position is assigned to ALL non-html nodes, but only snippet call sites need disambiguation (other cases already have unique ASTs or use `key`).

3. **Fragile propagation.** The `position` must be passed through `evaluateSnippet` -> `renderContent` -> `getID`. Any intermediate step that drops it (like the current `renderContent` not destructuring `inheritsData`) creates a failure path.

## Alternative: Renderer-Level Call Index

The renderer already has `_contentCallIndex` (initialized in `resetHTML()` but never used). A simpler fix:

```javascript
renderContent({ ast, data, key, position, cache = true, isSVG = this.isSVG } = {}) {
    if (cache && LitRenderer.useSubtreeCache) {
      // Use call index as fallback position for cache disambiguation
      if (position === undefined && key === undefined) {
        position = this._contentCallIndex;
      }
      this._contentCallIndex++;
      const contentID = LitRenderer.getID({ ast, key, position, isSVG });
```

**Advantages:**
- Self-contained in the renderer (no compiler dependency)
- Works for any future case where the same AST appears at multiple call sites
- No cross-package coupling
- Already half-prepared (`_contentCallIndex` exists)
- Deterministic: AST traversal order is stable, so indices are stable

**The `_contentCallIndex` is fine even though `render()` is only called once** -- the subtrees are created during that single initial render pass and then cached. Subsequent updates go through `cachedRender`/`bumpDataVersion`, which don't re-walk the AST.

## Minimum Viable Fix

**If keeping the compiler approach:** Apply the diff to `packages/compiler/src/template-compiler.js` (the file that's actually imported), then rebuild the dist bundles.

**If switching to the renderer approach:** Use `_contentCallIndex` in `renderContent` as shown above. No compiler or bundle changes needed.

## Files Referenced

- `/home/jack/semantic/next/packages/renderer/test/browser/subtree-caching.test.js` -- the test
- `/home/jack/semantic/next/packages/compiler/src/template-compiler.js` -- the REAL compiler (missing position)
- `/home/jack/semantic/next/packages/templating/src/compiler/template-compiler.js` -- stale copy (has position, unused)
- `/home/jack/semantic/next/packages/renderer/src/lit/renderer.js` -- renderer with `getID`, `renderContent`, `evaluateSnippet`
- `/home/jack/semantic/next/packages/templating/src/index.js` -- re-exports from `@semantic-ui/compiler`
- `/home/jack/semantic/next/packages/templating/src/template.js` -- imports from `@semantic-ui/compiler`
