# Plan Implementation Status

> Last verified: 2026-03-24 against `feat/cache-subtrees` branch (68884161)

## Summary

| # | Plan | Pri | Done | State | What's Left |
|---|------|-----|------|-------|-------------|
| 1 | [Vanilla Renderer](#vanilla-renderer) | 10 | 0/10 | **Not started** — all 3 phases unimplemented | Extract ExpressionEvaluator, build VanillaRenderer, VanillaWebComponent. Eliminates Lit dependency + root cause of cache bugs |
| 2 | [Homepage Hero](#homepage-hero) | 9 | 7/10 | **Hero + AIPrompt done, tour visuals placeholder** | Three tour section visuals are TODO divs. Section names diverge from plan |
| 3 | [Primitive Usage Guides](#primitive-usage-guides) | 8 | 4/10 | **Phases 0–1 done, rest partial/not started** — Specimen Explorer fully working | CSS tab + theme spec (not started), authored MDX content, MCP exposure, `getUsageMenu()` |
| 4 | [State from Settings](#state-from-settings) | 7 | 0/10 | **Not started** — design complete, ~25 lines across 3 files | `defaultState` object-form metadata, Lit property registration, signal seeding from attributes |
| 5 | [Subtree Caching Eval](#subtree-caching-evaluation) | 7 | 4/10 | **Partial** — core cache works, key recommendations unimplemented | dataVersion in structural directives, async Reaction.guard, positional keying. Priority contingent on vanilla renderer timeline |
| 6 | [MCP Improvements](#mcp-improvements) | 7 | 7/10 | **6/9 done** — discovery, help, batch, categories, slim, clarity all shipped | `get_theming_css`, `get_global_tokens`, `get_token_usage` not implemented |
| 7 | [CSS Token Extraction](#css-token-extraction) | 6 | 0/10 | **Not started** — no code, prereqs not met | Implement `getThemingCSS` util + MCP tool. Rename inconsistent CSS filenames in 7 primitives |
| 8 | [Token Migration](#token-migration) | 5 | 6/10 | **Infra done, migration partial** — new tokens exist, old aliases provide backward compat | ~3 primitives still use old aliases (`--vertically-spaced`, `--spacing-*`). ~65 docs files use old tokens |
| 9 | [Sizing System Redesign](#sizing-system-redesign) | 5 | 7/10 | **Implemented differently** — flat structure instead of planned `global/`+`computed/` subdirs | Formally reconcile plan vs reality. Decide on `--size-*-em` and short aliases (absent) |

### Deferred Plans (moved to `plans/deferred/`)

| Plan | Pri | Done | Reason |
|------|-----|------|--------|
| Icon Mappings Rebuild | 4 | 9/10 | One duplicate-key bug to fix. 15-minute task, no strategic leverage |
| Subtree Caching Status | 3 | 8/10 | Tracking doc, not work. Update when underlying work stabilizes |
| Icon Stroke Width | 3 | 0/10 | Power-user feature. Mask-image works. Ship in v1.1 |
| AI Content Audit | 2 | 7/10 | Major issues fixed. Remaining is editorial housekeeping invisible to users |
| Audit Fix Continuation | 2 | 6/10 | Line refs stale, needs re-audit. Internal tooling maintenance |
| AI Folder Consolidation | 2 | 5/10 | Plan is obsolete — structure diverged. Rewrite or archive |
| Migrate Rewriting Files | 2 | 6/10 | Workflows done. Remaining skill file moves invisible to users |

### Archived Plans (moved to `ai/trash/plans/`)

- **MCP Streamable HTTP** (10/10) — fully deployed to mcp.semantic-ui.com
- **Consolidate Writing Skills** (10/10) — `ai/docs/` created, 3 old files deleted, MCP enum updated
- **Query Internal Each Optimization** — rejected, dogfooding principle
- **Query Trigger Preserve Event Settings** — rejected, intentional design (`trigger()` = native, `dispatchEvent()` = custom data)

---

## Subtree Caching Evaluation

**Plan:** `subtree-caching-evaluation-response.md`
**Branch:** `feat/cache-subtrees` (active)

| Recommendation | Status | Evidence |
|---|---|---|
| Cache keying includes positional index | Partial | `position` param exists in `getID()` but only used for snippets. No `_renderCallIndex` counter. Structural directives don't pass position. |
| Structural directives read `dataVersion.get()` | Not done | `reactive-each.js:41`, `reactive-conditional.js:30`, `reactive-async.js:41` — none call `dataVersion.get()` inside reactions |
| Async expression wrapped in `Reaction.guard` | Not done | `Reaction.guard` exists and is used in `reactive-rerender.js:48`, but `reactive-async.js:48` does not use it |
| Settings proxy produces full Signals / remove dataVersion | Not done | `createSettingsProxy()` (`web-component.js:254`) creates shadow Signals but returns raw values. `dataVersion` remains primary mechanism |

**Key files:** `packages/renderer/src/lit/renderer.js`, `packages/renderer/src/lit/directives/reactive-*.js`, `packages/component/src/web-component.js`

---

---

## Vanilla Renderer

**Plan:** `vanilla-renderer.md`

| Phase | Status | Detail |
|---|---|---|
| 0: Extract ExpressionEvaluator | Not started | No `expression-evaluator.js`. All expression methods in `LitRenderer` (~777 lines) |
| 1: VanillaRenderer | Not started | No `vanilla/` dir. `template.js:225` fatals on non-Lit engines |
| 2: VanillaWebComponent | Not started | `WebComponentBase` still extends `LitElement` (`web-component.js:25`) |

`renderingEngine` param flows through `defineComponent` → `Template` but selection logic is absent.

---

## Token Migration

**Plan:** `token-migration.md`

| Area | Status |
|---|---|
| New token infrastructure (`base.css`, `--margin-*`, `--padding-*`) | ✅ Complete |
| Backward compat aliases (`--spacing-*` → `--margin-*`, `--vertically-spaced` → `--vertical-margin`) | ✅ In place (`spacing.css:146-162`) |
| Source primitives migrated to new canonical tokens | ❌ Partial — menu, segment, card still use `--vertically-spaced`; divider uses `--spacing-*` |
| tooltip.css old tokens | ✅ Already replaced (`--rectangular-tight-padding`, `--space-2` gone) |
| `--font-size` removed | ✅ |
| docs/ files (~65 using old tokens) | ❌ Not migrated |

---

## Sizing System Redesign

**Plan:** `sizing-system-redesign.md`

Implementation diverged from plan but achieved the same goals:

| Aspect | Plan | Actual |
|---|---|---|
| Directory structure | `global/` + `computed/` subdirs | Flat `src/css/tokens/` |
| `base.css` | In `global/sizing.css` | Direct `base.css` — contains `--base-size`, all `--Xpx`, `--relative-Xpx` |
| `sizing.css` | `computed/sizing.css` | Direct `sizing.css` — `--size-3xs` through `--size-3xl` |
| `spacing.css` | `computed/spacing.css` | Direct `spacing.css` — full `--padding-*` (em) + `--margin-*` (rem) |
| `--size-*-em` variants | Planned | Absent |
| Short aliases (`--3xs`, `--relative-3xs`) | Planned | Absent |
| rem vs em separation | `--padding` = em, `--margin` = rem | ✅ Correct |
| Margin scale extends to 5xl (beyond plan's 3xl) | — | ✅ Bonus |

---

## Primitive Usage Guides

**Plans:** `primitive-usage-guides.md` + `primitive-usage-guides-context.md` (design companion)

| Phase | Status | Detail |
|---|---|---|
| 0: Tab plumbing | ✅ Done | `usage` first in tab arrays, route handler wired, landing tab |
| 1: Specimen Explorer | ✅ Done | `SpecimenExplorer.js` — control gen, dialect toggle, copy, live preview |
| 2: Auto-generated sections | Partial | `UsageImports.astro`, `UsageSettings.astro`, `UsageEvents.astro` exist. No `UsageGuide.astro` orchestrator, no `getUsageMenu()` |
| 3a: Polish | Partial | Settings/events tables present. Framework snippets (React/Vue/Angular) missing |
| 3b: CSS Tab + Theme Spec | Not started | No CSS tab, no `button.theme.json`, no barrel CSS parser |
| 4: Authored content | Not started | No MDX body content in primitives |
| 5: MCP integration | Not started | Usage guides not exposed via MCP |

---

## Homepage Hero

**Plan:** `homepage-hero-content.md`

| Element | Status |
|---|---|
| Hero H1 "The UI Framework for the AI Era" | ✅ Matches exactly |
| CTAs ("View Docs" / "Try In 5 Minutes") | ✅ |
| AIPrompt component (4-step agentic coding demo) | ✅ Full sequencer with typing, thinking, code transitions |
| Tour section structure (3 sections + scroll tracking) | ✅ Structure in place |
| Tour section visuals | ❌ Placeholder `<div>` with TODO comments |
| Tour section names match plan | Partial — plan: "Code Designed to Edit" / "Author Components" / "Specs as Code Contracts". Actual: "Expressive Templates" / "Specs as Code Contracts" / "Runtime Components" |
| Three proof cards | ✅ |

---

## MCP Improvements

**Plan:** `mcp-improvements.md`

| # | Improvement | Status |
|---|---|---|
| 1 | Content relationship linking | ✅ `findRelatedForDoc/Example/Spec()` in cache.ts |
| 2 | Help/orientation tool | ✅ Comprehensive with Tailwind escape hatch |
| 3 | Batch fetching (array params) | ✅ All `get_*` tools accept `string \| string[]` |
| 4 | Category discovery in descriptions | ✅ `list_examples` includes category names |
| 5 | Slim list responses | ✅ No redundant `type` field |
| 6 | Clarify skill vs context | ✅ Descriptions distinguish the two |
| 7 | `get_theming_css` | ❌ Not implemented |
| 8 | `get_global_tokens` | ❌ Not implemented |
| 9 | `get_token_usage` | ❌ Not implemented |

Items 7–9 depend on CSS token extraction infrastructure.

---

## CSS Token Extraction

**Plan:** `css-token-extraction.md` — **NOT STARTED**

- `tools/mcp/src/utils/get-theming-css.ts` does not exist
- No `get_theming_css` tool registered (17 tools, none theming-related)
- Prereqs unmet: `sizing-variables.css` (should be `size-variables.css`) in 7 primitives, `colored-variables.css` (should be `color-variables.css`) in 5 primitives

---


