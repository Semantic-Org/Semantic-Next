/**
 * Debug utilities including logging and error handling
 * @see {@link https://next.semantic-ui.com/docs/api/utils/debug Debug Utilities Documentation}
 */

/**
 * Options for a coded error's construction
 */
export interface ErrorOptions {
  /** The development explanation — the teaching message, appended beneath the
   * production line. Meant to fold out of production builds via a callsite
   * ternary (`isDevelopment ? '...' : 0`); when folded away, the line is the
   * whole message */
  explanation?: string | 0;
  /** Structured data attached to the error as `error.detail` */
  detail?: any;
  /** The line's verb — any word, the layer's own classification of the line.
   * Nullish falls back to `'refused'` */
  verb?: string;
}

/**
 * A coded Error with the layer's uniform message split
 */
export interface CodedError extends Error {
  /** The stable, programmatically routable refusal code */
  code: string;
  /** The address the refusal happened at, as given at the callsite */
  at: string;
  /** Structured data attached at the callsite */
  detail?: any;
}

/**
 * Options for the reporting door — the construction options plus the report
 * switch
 */
export interface ErrorReportOptions extends ErrorOptions {
  /** Set `false` to build and return the coded error without reporting it —
   * no `onError` routing, no console fallback — for when the error is a value
   * (a rejection, a result) and reporting is the consumer's job */
  report?: boolean;
}

/**
 * The reporting door: builds the coded error and reports it through the error
 * channel WITHOUT interrupting the caller. The raise is asynchronous — it
 * routes to `globalThis.onError` when an app installs one and falls back to
 * `console.error` otherwise so a report is never silently lost. Returns the
 * Error it reported. `report: false` skips the raise and returns the built
 * error alone.
 */
export interface ErrorReporter {
  (code: string, at: string, options?: ErrorReportOptions): CodedError;
  /** The production one-liner alone — `<layer> <verb> [<code>] <at>` — for console seats */
  line(code: string, at: string, options?: { verb?: string; }): string;
}

/**
 * The error tools bound to one layer's identity
 */
export interface ErrorTools {
  /** Report through the error channel and continue; returns the reported Error */
  error: ErrorReporter;
  /** Same arguments, throws synchronously, never returns */
  throwError(code: string, at: string, options?: ErrorOptions): never;
}

/**
 * Options for createErrors
 */
export interface CreateErrorsOptions {
  /** The layer's public name, leading the production line (e.g. 'sync', 'component') */
  layer?: string;
  /** The error constructor every refusal builds with (defaults to Error) */
  ErrorClass?: ErrorConstructor;
}

/**
 * Creates a layer-bound error toolset: `error` reports through the error
 * channel and continues, `throwError` throws, and `error.line` renders the
 * uniform production line `<layer> <verb> [<code>] <at>` (parseable with
 * `/^(\S+) (\S+) \[([\w-]+)\] (.*)$/m`). The verb is a stable token position
 * carrying the layer's own classification — any word, `refused` when not
 * given — so grepping a word filters lines by class. Every message leads with that line;
 * development appends the teaching `explanation` beneath it, and explanations
 * are meant to fold out of production builds at the callsite: a bundler define
 * folds branches, never arguments, so the ternary
 * (`explanation: isDevelopment ? '...' : 0`) must live where the string does.
 *
 * @see {@link https://next.semantic-ui.com/docs/api/utils/debug#createerrors createErrors}
 * @see {@link https://next.semantic-ui.com/examples/utils-createerrors Example}
 *
 * @param options - The layer binding
 * @returns The bound `{ error, throwError }` toolset
 *
 * @example
 * ```ts
 * const { error, throwError } = createErrors({ layer: 'sync' });
 *
 * throwError('forbidden', 'todos:secret.field', {
 *   explanation: isDevelopment ? 'the field is private — write the fields you mean' : 0,
 * });
 *
 * console.warn(error.line('storageChanged', 'db-1 -> db-2'));
 * ```
 */
export function createErrors(options?: CreateErrorsOptions): ErrorTools;

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
