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

  remove(reaction) {
    this.subscribers.delete(reaction);
  }
}

// Dependency variant for computed signals. Fires transition hooks on the
// 0→1 and 1→0 subscriber edges so the computed primitive can start its
// internal reaction lazily and stop it when no observer remains.
//
// onBecameObserved fires BEFORE adding the new subscriber so the initial
// set() from the just-started internal reaction doesn't notify the reader
// that's mid-attachment.
export class ComputedDependency extends Dependency {
  constructor(metadata, { onObserved, onUnobserved } = {}) {
    super(metadata);
    this.onBecameObserved = onObserved;
    this.onBecameUnobserved = onUnobserved;
  }

  depend() {
    if (!Scheduler.current) { return; }
    if (this.subscribers.size === 0 && this.onBecameObserved) {
      this.onBecameObserved();
    }
    this.subscribers.add(Scheduler.current);
    Scheduler.current.dependencies.add(this);
  }

  remove(reaction) {
    this.subscribers.delete(reaction);
    if (this.subscribers.size === 0 && this.onBecameUnobserved) {
      this.onBecameUnobserved();
    }
  }
}
