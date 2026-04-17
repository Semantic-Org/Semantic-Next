---
title: Signal Safety v2 — evidence package for fresh-agent review
purpose: Share measurements and observations without conclusions so the reader can form their own read.
current PRs: #148 (reference default vs main), #150 (freeze default vs #148) — neither merged.
---

# Context

Semantic UI's Signal class has three safety presets under consideration for 1.0 default:

- `reference` — store raw value, dedupe via `isEqual`. O(1) reads and writes. Mutation through `.get()` is silent (no reactivity trigger).
- `freeze` — `deepFreeze` on set, read returns raw ref, dedupe via `isEqual`. Mutation through `.get()` throws `TypeError`.
- `none` — store raw, no dedupe. Event-stream semantics.

PR #148 flipped the default from `allowClone: true` (clone on read) to `safety: 'reference'`. PR #150 then flipped default from `reference` to `freeze`. The stated goal for freeze default is catching the silent `get(); mutate; set(sameRef)` bug class at the mutation site rather than silently dropping the update.

# Bench data

All numbers from CI tachometer, 50 samples, 2% resolution floor. Verified via CI logs that "Base" in the PR comment hardcodes `main` but the actual CI baseline is `github.event.pull_request.base.ref`.

## PR #148 (reference default) vs main (allowClone: true)

| Bench | Delta |
|---|---|
| signal-reactive-set-index-300 | **-98%** (-106ms) |
| signal-reactive-list-filter-1000x300 | -95% (-108ms) |
| signal-reactive-set-property-by-id-100 | -87% (-95ms) |
| signal-reactive-push-1000x20 | -80% (-88ms) |
| signal-reactive-list-replace-1000x500 | -10% |
| signal-computed-chain-10x30k | -9% |
| signal-reactive-multi-read-5x80k | -4% |
| todo-app benches (toggle/remove/edit) | "no change" (±2%) |
| js-framework (create/swap/append) | "no change" |
| clear | **+89%** (regression on one test) |

## PR #150 (freeze default) vs PR #148 (reference default)

| Bench | Delta |
|---|---|
| signal-reactive-set-index-300 | **+603%** (+9ms) |
| signal-reactive-push-1000x20 | +109% (+22ms) |
| signal-reactive-set-property-by-id-100 | +37% (+5ms) |
| signal-reactive-list-filter-1000x300 | +25% (+2ms) |
| todo-app benches | "no change" |
| js-framework benches | "no change" |
| signal-reactive-list-replace-1000x500 | unsure |

## Cost model by approach

Traced from `setIndex` implementations:

```js
// main (allowClone: true default)
// O(1) write, O(N) read via clone-on-get
setIndex(index, value) { this.currentValue[index] = value; this.notify(); }

// reference default (PR #148)
// O(1) write, O(1) read
setIndex(index, value) { this.currentValue[index] = value; this.notify(); }

// freeze default (PR #150)
// O(N) write, O(1) read
setIndex(index, value) {
  if (this.safety === 'freeze') {
    const next = [...this.currentValue];     // O(N) spread
    next[index] = value;
    this.currentValue = this.protect(next);  // deepFreeze walk (isFrozen short-circuits)
  }
  this.notify();
}
```

Notes:
- Mutation helpers under freeze always spread + freeze because the underlying is frozen; in-place mutation would throw.
- `deepFreeze` in `packages/utils/src/cloning.js` walks only arrays and plain objects via `isPlainObject` gate. Date/Map/Set/RegExp/class-instances are skipped.
- Benches `signal-reactive-*` are write-heavy (300 setIndex calls on 1000-item array, 20,000 total pushes, etc.). Realistic UI workload benches (todo, js-framework) are mixed read/write and show no change under freeze.

# Pagefind integration case study

Reproduced in `dev.semantic-ui.com/docs/guides/` via chrome-devtools MCP.

## Symptom

Under freeze default, after the first successful search, subsequent searches throw:

```
TypeError: Cannot assign to read only property 'weighted_locations' of object '#<Object>'
  at PagefindInstance.loadFragment (pagefind.js:6:983)
  at async Object.data (pagefind.js:9:410)
  at async Promise.all (index 5)
  at async Reaction.callback (global-search.js:83:23)
```

## Trace

Global-search component stores pagefind-owned objects in signals. Pagefind itself retains internal references to those same objects (for its fragment cache) and mutates them on subsequent `.data()` calls. Deep-freeze transitively poisons those cached references.

## Progression of fixes

1. Started: all state signals default (freeze).
2. `state.rawResults` → `safety: 'reference'`. First search works; subsequent errors.
3. Traced: `state.results.set(pagefindFragments)` where fragments come from pagefind's `.data()` — pagefind caches these internally. `state.results` under freeze was freezing pagefind's fragment cache.
4. `state.results` → `safety: 'reference'`. Still errors on subsequent searches.
5. Traced: `mapResult(result)` builds a `displayResult` object that embeds `rawResult: result` — the pagefind reference. Storing displayResults under freeze transitively freezes the embedded pagefind fragment.
6. `state.displayResults` and `state.selectedResult` → `safety: 'reference'`. Verified zero unhandled rejections across 5 consecutive searches.

## Pattern

**Any signal that transitively reaches a third-party-owned object through any field in its value tree needs `safety: 'reference'`.** Users cannot predict this structurally — `mapResult` looks like it produces user-owned data, but one field (`rawResult`) poisons the tree when frozen.

The fix shape for one library integration: 4 signal opt-outs.

# What currently ships in PR #150 as safety aids

1. **Dev-mode same-ref post-set warning**. In `Signal.set` setter, when `newValue === this.currentValue` and the value is an object, `console.warn` in dev about the canonical `get(); mutate-in-place; set(sameRef)` bug. Zero prod cost. Catches the silent-failure class even under reference-default.

2. **Dev-mode Proxy wrapper on `.value` getter**. For freeze-mode signals, dev reads return a proxy whose set/delete/defineProperty traps throw SUI-authored errors ("Signal value is frozen — cannot set property X. Use signal.set(), a mutation helper, or construct with safety: 'reference' if storing third-party data"). Gated on `config.mode !== 'off'`, `this.safety === 'freeze'`, and `isArray(val) || isPlainObject(val)`. Dev-only perf cost.

3. **Framework-internal opt-outs restored** for signals that hold user-owned references:
   - `packages/renderer/src/engines/native/blocks/each.js` itemSignals → `safety: 'reference'`
   - `packages/templating/src/template.js` settings proxy signals → `safety: 'reference'`

4. **Lit render-template directive** thaws frozen data at the subtemplate boundary (shallow-spread of top-level keys) so `setDataContext` can mutate into `this.data`.

# Three-variant prototypes — measured locally

Each variant built off PR #150 state and benched against deep-freeze-default as baseline. Local tachometer, 50 samples. Numbers in ms.

| Bench | Deep (baseline) | Shallow freeze | Dev-only freeze | Proxy-default (always-on) |
|---|---|---|---|---|
| push-1000x20 | 28.0 | 16.6 (-41%) | 14.8 (-48%) | 24.7 (-13%) |
| set-index-300 | 6.0 | 2.8 (-53%) | 1.2 (-80%) | **13.7 (+135%)** |
| list-filter-1000x300 | 4.5 | 4.3 (-4%) | 3.6 (-19%) | **16.5 (+275%)** |
| set-property-by-id-100 | 11.5 | 12.5 (+9%) | 10.3 (-10%) | 10.8 (-4%) |
| list-replace-1000x500 | 108.4 | 111.9 (+3%) | 106.1 (-6%) | **134.8 (+26%)** |
| fanout-500x1200 | 66.7 | 67.5 (+1%) | 65.6 (-2%) | 67.5 (+0%) |
| multi-read-5x80k | 68.0 | 68.1 (+0%) | 68.1 (+0%) | 69.3 (+2%) |
| computed-chain-10x30k | 65.3 | 65.6 (+0%) | 65.5 (+1%) | 66.2 (+2%) |

## Implementation shapes (each is diff-size of ~10-20 lines off PR #150)

**Shallow freeze**: `protect()` → `Object.freeze(value)` instead of `deepFreeze`, gated to arrays + plain objects. Mutation helpers unchanged (still spread-and-protect, but protect is now O(1) instead of O(N)). Children stay mutable → transitive-poison gone.

**Dev-only freeze**: `protect()` gates on `config.mode !== 'off'`. Introduces `get protecting()` accessor used by mutation helpers. In prod, protect is a no-op and mutation helpers take the in-place-mutate branch (reference semantics). In dev, full deep-freeze behavior.

**Proxy-default (always-on)**: `protect()` is a no-op. `.value` getter wraps reads in a proxy with set/delete/defineProperty traps that throw. Mutation helpers always mutate in place on raw value. Proxy wrapping is always-on, not dev-gated.

## Test suite impact per variant

- Shallow: **92/92 reactivity tests pass**.
- Dev-only: 1 test fails ("throws under freeze when mutate tries to mutate in place" — expected, prod path doesn't throw).
- Proxy-default: 2 tests fail (expected — no freeze means raw value isn't frozen).

## Proxy-default read-path observation

The +275% on `list-filter-1000x300` reflects the tight-loop read cost: the reaction walks 1000 items and reads 4 properties each; every property access goes through the proxy's (default) `get` trap plus V8 inline-cache invalidation. This matches the concern raised during design that proxy-default would need framework internals to take `.peek()` / direct `.currentValue` access to bypass the wrapper on hot template paths. The prototype did not attempt that optimization — numbers reflect naive always-wrap behavior.

# What we changed our minds on (trajectory)

The decision path through this session went through three full revisions. The evidence that shifted each one:

1. **Session start**: PR #150 had `reference` default silently landed during the A/B experimentation. Planning consensus said `freeze` was the 1.0 default. Reasoning: silent get-mutate-set is worse to debug than visible freeze errors.
2. **After fresh agent #1 consultation**: Confirmed freeze as default. Dismissed dev-only freeze on grounds that "agents write code that runs in environments you don't control; bugs that slip through dev fail silently in prod."
3. **After fresh agent #2 consultation**: Still freeze as default. Rejected proxy as default because of unmeasured perf cost in template render path + Map/Set internal-slot silent failures. Filed proxy as 1.1 R&D.
4. **After pagefind reproduction**: Pagefind required 4 signal opt-outs for one library. Transitive-poison pattern exposed. No code change yet — flagged as usability concern.
5. **After bench report**: The write-heavy micro-benches regressed 25%–603% against reference. Cost model traced to O(N) spread + O(N) freeze walk in mutation helpers.
6. **After shallow/dev-only/proxy prototypes benched**: Shallow and dev-only recover most of the write cost; proxy-default actively regresses on tight-loop reads.

The decision has been revised each time new data arrived. The current state of the branch ships deep-freeze default; no variant has been chosen or merged.

# Currently uncertain / unexplored

1. **Does shallow freeze preserve the agentic-safety argument adequately?** It catches top-level mutations (`get().push(x)`, `get().foo = 'x'`) which are the most common footgun. It silently allows nested mutation (`get().items[0].name = 'x'`). Whether this trade is acceptable depends on how commonly agents produce the nested-mutation pattern — not measured.

2. **Does dev-only freeze's "bugs that slip through dev" concern actually bite?** The post-set same-ref warning (already in PR) catches the canonical `get(); mutate; set(sameRef)` case independently of runtime freeze. What other silent-failure classes exist under reference-default that a dev-mode tool can't catch? Not enumerated.

3. **Can proxy-default be made fast enough for default by swapping framework internals to `.peek()`?** Renderer internals already use `this.currentValue` direct access in some paths; full audit + swap not attempted. Numbers above are naive always-wrap.

4. **What does a realistic UI app under each variant actually look like in bench terms?** todo + js-framework benches show "no change" for all variants vs baseline — the signal-reactive-* micro-benches are the ones showing deltas. Not clear which is the better predictor of user experience.

5. **Method-wrapping for Map/Set under proxy**: flagged as a structural silent-failure hole (proxy can't intercept Map.set because it operates on internal slots). No prototype.

# Files where state lives

- `packages/reactivity/src/signal.js` — main implementation (Signal class, protect, value getter/setter, mutation helpers)
- `packages/reactivity/src/helpers.js` — shared runtime config (mode, safety default)
- `packages/utils/src/cloning.js` — deepFreeze implementation with isPlainObject gate
- `src/components/global-search/global-search.js` — worked example of 4 signal opt-outs for pagefind integration
- `packages/renderer/bench/tachometer/bench-signal.js` — the regressed micro-benches

---

That's the evidence. No conclusions offered — the reader is expected to form their own read of what this data implies for the 1.0 default and the R&D trajectory.
