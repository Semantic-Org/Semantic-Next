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

## Two-Phase SSR Strategy

### Phase 1: JS Reference Implementation

JS `renderToString` that validates the full contract — marker format, DSD wrapping, hydration round-trip. This is the test oracle that proves the architecture works.

### Phase 2: Rust/WASM Renderer

Once the JS SSR is working and the marker contract is proven, a Rust implementation takes over the hot path. The interface is identical: AST + flat values in, HTML string out.

The key insight: on the server, every expression resolves exactly once. No Signals, no Reactions, no re-evaluation. The data context at render time is a flat map of resolved values. This makes the WASM boundary clean:

```
JS side (per component instance):
  evaluateAllExpressions(ast, dataContext) → Map<id, string>

WASM side (hot path):
  renderToString(ast, flatValues, css) → HTML string with DSD
```

The JS side resolves functions, helpers, and any runtime-dependent values. The WASM side never touches JS objects — it receives JSON (AST, reusable across instances of the same component) and a flat string map, produces a string. No round-trips.

**Why WASM wins here:** The docs site renders 100+ spec-driven components per page, each with dozens of expressions. Same AST structure per component type, different data per instance. That's a tight loop of string interpolation at scale — exactly what WASM outperforms JS on.

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
In `connectedCallback`, check if `this.shadowRoot` already exists:

```js
connectedCallback() {
  if (this.template) {
    return;
  }

  if (this.shadowRoot) {
    // DSD created the shadow root — hydrate, don't render
    this.hydrate();
    return;
  }

  // No existing shadow root — full client render
  this.attachShadow({ mode: 'open' });
  // ... normal render path
}
```

### Hydration

```js
hydrate() {
  this.renderRoot = this.shadowRoot;
  const prototypeTemplate = this.constructor.template;

  this.template = prototypeTemplate.clone({
    data: this.getData(),
    element: this,
    renderRoot: this.renderRoot,
  });
  this.template.initialize();
  this.component = this.template.instance;
  this.dataContext = this.template.getDataContext();

  // buildHTMLString produces the entries array — same marker IDs as server
  const { entries } = this.template.renderer.buildHTMLString(this.template.ast);

  // Walk the existing shadow root, find markers, wire reactive bindings
  // Same bindMarkers code as initial render, operating on pre-existing DOM
  this.template.renderer.bindMarkers(
    this.shadowRoot, entries,
    this.template.getDataContext(),
    this.template.renderer.scope,
    this.template.ast,
  );

  this.resolveUpdate?.();
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
packages/renderer/src/
├── expression-evaluator.js  ← shared (server + client)
├── build-html-string.js     ← NEW: extracted from renderer.js, shared
├── index.js                 ← exports
├── native/
│   ├── renderer.js          ← client renderer (imports build-html-string)
│   ├── server.js            ← NEW: JS renderToString
│   ├── dynamic-region.js    ← client only
│   └── reaction-scope.js    ← client only
└── wasm/                    ← Phase 2
    ├── renderer.rs          ← Rust renderToString
    ├── Cargo.toml
    └── build.js             ← wasm-pack integration
```

`server.js` imports only `ExpressionEvaluator` and `buildHTMLString`. No DOM dependencies. Can run in Node, Deno, Bun, Cloudflare Workers.

The WASM renderer (Phase 2) replaces the string generation in `server.js` while keeping the JS expression evaluation layer. The interface is identical — `renderToString(ast, data, css)` → HTML string.

## Key Design Constraint

`buildHTMLString` must remain a pure function of the AST — no DOM, no side effects. This is already true in the current implementation. The server module calls it to get the HTML string and entries, then does string manipulation to evaluate markers inline. The client module calls it to get the same structure, then parses and binds.

The entries array is the shared contract. Server and client produce identical entries from the same AST. The marker IDs in the server HTML correspond to the entry indices. Hydration works because the TreeWalker finds markers with the same IDs that `buildHTMLString` would produce.

## Rust/WASM Architecture (Phase 2)

### What Rust Receives
- AST (JSON, compiled once per component definition, reused across instances)
- Flat value map (Map<expressionId, serializedValue>, produced per instance by JS expression evaluator)
- CSS string (per component definition)
- Component tag name and attributes

### What Rust Produces
- Complete HTML string including DSD wrapper, hydration markers, and evaluated content

### What Stays in JS
- Expression evaluation (data context has JS functions, helpers, Signals)
- AST compilation (TemplateCompiler — though this could also move to Rust later)
- Hydration (client-side DOM binding)

### Build Integration
- `wasm-pack build --target web` produces ESM-compatible WASM module
- `server.js` imports WASM module, falls back to JS implementation if WASM unavailable
- Same interface either way: `renderToString(ast, flatValues, css) → string`

## Implementation Order

### Step 1: Extract `buildHTMLString` for reuse
- Move `buildHTMLString` and `analyzePosition` to a shared module
- Both client renderer and server module import them
- No behavior change, all tests pass

### Step 2: JS `renderToString` (reference implementation)
- `renderToString(ast, data, css)` → HTML string with DSD
- Pure string manipulation, no DOM
- Handles: html, expression, if, each, slot, snippet, subtemplate
- Test with Node.js unit tests (not browser tests)

### Step 3: Hydration in WebComponentBase
- Detect existing shadow root in `connectedCallback`
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

### Step 6: Rust/WASM renderer
- Implement `renderToString` in Rust matching the JS reference implementation
- Validate against JS implementation — same AST + same data must produce identical HTML
- Benchmark against docs site workload (100+ components per page)
- `server.js` uses WASM when available, JS as fallback

## Dependencies

- Native renderer (complete)
- Lit removal (in progress — hydration logic goes in WebComponentBase)

## Open Questions

1. **Async blocks during SSR** — if the expression returns a promise, should the server wait for it (adds latency) or render the loading state? Lit SSR renders loading state. Waiting for all promises enables full SSR but adds complexity (streaming, timeouts).

2. **Marker format stability** — the comment marker format (`<!--sui:N-->`) becomes a serialization contract between server and client. Changes to `buildHTMLString` could break hydration of server-rendered pages. Add a version prefix to markers (`<!--sui:v1:0-->`) so the client can detect mismatches between server and client builds. On mismatch, fall back to full client render instead of corrupting the DOM with incompatible marker IDs.

3. **Streaming** — can the server render stream HTML chunks as components resolve? This requires the DSD template to be emitted after all child content, which conflicts with streaming. May need a two-pass approach (components → collected HTML → DSD wrapping → stream).

4. **WASM bundle size** — the Rust renderer needs to ship as part of the server deployment. wasm-pack output for string manipulation should be small (tens of KB), but needs measurement.

5. **AST caching in WASM** — the same component's AST is reused across instances. Rust could parse and cache the AST structure once in WASM memory, then accept only flat values per render. This avoids re-serializing the AST for each instance.

## Status

Initial scope. Phase 1 (JS reference implementation) ready to execute. Phase 2 (Rust/WASM) scoped pending Phase 1 completion.
