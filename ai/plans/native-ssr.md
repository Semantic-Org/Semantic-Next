# Native Renderer SSR

## Goal

Server-side rendering for components using the native renderer. Server produces complete HTML with Declarative Shadow DOM. Client hydrates by wiring reactive bindings to the existing DOM without re-rendering.

## Architecture

The native renderer's `buildHTMLString(ast)` is the natural split point:

```
buildHTMLString(ast)  →  entries[]  +  htmlString
                              ↓              ↓
                    [shared structure]   [diverges here]

Client render:   parseHTML(htmlString) → bindMarkers(fragment, entries) → append to shadow root
Server render:   evaluateInline(htmlString, entries) → serialize with DSD → return HTML string
Client hydrate:  shadowRoot exists → bindMarkers(shadowRoot, entries) → wire Reactions
```

`buildHTMLString` is pure computation — no DOM, no Reactions, no `document`. It runs identically on server and client.

## Server Render Path

### Input
An AST, a data context (settings, state defaults), and CSS.

### Process

1. **`buildHTMLString(ast)`** — produces HTML string with markers and entries array (same as client)

2. **Evaluate markers inline** — walk the entries, evaluate each expression once:
   - Text markers (`<!--sui:N-->`) → replace with evaluated value, keep the comment for hydration: `<!--sui:0-->Alice`
   - Attribute markers (`__suiN__`) → replace with evaluated value in the attribute string, add `data-sui-bind="attrName:N"` for hydration
   - Block markers (`<!--sui-block:N-->`) → evaluate the block directive:
     - `{#if condition}` → evaluate condition, render the matching branch inline, wrap in `<!--sui-block:N-->...<!--/sui-block:N-->`
     - `{#each items}` → evaluate collection, render each item inline
     - `{#async}` → evaluate expression; if synchronous value, render success content; if promise, render loading content (or empty)
     - `{#rerender}` → render content once
     - `{> template}` → evaluate subtemplate, render its content inline

3. **Wrap in DSD** — surround the rendered content with `<template shadowrootmode="open">`:
   ```html
   <my-component attribute="value">
     <template shadowrootmode="open">
       <style>/* component CSS */</style>
       <!--sui:0-->Alice
       <div class="container">
         <!--sui-block:1-->
         <span>content from if-branch</span>
         <!--/sui-block:1-->
       </div>
     </template>
   </my-component>
   ```

4. **Collect pageCSS** — gather all `pageCSS` from defined components, deduplicate, include in `<head>` of the HTML document.

### Output
Pure HTML string. No DOM shim needed — this is string concatenation with expression evaluation.

## Client Hydration Path

### Detection
In `connectedCallback` (or `_performUpdate`), check if `this.shadowRoot` already exists:

```js
_performUpdate() {
  if (!this.template) {
    if (this.shadowRoot) {
      // DSD created the shadow root — hydrate, don't render
      this._hydrate();
    }
    else {
      // No existing shadow root — full client render
      this.attachShadow({ mode: 'open' });
      this._initializeTemplate();
      this._adoptStyles();
      const fragment = this.template.render(this.getData());
      this.shadowRoot.append(fragment);
    }
    this.component = this.template.instance;
    this.dataContext = this.template.getDataContext();
  }
  // ...
}
```

### Hydration

```js
_hydrate() {
  this._initializeTemplate();

  // buildHTMLString produces the entries array — same marker IDs as server
  const { entries } = this.template.renderer.buildHTMLString(this.template.ast);

  // Walk the existing shadow root, find markers, wire reactive bindings
  // This is the SAME bindMarkers code used for initial render
  this.template.renderer.bindMarkers(
    this.shadowRoot, entries,
    this.template.getDataContext(),
    this.template.renderer.scope,
    this.template.ast,
  );
}
```

The comment markers (`<!--sui:0-->`, `<!--sui-block:0-->`) survive HTML serialization and are findable via TreeWalker. `bindMarkers` replaces them with reactive text nodes and DynamicRegions — the same code path as initial render, but operating on the pre-existing DOM instead of a freshly parsed fragment.

## What Doesn't Work During SSR

### Parent-child coordination via `findParent()` / `findChildren()`
Components render in isolation on the server. `findParent('ui-buttons')` requires a live DOM tree. Components must render correctly without it — `findParent` is a client-side enhancement that activates after hydration.

### CSS custom properties that depend on runtime computation
CSS custom properties declared in component CSS cascade correctly through DSD without JS. Properties that depend on computed values (from `createComponent`) aren't available until hydration.

### The pragmatic workaround
Use `pageCSS` with descendant selectors and `::slotted()` in parent shadow DOM for parent-child styling. These are declarative and survive SSR. Accept that some coordination (like `findParent`-driven behavior) only activates after hydration.

## Server Module Structure

```
packages/renderer/src/native/
├── renderer.js          ← client renderer (existing)
├── server.js            ← NEW: server render function
├── dynamic-region.js    ← client only
└── reaction-scope.js    ← client only

packages/renderer/src/
├── expression-evaluator.js  ← shared (server + client)
└── index.js                 ← exports server renderer
```

`server.js` imports only `ExpressionEvaluator` and the `buildHTMLString` logic. No DOM dependencies. Can run in Node, Deno, Bun, Cloudflare Workers.

## Key Design Constraint

`buildHTMLString` must remain a pure function of the AST — no DOM, no side effects. This is already true in the current implementation. The server module calls it to get the HTML string and entries, then does string manipulation to evaluate markers inline. The client module calls it to get the same structure, then parses and binds.

The entries array is the shared contract. Server and client produce identical entries from the same AST. The marker IDs in the server HTML correspond to the entry indices. Hydration works because the TreeWalker finds markers with the same IDs that `buildHTMLString` would produce.

## Implementation Order

### Step 1: Extract `buildHTMLString` for reuse
- Move `buildHTMLString` and `analyzePosition` to a shared module (or make them static/standalone)
- Both client renderer and server module import them
- No behavior change, all tests pass

### Step 2: Server render function
- `renderToString(ast, data, css)` → HTML string with DSD
- Pure string manipulation, no DOM
- Handles: html, expression, if, each, slot, snippet, subtemplate
- Test with Node.js unit tests (not browser tests)

### Step 3: Hydration in ComponentBase
- Detect existing shadow root in `_performUpdate`
- Call `buildHTMLString` + `bindMarkers` on existing DOM
- Verify: hydrated component is behaviorally identical to client-rendered component

### Step 4: Integration testing
- Render component on server → parse HTML in browser → verify hydration produces working component
- Test: reactive updates after hydration work correctly
- Test: events bind after hydration
- Test: subtemplates hydrate correctly

### Step 5: pageCSS collection
- Server render collects `pageCSS` from all components encountered during render
- Returns collected CSS alongside the HTML string
- Framework integration (Astro, etc.) includes it in `<head>`

## Dependencies

- Native renderer (complete)
- Lit removal (recommended but not strictly required — hydration logic goes in ComponentBase)

## Open Questions

1. **Async blocks during SSR** — if the expression returns a promise, should the server wait for it (adds latency) or render the loading state? Lit SSR renders loading state. Waiting for all promises enables full SSR but adds complexity (streaming, timeouts).

2. **Marker format stability** — the comment marker format (`<!--sui:N-->`) becomes a serialization contract between server and client. Changes to `buildHTMLString` could break hydration of server-rendered pages. Need versioning or stable marker format.

3. **Streaming** — can the server render stream HTML chunks as components resolve? This requires the DSD template to be emitted after all child content, which conflicts with streaming. May need a two-pass approach (components → collected HTML → DSD wrapping → stream).

## Status

Initial scope. Needs a pair session to resolve open questions before implementation.
