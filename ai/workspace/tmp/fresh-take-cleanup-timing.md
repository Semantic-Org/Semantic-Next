## Task: Evaluate timing strategies for cosmetic DOM cleanup in web component hydration

Read all source files listed below before answering. Evaluate the current code, not git history.

### Architecture Overview

This is a web component framework that renders server-side using Declarative Shadow DOM (DSD). The browser parses DSD before JavaScript loads, giving instant visual rendering. When JS loads, each component's `connectedCallback` detects the existing shadow root and hydrates — wiring reactive bindings to the server-rendered DOM.

The server embeds comment markers in the shadow root at dynamic positions (text expressions, block directive boundaries). During hydration, the client walks these markers to locate binding positions. Individual hydration handlers remove their own markers as they process them (replacing comments with text nodes, DynamicRegion anchors, etc.). After the main hydration walk completes, some markers may remain — orphaned entries, markers for binding types not handled by the walker, closing block markers at certain nesting levels.

A separate cleanup pass runs after hydration to remove these remaining markers. This pass uses a TreeWalker over the entire shadow root, collecting and removing all comments that match the framework's marker prefixes.

### Key Facts

- The cleanup pass costs ~6ms for a component with 1000 items (~26% of total hydration time)
- The markers are inside shadow roots — they are invisible to end users and do not affect layout, rendering, or event handling
- The markers are visible in browser DevTools when inspecting the shadow root — this is a developer experience concern
- The markers are also visible in `fetch()` responses of the HTML — they are part of the serialized DSD
- The cleanup is purely cosmetic — no functional behavior depends on whether orphan markers are present or absent
- The framework already defers the entire hydration itself by one `requestAnimationFrame` in `connectedCallback` (so the browser can paint the DSD content first)
- Each component hydrates independently (shadow DOM scoping — no cross-component marker coordination)
- A typical page has 20-50 components, each with their own shadow root and markers
- The `connectedCallback` currently batches all hydrations into a single rAF — they run sequentially in one frame

### The Cleanup Function

`removeMarkers()` in `base.js` creates a `TreeWalker(shadowRoot, SHOW_COMMENT)`, collects all comments starting with `sui` or `/sui`, then calls `.remove()` on each. This is a full traversal of the shadow root's DOM tree — the same tree that `hydrateMarkers` just walked.

### Questions — Evaluate Independently

**Question 1:** What are the different timing strategies for running cosmetic DOM cleanup in a web component after hydration? For each strategy, describe the mechanism, what it optimizes for, and what the tradeoffs are. Consider the full spectrum from synchronous to maximally deferred.

**Question 2:** `requestIdleCallback` is one option for deferring low-priority work. What are the concrete behaviors and edge cases of `requestIdleCallback` in modern browsers? Consider: deadline budget, starvation under load, behavior when the tab is backgrounded, fallback for browsers that don't support it, interaction with `requestAnimationFrame`, and whether it's appropriate for DOM mutations.

**Question 3:** The cleanup involves DOM mutations (removing comment nodes from shadow roots). Are there any risks or constraints around performing DOM mutations inside `requestIdleCallback`? Consider: layout thrashing, mutation observer triggers, interaction with the framework's own reactive system, and whether removing comment nodes can cause visible reflow or repaint.

**Question 4:** The framework defers hydration itself by one rAF. If cleanup is also deferred, there are now two deferred tiers (rAF for hydration, then something else for cleanup). What are the architectural implications of layered deferral? Consider: debugging complexity, the window where markers are visible in DevTools, ordering guarantees, and what happens if a developer inspects the component between hydration and cleanup.

### Source Files to Read
- `packages/component/src/engines/native/base.js` — WebComponentBase: connectedCallback, hydrate, removeMarkers
- `packages/renderer/src/engines/native/renderer.js` — Renderer: hydrateMarkers, hydrateTextExpression, hydrateBlockDirective (to see which markers are already removed inline)
