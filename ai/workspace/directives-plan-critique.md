# Native Renderer Directive Architecture — Viability Critique

## Task

Evaluate whether the proposed refactor plan at `ai/plans/native-renderer-directives.md` is viable as described against the *actual* current state of the native renderer source. Focus on mismatches, missed constraints, and unrealistic estimates. Do not read git history — evaluate only the current code state.

Ground every claim in specific file paths and line numbers from the source. If the plan's assumptions don't hold against the real code, say so concretely.

## Plan Summary (context only — evaluate against source, not this summary)

The plan proposes decomposing `packages/renderer/src/engines/native/renderer.js` (~1700 lines) into:

- A `defineBranch` abstraction (~30-40 lines) that mirrors `defineComponent`'s shape, exposing `create`/`render`/`hydrate`/`update`/`destroy`/`error` lifecycle hooks
- Per-directive modules (`conditional`, `each`, `async`, `rerender`, `subtemplate`, `snippet`) with estimated line counts
- A slimmed renderer (~400 lines) that handles AST walk, marker dispatch, text/attr bindings, hydration pre-collection
- Automatic reactivity-tracing context (via `Reaction.setContext` / `setTrace`) on every directive's reaction
- Uniform try/catch per hook with structured agent-readable console output on throws
- Opt-in `error` hook and `report()` function for directive-authored flagging

## Questions — Evaluate Independently

**Q1 — Infrastructure fit.** Does the current renderer actually use `DynamicRegion` and a reaction-scope abstraction in the way the plan assumes? Is the per-directive state (what the plan calls `self`) genuinely separable from the renderer's own state? Identify any coupling the plan glosses over.

**Q2 — Hydration collapse.** The plan claims `hydrate()` and `render()` can collapse into the same directive path, with the renderer pre-collecting `ownedNodes` and `serverMeta` before dispatching. Is the current split between `bindBlockDirective` and `hydrateBlockDirective` (if those exist in the native renderer) actually this clean? Where does the asymmetry live today, and can it collapse without losing behavior?

**Q3 — Renderer residual responsibilities.** The plan says ~400 lines remain in `renderer.js`: AST walk, `parseHTML`, marker dispatch, text/attr bindings, hydration DOM walking. Read the current `renderer.js` and `server.js` and list the responsibilities that don't cleanly fall into either (a) the directive modules or (b) that residual. Are there orphaned behaviors the plan doesn't account for?

**Q4 — Reactivity tracing regression claim.** The plan states that the native renderer dropped reactivity tracing context that the lit renderer carried (`reactive-conditional.js:23-26`, `render-template.js:70-74`). Verify: does the native renderer genuinely omit `Reaction.setContext` / `addContext` calls that lit had? Cite specific sites.

**Q5 — Cross-directive coordination.** Are there current patterns in the native renderer where directives share state, coordinate rendering order, or depend on one another's side effects (e.g., `{#each}` rendering inside `{>subtemplate}`)? The plan assumes each directive is self-contained; list any coordination the plan's isolated-module model would break.

**Q6 — LOC estimate plausibility.** Add up the plan's proposed line budgets (renderer ~400 + define-branch ~40 + conditional 60 + each 150 + async 80 + rerender 40 + subtemplate 160 + snippet 60 = ~990). Based on what the current code actually does, are these estimates realistic? Where do they seem low or high?

**Q7 — Error output feasibility.** The plan proposes a structured log with a "resolution trail" block showing how an expression walked (`user → {id:42}; user.profile → undefined ← failed here`). This requires capturing the trail inside `ExpressionEvaluator.getDeepDataValue` on failure. Is this cheap to add, or does it require a meaningful refactor of the evaluator's hot path? Similarly, is template location (file:line:col) reliably available at render time today?

**Q8 — Any showstoppers?** Anything in the current renderer that fundamentally can't be expressed in the proposed `defineBranch` lifecycle — e.g., directive behavior that isn't cleanly create/render/update/destroy-shaped? Flag anything the plan would need to accommodate but doesn't.

## Source Files to Read

**The plan itself:**
- `ai/plans/native-renderer-directives.md`

**Native renderer (the refactor target):**
- `packages/renderer/src/engines/native/renderer.js`
- `packages/renderer/src/engines/native/server.js`
- `packages/renderer/src/engines/native/` — list the directory, read any other files present

**Reactivity infrastructure:**
- `packages/reactivity/src/reaction.js`
- `packages/reactivity/src/scheduler.js`

**Expression evaluator (for Q7 error output feasibility):**
- `packages/renderer/src/expression-evaluator.js`

**Lit directives (for reactivity-tracing comparison, Q4):**
- `packages/renderer/src/engines/lit/directives/reactive-conditional.js`
- `packages/renderer/src/engines/lit/directives/render-template.js`
- `packages/renderer/src/engines/lit/directives/` — list any others worth comparing

**Shared:**
- `packages/renderer/src/build-html-string.js`
- `packages/renderer/src/index.js`

## Output

Write the analysis to `ai/workspace/directives-plan-critique-report.md`. Structure: one section per question. For each question, lead with a direct verdict (viable / partially viable / not viable as described) and then supporting evidence from specific file:line references. End with a **Showstoppers** section listing any findings that would require material changes to the plan before execution.
