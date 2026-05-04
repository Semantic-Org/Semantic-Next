---
title: SSR & Hydration Pipeline — Server Render to Live DOM
description: How a component renders on the server, arrives as DSD in the browser, and hydrates into a reactive component. Covers renderToString, ServerRenderer, expandCustomElements, DSD parsing, the hydrate-or-render decision, and hydrateMarkers. Load before working on SSR, hydration, Astro integration, or server rendering bugs.
keywords: [SSR, hydration, server rendering, declarative shadow DOM, DSD, renderToString, ServerRenderer, hydrateMarkers, expandCustomElements, markers]
audience: authoring
skill: ssr-hydration
type: skill
---

# SSR & Hydration Pipeline — Server Render to Live DOM

> **Skill:** `ssr-hydration`
> **Purpose:** How a component renders on the server, arrives as Declarative Shadow DOM in the browser, and hydrates into a fully reactive component. Load this before working on SSR, hydration, Astro integration, or server rendering bugs.

---

## Why SSR Exists Here

SSR in Semantic UI exists for **first paint performance** — the user sees styled, structured content before JavaScript loads. The server produces Declarative Shadow DOM (DSD) that the browser renders immediately. JavaScript then hydrates the existing DOM with reactive bindings.

This is not server rendering for SEO or static generation. The goal is a fast visual that the client seamlessly takes over.

---

## Critical gotchas (read first if you're testing or benching SSR)

These are silent-failure modes — no error, your code just runs the wrong path. Each one cost real investigation time. Lead with them when triaging "my hydration test is broken" or "tachometer can't see my fix."

### Gotcha 1: `innerHTML` does NOT process Declarative Shadow DOM

The browser's main HTML parser processes `<template shadowrootmode="open">` natively — that's why a real page works. But the **fragment parsers** (`innerHTML`, `outerHTML`, `insertAdjacentHTML`) do not. The DSD spec opts those out because they're entry points for XSS escalation.

```js
// ❌ wrong — wrapper.firstElementChild has no shadowRoot
wrapper.innerHTML = renderToString(MyComponent, attrs);

// ✅ right — DSD is processed, shadow root attached
wrapper.setHTMLUnsafe(renderToString(MyComponent, attrs));
// Document-scoped alternative:
const doc = Document.parseHTMLUnsafe(html);
```

**The silent-failure chain when you use `innerHTML`:**
1. `<template shadowrootmode>` stays as a literal child of the custom element
2. `el.shadowRoot` is `null` when `connectedCallback` fires
3. `hasServerContent = el.shadowRoot && el.shadowRoot.childNodes.length > 0` → `false`
4. `connectedCallback` falls through to `fullRender(prototypeTemplate)` instead of `hydrate(prototypeTemplate)`
5. Your test or bench "works" — but it's measuring fresh client render, not hydration

There is no error or warning. Tests pass for the wrong reason; benches measure the wrong code path. The canonical helper in `packages/renderer/test/browser/ssr-hydration.test.js` (`ssrAndHydrate`) uses `setHTMLUnsafe` for exactly this reason.

### Gotcha 2: `renderToString` returns empty in browser test env unless `Template.isServer = true`

`Template.isServer` is set once at module load from `typeof window === 'undefined'` in `@semantic-ui/utils`. In a browser test, `window` exists, so `Template.isServer === false`. Inside `Template.initialize()` the engine selection is:

```js
const RendererClass = (Template.isServer && engine.serverRenderer)
  ? engine.serverRenderer
  : engine.renderer;
```

The client `Renderer` returns a `DocumentFragment` from `render()`, not a string. `renderToString`'s wrapper template literal coerces that to `'[object DocumentFragment]'` (or empty after the string-only `expandCustomElements` no-ops on it). The DSD wrapper is emitted but the content inside is empty.

```js
// ✅ pattern from ssrAndHydrate
const wasServer = Template.isServer;
Template.isServer = true;
try {
  html = renderToString(Component, attrs);
} finally {
  Template.isServer = wasServer;
}
```

The `try/finally` matters — leaving `Template.isServer = true` after the call breaks any subsequent client-side hydration or mount in the same test, because the renderer selection happens once per `template.initialize()`.

### Gotcha 3: bench noise floor scales inversely with bench duration

Per-sample timing jitter on CI runners (OS scheduling, GC, JIT) is roughly constant in absolute terms — typically σ≈1-2ms. Relative noise scales inversely with bench duration:

| Bench duration | Expected noise floor |
|---|---|
| ~2ms | ±10-20% |
| ~10ms | ±2-5% |
| ~50ms+ | ±1% or tighter |

A 6ms bench at ±28% noise is unresolvable — anything below ±28% reads as "no change" regardless of how many samples you collect. Tightening `autoSampleConditions` or bumping `sampleSize` does not lower the floor; only narrows the CI under it. Sampling more is √N-scaling: 4× samples for 2× CI tightening, capped by the per-config wall-clock budget.

**The fix is to amplify work per sample.** Bump item count, loop the operation N times inside one `performance.measure`, or split into mount-vs-rebind windows. The canonical `bench-hydrate.js` uses 1000 items (not 100, despite the metric name's `-100` suffix) precisely to push duration into the ±1% band. See the `improve-performance` skill's bench-duration table for the methodology.

### Gotcha 4: cross-session "regressions from peak" are phantoms

The in-house bench reporter shows two columns: within-session `vs main` (the truthful signal) and cross-session "regressed from peak". The peak attribution operates on absolute ms across runs on different runner conditions and produces phantom regressions on PRs that didn't change perf. Read the `vs main` table; treat the "from peak" table as noisy until the `bench-reporter-overhaul` Track A schema_v2 lands.

---

## The Full Lifecycle

A server-rendered component passes through five phases from definition to interactivity:

```
1. SERVER: renderToString(ComponentClass, attrs)
   |
   +-- Clone prototype Template with data
   +-- Template.initialize() -> createComponent() runs
   +-- ServerRenderer.render() -> HTML string with hydration markers
   +-- expandCustomElements() -> recursively render nested components
   +-- Wrap in DSD: <tag><template shadowrootmode="open">...</template></tag>
   |
   v
2. NETWORK: HTML string arrives in browser
   |
   v
3. BROWSER PARSE: DSD parsing
   |
   +-- Browser encounters <template shadowrootmode="open">
   +-- Automatically creates shadow root and moves content into it
   +-- User sees styled content BEFORE any JavaScript loads
   |
   v
4. JS LOADS: Custom element upgrade
   |
   +-- Browser calls constructor() -> detects existing shadowRoot -> sets _hydrating flag
   +-- Browser calls connectedCallback() -> detects DSD content
   +-- canHydrate() checks marker version
   +-- requestAnimationFrame(() => hydrate()) — deferred so browser can paint first
   |
   v
5. HYDRATION: hydrate(prototypeTemplate)
   |
   +-- Clone template, initialize (createComponent runs again, client-side)
   +-- Build entries from AST (cached on prototype)
   +-- hydrateMarkers() walks existing DOM, wires Reactions to server-rendered nodes
   +-- Remove all hydration comment markers (clean DevTools)
   +-- Component is now fully reactive — indistinguishable from client-rendered
```

---

## Phase 1: Server Rendering

### renderToString

`packages/component/src/render-to-string.js`

The entry point for SSR. Takes a component class (returned by `defineComponent` with a `tagName`) and an attributes object, returns a complete DSD HTML string.

```js
import { defineComponent, renderToString } from '@semantic-ui/component';

const MyCard = defineComponent({ tagName: 'my-card', template, css, ... });
const html = renderToString(MyCard, { title: 'Hello' });
// -> <my-card title="Hello"><template shadowrootmode="open"><style>...</style>...</template></my-card>
```

The function performs these steps in order:

**1. Normalize attributes** — Kebab-case HTML attribute names are converted to camelCase property names. `fromAttribute` converters from the component's property definitions are applied.

**2. Resolve attribute aliases** — For spec-driven primitives, bare attributes like `primary` are resolved to their canonical form (`emphasis="primary"`) using `resolveAttributeAliases()` from `component-helpers.js` — the same shared helper the client uses.

**3. Merge data context** — Spec defaults, component defaults, and normalized attributes are merged in that order (last wins):

```js
const data = { ...specDefaults, ...defaultSettings, ...normalizedAttrs };
```

**4. Clone and initialize** — The prototype template is cloned with the data context, forcing the native engine (ServerRenderer handles string output). `template.initialize()` runs `createComponent()` — the same function that runs on the client. The `isServer` param is `true`, so components can guard client-only logic.

**5. Compute `{uiClasses}` classes** — After `initialize()`, because `createComponent` can modify settings that affect spec resolution (e.g., input's `configureSearch` sets `icon`).

**6. Render** — `template.render()` delegates to `ServerRenderer.render()`, which walks the AST and produces an HTML string with hydration comment markers.

**7. Expand nested custom elements** — `expandCustomElements()` scans the rendered HTML for custom element tags, looks them up in the component registry, and recursively calls `renderToString` to expand their shadow DOM as nested DSD.

**8. Wrap in DSD** — The final output wraps the rendered HTML in a DSD template with the component's CSS:

```html
<my-card title="Hello">
  <template shadowrootmode="open">
    <style>/* component CSS */</style>
    <!-- rendered HTML with hydration markers -->
  </template>
</my-card>
```

When `hydrate: false` is passed, the outer element gets an `ssr` attribute that prevents self-hydration — used for components that should remain static.

### ServerRenderer

`packages/renderer/src/engines/native/server.js`

The server-side counterpart to the client `Renderer`. Same constructor interface, same `ExpressionEvaluator`, but produces HTML strings instead of DOM. No Reactions, no Signals, no DynamicRegion — pure string concatenation.

```js
render() {
  let html = this.renderNodes(this.ast, this.data);
  return html.replace(REMOVE_ATTR_REGEX, '');
}
```

**Hydration markers** — The server embeds comment markers in the HTML so the client's hydration pass can locate dynamic positions:

| Position | Server output | Client uses to... |
|----------|--------------|-------------------|
| Text expression | `<!--sui:v1:3-->Hello` | Find text node, wire Reaction |
| Block open | `<!--sui-block:v1:5-->` | Find block boundary, wire directive |
| Block close | `<!--/sui-block:v1:5:b1000-->` | Determine block extent and branch index |
| Attribute expression | *(evaluated inline, no marker)* | Client builds reference DOM from AST |

Block closing markers include metadata: `b1000` means the `if` main branch was taken, `b0` means the first `elseif`, `b-1` means no branch matched. The client uses this during hydration to understand what the server rendered without re-evaluating conditions.

**Expression handling in attributes** — Unlike the client (which uses `__suiN__` markers), the server evaluates attribute expressions inline and emits their final values. Properties (`.prop=`) and events (`@click=`) are stripped via `REMOVE_ATTR` sentinel. Boolean attributes are removed when falsy.

**Block directives** — Conditionals, each, async, rerender, and template nodes all emit the same open/close marker pattern. Inside the markers, the server renders the content that matched:

```html
<!--sui-block:v1:2-->
  <span class="on">Visible</span>
<!--/sui-block:v1:2:b1000-->
```

For `{#async}`, the server always renders `loadingContent` (never awaits the promise). The client's hydration wires the real async Reaction which fetches and replaces.

### expandCustomElements

`packages/component/src/expand-custom-elements.js`

After the top-level component renders, its HTML may contain nested custom element tags (e.g., `<ui-icon icon="star">` inside a button template). This function:

1. Scans the HTML string for tags containing a hyphen (custom element spec)
2. Looks up each tag in the component registry
3. Skips elements that already have a DSD (Astro pre-renders child components in some paths)
4. Calls `renderToString` recursively with a depth counter (max 10)
5. Applies `fromAttribute` converters to deserialize attribute strings into typed values

This is string-level processing — no DOM parsing. It uses a hand-written parser (`findNextCustomElement`, `parseOpenTag`, `findClosingTag`) that handles nesting, self-closing tags, and quoted attributes.

---

## Phase 3: Browser DSD Parsing

When the browser encounters `<template shadowrootmode="open">` during HTML parsing:

1. It creates a shadow root on the parent element (mode: open)
2. It moves the template's content into the shadow root
3. It removes the `<template>` element itself

This happens during HTML parsing, before any JavaScript loads. The user sees styled content immediately because:
- The shadow root isolates styles (component CSS is in a `<style>` tag inside the DSD)
- The content structure matches what the component would render on the client
- No flash of unstyled content, no layout shift

---

## Phase 4: Custom Element Upgrade

When the component's JavaScript loads and `customElements.define()` runs, the browser upgrades all matching elements.

### Constructor

```js
constructor() {
  super();
  // If the element has a declarative shadow root, suppress requestUpdate
  // until hydration completes — attribute parsing fires before
  // connectedCallback and would schedule a render cascade
  if (this.shadowRoot) {
    this._hydrating = true;
  }
  // ... initialize settings, property store
}
```

The `_hydrating` flag prevents attribute-triggered re-renders during the upgrade phase. Without this, `attributeChangedCallback` would fire for every server-rendered attribute and schedule renders before the template is ready.

### connectedCallback — The Decision Point

```js
connectedCallback() {
  if (this.template) return;           // already initialized
  if (this.hasAttribute('ssr')) return; // marked as server-only, skip

  const hasServerContent = this.shadowRoot && this.shadowRoot.childNodes.length > 0;

  if (!this.shadowRoot) {
    this.attachShadow({ mode: 'open', delegatesFocus });
  }

  if (hasServerContent && this.canHydrate()) {
    // DSD present and markers are compatible — defer hydration
    requestAnimationFrame(() => this.hydrate(prototypeTemplate));
  } else {
    if (hasServerContent) {
      this.shadowRoot.innerHTML = ''; // version mismatch — discard
    }
    this.fullRender(prototypeTemplate);
  }
}
```

Three paths:

| Condition | Path | What happens |
|-----------|------|-------------|
| No existing shadow root | `fullRender()` | Standard client render — `attachShadow`, clone template, initialize, render, append |
| DSD present + compatible markers | `hydrate()` | Wire Reactions to existing DOM, no re-render |
| DSD present + incompatible markers | `fullRender()` | Discard server content, render from scratch |

**`canHydrate()`** walks shadow root comments looking for versioned markers (`sui:v1:` or `sui-block:v1:`). If found, it checks the version matches `MARKER_VERSION`. No markers means static content — safe to hydrate (nothing to wire).

**`requestAnimationFrame`** — Hydration is deferred one frame so the browser can paint the server-rendered content first. The user sees the visual immediately; interactivity arrives on the next frame.

---

## Phase 5: Hydration

`WebComponentBase.hydrate()` in `packages/component/src/engines/native/base.js`

Hydration wires reactive bindings to the existing server-rendered DOM. It does not re-render or validate the server's output — it trusts the DOM is correct and attaches the machinery for future reactivity.

### The hydrate() Method

```js
hydrate(prototypeTemplate) {
  // 1. Remove server <style> — CSS is handled via adoptedStyleSheets
  this.shadowRoot.querySelector('style')?.remove();

  // 2. Clone template with data context (same as fullRender)
  this.template = prototypeTemplate.clone({ data: this.getData(), element: this, renderRoot });
  this.template._isHydrating = true;
  this.component = this.template.instance;

  // 3. Build entries from AST (cached on prototype — depends only on AST, not data)
  if (!prototypeTemplate._hydrationEntries) {
    const { entries } = this.template.renderer.buildHTMLString(this.template.ast);
    prototypeTemplate._hydrationEntries = entries;
  }

  // 4. Walk server DOM, wire Reactions to existing nodes
  this.template.renderer.hydrateMarkers(
    this.shadowRoot, entries, data, scope
  );

  // 5. Clean up
  this.template._isHydrating = false;
  this._hydrating = false;
  this.removeMarkers();  // remove all comment markers for clean DevTools
  setTimeout(() => this.template?.onRendered(), 0);
}
```

### hydrateMarkers — The Core Algorithm

`Renderer.hydrateMarkers()` in `packages/renderer/src/engines/native/renderer.js`

Two passes over the server-rendered DOM:

**Pass 1: Attribute bindings** — The server stamps `data-sui-bind="attr=N,..."` on every element with dynamic bindings (Plan 04 fast path). The client walks `[data-sui-bind]` elements at top level and wires Reactions directly via `entries[id].attributeBinding`. Block-owned elements (inside `{#if}`/`{#each}`/etc., tracked via `blockDepth` from comment markers) are skipped — block handlers recurse into their own contents via `hydrateInnerContent`. A legacy fallback (parallel ref-DOM walker) exists for older SSR output without `data-sui-bind`.

**Pass 2: Comment markers** — A TreeWalker finds `<!--sui:v1:N-->` (text expressions) and `<!--sui-block:v1:N-->` (block directives) at top level. `blockDepth` tracking skips inner markers; block handlers process their own children.

For each marker:

| Marker type | Hydration action |
|-------------|-----------------|
| Text expression | Wire a Reaction that sets `textNode.data` on change |
| Conditional block | Collect owned DOM nodes between open/close markers, wire Reaction for future branch changes |
| Each block | Adopt server-rendered per-item DOM via `<!--sui-item:v1:KEY-->` markers and wire per-item Reactions in place — see "Each block hydration" below |
| Template/snippet | Collect owned nodes, initialize subtemplate, recursively hydrate inner markers |
| Async block | Wire the full async Reaction (loading → resolved → error), existing loading content gets replaced when promise resolves |
| Rerender block | Collect owned nodes, wire the rerender/guard Reaction |

### The skipFirstWrite contract

When debugging "my signal mutation doesn't update the DOM after hydration," name `skipFirstWrite: true` explicitly — it's the grep-able load-bearing mechanism in `packages/renderer/src/engines/native/reactive-data.js` and surfacing it lets the reader navigate the code path directly.

Per-binding Reactions wired during hydration use `skipFirstWrite: true`:

```js
scope.reaction(element, (comp) => {
  const value = renderer.lookupExpression(node.value, data);
  if (skipFirstWrite && comp.firstRun) { return; }
  // ... DOM write
});
```

The first run **evaluates the expression** (which is what registers signal dependencies as a side effect of accessing the data proxy) but **skips the DOM write** (the SSR'd value is trusted). This is the load-bearing piece for hydration correctness: the evaluation IS the witness for what signals the binding depends on. `Dependency.depend()` is a no-op when `Scheduler.current` is null, so the only way to register a dep is to read the signal *inside* a wired Reaction's compute callback. There is no "register without running" — the framework's per-expression reactivity guarantee comes from this arrangement.

When a per-binding Reaction *isn't* wired, the framework loses the ability to react to that expression's signals. There is no static substitute for the runtime witness.

### Each-block hydration: wire on hydrate, like every other block

`each.hydrate` honors the same "register Reactions on hydrate" contract every other block hook honors. It calls `adoptServerItems` immediately, which walks the server-rendered per-item DOM (`<!--sui-item:v1:KEY-->` markers), reuses each item's nodes, and wires per-item Reactions in place via `hydrateInnerContent` with `skipFirstWrite: true`. Same as conditional/svg/template — no opt-out, no special path.

```js
hydrate({ node, data, scope, region, renderAST, lookupExpression, hydrateInnerContent, self, isSVG }) {
  const { items, collectionType } = resolveItems(node, lookupExpression);
  if (items.length === 0) {
    if (node.elseContent) { /* hydrate elseContent in place + push isElse record */ }
    return;
  }
  const adopted = adoptServerItems({ ... });
  if (!adopted) { self.hasHydrated = true; }   // legacy SSR fallback (no per-item markers)
}
```

**Why this matters**: a prior perf pass made `each.hydrate` lazy — only register a dep on the items collection, defer per-item Reaction wiring to the first items mutation. The premise was that per-item bindings only depend on item-local data, so deferral was safe. That premise breaks the moment a per-item binding closes over external state (a helper reading `state.x`, a component method, a snippet arg). The docs site `inpage-menu` was the canonical repro: items arrived as a prop and never changed; `getItemClasses(item)` reading `state.activeID` never updated the rendered class because the per-item Reaction was never wired.

PR #175 first attempted to preserve the lazy path with a static-AST classifier that decided per-each whether content was "self-contained" enough to defer safely. That classifier was abstraction-breaking — a runtime shadow lexer with hardcoded JS-keyword tables and hardcoded block-name case statements, duplicating what the framework already knows at evaluation time. It was ripped out in favor of the canonical eager shape. The empirical bench at 1000 items showed eager wiring is **flat vs main** at the mount window; the lazy optimization wasn't paying for itself at any scale we measured.

**Snippet-with-args inside each** (`{#each item in items}<div>{>badge label=item.name}</div>{/each}`) is the same shape: per-item snippet arg evaluation needs per-item Reactions wired now. The canonical eager hydrate handles this implicitly — there's nothing special about snippet args.

### Key Hydration Behaviors

**Trust-then-wire** — Hydration doesn't re-evaluate conditions to validate server output. It trusts the DOM and wires Reactions. If state truly diverges (e.g., `initialize()` changes a setting), the Reaction fires naturally on the next microtask and updates the DOM. See `ssr-principles` for the full rationale.

**`_isHydrating` flag** — Set during hydration wiring. `createComponent` callbacks receive `isHydrating: true` so they can skip client-only setup that would conflict with the wiring pass. Template lifecycle events (`created`, `rendered`) are suppressed during hydration to avoid double-firing.

**`_hydrating` flag on element** — Set during constructor if DSD is detected. Prevents `attributeChangedCallback` from triggering `adjustPropertyFromAttribute` and `requestUpdate` during the upgrade phase. Cleared after hydration completes.

**Marker removal** — After hydration, `removeMarkers()` walks the shadow root and removes all `sui` comment nodes. This keeps DevTools clean and is possible because all Reactions are already wired to real DOM nodes (text nodes, elements), not to the markers themselves.

**Hydration entries are cached** on the prototype template (`_hydrationEntries`). They depend only on AST structure, not data, so all instances of the same component share them.

---

## Concrete Trace: Counter Component

Here is a concrete trace of a simple counter component through all phases:

```js
// Definition (shared between server and client)
const Counter = defineComponent({
  tagName: 'ui-counter',
  template: '<div class="counter">Count: {count}</div>',
  css: '.counter { padding: 8px; }',
  defaultState: { count: 0 },
  createComponent: ({ state, interval }) => ({
    initialize: () => interval(() => state.count.increment(), 1000),
  }),
});
```

**Server:**
```js
const html = renderToString(Counter, {});
```

1. `renderToString` creates data context: `{ count: 0 }`
2. `template.initialize()` calls `createComponent` — `interval()` is a no-op on server (`isServer: true`)
3. `ServerRenderer.render()` walks AST, produces:
   ```html
   <div class="counter">Count: <!--sui:v1:0-->0</div>
   ```
4. No nested custom elements to expand
5. Final output:
   ```html
   <ui-counter>
     <template shadowrootmode="open">
       <style>.counter { padding: 8px; }</style>
       <div class="counter">Count: <!--sui:v1:0-->0</div>
     </template>
   </ui-counter>
   ```

**Browser parse:** Shadow root created with content. User sees "Count: 0" immediately.

**JS loads:** `customElements.define('ui-counter', ...)` upgrades the element.
- Constructor detects `this.shadowRoot` exists, sets `_hydrating = true`
- `connectedCallback` detects DSD content, `canHydrate()` finds `sui:v1:` marker
- Defers: `requestAnimationFrame(() => this.hydrate(prototypeTemplate))`

**Hydration:**
1. Remove `<style>` tag (CSS moves to `adoptedStyleSheets`)
2. Clone template with `{ count: 0 }`, initialize — `createComponent` runs again, this time `interval()` is real, starts the timer
3. Build entries from AST: `[{ id: 0, type: 'expression', node: { value: 'count' }, classification: { type: 'text' } }]`
4. `hydrateMarkers` finds `<!--sui:v1:0-->`, wires a Reaction:
   ```js
   Reaction.create(() => {
     const value = this.eval('count', data);  // reads count Signal -> dependency registered
     textNode.data = value ?? '';              // sets "0" (no-op, already correct)
   });
   ```
5. Remove marker comments, clear `_hydrating`

**Live:** One second later, `state.count.increment()` fires. The count Signal updates to 1. The Reaction re-evaluates, sets `textNode.data = '1'`. The counter is ticking.

---

## Astro Integration

Semantic UI components render in Astro via the standard `client:*` directives. The integration uses the `source` export condition in `package.json` so Astro's Vite build processes component source directly.

```astro
---
import { Button, Icon } from '@semantic-ui/core';
---
<Button emphasis="primary" client:load>Click Me</Button>
<Icon icon="star" client:load />
```

For SSR, Astro calls `renderToString` during the build/SSR pass. The `client:load` directive tells Astro to include the component's JavaScript and hydrate on page load.

Components without `client:*` are rendered as server-only — they get the `ssr` attribute and are never hydrated. Their DSD is parsed and displayed, but no JavaScript is loaded for them.

For `client:only` components, there is no server render. The component renders entirely on the client via `fullRender()`. `forwardAstroProps()` ensures Astro-provided attributes are available before `connectedCallback`.

---

## Quick Reference

```
SERVER RENDERING
  renderToString(ComponentClass, attrs, { slots, depth, hydrate })
  -> normalize attrs (kebab->camel, fromAttribute converters)
  -> resolveAttributeAliases (spec fuzzing)
  -> merge: specDefaults + defaultSettings + attrs
  -> clone template, initialize (createComponent with isServer: true)
  -> ServerRenderer.render() -> HTML string with markers
  -> expandCustomElements() -> recursive DSD for nested components
  -> wrap in <template shadowrootmode="open">

HYDRATION MARKERS
  <!--sui:v1:N-->         text expression (followed by evaluated value)
  <!--sui-block:v1:N-->   block directive open
  <!--/sui-block:v1:N:bX--> block directive close (X = branch index)
  __suiN__                attribute marker (client buildHTMLString only, not in SSR output)

HYDRATION DECISION
  No shadow root              -> fullRender (standard client path)
  DSD + canHydrate()          -> requestAnimationFrame -> hydrate()
  DSD + version mismatch      -> discard server DOM -> fullRender
  hasAttribute('ssr')         -> skip entirely (server-only component)

HYDRATION WIRING
  1. Remove server <style> (CSS -> adoptedStyleSheets)
  2. Clone template, initialize (createComponent runs client-side)
  3. Build entries from AST (cached on prototype)
  4. hydrateMarkers:
       Pass 1: data-sui-bind fast path for attribute bindings
       Pass 2: TreeWalker over comment markers for text + blocks
       Per-binding Reactions use skipFirstWrite: true
       (evaluate to register deps, skip DOM write — server's value trusted)
  5. Remove all comment markers + data-sui-bind attributes (rAF)
  6. Fire onRendered

EACH BLOCK HYDRATION
  each.hydrate calls adoptServerItems immediately (canonical eager).
  Per-item Reactions wire in place against server DOM via item markers.
  Empty items + elseContent -> hydrate elseContent in place.
  Legacy SSR (no markers) -> set hasHydrated for nuke-rebuild fallback.

TESTING / BENCHING TRAPS (silent failures)
  innerHTML doesn't process DSD          -> use setHTMLUnsafe
  renderToString empty in browser env    -> Template.isServer = true (try/finally)
  bench under ~30ms can't resolve <±10%  -> bump items / loop op N times
  cross-session "regressed from peak"    -> phantom; read `vs main` table instead
```

---

## Key Files

```
packages/component/src/
├── render-to-string.js           renderToString — SSR entry point
├── expand-custom-elements.js     Recursive custom element expansion
├── component-helpers.js          Shared: resolveAttributeAliases, getUIClasses
├── engines/native/base.js        WebComponentBase — hydrate(), canHydrate(), fullRender()
└── engines/native/factory.js     Creates web component class with observedAttributes

packages/renderer/src/
├── build-html-string.js                              Shared HTML assembly + marker format constants
├── expression-evaluator.js                           Shared expression evaluation
├── engines/native/server.js                          ServerRenderer — AST -> HTML string
├── engines/native/renderer.js                        Renderer — hydrateMarkers(), hydrateAttributes()
├── engines/native/reactive-data.js                   bindAttribute / bindTextExpression with skipFirstWrite
└── engines/native/blocks/
    └── each.js                                       each.hydrate (eager adoptServerItems), item proxy

packages/renderer/test/
└── browser/ssr-hydration.test.js                     Canonical ssrAndHydrate helper (setHTMLUnsafe + Template.isServer)
```

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| **Render Pipeline** (`render-pipeline`) | How the client render pipeline works — AST, engines, expression evaluation |
| **SSR & Hydration Principles** (`ssr-principles`) | The governing constraints — trust-then-wire, shared helpers, mismatch prevention |
| **Native Renderer** (`native-renderer`) | Deep dive into native renderer internals (contributing audience) |
| **Component Authoring** (`component-authoring`) | Using `defineComponent`, lifecycle hooks, and SSR-safe patterns |
| **Mental Model** (`mental-model`) | Framework architecture and the Template-as-core-abstraction philosophy |
