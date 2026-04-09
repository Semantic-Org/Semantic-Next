import { isDevelopment } from '@semantic-ui/utils';
import { Scheduler } from './scheduler.js';

export class Dependency {
  constructor(...metadata) {
    this.subscribers = new Set();
    this.setContext(metadata);
  }

  depend() {
    if (Scheduler.current) {
      this.subscribers.add(Scheduler.current);
      Scheduler.current.dependencies.add(this);
    }
  }

  // allows metadata to be passed with dependency for debugging
  setContext(context = {}) {
    if (!isDevelopment) {
      return;
    }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(context, this.setContext);
    }
    else {
      context.stack = new Error().stack;
    }
    this.context = context;
  }

  changed(context) {
    if (context) {
      this.context = context;
    }
    else {
      this.setContext();
    }
    this.subscribers.forEach(subscriber => subscriber.invalidate(this.context));
  }

  // called after flush
  cleanUp(reaction) {
    this.subscribers.delete(reaction);
  }

  // identical for now but called from stop()
  unsubscribe(reaction) {
    this.subscribers.delete(reaction);
  }
}
