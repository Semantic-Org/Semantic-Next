import { isFunction } from './types.js';

/*-------------------
      Cache
--------------------*/

/*
  Bounded Map-like cache with pluggable eviction.

  Strategies:
    - 'lru'   — evict least recently used (default)
    - 'fifo'  — evict oldest inserted entry
    - 'flush' — clear every entry when full (cheap, bulk invalidation)

  Relies on Map's insertion-order iteration: for LRU, get() re-inserts the
  entry to the tail so the oldest key in iteration order is always the
  least recently used.
*/

const EVICTION_STRATEGIES = new Set(['lru', 'fifo', 'flush']);

export const createCache = ({ maxSize, eviction = 'lru', onEvict } = {}) => {
  if (!Number.isInteger(maxSize) || maxSize < 0) {
    throw new TypeError('createCache: maxSize must be a non-negative integer');
  }
  if (!EVICTION_STRATEGIES.has(eviction)) {
    throw new TypeError(`createCache: unknown eviction strategy '${eviction}'. Use 'lru', 'fifo', or 'flush'.`);
  }
  if (onEvict !== undefined && !isFunction(onEvict)) {
    throw new TypeError('createCache: onEvict must be a function');
  }

  const store = new Map();

  // forward-declared so methods (set, forEach) can reference the cache itself
  const cache = {
    maxSize,
    eviction,
    onEvict,

    get size() {
      return store.size;
    },

    has(key) {
      return store.has(key);
    },

    get(key) {
      if (eviction === 'lru' && store.has(key)) {
        // refresh recency: delete and re-insert to move entry to the tail
        const value = store.get(key);
        store.delete(key);
        store.set(key, value);
        return value;
      }
      return store.get(key);
    },

    set(key, value) {
      if (maxSize === 0) {
        // disabled cache — still fire onEvict so callers can observe the discard
        if (onEvict) {
          onEvict(key, value);
        }
        return cache;
      }

      if (store.has(key)) {
        // update existing entry; for LRU this also refreshes recency
        if (eviction === 'lru') {
          store.delete(key);
        }
        store.set(key, value);
        return cache;
      }

      if (store.size >= maxSize) {
        cache.evict();
      }

      store.set(key, value);
      return cache;
    },

    delete(key) {
      return store.delete(key);
    },

    clear() {
      if (onEvict && store.size > 0) {
        for (const [key, value] of store) {
          onEvict(key, value);
        }
      }
      store.clear();
    },

    evict() {
      if (store.size === 0) {
        return;
      }

      if (eviction === 'flush') {
        cache.clear();
        return;
      }

      // lru and fifo both drop the oldest entry in the Map's iteration order
      const oldestKey = store.keys().next().value;
      const oldestValue = store.get(oldestKey);
      store.delete(oldestKey);
      if (onEvict) {
        onEvict(oldestKey, oldestValue);
      }
    },

    keys() {
      return store.keys();
    },

    values() {
      return store.values();
    },

    entries() {
      return store.entries();
    },

    forEach(callback, thisArg) {
      store.forEach((value, key) => callback.call(thisArg, value, key, cache));
    },

    [Symbol.iterator]() {
      return store[Symbol.iterator]();
    },
  };

  return cache;
};
