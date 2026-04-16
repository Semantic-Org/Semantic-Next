import { captureStack, config } from './helpers.js';
import { Scheduler } from './scheduler.js';

export class Dependency {
  constructor(...metadata) {
    this.subscribers = new Set();
    if (config.mode !== 'off') {
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
    if (config.mode === 'off') {
      return;
    }
    this.context = context || {};
    captureStack(this, this.setContext);
  }

  changed(context) {
    if (config.mode !== 'off') {
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
