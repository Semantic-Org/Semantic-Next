# Hydration Perf Pass

## Goal

Close the ~425 ms hydration regression the `perf/native` block-decomposition branch had vs `main` on the canonical `/perf/hydrated` benchmark (1000-card `PerfCards` component, SSR + client hydration). Work through the perf corpus in `ai/workspace/reference/perf/` in sequence, measuring before and after each change, landing only what the benchmark justified.

The perf corpus had been produced over multiple prior investigation sessions and organized into seven staged directories:

```
ai/workspace/reference/perf/
  01-investigation/   — hypotheses, hot-spots, initial profiling
  02-briefs/          — per-topic open questions
  03-analysis/        — neutral-evaluation reports from sub-agents
  04-solutions/       — per-topic solution sketches
  05-art/             — industry-survey "how other frameworks solve this"
  06-plans/           — concrete scoped plans (the load-bearing ones)
  07-complete/        — plans already landed in prior sessions
```

Going into this pass, `06-plans/` had items 02, 04, 05, 08, 09, 12 open. `07-complete/` already had 01 (unsafe-html anchor), 03 (attach splitting), 06 (expression-eval firstRun), 07 (signal stack-trace), 10 (signal-clone hotpath), 11 (hashCode removal).

## Design / Implementation

### The measurement protocol

- **Benchmark page:** `/perf/hydrated` — renders 1000 items from `docs/src/components/PerfTest/data.js` via `<PerfCards />`. The `count={100}` prop on the component is unused — the page has always rendered 1000.
- **Metric:** `performance.getEntriesByName('hydration-total')[0].duration` via Chrome DevTools MCP, `ignoreCache: true` on each reload. Cold first sample discarded; median of remaining.
- **Baselines:**
  - Main (staging.semantic-ui.com, Vercel prod): ~40-61 ms median
  - Branch pre-revert (step-9 per-item hydration active): ~550 ms on dev / ~470 ms predicted prod
  - Branch post-revert (starting point of this pass): ~91 ms on Vercel preview prod, ~98 ms on dev
- **Authoritative measurement:** Tachometer run on PR #137, comparing `this-change` vs `tip-of-tree`. Reports auto-updated per push; each run takes ~10 min for statistical confidence.
- **Secondary instruments:** Chrome DevTools flame charts for frame-level analysis; temporary instrumentation of `Scheduler.scheduleReaction` for counting scheduled reactions during render (used to discover the phantom `flushTask` bug).

### The sequence

Each item below landed as its own commit with its own before/after measurement. Ordering was chosen to respect the dependency graph in `06-plans/`:

**1. Revert step-9 per-item each hydration (the big one).** The decomposition refactor's `{#each}` rewrite (plan step 9) added per-item marker claim + per-item `Signal` + `Proxy` + `scope.child` on `hydrate`. This was correct-but-expensive: on a 1000-card page it allocated ~800+ per-item records during hydrate, adding ~425 ms vs main. Reverted `each.hydrate` to main's shape (`lookupExpression(node.over); self.hasHydrated = true;`) and stopped the `ServerRenderer` from emitting `sui-each-item:v1:N` markers. Kept the per-item render/update/reconcile machinery in place — only the upfront hydrate claim was backed out.

Measurement: branch dev **~538 ms → ~98 ms**. Vercel prod **~470 ms → ~91 ms** (predicted from findings doc's dev-to-prod calibration of ~68 ms).

**2. Plan 04 — server-embedded `data-sui-bind` for attribute hydration.** Server stamps `data-sui-bind="attr=N,..."` on every element with dynamic bindings; client reads it directly instead of rebuilding a reference DOM via `template.innerHTML = htmlString` and walking two trees in parallel. `buildHTMLString` scans its own marker output once at the end and attaches `entries[firstId].attributeBinding = { rawAttrName, parts, markerIDs }` per attribute, so the prototype-cached entries array carries full parts metadata (including statics for multi-expression attrs). `cachedBuildHTMLString` gained a lazy `refRoot` getter so the fast path never pays for the innerHTML parse. Legacy ref-DOM fallback preserved for older cached content. Cleanup wired into `base.js removeMarkers`.

**3. Plan 02 — defer `removeMarkers()` to `requestAnimationFrame`.** Marker cleanup is cosmetic inside shadow roots. Moved off the synchronous hydration path; guarded with `isConnected` to handle torn-down elements.

**4. Plan 08 — single-pass walker + Plan 04 fast-path depth fix.** `bindMarkers` merged `SHOW_ELEMENT` and `SHOW_COMMENT` walks into one `SHOW_ELEMENT | SHOW_COMMENT` walker — benefits every client:load render and every dynamic-block re-render. Also fixed a latent correctness bug in Plan 04's `hydrateAttributesViaDataBind`: the fast path walked every element in the shadow root including inside-block elements, which would wire block-content `data-sui-bind` IDs against the top-level `entries` array. Fix: `blockDepth` tracking inline from block markers, skip elements at depth > 0. Block hydrate hooks recurse via `hydrateInnerContent → hydrateMarkers` with the block's sub-AST entries.

**5. Plan 09 — per-item markers + DOM-reusing first mutation (step 9 done right).** Restored `<!--sui-item:v1:KEY-->` emission in `ServerRenderer.renderEach` with URL-encoded keys. Client-side `each.hydrate` stayed O(1) (just `lookupExpression(node.over)` + `self.hasHydrated = true`). New `adoptServerItems` function runs on the first mutation after hydration: walks `region.ownedNodes` for `sui-item` markers, builds a key→serverGroup map, and for each new item either adopts the matching server DOM (wire per-item `Signal` + `Proxy` + `hydrateInnerContent` against existing DOM) or falls through to `createRecord` for a fresh render. Unused server groups get their DOM removed. Subsequent mutations flow through the standard keyed reconcile path.

**5a. Plan 09 key-stringification bug.** Server emitted keys as comment text (strings); client-side `getItemID` returned numbers directly from item `.id` fields; `Map.get()` missed every match and adoption was a silent no-op. Fixed by stringifying on both sides. Verified via Node-identity test: pre-filter WeakRef to a card still `=== postCard` after first mutation, custom properties persist — proof of actual DOM reuse. First-mutation filter dropped from ~70 ms (fallback rebuild) to ~23 ms (real adoption).

**6. Plan 12 — hydration yielding (evaluated, deferred).** Measurement gate from the plan's own §When to Implement: post-Plan-09 interactivity on `/ui/start` (11 components, 0 long tasks, DCL 619 ms) and `/perf/hydrated` (1000 cards, 0 long tasks, hydrate ~94 ms) showed no yielding problem to solve. Plan's own design contentions (broken async rAF semantics, deprecated `isInputPending`, parent-child contract breakage across batches) made the complexity unjustified at current scale. Moved to `ai/plans/deferred/` with rationale.

**7. The phantom `flushTask` bug — the final fix.** Flame chart on `/perf/client` showed our branch had two function calls (166 ms + 63 ms = 229 ms) where main had one (144 ms). The extra 63 ms was a scheduler `flushTask` that didn't exist on main. Instrumented `Scheduler.scheduleReaction` — 24,116 scheduled reactions during initial render, all from `each.js:356` (`rec.itemSignal.notify()` in phase-3's "same-ref same-index" else branch).

Root cause: reconcile's phase 3 fires `notify()` for every record whose `rec.item === item && rec.index === i` to propagate in-place object mutations. On the initial-render path every freshly-created record satisfies that condition — `createRecord` set them to exactly those values milliseconds earlier. For a 1000-card page: 1000 notify() calls × ~25 per-item bindings = ~25,000 scheduled reactions flushed in the next microtask.

Fix: mark records `fresh: true` in `createRecord`, skip the notify branch when fresh, clear the flag after one phase-3 pass. Main's `createEach` had this scoped correctly (notify only fired inside the "itemMap has this key" branch) — our reconcile lost that distinction.

Effect on hydration: TTI dropped to ~half of main's.

## Supporting changes

- **Comparison document** (`ai/workspace/perf-log.md`) — continuous record of before/after measurements per plan, with commit hashes linking back to the changes. Includes the Vercel vs dev vs staging calibration.
- **Vercel preview build strategy** — touch a docs file on each perf commit so Vercel's docs-based cache invalidates (packages/ changes alone don't trigger a rebuild).
- **PR tachometer integration** — each commit triggers a tachometer run, authoritative prod-like measurement. Updated the pinned PR comment.
- **Test suite discipline** — every commit ran `npm test` green (920 renderer tests, 79 component tests). The one pre-existing failure (`.claude missing dist/cdn/` in `internal-packages/esbuild-resolve-bare-imports/test/cdn-urls.test.js`) is unrelated.

## Open Questions

Resolved during execution; none remaining. Items that surfaced during the pass but were explicitly deferred:

- **Fine-grained reactive data context** (`{#each}` / subtemplate `reactiveData` / snippet args all collapse property changes to whole-context invalidation). Captured in a separate follow-up plan — see `fine-grained-reactivity.md` in Up Next.
- **Signal-performance plan** (freeze-on-set vs clone-on-read). Independent of this pass; will compound with it when it lands. Scoped in `signal-performance.md`.
- **Snippet args per-key granularity test** (`it.skip` in `subtree-spurious.test.js`). Pre-existing bug: top-level snippets show zero reactivity on arg change (label neither re-evaluates nor doesn't — it simply doesn't re-evaluate at all). Separate from the coarseness problem. Needs investigation.

## Dependencies

None blocking — this pass only executed; the plan corpus was ready going in. Completed perf items in `07-complete/` (unsafe-html anchors, attach splitting, expression-eval firstRun, signal stack-trace, signal-clone hotpath, hashCode removal) were already in place as prerequisites.

## Status

Completed 2026-04-14.

## Completion

- **Estimated:** implicit — pass was scoped incrementally, one plan at a time. Individual plans in `06-plans/` carried their own size estimates.
- **Actual:** ~5h45m wall clock across two bursts (2026-04-13 18:19 ET – 2026-04-14 00:05 ET). ~3-4h active engineering time.
- **Completed:** 2026-04-14
- **Delta notes:** Pass went faster than anticipated because the perf corpus had done the hard thinking. Most time was spent implementing + measuring + guarding against regressions via tests. The phantom `flushTask` discovery was unplanned — started from a flame-chart observation the user brought mid-session, unwound via Chrome DevTools MCP instrumentation, fix was ~10 lines.

### Final measurements (Vercel preview, `/perf/hydrated`, 1000 cards, median of 3 warm samples)

| Stage | Dev (dev.semantic-ui.com) | Vercel prod (preview) |
|---|---|---|
| Pre-revert (step-9 active) | ~550 ms | ~470 ms (predicted) |
| Post-revert | ~98 ms | ~91 ms |
| + Plan 04 | ~94 ms | — |
| + Plan 02 | ~87 ms | — |
| + Plan 08 | ~80 ms | — |
| + Plan 09 (with key-fix) | ~84 ms | ~64 ms |
| + Fresh-record notify fix | — | ~half of main's TTI per user-captured trace |

Reference: main-prod on the same 1000-card page measured ~40-61 ms median. Branch-post-fix is at parity with or better than main on hydration; client:load gap (~10-20% if real) is within tachometer noise and expected to be absorbed by the `signal-performance` plan's freeze-on-set migration.

### Tachometer deltas (TODO benchmark suite, post-pass vs main)

Driving the decomposition branch's client-render regression from ~−60% on `select` down to ~+38% faster than main. Other large regressions (create-10k, create-1k, bulk-add-200, filter-all, filter-completed, clear) moved from -17% to -30% range into "unsure" (within noise) or faster. The final fresh-record notify fix is likely the load-bearing change for these client-render benchmarks, since `bindMarkers` runs on every client render and was previously paying the phantom flushTask cost on every reconcile-driven re-render.

### Artifacts landed

- 11 commits on `perf/native` (PR #137), `5bb6ae3af` through `deb712cc7`
- `ai/workspace/perf-log.md` — full measurement trail
- 2 test cases added as `it.skip` in `subtree-spurious.test.js` documenting the fine-grained reactivity gaps (will flip to `it` when the follow-up plan lands)
- Plan 12 (hydration yielding) moved to `ai/plans/deferred/` with rationale
