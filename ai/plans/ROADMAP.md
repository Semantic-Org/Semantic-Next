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

## Strategic Sequence

The ordering below builds the factory before producing at scale. Each phase resolves a class of risk that would compound if deferred — foundations first, then contracts, then production velocity.

```
PHASE 0: RENDERER ARCHITECTURE (make the foundation elegant)
│
├─→ PHASE 1: SSR + LIGHT DOM (unlock the full component design space)
│     ├─ SSR data binding markers (clean hydration on clean directives)
│     └─ Light DOM pre-render pipeline (shadow DOM becomes optional)
│
├─→ PHASE 2: PERFORMANCE + API CONTRACTS (lock what agents will target)
│     ├─ Signal Performance (foundational behavioral change)
│     ├─ Value Schema (contract for ~20-30 form components)
│     ├─ State from Settings (attribute-to-state promotion)
│     ├─ Subtemplate Settings (data shape for tagless subtemplates)
│     └─ Template Match Blocks (agent-relevant template construct)
│
├─→ PHASE 3: NAMING + TOKENS (lock the vocabulary)
│     ├─ Naming Conventions (tag names for ~80 components)
│     └─ Token Finalization (informed by real primitive usage)
│
├─→ PHASE 4: AGENT PIPELINE (the factory)
│     ├─ Managed Agents pipeline (Anthropic infrastructure)
│     ├─ Auto-research pattern (component research → spec → implementation → validation)
│     └─ Tier 1 → Tier 2 → Tier 3 primitives (built via pipeline)
│
└─→ PHASE 5: DOCUMENTATION + ECOSYSTEM (post-pipeline)
      ├─ Docs deploy, getting started guides, philosophy pages
      ├─ Primitive/component docs, behavior docs
      ├─ Wrapper architecture + packages (React/Vue/Svelte)
      ├─ Ecosystem guides, learn courses
      ├─ LSP & type intelligence
      └─ Homepage (last)
```

---

## Phase 0 — Renderer Architecture

The native renderer is 1700 lines of correct but repeated logic. Each block (conditional, each, async, rerender, subtemplate, snippet) hand-inlines the same ceremony: create region, wire reaction, branch on hydration vs render, handle updates, handle cleanup. The `defineBlock` refactor extracts this into the same destructured-callback pattern that `defineComponent` uses. This must land before SSR and light DOM work because both modify the render/hydrate lifecycle — surgical edits to individual block files vs modifications to a monolith.

| # | What | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| 0 | [Native Renderer Blocks](native-renderer-blocks.md) | TBD | pair | initial | `defineBlock` pattern. Each block (`{#if}`, `{#each}`, `{#async}`, etc.) becomes its own file with `create`/`render`/`hydrate`/`update`/`destroy`/`error` lifecycle. Baked-in reactivity tracing + agent-readable runtime error output. Reference shape: lit renderer's hand-authored ~500-line core. |

---

## Phase 1 — SSR + Light DOM

SSR markers first because the light DOM pipeline reuses the same renderer infrastructure — same AST, same expression evaluator, same directives, different output target. Fix the foundation before building a new mode on it.

Light DOM second because it determines which components are architecturally possible. `@scope` with `:not(:defined)` boundary makes shadow DOM optional per-component. Table, accordion panels, tabs content, description lists, data grids — none buildable without this. Also eliminates FOUC for all components via the CDN pre-render path.

| # | What | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| 1a | SSR Data Binding Markers | TBD | pair | initial | Clean hydration on clean directive architecture. Versioned markers, mismatch detection, text node splitting. |
| 1b | [Light DOM Pre-render Pipeline](light-dom-prerender.html) | TBD | pair | scoped | Phase 0: CSS utilities (`prerenderCSS`, `@scope` rewriting). Phase 1: Non-reactive render mode (`Reaction.nonreactive()`). Phase 2: Slot projection. Phase 3: Upgrade detection in `defineComponent`. Phase 4: Entry point + CDN loader integration. |

---

## Phase 2 — Performance + API Contracts

These are the foundational behavioral changes and API contracts that agents will target. Every decision made here gets learned by agents and repeated across 60+ components. Get them right before scaling.

| # | What | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| 2a | [Signal Performance](signal-performance.md) | 4-5h + audit | pair | scoped | Freeze-on-set replaces clone-on-read (15-71x faster). `safety` preset system (`'freeze'`/`'clone'`/`'reference'`/`'none'`). Flush error boundary (3 lines). Benchmarked. 8 fixes already shipped. **Gating work:** audit all signal `.get()` call sites across `packages/*`, `src/`, `docs/src` for get-mutate-set patterns that would throw under freeze; migrate to `sig.mutate()` / array helpers or opt-in `safety: 'reference'` per site. |
| 2a.1 | [Fine-Grained Reactivity](fine-grained-reactivity.md) | 6-8h | pair | initial | `ReactiveDataContext` — per-key `Signal` bag + `Proxy` — replaces the shared-context invalidation at `{#each}` items, subtemplate `reactiveData`, snippet args. Eliminates the N×M "every property change invalidates every expression" pattern on filter-keystroke. Lands after 2a (uses `safety: 'none'` from the preset API). Has one open investigation (snippet zero-reactivity failure mode) before the snippet-site work is executable. |
| 2b | [Value Schema](value-schema.md) | 16-24h (2-3d) | pair | initial | Contract for ~20-30 form components. `value` setting + schema + `change` event. Key question: is value just a setting, or does it need dedicated machinery beyond the settings proxy? Gates form/form-field and wrapper story. |
| 2c | [State from Settings](state-from-settings.md) | 8h | pair | scoped | ~25 lines across 3 files. `{ default: 'all', from: 'setting' }` in `defaultState`. Eliminates manual shadowing pattern for components that accept initial values from attributes but own them as state. |
| 2d | Subtemplate Settings | TBD | pair | initial | Subtemplates have data context but no settings (tagless, no attributes). Need a way to define their data shape — data contracts for tagless template units. |
| 2e | [Template Match Blocks](template-match-blocks.md) | 8-16h (1-2d) | pair | scoped | `{#match}`/`{is}`/`{else}` — value-based branching. Replaces verbose `{#if is x 'a'}...{else if is x 'b'}` chains. Agent-generated templates frequently need status/mode/view-type branching. |
| 2f | Expression Error Surfacing | 4h | pair | initial | `evaluateJavascript` silently returns `undefined` on all errors. Surface the expression string, available data keys, and error message in development mode. Critical for agent-generated components where broken output looks intentionally empty. |
| 2g | [CSP-Compatible Expressions](csp-compatible-expressions.md) | 12-24h | pair | initial | Opt-in three-level flag on `defineComponent` — default / no-runtime-eval / lisp-only. Lets SUI run under strict CSP, Workers, MV3, Deno without `--allow-eval`. Tree-shakeable hand-rolled parser (~200-300 LOC, zero-cost when unused), no third-party deps, no build step. Framing is platform compatibility, not safety theatre. |

---

## Phase 3 — Naming + Tokens

Naming must be locked before the agent pipeline starts producing components — names become tag names, import paths, spec files, and mental models. Tokens should be informed by real primitive usage rather than resolved in isolation.

| # | What | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| 3a | [Rename Tooltip → Popover](rename-tooltip-to-popover.md) | 4h | agent | scoped | Mechanical rename across ~40 files. Independent, can ship anytime. Standardizes before more components reference the behavior. |
| 3b | [Naming Conventions](naming-conventions.md) | 8-16h (1-2d) | pair | initial | Lock tag names for all ~80 components. 76 components researched across 8-14 frameworks. Names are permanent. |
| 3c | Token Finalization | open | pair | initial | Open questions: color grades, borders (semantic vs numeric), dark mode inversion, surface colors. See [plan](token-finalization.md). The core tension: decisions are interconnected and the cost of shipping wrong is permanent. Informed by Tier 1 primitive usage. |
| 3d | Token Migration (remaining) | 16-32h (2-4d) | pair/agent | scoped | ~3 primitives + ~65 docs files. Not purely mechanical — spacing→padding/margin/gap needs judgment. |

---

## Phase 4 — Agent Pipeline

The factory. Component research (76 analyses across 8-14 frameworks) becomes training data. Component specs become validation contracts. The MCP server becomes the agent's interface to the framework. Managed Agents + auto-research pattern: agent researches component → synthesizes consensus patterns → generates spec → generates component → validates against spec → runs tests → iterates on failures → human reviews output.

| # | What | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| 4a | Agent Pipeline Architecture | TBD | pair | initial | Anthropic Managed Agents infrastructure. Karpathy-style auto-research. Define the research → spec → implementation → validation → review loop. |
| 4b | [Component Wrapping Behavior](component-wrapping-behavior.md) | 16-24h (2-3d) | pair | initial | Canonical pattern for components wrapping behaviors (popup wrapping popover behavior, accordion, dropdown, tabs). Resolve during early pipeline usage when the first wrapping component is built. |
| 4c | Tier 1 Primitives | 16-40h each (2-5d) | pipeline | — | dropdown/select, checkbox, radio, switch, form, form-field, tabs, accordion (~8 components). Built via agent pipeline with human review. |
| 4d | Tier 2 Primitives | 16-40h each (2-5d) | pipeline | — | popover, slider, textarea, toast, drawer, breadcrumb, pagination (~8 components). |
| 4e | Tier 3 Primitives (~45) | 16-40h each (2-5d) | pipeline | — | The long tail. |
| 4f | [Primitive Completions](primitive-completions.md) | 40-80h (5-10d) | jack/pair | initial | Finish table (blocked on light DOM), dropdown, header, segment, divider. Table and header need light DOM. Segment and divider can be completed earlier if needed but not urgent — use normal HTML/CSS for docs until light DOM lands. |

---

## Phase 5 — Documentation + Ecosystem

Post-pipeline. Write docs when there's something to document. Build wrappers when the core is stable. Ship the homepage when everything converges.

| # | What | Hours | Mode | Notes |
|---|------|-------|------|-------|
| 5a | Docs Deploy 0.18.0 | 4h | agent | Build + smoke test. Menu trimming done on `docs/shippable`. Can ship anytime as minimum viable web presence. |
| 5b | Getting Started Guides (3 pages) | 32-48h (4-6d) | pair | using-ui, creating-ui, theming. |
| 5c | Philosophy Pages (2 pages) | 16-24h (2-3d) | jack | NL thesis + about project. Jack's voice. |
| 5d | Primitive/Component Docs | 56-80h (7-10d) | pair | Authored MDX per component. Specimen Explorer done. CSS tab remaining. |
| 5e | Behavior Docs (4 behaviors) | 40-64h (5-8d) | pair | attach, transition, escape, popover. |
| 5f | CSS Token & Theming Docs (12 pages) | 40-56h (5-7d) | pair | 6 token pages + 6 styling concept pages. Blocked on token finalization. |
| 5g | [Wrapper Architecture](wrapper-architecture.md) | 40-56h (5-7d) | pair | Generation pipeline for React/Vue/Svelte wrappers. Blocked on value schema + framework stabilization. |
| 5h | Wrapper Packages (3-4 frameworks) | 96-160h (12-20d) | pair | `@semantic-ui/react`, `/vue`, `/svelte`. Blocked on wrapper arch + enough primitives. |
| 5i | Ecosystem Guides (7 pages) | 56-112h (7-14d) | pair | One page per framework. Raw WC version first, rewrite post-wrapper. |
| 5j | [LSP & Type Intelligence](lsp-and-type-intelligence.md) | 88-128h (11-16d) | pair | VS Code extension: tmLanguage + template LSP + TS plugin. 4 phases. Phase 0 (.d.ts + tmLanguage) shippable in ~1d. |
| 5k | Learn Courses 3xx-5xx | 80-120h (10-15d) | pair | 3 courses, ~8-12 lessons each. Blocked on components existing to teach. |
| 5l | Homepage — final pass | 8-16h (1-2d) | jack | Last. Polish + content finalization after everything converges. |

---

## Parallel (slot in wherever there's a gap)

| # | What | Hours | Mode | Notes |
|---|------|-------|------|-------|
| P1 | [Icon Alias Audit](icon-alias-audit.md) | 4-8h | agent | Trim ~1960 aliases to ~400-600. Automated pre-filter + parallel subagent eval. |
| P2 | [CDN Dir Pages](cdn-dir-pages.md) | 8-16h (1-2d) | pair | Cosmetic. Trailing-slash HTML pages for package indexes. |
| P3 | Roadmap Page Redesign | 8-16h (1-2d) | pair | Current version is "jank." |
| P4 | Homepage Tour Ribbon | 16-24h (2-3d) | pair | 3 PlaygroundExamples for templates/specs/components. |
| P5 | CSS Token Extraction | 16-24h (2-3d) | pair | `getThemingCSS` util + MCP tool. Blocked on token finalization. |
| P6 | MCP Improvements (remaining 3 tools) | 8-16h (1-2d) | agent | `get_theming_css`, `get_global_tokens`, `get_token_usage`. Blocked on token extraction. |
| P7 | [Utils Modernization](utils-modernization.md) | 4-8h + codemod | pair | Remove `any`/`onlyKeys` aliases, fix `first`/`last` return-type polymorphism, add `pipe`/`attempt`/`tap`. `initial` scope — 5 quick design calls. |

---

## Template Language Enhancements (post-match-blocks, as needed)

Match blocks are prioritized in Phase 2. The remaining three ship when real component templates demonstrate clear need.

| # | Plan | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| T1 | [Template Spread Syntax](template-spread-syntax.md) | 4-8h | pair | scoped | `{>card ...friend}` — object spread in data passing. |
| T2 | [Template Content Projection](template-wrapper-snippets.md) | 12-16h (1.5-2d) | pair | scoped | `{>content}` — content projection for snippets + subtemplates. |
| T3 | [Template Let Bindings](template-let-bindings.md) | 10-14h (1-2d) | pair | scoped | `{#let}...{/let}` — snippet-for-vars. Build last, validate need from others. |

---

## Deferred

Plans in `ai/plans/deferred/`.

- [Signals TC39 Integration](deferred/signals-tc39-integration.md) — Adopt native `Signal.State`/`Signal.Computed` as backing primitives when TC39 ships. `safety` preset system designed to make this transition zero-API-change. Blocked on TC39 Stage 3+.
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
- **Tree-Shakeable Lit** — LitRenderer as named export consumers opt into. No Lit in bundle unless imported. Complete.
- **CDN Combo Endpoint** (1-2d est → ~3.25h actual) — Comma-separated URLs, preset tiers (standard/extended/full), spec-driven `bundle` field, pre/post-deploy testing, behavior CDN files.
- **CDN Load Endpoint** (1-2d est → ~6h actual) — `/load` with natural language attributes. Version-agnostic loader, CSS sub-layers, auto-injection, bare package attrs. 5 rounds of red-team.
- **CDN Asset Sets** (1-2d est → ~6.5h actual) — Top-level `/icons` and `/fonts` routes. Absolute CDN URLs in CSS (custom property `url()` gotcha). Self-hosted Lato, 6 icon libraries, `dev` → `brands` rename, semver downgrade guard, interactive library switcher example.
- **[Hydration Perf Pass](archive/hydration-perf-pass.md)** (~3-4h active → 5h45m wall clock) — Closed the `perf/native` decomposition branch's ~425 ms hydration regression on `/perf/hydrated` (1000-card PerfCards). Reverted step-9's per-item hydrate claim; landed plans 04 (`data-sui-bind`), 02 (defer `removeMarkers`), 08 (single-pass walker + fast-path depth fix), 09 (per-item markers + DOM-reusing first-mutation adoption); evaluated & deferred plan 12 (yielding); fixed the phantom-`flushTask` bug (spurious `itemSignal.notify()` on every fresh record during initial render). Tachometer: decomposition regressions from ~−60% on `select` recovered to +38% faster than main; most other client-render regressions within noise. Dev hydration 98 → ~80 ms; branch at parity-or-better with main on hydrated path.

---

## Hidden Content Inventory (commented out on `docs/shippable`)

All items below are commented out in menus/pages, not deleted. Uncomment when content is ready.

### menus.js — topbar
- ~~CSS/Styling tab~~ → blocked on CSS token docs (5f)
- ~~Components tab~~ → blocked on component docs (5d)
- ~~Behaviors tab~~ → blocked on behavior docs (5e)

### menus.js — start sidebar
- ~~Roadmap~~ → needs redesign (P3)
- ~~Getting Started (3 sub-pages)~~ → write content (5b)
- ~~Ecosystems (7 sub-pages)~~ → write content (5i)
- ~~Philosophy (2 sub-pages)~~ → write content (5c)

### index.astro — homepage
- ~~Tour ribbon~~ → create 3 PlaygroundExamples (P4)
- ~~Footer: Roadmap link~~ → after redesign (P3)
- ~~Footer: Components, Behaviors, CSS Tokens, Styling Guide~~ → after respective docs

### start/index.mdx
- ~~Components card~~ → after component docs
- ~~Behaviors card~~ → after behavior docs

### learn selection
- ~~Advanced Guide (311)~~ → after learn course 3xx (5k)
- ~~UI Framework (411)~~ → after learn course 4xx (5k)
- ~~Open Source Guide (511)~~ → after learn course 5xx (5k)

### Stub pages (frontmatter only, need authored content)
- 13 primitive content MDX files → per-component docs (5d)
- 9 component content MDX files → component docs (5d)
- 2 behavior content MDX files → behavior docs (5e)
- 4 getting started guide pages → (5b)
- 7 ecosystem guide pages → (5i)
- 3 philosophy pages → (5c)
- 1 CSS index page → (5f)
