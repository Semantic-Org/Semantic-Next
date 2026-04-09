---
title: Native Renderer Architecture
description: How the native DOM renderer works — the rendering pipeline, marker system, reactivity wiring, and key implementation details. Load before working on the renderer, Lit removal, SSR, or refinement tasks.
keywords: [native renderer, DOM rendering, markers, TreeWalker, reactivity, buildHTMLString, bindMarkers, DynamicRegion]
audience: contributing
skill: native-renderer
type: skill
---

# Native Renderer — Architecture Reference

> **Skill:** `native-renderer`
> **Purpose:** How the native renderer works as-built. Load this before modifying `packages/renderer/src/native/` or working on Lit removal, SSR, or renderer refinement.

---

## What It Is

A zero-dependency DOM renderer that replaces Lit's rendering layer. Selected via `renderingEngine: 'native'` in `defineComponent`. Passes the same 573-test behavioral suite as the Lit renderer.

The renderer lives in `packages/renderer/src/native/renderer.js` (~650 lines) with two supporting files: `dynamic-region.js` (~40 lines) and `reaction-scope.js` (~30 lines).

**Important:** Components using `renderingEngine: 'native'` still use `LitElement` as their web component base class. The `renderingEngine` setting only controls which renderer `Template.initialize()` creates. The Lit removal plan (`ai/plans/lit-removal.md`) addresses the base class separately.

---

## The Rendering Pipeline

```
AST → buildHTMLString() → { htmlString, entries }
                                ↓           ↓
                          parseHTML()    bindMarkers()
                                ↓           ↓
                          DocumentFragment with markers
                                ↓
                          TreeWalker finds markers
                                ↓
                          Wire reactive bindings + DynamicRegions
                                ↓
                          Return fragment → append to shadow root
```

### Phase 1: buildHTMLString(ast)

Walks the entire AST and produces a single HTML string with markers for all dynamic positions. This is the key architectural decision — ALL AST nodes (HTML, expressions, AND block directives) are assembled into one string. The browser's HTML parser handles nesting.

**Why single-pass matters:** An earlier implementation split HTML at block directive boundaries, parsing each fragment independently via `template.innerHTML`. This produced unclosed tags — `<div>{#if show}content{/if}</div>` would parse `<div>` as `<div></div>` (auto-closed), with the if-content as a sibling. The single-pass approach avoids this entirely.

Three marker types:

| Position | Marker format | Example |
|---|---|---|
| Text content | HTML comment | `<!--sui:0-->` |
| Attribute value | String token | `__sui0__` |
| Block directive | HTML comment | `<!--sui-block:0-->` |

Each marker has a numeric ID corresponding to an index in the `entries` array. The entries array describes what each marker means — expression node + classification, or block directive node.

**Expression classification** happens during this phase via `analyzePosition(htmlBuffer)`. For each expression node, the accumulated HTML buffer is scanned backward to determine if the expression is inside an HTML tag (attribute position) or between tags (text position). This is the same logic as `StringScanner.getContext()` in the template compiler.

**Snippet registration** also happens here — `{#snippet name}` nodes are stored in `this.snippets` immediately so they're available when `{>name}` references are encountered later in the same pass.

**Side effect warning:** `buildHTMLString` mutates `this.snippets`. The refinement plan calls for making it pure by returning snippets as part of the output.

### Phase 2: parseHTML(htmlString)

```js
const template = document.createElement('template');
template.innerHTML = htmlString;
return template.content;
```

One `innerHTML` call. The browser parses the full HTML string, including all markers, preserving correct nesting. Block directive comments (`<!--sui-block:N-->`) end up as children of whatever element they were inside in the source template.

For SVG content, wraps in `<svg xmlns="...">` before parsing to get correct namespace.

**Not cached.** Every `readAST` call re-parses. The refinement plan calls for caching parsed templates keyed by HTML string and cloning per instance.

### Phase 3: bindMarkers(root, entries, data, scope)

Two TreeWalker passes over the parsed DOM:

**Pass 1 — Attribute markers:** `NodeFilter.SHOW_ELEMENT` walker. For each element, scan attributes for `__suiN__` tokens. Parse attribute values into parts (static strings + marker IDs). Create reactive bindings:

| Binding type | Detection | DOM operation |
|---|---|---|
| String attribute | Quoted: `class="__sui0__"` | `element.setAttribute(name, value)` |
| Multi-expression | `class="base __sui0__ __sui1__"` | Concatenate parts, `setAttribute` |
| Boolean/ifDefined | Unquoted: `disabled=__sui0__` | `setAttribute` or `removeAttribute` |
| Property | `.propName=__sui0__` | `element[propName] = value` |
| Event | `@click=__sui0__` | `element.addEventListener(name, handler)` |

**Pass 2 — Comment markers:** `NodeFilter.SHOW_COMMENT` walker. For each comment starting with `sui:` (text expression) or `sui-block:` (block directive):

- Text expressions: replace comment with a reactive text node
- Block directives: call the appropriate handler (`createConditional`, `createEach`, etc.)

**Important capture pattern:** The element walker uses `let el; while ((el = walker.nextNode()))` and then `const element = el` inside the loop body. This captures the element reference per-iteration for the Reaction closures. Without this, all Reactions would reference the same (last) element.

---

## Reactive Bindings

Each binding is a single `Reaction.create()` — one object per binding.

```js
scope.track(Reaction.create((comp) => {
  if (!comp.firstRun && !textNode.isConnected) { comp.stop(); return; }
  const value = this.eval(exprNode.value, data);
  textNode.data = value ?? '';
}));
```

### The `eval()` method

```js
eval(expression, data) {
  this.dataVersion.get();
  return this.evaluator.lookupExpressionValue(expression, data);
}
```

Every Reaction reads `this.dataVersion` to enable subtree propagation. When a parent calls `bumpDataVersion()` on a subtemplate's renderer, the subtemplate's Reactions re-fire because they track its `dataVersion`. This is how `setDataContext` + `render` on a subtemplate causes its DOM to update.

**Known overhead:** For top-level components, `dataVersion` never changes — the `get()` call adds a dependency that never fires. The refinement plan addresses this with selective tracking.

### The isConnected guard

Every Reaction checks `!comp.firstRun && !node.isConnected` and calls `comp.stop()` if the DOM node is disconnected. This prevents Reactions from running after their DOM has been removed (e.g., after a conditional branch swap).

### Expression evaluation

Delegated to `ExpressionEvaluator` (shared with LitRenderer). The evaluator handles Lisp-style expressions (`{formatDate date 'h:mm a'}`), JS expressions (`{value + 1}`), mixed syntax, deep property access, Signal auto-unwrapping, and helper function resolution.

---

## Block Directives

All block directives use `DynamicRegion` for DOM management.

### DynamicRegion

```js
class DynamicRegion {
  constructor(parentNode, referenceNode) // parentNode and referenceNode from old API, mostly unused now
  anchor        // persistent empty text node (or could be the comment marker — see refinement plan)
  ownedNodes[]  // DOM nodes owned by this region
  childScopes[] // ReactionScopes for cleanup

  clear()                    // dispose scopes, remove owned nodes
  setContent(fragment, scope) // clear old content, insert new after anchor
  getLastNode()              // last owned node or anchor
}
```

**Persistent anchor:** The anchor stays in the DOM throughout the region's lifetime. Content is inserted after it. On `clear()`, owned nodes are removed but the anchor stays, preserving position for future content insertion.

**Current implementation detail:** `bindBlockDirective` creates a new text node and replaces the comment marker with it (`marker.replaceWith(region.anchor)`). The refinement plan suggests reusing the comment as the anchor directly.

### ReactionScope

Hierarchical Reaction cleanup. Each scope tracks its Reactions, child scopes, and dispose callbacks.

```js
scope.track(reaction)     // track a Reaction for cleanup
scope.child()             // create child scope
scope.onDispose(fn)       // register cleanup callback
scope.dispose()           // stop all Reactions, dispose children, call disposers
```

When a conditional branch swaps, the old branch's scope is disposed, stopping all Reactions and cleaning up child regions (including nested async, each, etc.).

### Conditional ({#if})

Creates a DynamicRegion. A Reaction evaluates the condition, tracks the current branch index, and calls `readAST` for the matching branch content. Branch swap: `region.setContent(newFragment, newScope)` clears old content and inserts new.

### Each ({#each})

Keyed list reconciliation with per-item reactive data channels.

**Item map:** `Map<key, { nodes[], itemSignal, scope }>`. Each item gets a Signal holding its data context and a Proxy that layers item data over parent data.

**The item data Proxy:**
```js
new Proxy(parentData, {
  get(target, prop) {
    if (prop === '__isItemProxy') return true; // flag for reactive context detection
    const itemData = itemSignal.value; // establishes dependency on itemSignal
    if (prop in itemData) return itemData[prop];
    return target[prop]; // fall through to parent
  }
})
```

When the each Reaction fires with new items, existing items get `itemSignal.set(newEachData)`. The Signal's `isEqual` check prevents propagation if the data didn't change. New items get fresh renders. Removed items get `scope.dispose()` + node removal.

**The `__isItemProxy` flag:** Used by `unpackNodeData` to decide whether static `data={}` expressions on subtemplates should track dependencies. Inside each (item proxy), yes — so the subtemplate Reaction re-fires when item data changes. Outside each, no — static data stays static. See refinement plan for a cleaner approach.

### Async ({#async})

DynamicRegion with generation counter for stale promise rejection. Three states: loading, success, error. `scope.onDispose(() => region.clear())` ensures async content is cleaned up when a parent conditional removes the async block.

### Rerender/Guard ({#rerender}, {#guard})

Renders content initially, then a Reaction watches the key/expression. On change, `readAST` re-renders the content entirely (new scope, new DOM). Old content is disposed via `region.setContent`.

### Subtemplates ({> templateName})

Full Template instances with their own lifecycle. The parent Reaction:

1. Evaluates the template name (may be dynamic)
2. Calls `unpackNodeData` to get template data
3. If template identity changed: clone, initialize, render, attach
4. If same template: `setDataContext(data, { rerender: false })` + `render(data)`

**Critical: `rerender: false`** — `setDataContext` defaults to `rerender: true` which sets `Template.rendered = false`. This causes `Template.render()` to re-create the DOM from scratch instead of bumping `dataVersion` for in-place updates. The `rerender: false` override preserves `rendered = true` so the existing Reactions update via `dataVersion` propagation.

**`renderingEngine: 'native'`** is passed to `template.clone()` so the subtemplate creates a native Renderer, not a LitRenderer.

**Element and parent set before initialize:** `setElement` and `setParent` are called before `initialize()` so the subtemplate's `createComponent` can access parent web component settings via the settings Proxy fallback chain.

### Snippets ({> snippetName})

NOT full Template instances. Rendered inline via `readAST` with a Proxy overlay on parent data:

```js
const snippetData = new Proxy(data, {
  get(target, prop) {
    if (prop in allGetters) return allGetters[prop](); // lazy evaluation
    return target[prop]; // fall through to parent data
  }
});
```

Snippet data uses lazy getters so expressions re-evaluate reactively. For `{>badge label=item.name}`, the getter `() => evaluator.lookupExpressionValue('item.name', data)` is called each time `label` is read, tracking dependencies on the item Signal.

The snippet's content is rendered with the parent scope (not a child scope), so its Reactions are tracked in the same scope as the surrounding content.

---

## Integration with LitElement

Currently, `renderingEngine: 'native'` components still use `LitElement` as the base class. The integration:

1. `LitElement.render()` is called by Lit on every update
2. For native, `defineComponent`'s `render()` method returns `noChange` (Lit sentinel) on all calls after the first — telling Lit not to touch the DOM
3. First call returns the DocumentFragment from `Template.render()` — Lit inserts it into the shadow root
4. Subsequent calls: `Template.render()` calls `renderer.setData()` + `renderer.bumpDataVersion()` → Reactions handle DOM updates

This `noChange` hack is eliminated by the Lit removal plan, which replaces LitElement with ComponentBase.

---

## Test Infrastructure

Tests live in `packages/renderer/test/browser/`. All tests using `RENDERING_ENGINES.forEach(engine => ...)` run against both `'lit'` and `'native'`.

```js
// test-utils.js
export const RENDERING_ENGINES = ['lit', 'native'];
```

Key test files:
- `html-output.test.js` — structural conformance (exact DOM output comparison, 162 tests)
- `attribute-bindings.test.js` — reactive attribute/property/event bindings
- `cleanup-reactions.test.js` — Reaction cleanup on branch swap / item removal
- `subtree-caching.test.js` — subtemplates in each, focus preservation, lifecycle, settings
- `subtree-spurious.test.js` — isolation (changing one binding doesn't re-evaluate others)

Run from the package directory:
```bash
cd packages/renderer && npx vitest run
```

---

## Key Files

```
packages/renderer/src/
├── expression-evaluator.js     # Shared with LitRenderer. Token lookup, Lisp-style eval,
│                                # JS eval with Proxy, deep path resolution, literal detection.
├── native/
│   ├── renderer.js             # The Renderer class. buildHTMLString, parseHTML, bindMarkers,
│   │                           # all block directive handlers.
│   ├── dynamic-region.js       # Positional DOM region with anchor, ownedNodes, scopes.
│   └── reaction-scope.js       # Hierarchical Reaction cleanup.
└── lit/
    ├── renderer.js             # LitRenderer (refactored to delegate to ExpressionEvaluator)
    └── directives/             # 6 Lit AsyncDirectives (unchanged)

packages/templating/src/
└── template.js                 # Template class. Line ~237: renderer selection based on
                                # renderingEngine. Line ~698: render() branches for native
                                # (bumpDataVersion instead of re-render).

packages/component/src/
└── define-component.js         # Line ~228: render() returns noChange for native after first
                                # render. Line ~3: imports noChange from lit.
```

---

## Related Plans

| Plan | Use when... |
|------|-------------|
| **Lit Removal** (`lit-removal.md`) | Replacing LitElement with ComponentBase extends HTMLElement |
| **Native SSR** (`native-ssr.md`) | Server-side rendering and hydration |
| **Renderer Refinement** (`native-renderer-refinement.md`) | Performance, code quality, architectural purity improvements |
