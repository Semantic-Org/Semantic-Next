import {
  afterFlush,
  computed,
  currentReaction,
  derive,
  flush,
  guard,
  nonreactive,
  Reaction,
  reaction,
  Signal,
  signal,
} from '@semantic-ui/reactivity';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Direct coverage for the module-level free-fn surface. Behavior delegation
// is verified against the class-based suite. These tests pin the factory
// shape and that each entry wires to the underlying impl.

describe('module-level factories', () => {
  describe('signal()', () => {
    it('returns a Signal instance', () => {
      expect(signal(0)).toBeInstanceOf(Signal);
    });

    it('passes initial value through', () => {
      expect(signal(42).get()).toBe(42);
    });

    it('passes options through to the constructor', () => {
      const eq = vi.fn(() => true);
      const sig = signal({ a: 1 }, { equality: eq });
      sig.set({ a: 2 });
      expect(eq).toHaveBeenCalled();
      expect(sig.peek()).toEqual({ a: 1 });
    });
  });

  describe('reaction()', () => {
    it('returns a Reaction instance', () => {
      const r = reaction(() => {});
      expect(r).toBeInstanceOf(Reaction);
      r.stop();
    });

    it('auto-runs the callback by default', () => {
      const cb = vi.fn();
      const r = reaction(cb);
      expect(cb).toHaveBeenCalledTimes(1);
      r.stop();
    });

    it('respects firstRun: false', () => {
      const cb = vi.fn();
      const r = reaction(cb, { firstRun: false });
      expect(cb).not.toHaveBeenCalled();
      r.stop();
    });

    it('tracks signal reads — a change re-fires the callback', () => {
      const s = signal(0);
      const cb = vi.fn(() => s.get());
      const r = reaction(cb);
      s.set(1);
      flush();
      expect(cb).toHaveBeenCalledTimes(2);
      r.stop();
    });
  });

  describe('derive()', () => {
    it('returns a Signal whose value tracks the source through the compute fn', () => {
      const src = signal(5);
      const doubled = derive(src, v => v * 2);
      expect(doubled).toBeInstanceOf(Signal);
      expect(doubled.get()).toBe(10);
      src.set(7);
      flush();
      expect(doubled.get()).toBe(14);
    });
  });

  describe('computed()', () => {
    it('returns a Signal that reads from any tracked sources', () => {
      const a = signal(1);
      const b = signal(2);
      const sum = computed(() => a.get() + b.get());
      expect(sum).toBeInstanceOf(Signal);
      expect(sum.get()).toBe(3);
      a.set(10);
      flush();
      expect(sum.get()).toBe(12);
    });
  });

  describe('nonreactive()', () => {
    it('returns the value of the inner callback', () => {
      expect(nonreactive(() => 42)).toBe(42);
    });

    it('does not register dependencies for signals read inside the block', () => {
      const s = signal('untracked');
      const cb = vi.fn();
      const r = reaction(() => cb(nonreactive(() => s.get())));
      s.set('changed');
      flush();
      expect(cb).toHaveBeenCalledTimes(1);
      r.stop();
    });
  });

  describe('guard()', () => {
    it('returns f() directly when called outside a reaction', () => {
      expect(guard(() => 7)).toBe(7);
    });

    it('short-circuits downstream on deep-equal returns', () => {
      const src = signal({ a: 1, meta: 1 });
      const cb = vi.fn();
      const r = reaction(() => {
        guard(() => ({ a: src.get().a }));
        cb();
      });
      src.set({ a: 1, meta: 2 });
      flush();
      expect(cb).toHaveBeenCalledTimes(1);
      r.stop();
    });
  });

  describe('currentReaction()', () => {
    it('is null outside of any reaction', () => {
      expect(currentReaction()).toBeNull();
    });

    it('is the running reaction inside its callback', () => {
      let seen;
      const r = reaction((self) => {
        seen = currentReaction();
      });
      expect(seen).toBe(r);
      r.stop();
    });
  });

  describe('flush() / afterFlush()', () => {
    it('flush() synchronously drains pending reactions', () => {
      const s = signal(0);
      const cb = vi.fn(() => s.get());
      const r = reaction(cb);
      s.set(1);
      flush();
      expect(cb).toHaveBeenCalledTimes(2);
      r.stop();
    });

    it('afterFlush() runs after the reaction drain in the same flush', () => {
      const s = signal(0);
      const order = [];
      const r = reaction(() => {
        s.get();
        order.push('reaction');
      });
      order.length = 0;
      s.set(1);
      afterFlush(() => order.push('after'));
      flush();
      expect(order).toEqual(['reaction', 'after']);
      r.stop();
    });
  });
});
