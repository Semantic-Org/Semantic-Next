# Lit Dependency Removal

## Goal

Remove Lit as a runtime dependency from `@semantic-ui/component`. Replace `WebComponentBase extends LitElement` with `ComponentBase extends HTMLElement`. After this, components using `renderingEngine: 'native'` have zero framework dependencies — just the platform.

## Design Principle

We are not reimplementing LitElement. Lit's lifecycle (`willUpdate`, `render` returning a TemplateResult, `updated`, `firstUpdated`, `static properties`) exists to serve Lit's diff/patch rendering model. The native renderer has a fundamentally different model: `render()` is called once to produce a DocumentFragment, and Reactions handle all subsequent DOM updates. There is no "return a description for the framework to process." The component IS the framework.

ComponentBase should be designed from scratch for the native renderer's actual requirements — not shaped by Lit's API surface.

## What ComponentBase Actually Needs

### The minimum surface

```js
class ComponentBase extends HTMLElement {
  connectedCallback()            // create shadow root, first render
  disconnectedCallback()         // cleanup
  attributeChangedCallback()     // attribute → property reflection
  requestUpdate()                // schedule re-render (called by adjustPropertyFromAttribute)
  updateComplete                 // Promise for test coordination
}
```

That's it. Everything else — lifecycle hooks, rendering, reactivity, event delegation, template traversal — is Template's job. Template already has `onCreated`, `onRendered`, `onDestroyed`, `onThemeChanged`. Template already manages state, settings, and the data context. Template already owns the Renderer.

ComponentBase is a thin shell: shadow root, property accessors, and the bridge between HTML attributes and the Template system.

### What Lit provided vs what actually matters

| Lit provided | What we actually need | Why |
|---|---|---|
| `static properties` → accessor generation | Property accessors on the prototype | Generate via `Object.defineProperty` in defineComponent |
| `willUpdate()` | Nothing | Lit's hook for pre-diff work. We don't diff. |
| `render()` → returns TemplateResult | Template.render() appends to shadow root directly | No return value, no framework processing |
| `updated()` | `renderCallbacks[]` | Simple callback list, no lifecycle ceremony |
| `firstUpdated()` | Part of `connectedCallback` flow | First render happens once in connectedCallback |
| `static get styles()` + `unsafeCSS()` | `adoptedStyleSheets` | One line: `sheet.replaceSync(css)` |
| `requestUpdate()` → triggers full render cycle | `requestUpdate()` → schedule data update | Only needs to update data context, not re-render |
| `updateComplete` Promise | Same | For test coordination. Resolve after microtask update. |
| `noChange` sentinel | Nothing | Told Lit not to touch the DOM. We don't touch it either. |
| Hydration support patches | DSD detection | Check `this.shadowRoot` exists in connectedCallback |

### The render flow

```js
connectedCallback() {
  if (!this.shadowRoot) {
    this.attachShadow({ mode: 'open', delegatesFocus });
  }

  // Adopt styles
  if (css) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  // Clone prototype template, initialize, render once
  this.template = prototypeTemplate.clone({
    data: this.getData(),
    element: this,
    renderRoot: this.shadowRoot,
  });
  this.template.initialize();
  const fragment = this.template.render(this.getData());
  this.shadowRoot.append(fragment);

  this.component = this.template.instance;
  this.dataContext = this.template.getDataContext();
}
```

After this, the component is alive. Reactions handle all updates. `requestUpdate()` is only called by `adjustPropertyFromAttribute` for special properties — it updates the data context and bumps `dataVersion`, but does NOT re-render the template.

```js
requestUpdate() {
  if (this._updateScheduled) { return; }
  this._updateScheduled = true;
  this.updateComplete = new Promise(r => { this._resolveUpdate = r; });
  queueMicrotask(() => {
    this._updateScheduled = false;
    if (this.template) {
      this.template.render(this.getData());
    }
    this._resolveUpdate?.();
  });
}
```

`Template.render()` on subsequent calls calls `renderer.setData()` + `renderer.bumpDataVersion()`. The Reactions that track `dataVersion` re-evaluate. DOM updates happen through Reactions, not through the component re-rendering.

### Property accessors

Properties are not a framework concept — they're just getters/setters that store values and call `requestUpdate()`.

```js
// In defineComponent, after class creation:
for (const [name, config] of Object.entries(properties)) {
  if (config.noAccessor) { continue; }
  Object.defineProperty(webComponent.prototype, name, {
    get() { return this[`__${name}`]; },
    set(value) {
      const old = this[`__${name}`];
      this[`__${name}`] = value;
      if (!config.hasChanged || config.hasChanged(value, old)) {
        this.requestUpdate();
      }
    },
    configurable: true,
    enumerable: true,
  });
}
```

Default values come from `setDefaultSettings()` in the constructor, not from the accessor. The accessor just stores and triggers updates.

### attributeChangedCallback

```js
attributeChangedCallback(attribute, oldValue, newValue) {
  // Type conversion (Boolean 'false' → false, etc.)
  const propName = kebabToCamel(attribute);
  const config = properties[propName];
  if (config?.converter?.fromAttribute) {
    newValue = config.converter.fromAttribute(newValue, config.type);
  }

  // Set the property (hits the accessor above)
  if (config && !config.noAccessor) {
    this[propName] = newValue;
  }

  // 3-dialect resolution for spec-driven components
  adjustPropertyFromAttribute({ el: this, attribute, attributeValue: newValue, properties, oldValue, componentSpec });

  // User callback
  onAttributeChanged?.(attribute, oldValue, newValue);
}
```

### Settings chain

The settings chain (`createSettingsProxy`, `getSettingsFromConfig`, `overlaySettingsSignals`) works unchanged. It depends on:

1. `this[propertyName]` returning the current value — our accessor provides this
2. `el.settings[property] = value` updating the Signal — Proxy set trap handles this
3. `el.requestUpdate()` existing — we provide it

Settings are plain props, not Signals. `settings.speed = 0.5` writes through the Proxy, `settings.speed` reads through the Proxy. The Proxy manages the Signal layer invisibly.

## Package Structure

```
packages/component/src/
├── define-component.js         ← modified: base class selection, conditional Lit imports
├── web-component.js            ← KEEP as-is for renderingEngine: 'lit'
├── component-base.js           ← NEW: extends HTMLElement, minimal surface
├── component-helpers.js        ← NEW: shared logic (getProperties, getPropertySettings,
│                                  createSettingsProxy, getSettingsFromConfig, setDefaultSettings,
│                                  getUIClasses, isDarkMode)
└── helpers/
    └── adjust-property-from-attribute.js  ← unchanged
```

`WebComponentBase` stays for Lit backwards compatibility. No renaming. Components with `renderingEngine: 'lit'` (or default) use it as before. Components with `renderingEngine: 'native'` use ComponentBase.

## Implementation Order

### Step 1: Extract shared helpers
Move renderer-agnostic methods from `WebComponentBase` to `component-helpers.js`. `WebComponentBase` imports and delegates to them. All existing tests pass, zero behavior change.

### Step 2: Build ComponentBase
Write the minimal class: `connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`, `requestUpdate`, `updateComplete`. Import shared helpers. No integration with defineComponent yet.

### Step 3: Wire defineComponent
Add base class selection based on `renderingEngine`. For native: use ComponentBase, generate property accessors, skip `unsafeCSS` / `noChange` imports. For lit: unchanged.

### Step 4: Test
Run full test suite with `RENDERING_ENGINES = ['lit', 'native']`. The native tests should produce identical results whether backed by LitElement or ComponentBase — the test suite doesn't know or care which base class is used.

### Step 5: Verify tree-shaking
Build a component with `renderingEngine: 'native'` only. Verify the bundle contains zero Lit code. This is the proof that the dependency is fully removed for the native path.

## What Changes in Template.render()

Currently `Template.render()` has a branch:

```js
if (!this.rendered) {
  this.html = this.renderer.render();
} else if (this.renderingEngine == 'native') {
  this.renderer.bumpDataVersion();
} else {
  this.renderer.bumpDataVersion();
}
```

With ComponentBase, the native path simplifies. `Template.render()` doesn't need the `renderingEngine` check — both paths call `bumpDataVersion()` on subsequent renders. The difference is handled by the base class: LitElement calls `render()` on every update (returning the cached TemplateResult), ComponentBase calls `Template.render()` only through `requestUpdate()` which bumps the data version.

## What defineComponent Looks Like After

```js
export const defineComponent = ({ renderingEngine, tagName, ... }) => {
  const isNative = renderingEngine === 'native';

  // ... AST compilation, prototype Template creation (unchanged)

  if (tagName) {
    const BaseClass = isNative ? ComponentBase : WebComponentBase;

    webComponent = class extends BaseClass {
      constructor() {
        super();
        this.css = css;
        this.componentSpec = componentSpec;
        this.settings = createSettingsProxy(this, { componentSpec, properties: webComponent.properties });
        setDefaultSettings(this, { defaultSettings, componentSpec });
      }

      getSettings() {
        return getSettingsFromConfig(this, { componentSpec, properties: webComponent.properties });
      }

      setSetting(name, value) { this[name] = value; }

      getData() {
        let data = { ...this.getSettings() };
        if (!isServer) { data.darkMode = isDarkMode(this); }
        if (componentSpec) { data.ui = getUIClasses(this, { componentSpec, properties: webComponent.properties }); }
        if (plural) { data.plural = true; }
        return data;
      }

      attributeChangedCallback(attribute, oldValue, newValue) {
        if (isNative) {
          // direct handling — no super needed
        } else {
          super.attributeChangedCallback(attribute, oldValue, newValue);
        }
        adjustPropertyFromAttribute({ ... });
        onAttributeChanged?.(attribute, oldValue, newValue);
      }
    };

    // Lit-specific setup
    if (!isNative) {
      webComponent.styles = unsafeCSS(css);
      webComponent.properties = getProperties({ properties, componentSpec, defaultSettings });
    }

    // Native-specific setup
    if (isNative) {
      const props = getProperties({ properties, componentSpec, defaultSettings });
      // observedAttributes
      Object.defineProperty(webComponent, 'observedAttributes', {
        get: () => Object.entries(props)
          .filter(([_, c]) => c.attribute !== false)
          .map(([n]) => camelToKebab(n)),
      });
      // Property accessors
      for (const [name, config] of Object.entries(props)) { ... }
    }

    customElements.define(tagName, webComponent);
  }
};
```

The Lit imports (`unsafeCSS`, `noChange`) only execute on the Lit path. Dynamic import or conditional assignment keeps them out of native bundles.

## Risks

### updateComplete timing semantics
Lit's `updateComplete` waits for pending reactive updates. Our `queueMicrotask`-based version resolves after the microtask. If Reactions scheduled during `bumpDataVersion` complete in the same microtask (which they do — Set.forEach visits dynamically added entries), this should be equivalent. Test suite is the validation.

### Subtemplate rendering
Subtemplates clone the prototype Template and call `initialize()` + `render()`. The clone inherits `renderingEngine` and creates the appropriate Renderer. With ComponentBase, subtemplates don't go through the web component lifecycle — they're bare Templates. This already works today. No change needed.

### Boolean attribute reflection
Lit auto-reflects boolean attributes. Native needs explicit handling in `attributeChangedCallback` via the existing `converter.fromAttribute` for Boolean type. Already specified in `getPropertySettings`.

## Dependencies

- Native renderer (complete)

## Status

Scoped. Ready to execute.
