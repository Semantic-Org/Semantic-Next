import { isDevelopment, isPromise } from '@semantic-ui/utils';

import { Dependency } from '../dependency.js';
import { Reaction } from '../reaction.js';
import { Scheduler } from '../scheduler.js';
import { Signal } from '../signal.js';

// shared backing for derive() and computed(). weak ref on the derived signal
// so it stops self-driving once nothing else holds it. parent-reaction
// onCleanup ties lifetime to the enclosing scope when present.
const createDerivedSignal = (reactionBody, options) => {
  const derivedSignal = new Signal(undefined, options);
  const derivedRef = new WeakRef(derivedSignal);
  const backingReaction = new Reaction((computation) => {
    const liveSignal = derivedRef.deref();
    if (!liveSignal) {
      backingReaction.stop();
      return;
    }
    reactionBody(liveSignal, computation);
  });
  const parent = Scheduler.current;
  if (parent) {
    parent.onCleanup(() => backingReaction.stop());
  }
  // hand the signal its producer so signal.stop() can tear it down
  derivedSignal.reaction = backingReaction;
  return derivedSignal;
};

// derived signals hold plain values, an async compute would store the promise itself
const warnAsyncCompute = (value, computation, name) => {
  if (isDevelopment && computation.firstRun && isPromise(value)) {
    console.warn(
      `${name}: compute returned a promise so the signal holds the promise, not its value. use reaction() with an async callback and set() the result`,
    );
  }
  return value;
};

export const derive = (source, computeFn, options = {}) =>
  createDerivedSignal(
    (derivedSignal, computation) => derivedSignal.set(warnAsyncCompute(computeFn(source.get()), computation, 'derive')),
    options,
  );

export const computed = (computeFn, options = {}) =>
  createDerivedSignal(
    (derivedSignal, computation) => derivedSignal.set(warnAsyncCompute(computeFn(), computation, 'computed')),
    options,
  );

// Per-key reactive membership against a source signal. The returned
// match(key) function is reactive and returns whether matchFn(key, source.value)
// holds. Source changes re-fire only the keys whose match result flipped, so N
// readers cost O(flipped), not O(N). This is the "highlight one of N" pattern.
// Solid's `createSelector` adapted.
//
// The backing reaction's natural Reaction.run teardown removes a row reaction
// from its per-key dep on rerun. Calling match(key) again re-registers the
// subscription. Empty keyDeps Map entries are pruned opportunistically inside
// the backing reaction (not on onCleanup, which fires on every benign rerun).
//
// match.stop is exposed for owner-less callers (a component running outside
// any Reaction can't rely on the parent cleanup hook). A WeakRef on match
// self-stops the backing reaction once the closure is unreferenced, mirroring
// derive/computed's WeakRef on the output.
export const match = (source, matchFn = (key, value) => key === value) => {
  const keyDeps = new Map();
  let currentValue = source.peek();
  let matcherRef;

  const backingReaction = new Reaction(() => {
    const nextValue = source.get();
    if (matcherRef && !matcherRef.deref()) {
      backingReaction.stop();
      return;
    }
    const previousValue = currentValue;
    currentValue = nextValue;
    const valueChanged = nextValue !== previousValue;
    for (const [key, dep] of keyDeps) {
      if (dep.subscribers.size === 0) {
        keyDeps.delete(key);
        continue;
      }
      if (valueChanged && matchFn(key, nextValue) !== matchFn(key, previousValue)) {
        dep.changed();
      }
    }
  });

  if (Scheduler.current) {
    Scheduler.current.onCleanup(() => backingReaction.stop());
  }

  const matcher = (key) => {
    let dep = keyDeps.get(key);
    if (dep === undefined) {
      dep = new Dependency();
      keyDeps.set(key, dep);
    }
    dep.depend();
    return matchFn(key, currentValue);
  };
  matcher.stop = () => backingReaction.stop();
  matcherRef = new WeakRef(matcher);
  return matcher;
};

Signal.prototype.derive = function(computeFn, options = {}) {
  return derive(this, computeFn, options);
};
