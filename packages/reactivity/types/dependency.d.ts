import type { Reaction } from './reaction.js';

/**
 * Tracks the reactions subscribed to a reactive value and notifies them when it
 * changes. Signals own a Dependency internally, you rarely construct one directly.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/dependency Dependency Documentation}
 *
 * @internal Primarily used internally by the reactivity system.
 */
export class Dependency {
  /**
   * Grows an edge array by one entry: an exact copy below four entries, a push
   * after. Shared by both sides of an edge.
   * @internal
   */
  static grow<T>(array: T[], value: T): T[];

  /**
   * The reactions currently subscribed to this dependency, or `null` when there
   * are none. Allocated on the first subscription.
   */
  readonly subscribers: Reaction[] | null;

  /**
   * Parallel to `subscribers`: the slot each subscriber holds this dependency at in
   * its own `dependencies`, so an edge can be dropped from either side in O(1).
   */
  readonly subscriberSlots: number[] | null;

  /**
   * Debugging metadata, populated only when tracing is on. The constructor form
   * stores the rest arguments as-is, so it is not always a plain object.
   */
  readonly context: any;

  /**
   * Creates a new dependency tracker.
   * @param metadata - Optional debugging context, attached only when tracing is on
   */
  constructor(...metadata: any[]);

  /**
   * Records the currently running reaction as a subscriber. A no-op outside a
   * reaction, and a no-op for a second read by the same reaction in the same run.
   * @internal
   */
  depend(): void;

  /**
   * Appends `reaction` to the subscribers and returns the slot it took. Called by
   * the reaction for a dependency it did not hold last run.
   * @internal
   * @param reaction - The new subscriber
   * @param position - Where the reaction holds this dependency, `-1` for its inline edge
   */
  addSubscriber(reaction: Reaction, position: number): number;

  /**
   * Whether any reaction currently subscribes to this dependency.
   */
  hasSubscribers(): boolean;

  /**
   * Sets debugging context on the dependency. A no-op when tracing is off.
   * @internal
   * @param context - Context to attach
   */
  setContext(context?: any): void;

  /**
   * Notifies all subscribed reactions that this dependency changed.
   * @internal
   * @param context - Optional metadata about the change
   */
  changed(context?: Record<string, any>): void;

  /**
   * Drops `reaction` from the subscribers, so it no longer re-runs on `changed()`.
   * A no-op when it is not subscribed. Reactions remove themselves when they stop,
   * this is for manual lifecycle control.
   * @param reaction - The reaction to drop
   */
  remove(reaction: Reaction): void;

  /**
   * Removes the subscriber at `slot` by swap-pop. Called by a reaction with the
   * slot it recorded when it subscribed.
   * @internal
   * @param slot - The subscriber's index in `subscribers`
   */
  removeAt(slot: number): void;
}
