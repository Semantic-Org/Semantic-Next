# SSR Implementation — Working Plan

## The Insight

The engine registry already swaps renderers based on environment:
```js
const NativeEngine = {
  renderer: isServer ? ServerRenderer : Renderer,
  factory: createComponent,
};
```

`Template.initialize()` does `new engine.renderer(...)`. It doesn't care which class. `ServerRenderer.render()` returns a string. `Renderer.render()` returns a DocumentFragment. Same contract.

## What I'm Building

### 1. ServerRenderer
Same constructor shape as Renderer. Five-method contract:
- `constructor({ ast, data, template, subTemplates, helpers })`
- `render()` → HTML string with hydration markers
- `setData(data)` → update data context
- `bumpDataVersion()` → no-op
- `this.snippets` → snippet storage for Template to read

The render logic: `buildHTMLString(ast)` → walk entries → evaluate each expression/block inline → return HTML string. No DOM, no Reactions, no TreeWalker.

### 2. Engine Registration
Modify the native engine registration to swap renderer based on `isServer`:
```js
import { isServer } from '@semantic-ui/utils';
const NativeEngine = {
  renderer: isServer ? ServerRenderer : Renderer,
  factory: createComponent,
};
```

### 3. Astro Integration Helper
A function that takes a component class + attributes, clones the prototype template, renders via ServerRenderer, wraps in DSD:
```js
renderComponent(tagName, ComponentClass, attrs) → full DSD HTML string
```

### 4. Hydration
Already partially built. `WebComponentBase.connectedCallback()` detects `this.shadowRoot` exists → hydrate instead of render. The `isHydrating` callback param is already in place.

Hydration calls `buildHTMLString` to get entries, then `bindMarkers` on the existing shadow root DOM. Same code as client render, different DOM source.

## Order of Work

1. Write `ServerRenderer` — the core
2. Wire into engine registration with `isServer` swap
3. Write `renderComponent` helper for Astro
4. Test: server render → DSD output → browser parse → hydration → reactive updates work
5. Fix the test-ssr.astro page to use real component definitions (one definition, shared)

## What's NOT in scope
- Rust/WASM (Phase 2 — needs the JS reference working first)
- pageCSS collection (can add later)
- Streaming (needs DSD to be emitted after content, conflicts with streaming)
