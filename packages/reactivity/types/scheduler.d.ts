import type { Reaction } from './reaction.js';

/**
 * Manages scheduling and execution of reactive updates, batching reactions and
 * draining them on a microtask. Application code uses the free functions
 * `flush()`, `scheduleFlush()`, and `afterFlush()` rather than the class directly.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/scheduler Scheduler Documentation}
 *
 * @internal Primarily used internally by the reactivity system.
 */
export class Scheduler {
  /** The reaction currently executing, if any. */
  static current: Reaction | null;

  /** Reactions queued to run on the next flush. */
  static pendingReactions: Set<Reaction>;

  /** Callbacks queued to run after the next flush drains. */
  static afterFlushCallbacks: Array<() => void>;

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
   * Synchronously drains all pending reactions and after-flush callbacks. Caps
   * at `maxFlushIterations` to break reactive cycles, logging an error and
   * clearing both queues if the cap is exceeded.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/flushing#flush flush}
   */
  static flush(): void;

  /**
   * Registers a callback to run after the next flush drains.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/flushing#afterflush afterFlush}
   * @param callback - Function to run after updates are processed
   */
  static afterFlush(callback: () => void): void;

  /**
   * Logs the source of the currently running reaction for debugging.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/debugging#getsource getSource}
   */
  static getSource(): void;
}
