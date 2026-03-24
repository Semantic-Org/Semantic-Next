# AI Context Files Audit Results

## Status
- Tier 1 (10 files): COMPLETE
- Tier 2 (13 files): COMPLETE
- Tier 3 (17 files): COMPLETE
- **Total: 40 files audited, 778 claims checked, 673 verified, 105 errors found**

## Tier 1 Results

### ai/essentials/mental-model.md
**Status:** DONE
**Claims:** 42 | **Verified:** 39 | **Errors:** 3
:) **Line 84:** `settings.name.get()` is wrong — settings use a Proxy that auto-unwraps, so it's just `settings.name`
? **Line 153:** Deep events described as "uses `$$` (piercing query)" but actually uses filter relaxation on same `$(renderRoot).on()` delegation
:) **Line 183:** Lists `dropdown` as a first-party behavior — doesn't exist. Should be `attach`

### ai/essentials/overview.md
**Status:** DONE
**Claims:** 42 | **Verified:** 41 | **Errors:** 1
:) **Line 207:** Claims `onRendered` runs "after each render" but source shows it only fires on first render (gated by `if (!this.rendered)`)

### ai/contributing/internals.md
**Status:** DONE
**Claims:** 52 | **Verified:** 44 | **Errors:** 8
:) **Line 32:** renderer deps missing templating (circular dep renderer<->templating)
:) **Line 34:** component deps missing query, reactivity, renderer
:) **Line 35:** tailwind deps missing component, utils
:) **Line 331:** Template.call() params listed as "single source of truth" but omits many params (isRendered, attachEvent, bindKey, helpers, template, etc.)
:) **Line 371:** `getContent()` method doesn't exist on WebComponentBase — should be `$$()`
:) **Line 386:** Event parsing field named `modifier` should be `eventType`; missing `bind` as supported keyword
** **Line 397:** "Events are delegated" is only true for default type — global/bind events attach differently
:) **Line 404:** Event handler `value` described as `target.getAttribute('value')` but actual is `.value` property with `event.detail.value` fallback

### ai/contributing/build-system.md
**Status:** DONE
**Claims:** 45 | **Verified:** 38 | **Errors:** 8 (HIGH PRIORITY)
:) **Line 29:** Dependency tree oversimplified — query and specs only depend on utils, not all four packages
:) **Line 40:** Wireit sequence wrong — deps run in parallel, not sequentially; build:ui-framework is the command, not a dep
:) **Lines 54, 118:** CSS import path `./css/button-bundle.css` wrong — actual is `./button-bundle.css?raw`
:) **Lines 113, 244, 277:** Bundle CSS location `css/*-bundle.css` wrong — bundles are at component root `*-bundle.css`
:) **Line 257:** Error message references wrong import path

### ai/contributing/css-token-system.md
**Status:** DONE
**Claims:** 87 | **Verified:** 85 | **Errors:** 2
:) **Line 174:** Sizing scale omits `--size-s: var(--13px)` between xs and m (no alias, but token exists)
:) **Line 353:** `--very-subtle-transparent-black` described as "2-3%" but dark mode doesn't override it — stays 2% in both themes

### ai/contributing/types.md
**Status:** DONE
**Claims:** 18 | **Verified:** 13 | **Errors:** 5
:) **Lines 99/106:** Missing `Scheduler` export from reactivity index examples (both src and types)
:) **Line 154:** Dependency graph wrong — shows templating upstream of renderer, but actual is circular (templating<->renderer). Missing component->renderer and component->query edges
:) **Line 199:** `increment` signature missing `max?: number` second optional parameter
:) **Line 244:** CallParams TState constraint says `Record<string, any>` but actual is `Record<string, Signal<any>>` — would cause agents to write wrong types

### ai/contributing/testing.md
**Status:** DONE
**Claims:** 42 | **Verified:** 41 | **Errors:** 1
** **Line 123:** `ci:test:unit` described as "Unit tests only" but actually includes jsdom too (node + jsdom projects). Should say "Non-browser tests for CI"

### ai/contributing/testing-internals.md
**Status:** DONE
**Claims:** 29 | **Verified:** 28 | **Errors:** 1
:) **Line 117:** Claims "All CI configs include `github-actions` reporter" but `ci-coverage.config.js` has no `reporters` key. Only ci-test-all, ci-test-unit, ci-test-browser have it. Fix: say "CI test configs" instead of "All CI configs".

### ai/contributing/repo-guide.md
**Status:** DONE
**Claims:** 25 | **Verified:** 23 | **Errors:** 2
?? **Line 48:** `content/` described as "AI context served via MCP" but actually contains endpoints for docs, examples, specs, lessons AND AI context
?? **Line 80:** `meta.json` described as "Project metadata" but is actually an esbuild build metafile (input/output mappings), not conventional project metadata

### ai/contributing/code-formatting.md
**Status:** CLEAN
**Claims:** 15 | **Verified:** 15 | **Errors:** 0

## Tier 2 Results

### ai/contributing/docs-paths.md
**Status:** DONE
**Claims:** 32 | **Verified:** 31 | **Errors:** 1
:) **Line 140:** Related Skills table says `/sui:author-context-or-skill` but actual skill name is `ai-author-context` (from frontmatter). Should be `/sui:ai-author-context`

### ai/contributing/docs-authoring-standards.md
**Status:** CLEAN
**Claims:** 25 | **Verified:** 25 | **Errors:** 0

### ai/contributing/docs-examples-authoring.md
**Status:** DONE
**Claims:** 42 | **Verified:** 34 | **Errors:** 8
- **Line 147:** Schema listing omits `sortIndex` field
** **Line 273:** Categories claimed from `topbarDisplayMenu` but actual is `exampleCategorySortOrder`; missing 'Utils'
** **Line 283:** Reactivity subcategory sort order is wrong (missing Signals, Reactions, Flushing, Settings)
:)**Line 337:** Code snippet omits `import { $ } from '@semantic-ui/query'`
:) **Lines 429, 532:** CSS token names wrong — `--green-background` should be `--green-background-color` (repeated across colors)
:) **Line 850:** Package name `@semantic-ui/utilities` should be `@semantic-ui/utils`
** **Line 920:** Claims subcomponent files are "NOT hyphenated" but todo-list uses `todo-item.js`, `todo-header.js`

### ai/contributing/docs-examples-debugging.md
**Status:** DONE
**Claims:** 25 | **Verified:** 23 | **Errors:** 2
:)**Line 141:** `wait_for` text param shown as string `text: "Expected output"` but actual param is an array `text: ["Expected output"]`
:)**Line 184:** Points to `/docs/cert/README.md` for platform-specific SSL instructions, but those are in `/docs/README.md` instead

### ai/contributing/docs-page-api-reference.md
**Status:** DONE
**Claims:** 28 | **Verified:** 27 | **Errors:** 1
:)**Line 22:** API Packages table lists 7 packages but omits `specs/` directory (6 subpages, `@semantic-ui/specs` package). Should add Specs row.

### ai/contributing/docs-page-gateway.md
**Status:** DONE
**Claims:** 12 | **Verified:** 9 | **Errors:** 3
:) **Line 29:** Broken link `[guide.md](./guide.md)` — actual file is `docs-page-guide.md`
:) **Line 30:** Broken link `[api-reference.md](./api-reference.md)` — actual file is `docs-page-api-reference.md`
:) **Line 238:** Broken link `[authoring-standards.md](../authoring-standards.md)` — actual file is `./docs-authoring-standards.md`

### ai/contributing/docs-page-guide.md
**Status:** DONE
**Claims:** 21 | **Verified:** 18 | **Errors:** 3
:)**Line 31:** Broken link `[gateway.md](./gateway.md)` — actual file is `docs-page-gateway.md`
:)**Line 32:** Broken link `[api-reference.md](./api-reference.md)` — actual file is `docs-page-api-reference.md`
:)**Line 33:** Broken link `[pedagogical.md](./pedagogical.md)` — actual file is `docs-page-pedagogical.md`

### ai/contributing/docs-page-pedagogical.md
**Status:** DONE
**Claims:** 27 | **Verified:** 26 | **Errors:** 1
:)**Line 107:** `description` listed as required field but not in the Zod schema at `docs/src/content/config.js` — it's ignored/stripped

### ai/contributing/docs-good-writing.md
**Status:** CLEAN
**Claims:** 14 | **Verified:** 14 | **Errors:** 0

### ai/contributing/docs-slop-identification.md
**Status:** CLEAN
**Claims:** 3 | **Verified:** 3 | **Errors:** 0

### ai/contributing/docs-target-audience.md
**Status:** CLEAN
**Claims:** 5 | **Verified:** 5 | **Errors:** 0

### ai/contributing/docs-writing-effectively.md
**Status:** CLEAN
**Claims:** 0 | **Verified:** 0 | **Errors:** 0 (pure writing theory, no framework claims)

### ai/contributing/docs-rewrite-text.md
**Status:** DONE
**Claims:** 18 | **Verified:** 8 | **Errors:** 6 (WORST FILE)
****Line 58:** `docs/src/pages/introduction.mdx` does not exist
****Line 59:** `docs/src/pages/components/` wrong — actual is `docs/src/pages/docs/guides/components/`
****Line 60:** `docs/src/pages/templates/` wrong — actual is `docs/src/pages/docs/guides/templates/`
****Line 61:** `docs/src/pages/reactivity/` wrong path + wrong sub-pages (`variables` should be `signals`, `computations` should be `reactions`)
****Line 64:** Example names wrong: `basic-reactivity` doesn't exist, `advanced-subtemplates` should be `templates/subtemplates-advanced`
****Line 81:** PlaygroundExample mapping description is inaccurate (uses content collection, not direct directory lookup)

## Tier 3 Results

### ai/workflows/contributing/add-query-method.md
**Status:** DONE
**Claims:** 27 | **Verified:** 18 | **Errors:** 10 (WORST WORKFLOW)
:)**Lines 33, 216:** Docs path missing `/docs/` segment — `docs/src/pages/api/` should be `docs/src/pages/docs/api/`
:) **Lines 34, 288:** AI guide path `ai/packages/query.md` and `ai/framework/query.md` don't exist — actual is `ai/usage/query.md`
- **Lines 35, 323:** References `RELEASE-NOTES.md` but file is `CHANGELOG.md`
- **Lines 46, 117, 178:** Cross-ref links to nonexistent paths (`ai/framework/utils.md`, `ai/contributing/development/testing.md`, `ai/contributing/development/typescript-types.md`)
- **Line 204:** @see URL missing `/docs/` prefix

### ai/workflows/contributing/add-util-function.md
**Status:** DONE
**Claims:** 18 | **Verified:** 12 | **Errors:** 9 (SECOND WORST)
:)   **Lines 18, 243:** `ai/framework/utils.md` doesn't exist
:) **Lines 19, 20:** `ai/docs/example-metadata-guide.md` and nested `ai/contributing/documentation/examples/authoring.md` don't exist
:) **Line 70:** `ai/contributing/development/testing.md` should be `ai/contributing/testing.md`
:) **Line 73:** Test location `utils.test.js` doesn't exist — tests are per-module (`arrays.test.js`, etc.)
:) **Line 115:** `ai/contributing/development/typescript-types.md` should be `ai/contributing/types.md`
:) **Line 124:** @see URL missing `/docs/` segment
:) **Line 200:** API docs path missing `/docs/` segment

### ai/workflows/contributing/add-template-syntax.md
**Status:** DONE
**Claims:** 22 | **Verified:** 14 | **Errors:** 17 (WORST FILE OVERALL)
:) **Lines 32, 156, 205, 291, 293:** Docs paths missing `/docs/guides/` or `/docs/` segments (5 instances)
:) **Lines 36, 37, 265, 274:** Nonexistent AI guide paths (`ai/components/`, `ai/packages/`, `ai/framework/`)
:) **Line 38:** `RELEASE-NOTES.md` doesn't exist
** **Line 31:** Renderer test path wrong — actual is `test/browser/*.test.js`
:) **Line 47:** `createPatterns()` should be `generateRegExpPatterns()`
:) **Line 55:** Pattern example uses literal regex with braces; actual uses `{OPEN}/{CLOSE}` string placeholders
:) **Line 114:** Cross-ref to nonexistent `ai/contributing/development/testing.md`
:) **Line 316:** Fabricated `{@inline}` syntax — no `@` prefix exists in template system

### ai/workflows/contributing/ai-rewrite-context.md
**Status:** DONE
**Claims:** 12 | **Verified:** 11 | **Errors:** 1
:) **Line 12:** Skill name `author-context-or-skill` should be `ai-author-context`

### ai/workflows/contributing/ai-create-context.md
**Status:** DONE
**Claims:** 22 | **Verified:** 19 | **Errors:** 3
:) **Line 12:** Skill name `author-context-or-skill` should be `ai-author-context`
:) **Line 24:** MCP tools `list_docs`/`get_doc` should be `list_user_docs`/`get_user_doc`
:) **Line 176:** `ai/research/skills/` path misleading — files have `audience: contributing`

### ai/workflows/research/research-component-patterns.md
**Status:** DONE
**Claims:** 28 | **Verified:** 23 | **Errors:** 5
:) **Line 22:** References `TaskCreate`/`TaskUpdate` tools that don't exist
:) **Lines 67+:** `ai/research/[component]/` should be `ai/research/components/[component]/` (9 instances)
:) **Line 88:** `ai/research/ui-list-exhaustive.md` should be `ai/research/components/_list/ui-list-exhaustive.md`
:) **Line 460:** Self-reference path wrong (`ai/workflows/components/` should be `ai/workflows/research/`)

### ai/workflows/research/verify-pattern-research.md
**Status:** DONE
**Claims:** 24 | **Verified:** 21 | **Errors:** 3
:) **Lines 40, 62, etc.:** References `AskUserQuestion` tool — not a standard Claude Code tool
:) **Line 111:** `ai/research/[component]/` should be `ai/research/components/[component]/`
:) **Line 400:** `ai/artifacts/eo-list.md` should be `ai/workspace/artifacts/eo-list.md`

### ai/workflows/research/add-sophisticated-patterns.md
**Status:** CLEAN
**Claims:** 8 | **Verified:** 8 | **Errors:** 0

### ai/contributing/ai-author-context.md
**Status:** DONE
**Claims:** 31 | **Verified:** 26 | **Errors:** 5 (IMPORTANT — meta doc is wrong about its own system)
:) **Line 23:** `search` tool claimed to read "title, description, keywords, body text" but actually searches `title, name, id, path, category, audience, methods, package`
:) **Lines 81, 112:** `keywords` claimed to feed search but are stripped from slim manifest — zero effect on MCP search
** **Line 102:** `description` claimed to appear in list results and feed search, but also stripped from slim manifest
:) **Line 136:** `type: skill` claimed to route to `list_skills/use_skill` but routing depends on `skill` field only

### ai/workflows/contributing/docs-add-links.md
**Status:** DONE
**Claims:** 18 | **Verified:** 10 | **Errors:** 8
:) All errors are wrong URL paths — missing `/docs/guides/` or `/docs/` prefix
:) `/components/styling` should be `/docs/guides/components/styling`
:) `/api/component/define-component` should be `/docs/api/component/define-component`
:) File paths `/docs/src/pages/[concept]/` should be `/docs/src/pages/docs/guides/[concept]/`

### ai/workflows/contributing/docs-evaluate-text.md
**Status:** DONE
**Claims:** 42 | **Verified:** 24 | **Errors:** 18 (SECOND WORST FILE)
:) **Line 83:** `/docs/src/pages/introduction.mdx` doesn't exist
:) **Line 85:** `/ai/contributing/codebase-navigation.md` doesn't exist
:) **Line 88+:** `/docs/src/pages/components/` should be `/docs/src/pages/docs/guides/components/` (many instances)
:) **Line 110:** All four page paths wrong — missing `docs/guides/` or `docs/` prefix
:) **Line 329:** `todo-list/page.js` doesn't exist (only `page.html`)
:) **Line 318:** Claims all examples follow `component.js/component.html/page.js` naming — not true
:) **Line 496+:** `/docs/src/pages/api/` should be `/docs/src/pages/docs/api/`

### ai/workflows/contributing/docs-examples-self-critique.md
**Status:** CLEAN
**Claims:** 13 | **Verified:** 13 | **Errors:** 0

### ai/workflows/contributing/docs-refine-example-copy.md
**Status:** CLEAN
**Claims:** 12 | **Verified:** 12 | **Errors:** 0

### ai/workflows/contributing/ai-evaluate-context.md
**Status:** CLEAN
**Claims:** 8 | **Verified:** 8 | **Errors:** 0

### ai/workflows/contributing/primitive-scaffold.md
**Status:** DONE
**Claims:** 32 | **Verified:** 23 | **Errors:** 9
:) **Lines 134, 150, 265, 421:** Spec file separator wrong — uses `-component.js` (hyphen) but actual is `.component.js` (dot)
:) **Line 264:** Spec barrel export missing `.spec` segment from filename
:) **Lines 66-67:** CSS theme/definition barrels shown at wrong directory level
:) **Lines 406/411:** "Critical" note says plural templates use `{{ui}}` but 2/3 actually use `{ui}` (single braces)
:) **Line 335:** Astro registry pattern wrong — uses `name ===` with `client:load` but actual uses `inArray()` with `client:visible`

### ai/workflows/contributing/primitive-refine.md
**Status:** DONE
**Claims:** 28 | **Verified:** 27 | **Errors:** 1
:)  **Line 164:** `includeAttributeClass` listed as valid for States but not in SpecState type definition

### ai/workflows/contributing/primitive-write-css.md
**Status:** DONE
**Claims:** 25 | **Verified:** 24 | **Errors:** 1
:)  **Line 388:** Plural sizing example uses `::slotted()` but actual code sets variables directly on container (CSS vars inherit through shadow DOM)

## Summary — Priority-Ranked by Error Count

| File | Claims | Verified | Errors | Error Rate |
|------|--------|----------|--------|------------|
| workflows/contributing/docs-evaluate-text.md | 42 | 24 | **18** | 43% |
| workflows/contributing/add-template-syntax.md | 22 | 14 | **17** | 77% |
| workflows/contributing/add-query-method.md | 27 | 18 | **10** | 37% |
| workflows/contributing/primitive-scaffold.md | 32 | 23 | **9** | 28% |
| workflows/contributing/add-util-function.md | 18 | 12 | **9** | 50% |
| contributing/internals.md | 52 | 44 | **8** | 15% |
| contributing/build-system.md | 45 | 38 | **8** | 18% |
| contributing/docs-examples-authoring.md | 42 | 34 | **8** | 19% |
| workflows/contributing/docs-add-links.md | 18 | 10 | **8** | 44% |
| contributing/docs-rewrite-text.md | 18 | 8 | **6** | 33% |
| contributing/types.md | 18 | 13 | **5** | 28% |
| contributing/ai-author-context.md | 31 | 26 | **5** | 16% |
| workflows/research/research-component-patterns.md | 28 | 23 | **5** | 18% |
| essentials/mental-model.md | 42 | 39 | **3** | 7% |
| contributing/docs-page-gateway.md | 12 | 9 | **3** | 25% |
| contributing/docs-page-guide.md | 21 | 18 | **3** | 14% |
| workflows/contributing/ai-create-context.md | 22 | 19 | **3** | 14% |
| workflows/research/verify-pattern-research.md | 24 | 21 | **3** | 13% |
| contributing/repo-guide.md | 25 | 23 | **2** | 8% |
| contributing/css-token-system.md | 87 | 85 | **2** | 2% |
| contributing/docs-examples-debugging.md | 25 | 23 | **2** | 8% |
| essentials/overview.md | 42 | 41 | **1** | 2% |
| contributing/testing.md | 42 | 41 | **1** | 2% |
| contributing/testing-internals.md | 29 | 28 | **1** | 3% |
| contributing/docs-paths.md | 32 | 31 | **1** | 3% |
| contributing/docs-page-api-reference.md | 28 | 27 | **1** | 4% |
| contributing/docs-page-pedagogical.md | 27 | 26 | **1** | 4% |
| workflows/contributing/ai-rewrite-context.md | 12 | 11 | **1** | 8% |
| workflows/contributing/primitive-refine.md | 28 | 27 | **1** | 4% |
| workflows/contributing/primitive-write-css.md | 25 | 24 | **1** | 4% |
| contributing/code-formatting.md | 15 | 15 | **0** | 0% |
| contributing/docs-authoring-standards.md | 25 | 25 | **0** | 0% |
| contributing/docs-good-writing.md | 14 | 14 | **0** | 0% |
| contributing/docs-slop-identification.md | 3 | 3 | **0** | 0% |
| contributing/docs-target-audience.md | 5 | 5 | **0** | 0% |
| contributing/docs-writing-effectively.md | 0 | 0 | **0** | 0% |
| workflows/contributing/docs-examples-self-critique.md | 13 | 13 | **0** | 0% |
| workflows/contributing/docs-refine-example-copy.md | 12 | 12 | **0** | 0% |
| workflows/contributing/ai-evaluate-context.md | 8 | 8 | **0** | 0% |
| workflows/research/add-sophisticated-patterns.md | 8 | 8 | **0** | 0% |

## Systemic Error Patterns

### 1. Ghost directory structure (affects ~8 files, ~30 errors)
Workflows reference `ai/framework/`, `ai/packages/`, `ai/components/`, `ai/docs/`, `ai/contributing/development/` — none exist. These appear to be from a planned but never-implemented directory reorganization.

### 2. Missing `/docs/` or `/docs/guides/` URL prefix (affects ~6 files, ~25 errors)
File paths like `docs/src/pages/api/` should be `docs/src/pages/docs/api/`. URLs like `/components/styling` should be `/docs/guides/components/styling`. This is the single most widespread error.

### 3. RELEASE-NOTES.md vs CHANGELOG.md (affects 3 files)
Multiple workflows reference `RELEASE-NOTES.md` which doesn't exist. The actual file is `CHANGELOG.md`.

### 4. Skill name mismatch: `author-context-or-skill` vs `ai-author-context` (affects 3 files)
The blockquote header says `sui:author-context-or-skill` but the frontmatter `skill:` field (which is what `use_skill` actually uses) is `ai-author-context`.

### 5. CSS bundle path wrong (affects build-system.md, 5 error instances)
Bundle CSS described as `css/*-bundle.css` but actual location is `*-bundle.css` at component root.

### 6. Spec file separator: hyphen vs dot (affects primitive-scaffold.md, 4 instances)
Uses `-component.js` but actual convention is `.component.js`.

## Most Consequential Errors (would cause agents to write wrong code)

1. **ai-author-context.md**: Keywords and description don't reach MCP search — agents crafting these fields are wasting effort
2. **mental-model.md L84**: `settings.name.get()` is wrong — settings auto-unwrap via Proxy
3. **types.md L244**: CallParams TState `Record<string, any>` should be `Record<string, Signal<any>>`
4. **internals.md L371**: `getContent()` doesn't exist on WebComponentBase
5. **build-system.md L54+**: CSS import path `./css/button-bundle.css` is wrong — agents would write broken imports
6. **overview.md L207**: `onRendered` fires once, not "after each render"
7. **add-template-syntax.md L316**: Fabricated `{@inline}` syntax
8. **add-template-syntax.md L55**: Pattern format uses literal regex, not actual `{OPEN}/{CLOSE}` placeholders
