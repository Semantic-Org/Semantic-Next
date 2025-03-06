import type { Dependency } from './dependency';

/**
 * Represents a reactive computation that automatically re-runs when its dependencies change.
 * Used to create side effects and computations that respond to reactive state changes.
 * @see {@link https://next.semantic-ui.com/api/reactivity/reaction Reaction Documentation}
 */
export class Reaction {
  /**
   * Creates a new Reaction that runs the provided callback when dependencies change.
   * The callback receives the Reaction instance as its parameter.
   * @see {@link https://next.semantic-ui.com/api/reactivity/reaction#constructor constructor}
   *
   * @param callback - Function to run when dependencies change
   */
  constructor(callback: (computation: Reaction) => void);

  /**
   * Indicates if this is the first execution of the reaction.
   * Useful for initialization logic that should only run once.
   */
  readonly firstRun: boolean;

  /**
   * Whether the reaction is currently active and responding to changes.
   * False if the reaction has been stopped.
   */
  readonly active: boolean;

  /**
   * The current dependency context that triggered this reaction.
   * Contains information about the value change that caused the reaction to run.
   */
  readonly context: {
    /** The value that triggered the reaction */
    value: unknown;
    /** Stack trace showing where the change originated */
    trace?: string;
  } | null;

  /**
   * Set of current dependencies being tracked by this reaction.
   * Updated automatically when reactive values are accessed during execution.
   */
  readonly dependencies: Set<Dependency>;

  /**
   * Executes the reaction's callback, tracking accessed reactive values as dependencies.
   * Called automatically when dependencies change.
   * @see {@link https://next.semantic-ui.com/api/reactivity/reaction#run run}
   */
  run(): void;

  /**
   * Marks the reaction as invalid and schedules it to run again.
   * Called automatically when dependencies change.
   * @see {@link https://next.semantic-ui.com/api/reactivity/reaction#invalidate invalidate}
   *
   * @param context - Optional metadata about what triggered the invalidation
   */
  invalidate(context?: { value: unknown; trace?: string }): void;

  /**
   * Permanently stops the reaction from running.
   * The reaction will no longer respond to dependency changes.
   * @see {@link https://next.semantic-ui.com/api/reactivity/reaction#stop stop}
   */
  stop(): void;

  /**
   * Creates and immediately runs a new reactive computation.
   * Provides a more convenient way to create reactions than using the constructor.
   * @see {@link https://next.semantic-ui.com/api/reactivity/reaction#create create}
   *
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
   * Gets the currently running reaction, if any.
   * Used internally to track dependencies during reaction execution.
   */
  static get current(): Reaction | null;

  /**
   * Immediately processes all pending reactive updates.
   * Forces reactions to run synchronously instead of waiting for the microtask queue.
   * @see {@link https://next.semantic-ui.com/api/reactivity/reaction#flush flush}
   */
  static flush(): void;

  /**
   * Schedules reactive updates to be processed in the next microtask.
   * This is the default behavior when dependencies change.
   * @see {@link https://next.semantic-ui.com/api/reactivity/reaction#scheduleflush scheduleFlush}
   */
  static scheduleFlush(): void;

  /**
   * Registers a callback to run after the next flush of reactive updates.
   * Useful for running side effects after all reactions have processed.
   * @see {@link https://next.semantic-ui.com/api/reactivity/reaction#afterflush afterFlush}
   *
   * @param callback - Function to run after updates are processed
   */
  static afterFlush(callback: () => void): void;

  /**
   * Gets the source location that triggered the current reaction.
   * Useful for debugging reactive updates and understanding update chains.
   * @see {@link https://next.semantic-ui.com/api/reactivity/reaction#getsource getSource}
   *
   * @returns A formatted stack trace string, or undefined if no source is available
   */
  static getSource(): string | undefined;

  /**
   * Runs a function without establishing any reactive dependencies.
   * Useful for reading reactive values without creating permanent dependencies.
   * @see {@link https://next.semantic-ui.com/api/reactivity/reaction#nonreactive nonreactive}
   *
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
   * when its return value changes according to the equality check.
   * @see {@link https://next.semantic-ui.com/api/reactivity/reaction#guard guard}
   *
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
