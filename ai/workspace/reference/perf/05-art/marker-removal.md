# Art of Marker Removal: How Frameworks Handle Hydration Markers

Survey of hydration marker strategies across modern web frameworks. Focus on marker types, cleanup timing, and the emerging consensus (or lack thereof) on whether markers should be removed at all.

## Executive Summary

Frameworks split into three camps:

1. **Markers left permanently in the DOM** -- Solid.js, Lit, Vue (fragment comments). These frameworks treat comment markers as runtime infrastructure, not temporary scaffolding. The comments serve as anchors for future reactive updates.

2. **Markers removed after hydration** -- Angular (removes `ngh` attributes and unclaimed DOM nodes after app stabilizes), Svelte 5 (removes comments during single-pass hydration). These frameworks treat markers as temporary hydration scaffolding.

3. **Markers relocated or eliminated architecturally** -- Qwik 2.0 (moves all marker data to a `<script type="qwik/vnode">` at end of document, eliminating inline comments entirely), Marko 6 (compiler-driven fine-grained splitting eliminates most markers at build time).

The trend line is clear: frameworks are moving away from inline comment markers toward either compile-time elimination or end-of-document serialization. But the "leave them in" camp has a defensible position -- if comments serve as reactive update anchors, removing them requires replacing them with something else.

---

## Framework-by-Framework Analysis

### Solid.js

**Marker type:** HTML comments (`<!--$-->`, `<!--/$-->`, `<!--#-->`)

**Format evolution:** Solid originally used `#`-prefixed comments but switched to `$`-prefixed markers because some CDN/server tools (e.g., Cloudflare) interpret `#` in comments as special directives.

**Cleanup behavior: Comments are left permanently in the DOM.** Solid's hydration system uses comment markers as persistent anchors for matching DOM nodes with reactive computations. The markers define boundaries for fragments, Show/Switch conditionals, and dynamic components. Since Solid's reactivity is fine-grained (individual DOM node bindings, not component-level diffs), the comments serve as the only stable reference points for regions that may produce zero, one, or many DOM nodes.

**Why they stay:** Solid doesn't use a virtual DOM, so there's no reconciliation tree that "knows" where things are. Comment nodes ARE the bookkeeping. Removing them would require an alternative boundary tracking mechanism.

**Open work:**
- [Solid 2.0 Discussion](https://github.com/solidjs/solid/discussions/2425) -- the road to 2.0 includes hydration improvements but no explicit plan to remove comment markers.
- [DeepWiki: Hydration System](https://deepwiki.com/solidjs/solid/5.2-hydration) -- confirms the three-part architecture: marker-based node identification, serialization layer, context management.
- Performance improvements in 1.8+ avoid redundantly setting attributes/props during hydration, but markers remain.

**Relevance to SUI:** Solid's approach validates keeping anchors for unsafeHTML and dynamic regions. The key insight is that if a comment serves as a future update anchor, it's not debris -- it's infrastructure.

---

### Svelte 5

**Marker type:** HTML comments (`<!--[-->` and `<!--]-->` for block boundaries)

**Format constraints:** The Svelte team tried using `<!>` (shortest possible comment) in the Svelte 5 alpha, but users complained it broke third-party HTML parsers. Reverted to standard comments.

**Cleanup behavior: Comments are removed during hydration as a single-pass walk.** Rich Harris implemented [single-pass hydration (PR #12335)](https://github.com/sveltejs/svelte/pull/12335) that processes and removes markers in the same DOM walk. The key optimization: `nextSibling` calls were identified as the most expensive part of hydration, so the single-pass approach minimizes traversals.

Some markers remain by necessity:
- Closing anchors for `<svelte:element>` (needed when element goes from falsy to truthy)
- Anchors for empty blocks that need future insertion points

**Payload size controversy:** Svelte 5 generates significantly more hydration markers than Svelte 4. Two major issues:
- [Issue #14099](https://github.com/sveltejs/svelte/issues/14099) -- Hydration markers cause 18% increase in HTML payload (5.7KB -> 6.8KB for a minimal app). Rich Harris acknowledged gzip mitigates this but the uncompressed size increase is real.
- [Issue #15200](https://github.com/sveltejs/svelte/issues/15200) -- "Excessive hydration markers" with ~25 markers between nodes in some cases. Users hit CMS payload limits.
- [Astro #13732](https://github.com/withastro/astro/issues/13732) -- SSR-only Svelte components still emit hydration markers even when they'll never hydrate.

**Why they're needed:** As Rich Harris explained: if components are just text (or start/end with text), text nodes get "glued together" by the HTML parser. Comment boundaries prevent this coalescence. Additionally, most Svelte features (components, logic blocks) use anchors -- a node that rendered content will be inserted before -- and comments are the only option when no natural DOM node exists.

**Active optimization work:**
- [PR #15417](https://github.com/sveltejs/svelte/pull/15417) -- improve hydration comments for `$props.id`
- [PR #11770](https://github.com/sveltejs/svelte/pull/11770) -- earlier single-pass hydration prototype
- Ongoing investigation into reducing marker count where they're provably unnecessary

**Relevance to SUI:** Svelte's experience validates that (a) inline removal during the hydration walk is the right approach (our Option B), and (b) the text-node coalescence problem means SOME markers can never be removed if they serve as separators.

---

### Qwik (1.x and 2.0)

**Marker type (1.x):** HTML comments for virtual node boundaries (`<!--qv q:key=H1_0-->`, `<!--t=8-->123<!---->`), plus `q:` attributes on elements (`q:id`, `q:sref`, `q:key`) for state serialization and event binding.

**Marker type (2.0): Inline comments eliminated entirely.** All virtual node data moved to `<script type="qwik/vnode">` at the end of the document. The `q:` attributes on elements are also reduced.

**Cleanup behavior: N/A -- Qwik doesn't hydrate.** Qwik's core innovation is resumability: the framework serializes the complete application state (component boundaries, signal bindings, event listener locations) into the HTML, then "resumes" on the client by lazily deserializing only what's needed. No replay, no re-execution, no marker cleanup pass.

**The Qwik 2.0 revolution:** The most significant architectural change in this survey.
- [Blog: Towards Qwik 2.0](https://www.builder.io/blog/qwik-2-coming-soon) -- "Move all non-human readable data to the end of the HTML stream"
- Comment nodes removed from inline HTML entirely
- Virtual node data encoded in `<script type="qwik/vnode">` at document end
- Benefits: cleaner HTML reaches browser faster (browser can start rendering before hitting metadata), tree-shaking of unused virtual node references, smaller total payload
- Signal bindings encoded in the vnode script, allowing updates without downloading component code

**Security note:** Qwik 1.x had a [security vulnerability (GHSA-m6jq-g7gq-5w3c)](https://github.com/QwikDev/qwik/security/advisories/GHSA-m6jq-g7gq-5w3c) where SSR comment content for virtual components concatenated attribute names/values without escaping. Moving to `<script>` serialization in 2.0 sidesteps this class of vulnerability.

**Relevance to SUI:** Qwik 2.0's "move metadata to the end" pattern is the most radical rethinking here. It's not directly applicable to SUI's Shadow DOM architecture (each component's markers are scoped to its shadow root, not the document), but the principle -- separate human-visible content from framework bookkeeping -- is worth noting for the Rust/WASM SSR phase where the server could order output strategically.

---

### Marko 6

**Marker type:** HTML comments for component boundaries (start/end markers wrapping rendered output), plus a serialization script for component state.

**Cleanup behavior: Compiler-driven elimination.** Marko 6's key innovation is that the compiler analyzes the reactive graph at build time and splits components into fine-grained pieces. The compiler knows exactly which expressions are dynamic, where they're used, and where they change. This means:
- Static subtrees need no markers at all -- the compiler proves they'll never update
- Only expressions that actually change on the client get hydration markers
- The parent component can determine at compile time whether a child needs client-side code

**Resumable hydration:** Marko 6 aims for resumable hydration similar to Qwik but achieved through compilation rather than runtime serialization. The framework skips re-executing computations and derivations in the browser when unrelated data changes.

**Serialization performance:** Marko 6's custom serializer is reported at [up to 6x faster than devalue](https://dev.to/ryansolid/marko-compiling-fine-grained-reactivity-4lk4), the serialization library used by SvelteKit and others.

**Key references:**
- [Marko: Compiling Fine-Grained Reactivity](https://dev.to/ryansolid/marko-compiling-fine-grained-reactivity-4lk4) (Ryan Solid's analysis)
- [FLUURT: Re-inventing Marko](https://dev.to/ryansolid/fluurt-re-inventing-marko-3o1o) -- the internal codename for Marko 6's architecture
- [Talking Points for Marko](https://hackmd.io/@markojs/BkW3fIze2)

**Relevance to SUI:** Marko's compile-time approach to marker elimination is the most interesting for SUI's future. SUI's template compiler already has AST-level knowledge of which expressions are static vs dynamic. In theory, the server renderer could skip markers for expressions that the compiler proves are constant. This is a Phase 2+ optimization but the architecture supports it.

---

### Lit (2.x / 3.x)

**Marker type:** HTML comments (`<!--lit-part-->`, `<!--lit-part HASH-->`, `<!--lit-node N-->`, `<!--/lit-part-->`)

**Cleanup behavior: Comments are left permanently in the DOM.** Lit's comment markers are structural -- they define "part" boundaries that the template system uses for incremental updates. The `hydrate()` function walks the DOM looking for these markers, uses them to re-establish the internal data structures (ChildParts, AttributeParts, etc.), and then leaves them in place because they're needed for subsequent `render()` calls.

**Server-only templates:** Lit provides `serverTemplate` / render options that omit hydration markers entirely, producing smaller output. But this content cannot be hydrated -- it's purely static. This is useful for full-document rendering (email templates, static pages).

**Key references:**
- [Lit SSR Client Usage](https://lit.dev/docs/ssr/client-usage/) -- official docs on hydration
- [Option to omit lit-part comments](https://lightrun.com/answers/lit-lit-ssr-option-to-omit---lit-part---comments) -- community discussion
- [Lit SSR Overview](https://www.mintlify.com/lit/lit/ssr/overview)
- [lit/lit Discussion #2092](https://github.com/lit/lit/discussions/2092) -- Native HTMLElement SSR support discussion

**Architecture note:** Lit's markers are anchored around "coarse-grained chunks of static content rather than individual nodes." This is fundamentally different from SUI's native renderer which uses fine-grained per-expression markers. Lit needs fewer comments but each one carries more structural weight.

**Relevance to SUI:** This is the framework SUI is replacing. Lit's approach of permanently retaining markers is functional but creates DevTools noise. SUI's native renderer was designed specifically to avoid this -- the plan to remove markers after hydration is a deliberate improvement over Lit's behavior. The key lesson: if you're going to remove markers, you must handle the unsafeHTML anchor case (which Lit sidesteps by never removing anything).

---

### Preact

**Marker type:** Multiple strategies depending on context:
- `<script type="application/hydration-marker" data-id="N">` -- script tags as markers (don't render, don't disrupt layout)
- HTML comments (`<!-- $s -->`, `<!-- /$s -->`) for async/streaming boundaries
- No markers for simple cases -- Preact's diffing algorithm can often match nodes positionally

**Cleanup behavior: Comments are actively removed during hydration.** Preact treats HTML comments as obstacles. When DOM contains nodes the VDOM doesn't expect, they're removed. There's a [known issue](https://lightrun.com/answers/preactjs-preact-hydration-removes-and-add-nodes-again-when-there-are-html-comments-just-before-them) where Preact unnecessarily removes AND re-adds DOM nodes after encountering comments -- the fix is to remove comments while preserving the remaining DOM.

**Hydration 2.0 RFC:**
- [RFC #4442](https://github.com/preactjs/preact/issues/4442) -- major hydration redesign for Preact 11
- Core problem: the system doesn't know what content a suspended node will produce (null, 1 node, or many nodes). Markers with boundary-specific DOM child counts allow the system to reduce excess DOM children as Suspense boundaries resolve.
- [Preact 11 Beta](https://www.infoq.com/news/2025/09/preact-11-beta/) introduces Hydration 2.0 with support for components returning zero or multiple nodes during hydration

**Relevance to SUI:** Preact's script-tag-as-marker approach is interesting -- `<script type="...">` nodes are invisible to rendering and don't cause text-node coalescence. However, they have layout implications in some contexts and aren't valid inside `<table>`, `<select>`, etc. Not suitable for SUI's general-purpose Shadow DOM context.

---

### Vue / Vapor Mode

**Marker type:** HTML comments (`<!--[-->` and `<!--]-->`) for fragment boundaries. Elements get `data-v-*` scoping attributes for CSS but these aren't hydration markers per se.

**Cleanup behavior: Fragment comments are left in the DOM.** Vue uses comment nodes as anchors for fragments (multi-root components) and v-if/v-for boundaries. The `hydrateFragment` function locates the `<!--[-->` start marker, hydrates children, and validates the closing `<!--]-->` exists. Both markers remain as the vnode's `anchor` references.

**Vue Vapor Mode (3.6 beta):**
- [Vue 2025 Review](https://vueschool.io/articles/news/vue-js-2025-in-review-and-a-peek-into-2026/) -- Vapor Mode is feature-complete in 3.6 beta but considered unstable
- Eliminates the Virtual DOM entirely -- compile-time optimizations produce direct DOM operations
- Integrates with partial hydration -- only interactive parts hydrate, static parts remain untouched
- The marker strategy for Vapor hasn't been fully documented yet, but the compile-time approach should reduce marker requirements similar to Marko's strategy

**Key reference:** [DeepWiki: Vue Hydration](https://deepwiki.com/vuejs/core/7.2-hydration)

**Relevance to SUI:** Vue's fragment comments serve the exact same purpose as SUI's block markers. The difference is SUI removes block markers during hydration (replacing them with DynamicRegion anchors), while Vue keeps them permanently. SUI's approach is cleaner for DevTools but requires the hydrateBlockDirective to correctly transfer ownership.

---

### Angular

**Marker type:** Dual system:
- `ngh` attributes on component host elements -- hydration state reference linking the component to its serialized state
- `<!--ng...-->` HTML comments -- view container anchors used by both hydration and normal rendering
- `jsaction` attributes -- event delegation markers for `@defer(hydrate on ...)` incremental hydration blocks

**Cleanup behavior: Post-hydration cleanup removes unclaimed nodes and `ngh` attributes, but comment anchors persist.** Angular's cleanup is triggered by Zone.js stability signal -- once the app reports stable, Angular runs post-hydration cleanup on the client to remove DOM nodes that remained "unclaimed" (not matched to any component during hydration). The `ngh` attributes are removed. But `<!--ng-->` comment nodes persist because they're used as view container anchors during normal rendering, not just hydration.

**Incremental hydration (Angular 19+):**
- `@defer(hydrate on interaction)` / `@defer(hydrate on viewport)` -- components hydrate lazily based on triggers
- [Issue #60373](https://github.com/angular/angular/issues/60373) -- `@defer` blocks keep app unstable, delaying hydration cleanup. Active issue as of 2025.
- `ngSkipHydration` attribute to opt components out entirely

**Key references:**
- [Angular Hydration Guide](https://angular.dev/guide/hydration)
- [Angular 2025 Strategy](https://blog.angular.dev/angular-2025-strategy-9ca333dfc334)
- [Incremental Hydration Deep Dive](https://medium.com/@genyklemberg/angular-incremental-hydration-deep-dive-debugging-tips-ab4fe44164bf)

**Important constraint:** Angular's docs explicitly warn: "If you have custom logic to remove comment nodes from the HTML generated by SSR, or your CDN is configured to remove them, you should disable the comment nodes removal." CDN/proxy stripping of HTML comments is a real-world failure mode.

**Relevance to SUI:** Angular's split approach (remove attribute markers, keep comment anchors) is closest to what SUI's Option B proposes. The Zone.js stability-signal pattern is also interesting -- SUI could defer cleanup to `requestAnimationFrame` or `updateComplete` if synchronous cleanup proves too costly, though the analysis in `remove-markers.md` shows inline removal is preferred.

---

## Comparison Matrix

| Framework | Marker Type | Removed After Hydration? | Removal Timing | Functional Anchors Kept? | Active Improvement Work |
|-----------|------------|-------------------------|----------------|------------------------|------------------------|
| **Solid.js** | Comments (`<!--$-->`) | No -- permanent | N/A | Yes (all markers are anchors) | Solid 2.0 discussion |
| **Svelte 5** | Comments (`<!--[-->`) | Yes -- during hydration walk | Single-pass (synchronous) | Some closing anchors remain | PR #12335, #15417; Issues #14099, #15200 |
| **Qwik 1.x** | Comments + `q:` attrs | N/A (resumable, no hydration) | N/A | N/A | Replaced by Qwik 2.0 |
| **Qwik 2.0** | `<script type="qwik/vnode">` | Comments eliminated architecturally | N/A | N/A | Shipping in 2.0 beta |
| **Marko 6** | Comments (reduced) | Compiler eliminates most | Build time | Minimal set for dynamic | FLUURT compiler |
| **Lit** | Comments (`<!--lit-part-->`) | No -- permanent | N/A | Yes (all markers are part anchors) | Server-only template option |
| **Preact** | Comments + script tags | Yes -- removed during hydration | Synchronous during diff | No | RFC #4442, Preact 11 |
| **Vue** | Comments (`<!--[-->`) | No -- permanent | N/A | Yes (fragment anchors) | Vapor mode (3.6 beta) |
| **Angular** | `ngh` attrs + `<!--ng-->` comments | Attrs: yes. Comments: no | Post-stability signal | Comments persist as view anchors | Incremental hydration (@defer) |

---

## Key Insights

### 1. The "anchor vs scaffolding" distinction is the fundamental design choice

Frameworks that keep markers treat them as **anchors** -- persistent reference points for future reactive updates. Frameworks that remove markers treat them as **scaffolding** -- temporary structure needed only during hydration setup.

The distinction maps directly to reactivity model:
- **Fine-grained reactivity** (Solid, Vue) tends to keep markers because individual DOM positions need stable references
- **Component-level reactivity** (Angular, Preact) tends to remove attribute markers because the component tree provides references
- **Compile-time reactivity** (Svelte, Marko) can remove markers because the compiler generates code that captures references during the hydration walk

### 2. Comment markers are a liability in production HTML

Multiple frameworks have faced issues:
- Svelte's 18% payload increase
- Angular's CDN stripping warning
- Qwik's XSS vulnerability through comment injection
- Lit's DevTools noise complaints

The industry trend is toward minimizing or eliminating inline comments. Qwik 2.0's approach (move everything to an end-of-document script) and Marko 6's approach (eliminate at compile time) represent the frontier.

### 3. Text-node coalescence is the hard constraint

Rich Harris's observation applies universally: when two text nodes are adjacent in HTML with nothing between them, the HTML parser merges them into one. If a framework needs to later split them (because they're bound to different expressions), a separator is required. Comments are the only HTML construct that:
- Don't render visually
- Don't affect layout
- Are valid in any element context (unlike `<script>`)
- Prevent text-node coalescence

This is why even frameworks that "remove markers" often keep a few -- they're solving a parser-level constraint, not a framework-level one.

### 4. The single-pass pattern is converging

Both Svelte 5 and the SUI Option B proposal independently arrived at the same architecture: remove markers during the hydration walk itself, not in a separate pass. This eliminates redundant DOM traversal. Svelte's data shows `nextSibling` calls are the dominant cost in hydration, which aligns with SUI's finding that the second TreeWalker costs ~6ms / ~26% of the hydration budget.

### 5. Shadow DOM changes the calculus

Most frameworks operate in the light DOM where markers from one component are visible to parent/child components and to DevTools at the page level. SUI's Shadow DOM scoping means:
- Markers in one component's shadow root are invisible to other components
- DevTools noise is contained (you only see markers when inspecting a specific shadow root)
- CDN stripping of comments won't affect shadow root content (it's in `<template shadowrootmode="open">`)
- Each component's hydration walk is independent -- no cross-component marker coordination needed

This makes the "leave anchors, remove scaffolding" approach especially clean for SUI. The unsafeHTML anchors that must persist are hidden in shadow roots, not polluting the page-level DOM.

---

## Implications for Semantic UI

The existing analysis in `remove-markers.md` (Option B: inline removal during hydrateMarkers) is validated by industry practice:

1. **Svelte 5 converged on the same pattern** -- single-pass hydration that removes markers during the walk. SUI's Option B is not novel but it is correct.

2. **The unsafeHTML anchor exception is correct** -- Solid and Lit both permanently retain functional anchors. The distinction between "scaffolding markers" (remove) and "anchor markers" (keep) is the industry consensus.

3. **The RAW_TEXT_MARKER gap is a real bug** -- frameworks that DO remove markers (Svelte, Preact) handle ALL marker types in a single pass. The fact that SUI's hydration walker doesn't match RAW_TEXT_MARKER is a gap, not a design choice.

4. **Post-hydration cleanup is an antipattern** -- Angular is the only framework that defers cleanup (via Zone.js stability), and they have [active issues with it](https://github.com/angular/angular/issues/60373). Every other framework that removes markers does so synchronously during hydration. SUI should not consider the rAF/idle callback approach.

5. **Future optimization: compile-time marker elimination** -- Marko 6's approach of using the compiler to prove which expressions are static could be applied to SUI's template compiler. Static expressions need no hydration marker at all -- the server can inline the value and the client never needs to wire a Reaction. This is orthogonal to Option B but would reduce the marker count before hydration even starts.

---

## Sources

### Solid.js
- [DeepWiki: Hydration System](https://deepwiki.com/solidjs/solid/5.2-hydration)
- [Solid Docs: hydrate](https://docs.solidjs.com/reference/rendering/hydrate)
- [Solid 2.0 Discussion](https://github.com/solidjs/solid/discussions/2425)

### Svelte 5
- [Issue #14099: Hydration markers cause increase in document size](https://github.com/sveltejs/svelte/issues/14099)
- [Issue #15200: Excessive hydration markers](https://github.com/sveltejs/svelte/issues/15200)
- [PR #12335: Single-pass hydration](https://github.com/sveltejs/svelte/pull/12335)
- [PR #11770: Single-pass hydration (earlier prototype)](https://github.com/sveltejs/svelte/pull/11770)
- [PR #15417: Improve hydration comments for $props.id](https://github.com/sveltejs/svelte/pull/15417)
- [Astro #13732: SSR-only Svelte component retains hydration markers](https://github.com/withastro/astro/issues/13732)

### Qwik
- [Qwik Docs: Resumable](https://qwik.dev/docs/concepts/resumable/)
- [Blog: Towards Qwik 2.0](https://www.builder.io/blog/qwik-2-coming-soon)
- [Qwik Docs: Towards Qwik 2.0](https://qwik.dev/blog/qwik-2-coming-soon/)
- [Security Advisory: GHSA-m6jq-g7gq-5w3c](https://github.com/QwikDev/qwik/security/advisories/GHSA-m6jq-g7gq-5w3c)

### Marko 6
- [Marko: Compiling Fine-Grained Reactivity (Ryan Solid)](https://dev.to/ryansolid/marko-compiling-fine-grained-reactivity-4lk4)
- [FLUURT: Re-inventing Marko](https://dev.to/ryansolid/fluurt-re-inventing-marko-3o1o)
- [Talking Points for Marko](https://hackmd.io/@markojs/BkW3fIze2)

### Lit
- [Lit SSR Client Usage](https://lit.dev/docs/ssr/client-usage/)
- [Lit SSR Overview](https://www.mintlify.com/lit/lit/ssr/overview)
- [Option to omit lit-part comments](https://lightrun.com/answers/lit-lit-ssr-option-to-omit---lit-part---comments)
- [Discussion #2092: Native HTMLElement SSR support](https://github.com/lit/lit/discussions/2092)

### Preact
- [RFC #4442: Hydration 2.0](https://github.com/preactjs/preact/issues/4442)
- [Preact 11 Beta: Hydration 2.0](https://www.infoq.com/news/2025/09/preact-11-beta/)
- [Hydration Design Documentation](https://github.com/preactjs/preact/wiki/Hydration-Design-Documentation)
- [Hydration removes and re-adds nodes after comments](https://lightrun.com/answers/preactjs-preact-hydration-removes-and-add-nodes-again-when-there-are-html-comments-just-before-them)

### Vue / Vapor
- [DeepWiki: Vue Hydration](https://deepwiki.com/vuejs/core/7.2-hydration)
- [Vue 2025 Review and Peek into 2026](https://vueschool.io/articles/news/vue-js-2025-in-review-and-a-peek-into-2026/)
- [Vue Vapor: Goodbye Virtual DOM](https://www.blueshoe.io/blog/vue-vapor-performance-without-virtual-dom/)

### Angular
- [Angular Hydration Guide](https://angular.dev/guide/hydration)
- [Angular 2025 Strategy](https://blog.angular.dev/angular-2025-strategy-9ca333dfc334)
- [Issue #60373: Defer keeps app unstable, cleanup delayed](https://github.com/angular/angular/issues/60373)
- [Incremental Hydration Deep Dive](https://medium.com/@genyklemberg/angular-incremental-hydration-deep-dive-debugging-tips-ab4fe44164bf)
- [Incremental Hydration Introduction](https://push-based.io/article/incremental-hydration-in-angular-introduction-part-1-3)

### General
- [Why Efficient Hydration in JavaScript Frameworks is so Challenging](https://dev.to/this-is-learning/why-efficient-hydration-in-javascript-frameworks-is-so-challenging-1ca3)
- [Resumability without Serialization](https://hackmd.io/@0u1u3zEAQAO0iYWVAStEvw/Hyu_IZQq2)
