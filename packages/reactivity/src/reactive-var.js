import { clone, isEqual } from '@semantic-ui/utils';
import { Reaction } from './reaction.js';

export class ReactiveVar {

  constructor(initialValue, equalityFunction) {
    this.currentValue = clone(initialValue);
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
      this.currentValue = clone(newValue);
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

  subscribe(callback) {
    const reaction = Reaction.create(() => {
      callback(this._value);
    });
    return () => reaction.stop();
  }

  peek() {
    const currentReaction = Reaction.current;
    Reaction.current = null;
    const value = this._value;
    Reaction.current = currentReaction;
    return value;
  }

  addListener(listener) {
    this._listeners.add(listener);
  }

  removeListener(listener) {
    this._listeners.delete(listener);
  }

  // array helpers
  push(value) {
    let arr = this.value;
    arr.push(value);
    this.set(arr);
  }
  unshift(value) {
    let arr = this.value;
    arr.unshift(value);
    this.set(arr);
  }
  splice(...args) {
    let arr = this.value;
    arr.splice(...args);
    this.set(arr);
  }
  setItem(index, value) {
    let arr = this.value;
    arr[index] = value;
    this.set(arr);
  }
  removeItem(index) {
    let arr = this.value;
    arr.splice(index, 1);
    this.set(arr);
  }


  _notifyListeners() {
    this._listeners.forEach(listener => {
      Reaction.pendingReactions.add(listener);
    });
    Reaction.scheduleFlush();
  }

}
