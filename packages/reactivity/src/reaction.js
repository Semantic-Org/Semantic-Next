import { clone, isEqual } from '@semantic-ui/utils';
import { Dependency } from './dependency.js';
import { captureStack, isStackCapture, isTracing, setStackCapture, setTracing } from './helpers.js';
import { Scheduler } from './scheduler.js';

export class Reaction {
  static create(callback, options = {}) {
    const reaction = new Reaction(callback, options);
    if (options.firstRun !== false) {
      reaction.boundRun();
    }
    return reaction;
  }

  constructor(callback, { context } = {}) {
    this.callback = callback;
    this.dependencies = new Set();
    this.cleanups = [];
    this.firstRun = true;
    this.active = true;
    this.stopped = false;
    if (context && isTracing()) {
      this.setContext(context);
    }
    this.boundRun = this.run.bind(this);
  }

  // callbacks fire before next run() and on stop. use to scope inner reactions to parent
  onCleanup(callback) {
    this.cleanups.push(callback);
  }

  fireCleanups() {
    if (this.cleanups.length === 0) {
      return;
    }
    const callbacks = this.cleanups;
    this.cleanups = [];
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
    // only run this reaction is marked as active
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
    if (this.stopped) {
      return;
    }
    this.active = true;
    if (context) {
      this.addContext(context);
    }
    Scheduler.scheduleReaction(this);
  }

  stop() {
    if (this.stopped) {
      return;
    }
    this.stopped = true;
    this.active = false;
    Scheduler.pendingReactions.delete(this);
    this.dependencies.forEach(dep => dep.remove(this));
    this.dependencies.clear();
    this.fireCleanups();
  }

  // Static proxies for developer experience
  static get current() {
    return Scheduler.current;
  }

  // DX pass throughs
  static flush = Scheduler.flush;
  static scheduleFlush = Scheduler.scheduleFlush;
  static afterFlush = Scheduler.afterFlush;
  static getSource = Scheduler.getSource;
  static setTracing = setTracing;
  static isTracing = isTracing;
  static setStackCapture = setStackCapture;
  static isStackCapture = isStackCapture;

  static nonreactive(func) {
    const previousReaction = Scheduler.current;
    Scheduler.current = null;
    try {
      return func();
    }
    finally {
      Scheduler.current = previousReaction;
    }
  }

  static guard(f, equalCheck = isEqual) {
    if (!Scheduler.current) {
      return f();
    }
    let dep = new Dependency();
    let value, newValue;
    dep.depend();
    const comp = new Reaction(() => {
      newValue = f();
      if (!comp.firstRun && !equalCheck(newValue, value)) {
        dep.changed();
      }
      value = newValue;
    });
    Scheduler.current.onCleanup(() => comp.stop());
    comp.run();
    return newValue;
  }
}
