import { createCache } from '@semantic-ui/utils';

import { describe, expect, it, vi } from 'vitest';

describe('createCache', () => {
  describe('construction', () => {
    it('requires a maxSize', () => {
      expect(() => createCache()).toThrow(TypeError);
      expect(() => createCache({})).toThrow(TypeError);
    });

    it('rejects negative maxSize', () => {
      expect(() => createCache({ maxSize: -1 })).toThrow(TypeError);
    });

    it('rejects non-integer maxSize', () => {
      expect(() => createCache({ maxSize: 1.5 })).toThrow(TypeError);
      expect(() => createCache({ maxSize: '10' })).toThrow(TypeError);
      expect(() => createCache({ maxSize: NaN })).toThrow(TypeError);
      expect(() => createCache({ maxSize: Infinity })).toThrow(TypeError);
    });

    it('rejects unknown eviction strategies', () => {
      expect(() => createCache({ maxSize: 10, eviction: 'random' })).toThrow(TypeError);
    });

    it('rejects non-function onEvict', () => {
      expect(() => createCache({ maxSize: 10, onEvict: 'nope' })).toThrow(TypeError);
    });

    it('defaults eviction to lru', () => {
      const cache = createCache({ maxSize: 10 });
      expect(cache.eviction).toBe('lru');
    });

    it('exposes maxSize and eviction', () => {
      const cache = createCache({ maxSize: 5, eviction: 'fifo' });
      expect(cache.maxSize).toBe(5);
      expect(cache.eviction).toBe('fifo');
    });
  });

  describe('basic Map-like API', () => {
    it('stores and retrieves values', () => {
      const cache = createCache({ maxSize: 10 });
      cache.set('a', 1);
      cache.set('b', 2);
      expect(cache.get('a')).toBe(1);
      expect(cache.get('b')).toBe(2);
      expect(cache.size).toBe(2);
    });

    it('returns undefined for missing keys', () => {
      const cache = createCache({ maxSize: 10 });
      expect(cache.get('missing')).toBeUndefined();
    });

    it('supports has()', () => {
      const cache = createCache({ maxSize: 10 });
      cache.set('a', 1);
      expect(cache.has('a')).toBe(true);
      expect(cache.has('missing')).toBe(false);
    });

    it('supports delete()', () => {
      const cache = createCache({ maxSize: 10 });
      cache.set('a', 1);
      expect(cache.delete('a')).toBe(true);
      expect(cache.delete('a')).toBe(false);
      expect(cache.has('a')).toBe(false);
    });

    it('supports clear()', () => {
      const cache = createCache({ maxSize: 10 });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.clear();
      expect(cache.size).toBe(0);
      expect(cache.has('a')).toBe(false);
    });

    it('set() is chainable', () => {
      const cache = createCache({ maxSize: 10 });
      expect(cache.set('a', 1)).toBe(cache);
    });

    it('updates existing keys without growing size', () => {
      const cache = createCache({ maxSize: 10 });
      cache.set('a', 1);
      cache.set('a', 2);
      expect(cache.size).toBe(1);
      expect(cache.get('a')).toBe(2);
    });

    it('accepts null, undefined, and object keys', () => {
      const cache = createCache({ maxSize: 10 });
      const objKey = {};
      cache.set(null, 'null-value');
      cache.set(undefined, 'undef-value');
      cache.set(objKey, 'obj-value');
      expect(cache.get(null)).toBe('null-value');
      expect(cache.get(undefined)).toBe('undef-value');
      expect(cache.get(objKey)).toBe('obj-value');
      expect(cache.size).toBe(3);
    });

    it('stores null and undefined as values', () => {
      const cache = createCache({ maxSize: 10 });
      cache.set('a', null);
      cache.set('b', undefined);
      expect(cache.get('a')).toBeNull();
      expect(cache.get('b')).toBeUndefined();
      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(true);
    });
  });

  describe('maxSize boundary', () => {
    it('evicts once size would exceed maxSize', () => {
      const cache = createCache({ maxSize: 3 });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      expect(cache.size).toBe(3);
      cache.set('d', 4);
      expect(cache.size).toBe(3);
    });

    it('never exceeds maxSize across many writes', () => {
      const cache = createCache({ maxSize: 5 });
      for (let i = 0; i < 100; i++) {
        cache.set(`k${i}`, i);
      }
      expect(cache.size).toBeLessThanOrEqual(5);
    });

    it('maxSize 0 accepts nothing but does not throw', () => {
      const cache = createCache({ maxSize: 0 });
      cache.set('a', 1);
      expect(cache.size).toBe(0);
      expect(cache.has('a')).toBe(false);
      expect(cache.get('a')).toBeUndefined();
    });

    it('maxSize 0 fires onEvict for every write', () => {
      const onEvict = vi.fn();
      const cache = createCache({ maxSize: 0, onEvict });
      cache.set('a', 1);
      cache.set('b', 2);
      expect(onEvict).toHaveBeenCalledTimes(2);
      expect(onEvict).toHaveBeenCalledWith('a', 1);
      expect(onEvict).toHaveBeenCalledWith('b', 2);
    });

    it('maxSize 1 holds exactly one entry', () => {
      const cache = createCache({ maxSize: 1 });
      cache.set('a', 1);
      expect(cache.get('a')).toBe(1);
      cache.set('b', 2);
      expect(cache.has('a')).toBe(false);
      expect(cache.get('b')).toBe(2);
      expect(cache.size).toBe(1);
    });
  });

  describe('lru eviction (default)', () => {
    it('evicts the least recently used entry when full', () => {
      const cache = createCache({ maxSize: 3 });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      // touch 'a' — now 'b' is least recently used
      cache.get('a');
      cache.set('d', 4);
      expect(cache.has('b')).toBe(false);
      expect(cache.has('a')).toBe(true);
      expect(cache.has('c')).toBe(true);
      expect(cache.has('d')).toBe(true);
    });

    it('updates to existing keys refresh recency', () => {
      const cache = createCache({ maxSize: 3 });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      // re-set 'a' — now 'b' is least recently used
      cache.set('a', 10);
      cache.set('d', 4);
      expect(cache.has('b')).toBe(false);
      expect(cache.get('a')).toBe(10);
    });

    it('get() does not change set of stored keys', () => {
      const cache = createCache({ maxSize: 3 });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.get('a');
      expect(cache.size).toBe(2);
      expect([...cache.keys()]).toEqual(['b', 'a']);
    });

    it('fires onEvict with evicted key and value', () => {
      const onEvict = vi.fn();
      const cache = createCache({ maxSize: 2, onEvict });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      expect(onEvict).toHaveBeenCalledTimes(1);
      expect(onEvict).toHaveBeenCalledWith('a', 1);
    });

    it('does not fire onEvict when updating existing keys', () => {
      const onEvict = vi.fn();
      const cache = createCache({ maxSize: 2, onEvict });
      cache.set('a', 1);
      cache.set('a', 2);
      expect(onEvict).not.toHaveBeenCalled();
    });
  });

  describe('fifo eviction', () => {
    it('evicts the oldest inserted entry when full', () => {
      const cache = createCache({ maxSize: 3, eviction: 'fifo' });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      // touching 'a' does not save it from eviction
      cache.get('a');
      cache.set('d', 4);
      expect(cache.has('a')).toBe(false);
      expect(cache.has('b')).toBe(true);
      expect(cache.has('d')).toBe(true);
    });

    it('updating existing key does not change insertion order', () => {
      const cache = createCache({ maxSize: 3, eviction: 'fifo' });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('a', 10);
      cache.set('d', 4);
      expect(cache.has('a')).toBe(false);
      expect(cache.has('b')).toBe(true);
    });

    it('fires onEvict with oldest key and value', () => {
      const onEvict = vi.fn();
      const cache = createCache({ maxSize: 2, eviction: 'fifo', onEvict });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      expect(onEvict).toHaveBeenCalledTimes(1);
      expect(onEvict).toHaveBeenCalledWith('a', 1);
    });
  });

  describe('flush eviction', () => {
    it('clears all entries when full', () => {
      const cache = createCache({ maxSize: 3, eviction: 'flush' });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('d', 4);
      expect(cache.size).toBe(1);
      expect(cache.has('a')).toBe(false);
      expect(cache.has('b')).toBe(false);
      expect(cache.has('c')).toBe(false);
      expect(cache.get('d')).toBe(4);
    });

    it('fires onEvict for every flushed entry', () => {
      const onEvict = vi.fn();
      const cache = createCache({ maxSize: 3, eviction: 'flush', onEvict });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('d', 4);
      expect(onEvict).toHaveBeenCalledTimes(3);
      expect(onEvict).toHaveBeenCalledWith('a', 1);
      expect(onEvict).toHaveBeenCalledWith('b', 2);
      expect(onEvict).toHaveBeenCalledWith('c', 3);
    });

    it('does not re-order entries on get()', () => {
      const cache = createCache({ maxSize: 3, eviction: 'flush' });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.get('a');
      expect([...cache.keys()]).toEqual(['a', 'b']);
    });
  });

  describe('iteration', () => {
    it('exposes keys()', () => {
      const cache = createCache({ maxSize: 10 });
      cache.set('a', 1);
      cache.set('b', 2);
      expect([...cache.keys()]).toEqual(['a', 'b']);
    });

    it('exposes values()', () => {
      const cache = createCache({ maxSize: 10 });
      cache.set('a', 1);
      cache.set('b', 2);
      expect([...cache.values()]).toEqual([1, 2]);
    });

    it('exposes entries()', () => {
      const cache = createCache({ maxSize: 10 });
      cache.set('a', 1);
      cache.set('b', 2);
      expect([...cache.entries()]).toEqual([['a', 1], ['b', 2]]);
    });

    it('is iterable via for..of', () => {
      const cache = createCache({ maxSize: 10 });
      cache.set('a', 1);
      cache.set('b', 2);
      const collected = [];
      for (const [key, value] of cache) {
        collected.push([key, value]);
      }
      expect(collected).toEqual([['a', 1], ['b', 2]]);
    });

    it('forEach passes value, key, and cache', () => {
      const cache = createCache({ maxSize: 10 });
      cache.set('a', 1);
      cache.set('b', 2);
      const calls = [];
      cache.forEach(function(value, key, self) {
        calls.push([value, key, self]);
      });
      expect(calls).toEqual([
        [1, 'a', cache],
        [2, 'b', cache],
      ]);
    });

    it('forEach honors thisArg', () => {
      const cache = createCache({ maxSize: 10 });
      cache.set('a', 1);
      const ctx = { label: 'ctx' };
      cache.forEach(function() {
        expect(this).toBe(ctx);
      }, ctx);
    });
  });

  describe('clear()', () => {
    it('fires onEvict for each entry', () => {
      const onEvict = vi.fn();
      const cache = createCache({ maxSize: 10, onEvict });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.clear();
      expect(onEvict).toHaveBeenCalledTimes(2);
    });

    it('does not fire onEvict on an empty cache', () => {
      const onEvict = vi.fn();
      const cache = createCache({ maxSize: 10, onEvict });
      cache.clear();
      expect(onEvict).not.toHaveBeenCalled();
    });
  });
});
