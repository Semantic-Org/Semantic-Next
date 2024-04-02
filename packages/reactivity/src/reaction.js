import { clone, isEqual } from '@semantic-ui/utils';
import { Dependency } from './dependency.js';

export class Reaction {

  static current = null;
  static pendingReactions = new Set();
  static afterFlushCallbacks = [];
  static isFlushScheduled = false;

  static create(callback) {
    const reaction = new Reaction(callback);
    reaction.run();
    return reaction;
  }

  static scheduleFlush() {
    if (!Reaction.isFlushScheduled) {
      Reaction.isFlushScheduled = true;
      if (typeof queueMicrotask === 'function') {
        // <https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide>
        queueMicrotask(() => Reaction.flush());
      } else {
        Promise.resolve().then(() => Reaction.flush());
      }
    }
  }

  static flush() {
    Reaction.isFlushScheduled = false;
    Reaction.pendingReactions.forEach(reaction => reaction.run());
    Reaction.pendingReactions.clear();

    Reaction.afterFlushCallbacks.forEach(callback => callback());
    Reaction.afterFlushCallbacks = [];
  }

  static afterFlush(callback) {
    Reaction.afterFlushCallbacks.push(callback);
  }

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
    Reaction.current = this;
    this.dependencies.forEach(dep => dep.cleanUp(this));
    this.dependencies.clear();
    this.callback(this);
    this.firstRun = false;
    Reaction.current = null;
    Reaction.pendingReactions.delete(this);
  }

  invalidate(context) {
    this.active = true;
    if(context) {
      this.context = context;
    }
    Reaction.pendingReactions.add(this);
    Reaction.scheduleFlush();
  }

  stop() {
    if (!this.active) return;
    this.active = false;
    this.dependencies.forEach(dep => dep.unsubscribe(this));
  }


  /*
    Makes sure anything called inside this function does not trigger reactions
  */
  static nonreactive(func) {
    const previousReaction = Reaction.current;
    Reaction.current = null;
    try {
      return func();
    } finally {
      Reaction.current = previousReaction;
    }
  }

  /*
    Makes sure function doesnt rerun when values dont change
  */
  static guard(f) {
    if (!Reaction.current) {
      return f();
    }
    let dep = new Dependency();
    let value, newValue;
    const comp = new Reaction(() => {
      newValue = f();
      if (!comp.firstRun && !isEqual(newValue, value)) {
        dep.changed();
      }
      value = newValue;
    });
    comp.run(); // Initial run to capture dependencies
    dep.depend(); // Create dependency on guard function
    return value;
  }

  static getSource() {
    if (!Reaction.current || !Reaction.current.context || !Reaction.current.context.trace) {
      console.log('No source available or no current reaction.');
      return;
    }
    let trace = Reaction.current.context.trace;
    trace = trace.split('\n').slice(2).join('\n');
    trace = `Reaction triggered by:\n${trace}`;
    console.info(trace);
    return trace;
  }
}
