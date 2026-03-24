# Survey: How Subtemplates Should Access Reactive External Data

## Context Summary

Subtemplates receive data from parents via `{>childTemplate prop=expr}`. The compiler routes shorthand props into `reactiveData`, which the renderer packs as functions (`() => evaluateExpression('expr', data)`). The `RenderTemplateDirective` unpacks these on each reactive pass and calls `template.setDataContext(newData)` followed by `template.render()`. This means **template expressions** (e.g., `{todo.completed}` in the HTML) always see current values.

The problem: `createComponent` runs once at initialization. Its `data` parameter is closure-captured. When `setDataContext` replaces `this.data`, the closure still holds the old reference. Functions like `getClasses()` that read `data.todo.completed` are stale. This was masked before subtree caching because subtemplates were fully re-created on every parent render.

The `createDataProxy()` call in `Template.call()` (line 724) is currently undefined, indicating active work on the branch to address this.

---

## Question 1: What mechanism should subtemplates use to reactively access data passed from the parent in `createComponent` JS?

### Approach A: Reuse the `settings` Proxy Pattern

**Mechanism:** Subtemplates declare `defaultSettings` to define their external API. Passed `reactiveData` props matching `defaultSettings` keys flow into a subtemplate-owned settings proxy (modeled on `WebComponentBase.createSettingsProxy()`). The proxy uses shadow signals for reactivity. On each re-render, matched keys are updated through the proxy's `set` handler, bumping signals. In `createComponent`, authors access `settings.todo.completed` instead of `data.todo.completed`.

**Tradeoffs:**
- (+) Direct reuse of proven web component pattern; no new concepts to learn
- (+) Upgrade path is trivial: add `tagName` and the same `settings.todo` code works on both sides
- (+) Future `{>dropdown}` -> `<ui-dropdown>` syntax convergence works naturally since both use settings
- (+) Clear declarative API surface via `defaultSettings`
- (-) Requires authors to explicitly declare `defaultSettings` even for subtemplates that only consume one or two props
- (-) `settings.todo.completed` — the proxy only intercepts the first-level access (`todo`). Deeper paths are plain property access on the returned object, so full-object replacement triggers reactivity but nested-property mutation requires the parent to bump the whole signal
- (-) Changes the mental model: currently `settings` in subtemplates means "parent web component settings." This approach introduces "own settings" layered on top, which could be confusing if both are needed simultaneously
- (-) Subtemplates that don't declare `defaultSettings` still get stale `data` — the problem doesn't go away, it just gets a workaround

**Optimizes for:** Upgrade-path consistency, web component parity, API convergence.

---

### Approach B: Live `data` Proxy (Transparent Forwarding)

**Mechanism:** Replace the plain `data` object passed to `createComponent` with a proxy that always reads from `this.data` (the Template instance's current data reference). Every property access on the `data` proxy goes through `get(target, prop) => this.data[prop]`, ensuring the closure-captured `data` object always reflects the latest values from the most recent `setDataContext()` call. This is the `createDataProxy()` method referenced in the current code. No signals are involved — the proxy just redirects reads.

**Tradeoffs:**
- (+) Zero API change for authors. Existing code like `data.todo.completed` works correctly without modification
- (+) No new concepts. `data` remains "a plain-looking object," except it transparently follows the template's current data
- (+) Backwards compatible — all existing subtemplate code becomes correct automatically
- (+) `console.log(data.todo)` still works (proxy returns the current value)
- (-) Not truly reactive in the signals sense. `data.todo.completed` in a Reaction won't track a signal dependency. Reactivity comes indirectly from `dataVersion` bumps, which trigger re-evaluation of template expressions that call functions reading `data`
- (-) On upgrade to web component, `data.todo` stops working (web components don't receive data this way — they use settings/attributes). The upgrade path requires rewriting `data.X` to `settings.X`
- (-) Blurs the line between "snapshot" and "live." The prompt says `data` should be "a simple inspectable object," and a proxy technically isn't, though it behaves like one for `console.log`
- (-) Doesn't create a declarative external API. There's no way to distinguish "this subtemplate expects a `todo` prop" from the code alone

**Optimizes for:** Backwards compatibility, zero-effort fix, simplicity for authors.

---

### Approach C: Refresh-on-Render (Mutable Snapshot)

**Mechanism:** Keep `data` as a plain object (no proxy, no signals) but update it in place each time the template re-renders. Currently, `setDataContext` replaces `this.data` with a new object. Instead, mutate the existing `this.data` object: delete removed keys, set new values. Since `createComponent` closures hold a reference to the original `this.data` object, in-place mutation means `data.todo` always reflects the most recent render. This is exactly what `LitRenderer.updateData()` already does with `preserveExistingData`.

**Tradeoffs:**
- (+) `data` is literally a plain object — no Proxy, no signals, `console.log(data)` shows exactly what you expect
- (+) Zero API change for authors
- (+) Fully backwards compatible
- (+) Cheapest implementation — just change `setDataContext` to mutate in place instead of replace
- (-) Not reactive in the signals sense. Code inside a Reaction that reads `data.todo.completed` won't track or re-fire. Reactivity only comes via `dataVersion` bumps driving template re-evaluation
- (-) Timing sensitivity: `data.todo` is correct only after the render pass updates it. Code that runs between data changes and the next render (e.g., in a Reaction triggered by a signal) may see stale values
- (-) Same upgrade-path problem as Approach B: `data.todo` doesn't exist in web components
- (-) In-place mutation of the object means referential identity of nested values changes unpredictably. If code stores `const t = data.todo` once, it has the same stale-reference problem, just one level deeper

**Optimizes for:** Simplicity, keeping `data` as a true plain object, minimal code change.

---

### Approach D: Reactive `props` — New First-Class Concept

**Mechanism:** Introduce a new parameter `props` in `createComponent` that is distinct from both `data` and `settings`. `props` is a reactive proxy backed by signals, one per key, automatically derived from the `reactiveData` passed to the subtemplate. No `defaultSettings` declaration required — every `reactiveData` key becomes a prop signal. `props.todo` returns the current value and registers a signal dependency. For web components, `props` maps to the settings proxy (or is an alias for it), preserving upgrade semantics.

**Tradeoffs:**
- (+) Clean separation of concerns: `data` = static snapshot, `settings` = parent WC settings, `props` = reactive external data
- (+) No declaration needed — props are auto-derived from what the parent passes
- (+) Truly reactive: `props.todo` in a Reaction tracks the signal, re-fires when the parent passes new data
- (+) Upgrade path can be defined: "when adding `tagName`, `props` becomes an alias for `settings`" or "`props` maps to attributes"
- (-) New concept to learn. The framework's flat namespace already has `data`, `settings`, `state`, `self` — adding `props` increases API surface
- (-) Terminology collision with React's "props" — could be confusing or could be familiar, depending on the audience
- (-) Requires deciding what `props` means for web components. If `props` = settings, why not just call it settings? If `props` != settings, the upgrade path has two APIs for the same data
- (-) Implementation requires creating signals on the fly and wiring them into the data context for template expression reactivity (similar to settings signals overlay)

**Optimizes for:** Reactive correctness, clean separation, auto-derivation without declaration.

---

### Approach E: `onDataChanged` Lifecycle Hook

**Mechanism:** Instead of making `data` reactive or proxied, provide a lifecycle hook `onDataChanged({ data, previous })` that fires whenever the parent passes new data. Inside the hook, the author can update `state` signals or do whatever reconciliation is needed. The `data` parameter in `createComponent` remains a snapshot. The hook re-runs with the fresh data object, giving the author explicit control over how external data flows into reactive state.

**Tradeoffs:**
- (+) Explicit and debuggable — the author sees exactly when and why data changes
- (+) `data` stays a plain snapshot, no proxy magic
- (+) Authors can choose which changes to react to, apply transformations, debounce, etc.
- (+) Works naturally with state signals: `onDataChanged({ data }) { state.todo.set(data.todo); }` — then all reads go through `state.todo.get()`, which is properly reactive
- (+) Familiar pattern from frameworks like React's `useEffect(f, [deps])` or Vue's `watch`
- (-) Boilerplate. Every subtemplate that reads external data needs an `onDataChanged` handler plus state declarations for every prop
- (-) Upgrade path is unclear. Web components use `attributeChangedCallback` but don't need manual `state.set()` for settings — settings are reactive via proxy. Moving from manual `onDataChanged` + state to automatic settings proxy is a rewrite
- (-) Shifts the common case (reading a prop) from a one-liner (`data.todo.completed`) to multiple lines of setup
- (-) Template expressions already handle this via `dataVersion` — the hook is only needed for `createComponent` JS, which makes it feel like a workaround rather than a solution

**Optimizes for:** Explicit control, debuggability, zero magic.

---

## Question 2: How should the upgrade path from subtemplate to web component work for external reactive data?

### Approach A: `settings` Is the Shared Surface

**Mechanism:** Both subtemplates and web components use `settings.X` for external reactive data. Subtemplates declare `defaultSettings` just like web components. On upgrade (adding `tagName`), the code doesn't change because both paths use the same proxy pattern. The compiler may need to translate `{>child prop=expr}` attributes into the web component's attribute-passing mechanism.

**Tradeoffs:**
- (+) True zero-change upgrade — the JS is identical
- (+) `defaultSettings` serves as documentation of the component's external API in both modes
- (-) Forces subtemplates to adopt the web component settings model, which is heavier than necessary for lightweight templates
- (-) Web component settings are attribute-backed (strings, booleans, numbers) while subtemplate data can be arbitrary objects — the "upgrade" may not actually work if the subtemplate passes complex objects that can't be serialized as attributes

**Optimizes for:** Seamless upgrade, API consistency.

### Approach B: `props` Adapts to Context

**Mechanism:** A unified `props` parameter exists in both subtemplates and web components. In subtemplates, `props` reads from `reactiveData`. In web components, `props` reads from settings/attributes. The mapping is invisible to the author. On upgrade, `props.todo` continues to work — it just changes where it reads from.

**Tradeoffs:**
- (+) Single API regardless of component type
- (+) Abstracts the underlying mechanism (reactive functions vs. Lit properties)
- (-) Web component attributes have serialization constraints that subtemplate props don't. An "upgrade" that passes complex objects breaks silently
- (-) If `props` and `settings` coexist, authors need to understand when to use which

**Optimizes for:** Abstraction, universal API.

### Approach C: Accept the Discontinuity

**Mechanism:** Acknowledge that subtemplates and web components are fundamentally different rendering modes. Subtemplates use `data` (fixed to be live via proxy or in-place mutation). Web components use `settings`. On upgrade, the author changes `data.todo` to `settings.todo` and adds `defaultSettings`. Document this as a known migration step.

**Tradeoffs:**
- (+) Honest about the mechanical difference between subtemplates and web components
- (+) Simpler implementation — no need to unify two fundamentally different data-passing mechanisms
- (+) `data` stays simple; no settings boilerplate for subtemplates that will never become web components
- (-) The "just add tagName" promise is broken — upgrade requires code changes
- (-) Creates two mental models instead of one

**Optimizes for:** Simplicity, honest API design, avoiding false unification.

### Approach D: Compile-Time Adaptation

**Mechanism:** The compiler/renderer handles the upgrade transparently. When `{>todoItem todo=todo}` targets a web component instead of a subtemplate, the renderer generates attribute/property bindings instead of reactive data packing. The `createComponent` code uses `settings` in both cases because the framework routes the data to the right place automatically. Subtemplates with `defaultSettings` receive data into their settings proxy. Subtemplates without `defaultSettings` receive data into `data`.

**Tradeoffs:**
- (+) Compiler absorbs the complexity; user code is stable
- (+) Progressive: subtemplates without `defaultSettings` keep working; adding `defaultSettings` opts into the settings path
- (-) Compiler complexity increases significantly
- (-) Debugging becomes harder — the same syntax produces different runtime behavior depending on configuration

**Optimizes for:** Progressive enhancement, backwards compatibility.

---

## Question 3: Approaches that avoid the closure-capture problem entirely

### Approach A: Live Data Proxy (Same as Q1 Approach B)

**Mechanism:** The `data` parameter is a Proxy that always reads from `this.data` on the Template instance. The closure captures the proxy, but every property access goes through the proxy's `get` trap, which reads the current `this.data`.

**Avoids closure problem:** Yes, fully. The proxy reference is stable; only the underlying data it points to changes.

**API surface change:** None. `data.todo.completed` works as-is.

**Limitation:** Not signal-reactive. `data.todo` in a Reaction doesn't track. Reactivity depends on `dataVersion` bumps and template re-evaluation.

### Approach B: In-Place Mutation of Data Object (Same as Q1 Approach C)

**Mechanism:** Instead of `this.data = newData`, mutate the existing object: `Object.keys(this.data).forEach(k => delete this.data[k]); Object.assign(this.data, newData)`. The closure-captured `data` reference still points to the same object.

**Avoids closure problem:** Yes, for direct properties. Nested references (`const t = data.todo`) may still go stale if the parent passes a new `todo` object.

**API surface change:** None.

**Limitation:** Doesn't address deep nesting. Only fixes first-level staleness.

### Approach C: Re-Invoke `createComponent` on Data Change

**Mechanism:** When new data arrives, destroy the old component instance and re-run `createComponent` with fresh `data`. This is effectively what happened before subtree caching. Local state (signals) would need to be preserved across re-invocations by extracting state outside the closure.

**Avoids closure problem:** Yes, trivially — there's no stale closure because a new one is created.

**Tradeoffs:**
- (+) Simple and correct
- (-) Defeats the purpose of subtree caching — if `createComponent` re-runs, initialization cost returns
- (-) Local state loss unless explicitly externalized
- (-) Event bindings, reactions, etc. would need teardown/setup on each data change
- (-) Non-starter for components with complex initialization

### Approach D: Selective Re-Invocation via `onDataChanged`

**Mechanism:** Provide a lifecycle hook that receives fresh `data`. Authors use it to update whatever needs updating. The closure captures `state` signals, which remain stable. The hook bridges external data into internal reactive state.

**Avoids closure problem:** Partially. The closure is still stale, but the hook provides a controlled entry point to synchronize fresh values into reactive state.

**Limitation:** Boilerplate. Every prop that needs to be reactive requires explicit wiring.

### Approach E: Getter-Based Data Access

**Mechanism:** Instead of passing `data` as a plain object, pass a `getData()` function that returns the current snapshot. In `createComponent`, authors call `getData().todo` instead of `data.todo`. The function always reads from `this.data`, so it's always current.

**Avoids closure problem:** Yes. The function closure captures `this` (the Template), not the data object itself.

**Tradeoffs:**
- (+) No proxy, no signals, no magic — just a function
- (+) Clear signal to authors that they're accessing live data
- (-) API change: `getData().todo` is noisier than `data.todo`
- (-) Every access requires a function call
- (-) Not reactive — same `dataVersion`-only reactivity as the proxy approach

---

## Question 4: For subtemplates, are both concerns of the settings proxy needed (declaring external API + reactive access), or just one?

### Approach A: Both Concerns Needed (Full Settings Analogy)

**Mechanism:** Subtemplates declare `defaultSettings` to define their external API. Reactivity comes from shadow signals in the proxy. This gives both declaration ("this subtemplate expects `todo`") and reactive access (`settings.todo` tracks a signal).

**Argument for:** The declaration matters for documentation, validation, and the upgrade path. Without `defaultSettings`, there's no way to know what a subtemplate expects. The reactive access matters because that's the whole problem being solved.

**Argument against:** Subtemplates are lightweight by design. Requiring `defaultSettings` for every subtemplate that receives data adds ceremony. Many subtemplates are purely presentational and will never become web components.

### Approach B: Only Reactive Access Needed (No Declaration)

**Mechanism:** All `reactiveData` props automatically get signal-backed reactive access without any declaration. The subtemplate doesn't need `defaultSettings` — it just reads `props.todo` or `data.todo` and gets current values.

**Argument for:** Subtemplates are the lightweight path. The less boilerplate, the better. Declaration is valuable for web components (which have attributes, types, defaults) but overkill for subtemplates.

**Argument against:** Without declaration, there's no static knowledge of what a subtemplate expects. Tooling can't validate prop passing. The upgrade path is less clear because adding `tagName` requires also adding `defaultSettings`.

### Approach C: Only Declaration Needed (No Reactive Access via Proxy)

**Mechanism:** `defaultSettings` exists for documentation and upgrade-path purposes, but reactive access comes through a different mechanism (live `data` proxy, `onDataChanged`, etc.). The declaration is about defining the API surface, not about creating signal infrastructure.

**Argument for:** Decouples two orthogonal concerns. Declaration is about design; reactivity is about runtime. They can evolve independently.

**Argument against:** If you already have `defaultSettings`, you've done the hard part. Adding signal-backed access on top is straightforward and gives you the best of both.

### Approach D: Declaration Optional, Reactive Access Always Available

**Mechanism:** All reactive data passed to subtemplates is accessible reactively regardless of whether `defaultSettings` is declared. If `defaultSettings` is declared, it serves as documentation and provides defaults. If not, everything still works — the subtemplate just doesn't have declared defaults.

**Argument for:** Progressive. Simple subtemplates stay simple. Authors can add `defaultSettings` later when they need defaults or want to document the API. The reactive mechanism doesn't depend on declaration.

**Argument against:** The settings proxy pattern (as in web components) inherently requires knowing which keys to create shadow signals for. Without declaration, you either create signals lazily (on first access) or for all keys. Lazy creation works but adds a code path that web component settings don't have.

### Approach E: Declaration for Subtemplates, But Lighter Than Web Components

**Mechanism:** Instead of `defaultSettings` (which implies the full web component settings model), use a lighter declaration like `expects: ['todo']` or `props: { todo: null }`. This declares the API without implying attribute serialization, type coercion, or other web-component-specific settings machinery. On upgrade to web component, `props` becomes `defaultSettings` with a mechanical transformation.

**Argument for:** Right level of ceremony for subtemplates. Not zero (you get documentation and tooling), not heavy (no type coercion, serialization concerns).

**Argument against:** Introduces a new declaration keyword that's almost-but-not-exactly `defaultSettings`. This is one more thing to learn, and the "upgrade path" now requires renaming `props` to `defaultSettings` rather than just adding `tagName`.

---

## Cross-Cutting Analysis

### The Fundamental Tension

The design space is defined by a triangle of competing forces:

1. **Simplicity of `data`** — The framework wants `data` to be a plain inspectable object, not wrapped in framework machinery. This pushes toward Approaches B/C in Q1 (proxy or in-place mutation).

2. **Upgrade-path consistency** — The `subtemplate -> web component` upgrade should require only adding `tagName`. This pushes toward Approach A in Q1 (reuse `settings`), since web components already use `settings`.

3. **Zero-boilerplate for lightweight templates** — Subtemplates are the lightweight path. Requiring `defaultSettings` to get correct behavior adds friction. This pushes toward Approaches B/C/D in Q1 (automatic mechanisms that don't require declaration).

No single approach satisfies all three. The design decision ultimately depends on which force is given priority.

### Combinatorial Space

The most plausible combined designs are:

**Combination 1: Settings-First (Q1-A + Q2-A + Q4-A)**
Use `settings` everywhere. Subtemplates declare `defaultSettings`. Upgrade is seamless. Maximum consistency, maximum ceremony.

**Combination 2: Live Data + Accept Discontinuity (Q1-B + Q2-C + Q4-B)**
Fix `data` with a proxy. Accept that upgrading to web component requires changing `data.X` to `settings.X`. Minimum ceremony, honest about the difference.

**Combination 3: Live Data + Optional Settings (Q1-B + Q2-D + Q4-D)**
Fix `data` with a proxy for basic cases. Subtemplates that want the upgrade path declare `defaultSettings` and use `settings.X`. Both paths coexist. Progressive but two mental models.

**Combination 4: New Props Concept (Q1-D + Q2-B + Q4-D)**
Introduce `props` as a universal reactive parameter. Works in both subtemplates and web components. Clean separation from `data` and `settings`. New concept to learn but unified.

**Combination 5: Mutable Snapshot + Lifecycle Hook (Q1-C + Q1-E hybrid + Q2-C + Q4-C)**
Fix first-level staleness with in-place mutation. Provide `onDataChanged` for authors who need deeper control. Accept upgrade discontinuity. Minimum magic, maximum explicitness.

### What Each Combination Sacrifices

| Combination | Sacrifices |
|---|---|
| 1 (Settings) | Lightweight simplicity — all subtemplates need `defaultSettings` |
| 2 (Live Data) | Upgrade path — `data.X` to `settings.X` rewrite on upgrade |
| 3 (Live + Settings) | Conceptual unity — two parallel mechanisms |
| 4 (Props) | API surface — new parameter alongside `data`, `settings`, `state` |
| 5 (Mutable + Hook) | Ergonomics — boilerplate for reactive external data in JS |
