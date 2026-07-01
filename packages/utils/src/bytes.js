import { isString } from './types.js';

/*-------------------
       Bytes
--------------------*/

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// btoa/atob only speak Latin1, so a string round-trips through its UTF-8 bytes to stay unicode-safe
const toBytes = (input) => {
  if (isString(input)) { return textEncoder.encode(input); }
  if (input instanceof Uint8Array) { return input; }
  if (input instanceof ArrayBuffer) { return new Uint8Array(input); }
  if (ArrayBuffer.isView(input)) { return new Uint8Array(input.buffer, input.byteOffset, input.byteLength); }
  return new Uint8Array(input);
};

export const toBase64 = (input, { urlSafe = false } = {}) => {
  const bytes = toBytes(input);
  let binary = '';
  // chunk so fromCharCode.apply stays under the argument-count limit on large inputs
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  const base64 = btoa(binary);
  return urlSafe ? base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : base64;
};

export const fromBase64 = (base64 = '', { as = 'string' } = {}) => {
  // accept the url-safe alphabet transparently, then re-pad to a multiple of 4 for atob
  let normalized = base64.replace(/-/g, '+').replace(/_/g, '/');
  const remainder = normalized.length % 4;
  if (remainder) { normalized += '='.repeat(4 - remainder); }
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) { bytes[i] = binary.charCodeAt(i); }
  return as === 'bytes' ? bytes : textDecoder.decode(bytes);
};
