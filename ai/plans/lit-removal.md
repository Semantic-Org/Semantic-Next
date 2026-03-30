# Lit Dependency Removal

## Goal

Make `defineComponent` engine-agnostic. Both `WebComponentBase extends HTMLElement` and `LitWebComponentBase extends LitElement` are peer rendering engines behind the same `defineComponent` API. Components using the standard path have zero Lit dependencies.

## Status

**Complete.** Steps 1-4 implemented. 2121 tests passing across the monorepo.

Step 5 (tree-shaking verification) deferred — `defineComponent` still statically imports `createLitComponent` which pulls in `lit`. Full tree-shaking requires either subpath exports (`@semantic-ui/component/native`) or making the Lit factory registration lazy. Not a blocker for the architecture work.

## What Was Built

### File Structure

```
packages/component/src/
├── define-component.js      ← entry point, zero lit package imports
├── web-component.js         ← WebComponentBase extends HTMLElement
├── lit-web-component.js     ← LitWebComponentBase extends LitElement
├── component-helpers.js     ← shared functions both base classes use
├── create-component.js      ← standard factory (sets config + property accessors)
├── create-lit-component.js  ← Lit factory (all lit imports isolated here)
├── index.js                 ← public exports
└── helpers/
    └── adjust-property-from-attribute.js
```

### Symmetric Factory Pattern

Both factories have the same shape:

```js
// Standard
const component = class extends WebComponentBase {};
component.config = { resolvedProperties, componentSpec, ... };
component.template = prototypeTemplate;
component.properties = resolvedProperties;

// Lit
const component = class extends LitWebComponentBase {};
component.config = { resolvedProperties, componentSpec, ... };
component.template = prototypeTemplate;
component.properties = resolvedProperties;
```

A new rendering engine follows the same pattern: write a base class with its lifecycle, write a factory that sets config.

### Static Config Pattern

Both base classes read component-specific configuration from `this.constructor.config`:

```js
getSettings() {
  const { componentSpec, resolvedProperties } = this.constructor.config || {};
  return this.getSettingsFromConfig({ componentSpec, properties: resolvedProperties });
}
```

No inline method definitions in factories. No closure captures. The base class owns the methods; the factory sets the data.

### DOM Event Lifecycle

Components emit standard CustomEvents instead of using framework-specific Promises:

| Event | When | Replaces |
|-------|------|----------|
| `created` | After `initialize()` | — |
| `rendered` | After first render | `updateComplete` (first) |
| `updated` | After reactive DOM changes | `updateComplete` (subsequent) |
| `destroyed` | After `disconnectedCallback` | — |

Tests use `$(el).onNext('rendered')` and `$(el).onNext('updated')` to coordinate.

The `updated` event fires from three paths:
1. `Template.render()` on subsequent renders — `setTimeout(onUpdated, 0)`
2. State signal changes — `afterFlush(onUpdated)` via tracking Reaction in Template
3. Async resolution — `notifyUpdate()` in Renderer on `.then()` / `.catch()` only (not loading)

### Default Rendering Engine

`renderingEngine` defaults to `'lit'` in `defineComponent` to preserve SSR compatibility. Components that opt into the standard path pass `renderingEngine: 'native'`. The default will flip to `'native'` when SSR supports the standard renderer.

## Implementation Record

### Step 1: Extract shared helpers ✓
`7b9a2e0d` — Moved `getProperties`, `getPropertySettings`, `setDefaultSettings`, `getSettingsFromConfig`, `createSettingsProxy`, `getUIClasses`, `isDarkMode` to `component-helpers.js`.

### Step 2: Build WebComponentBase ✓
`71683bbe` — `WebComponentBase extends HTMLElement` with `connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`, `requestUpdate`. SSR guard via `isServer ? class {} : HTMLElement`.

### Step 3: Wire defineComponent ✓
`bf0f0211` — Separate factories in `create-component.js` and `create-lit-component.js`. `defineComponent` selects factory based on `renderingEngine`.

### Step 4: Test ✓
Both engines run the full test suite via `RENDERING_ENGINES = ['lit', 'native']`. 2121 tests passing across 53 test files. TodoMVC and Card Search visually verified on the standard renderer.

### Step 5: Tree-shaking — deferred
`defineComponent` imports `createLitComponent` statically. The `lit` package is reachable through the import graph even for standard-only builds. Options for full isolation:
- Subpath exports: `@semantic-ui/component/native`
- Dynamic import (Vite compatibility issues)
- Registration pattern (factory registry)

Not blocking — the architecture is clean regardless of bundle isolation.

## Dependencies

- Native renderer (complete)
- SSR plan at `ai/plans/native-ssr.md` (scoped, ready for fresh context)
