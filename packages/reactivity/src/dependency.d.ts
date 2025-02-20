import type { Reaction } from './reaction';

/**
 * Tracks dependencies for reactive computations.
 * Manages the relationship between reactive values and their dependent computations.
 * Used internally by Signal and Reaction to establish reactive relationships.
 *
 * @internal This class is primarily used internally by the reactivity system.
 */
export class Dependency {
  /**
   * Set of reactions that depend on this dependency.
   * Each reaction in this set will be notified when the dependency changes.
   */
  readonly subscribers: Set<Reaction>;

  /**
   * Creates a new dependency tracker.
   * Typically created automatically by Signal instances.
   */
  constructor();

  /**
   * Records the currently running reaction as a subscriber.
   * Called automatically when a reactive value is accessed.
   *
   * @internal This method is called internally by the reactivity system.
   */
  depend(): void;

  /**
   * Notifies all dependent reactions that this dependency has changed.
   * Triggers dependent reactions to re-run.
   *
   * @param context - Optional metadata about what triggered the change
   * @internal This method is called internally by the reactivity system.
   */
  changed(context?: {
    /** The new value that caused the change */
    value?: unknown;
    /** Stack trace showing where the change originated */
    trace?: string;
  }): void;

  /**
   * Removes a reaction from this dependency's subscribers.
   * Used during reaction re-runs to clean up old dependencies.
   *
   * @param reaction - The reaction to remove
   * @internal This method is called internally by the reactivity system.
   */
  cleanUp(reaction: Reaction): void;

  /**
   * Unsubscribes a reaction from this dependency.
   * Used when stopping reactions to remove them from all dependencies.
   *
   * @param reaction - The reaction to unsubscribe
   * @internal This method is called internally by the reactivity system.
   */
  unsubscribe(reaction: Reaction): void;
}
