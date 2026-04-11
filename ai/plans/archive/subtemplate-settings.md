# Subtemplate Settings — Reactive External Data for Subtemplates

## Problem

Subtemplates receive data from parent templates via `{>child todo=todo}`. This data is available in `createComponent` as `data.todo`, but `data` is a closure-captured snapshot — it reflects values at initialization time, not current values. Additionally, `Signal.peek()` clones on read, so every signal mutation produces new object references — making plain object references to signal-managed data fundamentally stale.

Before the subtree caching fix, full re-renders masked this by destroying and recreating all directive instances each time. Now that subtemplates update in place (preserving DOM/focus), the staleness is exposed.

**Template expressions are NOT affected** — they evaluate against the renderer's live `this.data` and update correctly via `dataVersion`. The problem is only in `createComponent` JS code that reads `data.foo` from the closure.

## Design Principles

1. **Upgrade path**: Adding `tagName` to a subtemplate should be the only change needed to make it a web component. `settings.todo` must work identically in both contexts.

2. **Future syntax convergence**: `{>dropdownMenu}` may eventually resolve to `<dropdown-menu>` if no subtemplate is defined. The data-passing mechanism must work for both.

3. **`data` stays a snapshot**: `console.log(data)` shows a flat object, no proxy tricks. This is correct for the 90% case.

4. **Opt-in reactivity**: ~75% of subtemplates are naive abstractions (extracted markup, template-only expressions). They need zero ceremony. ~25% have JS logic that operates on changing parent data. Those opt into `defaultSettings`.

5. **Subtemplates need parent settings access**: A `dropdownMenu` subtemplate inside `<ui-dropdown>` needs `settings.useSearch` from the parent web component. The merged proxy preserves this.

## Design

### Two tiers of subtemplates

**Tier 1 — Naive (no `defaultSettings`, ~75% of usage):**
```js
const row = defineComponent({
  template: '<tr><td>{name}</td><td>{status}</td></tr>',
});
// Usage: {>row name=item.name status=item.status}
```
Template expressions handle reactivity. `data` is a snapshot. No `createComponent` needed, or a simple one that doesn't read `data` reactively. Zero ceremony.

**Tier 2 — Contract (with `defaultSettings`, ~25% of usage):**
```js
const todoItem = defineComponent({
  templateName: 'todoItem',
  defaultSettings: { todo: null },
  createComponent: ({ settings, signal }) => ({
    editing: signal(false),
    getClasses() {
      return {
        completed: settings.todo.completed,  // reactive via proxy
        editing: self.editing.get(),
      };
    },
  }),
});
// Usage: {>todoItem todo=todo}
```
Declares its external API. `settings.todo` is a reactive proxy backed by shadow signals. Upgrade to web component: just add `tagName`.

### Settings proxy for subtemplates

The `settings` object in a subtemplate with `defaultSettings` is a merged proxy:
- **Own settings** (from `defaultSettings` + passed `reactiveData`) — checked first
- **Parent web component settings** — fallback

```
settings.todo       →  subtemplate's own (from {>todoItem todo=todo})
settings.useSearch  →  parent web component (from <ui-dropdown use-search>)
```

Shadow signals on own settings provide reactivity. When the `renderTemplate` directive passes new data, matched keys are updated through the proxy's `set` handler, bumping signals.

### What stays the same

- Web component settings behavior is unchanged
- `data` parameter remains a snapshot everywhere
- Template expression reactivity via `dataVersion` is unchanged
- Subtemplates without `defaultSettings` behave exactly as before
- The `reactiveData` vs `data` packing distinction at the compiler level is unchanged

## Implementation Plan

### Step 1: Create subtemplate settings proxy in Template

**File:** `packages/templating/src/template.js`

Add method `createSubtemplateSettings(parentSettings)` modeled on `WebComponentBase.createSettingsProxy()`:

1. Create a `settingsVars` Map on the Template (shadow signals)
2. Initialize own settings from `defaultSettings` values
3. Create merged proxy:
   - `get(prop)`: check own settings first → touch/create shadow signal → return value. If not found, fall back to `parentSettings?.[prop]`
   - `set(prop, value)`: update own setting value, bump shadow signal
4. Store as `this.settings`

Called during `Template.initialize()` when `this.isSubtemplate() && this.defaultSettings`.

### Step 2: Pass subtemplate settings into createComponent params

**File:** `packages/templating/src/template.js`

In `Template.call()`, change:
```js
settings: this.element?.settings,
```
to:
```js
settings: this.settings || this.element?.settings,
```

- Subtemplates with own settings → their merged proxy
- Subtemplates without `defaultSettings` → parent WC settings (current behavior)
- Web components → unaffected (don't set `this.settings` on Template)

### Step 3: Populate settings from passed data on first render

**File:** `packages/templating/src/template.js`

During `Template.initialize()`, after creating the settings proxy, populate it from `this.data` (which contains the unpacked `reactiveData` from the parent):

```js
each(this.defaultSettings, (defaultValue, name) => {
  if (this.data[name] !== undefined) {
    this.settings[name] = this.data[name];
  }
});
```

### Step 4: Update settings when new data arrives

**File:** `packages/templating/src/template.js`

In `Template.render()`, when `this.isSubtemplate() && this.settings`, update settings from incoming data context before `bumpDataVersion`:

```js
if (this.settings && this.defaultSettings) {
  each(this.defaultSettings, (_, name) => {
    if (name in dataContext) {
      this.settings[name] = dataContext[name]; // triggers shadow signal
    }
  });
}
```

### Step 5: Overlay subtemplate settings signals into renderer data context

**File:** `packages/templating/src/template.js`

Modify `overlaySettingsSignals()` — currently skips subtemplates:
```js
if (this.isSubtemplate()) return context;
```

Change to: if subtemplate has own settings with `settingsVars`, overlay their shadow signals into the data context. This makes template expressions like `{todo.completed}` reactive through the settings signal when `todo` is a declared setting.

### Step 6: Update todo-item to use settings

**File:** `docs/src/examples/framework/todo-list/todo-item.js`

- Add `defaultSettings: { todo: null }`
- Change `data.todo` references to `settings.todo`
- Revert template to use `{classMap getClasses}` (settings makes it reactive in JS)

### Step 7: Write/update tests

- Update test 25 to use `defaultSettings` + `settings.todo` pattern
- Verify all existing tests still pass (naive subtemplates unchanged)
- Add test for merged proxy (subtemplate settings + parent WC settings fallback)

### Step 8: Run full test suite

Verify all 228+ tests pass.

## Risk Assessment

- **Web component settings**: Unchanged — `this.settings` is only set on Template for subtemplates with `defaultSettings`
- **Subtemplates without defaultSettings**: Unchanged — fall back to `this.element?.settings`
- **Proxy depth**: `settings.todo.completed` — proxy intercepts `todo` (returns current object, touches signal). `.completed` is plain property access on that object. Works correctly because signal cloning means the proxy always returns the current clone.
- **Data flow timing**: Settings are updated in `Template.render()` before `bumpDataVersion()`, so reactions see current values.
