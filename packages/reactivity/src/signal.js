import {
  clone,
  deepFreeze,
  findIndex,
  isArray,
  isEqual,
  isNumber,
  isObject,
  isPlainObject,
  unique,
  wrapFunction,
} from '@semantic-ui/utils';

import { Dependency } from './dependency.js';
import { captureStack, config, signalTag } from './helpers.js';
import { Reaction } from './reaction.js';

const devProxyCache = new WeakMap();

const frozenTraps = {
  set(_, prop) {
    throw frozenError(prop);
  },
  deleteProperty(_, prop) {
    throw frozenError(prop);
  },
  defineProperty(_, prop) {
    throw frozenError(prop);
  },
  setPrototypeOf() {
    throw frozenError('[[Prototype]]');
  },
};

function frozenError(prop) {
  return new TypeError(
    `Signal value is frozen — cannot set property \`${String(prop)}\`. `
      + `Use signal.set(newValue), a mutation helper (push, splice, setProperty), `
      + `or construct with { safety: 'reference' } if storing third-party data.`,
  );
}

function devProxyFor(val) {
  let proxy = devProxyCache.get(val);
  if (!proxy) { devProxyCache.set(val, proxy = new Proxy(val, frozenTraps)); }
  return proxy;
}

export class Signal {
  constructor(initialValue, options = {}) {
    const { context, safety, equalityFunction, cloneFunction } = options;

    this.dependency = new Dependency({
      firstRun: true,
      value: initialValue,
    });

    this.safety = safety ?? config.safety;

    this.equalityFunction = equalityFunction
      ? wrapFunction(equalityFunction)
      : (this.safety === 'none' ? Signal.noEquality : Signal.defaultEquality);

    this.cloneFunction = cloneFunction
      ? wrapFunction(cloneFunction)
      : Signal.defaultClone;

    this.currentValue = this.protect(initialValue);

    this.setContext(context);
  }

  /*-------------------
          Core
  --------------------*/

  protect(value) {
    if (value === null || typeof value !== 'object') { return value; }
    return this.safety === 'freeze' ? deepFreeze(value) : value;
  }

  get value() {
    this.depend();
    const val = this.currentValue;
    if (config.mode === 'off' || this.safety !== 'freeze') { return val; }
    if (isArray(val) || isPlainObject(val)) { return devProxyFor(val); }
    return val;
  }

  set value(newValue) {
    if (!this.equalityFunction(this.currentValue, newValue)) {
      this.currentValue = this.protect(newValue);
      this.notify();
      return;
    }
    if (config.mode !== 'off' && isObject(newValue) && newValue === this.currentValue) {
      console.warn(
        'Signal.set() called with the same reference as the current value. '
          + 'If you mutated in place, the reactive update is lost. '
          + 'Use signal.push/splice/setProperty, or return a new value from mutate(). '
          + 'If this was intentional, construct a new value and set that instead.',
      );
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

  depend() {
    this.dependency.depend();
  }

  notify() {
    if (config.mode !== 'off') {
      this.setContext();
      this.setTrace();
    }
    this.dependency.changed(this.context);
  }

  hasDependents() {
    return this.dependency.subscribers.size > 0;
  }

  clear() {
    return this.set(undefined);
  }

  /*-------------------
         Complex
  --------------------*/

  static computed(computeFn, options = {}) {
    const computedSignal = new Signal(undefined, options);
    const reaction = Reaction.create(() => {
      computedSignal.set(computeFn());
    });
    computedSignal._computedReaction = reaction;
    return computedSignal;
  }

  derive(computeFn, options = {}) {
    const derivedSignal = new Signal(undefined, options);

    // weak so the reaction's closure doesn't pin derived through source.dep.subscribers
    const derivedRef = new WeakRef(derivedSignal);
    const source = this;

    const reaction = Reaction.create(() => {
      const derived = derivedRef.deref();
      if (!derived) {
        reaction.stop();
        return;
      }
      derived.set(computeFn(source.get()));
    });
    if (Reaction.current) {
      Reaction.current.onCleanup(() => reaction.stop());
    }
    return derivedSignal;
  }

  /*-------------------
     Mutation Helpers
  --------------------*/

  mutate(fn) {
    // freeze: fn must return a new value (in-place throws).
    // reference/none: fn may mutate in place; dedupe via equalityFunction.
    if (this.safety === 'freeze') {
      const result = fn(this.currentValue);
      if (result !== undefined) {
        this.value = result;
      }
      else {
        this.notify();
      }
      return;
    }
    const before = this.cloneFunction(this.currentValue);
    const result = fn(this.currentValue);
    if (result !== undefined) {
      this.value = result;
    }
    else if (!this.equalityFunction(before, this.currentValue)) {
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

  /*-------------------
         Tracing
  --------------------*/

  setContext(additionalContext = {}) {
    if (config.mode === 'off') { return; }
    const defaultContext = {
      value: this.currentValue,
    };
    this.context = {
      ...defaultContext,
      ...additionalContext,
    };
  }

  addContext(additionalContext = {}) {
    if (config.mode === 'off') { return; }
    if (!this.context) { this.context = {}; }
    for (const key in additionalContext) {
      this.context[key] = additionalContext[key];
    }
  }

  // Error.captureStackTrace is 10-100× a context spread; gated on stack mode.
  setTrace() {
    captureStack(this, this.setTrace);
  }

  /*-------------------
      Instance of
  --------------------*/

  static [Symbol.hasInstance](instance) {
    return !!instance?.[signalTag];
  }

  get [signalTag]() {
    return true;
  }

  /*-------------------
      Configuration
  --------------------*/

  static defaultEquality = isEqual;
  static defaultClone = clone;
  static noEquality = () => false;

  static get safety() {
    return config.safety;
  }
  static set safety(preset) {
    if (preset !== 'freeze' && preset !== 'reference' && preset !== 'none') {
      throw new Error(`Invalid Signal.safety: ${preset}. Must be 'freeze', 'reference', or 'none'.`);
    }
    config.safety = preset;
  }

  static get tracing() {
    return config.mode !== 'off';
  }
  static set tracing(enabled) {
    if (enabled && config.mode === 'off') { config.mode = 'context'; }
    else if (!enabled) { config.mode = 'off'; }
  }

  static get stackCapture() {
    return config.mode === 'stack';
  }
  static set stackCapture(enabled) {
    if (enabled) { config.mode = 'stack'; }
    else if (config.mode === 'stack') { config.mode = 'context'; }
  }

  static configure(config = {}) {
    Object.assign(Signal, config);
  }
}
