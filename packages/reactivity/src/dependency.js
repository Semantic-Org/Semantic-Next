import { captureStack, isTracing } from './helpers.js';
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

  // Cheap context naming on tracing; stack capture only on stack mode.
  setContext(context) {
    if (!isTracing()) {
      return;
    }
    this.context = context || {};
    captureStack(this, this.setContext);
  }

  changed(context) {
    // Skip tracing-context bookkeeping when no subscribers are listening.
    if (this.subscribers.size === 0) { return; }
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
