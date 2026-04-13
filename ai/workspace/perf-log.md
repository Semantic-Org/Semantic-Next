# Perf Log — `/perf/hydrated` (1000-card PerfCards)

> Page renders all items from `docs/src/components/PerfTest/data.js`
> (1000 items). The `count={100}` prop on `<PerfCards />` is not
> consumed by the component. Earlier findings doc referenced "100 cards"
> but measurements have always been against the full 1000-card payload.


Measurement protocol: `performance.getEntriesByName('hydration-total')[0].duration` via Chrome MCP. 3+ samples per build, hard-reload between each (`ignoreCache: true`). Discard first (cold) sample; report median of remaining.

| Target | Environment | Samples (ms) | Median | Commit | Notes |
|---|---|---|---|---|---|
| Main (reference) | Vercel prod (staging.semantic-ui.com) | 57.7, 38.7, 40.8 | **~40** | main | Shared earlier as staging reference |
| Branch pre-revert (step 9 active) | dev.semantic-ui.com (Vite dev) | 526.3, 550.2, 612.9 | **~550** | 18f4f8381 | From `hydration-perf-findings.md` bisect |
| Branch post-revert (step 9 reverted) | dev.semantic-ui.com | 142.8, 113.0, 82.6 | **~98** | 56554b43c | Cold first; ~68ms dev overhead per findings doc |
| Branch post-revert | Vercel preview (perf-native alias) | 172.2, 65, 90.9, 90.9, 102.9 | **~91** | ba8da85d9 (smoke) | Cold first; variance high; ~50ms gap to main prod |
| + Plan 04 (data-sui-bind) | dev.semantic-ui.com | 91.7, 94.3, 98.4 | **~94** | 5bb6ae3af | Dev variance masks prod gains; refRoot now lazy |
| + Plan 02 (defer removeMarkers) | dev.semantic-ui.com | 96.1, 85.1, 87.3 | **~87** | 631253aa4 | ~7 ms off critical path; cleanup runs in next rAF |
| + Plan 08 (single-pass walker + fast-path depth fix) | dev.semantic-ui.com | 95.6, 79.3, 67.6 | **~80** | d82e2828a | bindMarkers merges SHOW_ELEMENT + SHOW_COMMENT; hydrate fast path respects block depth |
| + Plan 09 (per-item markers + DOM-reusing first mutation) | dev.semantic-ui.com | 83.3, 83.8, 95.6 | **~84** | 907188416 | Hydrate cost unchanged (O(1) per item preserved). First-mutation filter 1000→114 cards ~70 ms (down from estimated ~150-200 ms nuke-and-rebuild). |

### Plan 12 — evaluated, skipped

Measurement gate per plan's own §When to Implement: if post-paint interactivity is within acceptable thresholds after plans 01-09, the complexity (broken async rAF, parent-child cross-batch contract risk, deprecated `isInputPending`) isn't justified.

- `/ui/start` (11 hydrated components, Vite dev): **0 long tasks**, DCL 619 ms, load 620 ms.
- `/perf/hydrated` (1 component, 1000 cards, Vite dev): **0 long tasks**, hydrate ~94 ms.

No measurable yielding problem. Deferred indefinitely. Revisit if a future page pushes hydration past the long-task threshold (50 ms per PerformanceObserver) AND `scheduler.yield()` adoption stabilizes in non-Chromium browsers.

## Summary — Vercel preview (prod-like) after all plans

Measured against the `perf/native` deploy on Vercel preview, 1000-card PerfCards:

| | Samples (ms) | Median |
|---|---|---|
| Baseline (post-revert, pre-Plan-04) | 172.2 (cold), 65, 90.9, 90.9, 102.9 | ~91 |
| **After Plans 04 + 02 + 08 + 09** | 326.8 (cold), 92.4, 45.6, 64 | **~64** |

~30% improvement on Vercel prod at the 1000-card payload. The originally-captured "~40 ms on main" measurement used the same `/perf/hydrated` URL, but the earlier findings doc described it as "100 cards" — the page has always rendered 1000 items from `data.js` (the `count={100}` prop on `<PerfCards />` is unused).

**Re-measured main on the same 1000-card payload (staging.semantic-ui.com):** 43.2, 73.9, 61.4 → median ~61 ms. Branch post-plans: 92.4, 45.6, 64 → median ~64 ms. **Within measurement noise of main.** The perf regression the decomposition PR carried has been closed on this benchmark.

Remaining gap (if any) likely sits in cost classes none of these plans target (expression-evaluator fast-path for simple identifier lookups, hash/clone hot paths, Signal constructor overhead per item) — all already in the `07-complete/` corpus if a future page pushes the budget. Tachometer on PR #137 will confirm the statistical picture.

## Plan milestones — target trajectory

Per `ai/workspace/reference/perf/06-plans/` on PerfCards benchmark:

| Plan | Est. hydration (prod) | Key mechanism |
|---|---|---|
| Post-revert (now) | ~91 ms | Baseline |
| + Plan 04 (`data-sui-bind`) | ~40-60 ms | Eliminate reference DOM build + parallel walk |
| + Plan 02 (defer removeMarkers) | ~35-55 ms | ~6ms moves off critical path |
| + Plan 08 (single-pass walker) | ~30-50 ms | Single TreeWalker instead of two |
| + Plan 09 (per-item markers + DOM reuse) | ~30-50 ms hydration, **~60 ms first mutation** (down from ~200) | Shifts benefit to first-interaction latency |
| + Plan 12 (hydration yielding, conditional) | same | Page-level responsiveness under multi-component load |

Target after full perf sweep: **<50 ms hydration on Vercel prod**, matching main's ~40 ms and surpassing on larger pages.

---

## Measurement notes

- Cold first sample is ~50-80ms higher than subsequent. Browser JIT warm-up + connection setup. Always discard.
- Vercel preview URL `semantic-next-git-perf-native-semantic-ui.vercel.app` tracks `perf/native` branch head. Build takes ~10 min from commit.
- Local dev (dev.semantic-ui.com) adds ~68ms overhead per findings doc. Subtract when predicting prod from dev numbers.
- Tachometer on PR comment at https://github.com/Semantic-Org/Semantic-Next/pull/137 is the authoritative committed measurement. Updates automatically on each push. ~10-15 min per run for statistical confidence.
