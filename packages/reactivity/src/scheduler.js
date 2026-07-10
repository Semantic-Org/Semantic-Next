import { microtask } from '@semantic-ui/utils';

const flushTask = () => Scheduler.flush();

export class Scheduler {
  static current = null;
  static pendingReactions = new Set();
  static pendingAsyncReactions = new Set();
  static settlingReactions = new Set();
  static afterFlushCallbacks = [];
  static settledDeferred = null;
  static isFlushScheduled = false;
  static isFlushing = false;

  static scheduleReaction(reaction) {
    // known-async reactions start at the drain point, so intra-flush glitches never
    // launch a run and same-flush invalidations coalesce to one start
    const pending = (reaction.async !== null && reaction.async.deferred)
      ? Scheduler.pendingAsyncReactions
      : Scheduler.pendingReactions;
    pending.add(reaction);
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
      // alternate: drain all pending reactions, start async re-runs, then run one snapshot
      // of afterFlush callbacks. work queued during a phase lands in the next alternation,
      // so afterFlush always observes a stable sync world.
      while (
        Scheduler.pendingReactions.size > 0
        || Scheduler.pendingAsyncReactions.size > 0
        || Scheduler.afterFlushCallbacks.length > 0
      ) {
        while (Scheduler.pendingReactions.size > 0) {
          if (++iterations > Scheduler.maxFlushIterations) {
            Scheduler.reportCycle();
            break;
          }
          // set-swap: avoid the per-pass array spread. new invalidations land in the next pass.
          const toRun = Scheduler.pendingReactions;
          Scheduler.pendingReactions = new Set();
          for (const reaction of toRun) {
            if (!reaction.active) { continue; }
            try {
              reaction.run();
            }
            catch (e) {
              if (!firstError) { firstError = e; }
            }
          }
        }
        if (Scheduler.pendingAsyncReactions.size > 0) {
          if (++iterations > Scheduler.maxFlushIterations) {
            Scheduler.reportCycle();
            break;
          }
          // async heads run synchronously here, their tails stay in flight
          const toStart = Scheduler.pendingAsyncReactions;
          Scheduler.pendingAsyncReactions = new Set();
          for (const reaction of toStart) {
            if (!reaction.active) { continue; }
            try {
              reaction.run();
            }
            catch (e) {
              if (!firstError) { firstError = e; }
            }
          }
          // heads may have queued sync work, drain it before the afterFlush snapshot
          continue;
        }
        if (Scheduler.afterFlushCallbacks.length > 0) {
          if (++iterations > Scheduler.maxFlushIterations) {
            Scheduler.reportCycle();
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
      Scheduler.checkSettled();
    }

    if (firstError) { throw firstError; }
  }

  // a cycle keeps scheduling work faster than the flush drains it. clear everything and bail
  static reportCycle() {
    console.error('Reactive cycle detected: flush exceeded maximum iterations');
    Scheduler.pendingReactions.clear();
    Scheduler.pendingAsyncReactions.clear();
    Scheduler.afterFlushCallbacks.length = 0;
  }

  static afterFlush(callback) {
    Scheduler.afterFlushCallbacks.push(callback);
    if (!Scheduler.isFlushing) {
      Scheduler.scheduleFlush();
    }
  }

  /*******************************
           Quiescence
  *******************************/

  static isSettled() {
    return Scheduler.pendingReactions.size === 0
      && Scheduler.pendingAsyncReactions.size === 0
      && Scheduler.settlingReactions.size === 0
      && Scheduler.afterFlushCallbacks.length === 0
      && !Scheduler.isFlushScheduled
      && !Scheduler.isFlushing;
  }

  // resolves once every pending reaction, in-flight async run, and afterFlush
  // callback has completed, including the cascades they schedule
  static settled() {
    if (Scheduler.isSettled()) {
      return Promise.resolve();
    }
    Scheduler.settledDeferred ??= Promise.withResolvers();
    return Scheduler.settledDeferred.promise;
  }

  static checkSettled() {
    if (Scheduler.settledDeferred !== null && Scheduler.isSettled()) {
      const deferred = Scheduler.settledDeferred;
      Scheduler.settledDeferred = null;
      deferred.resolve();
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
