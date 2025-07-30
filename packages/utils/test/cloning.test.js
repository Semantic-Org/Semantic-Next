import {
  clone,
} from '@semantic-ui/utils';

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
      custom: instance 
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
      custom: instance 
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
