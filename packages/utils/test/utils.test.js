import { describe, beforeEach, afterEach, expect, it, vi } from 'vitest';
import {
  arrayFromObject,
  asyncEach,
  asyncMap,
  any,
  camelToKebab,
  capitalizeWords,
  clone,
  debounce,
  each,
  escapeHTML,
  escapeRegExp,
  extend,
  filterEmpty,
  filterObject,
  findIndex,
  firstMatch,
  flatten,
  formatDate,
  generateID,
  get,
  getKeyFromEvent,
  groupBy,
  hashCode,
  hasProperty,
  inArray,
  intersection,
  difference,
  uniqueItems,
  isArguments,
  isArray,
  isEmpty,
  isBinary,
  isEqual,
  isFunction,
  isClassInstance,
  isNumber,
  isObject,
  isPlainObject,
  isPromise,
  isString,
  joinWords,
  kebabToCamel,
  keys,
  last,
  mapObject,
  memoize,
  moveItem,
  moveToFront,
  moveToBack,
  onlyKeys,
  noop,
  pick,
  prettifyID,
  proxyObject,
  range,
  remove,
  reverseKeys,
  roundNumber,
  some,
  isServer,
  isClient,
  sortBy,
  sum,
  toTitleCase,
  tokenize,
  unique,
  values,
  weightedObjectSearch,
  where,
  wrapFunction
} from '@semantic-ui/utils';

describe('Array Utilities', () => {

  it('unique should remove duplicates', () => {
    const arr = [1, 2, 2, 3, 4, 4, 5];
    const result = unique(arr);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('filterEmpty should remove falsey values', () => {
    const arr = [0, 1, false, 2, '', 3];
    const result = filterEmpty(arr);
    expect(result).toEqual([1, 2, 3]);
  });

  it('last should return the last n elements', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(last(arr)).toEqual(5);
    expect(last(arr, 2)).toEqual([4, 5]);
  });

  it('firstMatch should return the first matching element based on callback', () => {
    const arr = [1, 2, 3, 4];
    const result = firstMatch(arr, x => x > 2);
    expect(result).toBe(3);
  });

  it('findIndex should return the index of the first matching element', () => {
    const arr = ['apple', 'banana', 'orange'];
    const index = findIndex(arr, fruit => fruit === 'banana');
    expect(index).toBe(1);
  });

  it('remove should remove elements based on a callback or value', () => {
    let arr = [1, 2, 3, 4];
    remove(arr, x => x === 3);
    expect(arr).toEqual([1, 2, 4]);

    arr = [1, 2, 3, 4];
    remove(arr, 2);
    expect(arr).toEqual([1, 3, 4]);
  });

  it('inArray should check if a value is in the array', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(inArray(3, arr)).toBe(true);
    expect(inArray(6, arr)).toBe(false);
  });

  it('range should create an array of numbers', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    expect(range(0, 4, 5)).toEqual([0, 5, 10, 15]);
  });

  describe('where', () => {
    it('should filter an array of objects based on properties', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'John' },
      ];
      const result = where(array, { name: 'John' });
      expect(result).toEqual([
        { id: 1, name: 'John' },
        { id: 3, name: 'John' },
      ]);
    });
  });

  describe('flatten', () => {
    it('should flatten a nested array', () => {
      const nested = [1, [2, [3, [4]], 5]];
      const flat = flatten(nested);
      expect(flat).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return the original array if it is not nested', () => {
      const original = [1, 2, 3];
      const flat = flatten(original);
      expect(flat).toEqual(original);
    });
  });

  describe('some', () => {
    it('should return true if at least one element matches the predicate', () => {
      const array = [1, 2, 3, 4, 5];
      const result = some(array, (num) => num > 3);
      expect(result).toBe(true);
    });

    it('should return false if no elements match the predicate', () => {
      const array = [1, 2, 3, 4, 5];
      const result = some(array, (num) => num > 10);
      expect(result).toBe(false);
    });

    it('should return false for an empty array', () => {
      const array = [];
      const result = some(array, (num) => num > 3);
      expect(result).toBe(false);
    });
  });

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

});

describe('Number Utilities', () => {

  describe('roundNumber', () => {

    it('should round numbers to the specified number of significant digits', () => {
      expect(roundNumber(123.456789, 4)).toBe(123.5);
      expect(roundNumber(0.00123456789, 3)).toBe(0.00123);
    });

    it('should handle negative numbers correctly', () => {
      expect(roundNumber(-123.456789, 4)).toBe(-123.5);
      expect(roundNumber(-0.00123456789, 3)).toBe(-0.00123);
    });

    it('should return the original number if it is not a finite number', () => {
      expect(roundNumber(Infinity, 3)).toBe(Infinity);
      expect(roundNumber(NaN, 3)).toBe(NaN);
    });

    it('should return the number unchanged if digits is not a positive integer', () => {
      expect(roundNumber(123.456, 0)).toBe(123.456);
    });

    it('should return the original number if it is not a number', () => {
      expect(roundNumber('not a number', 3)).toBe('not a number');
    });

    it('should handle very large and very small numbers correctly', () => {
      expect(roundNumber(123456789, 3)).toBe(123000000);
      expect(roundNumber(0.000000123456789, 5)).toBe(0.00000012346);
    });
  });

  describe('sum', () => {
    it('should return the sum of an array of numbers', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
    });

    it('should return 0 for an empty array', () => {
      expect(sum([])).toBe(0);
    });
  });
});

describe('Browser Utilities', () => {
  describe('getKeyFromEvent', () => {


    it('should return an empty string if the event.key is not defined', () => {
      const event = { ctrlKey: true };
      expect(getKeyFromEvent(event)).toBe('');
    });

    it('should return an empty string if the event has no key property', () => {
      const event = {};
      expect(getKeyFromEvent(event)).toBe('');
    });

    it('should return the lowercase key for a simple key press', () => {
      const event = { key: 'A' };
      expect(getKeyFromEvent(event)).toBe('a');
    });

    it('should return the correct key for a special key press', () => {
      const event = { key: 'ArrowUp' };
      expect(getKeyFromEvent(event)).toBe('up');
    });

    it('should include the "ctrl" modifier when the ctrlKey is pressed', () => {
      const event = { key: 'a', ctrlKey: true };
      expect(getKeyFromEvent(event)).toBe('ctrl+a');
    });

    it('should include the "alt" modifier when the altKey is pressed', () => {
      const event = { key: 'b', altKey: true };
      expect(getKeyFromEvent(event)).toBe('alt+b');
    });

    it('should include the "shift" modifier when the shiftKey is pressed', () => {
      const event = { key: 'c', shiftKey: true };
      expect(getKeyFromEvent(event)).toBe('shift+c');
    });

    it('should include the "meta" modifier when the metaKey is pressed', () => {
      const event = { key: 'd', metaKey: true };
      expect(getKeyFromEvent(event)).toBe('meta+d');
    });

    it('should include multiple modifiers when multiple modifier keys are pressed', () => {
      const event = { key: 'e', ctrlKey: true, altKey: true, shiftKey: true, metaKey: true };
      expect(getKeyFromEvent(event)).toBe('ctrl+alt+shift+meta+e');
    });

    it('should return the correct key for the space key', () => {
      const event = { key: ' ' };
      expect(getKeyFromEvent(event)).toBe('space');
    });
  });

  describe('isServer', () => {
    it('should return true if window is undefined', () => {
      expect(isServer).toBe(true);
    });
  });

  describe('isClient', () => {
    it('should return false if window is undefined', () => {
      expect(isClient).toBe(false);
    });
  });
});



describe('Type Checking Utilities', () => {

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

  describe('groupBy', () => {
    it('should group objects by a simple property', () => {
      const array = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 25 },
      ];
      const expected = {
        '25': [
          { name: 'Alice', age: 25 },
          { name: 'Charlie', age: 25 },
        ],
        '30': [
          { name: 'Bob', age: 30 },
        ],
      };
      expect(groupBy(array, 'age')).toEqual(expected);
    });

    it('should group objects by a nested property', () => {
      const array = [
        { name: 'Alice', details: { city: 'New York' } },
        { name: 'Bob', details: { city: 'London' } },
        { name: 'Charlie', details: { city: 'New York' } },
      ];
      const expected = {
        'New York': [
          { name: 'Alice', details: { city: 'New York' } },
          { name: 'Charlie', details: { city: 'New York' } },
        ],
        'London': [
          { name: 'Bob', details: { city: 'London' } },
        ],
      };
      expect(groupBy(array, 'details.city')).toEqual(expected);
    });

    it('should handle an empty array', () => {
      const array = [];
      const expected = {};
      expect(groupBy(array, 'age')).toEqual(expected);
    });

    it('should handle objects with missing property', () => {
      const array = [
        { name: 'Alice', age: 25 },
        { name: 'Bob' },
        { name: 'Charlie', age: 30 },
      ];
      const expected = {
        '25': [
          { name: 'Alice', age: 25 },
        ],
        '30': [
          { name: 'Charlie', age: 30 },
        ],
      };
      expect(groupBy(array, 'age')).toEqual(expected);
    });

    it('should handle a property that does not exist on any objects', () => {
      const array = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 25 },
      ];
      const expected = {};
      expect(groupBy(array, 'city')).toEqual(expected);
    });

  });

  describe('moveItem', () => {
    it('should move item to a specific index when using number', () => {
      const arr = [1, 2, 3, 4];
      expect(moveItem(arr, 2, 1)).toEqual([1, 2, 3, 4]);
      expect(moveItem(arr, 1, 3)).toEqual([2, 3, 4, 1]);
      expect(moveItem(arr, 4, 0)).toEqual([4, 2, 3, 1]);
    });

    it('should move item to first position when using "first"', () => {
      const arr = [1, 2, 3, 4];
      expect(moveItem(arr, 3, 'first')).toEqual([3, 1, 2, 4]);
    });

    it('should move item to last position when using "last"', () => {
      const arr = [1, 2, 3, 4];
      expect(moveItem(arr, 2, 'last')).toEqual([1, 3, 4, 2]);
    });

    it('should handle moving item that matches predicate function', () => {
      const arr = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' }
      ];
      expect(moveItem(arr, item => item.name === 'Jane', 0))
        .toEqual([
          { id: 2, name: 'Jane' },
          { id: 1, name: 'John' },
          { id: 3, name: 'Bob' }
        ]);
    });

    it('should clamp target index to valid array bounds', () => {
      const arr = [1, 2, 3, 4];
      expect(moveItem(arr, 2, -1)).toEqual([2, 1, 3, 4]); // clamps to 0
      expect(moveItem(arr, 2, 999)).toEqual([1, 3, 4, 2]); // clamps to length-1
    });

    it('should return original array if item not found', () => {
      const arr = [1, 2, 3, 4];
      const originalArr = [...arr];
      expect(moveItem(arr, 5, 0)).toEqual(originalArr);
      expect(moveItem(arr, x => x > 10, 0)).toEqual(originalArr);
    });

    it('should not modify array if source and target indices are the same', () => {
      const arr = [1, 2, 3, 4];
      const originalArr = [...arr];
      expect(moveItem(arr, 2, 1)).toEqual(originalArr); // 2 is already at index 1
    });

    it('should handle arrays with single item', () => {
      const arr = [1];
      expect(moveItem(arr, 1, 0)).toEqual([1]);
      expect(moveItem(arr, 1, 'first')).toEqual([1]);
      expect(moveItem(arr, 1, 'last')).toEqual([1]);
    });
  });

  describe('moveToFront', () => {
    it('should be equivalent to moveItem with "first"', () => {
      const arr1 = [1, 2, 3, 4];
      const arr2 = [...arr1];
      expect(moveToFront(arr1, 3)).toEqual(moveItem(arr2, 3, 'first'));
    });

    it('should move matching item to front of array', () => {
      const arr = [1, 2, 3, 4];
      expect(moveToFront(arr, 3)).toEqual([3, 1, 2, 4]);
    });

    it('should handle predicate function', () => {
      const arr = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' }
      ];
      expect(moveToFront(arr, item => item.name === 'Jane'))
        .toEqual([
          { id: 2, name: 'Jane' },
          { id: 1, name: 'John' },
          { id: 3, name: 'Bob' }
        ]);
    });
  });

  describe('moveToBack', () => {
    it('should be equivalent to moveItem with "last"', () => {
      const arr1 = [1, 2, 3, 4];
      const arr2 = [...arr1];
      expect(moveToBack(arr1, 2)).toEqual(moveItem(arr2, 2, 'last'));
    });

    it('should move matching item to end of array', () => {
      const arr = [1, 2, 3, 4];
      expect(moveToBack(arr, 2)).toEqual([1, 3, 4, 2]);
    });

    it('should handle predicate function', () => {
      const arr = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' }
      ];
      expect(moveToBack(arr, item => item.name === 'Jane'))
        .toEqual([
          { id: 1, name: 'John' },
          { id: 3, name: 'Bob' },
          { id: 2, name: 'Jane' }
        ]);
    });
  });

  describe('intersection', () => {
    it('returns common elements between arrays', () => {
      expect(intersection([1, 2, 3], [2, 3, 4], [3, 4, 5])).toEqual([3]);
    });

    it('handles arrays with no common elements', () => {
      expect(intersection([1, 2], [3, 4], [5, 6])).toEqual([]);
    });

    it('returns array for single input', () => {
      expect(intersection([1, 1, 2, 2])).toEqual([1, 2]);
    });

    it('returns empty array for no input', () => {
      expect(intersection()).toEqual([]);
    });

    it('handles arrays with duplicates', () => {
      expect(intersection([1, 1, 2], [1, 2, 2], [1, 1, 1])).toEqual([1]);
    });

    it('maintains element order from first array', () => {
      expect(intersection([3, 1, 2], [2, 3, 1], [1, 2, 3])).toEqual([3, 1, 2]);
    });

  });

  describe('difference', () => {
    it('returns elements only in first array', () => {
      expect(difference([1, 2, 3], [2, 3, 4], [3, 4, 5])).toEqual([1]);
    });

    it('returns first array when no others provided', () => {
      expect(difference([1, 1, 2])).toEqual([1, 2]);
    });

    it('returns empty array for no input', () => {
      expect(difference()).toEqual([]);
    });

    it('handles arrays with no common elements', () => {
      expect(difference([1, 2], [3, 4], [5, 6])).toEqual([1, 2]);
    });

    it('handles arrays with duplicates', () => {
      expect(difference([1, 1, 2], [2, 2], [2, 3])).toEqual([1]);
    });

    it('maintains element order', () => {
      expect(difference([3, 1, 2], [2], [3])).toEqual([1]);
    });

  });

  describe('uniqueItems', () => {
    it('returns elements unique to each array', () => {
      expect(uniqueItems([1, 2], [2, 3], [3, 4])).toEqual([1, 4]);
    });

    it('returns empty array for single input array', () => {
      expect(uniqueItems([1, 2, 3])).toEqual([]);
    });

    it('returns empty array for no input', () => {
      expect(uniqueItems()).toEqual([]);
    });

    it('handles arrays with duplicates', () => {
      expect(uniqueItems([1, 1, 2], [2, 2, 3], [3, 3, 4])).toEqual([1, 4]);
    });

  });


  describe('sortBy', () => {
    it('should sort by a simple key', () => {
      const input = [{a: 2}, {a: 3}, {a: 1}];
      const expected = [{a: 1}, {a: 2}, {a: 3}];
      expect(sortBy(input, 'a')).toEqual(expected);
    });

    it('should sort by a nested key', () => {
      const input = [{a: {b: 2}}, {a: {b: 3}}, {a: {b: 1}}];
      const expected = [{a: {b: 1}}, {a: {b: 2}}, {a: {b: 3}}];
      expect(sortBy(input, 'a.b')).toEqual(expected);
    });

    it('should handle custom comparator', () => {
      const input = [{a: 1}, {a: 2}, {a: 3}];
      const expected = [{a: 3}, {a: 2}, {a: 1}];
      const reverseComparator = (a, b) => b - a;
      expect(sortBy(input, 'a', reverseComparator)).toEqual(expected);
    });

    it('should handle sorting with additional object context in comparator', () => {
      const input = [{a: 1, b: 2}, {a: 1, b: 1}];
      const expected = [{a: 1, b: 1}, {a: 1, b: 2}];
      const comparator = (valA, valB, objA, objB) => objA.b - objB.b;
      expect(sortBy(input, 'a', comparator)).toEqual(expected);
    });

    it('should return a new array and not mutate the original', () => {
      const input = [{a: 1}, {a: 2}];
      const result = sortBy(input, 'a');
      expect(result).not.toBe(input);
      expect(result).toEqual([{a: 1}, {a: 2}]);
    });

    it('should sort objects with undefined values last', () => {
      const input = [{a: 1}, {a: undefined}, {a: 2}];
      const expected = [{a: 1}, {a: 2}, {a: undefined}];
      expect(sortBy(input, 'a')).toEqual(expected);
    });
  });

});

describe('Date Utilities', () => {

  describe('formatDate', () => {


    it('should format dates correctly with predefined formats', () => {
      const testCases = [
        {
          date: '2023-05-18T00:00:00Z',
          formats: {
            LT: '12:00 am',
            LTS: '12:00:00 am',
            L: '05/18/2023',
            l: '5/18/2023',
            LL: 'May 18, 2023',
            ll: 'May 18, 2023',
            LLL: 'May 18, 2023 12:00 am',
            lll: 'May 18, 2023 12:00 am',
            LLLL: 'Thursday, May 18, 2023 12:00 am',
            llll: 'Thu, May 18, 2023 12:00 am',
          },
        },
        {
          date: '2023-05-18T01:23:45Z',
          formats: {
            LT: '1:23 am',
            LTS: '1:23:45 am',
            L: '05/18/2023',
            l: '5/18/2023',
            LL: 'May 18, 2023',
            ll: 'May 18, 2023',
            LLL: 'May 18, 2023 1:23 am',
            lll: 'May 18, 2023 1:23 am',
            LLLL: 'Thursday, May 18, 2023 1:23 am',
            llll: 'Thu, May 18, 2023 1:23 am',
          },
        },
        {
          date: '2023-12-31T23:59:59Z',
          formats: {
            LT: '11:59 pm',
            LTS: '11:59:59 pm',
            L: '12/31/2023',
            l: '12/31/2023',
            LL: 'December 31, 2023',
            ll: 'Dec 31, 2023',
            LLL: 'December 31, 2023 11:59 pm',
            lll: 'Dec 31, 2023 11:59 pm',
            LLLL: 'Sunday, December 31, 2023 11:59 pm',
            llll: 'Sun, Dec 31, 2023 11:59 pm',
          },
        },
        {
          date: '2024-02-29T12:30:00Z',
          formats: {
            LT: '12:30 pm',
            LTS: '12:30:00 pm',
            L: '02/29/2024',
            l: '2/29/2024',
            LL: 'February 29, 2024',
            ll: 'Feb 29, 2024',
            LLL: 'February 29, 2024 12:30 pm',
            lll: 'Feb 29, 2024 12:30 pm',
            LLLL: 'Thursday, February 29, 2024 12:30 pm',
            llll: 'Thu, Feb 29, 2024 12:30 pm',
          },
        },
        {
          date: '2023-06-01T09:30:00Z',
          formats: {
            LT: '9:30 am',
            LTS: '9:30:00 am',
            L: '06/01/2023',
            l: '6/1/2023',
            LL: 'June 1, 2023',
            ll: 'Jun 1, 2023',
            LLL: 'June 1, 2023 9:30 am',
            lll: 'Jun 1, 2023 9:30 am',
            LLLL: 'Thursday, June 1, 2023 9:30 am',
            llll: 'Thu, Jun 1, 2023 9:30 am',
          },
        },
        {
          date: '2023-01-01T00:00:00Z',
          formats: {
            LT: '12:00 am',
            LTS: '12:00:00 am',
            L: '01/01/2023',
            l: '1/1/2023',
            LL: 'January 1, 2023',
            ll: 'Jan 1, 2023',
            LLL: 'January 1, 2023 12:00 am',
            lll: 'Jan 1, 2023 12:00 am',
            LLLL: 'Sunday, January 1, 2023 12:00 am',
            llll: 'Sun, Jan 1, 2023 12:00 am',
          },
        },
        {
          date: '2023-01-01T00:01:00Z',
          formats: {
            LT: '12:01 am',
            LTS: '12:01:00 am',
            L: '01/01/2023',
            l: '1/1/2023',
            LL: 'January 1, 2023',
            ll: 'Jan 1, 2023',
            LLL: 'January 1, 2023 12:01 am',
            lll: 'Jan 1, 2023 12:01 am',
            LLLL: 'Sunday, January 1, 2023 12:01 am',
            llll: 'Sun, Jan 1, 2023 12:01 am',
          },
        },
        {
          date: '2023-01-02T00:00:00Z',
          formats: {
            LT: '12:00 am',
            LTS: '12:00:00 am',
            L: '01/02/2023',
            l: '1/2/2023',
            LL: 'January 2, 2023',
            ll: 'Jan 2, 2023',
            LLL: 'January 2, 2023 12:00 am',
            lll: 'Jan 2, 2023 12:00 am',
            LLLL: 'Monday, January 2, 2023 12:00 am',
            llll: 'Mon, Jan 2, 2023 12:00 am',
          },
        },
        {
          date: '2023-01-01T00:00:00Z',
          formats: {
            LT: '7:00 pm',
            LTS: '7:00:00 pm',
            L: '12/31/2022',
            l: '12/31/2022',
            LL: 'December 31, 2022',
            ll: 'Dec 31, 2022',
            LLL: 'December 31, 2022 7:00 pm',
            lll: 'Dec 31, 2022 7:00 pm',
            LLLL: 'Saturday, December 31, 2022 7:00 pm',
            llll: 'Sat, Dec 31, 2022 7:00 pm',
          },
          options: {
            timezone: 'America/New_York',
          },
        },

      ];

      testCases.forEach(({ date, formats, options }) => {
        const dateObj = new Date(date);

        Object.entries(formats).forEach(([format, expectedValue]) => {
          expect(formatDate(dateObj, format, options)).toBe(expectedValue);
        });
      });
    });

    const date = new Date('2023-05-18T15:34:56Z');

    it('should format date with default options', () => {
      expect(formatDate(date, 'YYYY-MM-DD hh:mm:ss a')).toBe('2023-05-18 03:34:56 pm');
    });

    it('should format date with 12-hour format when hour12 is true', () => {
      expect(formatDate(date, 'YYYY-MM-DD hh:mm:ss a', { hour12: true })).toBe('2023-05-18 03:34:56 pm');
    });

    it('should format date with 24-hour format when hour12 is false', () => {
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss', { hour12: false })).toBe('2023-05-18 15:34:56');
    });

    it('should format date with custom timezone', () => {
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss', { timezone: 'America/New_York' })).toBe('2023-05-18 11:34:56');
    });
/*
    it('should format date with local timezone', () => {
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss', { timezone: 'local' })).toBe('2023-05-18 ' + date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    });*/

    it('should format date with predefined format (LT)', () => {
      expect(formatDate(date, 'LT')).toBe('3:34 pm');
    });

    it('should format date with predefined format (LTS)', () => {
      expect(formatDate(date, 'LTS')).toBe('3:34:56 pm');
    });

    it('should format date with predefined format (L)', () => {
      expect(formatDate(date, 'L')).toBe('05/18/2023');
    });

    it('should format date with predefined format (LL)', () => {
      expect(formatDate(date, 'LL')).toBe('May 18, 2023');
    });

    it('should format date with predefined format (LLL)', () => {
      expect(formatDate(date, 'LLL')).toBe('May 18, 2023 3:34 pm');
    });

    it('should format date with predefined format (LLLL)', () => {
      expect(formatDate(date, 'LLLL')).toBe('Thursday, May 18, 2023 3:34 pm');
    });

    it('should format date with custom format string', () => {
      expect(formatDate(date, '[Today is] dddd, MMMM Do, YYYY')).toBe('Today is Thursday, May 18th, 2023');
    });

    it('should handle single-digit hours correctly', () => {
      const earlyDate = new Date('2023-05-18T09:34:56Z');
      expect(formatDate(earlyDate, 'YYYY-MM-DD hh:mm:ss a', { hour12: true })).toBe('2023-05-18 09:34:56 am');
      expect(formatDate(earlyDate, 'YYYY-MM-DD HH:mm:ss', { hour12: false })).toBe('2023-05-18 09:34:56');
    });

    it('should handle midnight correctly', () => {
      const midnightDate = new Date('2023-05-18T00:00:00Z');
      expect(formatDate(midnightDate, 'YYYY-MM-DD hh:mm:ss a', { hour12: true })).toBe('2023-05-18 12:00:00 am');
      expect(formatDate(midnightDate, 'YYYY-MM-DD HH:mm:ss', { hour12: false })).toBe('2023-05-18 00:00:00');
    });

    it('should handle noon correctly', () => {
      const noonDate = new Date('2023-05-18T12:00:00Z');
      expect(formatDate(noonDate, 'YYYY-MM-DD hh:mm:ss a', { hour12: true })).toBe('2023-05-18 12:00:00 pm');
      expect(formatDate(noonDate, 'YYYY-MM-DD HH:mm:ss', { hour12: false })).toBe('2023-05-18 12:00:00');
    });

    it('should handle leap years correctly', () => {
      const leapYearDate = new Date('2024-02-29T15:34:56Z');
      expect(formatDate(leapYearDate, 'YYYY-MM-DD')).toBe('2024-02-29');
    });

    it('should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid');
      expect(formatDate(invalidDate, 'YYYY-MM-DD')).toBe('Invalid Date');
    });
  });
});

describe('Object Utilities', () => {

  describe('keys', () => {
    it('keys should return the keys of an object', () => {
      expect(keys({ a: 1, b: 2 })).toEqual(['a', 'b']);
      expect(keys([1, 2, 3])).toEqual(['0', '1', '2']);
    });
  });

  describe('values', () => {
    it('values should return the values of an object', () => {
      expect(values({ a: 1, b: 2 })).toEqual([1, 2]);
      expect(values([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('mapObject', () => {
    it('mapObject should create an object with the same keys and mapped values', () => {
      const result = mapObject({ a: 1, b: 2 }, (val) => val * 2);
      expect(result).toEqual({ a: 2, b: 4 });
    });
    it('should create a new object without mutating the original', () => {
      const original = { a: 1, b: 2, c: 3 };
      const mapped = mapObject(original, x => x * 2);

      // Check mapped values are correct
      expect(mapped).toEqual({ a: 2, b: 4, c: 6 });

      // Verify original wasn't mutated
      expect(original).toEqual({ a: 1, b: 2, c: 3 });

      // Verify it's a different object reference
      expect(mapped).not.toBe(original);
    });

    it('should pass both value and key to the callback', () => {
      const original = { a: 1, b: 2 };
      const spy = vi.fn((value, key) => value);

      mapObject(original, spy);

      expect(spy).toHaveBeenCalledWith(1, 'a');
      expect(spy).toHaveBeenCalledWith(2, 'b');
    });

    it('should handle empty objects', () => {
      const original = {};
      const mapped = mapObject(original, x => x * 2);
      expect(mapped).toEqual({});
    });

    it('should handle non-numeric values', () => {
      const original = { a: 'hello', b: 'world' };
      const mapped = mapObject(original, str => str.toUpperCase());
      expect(mapped).toEqual({ a: 'HELLO', b: 'WORLD' });
      expect(original).toEqual({ a: 'hello', b: 'world' });
    });

    it('should preserve keys while mapping values', () => {
      const original = { key1: 1, key2: 2, key3: 3 };
      const mapped = mapObject(original, x => x.toString());
      expect(mapped).toEqual({ key1: '1', key2: '2', key3: '3' });
    });
  });

  describe('extend', () => {
    it('extend should merge properties from source into target, including getters and setters', () => {
      const target = { a: 1 };
      const source = {
        get b() { return 2; },
        set b(val) { this.c = val; }
      };
      extend(target, source);
      expect(target.b).toBe(2);
      target.b = 3;
      expect(target.c).toBe(3);
    });
  });



  describe('pick', () => {
    it('pick should create an object composed of the picked properties', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, 'a', 'c')).toEqual({ a: 1, c: 3 });
    });
  });

  describe('filterObject', () => {
    it('should filter an object based on a predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const filtered = filterObject(obj, (value) => value > 1);
      expect(filtered).toEqual({ b: 2, c: 3 });
    });

    it('should return an empty object if no properties match the predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const filtered = filterObject(obj, (value) => value > 10);
      expect(filtered).toEqual({});
    });
  });

  describe('arrayFromObject', () => {
    it('should convert an object to an array of key-value pairs', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const array = arrayFromObject(obj);
      expect(array).toEqual([
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
      ]);
    });

    it('should return the original array if the input is already an array', () => {
      const original = [1, 2, 3];
      const array = arrayFromObject(original);
      expect(array).toEqual(original);
    });
  });

  describe('proxyObject', () => {
    it('should create a proxy that reflects changes in the source object', () => {
      const source = { name: 'John', age: 30 };
      const reference = {};
      const proxy = proxyObject(() => source);

      expect(proxy.name).toBe('John');
      expect(proxy.age).toBe(30);

      source.age = 31;

      expect(proxy.age).toBe(31);
    });

    it('should handle nested properties correctly', () => {
      const source = { person: { name: 'John', age: 30 } };
      const reference = {};
      const proxy = proxyObject(() => source);

      expect(proxy.person.name).toBe('John');
      expect(proxy.person.age).toBe(30);

      source.person.age = 31;

      expect(proxy.person.age).toBe(31);
    });

    it('should handle adding new properties to the source object', () => {
      const source = { name: 'John' };
      const reference = {};
      const proxy = proxyObject(() => source);

      expect(proxy.age).toBeUndefined();

      source.age = 30;

      expect(proxy.age).toBe(30);
    });

    it('should handle deleting properties from the source object', () => {
      const source = { name: 'John', age: 30 };
      const reference = {};
      const proxy = proxyObject(() => source);

      expect(proxy.age).toBe(30);

      delete source.age;

      expect(proxy.age).toBeUndefined();
    });

    it('should not affect the original reference object', () => {
      const source = { name: 'John', age: 30 };
      const reference = { name: 'Jane', age: 25 };
      const proxy = proxyObject(() => source);

      expect(reference.name).toBe('Jane');
      expect(reference.age).toBe(25);

      source.age = 31;

      expect(reference.age).toBe(25);
    });

    it('should reflect updates made to the reference object after proxy creation', () => {
      const source = { name: 'John' };
      const reference = { city: 'Atlanta' };
      const proxy = proxyObject(() => source, reference);

      expect(proxy.city).toBe('Atlanta');
      expect(reference.city).toBe('Atlanta');

      reference.city = 'New Orleans';

      expect(proxy.city).toBe('New Orleans');
      expect(reference.city).toBe('New Orleans');
    });
  });

  describe('get', () => {

    it('get should support array like "arr.1.value" notation in lookup', () => {
      const obj = { arr: [{ value: 1 }, { value: 2 }] };
      expect(get(obj, 'arr.1.value')).toBe(2);
    });

    it('get should access a nested object field from a string', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(get(obj, 'a.b.c')).toBe(1);
      expect(get(obj, 'a.b.c.d')).toBeUndefined();
    });


    it('get should support files with "." in the key', () => {
      const obj = { 'a.b': 1 };
      expect(get(obj, 'a.b')).toBe(1);
    });

    it('get should support deeply nested files with "." in the key', () => {
      const obj = { a: { 'b.c': 1 } };
      expect(get(obj, 'a.b.c')).toBe(1);
    });

    it('get should return undefined when accessing a non-existent nested key', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(get(obj, 'a.b.d')).toBeUndefined();
    });

    it('get should support accessing nested keys with dots and array indexes', () => {
      const obj = { 'a.b': [{ 'c.d': 1 }, { 'c.d': 2 }] };
      expect(get(obj, 'a.b.1.c.d')).toBe(2);
    });

    it('get should return undefined when accessing an out-of-bounds array index', () => {
      const obj = { arr: [1, 2, 3] };
      expect(get(obj, 'arr.3')).toBeUndefined();
    });

    it('get should return undefined when accessing a non-existent array index', () => {
      const obj = { a: { b: [1, 2, 3] } };
      expect(get(obj, 'a.c.1')).toBeUndefined();
    });
  });

  describe('hasProperty', () => {
    it('hasProperty should return true if the object has the specified property', () => {
      const obj = { a: 1, b: undefined };
      expect(hasProperty(obj, 'a')).toBe(true);
      expect(hasProperty(obj, 'b')).toBe(true);
      expect(hasProperty(obj, 'c')).toBe(false);
    });
  });

  describe('reverseKeys', () => {
    it('reverseKeys should reverse a lookup object\'s keys and values', () => {
      const obj = { a: 1, b: [1, 2], c: 2 };
      const reversed = reverseKeys(obj);
      expect(reversed).toEqual({ '1': ['a', 'b'], '2': ['b', 'c'] });
    });

    it('reverseKeys should reverse array values', () => {
      const obj = { a: [1, 2], b: [2, 3], c: 1 };
      const reversed = reverseKeys(obj);
      expect(reversed).toEqual({ '1': ['a', 'c'], '2': ['a', 'b'], '3': 'b' });
    });
  });

  describe('onlyKeys', () => {
    it('should return an object with only the specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = onlyKeys(obj, ['a', 'c']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should return an empty object if no keys are specified', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = onlyKeys(obj, []);
      expect(result).toEqual({});
    });
  });

  describe('any', () => {
    it('should be an alias for some', () => {
      expect(any).toBe(some);
    });
  });

});


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

    // sets
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


});

describe('function utilities', () => {
  it('noop should not return anything', () => {
    expect(noop()).toBeUndefined();
  });
  it('wrapFunction should return the same function if a function is passed', () => {
    const func = () => 'test';
    expect(wrapFunction(func)()).toBe('test');
  });

  it('wrapFunction should return a function that returns the passed value if a non-function is passed', () => {
    const value = 'test';
    expect(wrapFunction(value)()).toBe('test');
  });
  describe('memoize', () => {
    it('should memoize the return value of a function', () => {
      const originalFunction = vi.fn((a, b) => a + b);
      const memoizedFunction = memoize(originalFunction);

      const result1 = memoizedFunction(2, 3);
      expect(result1).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(1);

      const result2 = memoizedFunction(2, 3);
      expect(result2).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(1); // Should not be called again

      const result3 = memoizedFunction(4, 5);
      expect(result3).toBe(9);
      expect(originalFunction).toHaveBeenCalledTimes(2);
    });

    it('should memoize different arguments separately', () => {
      const originalFunction = vi.fn((a, b) => a * b);
      const memoizedFunction = memoize(originalFunction);

      const result1 = memoizedFunction(2, 3);
      expect(result1).toBe(6);
      expect(originalFunction).toHaveBeenCalledTimes(1);

      const result2 = memoizedFunction(2, 4);
      expect(result2).toBe(8);
      expect(originalFunction).toHaveBeenCalledTimes(2);

      const result3 = memoizedFunction(2, 3);
      expect(result3).toBe(6);
      expect(originalFunction).toHaveBeenCalledTimes(2); // Should not be called again for (2, 3)
    });

    it('should memoize functions with no arguments', () => {
      const originalFunction = vi.fn(() => 42);
      const memoizedFunction = memoize(originalFunction);

      const result1 = memoizedFunction();
      expect(result1).toBe(42);
      expect(originalFunction).toHaveBeenCalledTimes(1);

      const result2 = memoizedFunction();
      expect(result2).toBe(42);
      expect(originalFunction).toHaveBeenCalledTimes(1); // Should not be called again
    });

    it('should memoize functions with complex arguments', () => {
      const originalFunction = vi.fn((obj) => obj.a + obj.b);
      const memoizedFunction = memoize(originalFunction);

      const result1 = memoizedFunction({ a: 2, b: 3 });
      expect(result1).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(1);

      const result2 = memoizedFunction({ a: 2, b: 3 });
      expect(result2).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(1); // Should not be called again

      const result3 = memoizedFunction({ a: 4, b: 5 });
      expect(result3).toBe(9);
      expect(originalFunction).toHaveBeenCalledTimes(2);
    });

    it('should preserve the context of the original function', () => {
      const context = { multiplier: 2 };
      const originalFunction = vi.fn(function(a) {
        return a * this.multiplier;
      });
      const memoizedFunction = memoize(originalFunction);

      const result1 = memoizedFunction.call(context, 3);
      expect(result1).toBe(6);
      expect(originalFunction).toHaveBeenCalledTimes(1);

      const result2 = memoizedFunction.call(context, 3);
      expect(result2).toBe(6);
      expect(originalFunction).toHaveBeenCalledTimes(1); // Should not be called again

      const result3 = memoizedFunction.call(context, 4);
      expect(result3).toBe(8);
      expect(originalFunction).toHaveBeenCalledTimes(2);
    });
    it('should allow custom hashing function', () => {
      const originalFunction = vi.fn((obj) => obj.a + obj.b);
      const customHash = (args) => args[0].id;
      const memoizedFunction = memoize(originalFunction, customHash);

      const result1 = memoizedFunction({id: 1, a: 2, b: 3});
      expect(result1).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(1);

      const result2 = memoizedFunction({id: 1, a: 3, b: 4});
      expect(result2).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(1); // Should not be called again due to same id

      const result3 = memoizedFunction({id: 2, a: 2, b: 3});
      expect(result3).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(2); // Should be called again due to different id
    });

    it('should handle edge cases with custom hashing', () => {
      const originalFunction = vi.fn((a, b) => a + b);
      const alwaysSameHash = () => 'same';
      const memoizedFunction = memoize(originalFunction, alwaysSameHash);

      const result1 = memoizedFunction(2, 3);
      expect(result1).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(1);

      const result2 = memoizedFunction(4, 5);
      expect(result2).toBe(5); // Note: This is the memoized result, not 9
      expect(originalFunction).toHaveBeenCalledTimes(1); // Should not be called again due to same hash
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should delay function execution', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, { delay: 1000 });

      debouncedFunc();
      expect(func).not.toBeCalled();

      vi.advanceTimersByTime(500);
      expect(func).not.toBeCalled();

      vi.advanceTimersByTime(500);
      expect(func).toBeCalledTimes(1);
    });

    it('should only execute once for multiple calls within delay', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, { delay: 1000 });

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      vi.advanceTimersByTime(1000);
      expect(func).toBeCalledTimes(1);
    });
    it('should accept a number as the second argument for delay', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, 500);

      debouncedFunc();
      vi.advanceTimersByTime(499);
      expect(func).not.toBeCalled();

      vi.advanceTimersByTime(1);
      expect(func).toBeCalledTimes(1);
    });

    it('should execute immediately if immediate option is true', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, { delay: 1000, immediate: true });

      debouncedFunc();
      expect(func).toBeCalledTimes(1);

      debouncedFunc();
      vi.advanceTimersByTime(1000);
      expect(func).toBeCalledTimes(1);
    });

    it('should allow to cancel delayed execution', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, { delay: 1000 });

      debouncedFunc();
      debouncedFunc.cancel();

      vi.advanceTimersByTime(1000);
      expect(func).not.toBeCalled();
    });

    it('should pass correct arguments to the debounced function', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, { delay: 1000 });

      debouncedFunc('a', 'b');
      vi.advanceTimersByTime(1000);

      expect(func).toBeCalledWith('a', 'b');
    });

    it('should maintain correct context', () => {
      const obj = {
        value: 'test',
        method: vi.fn(function() { return this.value; })
      };
      const debouncedMethod = debounce(obj.method, { delay: 1000 });

      debouncedMethod.call(obj);
      vi.advanceTimersByTime(1000);

      expect(obj.method).toBeCalled();
      expect(obj.method.mock.results[0].value).toBe('test');
    });
  });

});

describe('String Utilities', () => {
  it('should correctly convert kebab-case to camelCase', () => {
    expect(kebabToCamel('test-string')).toBe('testString');
  });

  it('should correctly convert camelCase to kebab-case', () => {
    expect(camelToKebab('testString')).toBe('test-string');
  });

  it('should capitalize the first letter of each word', () => {
    expect(capitalizeWords('test string')).toBe('Test String');
  });

  it('should convert a string to title case', () => {
    expect(toTitleCase('a simple test')).toBe('A Simple Test');
  });



  describe('joinWords', () => {
    it('should join words with default settings', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words)).toBe('apple, banana, and cherry');
    });

    it('should handle an empty array', () => {
      expect(joinWords([])).toBe('');
    });

    it('should handle a single word', () => {
      expect(joinWords(['apple'])).toBe('apple');
    });

    it('should handle two words', () => {
      expect(joinWords(['apple', 'banana'])).toBe('apple and banana');
    });

    it('should use custom separator', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words, { separator: '; ' })).toBe('apple; banana; and cherry');
    });

    it('should use custom last separator', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words, { lastSeparator: ' or ' })).toBe('apple, banana, or cherry');
    });

    it('should not use Oxford comma when specified', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words, { oxford: false })).toBe('apple, banana and cherry');
    });

    it('should add quotes when specified', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words, { quotes: true })).toBe('"apple", "banana", and "cherry"');
    });

    it('should apply transform function when provided', () => {
      const words = ['apple', 'banana', 'cherry'];
      const transform = (word) => word.toUpperCase();
      expect(joinWords(words, { transform })).toBe('APPLE, BANANA, and CHERRY');
    });

    it('should handle complex configuration', () => {
      const words = ['apple', 'banana', 'cherry', 'date'];
      const options = {
        separator: '; ',
        lastSeparator: ' or ',
        oxford: false,
        quotes: true,
        transform: (word) => word.charAt(0).toUpperCase() + word.slice(1)
      };
      expect(joinWords(words, options)).toBe('"Apple"; "Banana"; "Cherry" or "Date"');
    });

    it('should handle non-array input', () => {
      expect(joinWords('not an array')).toBe('');
    });

    it('should handle array with falsy values', () => {
      const words = ['apple', '', null, 'banana', undefined, 'cherry'];
      expect(joinWords(words)).toBe('apple, , , banana, , and cherry');
    });
  });
});

describe('ID/Hashing Functions', () => {


  describe('tokenize', () => {
    it('should convert a string to a token', () => {
      expect(tokenize('Hello World')).toBe('hello-world');
      expect(tokenize('A simple-test_string')).toBe('a-simple-test-string');
    });
  });

  describe('prettifyID', () => {
    it('should return "0" for input 0', () => {
      expect(prettifyID(0)).toBe('0');
    });

    it('should convert a number to base 36 representation', () => {
      expect(prettifyID(10)).toMatch(/^[0-9A-Z]+$/);
    });

    it('should handle large numbers correctly', () => {
      const largeNumber = 123456789012345;
      expect(prettifyID(largeNumber)).toMatch(/^[0-9A-Z]+$/);
    });
  });

  describe('hashCode', () => {
    it('should produce consistent hash code for the same input', () => {
      const input = 'Test String';
      expect(hashCode(input)).toBe(hashCode(input));
    });

    it('should generally produce unique hash codes for different inputs', () => {
      const input1 = 'Test String 1';
      const input2 = 'Test String 2';
      expect(hashCode(input1)).not.toBe(hashCode(input2));
    });

    it('should hash objects', () => {
      const input1 = { one: 'one', two: { one: 'one', two:'two' }};
      const input2 = { one: 'one', two: { one: 'two', two:'two' }};
      expect(hashCode(input1)).not.toBe(hashCode(input2));
    });

    it('should hash dates', () => {
      const date1 = new Date(2020, 0, 1);
      const date2 = new Date(2020, 0, 2);
      expect(hashCode(date1)).not.toBe(hashCode(date2));
    });

    it('should hash numbers', () => {
      const value1 = 5151;
      const value2 = 2121;
      expect(hashCode(value1)).not.toBe(hashCode(value2));
    });

    it('should produce different hash codes for similar inputs', () => {
      const input1 = 'Test String';
      const input2 = 'test string';
      expect(hashCode(input1)).not.toBe(hashCode(input2));
    });

    it('should handle extremely long inputs', () => {
      const longInput = 'a'.repeat(100000);
      expect(() => hashCode(longInput)).not.toThrow();
    });

    it('should handle inputs with special characters', () => {
      const specialInput = '!@#$%^&*()_+{}[]|\\:;"<>,.?/~`';
      expect(() => hashCode(specialInput)).not.toThrow();
    });

    it('should handle inputs with Unicode characters', () => {
      const unicodeInput = '你好世界 こんにちは世界 안녕하세요 세계';
      expect(() => hashCode(unicodeInput)).not.toThrow();
    });

    it('should handle inputs with emojis', () => {
      const emojiInput = '😀😃😄😁😆😅😂🤣';
      expect(() => hashCode(emojiInput)).not.toThrow();
    });

    it('should handle inputs with control characters', () => {
      const controlInput = '\n\r\t\b\f';
      expect(() => hashCode(controlInput)).not.toThrow();
    });

    it('should handle empty input', () => {
      expect(hashCode('')).toBeDefined();
    });

    it('should handle null input', () => {
      expect(hashCode(null)).toBeDefined();
    });

    it('should handle undefined input', () => {
      expect(hashCode(undefined)).toBeDefined();
    });

    it('should handle input with leading/trailing whitespace', () => {
      const input1 = 'Test String';
      const input2 = '  Test String  ';
      expect(hashCode(input1)).not.toBe(hashCode(input2));
    });

    it('should handle input with large integers', () => {
      const input = { value: Number.MAX_SAFE_INTEGER };
      expect(() => hashCode(input)).not.toThrow();
    });

    it('should handle input with small integers', () => {
      const input = { value: Number.MIN_SAFE_INTEGER };
      expect(() => hashCode(input)).not.toThrow();
    });

    it('should handle input with floating-point numbers', () => {
      const input = { value: 3.14159265359 };
      expect(() => hashCode(input)).not.toThrow();
    });

    it('should handle input with Infinity', () => {
      const input = { value: Infinity };
      expect(() => hashCode(input)).not.toThrow();
    });

    it('should handle input with -Infinity', () => {
      const input = { value: -Infinity };
      expect(() => hashCode(input)).not.toThrow();
    });

    it('should handle input with NaN', () => {
      const input = { value: NaN };
      expect(() => hashCode(input)).not.toThrow();
    });

    /* Annoying logs
    it('should handle circular references in objects', () => {
      const input = { a: 1 };
      input.self = input;
      expect(() => hashCode(input)).not.toThrow();
    });*/

    it('should handle deeply nested objects', () => {
      const input = { a: { b: { c: { d: { e: 'nested' } } } } };
      expect(() => hashCode(input)).not.toThrow();
    });
  });

  describe('generateID', () => {
    it('should generate a non-empty string', () => {
      expect(generateID()).toMatch(/^[0-9A-Z]+$/);
    });

    it('generated IDs should be unique', () => {
      const id1 = generateID();
      const id2 = generateID();
      expect(id1).not.toBe(id2);
    });
  });
});

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

  it('should clone deep objects', () => {
    const originalObject = {
      level1: {
        level2: {
          level3: {
            value: 'deep value'
          }
        }
      }
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


});


describe('regular expression utilities', () => {

  describe('escapeRegExp', () => {
    it('should escape characters that have special meaning in regex', () => {
      const specialChars = '. * + ? ^ $ { } ( ) | [ ] \\';
      const escaped = escapeRegExp(specialChars);
      expect(() => new RegExp(escaped)).not.toThrow();
    });
  });

  describe('escapeHTML', () => {
    it('should escape only HTML tag characters', () => {
      const input = '<div>Hello "World"</div>';
      const expected = '&ltdiv&gtHello &quotWorld&quot&lt/div&gt';
      expect(escapeHTML(input)).toBe(expected);
    });

    it('should not modify a string without special characters', () => {
      const input = 'Hello World';
      expect(escapeHTML(input)).toBe(input);
    });
  });

});

describe('iterators', () => {

  describe('each', () => {

    describe('Array iteration', () => {
      it('should iterate over all elements', () => {
        const array = [1, 2, 3];
        const spy = vi.fn();
        each(array, spy);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenNthCalledWith(1, 1, 0, array);
        expect(spy).toHaveBeenNthCalledWith(2, 2, 1, array);
        expect(spy).toHaveBeenNthCalledWith(3, 3, 2, array);
      });

      it('should break early if the callback returns false', () => {
        const array = [1, 2, 3];
        const spy = vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);
        each(array, spy);
        expect(spy).toHaveBeenCalledTimes(2);
      });
    });

    describe('Object iteration', () => {
      it('should iterate over all properties', () => {
        const obj = { a: 1, b: 2, c: 3 };
        const spy = vi.fn();
        each(obj, spy);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenCalledWith(1, 'a', obj);
        expect(spy).toHaveBeenCalledWith(2, 'b', obj);
        expect(spy).toHaveBeenCalledWith(3, 'c', obj);
      });

      it('should break early if the callback returns false', () => {
        const obj = { a: 1, b: 2, c: 3 };
        const spy = vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);
        each(obj, spy);
        expect(spy).toHaveBeenCalledTimes(2);
      });

      it('should not iterate over non-enumerable properties', () => {
        const obj = { a: 1, b: 2 };
        Object.defineProperty(obj, 'c', {
          value: 3,
          enumerable: false,
        });
        const spy = vi.fn();
        each(obj, spy);
        expect(spy).toHaveBeenCalledTimes(2); // should not include non-enumerable 'c'
        expect(spy).toHaveBeenCalledWith(1, 'a', obj);
        expect(spy).toHaveBeenCalledWith(2, 'b', obj);
        expect(spy).not.toHaveBeenCalledWith(3, 'c', obj); // ensure 'c' is not iterated
      });

    });

    it('should handle null/undefined gracefully', () => {
      const spy = vi.fn();
      each(null, spy);
      each(undefined, spy);
      expect(spy).not.toHaveBeenCalled();
    });

  });

  describe('asyncEach', () => {
    it('should iterate over an array asynchronously', async () => {
      const array = [1, 2, 3];
      const spy = vi.fn();
      await asyncEach(array, spy);
      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenNthCalledWith(1, 1, 0, array);
      expect(spy).toHaveBeenNthCalledWith(2, 2, 1, array);
      expect(spy).toHaveBeenNthCalledWith(3, 3, 2, array);
    });

    it('should handle null/undefined gracefully', async () => {
      const spy = vi.fn();
      await asyncEach(null, spy);
      await asyncEach(undefined, spy);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('asyncMap', () => {
    it('should map an array asynchronously', async () => {
      const array = [1, 2, 3];
      const result = await asyncMap(array, async (value) => value * 2);
      expect(result).toEqual([2, 4, 6]);
    });

    it('should map an object asynchronously', async () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = await asyncMap(obj, async (value) => value * 2);
      expect(result).toEqual({ a: 2, b: 4, c: 6 });
    });

    it('should handle null/undefined gracefully', async () => {
      const result1 = await asyncMap(null, async (value) => value);
      expect(result1).toBeNull();
      const result2 = await asyncMap(undefined, async (value) => value);
      expect(result2).toBeUndefined();
    });
  });

});
