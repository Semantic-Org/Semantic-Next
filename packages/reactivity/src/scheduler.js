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

  static flush() {
    Scheduler.isFlushScheduled = false;
    Scheduler.pendingReactions.forEach(reaction => reaction.run());
    Scheduler.pendingReactions.clear();

    Scheduler.afterFlushCallbacks.forEach(callback => callback());
    Scheduler.afterFlushCallbacks = [];
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
