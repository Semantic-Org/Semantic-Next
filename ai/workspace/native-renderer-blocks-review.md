# Native Renderer Blocks — Post-Landing Review

> **Context for the downstream agent.** `ai/plans/native-renderer-blocks.md` landed across ~18 commits ending with `33b84d279`. This document is a review from the agent that coauthored the plan with the user, after reading the resulting code end-to-end and running the suite (932 tests, 5.44s, all green). The plan itself is the spec; this document is a delta between spec and implementation, plus an ordered list of concerns the user has asked you to consider.
>
> Nothing here is a bug report against a working system — the tests pass. These are either **spec promises the implementation weakens** (load-bearing), **honest estimation misses** (informational), or **judgment-call improvements the implementation made** (worth acknowledging so they stay that way).

## What shipped vs. what the plan predicted

| Area | Plan | Implementation | Notes |
|------|------|----------------|-------|
| `define-block.js` | ~200 lines, hooks + error emitter + `hydrateInnerContent` helper | 259 lines at `packages/renderer/src/engines/native/define-block.js` | Faithful. All 7 error-handling items from §Error Machinery are present. |
| `renderer.js` | **under 400 lines** | **577 lines** | Estimation miss — see §1 below. |
| `each.js` | ~250 lines, 6 of 7 fixes | 481 lines at `packages/renderer/src/engines/native/blocks/each.js` | Legacy-server fallback + mismatch recovery weren't fully scoped; realistic post-hoc. |
| `template.js` | ~180 lines, `unpackNodeData`, keep `inlineSnippet` on renderer | 331 lines, **snippet dispatch merged into template.js** | Commit `c30e3cd92` deliberately unified snippet + subtemplate into one block. **Better than spec** — see §Improvements. |
| `blocks/snippet.js` (plan) | plain function file | **removed** | Dissolved into `template.js`. |
| ServerRenderer per-item markers | `server.js:225-250` emission point | Exactly there — `server.js:237-249` | Spec-faithful. |
| Benchmark decision (step 1) | tachometer, decision rule by tiered threshold | `bench/tachometer/signature.js` + `ai/workspace/signature-benchmark-analysis.md` | Honest execution. Destructured is 9–28% slower per-call at 95% CI but amortizes to <1% at real render scales. Stayed destructured per plan's 1–3% judgment band. |
| Tests | ~721 browser + unit green | 932 green, 5.44s | Larger net than the plan listed — new `lifecycle-promises.test.js` (17), new `component-contract.test.js` (54), SSR hydration (79). |

## Improvements the implementation made beyond spec (worth preserving)

1. **Snippet + subtemplate unified into `template.js`** (`c30e3cd92`). The plan had them in separate files with parallel registration paths. The unification is a straight simplification — one resolution path, one dispatcher, same behavior. Don't revert this.

2. **`isClient`/`isServer` exempt from hydration mismatch warning** (`blocks/conditional.js:75-83`). The plan's mismatch-warning behavior would have spammed the console for every legitimate environment-guard use. The exemption is a targeted carve-out with correct reasoning — keep it.

3. **Empty-items fast path in each update** (`blocks/each.js:420-434`, commit `6daa0c414`). Skips the reconcile loop + keyIndex Map allocation when `items.length === 0`. Targeted at the krausest "clear" benchmark with 1000-item tear-down. Comment at line 416-419 names the benchmark. Well-scoped perf improvement.

4. **`createCache` extracted to `@semantic-ui/utils`** (`ebd3adfda` + `33b84d279`). Factored out the parse/clone cache pattern into a reusable utility. Clean post-refactor follow-up.

## Concerns, ordered by load-bearing-ness

### 1. Each-block hydration doesn't verify key identity during claim (LOAD-BEARING)

**What the plan promised** (§ServerRenderer, line ~477 in the plan):

> Hydration consumer: `EachBlock.hydrate` walks `region.ownedNodes`, scans for `sui-each-item:v1:N` comment pairs, builds one `ItemRecord` per pair, recursively hydrates inner markers within each item via the shared `hydrateInnerContent` helper.

And (§ServerRenderer, earlier):

> **Mismatch between server index and client key is handled by `EachBlock.hydrate` rebuilding records by key and disposing any that don't match.**

**What the code does** (`blocks/each.js:332-399`):

Positional 1-to-1 claiming. `claimCount = Math.min(items.length, itemSlices.length)`, then for each `i < claimCount`: claim `itemSlices[i]` as the DOM for `items[i]`. No key comparison. Server-extras get removed, client-extras get fresh-rendered.

**The gap.** If server renders `items=[A, B, C]` and client arrives with `items=[A, C, B]` (same set, different order — e.g., due to a sort that runs on the client before first reactive flush), the positional claim gives `C` the DOM that was rendered for `B`, and `B` the DOM that was rendered for `C`. The `itemSignal` carries the client-side `eachData` (correct), so subsequent reactive updates eventually sync. But:

- First paint shows the wrong DOM at each position until signals propagate
- Any direct DOM reads (e.g., `el.focus()`, scroll position, animation state) before the first update hit stale content
- Static content (text nodes inside the item that don't reference item data — e.g., `<li><icon/> {item.name}</li>` where `<icon/>` is static) may be correct, but any animation/focus/scroll state is attached to the wrong record

**Reproduction sketch** (worth turning into a test):

```html
<!-- server renders with one order -->
<ul>
  {#each items}
    <li>{name} ({id})</li>
  {/each}
</ul>

<!-- client arrives with same set, different order -->
<!-- e.g., createComponent sorts items during setup -->
```

Mount, then inspect `document.querySelectorAll('li')` after `renderer.bumpDataVersion()` hasn't fired yet. If rendering is correct, each `<li>` text matches its item. If not, texts are shuffled.

**What the fix shape probably is** (don't take this as prescriptive — the user may have a better idea):

1. During `hydrate`, extract item slices as today.
2. Build a `Map<key, slice>` by reading keys from the inner content. This requires either (a) the server emitting keys in the marker (`<!--sui-each-item:v1:2:k=abc-->`) which is a marker format change, or (b) the client evaluating `getItemID` against the hydrated content before claiming — which requires hydrating item deps before knowing the identity, chicken-and-egg.
3. Simpler alternative: positional claim is correct when orders match, and when they don't, fall back to nuke-and-rerender (current behavior for legacy servers). Detect mismatch by comparing server-slice count to client-item count AND sampling a couple of key expressions — if any disagree, discard slices and fresh-render.

The plan's original phrasing ("rebuilding records by key and disposing any that don't match") assumed keys were somehow available on the server side. They aren't in the current marker format. The honest path is probably to either extend the marker format to include keys (breaking-ish — but versioned `v2`) or detect mismatch and fall back.

**Priority.** High enough to address before marking the plan "complete" in a production-quality sense. Low enough that no real-world template seems to hit it today (hence the green test suite).

### 2. `evaluateText` silent no-op deviates from spec (minor)

**Plan** (§defineBlock contract): "The walker errors if it encounters a block type without the static."

**Code** (`renderer.js:309-312`): silent no-op (empty-string concat) if the block lacks `evaluateText`.

**Impact.** Putting `{#async}` or `{#rerender}` inside `<script>`/`<style>`/`<textarea>` produces empty output with no dev signal. Forgiving in prod, invisible when a developer has a bug.

**Fix shape.** Add a dev-mode warning at the registry lookup site:

```js
if (isDevelopment && !block?.evaluateText) {
  console.warn(`[SUI] {#${node.type}} is not allowed inside raw-text contexts (script/style/textarea/title)`);
}
```

### 3. `rerender.js` duplicates dep-registration across hooks (minor, DRY)

`blocks/rerender.js:34-45`, `47-53`, `70-81` — render / hydrate / update all have the same `Reaction.guard(...)` + `lookupExpression(...)` block. Three near-identical copies.

**Fix shape.** Extract a `registerDeps({ node, data, lookupExpression, self })` helper at module top and call it from each hook. 5-line change. Not urgent.

### 4. Line-count drift (informational, not a concern to fix)

- `renderer.js` 577 lines vs. plan's < 400 target. Bulk of overage: `hydrateAttributes` (~60 lines of parallel ref/real TreeWalker), `hydrateBlockDirective` (~45 lines of depth-tracking marker walk), `hydrateInnerContent` (~20 lines).
- `each.js` 481 lines vs. plan's ~250 target. Bulk of overage: hydrate mismatch-recovery (~90 lines) that wasn't scoped in the plan.

Nothing to fix; flagging because estimates were off, which is data for future plan sizing.

### 5. `MEMORY.md` line count was stale (already updated)

Said 740 lines; actual 577. Fixed in the MEMORY update that accompanies this review.

## Suggested order of operations for the downstream agent

1. **Read the plan end-to-end** (`ai/plans/native-renderer-blocks.md`). This review is a delta, not a substitute.
2. **Read `ai/workspace/signature-benchmark-analysis.md`**. It's a model for how to reason about perf decisions in this codebase and explains why destructured won despite the per-call delta.
3. **Reproduce the each-hydration order-mismatch scenario** (§1 above). Confirm the bug is real via a targeted test before deciding on the fix shape. If the test doesn't reproduce, the plan's promise may already hold for reasons I missed — worth knowing.
4. **Discuss the fix shape with the user** before implementing. The choices (marker format extension vs. mismatch-detect fallback) have different upgrade stories and the user has opinions on versioning/breaking changes.
5. **Items §2 and §3 are small, safe follow-ups** that don't need plan-level alignment — propose and land them if time permits.
6. **Don't revert the improvements in §Improvements.** They're better than the original spec.

## Running the relevant tests

```bash
cd packages/renderer && npm test
```

5.44s for the full 932-test suite. Each-hydration tests live in `test/browser/subtree-each.test.js` (24 tests) and `test/browser/ssr-hydration.test.js` (79 tests). Both are load-bearing regression targets for §1.

## Contact / provenance

Review authored after reading:
- All files under `packages/renderer/src/engines/native/`
- `ai/plans/native-renderer-blocks.md`
- `ai/workspace/signature-benchmark-analysis.md`
- Commits `99d0f1d6e..33b84d279` (the 18-commit landing arc)
- Full test run output

Plan and review same author agent; the user coauthored the plan and directed the scope.
