# Hydration Optimization Plan

## The Problem

Hydration locks the browser for 2-3 seconds on doc pages. Profiling shows:

| % time | Function | Where |
|--------|----------|-------|
| 42% | `each` | Cumulative: settings iteration, state setup, event parsing |
| 6.1% | `cloneValue` | Signal constructor + getter defensive cloning |
| 4.9% | `dispatchEvent` | Lifecycle events fired during hydration |
| 3% | `hydrateAttributes` | The actual DOM wiring (the REAL work) |
| 2% | `evaluateJavascript` | Expression evaluation |

The actual reactive wiring is 3% of the cost. The other 97% is rebuilding data
the server already computed.

## Root Cause Analysis

The hydration path runs `Template.initialize()` identically to a fresh render.
This triggers the full lifecycle:

### 1. State creation (each + cloneValue)
`createReactiveState` iterates `defaultState` via `each`, creates a `new Signal()`
for each, which calls `cloneValue()` on the initial value. Then the state-tracking
Reaction reads every Signal via `.get()`, which clones AGAIN for objects/arrays.

### 2. createComponent (each)
User's `createComponent` runs. Many components iterate settings/data here.
Returns methods — needed for interactivity, but the computed VALUES are redundant.

### 3. overlaySettingsSignals (each × 2)
Iterates `defaultSettings` twice to ensure shadow signal proxies exist.

### 4. attachEvents + parseEventString (each × 4 per event)
Every event string is parsed from scratch. Four `each` calls per event string.
Events MUST be attached for interactivity, but the parsing could be cached.

### 5. Reaction first-run evaluation (cloneValue + evaluateJavascript)
Every hydration Reaction (`hydrateAttributes`, `hydrateTextExpression`,
`hydrateBlockDirective`) immediately evaluates its expression and writes to the DOM.
The DOM already has the correct value. The evaluation is needed for dependency
tracking, but the DOM write is pure waste.

### 6. Reference DOM construction (hydrateAttributes)
`hydrateAttributes` builds a SECOND DOM tree from `buildHTMLStringPure()` just to
find attribute marker positions. This is a full `innerHTML` parse.

### 7. Lifecycle events
`dispatchEvent('created')` fires during hydration. Constructs a CustomEvent and
dispatches it to the DOM. Not needed during hydration.

## The Principle

**Trust server DOM. Skip value computation. Only wire reactive subscriptions.**

## Optimization Tiers

### Tier 1: Skip DOM writes on hydration first-run (conservative, ~15-20% savings)

Every Reaction in the hydrate methods evaluates the expression AND writes to DOM
on first run. The `unsafeHTML` case already skips first run (renderer.js:1184):
```js
if (comp.firstRun) { return; } // server content is correct
```

Apply the same pattern to ALL hydration reactions. BUT — we still need the first
evaluation for dependency tracking. So the pattern is:

```js
Reaction.create((comp) => {
  const value = this.eval(expr, data);  // runs → registers Signal deps
  if (comp.firstRun) { return; }        // skip DOM write
  element.setAttribute(name, value);    // only on subsequent runs
});
```

This is safe, purely additive, and doesn't change any data flow.

**One caveat:** `hydrateTextExpression` needs the evaluated value for text node
splitting (line 1204). This pre-evaluation happens OUTSIDE the Reaction and is
necessary for setup. That can stay as-is.

### Tier 2: Skip defensive cloning during hydration (~6% savings)

Signal constructor and getter clone objects/arrays defensively. During hydration:
- Constructor clones the initial value — unnecessary, the value won't be mutated
  before the first reactive read
- `.get()` clones the return value — unnecessary, the caller is a Reaction that
  only needs the value for dependency registration

Approach: add a `Signal.hydratingMode` static flag. When true, `maybeClone` returns
the value directly without copying. Set it true before hydration, false after.

Alternatively: pass `{ allowClone: false }` when creating state Signals during
hydration. More surgical but requires threading through `createReactiveState`.

### Tier 3: Suppress lifecycle events during hydration (~5% savings)

The `onCreated` wrapper in Template dispatches a 'created' DOM event. During
hydration, this is noise. The Template already has `_isHydrating` — check it:

```js
this.onCreated = () => {
  this.call(this.onCreatedCallback);
  Template.addTemplate(this);
  if (!this._isHydrating) {
    this.dispatchEvent('created', ...);
  }
};
```

Same for 'rendered' event.

### Tier 4: Cache event parsing from prototype (medium effort, ~10-15% savings)

`attachEvents` parses every event string from scratch: `'click .button'` →
`{ eventType: 'click', selector: '.button' }`. This parsing is the same for every
instance of the same component. Cache parsed results on the prototype template and
reuse during hydration.

### Tier 5: Eliminate reference DOM in hydrateAttributes (~2% savings)

Currently builds a second DOM tree to find marker positions. Instead, the entries
array from `buildHTMLString` already knows which entries are attribute bindings and
their marker IDs. Could map entry IDs to elements via a counter-based walk instead
of building a full reference DOM.

### Tier 6: Lazy createComponent (bold, ~20-30% savings, needs discussion)

During hydration, don't run `createComponent` until the first user interaction.
The DOM already shows correct output. Methods returned by `createComponent` are
only needed when an event handler fires. Defer their creation:

1. Hydration creates Signals and wires Reactions (for reactive data binding)
2. Event handlers are attached but wrapped in a lazy initializer
3. On first event, `createComponent` runs, methods become available
4. The event handler completes with full context

This is the boldest optimization but has the most impact. The entire user `initialize()`
call, derived state computations, and method creation become deferred cost that only
fires if the user actually interacts with the component.

**Risk:** Components that have side effects in `createComponent` or `onCreated`
(timers, subscriptions, scroll listeners) would be delayed. Components with
`isClient` guards in `onCreated` do real setup there. Would need an opt-in
mechanism or a way to distinguish "pure" vs "effectful" createComponent.

## Recommended Order

1. **Tier 1** (skip first-run DOM writes) — safe, significant, no architecture change
2. **Tier 3** (suppress lifecycle events) — safe, small, check `_isHydrating`
3. **Tier 2** (skip cloning) — safe with the static flag approach
4. **Tier 4** (cache event parsing) — moderate effort, good payoff
5. **Tier 5** (eliminate reference DOM) — nice-to-have
6. **Tier 6** (lazy createComponent) — discuss with user first
