import { isArray, isIterable, isFunction, isObject, isPlainObject, isMap, isSet, isNumber } from './types.js';

/*-------------------
      Looping
--------------------*/
/*
  Simplify iterating over objects and arrays
*/
export const each = (obj, func, context) => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // allow custom context
  const iteratee = context ? func.bind(context) : func;

  // Arrays - indexed loop fastest in V8
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; ++i) {
      if (iteratee(obj[i], i, obj) === false) {
        break;
      }
    }
    return obj;
  }

  // Plain objects (Object literals, {}) - avoid prototype chain walk
  if (isPlainObject(obj)) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      if (iteratee(obj[key], key, obj) === false) {
        break;
      }
    }
    return obj;
  }

  // Maps - native iteration preserves insertion order
  if (isMap(obj)) {
    for (const [key, value] of obj) {
      if (iteratee(value, key, obj) === false) break;
    }
    return obj;
  }

  // Iterables: Sets, Strings, TypedArrays, NodeLists
  if (isIterable(obj)) {
    let i = 0;
    for (const value of obj) {
      if (iteratee(value, i++, obj) === false) break;
    }
    return obj;
  }

  // Non-iterable array-likes: arguments (pre-ES6), jQuery objects - indexed access
  if (isNumber(obj.length)) {
    // Array-like objects (NodeList, arguments, etc.)
    for (let i = 0; i < obj.length; ++i) {
      if (iteratee(obj[i], i, obj) === false) {
        break;
      }
    }
  } else {
    // Non-plain objects: class instances, functions - Object.keys() for enumerable only
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      if (iteratee(obj[key], key, obj) === false) {
        break;
      }
    }
  }

  return obj;
};

export const asyncEach = async (obj, func, context) => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  const iteratee = context ? func.bind(context) : func;

  // Arrays - indexed loop fastest in V8
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; ++i) {
      if (await iteratee(obj[i], i, obj) === false) {
        break;
      }
    }
    return obj;
  }

  // Plain objects (Object literals, {})
  if (isPlainObject(obj)) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      if (await iteratee(obj[key], key, obj) === false) {
        break;
      }
    }
    return obj;
  }

  // Maps
  if (isMap(obj)) {
    for (const [key, value] of obj) {
      if (await iteratee(value, key, obj) === false) break;
    }
    return obj;
  }

  // Iterables: Sets, Strings, TypedArrays, NodeLists
  if (isIterable(obj)) {
    let i = 0;
    for (const value of obj) {
      if (await iteratee(value, i++, obj) === false) break;
    }
    return obj;
  }

  // Non-iterable array-likes: arguments (pre-ES6), jQuery objects - indexed access
  if (isNumber(obj.length)) {
    // Array-like objects (NodeList, arguments, etc.)
    for (let i = 0; i < obj.length; ++i) {
      if (await iteratee(obj[i], i, obj) === false) {
        break;
      }
    }
  } else {
    // Non-plain objects: class instances, functions - Object.keys() for enumerable only
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      if (await iteratee(obj[key], key, obj) === false) {
        break;
      }
    }
  }

  return obj;
};

/*
  Asynchronous mapping over objects and arrays
*/
export const asyncMap = async (obj, func, context) => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  const iteratee = context ? func.bind(context) : func;

  // Arrays - indexed loop fastest in V8
  if (isArray(obj)) {
    const result = [];
    for (let i = 0; i < obj.length; ++i) {
      result[i] = await iteratee(obj[i], i, obj);
    }
    return result;
  }

  // Plain objects (Object literals, {})
  if (isPlainObject(obj)) {
    const result = {};
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      result[key] = await iteratee(obj[key], key, obj);
    }
    return result;
  }

  // Maps - return new Map with mapped values
  if (isMap(obj)) {
    const result = new Map();
    for (const [key, value] of obj) {
      result.set(key, await iteratee(value, key, obj));
    }
    return result;
  }

  // Sets and other iterables - return array of mapped values
  if (isIterable(obj)) {
    const result = [];
    let i = 0;
    for (const value of obj) {
      result.push(await iteratee(value, i++, obj));
    }
    return result;
  }

  // Non-iterable array-likes - Array.from() once vs repeated access
  if (isNumber(obj.length)) {
    const arr = Array.from(obj);
    const result = [];
    for (let i = 0; i < arr.length; ++i) {
      result[i] = await iteratee(arr[i], i, arr);
    }
    return result;
  }

  // Other objects - class instances, functions with properties
  const result = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    result[key] = await iteratee(obj[key], key, obj);
  }
  return result;
};
