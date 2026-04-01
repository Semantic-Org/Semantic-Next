# Analysis: Why the nested `ui-icon` disappears during hydration

## Executive Summary

The icon disappears because of a **timing gap between hydration wiring and reactive scheduling**. During `ui-input`'s hydration, `hydrateConditional` sets `currentBranchIndex` to `1000` (truthy, the `{#if icon}` matched), trusting the server content. But then a **microtask-scheduled Reaction re-run** fires — triggered by the settings Signal mutation from `initialize()` — and at that point the Reaction re-evaluates `getBranch()`, gets the same branch index `1000`, sees `result.matchIndex !== currentBranchIndex` is false, and does nothing. That path is safe.

**The actual root cause is subtler and more destructive.** It lies in `hydrateInnerContent`'s DocumentFragment extraction and the interaction with nested custom element shadow roots and `connectedCallback` timing. Let me trace through the exact sequence.

---

## Question 1: Is the settings mutation from `initialize()` visible during `hydrateBlockDirective`?

**Yes, but through a specific mechanism that has timing implications.**

Here's the exact sequence inside `hydrate()` (base.js lines 104-147):

1. `getData()` is called (line 111), which calls `getSettings()` → `getSettingsFromConfig()`. At this point, `icon` is NOT in the settings because `initialize()` hasn't run yet. The `icon` property is not an HTML attribute on `<ui-input>` — it comes from `configureSearch()`.

2. `prototypeTemplate.clone({ data })` is called (line 113). This invokes the `Template` constructor, which at the end calls `this.initialize()` because `renderRoot` is passed (Template constructor line 101-103: `if (renderRoot) { this.attach(renderRoot); }` which calls `initialize()` via line 329).

   Wait — let me re-read this more carefully.

   Actually, `Template.clone()` (line 415-439) creates a `new Template(templateSettings)`. The Template constructor (line 44-104) does: if `renderRoot` is provided, call `this.attach(renderRoot)`. And `attach()` (line 326-347) does: `if (!this.initialized) { this.initialize(); }`.

   So `initialize()` runs during `clone()`. Inside `initialize()` (line 175-323):
   - `createComponent` is called (line 185-188), which returns the component instance including `initialize()`, `configureSearch()`, etc.
   - Then `template.instance.initialize()` is called (line 189-191), which runs `configureSearch()`, which sets `settings.icon = settings.icon || 'search'`.

3. The settings proxy setter (component-helpers.js line 249-260) fires:
   ```js
   set: (target, property, value, receiver) => {
     el.setSetting(property, value);   // sets el['icon'] = 'search'
     let signal = el.settingsVars.get(property);
     if (signal) { signal.set(value); }
     else {
       signal = new Signal(value);
       el.settingsVars.set(property, signal);
     }
     return true;
   }
   ```

   This creates a new Signal with value `'search'`. Since this is a *new* Signal (no prior subscribers), `signal.set(value)` goes through `this.value = newValue` which checks equality against `undefined` (initial), finds it different, and calls `this.dependency.changed()`. But **there are no subscribers yet** — no Reaction has called `signal.get()` on this Signal. So `dependency.changed()` iterates over an empty subscriber set. **No Reaction is scheduled.**

4. Then `overlaySettingsSignals()` runs (template.js line 268), which puts this Signal into the data context:
   ```js
   settingsVars.forEach((signal, name) => {
     if (name in defaultSettings) {
       context[name] = signal;
     }
   });
   ```

   But wait — is `icon` in `defaultSettings`? Looking at the Input component, there is no explicit `defaultSettings` in `defineComponent()`. The default settings come from the component spec. Let me check...

   Actually, `defaultSettings` on the element (set in constructor via `setDefaultSettings`) comes from `componentSpec.defaultValues` merged with the explicitly passed `defaultSettings`. The `icon` setting may or may not be in `defaultSettings` depending on whether the component spec declares a default for it.

   **This is critical.** `overlaySettingsSignals()` only overlays signals for keys that exist in `defaultSettings`. If `icon` is NOT in `defaultSettings`, then **the Signal for `icon` is NOT placed into the renderer's data context**. The renderer's data context will have the raw value from `getData()` — but `getData()` was called *before* `initialize()` ran.

   Let me trace this more carefully. In `hydrate()`:
   - Line 111: `const data = this.getData()` — called BEFORE clone. At this point, `icon` is undefined/absent from `getSettings()` because it hasn't been set yet.
   - Line 113-117: `prototypeTemplate.clone({ data, element: this, renderRoot: this.renderRoot })` — this runs `initialize()` inside, which sets `settings.icon = 'search'`. This modifies `el.icon` (via `setSetting`).
   - Line 122: `this.dataContext = this.template.getDataContext()` — this returns `{...this.data, ...this.state, ...this.instance}`. The `this.data` here is the *same object reference* passed to `clone()`, which was captured at line 111. **The `icon` property was set on the element (`el.icon = 'search'` via `setSetting`), but `this.data` is a snapshot from `getData()` taken before the mutation.**

   However, `overlaySettingsSignals()` runs during `initialize()` as part of constructing the renderer (template.js line 268). The renderer's `data` is the result of `this.overlaySettingsSignals(this.getDataContext())`. `getDataContext()` returns `{...this.data, ...this.state, ...this.instance}`. At this point, `this.data` is the original data object. But `this.instance` now includes `configureSearch`, `getIcon`, etc. And importantly, the Signal for `icon` only gets overlaid if `icon` is in `defaultSettings`.

**Verdict for Q1:** The value `icon = 'search'` IS set on `el.icon` by the time hydration markers are processed. The question is whether the renderer's `data` context object sees it. The renderer's `data` context was built during `initialize()` via `overlaySettingsSignals(getDataContext())`. Since `getDataContext()` merges `this.data` (the original snapshot), `this.state`, and `this.instance`, and since `icon` was set on `el` (not on `this.data`), it depends on whether:

1. The Signal for `icon` was overlaid into the context (only if `icon` is in `defaultSettings`), OR
2. The evaluator reads from `data.icon` which has the stale pre-initialize value

If `icon` is NOT in `defaultSettings`, the renderer data context will have `icon: undefined` (from the original `getData()` snapshot), and the Signal created by the settings proxy write won't be in the data context. **The `{#if icon}` evaluation would see `undefined` and evaluate to falsy.**

---

## Question 2: Does `hydrateInnerContent`'s DocumentFragment extraction disrupt the nested `ui-icon`?

**Yes, this is a significant contributing factor and potentially the primary mechanism of destruction.**

Look at `hydrateBlockDirective` (renderer.js lines 1248-1365). For the `{#if icon}` block:

1. Lines 1256-1281: It collects `ownedNodes` — all nodes between the opening `<!--sui-block:v1:N-->` and closing `<!--/sui-block:v1:N:b1000-->` markers. This includes the `<ui-icon>` element with its already-parsed DSD shadow root.

2. Lines 1292-1301: It calls `hydrateInnerContent(ownedNodes, contentAST, data, innerScope)`.

3. Inside `hydrateInnerContent` (lines 1398-1418):
   ```js
   const container = document.createDocumentFragment();
   for (const n of [...ownedNodes]) {
     container.appendChild(n);
   }
   ```

   **This moves nodes into a DocumentFragment, disconnecting them from the live DOM.** When a custom element is removed from the DOM, its `disconnectedCallback` fires. But more critically: when a `<ui-icon>` element is moved into a DocumentFragment, it loses its connection to the document.

   Then `hydrateMarkers` is called on this detached container. Then back in `hydrateBlockDirective` (lines 1297-1300):
   ```js
   const frag = document.createDocumentFragment();
   for (const n of ownedNodes) { frag.appendChild(n); }
   region.anchor.after(frag);
   ```

   The nodes are moved AGAIN — from the hydrated container into another fragment, then appended back into the live DOM. This triggers `connectedCallback` on `<ui-icon>` again.

**The `<ui-icon>` goes through: connected (DSD parse) → disconnected (moved to fragment for inner hydration) → connected (put back in DOM).** When it reconnects, its `connectedCallback` fires. At this point:
- It has a `shadowRoot` (from DSD), so `hasServerContent` is true
- `canHydrate()` checks for markers — but **the parent `ui-input`'s hydration process may have already removed markers from the `ui-icon`'s shadow root** (via `removeMarkers` at base.js line 144, which calls `removeComments(this.shadowRoot)` — but this is on `ui-input`'s shadow root, not `ui-icon`'s)

Actually, `removeMarkers` only removes comments from `this.shadowRoot` — each component's own shadow root. So `ui-icon`'s markers should still be intact.

But the real question is: when `<ui-icon>` reconnects and its `connectedCallback` fires, it will go through the `hydrate` path (rAF deferred). This is independent of `ui-input`'s hydration. The `<ui-icon>` will hydrate itself correctly from its own DSD content.

**However**, there's a subtler issue. The `connectedCallback` in base.js (line 54-88) has this guard:

```js
if (this.template) {
  return;
}
```

If `ui-icon` was previously connected (via DSD parse → implicit connectedCallback at page load), its first `connectedCallback` would have set up hydration via rAF. Then it gets disconnected (moved to fragment). Then reconnected (put back). The second `connectedCallback` fires — but if the rAF from the first connection already fired and set `this.template`, it returns early. If not, there could be two pending rAF callbacks.

The critical scenario: `ui-icon`'s first `connectedCallback` fires during page load (DSD parse). It schedules `requestAnimationFrame(() => this.hydrate(prototypeTemplate))`. Then `ui-input`'s hydration runs (also in rAF), which moves `ui-icon` to a DocumentFragment, disconnecting it. Then moves it back, triggering a second `connectedCallback`. Since `this.template` hasn't been set yet (the first rAF hasn't fired because we're still in the same frame or the rAF for `ui-icon` hasn't run), it schedules ANOTHER `requestAnimationFrame` for hydration.

But wait — actually the disconnect/reconnect during `hydrateInnerContent` happens *synchronously within* `ui-input`'s hydration, which itself is running inside a rAF callback. So by the time `ui-icon`'s rAF callback fires, the node may have been moved around.

**This is problematic but may not be the primary cause of the disappearance.** The DocumentFragment round-trip is wasteful and risky, but it shouldn't outright delete the icon.

---

## Question 3: Could `{#if icon}` evaluate to falsy at the wrong moment?

**Yes. This is the smoking gun.**

Let me trace the exact data flow:

1. `hydrate()` calls `this.getData()` which returns `{ ...getSettings(), darkMode, ui }`. At this point, `icon` is NOT in settings (it hasn't been set by `initialize()` yet). So `data.icon` is `undefined`.

2. `prototypeTemplate.clone({ data, ... })` runs. Inside `Template` constructor → `attach()` → `initialize()`:
   - `createComponent()` runs, returning the component instance
   - `instance.initialize()` runs, calling `configureSearch()` which sets `settings.icon = 'search'`
   - This writes to `el.icon = 'search'` (via `setSetting`)
   - A Signal is created for `icon` in `settingsVars`

3. `overlaySettingsSignals()` runs (template.js line 268). It iterates `defaultSettings`:
   ```js
   each(defaultSettings, (_, name) => {
     this.element.settings[name]; // ensure shadow signal exists
   });
   settingsVars.forEach((signal, name) => {
     if (name in defaultSettings) {
       context[name] = signal;
     }
   });
   ```

   The `icon` Signal is in `settingsVars`. But `icon` must be in `defaultSettings` for it to be overlaid. If `icon` IS in `defaultSettings` (because the component spec declares it), then `context.icon` becomes the Signal. The evaluator will call `signal.get()` → `signal.value` which returns `'search'` and registers the dependency.

   If `icon` is NOT in `defaultSettings`, the data context has `icon: undefined` (from the original `getData()` snapshot).

4. Now `hydrateMarkers` runs. It processes the `{#if icon}` block via `hydrateBlockDirective`. Inside, `getServerRenderedAST` is called (line 1292):
   ```js
   const contentAST = this.getServerRenderedAST(node, data);
   ```
   This calls `this.eval(node.condition, data)` which evaluates `icon` in the data context.

   **If `icon` is not in `defaultSettings`, `data.icon` is `undefined`, the condition is falsy, and `getServerRenderedAST` returns `null`.**

   When `contentAST` is null, the inner content is NOT hydrated (line 1293: `if (contentAST && ownedNodes.length > 0)`). The owned nodes just sit there unhydrated.

5. Then (line 1306):
   ```js
   const clientBranch = this.getBranch(node, data);
   const serverBranchIndex = serverMeta.branchIndex; // 1000
   const hasMismatch = serverBranchIndex !== undefined
     && serverBranchIndex !== clientBranch.matchIndex;
   ```

   If `icon` evaluates to falsy, `getBranch` returns `{ matchIndex: -1, contentAST: null }`. The server branch was `1000`. **This is a mismatch.** `hasMismatch` is `true`.

6. Lines 1322-1334: Mismatch handling:
   ```js
   if (clientBranch.contentAST) {
     // Re-render...
   } else {
     region.clear();
   }
   ```

   Since `clientBranch.contentAST` is `null` (the client thinks `icon` is falsy), **`region.clear()` is called**. This removes ALL owned nodes — including the `<ui-icon>` element. **The icon is destroyed.**

7. Then `hydrateConditional` wires a Reaction for future changes. The Reaction's first run evaluates `getBranch(node, data)` and sets `currentBranchIndex = -1`.

8. Later, when the microtask flush runs, if the `icon` Signal's dependency was subscribed somewhere, a Reaction re-run might fire. But the conditional Reaction already set `currentBranchIndex = -1`. Even if a subsequent reactive update makes `icon` truthy, the conditional would see `matchIndex: 1000 !== currentBranchIndex: -1`, detect a branch change, and re-render the content — but by this point the DSD shadow root of `<ui-icon>` is gone forever (the element was removed from DOM and a new one would need to be created from scratch).

**This confirms the root cause:** The `getData()` snapshot is taken before `initialize()` runs. The renderer's data context inherits this stale snapshot. Unless `icon` is in `defaultSettings` (triggering Signal overlay), the hydration system evaluates `{#if icon}` as falsy, detects a mismatch with the server (which rendered it as truthy), and clears the block content.

---

## Question 4: Could the settings Signal trigger a stale Reaction re-run?

**Yes, and the stale data context compounds the problem even if the Signal IS overlaid.**

Consider the case where `icon` IS in `defaultSettings` and gets overlaid as a Signal. The sequence:

1. During `initialize()`, `settings.icon = 'search'` creates a Signal with value `'search'`.
2. `overlaySettingsSignals()` puts this Signal into the data context.
3. `hydrateConditional` creates a Reaction. On first run, `getBranch()` calls `this.eval(node.condition, data)`. The evaluator resolves `icon` from data, finds the Signal, calls `signal.get()` which returns `'search'` and registers this Reaction as a subscriber.
4. `getBranch` returns `{ matchIndex: 1000 }`. `currentBranchIndex` is set to `1000`. The Reaction's first run is a no-op (trusts server content).

So far so good. But what if `icon` is NOT in `defaultSettings`?

The evaluator resolves `icon` from data. If it's a plain `undefined` (not a Signal), calling `this.eval('icon', data)` returns `undefined`. No Signal dependency is registered. The Reaction will **never re-run** when `icon` changes — it has no reactive dependency on the icon Signal. The icon stays gone forever.

Even if something later causes the Reaction to re-run (e.g., `dataVersion.get()` in `getBranch` path), the data context still has `icon: undefined` because the stale snapshot was never updated.

---

## Root Cause Analysis

The fundamental design flaw is a **temporal coupling between `getData()` and `initialize()`**. The hydration path calls `getData()` BEFORE `clone()` (which runs `initialize()`), capturing a snapshot that misses any settings mutations made by `initialize()`. The client render path (`fullRender`) has the same issue in principle, but it works because:

1. `fullRender` calls `template.render(this.getData())` AFTER `clone()` + `initialize()`.
2. `render()` calls `this.getDataContext()` which picks up the current state.
3. More importantly, the Reactions created during `readAST` evaluate the condition fresh, and by the time the DOM is constructed, the settings mutations are visible.

In contrast, the hydration path evaluates conditions against the stale `data` object to determine whether the server content matches the client state.

## How Other Frameworks Handle This

**Lit (LitElement + @lit-labs/ssr):**
Lit's hydration model doesn't evaluate template expressions to decide whether to keep server content. Instead, it walks the DOM and blindly wires bindings to existing nodes. Expression values are evaluated lazily — the first reactive update applies the client value. If there's a mismatch, the DOM mutates to match the client (which may cause a visual flash), but nothing is destroyed.

**Svelte:**
Svelte's hydration (`claim_*` functions) walks the DOM positionally, claiming nodes by tag/type. It doesn't evaluate conditions to validate server output. The component initializes fully first, then hydration claims existing DOM nodes. Mismatches produce warnings but don't clear content.

**Solid:**
Solid's hydration walks DOM by marker IDs and binds signals to existing nodes. Like Lit, it doesn't re-evaluate conditionals to validate server output — it trusts the structural match and wires reactivity. Future signal changes trigger normal reactive updates.

**The common pattern:** None of these frameworks evaluate conditional expressions during hydration to decide whether to clear server content. They all use a **trust-then-wire** approach: trust the server rendered the correct branch, wire reactive bindings to existing DOM, and let the reactive system handle any divergence naturally on subsequent updates.

The Semantic UI hydration system deviates from this by re-evaluating `getBranch()` synchronously during hydration and comparing against the server's branch metadata. This is more "correct" in theory (it catches genuine mismatches) but creates a trap: **any timing-dependent data that hasn't settled by hydration time will trigger false mismatches.**

---

## Proposed Fix

### Immediate Fix (narrow)

In `hydrate()` (base.js), call `getData()` AFTER `clone()` has run `initialize()`, then refresh the renderer's data:

```js
hydrate(prototypeTemplate) {
  const serverStyle = this.shadowRoot.querySelector('style');
  if (serverStyle) { serverStyle.remove(); }

  // Initial data (pre-initialize) — needed for clone to construct template
  const initialData = this.getData();

  this.template = prototypeTemplate.clone({
    data: initialData,
    element: this,
    renderRoot: this.renderRoot,
  });

  this.template._isHydrating = true;
  this.component = this.template.instance;

  // Re-capture data AFTER initialize() has run (settings may have mutated)
  const hydratedData = this.template.overlaySettingsSignals(
    this.template.getDataContext()
  );
  this.template.renderer.setData(hydratedData);
  this.dataContext = this.template.getDataContext();

  // ... rest of hydration
}
```

This ensures the renderer's data context includes any settings mutations from `initialize()` before hydration markers are processed.

### Structural Fix (broader)

Adopt the "trust-then-wire" pattern used by Lit, Svelte, and Solid. During hydration:

1. **Do not evaluate conditionals to validate server content.** Trust the server branch metadata and wire the Reaction to the existing DOM.
2. **Set `currentBranchIndex` from the server metadata**, not from a client-side `getBranch()` call.
3. Let the first reactive update after hydration naturally correct any mismatches.

This eliminates the entire class of "stale data during hydration" bugs. The `{#if}` Reaction would be created with `currentBranchIndex = serverMeta.branchIndex`, and on its first (reactive) re-run, if the branch has genuinely changed, it would swap content normally.

```js
// In hydrateBlockDirective, case 'if':
case 'if': {
  // Trust server branch — don't re-evaluate condition during hydration
  this.hydrateConditional({
    node, data, scope, region,
    initialBranchIndex: serverMeta.branchIndex ?? this.getBranch(node, data).matchIndex,
  });
  break;
}
```

And in `hydrateConditional`:
```js
hydrateConditional({ node, data, scope, region, initialBranchIndex }) {
  let currentBranchIndex = initialBranchIndex;

  scope.track(Reaction.create((comp) => {
    if (!comp.firstRun && !region.anchor.isConnected) {
      comp.stop();
      return;
    }

    const result = this.getBranch(node, data);

    // First run: register dependencies but don't touch DOM
    if (comp.firstRun) { return; }

    if (result.matchIndex !== currentBranchIndex) {
      currentBranchIndex = result.matchIndex;
      if (result.contentAST) {
        const branchScope = scope.child();
        const branchFragment = this.readAST({
          ast: result.contentAST, data, scope: branchScope
        });
        region.setContent(branchFragment, branchScope);
      } else {
        region.clear();
      }
    }
  }));
}
```

### Fix for the DocumentFragment Round-trip

The `hydrateInnerContent` function unnecessarily moves nodes to a DocumentFragment and back, which disconnects/reconnects custom elements. A safer approach would hydrate in-place:

```js
hydrateInnerContent(ownedNodes, contentAST, data, scope) {
  const { entries } = buildHTMLStringPure(contentAST, this.snippets);
  if (entries.length === 0) { return; }

  // Hydrate markers in-place using the parent as the root.
  // Create a Range or use the first/last ownedNode to scope the walker.
  const parent = ownedNodes[0]?.parentNode;
  if (!parent) { return; }

  // Use the parent directly — hydrateMarkers walks children
  this.hydrateMarkers(parent, entries, data, scope, { ast: contentAST });
}
```

This avoids the disconnect/reconnect cycle entirely, though it requires `hydrateMarkers` to be scoped to only process markers within the owned range. This is more work but eliminates an entire class of custom-element lifecycle bugs.

---

## Summary of Findings

| Question | Verdict |
|----------|---------|
| Q1: Is `icon` visible during hydration? | **Probably not.** `getData()` snapshot is taken before `initialize()`. Unless `icon` is in `defaultSettings` AND overlaid via Signal, the renderer sees `undefined`. |
| Q2: Does DocumentFragment extraction disrupt `ui-icon`? | **Yes, partially.** It causes disconnect/reconnect lifecycle events, but this is a secondary issue — the icon is already being cleared by the mismatch logic. |
| Q3: Could `{#if icon}` evaluate falsy causing a false mismatch? | **Yes. This is the primary cause.** The stale data context from pre-`initialize()` `getData()` makes `icon` undefined, triggering mismatch detection which calls `region.clear()`. |
| Q4: Could a stale Reaction re-run cause issues? | **Yes, but this is downstream of Q3.** Once the mismatch clears the content, the Reaction is wired with `currentBranchIndex = -1` and may never recover because the icon Signal might not be in the data context. |

**The icon disappears because hydration evaluates `{#if icon}` against stale data (pre-`initialize()` snapshot), detects a mismatch with the server's branch `1000`, and calls `region.clear()` which destroys the server-rendered content including the `ui-icon` element.**
