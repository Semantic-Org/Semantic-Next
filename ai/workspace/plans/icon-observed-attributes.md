# Icon Observed Attributes Performance

## Problem

`<ui-icon>` has 4,920 `observedAttributes` (2,443 icon names × ~2x from compound alias generation due to `link` collision). Every `ui-icon` instance on the page pays this cost:

- **Class definition**: `Object.defineProperty` doesn't run for aliases (`noAccessor: true`), but the `observedAttributes` getter builds a 4,920-element array
- **Parse-time**: browser fires `attributeChangedCallback` for every attribute on every element that matches an observed attribute — `<ui-icon home>` triggers the full `adjustPropertyFromAttribute` resolution cascade
- **Property enumeration**: `getProperties()` iterates all 4,920 option attributes to build the property map

Pages commonly have 50-200 icons. This is the largest perf bottleneck on the docs site.

## Root Cause

The spec system treats every icon name as an `optionAttribute`, which the component pipeline promotes to an observed attribute. This made sense for components like button where `<ui-button primary>` needs reactive observation (changing `emphasis` dynamically is a real use case). For icons, the bare attribute (`<ui-icon home>`) is write-once — nobody dynamically swaps `<ui-icon home>` to `<ui-icon search>` by toggling bare attributes. They use `el.icon = 'search'` or `icon="search"`.

Meanwhile, icon already has its own JS alias resolution in `getIconParts()` via `iconAliases` from `icons.meta.js`. The spec-driven resolution through `attributeChangedCallback` is redundant with this existing system.

## Proposed Solution

### Spec-level opt-out

Add a flag to spec content/variation definitions that prevents option values from becoming observed attributes:

```js
// icon.spec.js
content: [
  {
    name: 'Icon',
    attribute: 'icon',
    options: ICON_OPTIONS,
    observeOptions: false,  // don't add icon names to observedAttributes
  },
]
```

### Pipeline changes

1. **`SpecReader.getWebComponentSpec()`** — partition `optionAttributes` into two maps:
   - `optionAttributes`: options from parts WITHOUT `observeOptions: false` (button's `primary`, etc.)
   - `staticOptionAttributes`: options from parts WITH `observeOptions: false` (icon names)

2. **`getProperties()`** (`component-helpers.js:55-66`) — skip `staticOptionAttributes` when building the property map. They don't need property entries at all.

3. **`factory.js:36-42`** — `observedAttributes` only includes entries from `optionAttributes`, not `staticOptionAttributes`. Icon observes only: `icon`, `disabled`, `loading`, `link`, `fitted`, `color`, `size`, `spin`, `set`, `href`, `target` (12 attributes).

4. **`resolveAttributeAliases()`** (`component-helpers.js`) — already checks `componentSpec.optionAttributes`. Needs to also check `staticOptionAttributes` for SSR and initial render resolution.

### One-time resolution in connectedCallback

Add an attribute resolution pass in `WebComponentBase.connectedCallback()` before rendering:

```js
connectedCallback() {
  // Resolve static option attributes once (e.g. <ui-icon home> → icon="home")
  const staticOpts = this.constructor.config?.componentSpec?.staticOptionAttributes;
  if (staticOpts) {
    for (const attr of this.attributes) {
      const canonical = staticOpts[attr.name];
      if (canonical) {
        this[kebabToCamel(canonical)] = attr.name;
        break; // icon can only have one value
      }
    }
  }
  // ... existing connectedCallback logic
}
```

This runs once, before the first render. The canonical `icon` property is observed, so subsequent changes via `el.icon = 'search'` or `el.setAttribute('icon', 'search')` work normally through `attributeChangedCallback`.

### SSR path

`renderToString` → `resolveAttributeAliases` already handles bare attributes before rendering. It needs access to `staticOptionAttributes` in addition to `optionAttributes`. No architectural change — just widen the lookup.

### Hydration path

Server output uses canonical attributes (`<ui-icon icon="home">`), so hydration never sees bare attributes. No change needed.

## Expected Impact

- `observedAttributes`: 4,932 → 12 for icon
- `getProperties` iteration: 4,932 → 12 for icon  
- `attributeChangedCallback` at parse time: fires for 1-3 attributes instead of scanning 4,920
- With ~2k aliases after cleanup: same proportional improvement

## Migration

- Non-breaking: `<ui-icon home>` still works (resolved in connectedCallback)
- Non-breaking: `<ui-icon icon="home">` still works (observed attribute)  
- Non-breaking: `el.icon = 'home'` still works (property accessor on canonical attribute)
- Behavioral change: `el.setAttribute('home', '')` after mount won't reactively update (was never a real use case)

## Files to Change

| File | Change |
|------|--------|
| `packages/specs/src/spec-reader.js` | Support `observeOptions: false`, generate `staticOptionAttributes` |
| `src/primitives/icon/specs/icon.spec.js` | Add `observeOptions: false` to icon content |
| `packages/component/src/component-helpers.js` | Skip `staticOptionAttributes` in `getProperties()`, include in `resolveAttributeAliases()` |
| `packages/component/src/engines/native/factory.js` | Skip static options in `observedAttributes` |
| `packages/component/src/engines/native/base.js` | One-time static attribute resolution in `connectedCallback` |
| `packages/component/src/engines/lit/factory.js` | Same skip for Lit engine |
| `packages/component/src/render-to-string.js` | Widen alias lookup to include static options |
| `packages/component/src/expand-custom-elements.js` | Same |
