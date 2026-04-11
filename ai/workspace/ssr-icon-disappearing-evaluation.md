## Task: Evaluate why a nested custom element disappears during hydration

Read ALL source files listed below before answering. Evaluate the current code state — do not read git history or diffs.

### Architecture Overview

This is a web component framework with its own native DOM renderer. Components are defined with `defineComponent({ tagName, template, ... })` which registers a custom element. Components render into Shadow DOM.

**Server-side rendering (SSR):** `renderToString()` produces a DSD (Declarative Shadow DOM) HTML string. Nested custom elements inside templates are recursively expanded via `expandCustomElements()` — each nested component gets its own `<template shadowrootmode="open">` block.

**Client hydration:** When a server-rendered component connects, its `connectedCallback` detects the existing DSD shadow root, defers hydration to `requestAnimationFrame`, then calls `hydrate()`. Hydration walks the existing DOM using comment markers left by the server, wiring up reactive bindings (Reactions) to the existing nodes instead of creating new DOM.

### The Hydration Path

`WebComponentBase.hydrate()` (in `engines/native/base.js`):
1. Removes the server `<style>` tag (CSS uses `adoptedStyleSheets` on client)
2. Calls `prototypeTemplate.clone({ data })` which triggers `Template.initialize()` — this runs `createComponent()` and the user's `initialize()` method
3. Calls `renderer.hydrateMarkers()` which walks comment markers in the shadow root and wires Reactions to existing DOM nodes
4. Removes all hydration markers (comments)

### The Marker System

The server renderer produces comment markers for dynamic positions:
- `<!--sui:v1:N-->` for text expressions
- `<!--sui-block:v1:N-->` ... `<!--/sui-block:v1:N:bINDEX-->` for block directives (if/each/async/etc.)

The hydration system walks these markers and creates Reactions that update the existing DOM when data changes. For block directives like `{#if}`, it collects the "owned nodes" between the opening and closing markers, creates a DynamicRegion, and wires a Reaction that can swap content if the condition changes.

### Nested Custom Elements in SSR

When `renderToString` expands nested components, each gets its own DSD. For example, `<ui-input>` inside `<nav-menu>` produces:
```html
<nav-menu>
  <template shadowrootmode="open">
    ...
    <ui-input search fluid tiny>
      <template shadowrootmode="open">
        <div class="icon search fluid tiny input">
          <input type="text" placeholder="Search...">
          <ui-icon icon="search">
            <template shadowrootmode="open">...</template>
          </ui-icon>
        </div>
      </template>
    </ui-input>
    ...
  </template>
</nav-menu>
```

Each custom element hydrates independently via its own `connectedCallback` → rAF → `hydrate()`.

### The Input Component's Icon

The `ui-input` template contains:
```html
{#if icon}
  {#if isClearable}
    <ui-icon icon="x" link class="clickable icon" />
  {else}
    <ui-icon icon={getIcon} class="icon" />
  {/if}
{/if}
```

The `icon` property is NOT an HTML attribute on the `ui-input` element. It's set programmatically by `initialize()`:
```js
initialize() {
    if (settings.search) {
        self.configureSearch();
    }
},
configureSearch() {
    settings.icon = settings.icon || 'search';
}
```

So on the server, `initialize()` sets `icon = 'search'`, the `{#if icon}` condition is truthy, and the `ui-icon` renders. On the client during hydration, `initialize()` also runs (inside `template.clone()`), setting `icon = 'search'` via the settings proxy.

### Settings Proxy and Signals

Settings use a Proxy that creates shadow Signals. When `settings.icon = 'search'` is called:
- `el.setSetting('icon', 'search')` sets the value on the element
- A Signal is created/updated with value 'search'
- Reactions depending on this Signal are scheduled to fire on the next microtask flush

The settings Proxy's getter reads from `el.getSettings()`, creates/updates a Signal, calls `signal.get()` to register a dependency, and returns the raw value.

### Concrete Problems

1. After hydration of `ui-input`, the `ui-icon` element is completely absent from the shadow root DOM. The server HTML correctly contains it, but it disappears after the client hydration process completes.

2. The `ui-input` element's inner div class is correct (`"icon search fluid tiny input"`) after hydration, suggesting the `{ui}` class expression resolved correctly. But the `{#if icon}` conditional block's content (the `ui-icon`) is gone.

3. On the SSR-only route (no JavaScript, no hydration), the `ui-icon` is present and renders correctly.

4. On the client-only route (no SSR, full client render), the `ui-icon` is present and renders correctly.

5. The problem only manifests on the hydrated route — SSR + client hydration.

### Questions — Evaluate Independently

**Question 1:** During `ui-input`'s hydration, when `hydrateBlockDirective` processes the `{#if icon}` conditional, what is the value of `icon` in the data context? Is the settings mutation from `initialize()` visible to the renderer's data at that point?

**Question 2:** The hydration system moves owned nodes to a DocumentFragment and back during `hydrateInnerContent`. Could this disconnect/reconnect cycle disrupt the nested `ui-icon` element's DSD shadow root or trigger an unexpected `connectedCallback` sequence?

**Question 3:** When a conditional block's hydration evaluates the condition and detects a "mismatch" between server and client branches, it re-renders from scratch. Could the `{#if icon}` be evaluated at a moment when `icon` is not yet in the data context, causing a false mismatch that clears the server content?

**Question 4:** The `hydrateConditional` Reaction has a `firstRun` that evaluates the condition but skips DOM changes (trusting server content). On subsequent runs, if the branch index changes, it re-renders. Could the settings Signal for `icon` be triggering a Reaction re-run with a stale or incorrect data context?

### Source Files to Read
- `packages/component/src/engines/native/base.js` — WebComponentBase, hydrate(), fullRender()
- `packages/renderer/src/engines/native/renderer.js` — hydrateMarkers(), hydrateBlockDirective(), hydrateConditional(), hydrateInnerContent()
- `packages/renderer/src/engines/native/dynamic-region.js` — DynamicRegion
- `packages/component/src/component-helpers.js` — createSettingsProxy(), getUIClasses()
- `packages/templating/src/template.js` — Template.initialize(), overlaySettingsSignals(), getDataContext() (lines 175-275 and 349-390)
- `src/primitives/input/input.js` — Input component, configureSearch()
- `src/primitives/input/input.html` — Input template with {#if icon}
