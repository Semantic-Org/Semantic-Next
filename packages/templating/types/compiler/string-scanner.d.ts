// string-scanner.d.ts

/**
 * A string scanner class that provides methods for scanning and manipulating strings.
 * Adapted from BlazeJS Scanner.
 */
export class StringScanner {
  /**
   * Debug mode flag.  When true, `fatal` errors will include detailed error
   * messages with context in the console and in the DOM (for easier debugging).
   * When false, errors are simpler and less informative, but provide better
   * performance.
   */
  static DEBUG_MODE: boolean;
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
   * Checks if the rest of the input string matches the given regular expression.
   * @param regex - The regular expression to match.
   * @returns True if the rest of the input matches, false otherwise.
   */
  matches(regex: RegExp): boolean;

  /**
   * Returns the portion of the input string from the current position to the end.
   * @returns The remaining part of the input string.
   */
  rest(): string;

  /**
   * Moves the current position forward by a specified number of characters.
   * @param step - The number of characters to move forward (default is 1).
   */
  step(step?: number): void;

  /**
   * Moves the current position backward by a specified number of characters.
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
   * @returns The character at the current position.
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
  returnTo(pattern: string | RegExp): string | undefined;

  /**
   *  Gets the context of the current scanner position
   *  Context includes `insideTag`, `attribute`, `booleanAttribute` to aid parsing
   *  @returns Object with context or InsideTag
   */
  getContext(): { insideTag: boolean; attribute?: string; booleanAttribute?: boolean };

  /**
   * Throws an error indicating a parsing issue at the current position.
   * Includes contextual information in debug mode.
   * @param msg - The error message.
   * @throws An error with the provided message and context.
   */
  fatal(msg?: string): never;
}
