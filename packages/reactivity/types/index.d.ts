/**
 * Reactivity system for creating and managing reactive state. Provides signals,
 * reactions, derivation helpers, and scheduling for building reactive interfaces.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity Reactivity Documentation}
 */

export { Dependency } from './dependency.js';
export { Reaction } from './reaction.js';
export { ReactiveObject, ReactiveObjectOptions } from './reactive-object.js';
export { Scheduler } from './scheduler.js';
export { Signal, SignalOptions } from './signal.js';

export { currentReaction, guard, nonreactive } from './helpers/control.js';
export { reaction, reactiveObject, signal } from './helpers/create.js';
export { computed, derive, match } from './helpers/derived.js';
export type { Matcher } from './helpers/derived.js';
export { afterFlush, flush, getSource, scheduleFlush } from './helpers/schedule.js';
export { isStackCapture, isTracing, setStackCapture, setTracing } from './helpers/tracing.js';
