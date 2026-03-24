# Settings Reactivity vs Subtemplate Override: Architecture Analysis

## The Two Failing Tests

**Test 17 (Settings-driven conditional)** -- NOW PASSING: `settings.collapsed = true` should cause `{#if collapsed}` to update reactively.

**Test 18 (Subtemplate data overrides parent setting)** -- STILL FAILING: `{>child label=getOverride}` should show `getOverride`'s value, not the parent component's `label` setting Signal.

## Root Cause: Exact Mechanics

### Why Test 17 Now Works

`overlaySettingsSignals()` in `template.js:275` replaces the plain `collapsed` value in the data context with the `collapsed` Signal from `settingsVars`. The renderer's `evaluateJavascript` proxy unwraps Signals via `signal.get()`, which registers a reactive dependency. When `settings.collapsed = true` fires the proxy setter, the Signal updates, the dependency invalidates, and the `{#if}` reaction reruns.

### Why Test 18 Fails

The subtemplate render pipeline:

1. **Parent renderer** evaluates `{>child label=getOverride}` via `evaluateSubTemplate()`
2. `getPackedNodeData()` returns `{label: () => getOverride()}` -- correctly packed, `inheritsData=false` (subtemplates don't inherit parent data)
3. `renderTemplate` directive creates the child Template clone with `data: {label: 'override-A'}`
4. **The bug**: `Template.render()` at line 652 calls `this.overlaySettingsSignals(dataContext)`
5. The child template's `element` was set to the **parent** web component by `attachTemplate()` at line 127 (`this.template.setElement(element)`)
6. `overlaySettingsSignals` reads `this.element.settingsVars` and `this.element.defaultSettings` -- these are the **parent's** settings
7. The parent has `defaultSettings: { label: 'parent-setting' }` and a corresponding Signal in `settingsVars`
8. The overlay **unconditionally** writes `context['label'] = signal` -- clobbering the override value

Console output confirms:
```
[lookupTokenValue] label data===this.data: true dataValue: Signal { currentValue: "parent-setting" } isSignal: true
```

The rendered output is `<span>parent-setting</span>` instead of `<span>override-A</span>`.

## The Core Architectural Tension

The system has two paths for settings values:

| Path | Where | Purpose |
|------|-------|---------|
| Plain values | `settings` proxy getter returns raw value | JS ergonomics: `settings.collapsed` returns `false`, not a Signal |
| Shadow Signals | `settingsVars` Map of Signals | Reactivity: renderer needs to track dependencies for re-rendering |

`overlaySettingsSignals` bridges these by putting the Signal directly into the data context so the renderer can track it. But it does so **after** all other data is assembled, and it doesn't know whether a given key came from a subtemplate's explicit override or from the component's own settings.

## Challenging the Architecture

### Is the shadow signal approach correct?

The shadow signal approach is architecturally sound for the *root* template of a component. The problem is only in how it's applied to *subtemplates*.

### Should settings be Signals in the data context?

For the root template: yes. Putting the Signal in the data context is the simplest way to make template expressions reactive to setting changes. The alternative (making every expression poll `settings.foo` through the proxy) would be slower and harder to maintain.

For subtemplates: **no**. Subtemplates don't own the settings. They receive explicit data via the call site (`{>child label=getOverride}`). The subtemplate's data context should be hermetic -- only what was explicitly passed in.

### Is there a way to make settings reactive without Signals in the data context at all?

Yes -- `dataVersion` bumping. When a setting changes via the proxy, it could bump `dataVersion` (which already exists on the LitRenderer). The `evaluateExpression` function already reads `this.dataVersion.get()` in its reactive path (renderer.js:393-398). But this is coarser-grained -- it would re-evaluate ALL expressions, not just the one depending on the changed setting. The Signal approach is more surgical.

## Proposed Solutions

### Solution A: Skip overlay for subtemplates (Minimal, Correct)

In `overlaySettingsSignals`, don't overlay a Signal if the key was explicitly provided in the subtemplate's data. This requires knowing which keys were explicitly passed.

```javascript
overlaySettingsSignals(context, { explicitKeys } = {}) {
    const settingsVars = this.element?.settingsVars;
    const defaultSettings = this.element?.defaultSettings;
    if (settingsVars && defaultSettings) {
      each(defaultSettings, (value, name) => {
        this.element.settings[name]; // ensure shadow signal exists
      });
      settingsVars.forEach((signal, name) => {
        if (name in defaultSettings && !(explicitKeys?.has(name))) {
          context[name] = signal;
        }
      });
    }
    return context;
}
```

**Problem**: We'd need to thread `explicitKeys` through the render pipeline.

### Solution B: Only overlay for root templates (Simple, Correct)

`overlaySettingsSignals` only makes sense for the root template of a web component -- the one that "owns" the settings. Subtemplates don't own settings; they receive data. So we can simply skip the overlay when the template is a subtemplate.

```javascript
overlaySettingsSignals(context) {
    if (this.isSubtemplate()) {
      return context;
    }
    // ... existing logic
}
```

**Risk**: What if a subtemplate legitimately needs to read a parent setting that wasn't explicitly passed? In the current architecture, subtemplates don't inherit parent data (`inheritsData=false`), so they already wouldn't see parent settings through normal data flow. The overlay was the only way they'd see them, and that was unintentional.

### Solution C: Don't set element on subtemplates to the parent (Most Correct)

The deeper issue is that `attachTemplate()` in `render-template.js:127` calls `this.template.setElement(element)` where `element` is the parent web component host. This gives the subtemplate access to the parent's settings, which is conceptually wrong. The subtemplate doesn't "belong to" the parent element in the settings sense -- it's just rendered inside it.

But `setElement` is also used for DOM traversal, event delegation, and style adoption. Removing it would break those. So this is the most correct but also most disruptive.

### Solution D: Overlay before spread, not after (Inverted Priority)

Currently: `data context = state + instance + settings overlay` (settings win).
Proposed: `data context = settings overlay + state + instance + explicit data` (explicit data wins).

This is essentially moving `overlaySettingsSignals` to run before the final spread of the data context. But the overlay needs the data context to exist first, so this requires restructuring the initialization order.

## Recommended Approach

**Solution B** is the correct fix. Here's why:

1. The `overlaySettingsSignals` method was designed for the root template -- the one created by `defineComponent` that renders inside the web component's shadow root. It needs settings Signals because that template's expressions directly reference settings names (`{collapsed}`, `{label}`).

2. A subtemplate created by `{>child label=getOverride}` is a **separate template** with its **own data context**. It doesn't reference parent settings by name -- it references what was passed to it. The `label` in the child's template refers to the `label` parameter passed at the call site, not the parent's setting.

3. The `isSubtemplate()` check is already available (checks `this.parentTemplate !== undefined`). A subtemplate clone created by `render-template.js` has `parentTemplate` set via `setParent()`.

**Timing verification**: `setParent` is called in `attachTemplate`, and the call chain guarantees correct ordering:

```
RenderTemplateDirective.render()
  -> this.renderTemplate()
    -> this.attachTemplate()     // calls setParent() -> parentTemplate is set
    -> this.template.render()    // calls overlaySettingsSignals() -> isSubtemplate() returns true
```

`attachTemplate()` always runs before `Template.render()` on both first render and re-renders. The `isSubtemplate()` check is safe.

## Implementation

Change `overlaySettingsSignals` in `template.js`:

```javascript
overlaySettingsSignals(context) {
    // Subtemplates receive explicit data from call sites.
    // Overlaying the parent element's settings Signals would clobber
    // values the caller intended to override (e.g., {>child label=getOverride}).
    if (this.isSubtemplate()) {
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

This makes test 17 continue to pass (root template still gets settings Signals) and test 18 pass (subtemplate's explicit `label=getOverride` is no longer overwritten).

## Debug Logging to Remove

The following files contain debug `console.log` statements that should be cleaned up:

- `packages/renderer/src/lit/renderer.js:588` -- `[lookupTokenValue]` logging in `lookupTokenValue()`
- `packages/renderer/src/lit/renderer.js:769` -- `[updateData]` logging in `updateData()`
- `packages/renderer/src/lit/directives/reactive-conditional.js:39` -- `[conditional]` logging in reaction

## Edge Cases to Verify

1. **Settings attribute changes on root component**: Still works -- root template is not a subtemplate.
2. **Subtemplate that happens to use same name as parent setting**: Gets the call-site value, not the parent Signal. This is correct behavior -- the call site is the contract.
3. **Snippets**: Snippets use `inheritsData=true` and are NOT subtemplates (no `parentTemplate`). They would still get the overlay. This is correct -- snippets share the parent's data context.
4. **Nested subtemplates**: Each level has its own `parentTemplate`. The overlay is skipped at every subtemplate level. This is correct.
