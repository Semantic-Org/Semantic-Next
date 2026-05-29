import { flush, match, reaction, Scheduler, Signal } from '@semantic-ui/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';

describe('match', () => {
  beforeEach(() => {
    Scheduler.current = null;
    Scheduler.pendingReactions.clear();
    Scheduler.afterFlushCallbacks = [];
    Scheduler.isFlushScheduled = false;
  });

  it('membership flip re-fires only old and new key readers', () => {
    const source = new Signal(0);
    const isCurrent = match(source);
    const runs = new Map();
    const rs = [];
    for (let i = 0; i < 5; i++) {
      rs.push(reaction(() => {
        isCurrent(i);
        runs.set(i, (runs.get(i) || 0) + 1);
      }));
    }
    for (let i = 0; i < 5; i++) { expect(runs.get(i)).toBe(1); }
    source.set(2);
    Scheduler.flush();
    expect(runs.get(0)).toBe(2);
    expect(runs.get(1)).toBe(1);
    expect(runs.get(2)).toBe(2);
    expect(runs.get(3)).toBe(1);
    expect(runs.get(4)).toBe(1);
    for (const r of rs) { r.stop(); }
  });

  it('re-arms after Reaction.run teardown, A to B to A re-fires A again', () => {
    const source = new Signal('A');
    const isCurrent = match(source);
    let runs = 0;
    const r = reaction(() => {
      isCurrent('A');
      runs++;
    });
    expect(runs).toBe(1);
    source.set('B');
    Scheduler.flush();
    expect(runs).toBe(2);
    source.set('A');
    Scheduler.flush();
    // 'A' must re-fire despite the rerun-teardown cycle that ran when 'A'
    // itself was the source change.
    expect(runs).toBe(3);
    r.stop();
  });

  it('row churn does not leak keyDeps entries', () => {
    const source = new Signal(0);
    const isCurrent = match(source);
    const rs = [];
    for (let i = 0; i < 50; i++) {
      rs.push(reaction(() => {
        isCurrent(i);
      }));
    }
    for (const r of rs) { r.stop(); }
    // advance the source once so the backing reaction runs its prune pass
    source.set(1);
    Scheduler.flush();
    let runs = 0;
    const r = reaction(() => {
      isCurrent(99);
      runs++;
    });
    expect(runs).toBe(1);
    source.set(2);
    Scheduler.flush();
    expect(runs).toBe(1);
    r.stop();
  });

  it('match exposes stop() for deterministic teardown', () => {
    const source = new Signal(0);
    const isCurrent = match(source);
    let runs = 0;
    const r = reaction(() => {
      isCurrent(1);
      runs++;
    });
    isCurrent.stop();
    source.set(1);
    Scheduler.flush();
    expect(runs).toBe(1);
    r.stop();
  });

  it('custom matchFn, range membership re-fires exactly the keys that flipped', () => {
    const source = new Signal(5);
    // key is less than current value, so increasing value from 5 to 7 flips keys 5 and 6 from false to true
    const inRange = match(source, (key, value) => key < value);
    const runs = new Map();
    const rs = [];
    for (let i = 0; i < 10; i++) {
      rs.push(reaction(() => {
        inRange(i);
        runs.set(i, (runs.get(i) || 0) + 1);
      }));
    }
    source.set(7);
    Scheduler.flush();
    expect(runs.get(5)).toBe(2);
    expect(runs.get(6)).toBe(2);
    expect(runs.get(4)).toBe(1);
    expect(runs.get(7)).toBe(1);
    expect(runs.get(0)).toBe(1);
    for (const r of rs) { r.stop(); }
  });
});
