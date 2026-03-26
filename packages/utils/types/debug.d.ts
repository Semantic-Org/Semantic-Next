/**
 * Debug utilities including logging and error handling
 * @see {@link https://next.semantic-ui.com/docs/api/utils/debug Debug Utilities Documentation}
 */

/**
 * Options for the fatal error function
 */
export interface FatalOptions {
  /** The error constructor to use (defaults to Error) */
  errorType?: ErrorConstructor;
  /** Additional metadata to attach to the error */
  metadata?: Record<string, any>;
  /** Optional callback to intercept the error — when provided, prevents the error from being thrown */
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

/**
 * Log levels supported by the logging utility
 */
export type LogLevel = 'debug' | 'log' | 'info' | 'warn' | 'error';

/**
 * Output format options for logging
 */
export type LogFormat = 'standard' | 'json';

/**
 * Options for the log function
 */
export interface LogOptions {
  /** Namespace for grouping related logs (used as default title) */
  namespace?: string;
  /** Additional data to include with the log message — accepts arrays or single objects */
  data?: any;
  /** Text color for the message */
  color?: string;
  /** Whether to include timestamp in the output */
  timestamp?: boolean;
  /** Output format - 'standard' for formatted console output, 'json' for structured data */
  format?: LogFormat;
  /** Override the console method used for output */
  consoleMethod?: 'log' | 'debug' | 'info' | 'warn' | 'error';
  /** Suppress all output when true */
  silent?: boolean;
  /** Title/label to display before the message */
  title?: string;
  /** Whether to show the title/label */
  showTitle?: boolean;
  /** Color for the title/label */
  titleColor?: string;
}

/**
 * Flexible logging utility with formatting, namespacing, and multiple output options.
 * Supports colored output, timestamps, structured JSON format, and configurable titles.
 *
 * @see {@link https://next.semantic-ui.com/docs/api/utils/debug#log log}
 * @see {@link https://next.semantic-ui.com/examples/utils-log Example}
 *
 * @param message - The message to log
 * @param level - Log level determining console method and default colors
 * @param options - Configuration options for output formatting
 *
 * @example
 * ```ts
 * // Basic usage
 * log('Application started', 'info');
 *
 * // With namespace and data
 * log('User action', 'debug', {
 *   namespace: 'UserService',
 *   data: [{ action: 'login', userId: 123 }]
 * });
 *
 * // JSON format for structured logging
 * log('API response', 'info', {
 *   format: 'json',
 *   data: [responseData],
 *   timestamp: true
 * });
 *
 * // Custom styling
 * log('Important notice', 'warn', {
 *   title: 'NOTICE',
 *   titleColor: '#FF6B35',
 *   timestamp: true
 * });
 * ```
 */
export function log(message: string, level?: LogLevel, options?: LogOptions): void;
