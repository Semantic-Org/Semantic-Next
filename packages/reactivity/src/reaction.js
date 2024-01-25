import { ReactiveVar } from './reactive-var.js';

export class Reaction {

  static current = null;
  static pendingReactions = new Set();
  static afterFlushCallbacks = [];
  static isFlushScheduled = false;

  static scheduleFlush() {
    if (!Reaction.isFlushScheduled) {
      Reaction.isFlushScheduled = true;

      // <https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide>
      if(queueMicrotask) {
        queueMicrotask(Reaction.flush);
      }
      else {
        Promise.resolve().then(Reaction.flush); // Using microtask queue
      }
    }
  }

  static nonreactive(func) {
    const previousReaction = Reaction.current;
    Reaction.current = null;

    try {
      return func();
    } finally {
      Reaction.current = previousReaction;
    }
  }

  static flush() {
    Reaction.isFlushScheduled = false;
    Reaction.pendingReactions.forEach(reaction => reaction());
    Reaction.pendingReactions.clear();

    Reaction.afterFlushCallbacks.forEach(callback => callback());
    Reaction.afterFlushCallbacks = [];
  }

  static afterFlush(callback) {
    Reaction.afterFlushCallbacks.push(callback);
  }

  static recordDependency(reactiveVar) {
    if (Reaction.current) {
      Reaction.current.dependencies.add(reactiveVar);
    }
  }

  static create(callback) {
    const reaction = new Reaction(callback);
    reaction.run();
    return reaction;
  }

  constructor(callback) {
    this.callback = callback;
    this.dependencies = new Set();
    this.boundRun = this.run.bind(this); // Bound function
    this.firstRun = true;
    this.active = true;
  }

  run() {
    if (!this.active) {
      return;
    }
    Reaction.current = this;
    this.dependencies.clear();

    // Provide computation context
    this.callback(this);

    this.firstRun = false;
    Reaction.current = null;

    this.dependencies.forEach(dep => dep.addListener(this.boundRun));
  }

  stop() {
    if (!this.active) return;
    this.active = false;
    this.dependencies.forEach(dep => {
      dep.removeListener(this.boundRun);
    });
  }
}

