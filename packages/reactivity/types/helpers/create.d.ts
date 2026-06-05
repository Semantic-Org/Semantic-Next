import type { Reaction } from '../reaction';
import type { Signal, SignalOptions } from '../signal';

/**
 * Creates a reactive value. The factory form of `new Signal()`.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal signal}
 * @param initialValue - The initial value to store
 * @param options - Configuration for the signal's behavior
 * @returns A new Signal
 */
export function signal<T>(initialValue?: T, options?: SignalOptions<T>): Signal<T>;

/**
 * Creates and immediately runs a reactive computation. The factory form of
 * `new Reaction()`. The callback re-runs whenever the signals it read change.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reaction reaction}
 * @param callback - Function to run reactively, receiving the Reaction instance
 * @param options - Optional configuration (context, firstRun)
 * @returns The created Reaction
 */
export function reaction(
  callback: (computation: Reaction) => void,
  options?: { context?: Record<string, any>; firstRun?: boolean; },
): Reaction;
