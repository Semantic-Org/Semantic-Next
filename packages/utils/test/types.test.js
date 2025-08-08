import {
  isArguments,
  isArray,
  isBinary,
  isClassInstance,
  isEmpty,
  isFunction,
  isMap,
  isNumber,
  isObject,
  isPlainObject,
  isPromise,
  isSet,
  isString,
} from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('Type Checking Utilities', () => {
  describe('isEmpty', () => {
    it('should return true for null or undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for empty arrays', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return true for empty objects', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty arrays', () => {
      expect(isEmpty([1, 2, 3])).toBe(false);
    });
    it('should return true if all keys are undefined', () => {
      expect(isEmpty({ a: undefined })).toBe(true);
    });

    it('should return false for non-empty objects', () => {
      expect(isEmpty({ a: 1, b: 2 })).toBe(false);
    });
  });

  it('isObject should correctly identify objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject(new Date())).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject(5)).toBe(false);
  });

  it('isPlainObject should only identify plain objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject('{}')).toBe(false);
    expect(isPlainObject([])).toBe(false);
  });

  it('isString should correctly identify strings', () => {
    expect(isString('test')).toBe(true);
    expect(isString(`1` + 1)).toBe(true);
    expect(isString(5)).toBe(false);
  });

  it('isNumber should correctly identify numbers', () => {
    expect(isNumber(5)).toBe(true);
    expect(isNumber(Infinity)).toBe(true);
    expect(isNumber(NaN)).toBe(true);
    expect(isNumber('5')).toBe(false);
  });

  it('isArray should correctly identify arrays', () => {
    expect(isArray([])).toBe(true);
    expect(isArray({})).toBe(false);
  });

  it('isBinary should correctly identify binary objects', () => {
    expect(isBinary(new Uint8Array())).toBe(true);
    expect(isBinary([])).toBe(false);
  });

  it('isFunction should correctly identify functions', () => {
    expect(isFunction(function() {})).toBe(true);
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction({})).toBe(false);
  });

  it('isPromise should correctly identify promises', () => {
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise({ then: function() {} })).toBe(true);
    expect(isPromise({})).toBe(false);
  });

  it('isArguments should correctly identify arguments objects', function() {
    const testFunction = function() {
      return isArguments(arguments);
    };
    expect(testFunction()).toBe(true);
    expect(testFunction(1, 2, 3)).toBe(true);
    expect(isArguments([1, 2, 3])).toBe(false);
  });

  describe('isClassInstance', () => {
    it('should return true for a custom class instance', () => {
      class MyClass {}
      const instance = new MyClass();
      expect(isClassInstance(instance)).toBe(true);
    });

    it('should return false for a plain object', () => {
      const obj = {};
      expect(isClassInstance(obj)).toBe(false);
    });

    it('should return false for primitive values', () => {
      expect(isClassInstance(null)).toBe(false);
      expect(isClassInstance(undefined)).toBe(false);
      expect(isClassInstance(42)).toBe(false);
      expect(isClassInstance('hello')).toBe(false);
      expect(isClassInstance(true)).toBe(false);
    });

    it('should return false for an array', () => {
      expect(isClassInstance([])).toBe(false);
    });

    it('should return false for a Date object', () => {
      expect(isClassInstance(new Date())).toBe(false);
    });

    it('should return false for a regular expression', () => {
      expect(isClassInstance(/regex/)).toBe(false);
    });

    it('should return false for a Map object', () => {
      expect(isClassInstance(new Map())).toBe(false);
    });

    it('should return false for a Set object', () => {
      expect(isClassInstance(new Set())).toBe(false);
    });

    it('should return false for an Error object', () => {
      expect(isClassInstance(new Error())).toBe(false);
    });

    it('should return false for a Uint8Array', () => {
      expect(isClassInstance(new Uint8Array())).toBe(false);
    });

    // Add more test cases for other built-in object types as needed

    it('should return false for functions', () => {
      expect(isClassInstance(() => {})).toBe(false);
      function testFunction() {}
      expect(isClassInstance(testFunction)).toBe(false);
    });
  });

  describe('isSet', () => {
    it('should return true for Set instances', () => {
      expect(isSet(new Set())).toBe(true);
      expect(isSet(new Set([1, 2, 3]))).toBe(true);
      expect(isSet(new Set(['a', 'b', 'c']))).toBe(true);
    });

    it('should return false for non-Set values', () => {
      expect(isSet([])).toBe(false);
      expect(isSet({})).toBe(false);
      expect(isSet(new Map())).toBe(false);
      expect(isSet(new Array())).toBe(false);
      expect(isSet('set')).toBe(false);
      expect(isSet(123)).toBe(false);
      expect(isSet(null)).toBe(false);
      expect(isSet(undefined)).toBe(false);
      expect(isSet(true)).toBe(false);
      expect(isSet(() => {})).toBe(false);
      expect(isSet(new Date())).toBe(false);
      expect(isSet(new RegExp())).toBe(false);
    });

    it('should return true for empty Set', () => {
      const emptySet = new Set();
      expect(isSet(emptySet)).toBe(true);
      expect(emptySet.size).toBe(0);
    });

    it('should return true for Set with mixed types', () => {
      const mixedSet = new Set([1, 'two', { three: 3 }, null, undefined]);
      expect(isSet(mixedSet)).toBe(true);
    });
  });

  describe('isMap', () => {
    it('should return true for Map instances', () => {
      expect(isMap(new Map())).toBe(true);
      expect(isMap(new Map([['a', 1], ['b', 2]]))).toBe(true);
      expect(isMap(new Map([[1, 'one'], [2, 'two']]))).toBe(true);
    });

    it('should return false for non-Map values', () => {
      expect(isMap([])).toBe(false);
      expect(isMap({})).toBe(false);
      expect(isMap(new Set())).toBe(false);
      expect(isMap(new Array())).toBe(false);
      expect(isMap('map')).toBe(false);
      expect(isMap(123)).toBe(false);
      expect(isMap(null)).toBe(false);
      expect(isMap(undefined)).toBe(false);
      expect(isMap(true)).toBe(false);
      expect(isMap(() => {})).toBe(false);
      expect(isMap(new Date())).toBe(false);
      expect(isMap(new RegExp())).toBe(false);
    });

    it('should return true for empty Map', () => {
      const emptyMap = new Map();
      expect(isMap(emptyMap)).toBe(true);
      expect(emptyMap.size).toBe(0);
    });

    it('should return true for Map with mixed key/value types', () => {
      const mixedMap = new Map([
        [1, 'number key'],
        ['str', 'string key'],
        [{ obj: true }, 'object key'],
        [null, 'null key'],
        [undefined, 'undefined key'],
      ]);
      expect(isMap(mixedMap)).toBe(true);
    });

    it('should distinguish Map from similar objects', () => {
      const objectWithMapMethods = {
        set: () => {},
        get: () => {},
        has: () => {},
        delete: () => {},
        size: 0,
      };
      expect(isMap(objectWithMapMethods)).toBe(false);
      expect(isMap(new Map())).toBe(true);
    });
  });
});
