import { isEqual } from './equality.js';
import { each } from './loops.js';
import { get } from './objects.js';
import { isFunction } from './types.js';

/*-------------------
        Arrays
--------------------*/

/*
  Remove duplicates from an array
*/
export const unique = (arr) => {
  return Array.from(new Set(arr));
};

/*
  Remove undefined values from an array
*/
export const filterEmpty = (arr) => {
  return arr.filter((val) => val);
};

/*
  Get last element from array
*/
export const last = (array = [], number = 1) => {
  const { length } = array;
  if (!length) { return; }

  if (number === 1) {
    // Return the last element
    return array[length - 1];
  }
  else {
    // Return the last number elements as a new array
    return array.slice(Math.max(length - number, 0));
  }
};
/*
  Get first element(s) from array
*/
export const first = (array, number = 1) => {
  const { length } = array;
  if (!length) { return; }

  if (number === 1) {
    // Return the first element
    return array[0];
  }
  else {
    // Return the first number elements as a new array
    return array.slice(0, number);
  }
};

/*
  Iterate through returning first value
*/
export const firstMatch = (array = [], callbackOrValue) => {
  const callback = isFunction(callbackOrValue)
    ? callbackOrValue
    : (val) => isEqual(val, callbackOrValue);

  let result;
  each(array, (value, index) => {
    if (callback(value, index, array)) {
      result = value;
      return false;
    }
  });
  return result;
};

/*
  Find the index of the first match
*/
export const findIndex = (array = [], callbackOrValue) => {
  const callback = isFunction(callbackOrValue)
    ? callbackOrValue
    : (val) => isEqual(val, callbackOrValue);

  let matchedIndex = -1;
  each(array, (value, index) => {
    if (callback(value, index, array)) {
      matchedIndex = index;
      return false;
    }
  });
  return matchedIndex;
};

/*
  Remove matching elements in place, return count removed
*/
export const remove = (array = [], callbackOrValue) => {
  const callback = isFunction(callbackOrValue)
    ? callbackOrValue
    : (val) => isEqual(val, callbackOrValue);

  let writeIndex = 0;
  const originalLength = array.length;

  // Single pass: keep non-matching elements
  for (let readIndex = 0; readIndex < originalLength; readIndex++) {
    if (!callback(array[readIndex], readIndex, array)) {
      // Only write if we need to shift
      if (writeIndex !== readIndex) {
        array[writeIndex] = array[readIndex];
      }
      writeIndex++;
    }
  }

  // Truncate the array to remove extra elements
  const removedCount = originalLength - writeIndex;
  array.length = writeIndex;

  return removedCount;
};

/*
  Check if a value exists in an array
*/
export const inArray = (value, array = []) => {
  return array.indexOf(value) > -1;
};

/*
  Generate an array of numbers from start to stop (exclusive)
*/
export const range = (start, stop, step) => {
  // Fast path: range(stop) — most common use case
  if (stop === undefined) {
    const len = start > 0 ? start : 0;
    const arr = new Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = i;
    }
    return arr;
  }

  step = step !== undefined ? step : 1;
  if (step === 0) { return []; }

  const length = Math.max(Math.ceil((stop - start) / step), 0);
  if (length === 0) { return []; }

  const arr = new Array(length);
  if (step % 1 === 0) {
    for (let i = 0, val = start; i < length; i++, val += step) {
      arr[i] = val;
    }
  }
  else {
    for (let i = 0; i < length; i++) {
      arr[i] = start + i * step;
    }
  }
  return arr;
};

/*
  Generate a sequence of multiples
*/
export const sequence = (count, interval = 1, start = 1) => {
  const len = count | 0;
  if (len <= 0) { return []; }
  const arr = new Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = (start + i) * interval;
  }
  return arr;
};

/*
  Sum all values in an array
*/
export const sum = (values = []) => {
  return values.reduce((acc, num) => acc + num, 0);
};

/*
  Filter array by matching property values
*/
export const where = (array = [], properties) => {
  return array.filter((obj) => Object.keys(properties).every((key) => obj[key] === properties[key]));
};

/*
  Deep flatten a nested array
*/
export const flatten = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) { return []; }

  const result = [];
  const stackArr = [arr];
  const stackIdx = [0];
  let depth = 0;

  while (depth >= 0) {
    const current = stackArr[depth];
    const len = current.length;
    let i = stackIdx[depth];

    while (i < len) {
      const item = current[i];
      if (Array.isArray(item)) {
        stackIdx[depth] = i + 1;
        depth++;
        stackArr[depth] = item;
        stackIdx[depth] = 0;
        break;
      }
      result.push(item);
      i++;
    }

    if (i >= len) {
      stackArr[depth] = null;
      depth--;
    }
  }

  return result;
};

/*
  Check if any element matches a predicate
*/
export const some = (collection, predicate) => {
  return (collection?.some)
    ? collection.some(predicate)
    : false;
};
export const any = some;

const collator = new Intl.Collator(undefined, { numeric: true });

/*
  Sort an array of objects by one or more keys
*/
export const sortBy = (arr = [], key, comparator) => {
  if (!arr || !arr.length) { return []; }

  const keys = Array.isArray(key) ? key : [key];
  const keyCount = keys.length;

  // Compare by each key in order until we find a difference
  const compare = (a, b) => {
    for (let i = 0; i < keyCount; i++) {
      const valA = get(a, keys[i]);
      const valB = get(b, keys[i]);

      // Place undefined values at the end
      if (valA === undefined && valB === undefined) { continue; }
      if (valA === undefined) { return 1; }
      if (valB === undefined) { return -1; }

      let result;
      if (comparator) {
        result = comparator(valA, valB, a, b, i);
      }
      else if (typeof valA === 'string' && typeof valB === 'string') {
        result = collator.compare(valA, valB);
      }
      else {
        if (valA < valB) { result = -1; }
        else if (valA > valB) { result = 1; }
        else { result = 0; }
      }

      if (result !== 0) { return result; }
    }
    return 0;
  };

  return arr.slice().sort(compare);
};

/*
  Group array elements by a property value
*/
export const groupBy = (array = [], property) => {
  return array.reduce((result, obj) => {
    const key = get(obj, property);
    if (key !== undefined) {
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(obj);
    }
    return result;
  }, {});
};

/*
  Move an element to a specific position
*/
export const moveItem = (array = [], callbackOrValue, index) => {
  const callback = isFunction(callbackOrValue)
    ? callbackOrValue
    : (val) => isEqual(val, callbackOrValue);

  const sourceIndex = findIndex(array, callback);
  if (sourceIndex === -1) {
    return array;
  }

  // Handle special index values
  let targetIndex;
  if (index === 'first') {
    targetIndex = 0;
  }
  else if (index === 'last') {
    targetIndex = array.length - 1;
  }
  else {
    targetIndex = Math.min(Math.max(0, index), array.length - 1);
  }

  // Don't move if already at target index
  if (sourceIndex === targetIndex) {
    return array;
  }

  const [item] = array.splice(sourceIndex, 1);
  array.splice(targetIndex, 0, item);
  return array;
};

/*
  Move an element to the front of the array
*/
export const moveToFront = (array = [], callbackOrValue) => {
  return moveItem(array, callbackOrValue, 'first');
};

/*
  Move an element to the back of the array
*/
export const moveToBack = (array = [], callbackOrValue) => {
  return moveItem(array, callbackOrValue, 'last');
};

/* In perf testing in Chrome 131
  this seems like the highest performing crossover
  lodash puts this at 120 but its unclear their testing
  <https://jsperf.app/quzoto/3>
*/
const ARRAY_SIZE_THRESHOLD = 58;

/* Returns the common items between two arrays */
export const intersection = (...arrays) => {
  if (arrays.length === 0) { return []; }
  if (arrays.length === 1) { return [...new Set(arrays[0])]; }

  const totalSize = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const useSet = totalSize >= ARRAY_SIZE_THRESHOLD;

  const [first, ...rest] = arrays;
  const firstUnique = [...new Set(first)];

  if (useSet) {
    const sets = rest.map(arr => new Set(arr));
    return firstUnique.filter(item => sets.every(set => set.has(item)));
  }

  return firstUnique.filter(item => rest.every(arr => arr.includes(item)));
};

/* Returns the difference between two arrays */
export const difference = (...arrays) => {
  if (arrays.length === 0) { return []; }
  if (arrays.length === 1) { return [...new Set(arrays[0])]; }

  const totalSize = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const useSet = totalSize >= ARRAY_SIZE_THRESHOLD;

  const [first, ...rest] = arrays;
  const firstUnique = [...new Set(first)];

  if (useSet) {
    const sets = rest.map(arr => new Set(arr));
    return firstUnique.filter(item => !sets.some(set => set.has(item)));
  }

  return firstUnique.filter(item => !rest.some(arr => arr.includes(item)));
};

/* Returns only items unique to an array */
export const uniqueItems = (...arrays) => {
  if (arrays.length <= 1) { return []; }

  const totalSize = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const useSet = totalSize >= ARRAY_SIZE_THRESHOLD;

  if (useSet) {
    const sets = arrays.map(arr => new Set(arr));
    return arrays.flatMap((arr, i) =>
      [...new Set(arr)].filter(item => !sets.some((set, j) => i !== j && set.has(item)))
    );
  }

  return arrays.flatMap((arr, i) =>
    [...new Set(arr)].filter(item => !arrays.some((otherArr, j) => i !== j && otherArr.includes(item)))
  );
};
