import { describe, expect, it, vi } from 'vitest';
import { tokenize,
  arrayFromObject,
  asyncEach,
  asyncMap,
  camelToKebab,
  capitalizeWords,
  clone,
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
  groupBy,
  hashCode,
  hasProperty,
  inArray,
  isArguments,
  isArray,
  isBinary,
  isEqual,
  isFunction,
  isNumber,
  isObject,
  isPlainObject,
  isPromise,
  isString,
  kebabToCamel,
  keys,
  last,
  mapObject,
  noop,
  pick,
  prettifyID,
  proxyObject,
  range,
  remove,
  reverseKeys,
  some,
  sortBy,
  toTitleCase,
  tokenize,
  unique,
  values,
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

  it('formatDate should format dates according to provided patterns', () => {
    const testDate = new Date('2023-01-01T12:00:00Z');
    expect(formatDate(testDate, 'YYYY-MM-DD')).toBe('2023-01-01');
    // Add more assertions for different formats
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
});

describe('String Conversion', () => {
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
