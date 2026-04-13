# Hydration perf — session findings

> Shared storage of perf measurements, diagnostics, and intermediate conclusions from the `feat/native-simplify` perf investigation. Any agent picking up this thread should read this before re-measuring. The each.js bisect is one sub-investigation inside the broader inquiry, not the whole of it.

## Context

- Branch `feat/native-simplify` (block-decomposition refactor) ships materially slower hydration than main for identical pages.
- Primary measurement page: `/perf/hydrated` — 100 `PerfCards` SSR'd then hydrated. Measured via `performance.getEntriesByName('hydration-total')[0].duration` (page-start → `el.template` defined).
- Secondary page: `/perf/client` — same components rendered fresh client-side, no SSR. Marks `client-render` and `client-paint`.
- Target: staging (main) reports **~45 ms** hydration. PR goal is to close that gap.

## Key findings

1. **buildHTMLStringPure was rebuilt + reparsed per recursive hydrate.** `hydrateAttributes` called `buildHTMLStringPure(contentAST)` then `innerHTML = htmlString` on every recursion. Profile via Google DevTools AI on a PR Vercel trace flagged `innerHTML = a` at **~648 ms self-time** — the dominant hotspot.
2. **Fix `c9c731838`** memoizes both the string result and the pre-parsed `<template>.content` by AST identity (module-level `WeakMap`). AST is immutable after reaching the Renderer, so the cache is correct by construction.
3. **Cache is saturated on the test page** — 99.94% hit rate (10146 hits / 6 misses). Only six unique AST subtrees exist for the 100-card page shape.
4. **Cache fix recovers ~248 ms on dev** (786 → 538). Absolute gap to staging remains open. The remaining ~500 ms on dev is **not** in build/parse — something else in hydration holds it.
5. **PR Vercel post-fix is pending** — commit landed locally; Vercel preview rebuild needed before apples-to-apples with staging.

## Measurements

### `/perf/hydrated` (SSR + hydration)

| Environment | Build | Samples (ms) | Median |
|---|---|---|---|
| staging.semantic-ui.com (main) | Vercel prod | 46.1, 35.4, 44.7 | **~45** |
| Vercel PR preview (pre-cache-fix) | Vercel prod | 735.2, 717.7, 689.0 | **~718** |
| dev.semantic-ui.com (PR, pre-cache-fix) | vite dev | 785.9, 865.8, 737.0 | **~786** |
| dev.semantic-ui.com (PR, **post-cache-fix** `c9c731838`) | vite dev | 526.3, 550.2, 612.9, 484.1 | **~538** |

### `/perf/client` (pure client render)

| Environment | Build | render (ms) | render median | paint (ms) | paint median |
|---|---|---|---|---|---|
| staging.semantic-ui.com (main) | Vercel prod | 300.9, 290.3, 249.8, 286.9 | **~288** | 380.5, 387.7, 309.9, 343.6 | **~362** |
| dev.semantic-ui.com (PR, pre-cache-fix) | vite dev | 646.8, 913.6, 883.9, 865.1 | **~875** | 805.9, 1916.7, 1909.4, 1875.7 | **~1890** |

## Cache fix (`c9c731838`)

**What it does.** Module-level `WeakMap<ast, { html: result|null, svg: result|null }>`. Each slot stores `{ htmlString, entries, refRoot }` — `refRoot` is a pre-parsed `<template>.content` reused by `hydrateAttributes` in place of `innerHTML = htmlString` on every call.

**Three call sites through `cachedBuildHTMLString`:**
- `Renderer.buildHTMLString` (Phase 1 of render)
- `hydrateAttributes` (reads `refRoot` directly; no more innerHTML assignment)
- `hydrateInnerContent` (just needs `entries`)

**Safety invariant.** AST is immutable after reaching the Renderer. Compiler's `optimizeAST` runs pre-runtime; `collectSnippets` only reads. Cache entries never go stale.

**Diagnostic.** `globalThis.__cbhCache.stats()` exposes `{ hits, misses, ratio, firstMissKeys }`. Temporary — remove once the investigation closes.

## Each.js bisect (sub-investigation, concluded)

Isolates which commit in the each-block history contributes the remaining slowdown. `packages/renderer/src/engines/native/blocks/each.js` is hot-swappable — `isItemContext` export is stable across all candidate commits, so swapping doesn't break `template.js`'s import. Everything else held at current HEAD (including the cache fix).

**Method:** `git checkout <commit> -- packages/renderer/src/engines/native/blocks/each.js`, hard-reload `/perf/hydrated`, sample ×3.

| Each.js from commit | Shape | Samples (ms) | Median |
|---|---|---|---|
| `18f4f8381` (current) | marker-bounded ranges + lit head/tail reconcile | 526.3, 550.2, 612.9 | **~550** |
| `6daa0c414` | empty-items fast-path | 519.7, 500.2, 456.8 | **~500** |
| `16e71d20b` | per-item server markers + honest hydration | 539.7, 499.1, 485.6 | **~500** |
| `f665da675` | initial defineBlock conversion (nuke-and-rerender hydrate) | 518.1, 521.3, 487.9 | **~518** |

**Conclusion: each.js history is NOT the source.** All four versions cluster at 500-550 ms. The marker-bounded-range commit adds ~50 ms; everything else is indistinguishable. The bulk of the hydration cost lives somewhere non-each.

## Dev-to-prod overhead calibration

Same codebase pre-cache-fix: **dev 786 ms vs PR Vercel prod 718 ms → ~68 ms dev overhead.**

Rule of thumb: subtract ~68 ms from any dev measurement to predict PR Vercel prod for this page. Current dev post-fix (~538 ms) predicts PR Vercel post-fix at **~470 ms**. Staging (main) target remains **~45 ms**. Remaining gap to close on prod: **~425 ms**.

## Flame-chart finding (user-captured on dev post-cache-fix)

User pulled a trace from dev.semantic-ui.com/perf/hydrated post-cache-fix. Dominant self-time items:

| Function | Self | Total |
|---|---|---|
| `splitText` | 292 ms | — |
| `evaluateJavascript` (expression-evaluator.js:158) | 122 ms | 124 ms |
| `hydrateAttributes` (renderer.js:486) | 32 ms | 57 ms |
| `appendChild` | 25 ms | 25 ms |
| `hydrateInnerContent` (define-block.js:62) | 10 ms | 190 ms |

**User's hypothesis: "every reactive expression is running on hydrate instead of trusting server."** The 122 ms of `evaluateJavascript` self-time during hydrate matches that framing. Every JS-style expression runs `new Function()` through the data proxy on firstRun to register deps — this is how current dep-registration works, but it adds up to 122 ms of pure expression evaluation on a path that semantically "trusts the server."

**`splitText` source: `reactive-data.js:206`.** In `hydrateTextExpression`, the server merges reactive text with adjacent static text into one text node. Client calls `renderer.lookupExpression(exprNode.value, data)` at line 203 (full expression evaluation) to measure where to split the text. That's **a full expression evaluation per text binding solely to locate a string boundary in server DOM**. Possibly responsible for both the `splitText` time AND a meaningful chunk of the `evaluateJavascript` total.

Sanity-check item: flame chart shows function named `track.Reaction.create.context.context.context` — probably V8 inferring the name from a deeply-nested property-access chain in the reaction creation path (not actual nested context objects, since `isTracing()` defaults to false and `setContext`/`addContext` short-circuit in that case). Worth a quick log confirmation.

## What has been ruled out

- **`buildHTMLStringPure` build + `innerHTML` parse cost.** Cache fix achieves 99.94% hit rate; gap persists at ~500 ms on dev.
- **Dev-server overhead as primary cause.** ~68 ms of the ~700+ ms gap on pre-fix measurements.
- **Error-reporting / syntax formatting.** Refactor `42fafec61` simplified; not on hot path.
- **Each.js rewrite history.** Bisect shows all four each.js versions sit at 500-550 ms on dev post-fix.

## Where the cost likely is (working theory after flame)

1. **Hydrate-time expression evaluation** in `reactive-data.js` — `hydrateTextExpression`, `hydrateAttributes`, `hydrateRawText` — each expression runs through the evaluator to either register deps OR measure server-DOM boundaries. On 100 cards × multiple expressions each = hundreds of JS evaluations, 122 ms in the trace.
2. **`hydrateTextExpression` boundary measurement via full lookup** (`reactive-data.js:203`) is especially suspect — evaluates the expression to know where to call `splitText`. Could be avoided by emitting the value length as a server meta marker, or by not pre-merging reactive text with static text on the server.
3. **Recursive `hydrateInnerContent`** — the fragment/move dance (D.7 in the synthesis) still runs even with the cache fix; might be a constant factor on each recursive call.

## Open threads

- **PR Vercel post-fix remeasurement** — confirm cache fix closes the `innerHTML` component of the prod gap. Commit `c9c731838` landed; Vercel preview needs rebuild.
- **Diagnostic removal** — strip `globalThis.__cbhCache` once the investigation closes.
- **Hydrate-time expression-evaluation cost** — can the boundary-measurement lookup in `hydrateTextExpression` be eliminated? Can dep registration for hydrate skip full JS eval (e.g., via compile-time identifier extraction)?
- **Confirm the V8 function-naming in the trace** is not actual context nesting.

## Environment notes

- `dev.semantic-ui.com` is vite dev at the local checkout. HMR picks up source changes; hard-reload with `ignoreCache: true` between samples.
- Vercel PR preview: `semantic-next-git-feat-native-simplify-semantic-ui.vercel.app`. Production-like build; apples-to-apples with staging on main.
- Measurement tooling: Chrome DevTools MCP — `new_page` / `navigate_page` / `evaluate_script` to poll `performance.getEntriesByName('hydration-total')`.
- Honest framing: the rewrite IS slower than main. Some gap is legitimate honest-hydration cost (main's `if (comp.firstRun) return` did zero work). Some is not. Bisect rules out each-block as the primary source.
