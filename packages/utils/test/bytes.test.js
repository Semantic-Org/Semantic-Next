import { byteLength, formatByteSize, fromBase64, toBase64, toByteSize } from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('toBase64', () => {
  it('encodes ascii and empty strings', () => {
    expect(toBase64('hello')).toBe('aGVsbG8=');
    expect(toBase64('')).toBe('');
  });

  it('is unicode-safe, encoding a string as its UTF-8 bytes', () => {
    expect(toBase64('héllo')).toBe('aMOpbGxv');
    expect(toBase64('👋')).toBe('8J+Riw==');
  });

  it('encodes binary input', () => {
    expect(toBase64(new Uint8Array([1, 2, 3]))).toBe('AQID');
    expect(toBase64(new Uint8Array([1, 2, 3]).buffer)).toBe('AQID');
    expect(toBase64([1, 2, 3])).toBe('AQID');
  });

  it('encodes only the view, not its whole backing buffer', () => {
    const buffer = new Uint8Array([1, 2, 3, 4, 5, 6]).buffer;
    expect(toBase64(new Uint8Array(buffer, 2, 3))).toBe(toBase64(new Uint8Array([3, 4, 5])));
  });

  it('returns null for input outside the accepted types', () => {
    expect(toBase64(5)).toBe(null);
    expect(toBase64({})).toBe(null);
    expect(toBase64(null)).toBe(null);
    expect(toBase64(undefined)).toBe(null);
    expect(toBase64([300])).toBe(null); // a non-byte would otherwise wrap silently
  });

  it('emits the url-safe alphabet with no padding under urlSafe', () => {
    const url = toBase64('a?b>c~ffff', { urlSafe: true });
    expect(url).toBe('YT9iPmN-ZmZmZg');
    expect(url).not.toMatch(/[+/=]/);
  });
});

describe('fromBase64', () => {
  it('decodes to a UTF-8 string by default', () => {
    expect(fromBase64('aGVsbG8=')).toBe('hello');
    expect(fromBase64('aMOpbGxv')).toBe('héllo');
    expect(fromBase64('')).toBe('');
  });

  it('decodes to raw bytes when asked', () => {
    expect(Array.from(fromBase64('AQID', { as: 'bytes' }))).toEqual([1, 2, 3]);
  });

  it('accepts both alphabets and tolerates missing padding', () => {
    expect(fromBase64('YT9iPmN-ZmZmZg')).toBe('a?b>c~ffff'); // url-safe, unpadded
    expect(fromBase64('YT9iPmN+ZmZmZg==')).toBe('a?b>c~ffff'); // standard, padded
  });

  it('strips whitespace before the padding math, so line-wrapped base64 decodes', () => {
    expect(fromBase64('aGVs\nbG8=\n')).toBe('hello');
    expect(fromBase64('  aGVsbG8=  ')).toBe('hello');
  });

  it('returns null for malformed or non-string input, never throwing', () => {
    expect(fromBase64('!!!not-base64!!!')).toBe(null);
    expect(fromBase64('AAAAA')).toBe(null); // length % 4 === 1 is invalid at any padding
    expect(fromBase64(null)).toBe(null);
    expect(fromBase64(undefined)).toBe(null);
    expect(fromBase64(42)).toBe(null);
  });
});

describe('base64 round-trip', () => {
  it('round-trips text, unicode, and binary', () => {
    for (const text of ['hello', 'héllo café', '👋🏽 mixed', '', 'a?b>c~/+=']) {
      expect(fromBase64(toBase64(text))).toBe(text);
      expect(fromBase64(toBase64(text, { urlSafe: true }))).toBe(text);
    }
    const bytes = new Uint8Array([0, 127, 128, 255, 42]);
    expect(Array.from(fromBase64(toBase64(bytes), { as: 'bytes' }))).toEqual(Array.from(bytes));
  });

  it('round-trips input larger than the encode chunk size', () => {
    const big = new Uint8Array(70000).map((byte, index) => index % 256);
    const back = fromBase64(toBase64(big), { as: 'bytes' });
    expect(back.length).toBe(70000);
    expect(back.every((byte, index) => byte === index % 256)).toBe(true);
  });
});

describe('byteLength', () => {
  it('counts the UTF-8 bytes of a string, not its characters', () => {
    expect(byteLength('hello')).toBe(5);
    expect(byteLength('héllo')).toBe(6);
    expect(byteLength('👋')).toBe(4);
    expect(byteLength('')).toBe(0);
  });

  it('counts binary input by its view, not its backing buffer', () => {
    expect(byteLength(new Uint8Array([1, 2, 3]))).toBe(3);
    expect(byteLength(new Uint8Array(8).buffer)).toBe(8);
    expect(byteLength(new Float32Array(2))).toBe(8);
    expect(byteLength(new Uint8Array(new Uint8Array(6).buffer, 2, 3))).toBe(3);
    expect(byteLength([1, 2, 3])).toBe(3);
  });

  it('returns null when there are no bytes to count', () => {
    expect(byteLength(5)).toBe(null);
    expect(byteLength({})).toBe(null);
    expect(byteLength(null)).toBe(null);
    expect(byteLength(undefined)).toBe(null);
    expect(byteLength([300])).toBe(null);
  });
});

describe('formatByteSize', () => {
  it('picks the largest unit the value fills at base 1024', () => {
    expect(formatByteSize(0)).toBe('0 B');
    expect(formatByteSize(512)).toBe('512 B');
    expect(formatByteSize(1024)).toBe('1 KB');
    expect(formatByteSize(1536)).toBe('1.5 KB');
    expect(formatByteSize(10485760)).toBe('10 MB');
    expect(formatByteSize(2147483648)).toBe('2 GB');
    expect(formatByteSize(1099511627776)).toBe('1 TB');
    expect(formatByteSize(1125899906842624)).toBe('1 PB');
  });

  it('caps at the last label rather than inventing a unit', () => {
    expect(formatByteSize(2 ** 60)).toBe('1024 PB');
  });

  it('rounds to decimals as a maximum, dropping trailing zeros', () => {
    expect(formatByteSize(1536, { decimals: 0 })).toBe('2 KB');
    expect(formatByteSize(1536, { decimals: 3 })).toBe('1.5 KB');
    expect(formatByteSize(1234567)).toBe('1.2 MB');
    expect(formatByteSize(1234567, { decimals: 2 })).toBe('1.18 MB');
    expect(formatByteSize(1234567, { decimals: 0 })).toBe('1 MB');
  });

  it('promotes a value that rounds up to a whole unit', () => {
    expect(formatByteSize(1048575)).toBe('1 MB');
    expect(formatByteSize(1048570, { decimals: 0 })).toBe('1 MB');
    expect(formatByteSize(1048575, { decimals: 3 })).toBe('1023.999 KB');
    expect(formatByteSize(1048575, { decimals: 2 })).toBe('1 MB');
  });

  it('keeps the sign', () => {
    expect(formatByteSize(-1572864)).toBe('-1.5 MB');
    expect(formatByteSize(-512)).toBe('-512 B');
    expect(formatByteSize(-0)).toBe('0 B');
  });

  it('formats at base 1000 when asked', () => {
    expect(formatByteSize(1500, { base: 1000 })).toBe('1.5 KB');
    expect(formatByteSize(1000000, { base: 1000 })).toBe('1 MB');
    expect(formatByteSize(1048576, { base: 1000 })).toBe('1 MB'); // 1.048576 rounds at one decimal
    expect(formatByteSize(1048576, { base: 1000, decimals: 2 })).toBe('1.05 MB');
  });

  it('prints the IEC labels under iec, pinning the base to 1024', () => {
    expect(formatByteSize(1536, { iec: true })).toBe('1.5 KiB');
    expect(formatByteSize(10485760, { iec: true })).toBe('10 MiB');
    expect(formatByteSize(512, { iec: true })).toBe('512 B');
    expect(formatByteSize(1536, { iec: true, base: 1000 })).toBe('1.5 KiB');
  });

  it('holds one unit for a column when asked', () => {
    expect(formatByteSize(1536, { unit: 'mb' })).toBe('0 MB');
    expect(formatByteSize(1536, { unit: 'mb', decimals: 3 })).toBe('0.001 MB');
    expect(formatByteSize(10485760, { unit: 'KB' })).toBe('10240 KB');
    expect(formatByteSize(1073741824, { unit: 'gb' })).toBe('1 GB');
    expect(formatByteSize(1073741824, { unit: 'mb' })).toBe('1024 MB');
    expect(formatByteSize(10, { unit: 'b' })).toBe('10 B');
  });

  it('reads an IEC unit as both the exponent and the label', () => {
    expect(formatByteSize(10485760, { unit: 'mib' })).toBe('10 MiB');
    expect(formatByteSize(10485760, { unit: 'MiB', base: 1000 })).toBe('10 MiB');
  });

  it('accepts anything toByteSize reads, at the same base', () => {
    expect(formatByteSize('10mb')).toBe('10 MB');
    expect(formatByteSize('1536')).toBe('1.5 KB');
    expect(formatByteSize('10mb', { base: 1000 })).toBe('10 MB');
    expect(formatByteSize('10mib', { base: 1000 })).toBe('10.5 MB');
  });

  it('formats the number for a locale when asked', () => {
    expect(formatByteSize(1536, { locale: 'de-DE' })).toBe('1,5 KB');
    expect(formatByteSize(10485760, { unit: 'kb', locale: 'en-US' })).toBe('10,240 KB');
  });

  it('returns null when there is no size to format', () => {
    expect(formatByteSize(NaN)).toBe(null);
    expect(formatByteSize(Infinity)).toBe(null);
    expect(formatByteSize('banana')).toBe(null);
    expect(formatByteSize(null)).toBe(null);
    expect(formatByteSize(undefined)).toBe(null);
    expect(formatByteSize({})).toBe(null);
    expect(formatByteSize(10, { unit: 'lightyears' })).toBe(null);
  });

  it('takes defaults and labels the app names in formatByteSize.config', () => {
    const saved = { ...formatByteSize.config };
    formatByteSize.config.labels = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
    formatByteSize.config.decimals = 2;
    formatByteSize.config.base = 1000;
    try {
      expect(formatByteSize(1500)).toBe('1.5 kB');
      expect(formatByteSize(1234567)).toBe('1.23 MB');
      // per-call settings still win
      expect(formatByteSize(1536, { base: 1024, decimals: 1 })).toBe('1.5 kB');
    }
    finally {
      Object.assign(formatByteSize.config, saved);
    }
    expect(formatByteSize(1536)).toBe('1.5 KB');
  });
});

describe('byte size round-trip', () => {
  it('reads back what it formats at the same base', () => {
    for (const bytes of [0, 512, 1024, 1536, 10485760, 2147483648]) {
      expect(toByteSize(formatByteSize(bytes))).toBe(bytes);
      expect(toByteSize(formatByteSize(bytes, { iec: true }))).toBe(bytes);
    }
    for (const bytes of [0, 512, 1000, 1500, 10000000, 2500000000]) {
      expect(toByteSize(formatByteSize(bytes, { base: 1000 }), { base: 1000 })).toBe(bytes);
    }
  });
});
