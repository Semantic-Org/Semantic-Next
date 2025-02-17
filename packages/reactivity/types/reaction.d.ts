/**
 * Represents a reactive computation that automatically re-runs when its dependencies change.
 * Reactions are used to create reactive side effects and computations that respond to changes
 * in Signal values.
 */
export class Reaction {
  /**
   * Creates a new Reaction instance that will run the provided callback
   * when its dependencies change
   * @param callback - Function to run when dependencies change
   */
  constructor(callback: (computation: Reaction) => void);

  /**
   * Whether this is the first execution of the reaction
   */
  readonly firstRun: boolean;

  /**
   * Whether the reaction is currently active and responding to changes
   */
  readonly active: boolean;

  /**
   * The current dependency context
   */
  readonly context: {
    /**
     * The value that triggered the reaction
     */
    value: any;
    /**
     * Stack trace of where the change originated
     */
    trace?: string;
  } | null;

  /**
   * Set of current dependencies for this reaction
   */
  readonly dependencies: Set<unknown>;

  /**
   * Executes the reaction's callback, tracking any accessed reactive values
   * as dependencies
   */
  run(): void;

  /**
   * Marks the reaction as invalid and schedules it to run again
   * @param context - Optional context about what triggered the invalidation
   */
  invalidate(context?: { value: any; trace?: string }): void;

  /**
   * Permanently stops the reaction from running
   */
  stop(): void;

  /**
   * Creates and immediately runs a new reactive computation
   * @param callback - Function to run reactively
   * @returns The created Reaction instance
   * @example
   * ```typescript
   * const reaction = Reaction.create(comp => {
   *   console.log(mySignal.get());
   *   if (comp.firstRun) {
   *     console.log('First run!');
   *   }
   * });
   * ```
   */
  static create(callback: (computation: Reaction) => void): Reaction;

  /**
   * Gets the currently running reaction, if any
   */
  static get current(): Reaction | null;

  /**
   * Immediately processes all pending reactive updates
   */
  static flush(): void;

  /**
   * Schedules reactive updates to be processed in the next microtask
   */
  static scheduleFlush(): void;

  /**
   * Registers a callback to run after the next flush of reactive updates
   * @param callback - Function to run after updates are processed
   */
  static afterFlush(callback: () => void): void;

  /**
   * Gets the source location that triggered the current reaction
   * @returns Stack trace string or undefined if no source is available
   */
  static getSource(): string | undefined;

  /**
   * Runs a function without establishing any reactive dependencies
   * @param callback - Function to run non-reactively
   * @returns The result of the callback
   * @example
   * ```typescript
   * Reaction.nonreactive(() => {
   *   // This read won't create a dependency
   *   const value = mySignal.get();
   * });
   * ```
   */
  static nonreactive<T>(callback: () => T): T;

  /**
   * Creates a guarded reactive computation that only triggers updates
   * when its return value changes
   * @param callback - Function that returns a value to guard
   * @param equalityCheck - Optional function to determine if the value has changed
   * @returns The current value of the guarded computation
   * @example
   * ```typescript
   * const isEven = Reaction.guard(() => {
   *   return counter.get() % 2 === 0;
   * });
   * ```
   */
  static guard<T>(
    callback: () => T,
    equalityCheck?: (oldValue: T, newValue: T) => boolean
  ): T;
}
