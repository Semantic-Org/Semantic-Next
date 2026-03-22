# Snippet Position Investigation: Test 15c3

## Summary

Test 15c3 ("Same snippet called at multiple call sites") was initially observed as failing but is now passing. The position-based caching approach is logically correct. The initial failure was caused by a **stale Vite transformation cache** that served a version of the template compiler without the `position` assignment in `optimizeAST`.

## The Test

Defines one snippet and invokes it twice at the top level with different reactive data:

```
{#snippet label}<span>[{text}]</span>{/snippet}
{>label text=getTitle}
{>label text=getSubtitle}
```

After `state.version.set(1)`, both call sites must show their own distinct updated content.

## The Fix (Now Committed)

Three coordinated changes across two commits (`62c7245e`, `1c9cf17b`) replace the `cache: false` snippet workaround with position-based cache disambiguation:

1. **`packages/compiler/src/template-compiler.js`** -- `optimizeAST` assigns a monotonically increasing `position` integer to every non-HTML AST node. A shared counter object `{ index: 0 }` is passed through recursive calls so positions are globally unique within a template.

2. **`packages/renderer/src/lit/renderer.js`** -- Three changes:
   - `evaluateSnippet`: Changed `cache: false` to `position: node.position`
   - `renderContent`: Accepts `position` parameter, passes it to `getID`
   - `getID`: When `position !== undefined`, hashes `{ ast, position }` instead of just `{ ast }`

## Why the Position Approach Works

Both snippet invocations share the same `ast` reference (`snippet.content`), but their template call-site nodes have different positions (e.g., 2 and 3). `hashCode({ ast, position: 2 })` and `hashCode({ ast, position: 3 })` produce different IDs (verified: 3213803031 vs 3281060602). Each call site gets its own cached `LitRenderer` subtree with its own data context.

## Why It Initially Appeared to Fail

The first test run returned `<span>[Sub-A]</span><span>[Sub-A]</span>` for both positions. Root cause:

1. Vite's transformation cache held a stale version of the compiler where `optimizeAST` did NOT assign positions
2. At runtime, AST nodes had `position: undefined`
3. `getID` fell through to `hashCode({ ast })` (no position disambiguation)
4. Both snippet calls produced **identical cache IDs** (same AST reference)
5. The second call hit the cache, called `cachedRender(data2)` on the first tree, overwriting its data
6. Both positions rendered `[Sub-A]`

Modifying the renderer source invalidated Vite's cache. Fresh transformation picked up the committed compiler changes, and the test passed.

## Current Test Results

16 of 17 tests pass. The only failure is test 13 ("Attribute-driven re-render with async") -- unrelated to snippet caching. That test fails because the async directive doesn't re-evaluate when a component setting changes via `setAttribute()`.

## Potential Gaps in `optimizeAST`

The position counter doesn't recurse into all AST sub-arrays:

| Sub-array | Processed? | Risk |
|-----------|-----------|------|
| `node.content` | Yes (counter shared) | None |
| `node.branches[].content` (if/else) | **No** | Nodes inside if/else branches get no position |
| `node.elseContent` (each) | **No** | Nodes inside each-else get no position |
| `node.loadingContent` (async) | **No** | Nodes inside async loading get no position |
| `node.errorContent` (async) | **No** | Nodes inside async error get no position |
| `node.else.content` (legacy path) | Yes, but counter resets | Position collisions possible |

These gaps don't affect 15c3 but could cause cache collisions for templates that invoke the same snippet from inside different conditional or async branches. A comprehensive fix would extend `optimizeAST` to recurse into `branches`, `elseContent`, `loadingContent`, and `errorContent` while sharing the same position counter.
