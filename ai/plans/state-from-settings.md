# State from Settings

**Priority:** 4 (above sizing/token work, below subtree caching — this is a DX primitive that unblocks clean component patterns)
**Status:** Not started
**Branch:** —

## Problem

Components often need to accept an initial value from an HTML attribute but then own that value internally via state signals. Today this requires manual shadowing — declaring the same key in both `defaultSettings` and `defaultState`, then seeding state from settings in `initialize()`. The access patterns for settings (proxy: `settings.x` / `settings.x = y`) and state (signal: `state.x.get()` / `state.x.set(y)`) are intentionally different, so promoting state to a setting currently requires rewriting every callsite.

Shadowing works but is undocumented, implicit, and easy to get wrong.

## Design

Extend `defaultState` to accept object-form metadata declarations alongside plain defaults:

```js
const defaultState = {
  todos: [],
  filter: { default: 'all', from: 'setting', mode: 'snapshot' },
  editingId: null,
};
```

### Object-form fields

| Field | Required | Values | Description |
|-------|----------|--------|-------------|
| `from` | yes | `'setting'` | Declares this state value should be seeded from the setting/attribute of the same name |
| `default` | no | any | Fallback if no attribute provided. If omitted, uses the setting's own default |
| `mode` | no | `'snapshot'` (default), `'sync'` | `snapshot`: read once at init, state owns it. `sync`: state tracks setting changes (future consideration) |
| `name` | no | string | Setting/attribute name if it differs from the state key |

### Semantics

- **Snapshot mode** (default): The attribute value is read once during component initialization and used to seed the state signal. From that point, the state signal is the single source of truth. Changes to `state.filter` do NOT reflect back to the `filter` attribute. External attribute changes after init are ignored.
- **Sync mode** (future): State tracks the setting reactively. External attribute changes update the state. Internal state changes still don't reflect to the attribute (one-way in, not out). This is the "controlled from outside" pattern.

### What doesn't change

- `state.filter.get()`, `state.filter.set()`, and all signal mutation helpers work identically
- Templates resolve `{filter}` from state (state shadows settings in the data context merge)
- Events, keys, lifecycle callbacks — all unchanged
- Settings proxy API unchanged for non-promoted settings

## Implementation

### 1. `define-component.js`

**Parse defaultState metadata** (~10 lines)

Before passing `defaultState` to the Template, scan entries for object-form declarations. Extract a `stateFromSettings` map of `{ key: { default, mode, name } }`. Replace object-form entries in `defaultState` with their plain defaults so the Template sees normal initial values.

**Register as Lit properties** (~3 lines)

Pass `stateFromSettings` keys to `WebComponentBase.getProperties()` so the attribute is observed by the web component. This is what makes `<todo-app filter="active">` work.

**Forward to Template** (~1 line)

Pass `stateFromSettings` through to the Template constructor so it knows which state signals to seed.

### 2. `web-component.js`

**`getProperties()`** — add `stateFromSettings` parameter (~5 lines)

Register each `stateFromSettings` key as a Lit property, same pattern as `defaultSettings` at line 104. Type inferred from default value constructor.

**`getData()` or `willUpdate()`** — pass attribute values (~3 lines)

When the template is cloned, include the current element property values for `stateFromSettings` keys so the Template can seed state signals.

### 3. `template.js`

**State signal initialization** (~5 lines)

When creating state signals during template clone, check if the key is in `stateFromSettings`. If so, read the element's property value. If non-default, use it as the signal's initial value instead of the `defaultState` default.

### Total: ~25 lines of framework code across 3 files

## Migration example

Before (manual shadowing):
```js
const defaultSettings = { filter: 'all' };
const defaultState = { filter: 'all' };

const createComponent = ({ state, settings }) => ({
  initialize() {
    state.filter.set(settings.filter);  // manual seed
  },
  // ...
});
```

After:
```js
const defaultState = {
  filter: { default: 'all', from: 'setting' },
};

// No initialize() seed needed. No defaultSettings entry for filter.
// state.filter.get() / .set() works as before.
// <todo-app filter="active"> seeds the signal at init.
```

## Open questions

1. **Should `sync` mode exist at v1?** It adds complexity (reaction setup, cleanup, edge cases with bidirectional updates). Could ship `snapshot` only and add `sync` if real demand appears.

2. **Attribute reflection for debugging?** In snapshot mode, the attribute becomes stale after init. Should the framework remove the attribute after consuming it, leave it stale, or add a debug-mode reflection option?

3. **Interaction with componentSpec?** Spec-driven primitives have their own attribute system. Should `from: 'setting'` work with spec attributes, or is this strictly for ad-hoc components?
