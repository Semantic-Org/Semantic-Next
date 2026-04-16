---
title: Signal Safety v2 — Performance Regression Debrief
date: 2026-04-16
branch: perf/signal-safety-v2
pr: https://github.com/Semantic-Org/Semantic-Next/pull/148
status: Open — two confident ~4% regressions remain
---

# Debrief for Continuing Agent

This document describes the state of PR #148 at end of session, what's been measured, what's been changed, and what's still unresolved. It is intentionally written to inform without prescribing conclusions — form your own view of the remaining regressions.

## The Framing

PR #148 implements the `safety` preset system described in `ai/plans/signal-performance.md`. The big architectural bets:

1. A `Signal.safety` preset unifies value protection and equality dedup into a single opinionated API: `'freeze' | 'reference' | 'none'`.
2. The default was chosen as `'reference'` (standard signals model: no protection, `isEqual` dedup).
3. The `allowClone: false` compat shim maps to `safety: 'reference'`.

The bench file `packages/renderer/bench/tachometer/bench-todo.js` was configured with `allowClone: false` on the `todos` signal so the A/B compares the reactivity fast-path on both sides. That means:

- Most wins should come from eliminating clone-on-read overhead (which reference mode removes).
- Any regression on this bench means overhead added to the shared fast path — a net loss by design.

## Measurement Tooling

Tachometer on CI is the committed source of truth. Two things to know:

1. **The CI comment is edited in place** (issue comment id `4255383152`, not new comments). Fetch with:
   ```
   gh api "repos/Semantic-Org/Semantic-Next/issues/comments/4255383152" | jq -r .body
   ```

2. **Each workflow run uploads `bench-report.json` artifacts** with per-sample data. Download and analyze:
   ```
   gh run download <run_id> -R Semantic-Org/Semantic-Next
   ```
   Each run has 4 job artifacts (ci, ci-signal, ci-todo, ci-todo-micro). Each JSON has `benchmarks[].samples[]` — the raw 50+ measurements per bench per side (`this-change` vs `tip-of-tree`).

3. **Summary tables hide variance**. The comment's "confident/unsure" buckets are useful but can mislead. Aggregating per-bench means across multiple runs (artifact JSONs from runs `24489533957`, `24491288492`, `24492077740`, etc. are in `ai/workspace/tmp/bench-artifacts/`) reveals persistent patterns vs run-to-run flips. A bench that shows "confident" in one run and "unsure" in the next, but has a consistent positive mean delta across runs, is a real regression — the confidence classification is flipping because the CI width straddles the threshold, not because the delta changed.

4. **The CI has been validated** as not producing false-positive regressions on blank PRs — if it reports a confident regression on real code, the regression is real (may still be small, but is not artifact-level noise).

## The Bench File Changes

`packages/renderer/bench/tachometer/bench-todo.js` was modified on this branch to scale short single-op benches 10x:

- `toggle-first/middle/last` now do 10 toggles in a loop (each hitting the target index once) → benches run ~120-170ms instead of ~6-11ms
- `remove-first/middle/last` now do 10 deletions starting from a 200-item list → run ~140-300ms instead of ~10-20ms
- `edit-start/edit-save` now do 10 edit cycles on a slice of items → run ~150-340ms instead of ~15-30ms

This matters because tachometer's resolution floor (roughly the per-sample noise at a given bench duration) scales inversely with bench duration. A 10ms bench has ±10-15% expected noise; a 150ms bench has ~±1%. Scaling exposes small real deltas that would otherwise oscillate across runs.

The 5-op variants (`remove-5-front`, `remove-5-middle`, `remove-5-back`) were left unchanged — they already run 60-90ms.

When comparing PR-vs-main on the scaled benches, the bench file has to be the same on both sides. In this session, both worktrees (`/home/jack/dev/semantic/next` and `/tmp/main-branch`) were built with the same scaled `bench-todo.js`.

## State at End of Session

Latest CI run is for commit `a9cb8dcaf` (before the `7ce4e641f` cleanup that dropped redundant `safety: 'reference'` from framework-internal signals). Results:

- **6 confident improvements** (4 transformational, 2 single-digit): the signal-* benches have -82% to -99% wins from removing clone overhead.
- **2 confident regressions**:
  - `remove-first`: +4% (10ms absolute delta on ~250ms baseline)
  - `remove-5-front`: +4% (3ms on ~80ms baseline)
- **8 no-change** (within ±2% of main)
- **15 unsure** — mostly short benches (clear, select, bulk-add-50, toggle-all, filter-completed, update-10th) that weren't scaled

The two confident regressions share a property: **both remove items from the front of the list**, which forces every remaining item's index to shift. Other remove benches (middle, last) do not regress confidently after the fixes landed.

## What Changed on This Branch

Full diff surface vs main (excluding tests/docs/workflow files):

```
packages/component/src/define-component.js         |  4 +-
packages/query/src/behavior.js                     |  5 +-
packages/reactivity/src/helpers.js                 | 15 +
packages/reactivity/src/signal.js                  | 335 +++-----
packages/renderer/src/engines/lit/renderer.js      |  2 +-
packages/renderer/src/engines/native/blocks/each.js|  4 +-
packages/renderer/bench/tachometer/bench-todo.js   | 61 ++-
packages/templating/src/template.js                |  4 +-
packages/utils/src/functions.js                    |  9 +-
packages/utils/src/objects.js                      | 20 +-
packages/utils/src/strings.js                      |  4 +-
src/components/mobile-menu/mobile-menu.js          | 13 +-
src/components/nav-menu/nav-menu.js                | 25 +-
tools/benchmark/src/main.js                        |  4 +-
```

Key architectural changes from the plan:
- `Signal` class adds the safety preset (`'freeze' | 'reference' | 'none'`) with `reference` as default
- `Signal` has static getters/setters replacing static fields: `equalityFunction`, `cloneFunction`, `safety`, `tracing`, `stackCapture`, plus `configure`/`defaults`/`computed`
- `Signal` has a `protect()` method used in the value setter and array helpers
- `utils.noop` changed from identity to void; `utils.identity` added separately
- `utils.extend` rewritten: simple assignment for data properties, `defineProperty` only when source has accessor OR target already has an accessor at that key

## What I Did In This Session

Changes I made during investigation (in order), with current status:

1. **`extend()` optimization** — SHIPPED (in `packages/utils/src/objects.js`). Old used `defineProperty` for every own property; new uses simple assignment for data properties and defineProperty only for accessor handling. Diagnostic basis: old extend was on the `Template.getDataContext()` hot path via `extend({}, this.data, this.state, this.instance)`. Whether this was a net perf impact for the bench is ambiguous — it's a correctness + shape improvement more than a measured-hot-path fix.

2. **Default safety: `freeze` → `reference`** — SHIPPED (in `packages/reactivity/src/helpers.js`). Architectural argument more than perf: a pagefind integration broke because freezing signal values also freezes pagefind's internal result objects that it mutates via `.data()` calls. Any 3rd-party library with hidden mutable state behind a public API hits the same issue under freeze-default. This is a DX argument ("don't surprise users with runtime freeze errors from code they don't own") rather than a perf argument, but the perf numbers improved too.

3. **`Object.isExtensible` check in `setDataContext`** — ADDED then REMOVED. I added it as a lazy-thaw to handle a test failure (`Cannot add property markLabel, object is not extensible`) on a subtree-spurious test when template data flowed in frozen. Then I realized:
   - With default = `reference`, template data is never frozen by default
   - The check runs on EVERY `setDataContext` call — the subtemplate (`blocks/template.js:306`) calls it once, and `Template.render()` calls it internally (template.js:737). For a 100-item each block across 10 toggles, that's 2000+ calls.
   - Local 4-sample A/B with scaled benches: removing the check moved `remove-middle` +11.7% → +1.0%, `remove-last` +13% → -5.4%, `toggle-middle` from consistently-slower to roughly-neutral.
   - Subsequent CI confirmed: `toggle-middle/toggle-last/toggle-first/edit-start/edit-save` all moved from confident-regressed to no-change or unsure.
   - This is the **one diagnostic I'm confident about**.

4. **Inlined `protect()` at value setter hot path** — ADDED then REVERTED. Pure speculation that method-call overhead mattered. No diagnostic evidence before shipping. User correctly called this out. Removing it did not re-surface any regression after the isExtensible fix.

5. **`setArrayProperty` single-index fast-path** — ADDED then REVERTED. Same category: speculation without evidence.

6. **Bench scaling** — SHIPPED. Changed bench-todo.js to scale short benches 10x.

7. **`safety: 'reference'` options removal from framework-internal signals** — SHIPPED (commit `7ce4e641f`). Since default is now reference, `new Signal(value, { safety: 'reference' })` in each.js and template.js's settings proxy is redundant. Now just `new Signal(value)`.

## What I Know About the Remaining Regressions

`remove-first` and `remove-5-front` both remove from index 0, forcing all remaining items to shift indices. In `packages/renderer/src/engines/native/blocks/each.js`, reconcile phase 3 (starts around line 395) handles items per-record:

```js
for (let i = 0; i < newRecords.length; i++) {
  const rec = newRecords[i];
  const item = items[i];
  if (rec.item !== item || rec.index !== i) {
    rec.itemSignal.set(getEachData(item, i, collectionType, node));
    rec.item = item;
    rec.index = i;
    rec.propsSnapshot = createSnapshot(item);
  }
  else if (typeof item === 'object' && item !== null) {
    // snapshot-comparison path
  }
}
```

For front-remove: `rec.index !== i` is true for all 99-199 remaining records → the top branch fires for every one → `itemSignal.set` called hundreds of times. For back-remove or middle-toggle: most records hit the snapshot path, not the itemSignal.set cascade.

Since the snapshot-path regression is now gone (after isExtensible removal), the remaining +4% is specifically in the ref-change cascade. I did not profile this path. The things that could be different between PR and main on this path:

- `Signal.prototype.set` (the value setter) — PR calls `this.protect(newValue)`, main calls `this.maybeClone(newValue)`. Both are method calls that for reference mode just return the value. Different instruction sequences; V8 may optimize differently.
- `Signal` class shape — PR's class is larger (more static accessors, new `protect`/`clone`/`peek` methods). V8's inline caches for instance methods may compile differently.
- `getEachData` allocates a new wrapper object per call (`{[as]: item, [indexAs]: i}`) — unchanged from main. Allocation pattern could still interact differently with GC due to the surrounding code.
- `isEqual` on the wrapper objects — unchanged from main.

I have no measured attribution of the remaining +4% to any specific function. Profiling the front-remove hot path (CPU profile flame graph comparison, or `node --prof` on a synthetic microbench that stresses itemSignal.set in a loop) is the next diagnostic step I would take.

## What I Don't Know

- **Why `remove-first` / `remove-5-front` are slower** — Only the path is identified, not the specific cost. The delta is small (+10ms over 10 removes of 200-item list, so ~1ms per remove across ~200 itemSignal.set calls = ~5μs/call). That's roughly the same order of magnitude as Signal construction overhead, but removes don't construct signals — they update existing ones. So 5μs/set is suspect; may indicate a V8 deopt or megamorphic call site that only manifests when many itemSignal.sets fire in sequence.
- **Whether V8 inlining behavior changed for Signal instance methods** — I never ran `node --prof` or Chrome `--js-flags="--prof"` to get tick-level function attribution. The fresh-take agent I consulted suggested class-size growth might affect inlining. That's still a hypothesis.
- **Whether the `extend()` rewrite helped or was a wash** — Shipped because it handles frozen sources correctly and is cleaner code. The specific perf delta of just the extend change is not measured in isolation.

## What I Got Wrong Along the Way

Worth knowing so you don't repeat:

1. **I initially accepted "rotating noise" as the cause of shifting regression identity across runs.** The user's correction: blank-PR CI doesn't produce false regressions, so a confident regression on any run is real. I was dismissing real signal. Lesson: when tachometer flags confident, take it seriously even at small absolute magnitudes.

2. **I shipped speculative "fast path" optimizations without diagnostic evidence.** Twice. The user's rule: perf changes in a shared OS library need diagnostic backing, not "this looks tighter." Bytes and readability matter.

3. **I profiled in Node, not V8-with-ticks, and not Chrome.** The regressions are in the rendering path. Node-wallclock microbenches confirmed that Signal/Reaction themselves are equivalent between PR and main — but that only ruled out one location, it didn't find the regression. Chrome DevTools performance traces (via MCP `performance_start_trace`) are available and produce useful flame graphs for the full page — if the CI profiler shows a function-attribution delta, that's the lead.

4. **I let "performing the motion" substitute for actual diagnosis.** Asking "do you want me to do X, Y, or Z?" when the user had already specified the workflow. Just profile. Don't enumerate.

## Artifacts Available in This Worktree

- `ai/workspace/tmp/bench-artifacts/` — Three CI runs' raw tachometer JSONs for aggregate analysis
- `ai/workspace/tmp/analyze-trace*.py`, `compare-10x.py`, `analyze.py` — Python scripts I used to parse traces and artifacts
- `ai/workspace/tmp/trace-pr-10x.json`, `trace-main-10x.json` — Full Chrome performance traces of scaled bench runs (include CPU profile sample data)
- `ai/workspace/tmp/main-reactivity/` — Extracted main-branch copy of reactivity package source (useful for Node-side A/B microbench)
- `ai/workspace/tmp/toggle-profile.js`, `toggle-profile-main.js` — Node microbench scripts that measured Signal/Reaction in isolation (showed equivalence — not where the regression is)
- `ai/workspace/tmp/local-samples.txt` — Notes from local 4-sample A/B runs on the scaled bench

There's also a main-branch worktree at `/tmp/main-branch` that was used for building the baseline bench bundle.

## Paths I Would Try Next

Not prescriptive — just a list of where signal might live. Order reflects my guess at ROI, which may be wrong:

1. **Profile `remove-first` directly.** Open `http://localhost:8765/ci-current-todo.html` after starting a server from `packages/renderer/bench/tachometer/`, use chrome-devtools MCP `performance_start_trace` with `reload: true`, `autoStop: true`. Extract samples within the `remove-first` measure window. Do the same for `ci-baseline-todo.html`. Diff the per-function sample counts. The previous traces (from when toggle-middle was regressing) correctly identified `setDataContext`/`assignInPlace` as the PR-heavier hot frames. Same methodology should work here.

2. **Look at the `itemSignal.set` call flow in reconcile phase 3.** Specifically what differs between main's and PR's path when a new wrapper object is `.set()` into an existing itemSignal. The equality check fires, then if false, `this.currentValue = this.protect(newValue)` runs. `protect` for `reference` mode is null-check + typeof-check + string-equal + return. `maybeClone` on main for `allowClone: false` is one boolean check + `isClassInstance` check + return. Instruction counts are similar but not identical — a tick profile would say which is slower.

3. **Class-size / inlining hypothesis.** V8's inline cache for `signal.set` (a prototype method call) depends on the call site being monomorphic. If PR's larger Signal class is hitting a megamorphic IC in a way main's didn't, method dispatch overhead accumulates. `--trace-opt` / `--trace-deopt` would show this.

4. **The wrapper allocation in `getEachData`.** Called 200× per reconcile in the front-remove path. Allocation pattern unchanged, but GC interactions can differ based on surrounding code. Check GC sample counts in the trace's remove-first window vs main's.

5. **The `extend()` rewrite.** Low probability but possible — my `extend` change affects behavior when source properties are frozen or target has an accessor. Plain data objects shouldn't be affected, but worth A/B testing by reverting `extend` to main's version and rerunning.

## Bench Methodology Notes

- Local Chrome traces (one sample per reload) have ~15-20% variance on short benches. CI's 50-sample averaging is more reliable. Local is useful for isolating specific windows via `performance_start_trace`, not for final numbers.
- The 4-sample alternating-reload A/B I ran (PR reload, main reload, PR reload, ...) has enough statistical power to detect ~10% real deltas, not reliable for <5%.
- Scaled benches are reliable at CI. Don't trust the remaining short benches' "unsure" classification — they're too noisy to distinguish real small regressions from noise.

## Compat Shim

`Signal` accepts `{ allowClone: false }` as a compat alias for `{ safety: 'reference' }`. It's how the bench file achieves fair apples-to-apples with main. Don't add new uses of `allowClone` — it's deprecated, just present for the PR bench fairness.

## Session Timeline for Context

Approximate commits on this branch during my session (most recent first):
- `7ce4e641f` Refactor: Drop redundant safety:'reference' from framework-internal Signals
- `a9cb8dcaf` Perf: Remove lazy-thaw from setDataContext; revert speculative fast-paths
- `28901c4ce` Perf: Inline protect in hot value setter (REVERTED in a9cb8dcaf)
- `f4ef44d92` Perf: Fast-path setArrayProperty for single index (REVERTED in a9cb8dcaf)
- `f0cb8487d` Perf: Ship 'reference' as default safety
- `bc353a412` Perf: Optimize extend for common case, fix frozen data in templates
- `5595cbda9` (prior branch head)

CI runs (newest first):
- `24512198844` — Current head. 2 regressions (remove-first, remove-5-front, both +4%).
- `24492077740` — Before isExtensible removal. 3 regressions (edit-start, toggle-middle, toggle-first, all +9-12%).
- `24491288492` — Right after default flip to reference. 3 regressions (toggle-last, edit-save, list-replace).
- `24489533957` — Before my session. 6 regressions (toggle-first/middle, filter-completed, remove-5-middle/back, list-replace).

The progression is visible: each diagnostic fix removed a class of regression.

## Final Thought

The PR is shippable as-is — the net perf story is strongly positive (6 improvements, 4 transformational; 2 remaining regressions at ~4%; 8 no-change; 15 unsure mostly from unscaled short benches). But the user's standard for this library is that perf regressions in shared code paths don't ship. If you can root-cause the front-remove +4%, that's a clean win. If you can't, it's a judgment call whether to ship with known residual regressions or hold.

Good luck.
