import { microtask } from '@semantic-ui/utils';

const flushTask = () => Scheduler.flush();

export class Scheduler {
  static current = null;
  static pendingReactions = new Set();
  static afterFlushCallbacks = [];
  static isFlushScheduled = false;
  static isFlushing = false;

  static scheduleReaction(reaction) {
    Scheduler.pendingReactions.add(reaction);
    Scheduler.scheduleFlush();
  }

  static scheduleFlush() {
    if (!Scheduler.isFlushScheduled) {
      Scheduler.isFlushScheduled = true;
      microtask(flushTask);
    }
  }

  static maxFlushIterations = 100;

  static flush() {
    Scheduler.isFlushScheduled = false;
    Scheduler.isFlushing = true;
    // capture first error but finish draining so one faulty reaction or afterFlush callback can't jam the queue
    let firstError;
    let iterations = 0;
    try {
      // alternate: drain all pending reactions, then run one snapshot of afterFlush callbacks.
      // afterFlushes registered during the batch land in the next alternation, which drains
      // any reactions they queued before the next batch runs.
      while (Scheduler.pendingReactions.size > 0 || Scheduler.afterFlushCallbacks.length > 0) {
        while (Scheduler.pendingReactions.size > 0) {
          if (++iterations > Scheduler.maxFlushIterations) {
            console.error('Reactive cycle detected: flush exceeded maximum iterations');
            Scheduler.pendingReactions.clear();
            Scheduler.afterFlushCallbacks.length = 0;
            break;
          }
          // set-swap: avoid the per-pass array spread. new invalidations land in the next pass.
          const toRun = Scheduler.pendingReactions;
          Scheduler.pendingReactions = new Set();
          for (const r of toRun) {
            if (!r.active) { continue; }
            try {
              r.run();
            }
            catch (e) {
              if (!firstError) { firstError = e; }
            }
          }
        }
        if (Scheduler.afterFlushCallbacks.length > 0) {
          if (++iterations > Scheduler.maxFlushIterations) {
            console.error('Reactive cycle detected: flush exceeded maximum iterations');
            Scheduler.afterFlushCallbacks.length = 0;
            break;
          }
          const callbacks = Scheduler.afterFlushCallbacks;
          Scheduler.afterFlushCallbacks = [];
          for (let i = 0; i < callbacks.length; i++) {
            try {
              callbacks[i]();
            }
            catch (e) {
              if (!firstError) { firstError = e; }
            }
          }
        }
      }
    }
    finally {
      Scheduler.isFlushing = false;
    }

    if (firstError) { throw firstError; }
  }

  static afterFlush(callback) {
    Scheduler.afterFlushCallbacks.push(callback);
    if (!Scheduler.isFlushing) {
      Scheduler.scheduleFlush();
    }
  }

  static getSource() {
    if (!Scheduler.current) {
      console.log('No reactive flush is currently occurring.');
      return;
    }
    const { context, dependencies } = Scheduler.current;
    let stack = context.stack || dependencies?.values().next()?.value?.context?.stack;
    let message;
    if (stack) {
      if (context.message) {
        message = context.message;
      }
      else if (context.firstRun) {
        message = `First run of new reaction created at:`;
      }
      else if (context.value) {
        message = `Reaction triggered by reactive update`;
      }
      else {
        message = `Reaction triggered at:`;
      }
      console.groupCollapsed('🔁 Reaction Triggered');
      console.log(message);
      if (context.value) {
        console.log('Reactive value change was:', context.value);
      }
      console.log('Reaction was:', Scheduler.current);
      console.error(stack);
      delete context.stack;
      console.log('Metadata:', context);
      console.groupEnd();
    }
    else {
      console.error('Nothing found');
      console.log(Scheduler.current.context);
    }
  }
}
