import type { Reaction } from './reaction';

/**
 * Tracks dependencies for reactive computations. Used internally by Signal and Reaction
 * to establish and maintain reactive relationships between values and computations.
 */
export class Dependency {
  /**
   * Set of reactions that depend on this dependency
   */
  readonly subscribers: Set<Reaction>;

  /**
   * Creates a new dependency tracker
   */
  constructor();

  /**
   * Records the currently running reaction as a subscriber if one exists.
   * Called when a reactive value is accessed to establish a dependency.
   */
  depend(): void;

  /**
   * Notifies all dependent reactions that this dependency has changed.
   * @param context - Optional context about what triggered the change
   */
  changed(context?: { value: any; trace?: string }): void;

  /**
   * Removes a reaction from this dependency's subscribers.
   * Used during reaction re-runs to clean up old dependencies.
   * @param reaction - The reaction to remove
   */
  cleanUp(reaction: Reaction): void;

  /**
   * Unsubscribes a reaction from this dependency.
   * Used when stopping reactions to remove them from all dependencies.
   * @param reaction - The reaction to unsubscribe
   */
  unsubscribe(reaction: Reaction): void;
}
