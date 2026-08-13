import { generateId, getRandomSeed, hashCode, isValidId, parseId } from '@semantic-ui/utils';

import { afterEach, describe, expect, it } from 'vitest';

const CROCKFORD = /^[0-9a-z]+$/;
const CROCKFORD_UPPER = /^[0-9A-Z]+$/;

describe('ID/Hashing Functions', () => {
  describe('hashCode', () => {
    afterEach(() => {
      hashCode.config = {};
    });

    it('produces a consistent number for the same input (default usage)', () => {
      expect(hashCode('Test String')).toBe(hashCode('Test String'));
      expect(typeof hashCode('Test String')).toBe('number');
    });

    it('produces different hashes for different inputs', () => {
      expect(hashCode('Test String 1')).not.toBe(hashCode('Test String 2'));
    });

    it('hashes objects, dates, and numbers distinctly', () => {
      expect(hashCode({ a: 1 })).not.toBe(hashCode({ a: 2 }));
      expect(hashCode(new Date(2020, 0, 1))).not.toBe(hashCode(new Date(2020, 0, 2)));
      expect(hashCode(5151)).not.toBe(hashCode(2121));
    });

    it('is case-sensitive', () => {
      expect(hashCode('Test String')).not.toBe(hashCode('test string'));
    });

    it('stays within the 53-bit safe-integer range', () => {
      const hash = hashCode('a'.repeat(100000));
      expect(Number.isSafeInteger(hash)).toBe(true);
      expect(hash).toBeGreaterThanOrEqual(0);
    });

    it('does not throw on special, unicode, emoji, or control input', () => {
      for (const value of ['!@#$%^&*()', '你好世界 こんにちは', '😀😃😄', '\n\r\t\b\f']) {
        expect(typeof hashCode(value)).toBe('number');
      }
    });

    it('handles null and undefined', () => {
      expect(typeof hashCode(null)).toBe('number');
      expect(typeof hashCode(undefined)).toBe('number');
    });

    it('does not throw on non-finite numeric fields', () => {
      for (const value of [Infinity, -Infinity, NaN, Number.MAX_SAFE_INTEGER]) {
        expect(() => hashCode({ value })).not.toThrow();
      }
    });

    it('separates hashes by seed', () => {
      expect(hashCode('test', { seed: 1 })).not.toBe(hashCode('test', { seed: 2 }));
    });

    describe('usage presets', () => {
      it('content is a 64-bit crockford string, deterministic', () => {
        const result = hashCode('hello', { usage: 'content' });
        expect(typeof result).toBe('string');
        expect(result).toHaveLength(13);
        expect(result).toMatch(CROCKFORD);
        expect(result).toBe(hashCode('hello', { usage: 'content' }));
      });

      it('fingerprint is twice the width of content, deterministic, and distinguishes inputs', () => {
        const result = hashCode('hello', { usage: 'fingerprint' });
        expect(result).toHaveLength(26);
        expect(result).toMatch(CROCKFORD);
        expect(result).toBe(hashCode('hello', { usage: 'fingerprint' }));
        expect(hashCode('a', { usage: 'fingerprint' })).not.toBe(hashCode('b', { usage: 'fingerprint' }));
      });

      it('fingerprint reaches 128 real bits, not a doubled 64-bit hash', () => {
        // 128 bits comes from cyrb53(seed) ++ cyrb53(seed+1). if the two passes
        // correlated, the second lane would track the first and the width is a lie.
        // independent 64-bit lanes differ in ~32 of 64 bits on average (avalanche).
        let totalDistance = 0;
        const samples = 500;
        for (let n = 0; n < samples; n++) {
          const hex = hashCode('input-' + n, { usage: 'fingerprint', format: 'hex' });
          let diff = BigInt('0x' + hex.slice(0, 16)) ^ BigInt('0x' + hex.slice(16));
          while (diff > 0n) {
            totalDistance += Number(diff & 1n);
            diff >>= 1n;
          }
        }
        const meanDistance = totalDistance / samples;
        expect(meanDistance).toBeGreaterThan(28);
        expect(meanDistance).toBeLessThan(36);
      });

      it('secure resolves to a 52-char crockford string, deterministic', async () => {
        const result = await hashCode('hello', { usage: 'secure' });
        expect(typeof result).toBe('string');
        expect(result).toHaveLength(52);
        expect(result).toMatch(CROCKFORD);
        expect(result).toBe(await hashCode('hello', { usage: 'secure' }));
      });

      it('throws on an unknown usage', () => {
        expect(() => hashCode('x', { usage: 'nope' })).toThrow(/unknown usage/);
      });
    });

    describe('format', () => {
      it('secure in hex matches the standard SHA-256 of the input', async () => {
        // sha256('hello')
        const known = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';
        expect(await hashCode('hello', { usage: 'secure', format: 'hex' })).toBe(known);
      });

      it('content in hex is 16 lowercase hex chars', () => {
        const result = hashCode('hello', { usage: 'content', format: 'hex' });
        expect(result).toHaveLength(16);
        expect(result).toMatch(/^[0-9a-f]+$/);
      });

      it('number format returns the raw integer for the hash usage', () => {
        expect(hashCode('hello', { usage: 'hash', format: 'number' })).toBe(hashCode('hello'));
      });

      it('throws when number format cannot hold a wider hash', () => {
        expect(() => hashCode('x', { usage: 'content', format: 'number' })).toThrow(/can't hold/);
        expect(() => hashCode('x', { usage: 'fingerprint', format: 'number' })).toThrow(/can't hold/);
      });

      it('throws on an unknown format', () => {
        expect(() => hashCode('x', { format: 'base64' })).toThrow(/unknown format/);
      });
    });

    describe('config', () => {
      it('global config sets the default usage', () => {
        hashCode.config = { usage: 'content' };
        const result = hashCode('hello');
        expect(typeof result).toBe('string');
        expect(result).toHaveLength(13);
      });

      it('call options override global config', () => {
        hashCode.config = { usage: 'content' };
        expect(typeof hashCode('hello', { usage: 'hash' })).toBe('number');
      });

      it('ignoreConfig resolves as if no global config were set', () => {
        const plain = hashCode('hello');
        hashCode.config = { usage: 'content', seed: 99 };
        expect(typeof hashCode('hello')).toBe('string');
        expect(hashCode('hello', { ignoreConfig: true })).toBe(plain);
      });

      it('call options still apply under ignoreConfig', () => {
        hashCode.config = { seed: 99 };
        expect(hashCode('hello', { usage: 'content', ignoreConfig: true }))
          .toBe(hashCode('hello', { usage: 'content', ignoreConfig: true }));
        expect(typeof hashCode('hello', { usage: 'content', ignoreConfig: true })).toBe('string');
      });
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

  describe('generateId', () => {
    afterEach(() => {
      generateId.config = {};
    });

    describe('presets', () => {
      it('defaults to a 26-char lowercase ULID', () => {
        const id = generateId();
        expect(id).toHaveLength(26);
        expect(id).toMatch(CROCKFORD);
      });

      it('page is 8 chars, lowercase, always letter-first', () => {
        for (let i = 0; i < 200; i++) {
          const id = generateId({ usage: 'page' });
          expect(id).toHaveLength(8);
          expect(id).toMatch(CROCKFORD);
          // a leading digit is an invalid CSS identifier — page must never produce one
          expect(id[0]).toMatch(/[a-z]/);
        }
      });

      it('link is 11 chars, lowercase', () => {
        const id = generateId({ usage: 'link' });
        expect(id).toHaveLength(11);
        expect(id).toMatch(CROCKFORD);
      });

      it('token is 27 chars and self-validates via its checksum', () => {
        const id = generateId({ usage: 'token' });
        expect(id).toHaveLength(27);
        expect(isValidId(id, { usage: 'token' })).toBe(true);
      });

      it('code is 12 uppercase chars, grouped in fours, self-validating', () => {
        const id = generateId({ usage: 'code' });
        // 'ABCD-EFGH-JKLM' — the last char is the checksum, validation folds the hyphens
        expect(id).toMatch(/^[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/);
        expect(isValidId(id, { usage: 'code' })).toBe(true);
      });

      it('throws on an unknown usage', () => {
        expect(() => generateId({ usage: 'nope' })).toThrow(/unknown usage/);
      });
    });

    describe('options', () => {
      it('length overrides the preset width', () => {
        expect(generateId({ length: 17 })).toHaveLength(17);
      });

      it('prefix is prepended verbatim, length counts the part after it', () => {
        const id = generateId({ usage: 'page', prefix: 'tab-' });
        expect(id.startsWith('tab-')).toBe(true);
        expect(id.slice('tab-'.length)).toHaveLength(8);
      });

      it('format uuid emits an RFC UUIDv7', () => {
        expect(generateId({ format: 'uuid' })).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
        );
      });

      it('group hyphenates every n chars', () => {
        expect(generateId({ usage: 'page', group: 4 })).toMatch(/^[a-z0-9]{4}-[a-z0-9]{4}$/);
      });

      it('upper overrides the preset case at generation', () => {
        expect(generateId({ usage: 'page', upper: true })).toMatch(CROCKFORD_UPPER);
        expect(generateId({ usage: 'db', upper: false })).toMatch(CROCKFORD);
      });

      it('ignores a non-object argument, falling through to the default usage', () => {
        expect(generateId(12345)).toHaveLength(26);
        expect(generateId(null)).toHaveLength(26);
      });

      // the 10-char clock plus a random char is the floor; a shorter length would
      // emit a 10-char id that isValidId then rejects, so fail loud instead
      it('throws when length is below the timestamp floor for db', () => {
        expect(() => generateId({ usage: 'db', length: 9 })).toThrow(/at least 11/);
      });
    });

    describe('config', () => {
      it('global config sets the default usage', () => {
        generateId.config = { usage: 'page' };
        expect(generateId()).toHaveLength(8);
      });

      it('call options override global config', () => {
        generateId.config = { usage: 'page' };
        expect(generateId({ usage: 'link' })).toHaveLength(11);
      });

      it('an explicit false checksum overrides the token preset default', () => {
        const plain = generateId({ usage: 'token', checksum: false });
        expect(plain).toHaveLength(27);
      });

      it('ignoreConfig resolves as if no global config were set', () => {
        generateId.config = { usage: 'page', prefix: 'app_', length: 20 };
        const id = generateId({ ignoreConfig: true });
        expect(id).toHaveLength(26);
        expect(id.startsWith('app_')).toBe(false);
      });

      it('call options still win under ignoreConfig', () => {
        generateId.config = { prefix: 'app_' };
        expect(generateId({ usage: 'page', ignoreConfig: true })).toHaveLength(8);
      });

      it('isValidId and parseId honor ignoreConfig, matching a config-free mint', () => {
        generateId.config = { prefix: 'app_' };
        const id = generateId({ ignoreConfig: true });
        // the ambient prefix makes the plain id read invalid — the hazard ignoreConfig exists for
        expect(isValidId(id)).toBe(false);
        expect(isValidId(id, { ignoreConfig: true })).toBe(true);
        expect(parseId(id, { ignoreConfig: true })).not.toBeNull();
      });
    });

    describe('uniqueness and ordering', () => {
      it('produces unique ids across many mints', () => {
        const seen = new Set();
        for (let i = 0; i < 5000; i++) {
          seen.add(generateId({ usage: 'page' }));
        }
        expect(seen.size).toBe(5000);
      });

      it('db ids minted across milliseconds sort chronologically', () => {
        const ids = [];
        for (let i = 0; i < 4; i++) {
          ids.push(generateId());
          const start = Date.now();
          while (Date.now() - start < 2) { /* spin past the ms boundary */ }
        }
        expect([...ids].sort()).toEqual(ids);
      });
    });
  });

  describe('isValidId', () => {
    it('round-trips every preset against its own config', () => {
      for (const usage of ['db', 'page', 'link', 'token', 'code']) {
        expect(isValidId(generateId({ usage }), { usage })).toBe(true);
      }
    });

    it('rejects an id validated against the wrong usage', () => {
      expect(isValidId(generateId({ usage: 'page' }), { usage: 'db' })).toBe(false);
    });

    it('rejects a missing or mistyped prefix', () => {
      const id = generateId({ usage: 'db', prefix: 'usr_' });
      expect(isValidId(id, { usage: 'db', prefix: 'usr_' })).toBe(true);
      expect(isValidId(id, { usage: 'db', prefix: 'org_' })).toBe(false);
      expect(isValidId(id, { usage: 'db' })).toBe(false);
    });

    it('rejects a non-string', () => {
      expect(isValidId(12345, { usage: 'db' })).toBe(false);
      expect(isValidId(null, { usage: 'db' })).toBe(false);
    });

    describe('checksum', () => {
      it('catches a single-character substitution', () => {
        const id = generateId({ usage: 'token', prefix: 'sk_' });
        const at = 6;
        const swap = id[at] === 'a' ? 'b' : 'a';
        const corrupt = id.slice(0, at) + swap + id.slice(at + 1);
        expect(isValidId(corrupt, { usage: 'token', prefix: 'sk_' })).toBe(false);
      });

      it('catches a transposition of two adjacent characters', () => {
        let id;
        // body chars 4 and 5 must differ for the swap to be a real change
        do {
          id = generateId({ usage: 'token' });
        }
        while (id[4] === id[5]);
        const swapped = id.slice(0, 4) + id[5] + id[4] + id.slice(6);
        expect(isValidId(swapped, { usage: 'token' })).toBe(false);
      });

      // weighting char *values*, not char codes, closes the gap where digit/letter
      // pairs 31 apart in ASCII (e.g. 9 and x) aliased to the same checksum
      it('catches every adjacent transposition with no alias gap', () => {
        for (let n = 0; n < 200; n++) {
          const id = generateId({ usage: 'token' });
          for (let i = 0; i < id.length - 2; i++) {
            if (id[i] === id[i + 1]) {
              continue;
            }
            const swapped = id.slice(0, i) + id[i + 1] + id[i] + id.slice(i + 2);
            expect(isValidId(swapped, { usage: 'token' })).toBe(false);
          }
        }
      });

      it('catches a typo in the prefix', () => {
        const id = generateId({ usage: 'token', prefix: 'sk_' });
        const corrupt = 'sl_' + id.slice(3);
        expect(isValidId(corrupt, { usage: 'token', prefix: 'sl_' })).toBe(false);
      });
    });

    describe('accept loose', () => {
      it('accepts a lowercased db id with I/L/O transcribed and hyphens added', () => {
        const id = generateId();
        const sloppy = id.toLowerCase().replace(/1/g, 'l').replace(/0/g, 'o');
        expect(isValidId(sloppy, { usage: 'db' })).toBe(true);
      });

      it('validates a grouped id by ignoring the hyphens', () => {
        const id = generateId({ usage: 'link', group: 4 });
        expect(isValidId(id, { usage: 'link', group: 4 })).toBe(true);
        expect(isValidId(id, { usage: 'link' })).toBe(true);
      });

      // ß uppercases to 'SS' and ﬀ to 'FF' — a length-changing fold would let a
      // too-short string pass the length and alphabet guards, so fold is ascii-only
      it('rejects unicode that toUpperCase would expand into base32 letters', () => {
        expect(isValidId('0'.repeat(24) + 'ß', { usage: 'db' })).toBe(false);
        expect(isValidId('F' + '0'.repeat(24) + 'ß', { usage: 'token' })).toBe(false);
      });
    });

    it('validates the uuid format', () => {
      const id = generateId({ format: 'uuid', prefix: 'usr_' });
      expect(isValidId(id, { format: 'uuid', prefix: 'usr_' })).toBe(true);
      expect(isValidId('usr_not-a-uuid', { format: 'uuid', prefix: 'usr_' })).toBe(false);
    });
  });

  describe('parseId', () => {
    it('splits prefix, body, and checksum', () => {
      const id = generateId({ usage: 'token', prefix: 'sk_' });
      const parsed = parseId(id, { usage: 'token', prefix: 'sk_' });
      expect(parsed.prefix).toBe('sk_');
      expect(parsed.body).toHaveLength(26);
      expect(parsed.checksum).toHaveLength(1);
    });

    it('decodes the db timestamp to within a second of now', () => {
      const before = Date.now();
      const parsed = parseId(generateId({ usage: 'db' }), { usage: 'db' });
      expect(parsed.timestamp).toBeInstanceOf(Date);
      expect(Math.abs(parsed.timestamp.getTime() - before)).toBeLessThan(1000);
    });

    it('returns null for an id the config rejects', () => {
      expect(parseId('not-valid', { usage: 'db' })).toBe(null);
    });

    it('parses the uuid format', () => {
      const id = generateId({ format: 'uuid', prefix: 'usr_' });
      const parsed = parseId(id, { format: 'uuid', prefix: 'usr_' });
      expect(parsed.prefix).toBe('usr_');
      expect(parsed.body).toMatch(/^[0-9a-f-]+$/);
    });
  });
});
