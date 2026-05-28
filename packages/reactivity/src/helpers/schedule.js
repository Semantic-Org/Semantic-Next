import { Scheduler } from '../scheduler.js';

// Scheduler static methods use `Scheduler.X` qualifiers internally, never
// `this`, so unbinding for module-level export is safe. These aliases are
// the canonical public surface; the static methods on the class are the
// backing impl.
export const flush = Scheduler.flush;
export const scheduleFlush = Scheduler.scheduleFlush;
export const afterFlush = Scheduler.afterFlush;
export const getSource = Scheduler.getSource;
