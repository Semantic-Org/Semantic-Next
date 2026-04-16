## Task: Review the signal-safety-v2 finalization plan for technical correctness

Read this brief, then read the plan at `ai/workspace/plans/signal-safety-v2.md`, then read the source files listed below. Evaluate the plan's technical claims against the actual code.

**Important framing**: "No changes needed" is a valid and welcome verdict. The plan is the output of a deep pairing session and may already be correct. Your job is to **steelman** the plan — assume reasonable authors, look for specific technical errors you can substantiate from the source, and flag them with evidence. Do not invent issues or propose stylistic rewrites. If a claim in the plan checks out against the code, say so and move on.

---

### Architecture Overview

`packages/reactivity` provides a Signal primitive loosely inspired by Meteor Tracker. A `Signal` wraps a value and registers dependencies with active `Reaction`s when read. Reactions re-run when their dependencies change, via a microtask-scheduled flush queue.

A `safety` preset on each Signal governs how the Signal treats its value:

- `'freeze'` — `deepFreeze` the value on `set`, return raw frozen value on `get`, dedupe via `isEqual`. Mutations through `get()` on frozen values trigger a native TypeError at the mutation site.
- `'reference'` — no protection; return the raw value on `get`, dedupe via `isEqual`.
- `'none'` — no protection, no dedupe (every `set` notifies).

There is also a backward-compatibility shim where `{ allowClone: false }` maps to `safety: 'reference'` (to keep a tachometer benchmark fair across a PR/baseline split).

The plan proposes flipping the default from `'reference'` (currently in the working tree as an unstaged change) back to `'freeze'` for 1.0, plus six other changes detailed in the plan document.

### Key Source Mechanisms

**`Signal.prototype.get` / setter / `protect`** — Signal's read returns `this.currentValue` (no clone). Setter calls `this.protect(newValue)` before assigning. `protect` gates on `safety === 'freeze'` to call `deepFreeze`; otherwise returns the raw value. The equality function is `isEqual` by default, or `() => false` under `'none'`.

**`deepFreeze` in `packages/utils/src/cloning.js`** — Deep freezes plain objects and arrays recursively. Non-plain-object types (Date, Map, Set, RegExp, DOM nodes, class instances, Signals) are skipped per an `isPlainObject` gate. The source comment documents this as intentional to preserve internal-slot behavior of non-plain types.

**`isEqual` in `packages/utils/src/equality.js`** — Identity short-circuits at the top (`if (a === b) return true`). Prototype comparison happens before deep walk. Specialized paths for Array, Map, Set, Date, RegExp, TypedArray, valueOf/toString, and plain-object key iteration.

**`clone` in `packages/utils/src/cloning.js`** — Recursive clone with type-specific branches. Class instances are cloned as plain objects (prototype stripped) unless `{ preserveNonCloneable: true }` is passed. `Signal.defaultClone = clone` — without `preserveNonCloneable`.

**`Signal.prototype.notify`** — Calls `this.setContext()` and `this.setTrace()` before `this.dependency.changed(this.context)`. `setContext` and `setTrace` have internal `config.mode !== 'off'` early-return guards. `Reaction.run` has a similar pattern around `addContext`.

**`Signal.prototype.mutate`** — Under freeze, `fn` must return a new value (in-place mutation throws from the frozen value, not from mutate). Under reference/none, clones `currentValue` into `before`, runs `fn(currentValue)` which may mutate in place, then compares `before` vs `currentValue` via `equalityFunction` to decide whether to notify.

**Mutation helpers** (`push`, `unshift`, `splice`, `setIndex`, `removeIndex`, `setArrayProperty`, `setProperty`) each have an explicit `safety === 'freeze'` branch that rebuilds the array/object vs an in-place branch for other modes. All call `notify()` directly, bypassing `mutate`.

---

### Plan Summary (your target for evaluation)

The plan has 8 numbered items:

1. Flip default from `'reference'` back to `'freeze'` in `helpers.js`.
2. Dev-mode post-set reference check — console.warn when `set()` receives the same reference as `currentValue`.
3. Dev-mode Proxy wrapper on `.get()` returns to replace cryptic native freeze TypeErrors with SUI-authored errors. WeakMap-cached, top-level only (no recursive wrapping).
4. Hoist `config.mode !== 'off'` guard from inside `setContext`/`setTrace` up to `notify()` and `run()` call sites.
5. Document the third-party-reference escape hatch in the README with a user-facing heuristic.
6. Remove the `allowClone` backward-compat shim and rebuild the tachometer baseline.
7. Profile the residual ~+4% `remove-first` regression (known from a prior session; not diagnosed yet).
8. Latent follow-up: `Signal.defaultClone` doesn't pass `{ preserveNonCloneable: true }`, so the `before` snapshot in reference-mode `mutate()` strips class-instance prototypes.

Plus a separate R&D branch for a proxy-default prototype with success criteria.

---

### Questions — Evaluate Independently

**Question 1 — Item 3 Proxy wrapper correctness.** Trace through each mutation shape and verify whether the plan's claimed behavior holds under the proposed implementation:

- `signal.get().push(x)` on a signal holding an array
- `signal.get().prop = x` on a signal holding a plain object
- `signal.get().nested.prop = x` (access through the proxy to a nested frozen value)
- `signal.get().set(k, v)` on a signal holding a `Map`
- `signal.get().getTime()` on a signal holding a `Date` (read-only method — should not throw)
- `signal.get()` consumed by `JSON.stringify` or `structuredClone`

The plan claims "top-level only, WeakMap-cached, nested access falls through to the raw frozen value which throws native TypeError." Is that accurate? Are there Proxy invariants or spec corner cases that would break this (e.g., `Object.isFrozen(proxy)` must match `Object.isFrozen(target)` under certain conditions)?

**Question 2 — Claims about deepFreeze, isEqual, clone.** The plan makes assertions about:

- `deepFreeze` skipping Map/Set/Date/class instances via `isPlainObject`
- `isEqual` having an identity short-circuit at the top
- `clone` not preserving class-instance prototypes by default
- `isEqual`'s `getProto` comparison in the context of the Item 8 bug description

Verify each against the source code in `packages/utils/src/cloning.js` and `equality.js`. Are any of these claims wrong or imprecise?

**Question 3 — Item 2 dev-mode check completeness.** The plan shows a trace validation for three cases (get-mutate-set, build-new, re-set-deep-equal). Are there additional cases the check would fire on incorrectly, or cases it should fire on but wouldn't? Consider primitives (numbers, strings), `null`/`undefined` transitions, frozen-object re-sets.

**Question 4 — Item 4 hot-path guard hoist.** Reading `notify()`, `setContext()`, `setTrace()`, `Reaction.run()`, and `addContext()`: does the proposed hoist preserve current behavior? Specifically, does `this.context` remain accessible to `dependency.changed(this.context)` under mode 'off' after hoisting? Trace the code paths.

**Question 5 — Item 6 callsite audit.** Grep for `allowClone` across the repo. Does the plan's list of migration sites cover all of them? Are any of the listed sites actually obsolete (scratch files, generated artifacts) rather than live code?

**Question 6 — Item 8 bug description.** Read the `mutate` implementation in `signal.js` and trace what happens under reference mode when the signal holds a class instance:

```js
const sig = new Signal(new MyClass({ foo: 1 }));
sig.mutate(v => { v.foo = 2; });
```

Does the plan's description of the behavior match? What does `before` look like? Does `isEqual(before, currentValue)` return true or false? Does `notify()` fire?

**Question 7 — Interactions between items.** Are there dependencies or conflicts between items that the plan doesn't address? For example:
- Does the Item 3 Proxy wrapper interact with Item 2's dev-mode check (both run under `config.mode !== 'off'`)?
- Does Item 4's hoist affect Item 7's profiling methodology (if the `notify` call shape changes, prior-session profile data may not be comparable)?
- Does Item 1's default flip invalidate Item 7's baseline (the residual regression was measured against the `'reference'` experiment)?

**Question 8 — Missing items or wrong items.** Is there something in the Signal/Reactivity code that needs addressing but isn't in the plan? Or is there an item in the plan that shouldn't be done (e.g., too speculative, wrong priority, better deferred)?

---

### Source Files to Read

Required:
- `ai/workspace/plans/signal-safety-v2.md` (the plan itself)
- `packages/reactivity/src/signal.js`
- `packages/reactivity/src/helpers.js`
- `packages/reactivity/src/reaction.js`
- `packages/reactivity/src/dependency.js`
- `packages/reactivity/src/scheduler.js`
- `packages/utils/src/cloning.js`
- `packages/utils/src/equality.js`
- `packages/utils/src/types.js` (for `isPlainObject`, `isClassInstance`)

As needed for specific questions:
- For Q5 (callsite audit): grep for `allowClone` and `safety:` across `packages/`, `src/`, `docs/src/`, `tools/`.
- For Q1 (Proxy wrapper): MDN / ECMAScript spec references for Proxy invariants are out of scope for this task — reason from first principles using the Proxy trap list.

Do NOT read:
- `ai/workspace/signal-safety-v2-debrief.md` — contains solution momentum from prior sessions that's not load-bearing for this review.
- Git history / diffs — evaluate the plan against current source state only.

---

### Deliverable

Write your evaluation to `ai/workspace/signal-safety-v2-plan-review-report.md`. Structure:

```
## Verdict
[One of: Plan is correct as written / Plan has N specific issues / Plan has structural problem X]

## Per-question findings
### Q1 — Item 3 Proxy wrapper correctness
[Your analysis with source references]

### Q2 — Claims about utils
[...]

[etc.]

## Summary
[If issues: prioritized list. If no issues: brief confirmation of what you verified.]
```

Include file:line references for every claim. If you find an issue, quote the relevant source and explain the specific divergence from the plan's claim.
