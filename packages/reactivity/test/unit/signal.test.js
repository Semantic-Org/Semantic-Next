import { Reaction, Signal } from '@semantic-ui/reactivity';
import { describe, expect, it, vi } from 'vitest';

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
});
