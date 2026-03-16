/*-------------------
      Identity
--------------------*/

export const tokenize = (str = '') => {
  return (str || '').replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/_/g, '-')
    .toLowerCase();
};

export const prettifyHash = (numericHash, { minLength = 6, padChar = '0' } = {}) => {
  numericHash = parseInt(numericHash, 10);
  if (numericHash === 0) {
    return minLength > 1 ? padChar.repeat(minLength - 1) + '0' : '0';
  }

  let result = '';
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  while (numericHash > 0) {
    result = chars[numericHash % chars.length] + result;
    numericHash = Math.floor(numericHash / chars.length);
  }

  // Pad if needed
  if (result.length < minLength) {
    result = padChar.repeat(minLength - result.length) + result;
  }

  return result;
};

/*
 * Hash with fast (FNV-1a) default. Pass { fast: false } for stronger
 * collision resistance via UMASH at the cost of allocations.
 */
const encoder = new TextEncoder();

export function hashCode(input, { prettify = false, seed, fast = true } = {}) {
  if (fast) {
    return fnv1a(input, { prettify, seed: seed ?? 0x811c9dc5 });
  }
  return umash(input, { prettify, seed: seed ?? 0x12345678 });
}

// FNV-1a — zero allocation, operates on JS string char codes
function fnv1a(input, { prettify, seed }) {
  let str;
  if (input === null || input === undefined) {
    str = '';
  }
  else if (typeof input === 'object' && input.toString === Object.prototype.toString) {
    try {
      str = JSON.stringify(input);
    }
    catch {
      return 0;
    }
  }
  else {
    str = String(input);
  }

  let hash = seed;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  hash = hash >>> 0;
  return prettify ? prettifyHash(hash) : hash;
}

// Adapted UMASH — better distribution and avalanche properties
// https://github.com/backtrace-labs/umash
function umash(input, { prettify, seed }) {
  const prime1 = 0x9e3779b1;
  const prime2 = 0x85ebca77;
  const prime3 = 0xc2b2ae3d;

  let inputData;

  if (input === null || input === undefined) {
    inputData = encoder.encode('');
  }
  else if (input && input.toString === Object.prototype.toString && typeof input === 'object') {
    try {
      inputData = encoder.encode(JSON.stringify(input));
    }
    catch (error) {
      console.error('Error serializing input', error);
      return 0;
    }
  }
  else {
    inputData = encoder.encode(input.toString());
  }

  let hash;

  if (inputData.length <= 8) {
    hash = seed;
    for (let i = 0; i < inputData.length; i++) {
      hash ^= inputData[i];
      hash = Math.imul(hash, prime1);
      hash ^= hash >>> 13;
    }
  }
  else {
    hash = seed;
    for (let i = 0; i < inputData.length; i++) {
      hash = Math.imul(hash ^ inputData[i], prime1);
      hash = (hash << 13) | (hash >>> 19);
      hash = Math.imul(hash, prime2);
    }
    hash ^= inputData.length;
  }

  hash ^= hash >>> 16;
  hash = Math.imul(hash, prime3);
  hash ^= hash >>> 13;

  return prettify ? prettifyHash(hash >>> 0) : hash >>> 0;
}

export const getRandomSeed = () => {
  if (crypto?.getRandomValues) {
    // Browser crypto API
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0];
  }
  else {
    // Fallback to Math.random for server or unsupported environments
    return Math.random() * 0xFFFFFFFF;
  }
};

export const generateID = (seed = getRandomSeed()) => {
  return prettifyHash(seed);
};
