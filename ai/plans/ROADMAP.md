# Semantic UI Next — Roadmap

> Single source of truth for what's being built and in what order.

## How to Read This

**Autonomy:**
| Level | Meaning |
|---|---|
| `agent` | Agent executes autonomously with a clear brief |
| `pair` | Socratic — Jack and Claude think through it together. The conversation *is* the work. |
| `jack` | Jack's hands and instincts. Claude may research or review. |

**Hours** = working hours for the given autonomy mode. Over 8h, show days too: `16-24h (2-3d)`. Reference: subtree caching took ~40h (5d) pair.

**Scope maturity:**
| Level | Meaning |
|---|---|
| `initial` | Problem and decision space captured. Needs a pair session to become actionable. |
| `scoped` | Design decisions made, implementation steps concrete. Ready to execute. |

**Component research** for all ~80 target components lives in `ai/research/components/`. Each has pattern analysis across 11+ frameworks. The master list is `ai/research/components/_list/ui-list.md`.

---

## What's Built Today

**Primitives (14):** button, card, container, divider, icon, image, input, label, menu (+menu-item), modal, rail, segment, spinner, table — all have .js, .html, .css (themed), .json spec

**Components (10):** copy-button, global-search, inpage-menu, mobile-menu, mobile-menu-toggle, nav-menu, panels, sidebar-toggle, theme-switcher, topbar-menu

**Behaviors (4):** attach, escape, tooltip, transition — all have standalone CDN files

**Remaining to build:** ~66 components from the master list

---

## Dependency Graph

```
TOKEN FINALIZATION (the gate)
│
├─→ Token Migration (agent, mechanical)
├─→ CSS Token Extraction → MCP Improvements (remaining 3 tools)
├─→ CSS Token & Theming Docs (12 pages)
│
├─→ PRIMITIVE BUILD-OUT (critical path components first)
│   │
│   │  Tier 1 — Unblock ecosystem guides & getting started
│   │  ─────────────────────────────────────────────────────
│   │  dropdown/select, checkbox, radio, switch, form,
│   │  form-field, tabs, accordion
│   │
│   │  Tier 2 — Unblock behavior docs & advanced guides
│   │  ─────────────────────────────────────────────────────
│   │  popover, tooltip (primitive, not behavior), slider,
│   │  textarea, toast, drawer, breadcrumb, pagination
│   │
│   │  Tier 3 — Complete the library
│   │  ─────────────────────────────────────────────────────
│   │  Everything else (~45 components)
│   │
│   ├─→ Primitive/Component Docs (authored MDX per component)
│   ├─→ Behavior Docs (attach, transition, escape, popover)
│   ├─→ Learn Courses 3xx-5xx
│   └─→ Value Schema → Wrapper Architecture → Wrapper Packages
│        └─→ Ecosystem Guides (final, post-wrapper)
│
├─→ PARALLEL (unblocked now)
│   ├─ Docs Deploy 0.18.0 (agent, 0.5d)
│   ├─ Subtemplate Settings (pair, active)
│   ├─ State from Settings (pair, 1d)
│   ├─ Getting Started Guides — using-ui, creating-ui, theming (pair, 4-6d)
│   ├─ Philosophy Pages — natural-language, about project (jack, 2-3d)
│   ├─ Ecosystem Guides — raw WC version, pre-wrapper (pair, 15-20d)
│   ├─ Roadmap page redesign (pair, 1-2d)
│   └─ Homepage Tour Ribbon — 3 PlaygroundExamples (pair, 2-3d)
│
└─→ HOMEPAGE (last — final content pass after everything converges)
```

---

## Do Next (unblocked, priority order)

| # | What | Hours | Mode | Notes |
|---|------|-------|------|-------|
| 1 | Token Finalization | open | pair | The gate. Open questions: color grades (0-100 vs 5-100), borders (semantic vs numeric), dark mode inversion, surface colors (slate). See [plan](token-finalization.md). |
| 2 | Docs Deploy 0.18.0 | 4h | agent | Build + smoke test. Menu trimming done on `docs/shippable`. |
| 3 | State from Settings | 8h | pair | ~25 lines. API design + implement. |
| 4 | [Rename Tooltip → Popover](rename-tooltip-to-popover.md) | 4h | agent | Mechanical rename across ~40 files. Partially resolves #21 (naming conventions). |

## Up Next (unblocked after "Do Next" or independent)

| # | What | Hours | Mode | Notes |
|---|------|-------|------|-------|
| 6 | Getting Started Guides (3 pages) | 32-48h (4-6d) | pair | using-ui, creating-ui, theming. No blocker. |
| 7 | Ecosystem Guides — raw WC (7 pages) | 120-160h (15-20d) | pair | One page per framework. Pre-wrapper versions. install/framework.mdx (335 lines) is starting material. |
| 8 | Philosophy Pages (2 pages) | 16-24h (2-3d) | jack | NL thesis + about project. Jack's voice. |
| 9 | Homepage Tour Ribbon | 16-24h (2-3d) | pair | 3 PlaygroundExamples for templates/specs/components. |
| 10 | Roadmap Page Redesign | 8-16h (1-2d) | pair | Current version is "jank." Rethink or simplify. |
| 11 | [Icon Alias Audit](icon-alias-audit.md) | 4-8h | agent | Trim ~1960 aliases to ~400-600. Automated pre-filter + parallel subagent eval + reconciliation. |
| 11b | [Signal Performance](signal-performance.md) | 4-5h | pair | `scoped` — Freeze-on-set replaces clone-on-read (15-71x faster). Flush error boundary. Benchmarked. |
| 12 | [Tree-Shakeable Lit](tree-shakeable-lit.md) | 4h | agent | `scoped` — Make LitRenderer a named export consumers opt into. No Lit in bundle unless imported. |
| 13 | [CDN Dir Pages](cdn-dir-pages.md) | 8-16h (1-2d) | pair | Trailing-slash HTML pages (jsdelivr pattern). Root landing, package indexes, icons/fonts listings. |

## Template Language Enhancements (unblocked, independent track)

| # | Plan | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| 37 | [Template Spread Syntax](template-spread-syntax.md) | 4-8h | pair | scoped | `{>card ...friend}` — object spread in data passing. Test verbose first. Smallest scope. |
| 35 | [Template Match Blocks](template-match-blocks.md) | 8-16h (1-2d) | pair | scoped | `{#match}` / `{is}` / `{else}` — value-based branching. Cleanest of the four, no reactivity concerns. |
| 36 | [Template Content Projection](template-wrapper-snippets.md) | 12-16h (1.5-2d) | pair | scoped | `{>content}` — content projection for snippets + subtemplates. Caller context. |
| 34 | [Template Let Bindings](template-let-bindings.md) | 10-14h (1-2d) | pair | scoped | `{#let}...{/let}` — snippet-for-vars. Computed signal per binding. Build last, validate need from other three. |

## Blocked (waiting on token finalization)

| # | What | Hours | Mode | Blocker | Notes |
|---|------|-------|------|---------|-------|
| 13 | Token Migration (remaining) | 16-32h (2-4d) | pair/agent | Tokens locked | ~3 primitives + ~65 docs files. Not purely mechanical — spacing→padding/margin/gap needs judgment. |
| 14 | CSS Token Extraction | 16-24h (2-3d) | pair | Tokens locked | `getThemingCSS` util + MCP tool. |
| 15 | MCP Improvements (remaining) | 8-16h (1-2d) | agent | Token extraction | 3 tools: `get_theming_css`, `get_global_tokens`, `get_token_usage`. |
| 16 | CSS Token & Theming Docs (12 pages) | 40-56h (5-7d) | pair | Tokens locked | 6 token pages + 6 styling concept pages. |

## Architecture Decisions (gate the primitive build-out)

These are design decisions that must be resolved before building components at velocity. Each is a `pair` session. They sit between token finalization and the actual build-out.

| # | Plan | Hours | Mode | Scope | Blocker | Notes |
|---|------|-------|------|-------|---------|-------|
| 18 | [Value Schema](value-schema.md) | 16-24h (2-3d) | pair | initial | — | Contract for ~20-30 form components. `value` setting + schema + `change` event. Gates form/form-field and wrapper story. |
| 19 | [Light DOM Styling](light-dom-styling.md) | 16-24h (2-3d) | pair | initial | — | How table, header, and other slotted-content components handle styles that need to pierce shadow DOM. Solve once as a framework pattern. |
| 20 | [Component Wrapping Behavior](component-wrapping-behavior.md) | 16-24h (2-3d) | pair | initial | Naming conventions | How `<ui-popup>` wraps the `tooltip` behavior. Pattern recurs for accordion, dropdown, tabs. |
| 21 | [Naming Conventions](naming-conventions.md) | 8-16h (1-2d) | pair | initial | — | tooltip vs popup vs popover — all one concept in SUI. Lock the naming philosophy for ~80 components. Names are permanent. |
| 22 | [Primitive Completions](primitive-completions.md) | 40-80h (5-10d) | jack/pair | initial | Tokens + light DOM | Finish table, dropdown, header, segment, divider before building new. |

## Blocked (waiting on architecture decisions + primitives)

| # | What | Hours | Mode | Blocker | Notes |
|---|------|-------|------|---------|-------|
| 23 | Tier 1 Primitives | 16-40h each (2-5d) | jack | Arch decisions resolved | dropdown/select, checkbox, radio, switch, form, form-field, tabs, accordion (~8 components, ~160-320h total) |
| 24 | Behavior Docs (4 behaviors) | 40-64h (5-8d) | pair | Needs more primitives to show real usage | attach, transition, escape, popover |
| 25 | Primitive Usage Guides | 56-80h (7-10d) | pair | Needs more primitives | Specimen Explorer done. CSS tab, authored MDX remaining. |
| 26 | [Wrapper Architecture](wrapper-architecture.md) | 40-56h (5-7d) | pair | Value schema | Generation pipeline for React/Vue/Svelte wrappers. |
| 27 | Tier 2 Primitives | 16-40h each (2-5d) | jack | Tier 1 done | popover, slider, textarea, toast, drawer, breadcrumb, pagination (~8 components) |
| 28 | Wrapper Packages (3-4 frameworks) | 96-160h (12-20d) | pair | Wrapper arch + enough primitives | `@semantic-ui/react`, `/vue`, `/svelte` |
| 29 | Ecosystem Guides — final (7 pages) | 56-112h (7-14d) | pair | Wrapper packages | Rewrite raw WC guides to use wrapper packages. |
| 30 | Tier 3 Primitives (~45) | 16-40h each (2-5d) | jack | Tiers 1-2 done | The long tail. ~800-1800h total. |
| 31 | Learn Courses 3xx-5xx | 80-120h (10-15d) | pair | Components exist to teach | 3 courses, ~8-12 lessons each. |
| 32 | Component Docs (9 app-level) | 72-144h (9-18d) | pair | Components exist | global-search, panels, nav-menu, etc. |

## Last

| # | What | Hours | Mode | Blocker | Notes |
|---|------|-------|------|---------|-------|
| 33 | Homepage — final pass | 8-16h (1-2d) | jack | Everything above | Polish + content finalization. |

---

## Hidden Content Inventory (commented out on `docs/shippable`)

All items below are commented out in menus/pages, not deleted. Uncomment when content is ready.

### menus.js — topbar
- ~~CSS/Styling tab~~ → blocked on CSS token docs (#16)
- ~~Components tab~~ → blocked on component docs (#32)
- ~~Behaviors tab~~ → blocked on behavior docs (#24)

### menus.js — start sidebar
- ~~Roadmap~~ → needs redesign (#10)
- ~~Getting Started (3 sub-pages)~~ → write content (#6)
- ~~Ecosystems (7 sub-pages)~~ → write content (#7)
- ~~Philosophy (2 sub-pages)~~ → write content (#8)

### index.astro — homepage
- ~~Tour ribbon~~ → create 3 PlaygroundExamples (#9)
- ~~Footer: Roadmap link~~ → after redesign (#10)
- ~~Footer: Components, Behaviors, CSS Tokens, Styling Guide~~ → after respective docs

### start/index.mdx
- ~~Components card~~ → after component docs
- ~~Behaviors card~~ → after behavior docs

### learn selection
- ~~Advanced Guide (311)~~ → after learn course 3xx (#31)
- ~~UI Framework (411)~~ → after learn course 4xx (#31)
- ~~Open Source Guide (511)~~ → after learn course 5xx (#31)

### Stub pages (frontmatter only, need authored content)
- 13 primitive content MDX files → per-component docs (#25)
- 9 component content MDX files → component docs (#32)
- 2 behavior content MDX files → behavior docs (#24)
- 4 getting started guide pages → (#6)
- 7 ecosystem guide pages → (#7)
- 3 philosophy pages → (#8)
- 1 CSS index page → (#16)

---

## Deferred

Plans in `ai/plans/deferred/`.

- ~~Native Renderer~~ — completed, archived. Follow-up: Native SSR (#13b).
- ~~Lit Removal~~ — completed, archived. Follow-up: Tree-Shakeable Lit (#12).
- [Signals TC39 Integration](deferred/signals-tc39-integration.md) — Adopt native `Signal.State`/`Signal.Computed` as backing primitives when TC39 ships. `safety` preset system designed to make this transition zero-API-change. Lazy vs eager computed split along settings/state line. Blocked on TC39 Stage 3+.
- Icon stroke width — power-user feature, post-1.0
- Subtree caching status doc — tracking doc

---

## Archive

Completed or rejected plans in `ai/plans/archive/`.

- **Icon Mappings Rebuild** — 482 Lucide icons mapped across 5 libraries with aliases. Complete.
- **Vercel Deploy Pipeline** (0.5d est → 2.25h actual) — Decoupled prod from `main`, tag-triggered releases, staging environment, `next` branch retired.
- **CDN Site** (3-5d est → ~6h actual) — R2 + Worker at `cdn.semantic-ui.com`. Canary/release pipelines, import maps, vendor packages.
- **CDN Build Fix** (1-2d est → included in CDN site) — `resolveBareImports` rewriting to `cdn.semantic-ui.com` URLs.
- **Native Renderer** — Zero-dependency DOM renderer. Single-pass HTML assembly, comment markers, TreeWalker binding. 573/573 tests. TodoMVC verified.
- **Lit Removal** — Engine-agnostic `defineComponent`. `WebComponentBase extends HTMLElement` + `LitWebComponentBase extends LitElement` as peer engines. Symmetric factory pattern, static config, DOM lifecycle events. 2121 tests.
- **CDN Combo Endpoint** (1-2d est → ~3.25h actual) — Comma-separated URLs, preset tiers (standard/extended/full), spec-driven `bundle` field, pre/post-deploy testing, behavior CDN files.
- **CDN Load Endpoint** (1-2d est → ~6h actual) — `/load` with natural language attributes. Version-agnostic loader, CSS sub-layers, auto-injection, bare package attrs. 5 rounds of red-team.
- **CDN Asset Sets** (1-2d est → ~6.5h actual) — Top-level `/icons` and `/fonts` routes. Absolute CDN URLs in CSS (custom property `url()` gotcha). Self-hosted Lato, 6 icon libraries, `dev` → `brands` rename, semver downgrade guard, interactive library switcher example.
