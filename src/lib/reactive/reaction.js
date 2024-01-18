import { ReactiveVar } from './reactive-var.js';

export class Reaction {

  static current = null;
  static pendingReactions = new Set();
  static afterFlushCallbacks = [];
  static isFlushScheduled = false;

  static scheduleFlush() {
    if (!Reaction.isFlushScheduled) {
      Reaction.isFlushScheduled = true;
      Promise.resolve().then(Reaction.flush); // Using microtask queue
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
    return () => reaction.stop();
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
    this.callback({
      firstRun: this.firstRun,
      stop: () => this.stop()
    });

    this.firstRun = false;
    Reaction.current = null;

    this.dependencies.forEach(dep => dep.addListener(this.boundRun));
  }

  stop() {
    if (!this.active) return;
    this.active = false;
    this.dependencies.forEach(dep => dep.removeListener(this.boundRun));
  }
}

