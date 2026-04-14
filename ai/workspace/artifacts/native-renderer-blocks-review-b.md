# Native Renderer Blocks — Post-Landing Review

**Plan:** `ai/plans/native-renderer-blocks.md`
**Branch state:** landed, 1003 tests passing, renderer.js 1696 → 577 lines
**Reviewer:** pairing agent (extraction plan coauthor)
**Scope:** full review of `packages/renderer/src/engines/native/` post-refactor

## Gestalt

**Strong landing.** Plan fidelity is genuinely high — the two-level context bag, error machinery, per-item server markers, and block lifecycle all match the v3 spec. The code reads cleanly at every layer: `define-block.js` owns the infrastructure without leaking it, blocks are self-contained, `reactive-data.js` collapses three duplicated paths, and renderer.js is down to marker plumbing + hydration DOM walking. The error machinery is shaped for agentic iteration the way the plan promised — structured logs, hook-name attribution, graceful degradation at the right points.

Where execution diverged from the plan, it diverged honestly: the places the plan overstated (each fix 1) got the correct code rather than the planned code, with a comment explaining why.

## What landed well

### Architecture discipline
The plan named the two-level context model as the seam for blocks that need renderer internals. `template.js:182-193` uses it exactly as specified — `create()` stashes `evaluator`/`subTemplates`/`snippets`/`parentTemplate`/`dataDep` onto `self` from the dispatch-level bag; every subsequent hook reads `self.*` instead of reaching through `scope`. This is the textbook use, and it keeps the 9-key author bag honest. Block authors writing the next directive will see this pattern and know how to extend it.

### Error machinery, field-ready
`define-block.js` is where agentic iteration becomes real. The error paths that took several review rounds to converge are all present and correct:

- `create()` throw → skip mount, structured log, no retry loop (L105-112)
- `destroy()` throw → swallowed, scope disposes regardless (L239-243)
- `error` hook re-throws in dev, swallows in prod (L170)
- Hydrate-throw clears the region and falls through to `render()` in the same reaction; render success → reaction continues, render throw → disposes (L191-211)
- Render/update throw → `comp.stop()` disposes the reaction, prevents silent retry-loop (L209, L225)
- `onUpdated` auto-fires via `renderer.notifyUpdate()` after any successful DOM-writing hook (L156-160)

The `reportBlockError` emitter (L72-88) with `nodeSyntax()` template reconstruction (L35-66) produces the four-line format from the plan. Future extensions (`report()` facade, resolution trail, dedup) have a single function to extend rather than parallel pipelines.

### Per-item server markers
Landed exactly as the plan specified. `server.js:247-249` wraps `renderNodes` with `<!--sui-each-item:v1:N-->` / `<!--/sui-each-item:v1:N-->` pairs. `each.js:48-83` (`extractItemSlices`) consumes them with depth-tracking for nested blocks. The `isEmpty + elseContent` branch correctly skips per-item markers and lets hydration claim a singleton else record.

Legacy-server fallback at `each.js:322-325` preserves pre-refactor nuke-and-rerender semantics when markers aren't present — meaning the step-9 change is safe against older server outputs during rollout.

### `isItemContext` via WeakSet
`each.js:35-38` exports `isItemContext(data)` backed by a `WeakSet<Proxy>`. `template.js:5, 47` imports it and branches `unpackNodeData` on membership. This is materially cleaner than the prior `__isItemProxy` metadata flag — no proxy side channel, no underscore convention violation, explicit contract between the two modules.

### Block implementations
- **`rerender.js` (86 lines)** — smallest block, proves the shape. `create()` captures evaluator for `lookupTokenValue` (raw token lookup for the single-token `node.key` path). Clean use of the two-level bag seam.
- **`conditional.js` (146 lines)** — matchIndex 1000 preserved, mismatch-warning with env-guard exemption preserved (`isClient`/`isServer`), inner-hydration via `hydrateInnerContent` closure. Selection logic consolidated into `selectBranch` helper.
- **`async.js` (118 lines)** — state machine with generation counter for stale-promise discard. `skipLoadingRender: true` on hydrate so server-rendered loading UI persists until resolution. Clean.
- **`template.js` (331 lines)** — unifies snippet + subtemplate via kind-detection on `self.kind`. `buildSnippetProxy` for lazy-getter snippet args (the load-bearing Proxy the plan flagged explicitly). Kind detected nonreactively to avoid spurious re-entry on name expression churn. `detectKind` locks on first resolution per the plan's documented constraint.
- **`each.js` (481 lines)** — biggest block, earned it. Single `ItemRecord[]` as source of truth, `buildKeyIndex` as transient lookup, reconciliation mutates in place with position tracking via `insertAfter`. Fast-path for empty-items (L420-434) avoids reconcile overhead on the krausest "clear" benchmark.

### `lookupExpression` rename
Done at `renderer.js:101` with the comment mirroring the plan's justification ("named to mirror ExpressionEvaluator.lookupExpressionValue; 2-arg positional because it's in hot reactive loops"). Vocabulary alignment between renderer internals and block author surface — consistent across both layers.

### Signature convention, scoped
Applied to new methods (`bindBlockViaRegistry`, `hydrateBlockViaRegistry`) without scope creep into pre-existing methods (`parseAttributeParts`, `bindAttributeExpression`, `bindMarkers`, `hydrateMarkers` kept their positional signatures). This matches the review round where I raised scope-creep risk as a concern — the implementer correctly limited the convention to new surface.

## Deviations from plan

These are honest divergences, not defects. Worth capturing so the plan's analysis isn't treated as canonical against the code.

### Each fix 1 did not collapse to one path

**Plan said:** fresh-wrapper `getEachData` means `.set()` sees fresh identity, deep-equality can't short-circuit, one path no branching.

**Code says** (each.js:184-191):
```js
if (prevItem !== item || prevIndex !== i) {
  existing.itemSignal.set(eachData);
}
else if (typeof item === 'object') {
  existing.itemSignal.notify();
}
```

**Why it didn't collapse:** when `prevItem === item && prevIndex === i` but the user mutated a property in place (`items[0].name = 'new'`), both old and new `eachData` wrappers are structurally identical fresh objects. Deep-equality correctly says "no change" and `.set()` short-circuits. `notify()` is the only way to propagate that class of mutation.

The plan's analysis was incomplete — wrapper freshness solves the outer-identity short-circuit but not the same-ref-mutated-in-place case. The implementer did the right thing by retaining the branch with a clear comment.

**Follow-up:** either a future Signal option (`.set(value, { force: true })`) could genuinely collapse this, or the plan's record should be amended to reflect that fix 1 is "one path for outer-ref changes, notify() for same-ref in-place mutations — two paths, intentional." Leaving the plan's "one path, no branching" phrasing in memory risks a future agent trying to "fix" a non-bug.

### renderer.js landed at 577 lines, not under 400

Plan target: <400. Actual: 577. The overshoot is in `hydrateAttributes` (parallel ref-DOM walking, L422-482) and `hydrateBlockDirective` (marker collection + serverMeta parsing, L489-533). These paths were never going to shrink by moving blocks out — they're intrinsically mechanical DOM walking and needed to stay on the Renderer.

577 is reasonable given Lit's 528-line hand-written equivalent without hydration. Not a regression from the goal; the goal was aspirational.

### Positional hydration claim in each

`each.js:332` uses `Math.min(items.length, itemSlices.length)` to assign server slices to client items by index. The plan said "rebuilding records by key and disposing mismatches" for the count-mismatch path.

In practice: server and client run the same code with the same data, so orders agree. The positional approach is fine for real cases. But if server and client ever diverge (e.g., client mutates data between SSR and hydration, or a client-only helper changes order), positional assignment puts server-slice-0's hydrated DOM inside client-item-whatever. Keyed reconciliation would be more robust.

**Follow-up:** low priority — no known repro. Worth a test case: render a 3-item each, mutate client data between SSR serialization and hydration to swap item order, confirm hydration still produces correct content per item. If it breaks, move to keyed claiming.

## Cleanup tickets (prioritized)

### 1. Dead method: `hydrateBlockViaRegistry`
`renderer.js:346` is defined but never called. `hydrateBlockDirective` at L489 inlines the same logic. Delete lines 346-350.

### 2. Inline the thin wrapper: `bindBlockViaRegistry`
`renderer.js:339-344` wraps a four-line call and has one caller (`bindBlockDirective` L332). Either inline it into the caller or commit to the indirection for symmetry with the deleted `hydrateBlockViaRegistry`. If deleting (1), probably inline (2) too — the "ViaRegistry" naming implies a layering that doesn't exist once the hydrate equivalent is gone.

### 3. Double expression evaluation in hydrate text bindings
`reactive-data.js:182-194` (unsafeHTML hydrate) and `220-226` (safe text hydrate) both call `renderer.lookupExpression(exprNode.value, data)` twice on non-firstRun: once to register deps, once to read the value. Collapse to one call:

```js
scope.reaction(textNode, (comp) => {
  const value = renderer.lookupExpression(exprNode.value, data);
  if (comp.firstRun) { return; }
  textNode.data = value ?? '';
});
```

Minor perf — only matters for expensive expressions or high-frequency bindings. Still, one fewer redundant eval per reaction tick.

### 4. `_nodeSyntax` export with underscore prefix
`define-block.js:91` exports `nodeSyntax as _nodeSyntax` "for testing." This violates the "No Underscore Vars" convention called out in agent memory. Either rename to `nodeSyntaxForTesting` or drop the rename and just export `nodeSyntax` directly — the comment already flags it as not-public-surface.

### 5. Method names `bindBlockDirective` / `hydrateBlockDirective` retained
The plan targeted `bindBlock` / `hydrateBlock`. The methods kept the old names (renderer.js:330, 489) and delegate to `*ViaRegistry` (which as noted above, one of those is dead code). Pure naming consistency — no functional impact. If tickets 1 and 2 land, also rename the top-level methods to `bindBlock` / `hydrateBlock` to match the plan vocabulary. The "Directive" suffix reintroduces the exact terminology collision the refactor was trying to retire.

## What I'd consider for follow-up plans

### Keyed each hydration
Covered in deviation #3 above. Currently positional, plan said keyed. Not urgent but worth a test that forces divergence and a fix if it breaks.

### Signal force-notify option
Would retire each.js:184-191's branch genuinely. Out of scope for this refactor but worth a line in `@semantic-ui/reactivity`'s roadmap: `Signal.set(value, { force: true })` bypasses deep-equality short-circuit, eliminates the need for `notify()` as a public API in reconciliation code.

### Subtree cache for native
Lit's `renderTrees` + `WeakRef` pattern (lit/renderer.js:89-109) caches subtree renderers so partial updates don't re-walk the AST. Native currently caches parsed HTML (renderer.js:26) but not subtree renderers. Out of scope here; worth a dedicated plan if the each-block's per-item renderer allocations show up in profiling.

### `report()` block-author reporter
The emitter is shaped for this extension (design constraint from the plan, followed in `reportBlockError`). Next plan should add yellow-severity public `report(field, expression, message, { data, severity })` for edge cases the compiler can't catch — e.g., `{#each}` hitting a non-iterable, or `{#template}` hitting a missing name at runtime.

## Bottom line

Plan fidelity is genuinely high. The code reads cleanly. The error machinery is shaped for agentic iteration like the plan promised. Six cleanup tickets above are polish, not architecture — none block anything, most are under 10 lines.

One concern worth revisiting: each fix 1's `set()`/`notify()` branch is load-bearing, not vestigial. The plan overstated that fix; the code did the right thing. Memory should reflect the code, not the plan, so a future agent doesn't try to "fix" what isn't broken.

Good landing. Ready to build on.
