---
title: V8 Performance Index and Tier Model
description: Routing index and mental model for V8/Chrome runtime performance, grounded in v8.dev/blog, V8 source, and Chrome Platform Status as of May 2026. Frames how to give grounded JS perf advice without relying on stale folklore. Points to companion skills for object shapes, compilation tiers, DOM, memory/GC, strings, recent features, and the stale-advice firewall.
keywords: [v8, javascript performance, hot path, jit, ignition, sparkplug, maglev, turbofan, turboshaft, deoptimization, krausest, js-framework-benchmark, hidden classes, inline cache, signals, fine-grained reactivity]
audience: essentials
skill: performance-v8-overview
type: skill
---

# V8 Performance (May 2026)

> **Skill:** `performance-v8-overview`
> **Purpose:** Mental model + routing index for V8 runtime performance. Load this first; load companions on demand.

**Golden rule: Stale V8 advice is worse than no advice. Date your claims, cite v8.dev, and verify before recommending.**

---

## Why this skill exists

V8 ships roughly every four weeks. Between the Crankshaft era (pre-2017), the TurboFan-only era (2017–2023), and the current four-tier pipeline (Ignition → Sparkplug → Maglev → Turbofan/Turboshaft, Chrome 117+), enough has changed that a great deal of "famous" JS-performance advice on the open web is now wrong.

The failure mode for advice in this domain is asymmetric:

- **Tell someone to make every call site monomorphic** → they spend hours restructuring code for a constraint Maglev no longer cares much about.
- **Tell them `try`/`catch` deopts the function** → they route around it and write less-safe code for a problem that hasn't existed since 2017.

Confidently wrong is the worst case. The "I'm not sure if that's still current" answer is correct here more often than people think.

---

## How to use this skill

1. **Identify the topic** and load the matching companion skill via `use_skill`. The Related table at the bottom maps topics to skill names.
2. **Check `performance-v8-stale-advice` first** if the user is asking whether a remembered rule still applies, or if you're about to volunteer "X is faster because…". The debunked items cover the most common landmines.
3. **Check `performance-v8-uncertain-topics`** before claiming anything about: tier-up thresholds, inlining budgets, exact shipping milestones for in-flight TC39 features, internal heuristics, or DOM accessor inlining specifics. These move; cite Chrome Platform Status or skip.
4. **Date your claims.** "As of Chrome 138 (May 2026)…" beats a bare assertion. If the target is Node or older Chrome, flag it — Node ships V8 on its own cadence.
5. **Prefer concrete citations** to v8.dev posts. Each companion skill lists its sources at the bottom.

---

## The tier model in one page

Internalize this before giving micro-optimization advice. Most stale advice errors stem from misunderstanding the modern pipeline.

A function starts at the bottom and tiers up only if it gets hot with stable feedback:

| Tier | What it is | When |
|------|------------|------|
| **Ignition** | Interpreter. Parses → bytecode → executes. Fills feedback vectors at every IC site. | Every function starts here. |
| **Sparkplug** | Baseline JIT (Chrome 91+). Single-pass bytecode → machine code. No IR, no optimization. ~10× faster than Ignition. | Very low threshold — essentially "ran more than once." |
| **Maglev** | Mid-tier optimizing JIT (default Chrome 117+). SSA over CFG, speculative shape-check + load-field lowering, inlines small monomorphic targets. | Function gets warm with stable feedback. |
| **Turbofan + Turboshaft IR** | Top tier. Turboshaft (CFG IR) replaced Sea-of-Nodes for JS backend in Q1 2025. Turbolev (Maglev IR → Turboshaft directly) rolling out. | Function gets hot with continued feedback stability. |

### Three implications that drive most advice

1. **Modern Maglev handles polymorphism (2–4 shapes per IC) well.** The Crankshaft-era panic about non-monomorphic call sites is misplaced for non-hot code. Worry about *megamorphic* (5+) in the genuine hot path.

2. **`try`/`catch` is supported in optimized code.** All four tiers handle it. The catch handler is generated as a cold path; there's no "this function cannot be optimized" cost. v8.dev/blog/leaving-the-sea-of-nodes (Mar 2025) explicitly cites Crankshaft's poor exception handling as motivation for the modern compilers.

3. **Stability of feedback matters more than raw call count.** Polymorphism that arrives early and stays consistent is fine. Polymorphism that grows *after* the function is hot triggers deopts.

### When optimization may not happen at all

Chrome 126+ exposes `--disable-optimizing-compilers` (the V8 flag behind chrome://settings/security "V8 optimizer" toggle and the `DefaultJavaScriptJitSetting` enterprise policy). It disables Maglev and Turbofan but keeps Ignition + Sparkplug. The older `--jitless` flag is stricter (Ignition only).

Both modes are real in the field. **Code that depends on Maglev/Turbofan-only optimizations (inlining, escape analysis, speculative type narrowing) must still be correct and acceptably fast on Sparkplug alone.** If a recommendation only pays off with the top tiers, say so.

---

## Quick Reference: the highest-frequency landmines

The items most likely to slip into an unguarded response. Load `performance-v8-stale-advice` for the full treatment, but at minimum, *never* say any of the following without checking first:

| Claim | Status |
|-------|--------|
| "`Object.freeze` makes property lookups faster" | ❌ False. |
| "`try`/`catch` makes the function unoptimizable" | ❌ False since 2017. |
| "Always make call sites monomorphic" | ❌ Overstated. Polymorphic (2–4) is fine in Maglev. |
| "Use `new Array(n)` to pre-allocate" | ❌ Counter-productive. Produces `HOLEY_SMI`. |
| "Use a plain object as a Map for speed" | ❌ Dead advice. Use `Map`. |
| "for-i is meaningfully faster than for-of" | ❌ Dead since ~Chrome 90. |
| "Cache `arguments.length` in a local" | ❌ Don't use `arguments`. Use rest params. |
| "`class extends class` is slow" | ❌ Dead since V8 9.0 (Feb 2021). |
| "Don't `delete` data properties on hot objects" | ✅ Still true. Forces dictionary mode permanently. |
| "Don't introduce holes into packed arrays" | ✅ Still true (with one `Array.prototype.fill` exception). |
| "Don't put `Proxy` on a hot path" | ✅ Still true. Not aggressively specialized in Maglev. |

---

## Stance when uncertain

If a question hinges on a detail you cannot verify from a companion skill or a primary source you can cite, the correct response is some variant of:

> ✅ "I believe X based on [source date], but [reason for doubt]. Worth verifying against v8.dev/blog or Chrome Platform Status before relying on it."

> ❌ "X is true." (with no citation, from training memory)

This is not hedging — it's accuracy. The user explicitly asked for grounded advice, not training-data folklore.

---

## What this skill does NOT cover

- **Node.js perf idiosyncrasies** beyond shared V8. Node ships V8 on its own cadence and has its own concerns (libuv, worker_threads). Flag rather than guess.
- **Bundler / compile-time optimizations** (tree shaking, scope hoisting, Closure Compiler, Svelte/Solid compilation). Scope here is runtime browser code.
- **Cross-engine compatibility** beyond V8/Chrome. JSC and SpiderMonkey have different cost models. Flag when relevant; don't pretend V8 advice generalizes.
- **WebAssembly performance.** Adjacent but separate.
- **Specific framework primitive implementations.** This skill describes engine behavior; it does not prescribe how to build a signal, an effect, or a custom-element base class.

---

## Related Skills

| Skill | Command | Load when... |
|-------|---------|--------------|
| **Stale Advice** | `use_skill('performance-v8-stale-advice')` | About to volunteer a remembered rule, or user is asking whether one still applies. Read this first. |
| **Uncertain Topics** | `use_skill('performance-v8-uncertain-topics')` | About to claim specific numbers, thresholds, ship dates, or DOM accessor specifics. |
| **Object Model** | `use_skill('performance-v8-object-model')` | Question about hidden classes, ICs, property access, arrays, elements kinds, classes, private fields. |
| **Compilation** | `use_skill('performance-v8-compilation')` | Question about tier-up, deopts, inlining, explicit compile hints, `arguments`, jitless. |
| **DOM** | `use_skill('performance-v8-dom')` | Question about element creation, custom elements, observed attributes, template+clone, shadow DOM. |
| **Memory** | `use_skill('performance-v8-memory')` | Question about GC, allocation patterns, closures, WeakRef/FinalizationRegistry, Map/Set, microtasks, Promises, scheduling. |
| **Strings** | `use_skill('performance-v8-strings')` | Question about string building, template literals, cons strings, JSON.stringify, number-to-string. |
| **Recent Features** | `use_skill('performance-v8-recent-features')` | Question about iterator helpers, Set methods, `using`, RegExp.escape, Promise.withResolvers, Float16Array, what's shipped vs not. |
