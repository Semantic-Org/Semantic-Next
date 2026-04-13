import { isStackCapture, isTracing } from './helpers.js';
import { Scheduler } from './scheduler.js';

export class Dependency {
  constructor(...metadata) {
    this.subscribers = new Set();
    if (isTracing()) {
      this.setContext(metadata);
    }
  }

  depend() {
    if (Scheduler.current) {
      this.subscribers.add(Scheduler.current);
      Scheduler.current.dependencies.add(this);
    }
  }

  // Cheap context naming on isTracing; stack capture only on isStackCapture.
  setContext(context) {
    if (!isTracing()) {
      return;
    }
    if (!context) {
      context = {};
    }
    if (isStackCapture()) {
      if (Error.captureStackTrace) {
        Error.captureStackTrace(context, this.setContext);
      }
      else {
        context.stack = new Error().stack;
      }
    }
    this.context = context;
  }

  changed(context) {
    if (isTracing()) {
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
