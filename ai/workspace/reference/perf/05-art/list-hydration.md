# State of the Art: List Hydration in Modern Web Frameworks

Research survey covering how eight major frameworks hydrate server-rendered lists. Conducted April 2026.

---

## Executive Summary

List hydration is one of the hardest unsolved problems in frontend SSR. Every framework makes a different tradeoff along three axes:

1. **Hydration granularity** -- whole-list vs. per-item reactive bindings
2. **Server HTML encoding** -- whether item boundaries are marked in the HTML
3. **First-mutation cost** -- keyed reconciliation from hydrated state vs. full teardown/rebuild

No production framework today achieves true per-item lazy hydration for lists (hydrate only the items that are interacted with). The closest approaches are Qwik's resumability (which avoids hydration entirely but pays serialization cost) and Marko 6's compiler-driven partial hydration (which eliminates list code from the browser when no client-side state exists).

The field is converging on two strategies:
- **Fine-grained resumability** (Qwik, Marko 6, Solid 2.0 planned): serialize the reactive graph so no re-execution is needed
- **Coarse hydration with optimized first mutation** (Svelte 5, Vue Vapor, Angular): hydrate the block boundary, then do smart reconciliation on change

---

## Framework-by-Framework Analysis

### 1. Solid.js (1.8+ / 2.0 experimental)

**How lists are hydrated:**
Solid uses fine-grained reactivity without a virtual DOM. The `<For>` component on the server renders to a flat HTML string. During hydration, Solid walks the DOM using comment markers (`<!--$-->`, `<!--/-->`) and `data-hk` attributes to match reactive computations to DOM nodes. The `<For>` component hydrates by registering its reactive computation against the server-rendered DOM rather than re-creating it.

**Per-item boundaries in server HTML:**
Solid uses comment markers at *component* and *flow control* boundaries, not at individual list item boundaries. The `<For>` block gets outer boundary markers, but individual items within the list do not get their own markers. The hydration walker uses the component's context ID system to match the correct DOM region.

**First mutation after hydration:**
On first mutation, Solid's `<For>` component uses `reconcileArrays` (a keyed reconciliation algorithm based on the Ivi library's approach) to diff the old and new lists. Since Solid's reactivity is fine-grained, only the specific DOM nodes affected by the change are updated. The `<For>` component maintains a mapping of keys to DOM nodes established during hydration, so mutations are incremental from the start -- there is no "first mutation cliff." This is a significant advantage of Solid's approach.

**Partial/progressive/lazy list hydration:**
No built-in per-item lazy hydration. The `<For>` component hydrates as a unit. Solid does support `<NoHydration>` to skip subtrees entirely, but this is coarse-grained (component-level, not item-level). The partial hydration issue ([#264](https://github.com/solidjs/solid/issues/264)) has been open since 2020.

**Future direction (Solid 2.0):**
The [Road to 2.0 discussion](https://github.com/solidjs/solid/discussions/2425) outlines plans for reactive graph serialization -- serializing the signal dependency graph on the server and restoring it on the client. This would enable resumability-style hydration where list items could theoretically resume without re-executing their reactive setup. This is described as: "shape different compiled outputs to generate the same graph, add reactive graph serialization, then implement reactive graph restoration during hydration."

**Key sources:**
- [Hydration System (DeepWiki)](https://deepwiki.com/solidjs/solid/5.2-hydration-system)
- [Solid.js Releases / Changelog](https://github.com/solidjs/solid/releases)
- [The Road to 2.0](https://github.com/solidjs/solid/discussions/2425)
- [Partial Hydration Issue #264](https://github.com/solidjs/solid/issues/264)

---

### 2. Svelte 5

**How lists are hydrated:**
Svelte 5 introduced single-pass hydration ([PR #12335](https://github.com/sveltejs/svelte/pull/12335)) which fundamentally changed how the framework processes server-rendered DOM. Instead of building up a `hydrate_nodes` array by iterating all nodes first, Svelte 5 maintains a single `hydrate_node` cursor that advances as the application hydrates. Each blocks are hydrated by walking through the server-rendered DOM nodes in order.

**Per-item boundaries in server HTML:**
A key optimization from single-pass hydration: **each blocks no longer need hydration comments for each item**, only for the each block itself. The server emits `<!--[-->` and `<!--]-->` markers around the entire each block, not around individual items. This reduced DOM size significantly. However, there has been community discussion about excessive markers in some scenarios ([Issue #15200](https://github.com/sveltejs/svelte/issues/15200), [Issue #14099](https://github.com/sveltejs/svelte/issues/14099)).

**First mutation after hydration:**
On the first list mutation, Svelte's compiled each block code runs its update logic. Svelte 5 uses a compiler-generated keyed or unkeyed reconciliation path depending on whether the `(key)` expression is present in the `{#each}` block. The effect system tracks which items changed and performs targeted DOM updates. Since Svelte compiles away the framework overhead, the reconciliation is specialized per-template rather than generic.

**Partial/progressive/lazy list hydration:**
No per-item lazy hydration. Svelte hydrates each blocks as a unit during the single-pass hydration walk. There is no mechanism to defer hydration of individual list items. [SvelteKit issue #1390](https://github.com/sveltejs/kit/issues/1390) tracks partial hydration as a feature request, and [issue #11844](https://github.com/sveltejs/kit/issues/11844) discusses resumability.

**Key sources:**
- [Single-pass hydration PR #12335](https://github.com/sveltejs/svelte/pull/12335)
- [Excessive hydration markers #15200](https://github.com/sveltejs/svelte/issues/15200)
- [Hydration markers size #14099](https://github.com/sveltejs/svelte/issues/14099)
- [Partial hydration discussion #1390](https://github.com/sveltejs/kit/issues/1390)

---

### 3. Qwik (1.x / 2.0)

**How lists are hydrated:**
Qwik does not hydrate lists -- it *resumes* them. The server serializes the entire reactive state graph into a `<script type="qwik/json">` block at the end of the HTML. Component boundaries are marked with HTML comments like `<!--qv q:id=7 q:key=xYL1:zl_0-->`. When a user interacts with a list item, only the handler for that specific item is lazy-loaded and executed. No framework re-execution occurs.

**Per-item boundaries in server HTML:**
Yes. Qwik marks component boundaries (and therefore list item boundaries when items are components) with virtual node comments that include `q:id` attributes. These virtual nodes reference serialized props and state in the JSON data block. In Qwik 2.0, these virtual node markers are being moved to the end of the HTML stream for optimization, allowing tree-shaking of unnecessary data after the full application structure is known.

**First mutation after hydration:**
When a list mutation occurs, Qwik loads only the minimal code needed to process the change. If the mutation doesn't cause structural changes (no adds/removes), Qwik can update signals without loading the component code at all. For structural changes, the component's render function is lazy-loaded. Qwik uses vDOM diffing only when structural changes occur; otherwise it performs direct signal-to-DOM updates (similar to Solid).

**Partial/progressive/lazy list hydration:**
This is Qwik's core value proposition. Each list item can independently resume without requiring the parent component's code. "A component can be delay-loaded independently from the state of the component" and "any component can be resumed without the parent component code being present." For lists, this means clicking item #47 loads only item #47's handler code.

**Qwik 2.0 improvements:**
The [Qwik 2.0 blog post](https://www.builder.io/blog/qwik-2-coming-soon) describes moving serialization data to the end of the HTML stream, enabling better tree-shaking. Static components that can't be interacted with have their virtual nodes removed entirely. The framework also reduces the cost of the serialized payload by applying heuristics after seeing the complete application tree.

**Key sources:**
- [Qwik Resumability Docs](https://qwik.dev/docs/concepts/resumable/)
- [Towards Qwik 2.0](https://www.builder.io/blog/qwik-2-coming-soon)
- [Serialization Guide](https://qwik.dev/docs/guides/serialization/)
- [Resumability without Serialization (HackMD)](https://hackmd.io/@0u1u3zEAQAO0iYWVAStEvw/Hyu_IZQq2)

---

### 4. Marko 6

**How lists are hydrated:**
Marko 6 uses compiler-driven fine-grained partial hydration that operates at the *reactive boundary* level, not the component level. The compiler analyzes which values are dynamic, where they are used, and where they change, then splits template code into server-only, client-only, and shared pieces. For lists, if the `<for>` tag's items are static (no client-side mutations), the entire list's JavaScript is eliminated from the browser bundle. If items have client-side state, only the reactive parts are shipped.

**Per-item boundaries in server HTML:**
Marko's compiler determines boundaries at compile time rather than encoding them with runtime markers. The compiler splits templates into multiple tree-shakable exports organized around their reactive inputs. For the `<for>` tag, the compiler can determine whether each item needs client-side code based on whether state is created within the loop body.

**First mutation after hydration:**
Marko 6's `<for>` tag supports a `by` attribute for keyed reconciliation. When items have client-side state (meaning their code was shipped), mutations use fine-grained updates similar to Solid. The compiler generates optimized update paths. When items are static and their code was tree-shaken away, mutations would require loading the code first -- but this scenario implies the list was never expected to change on the client.

**Partial/progressive/lazy list hydration:**
Marko achieves the most aggressive form of partial hydration through compiler analysis. "Marko can hydrate along reactive boundaries rather than component ones, allowing it to split the stateful and static parts of the template and ship only parts of components and their descendants to the browser." This means a `<for>` loop rendering 1000 items where only 3 have interactive buttons would ship JS only for those 3 items' button handlers. This is the closest any framework gets to true per-item selective hydration.

**Key sources:**
- [Marko: Compiling Fine-Grained Reactivity](https://dev.to/ryansolid/marko-compiling-fine-grained-reactivity-4lk4)
- [What has the Marko Team Been Doing](https://dev.to/ryansolid/what-has-the-marko-team-been-doing-all-these-years-1cf6)
- [FLUURT: Re-inventing Marko](https://dev.to/ryansolid/fluurt-re-inventing-marko-3o1o)
- [Introducing the Marko Tags API Preview](https://dev.to/ryansolid/introducing-the-marko-tags-api-preview-37o4)

---

### 5. Vue / Vapor Mode

**How lists are hydrated:**

*Vue 3 (vDOM mode):* Hydration walks the server-rendered DOM tree and creates the virtual DOM in memory to match it. `v-for` lists are hydrated by creating vnode representations for each item and matching them to existing DOM nodes. This is whole-list hydration.

*Vue Vapor (experimental in 3.6+):* Vapor eliminates the virtual DOM entirely and compiles templates to direct DOM operations. For SSR hydration, Vapor injects special comment anchors (`<!--for-->`, `<!--[[-->`, `<!--]]-->`) into server-rendered HTML. The runtime functions `createFor` are hydration-aware and use these anchors (identified by `FOR_ANCHOR_LABEL`) to locate and reuse server-rendered DOM nodes. DOM traversal helpers (`__child`, `__next`, `__nthChild`) skip over SSR comment anchors during hydration.

**Per-item boundaries in server HTML:**
Vue Vapor uses `<!--for-->` markers for the overall loop and `<!--[[-->` / `<!--]]-->` for block boundaries. The implementation in [PR #13226](https://github.com/vuejs/core/pull/13226) updates `transformChildren` to create placeholder nodes in the template string for each dynamic child, facilitating node matching during hydration.

**First mutation after hydration:**
Vue 3 uses its standard vDOM patching algorithm with keyed reconciliation (the `key` prop on `v-for` items). Vue Vapor avoids vDOM entirely -- on mutation, the compiled update function directly manipulates the DOM nodes that correspond to changed items. Vapor's approach is similar to Svelte's compiled output.

**Partial/progressive/lazy list hydration:**
Vue Vapor's roadmap ([Issue #13687](https://github.com/vuejs/core/issues/13687)) lists SSR/Hydration as a critical feature. Vapor supports partial hydration through "islands" where only interactive components are hydrated. However, per-item list hydration is not explicitly supported -- hydration operates at the component level.

**Key sources:**
- [Vue Vapor hydration PR #13226](https://github.com/vuejs/core/pull/13226)
- [Vapor Roadmap #13687](https://github.com/vuejs/core/issues/13687)
- [Vue Mastery: Future of Vue Vapor Mode](https://www.vuemastery.com/blog/the-future-of-vue-vapor-mode/)
- [Vue School: Preview of Vue 3.6 & Vapor](https://vueschool.io/articles/news/vn-talk-evan-you-preview-of-vue-3-6-vapor-mode/)

---

### 6. Angular (17+ / 21)

**How lists are hydrated:**
Angular uses a comprehensive hydration system built around the `ngh` attribute and serialized view data. During SSR, Angular annotates component host elements with `ngh="N"` attributes that reference serialized hydration data stored in `__nghData__` script blocks. The data structure includes component IDs, child configurations, template identifiers, and critically, **root node counts** (`r` property) that tell the client exactly how many DOM nodes belong to each view.

**Per-item boundaries in server HTML:**
Angular serializes per-item metadata into the `__nghData__` structure rather than using HTML comments between items. For `@for` loops, each iteration's view has a known root node count, allowing the hydration system to correctly partition the DOM without per-item marker comments. Comment nodes are used as anchors for view containers, and the hydration process expects them at their original locations.

**First mutation after hydration:**
Each `@for` loop iteration hydrates independently. Angular's documentation specifies that developers should use `track` with unique keys to ensure correct mapping between server and client. On mutation, Angular's standard change detection and view container management handles adds/removes/reorders. The `@for` block uses the `track` expression for keyed reconciliation.

**Partial/progressive/lazy list hydration:**
Angular has the most developed incremental hydration story among vDOM frameworks. The `@defer` block with hydration triggers (`on idle`, `on viewport`, `on interaction`, `on hover`) enables lazy hydration of component subtrees. For lists, you can wrap list items in `@defer` blocks to achieve per-item lazy hydration, though this requires explicit opt-in and changes the template structure. The [RFC for Incremental Hydration](https://github.com/angular/angular/discussions/57664) was completed and the feature is stable in Angular 21.

**Event replay:**
Angular uses `jsaction` attributes for event replay -- events that fire before hydration completes are captured and replayed after the relevant code loads. This is particularly important for lists where items may be interacted with before hydration reaches them.

**Key sources:**
- [Angular Hydration Guide](https://angular.dev/guide/hydration)
- [Angular Incremental Hydration Guide](https://angular.dev/guide/incremental-hydration)
- [RFC: Incremental Hydration #57664](https://github.com/angular/angular/discussions/57664)
- [Push-based: Incremental Hydration Introduction](https://push-based.io/article/incremental-hydration-in-angular-introduction-part-1-3)

---

### 7. React 19

**How lists are hydrated:**
React 19 hydrates by walking the server-rendered DOM and creating the fiber tree in memory to match it. During hydration, React creates fiber nodes for every component and matches them to existing DOM nodes rather than creating new ones. For lists, React reconstructs the fiber tree for all items, attaches event listeners, and performs a reconciliation pass to verify server/client consistency.

**Per-item boundaries in server HTML:**
React does not encode per-item boundaries in the server HTML. Server-rendered lists are flat sequences of HTML elements. The fiber reconciler relies on the component tree structure and `key` props to match items. React uses Suspense boundary comments (`<!--$-->`, `<!--/$-->`) for streaming boundaries, but these are at the Suspense level, not the list item level.

**First mutation after hydration:**
React's standard reconciliation algorithm runs on the fiber tree. Keyed children are reconciled using React's two-pass algorithm (first pass: match keys in order; second pass: handle moves/inserts/deletes). Since the full fiber tree was constructed during hydration, the first mutation has no special cost beyond normal reconciliation.

**Partial/progressive/lazy list hydration:**
React 19 offers selective hydration via Suspense boundaries. Components wrapped in `<Suspense>` can hydrate independently and out of order. React prioritizes hydrating components that the user is interacting with -- if a user clicks an unhydrated list item, React jumps to hydrate that subtree first. However, this operates at the Suspense boundary level, not the individual list item level. Wrapping every list item in Suspense would be impractical.

Server Components eliminate hydration entirely for static content -- a server-rendered list that never changes client-side never ships JS to the client. This is React's answer to partial hydration, but it's component-granularity, not item-granularity.

**Key sources:**
- [React 19 Blog Post](https://react.dev/blog/2024/12/05/react-19)
- [Wix: 40% Faster Interaction with Selective Hydration](https://www.wix.engineering/post/40-faster-interaction-how-wix-solved-react-s-hydration-problem-with-selective-hydration-and-suspen)
- [React 19 Hydration Guide (jsdev.space)](https://jsdev.space/react-19-hydration-guide/)

---

### 8. Preact (10.x / 11 Beta)

**How lists are hydrated:**
Preact's hydration is similar to React's but lighter-weight. `hydrate()` replaces `render()` and attempts to reuse existing DOM. During hydration, Preact indexes DOM children: keyed children go into a keyed index, unkeyed children are matched by tag name. The renderer avoids DOM mutations during hydration for performance.

**Per-item boundaries in server HTML:**
No per-item markers. Preact relies on vnode-to-DOM matching during the diff pass. Server HTML is a flat sequence of elements.

**First mutation after hydration:**
Preact uses its standard diff algorithm. Keyed vnodes are looked up in the keyed index; unmatched keyed vnodes are reclaimed. The first mutation after hydration has no special cost since the vnode tree was fully constructed during `hydrate()`.

**Partial/progressive/lazy list hydration:**
Preact 11 Beta (September 2025) introduced Hydration 2.0, which supports components that suspend during hydration returning zero or multiple DOM nodes. This enables more complex async hydration patterns. Preact's partial hydration approach requires manual islands setup (e.g., with `preact-iso` or Astro). Per-item list hydration is not supported.

**Known limitation (fixed in 11):** Preact 10 had issues with "resumed hydration" -- hydration that pauses for async data. Adjacent text nodes also caused problems because HTML parsers merge them but Preact's vnode tree doesn't. These are addressed in Preact 11.

**Key sources:**
- [Preact 11 Beta (InfoQ)](https://www.infoq.com/news/2025/09/preact-11-beta/)
- [Preact Hydration Design Documentation (Wiki)](https://github.com/preactjs/preact/wiki/Hydration-Design-Documentation)
- [Hydration 2.0 RFC #4442](https://github.com/preactjs/preact/issues/4442)
- [Hydration in Preact (Jovi De Croock)](https://www.jovidecroock.com/blog/hydration-and-preact/)

---

## Comparative Matrix

| Framework | Hydration Granularity | Item Boundaries in HTML | First Mutation Strategy | Lazy/Per-Item Hydration |
|---|---|---|---|---|
| **Solid.js** | Fine-grained (reactive) | Block-level markers only | Keyed reconciliation (incremental from start) | No (planned in 2.0 via graph serialization) |
| **Svelte 5** | Block-level (compiled) | Block-level `<!--[-->` only | Compiled keyed/unkeyed reconciliation | No |
| **Qwik** | Per-item (resumable) | Per-component virtual nodes | Lazy-load + signal update or vDOM diff | Yes (core feature) |
| **Marko 6** | Sub-component (compiler) | Compiler-determined | Fine-grained keyed updates | Yes (compiler-driven code elimination) |
| **Vue Vapor** | Block-level (compiled) | `<!--for-->` + block markers | Direct DOM manipulation (no vDOM) | No (islands-level only) |
| **Angular** | Component/view level | Serialized node counts in JSON | Keyed reconciliation via `track` | Yes (via `@defer` blocks) |
| **React 19** | Component/Suspense level | Suspense boundary markers only | Fiber reconciliation (keyed) | Suspense-boundary level only |
| **Preact 11** | Component level | None | VDOM diff (keyed) | No (manual islands only) |

---

## Key Themes and Insights

### 1. The Hydration Cost Distribution Problem

For most frameworks, the cost profile of list hydration looks like:

```
Hydration:        [=====] Walk DOM, create reactive/vnode tree for ALL items
First mutation:   [=] Incremental diff (only changed items)
Subsequent:       [=] Incremental diff
```

The expensive work happens upfront during hydration, even for lists that may never change. Only Qwik and Marko fundamentally alter this by deferring or eliminating the upfront cost.

### 2. The Marker Overhead Tradeoff

Frameworks face a fundamental tradeoff: more markers in the HTML enable finer-grained hydration but increase payload size.

- **Minimal markers** (Svelte 5, React, Preact): Block-level only. Smaller HTML. But the client cannot identify individual items without re-executing template logic.
- **Structured metadata** (Angular): Node counts serialized in JSON. No per-item HTML markers, but metadata overhead in script blocks.
- **Per-component markers** (Qwik): Virtual node comments with IDs. Enables per-item resumability but increases HTML size.
- **Compiler elimination** (Marko 6): The compiler determines boundaries at build time, avoiding runtime markers entirely.

Svelte 5's single-pass hydration specifically optimized away per-item markers: "each blocks no longer need hydration comments for each item, just for the each block itself." This was a deliberate choice to reduce DOM size at the cost of per-item granularity.

### 3. The Resumability Frontier

Two frameworks are pushing toward true resumability for lists:

**Qwik** achieves it today through aggressive serialization of the reactive graph into HTML. The cost is payload size -- every signal value, every component boundary, every prop must be serialized. Qwik 2.0 mitigates this by moving serialization to the end of the HTML stream and applying tree-shaking heuristics.

**Solid 2.0** plans to achieve it through reactive graph serialization -- the same approach as Qwik but with Solid's fine-grained signal graph. The [Resumability without Serialization HackMD doc](https://hackmd.io/@0u1u3zEAQAO0iYWVAStEvw/Hyu_IZQq2) discusses an alternative where you "back-trace reactive deps you gather at server render time" to minimize what needs to be serialized.

### 4. Compiler Analysis as an Alternative to Runtime Markers

Marko 6's approach is fundamentally different from Qwik's. Where Qwik serializes the runtime reactive graph, Marko's compiler statically determines what code needs to run on the client. For lists, this means:

- If no item has client-side state: zero JS shipped for the list
- If items have event handlers: only the handler code is shipped
- If items have reactive state: only the reactive update code is shipped

This is the most code-efficient approach but requires a specialized compiler with cross-template analysis capabilities. Ryan Carniato describes it as: "the compiler not only compiles away the reactivity, it compiles away the components themselves."

### 5. Angular's Pragmatic Middle Ground

Angular's `@defer` + incremental hydration is the most production-ready approach to lazy list hydration today. While it doesn't achieve per-item granularity automatically, developers can explicitly wrap list items (or groups of items) in `@defer(on viewport)` blocks to achieve viewport-based lazy hydration. The event replay system (`jsaction`) ensures no user interactions are lost during deferred hydration.

This is a pragmatic tradeoff: the developer explicitly marks hydration boundaries rather than the framework automatically determining them (Marko) or serializing everything for on-demand resumption (Qwik).

---

## Open Research Directions

### Per-Item Lazy Hydration Without Full Serialization

The holy grail: hydrate individual list items on demand without serializing the entire reactive graph. This would require:
1. Item boundary information in the HTML (markers or metadata)
2. Per-item state that can be reconstructed from the DOM alone (or minimal serialization)
3. A way to wire reactive bindings to adopted DOM nodes

No framework fully achieves this today. The closest is Marko 6's compiler approach, which eliminates the need for runtime hydration of static items entirely.

### DOM-Reusing First Mutation (Semantic UI's Strategy D)

The approach outlined in the existing `each-hydration.md` -- O(1) hydration cost, then adopt server DOM on first mutation -- is unique in the landscape. No surveyed framework uses this exact strategy. It avoids the upfront cost of full hydration AND the serialization cost of resumability by deferring reactive setup to the moment it's actually needed, while preserving DOM nodes to avoid layout thrash.

This is closest to Solid's approach (fine-grained reactivity + keyed reconciliation) but with the key difference that Solid wires all reactive bindings during hydration, while Strategy D defers them until first mutation.

### Reactive Graph Serialization

Solid 2.0 and Qwik both point toward serializing the reactive dependency graph. The open question is the serialization format -- Qwik uses a monolithic JSON block, while the Solid team is exploring more granular approaches. The "Resumability without Serialization" research direction suggests that the server's knowledge of what depends on what could be encoded more efficiently than full state serialization.

### Compiler-Driven Boundary Detection

Marko 6 demonstrates that a sufficiently smart compiler can determine hydration boundaries at build time. This eliminates runtime overhead entirely but requires:
- A DSL (not arbitrary JS) for templates
- Cross-module analysis
- A specialized bundler integration

This approach could theoretically be applied to any template-based framework with a compilation step.

---

## Relevance to Semantic UI

Semantic UI's position is interesting because it already has:

1. **A template compiler** that can analyze template structure at build time
2. **Fine-grained reactivity** (signals) that could theoretically be serialized
3. **Server-rendered HTML with block markers** (`<!--sui-block:v1:{id}-->`) at the each-block level
4. **The Strategy D design** which is novel in the landscape -- no surveyed framework uses lazy DOM adoption on first mutation

The proposed per-item comment markers (`<!--sui-item:{i}-->`) would put Semantic UI's server HTML closer to Qwik's virtual node markers but with much lower overhead (simple index comments vs. Qwik's full ID/key/props references).

The Strategy D approach from `each-hydration.md` is particularly well-positioned relative to the state of the art:

| | Qwik | Marko 6 | Solid | Svelte 5 | **SUI Strategy D** |
|---|---|---|---|---|---|
| Hydration cost | O(1) | O(1)* | O(N*K) | O(N*K) | **O(1)** |
| First mutation cost | O(1) per item | O(1)* | O(diff) | O(diff) | **O(N*K) reactions, O(1) DOM** |
| HTML overhead | High (serialized graph) | Low (compiler) | Low (markers) | Low (markers) | **Low (item markers)** |
| JS bundle overhead | Low (lazy) | Lowest (eliminated) | Full | Full | **Full** |

*Marko's O(1) is achieved by eliminating the code entirely for static lists, not by deferring work.

The key insight from this survey: **Strategy D occupies an unoccupied point in the design space** -- zero hydration cost without the serialization overhead of resumability or the compiler complexity of Marko's approach. The tradeoff (O(N*K) reaction setup on first mutation) is acceptable because DOM creation (not reaction setup) dominates mutation cost, and Strategy D avoids all DOM creation for unchanged items.

---

## References

### Framework Documentation
- [Solid.js Hydration Docs](https://docs.solidjs.com/reference/rendering/hydrate)
- [Svelte Hydratable Data Docs](https://svelte.dev/docs/svelte/hydratable)
- [Qwik Resumability Docs](https://qwik.dev/docs/concepts/resumable/)
- [Marko Homepage](https://markojs.com/)
- [Vue Vapor Roadmap](https://github.com/vuejs/core/issues/13687)
- [Angular Hydration Guide](https://angular.dev/guide/hydration)
- [Angular Incremental Hydration Guide](https://angular.dev/guide/incremental-hydration)
- [React 19 Release](https://react.dev/blog/2024/12/05/react-19)
- [Preact SSR Guide](https://preactjs.com/guide/v10/server-side-rendering/)

### Key Articles and Discussions
- [Why Efficient Hydration in JavaScript Frameworks is so Challenging](https://dev.to/this-is-learning/why-efficient-hydration-in-javascript-frameworks-is-so-challenging-1ca3) -- Ryan Carniato
- [Conquering JavaScript Hydration](https://dev.to/this-is-learning/conquering-javascript-hydration-a9f) -- Ryan Carniato
- [Hydration is Pure Overhead](https://www.builder.io/blog/hydration-is-pure-overhead) -- Misko Hevery (Qwik)
- [Resumability without Serialization](https://hackmd.io/@0u1u3zEAQAO0iYWVAStEvw/Hyu_IZQq2)
- [Resumability, WTF?](https://dev.to/this-is-learning/resumability-wtf-2gcm) -- Ryan Carniato

### Implementation PRs and RFCs
- [Svelte single-pass hydration PR #12335](https://github.com/sveltejs/svelte/pull/12335)
- [Vue Vapor hydration PR #13226](https://github.com/vuejs/core/pull/13226)
- [Angular Incremental Hydration RFC #57664](https://github.com/angular/angular/discussions/57664)
- [Solid Road to 2.0 Discussion #2425](https://github.com/solidjs/solid/discussions/2425)
- [Preact Hydration 2.0 RFC #4442](https://github.com/preactjs/preact/issues/4442)
- [Towards Qwik 2.0](https://www.builder.io/blog/qwik-2-coming-soon)
- [Marko: Compiling Fine-Grained Reactivity](https://dev.to/ryansolid/marko-compiling-fine-grained-reactivity-4lk4)
