---
title: V8 Topics to Verify Rather Than Claim
description: Meta-skill listing V8 perf topics where confident claims are likely wrong because the underlying behavior is internal heuristic, in-flight, or undocumented. Covers tier-up tick thresholds, OSR back-edge thresholds, Maglev/Turbofan inlining size budgets, in-flight TC39 features (JSON.parse source text access, Map.getOrInsert, source phase imports, Temporal in Chrome, Uint8Array base64 milestone), DOM accessor inlining specifics, cross-engine generalization, microbenchmark numbers, Node V8 version differences. Provides the default "say I'm not sure, suggest a verification source" response template.
keywords: [tier-up threshold, OSR threshold, inlining budget, escape analysis, megamorphic threshold, DOM accessor inlining, Temporal Chrome, JSON.parse source text, Map.getOrInsert, source phase imports, Float16Array hardware, cross-engine, JSC, SpiderMonkey, Node V8 version, microbenchmark, verification, chromestatus]
audience: essentials
skill: performance-v8-uncertain-topics
type: skill
---

# V8 Topics to Verify Rather Than Claim

> **Skill:** `performance-v8-uncertain-topics`
> **Purpose:** What NOT to confidently claim. The list of V8 behaviors where "verify against current sources" is the right answer.

**Golden rule: If you can't cite a specific primary source for a number or shipping claim, say so. Confidence about details V8 doesn't promise is a bug in the response, not a virtue.**

---

## The default response pattern

When in this territory:

> ✅ "I believe X is the case based on [last confirmed source], but [specific reason for doubt]. Worth verifying against [specific source: v8.dev/blog/relevant-post, chromestatus.com/feature/N, or V8 source at src/foo/] before depending on it."

> ❌ "X is true." (with no citation, drawn from training memory)

---

## Internal thresholds and heuristics

### Tier-up thresholds

The exact tick counts that trigger Sparkplug → Maglev → Turbofan compilation are V8 flags with default heuristics that fluctuate between releases. Documented (when documented at all) in V8 release notes for specific versions.

❌ Don't give specific numbers.
✅ Frame qualitatively: "Sparkplug compiles after roughly the first invocation that completes," "Maglev compiles after the function gets warm with stable feedback."
✅ If the user needs actual numbers, point them at V8's current `v8/src/flags/flag-definitions.h` source.

### OSR back-edge thresholds

Same as tier-up. Long-running loops trigger OSR; the specific count is internal and not stable.

### Maglev / Turbofan inlining size budgets

❌ Don't claim specific bytecode-instruction counts ("functions under X instructions are inlined").

✅ "Keep it small, keep it monomorphic, no generators, no try/catch in the innermost form" — the actionable advice without specific budgets.

### Megamorphic threshold

✅ "Polymorphic up to 4 shapes, megamorphic at 5+" — this one is well-documented and has not changed. Claimable.

---

## In-flight TC39 features

At TC39 Stage 3 or 4 but their V8 shipping status is uncertain or in motion as of May 2026. **Verify against Chrome Platform Status before recommending.**

| Feature | Status |
|---------|--------|
| JSON.parse source-text access | Stage 3/4; V8 impl in flight |
| Map.prototype.getOrInsert / getOrInsertComputed | TC39 Stage 4 March 2026; V8 shipping uncertain |
| Source phase imports (`import source x from './x.wasm'`) | Stage 3 |
| Temporal | Stage 4 March 2026, slated for ES2027. Firefox shipped. V8/Chrome in progress |
| Uint8Array base64/hex methods | Stage 4 Feb 2025. Chrome shipping milestone has been moving — verify |
| Async Context (zones-like API) | In motion |
| ShadowRealm | Stage 3; not in stable Chrome |
| Decorators (Stage 3) | V8 parses syntax; engine-level optimization is limited |
| Pipeline operator (`|>`) | Withdrawn / reformulated. Don't recommend |
| Records and Tuples | Withdrawn from TC39 in 2024 |

---

## DOM-specific V8 behavior

The V8/Blink boundary contains implementation detail not formally documented for framework authors.

❌ Don't claim the exact list of DOM accessors V8 can inline. V8 maintains an internal allowlist (`Node.firstChild`, `Element.classList`, etc.) that is not formally published.

❌ Don't give microbenchmark numbers for `textContent` vs `innerHTML` vs `setAttribute` vs `dataset.foo`. Relative ordering is reasonably stable; absolute numbers move with Chrome versions.

❌ Don't quote custom-element upgrade cost in milliseconds. Varies with element complexity and has had Blink-side optimizations over the years.

✅ Pattern matters (template + cloneNode, prefer property setters for hot custom-element data, cache element references). Specific timings should come from the user's own measurements.

---

## Cross-engine claims

If the user is writing code that needs to work well on Safari (JSC) and Firefox (SpiderMonkey) as well as Chrome:

❌ Don't claim V8-specific advice generalizes.

The engines have different cost models:
- JSC and SpiderMonkey have their own hidden-class / shape / inline-cache designs that share concepts with V8 but differ in details.
- JSC's tier pipeline (LLInt → Baseline → DFG → FTL) is different from V8's.
- Polymorphism handling, inlining, escape analysis — all differ.

A common pattern fast on V8 may be neutral or slow on JSC.

✅ For cross-engine code: "write clean, idiomatic, low-allocation JavaScript and measure on every target engine."
❌ Don't blanket-apply V8-specific guidance.

---

## Things that have changed and may change again

Frame your advice as time-bounded:

### Escape analysis behavior

V8 has had escape analysis on-and-off since 2017 (temporarily disabled in 2017 for security reasons — v8.dev/blog/disabling-escape-analysis). Re-enabled and improved since. The exact set of cases where allocation is elided is not formally documented.

❌ Don't promise specific elision behavior.

### Concurrent marking and CSS specifics

Productionized through 2024; ongoing improvements continue. Specific pause times depend on heap size, hardware, Chrome version.

### Sparkplug coverage

Sparkplug compiles essentially everything that runs more than once, but the exact threshold has shifted.

### DOM accessor inlining

V8 has been gradually expanding which DOM properties can be inlined; the set has grown.

---

## Numbers from microbenchmarks

✅ Prefer ordinal claims to numeric claims. "Pattern A is faster than pattern B for case C" is more durable than "Pattern A is 1.5× faster."

✅ When a specific multiplier appears in a primary source — e.g., v8.dev/blog/json-stringify claims >2× faster on the fast path — cite it with the source and date.

❌ Don't generalize numbers across versions.

---

## Node.js V8 behavior

Node ships V8 on its own cadence; Node version determines V8 version.

| Node version | V8 version (approximate) |
|--------------|--------------------------|
| Node 22 LTS | V8 12.4 |
| Node 24 | V8 13.6 |

**The advice in companion skills is for browser V8 at Chrome 138 (V8 13.8).**

✅ When the user is on Node, flag this. Suggest verifying with `process.versions.v8`.

⚠ Node-specific concerns not covered here:
- libuv event loop
- `--experimental-vm-modules`
- `worker_threads`
- Native addons
- `--max-old-space-size`
- Node's own `--jitless` mode

---

## Quick Reference

```
About to claim a specific tier-up threshold? → say "verify against current V8 flags"
About to claim an inlining budget? → say "keep callees small and monomorphic"
About to claim Temporal is shipped? → "Firefox yes, Chrome verify chromestatus"
About to claim Map.getOrInsert is available? → "Stage 4 March 2026, V8 verify chromestatus"
About to claim DOM accessor X is inlined? → "internal allowlist, verify on target version"
About to give microbenchmark multipliers? → use ordinals, or cite a v8.dev post
About to apply V8 advice to JSC/SpiderMonkey? → "write clean, measure per engine"
About to give a Node perf claim? → confirm bundled V8 version first
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Performance Index** | `use_skill('performance-v8-overview')` | Need the broader perf model. |
| **Stale Advice** | `use_skill('performance-v8-stale-advice')` | The complement — things that are *wrong now* vs things that are *uncertain*. Different category. |
| **Recent Features** | `use_skill('performance-v8-recent-features')` | For the actually-shipped milestones; this skill covers the unshipped/uncertain. |
| **Compilation** | `use_skill('performance-v8-compilation')` | For the tier model framing without specific thresholds. |
