import type { Reaction } from './reaction';

/**
 * Manages the scheduling and execution of reactive updates.
 * Used internally to batch and process reactions efficiently using microtasks.
 */
export class Scheduler {
  /**
   * The currently executing reaction, if any
   */
  static current: Reaction | null;

  /**
   * Set of reactions waiting to be processed
   */
  static readonly pendingReactions: Set<Reaction>;

  /**
   * Array of callbacks to execute after the next flush
   */
  static afterFlushCallbacks: Array<() => void>;

  /**
   * Whether a flush operation is currently scheduled
   */
  static isFlushScheduled: boolean;

  /**
   * Schedules a reaction to be processed in the next flush
   * @param reaction - The reaction to schedule
   */
  static scheduleReaction(reaction: Reaction): void;

  /**
   * Schedules a flush of pending reactions to occur in the next microtask
   */
  static scheduleFlush(): void;

  /**
   * Immediately processes all pending reactions and after-flush callbacks
   */
  static flush(): void;

  /**
   * Registers a callback to be executed after the next flush completes
   * @param callback - Function to execute after flush
   */
  static afterFlush(callback: () => void): void;

  /**
   * Gets the source location that triggered the current reaction
   * @returns Stack trace string or undefined if no source is available
   */
  static getSource(): string | undefined;
}
