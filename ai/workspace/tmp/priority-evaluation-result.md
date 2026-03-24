# Priority Evaluation: Semantic UI Next Active Work Plans

## Evaluation Framework

A framework competing for adoption against React, Svelte, Vue, and Solid is evaluated on a compressed timeline by skeptical developers. The decisive moments are:

1. **The 30-second homepage visit** — Does this look real? Is the pitch clear? Can I see it working?
2. **The 5-minute "try it" window** — Can I get something running? Do the docs make sense?
3. **The architecture audit** — An engineering lead opens the source. Do they see a dependency they don't trust, an abstraction that leaks, or a runtime that feels like a prototype?
4. **The AI-native angle** — This framework's differentiator is agent integration. Does that actually work, or is it marketing copy over a thin layer?

Plans are rated 1-10 where 10 = "blocks a credible launch" and 1 = "nice to have, can wait for v1.1".

---

## Plan Ratings

### Plan 3: Vanilla Renderer — Priority: 10/10

This is the single most important plan and it is at 0% completion. Here is why.

Semantic UI Next's core thesis is "no build step, no dependencies, just web standards." But the entire rendering layer depends on Lit (~5.8MB in node_modules across lit, @lit, lit-element, lit-html). Every component extends `LitElement`. Every directive is a Lit `AsyncDirective`. The framework's identity claim is contradicted by its implementation. When an engineering lead doing due diligence opens `web-component.js` and sees `import { LitElement } from 'lit'`, the evaluation is over — "this is a Lit wrapper, not a framework."

Beyond optics, the Lit dependency creates real technical problems documented in Plan 1: Lit's template identity matching (strings array reference equality) is *why* the subtree cache exists. The cache is a band-aid for a problem the vanilla renderer would eliminate by design. The vanilla approach — render once, wire Signal.computed per binding, never re-render — is architecturally cleaner and makes the per-expression reactivity model that already exists the actual rendering strategy instead of a layer fighting Lit's re-render-and-diff model.

This plan also has the highest *narrative yield*: "zero dependencies" is a concrete, verifiable claim that immediately differentiates against every competitor. React has react-dom. Vue has the compiler. Svelte has the compiler. Solid has the compiler. A framework that ships as pure ESM with no external dependencies is a category of one.

### Plan 7: Homepage Hero — Priority: 9/10

The homepage is the front door. It currently has a working hero with the AI demo (good — that is the hook) but three tour sections with placeholder `<div>` content. Visitors who scroll past the hero see an unfinished page. At 7/10 complete, the remaining work is filling the tour sections with real interactive examples — this is high-leverage, relatively bounded work.

The AI coding demo is the single best piece of marketing this framework has. It demonstrates the thesis in 15 seconds. The three tour sections below it need to prove the claims the hero makes: templates are expressive, specs are real contracts, components work at runtime. Placeholder divs undermine the pitch.

### Plan 6: Primitive Usage Guides — Priority: 8/10

A developer who decides to try the framework immediately navigates to component documentation. Every primitive currently has a "usage" tab declared in frontmatter, and the Specimen Explorer (the interactive spec-driven builder) is working. But the actual usage tab content — the editorial page that teaches "how do I use a button?" — is empty. The 13 primitives all have `tabs: ['usage', ...]` but the usage landing tab has no authored content.

This is the gap between "impressive demo" and "I can actually build with this." Framework adoption lives or dies on whether developers can self-serve from docs. The auto-generated scaffold (80% of each page) means the effort-to-value ratio is excellent. The remaining CSS theming tab and MCP exposure extend value to power users and agents.

### Plan 1: Subtree Caching Evaluation — Priority: 7/10

The analysis in the evaluation response is thorough and identifies real bugs: AST identity collisions between structurally identical `{#if}` blocks, snippet cache collisions, the `dataVersion` broadcast being too coarse. These are correctness bugs, not performance optimizations. A cached `{#if}` block sharing state with a different `{#if}` block that happens to have the same AST structure is a data corruption bug that will surface in any non-trivial application.

However, this rating is contingent on Plan 3's timeline. If the vanilla renderer is built first, it eliminates the root cause (Lit's template identity matching) and most of the subtree cache complexity. The remaining `dataVersion` coarseness issues would need to be solved differently in the vanilla architecture. If the vanilla renderer is deferred, these fixes become urgent because they are blocking correctness for real applications.

### Plan 8: MCP Improvements — Priority: 7/10

The AI-native positioning is this framework's primary differentiator. The MCP server is what makes that real rather than marketing. Six of nine improvements are shipped. The three remaining — `get_theming_css`, `get_global_tokens`, `get_token_usage` — complete the CSS theming story for agents. An agent that can answer "what CSS controls `<ui-button large red>`?" closes the loop between spec-driven generation and visual customization.

This matters disproportionately because the framework's adoption thesis relies on agents being first-class consumers. If the MCP works well, every AI coding tool becomes a distribution channel. The effort remaining is bounded (three tools with clear specs) and the infrastructure is in place.

### Plan 10: CSS Token Extraction — Priority: 6/10

This is the prerequisite for the remaining MCP tools in Plan 8 — the function that walks componentSpec to CSS file paths. It requires renaming inconsistent CSS filenames across 7 primitives (a cleanup that should happen regardless) and implementing the query function. At 0% complete but well-scoped, it unblocks the MCP theming tools. Its priority derives from Plan 8's priority; it is infrastructure, not user-facing.

### Plan 4: Token Migration — Priority: 5/10

Three production primitives and ~65 docs files still use old token names via backward-compatible aliases. The aliases work, so nothing is broken. But stale references create confusion for contributors and agents reading the source, and they accumulate as technical debt that becomes harder to clean up as more code is written against the aliases.

This is a "pay down debt before launch" task. Not urgent, but important enough that doing it now avoids the inertia of carrying dead aliases into v1 where they become a permanent backward-compatibility burden.

### Plan 5: Sizing System Redesign — Priority: 5/10

Core implementation is done with clear rem/em separation. The divergence from the original plan's file structure and missing token variants (em-scale sizes, short aliases) are symptoms of normal implementation drift, not design problems. The system works as-is. The remaining items are polish that can be addressed post-launch if the current token set covers the 15 shipped primitives.

### Plan 9: Icon Mappings Rebuild — Priority: 4/10

At 9/10 complete with one known bug (duplicate "external-link" key), this is a 15-minute fix. The icon system works. The cross-library mappings are a nice-to-have for teams migrating from other icon sets. Ship it by fixing the duplicate, but don't let it take attention from higher priorities.

### Plan 2: Subtree Caching Status — Priority: 3/10

This is a tracking document for Plan 1's implementation, not work itself. The test count is outdated (doc says 83, actual is 62). Useful as a reference, but updating the doc has no impact on framework quality. Low priority — update it when Plan 1's remaining work is done.

### Plan 11: Icon Stroke Width — Priority: 3/10

Progressive SVG upgrade is a refinement. The mask-image approach works. Stroke-width control is a power-user feature that most developers won't need in their first month with the framework. This is cleanly scoped, has no dependencies on other plans, and can ship anytime in v1.x. Not a launch blocker.

### Plan 12: AI Content Audit — Priority: 2/10

Major issues (broken MCP dist, broken skill references) are already fixed. Remaining items are minor compliance nits. AI context quality matters, but the remaining work is editorial housekeeping that doesn't affect the framework or docs that users see.

### Plan 13: Audit Fix Continuation — Priority: 2/10

Continuation of Plan 12. ~60% done, but the line references are stale against restructured files, meaning someone will need to re-audit before fixing. This is maintenance work for internal tooling. It helps agents work better but has no user-facing impact.

### Plan 14: AI Folder Consolidation — Priority: 2/10

The plan is significantly outdated relative to the actual directory structure. The `ai/` folder structure is an internal organizational concern. It matters for agent effectiveness but has zero impact on framework adoption. Developers never see this directory. The MCP tools abstract over the folder structure, so even agents are partially shielded from the organization.

### Plan 15: Migrate Rewriting Files — Priority: 2/10

11 documentation-related skill files still in the wrong location with old frontmatter. Same analysis as Plans 12-14: internal tooling quality that is invisible to users and largely transparent to agents via MCP.

---

## Recommended Execution Order

### Phase 1: Foundation (do first, in parallel where possible)

| Priority | Plan | Rationale |
|----------|------|-----------|
| **10** | Plan 3: Vanilla Renderer | Eliminates the single biggest credibility problem. Once this ships, Plan 1's subtree caching bugs become moot (different architecture). Start Phase 0 (extract ExpressionEvaluator) immediately — it is risk-free refactoring that benefits both renderers. |
| **9** | Plan 7: Homepage Hero | Bounded work, high visibility. Fill tour section placeholders with real interactive examples. Can be done in parallel with Plan 3 by a different contributor. |

### Phase 2: Documentation (do second)

| Priority | Plan | Rationale |
|----------|------|-----------|
| **8** | Plan 6: Primitive Usage Guides | The auto-generated scaffold approach means high output per hour invested. Start with button, input, icon — the three primitives every developer tries first. |
| **7** | Plan 8: MCP Improvements | Complete the three remaining CSS theming tools. Depends on Plan 10. |
| **6** | Plan 10: CSS Token Extraction | Prerequisite for Plan 8's remaining tools. Rename CSS files, implement query function. |

### Phase 3: Cleanup (do third, or interleave with Phase 2)

| Priority | Plan | Rationale |
|----------|------|-----------|
| **7** | Plan 1: Subtree Caching | **Only if vanilla renderer is deferred.** If Plan 3 ships first, re-evaluate which cache bugs still apply under the new architecture. If Plan 3 is deferred, fix the AST identity collision and snippet collision bugs — they are correctness issues. |
| **5** | Plan 4: Token Migration | Clean up stale references before launch locks them in. |
| **5** | Plan 5: Sizing System | Decide which missing variants actually matter; ship the rest post-launch. |
| **4** | Plan 9: Icon Mappings | Fix the duplicate key bug. Done. |

### Phase 4: Polish (post-launch or as time permits)

| Priority | Plan | Rationale |
|----------|------|-----------|
| **3** | Plan 2: Subtree Caching Status | Update doc when the underlying work stabilizes. |
| **3** | Plan 11: Icon Stroke Width | Ship in v1.1. |
| **2** | Plans 12-15: AI Content Housekeeping | Batch these together in a single cleanup sprint. |

---

## Key Strategic Observations

**The Lit dependency is the elephant in the room.** Every plan touching the rendering layer (Plans 1, 2, 3) is entangled with Lit's template identity model. The subtree cache exists because Lit destroys DOM when it sees a new template strings array. The `dataVersion` signal exists because cached subtrees need a notification mechanism that works around Lit's re-render model. The vanilla renderer doesn't just remove a dependency — it eliminates an entire category of bugs. This is the rare case where removing code solves more problems than adding code.

**The AI story needs to be demonstrable, not just described.** The homepage demo shows an agent building UI from prompts — that is excellent. But the MCP tools that make that real for *actual* agents are incomplete (missing CSS theming query). The gap between the marketing demo and the developer reality needs to close before launch, or early adopters will feel misled.

**Documentation is the unsung launch blocker.** Framework adoption is almost never lost at the "is this technically good?" stage. It is lost at the "can I figure out how to use this in 10 minutes?" stage. The primitive usage guides (Plan 6) are the single highest-leverage documentation investment because they address the exact moment a developer decides to commit or leave.
