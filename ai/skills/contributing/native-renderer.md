---
title: Native Renderer Architecture
description: How the native DOM renderer works — engine registry, rendering pipeline, marker system, the defineBlock decomposition, reactive bindings, hydration, and SSR. Load before working on the renderer or any block.
keywords: [native renderer, DOM rendering, markers, TreeWalker, reactivity, buildHTMLString, defineBlock, DynamicRegion, hydration, SSR, data-sui-bind]
audience: contributing
skill: native-renderer
type: skill
---

# Native Renderer — Architecture Reference

> **Skill:** `native-renderer`
> **Purpose:** How the native renderer works as-built. Load this before modifying `packages/renderer/src/engines/native/`, adding or editing a block, working on hydration/SSR, or touching the engine registry.

---

## What It Is

A zero-dependency DOM renderer. **Native is the default engine** — `WebComponentBase` extends `HTMLElement` directly. There is no LitElement involvement on the native path; the Lit removal plan is complete (archived at `ai/plans/archive/lit-removal.md`).

Engines are pluggable via a tiny registry:

```js
import { registerEngine, getEngine } from '@semantic-ui/renderer';
registerEngine('native', { renderer, serverRenderer, factory });
```

`defineComponent({ renderingEngine: 'native' })` (the default) looks the engine up here. Lit is an optional engine — it registers itself when imported and components opt in via `renderingEngine: 'lit'`.

The renderer lives across a small set of files:

```
packages/renderer/src/
├── build-html-string.js      # Pure assembly + classification, shared with server
├── expression-evaluator.js   # Lisp + JS expression evaluation, shared with all engines
├── engine-registry.js        # registerEngine / getEngine
├── helpers.js                # setRecovery / setTracing globals
├── engines/
│   ├── native/
│   │   ├── renderer.js       # Renderer class — Phase 1/2/3 pipeline + hydrate
│   │   ├── server.js         # ServerRenderer — emits versioned-marker DSD
│   │   ├── dynamic-region.js # Anchored region with ownedNodes + childScopes
│   │   ├── reaction-scope.js # Hierarchical Reaction cleanup
│   │   ├── reactive-data.js  # bindAttribute / bindTextExpression / bindRawTextContent
│   │   ├── define-block.js   # defineBlock — block lifecycle + recovery + tracing
│   │   └── blocks/
│   │       ├── registry.js       # registerBlock / getBlock — Map<type, dispatch>
│   │       ├── index.js          # side-effect imports register every block
│   │       ├── conditional.js    # {#if} / {:elseif} / {:else}
│   │       ├── each.js           # {#each items as item}
│   │       ├── async.js          # {#async expr} / loading / success / error
│   │       ├── rerender.js       # {#rerender} / {#guard}
│   │       ├── template.js       # {>name} — both subtemplates AND snippets
│   │       └── sample.js         # documented template for new blocks
│   └── lit/                  # Optional engine. Imports trigger registration.
```

---

## The Rendering Pipeline

```
AST → buildHTMLString() → { htmlString, entries, snippets }
                                ↓           ↓
                          parseHTML()    bindMarkers()
                                ↓           ↓
                          DocumentFragment with markers
                                ↓
                          TreeWalker (single pass: SHOW_ELEMENT | SHOW_COMMENT)
                                ↓
                          Wire reactive bindings + DynamicRegions
                                ↓
                          Return fragment → append to shadow root
```

### Phase 1: buildHTMLString(ast, { snippets, isSVG })

**Pure function, lives in `packages/renderer/src/build-html-string.js`.** Used by both the client renderer (parse-and-bind) and the server renderer (evaluate-as-strings). All dependencies passed in; no instance state.

Walks the entire AST and produces a single HTML string with markers for every dynamic position. The browser's HTML parser handles nesting — this single-pass approach is what avoids the unclosed-tag problem an earlier split-at-block-boundaries implementation hit.

Marker types (all versioned with `MARKER_VERSION = 'v1'`):

| Position | Marker format | Constant |
|---|---|---|
| Text content | `<!--sui:v1:N-->` | `COMMENT_MARKER` |
| Block directive (open) | `<!--sui-block:v1:N-->` | `BLOCK_MARKER` |
| Block directive (close) | `<!--/sui-block:v1[:meta]-->` | — |
| Raw-text element body | `<!--sui-rawtext:v1:N-->` | `RAW_TEXT_MARKER` |
| Attribute value | `__sui<N>__` | `ATTR_MARKER_PREFIX` / `ATTR_MARKER_SUFFIX` |

Each marker has a numeric ID indexing into `entries[]`. Entries describe what each marker means — expression node + classification, or block directive node, or raw-text node list.

**Expression classification** happens during this phase via `analyzePosition(html)`. For each expression node, the accumulated HTML buffer is scanned backward to determine whether the expression is in attribute or text position. Same logic the compiler's `StringScanner.getContext()` uses.

**Snippet collection** is also in this phase, returned alongside `htmlString` and `entries` — `buildHTMLString` is pure, so the renderer collects snippets separately at construction (`Renderer.collectSnippets`).

**`data-sui-bind`** — for each element with one or more attribute markers, the assembler stamps a `data-sui-bind="attr=N[,attr=N]*"` attribute, where `N` is the first-entry ID per attribute. Prefixes encode kind: `.prop` property, `@event` event, `?attr` boolean. This is what enables the fast hydration path (see Hydration below).

**Caching:** the renderer wraps `buildHTMLString` in a `WeakMap<ast, { html, svg }>` (`buildStringCache`), keyed on the AST array. AST is immutable post-compile, so cache entries never go stale; GC follows the AST naturally. Each cached entry also carries a lazy `refRoot` getter for the legacy hydration path.

### Phase 2: parseHTML(htmlString, isSVG)

```js
const template = document.createElement('template');
template.innerHTML = htmlString;
return template.content;
```

For SVG content, wraps in `<svg xmlns="...">` before parsing to get the correct namespace.

**Cached.** `templateCache` (capped LRU, `maxSize: 1000`, `eviction: 'flush'`) holds the parsed `<template>` keyed by HTML string. Each render returns a `cloneNode(true)` of the cached content.

### Phase 3: bindMarkers(root, entries, data, scope, ast)

**Single TreeWalker pass** with `NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT`. Attribute processing happens inline (touches only the element's own attributes). Comment processing is collected and deferred to a second loop because it mutates the tree (replace/remove) and would invalidate the live walker.

Attribute classification dispatch (in `reactive-data.js#bindAttribute`):

| Binding type | Detection | DOM operation |
|---|---|---|
| Property | `.propName=__sui0__` | `element[propName] = value` |
| Event | `@click=__sui0__` | `addEventListener` + onDispose `removeEventListener` |
| Single expression | `class=__sui0__` (single marker, with optional `?` boolean) | `setAttribute` / `removeAttribute`, plus property mirror for `checked`/`selected`/`value` |
| Interpolated | `class="base __sui0__ __sui1__"` | concatenate parts, `setAttribute` |

Comment processing dispatches by marker prefix:

- `sui:v1:` (`COMMENT_MARKER`) → `bindTextExpression` — replaces comment with reactive text node (or unsafeHTML / literal handling)
- `sui-rawtext:v1:` (`RAW_TEXT_MARKER`) → `bindRawTextContent` — sets `textContent` on the raw-text element via `evaluateRawTextNodes`
- `sui-block:v1:` (`BLOCK_MARKER`) → `bindBlock` — looks up the block in the registry, builds a `DynamicRegion` from the comment, dispatches

If a comment marker's ID was already consumed by an attribute binding (the entry classification was `insideTag`), the comment is skipped. Attribute IDs are tracked in a `Set` finalized after the walk.

---

## Reactive Bindings — `reactive-data.js`

Three exports: `bindAttribute`, `bindTextExpression`, `bindRawTextContent`. Each is a single binding function (no class). All three accept `{ scope, renderer, ... }` and use `scope.reaction(node, callback)` to register.

```js
// reaction-scope.js
scope.reaction(node, (comp) => {
  // auto-stops when node is disconnected from the DOM
  // ...
});
```

`ReactionScope.reaction()` combines `reaction()` + `track` + the `isConnected` guard that every binding needed. The guard prevents Reactions from running after their DOM has been removed (e.g., after a conditional branch swap).

### Expression evaluation

Delegated to `ExpressionEvaluator` (shared across all engines). Handles Lisp-style expressions (`{formatDate date 'h:mm a'}`), JS expressions (`{value + 1}`), mixed syntax, deep property access, Signal auto-unwrapping, and helper resolution.

### Subtree propagation via `dataDep`

Every renderer holds a `Dependency` (`this.dataDep`). When a parent updates a subtemplate's data and calls `bumpDataVersion()`, the subtemplate's Reactions re-fire because `lookupExpression()` calls `this.dataDep.depend()` — but **only when `receivesData` is true** (subtemplates). Top-level component renderers skip this dep — Signal-level reactivity is enough — and the `bumpDataVersion` call becomes the explicit "I replaced the data context, re-evaluate everything" signal.

### `skipFirstWrite` flag

Hydration flag: register Signal deps on `firstRun`, but skip the DOM write. Server content is trusted. Used by `hydrateAttributes` and `hydrateTextExpression`.

---

## DynamicRegion

```js
class DynamicRegion {
  constructor(parentNode, marker)  // replaces marker with anchor text node
  anchor       // persistent empty text node at region start
  endAnchor    // empty text node at region end (created on setContent)
  ownedNodes[] // DOM nodes owned by this region
  childScopes[] // ReactionScopes for cleanup

  clear()                    // dispose scopes, remove owned nodes + endAnchor
  setContent(fragment, scope) // clear, append fragment after anchor, place endAnchor
  getLastNode()              // last owned node or anchor
}
```

The anchor stays in the DOM throughout the region's lifetime. Content is inserted between anchor and endAnchor. `endAnchor` is what `Template.isNodeInRange` uses for boundary detection — strict between-comparison needs a sentinel after the last content node.

`bindBlock` constructs the region with the comment marker (which `replaceWith`s itself out, leaving the anchor in place).

---

## ReactionScope

Hierarchical Reaction cleanup. Each scope tracks its Reactions, child scopes, and dispose callbacks.

```js
scope.track(reaction)     // track a Reaction for cleanup
scope.reaction(node, fn)  // create+track with isConnected guard
scope.child()             // create child scope, parented for unlink-on-dispose
scope.onDispose(fn)       // register cleanup callback
scope.dispose()           // stop reactions, dispose children, run disposers, unlink from parent
```

When a conditional branch swaps, the old branch's scope is disposed, stopping all Reactions and cleaning up child regions (nested async, each, etc.). Disposed scopes splice themselves out of `parent.children` to prevent unbounded accumulation across repeated swaps.

---

## Block Directives — `defineBlock`

All block directives use the same lifecycle machinery. `define-block.js` exports `defineBlock(config)` which returns a `dispatch(ctx)` function the renderer calls. Each block module registers itself: `registerBlock(astType, dispatch)`.

### Block config shape

```js
defineBlock({
  name: 'conditional',                 // human label, used in error reports
  syntax: (node) => `{#if ${node.condition}}`,
  shouldRecover: (node) => Boolean(...), // optional gate for error wrapping

  create(ctx)   { return { /* per-instance state on `self` */ }; },
  render(bag)   { /* fresh-mount path */ },
  hydrate(bag)  { /* server-DOM-trusted path */ },
  update(bag)   { /* re-fire of the block's outer Reaction */ },
  destroy(bag)  { /* invoked on scope.onDispose, region.clear() runs after */ },
  error({ err, hook, ...bag }) { /* opt-in recovery */ },

  evaluateText({ node, data, renderer }) { /* raw-text-context fallback */ },
})
```

### The author bag

Every hook receives an interned per-instance bag (same hidden-class shape across all hook calls — V8 stays happy):

```js
{ node, data, scope, region, isSVG, serverMeta,
  self,                  // mutable per-instance state from create()
  lookupExpression,      // (expr) => renderer.lookupExpression(expr, data)
  renderAST,             // ({ ast, scope?, data?, isSVG? }) => fragment
  hydrateInnerContent,   // ({ ownedNodes, innerAST, data?, scope? })
  hook, err              // populated only when error() runs
}
```

`lookupExpression`, `renderAST`, `hydrateInnerContent` are pre-bound closures over `renderer` so blocks don't need to reach through `ctx.renderer.*`.

### Lifecycle: how dispatch wires the block

```js
scope.reaction(region.anchor, (comp) => {
  if (comp.firstRun) {
    if (hydrating && hydrate) hydrate(bag);
    else                       render(bag);
  }
  else if (update) update(bag);
});

scope.onDispose(() => {
  if (destroy) destroy(bag);
  region.clear();
});
```

The block's outer Reaction tracks `region.anchor.isConnected` for auto-stop. Cleanup is layered: `destroy` first (block can do bookkeeping), then `region.clear()` (drops DOM and child scopes).

### Recovery and tracing

Two opt-in flags expose error machinery:

- `setTracing(true)` — `reportBlockError` logs structured groups (header `[sui] {name} {syntax}`, message, hook, stack). Tree-shakes when off.
- `setRecovery(true)` — wraps every hook in try/catch. Without an `error` hook, the default is `region.clear() + comp.stop()`. With one, the hook decides. `shouldRecover(node)` is an additional per-block gate (e.g. `async` skips recovery when `errorContent` is empty — nothing useful to render).

Without recovery, hook throws propagate so failures are loud — the browser logs uncaught errors with full stacks, no extra wrapping.

`destroy` throws always propagate. Stranding sibling cleanup is the trade-off — silent recovery hides destroy bugs harder than DOM leaks do.

### Per-block summary

| Block | AST type | Notes |
|---|---|---|
| `conditional.js` | `if` | Linear branch match. `matchIndex` = `MAIN_BRANCH_INDEX` (1000) for main body, ≥0 for branches. Server stamps `serverMeta.branchIndex` on the closing marker; mismatch triggers a re-render with a dev warning (env guards `isClient`/`isServer` exempted). |
| `each.js` | `each` | Keyed reconciliation with per-item `Signal` + Proxy + per-item start/end text-node markers. `WeakSet itemContextProxies` replaces the old `__isItemProxy` flag; `template.js` checks via `isItemContext()` import. Snapshot-based dirty detection avoids full deep-equality on the steady-state path. |
| `async.js` | `async` | Three states (loading / success / error). Generation counter discards stale promise resolutions. Recovery wraps sync throws and dispatches into `errorContent` via the `error` hook. |
| `rerender.js` | `rerender` | Both `{#rerender expr}` and `{#guard key}` compile to the same node type. Guard wraps tracking in `guard` (deep-equality gate); rerender uses plain `lookupExpression`. |
| `template.js` | `template` | `{>name}` — handles BOTH snippets and subtemplates. Kind detected once on first render (`renderer.snippets[name]` check) and locked on `self.kind`. |

### Snippet vs. subtemplate dispatch

`template.js` resolves once at first render:

- **Snippet** — inline expansion via `renderAST` with a snippet-arg overlay Proxy. Args become lazy getters that re-evaluate against parent data, tracking the same Signal deps a fresh-render snippet would. `update` is a no-op (snippets are one-shot at mount; inner expression reactivity is handled by per-marker Reactions wired during render).
- **Subtemplate** — full `Template.clone()` + `initialize()` + `render()` + `attach()`. Updates re-evaluate the name; if the template identity changed, swap the instance, otherwise call `setDataContext(data, { rerender: false })` + `render(data)`. **`rerender: false`** is critical — the default `rerender: true` clears `Template.rendered`, forcing a from-scratch re-render. `false` preserves it, so updates flow through `bumpDataVersion()` and existing Reactions re-fire in place.

Static `data={...}` reads inside a `{#each}` should be reactive (so item-signal mutations propagate), but outside `{#each}` should stay non-reactive. `unpackNodeData` checks `isItemContext(data)` to switch — inside, plain `lookupExpressionValue`; outside, wrapped in `nonreactive`.

---

## Hydration

The server (`ServerRenderer`) emits HTML with the same versioned markers + `data-sui-bind` stamps. The client `WebComponentBase.hydrate()` calls `Template.render()`, which routes to `renderer.hydrate()` for first-mount-from-server.

### `hydrateMarkers(root, entries, data, scope, { ast })`

Two passes:

1. **`hydrateAttributes`** — fast path when any element has `data-sui-bind`: walk SHOW_ELEMENT | SHOW_COMMENT once, track `blockDepth` from `sui-block:v1:` / `/sui-block:` comments, process `data-sui-bind` only at depth 0, let block hydrate hooks recurse via `hydrateInnerContent`. No reference DOM, no parallel walker.
   The legacy fallback (older SSR output without `data-sui-bind`) parses a reference DOM from the cached htmlString and walks both trees in parallel, skipping block-owned real elements.
2. **Comment markers (top-level only)** — walks comments at `blockDepth 0`. `sui:v1:` → `hydrateTextExpression` (splits the merged text node at the server-value boundary). `sui-block:v1:` → `hydrateBlock`.

Inner markers (inside block pairs) aren't visited by the top-level walker — block `hydrate` hooks call `hydrateInnerContent` to recurse, which rebuilds entries from the sub-AST and re-enters `hydrateMarkers` with the right entry table.

### `hydrateBlock`

Collects all DOM nodes between the opening `sui-block:v1:N` and matching `/sui-block:v1[:meta]` markers (depth-counted to handle nested blocks that share marker IDs across reset scopes). Parses any trailing metadata (e.g. `:b0` for `branchIndex`) into `serverMeta`. Builds a `DynamicRegion` pre-populated with `ownedNodes`, then calls the block's `dispatch` with `hydrating: true` and `serverMeta` — the block's `hydrate` hook owns its own subtree.

### Why `data-sui-bind` matters

Profiling identified a ~648 ms `template.innerHTML = htmlString` reparse per 100-card page in the legacy hydration path. The fast path skips that entirely — entries already carry `attributeParts` (the parsed alternating static/marker segments) from `buildHTMLString`, and the classification is on the entry itself.

---

## Data Management

```js
renderer.setData(newData)        // replace data context, re-set on evaluator
renderer.updateData(newData, { preserveExistingData, respectProtectedKeys })
renderer.bumpDataVersion()       // dataDep.changed() + notifyUpdate (coalesced microtask)
```

`notifyUpdate` is microtask-coalesced — multiple async resolutions or data bumps in the same tick fire `template.onUpdated()` once.

---

## SSR Pipeline

`renderToString()` in `packages/component/src/render-to-string.js` orchestrates server render. `expandCustomElements()` walks the input markup and recursively renders each registered component into Declarative Shadow DOM (`<template shadowrootmode="open">`). The rendered HTML carries the same versioned markers and `data-sui-bind` stamps the client expects.

`ServerRenderer` lives at `packages/renderer/src/engines/native/server.js`. It evaluates AST nodes inline as strings — no DOM. Block-shaped nodes dispatch to per-block server logic that emits open/close marker pairs around their evaluated content; closing markers carry metadata where the client needs it (e.g. `:b<branchIndex>` for `{#if}`, `sui-each-item:v1:KEY` for per-item `{#each}` keys).

Hydration entry point: `WebComponentBase.hydrate()` (`packages/component/src/engines/native/base.js`).

A post-hydration cleanup pass strips comment markers and `data-sui-bind` attributes, deferred to a `requestAnimationFrame` so it doesn't block paint.

---

## Test Infrastructure

Tests live in `packages/renderer/test/browser/`. Tests using `RENDERING_ENGINES.forEach(engine => ...)` run against both engines:

```js
// test-utils.js
export const RENDERING_ENGINES = ['lit', 'native'];
```

Key test files:

- `html-output.test.js` — structural conformance (exact DOM output comparison)
- `attribute-bindings.test.js` — reactive attribute/property/event bindings
- `cleanup-reactions.test.js` — Reaction cleanup on branch swap / item removal
- `subtree-each.test.js`, `subtree-rerender.test.js`, `subtree-misc.test.js` — block-specific reactivity
- `subtree-caching.test.js` — subtemplates in each, focus preservation, lifecycle, settings
- `subtree-spurious.test.js` — isolation (changing one binding doesn't re-evaluate others)
- `ssr-hydration.test.js` — server output adoption, mismatch warnings
- `lifecycle-promises.test.js`, `node-types.test.js`, `component-contract.test.js`, `helpers.test.js`, `renderer.test.js` — additional surface

Run from the package directory:
```bash
cd packages/renderer && npm test
```

Single-file: `npm test -- attribute-bindings`. Note: `-t` filters report non-matching tests as "skipped" — confusing; prefer file-level filters when possible.

---

## Adding a New Block

1. Copy `packages/renderer/src/engines/native/blocks/sample.js` to a new file.
2. Implement the hooks you need. Most blocks need `create` + `render` + `hydrate` + `update`.
3. `registerBlock('your-ast-type', yourDispatch)` at the bottom.
4. Add a side-effect import to `blocks/index.js` so the registration runs.
5. Add at least one server-side render path if the block needs to participate in SSR (per-block server logic in `server.js`).
6. Add tests under `packages/renderer/test/browser/` covering both engines unless the block is native-only.

---

## Related Plans

| Plan | Use when... |
|------|-------------|
| **Native SSR** (`ai/plans/archive/native-ssr.md`) | Server-side rendering and hydration changes |
| **Renderer Refinement** (`ai/plans/archive/native-renderer-refinement.md`) | Performance, code quality, architectural purity |
| **Native Renderer Blocks** (`ai/plans/archive/native-renderer-blocks.md`) | Block-level concerns (drove the `defineBlock` decomposition) |
| **Fine-Grained Reactivity** (`ai/plans/active/fine-grained-reactivity.md`) | Selective `dataDep` tracking, cutting subscription overhead |
| **Lit Removal** (archived) | Historical context — `ComponentBase` extends `HTMLElement` is shipped |
