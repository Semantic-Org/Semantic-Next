# Light DOM Pre-render Pipeline — Technical Design Document

## Problem

Web components render as unstyled voids until their JavaScript loads and `customElements.define()` executes. The browser parses `<ui-button>Click</ui-button>`, paints it as an empty inline element, then later the constructor fires, shadow DOM is created, styles are adopted, and the component visually "pops" into existence. This is FOUC — Flash of Unstyled Content.

The standard mitigations (DSD, `:not(:defined)` CSS hiding, synchronous script loading) each have significant tradeoffs. SUI needs a solution that works for non-compiled environments with a primary target of agentic VMs — contexts where an AI agent generates HTML containing web components and the component JS arrives asynchronously from a CDN.

## Core Insight

**Shadow DOM is not the floor of the component model — it's the ceiling.**

A component can render fully and correctly to light DOM with `@scope`-based CSS scoping. Shadow DOM becomes an enhancement that adds encapsulation, not a prerequisite for rendering. The upgrade from light DOM to shadow DOM is a refinement, not a reveal.

This is made possible by a combination of CSS features that are now cross-browser:

- `@scope (tag) to (boundary)` — provides real CSS scoping in light DOM
- `:not(:defined)` as a live `@scope` lower boundary — universally stops scoping at any unregistered custom element, no registry knowledge needed
- `@layer` — places pre-render styles at the same cascade position as `:host`
- `adoptedStyleSheets` — enables per-definition sheet sharing and clean removal on upgrade
- `display: contents` on slot wrappers — transparent containers for projected content

## Architecture

### The Rendering Lifecycle

```
T0: Page loads
    → Loader injects render-blocking CSS (tokens, reset, prerender @scope rules)
    → Blocking module script runs template pre-render
    → Elements exist as light DOM with @scope-styled template content
    → First paint: components are visually complete

T1: Component JS arrives (async)
    → defineComponent detects pre-rendered light DOM
    → Stashed consumer children restored as direct children
    → Shadow DOM created, template rendered into shadow root
    → @scope stylesheet removed from document.adoptedStyleSheets
    → Slot projection activates naturally
    → Visually identical — same pixels, different DOM backing

T2: Component is live
    → Reactivity wired, events bound, lifecycle hooks fire
    → Full interactive component
```

### CSS Scoping Mechanism

Shadow DOM CSS is rewritten for light DOM at runtime via string manipulation:

```css
/* Original (shadow DOM) */
:host { display: inline-flex; padding: var(--8px) var(--16px); }
:host([disabled]) { opacity: 0.5; }
.label { font-weight: var(--bold); }

/* Rewritten (light DOM) */
@layer prerender {
  @scope (ui-button) to (:not(:defined)) {
    :scope { display: inline-flex; padding: var(--8px) var(--16px); }
    :scope[disabled] { opacity: 0.5; }
    .label { font-weight: var(--bold); }
  }
}
```

### Why `:not(:defined)` as the Lower Boundary

This is the key discovery. `@scope (ui-button) to (:not(:defined))` means "scope styles from `ui-button` down to any unregistered custom element." This provides:

- **Universal scoping** — no need to enumerate known component tag names. Any element with a hyphen that hasn't been registered is `:not(:defined)`.
- **Live boundary** — as components upgrade and become `:defined`, the boundary moves. But it doesn't matter — once a component upgrades, shadow DOM is the scoping mechanism and the `@scope` sheet is removed.
- **Self-healing** — if a component fails to load, its `@scope` rules stay active. The pre-rendered light DOM remains styled indefinitely. Graceful degradation for free.

**Validated empirically:** the boundary re-evaluates reactively on element upgrade. Tested in Chrome stable, April 2025.

### CSS Layer Integration

SUI's existing layer architecture with the new `prerender` layer:

```
@layer global, theme, prerender;

global.reset    — normalize, box-sizing
global.base     — body, headings, links, scrollbars, img
theme           — design tokens, light/dark themes
prerender       — @scope rules for pre-render (NEW)
(unlayered)     — consumer styles
```

The `prerender` layer sits after `global` and `theme`, so component `:scope` styles override token defaults where needed. All named layers lose to unlayered consumer styles — matching `:host` cascade behavior exactly.

### Forward Reset (Shadow → Globals)

Global styles from `global.base` that shadow DOM silently drops. Injected into every component's shadow CSS so shadow DOM behavior matches light DOM:

```css
/* Prepended to shadow CSS on upgrade */
*, *::before, *::after {
  box-sizing: var(--box-sizing);
  scrollbar-color: var(--thumb-background) var(--track-background);
  scrollbar-width: var(--scrollbar-width);
}
a {
  color: var(--link-color);
  text-decoration: var(--link-text-decoration);
  text-underline-offset: 0.2em;
}
img, video, svg {
  max-width: 100%;
  height: auto;
}
```

### Reverse Reset (Globals → Shadow)

Global styles that affect template-internal semantic tags during pre-render but wouldn't exist inside shadow DOM. More targeted than initially assumed.

**Critical distinction: slotted content vs template internals.**

| Content type | Pre-render | Post-upgrade | Globals? |
|---|---|---|---|
| Template internals (`.card`, `.header`, `.body`) | Light DOM | Shadow DOM | Pre-render: yes. Post-upgrade: no. |
| Slotted content (`h2`, `p`, `a` from consumer) | Light DOM | Light DOM (projected) | Always yes. |

The reverse reset must only neutralize globals on template-internal elements, never on slotted content. Slotted content stays in light DOM after upgrade — globals apply in both phases. Neutralizing them during pre-render would *cause* a visual shift, not prevent one.

Practically, template internals are almost always classed `div`s and `span`s — they rarely use semantic tags that globals target. The reverse reset is narrow:

```css
/* Only affects template-owned elements, not slotted content */
h1:not(slotcontent *), h2:not(slotcontent *), ... {
  margin: 0;
  font-size: inherit;
}
```

### Slot Projection in Light DOM

Consumer-provided children need to appear at the correct positions within the pre-rendered template structure.

**Pre-render flow:**
1. Stash consumer children keyed by slot name (`default`, `header`, etc.)
2. Parse template to DocumentFragment
3. Replace each `<slot>` with a `<slotcontent data-slot="name">` wrapper containing the matching stashed children
4. Append fragment as light DOM children of the element

**Upgrade flow:**
1. `innerHTML = ''` — clears the pre-rendered light DOM
2. Restore stashed children as direct children (re-add `slot` attributes for named slots)
3. `attachShadow()` + render template into shadow root
4. Browser slot projection activates — `<slot>` elements in shadow DOM project the restored light DOM children

### The `slotcontent` Element

**Must NOT have a hyphen in the name.** Elements with hyphens are valid custom element names. Unregistered custom elements are `:not(:defined)`. The `@scope` lower boundary would stop at a hyphenated wrapper, preventing styles from reaching slotted content inside it.

Non-hyphenated unknown elements are always `:defined` — invisible to the boundary. `<slotcontent>` is parsed as an unknown HTML element, not a custom element. Styled with `display: contents` to be layout-transparent.

### CSS Rewriting — Runtime, Not Build-Time

The `:host` → `:scope` rewrite is four regex replacements and two string wraps. Sub-millisecond. Consistent with SUI's philosophy: template AST compilation is runtime and <1ms, expression evaluation is runtime via Proxy, Tailwind compilation is runtime via WASM. No build step needed.

`@semantic-ui/utils` already has `scopeStyles()` with `:host` rewriting regex patterns, `adoptStylesheet()` with hash-based caching and dedup, and `extractCSS()` with CSSOM walking. The pre-render pipeline is a thin layer on top of existing infrastructure.

### Cascade Asymmetry — Known Constraint

`@scope :scope` and shadow DOM `:host` have different cascade positions for certain rule interactions:

- `*` selector in page CSS beats `:host` (outer author context wins) but may not beat `:scope` at the same specificity
- Resolved by `@layer` — layered `:scope` rules lose to unlayered `*` rules, matching `:host` behavior
- `@scope` component CSS can style slotted content descendants; shadow DOM CSS cannot (`::slotted()` is direct children only)

Both constraints were identified and validated during prototyping. The `@layer` wrapping resolves the first. The second is a minor cosmetic difference during the pre-render window (e.g., `text-decoration-thickness` on an invisible underline) — 303/304 properties matched in the full pipeline test.

### Existing Infrastructure

| Utility | Location | Reusable for |
|---|---|---|
| `scopeStyles()` | `@semantic-ui/utils` | `:host` regex patterns, CSSOM rule walking |
| `adoptStylesheet()` | `@semantic-ui/utils` | Hash-based sheet caching, dedup, adoption |
| `extractCSS()` | `@semantic-ui/utils` | CSSOM parsing for CSS extraction |
| `hashCode()` | `@semantic-ui/utils` | Sheet identity for caching/removal |
| Template compiler | `@semantic-ui/templating` | AST generation for static render |
| Expression evaluator | `@semantic-ui/renderer` | Static expression resolution against defaultSettings |
| CDN loader | `tools/cdn/` | Render-blocking CSS injection, combo endpoints |
| CDN worker | `tools/cdn/` | Preset resolution, version aliasing, combo serving |

## Test Results

Full pipeline prototype validated in Chrome stable (sandbox environment):

- **@scope isolation:** 5/5 — nested undefined components correctly isolated
- **Boundary reactivity:** verified — `:not(:defined)` updates as elements upgrade
- **Layer cascade:** verified — `@layer prerender` matches `:host` cascade behavior
- **Slot projection:** verified — consumer children correctly project through slots after upgrade
- **Visual diff:** 303/304 properties match (1 diff: invisible `text-decoration-thickness` sub-property)
- **Forward reset:** verified — shadow DOM internals get global base styles
- **Reverse reset:** validated constraint — only applies to template internals, not slotted content
- **`slotcontent` naming:** verified — non-hyphenated avoids `:not(:defined)` boundary
- **Sheet cleanup:** verified — `adoptedStyleSheets` filtering removes scope sheets, `:host` takes over
