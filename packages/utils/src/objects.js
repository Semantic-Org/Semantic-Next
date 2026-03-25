import { clone } from './cloning.js';
import { noop } from './functions.js';
import { each } from './loops.js';
import { escapeRegExp } from './regexp.js';
import { isArray, isObject, isPlainObject } from './types.js';

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
      return get(referenceObj, propKey) || get(sourceObj(), propKey);
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
  Searches a search object
  returning matches for a query

  Matches are sorted
    - Start of word
    - Start of any word
    - Anywhere in string
*/
export const weightedObjectSearch = (query = '', objectArray = [], {
  returnMatches = false,
  matchAllWords = true,
  propertiesToMatch = [],
} = {}) => {
  if (!query) {
    return objectArray;
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return objectArray;
  }

  const escapedQuery = escapeRegExp(trimmedQuery);
  const words = trimmedQuery.split(/\s+/).filter(Boolean);
  const escapedWords = words.map(w => escapeRegExp(w));

  // Priority weights (lower = better match)
  const weights = {
    startsWith: 1,
    wordStartsWith: 2,
    anywhere: 3,
    anyWord: 4,
  };

  // Regexes for full phrase matching
  const phraseRegexes = {
    startsWith: new RegExp(`^${escapedQuery}`, 'i'),
    wordStartsWith: new RegExp(`(^|\\s)${escapedQuery}`, 'i'),
    anywhere: new RegExp(escapedQuery, 'i'),
  };

  // Get string value from a field (handles arrays like tags)
  const getFieldString = (value) => {
    if (isArray(value)) {
      return value.join(' ');
    }
    return value ? String(value) : '';
  };

  // Calculate best weight for an object
  const calculateWeight = (obj) => {
    let bestWeight = null;
    const matchDetails = [];

    for (const field of propertiesToMatch) {
      const rawValue = get(obj, field);
      const value = getFieldString(rawValue);

      if (!value) {
        continue;
      }

      // Try full phrase matches first (best priority)
      for (const [matchType, regex] of Object.entries(phraseRegexes)) {
        if (regex.test(value)) {
          const weight = weights[matchType];
          if (bestWeight === null || weight < bestWeight) {
            bestWeight = weight;
          }
          if (returnMatches) {
            matchDetails.push({ field, query: trimmedQuery, name: matchType, value: rawValue, weight });
          }
          break; // Found best match type for this field
        }
      }

      // Try individual word matches if we have multiple words
      if (words.length > 1) {
        let matchedCount = 0;
        for (const word of escapedWords) {
          const wordRegex = new RegExp(word, 'i');
          if (wordRegex.test(value)) {
            matchedCount++;
          }
        }

        if (matchedCount > 0) {
          const meetsThreshold = matchAllWords
            ? matchedCount === words.length
            : true;

          if (meetsThreshold) {
            // More words matched = better score (lower weight)
            const weight = weights.anyWord + (1 - matchedCount / words.length);
            if (bestWeight === null || weight < bestWeight) {
              bestWeight = weight;
            }
            if (returnMatches) {
              matchDetails.push({
                field,
                query: trimmedQuery,
                name: 'anyWord',
                value: rawValue,
                matchCount: matchedCount,
              });
            }
          }
        }
      }
    }

    if (returnMatches) {
      obj.matches = matchDetails;
    }

    return bestWeight;
  };

  // Calculate weights for all objects
  const results = [];
  for (const obj of objectArray) {
    const weight = calculateWeight(obj);
    if (weight !== null) {
      results.push({ obj, weight });
    }
  }

  // Sort by weight (lower = better)
  results.sort((a, b) => a.weight - b.weight);

  // Clean up and return
  if (!returnMatches) {
    for (const obj of objectArray) {
      delete obj.matches;
    }
  }

  return results.map(r => r.obj);
};
