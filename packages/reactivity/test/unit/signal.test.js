import { describe, it, expect, vi } from 'vitest';
import { Signal, Reaction } from '@semantic-ui/reactivity';

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
        stop: expect.any(Function)
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
        { name: 'Bob', status: 'active' }
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
        { id: 3, active: true }
      ]);

      items.filter(item => item.active);
      expect(items.get()).toEqual([
        { id: 1, active: true },
        { id: 3, active: true }
      ]);
    });

    it('map should handle complex transformations', () => {
      const items = new Signal([
        { id: 1, value: 10 },
        { id: 2, value: 20 }
      ]);

      items.map(item => ({
        ...item,
        doubled: item.value * 2
      }));

      expect(items.get()).toEqual([
        { id: 1, value: 10, doubled: 20 },
        { id: 2, value: 20, doubled: 40 }
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
      { id: 2, name: 'Item 2' }
    ];

    it('setProperty should set the property of the item matching an id', () => {
      const items = new Signal(arrayItems());
      items.setProperty(1, 'name', 'Updated Item 1');
      expect(items.get()).toEqual([
        { id: 1, name: 'Updated Item 1' },
        { id: 2, name: 'Item 2' }
      ]);
    });

    it('getItem should get the item with matching id', () => {
      const items = new Signal(arrayItems());
      const index = items.getItem(2);
      expect(index).toBe(1);
    });

    it('replaceItem should replace an item matching an ID', () => {
      const items = new Signal(arrayItems());
      items.replaceItem(1, { id: 1, name: 'Replaced Item 1' });
      expect(items.get()).toEqual([
        { id: 1, name: 'Replaced Item 1' },
        { id: 2, name: 'Item 2' }
      ]);
    });

    it('removeItem should remove an item matching an ID', () => {
      const items = new Signal(arrayItems());
      items.removeItem(1);
      expect(items.get()).toEqual([
        { id: 2, name: 'Item 2' }
      ]);
    });

    it('setProperty should set the property of the item matching a given id', () => {
      const items = new Signal(arrayItems());
      items.setProperty(2, 'status', 'active');
      expect(items.get()).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2', status: 'active' }
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
        { id: 2, name: 'Item 2', status: 'active' }
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

      const data1 = { id: 1, text: 'test object'};
      const data2 = { id: 2, text: 'test object 2'};

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



});
