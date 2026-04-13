/**
 * Bounded Map-like cache with pluggable eviction
 * @see {@link https://next.semantic-ui.com/docs/api/utils/cache Cache Utility Documentation}
 */

/**
 * Eviction strategy for a `Cache`.
 *
 * - `'lru'` — evict the least recently used entry (default)
 * - `'fifo'` — evict the oldest inserted entry
 * - `'flush'` — clear every entry when the cache fills
 */
export type CacheEviction = 'lru' | 'fifo' | 'flush';

/**
 * Options for `createCache`.
 */
export interface CacheOptions<K = unknown, V = unknown> {
  /**
   * Maximum number of entries the cache will hold before eviction occurs.
   * Must be a non-negative integer. A `maxSize` of 0 accepts nothing.
   */
  maxSize: number;
  /**
   * Eviction strategy to apply when the cache is full.
   * @default 'lru'
   */
  eviction?: CacheEviction;
  /**
   * Callback fired for every evicted entry. Receives the evicted key and value.
   * Not fired when an existing key is updated in place.
   */
  onEvict?: (key: K, value: V) => void;
}

/**
 * Bounded Map-like cache returned by {@link createCache}. Mirrors the ES `Map`
 * API and automatically removes entries when `maxSize` would be exceeded.
 */
export interface Cache<K = unknown, V = unknown> extends Iterable<[K, V]> {
  /** Maximum number of entries the cache will hold. */
  readonly maxSize: number;
  /** Eviction strategy used when the cache is full. */
  readonly eviction: CacheEviction;
  /** Optional callback invoked for every evicted entry. */
  readonly onEvict?: (key: K, value: V) => void;

  /** Current number of entries in the cache. */
  readonly size: number;

  /** Returns `true` if the cache holds an entry for `key`. */
  has(key: K): boolean;

  /**
   * Returns the value stored at `key`, or `undefined`. For `lru` caches this
   * call refreshes the entry's recency.
   */
  get(key: K): V | undefined;

  /**
   * Associates `value` with `key`. If the cache is full a new key will trigger
   * eviction based on the configured strategy. Returns the cache for chaining.
   */
  set(key: K, value: V): Cache<K, V>;

  /** Removes the entry for `key`. Returns `true` when an entry was removed. */
  delete(key: K): boolean;

  /** Removes every entry. Fires `onEvict` for each entry removed. */
  clear(): void;

  /**
   * Manually evict one entry according to the configured strategy. Mostly
   * useful for testing and advanced cache wiring.
   */
  evict(): void;

  /** Returns an iterator over keys in insertion order. */
  keys(): IterableIterator<K>;

  /** Returns an iterator over values in insertion order. */
  values(): IterableIterator<V>;

  /** Returns an iterator over `[key, value]` pairs in insertion order. */
  entries(): IterableIterator<[K, V]>;

  /** Iterates every entry, passing `(value, key, cache)` to the callback. */
  forEach(callback: (value: V, key: K, cache: Cache<K, V>) => void, thisArg?: unknown): void;

  /** Iterates `[key, value]` pairs in insertion order. */
  [Symbol.iterator](): IterableIterator<[K, V]>;
}

/**
 * Create a bounded Map-like cache with pluggable eviction. Mirrors the ES `Map`
 * API and automatically removes entries when `maxSize` would be exceeded.
 *
 * @see {@link https://next.semantic-ui.com/docs/api/utils/cache#createcache createCache}
 * @see {@link https://next.semantic-ui.com/examples/utils-cache Example}
 *
 * @example
 * ```ts
 * const cache = createCache<string, number>({ maxSize: 3 });
 * cache.set('a', 1);
 * cache.set('b', 2);
 * cache.get('a'); // returns 1
 *
 * const fifo = createCache({ maxSize: 100, eviction: 'fifo' });
 * const flushing = createCache({
 *   maxSize: 5000,
 *   eviction: 'flush',
 *   onEvict: (key) => console.log('evicted', key),
 * });
 * ```
 */
export function createCache<K = unknown, V = unknown>(options: CacheOptions<K, V>): Cache<K, V>;
