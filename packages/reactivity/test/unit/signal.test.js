import { computed, flush, Reaction, reaction, Signal } from '@semantic-ui/reactivity';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe.concurrent('Signal', () => {
  /*******************************
              Creation
  *******************************/

  describe.concurrent('Initialization', () => {
    it('provide value', () => {
      const signal = new Signal('initial');
      signal.value = 'updated';
      expect(signal.value).toBe('updated');
    });
    it('provide get and set helper', () => {
      const signal = new Signal('initial');
      signal.set('updated');
      expect(signal.value).toBe('updated');
      expect(signal.get()).toBe('updated');
    });
    it('should update and return the new value correctly', () => {
      const signal = new Signal('initial');
      signal.value = 'updated';
      expect(signal.value).toBe('updated');
    });
  });

  /*******************************
              Equality
  *******************************/

  describe.concurrent('Equality', () => {
    it('allow custom equality', () => {
      const callback = vi.fn();

      // never equal always rerun
      const isEqual = (a, b) => {
        return false;
      };
      const signal = new Signal('initial', { equality: isEqual });
      signal.value = 'initial';
      reaction(() => callback(signal.get()));

      flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.value = 'initial';
      flush();

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('identical objects shouldnt trigger reactivity', () => {
      const callback = vi.fn();

      const a = {
        a: 1,
        b: {
          b1: 1,
          b2: 2,
          b3: 3,
        },
      };
      const b = {
        a: 1,
        b: {
          b1: 1,
          b2: 2,
          b3: 3,
        },
      };
      const signal = new Signal(a);
      reaction(() => callback(signal.get()));

      flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.value = b;
      flush();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('identical objects with different key order shouldnt trigger reactivity', () => {
      const callback = vi.fn();

      const a = {
        b: {
          b3: 3,
          b2: 2,
          b1: 1,
        },
        a: 1,
      };
      const b = {
        a: 1,
        b: {
          b1: 1,
          b2: 2,
          b3: 3,
        },
      };
      const signal = new Signal(a);
      reaction(() => callback(signal.get()));

      flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.value = b;
      flush();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  /*******************************
            Reactivity
  *******************************/

  describe.concurrent('Reactivity', () => {
    it('should notify reactions on value change', () => {
      const callback = vi.fn();
      const signal = new Signal('initial');
      reaction(() => callback(signal.get()));
      flush();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenLastCalledWith('initial');

      signal.value = 'updated';
      flush();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith('updated');

      signal.set('final');
      flush();
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenLastCalledWith('final');
    });

    it('Peek should not trigger reactivity', () => {
      const signal = new Signal('anything');
      const cb = vi.fn((comp) => {
        signal.peek(); // not reactive dependency
      });
      reaction(cb);

      signal.set('anything else');
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it('Reactive variables should trigger nested dependencies', () => {
      const value1 = new Signal(1);
      const value2 = new Signal();
      const value3 = new Signal();
      const computation1 = () => {
        value2.set(value1.get());
      };
      const computation2 = () => {
        value3.set(value2.get());
      };
      reaction(computation1);
      reaction(computation2);
      flush();
      expect(value3.get()).toEqual(1);
    });
  });

  /*******************************
        Dependency Management
  *******************************/

  describe.concurrent('Dependency Management', () => {
    it('depend should register as dependency without reading value', () => {
      const signal = new Signal('secret');
      const cb = vi.fn(() => {
        signal.depend();
      });
      reaction(cb);
      expect(cb).toHaveBeenCalledTimes(1);

      signal.set('updated');
      flush();
      expect(cb).toHaveBeenCalledTimes(2);
    });

    it('depend should not register dependency outside reactive context', () => {
      const signal = new Signal('value');
      signal.depend(); // should not throw
      expect(signal.hasDependents()).toBe(false);
    });

    it('notify should trigger subscribers without changing value', () => {
      const signal = new Signal('stable');
      const callback = vi.fn(() => {
        signal.get();
      });
      reaction(callback);
      expect(callback).toHaveBeenCalledTimes(1);

      signal.notify();
      flush();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(signal.peek()).toBe('stable');
    });

    it('notify should work even when value passes equality check', () => {
      const signal = new Signal(42);
      const callback = vi.fn(() => {
        signal.get();
      });
      reaction(callback);

      signal.set(42);
      flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.notify();
      flush();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('hasDependents should return false with no subscribers', () => {
      const signal = new Signal(0);
      expect(signal.hasDependents()).toBe(false);
    });

    it('hasDependents should return true when inside a reaction', () => {
      const signal = new Signal(0);
      reaction(() => {
        signal.get();
      });
      expect(signal.hasDependents()).toBe(true);
    });

    it('hasDependents should return false after reaction stops', () => {
      const signal = new Signal(0);
      const r = reaction(() => {
        signal.get();
      });
      expect(signal.hasDependents()).toBe(true);
      r.stop();
      expect(signal.hasDependents()).toBe(false);
    });
  });

  describe.concurrent('Cloning Behavior with Signals', () => {
    it('should maintain reactivity when using a Signal inside another Signal', () => {
      const innerCallback = vi.fn();
      const innerVar = new Signal(1, { safety: 'clone' });

      const outerCallback = vi.fn();
      const outerVar = new Signal(innerVar);

      reaction(() => outerCallback(outerVar.get()));
      flush();
      expect(outerCallback).toHaveBeenCalledTimes(1);

      reaction(() => innerCallback(innerVar.get()));
      innerVar.set(2);
      flush();

      expect(innerCallback).toHaveBeenCalledTimes(2);
    });

    it('should not retrigger reactivity on array when updating objects', () => {
      const outerCallback = vi.fn();

      const innerCallback1 = vi.fn();
      const innerCallback2 = vi.fn();

      const data1 = { id: 1, text: 'test object' };
      const data2 = { id: 2, text: 'test object 2' };

      const innerVar1 = new Signal(data1, { safety: 'clone' });
      const innerVar2 = new Signal(data2, { safety: 'clone' });

      reaction(() => innerCallback1(innerVar1.get()));
      reaction(() => innerCallback2(innerVar2.get()));

      const outerVar = new Signal([]);
      reaction(() => outerCallback(outerVar.get()));

      flush();
      expect(outerCallback).toHaveBeenCalledTimes(1);

      outerVar.push(innerVar1);
      flush();
      expect(outerCallback).toHaveBeenCalledTimes(2);

      outerVar.push(innerVar2);
      flush();
      expect(outerCallback).toHaveBeenCalledTimes(3);

      innerVar1.setProperty('text', 'hello world');
      expect(innerCallback1).toHaveBeenCalledTimes(1);
      expect(outerCallback).toHaveBeenCalledTimes(3);

      innerVar2.setProperty('text', 'hello world 2');
      expect(innerCallback2).toHaveBeenCalledTimes(1);
      expect(outerCallback).toHaveBeenCalledTimes(3);
    });
  });

  /*******************************
         Derived and Computed
  *******************************/

  describe.concurrent('Derived and Computed Signals', () => {
    // Basic functionality
    it('should create a derived signal from a single source', () => {
      const source = new Signal(10);
      const doubled = source.derive(val => val * 2);

      expect(doubled.get()).toBe(20);

      source.set(15);
      flush();
      expect(doubled.get()).toBe(30);
    });

    it('should create a computed signal from multiple sources', () => {
      const a = new Signal(1);
      const b = new Signal(2);
      const sum = computed(() => a.get() + b.get());

      expect(sum.get()).toBe(3);

      a.set(5);
      flush();
      expect(sum.get()).toBe(7);

      b.set(10);
      flush();
      expect(sum.get()).toBe(15);
    });

    // Test proper reactivity propagation
    it('should update derived when source changes', () => {
      const items = new Signal([1, 2, 3]);
      const count = items.derive(arr => arr.length);

      expect(count.get()).toBe(3);

      items.push(4);
      flush();
      expect(count.get()).toBe(4);

      items.splice(0, 2);
      flush();
      expect(count.get()).toBe(2);
    });

    it('should update computed when ANY dependency changes', () => {
      const a = new Signal(1);
      const b = new Signal(2);
      const c = new Signal(3);
      const sum = computed(() => a.get() + b.get() + c.get());

      expect(sum.get()).toBe(6);

      // Change first dependency
      a.set(10);
      flush();
      expect(sum.get()).toBe(15);

      // Change second dependency
      b.set(20);
      flush();
      expect(sum.get()).toBe(33);

      // Change third dependency
      c.set(30);
      flush();
      expect(sum.get()).toBe(60);
    });

    // Test reactions depending on derived/computed
    it('should trigger reactions when underlying signals change', () => {
      const base = new Signal(10);
      const doubled = base.derive(val => val * 2);

      let reactionCount = 0;
      let lastValue = null;

      reaction(() => {
        lastValue = doubled.get();
        reactionCount++;
      });

      flush();
      expect(reactionCount).toBe(1);
      expect(lastValue).toBe(20);

      // Changing base signal should trigger reaction on derived
      base.set(15);
      flush();
      expect(reactionCount).toBe(2);
      expect(lastValue).toBe(30);
    });

    // Test direct modification
    it('should allow direct modification of derived without affecting source', () => {
      const base = new Signal(10);
      const derived = base.derive(val => val * 2);

      expect(derived.get()).toBe(20);
      expect(base.get()).toBe(10);

      // Directly set derived signal
      derived.set(100);
      flush();

      // Derived value changes
      expect(derived.get()).toBe(100);
      // Base signal remains unchanged
      expect(base.get()).toBe(10);

      // Next base change will recalculate derived
      base.set(5);
      flush();
      expect(derived.get()).toBe(10);
    });

    // Test no over-reactivity
    it('should not trigger updates when computed value does not change', () => {
      const a = new Signal(10);
      const b = new Signal(20);
      const isPositive = computed(() => a.get() > 0);

      let updateCount = 0;
      reaction(() => {
        isPositive.get();
        updateCount++;
      });

      flush();
      expect(updateCount).toBe(1);
      expect(isPositive.get()).toBe(true);

      // Change that doesn't affect result
      a.set(5); // Still positive
      flush();
      expect(updateCount).toBe(1); // No update, value still true

      // Change that affects result
      a.set(-5);
      flush();
      expect(updateCount).toBe(2); // Update triggered
      expect(isPositive.get()).toBe(false);
    });

    // Test chains of derived/computed
    it('should handle chains of derived and computed signals', () => {
      const base = new Signal(2);
      const doubled = base.derive(val => val * 2);
      const quadrupled = doubled.derive(val => val * 2);
      const final = computed(() => quadrupled.get() + 1);

      expect(final.get()).toBe(9); // 2 * 2 * 2 + 1

      base.set(3);
      flush();
      expect(doubled.get()).toBe(6);
      expect(quadrupled.get()).toBe(12);
      expect(final.get()).toBe(13);
    });

    // Test complex array operations
    it('should handle complex array derivations', () => {
      const items = new Signal([
        { id: 1, price: 10, inStock: true },
        { id: 2, price: 20, inStock: false },
        { id: 3, price: 30, inStock: true },
      ]);

      const totalValue = items.derive(arr =>
        arr
          .filter(item => item.inStock)
          .reduce((sum, item) => sum + item.price, 0)
      );

      const inStockCount = items.derive(arr => arr.filter(item => item.inStock).length);

      expect(totalValue.get()).toBe(40);
      expect(inStockCount.get()).toBe(2);

      // Add item
      items.push({ id: 4, price: 15, inStock: true });
      flush();
      expect(totalValue.get()).toBe(55);
      expect(inStockCount.get()).toBe(3);

      // Modify item property
      items.setIndexProperty(1, 'inStock', true);
      flush();
      expect(totalValue.get()).toBe(75);
      expect(inStockCount.get()).toBe(4);
    });

    // Test custom options
    it('should respect custom options for derived signals', () => {
      const source = new Signal({ count: 0, meta: 'data' });

      // Custom equality that only checks count
      const derived = source.derive(
        obj => ({ doubled: obj.count * 2 }),
        {
          equality: (a, b) => a?.doubled === b?.doubled,
          safety: 'reference',
        },
      );

      const firstResult = derived.get();
      expect(firstResult.doubled).toBe(0);

      const secondResult = derived.get();
      expect(firstResult).toBe(secondResult);
    });

    // Test conditional dependencies
    it('should handle conditional dependencies in computed signals', () => {
      const useA = new Signal(true);
      const a = new Signal(10);
      const b = new Signal(20);

      const result = computed(() => {
        return useA.get() ? a.get() : b.get();
      });

      expect(result.get()).toBe(10);

      // Change unused signal - should still trigger update due to dependency tracking
      b.set(30);
      flush();
      expect(result.get()).toBe(10); // Still using 'a'

      // Switch condition
      useA.set(false);
      flush();
      expect(result.get()).toBe(30); // Now using 'b'

      // Now changes to 'a' should still trigger
      a.set(50);
      flush();
      expect(result.get()).toBe(30); // Still using 'b'
    });

    // Test derive with object transformations
    it('should handle object transformations in derive', () => {
      const user = new Signal({ name: 'Alice', age: 30 });
      const displayName = user.derive(u => `${u.name} (${u.age})`);

      expect(displayName.get()).toBe('Alice (30)');

      user.setProperty('name', 'Bob');
      flush();
      expect(displayName.get()).toBe('Bob (30)');

      user.set({ name: 'Charlie', age: 25 });
      flush();
      expect(displayName.get()).toBe('Charlie (25)');
    });

    // Test computed with mixed signal types
    it('should handle computed with different signal types', () => {
      const quantity = new Signal(5);
      const price = new Signal(10.99);
      const taxRate = new Signal(0.08);
      const shipping = new Signal(5.00);

      const total = computed(() => {
        const subtotal = quantity.get() * price.get();
        const tax = subtotal * taxRate.get();
        return subtotal + tax + shipping.get();
      });

      expect(total.get()).toBeCloseTo(64.346, 2);

      quantity.set(3);
      flush();
      expect(total.get()).toBeCloseTo(40.608, 2);
    });

    /*******************************
           Null / Undefined
    *******************************/

    it('should handle null values without cloning', () => {
      const signal = new Signal(null);
      expect(signal.get()).toBe(null);

      signal.set(null);
      expect(signal.get()).toBe(null);
      expect(signal.peek()).toBe(null);
    });

    it('should transition between null and object values', () => {
      const callback = vi.fn();
      const signal = new Signal(null);
      reaction(() => callback(signal.get()));
      flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.set({ name: 'Alice' });
      flush();
      expect(callback).toHaveBeenCalledTimes(2);

      signal.set(null);
      flush();
      expect(callback).toHaveBeenCalledTimes(3);
      expect(signal.get()).toBe(null);
    });

    /*******************************
         Mutate Dev Warning
    *******************************/

    it('should warn in dev when mutate returns the same reference', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const signal = new Signal([1, 2, 3]);

      signal.mutate(arr => {
        arr.push(4);
        return arr;
      });

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toMatch(/same reference/);
      warnSpy.mockRestore();
    });

    it('should not warn when mutate returns a new value', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const signal = new Signal([1, 2, 3]);

      signal.mutate(() => [4, 5, 6]);

      expect(warnSpy).not.toHaveBeenCalled();
      expect(signal.get()).toEqual([4, 5, 6]);
      warnSpy.mockRestore();
    });

    it('derive inside a parent reaction does not accumulate subscribers across re-runs', () => {
      const source = new Signal(1);
      reaction(() => {
        source.derive(v => v * 2);
      });

      for (let i = 1; i <= 5; i++) {
        source.set(i);
        flush();
      }

      // 1 subscriber: the parent reaction. Each derive() inside spawns an
      // internal reaction scoped to the parent's lifetime, not a long-lived
      // independent observer.
      expect(source.dependency.subscribers.size).toBe(1);
    });

    it('parent.stop() cascades to the derived internal reaction when derive is called inside a parent', () => {
      const source = new Signal(1);
      const outer = reaction(() => {
        source.derive(v => v * 2);
      });

      // parent registered itself + spawned a derive reaction subscribing to source
      expect(source.dependency.subscribers.size).toBe(1);

      outer.stop();
      // both the parent's direct dep and the derive's internal reaction are gone
      expect(source.dependency.subscribers.size).toBe(0);
    });

    it('Signal.computed inside a parent reaction does not accumulate subscribers across re-runs', () => {
      const a = new Signal(1);
      const b = new Signal(10);
      reaction(() => {
        computed(() => a.get() + b.get());
      });

      for (let i = 1; i <= 5; i++) {
        a.set(i);
        flush();
      }

      expect(a.dependency.subscribers.size).toBe(1);
      expect(b.dependency.subscribers.size).toBe(1);
    });
  });
});

describe('Signal API', () => {
  /***********************************************
   * Constructor and options
   ***********************************************/

  describe('Constructor', () => {
    it('exposes the initial value via get(), value, and peek() on first access', () => {
      const counter = new Signal(7);
      expect(counter.get()).toBe(7);
      expect(counter.value).toBe(7);
      expect(counter.peek()).toBe(7);
    });

    it('accepts undefined as an initial value', () => {
      const blank = new Signal(undefined);
      expect(blank.get()).toBe(undefined);
      expect(blank.peek()).toBe(undefined);
    });

    it('accepts null as an initial value without crashing or cloning', () => {
      const empty = new Signal(null);
      expect(empty.get()).toBe(null);
    });

    it('does not clone object initial values by default (reference safety shares the reference)', () => {
      const original = { count: 0 };
      const signal = new Signal(original);
      original.count = 99;
      // Reference safety is the default — the signal shares the reference,
      // so later mutation of the source is visible through it.
      expect(signal.peek().count).toBe(99);
    });

    it('clones object initial values under clone safety so external mutations do not leak in', () => {
      const original = { count: 0 };
      const signal = new Signal(original, { safety: 'clone' });
      original.count = 99;
      // Clone safety insulates internal state from later source mutation
      expect(signal.peek().count).toBe(0);
    });

    it('permits mutations through peek when using no safety', () => {
      const original = { count: 0 };
      const signal = new Signal(original, { safety: 'reference' });
      original.count = 99;
      expect(signal.peek().count).toBe(99);
    });

    it('uses a custom equality function to decide whether set() re-fires subscribers', () => {
      // only the id field counts as a change
      const callback = vi.fn();
      const user = new Signal(
        { id: 1, name: 'Alice', lastLogin: '2023-01-01' },
        { equality: (oldUser, newUser) => oldUser.id === newUser.id },
      );
      reaction(() => callback(user.get()));
      flush();
      expect(callback).toHaveBeenCalledTimes(1);

      // Different id — change
      user.set({ id: 2, name: 'Bob', lastLogin: '2023-01-02' });
      flush();
      expect(callback).toHaveBeenCalledTimes(2);

      // Same id — no fire even though name changed
      user.set({ id: 2, name: 'Robert', lastLogin: '2023-01-03' });
      flush();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('uses a custom clone function when provided under clone safety', () => {
      const cloneSpy = vi.fn(value => ({ ...value, cloned: true }));
      const signal = new Signal({ name: 'Alice' }, { safety: 'clone', clone: cloneSpy });
      expect(cloneSpy).toHaveBeenCalled();
      expect(signal.peek().cloned).toBe(true);
    });

    it('default id prefers id over _id', () => {
      const signal = new Signal([]);
      expect(signal.getId({ _id: 'mongo', id: 'app' })).toBe('app');
    });

    it('uses a per-instance id override for getId', () => {
      const signal = new Signal([], { id: item => item.slug });
      expect(signal.getId({ slug: 'x', id: 'y' })).toBe('x');
    });

    it('falls back to the static Signal.id when no override is given', () => {
      const original = Signal.id;
      Signal.id = item => item.slug;
      try {
        expect(new Signal([]).getId({ slug: 'x', id: 'y' })).toBe('x');
      }
      finally {
        Signal.id = original;
      }
    });
  });

  /***********************************************
   * get() / value getter
   ***********************************************/

  describe('get() and value', () => {
    it('reading inside a Reaction creates a dependency so changes re-run the reaction', () => {
      const counter = new Signal(0);
      const cb = vi.fn(() => counter.get());
      reaction(cb);
      expect(cb).toHaveBeenCalledTimes(1);

      counter.set(1);
      flush();
      expect(cb).toHaveBeenCalledTimes(2);
    });

    it('value getter is an alias for get() — both produce the same value', () => {
      const counter = new Signal(42);
      expect(counter.value).toBe(counter.get());
    });

    it('value setter is an alias for set() — both apply equality-checked updates', () => {
      const counter = new Signal(0);
      counter.value = 5;
      expect(counter.get()).toBe(5);
    });
  });

  /***********************************************
   * set() — equality-checked write
   ***********************************************/

  describe('set()', () => {
    it('writes a new primitive value and triggers subscribers', () => {
      const callback = vi.fn();
      const counter = new Signal(0);
      reaction(() => callback(counter.get()));
      flush();
      expect(callback).toHaveBeenCalledTimes(1);

      counter.set(1);
      flush();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('skips re-firing subscribers when the new value is equal under default deep equality', () => {
      const callback = vi.fn();
      const signal = new Signal({ a: 1, b: 2 });
      reaction(() => callback(signal.get()));
      flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.set({ a: 1, b: 2 });
      flush();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('treats NaN as equal to NaN (Object.is-style) under default deep equality', () => {
      const callback = vi.fn();
      const signal = new Signal(NaN);
      reaction(() => callback(signal.get()));
      flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.set(NaN);
      flush();
      // Documented contract: set with equal value does not re-fire.
      // For NaN, the framework's deep equality must recognise NaN === NaN
      // or the signal will spuriously re-fire whenever NaN is re-written.
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  /***********************************************
   * peek() — non-reactive read
   ***********************************************/

  describe('peek()', () => {
    it('reading inside a Reaction does NOT create a dependency', () => {
      const counter = new Signal(0);
      const multiplier = new Signal(2);
      const cb = vi.fn(() => {
        counter.get();
        multiplier.peek();
      });
      reaction(cb);
      expect(cb).toHaveBeenCalledTimes(1);

      // Changing the peeked signal must NOT re-fire the reaction
      multiplier.set(10);
      flush();
      expect(cb).toHaveBeenCalledTimes(1);

      // But changing the dep'd signal still does
      counter.set(5);
      flush();
      expect(cb).toHaveBeenCalledTimes(2);
    });

    it('clones object values just like get() under clone safety, insulating callers from mutation', () => {
      const signal = new Signal({ level: 1 }, { safety: 'clone' });
      const snapshot = signal.peek();
      snapshot.level = 99;
      expect(signal.peek().level).toBe(1);
    });
  });

  /***********************************************
   * clone() — tracked detached copy
   ***********************************************/

  describe('clone()', () => {
    it('returns a detached copy under reference safety, so mutating it leaves the source intact', () => {
      // reference safety (the default) hands back the live array from get(),
      // so an in-place sort would corrupt it — clone() is the safe alternative
      const signal = new Signal([3, 1, 2]);
      const copy = signal.clone();
      copy.sort();
      expect(copy).toEqual([1, 2, 3]);
      expect(signal.get()).toEqual([3, 1, 2]);
    });

    it('reading inside a Reaction creates a dependency so changes re-run the reaction', () => {
      const items = new Signal([1, 2]);
      const cb = vi.fn(() => items.clone());
      reaction(cb);
      expect(cb).toHaveBeenCalledTimes(1);

      items.push(3);
      flush();
      expect(cb).toHaveBeenCalledTimes(2);
    });

    it('uses the per-instance clone override even when safety is not clone', () => {
      const cloneSpy = vi.fn(value => ({ ...value, cloned: true }));
      const signal = new Signal({ name: 'Alice' }, { clone: cloneSpy });
      expect(signal.clone().cloned).toBe(true);
    });
  });

  /***********************************************
   * version — change counter for debug + sync
   ***********************************************/

  describe('version', () => {
    it('starts at 0 and increments on each announced change', () => {
      const signal = new Signal('a');
      expect(signal.version).toBe(0);
      signal.set('b');
      expect(signal.version).toBe(1);
      signal.set('c');
      expect(signal.version).toBe(2);
    });

    it('does not increment when a set is a no-op under equality', () => {
      const signal = new Signal('a');
      signal.set('a');
      expect(signal.version).toBe(0);
    });

    it('advances with no subscribers — its readers live outside the reactive graph', () => {
      const signal = new Signal(0);
      expect(signal.hasDependents()).toBe(false);
      signal.set(1);
      expect(signal.version).toBe(1);
    });

    it('seeds from the version option for external-store alignment', () => {
      const signal = new Signal({ rows: [] }, { version: 42 });
      expect(signal.version).toBe(42);
      signal.set({ rows: [1] });
      expect(signal.version).toBe(43);
    });

    it('is writable so it can be realigned to an external revision', () => {
      const signal = new Signal('a');
      signal.version = 100;
      signal.set('b');
      expect(signal.version).toBe(101);
    });

    it('reading version does not subscribe the running reaction', () => {
      const source = new Signal(0);
      const cb = vi.fn(() => source.version);
      reaction(cb);
      expect(cb).toHaveBeenCalledTimes(1);

      source.set(1);
      flush();
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it('a force notify() advances version even without a value change', () => {
      const signal = new Signal('a');
      signal.notify();
      expect(signal.version).toBe(1);
    });
  });

  /***********************************************
   * notify() — force-fire bypassing equality
   ***********************************************/

  describe('notify()', () => {
    it('force-triggers subscribers even when the value reference is identical', () => {
      // mutate the underlying object via peek(), then notify() so subscribers re-run.
      const callback = vi.fn();
      const data = new Signal({ count: 0 });
      reaction(() => callback(data.get().count));
      flush();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenLastCalledWith(0);

      data.raw().count = 5;
      data.notify();
      flush();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith(5);
    });

    it('does not change the stored value', () => {
      const signal = new Signal('stable');
      signal.notify();
      expect(signal.peek()).toBe('stable');
    });
  });

  /***********************************************
   * depend() — register dependency without reading
   ***********************************************/

  describe('depend()', () => {
    it('registers a dependency in the current reaction so changes re-fire it', () => {
      const theme = new Signal({ mode: 'dark' });
      const callback = vi.fn();
      reaction(() => {
        theme.depend();
        callback();
      });
      expect(callback).toHaveBeenCalledTimes(1);

      theme.set({ mode: 'light' });
      flush();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('outside a reactive context, calling depend() is a no-op (does not throw, no subscribers)', () => {
      const signal = new Signal('any');
      expect(() => signal.depend()).not.toThrow();
      expect(signal.hasDependents()).toBe(false);
    });
  });

  /***********************************************
   * hasDependents() — boolean introspection
   ***********************************************/

  describe('hasDependents()', () => {
    it('returns false before any reaction subscribes', () => {
      const signal = new Signal(0);
      expect(signal.hasDependents()).toBe(false);
    });

    it('returns true while a reaction depends on the signal, false after it stops', () => {
      const signal = new Signal(0);
      const r = reaction(() => signal.get());
      expect(signal.hasDependents()).toBe(true);
      r.stop();
      expect(signal.hasDependents()).toBe(false);
    });

    it('returns false after the only subscribing reaction is stopped, even after notify()', () => {
      const signal = new Signal(0);
      const r = reaction(() => signal.get());
      r.stop();
      signal.notify();
      flush();
      expect(signal.hasDependents()).toBe(false);
    });
  });

  /***********************************************
   * stop() tears down a derived signal's producer
   ***********************************************/

  describe('stop()', () => {
    it('halts recomputation of a computed signal, freezing its last value', () => {
      const a = new Signal(1);
      const doubled = computed(() => a.get() * 2);
      expect(doubled.get()).toBe(2);

      doubled.stop();
      a.set(5);
      flush();
      expect(doubled.get()).toBe(2);
    });

    it('halts recomputation of a derive() signal', () => {
      const source = new Signal(2);
      const doubled = source.derive(v => v * 2);
      expect(doubled.get()).toBe(4);

      doubled.stop();
      source.set(10);
      flush();
      expect(doubled.get()).toBe(4);
    });

    it('is a safe no-op on a source signal', () => {
      const source = new Signal(0);
      expect(() => source.stop()).not.toThrow();
      source.set(1);
      expect(source.get()).toBe(1);
    });
  });

  /***********************************************
   * derive() — single-source transformation
   ***********************************************/

  describe('derive()', () => {
    it('returns a Signal whose value is the transformed source value', () => {
      const numbers = new Signal([1, 2, 3, 4, 5]);
      const count = numbers.derive(arr => arr.length);
      expect(count).toBeInstanceOf(Signal);
      expect(count.get()).toBe(5);
    });

    it('updates the derived signal automatically when the source changes', () => {
      const numbers = new Signal([1, 2, 3]);
      const count = numbers.derive(arr => arr.length);
      numbers.push(4);
      flush();
      expect(count.get()).toBe(4);
    });

    it('chained derive() pipelines refresh through every link when the source moves', () => {
      const base = new Signal(2);
      const doubled = base.derive(v => v * 2);
      const quadrupled = doubled.derive(v => v * 2);
      base.set(3);
      flush();
      expect(doubled.get()).toBe(6);
      expect(quadrupled.get()).toBe(12);
    });
  });

  /***********************************************
   * Signal.computed — multi-source computation
   ***********************************************/

  describe('computed()', () => {
    it('returns a Signal whose value is the result of the compute function', () => {
      const firstName = new Signal('John');
      const lastName = new Signal('Doe');
      const fullName = computed(() => `${firstName.get()} ${lastName.get()}`);
      expect(fullName).toBeInstanceOf(Signal);
      expect(fullName.get()).toBe('John Doe');
    });

    it('updates when ANY tracked dependency changes', () => {
      const a = new Signal(1);
      const b = new Signal(2);
      const sum = computed(() => a.get() + b.get());
      expect(sum.get()).toBe(3);

      a.set(10);
      flush();
      expect(sum.get()).toBe(12);

      b.set(20);
      flush();
      expect(sum.get()).toBe(30);
    });

    it('a reaction observing the computed re-runs when an upstream dependency changes', () => {
      const a = new Signal(1);
      const b = new Signal(2);
      const sum = computed(() => a.get() + b.get());
      const observed = vi.fn();
      reaction(() => observed(sum.get()));
      expect(observed).toHaveBeenCalledTimes(1);

      a.set(10);
      flush();
      expect(observed).toHaveBeenCalledTimes(2);
      expect(observed).toHaveBeenLastCalledWith(12);
    });
  });

  /***********************************************
   * Static defaults, global escape hatch
   ***********************************************/

  describe('static defaults', () => {
    it('falls back to Signal.equality when no per-instance equality is provided', () => {
      const original = Signal.equality;
      const customEq = vi.fn(() => true);
      Signal.equality = customEq;
      try {
        const sig = new Signal({ a: 1 });
        // any set() should consult customEq and short-circuit (returns true)
        sig.set({ a: 2 });
        expect(customEq).toHaveBeenCalled();
        expect(sig.peek()).toEqual({ a: 1 });
      }
      finally {
        Signal.equality = original;
      }
    });

    it('snapshots Signal.equality at construction so later static changes do not affect existing signals', () => {
      // The renderer's reactive-context.js relies on this contract.
      const original = Signal.equality;
      const customEq = (a, b) => a?.id === b?.id;
      Signal.equality = customEq;
      const sig = new Signal({ id: 1, label: 'one' });
      Signal.equality = original; // restore mid-test

      // sig still uses customEq via its own this.equality
      sig.set({ id: 1, label: 'two' });
      expect(sig.peek().label).toBe('one');
    });

    it('falls back to Signal.clone under clone safety when no per-instance clone is provided', () => {
      const original = Signal.clone;
      const customClone = vi.fn(value => ({ ...value, viaStatic: true }));
      Signal.clone = customClone;
      try {
        const sig = new Signal({ name: 'x' }, { safety: 'clone' });
        expect(customClone).toHaveBeenCalled();
        expect(sig.peek().viaStatic).toBe(true);
      }
      finally {
        Signal.clone = original;
      }
    });
  });

  /***********************************************
   * instanceof and identity
   ***********************************************/

  describe('instanceof Signal', () => {
    it('matches signals created with new Signal()', () => {
      expect(new Signal(0) instanceof Signal).toBe(true);
    });

    it('matches derived signals returned by derive()', () => {
      const source = new Signal(1);
      expect(source.derive(v => v + 1) instanceof Signal).toBe(true);
    });

    it('matches computed signals returned by Signal.computed', () => {
      expect(computed(() => 1) instanceof Signal).toBe(true);
    });

    it('does not match plain objects or primitives', () => {
      expect({} instanceof Signal).toBe(false);
      expect(null instanceof Signal).toBe(false);
      expect(undefined instanceof Signal).toBe(false);
      expect(42 instanceof Signal).toBe(false);
    });

    it('matches objects created via Object.create(Signal.prototype)', () => {
      const fake = Object.create(Signal.prototype);
      expect(fake instanceof Signal).toBe(true);
    });
  });
});
