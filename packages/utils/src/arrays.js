import { get } from './objects.js';
import { each, isEqual } from './collections.js';
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
  if (!length) return;

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
  if (!length) return;

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
export const firstMatch = (array = [], callback) => {
  let result;
  each(array, (value, index) => {
    if (callback(value, index, array)) {
      result = value;
      return false;
    }
  });
  return result;
};

export const findIndex = (array = [], callback) => {
  let matchedIndex = -1;
  each(array, (value, index) => {
    if (callback(value, index, array)) {
      matchedIndex = index;
      return false;
    }
  });
  return matchedIndex;
};

export const remove = (array = [], callbackOrValue) => {
  const callback = isFunction(callbackOrValue)
    ? callbackOrValue
    : (val) => isEqual(val, callbackOrValue);
  const index = findIndex(array, callback);
  if (index > -1) {
    array.splice(index, 1);
    return true;
  }
  return false;
};

export const inArray = (value, array = []) => {
  return array.indexOf(value) > -1;
};

export const range = (start, stop, step = 1) => {
  if (!stop) {
    stop = start;
    start = 0;
  }
  const length = stop - start;
  return Array(length)
    .fill()
    .map((x, index) => {
      return index * step + start;
    });
};

export const sum = (values = []) => {
  return values.reduce((acc, num) => acc + num, 0);
};

export const where = (array = [], properties) => {
  return array.filter((obj) =>
    Object.keys(properties).every((key) => obj[key] === properties[key])
  );
};

export const flatten = (arr = []) => {
  return arr.reduce((acc, val) => {
    return Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val);
  }, []);
};

export const some = (collection, predicate) => {
  return (collection?.some)
    ? collection.some(predicate)
    : false
  ;
};
export const any = some;

export const sortBy = function (arr = [], key, comparator) {
  const compare = (a, b) => {
    const valA = get(a, key);
    const valB = get(b, key);

    if (valA === undefined && valB === undefined) return 0;
    if (valA === undefined) return 1; // Place undefined values at the end
    if (valB === undefined) return -1; // Place undefined values at the end

    if (comparator) {
      return comparator(valA, valB, a, b);
    }

    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  };

  return arr.slice().sort(compare);
};

export const groupBy = function(array = [], property) {
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

export const moveItem = (array = [], callbackOrValue, index) => {
  const callback = isFunction(callbackOrValue)
    ? callbackOrValue
    : (val) => isEqual(val, callbackOrValue);

  let sourceIndex = findIndex(array, callback);
  if (sourceIndex === -1) {
    return array;
  }

  // Handle special index values
  let targetIndex;
  if (index === 'first') {
    targetIndex = 0;
  } else if (index === 'last') {
    targetIndex = array.length - 1;
  } else {
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

export const moveToFront = (array = [], callbackOrValue) => {
  return moveItem(array, callbackOrValue, 'first');
};

export const moveToBack = (array = [], callbackOrValue) => {
  return moveItem(array, callbackOrValue, 'last');
};


/* In perf testing in Chrome 131
  this seems like a reasonable crossover
  lodash puts this at 120
  <https://jsperf.app/quzoto/3>
*/
const ARRAY_SIZE_THRESHOLD = 58;

/* Returns the common items between two arrays */
export const intersection = (...arrays) => {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return [...new Set(arrays[0])];

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
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return [...new Set(arrays[0])];

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
  if (arrays.length <= 1) return [];

  const totalSize = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const useSet = totalSize >= ARRAY_SIZE_THRESHOLD;

  if (useSet) {
    const sets = arrays.map(arr => new Set(arr));
    return arrays.flatMap((arr, i) =>
      [...new Set(arr)].filter(item =>
        !sets.some((set, j) => i !== j && set.has(item))
      )
    );
  }

  return arrays.flatMap((arr, i) =>
    [...new Set(arr)].filter(item =>
      !arrays.some((otherArr, j) => i !== j && otherArr.includes(item))
    )
  );
};
