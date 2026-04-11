# SSR Hydration Session — Post-Mortem

**Date:** 2026-03-31
**Agent:** Claude Opus 4.6 (1M context)
**Session duration:** ~6 hours of active work

## What Was Accomplished

### Framework Bugs Fixed (5 real bugs)
1. **Block marker depth matching** — The hydration sibling walk matched wrong closing markers when inner scopes reused IDs. Fundamental fix.
2. **Inner content attribute hydration AST** — `hydrateAttributes` used the wrong AST for nested content. Threaded the correct AST through.
3. **Snippet data Proxy ownKeys** — Missing `ownKeys` trap caused snippet variables to be invisible to the JS expression evaluator's spread. Fixed ternary expression failures.
4. **renderToString missing settings** — `createComponent` received `settings: undefined` during SSR. Simple one-liner.
5. **Tooltip onDestroyed null reference** — Set $tooltip to null before calling .remove() on it. Logic ordering bug.

### Astro Integration Improvements
- **Complex props serialization** — JSON `<script data-ssr-props>` inside DSD template for arrays/objects
- **Attribute serialization cleanup** — Skip non-serializable objects instead of rendering `[object Object]`

### Component Fixes
- **Button template typo** — `{/snipppet}` → `{/snippet}`
- **Nav-menu string menu handling** — Defensive JSON.parse for string menu values

### Test Infrastructure
- **44 ladder steps** covering every SSR pattern from static HTML to 4-level deep nesting
- **20 doc pages verified** with zero console errors
- **721 renderer tests** still passing

## What Remains — The Big Unsolved Problem

### Recursive Nested Component SSR

**The problem:** When a component's template contains another custom element (e.g., nav-menu renders `<ui-icon>`), the ServerRenderer outputs the inner element as a raw HTML tag with no shadow DOM. On the server, `<ui-icon icon="book">` becomes just that literal string — no DSD `<template>` is injected inside it. With JavaScript disabled, these inner components are empty/unstyled.

**Why it's hard:** The ServerRenderer works with an AST → HTML string pipeline. Custom element tags appear as plain HTML nodes (`{ type: 'html', html: '<ui-icon ...' }`). By the time the renderer sees them, they're just strings. There's no hook point to say "this is a component, render its shadow DOM too."

**How Lit solved it:** `@lit-labs/ssr` uses a SAX-like streaming renderer that walks the output and when it encounters a custom element tag, creates a `LitElementRenderer` for it. The recursive rendering is deeply integrated into the streaming architecture — it's not a post-processing step.

**What the fix likely needs:**
1. A server-side component registry that maps tag names → component definitions
2. A post-processing pass on the rendered HTML that finds custom element tags and injects their DSD
3. OR: intercept at the AST level when the template compiler produces `<ui-icon>` tags, recognizing them as component references rather than raw HTML

**My attempt and why it was wrong:** I started adding a `serverComponentRegistry` Map to `defineComponent`. The user correctly stopped me — `defineComponent` runs on both client and server, and I was about to add a global Map that accumulates entries in both environments. I needed to think more carefully about:
- Where the registry lives (server-only module? renderer option? Astro integration?)
- How it's populated (import-time side effect? explicit registration? automatic from customElements.define?)
- How it flows to the ServerRenderer (constructor option? global? thread through render calls?)

The right approach is probably: the Astro integration builds the registry from the components it knows about (since it's the one calling `renderToStaticMarkup`), and passes it to the ServerRenderer as an option. This keeps the registry scoped to the SSR context without polluting the client.

## What I Wish I Did Better

### 1. Should have studied the Lit SSR integration more deeply before starting

The `@lit-labs/ssr` LitElementRenderer and the Astro lit integration's `server.js` had the answers for recursive rendering, property serialization, and defer-hydration. I rediscovered many patterns that already existed there. I should have started by reading both files completely and mapping out what each feature does.

### 2. Should have identified the nested component problem earlier

I spent significant time fixing hydration bugs that only manifested because JS was enabled and components were hydrating. With JS disabled (as the user eventually suggested), the nested rendering gap would have been immediately obvious. Testing with JS disabled first would have shown the true SSR output and prioritized the right work.

### 3. The ladder was great, but I over-indexed on it

The ladder was perfect for isolating hydration bugs in controlled environments. But it only tested `renderToString` (which renders a SINGLE component). It never tested the Astro integration's `renderToStaticMarkup` path, which is what real doc pages use. I should have added Astro-specific ladder steps earlier.

### 4. Attribute serialization was a known-solvable problem

The `[object Object]` attribute issue was obvious and I fixed it late. The Lit integration's pattern of checking `isReactiveProperty` / `isReflectedReactiveProperty` was right there in the code I read. I should have ported that pattern immediately.

### 5. The Proxy trap debugging took too long

I spent significant context tracing through the expression evaluator for the `titlefalse` bug. The systematic approach would have been: check server output (correct) → check client output after hydration (correct) → check client output after re-render (wrong) → diff the data contexts. Instead I speculated about multiple possible causes before narrowing down.

## Recommended Next Steps (for the next agent)

### Priority 1: Recursive nested component SSR

This is THE remaining blocker. The approach:

1. **Study `@lit-labs/ssr` LitElementRenderer** — understand its streaming architecture and `elementRenderers` pattern
2. **Build the fix in the Astro integration**, not in the core ServerRenderer. The Astro `server.js` already has access to all imported components
3. **Post-process the rendered HTML**: after `renderer.render()`, scan for custom element tags, look them up, render their DSD, inject it
4. **Handle attribute → props conversion**: nested elements get attributes from the parent template. These need to be parsed into props for the child's `renderToStaticMarkup`
5. **Test with the ladder**: add a step that explicitly checks nested component DSD output

### Priority 2: Verify `serializeAttributes` uses the property system

The current fix skips objects, which is correct. But ideally it should use `converter.toAttribute` from the property config (the Lit pattern). Need to verify the converters exist and work.

### Priority 3: The mobile-menu sidebar visual issue

The 3 nav-menus inside mobile-menu's dialog leak visually on some pages. This is CSS, not SSR — the dialog content should be hidden.

### Priority 4: Icon style attribute multi-line issue

`getIconStyle()` returns CSS with newlines that the HTML parser splits into separate attributes. Fix the function to return single-line CSS, or quote the attribute value properly in the server renderer.

## Key Files to Read

- `docs/node_modules/@semantic-ui/astro-lit/server.js` — Lit SSR integration (the reference implementation)
- `docs/node_modules/@semantic-ui/astro-lit/dist/client.js` — Lit client hydration entrypoint
- `internal-packages/astro/server.js` — Native SSR integration (what needs the recursive fix)
- `packages/renderer/src/engines/native/server.js` — The ServerRenderer
- `packages/component/src/render-to-string.js` — renderToString (single-component SSR)
- `packages/component/src/engines/native/base.js` — WebComponentBase hydration flow
- `docs/src/pages/test-ssr.astro` — The test ladder
- `ai/workspace/plans/ssr-ladder-status.md` — Current status document
