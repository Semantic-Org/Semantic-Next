import { clone } from './cloning.js';
import { noop } from './functions.js';
import { each } from './loops.js';
import { escapeRegExp } from './regexp.js';
import { isArray, isObject, isPlainObject, isString } from './types.js';

/*-------------------
       Objects
--------------------*/

/*
  Return keys from object
*/
export const keys = (obj) => {
  if (isObject(obj)) {
    return Object.keys(obj);
  }
};

export const values = (obj) => {
  if (isObject(obj)) {
    return Object.values(obj);
  }
};

export const filterObject = (obj, callback) => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => callback(value, key)),
  );
};

export const mapObject = (obj, callback) => {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => [key, callback(value, key)]),
  );
};

/*
  Handles properly copying getter/setters
*/
export const extend = (obj, ...sources) => {
  sources.forEach((source) => {
    let descriptor, prop;
    if (source) {
      for (prop in source) {
        descriptor = Object.getOwnPropertyDescriptor(source, prop);
        if (descriptor === undefined) {
          obj[prop] = source[prop];
        }
        else {
          Object.defineProperty(obj, prop, descriptor);
        }
      }
    }
  });
  return obj;
};

export const deepExtend = (target, ...args) => {
  if (!isObject(target)) {
    return target;
  }

  // Check if last argument is options object
  const lastArg = args[args.length - 1];
  const defaultOptions = { preserveNonCloneable: true, preserveDOM: true };
  const hasOptions = keys(defaultOptions).some(key => lastArg?.[key] !== undefined);
  const options = hasOptions ? { ...defaultOptions, ...lastArg } : defaultOptions;
  const sources = hasOptions ? args.slice(0, -1) : args;

  each(sources, (source) => {
    // Skip if source is not a plain object
    if (!isPlainObject(source)) {
      return;
    }

    each(source, (val, key) => {
      // Skip __proto__ for security
      if (key === '__proto__') {
        return;
      }

      const src = target[key];

      // Recursion prevention
      if (val === target) {
        return;
      }

      // If new value isn't a plain object, clone and assign
      if (!isPlainObject(val)) {
        target[key] = clone(val, options);
        return;
      }

      // If target property doesn't exist or isn't a plain object,
      // create new object and deep extend
      if (!isPlainObject(src)) {
        target[key] = deepExtend({}, val, options);
        return;
      }

      // Both are plain objects, extend recursively
      deepExtend(src, val, options);
    });
  });

  return target;
};

export const assignInPlace = (target, source, { preserveExistingKeys = false, returnChanged = false } = {}) => {
  let changed = false;
  if (!preserveExistingKeys) {
    for (const key in target) {
      if (!(key in source)) {
        delete target[key];
        changed = true;
      }
    }
  }
  for (const key in source) {
    if (target[key] !== source[key]) {
      target[key] = source[key];
      changed = true;
    }
  }
  return returnChanged ? changed : target;
};

export const pick = (obj, ...keys) => {
  let copy = {};
  each(keys, function(key) {
    if (obj?.[key] !== undefined) {
      copy[key] = obj[key];
    }
  });
  return copy;
};

export const arrayFromObject = (obj) => {
  if (isArray(obj)) {
    return obj;
  }
  let arr = [];
  each(obj, (value, key) => {
    arr.push({
      value,
      key,
    });
  });
  return arr;
};

/*
  Access a nested object field from a string, like 'a.b.c'
*/
export const get = function(obj, path = '') {
  if (typeof path !== 'string') {
    return undefined;
  }

  // Simple property access — no dots, no brackets
  if (path.indexOf('.') === -1 && path.indexOf('[') === -1) {
    return (obj !== null && isObject(obj)) ? obj[path] : undefined;
  }

  function extractArrayLikeAccess(part) {
    const key = part.substring(0, part.indexOf('['));
    const index = parseInt(part.substring(part.indexOf('[') + 1, part.indexOf(']')), 10);
    return { key, index };
  }

  function getCombinedKey(path) {
    const dotIndex = path.indexOf('.');
    if (dotIndex !== -1) {
      const nextDotIndex = path.indexOf('.', dotIndex + 1);
      if (nextDotIndex !== -1) {
        return path.slice(0, nextDotIndex);
      }
    }
    return path;
  }

  if (obj === null || !isObject(obj)) {
    return undefined;
  }

  const parts = path.split('.');
  let currentObject = obj;

  for (let i = 0; i < parts.length; i++) {
    if (currentObject === null || !isObject(currentObject)) {
      return undefined;
    }

    let part = parts[i];

    if (part.includes('[')) {
      const { key, index } = extractArrayLikeAccess(part);

      if (key in currentObject && isArray(currentObject[key]) && index < currentObject[key].length) {
        currentObject = currentObject[key][index];
      }
      else {
        return undefined;
      }
    }
    else {
      if (part in currentObject) {
        currentObject = currentObject[part];
      }
      else {
        const remainingPath = parts.slice(i).join('.');
        if (remainingPath in currentObject) {
          currentObject = currentObject[remainingPath];
          break;
        }
        else {
          const combinedKey = getCombinedKey(`${part}.${parts[i + 1]}`);
          if (combinedKey in currentObject) {
            currentObject = currentObject[combinedKey];
            i++;
          }
          else {
            return undefined;
          }
        }
      }
    }
  }

  return currentObject;
};

/* This is useful for callbacks or other scenarios where you want to avoid the
   values of a reference object becoming stale when a source object changes
*/
export const proxyObject = (sourceObj = noop, referenceObj = {}) => {
  return new Proxy(referenceObj, {
    get: (target, property) => {
      const propKey = typeof property === 'symbol' ? property.toString() : property;
      return get(referenceObj, propKey) ?? get(sourceObj(), propKey);
    },
  });
};

export const onlyKeys = (obj, keysToKeep) => {
  return keysToKeep.reduce((accumulator, key) => {
    if (obj.hasOwnProperty(key)) {
      accumulator[key] = obj[key];
    }
    return accumulator;
  }, {});
};

/*
  Return true if non-inherited property
*/
export const hasProperty = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

/*
  Reverses a lookup object
  start { a: 1, b: [1, 2] }
  end { 1: ['a', 'b'], 2: 'b' }
*/
export const reverseKeys = (obj) => {
  const newObj = {};
  const pushValue = (key, value) => {
    if (isArray(newObj[key])) {
      newObj[key].push(value);
    }
    else if (newObj[key]) {
      newObj[key] = [newObj[key], value];
    }
    else {
      newObj[key] = value;
    }
  };
  Object.keys(obj).forEach((key) => {
    if (isArray(obj[key])) {
      each(obj[key], (subKey) => {
        pushValue(subKey, key);
      });
    }
    else {
      pushValue(obj[key], key);
    }
  });
  return newObj;
};

/*
  Search and rank objects by query relevance
  Weight hierarchy: startsWith > wordStartsWith > anywhere > anyWord
*/
export const weightedObjectSearch = (query, objectArray = [], {
  returnMatches = false,
  matchAllWords = true,
  propertiesToMatch = [],
} = {}) => {
  if (!isArray(objectArray)) { return []; }
  if (!isString(query) || !query.trim()) { return objectArray; }
  if (!objectArray.length || !propertiesToMatch.length) { return []; }

  const queryLower = query.trim().toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  const wordCount = queryWords.length;
  const isMultiWord = wordCount > 1;

  // Regex only for wordStartsWith — startsWith and anywhere use string methods
  const wordStartsWithRe = new RegExp('(?:^|\\s)' + escapeRegExp(queryLower));

  const results = [];

  each(objectArray, (obj, index) => {
    let bestScore = Infinity;
    const matchDetails = returnMatches ? [] : null;

    for (let f = 0; f < propertiesToMatch.length; f++) {
      const field = propertiesToMatch[f];
      let rawValue = get(obj, field);
      if (rawValue == null) { continue; }

      // Normalize field value to searchable string
      let value;
      if (isString(rawValue)) {
        value = rawValue;
      }
      else if (isArray(rawValue)) {
        value = rawValue.join(' ');
      }
      else {
        value = String(rawValue);
      }
      if (!value) { continue; }

      const valueLower = value.toLowerCase();
      let fieldScore = Infinity;
      let matchType;

      // Cascade from best to worst — exit on first match per field
      if (valueLower.startsWith(queryLower)) {
        fieldScore = 1;
        matchType = 'startsWith';
      }
      else if (wordStartsWithRe.test(valueLower)) {
        fieldScore = 2;
        matchType = 'wordStartsWith';
      }
      else if (valueLower.indexOf(queryLower) !== -1) {
        fieldScore = 3;
        matchType = 'anywhere';
      }
      else if (isMultiWord) {
        let wordsMatched = 0;
        for (let w = 0; w < wordCount; w++) {
          if (valueLower.indexOf(queryWords[w]) !== -1) {
            wordsMatched++;
          }
        }

        const meetsThreshold = matchAllWords
          ? wordsMatched === wordCount
          : wordsMatched > 0;

        if (meetsThreshold) {
          fieldScore = 4 + (1 - wordsMatched / wordCount);
          matchType = 'anyWord';
        }
      }

      if (fieldScore === Infinity) { continue; }

      if (fieldScore < bestScore) {
        bestScore = fieldScore;
      }

      if (returnMatches) {
        matchDetails.push({ field, type: matchType, score: fieldScore, value: rawValue });
      }

      // Weight 1 is the ceiling — skip remaining fields unless collecting matches
      if (bestScore === 1 && !returnMatches) { break; }
    }

    if (bestScore < Infinity) {
      results.push({ obj, score: bestScore, index, matches: matchDetails });
    }
  });

  // Stable sort: by score ascending, then original position
  results.sort((a, b) => a.score - b.score || a.index - b.index);

  // Return without mutating originals
  if (returnMatches) {
    const output = new Array(results.length);
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      output[i] = { ...r.obj, matches: r.matches };
    }
    return output;
  }

  const output = new Array(results.length);
  for (let i = 0; i < results.length; i++) {
    output[i] = results[i].obj;
  }
  return output;
};
