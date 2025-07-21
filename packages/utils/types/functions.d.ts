/**
 * Function manipulation and optimization utilities
 * @see {@link https://next.semantic-ui.com/api/utils/functions Function Utilities Documentation}
 */

/**
 * Function utilities
 */

/**
 * Options for debounced functions
 */
export interface DebounceOptions {
  /** Whether to reject skipped calls (default: false) */
  rejectSkipped?: boolean;
  /** Execute on first call (default: false) */
  leading?: boolean;
  /** Execute after wait period (default: true) */
  trailing?: boolean;
  /** Maximum time to wait before forcing execution */
  maxWait?: number;
  /** AbortController for cancellation */
  abortController?: AbortController;
}

/**
 * Options for throttled functions
 */
export interface ThrottleOptions {
  /** Whether to reject skipped calls (default: false) */
  rejectSkipped?: boolean;
  /** Execute immediately on first call (default: true) */
  leading?: boolean;
  /** Execute once more after wait period if calls occurred (default: true) */
  trailing?: boolean;
  /** AbortController for cancellation */
  abortController?: AbortController;
}

/**
 * Debounced function interface
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> extends Promise<any> ? Promise<Awaited<ReturnType<T>>> : Promise<ReturnType<T>> | ReturnType<T>;
  cancel(): void;
  flush(): ReturnType<T> extends Promise<any> ? Promise<Awaited<ReturnType<T>>> : ReturnType<T>;
  pending(): boolean;
}

/**
 * Throttled function interface  
 */
export interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> extends Promise<any> ? Promise<Awaited<ReturnType<T>>> : Promise<ReturnType<T>> | ReturnType<T>;
  cancel(): void;
  flush(): ReturnType<T> extends Promise<any> ? Promise<Awaited<ReturnType<T>>> : ReturnType<T>;
  pending(): boolean;
}

/**
 * A no-operation function that does nothing
 * Useful to avoid function creation overhead when using multiple noop functions
 * @see {@link https://next.semantic-ui.com/api/utils/functions#noop noop}
 *
 * @example
 * ```ts
 * const callback = shouldExecute ? actualCallback : noop;
 * ```
 */
export function noop(...args: any[]): void;

/**
 * Wraps a value in a function if it isn't already a function
 * @see {@link https://next.semantic-ui.com/api/utils/functions#wrapfunction wrapFunction}
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
 * @see {@link https://next.semantic-ui.com/api/utils/functions#memoize memoize}
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
  hashFunction?: (args: Parameters<T>) => string | number,
): T & { cache: Map<string | number, ReturnType<T>>; };

/**
 * Creates a debounced version of a function that delays execution until after wait milliseconds 
 * have elapsed since the last time it was called. Supports both sync and async functions with 
 * comprehensive promise handling and AbortController integration.
 * @see {@link https://next.semantic-ui.com/api/utils/functions#debounce debounce}
 * @see {@link https://next.semantic-ui.com/examples/utils-debounce Example}
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param options - Options for configuring the debounced function behavior
 * @returns A debounced function with cancel, flush, and pending methods
 *
 * @example
 * ```ts
 * // Basic usage
 * const debouncedSave = debounce(saveData, 1000);
 * debouncedSave(); // Executes after 1 second of inactivity
 * 
 * // With options
 * const debouncedSearch = debounce(search, 300, { 
 *   leading: true,
 *   maxWait: 1000 
 * });
 * 
 * // AbortController integration
 * const controller = new AbortController();
 * const debouncedFetch = debounce(fetchData, 500, { abortController: controller });
 * controller.abort(); // Cancels pending execution
 * 
 * // Promise handling
 * const results = await Promise.all([
 *   debouncedFunction(arg1),
 *   debouncedFunction(arg2),
 *   debouncedFunction(arg3)
 * ]); // All promises resolve with the result of the final execution
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: DebounceOptions
): DebouncedFunction<T>;

/**
 * Creates a throttled version of a function that only invokes the function at most once per 
 * every wait milliseconds. Supports both sync and async functions with comprehensive promise 
 * handling and AbortController integration.
 * @see {@link https://next.semantic-ui.com/api/utils/functions#throttle throttle}  
 * @see {@link https://next.semantic-ui.com/examples/utils-throttle Example}
 *
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @param options - Options for configuring the throttled function behavior
 * @returns A throttled function with cancel, flush, and pending methods
 *
 * @example
 * ```ts
 * // Basic usage with default leading and trailing execution
 * const throttledScroll = throttle(handleScroll, 100);
 * 
 * // Leading only (execute immediately, ignore subsequent calls)
 * const throttledClick = throttle(handleClick, 1000, { 
 *   leading: true, 
 *   trailing: false 
 * });
 * 
 * // Trailing only (execute once after wait period)
 * const throttledResize = throttle(handleResize, 250, { 
 *   leading: false, 
 *   trailing: true 
 * });
 * 
 * // AbortController integration
 * const controller = new AbortController();
 * const throttledAPI = throttle(apiCall, 2000, { abortController: controller });
 * controller.abort(); // Cancels pending execution
 * 
 * // Methods
 * throttledFunction.cancel(); // Cancel pending execution
 * throttledFunction.flush();  // Execute immediately with latest args
 * throttledFunction.pending(); // Check if execution is scheduled
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: ThrottleOptions
): ThrottledFunction<T>;
