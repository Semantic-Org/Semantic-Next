import type { Signal, SignalOptions } from '../signal';

/**
 * A reactive membership selector returned by `match`. Call it with a key to test
 * that key against the source value. Calling it inside a reaction subscribes only
 * that key, so a source change re-fires only the keys whose result flipped.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/derived#match match}
 */
export interface Matcher<K> {
  /**
   * Tests `key` against the current source value. Reactive inside a reaction.
   * @param key - The key to test
   */
  (key: K): boolean;

  /**
   * Stops the backing reaction so later source changes no longer re-fire matchers.
   */
  stop(): void;
}

/**
 * Creates a signal computed from other signals. The compute function re-runs
 * whenever any signal it reads changes, storing the result.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/derived#computed computed}
 * @param computeFn - Function that computes the value from other signals
 * @param options - Optional configuration for the computed signal
 * @returns A new Signal holding the computed value
 */
export function computed<T>(computeFn: () => T, options?: SignalOptions<T>): Signal<T> & { stop(): void; };

/**
 * Creates a signal derived from a single source signal, recomputing when the
 * source changes. Also available as the instance method `source.derive(fn)`.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/derived#derive derive}
 * @param source - The source signal
 * @param computeFn - Function that transforms the source value
 * @param options - Optional configuration for the derived signal
 * @returns A new Signal holding the derived value
 */
export function derive<T, U>(
  source: Signal<T>,
  computeFn: (value: T) => U,
  options?: SignalOptions<U>,
): Signal<U> & { stop(): void; };

/**
 * Creates a per-key reactive selector against a source signal. The returned
 * matcher reports whether `matchFn(key, source value)` holds, and a source change
 * re-fires only the keys whose result flipped, the "highlight one of N" pattern
 * (selected row, active tab, current route). Adapted from Solid's `createSelector`.
 * Defaults to strict-equality matching.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/derived#match match}
 * @param source - The source signal to match against
 * @param matchFn - Optional predicate comparing a key to the source value
 * @returns A reactive matcher function carrying a `stop` method
 */
export function match<V, K = V>(source: Signal<V>, matchFn?: (key: K, value: V) => boolean): Matcher<K>;
