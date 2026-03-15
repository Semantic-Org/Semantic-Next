import { generateID, getRandomSeed, hashCode, prettifyHash, tokenize } from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('ID/Hashing Functions', () => {
  describe('tokenize', () => {
    it('should convert a string to a token', () => {
      expect(tokenize('Hello World')).toBe('hello-world');
      expect(tokenize('A simple-test_string')).toBe('a-simple-test-string');
    });
  });

  describe('prettifyHash', () => {
    it('should return padded "0" for input 0 with default settings', () => {
      expect(prettifyHash(0)).toBe('000000');
    });

    it('should convert a number to base 36 representation', () => {
      expect(prettifyHash(10)).toBe('00000A');
      expect(prettifyHash(35)).toBe('00000Z');
      expect(prettifyHash(36)).toBe('000010');
    });

    it('should handle large numbers correctly', () => {
      const largeNumber = 123456789012345;
      expect(prettifyHash(largeNumber)).toMatch(/^[0-9A-Z]+$/);
    });

    it('should respect custom minLength', () => {
      expect(prettifyHash(123, { minLength: 8 })).toBe('0000003F');
      expect(prettifyHash(123, { minLength: 3 })).toBe('03F');
      expect(prettifyHash(123, { minLength: 1 })).toBe('3F');
    });

    it('should respect custom padChar', () => {
      expect(prettifyHash(123, { minLength: 8, padChar: 'X' })).toBe('XXXXXX3F');
      expect(prettifyHash(123, { minLength: 6, padChar: '-' })).toBe('----3F');
    });

    it('should handle negative numbers by returning padded 0', () => {
      expect(prettifyHash(-123)).toBe('000000');
    });

    it('should handle decimal numbers by parsing as integers', () => {
      expect(prettifyHash(123.456)).toBe('00003F');
    });

    it('should handle string inputs by parsing as numbers', () => {
      expect(prettifyHash('123')).toBe('00003F');
    });

    it('should handle NaN by returning padded 0', () => {
      expect(prettifyHash(NaN)).toBe('000000');
    });
  });

  describe('hashCode', () => {
    it('should produce consistent hash code for the same input', () => {
      expect(hashCode('Test String')).toBe(1884887178);
    });

    it('should generally produce unique hash codes for different inputs', () => {
      const input1 = 'Test String 1';
      const input2 = 'Test String 2';
      expect(hashCode(input1)).not.toBe(hashCode(input2));
    });

    it('should hash objects', () => {
      const input1 = { one: 'one', two: { one: 'one', two: 'two' } };
      const input2 = { one: 'one', two: { one: 'two', two: 'two' } };
      expect(hashCode(input1)).not.toBe(hashCode(input2));
    });

    it('should hash dates', () => {
      const date1 = new Date(2020, 0, 1);
      const date2 = new Date(2020, 0, 2);
      expect(hashCode(date1)).not.toBe(hashCode(date2));
    });

    it('should hash numbers', () => {
      const value1 = 5151;
      const value2 = 2121;
      expect(hashCode(value1)).not.toBe(hashCode(value2));
    });

    it('should produce different hash codes for similar inputs', () => {
      const input1 = 'Test String';
      const input2 = 'test string';
      expect(hashCode(input1)).not.toBe(hashCode(input2));
    });

    it('should handle extremely long inputs', () => {
      const longInput = 'a'.repeat(100000);
      const result = hashCode(longInput);
      expect(typeof result).toBe('number');
    });

    it('should handle inputs with special characters', () => {
      const specialInput = '!@#$%^&*()_+{}[]|\\:;"<>,.?/~`';
      const result = hashCode(specialInput);
      expect(typeof result).toBe('number');
    });

    it('should handle inputs with Unicode characters', () => {
      const unicodeInput = '你好世界 こんにちは世界 안녕하세요 세계';
      const result = hashCode(unicodeInput);
      expect(typeof result).toBe('number');
    });

    it('should handle inputs with emojis', () => {
      const emojiInput = '😀😃😄😁😆😅😂🤣';
      const result = hashCode(emojiInput);
      expect(typeof result).toBe('number');
    });

    it('should handle inputs with control characters', () => {
      const controlInput = '\n\r\t\b\f';
      const result = hashCode(controlInput);
      expect(typeof result).toBe('number');
    });

    it('should handle empty input', () => {
      expect(hashCode('')).toBeDefined();
    });

    it('should handle null input', () => {
      expect(hashCode(null)).toBeDefined();
    });

    it('should handle undefined input', () => {
      expect(hashCode(undefined)).toBeDefined();
    });

    it('should handle input with leading/trailing whitespace', () => {
      const input1 = 'Test String';
      const input2 = '  Test String  ';
      expect(hashCode(input1)).not.toBe(hashCode(input2));
    });

    it('should handle input with large integers', () => {
      const input = { value: Number.MAX_SAFE_INTEGER };
      expect(() => hashCode(input)).not.toThrow();
    });

    it('should handle input with small integers', () => {
      const input = { value: Number.MIN_SAFE_INTEGER };
      expect(() => hashCode(input)).not.toThrow();
    });

    it('should handle input with floating-point numbers', () => {
      const input = { value: 3.14159265359 };
      expect(() => hashCode(input)).not.toThrow();
    });

    it('should handle input with Infinity', () => {
      const input = { value: Infinity };
      expect(() => hashCode(input)).not.toThrow();
    });

    it('should handle input with -Infinity', () => {
      const input = { value: -Infinity };
      expect(() => hashCode(input)).not.toThrow();
    });

    it('should handle input with NaN', () => {
      const input = { value: NaN };
      expect(() => hashCode(input)).not.toThrow();
    });

    /* Annoying logs
    it('should handle circular references in objects', () => {
      const input = { a: 1 };
      input.self = input;
      expect(() => hashCode(input)).not.toThrow();
    });*/

    it('should handle deeply nested objects', () => {
      const input = { a: { b: { c: { d: { e: 'nested' } } } } };
      expect(() => hashCode(input)).not.toThrow();
    });

    it('should return prettified hash when prettify option is true', () => {
      const result = hashCode('test', { prettify: true });
      expect(result).toMatch(/^[0-9A-Z]{6,}$/);
      expect(typeof result).toBe('string');
    });

    it('should return numeric hash when prettify option is false', () => {
      const result = hashCode('test', { prettify: false });
      expect(typeof result).toBe('number');
    });

    it('should accept custom seed', () => {
      const result1 = hashCode('test', { seed: 0x12345678 });
      const result2 = hashCode('test', { seed: 0x87654321 });
      expect(result1).not.toBe(result2);
    });
  });

  describe('getRandomSeed', () => {
    it('should return a number', () => {
      const seed = getRandomSeed();
      expect(typeof seed).toBe('number');
    });

    it('should return different values on subsequent calls', () => {
      const seed1 = getRandomSeed();
      const seed2 = getRandomSeed();
      expect(seed1).not.toBe(seed2);
    });

    it('should return values within expected range', () => {
      const seed = getRandomSeed();
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThanOrEqual(0xFFFFFFFF);
    });
  });

  describe('generateID', () => {
    it('should generate a non-empty string', () => {
      expect(generateID()).toMatch(/^[0-9A-Z]+$/);
    });

    it('generated IDs should be unique', () => {
      const id1 = generateID();
      const id2 = generateID();
      expect(id1).not.toBe(id2);
    });

    it('should generate consistent ID with same seed', () => {
      const seed = 12345;
      const id1 = generateID(seed);
      const id2 = generateID(seed);
      expect(id1).toBe(id2);
    });

    it('should generate different IDs with different seeds', () => {
      const id1 = generateID(12345);
      const id2 = generateID(54321);
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with default 6 character length', () => {
      const id = generateID(123);
      expect(id.length).toBeGreaterThanOrEqual(6);
    });
  });
});
