# Plan Implementation Status

> Last verified: 2026-03-24 against `feat/cache-subtrees` branch (68884161)

## Summary

| # | Plan | Pri | Done | State | What's Left |
|---|------|-----|------|-------|-------------|
| 1 | [Subtree Caching Eval](#subtree-caching-evaluation) | 10 | 4/10 | **Partial** — core cache works, key recommendations unimplemented | dataVersion in structural directives, async Reaction.guard, positional keying for non-snippet directives |
| 2 | [Subtree Caching Status](#subtree-caching-status) | 9 | 8/10 | **Mostly done** — 83 tests passing, one claim inaccurate | Snippet cache bypass (`cache: false`) NOT in code despite doc claiming it. Test count outdated (83 not 62) |
| 3 | [Vanilla Renderer](#vanilla-renderer) | 9 | 0/10 | **Not started** — all 3 phases unimplemented | Extract ExpressionEvaluator, build VanillaRenderer, VanillaWebComponent. Blocked by caching stabilization |
| 4 | [Token Migration](#token-migration) | 8 | 6/10 | **Infra done, migration partial** — new tokens exist, old aliases provide backward compat | ~3 primitives still use old aliases (`--vertically-spaced`, `--spacing-*`). ~65 docs files use old tokens |
| 5 | [Sizing System Redesign](#sizing-system-redesign) | 8 | 7/10 | **Implemented differently** — flat structure instead of planned `global/`+`computed/` subdirs | Formally reconcile plan vs reality. Decide on `--size-*-em` and short aliases (absent) |
| 6 | [Primitive Usage Guides](#primitive-usage-guides) | 8 | 4/10 | **Phases 0–1 done, rest partial/not started** — Specimen Explorer fully working | CSS tab + theme spec (not started), authored MDX content, MCP exposure, `getUsageMenu()` |
| 7 | [Homepage Hero](#homepage-hero) | 7 | 7/10 | **Hero + AIPrompt done, tour visuals placeholder** | Three tour section visuals are TODO divs. Section names diverge from plan |
| 8 | [MCP Improvements](#mcp-improvements) | 7 | 7/10 | **6/9 done** — discovery, help, batch, categories, slim, clarity all shipped | `get_theming_css`, `get_global_tokens`, `get_token_usage` not implemented |
| 9 | [Icon Mappings Rebuild](#icon-mappings-rebuild) | 6 | 9/10 | **99% done** — all 5 passes executed, one bug | Duplicate key `external-link` in mappings.js (second entry shadows first) |
| 10 | [CSS Token Extraction](#css-token-extraction) | 6 | 0/10 | **Not started** — no code, prereqs not met | Implement `getThemingCSS` util + MCP tool. Rename inconsistent CSS filenames in 7 primitives |
| 11 | [Icon Stroke Width](#icon-stroke-width) | 5 | 0/10 | **Not started** | Full implementation needed (defaultState, onRendered, SVG decode, CSS) |
| 12 | [AI Content Audit](#ai-content-audit) | 5 | 7/10 | **Major issues fixed, audit partially stale** | Some audit assertions were wrong (`type: skill` is valid). Minor items remain |
| 13 | [Audit Fix Continuation](#audit-fix-continuation) | 5 | 6/10 | **~60% done** — some line refs now stale against restructured files | Remaining Pass 1 items, workflow Claude tool refs, outdated line numbers |
| 14 | [AI Folder Consolidation](#ai-folder-consolidation) | 4 | 5/10 | **Plan is obsolete** — structure diverged significantly | Plan says `ui/`, actual is `usage/`. Plan says 30 contributing files, actual 12. Rewrite or archive plan |
| 15 | [Migrate Rewriting Files](#migrate-rewriting-files) | 4 | 6/10 | **Workflows done, docs skills stalled** | 11 `docs-*` files still in `ai/docs/` with old `skill: doc-*` frontmatter format |

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

## Subtree Caching Status

**Plan:** `subtree-caching-status.md`

| Claim | Verified |
|---|---|
| `useSubtreeCache = true` | ✅ `renderer.js:32` |
| Directive reaction reuse (all 5 directives) | ✅ All check `if (this.reaction) return noChange` |
| `dataVersion` signal + recursive propagation | ✅ `renderer.js:57, 87-95` |
| Keyed each caching | ✅ `renderer.js:273` passes `key: eachKey` |
| Rerender returns `noChange` | ✅ |
| Snippet cache bypass (`cache: false`) | ❌ `evaluateSnippet()` does NOT pass `cache: false` |
| 62 tests (60 pass, 2 fail) | Outdated — actual count is **83 tests** across 5 files |
| Bug fixes (async noChange, generation counter, settings sync) | ✅ All confirmed |

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

## Icon Mappings Rebuild

**Plan:** `icon-mappings-rebuild.md`

| Pass | Status |
|---|---|
| 1: Literal Lucide (482 icons) | ✅ `pass1-{A-E}.json`, rename table applied |
| 2: Cross-library fill | ✅ `pass2-{heroicons,phosphor,tabler,material}.json` |
| 3: Aliases | ✅ `pass3-aliases-{1-5}.json` |
| 4: Dedup | ✅ `pass4-aliases-deduped.json` (45KB) |
| 5: Promote | ✅ 1 applied (`dices`→`dice`), 27 rejected with reasoning |
| Final mappings.js | ⚠️ 482 entries, correct format, **but `external-link` is a duplicate key** — first entry (lucide: `external-link`) shadowed by second (lucide: `square-arrow-out-up-right`) |

---

## CSS Token Extraction

**Plan:** `css-token-extraction.md` — **NOT STARTED**

- `tools/mcp/src/utils/get-theming-css.ts` does not exist
- No `get_theming_css` tool registered (17 tools, none theming-related)
- Prereqs unmet: `sizing-variables.css` (should be `size-variables.css`) in 7 primitives, `colored-variables.css` (should be `color-variables.css`) in 5 primitives

---

## Icon Stroke Width

**Plan:** `add-icon-stroke-width.md` — **NOT STARTED**

No `defaultState`, no `onRendered`, no `upgradeSvg()`/`decodeSvgDataUri()`, no `{#if resolved}{#html svgMarkup}{/if}` in template, no `:has(svg)` or `--icon-stroke` in CSS.

---

## AI Content Audit

**Plan:** `ai-content-audit.md`

| Issue | Status |
|---|---|
| MCP dist out of sync | ✅ Fixed — `findWorkflow` ID lookup confirmed in dist |
| Broken `sui:*` references | ✅ Fixed — cleaned from authoring files |
| `ai-create-context.md` wrong paths/audiences | ✅ Fixed |
| Files with invalid `type: doc` | Resolved — audit was wrong; `type: skill` is valid per authoring guide |

---

## Audit Fix Continuation

**Plan:** `audit-fix-continuation.md`

Sampled 5 items: 3 done, 1 outdated (line number doesn't exist — file restructured since plan), 1 partial (workflow Claude tool ref may be intentional). Plan line numbers are stale in places.

---

## AI Folder Consolidation

**Plan:** `ai-folder-consolidation.md` — **PLAN IS OBSOLETE**

| Claim | Reality |
|---|---|
| `ui/` folder with 6 files | Does not exist — files in `usage/` with different names |
| `essentials/` has 3 files | Has 2 (`overview.md`, `mental-model.md`). Missing `architecture-overview.md`, `architecture.md` |
| 30 contributing files | 12 files |
| `workflows/` has 5 subfolders | Has 2 (`contributing/`, `research/`) |
| `ai/old/` preserved | Deleted |
| No mention of `ai/docs/` or `ai/research/` | Both exist (11 and many files respectively) |

This plan should be archived — it describes a state that was never fully realized and has since diverged.

---

## Migrate Rewriting Files

**Plan:** `migrate-rewriting-files.md`

| Area | Status |
|---|---|
| MCP changes | ✅ Complete |
| All 17 workflow files have `workflow:` field | ✅ Complete |
| `ai/rewriting/` deleted | ✅ (plan said don't delete — was cleaned up anyway) |
| 11 `docs-*` skills migrated to `ai/contributing/` | ❌ Still in `ai/docs/` with old `skill: doc-*` format |
| `docs-slop-identification.md`, `docs-good-examples.md` | Gone — don't exist anywhere |

---

