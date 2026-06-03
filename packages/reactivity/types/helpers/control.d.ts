import type { Reaction } from '../reaction';

/**
 * Runs a function without tracking dependencies. Signals read inside do not
 * subscribe the surrounding reaction, and the previous reactive context is
 * restored afterward, even if the function throws.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/controls#nonreactive nonreactive}
 * @param func - Function to run without tracking
 * @returns The function's return value
 */
export function nonreactive<T>(func: () => T): T;

/**
 * Gates downstream reactivity. Re-runs `compute` reactively but only propagates
 * to the surrounding reaction when its return value changes by `equalCheck`
 * (deep equality by default). Returns `compute()` directly when called outside a
 * reaction.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/controls#guard guard}
 * @param compute - Function whose return value is guarded
 * @param equalCheck - Optional equality used to decide whether the value changed
 * @returns The current guarded value
 */
export function guard<T>(compute: () => T, equalCheck?: (newValue: T, oldValue: T) => boolean): T;

/**
 * Returns the reaction currently executing, or `null` if no reaction is running.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/controls#currentreaction currentReaction}
 */
export function currentReaction(): Reaction | null;
