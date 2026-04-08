# Signal Stack Trace Analysis

## Why captureStackTrace Exists

`Error.captureStackTrace` serves the **reactive debugging pipeline**. When a developer
calls `Reaction.getSource()` (exposed as `Scheduler.getSource()`), the framework prints
the stack trace of the _Signal mutation_ that caused the current flush. This is the
reactive equivalent of "which setState call triggered this re-render?" -- a question that
is otherwise impossible to answer at runtime.

The trace flows through three points:

1. **Dependency constructor** (`dependency.js:18`) -- captures creation site.
2. **Signal setter** (`signal.js:113` via `setTrace()`) -- captures mutation site.
3. **Dependency.changed()** (`dependency.js:26` via `setContext()`) -- overwrites
   creation trace with latest mutation trace before propagating to subscribers.

The creation-site trace (#1) is the one relevant to this analysis. It exists so that if
a Reaction fires and no mutation trace is available (e.g., first-run reactions), the
debugging output can still show _where_ the dependency was created. The `getSource()`
code in `scheduler.js:43` falls back to `dependencies?.values().next()?.value?.context?.stack`
for exactly this case.

## Cost Model

### Per Signal Construction

One `Error.captureStackTrace` call fires in the Dependency constructor. On V8 (Chrome/Node),
this captures and formats a stack trace into a string, which requires:

- Walking the current call stack frames
- Symbolizing frame addresses to function names + source locations
- Allocating the formatted string

Published V8 microbenchmarks and engine source put this at **3-15us** depending on stack
depth and source map complexity. In a web component context with 6-10 frames on the stack
during initialization, **~5-10us per call** is a reasonable estimate.

### Per Signal Mutation (bumpDataVersion)

`Signal.increment()` -> `mutate()` -> `set value` triggers:

1. `Signal.setTrace()` -- `Error.captureStackTrace` on `this.context`
2. `Dependency.changed()` -> `Dependency.setContext()` -- `Error.captureStackTrace` on
   the passed context object

That's **two** `captureStackTrace` calls per `bumpDataVersion()`. Since `bumpDataVersion()`
is called on every re-render of a component (via `template.js:758`), this is a recurring
cost, not just initialization.

### Signal Count Per Component

A typical Semantic UI component creates Signals from these sources:

| Source | Count | When |
|---|---|---|
| `defaultState` entries | 0-3 | Template.createReactiveState() |
| Settings proxy (on access) | 6-16 | createSettingsProxy lazy, per accessed setting |
| Subtemplate settingsVars | 0-5 | createSubtemplateSettings() |
| Renderer `dataVersion` | 1 | Renderer constructor |
| `{#each}` itemSignals | N | Per each-loop iteration |

**Typical simple component** (e.g., `ui-input`): ~1 state + ~6 settings + 1 dataVersion
= **~8 Signals** = ~8 captureStackTrace calls = **~40-80us** of initialization.

**Complex page** with 30 components: ~240 Signals at construction + ongoing
`bumpDataVersion` mutations. If each component re-renders once, that's 30 x 2 = 60
additional captureStackTrace calls from `bumpDataVersion` alone.

### dataVersion Specifically

The `dataVersion` Signal is a monotonic counter (starts at 0, incremented via
`bumpDataVersion()`). It is used purely as a dirty-propagation mechanism: calling
`this.dataVersion.get()` inside a Reaction registers a dependency, so when
`bumpDataVersion()` fires, all Reactions that read non-Signal data (plain object
properties in the data context) re-evaluate.

For this Signal specifically:

- **The creation stack trace is never useful.** It always points to the Renderer
  constructor. You'd never debug "where was dataVersion created?" -- the answer is
  always "the renderer."
- **The mutation stack traces are never useful.** They always point to
  `bumpDataVersion()`. The actual interesting question is "what caused the re-render?",
  which is answered by the component lifecycle, not the dataVersion mutation site.
- **The equality check is wasted.** `isEqual(0, 1)` is cheap but conceptually wrong --
  this counter should always notify.
- **The clone is wasted.** `maybeClone(0)` is a no-op for primitives, but the function
  call overhead + type checks still exist.

## Proposed Solutions Evaluated

### Option A: Lightweight Counter Class

Create a purpose-built class that skips all Signal overhead: no cloning, no equality
checks, no stack traces.

```js
class Counter {
  constructor() {
    this.dependency = new Dependency();
    this.value = 0;
  }
  get() {
    this.dependency.depend();
    return this.value;
  }
  increment() {
    this.value++;
    this.dependency.changed();
  }
}
```

**Problem:** Dependency constructor still calls `captureStackTrace`. You'd need to change
Dependency too, or create a bare dependency. This fragments the reactive primitive API
with multiple parallel types. Framework users and contributors now need to understand
when to use Signal vs Counter.

### Option B: Lazy Stack Trace

Move `captureStackTrace` out of the Dependency constructor and into a lazy getter or an
opt-in debug mode.

```js
// In Dependency constructor -- remove captureStackTrace
constructor(...metadata) {
  this.subscribers = new Set();
  this.context = metadata;  // just store metadata, no trace
}

// Add trace only when debugging is active
setContext(context = {}) {
  if (Dependency.debug && Error.captureStackTrace) {
    Error.captureStackTrace(context, this.setContext);
  } else if (Dependency.debug) {
    context.stack = new Error().stack;
  }
  this.context = context;
}
```

**Analysis:** This is the broadest win -- it eliminates captureStackTrace from _every_
Signal and Dependency in the system, not just dataVersion. The cost is that
`Reaction.getSource()` would only work when `Dependency.debug = true` (or a global
debug flag is set). Since `getSource()` is already a developer-only diagnostic tool,
gating it behind a flag is natural. However, it changes the debugging workflow from
"always available" to "must enable first," which is a usability regression for the
"I'm confused, let me inspect" case.

### Option C: Bare Dependency for dataVersion

Change just the Renderer to use a Dependency directly instead of a Signal:

```js
// In Renderer constructor
this.dataVersion = new Dependency();
this._dataVersionValue = 0;

// In bumpDataVersion
bumpDataVersion() {
  this._dataVersionValue++;
  this.dataVersion.changed();
}
```

And update the few `this.dataVersion.get()` call sites to `this.dataVersion.depend()`.

**Problem:** Same as Option A -- the Dependency constructor itself calls
`captureStackTrace`. You're saving the Signal overhead (equality, clone, context) but
not the dominant cost.

## Recommendation: Option B (Lazy Stack Trace via Debug Flag)

**Rationale:**

1. **Addresses the actual bottleneck.** The captureStackTrace cost lives in the Dependency
   constructor, not in Signal-specific logic. Options A and C don't eliminate it without
   also changing Dependency.

2. **Broadest impact.** This benefits every Signal and Dependency in the system, not just
   dataVersion. For a page with 30 components and ~240 Signals, eliminating ~240
   captureStackTrace calls at ~5-10us each saves **~1.2-2.4ms** of initialization time.
   The ongoing mutation savings (2 calls per bumpDataVersion per re-render) compound during
   interaction.

3. **Minimal API surface change.** `Reaction.getSource()` already requires the developer
   to be inside a flush callback. Adding `Dependency.debug = true` (or
   `import { enableDebug } from '@semantic-ui/reactivity'`) is a one-time setup for
   developers who use this diagnostic.

4. **Zero cost in production.** Stack traces serve no purpose in production builds. A
   debug flag makes this explicit.

5. **Chesterton's fence respected.** The traces exist for `Reaction.getSource()`. The
   flag preserves that capability entirely -- it just moves from always-on to opt-in.

### Estimated Savings

| Scenario | Signals Created | captureStackTrace Calls Eliminated | Time Saved |
|---|---|---|---|
| Single component init | ~8 | ~8 (construction) | ~40-80us |
| Page with 30 components | ~240 | ~240 (construction) | ~1.2-2.4ms |
| 30 components, each re-renders once | ~240 | ~240 + 60 (mutations) | ~1.5-3.0ms |
| Heavy interaction (100 bumpDataVersion) | - | 200 (mutations) | ~1.0-2.0ms |

### Implementation Sketch

```js
// dependency.js
export class Dependency {
  static debug = false;

  constructor(...metadata) {
    this.subscribers = new Set();
    this.context = metadata;
    if (Dependency.debug) {
      this.captureTrace(this.context);
    }
  }

  captureTrace(context) {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(context, this.captureTrace);
    } else {
      context.stack = new Error().stack;
    }
  }

  setContext(context = {}) {
    if (Dependency.debug) {
      this.captureTrace(context);
    }
    this.context = context;
  }

  // ... rest unchanged
}
```

```js
// signal.js -- setTrace() also guarded
setTrace() {
  if (Dependency.debug) {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this.context, this.setTrace);
    } else {
      this.context.stack = new Error().stack;
    }
  }
}
```

The `Scheduler.getSource()` method should log a warning if `Dependency.debug` is false
and no stack is available, guiding developers to enable it.

### Risks

- **Debugging friction increase.** A developer hitting an issue for the first time
  won't have traces available. They'll need to enable debug mode and reproduce. This is
  mitigated by a clear console warning from `getSource()`.
- **Test coverage.** Tests that exercise `Reaction.getSource()` need `Dependency.debug = true`
  in setup. Check for any such tests before implementing.

### What NOT to Do

- Don't create a Counter class or LightSignal -- it fragments the reactive API for a
  narrow win that the debug flag achieves more broadly.
- Don't make dataVersion a bare Dependency -- the `.get()` / `.increment()` API is cleaner
  and consistent with the rest of the codebase. The real cost is in Dependency, not Signal.
- Don't remove traces entirely -- `Reaction.getSource()` is a valuable debugging tool
  that justifies its existence. Just make it opt-in.
