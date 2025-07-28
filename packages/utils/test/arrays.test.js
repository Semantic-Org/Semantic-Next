import {
  difference,
  filterEmpty,
  findIndex,
  firstMatch,
  flatten,
  groupBy,
  inArray,
  intersection,
  last,
  moveItem,
  moveToBack,
  moveToFront,
  range,
  remove,
  some,
  sortBy,
  unique,
  uniqueItems,
  where,
} from '@semantic-ui/utils';

import { describe, expect, it, } from 'vitest';

describe('Array Utilities', () => {

  describe('unique', () => {
    it('should remove duplicates', () => {
      const arr = [1, 2, 2, 3, 4, 4, 5];
      const result = unique(arr);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('filterEmpty', () => {
    it('should remove falsey values', () => {
      const arr = [0, 1, false, 2, '', 3];
      const result = filterEmpty(arr);
      expect(result).toEqual([1, 2, 3]);
    });
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

  describe('last', () => {
    it('should return the last n elements', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(last(arr)).toEqual(5);
      expect(last(arr, 2)).toEqual([4, 5]);
    });
  });

  describe('firstMatch', () => {
    it('should return the first matching element based on callback', () => {
      const arr = [1, 2, 3, 4];
      const result = firstMatch(arr, x => x > 2);
      expect(result).toBe(3);
    });
  });

  describe('findIndex', () => {
    it('should return the index of the first matching element', () => {
      const arr = ['apple', 'banana', 'orange'];
      const index = findIndex(arr, fruit => fruit === 'banana');
      expect(index).toBe(1);
    });
  });

  describe('remove', () => {
    it('should remove elements based on a callback or value', () => {
      let arr = [1, 2, 3, 4];
      remove(arr, x => x === 3);
      expect(arr).toEqual([1, 2, 4]);

      arr = [1, 2, 3, 4];
      remove(arr, 2);
      expect(arr).toEqual([1, 3, 4]);
    });
  });

  describe('inArray', () => {
    it('should check if a value is in the array', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(inArray(3, arr)).toBe(true);
      expect(inArray(6, arr)).toBe(false);
    });
  });

  describe('range', () => {
    it('should create an array of numbers', () => {
      expect(range(1, 5)).toEqual([1, 2, 3, 4]);
      expect(range(0, 4, 5)).toEqual([0, 5, 10, 15]);
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
        { id: 3, name: 'Bob' },
      ];
      expect(moveItem(arr, item => item.name === 'Jane', 0))
        .toEqual([
          { id: 2, name: 'Jane' },
          { id: 1, name: 'John' },
          { id: 3, name: 'Bob' },
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
        { id: 3, name: 'Bob' },
      ];
      expect(moveToFront(arr, item => item.name === 'Jane'))
        .toEqual([
          { id: 2, name: 'Jane' },
          { id: 1, name: 'John' },
          { id: 3, name: 'Bob' },
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
        { id: 3, name: 'Bob' },
      ];
      expect(moveToBack(arr, item => item.name === 'Jane'))
        .toEqual([
          { id: 1, name: 'John' },
          { id: 3, name: 'Bob' },
          { id: 2, name: 'Jane' },
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
      const input = [{ a: 2 }, { a: 3 }, { a: 1 }];
      const expected = [{ a: 1 }, { a: 2 }, { a: 3 }];
      expect(sortBy(input, 'a')).toEqual(expected);
    });

    it('should sort by a nested key', () => {
      const input = [{ a: { b: 2 } }, { a: { b: 3 } }, { a: { b: 1 } }];
      const expected = [{ a: { b: 1 } }, { a: { b: 2 } }, { a: { b: 3 } }];
      expect(sortBy(input, 'a.b')).toEqual(expected);
    });

    it('should handle custom comparator', () => {
      const input = [{ a: 1 }, { a: 2 }, { a: 3 }];
      const expected = [{ a: 3 }, { a: 2 }, { a: 1 }];
      const reverseComparator = (a, b) => b - a;
      expect(sortBy(input, 'a', reverseComparator)).toEqual(expected);
    });

    it('should handle sorting with additional object context in comparator', () => {
      const input = [{ a: 1, b: 2 }, { a: 1, b: 1 }];
      const expected = [{ a: 1, b: 1 }, { a: 1, b: 2 }];
      const comparator = (valA, valB, objA, objB) => objA.b - objB.b;
      expect(sortBy(input, 'a', comparator)).toEqual(expected);
    });

    it('should return a new array and not mutate the original', () => {
      const input = [{ a: 1 }, { a: 2 }];
      const result = sortBy(input, 'a');
      expect(result).not.toBe(input);
      expect(result).toEqual([{ a: 1 }, { a: 2 }]);
    });

    it('should sort objects with undefined values last', () => {
      const input = [{ a: 1 }, { a: undefined }, { a: 2 }];
      const expected = [{ a: 1 }, { a: 2 }, { a: undefined }];
      expect(sortBy(input, 'a')).toEqual(expected);
    });

    it('should sort by multiple keys', () => {
      const input = [
        { sort: 2, name: 'c' },
        { sort: 1, name: 'b' },
        { sort: 1, name: 'a' },
        { sort: 2, name: 'a' },
      ];
      const expected = [
        { sort: 1, name: 'a' },
        { sort: 1, name: 'b' },
        { sort: 2, name: 'a' },
        { sort: 2, name: 'c' },
      ];
      expect(sortBy(input, ['sort', 'name'])).toEqual(expected);
    });

    it('should handle undefined values in multi-key sorting', () => {
      const input = [
        { sort: undefined, name: 'c' },
        { sort: 1, name: 'b' },
        { sort: 1, name: 'a' },
        { sort: undefined, name: 'a' },
      ];
      const expected = [
        { sort: 1, name: 'a' },
        { sort: 1, name: 'b' },
        { sort: undefined, name: 'a' },
        { sort: undefined, name: 'c' },
      ];
      expect(sortBy(input, ['sort', 'name'])).toEqual(expected);
    });

    it('should work with comparator and multi-key sorting', () => {
      const input = [
        { sort: 1, name: 'c' },
        { sort: 2, name: 'b' },
        { sort: 1, name: 'a' },
      ];
      const expected = [
        { sort: 2, name: 'b' },
        { sort: 1, name: 'a' },
        { sort: 1, name: 'c' },
      ];
      const smartComparator = (a, b, objA, objB, keyIndex) => {
        // For numbers, reverse sort, for strings, normal sort
        if (typeof a === 'number' && typeof b === 'number') {
          return b - a; // reverse for numbers
        }
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
      };
      expect(sortBy(input, ['sort', 'name'], smartComparator)).toEqual(expected);
    });

    it('should pass key index as fifth parameter to comparator', () => {
      const input = [{ a: 1, b: 2 }, { a: 1, b: 1 }];
      const keyIndexes = [];
      const comparator = (valA, valB, objA, objB, keyIndex) => {
        keyIndexes.push(keyIndex);
        return valA - valB;
      };
      sortBy(input, ['a', 'b'], comparator);
      expect(keyIndexes).toContain(0); // First key index
      expect(keyIndexes).toContain(1); // Second key index
    });

    it('should handle navigation use case with sortIndex and name fallback', () => {
      const input = [
        { sortIndex: undefined, name: 'zebra' },
        { sortIndex: 1, name: 'elephant' },
        { sortIndex: undefined, name: 'apple' },
        { sortIndex: 2, name: 'dog' },
        { sortIndex: 1, name: 'banana' },
        { sortIndex: undefined, name: 'cat' },
        { sortIndex: 3, name: 'fish' },
      ];
      const expected = [
        { sortIndex: 1, name: 'banana' },
        { sortIndex: 1, name: 'elephant' },
        { sortIndex: 2, name: 'dog' },
        { sortIndex: 3, name: 'fish' },
        { sortIndex: undefined, name: 'apple' },
        { sortIndex: undefined, name: 'cat' },
        { sortIndex: undefined, name: 'zebra' },
      ];
      expect(sortBy(input, ['sortIndex', 'name'])).toEqual(expected);
    });

    it('should handle accented characters and numeric strings correctly', () => {
      const input = [
        { name: 'café', version: 'v10' },
        { name: 'apple', version: 'v2' },
        { name: 'Café', version: 'v1' },
        { name: 'naïve', version: 'v20' },
        { name: 'resume', version: 'v3' },
        { name: 'résumé', version: 'v11' },
      ];

      // Test single key with accented characters
      const byName = sortBy(input, 'name');
      expect(byName[0].name).toBe('apple');
      expect(byName[1].name).toBe('café');
      expect(byName[2].name).toBe('Café');

      // Test numeric string sorting
      const byVersion = sortBy(input, 'version');
      expect(byVersion[0].version).toBe('v1');
      expect(byVersion[1].version).toBe('v2');
      expect(byVersion[2].version).toBe('v3');
      expect(byVersion[3].version).toBe('v10');
      expect(byVersion[4].version).toBe('v11');
      expect(byVersion[5].version).toBe('v20');
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


});
