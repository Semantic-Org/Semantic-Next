import { Scheduler } from './scheduler.js';
import { isEqual, clone } from '@semantic-ui/utils';
import { Dependency } from './dependency.js';

export class Reaction {

  constructor(callback) {
    this.callback = callback;
    this.dependencies = new Set();
    this.boundRun = this.run.bind(this);
    this.firstRun = true;
    this.active = true;
  }

  run() {
    if (!this.active) {
      return;
    }
    Scheduler.current = this;
    this.dependencies.forEach(dep => dep.cleanUp(this));
    this.dependencies.clear();
    this.callback(this);
    this.firstRun = false;
    Scheduler.current = null;
    Scheduler.pendingReactions.delete(this);
  }

  invalidate(context) {
    this.active = true;
    if(context) {
      this.context = context;
    }
    Scheduler.scheduleReaction(this);
  }

  stop() {
    if (!this.active) return;
    this.active = false;
    this.dependencies.forEach(dep => dep.unsubscribe(this));
  }

  // Static proxies for developer experience
  static get current() { return Scheduler.current; }
  static flush = Scheduler.flush;
  static scheduleFlush = Scheduler.scheduleFlush;
  static afterFlush = Scheduler.afterFlush;
  static getSource = Scheduler.getSource;

  static create(callback) {
    const reaction = new Reaction(callback);
    reaction.run();
    return reaction;
  }

  static nonreactive(func) {
    const previousReaction = Scheduler.current;
    Scheduler.current = null;
    try {
      return func();
    } finally {
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
      value = clone(newValue);
    });
    comp.run();
    return newValue;
  }
}
