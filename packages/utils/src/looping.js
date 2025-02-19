import { isArray, isObject, isFunction } from './types.js';

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
  const iteratee = context ? func.bind(context) : func;
  if (isObject(obj) || isFunction(obj)) {
    if (obj.length !== undefined && typeof obj.length === 'number') {
      obj = Array.from(obj);
    }
  }
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; ++i) {
      if (iteratee(obj[i], i, obj) === false) {
        break;
      }
    }
  }
  else {
    const keys = Object.keys(obj);
    for (let key of keys) {
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
  if (isObject(obj) || isFunction(obj)) {
    if (obj.length !== undefined && typeof obj.length === 'number') {
      obj = Array.from(obj);
    }
  }
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; ++i) {
      if (await iteratee(obj[i], i, obj) === false) {
        break;
      }
    }
  }
  else {
    const keys = Object.keys(obj);
    for (let key of keys) {
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
  const result = isArray(obj) ? [] : {};
  if (isObject(obj) || isFunction(obj)) {
    if (obj.length !== undefined && typeof obj.length === 'number') {
      obj = Array.from(obj);
    }
  }
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; ++i) {
      result[i] = await iteratee(obj[i], i, obj);
    }
  }
  else {
    const keys = Object.keys(obj);
    for (let key of keys) {
      result[key] = await iteratee(obj[key], key, obj);
    }
  }
  return result;
};

