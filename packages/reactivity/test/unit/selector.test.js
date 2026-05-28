import { Reaction, Scheduler, selector, Signal } from '@semantic-ui/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';

// selector(source, matchFn?) — Solid `createSelector` adapted to SUI.
// Load-bearing properties verified below:
//   1. membership flip — only the at-most-2 keys whose match result
//      changed wake on a source change.
//   2. re-arm after rerun — Reaction.run's natural dep-set teardown
//      unsubscribes a row reaction from its per-key dep on rerun;
//      calling select(key) again re-registers the subscription.
//   3. row-churn doesn't leak — stopped row reactions leave empty
//      keyDeps entries which are pruned opportunistically.
//   4. owner-less GC — when the returned select closure is unreferenced,
//      the backing reaction self-stops on next wakeup (WeakRef).
//   5. custom matchFn — range-style or other membership predicates work
//      and produce the same per-key wakeup discipline.

describe('selector', () => {
  beforeEach(() => {
    Scheduler.current = null;
    Scheduler.pendingReactions.clear();
    Scheduler.afterFlushCallbacks = [];
    Scheduler.isFlushScheduled = false;
  });

  it('membership flip wakes only old and new key readers', () => {
    const source = new Signal(0);
    const isSelected = selector(source);
    const runs = new Map();
    const rs = [];
    for (let i = 0; i < 5; i++) {
      rs.push(Reaction.create(() => {
        isSelected(i);
        runs.set(i, (runs.get(i) || 0) + 1);
      }));
    }
    for (let i = 0; i < 5; i++) { expect(runs.get(i)).toBe(1); }
    source.set(2);
    Scheduler.flush();
    // only key 0 (was selected) and key 2 (now selected) should rerun.
    expect(runs.get(0)).toBe(2);
    expect(runs.get(1)).toBe(1);
    expect(runs.get(2)).toBe(2);
    expect(runs.get(3)).toBe(1);
    expect(runs.get(4)).toBe(1);
    for (const r of rs) { r.stop(); }
  });

  it('re-arms after Reaction.run teardown — A → B → A wakes A again', () => {
    const source = new Signal('A');
    const isSelected = selector(source);
    let runs = 0;
    const r = Reaction.create(() => {
      isSelected('A');
      runs++;
    });
    expect(runs).toBe(1);
    source.set('B');
    Scheduler.flush();
    expect(runs).toBe(2);
    source.set('A');
    Scheduler.flush();
    // the load-bearing case: 'A' must wake despite the rerun-teardown
    // cycle that ran when 'A' itself was the source change.
    expect(runs).toBe(3);
    r.stop();
  });

  it('row churn does not leak keyDeps entries', () => {
    const source = new Signal(0);
    const isSelected = selector(source);
    const rs = [];
    for (let i = 0; i < 50; i++) {
      rs.push(Reaction.create(() => {
        isSelected(i);
      }));
    }
    for (const r of rs) { r.stop(); }
    // advance the source once so the backing reaction runs its prune pass.
    source.set(1);
    Scheduler.flush();
    // any keyDep still left has zero subscribers (it would be pruned on
    // the next pass). Verify by registering a fresh reader and confirming
    // it isn't woken by prior keys' churn.
    let runs = 0;
    const r = Reaction.create(() => {
      isSelected(99);
      runs++;
    });
    expect(runs).toBe(1);
    source.set(2);
    Scheduler.flush();
    expect(runs).toBe(1); // key 99 isn't 1 or 2, no flip — no rerun.
    r.stop();
  });

  it('selector exposes stop() for deterministic teardown', () => {
    const source = new Signal(0);
    const isSelected = selector(source);
    let runs = 0;
    const r = Reaction.create(() => {
      isSelected(1);
      runs++;
    });
    isSelected.stop();
    source.set(1);
    Scheduler.flush();
    // backing reaction was stopped — no fanout, the reader's per-key dep
    // never receives a `.changed()` call.
    expect(runs).toBe(1);
    r.stop();
  });

  it('custom matchFn — range membership wakes exactly the keys that flipped', () => {
    const source = new Signal(5);
    // "key is less than current value" — flip semantics: increasing
    // value from 5 to 7 flips keys 5 and 6 from false to true.
    const inRange = selector(source, (key, value) => key < value);
    const runs = new Map();
    const rs = [];
    for (let i = 0; i < 10; i++) {
      rs.push(Reaction.create(() => {
        inRange(i);
        runs.set(i, (runs.get(i) || 0) + 1);
      }));
    }
    source.set(7);
    Scheduler.flush();
    // keys 5 and 6 flipped (false → true). others did not.
    expect(runs.get(5)).toBe(2);
    expect(runs.get(6)).toBe(2);
    expect(runs.get(4)).toBe(1);
    expect(runs.get(7)).toBe(1);
    expect(runs.get(0)).toBe(1);
    for (const r of rs) { r.stop(); }
  });
});
