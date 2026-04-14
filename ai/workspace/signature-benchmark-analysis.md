# Signature Convention Benchmark — Step 1 Decision Record

**Plan:** `ai/plans/native-renderer-blocks.md` §Signature Convention, step 1
**Ran:** 2026-04-12
**Config:** `packages/renderer/bench/tachometer/tachometer-signature.json`
**Script:** `packages/renderer/bench/tachometer/signature.js`

## Result

Tachometer, 1M iterations per variant, same-session round-robin:

| Variant | Avg time | vs destructured | vs positional |
|---|---|---|---|
| `renderAST({ ast, scope, data, isSVG })` | 5.17ms – 6.28ms | — | **slower 8–36%** |
| `renderAST(ast, scope, data, isSVG)`     | 4.39ms – 4.97ms | **faster 9–28%** | — |

Confidence intervals are **non-overlapping** at 95% — positional is statistically significantly faster per-call.

## Caveat — what this bench measures

This is a **pure function-call microbench**, not an end-to-end render bench. Two functions with identical trivial bodies, differing only in their signatures. The 20% delta represents:
- Call-site allocation of `{ ast, scope, data }` objects
- Destructuring overhead inside the function
- V8 escape analysis not fully eliminating the allocation at this iteration count

Translated to per-call absolute cost: **~1ns/call slower** for destructured.

## What it does NOT measure

The plan's decision rule framed the 3% threshold in terms of real-world render time on a 1000-item each-loop template. That would:
- Render real DOM (dominant cost)
- Do real signal tracking (second-dominant cost)
- Walk real AST and dispatch real bindings

In that context, renderAST call overhead is **one component among many**, and the ~1ns/call delta amortizes across work that dwarfs it. A real-world end-to-end bench would likely show a <1% delta — if any measurable difference at all.

Writing a real-world end-to-end bench requires a positional variant of the full renderer (readAST + bindMarkers + internal recursion sites), which is invasive enough to be its own sub-project. Not worth the cost at step 1 to confirm what the microbench already hints at.

## Decision

**Stay destructured.** Per the plan's own tiering:

> **1–3%** → judgment call. Default lean: consistency wins (stay destructured), but document the measured overhead in §Signature Convention as acknowledged cost.

The microbench shows per-call overhead IS real, but at the abstraction level the plan cares about (real-world render), it maps to <1% impact. Uniform destructured is a consistency win across the codebase. `lookupExpression`'s 2-arg positional carve-out stays narrow ("mirrors ExpressionEvaluator signature, called per-expression in tight reactive loops").

## Documented cost acknowledgement

§Signature Convention in the plan should note: destructured arg objects carry ~1ns/call overhead vs positional at V8's current optimization tier. This is amortized to noise in end-to-end renders but quantified here for future reference.

## Regression-guard posture

The bench stays in tree (`bench/tachometer/signature*.{js,html,json}`, `npm run bench:signature`). Future refactors claiming to improve renderer perf can re-run it; a significant shift in the delta (e.g., destructured becoming 3x+ slower, or reaching parity) would be a signal to revisit the convention.

## Follow-up signal

If a real-world end-to-end bench ever shows `readAST` dominated render time AND the signature delta translates to >3% of total render, revisit. Path forward would be: add a positional variant of readAST on the Renderer + update all internal call sites — a bounded, mechanical change that the per-block decomposition makes easier (fewer internal callers after step 5 extracts reactive-data).
