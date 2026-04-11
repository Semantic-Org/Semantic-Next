## Task: Evaluate why state changes during initialize() are not reflected in hydrated DOM

Read ALL source files listed below before answering. Evaluate the current code state — do not read git history or diffs.

### Architecture Overview

This is a web component framework with its own native DOM renderer. Components render into Shadow DOM using Signals and Reactions for reactivity.

**Server-side rendering:** The ServerRenderer walks the AST and produces an HTML string with comment markers. State from `defaultState` is used during server render.

**Client hydration:** `WebComponentBase.hydrate()` clones the prototype template (which runs `createComponent` and `initialize()`), then calls `renderer.hydrateMarkers()` to wire Reactions to existing server DOM.

### The Hydration Reaction Pattern

When hydrating text expressions, the renderer creates a Reaction:

```js
scope.track(Reaction.create((comp) => {
    if (!comp.firstRun && !textNode.isConnected) {
        comp.stop();
        return;
    }
    const value = this.eval(exprNode.value, data);
    if (comp.firstRun) { return; } // skip DOM write — trust server
    textNode.data = value ?? '';
}));
```

The `firstRun` skip is a performance optimization: the server already rendered the correct text, so the first Reaction run only evaluates the expression to register Signal dependencies, without writing to the DOM.

The same pattern exists for attribute bindings — `firstRun` evaluates all expressions to register deps but skips `setAttribute`.

### The Template Initialization Flow

`Template.initialize()` runs in this order:
1. `createReactiveState()` — creates Signals from `defaultState`
2. `createComponent()` — user's factory, returns instance methods
3. `instance.initialize()` — user's init hook (can mutate state/settings)
4. Create Renderer with `getDataContext()` (includes current state)

When `hydrate()` calls `prototypeTemplate.clone({ data })`, step 1-4 all happen synchronously inside `clone()`. Then `hydrateMarkers()` wires Reactions to existing DOM.

### The Specific Case

A test component has:
```js
defaultState: { label: 'server' },
createComponent: ({ state, isClient }) => ({
    initialize() {
        if (isClient) {
            state.label.set('client');
        }
    },
})
```

Template: `<div class="box">{label}</div>`

Expected: Server renders "server", client hydration changes state to "client", DOM should show "client".

Actual: After hydration, DOM still shows "server".

### The Signal Timing

When `state.label.set('client')` is called in `initialize()`:
- The Signal's value is immediately 'client'
- Dependent Reactions are scheduled to fire on the next microtask flush
- But no Reactions exist yet — the Renderer hasn't been created (it's created at step 4, after initialize at step 3)

When the Renderer is created (step 4), `getDataContext()` includes the state Signals. The `label` Signal's current value is 'client'.

When `hydrateMarkers()` wires the text expression Reaction:
- First run: evaluates `{label}` → reads `state.label` Signal → gets 'client' → registers dependency
- But `firstRun` skip means `textNode.data` is NOT updated — it stays as "server" from the server render
- No subsequent Reaction run fires because the Signal value didn't change AFTER the dependency was registered

### Concrete Problems

1. The text node shows "server" after hydration, but the state Signal contains "client".

2. The `firstRun` skip assumes server DOM matches client state. This assumption breaks when `initialize()` or `createComponent()` changes state before hydration wiring.

3. The same pattern affects attribute bindings — `firstRun` evaluates expressions for dependency registration but skips `setAttribute`.

4. A naive fix (removing `firstRun` skip) was tested and broke each-loop hydration. Inside each loops, the data context during hydration may not have the correct loop-variable bindings, causing expressions to evaluate to wrong values (e.g., loop index `0` instead of item names).

5. `textNode.data = sameValue` and `setAttribute(name, sameValue)` are browser no-ops, so removing the skip should be "free" in the common case. But the each-loop data context issue means expressions inside hydrated each loops evaluate incorrectly on first run.

### Questions — Evaluate Independently

**Question 1:** The `firstRun` skip exists because "server content is trusted." But state can legitimately diverge between server and client (isClient/isServer guards, runtime-dependent initialization). How should the hydration system handle this tension between performance (skip redundant writes) and correctness (state may have changed)?

**Question 2:** The each-loop hydration (`hydrateEach`) skips rendering on firstRun and doesn't wire per-item Reactions to the server DOM. The inner content is hydrated separately by `hydrateInnerContent` which passes the parent data context (not per-item data). Could this be why removing the firstRun skip breaks each loops — the text expressions inside each items evaluate against the wrong data context?

**Question 3:** Is there a way to detect whether the evaluated value differs from the server DOM value, and only write in that case? This would preserve the performance optimization while handling state divergence. What are the costs?

**Question 4:** Should `initialize()` be considered part of the "server-equivalent" state (i.e., the hydration system should assume its effects are already in the DOM), or should it be considered a client-side mutation that the hydration system needs to apply?

### Source Files to Read
- `packages/renderer/src/engines/native/renderer.js` — hydrateTextExpression(), hydrateAttributes(), hydrateEach(), hydrateInnerContent()
- `packages/component/src/engines/native/base.js` — hydrate() method, the relationship between clone() and hydrateMarkers()
- `packages/templating/src/template.js` — initialize() (lines 175-275), the order of createComponent vs renderer creation
- `packages/reactivity/src/signal.js` — Signal.set(), how values propagate
- `packages/reactivity/src/reaction.js` — Reaction.create(), firstRun behavior
- `packages/renderer/src/engines/native/dynamic-region.js` — DynamicRegion
