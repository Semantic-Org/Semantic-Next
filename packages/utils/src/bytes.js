import { toBytes, toByteSize } from './coercion.js';
import { configured } from './functions.js';
import { roundDecimal } from './numbers.js';
import { isString } from './types.js';

/*-------------------
       Bytes
--------------------*/

const textDecoder = /* @__PURE__ */ new TextDecoder();

export const byteLength = (value) => toBytes(value)?.byteLength ?? null;

// the IEC labels are only truthful at 1024, so iec pins the base rather than letting the two
// settings contradict each other. labels are editable for the kB-not-KB camp
export const formatByteSize = /* @__PURE__ */ configured(
  (value, options = {}) => {
    const config = formatByteSize.config;
    const decimals = options.decimals ?? config.decimals;
    let iec = options.iec ?? config.iec;
    let exponent;
    if (options.unit != null) {
      const unit = String(options.unit).toLowerCase();
      const { units, iecUnits } = toByteSize.config;
      if (Object.hasOwn(units, unit)) { exponent = units[unit]; }
      else if (Object.hasOwn(iecUnits, unit)) {
        exponent = iecUnits[unit];
        iec = true;
      }
      else { return null; }
    }
    const base = iec ? 1024 : (options.base ?? config.base);
    const bytes = toByteSize(value, { base });
    if (bytes === null) { return null; }
    const labels = iec ? config.iecLabels : config.labels;
    const magnitude = Math.abs(bytes);
    let scaled;
    if (exponent === undefined) {
      // walk rather than take a log, log(1048576)/log(1024) lands a hair under 2 and floors wrong
      exponent = 0;
      scaled = magnitude;
      while (scaled >= base && exponent < labels.length - 1) {
        scaled /= base;
        exponent++;
      }
      // 1023.96 KB rounds up to 1024 KB, which is a whole unit
      if (roundDecimal(scaled, decimals) >= base && exponent < labels.length - 1) {
        scaled /= base;
        exponent++;
      }
    }
    else {
      if (exponent >= labels.length) { return null; }
      scaled = magnitude / Math.pow(base, exponent);
    }
    const rounded = roundDecimal(scaled, decimals);
    const number = options.locale
      ? rounded.toLocaleString(options.locale, { maximumFractionDigits: decimals })
      : String(rounded);
    return (bytes < 0 ? '-' : '') + number + ' ' + labels[exponent];
  },
  {
    base: 1024,
    decimals: 1,
    iec: false,
    labels: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
    iecLabels: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'],
  },
);

// btoa/atob only speak Latin1, so a string round-trips through its UTF-8 bytes to stay unicode-safe
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
