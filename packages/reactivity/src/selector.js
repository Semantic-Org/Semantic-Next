import { Dependency } from './dependency.js';
import { reaction as createReaction } from './reaction.js';
import { Scheduler } from './scheduler.js';

// Conditional-membership signal. The returned `select(key)` is reactive and
// returns whether `matchFn(key, source.value)` is true. Source changes wake
// only the keys whose match result flipped, so N readers cost O(flipped),
// not O(N) — the "highlight one of N" pattern (selected row, active tab,
// current route). Solid's `createSelector`.
//
// The backing reaction's natural `Reaction.run` teardown removes a row
// reaction from its per-key dep on rerun; calling `select(key)` again
// re-registers the subscription. Empty `keyDeps` Map entries are pruned
// opportunistically inside the backing reaction (not on `onCleanup`, which
// fires on every benign rerun).
//
// `select.stop` is exposed for owner-less callers (a component running
// outside any Reaction can't rely on the parent cleanup hook). A WeakRef
// on `select` self-stops the backing reaction once the closure is
// unreferenced, mirroring derive/computed's WeakRef-on-output.

export const selector = (source, matchFn = (key, value) => key === value) => {
  const keyDeps = new Map();
  let current = source.peek();
  let selectRef;

  const r = createReaction(() => {
    const next = source.get();
    if (selectRef && !selectRef.deref()) {
      r.stop();
      return;
    }
    const prev = current;
    current = next;
    if (next === prev) { return; }
    for (const [key, dep] of keyDeps) {
      if (dep.subscribers.size === 0) {
        keyDeps.delete(key);
        continue;
      }
      if (matchFn(key, next) !== matchFn(key, prev)) {
        dep.changed();
      }
    }
  });

  if (Scheduler.current) {
    Scheduler.current.onCleanup(() => r.stop());
  }

  const select = (key) => {
    let dep = keyDeps.get(key);
    if (dep === undefined) {
      dep = new Dependency();
      keyDeps.set(key, dep);
    }
    dep.depend();
    return matchFn(key, current);
  };
  select.stop = () => r.stop();
  selectRef = new WeakRef(select);
  return select;
};
