/**
 * Tracks the reactions subscribed to a reactive value and notifies them when it
 * changes. Signals own a Dependency internally, you rarely construct one directly.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/dependency Dependency Documentation}
 *
 * @internal Primarily used internally by the reactivity system.
 */
export class Dependency {
  /** The reactions currently subscribed to this dependency. */
  readonly subscribers: Set<any>;

  /**
   * Creates a new dependency tracker.
   * @param metadata - Optional debugging context, attached only when tracing is on
   */
  constructor(...metadata: any[]);

  /**
   * Records the currently running reaction as a subscriber. A no-op outside a reaction.
   * @internal
   */
  depend(): void;

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
   * Removes a reaction from this dependency's subscribers.
   * @internal
   * @param reaction - The reaction to remove
   */
  remove(reaction: any): void;
}
