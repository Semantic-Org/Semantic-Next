/**
 * Reactivity system for creating and managing reactive state. Provides signals,
 * reactions, derivation helpers, and scheduling for building reactive interfaces.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity Reactivity Documentation}
 */

export { Dependency } from './dependency';
export { Reaction } from './reaction';
export { Scheduler } from './scheduler';
export { Signal, SignalOptions } from './signal';

export { currentReaction, guard, nonreactive } from './helpers/control';
export { reaction, signal } from './helpers/create';
export { computed, derive, match } from './helpers/derived';
export type { Matcher } from './helpers/derived';
export { afterFlush, flush, getSource, scheduleFlush } from './helpers/schedule';
export { isStackCapture, isTracing, setStackCapture, setTracing } from './helpers/tracing';
