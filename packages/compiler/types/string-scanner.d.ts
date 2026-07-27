// string-scanner.d.ts

/**
 * Context describing where the scanner currently sits in the markup.
 * `attribute` and `booleanAttribute` are only present when the position is
 * inside a tag and an attribute name could be resolved.
 */
export interface ScannerContext {
  /** True when the position sits inside an unclosed `<tag`. */
  insideTag: boolean;
  /** Name of the attribute being written at this position. */
  attribute?: string;
  /** True for known boolean attributes and for unquoted attribute values. */
  booleanAttribute?: boolean;
}

/**
 * Compiled forms of a scanner pattern. `sticky` is anchored at `lastIndex` for
 * matching at the current position, `search` is global for scanning forward.
 * @internal
 */
export interface ScannerRegex {
  sticky: RegExp;
  search: RegExp;
}

/**
 * A string scanner class that provides methods for scanning and manipulating strings.
 * Adapted from BlazeJS Scanner.
 * @see {@link https://next.semantic-ui.com/docs/api/templating/string-scanner StringScanner API Reference}
 */
export class StringScanner {
  /**
   * Debug mode flag. When true, `fatal` logs the failing lines with surrounding
   * context (to the console, and to the document body in a browser) and throws.
   * When false, `fatal` is a no-op and parsing continues past the error.
   */
  static DEBUG_MODE: boolean;

  /**
   * Cache of compiled patterns for string inputs. Regular expression inputs
   * cache on the pattern itself instead.
   * @internal
   */
  static stringRegex: Map<string, ScannerRegex>;

  /**
   * Compiles a pattern into its sticky and global forms, caching the result.
   * @param pattern - The string or regular expression to compile.
   * @returns The cached sticky and search regular expressions.
   * @internal
   */
  static getRegex(pattern: string | RegExp): ScannerRegex;

  /** The input string being scanned. */
  input: string;
  /** The current position (index) in the input string. */
  pos: number;

  /**
   * Creates a new StringScanner instance.
   * @param input - The input string to scan.
   */
  constructor(input: string);

  /**
   * Checks whether the pattern matches at the current position. The match is
   * anchored, so it never looks further ahead in the input, and the position
   * is left untouched.
   * @param pattern - The string or regular expression to match.
   * @returns True if the input matches at the current position, false otherwise.
   */
  matches(pattern: string | RegExp): boolean;

  /**
   * Returns the portion of the input string from the current position to the end.
   * @returns The remaining part of the input string.
   */
  rest(): string;

  /**
   * Moves the current position forward by a specified number of characters.
   * Does nothing once the end of the input is reached.
   * @param step - The number of characters to move forward (default is 1).
   */
  step(step?: number): void;

  /**
   * Moves the current position backward by a specified number of characters.
   * Does nothing at the start of the input.
   * @param step - The number of characters to move backward (default is 1).
   */
  rewind(step?: number): void;

  /**
   * Checks if the current position is at or beyond the end of the input string.
   * @returns True if at or beyond the end, false otherwise.
   */
  isEOF(): boolean;

  /**
   * Returns the character at the current position without advancing the position.
   * @returns The character at the current position, or an empty string past the end.
   */
  peek(): string;

  /**
   * Consumes the input string if it matches the given pattern (string or regular expression)
   * at the current position.  Advances the current position if a match is found.
   *
   * @param pattern - The string or regular expression to match.
   * @returns The matched string if a match is found, null otherwise.
   */
  consume(pattern: string | RegExp): string | null;

  /**
   * Consumes the input string until the given pattern (string or regular expression) is encountered.
   * Advances the current position to the beginning of the matched pattern, or to the end of the
   * string if the pattern is not found.
   * @param pattern - The string or regular expression to consume until.
   * @returns The consumed portion of the string.
   */
  consumeUntil(pattern: string | RegExp): string;

  /**
   * Rewinds the current position to the last occurrence of the given pattern.
   * @param pattern The string or regular expression to search for.
   * @returns The consumed text, up to the point where the position was rewound.
   *    Returns `undefined` if the pattern is not found or is falsy.
   */
  returnTo(pattern?: string | RegExp): string | undefined;

  /**
   *  Gets the context of the current scanner position
   *  Context includes `insideTag`, `attribute`, `booleanAttribute` to aid parsing
   *  @returns Object with context or InsideTag
   */
  getContext(): ScannerContext;

  /**
   * Reports a parsing issue at the current position. In debug mode the failing
   * lines are logged with surrounding context and an error is thrown, otherwise
   * the call is a no-op.
   * @param msg - The error message.
   * @throws An error with the provided message when `DEBUG_MODE` is true.
   */
  fatal(msg?: string): void;
}
