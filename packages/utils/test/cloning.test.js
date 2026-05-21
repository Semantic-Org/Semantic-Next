import { clone, deepFreeze } from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('clone', () => {
  it('should clone dates', () => {
    const originalDate = new Date(2020, 0, 1);
    const clonedDate = clone(originalDate);
    expect(clonedDate).toEqual(originalDate);
    expect(clonedDate).not.toBe(originalDate);
    expect(clonedDate.getTime()).toBe(originalDate.getTime());
  });

  it('should return the input value if it is not an object or a function', () => {
    expect(clone(123)).toBe(123);
    expect(clone('hello')).toBe('hello');
    expect(clone(true)).toBe(true);
  });

  it('should deeply clone an array', () => {
    const originalArray = [{ a: 1 }, { b: 2 }];
    const clonedArray = clone(originalArray);

    // Check that the cloned array is not the same reference as the original
    expect(clonedArray).not.toBe(originalArray);

    // Check that items are not the same reference, indicating a deep clone
    expect(clonedArray[0]).not.toBe(originalArray[0]);
    expect(clonedArray[1]).not.toBe(originalArray[1]);

    // Check that the items are still equal in value
    expect(clonedArray[0]).toEqual({ a: 1 });
    expect(clonedArray[1]).toEqual({ b: 2 });
  });

  it('should clone sets', () => {
    const originalSet = new Set([1, 2, 3]);
    const clonedSet = clone(originalSet);
    expect(clonedSet).toEqual(originalSet);
    expect(clonedSet).not.toBe(originalSet); // Ensure it's a deep clone
  });

  it('should clone RegExp objects', () => {
    const originalRegExp = /test/gi;
    const clonedRegExp = clone(originalRegExp);
    expect(clonedRegExp).toEqual(originalRegExp);
    expect(clonedRegExp).not.toBe(originalRegExp);
    expect(clonedRegExp.test('TEST')).toBe(true);
  });

  it('should clone maps', () => {
    const originalMap = new Map([['key', 'value']]);
    const clonedMap = clone(originalMap);
    expect(clonedMap).toEqual(originalMap);
    expect(clonedMap).not.toBe(originalMap); // Ensure it's a deep clone
  });

  it('should clone typed arrays into an independent buffer', () => {
    const original = new Float64Array([1.5, 2.5, 3.5]);
    const cloned = clone(original);
    expect(cloned).toBeInstanceOf(Float64Array);
    expect(cloned).not.toBe(original);
    expect(Array.from(cloned)).toEqual([1.5, 2.5, 3.5]);

    // mutating the original must not bleed into the clone
    original[0] = 99;
    expect(cloned[0]).toBe(1.5);
  });

  it('should clone typed arrays nested in objects', () => {
    const original = { weights: new Int32Array([10, 20, 30]), label: 'layer' };
    const cloned = clone(original);
    expect(cloned.weights).toBeInstanceOf(Int32Array);
    expect(cloned.weights).not.toBe(original.weights);
    expect(Array.from(cloned.weights)).toEqual([10, 20, 30]);
  });

  it('should clone ArrayBuffer and DataView', () => {
    const buffer = new ArrayBuffer(8);
    new DataView(buffer).setFloat64(0, 3.14);

    const clonedBuffer = clone(buffer);
    expect(clonedBuffer).toBeInstanceOf(ArrayBuffer);
    expect(clonedBuffer).not.toBe(buffer);
    expect(new DataView(clonedBuffer).getFloat64(0)).toBe(3.14);

    const view = new DataView(buffer);
    const clonedView = clone(view);
    expect(clonedView).toBeInstanceOf(DataView);
    expect(clonedView).not.toBe(view);
    expect(clonedView.getFloat64(0)).toBe(3.14);
  });

  it('should clone deep objects', () => {
    const originalObject = {
      level1: {
        level2: {
          level3: {
            value: 'deep value',
          },
        },
      },
    };
    const clonedObject = clone(originalObject);
    expect(clonedObject).toEqual(originalObject);
    expect(clonedObject).not.toBe(originalObject);
    expect(clonedObject.level1.level2.level3.value).toBe('deep value');

    // Mutate the original object to ensure the clone is deep
    originalObject.level1.level2.level3.value = 'mutated value';
    expect(clonedObject.level1.level2.level3.value).toBe('deep value');
  });

  it('should handle circular dependencies', () => {
    const originalObject = {};
    originalObject.circularRef = originalObject;

    const clonedObject = clone(originalObject);
    expect(clonedObject).not.toBe(originalObject);
    expect(clonedObject.circularRef).toBe(clonedObject);
  });

  it('should flatten custom class instances by default', () => {
    class CustomClass {
      constructor(value) {
        this.value = value;
      }
      getValue() {
        return this.value;
      }
    }

    const instance = new CustomClass(42);
    const obj = {
      regular: { a: 1 },
      custom: instance,
    };

    // Default behavior - should flatten custom classes to plain objects
    const clonedDefault = clone(obj);
    expect(clonedDefault.custom).not.toBe(instance);
    expect(clonedDefault.custom instanceof CustomClass).toBe(false);
    expect(clonedDefault.custom.value).toBe(42);
    expect(clonedDefault.custom.getValue).toBeUndefined();

    // Explicit false should behave the same
    const clonedExplicitFalse = clone(obj, { preserveNonCloneable: false });
    expect(clonedExplicitFalse.custom).not.toBe(instance);
    expect(clonedExplicitFalse.custom instanceof CustomClass).toBe(false);
    expect(clonedExplicitFalse.custom.value).toBe(42);
    expect(clonedExplicitFalse.custom.getValue).toBeUndefined();
  });

  it('should preserve custom class instances when preserveNonCloneable is true', () => {
    class CustomClass {
      constructor(value) {
        this.value = value;
      }
      getValue() {
        return this.value;
      }
    }

    const instance = new CustomClass(42);
    const obj = {
      regular: { a: 1 },
      custom: instance,
    };

    // With preserveNonCloneable: true - should preserve custom class instances
    const clonedPreserved = clone(obj, { preserveNonCloneable: true });
    expect(clonedPreserved.custom).toBe(instance); // Same reference
    expect(clonedPreserved.custom instanceof CustomClass).toBe(true);
    expect(clonedPreserved.custom.getValue()).toBe(42);

    // Regular objects should still be cloned
    expect(clonedPreserved.regular).not.toBe(obj.regular);
    expect(clonedPreserved.regular).toEqual({ a: 1 });
  });
});

describe('deepFreeze', () => {
  it('should return primitives unchanged', () => {
    expect(deepFreeze(123)).toBe(123);
    expect(deepFreeze('hello')).toBe('hello');
    expect(deepFreeze(true)).toBe(true);
    expect(deepFreeze(false)).toBe(false);
    expect(deepFreeze(null)).toBe(null);
    expect(deepFreeze(undefined)).toBe(undefined);
    expect(deepFreeze(0)).toBe(0);
    expect(deepFreeze('')).toBe('');
  });

  it('should return the same reference, not a copy', () => {
    const obj = { a: 1 };
    const frozen = deepFreeze(obj);
    expect(frozen).toBe(obj);
  });

  it('should freeze plain objects', () => {
    const obj = { a: 1, b: 2 };
    deepFreeze(obj);
    expect(Object.isFrozen(obj)).toBe(true);
    expect(() => {
      obj.a = 99;
    }).toThrow();
    expect(obj.a).toBe(1);
  });

  it('should freeze nested plain objects', () => {
    const obj = { a: { b: { c: 1 } } };
    deepFreeze(obj);
    expect(Object.isFrozen(obj)).toBe(true);
    expect(Object.isFrozen(obj.a)).toBe(true);
    expect(Object.isFrozen(obj.a.b)).toBe(true);
    expect(() => {
      obj.a.b.c = 99;
    }).toThrow();
  });

  it('should freeze arrays', () => {
    const arr = [1, 2, 3];
    deepFreeze(arr);
    expect(Object.isFrozen(arr)).toBe(true);
    expect(() => {
      arr.push(4);
    }).toThrow();
    expect(() => {
      arr[0] = 99;
    }).toThrow();
  });

  it('should freeze nested arrays', () => {
    const arr = [[1, 2], [3, 4]];
    deepFreeze(arr);
    expect(Object.isFrozen(arr)).toBe(true);
    expect(Object.isFrozen(arr[0])).toBe(true);
    expect(Object.isFrozen(arr[1])).toBe(true);
  });

  it('should freeze mixed nested structures', () => {
    const data = {
      users: [
        { name: 'Alice', tags: ['admin', 'editor'] },
        { name: 'Bob', tags: ['user'] },
      ],
      config: { theme: { mode: 'dark' } },
    };
    deepFreeze(data);
    expect(Object.isFrozen(data)).toBe(true);
    expect(Object.isFrozen(data.users)).toBe(true);
    expect(Object.isFrozen(data.users[0])).toBe(true);
    expect(Object.isFrozen(data.users[0].tags)).toBe(true);
    expect(Object.isFrozen(data.config)).toBe(true);
    expect(Object.isFrozen(data.config.theme)).toBe(true);
  });

  it('should not freeze Date instances and leave them usable', () => {
    const date = new Date(2025, 0, 1);
    const wrapper = { when: date };
    deepFreeze(wrapper);
    expect(Object.isFrozen(wrapper)).toBe(true);
    expect(Object.isFrozen(date)).toBe(false);
    // Date internal slots must still work
    expect(date.getTime()).toBe(new Date(2025, 0, 1).getTime());
    date.setFullYear(2030);
    expect(date.getFullYear()).toBe(2030);
  });

  it('should not freeze Map instances', () => {
    const map = new Map([['a', 1]]);
    const wrapper = { data: map };
    deepFreeze(wrapper);
    expect(Object.isFrozen(wrapper)).toBe(true);
    expect(Object.isFrozen(map)).toBe(false);
    // Map must still be usable
    map.set('b', 2);
    expect(map.get('b')).toBe(2);
  });

  it('should not freeze Set instances', () => {
    const set = new Set([1, 2, 3]);
    const wrapper = { items: set };
    deepFreeze(wrapper);
    expect(Object.isFrozen(wrapper)).toBe(true);
    expect(Object.isFrozen(set)).toBe(false);
    set.add(4);
    expect(set.has(4)).toBe(true);
  });

  it('should not freeze RegExp instances', () => {
    const re = /pattern/gi;
    const wrapper = { matcher: re };
    deepFreeze(wrapper);
    expect(Object.isFrozen(wrapper)).toBe(true);
    expect(Object.isFrozen(re)).toBe(false);
  });

  it('should not freeze custom class instances', () => {
    class Store {
      constructor(value) {
        this.value = value;
      }
      increment() {
        this.value++;
      }
    }
    const store = new Store(5);
    const wrapper = { store };
    deepFreeze(wrapper);
    expect(Object.isFrozen(wrapper)).toBe(true);
    expect(Object.isFrozen(store)).toBe(false);
    store.increment();
    expect(store.value).toBe(6);
  });

  it('should handle circular references without infinite recursion', () => {
    const obj = { a: 1 };
    obj.self = obj;
    const frozen = deepFreeze(obj);
    expect(frozen).toBe(obj);
    expect(Object.isFrozen(obj)).toBe(true);
    expect(obj.self).toBe(obj);
  });

  it('should handle cross-referenced objects', () => {
    const a = { name: 'a' };
    const b = { name: 'b', a };
    a.b = b;
    deepFreeze(a);
    expect(Object.isFrozen(a)).toBe(true);
    expect(Object.isFrozen(b)).toBe(true);
  });

  it('should be a fast-path no-op on already frozen input', () => {
    const inner = Object.freeze({ x: 1 });
    const obj = { inner };
    Object.freeze(obj);
    // Should not throw and should return same reference
    expect(deepFreeze(obj)).toBe(obj);
    expect(Object.isFrozen(obj)).toBe(true);
    expect(Object.isFrozen(inner)).toBe(true);
  });

  it('should not throw on an object with nodeType (DOM-like)', () => {
    // Mock DOM node — has nodeType and a non-Object prototype via class
    class MockNode {
      constructor() {
        this.nodeType = 1;
        this.tagName = 'DIV';
      }
    }
    const node = new MockNode();
    const wrapper = { element: node };
    expect(() => deepFreeze(wrapper)).not.toThrow();
    expect(Object.isFrozen(wrapper)).toBe(true);
    expect(Object.isFrozen(node)).toBe(false);
    // Still mutable
    node.tagName = 'SPAN';
    expect(node.tagName).toBe('SPAN');
  });

  it('should freeze null-prototype objects', () => {
    const obj = Object.create(null);
    obj.a = 1;
    deepFreeze(obj);
    expect(Object.isFrozen(obj)).toBe(true);
  });

  it('should preserve reference identity of non-frozen nested class instances', () => {
    const date = new Date();
    const arr = [date, date];
    deepFreeze(arr);
    expect(arr[0]).toBe(date);
    expect(arr[1]).toBe(date);
    expect(Object.isFrozen(arr)).toBe(true);
    expect(Object.isFrozen(date)).toBe(false);
  });
});
