import { isEqual } from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('isEqual', () => {
  describe('Various types', () => {
    // Primitives
    it('should return true for equal strings', () => {
      expect(isEqual('hello', 'hello')).toBe(true);
    });

    it('should return true for equal numbers', () => {
      expect(isEqual(42, 42)).toBe(true);
    });

    it('should return false for different numbers', () => {
      expect(isEqual(42, 43)).toBe(false);
    });

    // Arrays
    it('should return true for equal arrays', () => {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it('should return false for arrays with different order', () => {
      expect(isEqual([1, 2, 3], [3, 2, 1])).toBe(false);
    });

    // Sets — note: Set equality uses SameValueZero (Set.has) for members,
    // so object members are compared by reference, not structural equality
    it('should return true for equal Sets', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([1, 2, 3]);
      expect(isEqual(setA, setB)).toBe(true);
    });

    it('should return false for different Sets', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([4, 5, 6]);
      expect(isEqual(setA, setB)).toBe(false);
    });

    it('should return true for equal Maps', () => {
      const mapA = new Map([['key', 'value'], ['anotherKey', 'anotherValue']]);
      const mapB = new Map([['key', 'value'], ['anotherKey', 'anotherValue']]);
      expect(isEqual(mapA, mapB)).toBe(true);
    });

    it('should return true for identical RegExp', () => {
      const regExpA = /test/i;
      const regExpB = /test/i;
      expect(isEqual(regExpA, regExpB)).toBe(true);
    });

    it('should return false for different RegExp flags', () => {
      const regExpA = /test/i;
      const regExpB = /test/;
      expect(isEqual(regExpA, regExpB)).toBe(false);
    });

    it('should return false for different RegExp', () => {
      const regExpA = /test/;
      const regExpB = /best/;
      expect(isEqual(regExpA, regExpB)).toBe(false);
    });

    it('should return false for Maps with different content', () => {
      const mapA = new Map([['key', 'value']]);
      const mapB = new Map([['differentKey', 'differentValue']]);
      expect(isEqual(mapA, mapB)).toBe(false);
    });

    // Deep equality - Objects
    it('should return true for deeply equal objects', () => {
      const obj1 = { a: { b: 2 } };
      const obj2 = { a: { b: 2 } };
      expect(isEqual(obj1, obj2)).toBe(true);
    });

    it('should return false for objects with different structure', () => {
      const obj1 = { a: 1 };
      const obj2 = { a: 1, b: 2 };
      expect(isEqual(obj1, obj2)).toBe(false);
    });

    // Dates
    it('should return true for equal dates', () => {
      const date1 = new Date(2020, 0, 1);
      const date2 = new Date(2020, 0, 1);
      expect(isEqual(date1, date2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date(2020, 0, 1);
      const date2 = new Date(2020, 0, 2);
      expect(isEqual(date1, date2)).toBe(false);
    });

    // Binary
    it('should return true for equal binary data', () => {
      const binary1 = new Uint8Array([1, 2, 3]);
      const binary2 = new Uint8Array([1, 2, 3]);
      expect(isEqual(binary1, binary2)).toBe(true);
    });

    it('should return false for different binary data', () => {
      const binary1 = new Uint8Array([1, 2, 3]);
      const binary2 = new Uint8Array([4, 5, 6]);
      expect(isEqual(binary1, binary2)).toBe(false);
    });

    // Function equality (reference equality)
    it('should return true for the same function reference', () => {
      const func = () => {};
      expect(isEqual(func, func)).toBe(true);
    });

    it('should return false for different functions', () => {
      const func1 = () => {};
      const func2 = () => {};
      expect(isEqual(func1, func2)).toBe(false);
    });

    // Complex scenarios
    it('should return true for complex nested structures', () => {
      const complex1 = { a: [1, { b: 'test', c: [new Date(2020, 0, 1), { d: new Uint8Array([1, 2, 3]) }] }] };
      const complex2 = { a: [1, { b: 'test', c: [new Date(2020, 0, 1), { d: new Uint8Array([1, 2, 3]) }] }] };
      expect(isEqual(complex1, complex2)).toBe(true);
    });

    it('should return false for complex nested structures with differences', () => {
      const complex1 = { a: [1, { b: 'test', c: [new Date(2020, 0, 1), { d: new Uint8Array([1, 2, 3]) }] }] };
      const complex2 = { a: [1, { b: 'test', c: [new Date(2020, 0, 2), { d: new Uint8Array([1, 2, 3]) }] }] };
      expect(isEqual(complex1, complex2)).toBe(false);
    });
    it('should ignore non-enumerable properties by default', () => {
      const a = {};
      Object.defineProperty(a, 'a', {
        value: 1,
        enumerable: false,
      });
      const b = {};
      expect(isEqual(a, b)).toBe(true);
    });
  });

  it('should return false for == values that arent equal', () => {
    expect(isEqual('5', 5)).toBe(false);
  });

  describe('loose mode', () => {
    it('should return true for loosely equal values', () => {
      expect(isEqual('5', 5, { loose: true })).toBe(true);
      expect(isEqual(0, false, { loose: true })).toBe(true);
    });

    it('should still return false for structurally different values', () => {
      expect(isEqual('hello', 5, { loose: true })).toBe(false);
    });
  });

  describe('ignoreKeys', () => {
    it('should ignore specified keys during comparison', () => {
      const a = { x: 1, y: 2, z: 3 };
      const b = { x: 1, y: 999, z: 3 };
      expect(isEqual(a, b, { ignoreKeys: ['y'] })).toBe(true);
    });

    it('should fail when non-ignored keys differ', () => {
      const a = { x: 1, y: 2 };
      const b = { x: 999, y: 2 };
      expect(isEqual(a, b, { ignoreKeys: ['y'] })).toBe(false);
    });

    it('should treat ignored keys as invisible on both sides', () => {
      expect(isEqual({ x: 1 }, { x: 1, y: 2 }, { ignoreKeys: ['y'] })).toBe(true);
      expect(isEqual({ x: 1, y: 2 }, { x: 1 }, { ignoreKeys: ['y'] })).toBe(true);
    });

    it('should detect extra non-ignored keys in b', () => {
      expect(isEqual({ x: 1 }, { x: 1, z: 2 }, { ignoreKeys: ['y'] })).toBe(false);
    });

    it('should not apply to nested objects by default', () => {
      const a = { config: { theme: 'dark', debug: true } };
      const b = { config: { theme: 'dark', debug: false } };
      expect(isEqual(a, b, { ignoreKeys: ['debug'] })).toBe(false);
    });

    it('should apply at all depths with deepIgnore', () => {
      const a = { config: { theme: 'dark', debug: true } };
      const b = { config: { theme: 'dark', debug: false } };
      expect(isEqual(a, b, { ignoreKeys: ['debug'], deepIgnore: true })).toBe(true);
    });

    it('should ignore keys at both levels with deepIgnore', () => {
      const a = { debug: 'on', nested: { debug: 1, value: 'same' } };
      const b = { debug: 'off', nested: { debug: 2, value: 'same' } };
      expect(isEqual(a, b, { ignoreKeys: ['debug'], deepIgnore: true })).toBe(true);
    });
  });

  describe('partial', () => {
    it('should return true when a is a subset of b for objects', () => {
      expect(isEqual({ a: 1 }, { a: 1, b: 2 }, { partial: true })).toBe(true);
    });

    it('should return false when a has keys not in b', () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1 }, { partial: true })).toBe(false);
    });

    it('should work with arrays', () => {
      expect(isEqual([1, 2], [1, 2, 3], { partial: true })).toBe(true);
      expect(isEqual([1, 2, 3], [1, 2], { partial: true })).toBe(false);
    });

    it('should work with nested objects', () => {
      const a = { config: { theme: 'dark' } };
      const b = { config: { theme: 'dark', size: 'large' }, name: 'test' };
      expect(isEqual(a, b, { partial: true })).toBe(true);
    });

    it('should work with Maps', () => {
      const a = new Map([['x', 1]]);
      const b = new Map([['x', 1], ['y', 2]]);
      expect(isEqual(a, b, { partial: true })).toBe(true);
      expect(isEqual(b, a, { partial: true })).toBe(false);
    });

    it('should work with Sets', () => {
      const a = new Set([1, 2]);
      const b = new Set([1, 2, 3]);
      expect(isEqual(a, b, { partial: true })).toBe(true);
      expect(isEqual(b, a, { partial: true })).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should return true for NaN === NaN', () => {
      expect(isEqual(NaN, NaN)).toBe(true);
    });

    it('should return true for empty objects', () => {
      expect(isEqual({}, {})).toBe(true);
    });

    it('should return true for empty arrays', () => {
      expect(isEqual([], [])).toBe(true);
    });

    it('should return true for null === null', () => {
      expect(isEqual(null, null)).toBe(true);
    });

    it('should return true for undefined === undefined', () => {
      expect(isEqual(undefined, undefined)).toBe(true);
    });

    it('should return false for null vs undefined', () => {
      expect(isEqual(null, undefined)).toBe(false);
    });

    it('should return false for object vs null', () => {
      expect(isEqual({ a: 1 }, null)).toBe(false);
      expect(isEqual(null, { a: 1 })).toBe(false);
    });
  });
});

describe('isEqual — loose mode', () => {
  it('should treat "5" and 5 as equal when loose is true', () => {
    expect(isEqual('5', 5, { loose: true })).toBe(true);
  });

  it('should treat "0" and 0 as equal when loose is true', () => {
    expect(isEqual('0', 0, { loose: true })).toBe(true);
  });

  it('should still require structural match for objects in loose mode', () => {
    expect(isEqual({ a: '1' }, { a: 1 }, { loose: true })).toBe(true);
  });

  it('should not treat null and undefined as equal in strict mode', () => {
    expect(isEqual(null, undefined)).toBe(false);
  });
});

describe('isEqual — partial mode', () => {
  it('should match when a is a subset of b', () => {
    expect(isEqual({ a: 1 }, { a: 1, b: 2 }, { partial: true })).toBe(true);
  });

  it('should not match when a has keys b does not', () => {
    expect(isEqual({ a: 1, b: 2 }, { a: 1 }, { partial: true })).toBe(false);
  });

  it('should work with nested objects in partial mode', () => {
    expect(isEqual(
      { user: { name: 'Jack' } },
      { user: { name: 'Jack', age: 30 }, extra: true },
      { partial: true },
    )).toBe(true);
  });

  it('should work with arrays in partial mode (prefix match)', () => {
    expect(isEqual([1, 2], [1, 2, 3], { partial: true })).toBe(true);
    expect(isEqual([1, 2, 3], [1, 2], { partial: true })).toBe(false);
  });
});

describe('isEqual — ignoreKeys', () => {
  it('should ignore specified keys during comparison', () => {
    expect(isEqual(
      { a: 1, meta: 'x' },
      { a: 1, meta: 'y' },
      { ignoreKeys: ['meta'] },
    )).toBe(true);
  });

  it('should ignore multiple keys', () => {
    expect(isEqual(
      { a: 1, _id: 'abc', _rev: 1 },
      { a: 1, _id: 'def', _rev: 2 },
      { ignoreKeys: ['_id', '_rev'] },
    )).toBe(true);
  });

  it('should still fail if non-ignored keys differ', () => {
    expect(isEqual(
      { a: 1, meta: 'x' },
      { a: 2, meta: 'y' },
      { ignoreKeys: ['meta'] },
    )).toBe(false);
  });
});

describe('isEqual — NaN', () => {
  it('should treat NaN as equal to NaN', () => {
    expect(isEqual(NaN, NaN)).toBe(true);
  });

  it('should treat NaN in arrays as equal', () => {
    expect(isEqual([NaN, 1], [NaN, 1])).toBe(true);
  });
});
