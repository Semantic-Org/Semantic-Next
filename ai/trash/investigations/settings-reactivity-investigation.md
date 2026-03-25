# Settings Reactivity vs Subtemplate Override Investigation

## Status
Test 17 passes; Test 18 fails. The `overlaySettingsSignals` mechanism makes settings reactive but clobbers subtemplate-provided data.

## The Two Tests

**Test 17** (`defaultSettings: { collapsed: false }`, template: `{#if collapsed}SHOW{else}HIDE{/if}`):
A method does `settings.collapsed = !settings.collapsed` via the settings proxy. The proxy's `set` trap calls `signal.set(value)` on the shadow Signal in `settingsVars`. The `{#if}` directive's Reaction tracks this Signal (via `signal.value` which calls `dependency.depend()`). When the Signal changes, the Reaction re-runs, finds a new branch, and calls `this.setValue(content)`. **This works correctly.**

**Test 18** (parent `defaultSettings: { label: 'parent-setting' }`, renders `{>child label=getOverride}`):
The child should see `'override-A'` (from `getOverride`), not `'parent-setting'`. **Currently shows `parent-setting`.**

## Root Cause

`overlaySettingsSignals` runs unconditionally on every template that has `this.element` set, including subtemplates. Subtemplates share the same `this.element` (the parent web component) because `render-template.js` calls `this.template.setElement(element)` where `element = this.part?.options?.host` (the parent host).

### The clobbering path:

1. Parent component has `defaultSettings: { label: 'parent-setting' }` and `settingsVars` with a Signal for `label` holding `'parent-setting'`.
2. Subtemplate is cloned with `data: { label: 'override-A' }` (from `{>child label=getOverride}`).
3. `attachTemplate()` calls `this.template.setElement(element)` -- sets the child's `element` to the parent web component.
4. `attach()` calls `initialize()` which calls `overlaySettingsSignals(getDataContext())`.
5. `overlaySettingsSignals` sees `this.element.settingsVars` has `label`, `this.element.defaultSettings` has `label`, so it overwrites `context.label` with the parent's Signal (value: `'parent-setting'`).
6. The child renders `<span>parent-setting</span>` instead of `<span>override-A</span>`.

### Why the guard is needed:

`overlaySettingsSignals` checks `this.element?.defaultSettings` which always refers to the **parent** web component's settings. A subtemplate created with `defineComponent({ template: '...' })` has no defaultSettings of its own. Its data is explicitly provided via `{>child label=someExpr}`.

The overlay is correct for the **primary** template (the component's own template) because that's where settings need to be reactive. But subtemplates rendered inside the same shadow root should NOT have their explicitly provided data overwritten.

## Distinguishing Primary vs Subtemplate

The parent web component stores its primary template as `this.template` (set in `willUpdate()`):
```js
this.template = litTemplate.clone({ data: this.getData(), element: this, renderRoot: this.renderRoot });
```

For the primary template: `this.element.template === this` (the web component's `.template` property IS this template).

For a subtemplate: `this.element.template !== this` (the web component's `.template` is the parent's primary template, not this child).

## Fix

Guard `overlaySettingsSignals` to only apply when the template is the component's own primary template:

```js
overlaySettingsSignals(context) {
    // Only overlay for the component's own template, not subtemplates rendered
    // in the same shadow root. Subtemplates share the same element but receive
    // their data explicitly via template invocation (e.g., {>child label=value}).
    if (this.element?.template && this.element.template !== this) {
      return context;
    }
    const settingsVars = this.element?.settingsVars;
    const defaultSettings = this.element?.defaultSettings;
    if (settingsVars && defaultSettings) {
      each(defaultSettings, (value, name) => {
        this.element.settings[name]; // ensure shadow signal exists
      });
      settingsVars.forEach((signal, name) => {
        if (name in defaultSettings) {
          context[name] = signal;
        }
      });
    }
    return context;
  }
```

### Why this works for both tests:

- **Test 17**: The component's primary template has `this.element.template === this`. The guard passes, settings Signals are overlaid, `{#if collapsed}` tracks the Signal reactively.
- **Test 18**: The child subtemplate has `this.element.template !== this` (element.template is the parent's template). The guard blocks the overlay, preserving the subtemplate's `label: 'override-A'`.

### Edge case: Timing of `this.element.template`

In `willUpdate()`, `this.template` is set before `initialize()` is called. So when `initialize()` calls `overlaySettingsSignals`, `this.element.template` is already set to `this`. For subtemplates, `setElement(element)` is called in `attachTemplate()` which runs before `initialize()`, and by that time `element.template` is already set to the parent's primary template.

## Debug Artifacts to Clean Up

Three `console.log` statements were left from a previous debugging session:

- `renderer.js:588` -- `[lookupTokenValue]` logging
- `renderer.js:769` -- `[updateData]` collapsed-specific logging
- `reactive-conditional.js:39` -- `[conditional]` reaction logging
