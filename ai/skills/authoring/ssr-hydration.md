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

**5. Compute `{ui}` classes** — After `initialize()`, because `createComponent` can modify settings that affect spec resolution (e.g., input's `configureSearch` sets `icon`).

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

**Pass 1: Attribute bindings** — The server didn't embed attribute markers (it evaluated them inline), so hydration can't find markers in the DOM. Instead, it builds a **reference DOM** from the AST's `buildHTMLString` output (which contains `__suiN__` markers), then walks the reference DOM and real DOM in parallel:

```
Reference DOM: <div class="__sui0__ card" data-count="__sui1__">
Real DOM:      <div class="dark card" data-count="3">
```

For each marker found in the reference element's attributes, the corresponding real element gets a Reaction wired. Block-owned elements (children inside `{#if}`, `{#each}`, etc.) are skipped because they're handled recursively by block hydration.

**Pass 2: Comment markers** — A TreeWalker finds `<!--sui:v1:N-->` (text expressions) and `<!--sui-block:v1:N-->` (block directives) at the top level only. Block nesting is tracked via `blockDepth` — inner markers are skipped because block handlers process their own children recursively.

For each marker:

| Marker type | Hydration action |
|-------------|-----------------|
| Text expression | Wire a Reaction that sets `textNode.data` on change |
| Conditional block | Collect owned DOM nodes between open/close markers, wire Reaction for future branch changes |
| Each block | Collect per-item DOM nodes, create item Signals and Proxies for each, wire Reaction for list changes |
| Template/snippet | Collect owned nodes, initialize subtemplate, recursively hydrate inner markers |
| Async block | Wire the full async Reaction (loading → resolved → error), existing loading content gets replaced when promise resolves |
| Rerender block | Collect owned nodes, wire the rerender/guard Reaction |

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
  4. hydrateMarkers: parallel walk for attributes, comment walk for text + blocks
  5. Remove all comment markers
  6. Fire onRendered
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
├── build-html-string.js          Shared HTML assembly + marker format constants
├── expression-evaluator.js       Shared expression evaluation
├── engines/native/server.js      ServerRenderer — AST -> HTML string
└── engines/native/renderer.js    Renderer — hydrateMarkers(), hydrateAttributes()
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
