## Task: Prioritize the active work plans for a new open source web component framework

Read this brief fully, then evaluate each plan independently and assign a priority rating from 1–10 based on what matters most for a framework competing with React, Svelte, Vue, and Solid for developer adoption.

### Context

Semantic UI Next is a ground-up rewrite of Semantic UI — a major open source UI framework (50k+ GitHub stars on v1). The new version is:

- **Runtime-only** — no compile step. Proxy-based expression evaluator, runtime AST.
- **Real web components** with Shadow DOM. Works in any framework.
- **Signals-based reactivity** — per-expression, not per-component (closer to Solid than React).
- **Currently uses Lit** as the rendering layer (tagged template literals, directives).
- **Ships a full design system** — `<ui-button>`, `<ui-input>`, etc. with a spec system that serves as an API contract for AI agents.
- **Has an MCP server** for AI agent integration — agents can query component specs, examples, documentation.
- **Tailwind works inside Shadow DOM** via runtime WASM compilation.
- **Documentation site** built with Astro, includes interactive examples.

The framework is pre-launch. It needs to ship a compelling v1 that earns developer trust and adoption against entrenched incumbents.

### The Plans

Each plan below includes: what it does, how complete it is (0–10), and what remains. Evaluate priority purely on strategic value to the framework's success.

---

**Plan 1: Subtree Caching Evaluation (4/10 complete)**
Deep architectural analysis of the rendering cache. The cache prevents DOM destruction when parent components re-render (Lit's template identity matching). Currently: cache works at the basic level, but structural directives (each, conditional, async) don't properly track data changes in cached subtrees. The "dataVersion" signal that notifies cached subtrees is too coarse — it fires all expressions on any change, causing unnecessary re-renders and breaking async content preservation. Remaining: wire dataVersion into structural directives, add Reaction.guard to async, fix positional keying.

**Plan 2: Subtree Caching Status (8/10 complete)**
Implementation tracker for the caching work. 83 tests passing across 5 files. Core architecture confirmed working. One doc claim (snippet cache bypass) not actually in code. Test count in doc is outdated.

**Plan 3: Vanilla Renderer (0/10 complete)**
Replace the Lit rendering layer with a zero-dependency vanilla DOM renderer. Would remove the only external dependency from the core framework. Three phases: extract shared expression evaluator, build VanillaRenderer using Signal.computed for all bindings, build VanillaWebComponent extending HTMLElement directly instead of LitElement. The framework's per-expression reactivity model already does the work that makes virtual DOM unnecessary — the vanilla renderer would make that explicit. Not started.

**Plan 4: Token Migration (6/10 complete)**
Migration of CSS design tokens after a sizing system rework. New token infrastructure complete (--margin-*, --padding-*, --Xpx utilities). Backward-compatible aliases in place. But ~3 production primitives and ~65 docs files still reference old token names through the aliases instead of canonical new names.

**Plan 5: Sizing System Redesign (7/10 complete)**
Reorganization of sizing/spacing/padding/margin tokens with clear rem (layout rhythm) vs em (component-local) separation. Core implementation done but diverged from the original plan's file structure. Some planned token variants (em-scale sizes, short aliases) were not implemented.

**Plan 6: Primitive Usage Guides (4/10 complete)**
Documentation pages for each UI primitive with an interactive Specimen Explorer (spec-driven component builder with live preview, dialect toggle, code generation). Phases 0–1 done (tab plumbing + Specimen Explorer working). Remaining: CSS theming tab with auto-extracted variable reference, authored editorial content, MCP exposure for agents, framework import snippets.

**Plan 7: Homepage Hero (7/10 complete)**
Landing page content. Hero section with "The UI Framework for the AI Era" headline and an animated AI coding demo (4-step simulation showing an agent iteratively building UI). Hero + AI demo fully working. Three tour sections below have structure/scroll tracking but visual content is placeholder divs.

**Plan 8: MCP Improvements (7/10 complete)**
Nine improvements to the AI agent integration layer. Six shipped: content relationship linking, help tool, batch fetching, category discovery, slim responses, skill/context clarity. Three remaining: get_theming_css (query CSS variables controlling component styling), get_global_tokens (design token lookup), get_token_usage (reverse lookup — which components use a token).

**Plan 9: Icon Mappings Rebuild (9/10 complete)**
Rebuild of the icon system from a curated 482-icon Lucide list with cross-library mappings (Phosphor, Tabler, Material, Heroicons). All 5 pipeline passes complete. One bug: duplicate key "external-link" in mappings.js where second entry shadows first.

**Plan 10: CSS Token Extraction (0/10 complete)**
MCP tool that maps HTML attributes to the CSS files controlling them. Would let agents answer "what CSS controls `<ui-button large red>`?" by walking componentSpec → optionAttributes → CSS file paths → actual CSS content. Prerequisite: rename inconsistent CSS filenames across 7 primitives. Not started.

**Plan 11: Icon Stroke Width (0/10 complete)**
Progressive SVG upgrade for the icon component. Currently icons render via CSS mask-image (no JS needed). Plan: after mount, decode the data URI back to real SVG markup and inject it, enabling CSS control over stroke-width via custom property. Not started.

**Plan 12: AI Content Audit (7/10 complete)**
Compliance audit of AI context files against authoring guidelines. Major issues fixed (broken MCP dist, broken skill references). Some audit assertions were themselves wrong. Minor items remain.

**Plan 13: Audit Fix Continuation (6/10 complete)**
Detailed checklist of remaining fixes from the audit. ~60% done but some line references are stale against files that were restructured since the plan was written.

**Plan 14: AI Folder Consolidation (5/10 complete)**
Reorganization of the ai/ directory into audience-first folders. Plan is significantly outdated — actual structure diverged (different folder names, different file counts, folders the plan doesn't mention).

**Plan 15: Migrate Rewriting Files (6/10 complete)**
Migration of old AI context files to new structure. Workflow files fully done. 11 documentation-related skill files still in wrong location with old frontmatter format.

---

### What To Evaluate

For each plan, assign a priority from 1–10 considering:

1. **Framework credibility** — What does a developer evaluating this framework need to see to take it seriously against React/Svelte/Vue/Solid?
2. **Technical foundation** — What architectural work, if deferred, creates compounding problems later?
3. **Adoption multiplier** — What work has disproportionate impact on developer onboarding or AI agent effectiveness?
4. **Completion leverage** — For partially-done work, how much value is unlocked by finishing vs. the effort remaining?
5. **Launch readiness** — What blocks a credible public launch?

Write your analysis and ratings to `/home/jack/semantic/next/ai/workspace/tmp/priority-evaluation-result.md`. Include a brief rationale for each rating (2-3 sentences max) and a recommended execution order.
