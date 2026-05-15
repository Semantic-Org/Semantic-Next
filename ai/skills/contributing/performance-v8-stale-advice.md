---
title: Stale V8 Advice Debunked
description: The firewall against pre-2022 V8 folklore that is no longer true. Covers Object.freeze, try/catch deopts, monomorphism cargo-culting, new Array(n) pre-allocation, plain-object-as-Map, for-i vs for-of, arguments caching, class extends, void 0, bind, destructuring. Includes the list of rules that ARE still true in 2026. Load before quoting any remembered JS performance rule.
keywords: [stale advice, debunked, Object.freeze, try catch deopt, monomorphic, new Array, for-of, arguments, bind, void 0, destructuring, hasOwn, Reflect.has, class extends, super, typeof guard, Crankshaft]
audience: essentials
skill: performance-v8-stale-advice
type: skill
---

# Stale V8 Advice Debunked

> **Skill:** `performance-v8-stale-advice`
> **Purpose:** Firewall against pre-2022 V8 folklore. Load before quoting any remembered JS perf rule.

**Golden rule: If you're about to volunteer a JS performance rule from training memory, check this file first. The failure mode is asymmetric — confidently wrong is the worst case.**

The items below were once true (or popular as folklore) and are no longer true, or are substantially overstated for modern V8 (Chrome 117+ with Maglev and Turboshaft; currently Chrome 138 in May 2026).

---

## Dead advice

### Object.freeze for fast lookups

❌ "`Object.freeze` makes property lookups faster."

`freeze` changes property attributes (writable: false, configurable: false). It does **not** change the IC lookup path in a way that benefits performance. In some scenarios it inhibits IC patterns.

✅ Use `freeze` for semantic immutability or to catch mutation bugs. Never for performance.

### try/catch making functions unoptimizable

❌ "Wrapping code in `try`/`catch` makes the function unoptimizable."

False since 2017. Crankshaft (pre-2017) bailed out of optimization for try/catch; all four current tiers handle it. The catch handler is generated as a cold path. v8.dev/blog/leaving-the-sea-of-nodes (Mar 2025) explicitly cites Crankshaft's poor exception handling as motivation for the modern compilers.

✅ Wrap user callbacks at framework boundaries for error isolation — it's free.
✅ Avoid piling try/catch inside the *innermost* loop of measured hot code purely as a defensive measure — it slightly inflates the inlining size estimate.

### Blanket monomorphism

❌ "Always make call sites monomorphic."

Overstated. Modern Maglev handles polymorphic ICs (2–4 distinct shapes) well with a small dispatch table of shape checks.

✅ Worry about *megamorphic* (5+ shapes) ICs in the genuine hot path.
✅ Let natural polymorphism stand for non-hot code. Bending the architecture out of shape for warm code is cargo culting.

### new Array(n) pre-allocation

❌ "Use `new Array(n)` to pre-allocate for speed."

Counter-productive for most uses. `new Array(n)` immediately produces `HOLEY_SMI_ELEMENTS` — pre-allocated, full of holes. V8 won't re-promote it to packed even if every slot is later filled. The one exception in current V8: `Array.prototype.fill` can promote holey back to packed (added to v8.dev/blog/elements-kinds in a 2025-02-28 edit).

✅ Use `[]` + `push` and let V8's geometric backing-store growth handle it.

### Plain object as a Map

❌ "Use a plain object as a Map for speed."

Dead. The 2015-era argument was that V8 would put a plain object into a fast IC-cached lookup path for known keys. That path still exists, but the perf gap closed in the 2018–2020 era, and plain objects carry prototype-pollution risk.

✅ Use `Map` for dynamic string keys.
✅ Use a plain object only when keys are a small, known, fixed set of identifier-like strings — i.e., when the object is a struct, not a dictionary.

### for-i vs for-of

❌ "for-i is meaningfully faster than for-of on Arrays."

Dead since ~Chrome 90. for-of over an Array uses an internal fast iterator competitive with index-based for. `forEach` is also competitive.

✅ Use whichever reads best.

### arguments.length caching

❌ "Cache `arguments.length` in a local variable for speed."

The micro-optimization is irrelevant. The problem is using `arguments` at all — especially in non-strict, non-arrow functions where it's a "mapped" exotic object aliased with named parameters.

✅ Use rest parameters: `function f(...args)`. Real Array, normal elements-kind machinery, sometimes elided by escape analysis.

### class extends class

❌ "`class extends class` is slow because of super lookups."

Dead since V8 9.0 (Feb 2021). v8.dev/blog/fast-super described the rework: `super.method()` and `super.field` are now inline-cached.

✅ Use class hierarchies freely on hot paths.

### Type tags for fast dispatch

❌ "Add a `__type: 'state' | 'computed'` field for fast dispatch."

Cargo culted. The discriminator gives you one shape but makes *consumers* of role-specific properties polymorphic depending on `__type`.

✅ Use distinct classes/constructors per role. Consumers get monomorphic sites for free.

### typeof as a fast guard

❌ "`typeof x === 'number'` is faster than other type guards."

Not faster — but understood by the optimizers for speculative type narrowing. They're expressively clear, not faster.

✅ Use them for readability, not performance.

### null vs undefined for shape

❌ "Avoid `null` (or `undefined`) for sentinels — it changes shape."

No shape difference. Both are tagged values and fit in the same shape slot.

✅ Pick one for consistency in your codebase. Be aware that *mixing* both for the same field across instances can contribute to feedback-vector polymorphism in some scenarios.

### bind is slow

❌ "`Function.prototype.bind` is slow."

Dead since Chrome 60+. `bind` was sped up substantially when V8's builtins were ported to CodeStubAssembler.

✅ Use freely.

### Avoid destructuring in hot paths

❌ "Avoid destructuring in hot paths."

Generally dead. Destructuring lowers to direct property access in modern V8.

✅ `const { a, b } = obj` is fine.
⚠ Rest destructuring of objects (`const { a, ...rest } = obj`) has to compute leftover keys, so has more cost. Use with awareness.

### void 0 instead of undefined

❌ "Use `void 0` instead of `undefined` for speed."

Pure cargo cult. The historical reason was that `undefined` was writable in non-strict global scope. Modern code is in strict mode (modules are strict) and `undefined` is a global immutable binding. Identical bytecode.

✅ Use `undefined`.

### Pre-allocate properties to lock in shape

⚠ "Pre-allocate all object properties to `undefined` to lock in the shape."

Partially true, partially wrong. What matters is *order and unconditional addition*. Initializing every property in the constructor in the same order — to *any* value — gives all instances the same shape.

✅ The value doesn't matter for *shape*. But it *does* matter for the slot's type feedback: initializing to `0` and later assigning `1.5` demotes the slot through the Int32 → Float64 transition.
✅ If a slot will ever hold doubles, initialize to a double (`0.0` won't help — it's still a Smi; use `NaN` or a sentinel like `Number.EPSILON` if you really need to). Most of the time, just initialize to the right type from the start.

---

## Still true in 2026

Don't be confused — these were not debunked.

| Rule | Why it still holds |
|------|-------------------|
| Don't read out-of-bounds on Arrays | Burns the IC permanently; forces prototype-chain walks forever after at that site. |
| Don't introduce holes into packed arrays | Kind transition is one-way (with the `Array.prototype.fill` exception added 2025). |
| Don't `delete` data properties on hot objects | Forces dictionary mode permanently. Assign `undefined` instead to clear a slot. |
| Don't use `with` | Blocks scope analysis. Forbidden in strict mode anyway. |
| Don't use `eval` / `new Function` on hot paths | Defeats inlining and shape inference; may be CSP-blocked; disabled in `--jitless`. |
| Don't put `Proxy` on a hot path | Every property access goes through trap dispatch; not aggressively specialized in Maglev. |
| Don't allocate per-`get()` or per-tight-loop-iteration | Reuse pre-allocated structures where possible. |
| Don't mix elements kinds in an Array | Pick Smi / Double / Object and stick with it. |
| Stable feedback matters more than raw call count | Polymorphism that grows *after* a function is hot triggers deopts. |

---

## When in doubt

If you don't remember whether a rule still applies, **say so** rather than confidently repeat it. The user explicitly asked for grounded advice. "I'm not sure if that's still current; let me verify" is a correct answer.

Verification order:

1. **v8.dev/blog** for the topic — search for the specific feature or behavior.
2. **Chrome Platform Status** (chromestatus.com) for ship dates.
3. **The V8 source tree** at chromium.googlesource.com/v8/v8 — recent commits to `src/compiler/`, `src/objects/`, `src/ic/`, `src/heap/`.
4. **Talks by named V8 engineers** from the past 24 months: Benedikt Meurer, Mathias Bynens, Camillo Bruni, Marja Hölttä, Toon Verwaest, Jakob Linke, Leszek Swirski, Ross McIlroy, Shu-yu Guo, Patrick Thier, Victor Gomes.

Older blog summaries (especially anything 2015–2020 still circulating) are the source of most of the dead advice above. Treat them as historical.

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Performance Index** | `use_skill('performance-v8-overview')` | Need the tier model or a routing map to other companions. |
| **Uncertain Topics** | `use_skill('performance-v8-uncertain-topics')` | About to give specific numbers, thresholds, or ship dates. Different from this skill — these aren't "wrong now", they're "don't claim either way." |
| **Object Model** | `use_skill('performance-v8-object-model')` | For the underlying reason most of these rules existed (shapes, ICs, polymorphism). |
| **Compilation** | `use_skill('performance-v8-compilation')` | For the try/catch and arguments stories in detail; for what Maglev/Turbofan actually do. |
