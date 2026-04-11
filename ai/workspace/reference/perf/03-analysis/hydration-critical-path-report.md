# Hydration Critical Path Analysis

Performance evaluation of the native renderer's hydration pipeline for Semantic UI Next web components with Declarative Shadow DOM (DSD).

**Source files analyzed:**
- `packages/component/src/engines/native/base.js`
- `packages/templating/src/template.js`
- `packages/renderer/src/engines/native/renderer.js`
- `packages/renderer/src/engines/native/reaction-scope.js`
- `packages/renderer/src/engines/native/dynamic-region.js`
- `packages/reactivity/src/reaction.js`
- `packages/reactivity/src/dependency.js`
- `packages/reactivity/src/scheduler.js`
- `packages/renderer/src/build-html-string.js`
- `packages/renderer/src/expression-evaluator.js`
- `packages/renderer/test/browser/ssr-hydration.test.js`

---

## Question 1: Why the current ordering, and what is the minimum synchronous set?

### Why the current ordering exists

The hydration lifecycle in `base.js` lines 118-193 follows this sequence:

```
getData() -> clone(+initialize+attach+attachEvents) -> buildEntries -> hydrateMarkers -> removeMarkers
```

**Each step has a dependency on what precedes it:**

1. **`getData()` must come first.** It builds the data context (settings + spec properties + darkMode getter) that every subsequent operation consumes. The Renderer constructor needs this data to create the ExpressionEvaluator. The state-watching Reaction in `initialize()` needs it to know which Signals exist. Without this, no expression can be evaluated.

2. **`clone()` triggers `attach()` which triggers `initialize()`.** This is because the Template constructor (template.js line 101-103) calls `attach(renderRoot)` when renderRoot is provided. The `attach()` method (line 326-347) calls `initialize()` if not yet initialized, then calls `attachEvents()` and `bindKeys()`. This chaining exists because `initialize()` creates the Renderer instance that `hydrateMarkers` needs, and `attach()` sets up the `renderRoot`/`parentNode` context that events need for delegation scoping (`isNodeInTemplate`).

3. **`buildEntries` (via `buildHTMLString`) must precede `hydrateMarkers`.** The entries array maps marker IDs to AST nodes and their classifications (attribute vs. text vs. block, property vs. event binding type). `hydrateMarkers` uses these entries to know what each comment marker in the server DOM represents.

4. **`hydrateMarkers` must precede `removeMarkers`.** The hydration walker finds comment nodes by their marker prefixes (`sui:v1:`, `sui-block:v1:`). If markers were removed first, there would be no anchors to locate dynamic positions in the DOM.

5. **`attachEvents()` runs inside `attach()`, before `hydrateMarkers`.** This is because `attach()` is designed as a single "wire this template to a DOM root" operation used by both hydration and subtemplate mounting. Events are set up via delegation on the shadow root, so they work immediately regardless of whether the inner DOM is hydrated yet. The test at line 621-643 (`fires created and rendered events`) confirms that lifecycle events must fire in the correct order during hydration.

**The `_hydrating` flag in the constructor (base.js line 37-38)** exists because the browser parses DSD attributes *before* `connectedCallback` fires. Without the flag, `attributeChangedCallback` would trigger `adjustPropertyFromAttribute` which calls `requestUpdate`, scheduling renders against a component that hasn't hydrated yet. The guard at line 255-257 returns early during hydration, letting attribute values flow into property storage (needed for `getData`) without triggering the render cascade.

### Minimum synchronous set for functional correctness

**Scenario A: Setting changed programmatically immediately after hydration returns.**

The caller does `el.hydrate()` then `el.settings.color = 'red'`. This requires:
- `el.component` must exist (set at line 145) so `el.component.someMethod()` works
- `el.dataContext` must exist (set at line 146) so signal-bearing state is accessible
- `el.template` must exist (set at line 136) so `requestUpdate` -> `template.render()` works
- The Renderer must exist with its ExpressionEvaluator and data context, so re-renders evaluate expressions correctly
- The state-watching Reaction (template.js line 242-251) must be subscribed to all Signals, so that state mutations schedule re-renders

All of these are produced by `clone()` -> `initialize()`. So `getData + clone/initialize` is the **hard minimum** for programmatic API correctness.

**What about `hydrateMarkers`?** If markers aren't wired, a state change would schedule a re-render via the state-watching Reaction, but the Reaction callbacks bound to specific DOM nodes (text nodes, attribute bindings) wouldn't exist yet. The re-render path goes through `requestUpdate` -> `template.render()` -> `renderer.bumpDataVersion()`, which bumps the `dataVersion` Signal. But the per-binding Reactions created by `hydrateMarkers` are the ones that actually update individual DOM nodes. Without them, the data version bump has no subscribers, so **DOM won't update**. A full re-render would work (clearing and rebuilding the shadow DOM), but that defeats the purpose of hydration.

Therefore: `hydrateMarkers` must complete before any reactive update can visually take effect. It does not need to complete before the programmatic API *exists*, but it must complete before any state mutation *propagates to the DOM*.

**What about `attachEvents`?** If the user clicks 50ms after hydration, events need to be wired. Since `attachEvents` uses event delegation on the shadow root (not individual element listeners), it only creates a handful of listeners regardless of DOM size. At 0.9ms for 1000 items, this is already cheap. But it could theoretically be deferred if the component has no events and no keys.

**What about `removeMarkers`?** Comment removal is purely cosmetic (clean DevTools). The test at line 658-673 (`no hydration comments remain`) enforces this, but the timing is not constrained. Markers could be removed asynchronously without affecting correctness.

**Minimum synchronous set:**
1. `getData()` - required
2. `clone/initialize` (creates component instance, Renderer, state Reaction, callParams) - required
3. `hydrateMarkers` - required for reactive DOM updates to work
4. `attachEvents` - required before user interaction, deferrable
5. `removeMarkers` - never required synchronously

### Approaches to restructuring the synchronous minimum

#### Approach 1: Status quo with deferred removeMarkers only

**Mechanism:** Move `removeMarkers()` from synchronous hydration into `requestIdleCallback` or `setTimeout(..., 0)`.

**What it optimizes for:** Saves ~6ms (28% of the 23ms total) with zero risk to correctness. The markers are inert comment nodes that don't affect layout, rendering, or event handling.

**Tradeoffs:** Markers briefly visible in DevTools Elements panel. Could confuse developers inspecting immediately after hydration. The existing `requestAnimationFrame` wrapper in `connectedCallback` already defers the entire hydration; this would add a second deferral tier within it.

**Risk:** Near zero. The test `no hydration comments remain` would need to await the deferred removal, but the functional contract is unaffected.

#### Approach 2: Two-phase hydration (sync critical + async interactive)

**Mechanism:** Split hydration into two phases:
- **Phase 1 (synchronous):** `getData`, `clone/initialize` (without `attachEvents` / `bindKeys`), `hydrateMarkers`. This gives the component a working reactive binding layer.
- **Phase 2 (deferred via rAF or idle callback):** `attachEvents`, `bindKeys`, `removeMarkers`.

This requires restructuring `attach()` in template.js. Currently `attach()` always calls both `initialize()` and `attachEvents()` + `bindKeys()`. The hydration path would call `initialize()` directly, then later call a new `attachInteractive(renderRoot)` method.

**What it optimizes for:** Reduces synchronous time by ~7ms (events + markers). The component is visually correct and reactively wired immediately. User interaction within the deferral window (typically <16ms for a rAF) would not fire handlers, but DSD content is static/non-interactive by nature before JS loads, so this preserves the same user experience.

**Tradeoffs:** Introduces a window where `el.component` exists but events don't fire. If framework code (like `onCreated`) sets up programmatic event listeners via `attachEvent`, those would also be deferred. The `eventController` AbortController created in `attachEvents` is referenced by `callParams.abortController` — if `onCreated` uses it before events are attached, it would be undefined.

**Ordering constraint:** `attachEvents` creates `this.eventController` (template.js line 512) which is referenced in `callParams` (line 306). If `callParams` is built during `initialize()` before events are attached, `callParams.abortController` would be stale. This could be solved by making it a getter or by creating the controller earlier.

**Risk:** Medium. Needs careful audit of `onCreated` callbacks that use `attachEvent` or the abort controller.

#### Approach 3: Marker removal via single combined TreeWalker

**Mechanism:** Instead of separate `hydrateMarkers` + `removeMarkers` passes, remove markers inline during `hydrateMarkers`. The hydration walker already visits every comment node. After processing a marker (wiring its Reaction), remove the comment node immediately or collect it for batch removal at the end of the same pass.

Currently `hydrateMarkers` replaces some comments with text node anchors (e.g., `comment.replaceWith(region.anchor)` in block handling, `comment.remove()` in text expression handling) but leaves block closing markers (`/sui-block:`) in the DOM. `removeMarkers` then does a second full TreeWalker pass to clean everything.

**What it optimizes for:** Eliminates the entire 6ms `removeMarkers` pass. The hydration walker already touches every relevant comment. The cost is absorbed into the existing walk.

**Tradeoffs:** The `hydrateMarkers` code becomes responsible for cleanup. Block handlers already remove closing markers (`next.remove()` at line 1469), but opening markers are only replaced for blocks (not for inner markers that are handled recursively). Care needed to ensure all paths remove their markers. Recursive `hydrateInnerContent` calls also need to clean up.

**Risk:** Low-medium. Requires ensuring every comment path in `hydrateMarkers` either removes or replaces its comment. The current code already does this for most cases — the gap is comments inside block regions that are handled by recursive calls.

#### Approach 4: Pre-computed hydration entries with prototype-level marker map

**Mechanism:** The `buildHTMLString` call during hydration (base.js line 153-156) is already cached on the prototype after the first instance. But `hydrateAttributes` (renderer.js line 1196) calls `buildHTMLStringPure` again to create a reference DOM for parallel walking. This second call is not cached.

Pre-compute a serialized "attribute binding map" at the prototype level: `Map<elementIndex, Array<{attrName, parts, classification}>>`. This eliminates the need to parse a reference DOM during hydration. The element index can be a depth-first element order number that both server and client agree on.

**What it optimizes for:** Eliminates the reference DOM construction in `hydrateAttributes`. The `buildHTMLTime` metric in `__hydPerf` tracks this cost. For attribute-heavy templates, this could be significant.

**Tradeoffs:** Requires the server renderer to emit element indices or some structural fingerprint. Adds complexity to the hydration entry format. Block directives that expand to variable numbers of elements (each loops) complicate fixed indexing — the current parallel-walker approach with `blockOwnedElements` skip set handles this dynamically.

**Risk:** Medium-high. The variable-length nature of block directives means a simple index won't work. Would need a hierarchical addressing scheme (e.g., path-based indices that skip block regions), adding significant complexity.

#### Approach 5: Lazy hydration — hydrate on first interaction or viewport entry

**Mechanism:** Instead of hydrating in `connectedCallback` (even with the rAF deferral), register an IntersectionObserver or interaction listener. Only hydrate when the component enters the viewport or receives a user interaction (click, focus, pointer).

For components below the fold, this could eliminate hydration entirely during initial page load. The DSD content remains visible and styled, just not interactive or reactive.

**What it optimizes for:** Total work elimination for off-screen components. On a page with 50 components but only 5 visible, this reduces hydration work by 90%.

**Tradeoffs:** Components that need to respond to programmatic API calls (e.g., `el.component.doSomething()`) would fail until hydrated. Parent components that query children via `findChild` would not find unhydrated children. Events dispatched to unhydrated components would be lost. Settings changes via attributes would not propagate (the `_hydrating` guard in `attributeChangedCallback` suppresses the cascade, but without hydration completing, the guard never drops).

**Risk:** High. This is a semantic change — components go from "always hydrated after connectedCallback" to "maybe hydrated." Every consumer of `el.component` would need null checks. The framework would need a `el.whenHydrated()` Promise API.

---

## Question 2: Separating template creation from interactive machinery

### Current coupling

The Template constructor's behavior when `renderRoot` is passed (template.js line 101-103):

```js
if (renderRoot) {
  this.attach(renderRoot);
}
```

And `attach()` (lines 326-347):

```js
async attach(renderRoot, { parentNode, startNode, endNode } = {}) {
  if (!this.initialized) {
    this.initialize();
  }
  // ...
  this.attachEvents();
  this.bindKeys();
  if (this.attachStyles) {
    await this.adoptStylesheet();
  }
}
```

This chains three concerns:
1. **Initialization** (Renderer creation, component instance, state Reaction, callParams, onCreated) — needed for reactivity
2. **Event delegation** (attachEvents, bindKeys) — needed for interaction
3. **Style adoption** (adoptStylesheet) — handled separately in base.js for hydration

### Ordering constraints

- `initialize()` must precede everything — it creates the Renderer, instance, and Reactions.
- `attachEvents()` requires `this.parentNode` and `this.renderRoot` (line 505-507 checks with `fatal()`). These are set by `attach()` before calling `attachEvents()`.
- `attachEvents()` creates `this.eventController` which is referenced as `callParams.abortController` (template.js line 306). If `callParams` is built during `initialize()`, this reference would be `undefined` when accessed later. However, looking at the code: `callParams` is built at the *end* of `initialize()` (line 278-321), and `this.eventController` is created *inside* `attachEvents()` (line 512). So `callParams.abortController` is already `undefined` at creation time in the current code — it only becomes valid after `attachEvents` runs. This appears to be a latent issue or intentional loose coupling.
- `bindKeys()` has no dependencies beyond `this.keys` and `this.eventController`.
- `onCreated()` is called at the end of `initialize()` (line 322). If user code in `onCreated` calls `attachEvent()` (the instance method at line 869), it uses `this.eventController` which hasn't been created yet if events haven't been attached. This is the key ordering concern.

### Approaches

#### Approach 1: Split `attach()` into `attachReactivity()` and `attachInteractivity()`

**Mechanism:** Factor `attach()` into two methods:

```js
attachReactivity(renderRoot) {
  if (!this.initialized) { this.initialize(); }
  this.renderRoot = renderRoot;
  this.parentNode = renderRoot;
}

attachInteractivity(renderRoot, { parentNode, startNode, endNode } = {}) {
  this.parentNode = parentNode || renderRoot;
  this.startNode = startNode;
  this.endNode = endNode;
  this.attachEvents();
  this.bindKeys();
}
```

The hydration path in `base.js` calls `attachReactivity` synchronously, then defers `attachInteractivity`.

**Tradeoffs:** Clean separation. The Template API grows but each method has a clear responsibility. Subtemplates (`createSubtemplate`, `hydrateSubtemplate` in renderer.js) call `attach()` with boundary nodes — they would need to call both methods, or use the combined `attach()` which remains for backward compatibility.

**Risk:** The `onCreated` callback runs during `initialize()`. If user code does `attachEvent(...)` in `onCreated`, it needs `eventController`. This would fail if interactivity is deferred. Solution: create `eventController` in `initialize()` instead of `attachEvents()`, and have `attachEvents()` reuse it.

#### Approach 2: Pass a `deferEvents` option to `attach()`

**Mechanism:** Add an option:

```js
attach(renderRoot, { deferEvents = false, ... } = {}) {
  if (!this.initialized) { this.initialize(); }
  this.renderRoot = renderRoot;
  this.parentNode = parentNode || renderRoot;
  if (!deferEvents) {
    this.attachEvents();
    this.bindKeys();
  }
}
```

The hydration path passes `deferEvents: true` and calls `this.template.attachEvents()` / `this.template.bindKeys()` later.

**Tradeoffs:** Minimal API change. No new methods. But the Template is left in a partially-initialized state — `renderRoot` is set but events aren't attached. Code that checks `this.renderRoot` to determine "is this template attached?" would be misleading.

**Risk:** Low. The option is self-documenting and the deferred call is explicit.

#### Approach 3: Constructor option to suppress `attach()` entirely

**Mechanism:** Add `autoAttach: false` to the Template constructor options. When false, the constructor stores `renderRoot` but does not call `attach()`. The hydration code calls `initialize()` and `attach()` (or the split versions) explicitly.

```js
if (renderRoot && autoAttach !== false) {
  this.attach(renderRoot);
}
```

**Tradeoffs:** The hydration path gains explicit control over the initialization sequence. The `clone()` method in Template already passes through all options, so adding `autoAttach` is straightforward. But this pushes initialization responsibility to the caller — every hydration path must remember to call both `initialize()` and `attach()`.

**Risk:** Low-medium. Easy to forget the manual calls, but the hydration path is a single callsite in `base.js`.

#### Approach 4: Move `eventController` creation to `initialize()`, keep `attach()` unified

**Mechanism:** Instead of splitting the flow, create `eventController` during `initialize()` so that `callParams.abortController` is valid from the start. Then `attachEvents()` reuses the existing controller instead of creating a new one. This doesn't change the hydration sequence but removes the ordering constraint, making future splitting safe.

```js
// In initialize():
this.eventController = new AbortController();

// In attachEvents():
// Remove: this.eventController = new AbortController();
// The controller already exists from initialize()
```

**Tradeoffs:** No behavioral change. Purely structural. Makes the `eventController` lifecycle cleaner — it's born in `initialize()` and dies in `onDestroyed()` (via `removeEvents`). This is a prerequisite for any of the above approaches.

**Risk:** Very low. The current `attachEvents()` calls `removeEvents()` first (line 508), which aborts the existing controller. If `eventController` is created in `initialize()`, the first `removeEvents()` call would abort it and `attachEvents()` would need to create a new one anyway. So this needs `removeEvents()` to only abort if events were actually attached.

---

## Question 3: Cost model of `Reaction.create()` and cheaper dependency registration

### Current cost model

`Reaction.create(callback, options)` (reaction.js lines 6-12):

1. **Object allocation:** `new Reaction(callback)` creates an object with `callback`, `dependencies` (new Set), `firstRun: true`, `active: true`, and `boundRun` (.bind creates a new function). Cost: ~2 allocations (object + bound function) + 1 Set.

2. **First run execution:** `reaction.boundRun()` is called immediately (line 9). This:
   - Sets `Scheduler.current = this` (scheduler.js line 63)
   - Clears dependencies (line 65 — no-op on first run, empty set)
   - Calls `this.callback(this)` — the actual work
   - Sets `Scheduler.current = null`
   - Removes from `pendingReactions`

3. **Dependency registration during callback:** When the callback evaluates an expression that reads a Signal, the Signal's getter calls `dependency.depend()` (dependency.js lines 9-13):
   ```js
   depend() {
     if (Scheduler.current) {
       this.subscribers.add(Scheduler.current);
       Scheduler.current.dependencies.add(this);
     }
   }
   ```
   Two Set.add operations per dependency.

4. **Expression evaluation cost:** Each `this.eval(expr, data)` call during the Reaction callback involves `ExpressionEvaluator.lookupExpressionValue`, which tokenizes and interprets the expression. For hydration, every text binding and every attribute binding evaluates its expression on first run purely to register Signal dependencies — the DOM write is skipped with `if (comp.firstRun) return;`.

**Per-Reaction cost summary:** ~1 object + 1 function + 1 Set + N expression evaluations + N*2 Set.add operations, where N is the number of distinct Signals touched.

For a 1000-item card list, if each card has 5 reactive bindings, that's 5000 Reactions created during `hydrateMarkers`, each doing 1+ expression evaluations. At the `__hydPerf` metrics, `evalFirstRun` and `evalFirstRunTime` track this exactly.

### The state-watching Reaction in `initialize()`

Template.js lines 242-250:

```js
const stateReaction = Reaction.create(() => {
  each(this.state, (signal) => signal.dependency.depend());
  if (this.rendered && !this.destroyed) {
    Reaction.afterFlush(this.onUpdated);
  }
});
```

This iterates every Signal in `state` and calls `.depend()` on each. On first run, it registers dependencies on all state Signals so that any state change triggers `onUpdated`. The cost is O(|state|) Set.add operations. For a component with 10 state signals, this is trivial (20 Set operations). The main cost concern is that this Reaction re-runs on *every* state change just to schedule `onUpdated`.

### Approaches to cheaper dependency registration

#### Approach 1: Batch dependency registration without Reaction execution

**Mechanism:** Instead of creating a Reaction, running its callback, and relying on the reactive tracking to register dependencies, provide a direct API:

```js
// Hypothetical:
Dependency.registerBulk(reaction, [signal1.dependency, signal2.dependency, ...]);
```

For hydration text bindings, the current pattern is:
```js
Reaction.create((comp) => {
  if (comp.firstRun) {
    this.eval(exprNode.value, data); // just to register deps
    return;
  }
  textNode.data = this.eval(exprNode.value, data) ?? '';
});
```

With batch registration, if the set of dependencies is known statically (e.g., from AST analysis of which variables an expression references), we could skip the first-run evaluation entirely:

```js
const reaction = new Reaction(updateCallback, { firstRun: false });
for (const dep of getExpressionDeps(exprNode.value, data)) {
  dep.subscribers.add(reaction);
  reaction.dependencies.add(dep);
}
```

**What it optimizes for:** Eliminates expression evaluation on first run. For 5000 bindings, this removes 5000 calls to `lookupExpressionValue` during hydration — a significant portion of the 13.7ms `hydrateMarkers` cost.

**Tradeoffs:** Requires static analysis of which Signals an expression depends on. The expression language supports dynamic lookups (`data[key]`), nested property access, helper functions that may read Signals internally, and ternary expressions where branches read different Signals. Static analysis would miss dynamic dependencies, leading to missed updates.

**Risk:** High. The reactive system's correctness depends on runtime dependency tracking. Static analysis can only approximate this. A single missed dependency means a binding never updates, which is worse than a performance regression.

#### Approach 2: Deferred first-run — register deps on first Signal change

**Mechanism:** Create Reactions with `firstRun: false`, but register them on a "global dependency" that fires on the first data change. When the first Signal changes, a single flush runs all hydration Reactions for their actual first evaluation, establishing real dependencies.

```js
const hydrateReaction = new Reaction(callback, { firstRun: false });
this.globalHydrateDep.subscribers.add(hydrateReaction);
// Later, on first state change:
this.globalHydrateDep.changed(); // triggers all deferred Reactions
```

**What it optimizes for:** Defers all expression evaluation until the first actual data change. If the user never interacts with the component, no expression evaluation happens at all. On the first interaction, all bindings evaluate once to register their real dependencies, then updates flow normally.

**Tradeoffs:** The first state change after hydration is expensive — all deferred Reactions fire at once, causing a "jank spike" on first interaction. For 1000 items with 5 bindings each, that's 5000 expression evaluations triggered by a single Signal change. This trades startup latency for interaction latency.

**Risk:** Medium. The jank moves from page load (where it's expected) to user interaction (where it's not). Could be mitigated by spreading evaluations across frames, but that adds complexity.

#### Approach 3: Reduce expression evaluation cost with cached lookups

**Mechanism:** The `ExpressionEvaluator.lookupExpressionValue` parses expressions on every call (tokenization, operator detection, function resolution). During hydration first-run, the same expression is evaluated as it was during server rendering — the value hasn't changed. Cache the parsed expression structure (token array, helper resolution) so repeat evaluations skip parsing.

The `getExpressionArray(expr)` method (expression-evaluator.js line 31) runs regex parsing on every call. A simple `Map<string, ParsedExpression>` cache would eliminate repeated parsing.

**What it optimizes for:** Reduces per-evaluation cost without changing the number of evaluations. If tokenization is a significant fraction of `evalFirstRunTime`, this helps proportionally.

**Tradeoffs:** Memory for the cache. Cache invalidation isn't needed since expressions are string literals from the AST that never change. The cache would grow to the number of unique expressions in the template (typically small).

**Risk:** Very low. Pure performance optimization with no semantic change. The cache only needs to be scoped to the expression string.

#### Approach 4: Share dependency sets across identical bindings

**Mechanism:** In an `{#each}` loop with 1000 items, each item creates the same set of Reactions with the same expression strings. The dependency structure (which Signals are read) differs per item because each item has its own `itemProxy`, but the *expression parsing* is identical. A higher-level optimization: for each loops, create one "prototype Reaction" that records which data keys the expression reads, then for each item, directly wire the Reaction to the item's Signal without evaluating.

```js
// Prototype evaluation (once):
const depsTemplate = traceExpressionDeps(exprNode.value, prototypeData);
// Per item (cheap):
for (const item of items) {
  const reaction = new Reaction(updateFn, { firstRun: false });
  for (const key of depsTemplate) {
    const dep = resolveItemDep(key, item);
    dep.subscribers.add(reaction);
    reaction.dependencies.add(dep);
  }
}
```

**What it optimizes for:** Reduces N*M evaluations (N items, M bindings per item) to M evaluations + N*M cheap wiring operations. For 1000 items with 5 bindings, this is 5 evaluations instead of 5000.

**Tradeoffs:** Only works for `each` loops where items share the same expression structure. The `createItemDataProxy` Proxy in the current implementation makes dependency resolution indirect — the Signal for a given key depends on the item proxy, which delegates to `itemSignal.value`. Static wiring would need to understand this indirection.

**Risk:** Medium. The item proxy pattern means that all per-item data reads go through a single `itemSignal` — there's actually only one dependency per item (the item Signal), not one per field. So the savings may be smaller than expected because the current system already creates just one Signal per item.

#### Approach 5: Skip first-run evaluation for text bindings, use DOM content as proof

**Mechanism:** During hydration, the server already rendered the correct text content. The text node already contains the right value. The only purpose of first-run evaluation is dependency registration. Instead of evaluating the expression, walk the expression AST to find variable references and register dependencies directly on the corresponding data keys.

Unlike Approach 1's full static analysis, this is scoped to the simpler case of text interpolation (`{name}`, `{item.count}`) where the expression is a single variable lookup or dotted path. For these simple cases, the dependency is deterministic from the expression string alone:

```js
if (isSimpleVarLookup(exprNode.value)) {
  const signal = resolveSignal(exprNode.value, data);
  if (signal) {
    signal.dependency.subscribers.add(reaction);
    reaction.dependencies.add(signal.dependency);
  }
}
else {
  // Complex expression — fall back to evaluation
  this.eval(exprNode.value, data);
}
```

**What it optimizes for:** Eliminates expression evaluation for the majority of bindings (simple variable lookups are the most common case). Falls back to full evaluation only for complex expressions (ternaries, helper calls, arithmetic).

**Tradeoffs:** Two code paths for dependency registration — increases complexity. The definition of "simple" needs to be precise and match what `lookupExpressionValue` would actually read. If the simple path registers the wrong dependency (e.g., missing a nested Signal inside an object), the binding breaks silently.

**Risk:** Medium. The fallback path means correctness is preserved for complex cases. The simple path only needs to handle the common patterns (`{name}` -> `data.name`, `{item.count}` -> `data.item` then `.count`). The risk is in edge cases where what looks like a simple lookup actually involves a getter or Proxy that reads additional Signals.

---

## Question 4: Redundant operations and lazy deferral opportunities

### Identified redundancies

#### 1. `removeMarkers` is a full second TreeWalker pass over the same DOM

**Why it exists:** Historical separation — `hydrateMarkers` wires bindings, `removeMarkers` cleans up. The two concerns were kept separate for clarity.

**What's redundant:** `hydrateMarkers` already visits and processes every `sui:` and `sui-block:` comment. Many comments are already removed or replaced during hydration:
- Text expression comments: replaced with text nodes (`comment.replaceWith(textNode)` or `comment.remove()`)
- Block opening comments: replaced with DynamicRegion anchors (`comment.replaceWith(region.anchor)`)
- Block closing comments: removed inline (`next.remove()` at renderer.js line 1469)

The remaining comments that `removeMarkers` catches are:
- Comments inside block regions that were processed by recursive `hydrateInnerContent` calls
- Any comment nodes that the hydration code paths don't explicitly remove

**This is partially redundant.** The hydrateMarkers code already removes most markers. A targeted audit of which markers survive hydration would reveal whether `removeMarkers` can be eliminated entirely or reduced to a narrow cleanup.

#### 2. `buildHTMLString` called twice — once for entries, once for reference DOM

The hydration path calls `buildHTMLString` in two places:
1. `base.js` line 153: `this.template.renderer.buildHTMLString(this.template.ast)` to get `entries` (cached on prototype)
2. `renderer.js` line 1196: `buildHTMLStringPure(ast || this.ast, ...)` inside `hydrateAttributes` to create a reference DOM for parallel attribute walking

The entries from call #1 are passed to `hydrateMarkers`, which passes them to `hydrateAttributes`. But `hydrateAttributes` doesn't use the entries' attribute information to locate elements — it builds a fresh reference DOM and walks it in parallel with the real DOM. The `htmlString` from call #1 is not passed through (only `entries` is cached on the prototype).

**This is partially redundant.** If the `htmlString` were also cached alongside `entries` on the prototype, `hydrateAttributes` could reuse it instead of calling `buildHTMLStringPure` again. However, for recursive `hydrateInnerContent` calls (line 1593), the inner AST differs from the top-level AST, so those calls can't use the top-level cache.

#### 3. Expression evaluation during hydration firstRun duplicates server work

Every text binding, attribute binding, and block condition is evaluated on first run during hydration purely to register reactive dependencies. The server already evaluated these same expressions to produce the rendered HTML. The values computed on the client match the server values (assuming no hydration mismatch).

**This is structurally redundant but functionally necessary.** The reactive system has no mechanism to register dependencies without evaluation. The evaluation is the side-effect-bearing operation that tells the system "this Reaction depends on these Signals." See Question 3 approaches for alternatives.

#### 4. `canHydrate()` TreeWalker followed by `hydrateMarkers` TreeWalker

`canHydrate()` (base.js lines 104-116) walks comment nodes to find the first `sui:` marker and check its version string. Then `hydrateMarkers` walks comment nodes again to process all markers.

**This is a minor redundancy.** `canHydrate()` returns as soon as it finds the first marker, so it's typically a single-step walk. The cost is negligible compared to the full `hydrateMarkers` walk. However, the version check could be integrated into the `hydrateMarkers` entry point as a preamble.

#### 5. Server `<style>` removal could be avoided by not emitting it

`base.js` line 125-128 removes a server `<style>` element because the client uses `adoptedStyleSheets`. If the server renderer knew that the client would use adopted stylesheets, it could skip emitting the `<style>` tag.

**This is conditionally redundant.** The server emits `<style>` because DSD content must be self-contained for the browser to render it correctly before JS loads — the `<style>` is the only styling mechanism available in the initial HTML parse. Once JS loads and hydrates, adopted stylesheets take over. The `<style>` removal is correct but could be optimized (e.g., the server could add a `data-ssr` attribute so the client can `querySelector('style[data-ssr]')` without a generic search).

### Lazy-on-first-access opportunities

#### 1. `callParams` object could be built lazily

The `callParams` object (template.js lines 278-321) includes ~20 `.bind()` calls and several getters. It's built synchronously during `initialize()`. If no lifecycle callback (`onCreated`, `onRendered`) or event handler accesses it before the first user interaction, it could be deferred.

**Constraint:** `onCreated()` is called at line 322, immediately after `callParams` is built. It uses `this.call(this.onCreatedCallback)` which accesses `this.callParams`. So `callParams` must exist before `onCreated`. However, many components have `onCreated: noop`, so the `call()` method short-circuits (line 797: `if (!isFunction(func)) return;` — `noop` is a function, but it returns immediately). The `.bind()` calls still happen.

**Approach:** Lazy-bind: replace `.bind(this)` calls with arrow function wrappers or a Proxy that binds on first access. The `.bind()` cost is small per-call but multiplied by ~10 binds * N components.

#### 2. `AbortController` + `AbortSignal` created but potentially unused

Template constructor (line 81-82):
```js
this.abortController = new AbortController();
this.abortSignal = this.abortController.signal;
```

These are created for every template instance regardless of whether the component uses abort-aware operations. The AbortController is used for lifecycle cleanup (`onDestroyed` aborts it), but if a component is never destroyed (persists for the page lifetime), this is unnecessary.

**Constraint:** This is created in the *constructor*, not in `initialize()`. It runs for every `new Template()` including clones. Since `abortSignal` is exposed in `callParams`, it must exist by the time `callParams` is built. But it could be created lazily on first access.

#### 3. `MutationObserver` for theme changes

`attachEvents()` (template.js lines 514-529) creates a MutationObserver on `document.documentElement` for class changes (dark mode detection) if `onThemeChangedCallback !== noop`. This runs for every component that defines `onThemeChanged`. For a page with many components, this creates many observers watching the same attribute on the same element.

**This is redundant at scale.** A single shared MutationObserver could notify all interested templates. However, this is an events concern, not a hydration concern per se.

---

## Summary of the highest-impact opportunities

Ordered by estimated impact on the 23ms hydration budget:

| Opportunity | Estimated savings | Risk | Complexity |
|---|---|---|---|
| Inline marker removal during hydrateMarkers | ~6ms | Low-medium | Low |
| Cache htmlString on prototype (avoid 2nd buildHTMLString) | ~1-2ms | Low | Low |
| Deferred attachEvents + bindKeys | ~1ms | Medium | Medium |
| Expression evaluation caching (parsed token cache) | Variable (portion of 13.7ms) | Very low | Low |
| Two-phase hydration (reactive sync, interactive deferred) | ~7ms total | Medium | Medium |
| Skip first-run eval for simple lookups | Variable | Medium | Medium |

The first two items (inline marker removal and htmlString caching) are pure waste elimination with low risk. The expression evaluation cache is a "free" optimization that reduces the constant factor of every evaluation. Together, these three could reduce hydration time by 30-40% with minimal architectural change.
