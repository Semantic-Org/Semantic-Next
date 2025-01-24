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
      } else {
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
    if (!Scheduler.current || !Scheduler.current.context || !Scheduler.current.context.trace) {
      console.log('No source available or no current reaction.');
      return;
    }
    let trace = Scheduler.current.context.trace;
    trace = trace.split('\n').slice(2).join('\n');
    trace = `Reaction triggered by:\n${trace}`;
    console.info(trace);
    return trace;
  }
}
