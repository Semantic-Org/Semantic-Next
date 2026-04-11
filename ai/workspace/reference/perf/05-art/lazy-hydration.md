# State of the Art: Lazy, Deferred, and Partial Hydration (2024-2026)

A survey of hydration strategies across modern web frameworks, with analysis of tradeoffs, the "component API before hydration" problem, and future directions.

---

## Table of Contents

1. [Taxonomy of Hydration Strategies](#taxonomy)
2. [Qwik — Resumability](#qwik)
3. [Astro — Islands Architecture](#astro)
4. [Next.js / React — Selective Hydration + Server Components](#nextjs)
5. [Nuxt / Vue — Built-in Lazy Hydration](#nuxt)
6. [Angular — Incremental Hydration + @defer](#angular)
7. [Marko — Compiler-Automated Islands + Resumability](#marko)
8. [SolidJS / SolidStart — Fine-Grained Reactive Hydration](#solid)
9. [Google Wiz / Aurora — Event Contract + JSAction](#wiz)
10. [Cross-Cutting Analysis](#analysis)
11. [Implications for Semantic UI](#implications)

---

<a name="taxonomy"></a>
## 1. Taxonomy of Hydration Strategies

The industry has converged on four distinct families:

| Strategy | Core Idea | Frameworks | JS on Load |
|---|---|---|---|
| **Full Hydration** | Re-execute all component logic on client | React (pre-18), Vue 2, Svelte (pre-kit) | O(n) all components |
| **Selective/Progressive** | Hydrate components based on priority or trigger | React 18+, Nuxt 3.16+, Angular 19+ | O(k) visible/interactive |
| **Islands** | Only ship JS for interactive "islands"; rest is static HTML | Astro, Marko 5, Fresh (Deno) | O(k) islands only |
| **Resumability** | Serialize execution state; resume on interaction, never re-execute | Qwik, Marko 6 | O(1) per interaction |

The key insight across all approaches: **the cost of hydration is not just the time spent, but the fact that it blocks interactivity**. Every framework is trying to either eliminate, defer, or prioritize that blocking window.

---

<a name="qwik"></a>
## 2. Qwik — Resumability

**Strategy:** Resumable (zero-hydration)

### How It Works

Qwik's core thesis, articulated by Misko Hevery in ["Hydration is Pure Overhead"](https://www.builder.io/blog/hydration-is-pure-overhead), is that traditional hydration re-executes work already done on the server. Qwik eliminates this entirely:

1. **Server serializes everything.** Component boundaries, event listener locations, reactive subscriptions, and application state are all serialized into the HTML as attributes and a JSON block.
2. **No JS executes on load.** The page is interactive immediately because event listeners are encoded as HTML attributes (e.g., `on:click="chunk.js#handler"`).
3. **Lazy handler loading.** When the user actually clicks a button, Qwik loads the minimal chunk containing that handler, deserializes the necessary state from the DOM, and executes it. This is O(1) — cost scales with the interaction, not the page size.
4. **Framework state is a map, not a tree.** As Misko puts it: ["Hydration is a tree, Resumability is a map"](https://www.builder.io/blog/hydration-tree-resumability-map). The framework can resume any component independently without walking the tree.

### Component API Before Hydration

**Qwik sidesteps this problem entirely.** There is no "before hydration" / "after hydration" distinction. Component state is always available (serialized in DOM), and methods execute on demand via lazy loading. The mental model is that the application is always "hydrated" — it just hasn't loaded the handler code yet.

However, this requires **DOM-centric architecture**: developers must write applications such that state lives in the DOM (serialized), not in JS heap closures. This is a fundamental constraint — you cannot have arbitrary JS objects as component state; everything must be serializable.

### Limitations and Tradeoffs

- **HTML size overhead.** Serialized state, component boundaries, and listener attributes add non-trivial bytes to the HTML. Qwik 2.0 addresses this by moving non-human-readable data to the end of the HTML stream.
- **Serialization constraints.** State must be JSON-serializable. No functions, no class instances, no circular references in state. Developers must write "DOM-centric" rather than "heap-centric" code.
- **Ecosystem size.** Qwik's ecosystem is small compared to React/Vue. Component libraries, tooling, and community resources are limited.
- **Cold-start latency.** The first interaction requires a network round-trip to load the handler chunk. Qwik mitigates this with speculative prefetching via service workers, but it's still a real cost on slow networks.
- **Developer mental model shift.** The `$` suffix convention (e.g., `component$`, `useTask$`) marks serialization boundaries. This is a learning curve and a potential source of bugs when developers forget which code runs where.

### Qwik 2.0 (In Development, 2025-2026)

- More efficient virtual node encoding (smaller HTML)
- All non-human-readable data moved to end of HTML stream (faster first paint)
- Lazier resumption algorithm — only materialize virtual nodes needed for the specific interaction
- No breaking API changes planned
- Focus on community ecosystem (Qwik UI component library approaching beta)

**Key Sources:**
- [Qwik Resumability Docs](https://qwik.dev/docs/concepts/resumable/)
- [Towards Qwik 2.0: Lighter, Faster, Better](https://www.builder.io/blog/qwik-2-coming-soon)
- [Qwik 2.0 Explained](https://www.guvi.in/blog/qwik-2-0-explained/)
- [Resumability vs Hydration](https://www.builder.io/blog/resumability-vs-hydration)
- [Qwik in 2025](https://www.learn-qwik.com/blog/qwik-2025/)

---

<a name="astro"></a>
## 3. Astro — Islands Architecture

**Strategy:** Island-based partial hydration (opt-in per component)

### How It Works

Astro renders the entire page as static HTML on the server. Interactive components are explicitly marked with **client directives** that control when (or if) they hydrate:

| Directive | Behavior |
|---|---|
| `client:load` | Hydrate immediately on page load |
| `client:idle` | Hydrate when browser reaches idle state (`requestIdleCallback`) |
| `client:visible` | Hydrate when component enters viewport (`IntersectionObserver`) |
| `client:media` | Hydrate when a CSS media query matches |
| `client:only` | Skip SSR entirely, render only on client |
| (no directive) | Never hydrate — pure static HTML, zero JS |

Each island hydrates **independently and in parallel**. A slow island doesn't block a fast one. The framework enforces component isolation: islands cannot share state directly (they communicate via custom events, shared stores, or URL state).

### Server Islands (Astro 5.0+, December 2024)

Astro 5.0 introduced **Server Islands** via the `server:defer` directive, extending the islands concept to the server:

- A `server:defer` component renders a **placeholder/fallback** during the initial page response
- After the page loads, a separate request fetches the island's HTML from the server
- The placeholder is replaced with the real content
- Props are passed as an encrypted query string; results are cacheable via `Cache-Control`

This is for **dynamic server content** (user avatars, shopping carts, personalized recommendations) that shouldn't block the static shell from loading. It's the inverse of client islands: instead of deferring JS hydration, it defers server rendering.

### Component API Before Hydration

**Astro avoids this problem through architecture.** Islands are self-contained; there's no framework-level mechanism for one island to call methods on another. If a component isn't hydrated, it's static HTML — there's no API surface to call. Cross-island communication happens through:

- Browser-native APIs (custom events, `BroadcastChannel`)
- Shared reactive stores (`nanostores`)
- URL/query parameters

This means the "component API before hydration" problem is designed away by making islands isolated. The tradeoff is that complex inter-component coordination patterns (parent-child component APIs, imperative `.show()` / `.hide()` methods) require explicit architectural decisions.

### Limitations and Tradeoffs

- **Framework-agnostic but not framework-free.** Each island can use a different framework (React, Vue, Svelte, Solid), but each brings its own runtime. Multiple frameworks = multiple runtimes.
- **Inter-island communication is manual.** No built-in mechanism for islands to share state or call each other's methods. This is by design but adds friction for complex UIs.
- **MPA by default.** Astro is fundamentally an MPA framework. Client-side navigation exists (View Transitions) but is opt-in and has limitations compared to SPA frameworks.
- **Not ideal for highly interactive apps.** When most of the page is interactive, the island overhead (isolation boundaries, separate hydration) can exceed the cost of full hydration.

### Recent and Future Developments

- **Cloudflare acquisition** (January 2026): Astro team joined Cloudflare; Astro 6 beta rebuilt dev server on `workerd` runtime
- **Astro 6 beta** (February 2026): New dev server, Live Content Collections for real-time data
- Typical Astro page ships **0-15KB JS** vs 85-250KB for equivalent Next.js page
- Highest Lighthouse score (99.2) among tested frameworks in independent benchmarks

**Key Sources:**
- [Astro Islands Architecture Docs](https://docs.astro.build/en/concepts/islands/)
- [Astro Server Islands](https://astro.build/blog/future-of-astro-server-islands/)
- [Astro Directives Reference](https://docs.astro.build/en/reference/directives-reference/)
- [Astro Framework Guide 2026](https://alexbobes.com/programming/a-deep-dive-into-astro-build/)
- [Astro Island Architecture Demystified](https://softwaremill.com/astro-island-architecture-demystified/)

---

<a name="nextjs"></a>
## 4. Next.js / React — Selective Hydration + Server Components

**Strategy:** Selective hydration with priority scheduling + RSC boundary elimination

### How It Works

React's hydration strategy has evolved through three distinct phases:

**Phase 1 — Full Hydration (React 17 and earlier):** All-or-nothing. The entire component tree re-executes on the client. This is the "classic" hydration that Misko Hevery criticized.

**Phase 2 — Selective Hydration (React 18):** Introduced with `<Suspense>` boundaries. React can:
- Start hydrating before the entire JS bundle loads
- Prioritize hydrating components the user is interacting with
- Interrupt hydration of one subtree to handle a higher-priority interaction
- Hydrate independent subtrees in parallel

**Phase 3 — RSC + Streaming (React 19 / Next.js 14+):** Server Components never hydrate at all. They render on the server, produce HTML + a serialized "RSC payload", and the client only hydrates `"use client"` boundaries. This is structurally similar to islands — Server Components are the static ocean, Client Components are the interactive islands.

### Event Replay Before Hydration

React 18+ implements sophisticated event replay:

1. **Discrete events** (click, keypress): Trigger synchronous hydration of the enclosing `<Suspense>` boundary. If the boundary's code is ready, React hydrates it immediately and replays the event. If not, React **increases the priority** of that boundary so it hydrates first when code arrives.
2. **Continuous events** (mouseover, pointerover, focusin): The last event of each type is rebroadcast after hydration using native `event.dispatch`, preserving `stopPropagation` and capture phase behavior.
3. **Priority scheduling**: Hydration runs as a low-priority task during browser idle periods. User interactions bump the priority of the relevant subtree.

### Component API Before Hydration

React's approach is **"eventually available with priority boost."** Before hydration:
- Server-rendered HTML is visible and occupies the correct layout space
- Refs are `null`; imperative handles (`useImperativeHandle`) are unavailable
- Event handlers attached in JSX don't fire (but events are captured and replayed)
- `useEffect` hasn't run; state is the server-rendered initial value

The key mitigation: if the user interacts with an unhydrated component, React immediately prioritizes hydrating that subtree. The user experiences a brief delay (the time to hydrate that boundary), but the interaction is not lost. This is "interaction-triggered priority hydration" — not lazy hydration per se, but adaptive scheduling.

### Limitations and Tradeoffs

- **No true partial hydration.** React still hydrates `"use client"` subtrees eagerly (or on interaction via Suspense). There's no `hydrate="lazy"` or `hydrate="visible"` directive.
- **RSC requires full buy-in.** The Server Component / Client Component boundary is a compilation boundary. You can't gradually adopt it — it restructures your entire component architecture.
- **Bundle size.** React's runtime is ~40KB+ min+gzip. Even with RSC eliminating Server Component code, the framework overhead is significant.
- **Hydration mismatch errors.** When server and client HTML differ, React throws hydration errors. These are notoriously difficult to debug.
- **Streaming requires infrastructure.** Streaming SSR needs a runtime that supports HTTP streaming (Node.js, Deno, edge runtimes). Static hosting can't use it.

### Future Direction (2025-2026)

- **View Transitions API** integration in React 19 — declarative route transitions with `<ViewTransition>` component
- Ongoing work on **Server Actions** for mutations without client-side JS
- Wix reported **40% faster interaction** using selective hydration + Suspense in production
- No fundamental change to hydration model planned; improvements are incremental (better scheduling, smaller runtime)

**Key Sources:**
- [React 18 Selective Hydration Discussion](https://github.com/reactwg/react-18/discussions/130)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Mastering Hydration in React 19](https://dev.to/melvinprince/mastering-hydration-in-react-19-the-ultimate-guide-to-faster-smarter-rendering-46ep)
- [Wix: 40% Faster Interaction with Selective Hydration](https://www.wix.engineering/post/40-faster-interaction-how-wix-solved-react-s-hydration-problem-with-selective-hydration-and-suspen)
- [Selective Hydration Pattern](https://www.patterns.dev/react/react-selective-hydration/)

---

<a name="nuxt"></a>
## 5. Nuxt / Vue — Built-in Lazy Hydration

**Strategy:** Trigger-based lazy hydration (built into Vue 3 core + Nuxt integration)

### How It Works

Vue 3.5+ added built-in lazy hydration strategies at the framework level. Nuxt 3.16+ exposes these through the `defineLazyHydrationComponent` macro and component-level configuration:

| Strategy | Vue API | Trigger |
|---|---|---|
| Visible | `hydrateOnVisible` | `IntersectionObserver` (configurable rootMargin) |
| Idle | `hydrateOnIdle` | `requestIdleCallback` (configurable timeout) |
| Interaction | `hydrateOnInteraction` | click, mouseover, focusin (configurable events) |
| Media Query | `hydrateOnMediaQuery` | `window.matchMedia` |
| Never | `hydrateNever` | Component never hydrates on client |

These strategies work at the component level. The server renders full HTML; the client decides per-component when to download and execute the component's JS.

### Component API Before Hydration

Nuxt's approach creates an interesting middle ground:

- **Template refs** (`ref="myComponent"`) return the DOM element, not the component instance, before hydration
- **Exposed methods** (via `defineExpose`) are unavailable until hydration triggers
- **Props** are reactive; setting a prop before hydration queues the value for when hydration occurs
- **Events** emitted by child components before hydration are **lost** (no event replay)
- The `@hydrated` event fires when a lazy component completes hydration, allowing parent coordination

The documentation explicitly warns: use dynamic imports (not lazy hydration) when the component doesn't need SSR. Use lazy hydration when the component needs server rendering for SEO but its JS can be delayed.

### Limitations and Tradeoffs

- **No event replay.** Unlike Angular and React, Vue/Nuxt does not capture and replay user events that occur before hydration. If a user clicks a `hydrateOnVisible` component before it's visible (e.g., via keyboard navigation or programmatic scroll), the click is lost.
- **No imperative API before hydration.** `$refs` point to DOM elements, not component instances. Calling `this.$refs.modal.show()` before hydration fails.
- **Granularity is per-component.** You can't defer hydration of part of a component's template (unlike Angular's `@defer` which can defer a template block).
- **Manual coordination required.** If component B depends on component A being hydrated, you must wire up `@hydrated` events yourself.

### Future Direction

- Vue's lazy hydration is now a **stable, first-class feature** (not experimental)
- Nuxt 4 (in development) continues to refine lazy hydration with better DX
- Server Components in Nuxt (experimental) follow the React pattern of eliminating hydration for non-interactive components entirely

**Key Sources:**
- [Nuxt defineLazyHydrationComponent v4](https://nuxt.com/docs/4.x/api/utils/define-lazy-hydration-component)
- [Nuxt Components Directory v4](https://nuxt.com/docs/4.x/directory-structure/app/components)
- [Vue School: Lazy Hydration and Server Components in Nuxt](https://vueschool.io/articles/vuejs-tutorials/lazy-hydration-and-server-components-in-nuxt-vue-js-3-performance/)
- [Nuxt Lazy Hydration PR #26468](https://github.com/nuxt/nuxt/pull/26468)

---

<a name="angular"></a>
## 6. Angular — Incremental Hydration + @defer

**Strategy:** Trigger-based incremental hydration integrated with deferrable views and event replay

### How It Works

Angular's approach is the most architecturally complete solution for trigger-based lazy hydration. It builds on three pillars:

**Pillar 1 — @defer blocks (Angular 17+):** Template-level lazy loading boundaries. Unlike component-level lazy hydration, `@defer` can wrap any template fragment:

```html
@defer (on viewport; hydrate on interaction) {
  <heavy-component [data]="items" />
} @placeholder {
  <lightweight-skeleton />
} @loading {
  <spinner />
} @error {
  <error-message />
}
```

**Pillar 2 — Incremental Hydration (Angular 19.2+, March 2025):** The `hydrate` trigger on `@defer` blocks tells Angular to **server-render the real content** (not the placeholder) but defer client-side hydration until the trigger fires:

| Trigger | Behavior |
|---|---|
| `hydrate on idle` | Hydrate when browser is idle |
| `hydrate on viewport` | Hydrate when block enters viewport (IntersectionObserver) |
| `hydrate on interaction` | Hydrate on click/keydown within the block |
| `hydrate on hover` | Hydrate on mouseenter/focusin |
| `hydrate on immediate` | Hydrate immediately (useful for critical interactive content) |
| `hydrate on timer(5s)` | Hydrate after a delay |
| `hydrate never` | Never hydrate (static SSR content) |

The key nuance: **hydration triggers and rendering triggers are separate.** `on viewport` controls when the *client-rendered* version loads. `hydrate on interaction` controls when the *server-rendered* version hydrates. On initial SSR load, hydrate triggers apply. On subsequent client-side navigations, regular triggers apply.

**Pillar 3 — Event Replay via JSAction (from Google Wiz):**

This is the battle-tested piece. JSAction has been used in Google Search, YouTube, and Google Photos for over a decade:

1. A **tiny inline script** (~1KB) is injected before application content
2. It installs **global event handlers** for delegatable event types (click, keydown, focusin, etc.)
3. Events that fire on unhydrated content **bubble up to the global handler and are queued**
4. HTML attributes like `jsaction="click:;"` mark elements that have deferred handlers
5. When the relevant `@defer` block hydrates, its event listeners are attached and **queued events are replayed in order**

This means: **no user interaction is ever lost.** If a user clicks a button inside an unhydrated `@defer` block, the click triggers hydration of that block AND the click event fires on the now-hydrated component.

### Component API Before Hydration

Angular's answer is the most nuanced:

- **Template bindings** are server-rendered and correct visually. Property bindings reflect the server-rendered state.
- **Component class instances** do not exist before hydration. `@ViewChild` queries return `undefined`.
- **Event handlers** are captured by JSAction and replayed. The user never notices the gap.
- **Services injected via DI** are available only after hydration of the component that uses them.
- **The `@defer` block structure** provides an explicit boundary: code inside `@defer` has clear lifecycle semantics. Code outside `@defer` hydrates normally.

The architectural insight: Angular separates "what the user sees" (server-rendered HTML) from "what the user can do" (event handlers) from "what the developer can access" (component instances). JSAction bridges the first two; `@defer` boundary semantics handle the third.

### Limitations and Tradeoffs

- **JSAction script overhead.** The inline event delegation script adds ~1KB to every page. For pages with no deferred content, this is wasted.
- **Complexity.** Three interacting systems (@defer, hydration triggers, event replay) create a large API surface and many possible configurations. Debugging interactions between them is non-trivial.
- **NgModule dependencies can't be deferred.** Only standalone components work with @defer. Legacy NgModule-based components are eagerly included.
- **Still requires full component hydration.** When a `@defer` block hydrates, it hydrates the entire subtree — there's no fine-grained "hydrate just this binding" option.
- **Incremental hydration was developer preview until Angular 19.2** (March 2025). Still maturing.

### Future Direction

- Incremental hydration became **stable in Angular 19.2** (March 2025)
- Angular 20 (expected 2025) likely to refine trigger APIs and add more granular control
- Ongoing convergence with Google Wiz framework: more battle-tested patterns flowing into Angular

**Key Sources:**
- [Angular Incremental Hydration Guide](https://angular.dev/guide/incremental-hydration)
- [Angular Hydration Guide](https://angular.dev/guide/hydration)
- [RFC: Incremental Hydration](https://github.com/angular/angular/discussions/57664)
- [Event Dispatch in Angular (JSAction)](https://blog.angular.dev/event-dispatch-in-angular-89d868d2351c)
- [Angular and Wiz Are Better Together](https://blog.angular.dev/angular-and-wiz-are-better-together-91e633d8cd5a)
- [Push-Based: Incremental Hydration Introduction](https://push-based.io/article/incremental-hydration-in-angular-introduction-part-1-3)

---

<a name="marko"></a>
## 7. Marko — Compiler-Automated Islands + Resumability

**Strategy:** Compiler-determined partial hydration with streaming SSR, moving toward resumability in Marko 6

### How It Works

Marko is unique because the **compiler decides what is an island**, not the developer. The Marko compiler statically analyzes components to determine:

- Which components are **stateful** (have reactive state, event handlers) → these become islands, shipped to the client
- Which components are **stateless** (pure rendering, no interactivity) → these are server-only, zero JS on the client

This means headers, footers, navigation, and display-only components **automatically** produce zero client-side JS. Only forms, buttons with handlers, and genuinely interactive components ship code.

Additionally, Marko's compiler can **prune** parts of a component's template that are static, serializing only the dynamic bindings. This is more granular than component-level hydration — it's binding-level hydration.

### Streaming SSR

Marko pioneered **out-of-order streaming**: the server sends HTML as it becomes available, and async components stream in when their data resolves. The initial HTML shell arrives instantly; slow data sources fill in progressively. This predates React's streaming SSR by years — eBay has used it in production since Marko 4.

### Component API Before Hydration

Marko's compiler-automated approach means:

- **No imperative component API exists by design.** Marko components don't expose `.show()` / `.hide()` methods. Interactions are declarative (state changes via events).
- **State is serialized into the HTML** (similar to Qwik's resumability approach in Marko 6).
- **Cross-component communication** uses events and shared state, not imperative method calls.

The "component API before hydration" problem is **designed out of existence** by making components communicate declaratively rather than imperatively.

### Marko 6 (In Development)

Marko 6 represents a major architectural leap, combining:

- **Fine-grained compiled reactivity** — a hybrid of Svelte's compiler approach and Solid's fine-grained signals
- **Resumability** — similar to Qwik, serializing reactive graph state for zero-cost resumption
- **Smallest bundles in independent benchmarks** — 28.8 KB compressed for a full board app (31% smaller than SolidStart at 41.5 KB)
- **FLUURT engine** — the internal name for Marko 6's reactive compilation strategy

### Limitations and Tradeoffs

- **eBay-centric ecosystem.** Marko is primarily developed for and used by eBay. Community adoption is small.
- **Compiler magic.** The automatic island detection is powerful but opaque. When the compiler makes the wrong decision, debugging is difficult.
- **Marko 6 has been in development for years.** The ambition is high but release timeline has been long.
- **Template syntax diverges from HTML.** Marko's syntax (`.marko` files) is unique and unfamiliar to most developers.

**Key Sources:**
- [Marko: Compiling Fine-Grained Reactivity (Ryan Solid)](https://dev.to/ryansolid/marko-compiling-fine-grained-reactivity-4lk4)
- [eBay Marko Performance Reactivity Model (InfoQ)](https://www.infoq.com/articles/ebay-marko-performance-reactivity-model/)
- [Marko Official Site](https://markojs.com/)
- [FLUURT: Re-inventing Marko](https://dev.to/ryansolid/fluurt-re-inventing-marko-3o1o)
- [Marko 6 Compiler Article Examples](https://gist.github.com/ryansolid/874f026ab4330ec3270c9386de9a62f5)

---

<a name="solid"></a>
## 8. SolidJS / SolidStart — Fine-Grained Reactive Hydration

**Strategy:** Fine-grained reactive hydration with island exploration in SolidStart 2.0

### How It Works

Solid's hydration is fundamentally different from React/Vue because of **fine-grained reactivity**:

1. **No virtual DOM diffing.** Solid compiles templates to real DOM operations. Hydration doesn't rebuild a VDOM tree — it walks the existing DOM and attaches reactive subscriptions directly to DOM nodes.
2. **Per-binding granularity.** Each reactive binding (`{count()}`) gets a direct DOM subscription. When `count` changes, only that specific text node or attribute updates. There's no component re-render.
3. **No component instances.** Solid components are functions that run once (during hydration) to set up reactive subscriptions. They don't re-execute on state changes. This means "component API" in the React sense doesn't exist.

### SolidStart and Islands

SolidStart (the full-stack meta-framework) has been exploring islands architecture:

- Solid 1.6 backfilled partial hydration primitives into core
- SolidStart has worked with Astro, Iles, and Solitude for island rendering
- **SolidStart 2.0** (alpha since February 2026) is rebuilding on pure Vite (removing Vinxi dependency)

### The Road to Solid 2.0

The [Solid 2.0 roadmap discussion](https://github.com/solidjs/solid/discussions/2425) outlines three steps:
1. Shape different compiled outputs to generate the same reactive graph
2. Add **reactive graph serialization** (precursor for resumability)
3. Implement **reactive graph restoration** during hydration

This means Solid 2.0 is moving toward Qwik-style resumability but with Solid's fine-grained reactive model. Instead of resuming component trees, it would resume individual reactive subscriptions.

### Component API Before Hydration

Solid's model is most similar to Marko's:
- Components are setup functions, not persistent instances
- There's no `el.component.doSomething()` pattern
- Cross-component communication uses signals/stores (reactive state) and context
- Refs point to DOM elements, which exist before hydration

### Limitations and Tradeoffs

- **Islands in SolidStart are experimental.** The islands router was explored but is not the default architecture.
- **Solid 2.0 is pre-alpha.** The reactive graph serialization is a roadmap item, not shipping.
- **Smaller ecosystem** than React/Vue, though growing rapidly.
- **No event replay mechanism.** Events during hydration gap are lost.

**Key Sources:**
- [The Road to Solid 2.0](https://github.com/solidjs/solid/discussions/2425)
- [The State of Solid.js in 2026](https://listiak.dev/blog/the-state-of-solid-js-in-2026-signals-performance-and-growing-influence)
- [SolidStart Docs](https://docs.solidjs.com/solid-start)
- [SolidStart Islands Discussion](https://github.com/solidjs/solid-start/discussions/730)

---

<a name="wiz"></a>
## 9. Google Wiz / Aurora — Event Contract + JSAction

**Strategy:** Event delegation with deferred handler loading (production-proven at Google scale)

### How It Works

Wiz is Google's **internal** web framework, powering Google Search, YouTube, Google Photos, and most consumer-facing Google web apps. Its hydration strategy is the origin of Angular's JSAction integration:

1. **JSAction** is a tiny event delegation library (~1KB) that registers global handlers at the document root
2. HTML elements are annotated with `jsaction` attributes that map events to handler names: `jsaction="click:handleAddToCart"`
3. When a user interacts, JSAction captures the event and stores it in an **Event Contract** queue
4. The framework lazily loads the handler code, then replays the queued events
5. This has been **battle-tested for over a decade** across Google's highest-traffic properties

### Google Aurora

The Chrome Aurora team partners with open-source frameworks to improve Core Web Vitals. Their contributions to hydration:

- Collaborated with Angular team on SSR + hydration (leading to Angular's full hydration in v16, incremental in v19)
- Published research on framework INP (Interaction to Next Paint) performance
- Advocated for progressive hydration patterns in Next.js, Nuxt, Angular
- The Aurora team doesn't build a framework — they influence existing ones through engineering partnerships

### Component API Before Hydration

Wiz's approach: **there is no component API in the traditional sense.** Wiz uses declarative templates and event delegation. Component state is managed through services and stores, not through imperative component methods. The event contract ensures no user interaction is lost, and the lazy handler loading means code only loads when needed.

### Relevance to Semantic UI

The JSAction pattern is the most directly applicable to Semantic UI's situation:
- It solves the "event before hydration" problem without changing the component model
- It's a small, inline script that works independently of the framework
- It's proven at massive scale (Google Search)
- Angular's adoption of it validates the pattern for the broader ecosystem

**Key Sources:**
- [JSAction GitHub](https://github.com/google/jsaction)
- [Event Dispatch in Angular (from Wiz)](https://blog.angular.dev/event-dispatch-in-angular-89d868d2351c)
- [Angular and Wiz Are Better Together](https://blog.angular.dev/angular-and-wiz-are-better-together-91e633d8cd5a)
- [Aurora Update 2023](https://developer.chrome.com/en/blog/aurora-update-2023)
- [How Frameworks Perform on INP](https://developer.chrome.com/docs/aurora/inp-in-frameworks)

---

<a name="analysis"></a>
## 10. Cross-Cutting Analysis

### The "Component API Before Hydration" Problem

This is the fundamental tension in lazy hydration. Every framework handles it differently:

| Framework | Approach | Events Lost? | Imperative API Available? |
|---|---|---|---|
| **Qwik** | No hydration needed; state is in DOM | No (handlers load on demand) | Yes (lazy-loaded) |
| **Astro** | Islands are isolated; no cross-island API | N/A (no deferred hydration) | N/A |
| **React/Next.js** | Priority boost on interaction; Suspense boundaries | No (event replay) | No (refs null until hydration) |
| **Nuxt/Vue** | `@hydrated` event for coordination | Yes (no event replay) | No (refs are DOM elements) |
| **Angular** | JSAction captures and replays all events | No (event replay via JSAction) | No (ViewChild undefined) |
| **Marko** | No imperative API by design | No (automatic islands) | N/A (declarative only) |
| **Solid** | Signals/stores for cross-component comms | Yes (no event replay) | N/A (no component instances) |
| **Wiz/Google** | JSAction event contract, lazy handler loading | No (event contract) | N/A (service-based) |

**The clear winner for event handling before hydration is JSAction/Event Contract.** Three frameworks (Wiz, Angular, and by extension React's event replay) implement some form of this pattern. The key insight: **capture events at the document level, queue them, replay after hydration.** This completely eliminates the "lost click" problem.

**The imperative API problem has no universal solution.** Frameworks that expose imperative component APIs (`el.component.show()`, React refs + `useImperativeHandle`) cannot make these available before hydration without either:
1. Eager hydration (defeats the purpose)
2. Auto-hydration on API access (unpredictable, hidden performance cliffs)
3. Promise-based async API (`await el.whenHydrated()`) — breaks synchronous call sites
4. Designing the API to be declarative instead of imperative (the Qwik/Marko/Solid approach)

### Event Replay Implementations Compared

| Feature | Angular (JSAction) | React 18+ | Qwik |
|---|---|---|---|
| Inline script size | ~1KB | Part of React runtime | Part of Qwik loader (~1KB) |
| Event types | All delegatable (click, keydown, focusin, etc.) | Discrete + continuous | All via global listener |
| Replay timing | After @defer block hydrates | After Suspense boundary hydrates | Immediate (handler loads on demand) |
| Priority boosting | Yes (hydrate trigger) | Yes (interaction bumps priority) | N/A (no hydration queue) |
| Battle-tested | 10+ years at Google | Since React 18 (2022) | Since Qwik 1.0 (2023) |

### Hydration Cost Comparison

| Framework | Initial JS | Time to Interactive | Hydration Model |
|---|---|---|---|
| Qwik | ~1KB (loader only) | Instant (resumable) | O(1) per interaction |
| Astro | 0-15KB (islands only) | Per-island, parallel | O(k) islands |
| Marko | 28.8KB compressed (full app) | Streaming + partial | O(k) stateful components |
| Next.js/React | 85-250KB | Selective, priority-based | O(n) client components |
| Angular | Varies | Incremental via @defer | O(n) minus @defer blocks |
| Nuxt/Vue | 40-100KB | Trigger-based per-component | O(k) non-deferred components |
| SolidStart | 41.5KB compressed | Fine-grained, per-binding | O(n) bindings |

### The Spectrum: From "Hydrate Everything" to "Hydrate Nothing"

```
Full Hydration ──── Selective ──── Progressive ──── Islands ──── Resumability
   React 17          React 18       Nuxt/Angular     Astro        Qwik/Marko 6
   Vue 2             Next.js 14+    Vue 3.5+         Fresh
                                                     Marko 5

← More JS on load                                    Less JS on load →
← Simpler mental model                               More complex mental model →
← Full API always available                           API may not exist yet →
← Higher TTI                                          Lower TTI →
```

### Key Industry Trends (2024-2026)

1. **Event replay is becoming table stakes.** Angular adopted JSAction from Wiz. React has had it since 18. Any framework doing lazy hydration without event replay is leaving user interactions on the floor.

2. **Compiler-driven optimization is the frontier.** Marko 6, Solid 2.0, and Svelte 5 all use compilers to determine hydration boundaries. This removes the burden from developers and enables more granular optimization than manual island boundaries.

3. **Server Islands complement client islands.** Astro's `server:defer` and Next.js's RSC show that deferral works in both directions — defer client JS (client islands) AND defer server rendering (server islands). The two are complementary.

4. **Resumability is theoretically optimal but practically constrained.** Qwik proves the concept works, but the serialization constraints, HTML size overhead, and ecosystem limitations mean it hasn't achieved mainstream adoption. Marko 6 and Solid 2.0 are exploring resumability with different tradeoff profiles.

5. **The convergence point is "per-component opt-in with event replay."** Angular's `@defer(hydrate on ...)` + JSAction is the most complete implementation of this pattern. Nuxt's `defineLazyHydrationComponent` is similar but lacks event replay. React's Suspense + selective hydration is similar but less explicit.

---

<a name="implications"></a>
## 11. Implications for Semantic UI

### What This Means for Our Architecture

Semantic UI's situation is unique because it uses **web components with Declarative Shadow DOM** — a fundamentally different rendering target than any of the surveyed frameworks. Our specific challenges:

1. **`el.component` is our imperative API surface.** Parent components call `el.component.show()`, `$('ui-modal').component().hide()`, etc. This is the exact pattern that lazy hydration breaks.

2. **DSD gives us free "islands" at the browser level.** Every web component with a `<template shadowrootmode="open">` is already an island — the browser renders it without JS. We get Astro-like instant rendering for free from the platform.

3. **Our rAF deferral already solves the paint problem.** The existing architecture defers hydration by one animation frame, giving the browser time to paint DSD content before JS executes. This is equivalent to `client:idle` or `hydrateOnIdle` in other frameworks.

4. **No event replay exists.** Events during the rAF deferral window are lost. For most components this doesn't matter (one frame is ~16ms), but for lazy hydration it becomes critical.

### What We Could Adopt

**Tier 1 — Low risk, high value (from existing lazy-hydration.md analysis):**
- **rAF batching with yielding**: Split hydration across frames to preserve interactivity. This is the safe version of progressive hydration that preserves all contracts.
- **Hydration speed optimization**: Cache `_hydrationEntries`, optimize `hydrateMarkers`, potentially WASM for string operations. This reduces the window where the API problem exists.

**Tier 2 — Medium risk, worth investigating:**
- **Event capture during hydration gap**: A lightweight JSAction-inspired script that captures events on unhydrated components and replays them post-hydration. This is ~1KB of inline JS and solves the "lost click" problem without changing any component APIs.
- **Opt-in lazy hydration via `hydration: 'lazy'`** in `defineComponent`: Component authors explicitly choose deferred hydration, accepting that `el.component` is unavailable until triggered. The trigger model (visible/idle/interaction) mirrors Angular's `@defer` and Nuxt's `defineLazyHydrationComponent`.

**Tier 3 — High ambition, long-term:**
- **Compiler-determined hydration boundaries**: Like Marko, analyze `createComponent` return values at build time to determine which components are interactive vs display-only. Display-only components get cheaper/deferred hydration automatically.
- **Reactive graph serialization**: Like Solid 2.0's roadmap, serialize signal state into the HTML so hydration can skip state initialization. This is a step toward resumability without the full Qwik serialization model.

### What We Should NOT Adopt

- **Full resumability (Qwik-style)**: Requires rewriting the entire component model to be DOM-centric. Our signal-based reactivity and `createComponent` pattern are heap-centric by design. The retrofit cost is astronomical.
- **Framework-agnostic islands (Astro-style)**: We ARE the framework. Our components aren't islands in a static ocean — they're a coordinated system with parent-child relationships, shared context, and imperative APIs.
- **Automatic island detection without escape hatches**: Marko's compiler magic works because Marko controls the entire template syntax. Our spec system and `createComponent` pattern have enough variation that heuristic detection would produce false positives.

---

## Summary Table

| Framework | Strategy | Event Replay | Component API Before Hydration | Maturity |
|---|---|---|---|---|
| Qwik | Resumability | N/A (no hydration) | Always available (lazy-loaded) | Production, small ecosystem |
| Astro | Islands | N/A (isolated) | N/A (no cross-island API) | Production, large ecosystem |
| React/Next.js | Selective + RSC | Yes (Suspense) | Refs null; priority boost | Production, dominant ecosystem |
| Nuxt/Vue | Trigger-based lazy | No | Refs are DOM; @hydrated event | Stable since 3.16 |
| Angular | @defer + JSAction | Yes (JSAction) | ViewChild undefined; events replayed | Stable since 19.2 |
| Marko | Compiler islands | N/A (automatic) | N/A (declarative only) | Production at eBay |
| Solid | Fine-grained reactive | No | N/A (no instances) | Experimental (2.0 roadmap) |
| Wiz/Google | Event contract | Yes (JSAction) | N/A (service-based) | 10+ years at Google scale |

---

*Last updated: April 2026*
*Research conducted across web searches, framework documentation, GitHub discussions, and conference talks from 2024-2026.*
