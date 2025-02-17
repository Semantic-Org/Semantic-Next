/*-------------------
      Identity
--------------------*/

export const tokenize = (str = '') => {
  return (str || '').replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/_/g, '-')
    .toLowerCase()
  ;
};

export const prettifyID = (num) => {
  num = parseInt(num, 10);
  if (num === 0) return '0';
  let result = '';
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  while (num > 0) {
    result = chars[num % chars.length] + result;
    num = Math.floor(num / chars.length);
  }
  return result;
};

/*
 * Create a uniqueID from a string using an adapted UMASH algorithm
  https://github.com/backtrace-labs/umash
 */
export function hashCode(input, { prettify = false, seed = 0x12345678 } = {}) {
  const prime1 = 0x9e3779b1;
  const prime2 = 0x85ebca77;
  const prime3 = 0xc2b2ae3d;

  let inputData;

  if (input === null || input === undefined) {
    inputData = new TextEncoder().encode('');
  }
  else if (input && input.toString === Object.prototype.toString && typeof input === 'object') {
    try {
      inputData = new TextEncoder().encode(JSON.stringify(input));
    }
    catch (error) {
      console.error('Error serializing input', error);
      return 0;
    }
  }
  else {
    inputData = new TextEncoder().encode(input.toString());
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
    return prettifyID(hash >>> 0);
  }

  return hash >>> 0;
}

export const generateID = () => {
  const num = Math.random() * 1000000000000000;
  return prettifyID(num);
};
