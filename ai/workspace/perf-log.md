# Perf Log — `/perf/hydrated` (100-card PerfCards)

Measurement protocol: `performance.getEntriesByName('hydration-total')[0].duration` via Chrome MCP. 3+ samples per build, hard-reload between each (`ignoreCache: true`). Discard first (cold) sample; report median of remaining.

| Target | Environment | Samples (ms) | Median | Commit | Notes |
|---|---|---|---|---|---|
| Main (reference) | Vercel prod (staging.semantic-ui.com) | 57.7, 38.7, 40.8 | **~40** | main | Shared earlier as staging reference |
| Branch pre-revert (step 9 active) | dev.semantic-ui.com (Vite dev) | 526.3, 550.2, 612.9 | **~550** | 18f4f8381 | From `hydration-perf-findings.md` bisect |
| Branch post-revert (step 9 reverted) | dev.semantic-ui.com | 142.8, 113.0, 82.6 | **~98** | 56554b43c | Cold first; ~68ms dev overhead per findings doc |
| Branch post-revert | Vercel preview (perf-native alias) | 172.2, 65, 90.9, 90.9, 102.9 | **~91** | ba8da85d9 (smoke) | Cold first; variance high; ~50ms gap to main prod |
| + Plan 04 (data-sui-bind) | dev.semantic-ui.com | 91.7, 94.3, 98.4 | **~94** | 5bb6ae3af | Dev variance masks prod gains; refRoot now lazy |
| + Plan 02 (defer removeMarkers) | dev.semantic-ui.com | 96.1, 85.1, 87.3 | **~87** | (pending) | ~7 ms off critical path; cleanup runs in next rAF |

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
