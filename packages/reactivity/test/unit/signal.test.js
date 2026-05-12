import { Reaction, Signal } from '@semantic-ui/reactivity';
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
      const signal = new Signal('initial', { equalityFunction: isEqual });
      signal.value = 'initial';
      signal.subscribe(callback);

      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.value = 'initial';
      Reaction.flush();

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
      signal.subscribe(callback);

      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.value = b;
      Reaction.flush();
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
      signal.subscribe(callback);

      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.value = b;
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  /*******************************
            Reactivity
  *******************************/

  describe.concurrent('Reactivity', () => {
    it('should notify subscribers on value change', async () => {
      const callback = vi.fn();

      const expectReaction = expect.objectContaining({
        stop: expect.any(Function),
      });

      const signal = new Signal('initial');
      signal.subscribe(callback);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('initial', expectReaction);

      signal.value = 'updated';
      Reaction.flush();

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('updated', expectReaction);

      signal.set('final');
      Reaction.flush();

      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith('final', expectReaction);
    });

    it('Peek should not trigger reactivity', () => {
      const signal = new Signal('anything');
      const reaction = vi.fn((comp) => {
        signal.peek(); // not reactive dependency
      });
      Reaction.create(reaction);

      signal.set('anything else');
      expect(reaction).toHaveBeenCalledTimes(1);
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
      Reaction.create(computation1);
      Reaction.create(computation2);
      Reaction.flush();
      expect(value3.get()).toEqual(1);
    });
  });

  /*******************************
        Dependency Management
  *******************************/

  describe.concurrent('Dependency Management', () => {
    it('depend should register as dependency without reading value', () => {
      const signal = new Signal('secret');
      const reaction = vi.fn(() => {
        signal.depend();
      });
      Reaction.create(reaction);
      expect(reaction).toHaveBeenCalledTimes(1);

      signal.set('updated');
      Reaction.flush();
      expect(reaction).toHaveBeenCalledTimes(2);
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
      Reaction.create(callback);
      expect(callback).toHaveBeenCalledTimes(1);

      signal.notify();
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(signal.peek()).toBe('stable');
    });

    it('notify should work even when value passes equality check', () => {
      const signal = new Signal(42);
      const callback = vi.fn(() => {
        signal.get();
      });
      Reaction.create(callback);

      signal.set(42); // no change, equality blocks
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.notify(); // force trigger
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('hasDependents should return false with no subscribers', () => {
      const signal = new Signal(0);
      expect(signal.hasDependents()).toBe(false);
    });

    it('hasDependents should return true when inside a reaction', () => {
      const signal = new Signal(0);
      Reaction.create(() => {
        signal.get();
      });
      expect(signal.hasDependents()).toBe(true);
    });

    it('hasDependents should return false after reaction stops', () => {
      const signal = new Signal(0);
      const reaction = Reaction.create(() => {
        signal.get();
      });
      expect(signal.hasDependents()).toBe(true);
      reaction.stop();
      expect(signal.hasDependents()).toBe(false);
    });
  });

  /*******************************
               Array
  *******************************/

  describe.concurrent('Array Utilities', () => {
    it('Push should handle multiple values', () => {
      const reactiveArray = new Signal([1]);
      reactiveArray.push(2, 3, 4);
      expect(reactiveArray.value).toEqual([1, 2, 3, 4]);
    });

    it('Unshift should handle multiple values', () => {
      const reactiveArray = new Signal([4]);
      reactiveArray.unshift(1, 2, 3);
      expect(reactiveArray.value).toEqual([1, 2, 3, 4]);
    });

    it('Splice should remove and insert elements', () => {
      const reactiveArray = new Signal(['a', 'b', 'c', 'd']);
      reactiveArray.splice(1, 1, 'x');
      expect(reactiveArray.value).toEqual(['a', 'x', 'c', 'd']);
    });

    it('Splice should handle multiple inserts', () => {
      const reactiveArray = new Signal(['a', 'b', 'c']);
      reactiveArray.splice(1, 0, 'x', 'y');
      expect(reactiveArray.value).toEqual(['a', 'x', 'y', 'b', 'c']);
    });

    it('Splice should handle deletion without insertion', () => {
      const reactiveArray = new Signal(['a', 'b', 'c']);
      reactiveArray.splice(1, 2);
      expect(reactiveArray.value).toEqual(['a']);
    });

    it('Splice should trigger reactions when modified', () => {
      const callback = vi.fn();
      const reactiveArray = new Signal(['a', 'b', 'c']);

      Reaction.create(() => {
        callback(reactiveArray.get());
      });

      reactiveArray.splice(1, 1, 'x');
      Reaction.flush();

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith(['a', 'x', 'c']);
    });

    it('setIndex should change value at index', () => {
      const reactiveArray = new Signal([1, 2, 3]);
      reactiveArray.setIndex(1, 'two'); // Change value at index 1 to 'two'
      expect(reactiveArray.value).toEqual([1, 'two', 3]);
    });

    it('removeIndex should remove value at index', () => {
      const reactiveArray = new Signal([1, 2, 3]);
      reactiveArray.removeIndex(1); // Remove value at index 1
      expect(reactiveArray.value).toEqual([1, 3]);
    });

    it('setArrayProperty should set an object property at index', () => {
      const reactiveArray = new Signal([{ name: 'Alice' }, { name: 'Bob' }]);
      reactiveArray.setArrayProperty(1, 'name', 'Charlie'); // Change name of the second object
      expect(reactiveArray.value).toEqual([{ name: 'Alice' }, { name: 'Charlie' }]);
    });

    it('setArrayProperty should set all object properties when no index specified', () => {
      const reactiveArray = new Signal([{ name: 'Alice' }, { name: 'Bob' }]);
      reactiveArray.setArrayProperty('status', 'active'); // Set 'status' property for all objects
      expect(reactiveArray.value).toEqual([
        { name: 'Alice', status: 'active' },
        { name: 'Bob', status: 'active' },
      ]);
    });
  });

  describe.concurrent('Transformation Helpers', () => {
    it('map should transform each item in the array', () => {
      const numbers = new Signal([1, 2, 3]);
      numbers.map(num => num * 2);
      expect(numbers.get()).toEqual([2, 4, 6]);
    });

    it('map should trigger reactions', () => {
      const callback = vi.fn();
      const numbers = new Signal([1, 2, 3]);

      Reaction.create(() => {
        callback(numbers.get());
      });

      numbers.map(num => num * 2);
      Reaction.flush();

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith([2, 4, 6]);
    });

    it('filter should remove items based on predicate', () => {
      const numbers = new Signal([1, 2, 3, 4, 5]);
      numbers.filter(num => num % 2 === 1);
      expect(numbers.get()).toEqual([1, 3, 5]);
    });

    it('filter should trigger reactions', () => {
      const callback = vi.fn();
      const numbers = new Signal([1, 2, 3, 4, 5]);

      Reaction.create(() => {
        callback(numbers.get());
      });

      numbers.filter(num => num > 3);
      Reaction.flush();

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith([4, 5]);
    });

    it('filter should handle complex objects', () => {
      const items = new Signal([
        { id: 1, active: true },
        { id: 2, active: false },
        { id: 3, active: true },
      ]);

      items.filter(item => item.active);
      expect(items.get()).toEqual([
        { id: 1, active: true },
        { id: 3, active: true },
      ]);
    });

    it('map should handle complex transformations', () => {
      const items = new Signal([
        { id: 1, value: 10 },
        { id: 2, value: 20 },
      ]);

      items.map(item => ({
        ...item,
        doubled: item.value * 2,
      }));

      expect(items.get()).toEqual([
        { id: 1, value: 10, doubled: 20 },
        { id: 2, value: 20, doubled: 40 },
      ]);
    });
  });

  describe.concurrent('Boolean Helpers', () => {
    it('toggle should toggle a boolean', () => {
      const reactiveBool = new Signal(true);
      reactiveBool.toggle();
      expect(reactiveBool.value).toBe(false);
      reactiveBool.toggle();
      expect(reactiveBool.value).toBe(true);
    });
  });

  describe.concurrent('Mutation Utilities', () => {
    it('map should apply a transformation to each item', () => {
      const numbers = new Signal([1, 2, 3]);
      numbers.map(num => num * 2);
      expect(numbers.get()).toEqual([2, 4, 6]);
    });

    it('filter should remove items based on a filter', () => {
      const numbers = new Signal([1, 2, 3, 4, 5]);
      numbers.filter(num => num % 2 === 1); // Remove even numbers
      expect(numbers.get()).toEqual([1, 3, 5]);
    });
  });

  describe.concurrent('ID Utilities', () => {
    it('getID should get id from an item', () => {
      const id1 = 'one';
      const id2 = { _id: 'one' };
      const id3 = { id: 'one' };
      const id4 = { hash: 'one' };
      const id5 = { key: 'one' };

      const signal = new Signal();
      expect(signal.getID(id1)).toBe('one');
      expect(signal.getID(id2)).toBe('one');
      expect(signal.getID(id3)).toBe('one');
      expect(signal.getID(id4)).toBe('one');
      expect(signal.getID(id5)).toBe('one');
    });

    it('getIDs should get all ids from an item', () => {
      const item = { _id: 'one', id: 'one', key: 'two' };
      const signal = new Signal();
      const ids = signal.getIDs(item);
      expect(ids).toContain('one');
      expect(ids).toContain('two');
      expect(ids.length).toEqual(2);
    });

    it('hasID should match an item ID', () => {
      const item = { _id: 'one' };
      const signal = new Signal();
      expect(signal.hasID(item, 'one')).toEqual(true);
    });
  });

  describe.concurrent('ID Helpers', () => {
    // need separate copy for each test
    const arrayItems = () => [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    it('setProperty should set the property of the item matching an id', () => {
      const items = new Signal(arrayItems());
      items.setProperty(1, 'name', 'Updated Item 1');
      expect(items.get()).toEqual([
        { id: 1, name: 'Updated Item 1' },
        { id: 2, name: 'Item 2' },
      ]);
    });

    it('getItemIndex should get the item index with matching id', () => {
      const items = new Signal(arrayItems());
      const index = items.getItemIndex(2);
      expect(index).toBe(1);
    });

    it('getItem should get the item with matching id', () => {
      const items = new Signal(arrayItems());
      const item = items.getItem(2);
      expect(item).toEqual({ id: 2, name: 'Item 2' });
    });

    it('replaceItem should replace an item matching an ID', () => {
      const items = new Signal(arrayItems());
      items.replaceItem(1, { id: 1, name: 'Replaced Item 1' });
      expect(items.get()).toEqual([
        { id: 1, name: 'Replaced Item 1' },
        { id: 2, name: 'Item 2' },
      ]);
    });

    it('removeItem should remove an item matching an ID', () => {
      const items = new Signal(arrayItems());
      items.removeItem(1);
      expect(items.get()).toEqual([
        { id: 2, name: 'Item 2' },
      ]);
    });

    it('setProperty should set the property of the item matching a given id', () => {
      const items = new Signal(arrayItems());
      items.setProperty(2, 'status', 'active');
      expect(items.get()).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2', status: 'active' },
      ]);
    });

    it('setArrayProperty should set an object property at index', () => {
      const items = new Signal(arrayItems());
      items.setArrayProperty(1, 'status', 'pending');
      expect(items.get()[1].status).toBe('pending');
    });

    it('setArrayProperty should set all object properties when no index specified', () => {
      const items = new Signal(arrayItems());
      items.setArrayProperty('status', 'active');
      expect(items.get()).toEqual([
        { id: 1, name: 'Item 1', status: 'active' },
        { id: 2, name: 'Item 2', status: 'active' },
      ]);
    });
  });

  describe.concurrent('Cloning Behavior with Signals', () => {
    it('should maintain reactivity when using a Signal inside another Signal', () => {
      const innerCallback = vi.fn();
      const innerVar = new Signal(1, { allowClone: true });

      const outerCallback = vi.fn();
      const outerVar = new Signal(innerVar);

      outerVar.subscribe(outerCallback);
      Reaction.flush();
      expect(outerCallback).toHaveBeenCalledTimes(1);

      innerVar.subscribe(innerCallback);
      innerVar.set(2);
      Reaction.flush();

      expect(innerCallback).toHaveBeenCalledTimes(2);
    });

    it('should not retrigger reactivity on array when updating objects', () => {
      const outerCallback = vi.fn();

      const innerCallback1 = vi.fn();
      const innerCallback2 = vi.fn();

      const data1 = { id: 1, text: 'test object' };
      const data2 = { id: 2, text: 'test object 2' };

      const innerVar1 = new Signal(data1, { allowClone: true });
      const innerVar2 = new Signal(data2, { allowClone: true });

      innerVar1.subscribe(innerCallback1);
      innerVar2.subscribe(innerCallback2);

      const outerVar = new Signal([]);
      outerVar.subscribe(outerCallback);

      Reaction.flush();
      expect(outerCallback).toHaveBeenCalledTimes(1);

      outerVar.push(innerVar1);
      Reaction.flush();
      expect(outerCallback).toHaveBeenCalledTimes(2);

      outerVar.push(innerVar2);
      Reaction.flush();
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
      Reaction.flush();
      expect(doubled.get()).toBe(30);
    });

    it('should create a computed signal from multiple sources', () => {
      const a = new Signal(1);
      const b = new Signal(2);
      const sum = Signal.computed(() => a.get() + b.get());

      expect(sum.get()).toBe(3);

      a.set(5);
      Reaction.flush();
      expect(sum.get()).toBe(7);

      b.set(10);
      Reaction.flush();
      expect(sum.get()).toBe(15);
    });

    // Test proper reactivity propagation
    it('should update derived when source changes', () => {
      const items = new Signal([1, 2, 3]);
      const count = items.derive(arr => arr.length);

      expect(count.get()).toBe(3);

      items.push(4);
      Reaction.flush();
      expect(count.get()).toBe(4);

      items.splice(0, 2);
      Reaction.flush();
      expect(count.get()).toBe(2);
    });

    it('should update computed when ANY dependency changes', () => {
      const a = new Signal(1);
      const b = new Signal(2);
      const c = new Signal(3);
      const sum = Signal.computed(() => a.get() + b.get() + c.get());

      expect(sum.get()).toBe(6);

      // Change first dependency
      a.set(10);
      Reaction.flush();
      expect(sum.get()).toBe(15);

      // Change second dependency
      b.set(20);
      Reaction.flush();
      expect(sum.get()).toBe(33);

      // Change third dependency
      c.set(30);
      Reaction.flush();
      expect(sum.get()).toBe(60);
    });

    // Test reactions depending on derived/computed
    it('should trigger reactions when underlying signals change', () => {
      const base = new Signal(10);
      const doubled = base.derive(val => val * 2);

      let reactionCount = 0;
      let lastValue = null;

      Reaction.create(() => {
        lastValue = doubled.get();
        reactionCount++;
      });

      Reaction.flush();
      expect(reactionCount).toBe(1);
      expect(lastValue).toBe(20);

      // Changing base signal should trigger reaction on derived
      base.set(15);
      Reaction.flush();
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
      Reaction.flush();

      // Derived value changes
      expect(derived.get()).toBe(100);
      // Base signal remains unchanged
      expect(base.get()).toBe(10);

      // Next base change will recalculate derived
      base.set(5);
      Reaction.flush();
      expect(derived.get()).toBe(10); // Back to calculated value
    });

    // Test no over-reactivity
    it('should not trigger updates when computed value does not change', () => {
      const a = new Signal(10);
      const b = new Signal(20);
      const isPositive = Signal.computed(() => a.get() > 0);

      let updateCount = 0;
      isPositive.subscribe(() => updateCount++);

      Reaction.flush();
      expect(updateCount).toBe(1);
      expect(isPositive.get()).toBe(true);

      // Change that doesn't affect result
      a.set(5); // Still positive
      Reaction.flush();
      expect(updateCount).toBe(1); // No update, value still true

      // Change that affects result
      a.set(-5);
      Reaction.flush();
      expect(updateCount).toBe(2); // Update triggered
      expect(isPositive.get()).toBe(false);
    });

    // Test chains of derived/computed
    it('should handle chains of derived and computed signals', () => {
      const base = new Signal(2);
      const doubled = base.derive(val => val * 2);
      const quadrupled = doubled.derive(val => val * 2);
      const final = Signal.computed(() => quadrupled.get() + 1);

      expect(final.get()).toBe(9); // 2 * 2 * 2 + 1

      base.set(3);
      Reaction.flush();
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
      Reaction.flush();
      expect(totalValue.get()).toBe(55);
      expect(inStockCount.get()).toBe(3);

      // Modify item property
      items.setArrayProperty(1, 'inStock', true);
      Reaction.flush();
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
          equalityFunction: (a, b) => a?.doubled === b?.doubled,
          allowClone: false,
        },
      );

      const firstResult = derived.get();
      expect(firstResult.doubled).toBe(0);

      // Verify no cloning
      const secondResult = derived.get();
      expect(firstResult).toBe(secondResult); // Same reference
    });

    // Test conditional dependencies
    it('should handle conditional dependencies in computed signals', () => {
      const useA = new Signal(true);
      const a = new Signal(10);
      const b = new Signal(20);

      const result = Signal.computed(() => {
        return useA.get() ? a.get() : b.get();
      });

      expect(result.get()).toBe(10);

      // Change unused signal - should still trigger update due to dependency tracking
      b.set(30);
      Reaction.flush();
      expect(result.get()).toBe(10); // Still using 'a'

      // Switch condition
      useA.set(false);
      Reaction.flush();
      expect(result.get()).toBe(30); // Now using 'b'

      // Now changes to 'a' should still trigger
      a.set(50);
      Reaction.flush();
      expect(result.get()).toBe(30); // Still using 'b'
    });

    // Test derive with object transformations
    it('should handle object transformations in derive', () => {
      const user = new Signal({ name: 'Alice', age: 30 });
      const displayName = user.derive(u => `${u.name} (${u.age})`);

      expect(displayName.get()).toBe('Alice (30)');

      user.setProperty('name', 'Bob');
      Reaction.flush();
      expect(displayName.get()).toBe('Bob (30)');

      user.set({ name: 'Charlie', age: 25 });
      Reaction.flush();
      expect(displayName.get()).toBe('Charlie (25)');
    });

    // Test computed with mixed signal types
    it('should handle computed with different signal types', () => {
      const quantity = new Signal(5);
      const price = new Signal(10.99);
      const taxRate = new Signal(0.08);
      const shipping = new Signal(5.00);

      const total = Signal.computed(() => {
        const subtotal = quantity.get() * price.get();
        const tax = subtotal * taxRate.get();
        return subtotal + tax + shipping.get();
      });

      expect(total.get()).toBeCloseTo(64.346, 2);

      quantity.set(3);
      Reaction.flush();
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
      signal.subscribe(callback);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.set({ name: 'Alice' });
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(2);

      signal.set(null);
      Reaction.flush();
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

    // Test WeakRef cleanup behavior
    it('should handle WeakRef cleanup gracefully', () => {
      let source = new Signal(10);
      const derived = source.derive(val => val * 2);

      expect(derived.get()).toBe(20);

      // Reaction should be active
      expect(derived._derivedReaction.active).toBe(true);

      // Simulate source being garbage collected
      source = null;

      // Force garbage collection if available (Node.js only)
      if (global.gc) {
        global.gc();
      }

      // The reaction should still be active but will auto-cleanup on next run
      // This is hard to test directly, but we can verify the structure is correct
      expect(derived._derivedReaction).toBeDefined();
    });
  });

  /*******************************
      Symbol.hasInstance (instanceof)
  *******************************/

  describe.concurrent('instanceof Signal', () => {
    it('should return true for Signal instances', () => {
      expect(new Signal(0) instanceof Signal).toBe(true);
    });

    it('should return false for non-Signal objects', () => {
      expect({} instanceof Signal).toBe(false);
      expect(null instanceof Signal).toBe(false);
    });

    it('should return true for objects created via Object.create(Signal.prototype)', () => {
      const fake = Object.create(Signal.prototype);
      expect(fake instanceof Signal).toBe(true);
    });
  });
});

describe('Signal API — grounded coverage', () => {
  /***********************************************
   * Constructor and options
   * Source: api(Signal, Constructor), example(reactive-equality, reactive-clone)
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

    it('clones object initial values by default so external mutations do not leak in', () => {
      const original = { count: 0 };
      const signal = new Signal(original);
      original.count = 99;
      // Internal state should be insulated from later mutation of the source
      expect(signal.peek().count).toBe(0);
    });

    it('does NOT clone when allowClone is false — external mutation reflects through peek()', () => {
      const original = { count: 0 };
      const signal = new Signal(original, { allowClone: false });
      original.count = 99;
      expect(signal.peek().count).toBe(99);
    });

    it('uses a custom equality function to decide whether set() re-fires subscribers', () => {
      // From example(reactive-equality): only the id field counts as a change
      const callback = vi.fn();
      const user = new Signal(
        { id: 1, name: 'Alice', lastLogin: '2023-01-01' },
        { equalityFunction: (oldUser, newUser) => oldUser.id === newUser.id },
      );
      user.subscribe(callback);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      // Different id — change
      user.set({ id: 2, name: 'Bob', lastLogin: '2023-01-02' });
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(2);

      // Same id — no fire even though name changed
      user.set({ id: 2, name: 'Robert', lastLogin: '2023-01-03' });
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('uses a custom clone function when provided', () => {
      const cloneSpy = vi.fn(value => ({ ...value, cloned: true }));
      const signal = new Signal({ name: 'Alice' }, { cloneFunction: cloneSpy });
      expect(cloneSpy).toHaveBeenCalled();
      expect(signal.peek().cloned).toBe(true);
    });
  });

  /***********************************************
   * get() / value getter — reactive read with cloning
   * Source: api(Get), source(signal.js#get)
   ***********************************************/

  describe('get() and value', () => {
    it('reading inside a Reaction creates a dependency so changes re-run the reaction', () => {
      const counter = new Signal(0);
      const cb = vi.fn(() => counter.get());
      Reaction.create(cb);
      expect(cb).toHaveBeenCalledTimes(1);

      counter.set(1);
      Reaction.flush();
      expect(cb).toHaveBeenCalledTimes(2);
    });

    it('returns a cloned object each call so callers cannot poison internal state by mutating the result', () => {
      const signal = new Signal({ inner: 'untouched' });
      const a = signal.get();
      a.inner = 'mutated';
      // Second get returns a fresh clone — first mutation did not stick
      expect(signal.get().inner).toBe('untouched');
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
   * Source: api(Set), source(signal.js#set)
   ***********************************************/

  describe('set()', () => {
    it('writes a new primitive value and triggers subscribers', () => {
      const callback = vi.fn();
      const counter = new Signal(0);
      counter.subscribe(callback);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      counter.set(1);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('skips re-firing subscribers when the new value is equal under default deep equality', () => {
      const callback = vi.fn();
      const signal = new Signal({ a: 1, b: 2 });
      signal.subscribe(callback);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.set({ a: 1, b: 2 });
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('treats NaN as equal to NaN (Object.is-style) under default deep equality', () => {
      const callback = vi.fn();
      const signal = new Signal(NaN);
      signal.subscribe(callback);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.set(NaN);
      Reaction.flush();
      // Documented contract: set with equal value does not re-fire.
      // For NaN, the framework's deep equality must recognise NaN === NaN
      // or the signal will spuriously re-fire whenever NaN is re-written.
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  /***********************************************
   * peek() — non-reactive read
   * Source: api(Peek), example(reactive-peek)
   ***********************************************/

  describe('peek()', () => {
    it('reading inside a Reaction does NOT create a dependency', () => {
      const counter = new Signal(0);
      const multiplier = new Signal(2);
      const cb = vi.fn(() => {
        counter.get();
        multiplier.peek();
      });
      Reaction.create(cb);
      expect(cb).toHaveBeenCalledTimes(1);

      // Changing the peeked signal must NOT re-fire the reaction
      multiplier.set(10);
      Reaction.flush();
      expect(cb).toHaveBeenCalledTimes(1);

      // But changing the dep'd signal still does
      counter.set(5);
      Reaction.flush();
      expect(cb).toHaveBeenCalledTimes(2);
    });

    it('clones object values just like get(), insulating callers from mutation', () => {
      const signal = new Signal({ level: 1 });
      const snapshot = signal.peek();
      snapshot.level = 99;
      expect(signal.peek().level).toBe(1);
    });
  });

  /***********************************************
   * subscribe() — callback observer that fires once synchronously + on changes
   * Source: api(Subscribe), example(reactive-subscribe)
   ***********************************************/

  describe('subscribe()', () => {
    it('runs the callback immediately on first subscribe so observers see the current value', () => {
      const callback = vi.fn();
      const signal = new Signal('hi');
      signal.subscribe(callback);
      // First-run happens synchronously inside Reaction.create
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback.mock.calls[0][0]).toBe('hi');
    });

    it('passes the new value and a reaction handle to the callback on every fire', () => {
      const callback = vi.fn();
      const signal = new Signal('first');
      signal.subscribe(callback);
      Reaction.flush();

      signal.set('second');
      Reaction.flush();

      const lastCall = callback.mock.calls.at(-1);
      expect(lastCall[0]).toBe('second');
      expect(lastCall[1]).toHaveProperty('stop');
      expect(typeof lastCall[1].stop).toBe('function');
    });

    it('returns a handle whose stop() prevents further fires', () => {
      const callback = vi.fn();
      const signal = new Signal(0);
      const handle = signal.subscribe(callback);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      handle.stop();
      signal.set(1);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  /***********************************************
   * clear() — set to undefined
   * Source: api(Clear), example(reactive-clear)
   ***********************************************/

  describe('clear()', () => {
    it('sets the value to undefined', () => {
      const signal = new Signal('something');
      signal.clear();
      expect(signal.get()).toBeUndefined();
    });

    it('triggers subscribers when clearing a non-undefined value', () => {
      const callback = vi.fn();
      const signal = new Signal({ name: 'Alice' });
      signal.subscribe(callback);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.clear();
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback.mock.calls.at(-1)[0]).toBeUndefined();
    });

    it('does NOT re-fire subscribers when clearing an already-undefined signal', () => {
      const callback = vi.fn();
      const signal = new Signal(undefined);
      signal.subscribe(callback);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      signal.clear();
      Reaction.flush();
      // Equality blocks the no-op
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  /***********************************************
   * notify() — force-fire bypassing equality
   * Source: api(Notify), example(reactive-notify)
   ***********************************************/

  describe('notify()', () => {
    it('force-triggers subscribers even when the value reference is identical', () => {
      // From example(reactive-notify): mutate the underlying object via peek(),
      // then notify() so subscribers re-run.
      const callback = vi.fn();
      const data = new Signal({ count: 0 }, { allowClone: false });
      Reaction.create(() => callback(data.get().count));
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenLastCalledWith(0);

      data.peek().count = 5;
      data.notify();
      Reaction.flush();
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
   * Source: api(Depend)
   ***********************************************/

  describe('depend()', () => {
    it('registers a dependency in the current reaction so changes re-fire it', () => {
      const theme = new Signal({ mode: 'dark' });
      const callback = vi.fn();
      Reaction.create(() => {
        theme.depend();
        callback();
      });
      expect(callback).toHaveBeenCalledTimes(1);

      theme.set({ mode: 'light' });
      Reaction.flush();
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
   * Source: api(hasDependents)
   ***********************************************/

  describe('hasDependents()', () => {
    it('returns false before any reaction subscribes', () => {
      const signal = new Signal(0);
      expect(signal.hasDependents()).toBe(false);
    });

    it('returns true while a reaction depends on the signal, false after it stops', () => {
      const signal = new Signal(0);
      const reaction = Reaction.create(() => signal.get());
      expect(signal.hasDependents()).toBe(true);
      reaction.stop();
      expect(signal.hasDependents()).toBe(false);
    });

    it('returns false after the only subscribing reaction is stopped, even after notify()', () => {
      const signal = new Signal(0);
      const reaction = Reaction.create(() => signal.get());
      reaction.stop();
      signal.notify();
      Reaction.flush();
      expect(signal.hasDependents()).toBe(false);
    });
  });

  /***********************************************
   * mutate() — safe in-place mutation
   * Source: api(Mutate), source(signal.js#mutate)
   ***********************************************/

  describe('mutate()', () => {
    let warnSpy;
    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('in-place mutation without returning fires subscribers when the value changed', () => {
      const callback = vi.fn();
      const items = new Signal(['apple', 'banana']);
      items.subscribe(callback);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      items.mutate(arr => {
        arr.push('orange');
      });
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(items.get()).toEqual(['apple', 'banana', 'orange']);
    });

    it('returning a brand-new value from the mutation function sets it as the new value', () => {
      const count = new Signal(5);
      count.mutate(val => val * 2);
      expect(count.get()).toBe(10);
    });

    it('in-place mutation that does not actually change the value does NOT re-fire subscribers', () => {
      const callback = vi.fn();
      const items = new Signal(['a', 'b']);
      items.subscribe(callback);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      // mutate that touches nothing — equality says no-change
      items.mutate(() => {});
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('returning the same reference that was mutated in place warns in dev', () => {
      const signal = new Signal([1, 2, 3]);
      signal.mutate(arr => {
        arr.push(4);
        return arr;
      });
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toMatch(/same reference/);
    });
  });

  /***********************************************
   * Array push / unshift / splice — mutating helpers that bypass equality
   * Source: example(reactive-push, reactive-unshift, reactive-splice)
   ***********************************************/

  describe('push() / unshift() / splice() — array helpers', () => {
    it('push() appends a single item and triggers subscribers', () => {
      const callback = vi.fn();
      const notifications = new Signal([{ text: 'Welcome!', read: false }]);
      notifications.subscribe(callback);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      notifications.push({ text: 'New message', read: false });
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(notifications.get()).toHaveLength(2);
      expect(notifications.get()[1].text).toBe('New message');
    });

    it('push() accepts multiple arguments and appends them in order', () => {
      const items = new Signal([1]);
      items.push(2, 3, 4);
      expect(items.get()).toEqual([1, 2, 3, 4]);
    });

    it('unshift() prepends items so the new value lands at the front', () => {
      const callback = vi.fn();
      const messages = new Signal([{ user: 'system', text: 'started' }]);
      messages.subscribe(callback);
      Reaction.flush();

      messages.unshift({ user: 'Alice', text: 'Hello!' });
      Reaction.flush();
      expect(messages.get()[0].user).toBe('Alice');
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('splice() can insert without removing any items', () => {
      const playlist = new Signal(['t1', 'New', 't3', 't4']);
      playlist.splice(2, 0, 'Bonus 1', 'Bonus 2');
      expect(playlist.get()).toEqual(['t1', 'New', 'Bonus 1', 'Bonus 2', 't3', 't4']);
    });

    it('splice() removing the entire array yields an empty array', () => {
      const items = new Signal(['a', 'b', 'c']);
      items.splice(0, 3);
      expect(items.get()).toEqual([]);
    });
  });

  /***********************************************
   * map() / filter() — in-place transformation helpers
   * Source: example(reactive-map, reactive-filter)
   ***********************************************/

  describe('map() / filter() — transformation helpers', () => {
    it('map() replaces the array in place with the transformed values', () => {
      const prices = new Signal([10, 20, 30, 40]);
      prices.map(price => price * 0.9);
      expect(prices.get()).toEqual([9, 18, 27, 36]);
    });

    it('filter() keeps only items that match the predicate', () => {
      const numbers = new Signal([1, 2, 3, 4, 5, 6]);
      numbers.filter(n => n % 2 === 0);
      expect(numbers.get()).toEqual([2, 4, 6]);
    });

    it('filter() to an empty result yields an empty array (not undefined)', () => {
      const items = new Signal([1, 2, 3]);
      items.filter(() => false);
      expect(items.get()).toEqual([]);
    });

    it('map() and filter() both trigger subscribers on transformation', () => {
      const callback = vi.fn();
      const items = new Signal([1, 2, 3]);
      items.subscribe(callback);
      Reaction.flush();

      items.map(x => x + 1);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(2);

      items.filter(x => x > 2);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(3);
      expect(items.get()).toEqual([3, 4]);
    });
  });

  /***********************************************
   * Index helpers — getIndex / setIndex / removeIndex
   * Source: example(reactive-get-index, reactive-set-index, reactive-remove-index)
   ***********************************************/

  describe('getIndex() / setIndex() / removeIndex()', () => {
    it('getIndex() reads the item at a given position', () => {
      const colors = new Signal(['red', 'green', 'blue']);
      expect(colors.getIndex(0)).toBe('red');
      expect(colors.getIndex(2)).toBe('blue');
    });

    it('getIndex() creates a dependency, so writes via setIndex() re-fire reactions', () => {
      // Source: example(reactive-get-index) — same data shape
      const colors = new Signal(['red', 'green', 'blue', 'yellow']);
      const fn = vi.fn();
      Reaction.create(() => fn(colors.getIndex(0)));
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenLastCalledWith('red');

      colors.setIndex(0, 'purple');
      Reaction.flush();
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenLastCalledWith('purple');
    });

    it('setIndex() replaces the item at the given index', () => {
      const letters = new Signal(['a', 'b', 'c']);
      letters.setIndex(1, 'x');
      expect(letters.get()).toEqual(['a', 'x', 'c']);
    });

    it('removeIndex() drops the item at the given index and shortens the array', () => {
      const tasks = new Signal([
        { text: 'Learn', completed: true },
        { text: 'Write', completed: false },
      ]);
      tasks.removeIndex(0);
      expect(tasks.get()).toEqual([{ text: 'Write', completed: false }]);
    });
  });

  /***********************************************
   * setArrayProperty — single-index or all-items property set
   * Source: example(reactive-set-array-property)
   ***********************************************/

  describe('setArrayProperty()', () => {
    it('with three arguments, sets the property on the object at the given index only', () => {
      const tasks = new Signal([
        { id: 1, title: 'Buy groceries', completed: false },
        { id: 2, title: 'Walk the dog', completed: false },
      ]);
      tasks.setArrayProperty(0, 'completed', true);
      expect(tasks.get()).toEqual([
        { id: 1, title: 'Buy groceries', completed: true },
        { id: 2, title: 'Walk the dog', completed: false },
      ]);
    });

    it('with two arguments, sets the property on every object in the array', () => {
      const tasks = new Signal([
        { id: 1, completed: false },
        { id: 2, completed: false },
        { id: 3, completed: false },
      ]);
      tasks.setArrayProperty('completed', true);
      expect(tasks.get().every(t => t.completed === true)).toBe(true);
    });
  });

  /***********************************************
   * ID-based collection helpers
   * Source: example(reactive-get-item, reactive-replace-item, reactive-remove-item, reactive-set-property)
   ***********************************************/

  describe('ID-based helpers', () => {
    const users = () => [
      { id: 'user1', name: 'Alice', status: 'online' },
      { id: 'user2', name: 'Bob', status: 'offline' },
      { id: 'user3', name: 'Carol', status: 'online' },
    ];

    it('getItem() locates an object by its id field', () => {
      const signal = new Signal(users());
      expect(signal.getItem('user2')).toEqual({ id: 'user2', name: 'Bob', status: 'offline' });
    });

    it('getItem() returns undefined when no item matches the id', () => {
      const signal = new Signal(users());
      expect(signal.getItem('missing')).toBeUndefined();
    });

    it('getItemIndex() returns the index of the matching item, or -1 when not found', () => {
      const signal = new Signal(users());
      expect(signal.getItemIndex('user2')).toBe(1);
      expect(signal.getItemIndex('unknown')).toBe(-1);
    });

    it('replaceItem() swaps the entire object matching the id while leaving others untouched', () => {
      const contacts = new Signal([
        { id: 'alice123', name: 'Alice', email: 'alice@email.com' },
        { id: 'bob456', name: 'Bob', email: 'bob@email.com' },
      ]);
      const updated = { id: 'alice123', name: 'Alice Smith', email: 'asmith@email.com' };
      contacts.replaceItem('alice123', updated);
      expect(contacts.get()[0]).toEqual(updated);
      expect(contacts.get()[1].name).toBe('Bob');
    });

    it('removeItem() removes the matching object and leaves the rest in order', () => {
      const signal = new Signal(users());
      signal.removeItem('user2');
      expect(signal.get().map(u => u.id)).toEqual(['user1', 'user3']);
    });

    it('setProperty(id, field, value) on an array signal updates the named field on the matching item', () => {
      const signal = new Signal(users());
      signal.setProperty('user2', 'status', 'online');
      expect(signal.getItem('user2').status).toBe('online');
      expect(signal.getItem('user1').status).toBe('online'); // others untouched
    });

    it('setProperty(field, value) on an object signal updates one field of that object', () => {
      const user = new Signal({ name: 'Alice', age: 30 });
      user.setProperty('name', 'Bob');
      expect(user.get()).toEqual({ name: 'Bob', age: 30 });
    });

    it('recognises id from any of: id, _id, hash, key fields', () => {
      const signal = new Signal();
      expect(signal.getID({ id: 'a' })).toBe('a');
      expect(signal.getID({ _id: 'b' })).toBe('b');
      expect(signal.getID({ hash: 'c' })).toBe('c');
      expect(signal.getID({ key: 'd' })).toBe('d');
    });

    it('hasID() returns true when the item carries that id under any recognised field', () => {
      const signal = new Signal();
      expect(signal.hasID({ id: 'x' }, 'x')).toBe(true);
      expect(signal.hasID({ _id: 'x' }, 'x')).toBe(true);
      expect(signal.hasID({ key: 'x' }, 'x')).toBe(true);
      expect(signal.hasID({ id: 'x' }, 'y')).toBe(false);
    });
  });

  /***********************************************
   * toggle() — boolean flip
   * Source: example(reactive-toggle)
   ***********************************************/

  describe('toggle()', () => {
    it('flips false to true', () => {
      const flag = new Signal(false);
      flag.toggle();
      expect(flag.get()).toBe(true);
    });

    it('flips true to false', () => {
      const flag = new Signal(true);
      flag.toggle();
      expect(flag.get()).toBe(false);
    });

    it('a pair of toggle() calls leaves the value where it started', () => {
      const flag = new Signal(false);
      flag.toggle();
      flag.toggle();
      expect(flag.get()).toBe(false);
    });

    it('triggers subscribers on each flip', () => {
      const callback = vi.fn();
      const flag = new Signal(false);
      flag.subscribe(callback);
      Reaction.flush();
      flag.toggle();
      Reaction.flush();
      flag.toggle();
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(3);
    });
  });

  /***********************************************
   * increment() / decrement()
   * Source: example(reactive-increment, reactive-decrement)
   ***********************************************/

  describe('increment() / decrement()', () => {
    it('increment() with no argument adds 1', () => {
      const counter = new Signal(0);
      counter.increment();
      expect(counter.get()).toBe(1);
    });

    it('increment(amount) adds the given amount', () => {
      const counter = new Signal(0);
      counter.increment(10);
      expect(counter.get()).toBe(10);
    });

    it('increment(amount, max) caps the result at max', () => {
      const counter = new Signal(95);
      counter.increment(10, 100);
      expect(counter.get()).toBe(100);
    });

    it('decrement() with no argument subtracts 1', () => {
      const score = new Signal(100);
      score.decrement();
      expect(score.get()).toBe(99);
    });

    it('decrement(amount) subtracts the given amount', () => {
      const score = new Signal(100);
      score.decrement(10);
      expect(score.get()).toBe(90);
    });

    it('decrement(amount, min) floors the result at min', () => {
      const score = new Signal(5);
      score.decrement(10, 0);
      expect(score.get()).toBe(0);
    });
  });

  /***********************************************
   * now() — set to current Date
   * Source: example(reactive-now)
   ***********************************************/

  describe('now()', () => {
    it('replaces the value with a fresh Date instance', () => {
      const lastUpdated = new Signal(new Date(0));
      lastUpdated.now();
      const stored = lastUpdated.get();
      expect(stored).toBeInstanceOf(Date);
      // The new timestamp should be strictly later than the epoch we seeded
      expect(stored.getTime()).toBeGreaterThan(0);
    });

    it('triggers subscribers when called', async () => {
      const callback = vi.fn();
      const lastUpdated = new Signal(new Date(0));
      lastUpdated.subscribe(callback);
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(1);

      // Spacing to guarantee a different millisecond timestamp
      await new Promise(r => setTimeout(r, 2));
      lastUpdated.now();
      Reaction.flush();
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  /***********************************************
   * derive() — single-source transformation
   * Source: api(Derive), example(reactive-derived)
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
      Reaction.flush();
      expect(count.get()).toBe(4);
    });

    it('chained derive() pipelines refresh through every link when the source moves', () => {
      const base = new Signal(2);
      const doubled = base.derive(v => v * 2);
      const quadrupled = doubled.derive(v => v * 2);
      base.set(3);
      Reaction.flush();
      expect(doubled.get()).toBe(6);
      expect(quadrupled.get()).toBe(12);
    });
  });

  /***********************************************
   * Signal.computed — multi-source computation
   * Source: api(Signal.computed), example(reactive-computed)
   ***********************************************/

  describe('Signal.computed', () => {
    it('returns a Signal whose value is the result of the compute function', () => {
      const firstName = new Signal('John');
      const lastName = new Signal('Doe');
      const fullName = Signal.computed(() => `${firstName.get()} ${lastName.get()}`);
      expect(fullName).toBeInstanceOf(Signal);
      expect(fullName.get()).toBe('John Doe');
    });

    it('updates when ANY tracked dependency changes', () => {
      const a = new Signal(1);
      const b = new Signal(2);
      const sum = Signal.computed(() => a.get() + b.get());
      expect(sum.get()).toBe(3);

      a.set(10);
      Reaction.flush();
      expect(sum.get()).toBe(12);

      b.set(20);
      Reaction.flush();
      expect(sum.get()).toBe(30);
    });

    it('a reaction observing the computed re-runs when an upstream dependency changes', () => {
      const a = new Signal(1);
      const b = new Signal(2);
      const sum = Signal.computed(() => a.get() + b.get());
      const observed = vi.fn();
      Reaction.create(() => observed(sum.get()));
      expect(observed).toHaveBeenCalledTimes(1);

      a.set(10);
      Reaction.flush();
      expect(observed).toHaveBeenCalledTimes(2);
      expect(observed).toHaveBeenLastCalledWith(12);
    });
  });

  /***********************************************
   * instanceof and identity
   * Source: source(signal.js — Symbol.hasInstance)
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
      expect(Signal.computed(() => 1) instanceof Signal).toBe(true);
    });

    it('does not match plain objects or primitives', () => {
      expect({} instanceof Signal).toBe(false);
      expect(null instanceof Signal).toBe(false);
      expect(undefined instanceof Signal).toBe(false);
      expect(42 instanceof Signal).toBe(false);
    });
  });

  /***********************************************
   * Negative path coverage — type misuse on helpers
   * The framework documents helpers per data type (push for arrays,
   * toggle for booleans, etc.). When a user calls a helper that
   * doesn't apply to the signal's value, what happens?
   * These tests document the actual behaviour as the user-visible contract.
   ***********************************************/

  describe('Type-mismatched helper calls', () => {
    it('toggle() on a non-boolean coerces via NOT — numbers become false', () => {
      // Documents source(signal.js#toggle = mutate(val => !val)) — !1 = false
      const signal = new Signal(1);
      signal.toggle();
      expect(signal.get()).toBe(false);
    });

    it('toggle() on undefined becomes true', () => {
      const signal = new Signal(undefined);
      signal.toggle();
      expect(signal.get()).toBe(true);
    });

    it('increment() on a string concatenates — numeric helpers are not type-guarded', () => {
      // Documents source(signal.js#increment) — uses + operator without coercion
      const signal = new Signal('count');
      signal.increment(1);
      expect(signal.get()).toBe('count1');
    });

    it('push() on a non-array signal throws because the underlying value has no push method', () => {
      // Documents source(signal.js#push) — calls this.currentValue.push directly
      const signal = new Signal(42);
      expect(() => signal.push('x')).toThrow();
    });
  });
});
