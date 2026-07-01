import { isArray, isString } from './types.js';

/*-------------------
       Bytes
--------------------*/

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// btoa/atob only speak Latin1, so a string round-trips through its UTF-8 bytes to stay unicode-safe.
// input outside the accepted types returns null, a bare number would otherwise read as a Uint8Array
// LENGTH and silently encode zero-fill garbage
const toBytes = (input) => {
  if (isString(input)) { return textEncoder.encode(input); }
  if (input instanceof Uint8Array) { return input; }
  if (input instanceof ArrayBuffer) { return new Uint8Array(input); }
  if (ArrayBuffer.isView(input)) { return new Uint8Array(input.buffer, input.byteOffset, input.byteLength); }
  if (isArray(input)) { return new Uint8Array(input); }
  return null;
};

export const toBase64 = (input, { urlSafe = false } = {}) => {
  const bytes = toBytes(input);
  if (bytes === null) { return null; }
  let binary = '';
  // chunk so fromCharCode.apply stays under the argument-count limit on large inputs
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  const base64 = btoa(binary);
  return urlSafe ? base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : base64;
};

export const fromBase64 = (base64, { as = 'string' } = {}) => {
  if (!isString(base64)) { return null; }
  // forgiving decode: strip whitespace (MIME/PEM line wrapping) before the padding math, since
  // browser atob strips it but node's throws. accept the url-safe alphabet, then re-pad to 4
  let normalized = base64.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
  const remainder = normalized.length % 4;
  if (remainder) { normalized += '='.repeat(4 - remainder); }
  let binary;
  // malformed input returns null rather than leaking atob's DOMException
  try {
    binary = atob(normalized);
  }
  catch {
    return null;
  }
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) { bytes[i] = binary.charCodeAt(i); }
  return as === 'bytes' ? bytes : textDecoder.decode(bytes);
};
