---
title: V8 Compilation — Tiers, Deopts, Explicit Compile Hints
description: How V8 compiles JS through Ignition → Sparkplug → Maglev → Turbofan/Turboshaft. Covers tier-up triggers, on-stack replacement, deopt causes, what Maglev/Turbofan can and cannot inline, the truth about try/catch in optimized code, arguments object vs rest params, explicit compile hints (//# allFunctionsCalledOnLoad, Chrome 136+), --disable-optimizing-compilers and --jitless reality, eval and CSP. Load for "why does this deopt", "why is first call slow", "should I eager-compile", "is X inlined" questions.
keywords: [Ignition, Sparkplug, Maglev, Turbofan, Turboshaft, Turbolev, tier-up, OSR, on-stack replacement, deoptimization, deopt, inlining, feedback vector, IC, inline cache, try catch, arguments object, rest parameters, explicit compile hints, allFunctionsCalledOnLoad, jitless, disable-optimizing-compilers, code cache, eval, new Function, CSP]
audience: authoring
skill: performance-v8-compilation
type: skill
---

# V8 Compilation — Tiers, Deopts, Explicit Compile Hints

> **Skill:** `performance-v8-compilation`
> **Purpose:** What V8 actually compiles, when, and what makes optimized code go away.

**Golden rule: Stability of feedback matters more than raw call count. Polymorphism that arrives early and stays consistent is fine; polymorphism that grows after the function is hot triggers deopts.**

Current as of Chrome 138, May 2026.

---

## The pipeline

A function starts at the bottom. It tiers up only if it gets hot with stable feedback.

| Tier | Description |
|------|-------------|
| **Ignition** | Interpreter. Parses → bytecode → executes. Fills *feedback vectors* — per-function slot arrays recording, for each IC site, what shapes and types have been seen. |
| **Sparkplug** (Chrome 91+) | Baseline JIT. Single-pass bytecode → machine code. No IR, no optimizations, no inlining. ~10× faster than Ignition; ~20× slower to compile than nothing. Threshold is essentially "ran more than once." |
| **Maglev** (default Chrome 117+) | Mid-tier optimizing JIT. SSA over CFG. Uses feedback to speculatively narrow types, emits shape-check + direct field load, inlines small monomorphic targets, registers dependencies on stable Maps and de-facto-constant globals. Compiles ~10× slower than Sparkplug, runs ~10× faster. This is where the bulk of "optimized" web JS lives. |
| **Turbofan + Turboshaft IR** | Top tier. Turboshaft (CFG-based) replaced Sea-of-Nodes for the JS backend in Q1 2025 (v8.dev/blog/leaving-the-sea-of-nodes), roughly halving compile time. **Turbolev** — building Turboshaft graphs directly from Maglev's IR instead of from JS — is rolling out incrementally through 2025–2026. |

Maglev's presence makes V8 willing to wait longer before triggering Turbofan, so functions in the "warm but not hot" band stay on Maglev.

### On-Stack Replacement (OSR)

A long-running loop in an already-running function can tier up mid-execution: V8 swaps the in-progress frame for an optimized frame at a loop back-edge. Shared between Maglev and Turbofan. Useful for setup loops that run many iterations on first call.

---

## What "stable feedback" actually means

The framing for almost all deopt advice. Feedback stability matters more than raw call count.

✅ Polymorphism that arrives early and stays consistent — a site sees three shapes in its first 100 invocations and continues to see only those three. Maglev handles it well.

❌ Polymorphism that grows over time — new shapes appearing *after* Maglev/Turbofan have compiled. Optimized code's speculative checks fail, the optimized frame is discarded, the function reverts to a lower tier, and recompilation eventually runs again with the broader feedback. This cycle is the worst case.

### Practical consequences

✅ Construct all your shape variants early. Eagerly create the rare-but-real case during warmup so its shapes are in feedback before Maglev compiles.

❌ Lazy creation of a new "kind" of object after the page has been running deopts every consumer site that saw the previous shapes.

❌ Optional/conditional property addition. A property added to instances #5000+ but not to #1–4999 forks the shape tree and creates new polymorphism for downstream sites.

---

## What V8 can and cannot inline

Maglev and Turbofan inline call targets when:

- ✅ The call site is monomorphic or low-polymorphic.
- ✅ The callee is small (the budget is an internal heuristic, not stable across releases — do not hard-code expectations).
- ✅ The callee is not a generator and is not `async` (the async wrapper can be split into resumable state; the synchronous body before the first await can still be inlined).
- ✅ The callee does not exceed recursion limits.

Maglev inlines less aggressively than Turbofan but does inline obvious small monomorphic targets.

### Practical patterns

✅ Keep hot primitives small — getter/setter pairs of 5–15 bytecode instructions; framework methods that are mostly one shape check + one field access.

❌ Do not embed debug or dev-only branches in hot code paths even if guarded by `if (DEBUG) …`. The branch is cheap but the dead code inflates the size estimate the inliner consults.

✅ Compile dev branches out (build flag) or factor them into a separate function that won't be inlined.

✅ Put shared methods on the prototype (one Function object) rather than assigning per instance in the constructor (one Function object per instance — bad on a hot class).

---

## try/catch is not a deopt killer in modern V8

Crankshaft (pre-2017) refused to optimize functions containing `try`/`catch`. TurboFan (2017+) lifted that with caveats. **All four current tiers handle try/catch.** The catch handler is generated as a cold path; no general "this function cannot be optimized" cost.

v8.dev/blog/leaving-the-sea-of-nodes (Mar 2025) explicitly cites poor exception handling as one of the reasons Crankshaft had to be replaced.

✅ Wrap user effect/callback invocations in `try`/`catch` for error isolation at framework boundaries.
✅ Use `try`/`finally` for resource cleanup.
⚠ Avoid stacking `try`/`catch` inside the *innermost* loop of measured hot code purely as a defensive measure — small constant cost, slight inlining-budget impact.

---

## arguments object

The historical "don't touch `arguments`" rule still applies in 2026. The solution has updated.

❌ Caching `arguments.length` in a local. The micro-optimization is irrelevant — the problem is using `arguments` at all.

❌ The `arguments` object in non-strict, non-arrow functions is a "mapped" exotic object aliased with named parameters. Touching it forces materialization.

✅ Use rest parameters: `function f(...args)`. Real Array, normal elements-kind machinery, sometimes elided by Turbofan via escape analysis when only iterated.

---

## Deopt triggers (the short list)

- A property previously type-checked as Smi receives a non-Smi value.
- An object shape used at an IC site diverges from the shapes the compiled code expected.
- A previously-stable Map transitions (e.g., a property is deleted, the object enters dictionary mode).
- A global previously assumed constant is reassigned.
- A class's prototype is mutated.
- A `typeof` guard fails its speculative narrowing.
- An out-of-bounds array read at a previously in-bounds site.
- An IC transitions from polymorphic (≤4 shapes) to megamorphic (5+).

Each deopt invalidates the optimized code and reverts the function to a lower tier. One-time deopts during page warmup are normal; recurring deopts are pathological.

---

## Explicit Compile Hints — `//# allFunctionsCalledOnLoad`

**Status: shipped, default-on, Chrome 136 (April 2025).** Source: Marja Hölttä, v8.dev/blog/explicit-compile-hints, Apr 2025.

### What it does

V8 normally tries to defer compilation: it preparses each script to find function boundaries, then compiles each function lazily on first call. For functions that *will* be called during page load, that's wasted work — the preparse duplicates the eventual full parse, and eager compilation could have run on a background thread interleaved with network load.

The magic comment placed at the top of a JavaScript file tells V8 to compile every function in that file eagerly:

```js
//# allFunctionsCalledOnLoad

function bootstrap() { /* ... */ }
function defineCustomElements() { /* ... */ }
// every function in this file is eagerly parsed and compiled
```

Production test cited in the post: 17 of 20 popular pages improved, average foreground parse+compile time reduced by ~630 ms.

The hint forces eager **parse + bytecode generation** (Ignition-level compilation). It does **not** skip tier-up — Sparkplug/Maglev/Turbofan still happen normally on hot code.

### Interaction with code caching

Chrome's V8 compile cache stores eagerly-compiled bytecode on the second load. The post recommends testing with a clean user-data directory because the code cache otherwise masks the difference. In production, the first-load win is what the hint delivers; subsequent loads benefit from cached bytecode regardless.

✅ Combine the hint with long-cache `Cache-Control` on framework core files. Normal HTTP caching; V8 picks it up automatically.

### When to use it

✅ Apply to **a framework core file** — the reactive primitive, the scheduler, the base custom-element class, the bootstrap path. Anything called on every page in the first few hundred milliseconds.

❌ Do not apply to:
- Large optional / lazy-loaded modules. Defeats lazy parsing entirely.
- Files containing large constant tables (precomputed lookups embedded in JS). Eager parsing of the data literal is wasted work.

The post's own warning: *"This feature should be used sparingly though — compiling too much will consume time and memory."*

### Future direction

The post states V8 plans to support per-function compile hints. At time of the post, only file-level was available. Verify current status before recommending per-function granularity — see `performance-v8-uncertain-topics`.

---

## JIT-disabled scenarios

Chrome 126 (June 2024) introduced `--disable-optimizing-compilers`, the V8 flag that disables Maglev and Turbofan while keeping **Ignition and Sparkplug** running. The older `--jitless` flag is stricter: Ignition only. Both modes appear in the field:

- The Chrome 122+ user toggle at `chrome://settings/security` ("V8 optimizer") sets `--disable-optimizing-compilers` per site.
- The enterprise policy `DefaultJavaScriptJitSetting` controls it organization-wide.
- Some sandboxed configurations (certain WebView modes, locked-down enterprise machines) force jitless.

**Code that depends on Maglev/Turbofan-only optimizations must still be correct and acceptably fast when only Sparkplug is running.** This includes:

- Escape analysis (closure-allocation elision).
- Speculative type narrowing.
- Aggressive inlining.
- Vectorized loops over TypedArrays.
- IC-based speculative shape-check fast paths.

❌ Don't recommend patterns that are *worse* without optimization than the simpler alternative would be.

Source: Lamprey Labs, "Return of the JIT," documenting the Chrome 126 change.

---

## eval, new Function, dynamic code

- ✅ `eval` and `new Function(...)` produce code that participates normally in the tier pipeline. Not unoptimizable per se.
- ❌ Blocked by strict CSP `script-src` policies that exclude `'unsafe-eval'`. A framework that depends on `new Function` won't work on CSP-strict sites.
- ❌ Disabled entirely in `--jitless` configurations.
- ❌ Defeat inlining (the caller cannot inline a function it doesn't statically see).
- ❌ Make shape inference much harder for surrounding code.

✅ Acceptable for build-time code generation that runs once.
❌ Not acceptable as a runtime optimization technique.

---

## Quick Reference

```js
//# allFunctionsCalledOnLoad  // ✅ Top of framework core file, Chrome 136+

// ✅ Rest params, not arguments
function effect(...args) { /* … */ }

// ❌ arguments object
function effect() {
  for (let i = 0; i < arguments.length; i++) { /* … */ }
}

// ✅ Methods on prototype (one Function object shared)
class Signal {
  get() { /* … */ }
  set(v) { /* … */ }
}

// ❌ Methods assigned per-instance in constructor (one per instance)
class Signal {
  constructor() {
    this.get = () => { /* … */ };
  }
}

// ✅ try/catch at framework boundary
function runEffect(fn) {
  try { fn(); } catch (e) { reportError(e); }
}
```

---

## Primary sources

- v8.dev/blog/maglev — Dec 2023
- v8.dev/blog/leaving-the-sea-of-nodes — Mar 2025
- v8.dev/blog/sparkplug — 2021
- v8.dev/blog/explicit-compile-hints — Marja Hölttä, Apr 2025
- lampreylabs.com/posts/return-of-the-jit — Chrome 126 `--disable-optimizing-compilers`

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Performance Index** | `use_skill('performance-v8-overview')` | Need the tier model summary or routing. |
| **Object Model** | `use_skill('performance-v8-object-model')` | The shape-stability rules that determine whether tier-up happens cleanly. |
| **Stale Advice** | `use_skill('performance-v8-stale-advice')` | Verify a remembered rule about try/catch, arguments, inlining, or deopts. |
| **Uncertain Topics** | `use_skill('performance-v8-uncertain-topics')` | About to claim specific tier-up tick counts or inlining budgets — don't. |
