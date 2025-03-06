/**
 * Error handling and creation utilities
 * @see {@link https://next.semantic-ui.com/api/utils/errors Error Utilities Documentation}
 */

/**
 * Options for the fatal error function
 */
export interface FatalOptions {
  /** The error constructor to use (defaults to Error) */
  errorType?: ErrorConstructor;
  /** Additional metadata to attach to the error */
  metadata?: Record<string, any>;
  /** Optional callback to handle the error */
  onError?: (error: Error) => void;
  /** Number of stack trace lines to remove (defaults to 1) */
  removeStackLines?: number;
}

/**
 * Throws an error asynchronously with enhanced error handling capabilities.
 * The error is thrown in the next microtask to avoid interrupting the current execution context.
 * 
 * @param message - The error message
 * @param options - Configuration options for the error
 * 
 * @example
 * ```ts
 * fatal("Invalid configuration", {
 *   metadata: { code: "CONFIG_ERROR" },
 *   onError: (err) => logError(err)
 * });
 * ```
 */
export function fatal(message: string, options?: FatalOptions): void;
