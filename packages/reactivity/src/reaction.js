import { captureStack, isTracing } from './helpers/tracing.js';
import { Scheduler } from './scheduler.js';

export class Reaction {
  constructor(callback, { context, firstRun = true } = {}) {
    this.callback = callback;
    this.dependencies = new Set();
    this.cleanups = null; // lazy, most reactions register none
    this.firstRun = true;
    this.active = true;
    if (context && isTracing()) {
      this.setContext(context);
    }
    if (firstRun) {
      this.run();
    }
  }

  // callbacks fire before next run() and on stop. use to scope inner reactions to parent
  onCleanup(callback) {
    (this.cleanups ??= []).push(callback);
  }

  fireCleanups() {
    if (this.cleanups === null) {
      return;
    }
    const callbacks = this.cleanups;
    this.cleanups = null;
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i]();
    }
  }

  setContext(additionalContext = {}) {
    if (!isTracing()) {
      return;
    }
    const defaultContext = {
      firstRun: this.firstRun,
    };
    this.context = {
      ...defaultContext,
      ...additionalContext,
    };
  }

  setTrace() {
    captureStack(this, this.setTrace);
  }

  addContext(additionalContext = {}) {
    if (!isTracing()) {
      return;
    }
    if (!this.context) {
      this.context = {};
    }
    for (const key in additionalContext) {
      this.context[key] = additionalContext[key];
    }
  }

  run() {
    if (!this.active) {
      return;
    }
    if (isTracing()) {
      this.addContext({
        firstRun: this.firstRun,
      });
    }
    this.fireCleanups();
    // save/restore so nested run() (guard, computed, derive) doesn't strand the parent
    const previousReaction = Scheduler.current;
    Scheduler.current = this;
    try {
      for (const dep of this.dependencies) {
        dep.remove(this);
      }
      this.dependencies.clear();
      this.callback(this);
    }
    finally {
      // firstRun advances even on throw so a re-invalidation re-tracks from a known baseline
      this.firstRun = false;
      Scheduler.current = previousReaction;
    }
  }

  invalidate(context) {
    if (!this.active) {
      return;
    }
    if (context) {
      this.addContext(context);
    }
    Scheduler.scheduleReaction(this);
  }

  stop() {
    if (!this.active) {
      return;
    }
    this.active = false;
    Scheduler.pendingReactions.delete(this);
    this.dependencies.forEach(dep => dep.remove(this));
    this.dependencies.clear();
    this.fireCleanups();
  }
}
