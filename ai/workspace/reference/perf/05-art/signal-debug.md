# Art of the State: How Signal Implementations Handle Debug Overhead

A survey of eight major signal/reactivity implementations examining how they manage
the tension between debuggability and construction cost.

---

## Executive Summary

Every surveyed implementation grapples with the same fundamental question: how much
diagnostic infrastructure should exist at signal construction time? The consensus
answer across the ecosystem is **zero in production, opt-in in development**. No
mainstream implementation captures stack traces during signal construction in
production. Most gate debug metadata behind compile-time flags (`__DEV__`,
`_SOLID_DEV_`, `ngDevMode`, `DEV`) that are dead-code eliminated in production
builds. Only Svelte goes further with a *two-tier* development gate — debug metadata
requires both `DEV` mode *and* an explicit tracing flag to be active.

Semantic UI's current approach of unconditionally calling `Error.captureStackTrace`
in the Dependency constructor is an outlier. No other framework does this.

---

## Per-Framework Analysis

### 1. Preact Signals

**Source:** [`@preact/signals-core`](https://github.com/preactjs/signals)

**Debug metadata at creation:** None. The core signal constructor stores no debug
metadata, captures no stack traces, and has no development-mode branching. The
`Signal` class has an optional `name?: string` field and a `_debugCallback?: () => void`
stub, but neither is populated during construction.

**Production vs development split:** No split in the core package. Debug capability
is entirely externalized to [`@preact/signals-debug`](https://www.npmjs.com/package/@preact/signals-debug),
a separate package that monkey-patches the signal lifecycle to add logging,
performance stats, and devtools integration. The core runtime remains untouched.

**Debug-ability approach:** Debug is a separate import, not a mode toggle. You add
`@preact/signals-debug` to your dev dependencies and it instruments signals from
outside. This means zero overhead in production and zero overhead in development
unless you explicitly install the debug package.

**Open issues:** [Issue #384](https://github.com/preactjs/signals/issues/384) tracks
devtools integration. [Discussion #515](https://github.com/preactjs/signals/discussions/515)
discusses debugging signal-based code, with users noting the difficulty of tracing
reactive causality chains. Performance work focused on reducing Set allocation
overhead and optimizing prop bindings ([PR #153](https://github.com/preactjs/signals/pull/153)).

**Design philosophy:** Absolute minimal core. Debug as external plugin.

---

### 2. Solid.js (createSignal)

**Source:** [`solid/packages/solid/src/reactive/signal.ts`](https://github.com/solidjs/solid/blob/main/packages/solid/src/reactive/signal.ts)

**Debug metadata at creation:** In development mode only. When `_SOLID_DEV_` is true,
`createSignal` stores the `name` option on the signal state object, calls
`registerGraph(s)` to push the signal into the owning component's `sourceMap` array,
and fires `DevHooks.afterCreateSignal` if a devtools listener is registered.

```typescript
// Development-only signal registration
if (IS_DEV) {
  if (options.name) s.name = options.name;
  if (options.internal) {
    s.internal = true;
  } else {
    registerGraph(s);
    if (DevHooks.afterCreateSignal) DevHooks.afterCreateSignal(s);
  }
}
```

**Production vs development split:** Strict compile-time split via `_SOLID_DEV_`
constant, replaced at build time. All `registerGraph` calls, devtools hooks, source
map tracking, and signal naming are completely eliminated from production bundles.

**Debug-ability approach:** Naming is the primary debug mechanism. Signals accept an
optional `name` in their options object. Babel/Vite plugins can auto-inject names
during development. The `registerGraph` function maintains a reactive dependency
graph for the [solid-devtools](https://github.com/thetarnav/solid-devtools) Chrome
extension, which visualizes the reactivity graph.

**Stack traces:** Not captured. Debug relies on naming and graph structure, not call
stacks.

**Open issues:** [Issue #153](https://github.com/solidjs/solid/issues/153) tracks
the original devtools visualization discussion.

**Design philosophy:** Name-based identification. Graph topology for debugging.
Zero production overhead. Dev hooks for external tooling.

---

### 3. Angular Signals

**Source:** [`angular/packages/core/primitives/signals/src/signal.ts`](https://github.com/angular/angular/blob/main/packages/core/primitives/signals/src/signal.ts) and [`graph.ts`](https://github.com/angular/angular/blob/main/packages/core/primitives/signals/src/graph.ts)

**Debug metadata at creation:** Minimal. When `ngDevMode` is truthy, the signal
getter receives a custom `toString()` override that formats as
`[Signal (debugName): currentValue]`. The `ReactiveNode` interface includes an
optional `debugName?: string` field used by Angular DevTools.

```typescript
if (typeof ngDevMode !== 'undefined' && ngDevMode) {
  getter.toString = () =>
    `[Signal${node.debugName ? ' (' + node.debugName + ')' : ''}: ${String(node.value)}]`;
}
```

**Production vs development split:** Gated behind `ngDevMode`, a global variable
that Angular's build system sets. In production, `ngDevMode` is `undefined`, and
the conditional is tree-shaken. Error messages in the graph module are also
conditionally included — production throws empty-string errors.

**Stack traces:** Not captured. The reactive graph (`graph.ts`) has no stack trace
collection mechanism.

**Debug-ability approach:** `toString()` overrides for console inspection. Debug
names for DevTools integration. The Angular team is [actively working](https://github.com/angular/angular)
on DevTools signal support (displaying values, breakpoints on changes, value history).

**Open issues:** DevTools signal debugging support is under active development but
not yet shipped.

**Design philosophy:** Lightweight dev metadata (string names, toString). No
runtime tracing infrastructure. DevTools integration via dedicated tooling
rather than in-signal metadata.

---

### 4. Vue 3 Reactivity (ref / reactive)

**Source:** [`vuejs/core/packages/reactivity/src/ref.ts`](https://github.com/vuejs/core/blob/main/packages/reactivity/src/ref.ts) and [`effect.ts`](https://github.com/vuejs/core/blob/main/packages/reactivity/src/effect.ts)

**Debug metadata at creation:** None at construction time. Debug instrumentation
is per-access, not per-creation. In development mode, every `ref.value` get/set
passes additional metadata objects (`{ target, type, key, newValue, oldValue }`)
through the dependency tracking system. In production, `track()` and `trigger()`
are called with no arguments.

```typescript
// Development: passes metadata for onTrack/onTrigger callbacks
get value() {
  if (__DEV__) {
    this.dep.track({ target: this, type: TrackOpTypes.GET, key: 'value' })
  } else {
    this.dep.track()
  }
  return this._value
}
```

**Production vs development split:** `__DEV__` compile-time constant, replaced by
bundlers. All metadata objects, `onTrack`/`onTrigger` callback invocations, and
warning messages are tree-shaken from production.

**Debug-ability approach:** Vue's unique contribution is the `onTrack` / `onTrigger`
callback system on `watch()`, `watchEffect()`, and `computed()`. These fire with
a `DebuggerEvent` containing the target, operation type, key, old value, and new
value — but *only* when the callbacks are explicitly provided and `__DEV__` is true.
Additionally, `shallowRef()` and `markRaw()` are provided as escape hatches to
reduce Proxy overhead for performance-critical data.

**Stack traces:** Not captured by the reactivity system itself. Vue DevTools
provides component-level inspection separately.

**Open issues:** Performance discussions focus on Proxy overhead for deeply nested
objects, not debug metadata cost.

**Design philosophy:** Debug-on-access, not debug-on-create. Metadata objects
are allocated per-operation in dev mode but eliminated entirely in production.
Opt-in callbacks rather than always-on diagnostics.

---

### 5. Svelte 5 Runes ($state)

**Source:** [`svelte/packages/svelte/src/internal/client/reactivity/sources.js`](https://github.com/sveltejs/svelte/blob/main/packages/svelte/src/internal/client/reactivity/sources.js)

**Debug metadata at creation:** Yes, but double-gated. When both `DEV` *and*
`tracing_mode_flag` are true, the signal stores:
- `signal.created` — stack trace via `get_error('created at')`
- `signal.updated` — null (becomes a Map on first update)
- `signal.set_during_effect` — boolean flag
- `signal.trace` — null placeholder

```javascript
if (DEV && tracing_mode_flag) {
  signal.created = stack ?? get_error('created at');
  signal.updated = null;
  signal.set_during_effect = false;
  signal.trace = null;
}
```

**Production vs development split:** Two tiers. `DEV` is the compile-time gate
(stripped in production). `tracing_mode_flag` is an additional runtime gate that
defaults to false even in development. Stack traces are only captured when the
developer explicitly enables tracing (via `$inspect.trace()`).

**Stack traces:** Captured at creation *and* on updates, but only under the
double gate. Update tracking is also performance-aware: stack traces for mutations
only begin collecting after a source updates more than 5 times in the same flush
cycle (unless explicit tracing is enabled). This batching threshold prevents
stack trace collection for normal single-update operations.

```javascript
// Stack traces deferred until update count exceeds threshold
const count = (source.updated.get('')?.count ?? 0) + 1;
if (tracing_mode_flag || count > 5) {
  const error = get_error('updated at');
  // Store with deduplication by error.stack
}
```

**Debug-ability approach:** `$inspect` is the primary debug rune — reactive
`console.log` that is automatically stripped from production builds. `$inspect.trace()`
(added in Svelte 5.14) enables the tracing mode that captures creation and update
stacks. The rune-based approach means debug code is compiler-managed, not
runtime-managed.

**Open issues:** [Issue #14794](https://github.com/sveltejs/svelte/issues/14794)
documents a limitation where `$inspect.trace()` cannot show *which* signal caused
an effect rerun because "by the time the trace has begun, that information has
already been lost" — a fundamental challenge shared by all signal implementations.

**Design philosophy:** The most sophisticated approach surveyed. Double-gated
(compile + runtime flag), threshold-based stack trace deferral, compiler-managed
debug stripping. Svelte's compiler control over runes means it can do things
library-based signals cannot.

---

### 6. MobX Observables

**Source:** [`mobx/packages/mobx/src/types/observablevalue.ts`](https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/types/observablevalue.ts) and [`configure.ts`](https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/api/configure.ts)

**Debug metadata at creation:** Yes, in development. The `ObservableValue`
constructor generates a unique name (`ObservableValue@{id}`) and optionally fires
a `spyReport` with creation metadata:

```typescript
constructor(
  value: T,
  public enhancer: IEnhancer<T>,
  public name_ = __DEV__ ? "ObservableValue@" + getNextId() : "ObservableValue",
  notifySpy = true,
  private equals = comparer.default
) {
  // ...
  if (__DEV__ && notifySpy && isSpyEnabled()) {
    spyReport({
      type: CREATE,
      object: this,
      observableKind: "value",
      debugObjectName: this.name_,
      newValue: "" + this.value_?.toString()
    })
  }
}
```

**Production vs development split:** `__DEV__` compile-time constant. In
production: static name string (`"ObservableValue"`), no ID generation, no spy
reports, no name concatenation. The `spy()` function itself is a
[no-op in production](https://github.com/mobxjs/mobx/issues/2201).

**Stack traces:** Not captured during construction. MobX's `trace()` function
captures mutation-site stacks on demand (when called inside a reaction) by
leveraging V8's synchronous execution model — "the exact mutation that causes
the reaction to re-run will still be in stack, usually ~8 stack frames up."

**Configuration overhead:** MobX has runtime configuration flags
(`enforceActions`, `computedRequiresReaction`, `observableRequiresReaction`,
`safeDescriptors`) that add per-operation validation in development. These are
all gated behind `__DEV__`.

**Open issues:** [Issue #2201](https://github.com/mobxjs/mobx/issues/2201)
discusses enabling spy in production for undo/redo use cases.

**Design philosophy:** Naming and spy events for dev tooling. Stack traces via
synchronous execution model (no capture needed — just inspect the call stack).
Runtime configuration for strictness modes, all gated behind `__DEV__`.

---

### 7. Jotai Atoms

**Source:** [`jotai/src/vanilla/atom.ts`](https://github.com/pmndrs/jotai/blob/main/src/vanilla/atom.ts)

**Debug metadata at creation:** Minimal. Each atom receives an auto-incremented
key (`atom${++keyCount}`). An optional `debugLabel` property can be set for
identification. The `toString()` method conditionally includes the label:

```typescript
toString() {
  return import.meta.env?.MODE !== 'production' && this.debugLabel
    ? key + ':' + this.debugLabel
    : key
}
```

**Production vs development split:** Uses `import.meta.env?.MODE` (Vite-style)
rather than a `__DEV__` constant. The `debugLabel` check is the only branching.
The `jotai-devtools` package is fully tree-shakable and returns no-ops outside
development.

**Stack traces:** Not captured. Jotai provides Babel and SWC plugins that
automatically add `debugLabel` to every atom at build time, solving the
identification problem without runtime cost.

**Debug-ability approach:** The atom key counter is always-on (even in production)
because it's essential for atom identity, not just debugging. The `debugLabel`
is the opt-in debug layer. React's `useDebugValue` is used in dev mode for
React DevTools integration.

**Open issues:** [Issue #931](https://github.com/pmndrs/jotai/issues/931)
discusses improving debugging info in `useAtomsDevtools`.

**Design philosophy:** Atoms are cheap to create by design (just an object with
a counter). Debug labels are build-tool-injected. DevTools integration via
separate package.

---

### 8. Legend State

**Source:** [`legend-state/src/observable.ts`](https://github.com/LegendApp/legend-state/blob/main/src/observable.ts)

**Debug metadata at creation:** None observed in the observable creation path.
The `observable()` and `observablePrimitive()` functions are thin wrappers
around `createObservable()` with no conditional debug logic, no `__DEV__`
checks, and no metadata capture.

**Production vs development split:** No observable split in the core creation
path. Legend State's approach to performance is architectural — Proxy-based
lazy activation means observable nodes only activate when accessed, so
construction cost is inherently minimal regardless of debug mode.

**Stack traces:** Not captured.

**Debug-ability approach:** A separate devtools library provides runtime state
inspection with two-way binding. Performance optimization is achieved through
`get()` (bypasses Proxy for raw access), `$state.raw` patterns, and batch
updates — all user-facing API choices rather than internal debug infrastructure.

**Design philosophy:** Performance through architecture (lazy Proxy activation),
not through mode-switching. Debug tooling is fully external.

---

## Comparative Matrix

| Framework | Stack trace at creation | Dev metadata at creation | Compile-time gate | Runtime gate | Production cost |
|---|---|---|---|---|---|
| **Preact Signals** | Never | None | None (no dev branching) | None | Zero |
| **Solid.js** | Never | Name, sourceMap, hooks | `_SOLID_DEV_` | None | Zero |
| **Angular Signals** | Never | debugName, toString | `ngDevMode` | None | Zero |
| **Vue 3** | Never | None (per-access only) | `__DEV__` | None | Zero |
| **Svelte 5** | DEV + tracing flag | created, updated, trace | `DEV` | `tracing_mode_flag` | Zero |
| **MobX** | Never | Name + ID, spy report | `__DEV__` | `isSpyEnabled()` | Zero |
| **Jotai** | Never | Key counter, debugLabel | `import.meta.env` | None | Counter only |
| **Legend State** | Never | None | None | None | Zero |
| **Semantic UI** | **Always** | **Full stack trace** | **None** | **None** | **~5-10us/signal** |

---

## Error.captureStackTrace Cost Data

Concrete benchmark data for `Error.captureStackTrace`:

| Node.js Version | 10,000 calls | Per call | Source |
|---|---|---|---|
| v6.9.5 | 20.6ms | ~2.1us | [nodejs/node#11343](https://github.com/nodejs/node/issues/11343) |
| v7.0.0 | 143.6ms | ~14.4us | Same issue |
| v7.5.0 | 201.5ms | ~20.2us | Same issue |
| v8.2.1 | ~30ms (100k) | ~0.3us | Same issue (post V8 lazy formatting fix) |

The v7.x regression was caused by V8 eagerly formatting stack traces. This was
fixed in V8 via "lazy stack trace formatting" (v8:5962), restoring performance
to approximately pre-regression levels. Modern V8 (Node 18+, Chrome 100+)
benefits from this fix.

**Webpack case study:** Removing `Error.captureStackTrace` from all `WebpackError`
instances [reduced webpack serve time by 25%](https://github.com/webpack/webpack/issues/13532)
(12s to 9s) in projects generating thousands of errors. The fix was merged as
[PR #13533](https://github.com/webpack/webpack/pull/13533).

---

## Patterns and Insights

### 1. No framework captures stack traces in production

This is unanimous. Even MobX, which has the richest runtime diagnostic system
(spy, trace, enforceActions), gates all of it behind `__DEV__`.

### 2. The compile-time flag is the dominant pattern

Seven of eight implementations use a compile-time constant (`__DEV__`, `DEV`,
`_SOLID_DEV_`, `ngDevMode`, `import.meta.env`) that bundlers replace with `false`
in production, enabling dead-code elimination. The one exception (Legend State)
achieves the same result by simply not having any debug code to eliminate.

### 3. Stack traces are the most expensive diagnostic

Every framework that considers debug overhead prioritizes avoiding stack trace
capture. The alternatives are:
- **Naming** (Solid, Angular, MobX, Jotai): string labels, not stack frames
- **Graph topology** (Solid, Vue): navigable dependency graphs via DevTools
- **Spy events** (MobX): creation/mutation notifications without call stacks
- **Synchronous call stack inspection** (MobX): rely on the synchronous execution
  model so the mutation site is naturally in the stack when debugging

### 4. Svelte's double gate is the gold standard for stack traces

Svelte is the only framework that *does* capture creation-time stack traces, and
it uses the most defensive gating:
1. Compile-time `DEV` flag (stripped in production)
2. Runtime `tracing_mode_flag` (defaults to false even in development)
3. Update-count threshold (stack traces deferred until >5 updates per flush)

This means even developers actively working in dev mode pay zero stack trace cost
unless they explicitly opt in via `$inspect.trace()`.

### 5. The TC39 Signals proposal punts on debug infrastructure

The [proposal](https://github.com/tc39/proposal-signals) acknowledges that
debugging reactive causality chains is hard and suggests that built-in signals
would enable better DevTools integration. But it doesn't specify any debug
metadata, development mode, or diagnostic hooks in the signal API itself. The
expectation is that engine-level DevTools can provide this without userland
overhead.

### 6. Construction cost is where frameworks compete

The [js-reactivity-benchmark](https://js-reactivity-bench.milomg.dev/) explicitly
tracks signal creation time as a benchmark dimension. Frameworks are measured on
construction cost alongside update propagation speed. Adding unconditional overhead
to construction is a competitive disadvantage.

---

## Relevance to Semantic UI

The existing analysis in `signal-stack-trace.md` recommends Option B (lazy stack
trace via debug flag), which aligns precisely with ecosystem consensus. The
specific implementation could follow one of two patterns:

### Pattern A: Solid/Angular/MobX Style (Compile-time gate)

```js
// dependency.js
export class Dependency {
  constructor(...metadata) {
    this.subscribers = new Set();
    this.context = metadata;
    if (__DEV__) {
      this.captureTrace(this.context);
    }
  }
}
```

**Requires:** A `__DEV__` or equivalent constant, replaced by the build system.
Simplest and most common pattern. Debug always available in dev, never in prod.

### Pattern B: Svelte Style (Double gate)

```js
// dependency.js
export class Dependency {
  static tracing = false;

  constructor(...metadata) {
    this.subscribers = new Set();
    this.context = metadata;
    if (__DEV__ && Dependency.tracing) {
      this.captureTrace(this.context);
    }
  }
}
```

**Requires:** Both a compile-time constant and a runtime flag. More defensive.
Zero stack trace cost even during development unless explicitly enabled.

### Recommendation

Given that Semantic UI's component initialization creates ~8-16 signals per
component (settings proxy, state, dataVersion, subtemplates), and a typical page
has 20-50 components, **Pattern B (double gate) is the stronger choice**. The
Svelte precedent validates that even in development, always-on stack traces are
unnecessary overhead. The `Reaction.getSource()` API that consumes these traces
is already an explicit developer action — requiring an explicit
`Dependency.tracing = true` before it works is a natural pairing.

The double gate transforms the cost model from:
- Current: ~5-10us * 240 signals = **~1.2-2.4ms per page load** (always)
- Pattern A: Same cost but only in development
- Pattern B: Zero cost unless developer explicitly opts in for a debugging session

---

## Sources

### Preact Signals
- [Preact Signals Guide](https://preactjs.com/guide/v10/signals/)
- [@preact/signals-debug npm](https://www.npmjs.com/package/@preact/signals-debug)
- [Devtools for debug - Issue #384](https://github.com/preactjs/signals/issues/384)
- [Debugging discussion #515](https://github.com/preactjs/signals/discussions/515)
- [Signal Boosting blog post](https://preactjs.com/blog/signal-boosting/)

### Solid.js
- [createSignal docs](https://docs.solidjs.com/reference/basic-reactivity/create-signal)
- [signal.ts source](https://github.com/solidjs/solid/blob/main/packages/solid/src/reactive/signal.ts)
- [solid-devtools](https://github.com/thetarnav/solid-devtools)
- [Visualization/Dev Tools - Issue #153](https://github.com/solidjs/solid/issues/153)

### Angular Signals
- [signal.ts (primitives)](https://github.com/angular/angular/blob/main/packages/core/primitives/signals/src/signal.ts)
- [graph.ts (primitives)](https://github.com/angular/angular/blob/main/packages/core/primitives/signals/src/graph.ts)
- [Angular Signals Complete Guide](https://blog.angular-university.io/angular-signals/)

### Vue 3
- [ref.ts source](https://github.com/vuejs/core/blob/main/packages/reactivity/src/ref.ts)
- [effect.ts source](https://github.com/vuejs/core/blob/main/packages/reactivity/src/effect.ts)
- [Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth)
- [Reactivity API: Advanced](https://vuejs.org/api/reactivity-advanced)

### Svelte 5
- [sources.js source](https://github.com/sveltejs/svelte/blob/main/packages/svelte/src/internal/client/reactivity/sources.js)
- [$inspect docs](https://svelte.dev/docs/svelte/$inspect)
- [$inspect.trace() issue #14794](https://github.com/sveltejs/svelte/issues/14794)
- [Introducing runes](https://svelte.dev/blog/runes)

### MobX
- [observablevalue.ts source](https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/types/observablevalue.ts)
- [Configuration docs](https://mobx.js.org/configuration.html)
- [Analyzing reactivity docs](https://mobx.js.org/analyzing-reactivity.html)
- [Enable spy in production - Issue #2201](https://github.com/mobxjs/mobx/issues/2201)

### Jotai
- [atom.ts source](https://github.com/pmndrs/jotai/blob/main/src/vanilla/atom.ts)
- [Debugging guide](https://jotai.org/docs/guides/debugging)
- [Devtools docs](https://jotai.org/docs/tools/devtools)
- [Improve debugging info - Issue #931](https://github.com/pmndrs/jotai/issues/931)

### Legend State
- [GitHub repository](https://github.com/LegendApp/legend-state)
- [Performance guide](https://legendapp.com/open-source/state/v3/guides/performance/)

### General
- [TC39 Signals Proposal](https://github.com/tc39/proposal-signals)
- [TC39 Signals benchmark discussion - Issue #71](https://github.com/proposal-signals/proposal-signals/issues/71)
- [js-reactivity-benchmark](https://js-reactivity-bench.milomg.dev/)
- [Error.captureStackTrace regression - nodejs/node#11343](https://github.com/nodejs/node/issues/11343)
- [webpack captureStackTrace removal - webpack#13532](https://github.com/webpack/webpack/issues/13532)
- [webpack fix PR #13533](https://github.com/webpack/webpack/pull/13533)
- [V8 Stack Trace API](https://v8.dev/docs/stack-trace-api)
- [TC39 Error.captureStackTrace proposal](https://github.com/tc39/proposal-error-capturestacktrace)
