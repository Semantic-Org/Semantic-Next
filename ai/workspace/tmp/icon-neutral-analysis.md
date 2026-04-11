# Analysis: Why a Nested Custom Element Disappears During Hydration

## Executive Summary

The `ui-icon` inside `ui-input` disappears during hydration because of a **timing gap between data construction and initialize() execution**. The `icon` setting is never present in the renderer's data context at the time hydration evaluates the `{#if icon}` condition, causing a false server/client mismatch that clears the server-rendered content. The Reaction wired afterward never re-fires because it has no dependency on the `icon` Signal.

---

## Question 1: Is the `icon` value visible in the data context during hydration?

**No. The `icon` setting is NOT in the renderer's data context when `hydrateBlockDirective` evaluates the `{#if icon}` condition.**

Here is the exact sequence:

1. **`hydrate()` in `base.js` line 111** calls `this.getData()` to build the initial data object. At this point, `initialize()` has NOT run, so `el.icon` is `undefined`. The `getSettings()` call inside `getData()` iterates `resolvedProperties` and reads `el[propertyName]` for each. Since no `icon` attribute was set on the `<ui-input>` tag (the server set it programmatically via `initialize()`), `el.icon` is `undefined` and `icon` is omitted from the data object entirely.

2. **`prototypeTemplate.clone({ data, element, renderRoot })` at line 113** creates a new Template. The Template constructor stores `this.data = data` (a direct reference to the object from step 1 which lacks `icon`). Because `renderRoot` is passed, the constructor calls `this.attach(renderRoot)` (template.js line 101-103), which calls `this.initialize()` (template.js line 329-331).

3. **Inside `Template.initialize()`**, `createComponent()` runs the user's `initialize()` method, which calls `configureSearch()`, which executes `settings.icon = settings.icon || 'search'`. The settings proxy setter (component-helpers.js line 249-260) does two things:
   - Calls `el.setSetting('icon', 'search')` which sets `el.icon = 'search'` on the element.
   - Creates a Signal for `icon` in `el.settingsVars`.

4. **The renderer is created at template.js line 267-272** with `data: this.overlaySettingsSignals(this.getDataContext())`. `getDataContext()` returns `{ ...this.data, ...this.state, ...this.instance }`. Here `this.data` is the object from step 1 (no `icon`). `this.state` is `{ focused: Signal(false) }`. `this.instance` contains the methods from `createComponent()` (not `icon`). So `icon` is NOT in the raw data context.

5. **`overlaySettingsSignals` (template.js line 359-388)** would overlay the `icon` Signal from `settingsVars`, BUT it only overlays signals for names present in `el.defaultSettings`. The Input component has no explicit `defaultSettings`, and the spec's `defaultValues` (from `input.component.js` line 103-110) only includes `name`, `type`, `debounced`, `debounce-interval`, `clearable`, `value` -- NOT `icon`. So the `icon` Signal is skipped.

6. **Result**: The renderer's `data` object does not contain `icon` in any form (neither as a plain value nor as a Signal).

7. **When `hydrateMarkers` processes the `{#if icon}` block**, `getServerRenderedAST` calls `this.eval('icon', data)`. The evaluator's `lookupTokenValue` first tries `getDeepDataValue(data, 'icon')` which returns `undefined`. Then it tries `evaluateJavascript('icon', data)` which executes `with (ctx) { return icon; }` but the proxy's `has` trap returns `false` for `icon`, causing a `ReferenceError` (caught silently), also returning `undefined`.

**The `icon` value set by `initialize()` is invisible to the renderer throughout the entire hydration process.**

---

## Question 2: Does the DocumentFragment disconnect/reconnect cycle disrupt the nested `ui-icon`?

**This code path is never reached for the `{#if icon}` block, so it does not cause the disappearance. But it WOULD cause problems if it were reached.**

The `hydrateInnerContent` call at renderer.js line 1296 is gated by:
```js
const contentAST = this.getServerRenderedAST(node, data);
if (contentAST && ownedNodes.length > 0) { ... }
```

Since `icon` evaluates to `undefined` in the data context (as established in Q1), `getServerRenderedAST` for the `{#if}` node returns `null`. The entire `hydrateInnerContent` path is skipped.

However, hypothetically, if `icon` WERE in the data context and this path executed:

- `hydrateInnerContent` moves owned nodes (including the `ui-icon` element) into a DocumentFragment via `container.appendChild(n)` (renderer.js line 1404-1406).
- Moving a connected custom element to a DocumentFragment fires `disconnectedCallback`, which in `base.js` lines 180-188 calls `template.onDestroyed()`, deletes `this.template`, `this.component`, and `this.dataContext`, and also calls `this.constructor.template?.onDestroyed()`.
- When the nodes are moved back to the live DOM via `region.anchor.after(frag)` (line 1299), `connectedCallback` fires again. Since `this.template` was deleted, the guard at line 55 (`if (this.template) return`) does not fire, and the element re-enters the full connection flow.
- The `ui-icon`'s DSD shadow root persists through the fragment move, so `hasServerContent` is still true and it would attempt to hydrate again.

This disconnect/reconnect cycle is a latent risk for any nested custom element inside a block directive, but it is NOT the cause of the current disappearance.

---

## Question 3: Does a false mismatch cause the server content to be cleared?

**Yes. This is the direct mechanism of the disappearance.**

In `hydrateBlockDirective` (renderer.js lines 1304-1336):

```js
const clientBranch = this.getBranch(node, data);
const serverBranchIndex = serverMeta.branchIndex;
const hasMismatch = serverBranchIndex !== undefined
  && serverBranchIndex !== clientBranch.matchIndex;
```

- `serverBranchIndex` is `1000` (from the closing marker `<!--/sui-block:v1:N:b1000-->`, indicating the server rendered the truthy branch).
- `clientBranch.matchIndex` is `-1` (because `icon` is `undefined` in the data context, so the condition is falsy).
- `hasMismatch` is `true`.

Since `clientBranch.contentAST` is `null` (matchIndex -1 means no branch matched), the code enters:
```js
else {
    region.clear();
}
```

`region.clear()` (dynamic-region.js lines 19-24) removes every node in `region.ownedNodes` from the DOM. This removes the `ui-icon` element and any other content from the `{#if icon}` block.

**The mismatch detection treats the missing `icon` as an intentional client-side difference and obliterates the server-rendered content.**

---

## Question 4: Could the Settings Signal trigger a Reaction re-run that restores the icon?

**No. The `hydrateConditional` Reaction will never re-fire for `icon` changes because it has no dependency on the `icon` Signal.**

After the mismatch clears the content, `hydrateConditional` is called (renderer.js line 1335). It creates a Reaction:

```js
scope.track(Reaction.create((comp) => {
    ...
    const result = this.getBranch(node, data);
    if (result.matchIndex !== currentBranchIndex) { ... }
}));
```

On the first run of this Reaction, `getBranch` calls `this.eval('icon', data)`. Since `icon` is not in `data`:
- `this.dataVersion.get()` IS called, establishing a dependency on `dataVersion`.
- The evaluator looks up `icon` in the data object, finding nothing. No Signal's `.get()` is called.

So the Reaction depends only on `dataVersion`, not on any `icon` Signal. For the `icon` Signal in `settingsVars` to trigger this Reaction, two conditions would need to hold:
1. The `icon` Signal would need to be in the data context so the evaluator calls `.get()` on it during evaluation.
2. Setting the Signal's value would need to invalidate the Reaction.

Neither condition holds. `overlaySettingsSignals` skipped `icon` because it's not in `defaultSettings`.

The `dataVersion` dependency could theoretically propagate a change if `bumpDataVersion()` were called. But `bumpDataVersion` is invoked by `Template.render()` (template.js line 763), and during hydration, `render()` is never called on the `ui-input` template. The hydration path (`hydrate()` in base.js) never calls `this.template.render()`.

Even if the `settings.icon = 'search'` setter fires the Signal asynchronously (via microtask flush in the reactivity system), that Signal is orphaned -- no Reaction depends on it.

**The icon is cleared during the mismatch and there is no mechanism to restore it.**

---

## Root Cause Chain

1. `hydrate()` calls `getData()` BEFORE `initialize()` runs, so the data object lacks `icon`.
2. `overlaySettingsSignals` only overlays signals for keys present in `el.defaultSettings`, and `icon` is a spec attribute without a default value, so it's excluded.
3. The renderer's data context has no `icon` (neither plain value nor Signal).
4. Hydration evaluates `{#if icon}` as falsy, detects a mismatch with the server's truthy branch, and clears the region.
5. The `hydrateConditional` Reaction has no dependency on `icon`, so it never re-evaluates.

The fundamental issue is that **settings mutated by `initialize()` are not reflected in the renderer's data context during hydration**. On the server and during client-only rendering, `initialize()` runs and then `render()` is called with a fresh `getData()` that includes the mutated settings. During hydration, `getData()` is called once (before `initialize()`) and the result is used throughout.

## Potential Fix Directions

There are at least two places where the chain could be broken:

**A. Re-compute data after `initialize()`**: In `hydrate()`, after `clone()` completes (which runs `initialize()`), call `getData()` again and update the renderer's data. This ensures any settings mutations from `initialize()` are visible.

**B. Expand `overlaySettingsSignals` scope**: Instead of only overlaying signals for keys in `defaultSettings`, overlay ALL signals in `settingsVars`. This would make the `icon` Signal part of the data context, and the Reaction would depend on it.

**C. Include spec attributes without defaults in `defaultSettings`**: Ensure all spec attributes are represented in `defaultSettings` (even as `undefined`), so `overlaySettingsSignals` processes them.

Option A is the most targeted fix: after `clone()` returns (meaning `initialize()` has run), rebuild the data and push it into the renderer before calling `hydrateMarkers()`.
