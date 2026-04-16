---
title: Signal Safety v2 — Finalization
branch: perf/signal-safety-v2
status: Ready for execution
supersedes: ai/plans/signal-performance.md (default decision)
related: ai/workspace/signal-safety-v2-debrief.md
---

# Signal Safety v2 — Finalization

## Decision

**Ship `freeze` as the 1.0 default.** The default currently in the working tree (`reference`) is an unstaged change that should be reverted. Proxy-based protection (`protect`) is an architecturally stronger answer but needs measurement and Map/Set correctness work; hold it as R&D in a separate branch for potential 1.1.

### Preset lineup for 1.0

| Preset | Set behavior | Read behavior | Dedupe | Mutation through `.get()` | Use case |
|---|---|---|---|---|---|
| `freeze` (default) | `deepFreeze` on plain objects/arrays; pass-through on Map/Set/Date/class | direct return | `isEqual` | throws (plain) / silent (Map/Set/Date/class) | user state, spec data, settings |
| `reference` | direct | direct return | `isEqual` | silent (all types) | third-party object holders, perf-critical paths, framework internals |
| `none` | direct | direct return | never | silent (all types) | event-stream semantics |

## Why freeze over reference for 1.0

Silent failure classes, ranked by diagnostic cost:

- **Reference's class**: any `get(); mutate-in-place; set(sameRef)` anywhere in user code. Broad, no location signal, UI just doesn't update.
- **Freeze's class**: mutation through `.get()` on Map/Set/Date/class instances. Narrow (non-plain-object types), and the `isPlainObject` gate in `deepFreeze` is intentional per the source comment in `packages/utils/src/cloning.js:7-12`.

Freeze additionally produces loud failures for the plain-object/array case — the ~95% path. Reference produces no loud failures. For the stated agentic-development audience, loud-failure-with-known-escape-hatch dominates silent-as-default.

## Why not proxy-default for 1.0

Architecturally, proxy is the right tool for the scope-mismatch problem (freeze mutates memory it doesn't own; see `signal-safety-v2-debrief.md` for the pagefind case). Practically, three blockers:

1. **Perf cost in the render path is unmeasured.** Template expression reads already route through a flat-namespace Proxy; adding signal-level proxy means every template read is `Proxy → Signal → Proxy → value`. 100-item each block × 5 fields = 500 proxied reads per render pass. CI has been catching ~4% regressions on this path. This could be larger.
2. **Map/Set/class instances with internal slots.** Mutations through `Map.prototype.set` operate on internal slots — either silent-success or "incompatible receiver" throw. Needs method-wrapping, not just doc carve-out. Otherwise proxy re-introduces the exact silent-failure class it claims to prevent.
3. **1.0 default is a commitment.** Reference-to-freeze flip in 1.1 is a meaningful breakage of user code. Freeze-to-proxy flip is roughly source-compatible at mutation sites. Defaulting to the weaker-safety option now and escalating later is worse than the reverse.

## Work items

Ordered for landing. Each item is independent unless noted.

### 1. Flip default to `freeze`

`packages/reactivity/src/helpers.js:12` — revert `safety: 'reference'` back to `safety: 'freeze'`. The `allowClone: false` compat shim in `signal.js:26` continues to resolve to `'reference'` for the bench fairness baseline.

### 2. Dev-mode post-set reference check

In `Signal.set value()`:

```js
set value(newValue) {
  if (!this.equalityFunction(this.currentValue, newValue)) {
    this.currentValue = this.protect(newValue);
    this.notify();
    return;
  }
  if (config.mode !== 'off'
      && newValue !== null
      && typeof newValue === 'object'
      && newValue === this.currentValue) {
    console.warn(
      'Signal.set() called with the same reference as the current value. ' +
      'If you mutated in place, the reactive update is lost. ' +
      'Use signal.push/splice/setProperty, or return a new value from mutate(). ' +
      'If this was intentional, construct a new value and set that instead.'
    );
  }
}
```

Gated behind `config.mode !== 'off'` to stay zero-cost in prod. Works under any safety preset. Under freeze it's redundant (the mutation already threw) but harmless.

Trace validation:
- `get(); mutate-in-place; set(sameRef)` → identity short-circuit in `isEqual` (line 16 of `equality.js`) → `!false` → check fires ✓
- `get(); build-new; set(newRef)` → isEqual returns false → notify branch, no warn ✓
- `set(freshEqualObject)` → isEqual returns true, but `!==` currentValue → no warn ✓ (no false positive on intentional re-sets)

### 3. Dev-mode freeze error decoration via `.get()` Proxy wrapper

**Why the obvious try/catch approach doesn't work**: `Object.freeze` succeeds silently at `set()` time. The native `TypeError: Cannot assign to read only property X` fires later, in user code at the mutation site (`signal.get().push(x)`). By then, `Signal.set()` has long since returned — we're not on the call stack, there's nothing to wrap. Any try/catch inside `set()` catches nothing.

**The only mechanism that can replace the native message**: wrap frozen values in a dev-only `Proxy` on `.get()`. The Proxy's set/delete/defineProperty traps fire before the native freeze check, so they can throw SUI-authored errors instead.

Approach — route wrapping into the `value` getter, not `get()`. `Signal.prototype.get` currently delegates to `get value()`; templates compile to `.value` access via the expression evaluator. Wrapping only `get()` would leave `.value` returning the raw frozen value, bypassing dev protection on the hot template path. Wrap at `value` and `get()` inherits automatically.

**Gate the wrapping to match what `deepFreeze` actually froze.** Two gates beyond `config.mode`:

1. `this.safety === 'freeze'` — reference and none modes have documented silent-mutation semantics (see preset table above); wrapping them would break contract.
2. `isArray(val) || isPlainObject(val)` — mirrors `deepFreeze`'s `isPlainObject` gate in `cloning.js:31`. `deepFreeze` skips Date/Map/Set/RegExp/class instances, so they aren't frozen — wrapping them would cause read-only methods like `get().getTime()` or `get().has(k)` to throw in dev ("incompatible receiver") while succeeding in prod. That's dev behavior being *wrong*, not *stricter*.

```js
import { isArray, isPlainObject } from '@semantic-ui/utils';

const devProxyCache = new WeakMap();

get value() {
  this.depend();
  const val = this.currentValue;
  if (config.mode === 'off'
      || this.safety !== 'freeze'
      || val === null
      || typeof val !== 'object'
      || (!isArray(val) && !isPlainObject(val))) {
    return val;
  }
  let proxy = devProxyCache.get(val);
  if (!proxy) {
    proxy = wrapWithFriendlyErrors(val);
    devProxyCache.set(val, proxy);
  }
  return proxy;
}

// get() unchanged — delegates to value, inherits wrapping
```

`wrapWithFriendlyErrors` returns a Proxy whose `set`, `deleteProperty`, `defineProperty`, and `setPrototypeOf` traps throw a SUI-authored `TypeError` that **interpolates the offending property name** for diagnostic value:

> Signal value is frozen — cannot set property `items`. Use `signal.set(newValue)`, one of the mutation helpers (`push`, `splice`, `setProperty`), or construct the signal with `{ safety: 'reference' }` if you're storing data you don't own (e.g. third-party library objects).

(`preventExtensions` is a no-op on an already-frozen target; safe to omit.)

**Trade-offs**:
- **Zero prod cost** — `config.mode === 'off'` short-circuit returns raw frozen value. Native TypeError still fires on mutation in prod, but that's acceptable (prod assumes dev-tested code).
- **Per-access proxy overhead in dev** — one handler dispatch per property read. Dev workflows already tolerate source maps, hot reload, devtools. In the noise.
- **WeakMap caching** — `get().x === get().x` holds for the lifetime of the underlying value. No invalidation needed; GC handles cleanup when the value is replaced.
- **Nested access limitation** — the Proxy wraps only the top level. `signal.get().nested.prop = x` reads `nested` raw (still frozen) and throws the native TypeError. Users hitting the outer error once learn the pattern; nested cases become pattern-recognizable. Not worth the per-property-read cost of recursive wrapping for marginal diagnostic gain.
- **Map/Set/class behavior in dev** — method calls on proxy-wrapped Maps/Sets hit spec's "incompatible receiver" TypeError instead of silent success. Different error, but still loud — acceptable dev/prod asymmetry where dev is *stricter* than prod.
- **`get() === peek()` divergence in dev** — in prod (`config.mode === 'off'`), both return the raw value and compare equal. In dev, `get()` returns a Proxy while `peek()` returns raw, so they compare unequal. Users who need reference equality between the two should use `peek()` — it's the documented escape for "give me the raw value regardless of mode." Pin this in docs so it isn't discovered as a dev-only bug later.

**Resolves Open Question #1**.

### 4. Notify hot-path guard hoisting

Currently in `Signal.notify()`:

```js
notify() {
  this.setContext();  // guards inside
  this.setTrace();    // guards inside
  this.dependency.changed(this.context);
}
```

Two guaranteed function calls per notify even under `config.mode === 'off'`. The plan's fix #5 claimed this was shipped but it's regressed. Hoist the guard:

```js
notify() {
  if (config.mode !== 'off') {
    this.setContext();
    this.setTrace();
  }
  this.dependency.changed(this.context);
}
```

Same pattern in `Reaction.run()` around `addContext`.

Ship the hoist for **readability** — the guard belongs at the `notify()` level where the reader expects to see it, not buried in callees. Don't claim perf win without measurement; V8 may already be inlining the trivial early-returns. If the profile (item 7) shows these calls as hot, that's a bonus; if not, the code is still cleaner.

### 5. Third-party limitation documentation

Add to `packages/reactivity/README.md` (or the signals user guide, whichever is canonical now) a section: **Signals and foreign references**. Content:

- What freeze does at set time
- The user-facing heuristic (placed prominently):

  > **When you need `{ safety: 'reference' }`**: if you're storing an object in a signal that you did not construct yourself — anything returned from a library, fetched from an API, or passed through a callback — default to `safety: 'reference'`. Freeze is the right default for state your own code owns end-to-end. For borrowed data, reference avoids poisoning the lender's internal references.

- Pagefind as a worked example of the heuristic
- Construction-site syntax for the opt-out

The heuristic is the general rule; pagefind is one instance. Users can apply the rule to unknown libraries without having to know SUI's internals.

Placement: near the top, not buried. This is the first-order surprise users will hit; it deserves prime real estate.

### 6. Remove `allowClone` compat shim + rebuild bench baseline

Drop the compat branch in `signal.js:26`. Audit callsites:

**Code:**
- `packages/renderer/bench/tachometer/bench.js` (2 sites)
- `packages/renderer/bench/tachometer/bench-todo.js` (1 site)
- `docs/src/examples/reactivity/variables/reactive-clone/index.js`
- `docs/src/examples/reactivity/advanced/reactive-notify/index.js`
- `ai/workspace/autoresearch/*.js` (3 sites — check if still relevant or can be deleted)
- `tools/mcp/api/mcp.js` (may be a bundled artifact — verify before touching)

**User-facing documentation (must be updated or removed, not just code):**
- `docs/src/pages/docs/api/reactivity/signal.mdx` (~5 references)
- `docs/src/pages/docs/api/reactivity/signal-options.mdx` (~2 references)
- Any other `docs/src/pages/docs/*/reactivity*.mdx` hits (grep to confirm)

**Agent-facing skills (teach new patterns):**
- `ai/skills/authoring/*` — any skills that reference `allowClone` in guidance or examples
- `ai/skills/contributing/internals.md` — internals doc may reference the old option

Migrate each code site to `{ safety: 'reference' }` or `{ safety: 'none' }` based on the original intent. For docs and skills, rewrite the guidance around the `safety` preset and the third-party-reference heuristic from Item 5 — don't leave dual documentation of both APIs. Grep pass (`grep -r allowClone`) before committing to confirm no references linger.

**Baseline rebuild**: tachometer currently compares PR against main with `allowClone: false` on both sides. After removing the shim, the baseline needs to be rebuilt on a reference that has only `safety: 'reference'`. Commit the baseline rebuild explicitly so the next engineer chasing a regression understands the history shift.

### 7. Front-remove regression profiling

Residual +4% on `remove-first` and `remove-5-front` per the debrief. Method (from the debrief's suggested path):

1. Open `http://localhost:8765/ci-current-todo.html` and `ci-baseline-todo.html` after starting a server from `packages/renderer/bench/tachometer/`.
2. Chrome-devtools MCP `performance_start_trace` with `reload: true, autoStop: true`.
3. Extract samples within the `remove-first` measure window on both.
4. Diff per-function sample counts.

Most likely candidates per the debrief: `itemSignal.set` in reconcile phase 3, wrapper object allocation in `getEachData`, `Signal.prototype.set` instruction sequence, class-size / inline-cache interaction.

Accept "we ship with this residual" as a valid outcome if the profile doesn't identify a tractable delta. The net perf story is strongly positive.

### 8. Bonus: Signal.defaultClone correctness for class instances

Separate from the safety decision but uncovered during review:

`Signal.defaultClone = clone;` at `signal.js:387`. Under reference-mode `mutate()`, `clone(currentValue)` on a class instance strips the prototype (`cloning.js:91-104` — `preserveNonCloneable: true` required to preserve). The `before` snapshot for comparison is a plain object with copied own-keys, different prototype from the live value.

Effect today: `isEqual`'s `getProto` check (`equality.js:41`) returns false, so notify always fires. Accidentally correct. But user-supplied `equalityFunction` inspecting `before` sees a corrupted snapshot.

Fix: either `Signal.defaultClone = (v) => clone(v, { preserveNonCloneable: true })` or skip the `before` snapshot path for non-plain types.

Low urgency. File as a follow-up if not addressed in this branch.

## Proxy prototype — R&D branch

Separate branch. Deliverable: measurements, not shipped code.

Success criteria for proxy-default consideration in 1.1:

1. **Render-path perf**: No regression >2% on any `bench-todo.js` bench vs freeze-default baseline. Renderer internals may take `.peek()` or direct `.currentValue` access where needed; that's in scope.
2. **Map/Set method-wrap correctness**: `signal.get().set(k, v)` on a Map-holding signal throws (loud) or routes through a mutation helper that notifies — not silent. Document which.
3. **Private-field class instances**: document the carve-out honestly. Users need to know "class instances with `#private` fields aren't protected at `.get()`."
4. **Identity stability**: `get().x === get().x` holds across reads of the same value. WeakMap-cached proxies.
5. **Pagefind-class case works without user code change**: the debrief's pagefind reproduction runs clean.

If all five land, present measurements and propose default flip for 1.1.

## What not to do

- Don't ship `reference` as 1.0 default. Breaking-change risk at 1.1 exceeds the cost of shipping freeze now.
- Don't ship proxy-default speculatively. Measurement-first per the proxy branch above.
- Don't add speculative micro-optimizations without diagnostic evidence (per debrief's agent-lessons — twice-regressed this session already).
- Don't expand scope to rewrite `Signal.computed` / `Signal.derive` or touch the reaction/scheduler surface. This branch is about the safety preset defaults + dev-mode safety net + measurement.

## Resolved (post-review round 1)

- **Item 3 approach** — dev-only Proxy wrapper on `.get()` (the only mechanism that can intercept mutations on frozen values before the native TypeError fires). See rewritten Item 3.
- **Documentation approach** — include the user-facing heuristic in Item 5, not just worked examples. See updated Item 5.
- **Warning text refinement** — Item 2 warning now includes hint for intentional `set(get())` case.
- **Item 4 framing** — ship hoist for readability, don't claim perf without measurement.

## Resolved (post-review round 2)

- **Item 3 value-getter routing** — wrap at `get value()` instead of `get()`, so `.value` and `.get()` stay consistent and templates compiling to `.value` access don't bypass dev protection.
- **Item 3 trap completeness** — `setPrototypeOf` added to trap list; `preventExtensions` omitted as no-op on already-frozen target.
- **Item 3 error message** — interpolate the offending property name for agent-legible diagnosis.
- **Item 3 identity divergence** — documented `get() === peek()` divergence in dev vs prod as a known asymmetry.

## Resolved (post-review round 3)

- **Item 3 safety-mode gate** — only wrap when `this.safety === 'freeze'`. `reference` and `none` modes have documented silent-mutation semantics; wrapping them would break contract.
- **Item 3 type gate** — only wrap arrays and plain objects, mirroring `deepFreeze`'s `isPlainObject` gate. Wrapping Map/Set/Date/class would cause read-only methods to throw in dev while succeeding in prod (dev-wrong, not dev-stricter).
- **Item 6 audit expansion** — `allowClone` migration extends to user-facing docs (`signal.mdx`, `signal-options.mdx`) and agent-facing skills (`ai/skills/authoring/*`, `internals.md`), not just code. Confirm with `grep -r allowClone` pass before committing.

## Open questions

1. **Dev-mode check scope** — only `Signal.set`, or also the mutation helpers (`push`/`splice`/etc.) when they happen to produce a same-reference result? Probably just set — the helpers are built to produce new refs — but worth confirming during implementation.
2. **`allowClone` removal timing** — in this branch (alongside the default flip), or held until 1.0 cut? The bench baseline rebuild cost is paid either way. Leaning: do it now, in this branch, so 1.0 has a clean surface.
3. **Class-instance bonus item (Item 8)** — include in this branch or file as follow-up? Leaning: follow-up, since it's latent (accidental correctness via `getProto` mismatch) and unrelated to the safety-preset decision.
4. **`ai/workspace/autoresearch/*.js` allowClone callsites** — migrate or delete? Other agent will verify when reaching Item 6.

## Execution sequence

Proposed order (dependencies noted):

1. **Items 1, 2, 4** — mechanical changes, land together (default flip, dev-mode check, hot-path guard hoist).
2. **Items 3, 5** — user-facing surface (Proxy wrapper + docs). The Proxy wrapper is the larger change; docs depend on it landing to describe final behavior accurately.
3. **Item 6** — `allowClone` removal + bench baseline rebuild. Commit boundary matters here — separate commit so history is navigable.
4. **Item 7** — profile the residual +4% front-remove regression. Accept as shipped residual or fix.
5. **Item 8** — file separately, don't expand scope of this branch.

## Session handoff

Plan converged. Other agent executes items 1–7. This agent reviews the diff post-implementation. Proxy R&D branch dispatched separately once 1.0 finalization lands and measurement infrastructure is ready.
