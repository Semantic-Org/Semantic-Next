import type { Dependency } from './dependency';

/**
 * A Reaction is a computation that automatically re-runs when the signals it
 * read change. Used for side effects and computations that respond to reactive
 * state.
 *
 * Create one with the `reaction()` factory or `new Reaction()` — both are
 * supported. The static helpers that once lived here (`create`, `flush`,
 * `nonreactive`, `guard`, `getSource`, tracing toggles) are now module-level
 * functions exported from `@semantic-ui/reactivity`.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reaction Reaction Documentation}
 */
export class Reaction {
  /**
   * The reaction currently executing, or `null` outside a reactive run. A static
   * mirror of `Scheduler.current`, kept on the class so a `debugger` breakpoint can
   * read the running reaction without an import (devtools consoles can't import
   * `currentReaction()`).
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reaction#current current}
   */
  static readonly current: Reaction | null;

  /**
   * Creates a new Reaction. The callback runs immediately (tracking the signals
   * it reads) and re-runs whenever any of them change. The callback receives the
   * Reaction instance.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reaction#constructor constructor}
   * @param callback - Function to run reactively
   * @param options - Optional configuration
   * @param options.context - Debugging context surfaced in tracing output
   * @param options.firstRun - Whether to run the callback immediately on creation. Defaults to `true`. Set `false` to create the reaction without an initial run.
   */
  constructor(
    callback: (computation: Reaction) => void,
    options?: { context?: Record<string, any>; firstRun?: boolean; },
  );

  /**
   * Whether the current execution is the reaction's first run. Useful for
   * initialization that should happen only once. Read the signals you depend on
   * before any early `if (firstRun) return`, otherwise the reaction registers no
   * dependencies and never re-runs.
   */
  readonly firstRun: boolean;

  /**
   * Whether the reaction is active and responding to changes. `false` once stopped.
   */
  readonly active: boolean;

  /**
   * Debugging context for the reaction, populated only when tracing is enabled.
   * Carries fields like `firstRun` and the triggering `value`.
   */
  readonly context: Record<string, any> | undefined;

  /**
   * The set of dependencies tracked by this reaction, rebuilt on every run.
   */
  readonly dependencies: Set<Dependency>;

  /**
   * Registers a cleanup callback that fires just before the reaction's next run
   * and once when it stops. Callbacks fire in registration order and the queue
   * is cleared after firing, so a callback registered on `firstRun` fires once.
   * Use it to tear down resources or scope inner reactions to this one.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reaction#oncleanup onCleanup}
   * @param callback - Function to run on the next re-run or on stop
   */
  onCleanup(callback: () => void): void;

  /**
   * Sets debugging context on the reaction, replacing any existing context.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/debugging Debugging Reactivity}
   * @param additionalContext - Key-value pairs to store as debugging context
   */
  setContext(additionalContext?: Record<string, any>): void;

  /**
   * Adds debugging context without replacing existing context.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/debugging Debugging Reactivity}
   * @param additionalContext - Key-value pairs to merge into existing context
   */
  addContext(additionalContext?: Record<string, any>): void;

  /**
   * Captures a stack trace into the reaction's context. Only does work when
   * stack capture is enabled via `setStackCapture(true)`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/debugging Debugging Reactivity}
   */
  setTrace(): void;

  /**
   * Executes the callback, rebuilding the tracked dependency set. Called
   * automatically on creation and when dependencies change.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reaction#run run}
   */
  run(): void;

  /**
   * Marks the reaction invalid and schedules it to run again on the next flush.
   * Called automatically when a dependency changes. Calling it with no arguments
   * re-runs the reaction without any signal having changed.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reaction#invalidate invalidate}
   * @param context - Optional metadata about what triggered the invalidation
   */
  invalidate(context?: Record<string, any>): void;

  /**
   * Permanently stops the reaction. It unsubscribes from all dependencies, fires
   * its cleanups, and will no longer respond to changes. Idempotent.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reaction#stop stop}
   */
  stop(): void;
}
