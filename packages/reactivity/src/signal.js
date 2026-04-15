import {
  clone,
  deepFreeze,
  findIndex,
  isArray,
  isEqual,
  isNumber,
  isObject,
  unique,
  wrapFunction,
} from '@semantic-ui/utils';

import { Dependency } from './dependency.js';
import { captureStack, getDefaultSafety, isStackCapture, isTracing, setStackCapture, setTracing } from './helpers.js';
import { Reaction } from './reaction.js';

const IS_SIGNAL = Symbol.for('semantic-ui/Signal');
const NO_EQUALITY = () => false;

export class Signal {
  get [IS_SIGNAL]() {
    return true;
  }
  static [Symbol.hasInstance](instance) {
    return !!instance?.[IS_SIGNAL];
  }

  constructor(initialValue, options = {}) {
    const { context, safety, equalityFunction, cloneFunction, allowClone } = options;

    this.dependency = new Dependency({
      firstRun: true,
      value: initialValue,
    });

    // legacy `allowClone: false` maps to 'reference' for back-compat
    this.safety = safety ?? (allowClone === false ? 'reference' : getDefaultSafety());

    this.equalityFunction = equalityFunction
      ? wrapFunction(equalityFunction)
      : (this.safety === 'none' ? NO_EQUALITY : Signal.equalityFunction);

    this.cloneFunction = cloneFunction
      ? wrapFunction(cloneFunction)
      : Signal.cloneFunction;

    this.currentValue = this.protect(initialValue);

    this.setContext(context);
  }

  setContext(additionalContext = {}) {
    if (!isTracing()) { return; }
    const defaultContext = {
      value: this.currentValue,
    };
    this.context = {
      ...defaultContext,
      ...additionalContext,
    };
  }

  addContext(additionalContext = {}) {
    if (!isTracing()) { return; }
    if (!this.context) { this.context = {}; }
    for (const key in additionalContext) {
      this.context[key] = additionalContext[key];
    }
  }

  // Stack trace capture is gated separately because Error.captureStackTrace
  // costs ~10-100× a context spread, paid per Signal.notify in tracing-on dev.
  setTrace() {
    captureStack(this, this.setTrace);
  }

  static equalityFunction = isEqual;
  static cloneFunction = clone;
  static setTracing = setTracing;
  static isTracing = isTracing;
  static setStackCapture = setStackCapture;
  static isStackCapture = isStackCapture;

  protect(value) {
    if (value === null || typeof value !== 'object') { return value; }
    return this.safety === 'freeze' ? deepFreeze(value) : value;
  }

  get value() {
    this.depend();
    return this.currentValue;
  }

  set value(newValue) {
    if (!this.equalityFunction(this.currentValue, newValue)) {
      this.currentValue = this.protect(newValue);
      this.notify();
    }
  }

  get() {
    return this.value;
  }

  set(newValue) {
    this.value = newValue;
  }

  peek() {
    return this.currentValue;
  }

  clone() {
    this.depend();
    return this.cloneFunction(this.currentValue);
  }

  subscribe(callback) {
    return Reaction.create((comp) => {
      callback(this.value, comp);
    });
  }

  // derive a new signal from this signal's value
  derive(computeFn, options = {}) {
    const derivedSignal = new Signal(undefined, options);

    // check if signal has been garbage collected
    // if it has we need to clean up reaction
    const sourceRef = new WeakRef(this);

    // Create reaction that updates the derived signal
    const reaction = Reaction.create(() => {
      const source = sourceRef.deref();
      if (!source) {
        reaction.stop(); // Auto-cleanup if source is gone
        return;
      }
      const result = computeFn(source.get());
      derivedSignal.set(result);
    });

    derivedSignal._derivedReaction = reaction;

    return derivedSignal;
  }

  static computed(computeFn, options = {}) {
    const computedSignal = new Signal(undefined, options);

    const reaction = Reaction.create(() => {
      const result = computeFn();
      computedSignal.set(result);
    });

    computedSignal._computedReaction = reaction;

    return computedSignal;
  }

  depend() {
    this.dependency.depend();
  }

  notify() {
    this.setContext();
    this.setTrace();
    this.dependency.changed(this.context);
  }

  hasDependents() {
    return this.dependency.subscribers.size > 0;
  }

  clear() {
    return this.set(undefined);
  }

  // Under 'freeze', the fn receives a frozen value and must return a new value
  // (in-place mutation throws). Under 'reference'/'none', fn may mutate in place
  // and return undefined — notify fires either way.
  mutate(fn) {
    const result = fn(this.currentValue);
    if (result !== undefined) {
      this.value = result;
    }
    else {
      this.notify();
    }
  }

  push(...args) {
    if (this.safety === 'freeze') {
      this.currentValue = this.protect([...this.currentValue, ...args]);
    }
    else {
      this.currentValue.push(...args);
    }
    this.notify();
  }

  unshift(...args) {
    if (this.safety === 'freeze') {
      this.currentValue = this.protect([...args, ...this.currentValue]);
    }
    else {
      this.currentValue.unshift(...args);
    }
    this.notify();
  }

  splice(...args) {
    if (this.safety === 'freeze') {
      const next = [...this.currentValue];
      next.splice(...args);
      this.currentValue = this.protect(next);
    }
    else {
      this.currentValue.splice(...args);
    }
    this.notify();
  }

  map(mapFunction) {
    this.currentValue = this.protect(Array.prototype.map.call(this.currentValue, mapFunction));
    this.notify();
  }

  filter(filterFunction) {
    this.currentValue = this.protect(Array.prototype.filter.call(this.currentValue, filterFunction));
    this.notify();
  }

  getIndex(index) {
    return this.get()[index];
  }

  setIndex(index, value) {
    if (this.safety === 'freeze') {
      const next = [...this.currentValue];
      next[index] = value;
      this.currentValue = this.protect(next);
    }
    else {
      this.currentValue[index] = value;
    }
    this.notify();
  }

  removeIndex(index) {
    if (this.safety === 'freeze') {
      const next = [...this.currentValue];
      next.splice(index, 1);
      this.currentValue = this.protect(next);
    }
    else {
      this.currentValue.splice(index, 1);
    }
    this.notify();
  }

  setArrayProperty(indexOrProperty, property, value) {
    let index;
    if (isNumber(indexOrProperty)) {
      index = indexOrProperty;
    }
    else {
      index = 'all';
      value = property;
      property = indexOrProperty;
    }
    if (index === -1) { return; }

    if (this.safety === 'freeze') {
      const newValue = this.currentValue.map((object, currentIndex) => {
        if (index === 'all' || currentIndex === index) {
          return { ...object, [property]: value };
        }
        return object;
      });
      this.set(newValue);
    }
    else {
      const arr = this.currentValue;
      for (let i = 0; i < arr.length; i++) {
        if (index === 'all' || i === index) {
          arr[i][property] = value;
        }
      }
      this.notify();
    }
  }

  toggle() {
    return this.mutate(val => !val);
  }

  increment(amount = 1, max) {
    return this.mutate(val => {
      let newAmount = val + amount;
      if (isNumber(max) && newAmount > max) { newAmount = max; }
      return newAmount;
    });
  }

  decrement(amount = 1, min) {
    return this.mutate(val => {
      let newAmount = val - amount;
      if (isNumber(min) && newAmount < min) { newAmount = min; }
      return newAmount;
    });
  }

  now() {
    return this.mutate(() => new Date());
  }

  getIDs(item) {
    if (isObject(item)) {
      return unique([item?._id, item?.id, item?.hash, item?.key].filter(Boolean));
    }
    return [item];
  }

  getID(item) {
    return this.getIDs(item).filter(Boolean)[0];
  }

  hasID(item, id) {
    return this.getID(item) === id;
  }

  getItem(id) {
    const index = this.getItemIndex(id);
    if (index !== -1) {
      return this.getIndex(index);
    }
  }

  getItemIndex(id) {
    return findIndex(this.currentValue, item => this.hasID(item, id));
  }

  setProperty(idOrProperty, property, value) {
    if (isArray(this.currentValue)) {
      const id = idOrProperty;
      const index = this.getItemIndex(id);
      return this.setArrayProperty(index, property, value);
    }
    else {
      value = property;
      property = idOrProperty;
      if (this.safety === 'freeze') {
        this.set({ ...this.currentValue, [property]: value });
      }
      else {
        this.currentValue[property] = value;
        this.notify();
      }
    }
  }

  replaceItem(id, item) {
    return this.setIndex(this.getItemIndex(id), item);
  }

  removeItem(id) {
    return this.removeIndex(this.getItemIndex(id));
  }
}
