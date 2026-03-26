## Task: Evaluate how subtemplates should access reactive external data

Read ALL source files listed below before answering. Evaluate the current architecture and answer the questions based on what you find in the code.

### Architecture Overview

This is a UI framework with a component system built on Lit. Components are defined with `defineComponent()` which can produce either:
- **Web components** (when `tagName` is provided) — custom elements with shadow DOM, Lit properties, settings proxy
- **Subtemplates** (no `tagName`) — lightweight templates rendered inside a parent via `{>childTemplate data=value}`

Both use the same `Template` class internally but have different lifecycle and data-passing mechanisms.

### Data Access in createComponent

When a component is defined, `createComponent({ data, settings, state, signal, self, findParent, ... })` runs once during initialization. The destructured parameters are closure-captured — they're available to all returned methods for the component's lifetime.

- **`data`** — A snapshot of the template's data context at initialization time. Set as `this.data` on the Template, passed as `data: this.data` in `Template.call()`. When `setDataContext()` replaces `this.data` with a new object, closures still hold the old reference.
- **`state`** — Reactive signals local to the template. `state.foo.get()` tracks dependencies.
- **`settings`** — For web components: a Proxy backed by shadow signals (see `createSettingsProxy` in `web-component.js`). Accessing `settings.foo` always reads the current value and tracks a shadow signal for reactivity. For subtemplates: currently `this.element?.settings` which gives the **parent** web component's settings proxy.
- **`self`** — Reference to the component instance (the return value of `createComponent`).
- **`findParent(name)`** — Traverses up to find a parent template instance. Returns a live merged object.

### The Settings Proxy Pattern

Web components create a reactive proxy for settings in `WebComponentBase.createSettingsProxy()`. This proxy:
- On `get`: reads the current setting value, creates/touches a shadow Signal, returns the value
- On `set`: updates the setting, bumps the shadow Signal
- Shadow signals are overlaid into the renderer's data context via `overlaySettingsSignals()`, making template expressions like `{collapsed}` reactive when `collapsed` is a setting

This is the proven pattern for making closure-captured references reactive. Even though `settings` is captured once in `createComponent`, every property access goes through the proxy and returns the current value.

### How Subtemplates Receive Data

When a parent template renders `{>itemTemplate todo=todo}`:
1. The compiler parses this as `reactiveData: { todo: 'todo' }` (all shorthand goes to `reactiveData`)
2. The renderer packs each prop into a function: `() => evaluateExpression('todo', data)`
3. The `renderTemplate` directive unpacks these functions to get current values
4. Values are passed to `Template.setDataContext()` then `Template.render()`
5. The renderer's `this.data` is updated with fresh values
6. Template expressions like `{todo.completed}` evaluate against the renderer's live `this.data` — these ARE reactive

But `data.todo` in `createComponent` closures points to the Template's `this.data` at initialization time. When `setDataContext` replaces `this.data`, the closure is stale.

### The Concrete Problem

A subtemplate like `todoItem` defines:
```js
createComponent: ({ data, self, signal }) => ({
  editing: signal(false),
  getClasses() {
    return {
      completed: data.todo.completed,  // reads from stale closure
      editing: self.editing.get(),
    };
  },
  toggleCompleted() {
    const todos = self.getTodos();
    todos.setProperty(data.todo._id, 'completed', !data.todo.completed);
  },
})
```

Template: `<li class="{classMap getClasses} todo-item">`

When the parent changes `todo.completed`, the template expression `{classMap getClasses}` re-evaluates (via `dataVersion` bump), calls `getClasses()`, but `data.todo.completed` returns the stale value from the closure-captured snapshot.

Note: `setProperty` mutates the item object in place, so `data.todo.completed` does reflect the new value for in-place mutations. But if the parent passes a new object entirely (different reference), the closure is fully stale.

Previously, this was masked because subtemplates did a full re-render on every data change (destroying and recreating all DOM). A recent fix changed subtemplates to update in place (preserving DOM for focus/state), which exposed the staleness.

### Framework Design Constraints

1. **Upgrade path**: The framework supports a progression from snippet → subtemplate → web component. Adding `tagName` to a subtemplate should be the only change needed to make it a web component. Code in `createComponent` should not need rewriting.

2. **Future syntax convergence**: `{>dropdownMenu}` may eventually resolve to a `<dropdown-menu>` web component if no subtemplate is defined. The data-passing mechanism must work for both.

3. **`data` as non-reactive**: The framework author's intent is that `data` should be a simple inspectable object — `console.log(data)` shows a flat object, no Proxy tricks. However, it is an open question whether `data` should be frozen at initialization or updated to reflect the latest render's values. A non-reactive snapshot of the LAST render (plain object, updated in place on each render) is a valid option. The key constraint is: `data` must not require proxy/signal machinery to use — it should just be an object.

4. **Template expressions are not sufficient**: Complex logic belongs in `createComponent` JS, not inlined in templates. A solution that requires moving all reactive reads into template expressions is not acceptable.

5. **Subtemplates need parent settings access**: A subtemplate like `dropdownMenu` inside a `<ui-dropdown>` needs `settings.useSearch` from the parent. Whatever mechanism provides reactive data to subtemplates must not break this existing access pattern.

### Questions — Evaluate Independently

**Question 1:** What mechanism should subtemplates use to reactively access data passed from the parent in `createComponent` JS? Consider: should it be a new concept, an extension of an existing concept (`data`, `settings`, `state`), or something else entirely?

**Question 2:** How should the upgrade path from subtemplate to web component work for external reactive data? If a subtemplate uses mechanism X for reactive data, what happens to that code when `tagName` is added?

**Question 3:** Are there approaches that avoid the closure-capture problem entirely — e.g., making `data` always live without changing its API surface, or providing a different hook that re-runs when data changes?

**Question 4:** The `settings` proxy in web components combines two concerns: (a) declaring the external API (via `defaultSettings`/component spec) and (b) reactive access with shadow signals. For subtemplates, are both concerns needed, or just one?

### Source Files to Read

- `packages/templating/src/template.js` — Template class, `call()`, `initialize()`, `render()`, `setDataContext()`, `overlaySettingsSignals()`
- `packages/component/src/web-component.js` — `createSettingsProxy()`, `getSettingsFromConfig()`, `setDefaultSettings()`, settings proxy pattern
- `packages/component/src/define-component.js` — `defineComponent()`, how settings/subTemplates/defaultSettings flow into Template and WebComponent
- `packages/renderer/src/lit/directives/render-template.js` — `RenderTemplateDirective`, how subtemplate data is unpacked and passed
- `packages/renderer/src/lit/renderer.js` — `LitRenderer`, `evaluateSubTemplate()`, `getPackedNodeData()`, `getPackedValue()`
- `packages/compiler/src/template-compiler.js` — `parseTemplateString()` (line ~580), how `reactiveData` vs `data` is determined
- `docs/src/examples/framework/todo-list/todo-item.js` — concrete example of the problem
- `docs/src/examples/framework/todo-list/todo-item.html` — the template using `{classMap getClasses}`
