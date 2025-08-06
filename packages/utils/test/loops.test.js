import {
  asyncEach,
  asyncMap,
  each,
} from '@semantic-ui/utils';

import { describe, expect, it, vi } from 'vitest';

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

    describe('Set iteration', () => {
      it('should iterate over all Set values', () => {
        const set = new Set([1, 2, 3]);
        const spy = vi.fn();
        each(set, spy);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenNthCalledWith(1, 1, 0, set);
        expect(spy).toHaveBeenNthCalledWith(2, 2, 1, set);
        expect(spy).toHaveBeenNthCalledWith(3, 3, 2, set);
      });

      it('should break early if the callback returns false on Set', () => {
        const set = new Set(['a', 'b', 'c']);
        const spy = vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);
        each(set, spy);
        expect(spy).toHaveBeenCalledTimes(2);
      });

      it('should handle empty Set', () => {
        const set = new Set();
        const spy = vi.fn();
        each(set, spy);
        expect(spy).not.toHaveBeenCalled();
      });

      it('should handle Set with mixed types', () => {
        const set = new Set([1, 'two', { three: 3 }, null]);
        const values = [];
        each(set, (value) => {
          values.push(value);
        });
        expect(values).toEqual([1, 'two', { three: 3 }, null]);
      });
    });

    describe('Map iteration', () => {
      it('should iterate over all Map entries', () => {
        const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
        const spy = vi.fn();
        each(map, spy);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenNthCalledWith(1, 1, 'a', map);
        expect(spy).toHaveBeenNthCalledWith(2, 2, 'b', map);
        expect(spy).toHaveBeenNthCalledWith(3, 3, 'c', map);
      });

      it('should break early if the callback returns false on Map', () => {
        const map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);
        const spy = vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);
        each(map, spy);
        expect(spy).toHaveBeenCalledTimes(2);
      });

      it('should handle empty Map', () => {
        const map = new Map();
        const spy = vi.fn();
        each(map, spy);
        expect(spy).not.toHaveBeenCalled();
      });

      it('should handle Map with mixed key types', () => {
        const objKey = { key: 'object' };
        const map = new Map([[1, 'number'], ['str', 'string'], [objKey, 'object']]);
        const entries = [];
        each(map, (value, key) => {
          entries.push([key, value]);
        });
        expect(entries).toEqual([[1, 'number'], ['str', 'string'], [objKey, 'object']]);
      });

      it('should iterate Map in insertion order', () => {
        const map = new Map();
        map.set('z', 26);
        map.set('a', 1);
        map.set('m', 13);
        const keys = [];
        each(map, (value, key) => {
          keys.push(key);
        });
        expect(keys).toEqual(['z', 'a', 'm']);
      });
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

    describe('Set iteration', () => {
      it('should iterate over all Set values asynchronously', async () => {
        const set = new Set([1, 2, 3]);
        const spy = vi.fn();
        await asyncEach(set, spy);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenNthCalledWith(1, 1, 0, set);
        expect(spy).toHaveBeenNthCalledWith(2, 2, 1, set);
        expect(spy).toHaveBeenNthCalledWith(3, 3, 2, set);
      });

      it('should break early if the callback returns false on Set', async () => {
        const set = new Set(['a', 'b', 'c']);
        const spy = vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false);
        await asyncEach(set, spy);
        expect(spy).toHaveBeenCalledTimes(2);
      });

      it('should handle async callbacks with Set', async () => {
        const set = new Set([1, 2, 3]);
        const results = [];
        await asyncEach(set, async (value) => {
          await new Promise(resolve => setTimeout(resolve, 10));
          results.push(value * 2);
        });
        expect(results).toEqual([2, 4, 6]);
      });
    });

    describe('Map iteration', () => {
      it('should iterate over all Map entries asynchronously', async () => {
        const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
        const spy = vi.fn();
        await asyncEach(map, spy);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenNthCalledWith(1, 1, 'a', map);
        expect(spy).toHaveBeenNthCalledWith(2, 2, 'b', map);
        expect(spy).toHaveBeenNthCalledWith(3, 3, 'c', map);
      });

      it('should break early if the callback returns false on Map', async () => {
        const map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);
        const spy = vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false);
        await asyncEach(map, spy);
        expect(spy).toHaveBeenCalledTimes(2);
      });

      it('should handle async callbacks with Map', async () => {
        const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
        const results = [];
        await asyncEach(map, async (value, key) => {
          await new Promise(resolve => setTimeout(resolve, 10));
          results.push(`${key}: ${value * 2}`);
        });
        expect(results).toEqual(['a: 2', 'b: 4', 'c: 6']);
      });

      it('should maintain Map iteration order asynchronously', async () => {
        const map = new Map();
        map.set('z', 26);
        map.set('a', 1);
        map.set('m', 13);
        const keys = [];
        await asyncEach(map, async (value, key) => {
          keys.push(key);
        });
        expect(keys).toEqual(['z', 'a', 'm']);
      });
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

    describe('Set mapping', () => {
      it('should map a Set to an array asynchronously', async () => {
        const set = new Set([1, 2, 3]);
        const result = await asyncMap(set, async (value) => value * 2);
        expect(result).toEqual([2, 4, 6]);
        expect(Array.isArray(result)).toBe(true);
      });

      it('should map a Set with async operations', async () => {
        const set = new Set(['a', 'b', 'c']);
        const result = await asyncMap(set, async (value, index) => {
          await new Promise(resolve => setTimeout(resolve, 10));
          return `${index}-${value.toUpperCase()}`;
        });
        expect(result).toEqual(['0-A', '1-B', '2-C']);
      });

      it('should handle empty Set', async () => {
        const set = new Set();
        const result = await asyncMap(set, async (value) => value);
        expect(result).toEqual([]);
      });

      it('should map Set with mixed types', async () => {
        const set = new Set([1, 'two', { val: 3 }]);
        const result = await asyncMap(set, async (value, index) => {
          return typeof value === 'object' ? value.val : value;
        });
        expect(result).toEqual([1, 'two', 3]);
      });
    });

    describe('Map mapping', () => {
      it('should map a Map to a new Map asynchronously', async () => {
        const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
        const result = await asyncMap(map, async (value) => value * 2);
        expect(result).toBeInstanceOf(Map);
        expect(Array.from(result)).toEqual([['a', 2], ['b', 4], ['c', 6]]);
      });

      it('should map Map with async operations preserving key types', async () => {
        const objKey = { id: 1 };
        const map = new Map([[1, 'one'], ['str', 'two'], [objKey, 'three']]);
        const result = await asyncMap(map, async (value, key) => {
          await new Promise(resolve => setTimeout(resolve, 10));
          return `${value}-processed`;
        });
        expect(result).toBeInstanceOf(Map);
        expect(result.get(1)).toBe('one-processed');
        expect(result.get('str')).toBe('two-processed');
        expect(result.get(objKey)).toBe('three-processed');
      });

      it('should handle empty Map', async () => {
        const map = new Map();
        const result = await asyncMap(map, async (value) => value);
        expect(result).toBeInstanceOf(Map);
        expect(result.size).toBe(0);
      });

      it('should maintain Map insertion order', async () => {
        const map = new Map();
        map.set('z', 26);
        map.set('a', 1);
        map.set('m', 13);
        const result = await asyncMap(map, async (value) => value * 10);
        const entries = Array.from(result);
        expect(entries).toEqual([['z', 260], ['a', 10], ['m', 130]]);
      });

      it('should map Map with complex transformations', async () => {
        const map = new Map([['user1', { age: 25 }], ['user2', { age: 30 }]]);
        const result = await asyncMap(map, async (value, key) => {
          await new Promise(resolve => setTimeout(resolve, 5));
          return {
            ...value,
            id: key,
            isAdult: value.age >= 18
          };
        });
        expect(result.get('user1')).toEqual({ age: 25, id: 'user1', isAdult: true });
        expect(result.get('user2')).toEqual({ age: 30, id: 'user2', isAdult: true });
      });
    });
  });

  describe('String iteration', () => {
    it('should iterate over string characters with each', () => {
      const str = 'hello';
      const spy = vi.fn();
      each(str, spy);
      expect(spy).toHaveBeenCalledTimes(5);
      expect(spy).toHaveBeenNthCalledWith(1, 'h', 0, str);
      expect(spy).toHaveBeenNthCalledWith(2, 'e', 1, str);
      expect(spy).toHaveBeenNthCalledWith(3, 'l', 2, str);
      expect(spy).toHaveBeenNthCalledWith(4, 'l', 3, str);
      expect(spy).toHaveBeenNthCalledWith(5, 'o', 4, str);
    });

    it('should break early when iterating string characters', () => {
      const str = 'world';
      const spy = vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);
      each(str, spy);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(1, 'w', 0, str);
      expect(spy).toHaveBeenNthCalledWith(2, 'o', 1, str);
    });

    it('should handle empty string', () => {
      const str = '';
      const spy = vi.fn();
      each(str, spy);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should iterate over string characters with asyncEach', async () => {
      const str = 'test';
      const spy = vi.fn();
      await asyncEach(str, spy);
      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy).toHaveBeenNthCalledWith(1, 't', 0, str);
      expect(spy).toHaveBeenNthCalledWith(2, 'e', 1, str);
      expect(spy).toHaveBeenNthCalledWith(3, 's', 2, str);
      expect(spy).toHaveBeenNthCalledWith(4, 't', 3, str);
    });

    it('should break early when iterating string characters asynchronously', async () => {
      const str = 'async';
      const spy = vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false);
      await asyncEach(str, spy);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(1, 'a', 0, str);
      expect(spy).toHaveBeenNthCalledWith(2, 's', 1, str);
    });

    it('should handle async callbacks with string characters', async () => {
      const str = 'hi';
      const results = [];
      await asyncEach(str, async (char, index) => {
        await new Promise(resolve => setTimeout(resolve, 5));
        results.push(`${index}-${char.toUpperCase()}`);
      });
      expect(results).toEqual(['0-H', '1-I']);
    });

    it('should map string characters to array with asyncMap', async () => {
      const str = 'map';
      const result = await asyncMap(str, async (char, index) => {
        return `${index}:${char.toUpperCase()}`;
      });
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(['0:M', '1:A', '2:P']);
    });

    it('should handle unicode characters correctly', () => {
      const str = '🎉🔥';
      const chars = [];
      each(str, (char) => {
        chars.push(char);
      });
      expect(chars).toEqual(['🎉', '🔥']);
    });
  });
});
