import { Reaction, Signal } from '@semantic-ui/reactivity';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Suite contract:
// Every mutation helper must (1) apply its mutation, (2) fire reactivity, and
// (3) use the in-place / reference path internally — even under safety: 'clone'.
// The third property is checked by capturing the live storage ref via raw()
// before and after the helper call. If a helper replaces storage instead of
// mutating it, the post-call raw() will be a different ref and the test fails.
//
// We deliberately do NOT read signal.js while authoring this — these are
// blackbox expectations a downstream user has reading the public d.ts.

const SAFETY_MODES = ['clone', 'reference'];

SAFETY_MODES.forEach((safety) => {
  describe(`Signal mutation helpers — safety: '${safety}'`, () => {
    /*******************************
            Test helpers
    *******************************/

    // Track how many times a reaction re-runs after the initial registration.
    // Reaction.create runs the fn once synchronously to capture deps; we
    // discount that first run so .count reflects only post-helper wakeups.
    const subscribe = (signal) => {
      let runs = 0;
      const reaction = Reaction.create(() => {
        signal.get();
        runs++;
      });
      return {
        get count() {
          return runs - 1;
        },
        stop: () => reaction.stop(),
      };
    };

    /*******************************
          Array container helpers
    *******************************/

    describe('push', () => {
      it('appends items to the array', () => {
        const sig = new Signal([1, 2, 3], { safety });
        sig.push(4);
        expect(sig.raw()).toEqual([1, 2, 3, 4]);
      });

      it('fires reactivity', () => {
        const sig = new Signal([1, 2, 3], { safety });
        const sub = subscribe(sig);
        sig.push(4);
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });

      it('preserves stored array identity (in-place mutation)', () => {
        const sig = new Signal([1, 2, 3], { safety });
        const before = sig.raw();
        sig.push(4);
        expect(sig.raw()).toBe(before);
      });
    });

    describe('unshift', () => {
      it('prepends items to the array', () => {
        const sig = new Signal([1, 2, 3], { safety });
        sig.unshift(0);
        expect(sig.raw()).toEqual([0, 1, 2, 3]);
      });

      it('fires reactivity', () => {
        const sig = new Signal([1, 2, 3], { safety });
        const sub = subscribe(sig);
        sig.unshift(0);
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });

      it('preserves stored array identity (in-place mutation)', () => {
        const sig = new Signal([1, 2, 3], { safety });
        const before = sig.raw();
        sig.unshift(0);
        expect(sig.raw()).toBe(before);
      });
    });

    describe('splice', () => {
      it('removes and inserts at the given index', () => {
        const sig = new Signal([1, 2, 3, 4], { safety });
        sig.splice(1, 2, 20, 30);
        expect(sig.raw()).toEqual([1, 20, 30, 4]);
      });

      it('inserts without removing when deleteCount is 0', () => {
        const sig = new Signal(['a', 'b', 'c', 'd'], { safety });
        sig.splice(2, 0, 'x', 'y');
        expect(sig.raw()).toEqual(['a', 'b', 'x', 'y', 'c', 'd']);
      });

      it('removing the entire array yields an empty array', () => {
        const sig = new Signal(['a', 'b', 'c'], { safety });
        sig.splice(0, 3);
        expect(sig.raw()).toEqual([]);
      });

      it('fires reactivity', () => {
        const sig = new Signal([1, 2, 3, 4], { safety });
        const sub = subscribe(sig);
        sig.splice(1, 1);
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });

      it('preserves stored array identity (in-place mutation)', () => {
        const sig = new Signal([1, 2, 3, 4], { safety });
        const before = sig.raw();
        sig.splice(1, 1);
        expect(sig.raw()).toBe(before);
      });
    });

    describe('map', () => {
      it('transforms every element', () => {
        const sig = new Signal([1, 2, 3], { safety });
        sig.map(x => x * 10);
        expect(sig.raw()).toEqual([10, 20, 30]);
      });

      it('handles complex transformations producing new object shapes', () => {
        const sig = new Signal(
          [{ id: 1, value: 10 }, { id: 2, value: 20 }],
          { safety },
        );
        sig.map(item => ({ ...item, doubled: item.value * 2 }));
        expect(sig.raw()).toEqual([
          { id: 1, value: 10, doubled: 20 },
          { id: 2, value: 20, doubled: 40 },
        ]);
      });

      it('fires reactivity', () => {
        const sig = new Signal([1, 2, 3], { safety });
        const sub = subscribe(sig);
        sig.map(x => x + 1);
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });

      it('preserves stored array identity (in-place mutation)', () => {
        const sig = new Signal([1, 2, 3], { safety });
        const before = sig.raw();
        sig.map(x => x + 1);
        expect(sig.raw()).toBe(before);
      });
    });

    describe('filter', () => {
      it('keeps only matching elements', () => {
        const sig = new Signal([1, 2, 3, 4], { safety });
        sig.filter(x => x % 2 === 0);
        expect(sig.raw()).toEqual([2, 4]);
      });

      it('filtering to an empty result yields an empty array, not undefined', () => {
        const sig = new Signal([1, 2, 3], { safety });
        sig.filter(() => false);
        expect(sig.raw()).toEqual([]);
      });

      it('handles complex objects via predicate', () => {
        const sig = new Signal(
          [{ id: 1, active: true }, { id: 2, active: false }, { id: 3, active: true }],
          { safety },
        );
        sig.filter(item => item.active);
        expect(sig.raw()).toEqual([
          { id: 1, active: true },
          { id: 3, active: true },
        ]);
      });

      it('fires reactivity', () => {
        const sig = new Signal([1, 2, 3, 4], { safety });
        const sub = subscribe(sig);
        sig.filter(x => x % 2 === 0);
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });

      it('preserves stored array identity (in-place mutation)', () => {
        const sig = new Signal([1, 2, 3, 4], { safety });
        const before = sig.raw();
        sig.filter(x => x > 1);
        expect(sig.raw()).toBe(before);
      });
    });

    /*******************************
          Index-addressed helpers
    *******************************/

    describe('getIndex', () => {
      it('reads the element at the given index', () => {
        const sig = new Signal(['red', 'green', 'blue'], { safety });
        expect(sig.getIndex(0)).toBe('red');
        expect(sig.getIndex(2)).toBe('blue');
      });

      it('creates a dependency — setIndex writes re-fire the reaction', () => {
        const sig = new Signal(['red', 'green', 'blue'], { safety });
        const fn = vi.fn();
        Reaction.create(() => fn(sig.getIndex(0)));
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenLastCalledWith('red');

        sig.setIndex(0, 'purple');
        Reaction.flush();
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenLastCalledWith('purple');
      });
    });

    describe('setIndex', () => {
      it('replaces the element at the given index', () => {
        const sig = new Signal([1, 2, 3], { safety });
        sig.setIndex(1, 20);
        expect(sig.raw()).toEqual([1, 20, 3]);
      });

      it('fires reactivity', () => {
        const sig = new Signal([1, 2, 3], { safety });
        const sub = subscribe(sig);
        sig.setIndex(1, 20);
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });

      it('preserves stored array identity (in-place mutation)', () => {
        const sig = new Signal([1, 2, 3], { safety });
        const before = sig.raw();
        sig.setIndex(1, 20);
        expect(sig.raw()).toBe(before);
      });
    });

    describe('removeIndex', () => {
      it('removes the element at the given index', () => {
        const sig = new Signal([1, 2, 3], { safety });
        sig.removeIndex(1);
        expect(sig.raw()).toEqual([1, 3]);
      });

      it('fires reactivity', () => {
        const sig = new Signal([1, 2, 3], { safety });
        const sub = subscribe(sig);
        sig.removeIndex(1);
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });

      it('preserves stored array identity (in-place mutation)', () => {
        const sig = new Signal([1, 2, 3], { safety });
        const before = sig.raw();
        sig.removeIndex(1);
        expect(sig.raw()).toBe(before);
      });
    });

    /*******************************
       Collection read helpers
    *******************************/

    describe('getItem', () => {
      it('returns the item matching the id', () => {
        const sig = new Signal(
          [{ id: 'a', v: 1 }, { id: 'b', v: 2 }],
          { safety },
        );
        expect(sig.getItem('b')).toEqual({ id: 'b', v: 2 });
      });

      it('returns undefined when no item matches', () => {
        const sig = new Signal(
          [{ id: 'a', v: 1 }],
          { safety },
        );
        expect(sig.getItem('missing')).toBeUndefined();
      });
    });

    describe('getItemIndex', () => {
      it('returns the index of the matching item', () => {
        const sig = new Signal(
          [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
          { safety },
        );
        expect(sig.getItemIndex('b')).toBe(1);
      });

      it('returns -1 when no item matches', () => {
        const sig = new Signal(
          [{ id: 'a' }],
          { safety },
        );
        expect(sig.getItemIndex('missing')).toBe(-1);
      });
    });

    /*******************************
        ID utilities (pure)
    *******************************/

    describe('getID', () => {
      it('reads id from any of: id, _id, hash, key', () => {
        const sig = new Signal([], { safety });
        expect(sig.getID({ id: 'a' })).toBe('a');
        expect(sig.getID({ _id: 'b' })).toBe('b');
        expect(sig.getID({ hash: 'c' })).toBe('c');
        expect(sig.getID({ key: 'd' })).toBe('d');
      });

      it('returns a string item as its own id', () => {
        const sig = new Signal([], { safety });
        expect(sig.getID('plain')).toBe('plain');
      });
    });

    describe('getIDs', () => {
      it('collects all distinct ids on an item', () => {
        const sig = new Signal([], { safety });
        const ids = sig.getIDs({ _id: 'one', id: 'one', key: 'two' });
        expect(ids).toContain('one');
        expect(ids).toContain('two');
        expect(ids.length).toBe(2);
      });

      it('wraps a non-object item in a one-element array', () => {
        const sig = new Signal([], { safety });
        expect(sig.getIDs('plain')).toEqual(['plain']);
      });
    });

    describe('hasID', () => {
      it('returns true when item carries the given id under any recognised field', () => {
        const sig = new Signal([], { safety });
        expect(sig.hasID({ id: 'x' }, 'x')).toBe(true);
        expect(sig.hasID({ _id: 'x' }, 'x')).toBe(true);
        expect(sig.hasID({ hash: 'x' }, 'x')).toBe(true);
        expect(sig.hasID({ key: 'x' }, 'x')).toBe(true);
      });

      it('returns false when the id does not match', () => {
        const sig = new Signal([], { safety });
        expect(sig.hasID({ id: 'x' }, 'y')).toBe(false);
      });
    });

    /*******************************
        Collection (id) mutators
    *******************************/

    describe('setArrayProperty (index form)', () => {
      it('sets a property on one item by index', () => {
        const sig = new Signal(
          [{ id: 'a', count: 0 }, { id: 'b', count: 0 }],
          { safety },
        );
        sig.setArrayProperty(0, 'count', 5);
        expect(sig.raw()[0].count).toBe(5);
        expect(sig.raw()[1].count).toBe(0);
      });

      it('fires reactivity', () => {
        const sig = new Signal(
          [{ id: 'a', count: 0 }, { id: 'b', count: 0 }],
          { safety },
        );
        const sub = subscribe(sig);
        sig.setArrayProperty(0, 'count', 5);
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });

      it('preserves stored array identity (in-place mutation)', () => {
        const sig = new Signal(
          [{ id: 'a', count: 0 }, { id: 'b', count: 0 }],
          { safety },
        );
        const before = sig.raw();
        sig.setArrayProperty(0, 'count', 5);
        expect(sig.raw()).toBe(before);
      });
    });

    describe('setArrayProperty (all-items form)', () => {
      it('sets a property on every item', () => {
        const sig = new Signal(
          [{ id: 'a', done: false }, { id: 'b', done: false }],
          { safety },
        );
        sig.setArrayProperty('done', true);
        expect(sig.raw().every(item => item.done === true)).toBe(true);
      });

      it('fires reactivity', () => {
        const sig = new Signal(
          [{ id: 'a', done: false }, { id: 'b', done: false }],
          { safety },
        );
        const sub = subscribe(sig);
        sig.setArrayProperty('done', true);
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });

      it('preserves stored array identity (in-place mutation)', () => {
        const sig = new Signal(
          [{ id: 'a', done: false }, { id: 'b', done: false }],
          { safety },
        );
        const before = sig.raw();
        sig.setArrayProperty('done', true);
        expect(sig.raw()).toBe(before);
      });
    });

    describe('setProperty (array form, by id)', () => {
      it('sets a property on the item matching the id', () => {
        const sig = new Signal(
          [{ id: 'a', title: 'one' }, { id: 'b', title: 'two' }],
          { safety },
        );
        sig.setProperty('b', 'title', 'TWO');
        expect(sig.raw().find(i => i.id === 'b').title).toBe('TWO');
        expect(sig.raw().find(i => i.id === 'a').title).toBe('one');
      });

      it('fires reactivity', () => {
        const sig = new Signal(
          [{ id: 'a', title: 'one' }, { id: 'b', title: 'two' }],
          { safety },
        );
        const sub = subscribe(sig);
        sig.setProperty('b', 'title', 'TWO');
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });

      it('preserves stored array identity (in-place mutation)', () => {
        const sig = new Signal(
          [{ id: 'a', title: 'one' }, { id: 'b', title: 'two' }],
          { safety },
        );
        const before = sig.raw();
        sig.setProperty('b', 'title', 'TWO');
        expect(sig.raw()).toBe(before);
      });
    });

    describe('setProperty (object form)', () => {
      it('sets a property on the stored object', () => {
        const sig = new Signal({ name: 'a', count: 0 }, { safety });
        sig.setProperty('count', 7);
        expect(sig.raw().count).toBe(7);
      });

      it('fires reactivity', () => {
        const sig = new Signal({ name: 'a', count: 0 }, { safety });
        const sub = subscribe(sig);
        sig.setProperty('count', 7);
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });

      it('preserves stored object identity (in-place mutation)', () => {
        const sig = new Signal({ name: 'a', count: 0 }, { safety });
        const before = sig.raw();
        sig.setProperty('count', 7);
        expect(sig.raw()).toBe(before);
      });
    });

    describe('replaceItem', () => {
      it('replaces the item matching the id', () => {
        const sig = new Signal(
          [{ id: 'a', v: 1 }, { id: 'b', v: 2 }],
          { safety },
        );
        sig.replaceItem('a', { id: 'a', v: 100 });
        expect(sig.raw()[0].v).toBe(100);
        expect(sig.raw()[1].v).toBe(2);
      });

      it('fires reactivity', () => {
        const sig = new Signal(
          [{ id: 'a', v: 1 }, { id: 'b', v: 2 }],
          { safety },
        );
        const sub = subscribe(sig);
        sig.replaceItem('a', { id: 'a', v: 100 });
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });

      it('preserves stored array identity (in-place mutation)', () => {
        const sig = new Signal(
          [{ id: 'a', v: 1 }, { id: 'b', v: 2 }],
          { safety },
        );
        const before = sig.raw();
        sig.replaceItem('a', { id: 'a', v: 100 });
        expect(sig.raw()).toBe(before);
      });
    });

    describe('removeItem', () => {
      it('removes the item matching the id', () => {
        const sig = new Signal(
          [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
          { safety },
        );
        sig.removeItem('b');
        expect(sig.raw().map(i => i.id)).toEqual(['a', 'c']);
      });

      it('fires reactivity', () => {
        const sig = new Signal(
          [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
          { safety },
        );
        const sub = subscribe(sig);
        sig.removeItem('b');
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });

      it('preserves stored array identity (in-place mutation)', () => {
        const sig = new Signal(
          [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
          { safety },
        );
        const before = sig.raw();
        sig.removeItem('b');
        expect(sig.raw()).toBe(before);
      });
    });

    /*******************************
          General mutate helper
    *******************************/

    describe('mutate', () => {
      let warnSpy;
      beforeEach(() => {
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      });
      afterEach(() => {
        warnSpy.mockRestore();
      });

      it('applies side-effect mutations to the stored value', () => {
        const sig = new Signal([1, 2, 3], { safety });
        sig.mutate(arr => {
          arr.push(4);
        });
        expect(sig.raw()).toEqual([1, 2, 3, 4]);
      });

      it('fires reactivity when the value actually changed', () => {
        const sig = new Signal([1, 2, 3], { safety });
        const sub = subscribe(sig);
        sig.mutate(arr => {
          arr.push(4);
        });
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });

      it('preserves stored array identity (in-place mutation)', () => {
        const sig = new Signal([1, 2, 3], { safety });
        const before = sig.raw();
        sig.mutate(arr => {
          arr.push(4);
        });
        expect(sig.raw()).toBe(before);
      });

      it('returning a brand-new value sets it as the new value', () => {
        const sig = new Signal(5, { safety });
        sig.mutate(val => val * 2);
        expect(sig.raw()).toBe(10);
      });

      it('a no-op mutate does NOT re-fire subscribers', () => {
        const sig = new Signal(['a', 'b'], { safety });
        const sub = subscribe(sig);
        sig.mutate(() => {});
        Reaction.flush();
        expect(sub.count).toBe(0);
        sub.stop();
      });

      it('returning the same reference that was mutated in place warns in dev', () => {
        const sig = new Signal([1, 2, 3], { safety });
        sig.mutate(arr => {
          arr.push(4);
          return arr;
        });
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy.mock.calls[0][0]).toMatch(/same reference/);
      });
    });

    /*******************************
        Primitive-value helpers
    *******************************/

    describe('toggle', () => {
      it('flips false to true', () => {
        const sig = new Signal(false, { safety });
        sig.toggle();
        expect(sig.raw()).toBe(true);
      });

      it('flips true to false', () => {
        const sig = new Signal(true, { safety });
        sig.toggle();
        expect(sig.raw()).toBe(false);
      });

      it('a pair of toggle() calls leaves the value where it started', () => {
        const sig = new Signal(false, { safety });
        sig.toggle();
        sig.toggle();
        expect(sig.raw()).toBe(false);
      });

      it('fires reactivity on each flip', () => {
        const sig = new Signal(false, { safety });
        const sub = subscribe(sig);
        sig.toggle();
        Reaction.flush();
        sig.toggle();
        Reaction.flush();
        expect(sub.count).toBe(2);
        sub.stop();
      });
    });

    describe('increment', () => {
      it('adds 1 by default', () => {
        const sig = new Signal(5, { safety });
        sig.increment();
        expect(sig.raw()).toBe(6);
      });

      it('adds the given amount', () => {
        const sig = new Signal(5, { safety });
        sig.increment(10);
        expect(sig.raw()).toBe(15);
      });

      it('clamps to max', () => {
        const sig = new Signal(8, { safety });
        sig.increment(5, 10);
        expect(sig.raw()).toBe(10);
      });

      it('fires reactivity', () => {
        const sig = new Signal(5, { safety });
        const sub = subscribe(sig);
        sig.increment();
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });
    });

    describe('decrement', () => {
      it('subtracts 1 by default', () => {
        const sig = new Signal(5, { safety });
        sig.decrement();
        expect(sig.raw()).toBe(4);
      });

      it('subtracts the given amount', () => {
        const sig = new Signal(20, { safety });
        sig.decrement(7);
        expect(sig.raw()).toBe(13);
      });

      it('clamps to min', () => {
        const sig = new Signal(3, { safety });
        sig.decrement(5, 0);
        expect(sig.raw()).toBe(0);
      });

      it('fires reactivity', () => {
        const sig = new Signal(5, { safety });
        const sub = subscribe(sig);
        sig.decrement();
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });
    });

    describe('now', () => {
      it('sets value to the current Date', () => {
        const sig = new Signal(new Date(0), { safety });
        const t0 = Date.now();
        sig.now();
        const stored = sig.raw();
        expect(stored).toBeInstanceOf(Date);
        expect(stored.getTime()).toBeGreaterThanOrEqual(t0);
      });

      it('fires reactivity', () => {
        const sig = new Signal(new Date(0), { safety });
        const sub = subscribe(sig);
        sig.now();
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });
    });

    describe('clear', () => {
      it('sets value to undefined', () => {
        const sig = new Signal({ a: 1 }, { safety });
        sig.clear();
        expect(sig.raw()).toBe(undefined);
      });

      it('fires reactivity', () => {
        const sig = new Signal({ a: 1 }, { safety });
        const sub = subscribe(sig);
        sig.clear();
        Reaction.flush();
        expect(sub.count).toBe(1);
        sub.stop();
      });
    });

    /*******************************
       Type-mismatched helper calls
       — helpers are not type-guarded;
       these tests document actual behaviour
       so the contract is explicit for users
    *******************************/

    describe('type-mismatched helper calls', () => {
      it('toggle() on a number coerces via NOT — truthy becomes false', () => {
        const sig = new Signal(1, { safety });
        sig.toggle();
        expect(sig.raw()).toBe(false);
      });

      it('toggle() on undefined flips to true', () => {
        const sig = new Signal(undefined, { safety });
        sig.toggle();
        expect(sig.raw()).toBe(true);
      });

      it('increment() on a string concatenates rather than throwing', () => {
        const sig = new Signal('count', { safety });
        sig.increment(1);
        expect(sig.raw()).toBe('count1');
      });

      it('push() on a non-array signal throws', () => {
        const sig = new Signal(42, { safety });
        expect(() => sig.push('x')).toThrow();
      });
    });

    /*******************************
       Safety contract — clone mode
       does not leak the live ref
    *******************************/

    if (safety === 'clone') {
      describe('safety contract: stored value is shielded from external mutation', () => {
        it('peek() returns a copy — mutating it does not affect the signal', () => {
          const sig = new Signal({ count: 0 }, { safety });
          const copy = sig.peek();
          copy.count = 999;
          expect(sig.raw().count).toBe(0);
        });

        it('get() returns a copy — mutating it does not affect the signal', () => {
          const sig = new Signal([1, 2, 3], { safety });
          const copy = sig.get();
          copy.push(999);
          expect(sig.raw()).toEqual([1, 2, 3]);
        });

        it('after a helper mutation, external reads still get a copy', () => {
          const sig = new Signal([{ id: 'a', v: 1 }], { safety });
          sig.push({ id: 'b', v: 2 });
          const copy = sig.peek();
          copy.push({ id: 'c', v: 3 });
          expect(sig.raw().length).toBe(2);
        });
      });
    }
  });
});
