import { captureStack, isTracing } from './helpers.js';
import { Scheduler } from './scheduler.js';

const NOOP = () => {};

export class Dependency {
  constructor(...metadata) {
    this.subscribers = new Set();
    this.context = undefined;
    // Refcount transition hooks. NOOP by default so every Dependency has the
    // same hidden class — IC sites that touch dep.depend / dep.changed /
    // dep.remove stay monomorphic regardless of which Signals are computed.
    // Signal.computed reassigns these on its own dep; reassignment doesn't
    // transition the shape since the slot is already initialized.
    this.onObserved = NOOP;
    this.onUnobserved = NOOP;
    if (isTracing()) {
      this.setContext(metadata);
    }
  }

  depend() {
    if (!Scheduler.current) { return; }
    // fire BEFORE adding the new subscriber so a refcount-driven initial set()
    // doesn't notify the just-attaching reader. NOOP-skip avoids an indirect
    // call on the 99% case where the dep is a regular signal — the call site
    // stays monomorphic on closures only when a computed is actually attached.
    if (this.subscribers.size === 0 && this.onObserved !== NOOP) {
      this.onObserved();
    }
    this.subscribers.add(Scheduler.current);
    Scheduler.current.dependencies.add(this);
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
    if (this.subscribers.size === 0 && this.onUnobserved !== NOOP) {
      this.onUnobserved();
    }
  }
}
