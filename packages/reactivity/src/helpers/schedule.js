import { Scheduler } from '../scheduler.js';

// safe to unbind: Scheduler statics qualify `Scheduler.X` internally, never `this`
export const flush = Scheduler.flush;
export const scheduleFlush = Scheduler.scheduleFlush;
export const afterFlush = Scheduler.afterFlush;
export const settled = Scheduler.settled;
export const getSource = Scheduler.getSource;
