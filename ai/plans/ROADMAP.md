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
PHASE 0: RENDERER ARCHITECTURE
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
├─→ PHASE 4: AGENT PIPELINE
│     ├─ Managed Agents pipeline
│     ├─ Auto-research pattern
│     └─ Tier 1 → Tier 2 → Tier 3 primitives
│
└─→ PHASE 5: DOCUMENTATION + ECOSYSTEM
      ├─ Docs deploy, getting started, philosophy pages
      ├─ Primitive/component docs, behavior docs
      ├─ Wrapper architecture + packages (React/Vue/Svelte)
      ├─ Ecosystem guides, learn courses
      ├─ LSP & type intelligence
      └─ Homepage
```

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

## Phase 4 — Agent Pipeline

Component research, specs, and the MCP server form the agent's interface to the framework. Pipeline: research → spec → implementation → validation → review.

| # | Plan | Hours | Mode | Scope | Notes |
|---|------|-------|------|-------|-------|
| 4a | Agent Pipeline Architecture | TBD | pair | initial | Define the research → spec → implementation → validation → review loop. |
| 4b | [Component Wrapping Behavior](component-wrapping-behavior.md) | 16-24h (2-3d) | pair | initial | Canonical pattern for components wrapping behaviors (popup over popover, accordion, dropdown, tabs). |
| 4c | Tier 1 Primitives | 16-40h each (2-5d) | pipeline | — | ~8 components: dropdown/select, checkbox, radio, switch, form, form-field, tabs, accordion. |
| 4d | Tier 2 Primitives | 16-40h each (2-5d) | pipeline | — | ~8 components: popover, slider, textarea, toast, drawer, breadcrumb, pagination. |
| 4e | Tier 3 Primitives | 16-40h each (2-5d) | pipeline | — | ~45 components — the long tail. |
| 4f | [Primitive Completions](primitive-completions.md) | 40-80h (5-10d) | user/pair | initial | Finish table, dropdown, header, segment, divider. Table and header need light DOM. |

---

## Phase 5 — Documentation + Ecosystem

| # | Plan | Hours | Mode | Notes |
|---|------|-------|------|-------|
| 5a | Docs Deploy 0.18.0 | 4h | agent | Build + smoke test. Menu trimming complete on `docs/shippable`. |
| 5b | Getting Started Guides | 32-48h (4-6d) | pair | Three pages: using-ui, creating-ui, theming. |
| 5c | Philosophy Pages | 16-24h (2-3d) | user | NL thesis + about project. Author's voice. |
| 5d | Primitive/Component Docs | 56-80h (7-10d) | pair | Authored MDX per component. Specimen Explorer complete. CSS tab remaining. |
| 5e | Behavior Docs | 40-64h (5-8d) | pair | Four behaviors: attach, transition, escape, popover. |
| 5f | CSS Token & Theming Docs | 40-56h (5-7d) | pair | 6 token pages + 6 styling concept pages. Blocked on token finalization. |
| 5g | [Wrapper Architecture](wrapper-architecture.md) | 40-56h (5-7d) | pair | Generation pipeline for React/Vue/Svelte wrappers. Blocked on value schema. |
| 5h | Wrapper Packages | 96-160h (12-20d) | pair | `@semantic-ui/react`, `/vue`, `/svelte`. Blocked on wrapper architecture. |
| 5i | Ecosystem Guides | 56-112h (7-14d) | pair | Seven pages, one per framework. Raw web component version first; rewrite post-wrapper. |
| 5j | [LSP & Type Intelligence](lsp-and-type-intelligence.md) | 88-128h (11-16d) | pair | VS Code extension: tmLanguage + template LSP + TS plugin. Phase 0 (.d.ts + tmLanguage) shippable in ~1d. |
| 5k | Learn Courses 3xx-5xx | 80-120h (10-15d) | pair | Three courses, ~8-12 lessons each. Blocked on components existing to teach. |
| 5l | Homepage — final pass | 8-16h (1-2d) | user | Polish + content finalization after everything converges. |

---

## Parallel

Slot in wherever there's a gap; not phase-gated.

| # | Plan | Hours | Mode | Notes |
|---|------|-------|------|-------|
| P1 | [Icon Alias Audit](icon-alias-audit.md) | 4-8h | agent | Trim ~1960 aliases to ~400-600. Automated pre-filter + parallel agent eval. |
| P2 | [CDN Dir Pages](cdn-dir-pages.md) | 8-16h (1-2d) | pair | Trailing-slash HTML pages for package indexes. |
| P3 | Roadmap Page Redesign | 8-16h (1-2d) | pair | — |
| P4 | Homepage Tour Ribbon | 16-24h (2-3d) | pair | Three PlaygroundExamples for templates / specs / components. |
| P5 | CSS Token Extraction | 16-24h (2-3d) | pair | `getThemingCSS` util + MCP tool. Blocked on token finalization. |
| P6 | MCP Improvements | 8-16h (1-2d) | agent | `get_theming_css`, `get_global_tokens`, `get_token_usage`. Blocked on token extraction. |

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

- [Block Runtime Diagnostics](icebox/block-runtime-diagnostics.md) — resolution-trail capture in evaluator + public `report()` API for block authors.
- [Signals TC39 Integration](icebox/signals-tc39-integration.md) — adopt native `Signal.State`/`Signal.Computed` as backing primitives when TC39 ships. Blocked on TC39 Stage 3+.
- [Add Icon Stroke Width](icebox/add-icon-stroke-width.md) — power-user feature, post-1.0.
- [Audit Fix Continuation](icebox/audit-fix-continuation.md) — process work for follow-up audits.
