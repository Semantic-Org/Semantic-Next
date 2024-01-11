import { isEqual, clone } from './utils';

class Reaction {

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
  }

  run() {
    Reaction.current = this;
    this.dependencies.clear();
    this.callback();
    Reaction.current = null;

    this.dependencies.forEach(dep => dep.addListener(this.boundRun));
  }

  stop() {
    this.dependencies.forEach(dep => dep.removeListener(this.boundRun));
  }
}

class ReactiveVar {


  constructor(initialValue, equalityFunction) {
    this.currentValue = initialValue;
    this._listeners = new Set();
    this.equalityFunction = equalityFunction || ReactiveVar.equalityFunction;
  }

  /* Classic Meteor
  static equalityFunction(a, b) {
    if (a !== b) {
      return false;
    }
    else {
      return ((!a) || (typeof a === 'number') || (typeof a === 'boolean') ||
              (typeof a === 'string'));
    }
  }
  */

  // modern
  static equalityFunction = (a, b) => {
    return isEqual(a, b);
  };

  get value() {
    // Record this ReactiveVar as a dependency if inside a Reaction computation
    Reaction.recordDependency(this);
    const value = this.currentValue;

    // otherwise previous value would be modified if the returned value is mutated negating the equality
    return (Array.isArray(value) || typeof value == 'object')
      ? clone(value)
      : value
    ;
  }

  set value(newValue) {
    if (!this.equalityFunction(this.currentValue, newValue)) {
      this.currentValue = newValue;
      this._notifyListeners();
    }
  }

  get() {
    return this.value;
  }

  set(newValue) {
    if (!this.equalityFunction(this.currentValue, newValue)) {
      this.value = newValue;
      this._notifyListeners();
    }
  }


  addListener(listener) {
    this._listeners.add(listener);
  }

  removeListener(listener) {
    this._listeners.delete(listener);
  }

  _notifyListeners() {
    this._listeners.forEach(listener => {
      Reaction.pendingReactions.add(listener);
    });
    Reaction.scheduleFlush();
  }

}




export { ReactiveVar, Reaction };
