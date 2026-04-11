import {
  clone,
  findIndex,
  isArray,
  isClassInstance,
  isDevelopment,
  isEqual,
  isNumber,
  isObject,
  unique,
  wrapFunction,
} from '@semantic-ui/utils';

import { Dependency } from './dependency.js';
import { Reaction } from './reaction.js';

const IS_SIGNAL = Symbol.for('semantic-ui/Signal');

export class Signal {
  get [IS_SIGNAL]() { return true; }
  static [Symbol.hasInstance](instance) {
    return !!instance?.[IS_SIGNAL];
  }

  constructor(initialValue, { context, equalityFunction, allowClone = true, cloneFunction } = {}) {
    // pass in some metadata for debugging
    this.dependency = new Dependency({
      firstRun: true,
      value: initialValue,
    });

    // allow user to opt out of value cloning
    this.allowClone = allowClone;

    // allow custom equality function
    this.equalityFunction = (equalityFunction)
      ? wrapFunction(equalityFunction)
      : Signal.equalityFunction;

    // allow custom clone function
    this.clone = (cloneFunction)
      ? wrapFunction(cloneFunction)
      : Signal.cloneFunction;

    this.currentValue = this.maybeClone(initialValue);

    // allow debugging context to be set
    this.setContext(context);
  }

  // set debugging context for signal removing any present context
  setContext(additionalContext = {}) {
    if (!isDevelopment) {
      return;
    }
    const defaultContext = {
      value: this.currentValue,
    };
    this.context = {
      ...defaultContext,
      ...additionalContext,
    };
  }

  // add context to signal
  addContext(additionalContext = {}) {
    if (!isDevelopment) {
      return;
    }
    if (!this.context) {
      this.context = {};
    }
    for (const key in additionalContext) {
      this.context[key] = additionalContext[key];
    }
  }

  // set debugging stack trace for signal
  setTrace() {
    if (!isDevelopment) {
      return;
    }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this.context, this.setTrace);
    }
    else {
      this.context.stack = new Error().stack;
    }
  }

  static equalityFunction = isEqual;
  static cloneFunction = clone;

  get value() {
    // Record this Signal as a dependency if inside a Reaction computation
    this.depend();
    const value = this.currentValue;

    // otherwise previous value would be modified if the returned value is mutated negating the equality
    return (value !== null && typeof value == 'object')
      ? this.maybeClone(value)
      : value;
  }

  canCloneValue(value) {
    return (this.allowClone === true && !isClassInstance(value));
  }

  maybeClone(value) {
    if (!this.canCloneValue(value)) {
      return value;
    }
    if (isArray(value)) {
      return value.map(value => this.maybeClone(value));
    }
    return this.clone(value);
  }

  set value(newValue) {
    if (!this.equalityFunction(this.currentValue, newValue)) {
      this.currentValue = this.maybeClone(newValue);
      this.notify();
    }
  }

  get({ clone = true } = {}) {
    if (!clone) {
      this.depend();
      return this.currentValue;
    }
    return this.value;
  }

  set(newValue) {
    // equality check in setter
    this.value = newValue;
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

    // Store reaction reference for potential cleanup
    derivedSignal._derivedReaction = reaction;

    return derivedSignal;
  }

  // static method for computing from multiple signals
  static computed(computeFn, options = {}) {
    const computedSignal = new Signal(undefined, options);

    // Create reaction that updates the computed signal
    // No WeakRef needed - computed signal and reaction have same lifecycle
    const reaction = Reaction.create(() => {
      const result = computeFn();
      computedSignal.set(result);
    });

    // Store reaction reference for potential cleanup
    computedSignal._computedReaction = reaction;

    return computedSignal;
  }

  depend() {
    this.dependency.depend();
  }

  notify() {
    if (isDevelopment) {
      this.setContext();
      this.setTrace();
    }
    this.dependency.changed(this.context);
  }

  hasDependents() {
    return this.dependency.subscribers.size > 0;
  }

  peek() {
    return this.maybeClone(this.currentValue);
  }

  clear() {
    return this.set(undefined);
  }

  // mutate the current value by a mutation function
  mutate(mutationFn) {
    // we use clone in all cases to detect for changes only
    const beforeClone = this.clone(this.currentValue);
    const result = mutationFn(this.currentValue);

    if (result !== undefined) {
      if (isDevelopment && result === this.currentValue) {
        console.warn(
          'Signal.mutate: returning the same reference that was mutated in place will bypass change detection. Either mutate without returning, or return a new value.',
        );
      }
      // if the mutation returned a value just set it
      this.value = result;
    }
    else {
      // if no value returned check if the value changed from side effects
      // in this case we want to trigger reactivity
      if (!this.equalityFunction(beforeClone, this.currentValue)) {
        this.notify();
      }
    }
  }

  // array helpers — these always change the value, skip clone+compare
  push(...args) {
    this.currentValue.push(...args);
    this.notify();
  }
  unshift(...args) {
    this.currentValue.unshift(...args);
    this.notify();
  }
  splice(...args) {
    this.currentValue.splice(...args);
    this.notify();
  }
  map(mapFunction) {
    this.currentValue = Array.prototype.map.call(this.currentValue, mapFunction);
    this.notify();
  }
  filter(filterFunction) {
    this.currentValue = Array.prototype.filter.call(this.currentValue, filterFunction);
    this.notify();
  }

  getIndex(index) {
    return this.get()[index];
  }
  setIndex(index, value) {
    this.currentValue[index] = value;
    this.notify();
  }
  removeIndex(index) {
    this.currentValue.splice(index, 1);
    this.notify();
  }

  // sets
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
    if (index === -1) {
      return;
    }
    const newValue = this.peek().map((object, currentIndex) => {
      if (index == 'all' || currentIndex == index) {
        object[property] = value;
      }
      return object;
    });
    this.set(newValue);
  }

  toggle() {
    return this.mutate(val => !val);
  }

  increment(amount = 1, max) {
    return this.mutate(val => {
      let newAmount = val + amount;
      if (isNumber(max) && newAmount > max) {
        newAmount = max;
      }
      return newAmount;
    });
  }
  decrement(amount = 1, min) {
    return this.mutate(val => {
      let newAmount = val - amount;
      if (isNumber(min) && newAmount < min) {
        newAmount = min;
      }
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
      const obj = this.peek();
      obj[property] = value;
      this.set(obj);
    }
  }
  replaceItem(id, item) {
    return this.setIndex(this.getItemIndex(id), item);
  }
  removeItem(id) {
    return this.removeIndex(this.getItemIndex(id));
  }
}
