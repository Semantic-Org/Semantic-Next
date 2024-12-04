import { isEqual } from '@semantic-ui/utils';
import { Dependency } from './dependency.js';

export class Reaction {

  static current = null;
  static pendingReactions = new Set();
  static afterFlushCallbacks = [];
  static isFlushScheduled = false;
  static isFlushing = false;
  static flushPromise = null;

  static create(callback) {
    const reaction = new Reaction(callback);
    reaction.run();
    return reaction;
  }

  static scheduleFlush() {
    if (!Reaction.isFlushScheduled) {
      Reaction.isFlushScheduled = true;
      if (typeof queueMicrotask === 'function') {
        // Use queueMicrotask for efficient scheduling
        queueMicrotask(() => Reaction.flush());
      } else {
        Promise.resolve().then(() => Reaction.flush());
      }
    }
  }

  static flush() {
    Reaction.isFlushScheduled = false;
    Reaction.isFlushing = true;
    while (Reaction.pendingReactions.size > 0) {
      const reactionsToRun = Array.from(Reaction.pendingReactions);
      Reaction.pendingReactions.clear();
      reactionsToRun.forEach(reaction => reaction.run());
    }
    // After all reactions have been processed, call afterFlush callbacks
    const callbacks = Reaction.afterFlushCallbacks;
    Reaction.afterFlushCallbacks = [];
    callbacks.forEach(callback => callback());
    Reaction.isFlushing = false;
  }

  static flushAsync() {
    if (!Reaction.flushPromise) {
      Reaction.flushPromise = new Promise((resolve) => {
        if (typeof queueMicrotask === 'function') {
          queueMicrotask(() => {
            Reaction.flush();
            Reaction.flushPromise = null;
            resolve();
          });
        } else {
          Promise.resolve().then(() => {
            Reaction.flush();
            Reaction.flushPromise = null;
            resolve();
          });
        }
      });
    }
    return Reaction.flushPromise;
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
    this.isRunning = false; // Track if the reaction is currently running
    this.version = 0;       // Versioning to handle async operations
  }

  async run() {
    if (!this.active) {
      return;
    }
    this.isRunning = true;
    const currentVersion = this.version;

    // Clean up previous dependencies
    this.dependencies.forEach(dep => dep.cleanUp(this));
    this.dependencies.clear();

    // Set the current reaction
    Reaction.current = this;

    try {
      // Execute the callback and check if it returns a Promise
      const result = this.callback(this);

      if (result && typeof result.then === 'function') {
        // If the callback returns a Promise, await it
        await result;

        // Check if the reaction was invalidated while awaiting
        if (this.version !== currentVersion) {
          // If so, exit early; a newer run has started
          return;
        }
      }
    } finally {
      // Clean up
      this.firstRun = false;
      Reaction.current = null;
      Reaction.pendingReactions.delete(this);
      this.isRunning = false;
    }
  }

  invalidate(context) {
    if (!this.active) return;
    this.active = true;   // Reactivate the reaction if it was inactive
    this.version++;       // Increment version to signal invalidation
    if (context) {
      this.context = context;
    }
    Reaction.pendingReactions.add(this);
    Reaction.scheduleFlush();
  }

  stop() {
    if (!this.active) return;
    this.active = false;
    this.dependencies.forEach(dep => dep.unsubscribe(this));
    this.dependencies.clear();
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
    Makes sure function doesn't rerun when values don't change
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
