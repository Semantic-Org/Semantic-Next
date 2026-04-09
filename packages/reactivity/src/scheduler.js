export class Scheduler {
  static current = null;
  static pendingReactions = new Set();
  static afterFlushCallbacks = [];
  static isFlushScheduled = false;

  static scheduleReaction(reaction) {
    Scheduler.pendingReactions.add(reaction);
    Scheduler.scheduleFlush();
  }

  static scheduleFlush() {
    if (!Scheduler.isFlushScheduled) {
      Scheduler.isFlushScheduled = true;
      if (typeof queueMicrotask === 'function') {
        queueMicrotask(() => Scheduler.flush());
      }
      else {
        Promise.resolve().then(() => Scheduler.flush());
      }
    }
  }

  static maxFlushIterations = 100;

  static flush() {
    Scheduler.isFlushScheduled = false;
    let iterations = 0;
    while (Scheduler.pendingReactions.size > 0) {
      if (++iterations > Scheduler.maxFlushIterations) {
        console.error('Reactive cycle detected: flush exceeded maximum iterations');
        Scheduler.pendingReactions.clear();
        break;
      }
      const reactions = [...Scheduler.pendingReactions];
      Scheduler.pendingReactions.clear();
      for (let i = 0; i < reactions.length; i++) {
        reactions[i].run();
      }
    }

    const callbacks = Scheduler.afterFlushCallbacks;
    Scheduler.afterFlushCallbacks = [];
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i]();
    }
  }

  static afterFlush(callback) {
    Scheduler.afterFlushCallbacks.push(callback);
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
