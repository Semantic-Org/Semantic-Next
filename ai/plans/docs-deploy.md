# Docs Release Audit — What to Ship vs. Hide

**Date:** 2025-03-25
**Branch:** `next` (750 commits ahead of `v0.17.0`, targeting `0.18.0`)
**Goal:** Identify incomplete content to temporarily remove from navigation so the site can deploy cleanly.

---

## Scope Since Last Release

The changelog shows `0.18.0` is massive — new behaviors (tooltip, escape, popup animations), compiler package extraction, spec tooling overhaul, renderer fixes for async/checked/selected, dozens of Query additions, CSS token scales, and new UI components (image, segment). 750 commits since `v0.17.0`.

---

## Summary

The documentation has **three layers of completeness**:

| Layer | Status | Action |
|-------|--------|--------|
| **Framework docs** (guides + API reference) | ~95% complete, 120+ pages | Ship as-is |
| **UI library docs** (primitives, components, behaviors, CSS) | All stubs — 0 content pages | Hide from nav |
| **Getting started section** | Mixed — core pages done, guides/ecosystems/philosophy empty | Trim sidebar |

The biggest win is that the most important content (framework guides, API reference, examples, learn tutorials) is all solid. The gaps are in the UI component library documentation and some getting-started guides.

---

## Tier 1 — Quick Wins (menu/config changes only)

These require editing `menus.js` and/or a few content files. No new content needed.

### 1. Remove "Getting Started" submenu from Start sidebar
**File:** `docs/src/helpers/menus.js` lines 310-327
**Problem:** All 4 pages are frontmatter-only stubs:
- `/ui/start/guides/index.mdx` (6 lines)
- `/ui/start/guides/using-ui.mdx` (6 lines)
- `/ui/start/guides/creating-ui.mdx` (6 lines)
- `/ui/start/guides/theming.mdx` (6 lines)

**Fix:** Comment out the "Getting Started" entry from `sidebarMenuStart`.

### 2. Remove "Ecosystems" submenu from Start sidebar
**File:** `docs/src/helpers/menus.js` lines 328-362
**Problem:** Index page (52 lines) has real content but all 7 individual framework pages are stubs:
- `vanilla.mdx`, `react.mdx`, `svelte.mdx`, `vue.mdx`, `angular.mdx`, `astro.mdx`, `next.mdx` (all 7 lines)

**Fix:** Comment out the "Ecosystems" entry from `sidebarMenuStart`. The index can stay but shouldn't be navigable.

### 3. Remove "Philosophy" submenu from Start sidebar
**File:** `docs/src/helpers/menus.js` lines 363-377
**Problem:** All 3 pages are frontmatter-only stubs:
- `/ui/start/philosophy/index.mdx` (6 lines)
- `/ui/start/philosophy/natural-language.mdx` (6 lines)
- `/ui/start/philosophy/project.mdx` (6 lines)

**Fix:** Comment out the "Philosophy" entry from `sidebarMenuStart`.

### 4. Remove "Styling" tab from UI Framework topbar
**File:** `docs/src/helpers/menus.js` lines 228-233 (topbarMenu) and lines 380-444 (sidebarMenuCSS)
**Problem:** The entire CSS section is empty:
- `/ui/css/index.mdx` (7 lines, stub)
- No token pages exist (`/ui/css/tokens/*` — 0 files)
- No concept pages exist (`/ui/css/concepts/*` — 0 files)

**Fix:** Remove `'css'` from `topbarDisplayMenu._ids` (line 189), and comment out the `css` entry in `topbarMenu` (lines 228-233). The sidebar menu definitions can stay but won't be reached.

### 5. Remove dead lesson links from Learn selection page
**File:** `docs/src/content/lessons/selection/index.mdx` lines 29-51
**Problem:** Three courses are referenced but don't exist:
- "Advanced Guide" → `/learn/311-introduction` (no lessons)
- "UI Framework" → `/learn/411-introduction` (no lessons)
- "Open Source Guide" → `/learn/511-introduction` (no lessons)

**Fix:** Remove the three `<a class="card">` blocks for courses 311, 411, 511. Keep "5 Min Quickstart" (1xx) and "Basic Guide" (2xx).

### 6. Clean up draft component guide index pages
**File:** `docs/src/pages/docs/guides/components/index2.mdx` and `index3.mdx`
**Problem:** These are alternative drafts of the component guide overview (139 and 168 lines). They aren't in any menu but are accessible by direct URL.

**Fix:** Move to `ai/trash/drafts/` or delete. They're draft variations that shouldn't be publicly routable.

---

## Tier 2 — Moderate (decide whether to show or hide entire sections)

### 7. Keep Primitives, hide Components and Behaviors tabs
**Decision:** Primitives ship — the Definition layout + SpecimenExplorer generates robust interactive pages from specs alone (types, states, variations, content controls, live preview, code output with dialect switching). Components and behaviors need authored docs to be useful.

**Components (hide):**
- 9 component MDX files (global-search, inpage-menu, mobile-menu-toggle, mobile-menu, nav-menu, panels, sidebar-toggle, theme-switcher, topbar-menu) — all frontmatter only
- These are application-level components without the same spec depth as primitives

**Behaviors (hide):**
- 2 behavior MDX files (attach, transition) — all frontmatter only
- 2 behaviors missing docs entirely (escape, tooltip)

**Fix:**
- Remove `'components'` and `'behaviors'` from `topbarDisplayMenu._ids` (line 189 of menus.js)
- Comment out their entries in `topbarMenu` (lines 240-251)
- Keep `'primitives'` — these pages are production-ready via spec generation
- Update footer links to remove Components and Behaviors

### 8. Homepage tour ribbon — 3 placeholder examples
**File:** `docs/src/pages/index.astro` lines 85-108
**Problem:** The three-part feature tour (Templates, Specs, Components) has placeholder divs instead of PlaygroundExample components.

**Options:**
- **A) Remove the tour ribbon entirely** — Comment out `<ribbon class="tour">` (lines 33-111). The proof cards and showcase sections below are complete.
- **B) Keep the copy, hide the visual column** — CSS change to hide `.tour .visual` and make `.tour .content` full-width. The text descriptions + CTA buttons are complete.
- **C) Add examples** — Requires creating 3 new PlaygroundExamples. Not a quick fix.

**Recommendation:** Option A is cleanest. The proof ribbon + showcase ribbon below it already sell the framework well.

### 9. SSR guide is minimal
**File:** `docs/src/pages/docs/guides/advanced/ssr.mdx` (36 lines)
**Problem:** Very brief. Has structure but lacks detail.

**Recommendation:** Leave as-is for now. It's in a secondary location (Advanced Usage) and has enough content to not look broken. Not worth hiding for this release.

---

## Tier 3 — Decisions (content strategy, not just hiding)

### 10. Footer links to empty sections
**File:** `docs/src/pages/index.astro` lines 161-208
**Problem:** Footer links to Primitives, Components, Behaviors, CSS Tokens, Styling Guide — all empty/missing.

**Fix:** Update footer columns to match what's actually shipping. Remove links to hidden sections.

### 11. Start page cards linking to stub content
**File:** `docs/src/pages/ui/start/index.mdx`
**Problem:** The introduction page has navigation cards that may link to primitives/components/behaviors.

**Fix:** Check and remove any cards that point to hidden sections.

### 12. "What's New" version description
**File:** `docs/src/helpers/menus.js` line 302
**Problem:** Shows `description: '0.12.0'` in the sidebar — should be `0.18.0`.

**Fix:** Update to `'0.18.0'`.

### 13. Changelog date placeholder
**File:** `CHANGELOG.md` line 12
**Problem:** Shows `xx.xx.xxxx` for 0.18.0 release date.

**Fix:** Set actual release date when shipping.

---

## Recommended Execution Order

**Phase 1 — Menu trimming (can do in one sitting):**
1. Edit `menus.js` — remove Getting Started, Ecosystems, Philosophy from `sidebarMenuStart`
2. Edit `menus.js` — remove CSS from topbar
3. Edit `menus.js` — remove Components and Behaviors from topbar (keep Primitives)
4. Edit learn selection — remove 3 dead course links
5. Delete/archive `index2.mdx` and `index3.mdx`
6. Fix version description `0.12.0` → `0.18.0`

**Phase 2 — Homepage cleanup:**
7. Remove or rework tour ribbon (placeholders)
8. Update footer links to match shipped sections (remove Components, Behaviors, CSS Tokens, Styling Guide)
9. Check start/index.mdx for dead links

**Phase 3 — Pre-deploy:**
10. Set changelog date
11. Build and verify no 404s in navigation
12. Smoke test all menu paths

---

## What Ships Well Today

- Framework guides: 46 pages across Components, Templates, Reactivity, Query, Advanced
- API reference: 80+ pages covering all packages
- Examples: 350+ interactive examples across 6 categories
- Learn: 12 complete interactive lessons (2 courses)
- Playground: Functional standalone editor
- Primitives: 13 spec-driven interactive pages via Definition layout + SpecimenExplorer
- Homepage: Hero + AI demo + proof cards + showcase (minus tour ribbon)
- Start section: Introduction, Why Semantic, Installation (4 pages), What's New, Roadmap (3 views)
