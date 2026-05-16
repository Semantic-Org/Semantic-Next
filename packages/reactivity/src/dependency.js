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

  changed(context) {
    if (config.mode !== 'off' && this.subscribers.size > 0) {
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

  /*-------------------
         Tracing
  --------------------*/

  setContext(context) {
    if (config.mode === 'off') {
      return;
    }
    this.context = context || {};
    captureStack(this, this.setContext);
  }
}
