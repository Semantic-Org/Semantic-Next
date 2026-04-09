import { isDevelopment } from '@semantic-ui/utils';
import { Scheduler } from './scheduler.js';

export class Dependency {
  constructor(...metadata) {
    this.subscribers = new Set();
    if (isDevelopment) {
      this.setContext(metadata);
    }
  }

  depend() {
    if (Scheduler.current) {
      this.subscribers.add(Scheduler.current);
      Scheduler.current.dependencies.add(this);
    }
  }

  // allows metadata to be passed with dependency for debugging
  setContext(context) {
    if (!isDevelopment) {
      return;
    }
    if (!context) {
      context = {};
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
    if (isDevelopment) {
      if (context) {
        this.context = context;
      }
      else {
        this.setContext();
      }
    }
    const ctx = this.context;
    for (const subscriber of this.subscribers) {
      subscriber.invalidate(ctx);
    }
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
