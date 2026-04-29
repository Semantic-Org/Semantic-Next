# Semantic UI Next — Roadmap

> Source of truth for active work, priorities, and dependencies.

## Conventions

**Autonomy**

| Level | Meaning |
|---|---|
| `agent` | Agent executes autonomously with a clear brief. |
| `pair` | Collaborative — user and agent work through it together. |
| `user` | User-driven. Agent may research or review. |

**Effort.** Hours as the primary unit. Estimates over 8 hours show both: `16-24h (2-3d)`. Open-ended design surface should declare itself rather than assigning false precision.

**Scope maturity**

| Level | Meaning |
|---|---|
| `initial` | Problem captured, decision space open. Needs a pair session to become actionable. |
| `scoped` | Design decisions made, implementation steps concrete. Ready to execute. |

Component research lives in `ai/research/components/` — pattern analysis across 8-14 frameworks for ~80 target components. Master list at `ai/research/components/_list/ui-list.md`.

---

## Current State

**Primitives (14):** button, card, container, divider, icon, image, input, label, menu (+menu-item), modal, rail, segment, spinner, table.

**Components (10):** copy-button, global-search, inpage-menu, mobile-menu, mobile-menu-toggle, nav-menu, panels, sidebar-toggle, theme-switcher, topbar-menu.

**Behaviors (4):** attach, escape, tooltip, transition.

**Remaining:** ~66 components from the master list.

---

## Strategic Sequence

Foundations first, then contracts, then production velocity.

```
PHASE 0: RENDERER ARCHITECTURE  ✓ Complete
│
├─→ PHASE 1: SSR + LIGHT DOM
│     ├─ SSR data binding markers
│     └─ Light DOM pre-render pipeline
│
├─→ PHASE 2: PERFORMANCE + API CONTRACTS
│     ├─ Signal Performance
│     ├─ Value Schema
│     ├─ State from Settings
│     ├─ Subtemplate Settings
│     └─ Template Match Blocks
│
├─→ PHASE 3: NAMING + TOKENS
│     ├─ Naming Conventions
│     └─ Token Finalization
│
├─→ PHASE 4: AGENT WORKFLOW
│     ├─ Managed Agents workflow
│     ├─ Auto-research pattern
│     └─ Tier 1 → Tier 2 → Tier 3 primitives
│
└─→ PHASE 5: DOCUMENTATION + ECOSYSTEM
      ├─ Getting started, philosophy pages
      ├─ Primitive/component docs, behavior docs
      ├─ Wrapper architecture + packages (React/Vue/Svelte)
      ├─ Ecosystem guides, learn courses
      ├─ LSP & type intelligence
      └─ Homepage
```

---

## Do Next

| # | Plan | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| 1 | [Release 0.18.0](release-0-18-0.md) | TBD | pair | scoped | Ship the next tagged release. Last was 0.17.0 in November. PR #122 (`docs/shippable`) is the active artifact for menu trimming; needs a fresh audit pass for stubs added since. |

---

## Phase 0 — Renderer Architecture

**Status: Complete.** Native renderer decomposed into per-block files with `defineBlock` lifecycle, structured error machinery, and per-item server markers + adoption hydration.

---

## Phase 1 — SSR + Light DOM

SSR markers land first — the light DOM pipeline reuses the same renderer infrastructure (AST, expression evaluator, directives) with a different output target.

Light DOM determines which components are architecturally possible. `@scope` with `:not(:defined)` boundary makes shadow DOM optional per component. Tables, accordion panels, tabs content, description lists, and data grids depend on it. Also eliminates FOUC on CDN-loaded components.

| # | Plan | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| 1a | SSR Data Binding Markers | TBD | pair | initial | Versioned markers, mismatch detection, text node splitting. |
| 1b | [Light DOM Pre-render Pipeline](light-dom-prerender.md) | TBD | pair | scoped | CSS utilities (`prerenderCSS`, `@scope` rewriting); non-reactive render mode; slot projection; upgrade detection in `defineComponent`; CDN loader integration. |

---

## Phase 2 — Performance + API Contracts

Behavioral changes and API contracts that downstream agents and consumers will target. Decisions made here propagate across 60+ components.

| # | Plan | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| 2a | [Signal Performance](signal-performance.md) | 4-5h + audit | pair | scoped | `safety` preset system (`freeze` / `reference` / `none`) replacing `allowClone`. Audit of `.get()` call sites for get-mutate-set patterns gates the default flip. |
| 2a.1 | [Fine-Grained Reactivity](fine-grained-reactivity.md) | 6-8h | pair | initial | `ReactiveDataContext` — per-key Signal bag — at `{#each}` items, subtemplate `reactiveData`, snippet args. Eliminates the N×M coarse invalidation pattern. Lands after 2a. |
| 2b | [Value Schema](value-schema.md) | 16-24h (2-3d) | pair | initial | Contract for ~20-30 form components. `value` setting + schema + `change` event. Gates form/form-field and the wrapper architecture. |
| 2c | [State from Settings](state-from-settings.md) | 8h | pair | scoped | `{ default: 'all', from: 'setting' }` in `defaultState`. Eliminates manual shadowing for components that accept initial values from attributes but own them as state. |
| 2d | Subtemplate Settings | TBD | pair | initial | Data-shape contracts for tagless template units that have data context but no settings. |
| 2e | [Template Match Blocks](template-match-blocks.md) | 8-16h (1-2d) | pair | scoped | `{#match}`/`{is}`/`{else}` — value-based branching. Replaces verbose `{#if is x 'a'}...{else if is x 'b'}` chains. |
| 2f | Expression Error Surfacing | 4h | pair | initial | Surface expression string, available data keys, and error message in development mode. Currently `evaluateJavascript` returns `undefined` silently on errors. |
| 2g | [CSP-Compatible Expressions](csp-compatible-expressions.md) | 12-24h | pair | initial | Opt-in three-level flag on `defineComponent` — default / no-runtime-eval / lisp-only. Allows execution under strict CSP, Workers, MV3, Deno without `--allow-eval`. Tree-shakeable hand-rolled parser, no third-party deps. |
| 2h | [Explicit Each Keys](each-explicit-keys.md) | 4-8h | pair | initial | `{#each item key=expr}` syntax. Defensibility for data shapes that don't match the heuristic key chain. Builds on per-item marker plumbing. |

---

## Phase 3 — Naming + Tokens

Names and tokens lock before agent-driven component generation begins. Tag names, import paths, and spec files inherit the conventions established here.

| # | Plan | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| 3a | [Rename Tooltip → Popover](rename-tooltip-to-popover.md) | 4h | agent | scoped | Mechanical rename across ~40 files. Ships independently. |
| 3b | [Naming Conventions](naming-conventions.md) | 8-16h (1-2d) | pair | initial | Lock tag names for ~80 components. Cross-framework research complete. |
| 3c | [Token Finalization](token-finalization.md) | open | pair | initial | Open questions: color grades, borders (semantic vs numeric), dark mode inversion, surface colors. Decisions are interconnected; informed by Tier 1 primitive usage. |
| 3d | Token Migration | 16-32h (2-4d) | pair/agent | scoped | ~3 primitives + ~65 docs files. Spacing → padding/margin/gap requires judgment. |

---

## Phase 4 — Agent Workflow

Component research, specs, and the MCP server form the agent's interface to the framework. The **component-authoring workflow** is the convention an agent follows when building a component — research → spec → implementation → validation → review, with integrated tooling at each step. It's a specific instance of the broader workflow pattern catalogued under `ai/skills/workflows/`. Tier 1/2/3 rows execute via this workflow; their mode is `agent`, gated on `4a` defining the loop.

| # | Plan | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| 4a | Agent Workflow Architecture | TBD | pair | initial | Define the research → spec → implementation → validation → review loop. |
| 4b | [Component Wrapping Behavior](component-wrapping-behavior.md) | 16-24h (2-3d) | pair | initial | Canonical pattern for components wrapping behaviors (popup over popover, accordion, dropdown, tabs). |
| 4c | Tier 1 Primitives | 16-40h each (2-5d) | agent | — | ~8 components via workflow: dropdown/select, checkbox, radio, switch, form, form-field, tabs, accordion. |
| 4d | Tier 2 Primitives | 16-40h each (2-5d) | agent | — | ~8 components via workflow: popover, slider, textarea, toast, drawer, breadcrumb, pagination. |
| 4e | Tier 3 Primitives | 16-40h each (2-5d) | agent | — | ~45 components via workflow — the long tail. |
| 4f | [Primitive Completions](primitive-completions.md) | 40-80h (5-10d) | user/pair | initial | Finish table, dropdown, header, segment, divider. Table and header need light DOM. |

---

## Phase 5 — Documentation + Ecosystem

Authored content, framework wrappers, and developer tooling. Long-running and parallel — each item ships independently as the dependencies clear. Topology differs from earlier phases: less a sequential lockstep, more a portfolio of streams that mature on their own cadences.

| # | Plan | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| 5a | Getting Started Guides | 32-48h (4-6d) | pair | initial | Three pages: using-ui, creating-ui, theming. |
| 5b | Philosophy Pages | 16-24h (2-3d) | user | initial | NL thesis + about project. Author's voice. |
| 5c | Primitive/Component Docs | 56-80h (7-10d) | pair | initial | Authored MDX per component. Specimen Explorer complete. CSS tab remaining. |
| 5d | Behavior Docs | 40-64h (5-8d) | pair | initial | Four behaviors: attach, transition, escape, popover. |
| 5e | CSS Token & Theming Docs | 40-56h (5-7d) | pair | initial | 6 token pages + 6 styling concept pages. Blocked on token finalization. |
| 5f | [Wrapper Architecture](wrapper-architecture.md) | 40-56h (5-7d) | pair | initial | Generation pipeline for React/Vue/Svelte wrappers. Blocked on value schema. |
| 5g | Wrapper Packages | 96-160h (12-20d) | pair | initial | `@semantic-ui/react`, `/vue`, `/svelte`. Blocked on wrapper architecture. |
| 5h | Ecosystem Guides | 56-112h (7-14d) | pair | initial | Seven pages, one per framework. Raw web component version first; rewrite post-wrapper. |
| 5i | [LSP & Type Intelligence](lsp-and-type-intelligence.md) | 88-128h (11-16d) | pair | scoped | VS Code extension: tmLanguage + template LSP + TS plugin. Phase 0 (.d.ts + tmLanguage) shippable in ~1d. |
| 5j | Learn Courses 3xx-5xx | 80-120h (10-15d) | pair | initial | Three courses, ~8-12 lessons each. Blocked on components existing to teach. |
| 5k | Homepage — final pass | 8-16h (1-2d) | user | initial | Polish + content finalization after everything converges. |

---

## Parallel

Slot in wherever there's a gap; not phase-gated.

| # | Plan | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| P1 | [Icon Alias Audit](icon-alias-audit.md) | 4-8h | agent | scoped | Trim ~1960 aliases to ~400-600. Automated pre-filter + parallel agent eval. |
| P2 | [CDN Dir Pages](cdn-dir-pages.md) | 8-16h (1-2d) | pair | scoped | Per-package dir pages and package file browsers remaining. Major dir pages live; build-time version injection still pending. |
| P3 | Roadmap Page Redesign | 8-16h (1-2d) | pair | initial | — |
| P4 | Homepage Tour Ribbon | 16-24h (2-3d) | pair | initial | Three PlaygroundExamples for templates / specs / components. |
| P5 | CSS Token Extraction | 16-24h (2-3d) | pair | initial | `getThemingCSS` util + MCP tool. Blocked on token finalization. |
| P6 | MCP Improvements | 8-16h (1-2d) | agent | scoped | `get_theming_css`, `get_global_tokens`, `get_token_usage`. Blocked on token extraction. |
| P7 | [Staging Canary Playground](staging-canary-playground.md) | 1-2h | agent | scoped | Wire the staging importmap to `cdn.semantic-ui.com/@canary` so the playground exercises main-HEAD code. Production stays on jsDelivr (free, redundant). **Slotted into 0.18.0 release as session 3** — gives the publish sitting a real pre-tag smoke surface. |

---

## Template Language Enhancements

Match blocks are prioritized in Phase 2. The remaining items ship when real component templates demonstrate clear need.

| # | Plan | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| T1 | [Template Spread Syntax](template-spread-syntax.md) | 4-8h | pair | scoped | `{>card ...friend}` — object spread in data passing. |
| T2 | [Template Content Projection](template-wrapper-snippets.md) | 12-16h (1.5-2d) | pair | scoped | `{>content}` — content projection for snippets + subtemplates. |
| T3 | [Template Let Bindings](template-let-bindings.md) | 10-14h (1-2d) | pair | scoped | `{#let}...{/let}` — snippet-for-vars. |

---

## Icebox

Plans drafted but not on the active roadmap. See `ai/plans/icebox/` for files.

- [Block Runtime Diagnostics](icebox/block-runtime-diagnostics.md) — resolution-trail capture in evaluator, public `report()` API for block authors, tracing default-on-in-dev, always-on breadcrumb on first block throw.
- [Renderer + Evaluator Perf](icebox/renderer-evaluator-perf.md) — concrete hot-path optimizations: item-proxy clone elimination, `Signal.peek` non-cloning, comment-marker reuse as `DynamicRegion` anchor, V8-targeted `ExpressionEvaluator` rewrite.
- [WASM Renderer](icebox/wasm-renderer.md) — Rust/WASM server renderer for the docs-site hot path. Open questions on streaming, bundle size, AST caching.
- [MCP Playground Rendering](icebox/mcp-playground-rendering.md) — `render_component` MCP tool + Vercel KV short URLs. Closes the iterative design loop for standalone agentic dev. Phase 1 (hash URLs) complete.
- [Signals TC39 Integration](icebox/signals-tc39-integration.md) — adopt native `Signal.State`/`Signal.Computed` as backing primitives when TC39 ships. Blocked on TC39 Stage 3+.
- [Add Icon Stroke Width](icebox/add-icon-stroke-width.md) — power-user feature, post-1.0.
- [Audit Fix Continuation](icebox/audit-fix-continuation.md) — process work for follow-up audits.
