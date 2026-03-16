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
 * Create a uniqueID from a string using an adapted UMASH algorithm
  https://github.com/backtrace-labs/umash
 */
const encoder = new TextEncoder();

export function hashCode(input, { prettify = false, seed = 0x12345678 } = {}) {
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
    // optimize performance for short inputs
    hash = seed;
    for (let i = 0; i < inputData.length; i++) {
      hash ^= inputData[i];
      hash = Math.imul(hash, prime1);
      hash ^= hash >>> 13;
    }
  }
  else {
    // compress input blocks while maintaining good mixing properties
    hash = seed;
    for (let i = 0; i < inputData.length; i++) {
      hash = Math.imul(hash ^ inputData[i], prime1);
      hash = (hash << 13) | (hash >>> 19);
      hash = Math.imul(hash, prime2);
    }

    // protect against length extension attacks
    hash ^= inputData.length;
  }

  // improve the distribution and avalanche properties of the hash
  hash ^= hash >>> 16;
  hash = Math.imul(hash, prime3);
  hash ^= hash >>> 13;

  if (prettify) {
    return prettifyHash(hash >>> 0);
  }

  return hash >>> 0;
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
