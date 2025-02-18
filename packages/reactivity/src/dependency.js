import type { Scheduler } from './scheduler.js';

export class Dependency {
  constructor() {
    this.subscribers = new Set();
  }

  depend() {
    if (Scheduler.current) {
      this.subscribers.add(Scheduler.current);
      Scheduler.current.dependencies.add(this);
    }
  }

  changed(context) {
    this.subscribers.forEach(subscriber => subscriber.invalidate(context));
  }

  cleanUp(reaction) {
    this.subscribers.delete(reaction);
  }

  unsubscribe(reaction) {
    this.subscribers.delete(reaction);
  }
}
