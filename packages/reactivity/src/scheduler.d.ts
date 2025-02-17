import type { Reaction } from './reaction';

/**
 * Manages the scheduling and execution of reactive updates.
 * Batches and processes reactions efficiently using microtasks.
 *
 * @internal This class is primarily used internally by the reactivity system.
 */
export class Scheduler {
  /**
   * The reaction currently being executed, if any.
   * Used to track dependencies during reaction execution.
   */
  static current: Reaction | null;

  /**
   * Set of reactions waiting to be processed in the next flush.
   * Reactions are automatically added when their dependencies change.
   */
  static readonly pendingReactions: Set<Reaction>;

  /**
   * Array of callbacks to execute after the next flush completes.
   * Used to run side effects after all reactive updates are processed.
   */
  static afterFlushCallbacks: Array<() => void>;

  /**
   * Whether a flush operation is currently scheduled in the microtask queue.
   * Prevents multiple flush operations from being scheduled unnecessarily.
   */
  static isFlushScheduled: boolean;

  /**
   * Schedules a reaction to be processed in the next flush.
   * The reaction will be executed when the microtask queue is processed.
   *
   * @param reaction - The reaction to schedule
   * @internal This method is called internally by the reactivity system.
   */
  static scheduleReaction(reaction: Reaction): void;

  /**
   * Schedules a flush of pending reactions to occur in the next microtask.
   * Uses queueMicrotask or Promise.resolve() for scheduling.
   *
   * @internal This method is called internally by the reactivity system.
   */
  static scheduleFlush(): void;

  /**
   * Immediately processes all pending reactions and after-flush callbacks.
   * Can be called manually to force immediate processing of pending updates.
   */
  static flush(): void;

  /**
   * Registers a callback to execute after the next flush completes.
   * Useful for running side effects after all reactive updates are processed.
   *
   * @param callback - Function to execute after the next flush
   */
  static afterFlush(callback: () => void): void;

  /**
   * Gets the source location that triggered the current reaction.
   * Useful for debugging reactive updates and understanding update chains.
   *
   * @returns A formatted stack trace string, or undefined if no source is available
   */
  static getSource(): string | undefined;
}
