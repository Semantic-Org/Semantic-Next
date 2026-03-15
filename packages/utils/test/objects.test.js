import {
  any,
  arrayFromObject,
  deepExtend,
  extend,
  filterObject,
  get,
  hasProperty,
  keys,
  mapObject,
  onlyKeys,
  pick,
  proxyObject,
  reverseKeys,
  some,
  values,
  weightedObjectSearch,
} from '@semantic-ui/utils';

import { describe, expect, it, vi } from 'vitest';

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
        get b() {
          return 2;
        },
        set b(val) {
          this.c = val;
        },
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
    it("reverseKeys should reverse a lookup object's keys and values", () => {
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

  describe('weightedObjectSearch', () => {
    const testData = [
      { name: 'Apple iPhone', category: 'phone', tags: ['mobile', 'apple'] },
      { name: 'Samsung Galaxy', category: 'phone', tags: ['mobile', 'android'] },
      { name: 'iPad Pro', category: 'tablet', tags: ['tablet', 'apple'] },
      { name: 'MacBook Air', category: 'laptop', tags: ['laptop', 'apple'] },
    ];

    it('should return all objects when query is empty', () => {
      const result = weightedObjectSearch('', testData, {
        propertiesToMatch: ['name', 'category'],
      });
      expect(result).toEqual(testData);
    });

    it('should filter objects based on query match', () => {
      const result = weightedObjectSearch('apple', testData, {
        propertiesToMatch: ['name', 'category', 'tags'],
      });
      expect(result.length).toBe(3);
      expect(result.some(item => item.name === 'Apple iPhone')).toBe(true);
      expect(result.some(item => item.name === 'iPad Pro')).toBe(true);
      expect(result.some(item => item.name === 'MacBook Air')).toBe(true);
    });

    it('should sort results by relevance (weight)', () => {
      const result = weightedObjectSearch('apple', testData, {
        propertiesToMatch: ['name', 'category', 'tags'],
      });
      expect(result[0].name).toBe('Apple iPhone');
    });

    it('should handle queries with multiple words when matchAllWords is true', () => {
      const multiData = [
        { name: 'Apple laptop', category: 'computer' },
        { name: 'Samsung laptop', category: 'computer' },
        { name: 'Apple tablet', category: 'tablet' },
      ];
      const result = weightedObjectSearch('Apple laptop', multiData, {
        propertiesToMatch: ['name', 'category'],
        matchAllWords: true,
      });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].name).toBe('Apple laptop');
    });

    it('should return matches with details when returnMatches is true', () => {
      const result = weightedObjectSearch('apple', testData, {
        propertiesToMatch: ['name', 'tags'],
        returnMatches: true,
      });
      expect(result[0].matches).toBeDefined();
      expect(Array.isArray(result[0].matches)).toBe(true);
    });

    it('should handle single word match with case insensitivity', () => {
      const result = weightedObjectSearch('IPHONE', testData, {
        propertiesToMatch: ['name'],
      });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Apple iPhone');
    });

    it('should find items with ANY word when matchAllWords is false', () => {
      const freshData = [
        { name: 'Apple iPhone' },
        { name: 'Samsung Galaxy' },
      ];
      const result = weightedObjectSearch('apple samsung', freshData, {
        propertiesToMatch: ['name'],
        matchAllWords: false,
      });
      expect(result.length).toBe(2);
      expect(result.some(r => r.name === 'Apple iPhone')).toBe(true);
      expect(result.some(r => r.name === 'Samsung Galaxy')).toBe(true);
    });

    it('should handle special regex characters in query', () => {
      const specialData = [
        { name: 'Test (special)', category: 'test' },
        { name: 'Normal item', category: 'test' },
      ];
      const result = weightedObjectSearch('special', specialData, {
        propertiesToMatch: ['name'],
      });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Test (special)');
    });

    it('should handle trimmed queries', () => {
      const result = weightedObjectSearch('  iPhone  ', testData, {
        propertiesToMatch: ['name'],
      });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Apple iPhone');
    });

    it('should return empty array when no matches found', () => {
      const result = weightedObjectSearch('nonexistent', testData, {
        propertiesToMatch: ['name', 'category'],
      });
      expect(result).toEqual([]);
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

  describe('deepExtend', () => {
    it('should deeply merge objects', () => {
      const target = { a: { b: 1, c: 2 }, d: 3 };
      const source = { a: { b: 4, e: 5 }, f: 6 };

      const result = deepExtend(target, source);

      expect(result).toBe(target); // Should return target reference
      expect(result).toEqual({
        a: { b: 4, c: 2, e: 5 },
        d: 3,
        f: 6,
      });
    });

    it('should handle multiple sources', () => {
      const target = { a: { x: 1 } };
      const source1 = { a: { y: 2 }, b: 1 };
      const source2 = { a: { z: 3 }, c: 2 };

      deepExtend(target, source1, source2);

      expect(target).toEqual({
        a: { x: 1, y: 2, z: 3 },
        b: 1,
        c: 2,
      });
    });

    it('should clone non-plain objects', () => {
      const date = new Date('2023-01-01');
      const regex = /test/g;
      const arr = [1, 2, { nested: true }];

      const target = {};
      const source = { date, regex, arr };

      deepExtend(target, source);

      expect(target.date).toEqual(date);
      expect(target.date).not.toBe(date); // Should be cloned
      expect(target.regex).toEqual(regex);
      expect(target.regex).not.toBe(regex); // Should be cloned
      expect(target.arr).toEqual(arr);
      expect(target.arr).not.toBe(arr); // Should be cloned
      expect(target.arr[2]).not.toBe(arr[2]); // Deep clone
    });

    it('should not preserve custom class instances when preserveNonCloneable is false', () => {
      class CustomClass {
        constructor(value) {
          this.value = value;
        }
        getValue() {
          return this.value;
        }
      }

      const instance = new CustomClass(42);
      const target = {};
      const source = { custom: instance };

      deepExtend(target, source, { preserveNonCloneable: false });

      expect(target.custom).not.toBe(instance); // Same reference
      expect(target.custom instanceof CustomClass).toBe(false);
    });

    it('should preserve custom class instances by default', () => {
      class CustomClass {
        constructor(value) {
          this.value = value;
        }
        getValue() {
          return this.value;
        }
      }

      const instance = new CustomClass(42);
      const target = {};
      const source = { custom: instance };

      deepExtend(target, source);

      expect(target.custom).toBe(instance);
      expect(target.custom instanceof CustomClass).toBe(true);
      expect(target.custom.value).toBe(42);
      expect(target.custom.getValue).toBeDefined();
    });

    it('should skip __proto__ for security', () => {
      const target = {};
      // JSON.parse creates an actual own property named "__proto__"
      // unlike literal { __proto__: ... } which sets the prototype
      const source = JSON.parse('{"__proto__": {"malicious": true}, "safe": "value"}');

      deepExtend(target, source);

      expect(target.safe).toBe('value');
      expect(target.malicious).toBeUndefined();
      // __proto__ should not have been copied as a property
      expect(Object.hasOwnProperty.call(target, '__proto__')).toBe(false);
    });

    it('should prevent recursion', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      source.circular = target; // Create circular reference

      deepExtend(target, source);

      expect(target.a).toBe(1);
      expect(target.b).toBe(2);
      expect(target.circular).toBeUndefined(); // Should not add circular reference
    });

    it('should skip non-plain objects as sources', () => {
      const target = { a: 1 };
      const date = new Date();
      const array = [1, 2, 3];

      deepExtend(target, date, array, null, undefined);

      expect(target).toEqual({ a: 1 }); // Should remain unchanged
    });

    it('should return target unchanged if target is not an object', () => {
      expect(deepExtend(null, { a: 1 })).toBe(null);
      expect(deepExtend(undefined, { a: 1 })).toBe(undefined);
      expect(deepExtend(42, { a: 1 })).toBe(42);
      expect(deepExtend('string', { a: 1 })).toBe('string');
    });

    it('should overwrite target properties when source has non-plain objects', () => {
      const target = { a: { deep: 'value' } };
      const source = { a: [1, 2, 3] };

      deepExtend(target, source);

      expect(target.a).toEqual([1, 2, 3]);
      expect(target.a).not.toBe(source.a); // Should be cloned
    });

    it('should create new objects when target property is non-plain', () => {
      const target = { a: [1, 2, 3] };
      const source = { a: { b: 'value' } };

      deepExtend(target, source);

      expect(target.a).toEqual({ b: 'value' });
    });

    it('should handle deeply nested structures', () => {
      const target = {
        level1: {
          level2: {
            level3: {
              value: 'original',
            },
          },
        },
      };

      const source = {
        level1: {
          level2: {
            level3: {
              newValue: 'added',
            },
            newLevel3: 'also added',
          },
        },
      };

      deepExtend(target, source);

      expect(target).toEqual({
        level1: {
          level2: {
            level3: {
              value: 'original',
              newValue: 'added',
            },
            newLevel3: 'also added',
          },
        },
      });
    });
  });
});
