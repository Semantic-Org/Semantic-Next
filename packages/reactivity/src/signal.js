import {
  clone,
  isArray,
  isClassInstance,
  isDevelopment,
  isEqual,
  isNumber,
  isObject,
  returnsFalse,
  unique,
  wrapFunction,
} from '@semantic-ui/utils';

import { captureStack, isStackCapture, isTracing, setStackCapture, setTracing } from './helpers.js';

import { Dependency } from './dependency.js';
import { Reaction } from './reaction.js';

const IS_SIGNAL = Symbol.for('semantic-ui/Signal');

export class Signal {
  get [IS_SIGNAL]() {
    return true;
  }
  static [Symbol.hasInstance](instance) {
    return !!instance?.[IS_SIGNAL];
  }

  // default clone and equal pulled from utils
  static equalityFunction = isEqual;
  static cloneFunction = clone;

  constructor(initialValue, {
    safety = 'clone',
    cloneFunction = Signal.cloneFunction,
    equalityFunction = (safety === 'none') ? returnsFalse : Signal.equalityFunction,
    context,
  } = {}) {
    // create dependency
    this.dependency = new Dependency({
      firstRun: true,
      value: initialValue,
    });

    // handle custom helpers if user specifies
    this.cloneFunction = cloneFunction;
    this.equalityFunction = equalityFunction;

    this.safety = safety;
    this.currentValue = this.protect(initialValue);

    // pass through debugging context
    this.setContext(context);
  }

  protect(value) {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    if (this.safety === 'clone') {
      return this.clone(value);
    }
    return value;
  }

  get value() {
    // Record this Signal as a dependency if inside a Reaction computation
    this.depend();
    return this.protect(this.currentValue);
  }

  set value(newValue) {
    if (!this.equalityFunction(this.currentValue, newValue)) {
      this.currentValue = this.protect(newValue);
      this.notify();
    }
  }

  get() {
    this.depend();
    return this.currentValue;
  }

  set(newValue) {
    // equality check in setter
    this.value = newValue;
  }

  notify() {
    this.setContext();
    this.setTrace();
    this.dependency.changed(this.context);
  }

  peek() {
    return this.protect(this.currentValue);
  }

  raw() {
    return this.currentValue;
  }

  clone(value = this.currentValue) {
    if (isClassInstance(value)) {
      return value;
    }
    if (isArray(value)) {
      return value.map(arrValue => this.protect(arrValue));
    }
    return this.cloneFunction(value);
  }

  subscribe(callback) {
    return Reaction.create((comp) => {
      callback(this.value, comp);
    });
  }

  /* Dependencies */
  hasDependents() {
    return this.dependency.subscribers.size > 0;
  }

  depend() {
    this.dependency.depend();
  }

  /*******************************
           Child Signals
  *******************************/

  // single signal having a derivation
  derive(computeFn, options = {}) {
    const derivedSignal = new Signal(undefined, options);

    // weak so the reaction's closure doesn't pin derived
    // through source.dep.subscribers
    const derivedRef = new WeakRef(derivedSignal);

    const source = this;

    const reaction = Reaction.create(() => {
      const currentRef = derivedRef.deref();
      if (!currentRef) {
        reaction.stop();
        return;
      }
      currentRef.set(computeFn(source.get()));
    });

    if (Reaction.current) {
      Reaction.current.onCleanup(() => reaction.stop());
    }

    return derivedSignal;
  }

  // multiple signals computing a signal
  static computed(computeFn, options = {}) {
    const computedSignal = new Signal(undefined, options);
    const computedRef = new WeakRef(computedSignal);

    const reaction = Reaction.create(() => {
      const ref = computedRef.deref();
      if (!ref) {
        reaction.stop();
        return;
      }
      ref.set(computeFn());
    });

    if (Reaction.current) {
      Reaction.current.onCleanup(() => reaction.stop());
    }

    return computedSignal;
  }

  /*******************************
          Mutation Helpers
  *******************************/

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

  // clears current value
  clear() {
    return this.set(undefined);
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
      if (index === 'all' || currentIndex === index) {
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
    if (!isObject(item)) {
      return [item];
    }
    return unique([item.id, item._id, item.hash, item.key].filter(Boolean));
  }
  getID(item) {
    if (!isObject(item)) {
      return item;
    }
    return item.id || item._id || item.hash || item.key;
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
    const arr = this.currentValue;
    for (let i = 0; i < arr.length; i++) {
      if (this.hasID(arr[i], id)) { return i; }
    }
    return -1;
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

  /*******************************
           Tracing Utils
  *******************************/

  static setTracing = setTracing;
  static isTracing = isTracing;
  static setStackCapture = setStackCapture;
  static isStackCapture = isStackCapture;

  // context lets you pass through metadata with a signal
  // to determine reaction source
  setContext(additionalContext) {
    if (!isTracing()) {
      return;
    }
    const defaultContext = {
      value: this.currentValue,
    };
    if (!additionalContext) {
      this.addContext(defaultContext);
    }
    else {
      this.context = {
        ...defaultContext,
        ...additionalContext,
      };
    }
  }
  addContext(additionalContext = {}) {
    if (!isTracing()) {
      return;
    }
    if (!this.context) {
      this.context = {};
    }
    for (const key in additionalContext) {
      this.context[key] = additionalContext[key];
    }
  }

  // capturing stack pays a 10-100× perf cost
  // opt in only via setStackCapture(true).
  setTrace() {
    captureStack(this, this.setTrace);
  }
}
