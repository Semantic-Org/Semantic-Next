# Lit Dependency Removal

## Goal

Remove Lit as a runtime dependency from `@semantic-ui/component`. Replace `WebComponentBase extends LitElement` with `ComponentBase extends HTMLElement`. After this, components using `renderingEngine: 'native'` have zero framework dependencies — just the platform.

## Current State

The native renderer is complete and passes all 573 tests. But components still use LitElement as the base class even with `renderingEngine: 'native'`. Lit provides:

1. **`LitElement` base class** — shadow root, lifecycle, `render()` return processing
2. **`static properties`** — reactive property declarations → `observedAttributes` + accessor generation
3. **`static get styles()` + `unsafeCSS()`** — scoped stylesheet adoption
4. **`updateComplete` Promise** — async render coordination
5. **`requestUpdate()`** — batched re-render scheduling
6. **`willUpdate()` / `updated()` / `firstUpdated()`** — lifecycle hooks
7. **`noChange` sentinel** — tells Lit not to touch the DOM on subsequent renders

## What ComponentBase Must Provide

### Property/Attribute System

Replace Lit's `static properties` with native `observedAttributes` + `Object.defineProperty` accessors.

The current `WebComponentBase.getProperties()` already builds the property map from `componentSpec`, `defaultSettings`, and explicit `properties`. The shape `{ type, attribute, hasChanged, converter, noAccessor, alias }` is consumed identically — only who generates the accessors changes.

```js
// Lit: static properties = { ... } → Lit generates accessors internally
// Native: explicit accessor generation in defineComponent
static get observedAttributes() {
  return Object.entries(properties)
    .filter(([_, config]) => config.attribute !== false)
    .map(([name]) => camelToKebab(name));
}

// In defineComponent, after class definition:
for (const [name, config] of Object.entries(properties)) {
  if (!config.noAccessor) {
    Object.defineProperty(ComponentBase.prototype, name, {
      get() { return this[`_${name}`] ?? config.default; },
      set(value) {
        const old = this[`_${name}`];
        if (!config.hasChanged || config.hasChanged(value, old)) {
          this[`_${name}`] = value;
          this._scheduleUpdate();
        }
      },
    });
  }
}
```

### Attribute Change Handling

```js
attributeChangedCallback(attribute, oldValue, newValue) {
  const propName = kebabToCamel(attribute);
  const config = properties[propName];
  if (config?.converter?.fromAttribute) {
    newValue = config.converter.fromAttribute(newValue, config.type);
  }
  this[propName] = newValue;

  // 3-dialect resolution for spec-driven components
  adjustPropertyFromAttribute({
    el: this, attribute, attributeValue: newValue,
    properties, oldValue, componentSpec,
  });
}
```

`adjustPropertyFromAttribute` is already renderer-agnostic — it calls `el[property] = value` (hits our accessor), `el.settings[property] = value` (hits settings Proxy), and `el.requestUpdate()` for special properties.

### Settings Chain

The settings chain (`createSettingsProxy`, `getSettingsFromConfig`, `overlaySettingsSignals`) depends only on `this[propertyName]` returning the current value. Manual accessors satisfy this contract identically to Lit's generated ones. No changes needed to the settings system itself.

Key verification: the settings Proxy's `get` trap calls `component.getSettings()` → `getSettingsFromConfig()` → reads `this[propertyName]`. The `set` trap calls `component.setSetting(property, value)` → `this[property] = value`. Both work through whichever accessor is installed.

### Render Lifecycle

```js
_scheduleUpdate() {
  if (!this._dirty) {
    this._dirty = true;
    this.updateComplete = new Promise(resolve => {
      this._resolveUpdate = resolve;
    });
    queueMicrotask(() => this._performUpdate());
  }
}

_performUpdate() {
  this._dirty = false;

  if (!this.template) {
    this._initializeTemplate();
    this._adoptStyles();
    const fragment = this.template.render(this.getData());
    this.shadowRoot.append(fragment);
    this.component = this.template.instance;
    this.dataContext = this.template.getDataContext();
  }
  else {
    this.template.render(this.getData());
  }

  for (const cb of this.renderCallbacks) { cb(); }
  this._resolveUpdate?.();
}
```

### Style Adoption

```js
_adoptStyles() {
  if (!this.css) { return; }
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(this.css);
  this.shadowRoot.adoptedStyleSheets = [sheet];
}
```

### Shared Logic (Extract from WebComponentBase)

These methods are renderer-agnostic and should be shared between `LitComponentBase` (renamed from `WebComponentBase`) and `ComponentBase`:

| Method | Notes |
|--------|-------|
| `createSettingsProxy()` | Signal-backed reactive Proxy |
| `setDefaultSettings()` | Merge spec defaults |
| `getSettingsFromConfig()` | Read properties from element |
| `getUIClasses()` | CSS classes from spec attributes |
| `isDarkMode()` | Query-based dark mode detection |
| `getProperties()` | Build property map from spec |
| `getPropertySettings()` | Type conversion config |

Extract into `component-mixin.js` or `component-helpers.js`. Both base classes import and use it.

## defineComponent Changes

```js
export const defineComponent = ({
  renderingEngine = 'lit',
  // ... existing params
}) => {
  const isNative = renderingEngine === 'native';
  const BaseClass = isNative ? ComponentBase : LitComponentBase;

  // ... AST compilation, prototype Template creation (unchanged)

  if (tagName) {
    webComponent = class UIWebComponent extends BaseClass {
      // Shared: constructor, settings, getData, getSettings, setSetting
      // Lit-only: static get styles(), render() returning TemplateResult
      // Native-only: _performUpdate, _adoptStyles, _scheduleUpdate
    };

    // Native: generate property accessors
    if (isNative) {
      for (const [name, config] of Object.entries(webComponent.properties)) {
        if (!config.noAccessor) {
          Object.defineProperty(webComponent.prototype, name, { ... });
        }
      }
    }

    customElements.define(tagName, webComponent);
  }
};
```

The `import { noChange, unsafeCSS } from 'lit'` at the top of `define-component.js` becomes conditional — only imported for the Lit path. For native, these are unused.

## Package Structure

```
packages/component/src/
├── define-component.js         ← modified: BaseClass selection
├── lit-component-base.js       ← renamed from web-component.js
├── component-base.js           ← NEW: extends HTMLElement
├── component-helpers.js        ← NEW: shared logic extracted
└── helpers/
    └── adjust-property-from-attribute.js  ← unchanged
```

## Implementation Order

### Step 1: Extract shared logic
- Move renderer-agnostic methods from `WebComponentBase` to `component-helpers.js`
- `WebComponentBase` imports and uses helpers
- All existing tests pass, zero behavior change

### Step 2: Rename WebComponentBase → LitComponentBase
- Pure rename, update imports in `define-component.js`
- All existing tests pass

### Step 3: Build ComponentBase
- `extends HTMLElement`
- Shadow root creation, `_scheduleUpdate`, `_performUpdate`, `_adoptStyles`
- `updateComplete` Promise
- Property accessor generation
- Import shared helpers

### Step 4: Wire defineComponent
- `renderingEngine` selects base class
- Remove `noChange` usage for native path
- Conditional Lit imports

### Step 5: Remove Lit from native path
- Verify `renderingEngine: 'native'` components don't import Lit at all
- Tree-shaking verification: native-only builds exclude Lit

## Risks

### `updateComplete` timing
Lit's `updateComplete` has well-defined semantics including pending reactive updates. Our `queueMicrotask`-based version resolves after `_performUpdate` completes but doesn't wait for Reactions scheduled during the update. Tests rely on `await el.updateComplete` for assertion timing. May need `Reaction.afterFlush` integration.

### SSR compatibility
`WebComponentBase` has `ensureHydration()` for Lit SSR support. `ComponentBase` will need its own SSR story (see native-ssr plan). For now, SSR stays on Lit.

### Boolean attribute reflection
Lit handles boolean attribute reflection (`<ui-button primary="true"` → removes the `="true"` and keeps just `primary`). The `triggerAttributeChange` method in defineComponent does this explicitly. Needs verification with ComponentBase.

## Dependencies

- Native renderer (complete)
- No external dependencies

## Status

Scoped. Ready to execute.
