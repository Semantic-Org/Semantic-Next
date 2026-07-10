import type { Reaction } from './reaction.js';

/**
 * Manages scheduling and execution of reactive updates, batching reactions and
 * draining them on a microtask. Application code uses the free functions
 * `flush()`, `scheduleFlush()`, `afterFlush()`, and `settled()` rather than the
 * class directly.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/scheduler Scheduler Documentation}
 *
 * @internal Primarily used internally by the reactivity system.
 */
export class Scheduler {
  /** The reaction currently executing, if any. */
  static current: Reaction | null;

  /** Reactions queued to run on the next flush. */
  static pendingReactions: Set<Reaction>;

  /** Known-async reactions whose deferred re-runs start at the flush drain point. */
  static pendingAsyncReactions: Set<Reaction>;

  /** Async reactions with a run currently in flight. */
  static settlingReactions: Set<Reaction>;

  /** Callbacks queued to run after the next flush drains. */
  static afterFlushCallbacks: Array<() => void>;

  /** Deferred backing the pending `settled()` promise, or null when nobody waits. */
  static settledDeferred: { promise: Promise<void>; resolve: () => void; } | null;

  /** Whether a flush is scheduled on the microtask queue. */
  static isFlushScheduled: boolean;

  /** Whether a flush is currently draining. */
  static isFlushing: boolean;

  /** Iteration cap before `flush` declares a reactive cycle and bails. */
  static maxFlushIterations: number;

  /**
   * Queues a reaction to run on the next flush.
   * @internal
   * @param reaction - The reaction to schedule
   */
  static scheduleReaction(reaction: Reaction): void;

  /**
   * Schedules a flush on the next microtask. Idempotent.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/flushing#scheduleflush scheduleFlush}
   */
  static scheduleFlush(): void;

  /**
   * Synchronously drains all pending reactions, async run starts, and after-flush
   * callbacks. Does not wait for in-flight async runs. Use `settled()` for full
   * quiescence. Caps at `maxFlushIterations` to break reactive cycles, logging an
   * error and clearing the queues if the cap is exceeded.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/flushing#flush flush}
   */
  static flush(): void;

  /**
   * Clears every queue and logs an error when a flush exceeds
   * `maxFlushIterations`, breaking a runaway reactive cycle.
   * @internal
   */
  static reportCycle(): void;

  /**
   * Registers a callback to run after the next flush drains.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/flushing#afterflush afterFlush}
   * @param callback - Function to run after updates are processed
   */
  static afterFlush(callback: () => void): void;

  /**
   * Whether no reactions are pending, in flight, or settling and no flush is
   * scheduled or running.
   * @internal
   */
  static isSettled(): boolean;

  /**
   * Returns a promise that resolves once every pending reaction, in-flight async
   * run, and `afterFlush` callback has completed, including the cascades they
   * schedule. Resolves immediately when already idle.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/flushing#settled settled}
   */
  static settled(): Promise<void>;

  /**
   * Resolves the pending `settled()` promise once the system goes idle.
   * @internal
   */
  static checkSettled(): void;

  /**
   * Logs the source of the currently running reaction for debugging.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/debugging#getsource getSource}
   */
  static getSource(): void;
}
