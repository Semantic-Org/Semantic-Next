# Art of the Possible: Expression Evaluation During Hydration

A survey of how modern web frameworks handle the tension between dependency registration and expression evaluation during hydration. The core problem: reactive frameworks need to know which signals/state each DOM binding depends on so future changes trigger updates, but the DOM already has the correct values from the server. Evaluating expressions purely to discover dependencies is wasted work.

## Framework Survey

### Solid.js

**Does it evaluate expressions during hydration?** Yes. Solid re-executes every component function during hydration to rebuild the fine-grained reactive graph. This is the fundamental tradeoff of Solid's runtime reactivity model: dependencies are discovered by running code, and the only way to discover them is to run the code.

**How it handles the DOM:** Solid uses a marker-based hydration system. The server inserts HTML comment markers (`<!--#-->`, `<!--/-->`) that the client uses to locate DOM nodes without creating new ones. During hydration, `getNextElement()` retrieves nodes from a `sharedConfig.registry` rather than creating them. Text content and attributes are not re-written to the DOM when values match the server output -- but the expressions are still evaluated to get those values and register dependencies.

**Effects during hydration:** `createEffect` callbacks are deliberately skipped during hydration. Only computations (`createMemo`, derived values, and the JSX template functions themselves) re-run. This is a key optimization: effects typically produce side-effects (fetch calls, DOM mutations outside the reactive tree) that should not replay during hydration. The reactive graph for rendering bindings is still rebuilt through the component re-execution.

**Serialization:** Solid serializes async data (resources created with `createResource`) using the `seroval` library with up to 6x performance over previous serializers. It also deduplicates serialized data across streaming flushes. However, it does NOT serialize the reactive dependency graph itself -- that is always rebuilt by re-execution.

**Open issues:** [Partial Hydration #264](https://github.com/solidjs/solid/issues/264) is a long-running discussion. Ryan Carniato has noted that for Solid, the purpose of hydration execution is to collect component boundaries, event listeners, and reactivity graphs. The question "does anything other than effects need to run in the browser at hydration time?" remains open -- if a template has no effects, theoretically only global event delegation bootstrapping is needed.

**Solid 2.0 direction:** The `@solidjs/signals` package is being built as a new reactive foundation. Solid 2.0 promises "pull-based SSR" which may change the hydration model, but no concrete mechanism for skipping expression evaluation during hydration has been described publicly.

**Key insight:** Solid proves that runtime fine-grained reactivity has a hard floor: you must run code to discover dependencies. The framework optimizes around this by skipping effects and not touching the DOM, but cannot avoid the expression evaluation itself.

Sources:
- [Hydration System | solidjs/solid | DeepWiki](https://deepwiki.com/solidjs/solid/5.2-hydration-system)
- [hydrate - Solid Docs](https://docs.solidjs.com/reference/rendering/hydrate)
- [Partial Hydration Issue #264](https://github.com/solidjs/solid/issues/264)
- [Conquering JavaScript Hydration - Ryan Carniato](https://dev.to/this-is-learning/conquering-javascript-hydration-a9f)

---

### Svelte 5

**Does it evaluate expressions during hydration?** Yes, but the compiler minimizes what needs to run. Svelte 5's compiler knows at build time which parts of a template are static and which are dynamic. Only dynamic bindings get hydration code emitted. The generated client code re-evaluates reactive expressions ($state, $derived) to register dependencies, but the compiler eliminates entire branches of static content from the hydration path.

**How it handles the DOM:** Svelte 5 uses "single-pass hydration" (landed via [PR #12335](https://github.com/sveltejs/svelte/pull/12335) by Rich Harris). The key optimization: `<!--[-->` and `<!--]-->` markers delimit block boundaries. The client walks the DOM once, claiming nodes and wiring reactive bindings. Each blocks no longer need per-item markers -- just one pair for the entire block. This reduced DOM size and significantly improved hydration speed.

**Dependency registration:** Svelte 5's rune system ($state, $derived, $effect) uses a push-pull reactivity model. During hydration, the compiled code runs each `$derived` expression and `$effect` body to register dependencies. The effect "recorder" captures all reactive reads synchronously, building the dependency set. However, $effect callbacks do NOT run during SSR or initial hydration on the server -- they only run client-side after hydration.

**Compiler advantage:** The compiler's static analysis is the core advantage. It knows:
- Which expressions are purely static (never change) -- these get no hydration code at all
- Which expressions reference $state -- these get targeted hydration
- Block boundaries (if/each/await) -- markers are emitted only around dynamic blocks

For a template like `<h1>Hello {name}</h1>` where `name` is `$state`, the compiled hydration code only needs to re-evaluate `name` and register its dependency. The `<h1>Hello ` and `</h1>` parts are known static and produce no hydration code.

**Hydration mismatch detection:** Svelte 5 has known issues with excessive hydration markers ([Issue #15200](https://github.com/sveltejs/svelte/issues/15200)) and hydration marker size impact ([Issue #14099](https://github.com/sveltejs/svelte/issues/14099)). The markers are necessary for correctness but add to document size.

**Key insight:** Compiled frameworks can eliminate hydration work for static content at build time, but still must evaluate dynamic expressions at runtime to register dependencies. The compiler advantage is proportional to the ratio of static to dynamic content.

Sources:
- [SSR Architecture | sveltejs/svelte | DeepWiki](https://deepwiki.com/sveltejs/svelte/6.1-ssr-architecture)
- [Single-pass hydration PR #12335](https://github.com/sveltejs/svelte/pull/12335)
- [Single-pass hydration PR #11770](https://github.com/sveltejs/svelte/pull/11770)
- [Excessive hydration markers Issue #15200](https://github.com/sveltejs/svelte/issues/15200)

---

### Qwik

**Does it evaluate expressions during hydration?** No. Qwik's entire architecture is designed to avoid this. Qwik applications don't hydrate -- they resume.

**How it avoids expression evaluation:** Qwik serializes the complete reactive subscription graph from server to client as part of the HTML payload. When the server renders, Qwik's proxy system tracks which reactive stores are read by which components/effects. This subscription information is serialized into the HTML as a JSON structure in a `<script>` tag:

```
"subs": [["2 #0 0 #1 data count"]]
```

This encodes: "the text node at position #0 in component #2 is subscribed to store property `data.count`." When a signal changes on the client, Qwik reads this serialized subscription map to know which QRLs (lazy-loaded function references) to invoke -- without ever having run the expression to discover the dependency.

**The QRL mechanism:** Functions (including reactive effects and event handlers) are not loaded as JavaScript until needed. They are represented as URLs (QRLs) in the HTML. When a subscribed signal changes, Qwik:
1. Looks up which QRLs are subscribed to that signal (from serialized subs)
2. Lazy-loads the QRL's JavaScript chunk
3. Executes the function with the component's serialized scope

The expression evaluation happens only on the first mutation, not on page load.

**Serialization cost:** The tradeoff is payload size. The serialized state, subscriptions, and QRL references add to the HTML document. For complex pages, this can be significant. The HackMD document ["Resumability without Serialization"](https://hackmd.io/@0u1u3zEAQAO0iYWVAStEvw/Hyu_IZQq2) explores whether resumability can be achieved with minimal serialization by backtracing reactive deps gathered at server render time.

**Closures and scope:** Qwik's optimizer extracts closures into separate chunks and serializes their captured scope. This is what enables the "zero JavaScript on load" promise -- but it requires the entire reactive graph to be serializable, which constrains what developers can do (no unserializable values in reactive scope without explicit `noSerialize()`).

**Key insight:** Qwik proves that dependency serialization CAN eliminate expression evaluation entirely during hydration. The cost is moved to: (1) server-side serialization overhead, (2) larger HTML payload, (3) developer constraints around serializability, and (4) first-interaction latency (loading + executing the QRL on first signal change).

Sources:
- [Resumable | Qwik Documentation](https://qwik.dev/docs/concepts/resumable/)
- [Reactivity | Qwik Documentation](https://qwik.dev/docs/concepts/reactivity/)
- [Resumability without Serialization - HackMD](https://hackmd.io/@0u1u3zEAQAO0iYWVAStEvw/Hyu_IZQq2)
- [Hydration is Pure Overhead - Builder.io](https://www.builder.io/blog/hydration-is-pure-overhead)

---

### Marko 6

**Does it evaluate expressions during hydration?** No -- Marko 6 uses compiler-driven resumability to eliminate hydration execution entirely for components that don't need it.

**How it works:** Marko's compiler performs cross-file dependency analysis to determine:
1. Which expressions are purely static (server-only, never change)
2. Which expressions depend on client-side state (need reactivity)
3. Which code needs to ship to the browser at all

The compiler outputs 4 separate exports per component: HTML template string, encoded DOM walks (navigation instructions), and separate apply functions for each input. These exports are tree-shakable -- if a parent passes static data, the child's reactive update code is never shipped to the client.

**Scope objects instead of closures:** Marko 6 eliminates closures entirely. Instead, a scope object stores all "points of interest" -- DOM TextNodes, reactive variable values, references to parent scopes. During server rendering, Marko serializes these scope objects. On the client, the serialized scope is deserialized and wired directly to DOM update functions.

**Sub-template partial hydration:** The compiler traces the reactive dependency graph to determine which sub-trees of a component need hydration. If a `<div>{staticValue}</div>` subtree has no reactive dependencies, no hydration code is emitted for it -- not even markers. Only the leaf nodes of the reactive graph (things read from a DOM binding, event handler, or effect) need serialization.

**The "serialize only leaf nodes" optimization:** Instead of serializing all reactive state, Marko only serializes values that are directly consumed by client-side DOM bindings or effects. If a derived value depends on a serialized signal, the derivation function is shipped (as code) and the value is recomputed on the client when needed. This minimizes payload while preserving reactivity.

**Key insight:** Marko 6 represents the theoretical optimum for compiled frameworks: the compiler has complete knowledge of the dependency graph, can determine which code needs to ship to the client at build time, and serializes only the minimal scope needed for resumption. The tradeoff is compile-time complexity and the requirement that the compiler can trace all dependencies cross-file.

Sources:
- [Marko: Compiling Fine-Grained Reactivity - Ryan Carniato](https://dev.to/ryansolid/marko-compiling-fine-grained-reactivity-4lk4)
- [Why Efficient Hydration in JavaScript Frameworks is so Challenging](https://dev.to/this-is-learning/why-efficient-hydration-in-javascript-frameworks-is-so-challenging-1ca3)
- [eBay's Marko Adds Optimized Reactivity Model - InfoQ](https://www.infoq.com/articles/ebay-marko-performance-reactivity-model/)
- [marko-js/marko | DeepWiki](https://deepwiki.com/marko-js/marko)

---

### Vue / Vapor Mode

**Does it evaluate expressions during hydration?** Yes. Vue's standard hydration traverses the existing DOM, matches each node with its VNode counterpart, and attaches reactive effects. The render function runs as a reactive effect, so all reactive dependencies are captured during this execution.

**Standard Vue hydration:** The client-side app re-executes component render functions, producing a virtual DOM tree. Instead of creating new DOM nodes, Vue "claims" the existing server-rendered DOM by walking and matching. Reactive effects are registered during this process -- every `ref` and `reactive` property read during render is tracked by Vue's proxy-based reactivity system.

**Vapor Mode status:** Vue Vapor bypasses the virtual DOM entirely, generating direct DOM manipulation code similar to Solid. Inspired by Solid.js, Vapor uses Vue's reactivity system (refs, reactive, proxies) to track dependencies and update specific DOM nodes. However, SSR hydration support in Vapor is NOT yet implemented -- it's listed as an ongoing development focus. The current Vapor implementation focuses on client-side rendering performance.

**Vue's optimizations:** Vue uses "patch flags" encoded in vnode creation calls. These bitwise flags tell the runtime renderer which specific checks to perform (dynamic class, dynamic style, dynamic text, etc.), allowing it to skip checks for static parts. During hydration, this reduces work by narrowing which attributes and properties need reactive effect registration.

**Lazy hydration in Vue:** Vue supports lazy hydration through `defineAsyncComponent` with `hydrate` strategies (idle, visible, on interaction, on media query, custom). This defers when components hydrate but doesn't change the fact that expressions are re-evaluated when hydration occurs. Angular's `@defer` + incremental hydration uses a similar approach.

**Key insight:** Vue's VDOM-based hydration is fundamentally more expensive than fine-grained approaches because it re-creates the entire virtual tree to diff against the real DOM. Vapor Mode addresses this for client-side rendering but hasn't solved the hydration problem yet. The patch flags optimization shows that compiler analysis can reduce hydration work even in a VDOM framework.

Sources:
- [Hydration | vuejs/core | DeepWiki](https://deepwiki.com/vuejs/core/7.2-hydration)
- [Preview of Vue 3.6 & Vapor Mode - Vue School](https://vueschool.io/articles/news/vn-talk-evan-you-preview-of-vue-3-6-vapor-mode/)
- [vuejs/vue-vapor | DeepWiki](https://deepwiki.com/vuejs/vue-vapor)
- [Vue SSR Guide - Hydration](https://v2.ssr.vuejs.org/guide/hydration.html)

---

### Preact Signals

**Does it evaluate expressions during hydration?** Yes. Preact's hydration reconciles the server-rendered DOM with the client's virtual DOM tree. When signals are used, the component re-renders (via VDOM diffing), which triggers signal reads that register dependencies.

**Signals and SSR:** Components rendered using SSR APIs (`renderToString`) in a server environment do NOT track signal usage -- signal dependency tracking is disabled because server renders are one-shot (no re-renders possible). On the client, hydration re-executes components, which reads signals and registers dependencies for future updates.

**Hydration 2.0 in Preact 11:** The upcoming Preact 11 introduces "Hydration 2.0" which allows components that suspend during hydration to return zero or multiple DOM nodes. It also switches hook dependency checks from loose equality to `Object.is`. However, neither change addresses the fundamental issue of expression re-evaluation during hydration.

**Progressive hydration:** Preact supports progressive/partial hydration through `preact-iso`, which allows "islands" to hydrate independently. This defers when hydration happens but doesn't eliminate expression evaluation when it does.

**Key insight:** Preact's VDOM-based architecture means hydration always involves a full component re-execution and VDOM diff. Signals improve subsequent update performance (fine-grained tracking) but don't help with initial hydration cost. The VDOM is the bottleneck.

Sources:
- [Server-Side Rendering - Preact Guide](https://preactjs.com/guide/v10/server-side-rendering/)
- [Signals - Preact Guide](https://preactjs.com/guide/v10/signals/)
- [Preact 11 Beta - InfoQ](https://www.infoq.com/news/2025/09/preact-11-beta/)
- [Hydration in Preact - Jovi De Croock](https://www.jovidecroock.com/blog/hydration-and-preact/)

---

## Comparative Analysis

### The Spectrum of Approaches

```
Full Re-execution ←————————————————————————→ Zero Re-execution

Preact    Vue    Solid    Svelte 5    Marko 6    Qwik
  |        |       |         |           |         |
  VDOM    VDOM   Fine-    Compiled    Compiled   Serialized
  diff    diff   grained  + fine-    + fine-    dependency
                 runtime  grained    grained    graph
                          runtime    + scope
                                     serialization
```

### Do compiled frameworks have an advantage?

**Definitively yes**, but the advantage manifests in different ways:

1. **Static elimination (Svelte, Marko):** The compiler identifies which expressions are static and emits no hydration code for them. Runtime frameworks (Solid, Preact) cannot do this -- they must execute all code to discover what's static vs dynamic.

2. **Dependency pre-computation (Marko):** The compiler traces the reactive dependency graph at build time and serializes only the minimal scope needed. Runtime frameworks must rebuild the graph by execution.

3. **Code splitting at the expression level (Marko):** Tree-shakable exports per input mean the client only loads code for reactive paths. This is more granular than component-level code splitting.

4. **The hard limit:** Even compiled frameworks must evaluate dynamic expressions at some point. The question is when (server vs client vs first interaction) and how much context must be serialized to defer it.

### Approaches that serialize dependency information

| Framework | What's serialized | When deps are registered |
|-----------|-------------------|-------------------------|
| **Qwik** | Full subscription graph (signal -> QRL mappings), component scope, store state | Never "registered" in traditional sense -- subscriptions are loaded from serialized data on first mutation |
| **Marko 6** | Scope objects (DOM references, reactive values), encoded DOM walks | On hydration, but only for components with client-side reactivity. No expression re-evaluation -- scope is deserialized directly |
| **Solid** | Async resource data only. NO dependency graph | Rebuilt by re-executing all components during hydration |
| **Svelte 5** | Hydratable data (serialized state). NO dependency graph | Rebuilt by running compiled hydration code |
| **Vue** | SSR state via `window.__NUXT__` or similar. NO dependency graph | Rebuilt by re-executing render functions during hydration |
| **Preact** | No first-party serialization | Rebuilt by VDOM reconciliation |

### Open issues and RFCs

| Framework | Issue / Discussion | Status |
|-----------|--------------------|--------|
| Solid | [Partial Hydration #264](https://github.com/solidjs/solid/issues/264) | Open since 2021, active discussion |
| Solid | [Future Architecture: Hybrid Routing + Minimal Hydration #400](https://github.com/solidjs/solid-start/issues/400) | Open |
| Svelte | [Excessive hydration markers #15200](https://github.com/sveltejs/svelte/issues/15200) | Open |
| Svelte | [Hydration markers cause increase in document size #14099](https://github.com/sveltejs/svelte/issues/14099) | Open |
| Qwik | [Future of server-side resumability #91](https://github.com/QwikDev/qwik-evolution/issues/91) | Open |
| Qwik | [Resumability without Serialization](https://hackmd.io/@0u1u3zEAQAO0iYWVAStEvw/Hyu_IZQq2) | HackMD proposal |
| Angular | [Web Component hydration #52275](https://github.com/angular/angular/issues/52275) | Open |

---

## Novel Approaches Worth Noting

### JIT Hydration (Prism / Kaleidawave)

The [Prism framework](https://kaleidawave.github.io/posts/jit-hydration/) implements "Just-In-Time hydration" where state values are hydrated from the rendered DOM itself rather than from a serialized JSON blob. The compiler knows where each variable is interpolated in the DOM, so it generates code that reads the current text content of a DOM node to reconstruct the signal's value. Dependencies are registered lazily on first access.

This eliminates the "double data problem" (state values existing in both the DOM and a serialized script tag) and avoids expression evaluation entirely -- the DOM IS the serialized state.

**Limitation:** Only works for values that are directly visible in the DOM (text content, attribute values). Computed values, boolean flags, or state used only in conditionals cannot be recovered from the DOM.

### Expression Reversal (Prism)

Related: [Expression reversal issue](https://github.com/kaleidawave/prism/issues/11) explores whether the compiler can generate "reverse" functions that extract variable values from rendered DOM output. For `Hello {name}!`, the reverse function extracts `name` by stripping the known static prefix "Hello " and suffix "!". This is a compiler-time inversion of the template expression.

### Resumability Without Serialization (HackMD proposal)

The [HackMD document](https://hackmd.io/@0u1u3zEAQAO0iYWVAStEvw/Hyu_IZQq2) explores achieving resumability with minimal serialization by backtracing reactive dependencies gathered during server rendering. The theory: all the heavy serialization in Qwik happens because of partial hydration (code splitting), not because of resumability itself. If you accept loading all component code upfront, you can approximate resumability by recording which signals each expression read during server rendering and encoding that as a lightweight mapping.

---

## Relevance to Semantic UI's Native Renderer

### Current situation

The native renderer's hydration path (documented in `expression-eval-firstrun.md`) faces exactly this problem. Every Reaction runs its callback on `firstRun` to register dependencies. The expression evaluation cascade (token parsing, deep data lookup, `new Function` + `with` for JS expressions, helper resolution) runs purely for the side-effect of triggering `Signal.get()` -> `Dependency.depend()`. The result is discarded because the DOM already has the correct content.

### What the survey reveals about Semantic UI's options

**Semantic UI is closest to Solid on the spectrum.** Both use runtime fine-grained reactivity with dynamic expression evaluation. Neither has a compiler that knows dependencies at build time. The key differences:

1. **Semantic UI's expression language is more dynamic than Solid's JSX.** Solid's JSX compiles to known function calls. Semantic UI's template expressions use a dual Lisp/JS syntax evaluated via `new Function` + `with` + Proxy. This makes static analysis harder.

2. **Semantic UI has an AST available.** Unlike Solid's compiled output, Semantic UI's templates produce an AST that is walked at runtime. This AST contains the expression strings and their types (text, attribute, block condition, etc.). The AST is a form of compile-time knowledge that could be leveraged.

3. **The `buildHTMLString` split point is natural.** The SSR plan already identifies `buildHTMLString` as the server/client divergence point. The `entries` array produced by `buildHTMLString` contains expression metadata that could carry dependency hints.

### Approaches ranked by feasibility for Semantic UI

**Tier 1: Immediately actionable (no architecture changes)**

1. **Simple lookup fast path (Approach 5 from expression-eval-firstrun.md):** For expressions matching `/^[a-zA-Z_$][0-9a-zA-Z_$.]*$/`, directly walk the data context path and call `dependency.depend()`. Skips the full evaluator cascade. Covers ~75% of template expressions. This is the Svelte-like optimization: using structural knowledge (the expression is a simple path) to avoid runtime discovery overhead.

2. **Expression parsing cache:** Cache `getExpressionArray()` results per expression string. Pure function, deterministic output, zero risk. Benefits complex expressions on all runs, not just first-run.

**Tier 2: Server-assisted (requires SSR changes)**

3. **Dependency hints in entries:** During server rendering, record which data-context keys each expression accessed (the server evaluator already resolves expressions). Serialize this as a `deps: ['item.name', 'count']` array on each entry. During client hydration, use these hints to directly register dependencies via path walking, skipping expression evaluation entirely. Falls back to full eval if hints are missing (non-SSR render path).

   This is a lightweight version of Qwik's subscription serialization. The key difference: Qwik serializes Signal identity (which specific store property), while this serializes path strings (which data-context key). The client still needs to resolve paths to Signals, but avoids the expression evaluation cascade.

   **Cost:** Additional server-side bookkeeping during expression evaluation. Slightly larger HTML payload (one array of strings per entry in the hydration manifest).

   **Benefit:** Could eliminate 90%+ of client-side expression evaluation during hydration. The server already evaluates every expression exactly once -- recording which keys it accessed is cheap.

4. **DOM-as-state for simple values (JIT hydration inspired):** For text expressions, the DOM already contains the rendered value. During hydration, read the text node's `textContent` to get the current value. If the value matches what the expression would produce, skip evaluation entirely. Still register dependencies via the path-walk approach.

   **Limitation:** Only works for text nodes where the value is directly visible. Attributes, conditionals, and computed values need evaluation.

**Tier 3: Architectural (longer term)**

5. **AST-derived dependency map:** Analyze the AST at `buildHTMLString` time to extract identifier references from expressions. For simple paths, this is trivial. For JS expressions, use a lightweight identifier extractor (not a full parser -- just find bare identifiers that aren't keywords, string literals, or number literals). Store as a static dependency map on the prototype alongside `_hydrationEntries`.

   This is the Marko-like approach adapted for runtime: you don't have a build-time compiler, but you have AST access at template instantiation time. The dependency map is computed once per component type, not per instance.

6. **Reaction-less hydration for text/attribute bindings:** Instead of creating a full Reaction for each text/attribute binding during hydration, create a lightweight "HydrationBinding" that stores only the expression string, the DOM target, and the dependency set. On first signal change, promote it to a full Reaction. This defers Reaction creation cost (function allocation, Scheduler registration) to first interaction.

   This is a hybrid of Qwik's deferred execution and Solid's runtime model. The dependency set is still discovered by evaluation (or by hints from the server), but the Reaction machinery is deferred.

### Summary: What's possible vs what's practical

The survey reveals that NO framework has solved the general problem of "register reactive dependencies without evaluating expressions" at runtime. The solutions are:

- **Avoid the problem entirely** (Qwik: serialize subscriptions, never hydrate)
- **Reduce the problem surface** (Svelte/Marko: compiler eliminates static content)
- **Accept the cost and optimize the path** (Solid: fast fine-grained re-execution)

For Semantic UI's runtime template model, the practical path is a combination:
- Simple lookup fast path (Tier 1, #1) for immediate wins
- Server-emitted dependency hints (Tier 2, #3) when SSR ships
- Expression parsing cache (Tier 1, #2) as a low-risk universal improvement

The Tier 2 approach is the most novel opportunity. No surveyed framework with runtime reactivity currently serializes dependency information as hints for the client hydration path. Qwik serializes complete subscriptions (heavyweight), and Marko uses compiler analysis (unavailable at runtime). A lightweight dependency-hint approach occupies an unexplored middle ground.
