import { fromBase64, toBase64 } from '@semantic-ui/utils';

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
