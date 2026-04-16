## Verdict

**Plan has 2 specific issues in Item 3 (dev-mode Proxy wrapper), plus a minor gap in Item 6's migration-site audit.** The remaining items check out against the source. Most of the plan is correct as written — the core reasoning about freeze-vs-reference tradeoffs, Items 1/2/4/5/7/8, and the Q2 claims about utils all verify cleanly.

The two Item 3 issues are load-bearing:
1. **The Proxy wrapper is not gated on safety mode.** Under `safety: 'reference'` or `safety: 'none'` in dev, every value read through `.value`/`.get()` would be wrapped in a mutation-blocking Proxy, throwing SUI-authored TypeErrors on mutation — which is the exact behavior those presets opt out of.
2. **The Proxy wrapper breaks method calls on non-plain objects.** Date/Map/Set/class instances aren't frozen by `deepFreeze` (gated on `isPlainObject` at `cloning.js:31`) but ARE wrapped by the proposed proxy (gated only on `typeof val === 'object'`). Method calls via `this = proxy` hit "incompatible receiver" TypeErrors for both mutation AND read methods — `signal.get().getTime()` on a Date throws in dev; `signal.get().has(k)` on a Map throws in dev.

Item 6's migration-site audit misses live documentation (API reference and guides) that refers to `allowClone`.

## Per-question findings

### Q1 — Item 3 Proxy wrapper correctness

**Walk-through of each mutation shape against the proposed implementation** (plan at `signal-safety-v2.md:91-103`):

#### (a) `signal.get().push(x)` on an array-holding signal (freeze mode)

Under freeze, the array is deep-frozen (`cloning.js:18-25`). Proxy wraps the frozen array (`typeof val === 'object'` at plan line 95). `push(x)` performs `[[Set]]('length', oldLen+1)` and `[[Set]](oldLen, x)`. The proxy's `set` trap fires before native frozen-object enforcement and throws SUI-authored TypeError. ✓ Works as plan claims.

#### (b) `signal.get().prop = x` on a plain-object-holding signal (freeze mode)

Same as above — `set` trap fires, throws SUI error. ✓

#### (c) `signal.get().nested.prop = x` (nested access)

`get` trap on `'nested'` returns `target.nested` (the raw frozen inner value — no recursive wrapping). Then `rawNested.prop = x` on a frozen target hits native enforcement → native TypeError. ✓ Plan's claim at lines 118 is accurate.

#### (d) `signal.get().set(k, v)` on a Map-holding signal (freeze mode) — **ISSUE**

`deepFreeze` at `cloning.js:31` skips Maps (Maps are not `isPlainObject`). So the Map is NOT frozen. However, the proposed Proxy wraps the Map (the guard at plan line 95 only checks `typeof val === 'object'`, not plain-object-ness).

`proxy.set(k, v)`:
1. `get` trap on `'set'` → returns `Map.prototype.set`.
2. Invoke with `this = proxy`.
3. `Map.prototype.set` checks `this.[[MapData]]` internal slot. Proxy doesn't have it → **TypeError: Method Map.prototype.set called on incompatible receiver**.

The plan's trade-off section (line 119) acknowledges this: "method calls on proxy-wrapped Maps/Sets hit spec's 'incompatible receiver' TypeError instead of silent success." Framed as "acceptable dev/prod asymmetry." This is fine for mutation methods — silent in prod, loud in dev is arguably stricter-is-better.

#### (e) `signal.get().getTime()` on a Date-holding signal (freeze mode) — **ISSUE**

Identical mechanism to (d), but for a **read-only** method. Date is not frozen by `deepFreeze` (not `isPlainObject`). But Proxy wraps it.

`proxy.getTime()`:
1. `get` trap on `'getTime'` → returns `Date.prototype.getTime`.
2. Invoke with `this = proxy`.
3. `Date.prototype.getTime` checks `this.[[DateValue]]`. Proxy doesn't have it → **TypeError: Method Date.prototype.getTime called on incompatible receiver**.

**This is the first real bug in the plan.** The plan's "acceptable dev/prod asymmetry where dev is stricter" framing at line 119 applies only to mutation methods. Read-only methods on Date/Map/Set/class instances succeed in prod (raw value is returned) but throw in dev (proxy breaks internal-slot access). This is not "dev stricter" — it's "dev breaks working prod code."

The same applies to:
- `signal.get().has(k)`, `signal.get().get(k)`, `signal.get().keys()`, `signal.get().size` on Map-holding signals
- `signal.get().has(v)`, `signal.get().size` on Set-holding signals
- `signal.get().getHours()`, `.getDate()`, etc. on Date-holding signals
- Any method on a class-instance-holding signal that accesses internal slots or private fields

The carve-out needed: additional guard `if (!isPlainObject(val) && !isArray(val)) { return val; }` before the proxy wrap, matching what `deepFreeze` actually froze. The plan's `isPlainObject` rationale at line 29 (quoting the `cloning.js:27-30` comment) should apply to the dev Proxy as well.

#### (f) `signal.get()` consumed by `JSON.stringify` / `structuredClone`

`JSON.stringify(proxy)`: iterates `[[OwnPropertyKeys]]` and reads via `[[Get]]`. For plain-object/array proxies with no `ownKeys`/`getOwnPropertyDescriptor` traps, default behavior delegates to target. Works. ✓

`structuredClone(proxy)`: uses similar enumeration for plain objects/arrays. Works. For Map/Set wrapped in proxy, `structuredClone` brand-checks — may fail with the same incompatible-receiver issue. Dev-only asymmetry again.

#### Proxy invariant review

For frozen plain objects/arrays, the main invariants to check:
- **`Object.isFrozen(proxy)`**: Default `isExtensible` trap delegates to target → returns false for frozen target. `Object.isFrozen` iterates properties via `getOwnPropertyDescriptor`, default trap delegates. Returns true. ✓ Consistent.
- **`[[Set]]` invariant on non-writable+non-configurable data properties**: The spec requires the trap not return true unless the value would have been set. Throwing is permitted (proxy handler throws propagate). ✓
- **`[[Get]]` invariant**: Must return target's exact value for non-writable+non-configurable data properties. Without a `get` trap, default delegates. ✓ If the plan's `wrapWithFriendlyErrors` doesn't add a `get` trap, this holds.

No Proxy invariant violations identified on frozen targets.

#### Additional issue — Proxy ignores safety mode

The proposed `get value()` at plan line 91-103 gates only on `config.mode === 'off'` and `typeof val === 'object'`. **There is no check on `this.safety`.** Under `safety: 'reference'` or `safety: 'none'` in dev mode:

1. The value is NOT frozen (`protect` at `signal.js:45-48` short-circuits non-`freeze` modes).
2. The Proxy still wraps the value.
3. Mutation through `.get()` is supposed to be silently allowed under `reference`/`none` — that's the entire point of these presets.
4. But the Proxy's `set` trap throws SUI-authored TypeError with a message that explicitly says: **"construct the signal with `{ safety: 'reference' }` if you're storing data you don't own"** — even when the signal already has `safety: 'reference'`.

Compare with the plan's own table at lines 19-22:

| Preset | Mutation through `.get()` |
|---|---|
| `freeze` | throws (plain) / silent (Map/Set/Date/class) |
| `reference` | silent (all types) |
| `none` | silent (all types) |

The Item 3 implementation as written **violates rows 2 and 3** of this table in dev mode. The proxy should be gated on `this.safety === 'freeze'` in addition to `config.mode !== 'off'`.

**Verdict on Q1**: Two concrete implementation bugs in Item 3's code sketch — (1) missing safety-mode gate, and (2) missing isPlainObject/isArray gate for wrapping. Both are fixable with one-line guard additions. The overall approach (dev-mode Proxy on the `value` getter, WeakMap-cached) is sound.

### Q2 — Claims about utils

Verified each claim against source:

**Claim: deepFreeze skips Map/Set/Date/class instances via `isPlainObject`.**
Source at `cloning.js:13-41`:
- Line 18: `if (isArray(value))` — arrays recursed
- Line 31: `if (isPlainObject(value))` — plain objects recursed
- Otherwise: returns value unchanged (lines 14-16 are null/non-object/already-frozen/cycle guards)

`isPlainObject` at `types.js:9-13` requires proto to be `null` or `Object.prototype`. Map/Set/Date/RegExp/class instances all have other prototypes → `isPlainObject` returns false → they fall through without freezing. ✓ Claim accurate.

**Claim: isEqual identity short-circuit at top.**
Source at `equality.js:16`: `if (a === b) { return true; }` — literally the first line after the function opens. ✓ Claim accurate.

**Claim: clone not preserving class-instance prototypes by default.**
Source at `cloning.js:91-103`:
- Line 92: `if (preserveNonCloneable && isClassInstance(src)) { return src; }` — only preserves when flag is true.
- Lines 95-97: falls through to `copy = {}` (or `Object.create(null)` for null-proto plain objects). Class instances always land here without the flag.
- Line 99-103: copies own-keys to the new empty object.

Result: clone without `preserveNonCloneable` returns a plain object with copied own-keys and `Object.prototype` as proto. ✓ Claim accurate.

`Signal.defaultClone = clone;` at `signal.js:387` passes no options, so `preserveNonCloneable` defaults to false (from destructuring default at `cloning.js:109`). ✓ Plan's Item 8 premise accurate.

**Claim: `isEqual` `getProto` comparison relevant to Item 8.**
Source at `equality.js:41`: `if (getProto(a) !== getProto(b)) { return false; }` — runs before keys are walked. With a class-instance `currentValue` and a plain-object `before` (from clone stripping the prototype), `getProto` differs → returns false. ✓ Claim accurate.

**Verdict on Q2**: All four claims about utils verify cleanly against source. No divergence.

### Q3 — Item 2 dev-mode check completeness

Proposed check (plan lines 52-71):

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
    console.warn(...);
  }
}
```

Trace through the cases in the plan (lines 76-78):

1. **`get(); mutate-in-place; set(sameRef)`** under freeze or reference:
   - `isEqual(sameRef, sameRef)` — identity short-circuit (`equality.js:16`) → true
   - `!true` → skip notify branch
   - In warning check: all four conditions pass (object, not null, same ref) → warns ✓

2. **`get(); build-new; set(newRef)` with deep-equal content**:
   - `isEqual(old, new)` → true via deep walk
   - Skip notify branch
   - `newValue !== currentValue` (different refs) → skip warn ✓ (no false positive)

3. **`set(freshEqualObject)`**: same as (2). ✓

Additional cases not in the plan's trace:

4. **Primitives** (`set(5)` when current is `5`):
   - `isEqual(5, 5)` → true, skip notify
   - `typeof newValue === 'object'` is false → skip warn ✓ No false positive

5. **`set(null)` when current is `null`**:
   - `isEqual(null, null)` → true, skip notify
   - `newValue !== null` guard rejects → skip warn ✓

6. **`set(undefined)` when current is `undefined`**:
   - Guard on `typeof newValue === 'object'`: `typeof undefined === 'undefined'` → skip warn ✓

7. **Frozen-object re-set under freeze**: `set(sig.get())`. Proxy interaction (Item 3) aside, with raw values: `isEqual(frozen, frozen)` → true identity, `newValue === currentValue` → warn fires. This is a legitimate anti-pattern warning.

8. **Under `safety: 'none'`**: `equalityFunction = Signal.noEquality = () => false`. `!false` → true → always enters the notify branch → `return` → warning check is unreachable. Plan's claim "Works under any safety preset" at line 73 is slightly imprecise: the warning cannot fire under `'none'`. Not a bug — `none` opts out of dedup semantics, so warning on re-set would be noise.

9. **Check is redundant but harmless under freeze (as plan notes at line 73)**: If the user did in-place mutation on a frozen value, the mutation would have thrown before reaching `set`. So the check fires only when the user *successfully* mutated (i.e., under reference/none). Correct narrowing.

No false positives found. No missed true positives beyond the `'none'` preset (by design). ✓

**Verdict on Q3**: Check is correct. Minor wording imprecision at plan line 73 ("Works under any safety preset") — under `'none'` it never runs, but that's acceptable behavior.

### Q4 — Item 4 hot-path guard hoisting

Traced all paths under `config.mode === 'off'`:

**Constructor** (`signal.js:38`): `this.setContext(context)` → early returns at `signal.js:347`. `this.context` never assigned (remains `undefined`).

**Current `notify()`** (`signal.js:89-93`):
- `setContext()` → early returns. `this.context` still `undefined`.
- `setTrace()` → `captureStack` at `helpers.js:17` early returns under `!== 'stack'`.
- `this.dependency.changed(this.context)` → passes `undefined`.

**Proposed hoist**:
- Skip `setContext()` + `setTrace()` under `'off'`. `this.context` still `undefined`.
- `this.dependency.changed(this.context)` → passes `undefined`. ✓ Identical.

**`Dependency.changed(undefined)`** (`dependency.js:19-32`):
- Under `'off'`, skips the `setContext` block at lines 20-27.
- `const ctx = this.context;` — `this.context` on Dependency was never set under `'off'` (see constructor at `dependency.js:7-10` which skips setContext). So `ctx = undefined`.
- Loop calls `subscriber.invalidate(undefined)`.

**`Reaction.invalidate(undefined)`** (`reaction.js:61-69`):
- `if (context)` → falsy → skip `addContext`. ✓
- Schedules reaction.

Conclusion: Under `'off'`, `this.context` remains accessible (as `undefined`) to `dependency.changed`, which handles the `undefined` case consistently. The hoist preserves behavior. ✓

**Mode `!== 'off'` path**:
- Current: `setContext` runs, assigns `this.context = { value: currentValue }`. `setTrace` runs, may attach `stack` if mode === 'stack'. Then `dependency.changed(this.context)` with populated context.
- Proposed: identical (just moves the mode check up one level).

The plan's claim at line 148 that `Reaction.run()` has the "same pattern" is interpretable two ways:
- Already-hoisted reference (`reaction.js:42-46` already gates `addContext` with an outer `config.mode !== 'off'` check) — true, reading this as "pattern to mirror."
- Additional hoisting needed — redundant, since the call site already hoists.

Either reading is non-blocking. The hoist is correct on the Signal side.

**Verdict on Q4**: Hoist preserves current behavior under both `'off'` and active modes. Clean. ✓

### Q5 — Item 6 callsite audit

Plan lists 6 files + 1 bundled-artifact caveat (plan lines 172-177). Verification via Grep:

| Plan's entry | Verified sites | Notes |
|---|---|---|
| `bench.js` (2) | `bench.js:90,91` | ✓ 2 sites |
| `bench-todo.js` (1) | `bench-todo.js:65` | ✓ 1 site |
| `reactive-clone/index.js` | `.../index.js:8` | ✓ 1 site (in live example) |
| `reactive-notify/index.js` | `.../index.js:3` | ✓ 1 site (in live example) |
| `autoresearch/*.js` (3) | 6 sites across 3 files (`each.best-iter3.js:221,555`, `each.best-iter4.js:221,565`, `each.baseline.js:178,493`) | Plan says "3 sites" but there are 6. Probably file-count vs. use-count confusion. Plan's own Open Question #4 flags these as "migrate or delete" anyway. |
| `tools/mcp/api/mcp.js` (may be artifact) | `mcp.js:26619,26624,26666` | **Confirmed artifact** — file header is `// @ts-nocheck` + esbuild-style IIFE wrapper. Not live source. |

**Missing from the plan's list — live docs that still describe `allowClone`:**

- `docs/src/pages/docs/api/reactivity/signal.mdx:34` (options table row), `:71` (example), `:215` (example), `:301` (prose), `:354` (example) — **5 live references in the API reference page.**
- `docs/src/pages/docs/guides/reactivity/signal-options.mdx:63,65` — prose + example in a user guide.
- `ai/skills/authoring/reactive-state.md:52,61,195` — authoring skill served via MCP.
- `ai/skills/authoring/component-state.md:317,322` — authoring skill served via MCP.
- `ai/skills/contributing/internals.md:236` — contributing skill served via MCP.
- `ai/workspace/artifacts/skills/sui-value-propositions.md:281,286` — agent workspace artifact.

These are not `new Signal(..., { allowClone: ... })` callsites that would break at runtime, but they are **documentation/skill references** that become stale when the shim is removed. Per the `BREAKING` entry in `CHANGELOG.md:18-19`, the behavior change is already being flagged to users — so these docs need editing in lockstep with the removal.

**Other files referencing `allowClone` (informational, not live code):**
- `ai/guestbook.md:1758,1963` — historical narrative, leave as is
- `ai/plans/signal-performance.md`, `ai/plans/archive/native-renderer.md`, `ai/workspace/plans/signal-safety-v2.md`, `ai/workspace/plans/hydration-optimization.md`, `ai/workspace/fine-grained-data-context-report.md`, `ai/workspace/reference/perf/*`, `ai/workspace/signal-safety-v2-debrief.md`, `ai/workspace/signal-safety-v2-plan-review.md`, `ai/workspace/reference/renderer-performance-suggestions.md` — plan/reference/investigation docs. Leave or prune per housekeeping judgment.

**Verdict on Q5**: Plan's live-callsite list is complete for runtime code. **Missed: live documentation in `docs/src/pages/docs/api/reactivity/signal.mdx` and `docs/src/pages/docs/guides/reactivity/signal-options.mdx`, plus authoring/contributing skills under `ai/skills/`**. The `ai/workspace/autoresearch/*.js` count is 6 use-sites across 3 files, not 3. The `tools/mcp/api/mcp.js` cautious note is correct — it's a bundle.

### Q6 — Item 8 bug description

Trace for `const sig = new Signal(new MyClass({ foo: 1 }))` with default `safety: 'freeze'`... wait, the plan specifies *reference-mode* mutate. Let me redo with `safety: 'reference'`:

`new Signal(new MyClass({ foo: 1 }), { safety: 'reference' })`. `protect` at `signal.js:45-48` returns the instance unchanged under non-freeze. So `currentValue` is the live MyClass instance.

`sig.mutate(v => { v.foo = 2; })`:

1. `signal.js:143` — `this.safety === 'freeze'` is false, fall through.
2. `signal.js:153` — `before = this.cloneFunction(this.currentValue)`.
   - `cloneFunction = Signal.defaultClone = clone` (no options).
   - `clone(MyClassInstance)` at `cloning.js:109-111` calls `cloneValue` with `preserveNonCloneable: false`.
   - `cloning.js:91-104`: `isObject(src)` true, `preserveNonCloneable` false → fall through to line 95.
   - `isPlainObject(src)` false (MyClass.prototype, not Object.prototype) → `copy = {}` (Object.prototype proto).
   - Walks keys, copies them. Result: `before = { foo: 1 }` with `Object.prototype`.
3. `signal.js:154` — `result = fn(currentValue)`. User mutates: `currentValue.foo = 2` (in-place on the live instance). `result` is `undefined` (no return).
4. `signal.js:155` — `result !== undefined` false, fall through.
5. `signal.js:158` — `!this.equalityFunction(before, this.currentValue)`:
   - `equalityFunction = isEqual` (default under `'reference'`).
   - `isEqual({foo: 1}, MyClassInstance{foo: 2})`.
   - `equality.js:16`: `a === b`? No.
   - `equality.js:17-22`: NaN check, null check, primitive check — all skipped.
   - Go to `deepEqual`.
   - `equality.js:31-38`: same checks, skipped.
   - `equality.js:41`: `getProto({foo:1}) !== getProto(MyClassInstance)` → `Object.prototype !== MyClass.prototype` → true → **return false**.
   - `!false` → true.
6. `signal.js:159` — `this.notify()` fires. ✓

So notify fires. Plan says "notify always fires. Accidentally correct." ✓

**Subtlety the plan doesn't emphasize**: the `getProto` mismatch makes `isEqual` return false *regardless of whether the mutation actually changed content*. So `sig.mutate(v => { /* no-op */ })` under reference + class-instance **ALSO fires notify spuriously**. The plan's description focuses on the mutation case (where notify is accidentally-correct). The no-op case is accidentally-wrong — spurious notify. Both are fixed by `preserveNonCloneable: true`.

Plan's recommendation (line 204) — `Signal.defaultClone = (v) => clone(v, { preserveNonCloneable: true })` — addresses both.

**Verdict on Q6**: Plan's description is accurate. The "accidentally correct" framing is narrower than reality (no-op case is accidentally wrong), but the proposed fix is correct for both cases. Item 8 deferral to follow-up is reasonable given low impact and no active user complaints.

### Q7 — Interactions between items

**Item 3 × Item 2**: Under `freeze` + dev, Item 3's Proxy throws on mutation before Item 2's check can run — the `set()` call never happens. For `sig.set(sig.get())` pattern (no prior mutation), `sig.get()` returns the proxy, `sig.set(proxy)`:
- `isEqual(rawFrozen, proxy)` walks: `getProto(rawFrozen)` is `Array.prototype` or `Object.prototype`, `getProto(proxy)` defaults to target's proto (same). Keys/values walk — keys return raw values through the proxy's default `get` → deep equal. Returns true.
- Skip notify branch, enter Item 2 check.
- `newValue === currentValue` → `proxy === raw` → **false** (proxy and target are distinct objects).
- Item 2's warning does **not** fire.

So under freeze + dev, the `set(get())` anti-pattern slips past Item 2's warning because `get()` now returns a proxy. Under freeze this is arguably OK because the mutation path would have thrown anyway. Under reference + dev with the safety-mode-gate fix applied to Item 3 (proxy only under freeze), Item 2's warning would fire correctly. Note this interaction depends on Item 3 being properly safety-gated — reinforces the Item 3 fix need.

**Item 4 × Item 7**: Item 7 profiles the residual ~4% regression. If Item 4 lands first, the profile is on the hoisted notify. The baseline (main) has un-hoisted notify. Differences in notify overhead attribute to the hoist, potentially confounding the remove-first profile. But per Item 6, the bench baseline is rebuilt, so main-side comparisons become irrelevant. Item 4 should ship before the baseline rebuild so the rebuilt baseline reflects final code state. Plan's execution sequence (1,2,4 → 3,5 → 6 → 7) is consistent with this.

**Item 1 × Item 7**: The residual +4% was measured under what? The plan doesn't explicitly say, but the debrief context (referenced but not read) suggests it was against a `safety: 'reference'`-flipped state on both PR and main (via `allowClone: false` shim). After Item 1 flips default to `'freeze'` and Item 6 removes the shim, the bench `allowClone: false` sites migrate to `safety: 'reference'` — same semantics, so the measurement is still apples-to-apples between PR and rebuilt baseline. The +4% number may shift slightly with the baseline rebuild, but the relative comparison remains valid.

**Verdict on Q7**: No blocking conflicts. Item 3 interacts with Item 2 in a way that reinforces the need for Item 3's safety-mode gate. Execution sequence accommodates the Item 4 → Item 6 → Item 7 ordering correctly.

### Q8 — Missing or wrong items

**Missing:**
- **Doc/skill migration for `allowClone`** — see Q5. Five docs files + three skills files reference `allowClone` and need updating when the shim is removed. Should be part of Item 6 or a sibling item.

**Not wrong, but worth noting:**
- **Item 3 Proxy safety-mode gating** is a design issue, not a missing item per se. The plan's Item 3 needs the guard added before implementation.
- **Item 3 Proxy Date/Map/Set/class-instance wrapping** — same.

**Item ordering sanity:**
- Plan proposes landing 1, 2, 4 together. This is mechanical and low-risk — reasonable. 
- Plan proposes Items 3, 5 after (Proxy wrapper + docs). If Item 3's two flaws are fixed in the implementation PR (safety-mode gate + plain-object-only wrap), this is fine. Otherwise Item 3 ships with regressions.
- Item 6 before Item 7 — correct, because the bench baseline rebuild matters for Item 7's profile.
- Item 8 follow-up — reasonable given low impact.

**Scope:**
- Plan explicitly excludes `Signal.computed` / `Signal.derive` rewrites (line 227). Sound.
- No speculative micro-optimization (line 226). Disciplined.

**Verdict on Q8**: One missing item (doc migration), no wrong items.

## Summary

Prioritized issues (all in Item 3 and Item 6):

1. **Item 3: add `this.safety === 'freeze'` guard to the proxy wrapper.** Without it, `safety: 'reference'` and `safety: 'none'` signals get wrapped in mutation-blocking proxies in dev, breaking their documented semantics. One-line fix:
   ```js
   if (config.mode === 'off' || this.safety !== 'freeze' || val === null || typeof val !== 'object') {
     return val;
   }
   ```

2. **Item 3: add `isPlainObject(val) || isArray(val)` guard to the proxy wrapper.** Date/Map/Set/class-instance signals aren't frozen by `deepFreeze` (per the `isPlainObject` gate at `cloning.js:31`) but the proposed proxy wraps them anyway. Method calls (including read-only ones like `getTime()`, `.has(k)`, `.get(k)`) throw incompatible-receiver TypeErrors in dev. Gate the wrap to match what's actually frozen:
   ```js
   if (!isPlainObject(val) && !isArray(val)) { return val; }
   ```

3. **Item 6: include documentation sites in the migration audit.** The plan's list misses:
   - `docs/src/pages/docs/api/reactivity/signal.mdx` (5 live references)
   - `docs/src/pages/docs/guides/reactivity/signal-options.mdx` (2 references)
   - `ai/skills/authoring/reactive-state.md`, `ai/skills/authoring/component-state.md`, `ai/skills/contributing/internals.md`
   - `ai/workspace/artifacts/skills/sui-value-propositions.md`
   
   These are served to users (docs) or agents (skills) and will mislead after the shim is removed.

Items 1, 2, 4, 5, 7, 8 check out against source. The preset tradeoff analysis and the "why not proxy-default for 1.0" reasoning are well-grounded. The `allowClone` autoresearch count is off by 2× (6 uses across 3 files, not 3 sites) but these files are in `ai/workspace/autoresearch/` — the plan already flags them as "check if still relevant or can be deleted."
