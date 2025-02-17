/**
 * Function utilities
 */

/**
 * Options for debounced functions
 */
export interface DebounceOptions {
  /** Delay in milliseconds before function is called */
  delay?: number;
  /** Call the function on the leading edge of the timeout */
  immediate?: boolean;
}

/**
 * A no-operation function that does nothing
 * Useful to avoid function creation overhead when using multiple noop functions
 * 
 * @example
 * ```ts
 * const callback = shouldExecute ? actualCallback : noop;
 * ```
 */
export function noop(): void;

/**
 * Wraps a value in a function if it isn't already a function
 * 
 * @param x - Value or function to wrap
 * @returns A function that returns the value, or the original function
 * 
 * @example
 * ```ts
 * const fn1 = wrapFunction(() => 'hello') // returns original function
 * const fn2 = wrapFunction('hello') // returns () => 'hello'
 * ```
 */
export function wrapFunction<T>(x: T | (() => T)): () => T;

/**
 * Creates a memoized version of a function
 * Caches return values based on input arguments
 * 
 * @param fn - Function to memoize
 * @param hashFunction - Optional function to generate cache keys
 * @returns Memoized function
 * 
 * @example
 * ```ts
 * const memoizedFn = memoize(
 *   (a: number, b: number) => a + b,
 *   args => args.join('-')
 * );
 * memoizedFn(1, 2); // computes 3
 * memoizedFn(1, 2); // returns cached 3
 * ```
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  hashFunction?: (args: Parameters<T>) => string | number
): T & { cache: Map<string | number, ReturnType<T>> };

/**
 * Creates a debounced version of a function
 * The debounced function will delay execution until after wait milliseconds
 * have elapsed since the last time it was called
 * 
 * @param fn - Function to debounce
 * @param options - Debounce configuration options or delay in milliseconds
 * @returns Debounced function with a cancel method
 * 
 * @example
 * ```ts
 * const debouncedSave = debounce(save, { delay: 1000 });
 * debouncedSave(); // Calls save after 1 second of inactivity
 * debouncedSave.cancel(); // Cancels pending execution
 * 
 * // Can also pass delay directly
 * const debouncedLoad = debounce(load, 500);
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  options: DebounceOptions | number
): T & { cancel: () => void };
