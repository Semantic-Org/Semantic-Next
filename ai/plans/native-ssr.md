# Native Renderer SSR

## Goal

Server-side rendering for components using the native renderer. Server produces complete HTML with Declarative Shadow DOM. Client hydrates by wiring reactive bindings to the existing DOM without re-rendering.

## Architecture

The native renderer's `buildHTMLString(ast)` is the natural split point:

```
buildHTMLString(ast)  →  { htmlString, entries, snippets }
                              ↓              ↓
                    [shared structure]   [diverges here]

Client render:   parseHTML(htmlString) → bindMarkers(fragment, entries) → append to shadow root
Server render:   evaluateInline(htmlString, entries) → serialize with DSD → return HTML string
Client hydrate:  shadowRoot exists → hydrateMarkers(shadowRoot, entries) → wire Reactions
```

`buildHTMLString` is pure computation — no DOM, no Reactions, no `document`. It runs identically on server and client. Currently it's a method on the Renderer class with coupling to `this.snippets` and `this.evaluator` — extracting it as a standalone function is the first and hardest step (see Step 1 below).

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

1. **`buildHTMLString(ast, snippets)`** — produces HTML string with markers, entries array, and populated snippets map. All dependencies passed in, no instance mutation.

2. **Evaluate markers inline** — walk the entries, evaluate each expression once:
   - Text markers (`<!--sui:v1:N-->`) → replace with evaluated value, keep the comment for hydration: `<!--sui:v1:0-->Alice`
   - Attribute markers (`__suiN__`) → replace with evaluated value in the attribute string, add `data-sui-bind="attrName:N"` for hydration
   - Block markers (`<!--sui-block:v1:N-->`) → evaluate the block directive:
     - `{#if condition}` → evaluate condition, render the matching branch inline, wrap in `<!--sui-block:v1:N-->...<!--/sui-block:v1:N-->`
     - `{#each items}` → evaluate collection, render each item inline
     - `{#async}` → render loading content (never await — see Decisions below)
     - `{#rerender}` → render content once
     - `{> template}` → evaluate subtemplate, render its content inline

3. **Wrap in DSD** — surround the rendered content with `<template shadowrootmode="open">`:
   ```html
   <my-component attribute="value">
     <template shadowrootmode="open">
       <style>/* component CSS */</style>
       <!--sui:v1:0-->Alice
       <div class="container">
         <!--sui-block:v1:1-->
         <span>content from if-branch</span>
         <!--/sui-block:v1:1-->
       </div>
     </template>
   </my-component>
   ```

4. **Collect pageCSS** — gather all `pageCSS` from defined components, deduplicate, include in `<head>` of the HTML document.

### Output
Pure HTML string. No DOM shim needed — this is string concatenation with expression evaluation.

### Server Import Path Constraint

`defineComponent` triggers engine registration which imports the Renderer, which uses `document.createElement('template')`. The server module path must avoid triggering client-only code during module evaluation. Options:
- Lazy `document` access (guarded by `isServer`)
- Separate server entry point that imports only `ExpressionEvaluator`, `buildHTMLString`, and the Template/compiler — no Renderer class
- The engine registry already uses lazy registration (side-effect on import) — the server just doesn't import the client engine

### Expression Evaluator Constraint

`ExpressionEvaluator` uses `new Function('ctx', 'with (ctx) { ... }')`. This has restrictions:
- **Cloudflare Workers:** requires `unsafe-eval` in `content_security_policy`
- **Deno:** requires `--allow-eval` flag
- **Node/Bun:** no restrictions

This doesn't block SSR but the "runs everywhere" claim has an asterisk. Document it. If this becomes a real blocker, a restricted expression evaluator that only handles property access and function calls (no arbitrary JS) could be built for constrained environments.

## Client Hydration Path

### Detection
In `connectedCallback` (in `engines/native/base.js`), check if `this.shadowRoot` already exists:

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

### Marker Version Check

Before hydrating, verify marker versions match:

```js
hydrate() {
  const firstComment = this.findFirstMarker(this.shadowRoot);
  if (firstComment && !firstComment.data.startsWith('sui:v1:')) {
    // Version mismatch — fall back to full client render
    this.shadowRoot.innerHTML = '';
    this.fullRender();
    return;
  }
  // ... proceed with hydration
}
```

This prevents silent DOM corruption if server and client are on different builds with incompatible marker formats.

### Hydration

```js
hydrate() {
  this.renderRoot = this.shadowRoot;
  const prototypeTemplate = this.constructor.template;

  this.template = prototypeTemplate.clone({
    data: this.getData(),
    element: this,
    renderRoot: this.renderRoot,
    isHydrating: true,  // passed to createComponent callbacks
  });
  this.template.initialize();
  this.component = this.template.instance;
  this.dataContext = this.template.getDataContext();

  // buildHTMLString produces the entries array — same marker IDs as server
  const { entries } = buildHTMLString(this.template.ast);

  // Hydrate: walk existing DOM, adopt nodes, wire reactive bindings
  this.template.renderer.hydrateMarkers(
    this.shadowRoot, entries,
    this.template.getDataContext(),
    this.template.renderer.scope,
  );
}
```

### Hydration vs Bind: Two Distinct Operations

`bindMarkers` (client render) and `hydrateMarkers` (hydration) are different operations on the same marker positions:

**Text markers** — `bindMarkers` replaces the comment with a new text node. `hydrateMarkers` finds the comment, locates the adjacent text node (the server-rendered value), and binds the Reaction to the EXISTING text node. Does not create a new node. Without this, you get "AliceAlice" — the server-rendered text plus the hydration-created text.

**Attribute markers** — `bindMarkers` finds `__suiN__` in attribute values. `hydrateMarkers` finds `data-sui-bind="attrName:N"` attributes (added by server) since the server replaced `__suiN__` with real values. Removes `data-sui-bind` after wiring.

**Block markers** — `bindMarkers` replaces the comment with a DynamicRegion anchor. `hydrateMarkers` finds the paired `<!--sui-block:v1:N-->...<!--/sui-block:v1:N-->` markers, adopts the nodes between them as the DynamicRegion's `ownedNodes`, and wires the appropriate Reaction (conditional, each, etc.) with the existing content as the initial state.

### createComponent During Hydration

`createComponent` runs during hydration — it must, because the component needs its methods and computed values to be available. But `initialize()` inside `createComponent` may have side effects: fetching data, setting up timers, attaching global event listeners. These would fire redundantly since the server already produced the initial state.

Mitigation: `isHydrating` is passed in the callback params (via `Template.call()`). Component authors guard side effects:

```js
createComponent: ({ isHydrating, self, reaction }) => ({
  initialize() {
    if (isHydrating) {
      return; // Server already produced the initial state
    }
    self.loadData();
    self.startPolling();
  },
})
```

This is the same pattern as `isServer` — an environment flag that lets components adapt their behavior. `isHydrating` is `true` only during the hydration `initialize()` call, not during subsequent reactive updates.

## Server Module Structure

```
packages/renderer/src/
├── expression-evaluator.js    ← shared across all engines
├── build-html-string.js       ← extracted from renderer.js, shared by client + server
├── engine-registry.js         ← engine registration
├── index.js                   ← exports
├── engines/
│   ├── native/
│   │   ├── renderer.js        ← client renderer (imports build-html-string)
│   │   ├── server.js          ← JS renderToString (string eval, no DOM)
│   │   ├── dynamic-region.js  ← client only
│   │   └── reaction-scope.js  ← client only
│   ├── lit/
│   │   ├── renderer.js        ← LitRenderer (tree-shakeable, registered on import)
│   │   └── directives/        ← 6 AsyncDirectives
│   └── rust/                  ← Phase 2
│       ├── src/               ← Rust source
│       ├── Cargo.toml
│       ├── build.js           ← wasm-pack integration
│       ├── renderer.wasm      ← compiled output
│       └── index.js           ← thin JS wrapper, same renderToString interface
```

`server.js` imports only `ExpressionEvaluator` and `buildHTMLString`. No DOM dependencies. Runs in Node, Deno (with `--allow-eval`), Bun, Cloudflare Workers (with `unsafe-eval`).

## Key Design Constraint

`buildHTMLString` must be a pure function — all dependencies passed in, no instance mutation. Current coupling to extract:

| Currently on `this` | Extraction approach |
|---|---|
| `this.snippets` — mutated during walk (`this.snippets[node.name] = node`) | Return as part of output: `{ htmlString, entries, snippets }` |
| `this.evaluator` — used only for `analyzePosition` in expression classification | `analyzePosition` is already a method that takes only HTML string — extract as standalone function |
| `this.isSVG` — tracks SVG context | Pass as parameter |

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

### Step 1: Extract `buildHTMLString` as pure function
This is the hardest step. Currently a method on the Renderer class with coupling to `this.snippets`, `this.evaluator`, and `this.isSVG`.

- Extract `buildHTMLString(ast, options)` and `analyzePosition(html)` to `build-html-string.js`
- All dependencies passed as parameters, no instance access
- Returns `{ htmlString, entries, snippets }` — snippets as output, not mutation
- Client renderer imports and delegates to the extracted function
- No behavior change, all tests pass

### Step 2: Versioned markers
- Change marker format: `<!--sui:N-->` → `<!--sui:v1:N-->`, `<!--sui-block:N-->` → `<!--sui-block:v1:N-->`
- Update `bindMarkers` to handle versioned format
- All tests pass with new format

### Step 3: JS `renderToString` (reference implementation)
- `renderToString(ast, data, css)` → HTML string with DSD
- Pure string manipulation, no DOM
- Handles: html, expression, if, each, slot, snippet, subtemplate
- Async blocks render loading content (never await)
- Adds `data-sui-bind` attributes for attribute marker hydration
- Test with Node.js unit tests (not browser tests)

### Step 4: `hydrateMarkers` in native renderer
- New method parallel to `bindMarkers`, operates on pre-existing DOM
- Text markers: adopt adjacent text node, don't create new
- Attribute markers: find `data-sui-bind`, wire binding, remove helper attribute
- Block markers: adopt nodes between paired markers as DynamicRegion ownedNodes
- Test: hydrated component is behaviorally identical to client-rendered component

### Step 5: Hydration in WebComponentBase
- Detect existing shadow root in `connectedCallback` (`engines/native/base.js`)
- Marker version check — fall back to full render on mismatch
- Pass `isHydrating: true` through Template to `createComponent` callbacks
- Integration test: server render → parse in browser → hydrate → verify reactivity + events

### Step 6: pageCSS collection
- Server render collects `pageCSS` from all components encountered during render
- Returns collected CSS alongside the HTML string
- Framework integration (Astro, etc.) includes it in `<head>`

### Step 7: Rust/WASM renderer
- Implement `renderToString` in Rust matching the JS reference implementation
- Validate against JS implementation — same AST + same data must produce identical HTML
- Benchmark against docs site workload (100+ components per page)
- `server.js` uses WASM when available, JS as fallback

## Decisions (resolved)

1. **Async blocks during SSR** — render loading content, never await. Industry standard (Lit SSR, Next.js Suspense, Nuxt). Avoids timeout/streaming complexity. The loading content is already in the template.

2. **Marker versioning** — implement from day one. `<!--sui:v1:0-->` costs nothing extra. Client checks version on hydration, falls back to full render on mismatch. Prevents silent corruption.

## Open Questions

1. **Streaming** — can the server render stream HTML chunks as components resolve? DSD requires the `<template>` wrapper to be emitted after all child content, which conflicts with streaming. May need a two-pass approach.

2. **WASM bundle size** — the Rust renderer needs to ship as part of the server deployment. wasm-pack output for string manipulation should be small (tens of KB), but needs measurement.

3. **AST caching in WASM** — the same component's AST is reused across instances. Rust could parse and cache the AST structure once in WASM memory, then accept only flat values per render.

## Dependencies

- Native renderer (complete)
- Lit removal (complete, archived)
- Tree-shakeable Lit (complete — engine registry pattern used by SSR engine registration)

## Status

Scoped. Phase 1 (JS reference implementation) ready to execute. Phase 2 (Rust/WASM) scoped pending Phase 1 completion.
