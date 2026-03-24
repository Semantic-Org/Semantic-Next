# Subtemplate Settings — Reactive External Data for Subtemplates

## Problem

Subtemplates receive data from parent templates via `{>child todo=todo}`. This data is available in `createComponent` as `data.todo`, but `data` is a closure-captured snapshot — it reflects values at initialization time, not current values. Before the subtree caching fix, full re-renders masked this staleness. Now that subtemplates update in place (preserving DOM/focus), the snapshot is exposed as stale.

Web components solve this with `settings` — a reactive proxy backed by shadow signals. Subtemplates have no equivalent. `settings` in a subtemplate currently returns the parent web component's settings, which is useful (e.g., `settings.useSearch` on a dropdown menu subtemplate) but doesn't provide reactive access to passed data.

## Design Principles

Two framework principles constrain the solution:

**1. Simple upgrade path:** The progression subtemplate → web component should require only adding `tagName`. No rewriting of `settings.todo` to some other API. The same code must work in both contexts.

**2. Future WC-as-subtemplate syntax:** Eventually `{>dropdownMenu}` will resolve to `<dropdown-menu>` if no subtemplate is defined. The data-passing mechanism must work regardless of whether the target is a subtemplate or web component.

These principles mean `settings` is the right mechanism — not a new API, not a proxy on `data`.

## Design

### What changes

- Subtemplates can declare `defaultSettings` (their external API)
- Passed `reactiveData` props that match `defaultSettings` keys flow into the subtemplate's settings
- `settings` in a subtemplate's `createComponent` is a merged proxy:
  - Own settings (from `defaultSettings` + passed data) — checked first
  - Parent web component settings — fallback
- Shadow signals on own settings for reactivity
- `data` stays a snapshot everywhere — no behavioral change

### What stays the same

- Web component settings behavior is unchanged
- `data` parameter in `createComponent` remains a snapshot
- Template expression reactivity via `dataVersion` is unchanged
- The `reactiveData` vs `data` packing distinction at the compiler level is unchanged

### Example

```js
// Subtemplate with settings
const todoItem = defineComponent({
  templateName: 'todoItem',
  defaultSettings: { todo: null },
  createComponent: ({ settings, signal }) => ({
    editing: signal(false),
    getClasses() {
      return {
        completed: settings.todo.completed,  // reactive, always current
        editing: self.editing.get(),
      };
    },
  }),
});

// Invocation — compiler routes shorthand to reactiveData
// {>todoItem todo=todo}

// Upgrade to web component — add tagName, nothing else changes
const todoItem = defineComponent({
  tagName: 'todo-item',
  templateName: 'todoItem',
  defaultSettings: { todo: null },
  // identical createComponent
});
```

## Implementation Plan

### Step 1: Create subtemplate settings proxy in Template

**File:** `packages/templating/src/template.js`

In `Template.initialize()`, after `createComponent` runs, if `this.isSubtemplate()` and `this.defaultSettings` exists:

1. Create a `settingsVars` Map on the Template (shadow signals, same pattern as `WebComponentBase`)
2. Create a merged settings proxy:
   - `get(prop)`: check own `defaultSettings` first → touch/create shadow signal → return value. If not found, fall back to `this.element?.settings?.[prop]` (parent WC settings)
   - `set(prop, value)`: update own setting, bump shadow signal
3. Store as `this.settings`

The proxy creation can be a new method `createSubtemplateSettings()` modeled on `WebComponentBase.createSettingsProxy()`.

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

Subtemplates with own settings get their proxy. Subtemplates without `defaultSettings` still get parent settings (current behavior). Web components are unaffected (they don't set `this.settings` on the Template).

### Step 3: Update settings when new data arrives

**File:** `packages/templating/src/template.js`

In `Template.render()` or a new method called from it, when `this.isSubtemplate()` and `this.settings`:

1. Check which keys in the incoming data context match `defaultSettings`
2. For each match, set `this.settings[prop] = newValue` (triggers shadow signal via proxy set handler)
3. This happens before `bumpDataVersion()`, so reactions that read `settings.todo` fire with the new value

### Step 4: Overlay subtemplate settings signals into renderer data context

**File:** `packages/templating/src/template.js`

Modify `overlaySettingsSignals()` — currently skips subtemplates:
```js
if (this.isSubtemplate()) return context;
```

Change to: if subtemplate has own settings, overlay their shadow signals into the context (same pattern as web component settings overlay). This makes template expressions like `{settings.todo.completed}` reactive, and also makes `{todo.completed}` reactive if `todo` is a setting (since the signal is in the data context).

### Step 5: Update todo-item to use settings

**File:** `docs/src/examples/framework/todo-list/todo-item.js`

```js
const todoItem = defineComponent({
  templateName: 'todoItem',
  defaultSettings: { todo: null },
  createComponent: ({ self, settings, signal, findParent, $ }) => ({
    editing: signal(false),
    getClasses() {
      return {
        completed: settings.todo.completed,
        editing: self.editing.get(),
      };
    },
    getTodos() {
      return findParent('todoList').todos;
    },
    toggleCompleted() {
      const todos = self.getTodos();
      todos.setProperty(settings.todo._id, 'completed', !settings.todo.completed);
    },
    changeText(text) {
      const todos = self.getTodos();
      todos.setProperty(settings.todo._id, 'text', text);
    },
    removeTodo() {
      self.getTodos().removeItem(settings.todo._id);
    },
  }),
});
```

### Step 6: Revert todo-item.html classMap change

The template can go back to using `getClasses` since `settings.todo` is now reactive:
```html
<li class="{classMap getClasses} todo-item">
```

### Step 7: Write test for subtemplate settings

Add to `subtree-caching.test.js` — test 25 should use `defaultSettings` + `settings.todo` and verify the class updates reactively.

### Step 8: Run full test suite

Verify all 228+ tests pass, including the focus preservation tests (16, 20, 21) and the new settings test.

## Risk Assessment

- **Web component settings:** Unchanged — `this.settings` is only set on Template for subtemplates
- **Subtemplates without defaultSettings:** Unchanged — fall back to `this.element?.settings` (parent)
- **Existing tests:** The `overlaySettingsSignals` change needs care — only overlay subtemplate settings, not parent settings (which are already overlaid by the web component)
- **Settings proxy depth:** `settings.todo.completed` — the proxy gives you the `todo` object, but `.completed` is a plain property access on that object. This is fine for in-place mutations (`setProperty` mutates the object). For full object replacement, the shadow signal on `todo` fires and the proxy returns the new object.

## Open Questions

- Should subtemplate `defaultSettings` values serve as defaults (like web component defaultSettings)?  **Likely yes** — same semantics.
- Should the settings overlay into the data context use the Signal or the value? **Signal** — same as web components, so template expressions track the dependency.
- How does this interact with the verbose `data={}` (static) syntax? **It doesn't** — only `reactiveData` props map to settings. Verbose `data={}` stays snapshot.
