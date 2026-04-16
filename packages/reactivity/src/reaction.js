import { isEqual } from '@semantic-ui/utils';
import { Dependency } from './dependency.js';
import { captureStack, config } from './helpers.js';
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
    this.firstRun = true;
    this.active = true;
    if (context && config.mode !== 'off') {
      this.setContext(context);
    }
    this.boundRun = this.run.bind(this);
  }

  addContext(additionalContext = {}) {
    if (config.mode === 'off') {
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
    if (config.mode !== 'off') {
      this.addContext({
        firstRun: this.firstRun,
      });
    }
    Scheduler.current = this;
    try {
      for (const dep of this.dependencies) {
        dep.cleanUp(this);
      }
      this.dependencies.clear();
      this.callback(this);
      this.firstRun = false;
    }
    finally {
      Scheduler.current = null;
    }
  }

  invalidate(context) {
    this.active = true;

    if (context && config.mode !== 'off') {
      this.addContext(context);
    }

    Scheduler.scheduleReaction(this);
  }

  stop() {
    if (!this.active) {
      return;
    }
    this.active = false;
    this.dependencies.forEach(dep => dep.unsubscribe(this));
  }

  static get current() {
    return Scheduler.current;
  }

  /*-------------------
        Helpers
  --------------------*/

  static flush = Scheduler.flush;
  static scheduleFlush = Scheduler.scheduleFlush;
  static afterFlush = Scheduler.afterFlush;
  static getSource = Scheduler.getSource;

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
    comp.run();
    return newValue;
  }

  /*-------------------
         Tracing
  --------------------*/

  setContext(additionalContext = {}) {
    if (config.mode === 'off') {
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
}
