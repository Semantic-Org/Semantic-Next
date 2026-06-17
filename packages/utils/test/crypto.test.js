import { generateID, getRandomSeed, hashCode, isValidID, parseID, prettifyHash } from '@semantic-ui/utils';

import { afterEach, describe, expect, it } from 'vitest';

const CROCKFORD = /^[0-9a-z]+$/;
const CROCKFORD_UPPER = /^[0-9A-Z]+$/;

describe('ID/Hashing Functions', () => {
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

    it('should handle NaN by returning padded 0', () => {
      expect(prettifyHash(NaN)).toBe('000000');
    });
  });

  describe('hashCode', () => {
    it('should produce consistent hash code for the same input', () => {
      expect(hashCode('Test String')).toBe(hashCode('Test String'));
    });

    it('should produce unique hash codes for different inputs', () => {
      expect(hashCode('Test String 1')).not.toBe(hashCode('Test String 2'));
    });

    it('should hash objects, dates, and numbers distinctly', () => {
      expect(hashCode({ a: 1 })).not.toBe(hashCode({ a: 2 }));
      expect(hashCode(new Date(2020, 0, 1))).not.toBe(hashCode(new Date(2020, 0, 2)));
      expect(hashCode(5151)).not.toBe(hashCode(2121));
    });

    it('should be case-sensitive', () => {
      expect(hashCode('Test String')).not.toBe(hashCode('test string'));
    });

    it('should stay within 53-bit safe-integer range', () => {
      const hash = hashCode('a'.repeat(100000));
      expect(Number.isSafeInteger(hash)).toBe(true);
      expect(hash).toBeGreaterThanOrEqual(0);
    });

    it('should not throw on special, unicode, emoji, or control input', () => {
      for (const value of ['!@#$%^&*()', '你好世界 こんにちは', '😀😃😄', '\n\r\t\b\f']) {
        expect(typeof hashCode(value)).toBe('number');
      }
    });

    it('should handle null and undefined', () => {
      expect(typeof hashCode(null)).toBe('number');
      expect(typeof hashCode(undefined)).toBe('number');
    });

    it('should not throw on non-finite numeric fields', () => {
      for (const value of [Infinity, -Infinity, NaN, Number.MAX_SAFE_INTEGER]) {
        expect(() => hashCode({ value })).not.toThrow();
      }
    });

    it('should return a prettified string when prettify is true', () => {
      const result = hashCode('test', { prettify: true });
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^[0-9A-Z]+$/);
    });

    it('should separate hashes by seed', () => {
      expect(hashCode('test', { seed: 1 })).not.toBe(hashCode('test', { seed: 2 }));
    });
  });

  describe('getRandomSeed', () => {
    it('should return a uint32 number', () => {
      const seed = getRandomSeed();
      expect(typeof seed).toBe('number');
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThanOrEqual(0xffffffff);
    });

    it('should return different values on subsequent calls', () => {
      expect(getRandomSeed()).not.toBe(getRandomSeed());
    });
  });

  describe('generateID', () => {
    afterEach(() => {
      generateID.config = {};
    });

    describe('presets', () => {
      it('defaults to a 26-char uppercase ULID', () => {
        const id = generateID();
        expect(id).toHaveLength(26);
        expect(id).toMatch(CROCKFORD_UPPER);
      });

      it('page is 8 chars, lowercase, always letter-first', () => {
        for (let i = 0; i < 200; i++) {
          const id = generateID({ usage: 'page' });
          expect(id).toHaveLength(8);
          expect(id).toMatch(CROCKFORD);
          // a leading digit is an invalid CSS identifier — page must never produce one
          expect(id[0]).toMatch(/[a-z]/);
        }
      });

      it('slug is 11 chars, lowercase', () => {
        const id = generateID({ usage: 'slug' });
        expect(id).toHaveLength(11);
        expect(id).toMatch(CROCKFORD);
      });

      it('token is 27 chars and self-validates via its checksum', () => {
        const id = generateID({ usage: 'token' });
        expect(id).toHaveLength(27);
        expect(isValidID(id, { usage: 'token' })).toBe(true);
      });

      it('throws on an unknown usage', () => {
        expect(() => generateID({ usage: 'nope' })).toThrow(/unknown usage/);
      });
    });

    describe('options', () => {
      it('length overrides the preset width', () => {
        expect(generateID({ length: 17 })).toHaveLength(17);
      });

      it('prefix is prepended verbatim, length counts the part after it', () => {
        const id = generateID({ usage: 'page', prefix: 'tab-' });
        expect(id.startsWith('tab-')).toBe(true);
        expect(id.slice('tab-'.length)).toHaveLength(8);
      });

      it('format uuid emits an RFC UUIDv7', () => {
        expect(generateID({ format: 'uuid' })).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
        );
      });

      it('group hyphenates every n chars', () => {
        expect(generateID({ usage: 'page', group: 4 })).toMatch(/^[a-z0-9]{4}-[a-z0-9]{4}$/);
      });

      it('ignores a non-object argument, falling through to the default usage', () => {
        expect(generateID(12345)).toHaveLength(26);
        expect(generateID(null)).toHaveLength(26);
      });

      // the 10-char clock plus a random char is the floor; a shorter length would
      // emit a 10-char id that isValidID then rejects, so fail loud instead
      it('throws when length is below the timestamp floor for db', () => {
        expect(() => generateID({ usage: 'db', length: 9 })).toThrow(/at least 11/);
      });
    });

    describe('config', () => {
      it('global config sets the default usage', () => {
        generateID.config = { usage: 'page' };
        expect(generateID()).toHaveLength(8);
      });

      it('call options override global config', () => {
        generateID.config = { usage: 'page' };
        expect(generateID({ usage: 'slug' })).toHaveLength(11);
      });

      it('an explicit false checksum overrides the token preset default', () => {
        const plain = generateID({ usage: 'token', checksum: false });
        expect(plain).toHaveLength(27);
      });
    });

    describe('uniqueness and ordering', () => {
      it('produces unique ids across many mints', () => {
        const seen = new Set();
        for (let i = 0; i < 5000; i++) {
          seen.add(generateID({ usage: 'page' }));
        }
        expect(seen.size).toBe(5000);
      });

      it('db ids minted across milliseconds sort chronologically', () => {
        const ids = [];
        for (let i = 0; i < 4; i++) {
          ids.push(generateID());
          const start = Date.now();
          while (Date.now() - start < 2) { /* spin past the ms boundary */ }
        }
        expect([...ids].sort()).toEqual(ids);
      });
    });
  });

  describe('isValidID', () => {
    it('round-trips every preset against its own config', () => {
      for (const usage of ['db', 'page', 'slug', 'token']) {
        expect(isValidID(generateID({ usage }), { usage })).toBe(true);
      }
    });

    it('rejects an id validated against the wrong usage', () => {
      expect(isValidID(generateID({ usage: 'page' }), { usage: 'db' })).toBe(false);
    });

    it('rejects a missing or mistyped prefix', () => {
      const id = generateID({ usage: 'db', prefix: 'usr_' });
      expect(isValidID(id, { usage: 'db', prefix: 'usr_' })).toBe(true);
      expect(isValidID(id, { usage: 'db', prefix: 'org_' })).toBe(false);
      expect(isValidID(id, { usage: 'db' })).toBe(false);
    });

    it('rejects a non-string', () => {
      expect(isValidID(12345, { usage: 'db' })).toBe(false);
      expect(isValidID(null, { usage: 'db' })).toBe(false);
    });

    describe('checksum', () => {
      it('catches a single-character substitution', () => {
        const id = generateID({ usage: 'token', prefix: 'sk_' });
        const at = 6;
        const swap = id[at] === 'a' ? 'b' : 'a';
        const corrupt = id.slice(0, at) + swap + id.slice(at + 1);
        expect(isValidID(corrupt, { usage: 'token', prefix: 'sk_' })).toBe(false);
      });

      it('catches a transposition of two adjacent characters', () => {
        let id;
        // body chars 4 and 5 must differ for the swap to be a real change
        do {
          id = generateID({ usage: 'token' });
        }
        while (id[4] === id[5]);
        const swapped = id.slice(0, 4) + id[5] + id[4] + id.slice(6);
        expect(isValidID(swapped, { usage: 'token' })).toBe(false);
      });

      // weighting char *values*, not char codes, closes the gap where digit/letter
      // pairs 31 apart in ASCII (e.g. 9 and x) aliased to the same checksum
      it('catches every adjacent transposition with no alias gap', () => {
        for (let n = 0; n < 200; n++) {
          const id = generateID({ usage: 'token' });
          for (let i = 0; i < id.length - 2; i++) {
            if (id[i] === id[i + 1]) {
              continue;
            }
            const swapped = id.slice(0, i) + id[i + 1] + id[i] + id.slice(i + 2);
            expect(isValidID(swapped, { usage: 'token' })).toBe(false);
          }
        }
      });

      it('catches a typo in the prefix', () => {
        const id = generateID({ usage: 'token', prefix: 'sk_' });
        const corrupt = 'sl_' + id.slice(3);
        expect(isValidID(corrupt, { usage: 'token', prefix: 'sl_' })).toBe(false);
      });
    });

    describe('accept loose', () => {
      it('accepts a lowercased db id with I/L/O transcribed and hyphens added', () => {
        const id = generateID();
        const sloppy = id.toLowerCase().replace(/1/g, 'l').replace(/0/g, 'o');
        expect(isValidID(sloppy, { usage: 'db' })).toBe(true);
      });

      it('validates a grouped id by ignoring the hyphens', () => {
        const id = generateID({ usage: 'slug', group: 4 });
        expect(isValidID(id, { usage: 'slug', group: 4 })).toBe(true);
        expect(isValidID(id, { usage: 'slug' })).toBe(true);
      });

      // ß uppercases to 'SS' and ﬀ to 'FF' — a length-changing fold would let a
      // too-short string pass the length and alphabet guards, so fold is ascii-only
      it('rejects unicode that toUpperCase would expand into base32 letters', () => {
        expect(isValidID('0'.repeat(24) + 'ß', { usage: 'db' })).toBe(false);
        expect(isValidID('F' + '0'.repeat(24) + 'ß', { usage: 'token' })).toBe(false);
      });
    });

    it('validates the uuid format', () => {
      const id = generateID({ format: 'uuid', prefix: 'usr_' });
      expect(isValidID(id, { format: 'uuid', prefix: 'usr_' })).toBe(true);
      expect(isValidID('usr_not-a-uuid', { format: 'uuid', prefix: 'usr_' })).toBe(false);
    });
  });

  describe('parseID', () => {
    it('splits prefix, body, and checksum', () => {
      const id = generateID({ usage: 'token', prefix: 'sk_' });
      const parsed = parseID(id, { usage: 'token', prefix: 'sk_' });
      expect(parsed.prefix).toBe('sk_');
      expect(parsed.body).toHaveLength(26);
      expect(parsed.checksum).toHaveLength(1);
    });

    it('decodes the db timestamp to within a second of now', () => {
      const before = Date.now();
      const parsed = parseID(generateID({ usage: 'db' }), { usage: 'db' });
      expect(parsed.timestamp).toBeInstanceOf(Date);
      expect(Math.abs(parsed.timestamp.getTime() - before)).toBeLessThan(1000);
    });

    it('returns null for an id the config rejects', () => {
      expect(parseID('not-valid', { usage: 'db' })).toBe(null);
    });

    it('parses the uuid format', () => {
      const id = generateID({ format: 'uuid', prefix: 'usr_' });
      const parsed = parseID(id, { format: 'uuid', prefix: 'usr_' });
      expect(parsed.prefix).toBe('usr_');
      expect(parsed.body).toMatch(/^[0-9a-f-]+$/);
    });
  });
});
