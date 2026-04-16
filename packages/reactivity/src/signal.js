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
import { captureStack, config } from './helpers.js';
import { Reaction } from './reaction.js';

// Module-local only because it's used as a computed class member key
// (`[IS_SIGNAL]`), which is evaluated before static fields initialize.
const IS_SIGNAL = Symbol.for('semantic-ui/Signal');

export class Signal {
  // Brand check — allows cross-realm and prototype-created instances to pass
  // instanceof. Paired with the prototype getter below (not a static field,
  // so the check survives subclassing and prototype-based construction).
  static [Symbol.hasInstance](instance) {
    return !!instance?.[IS_SIGNAL];
  }

  get [IS_SIGNAL]() {
    return true;
  }

  // Library-wide defaults for new signals. Assign to change:
  //   Signal.defaultEquality = myEq
  // Wrong values fail at first call rather than at assignment.
  static defaultEquality = isEqual;
  static defaultClone = clone;

  // Shared fn for safety:'none' — a single reference across all such signals
  // instead of a fresh closure per construction. Replace with utils
  // `returnsFalse` when the utils-modernization plan ships.
  static noEquality = () => false;

  // Factory for signals computed from other signals.
  static computed(computeFn, options = {}) {
    const computedSignal = new Signal(undefined, options);
    const reaction = Reaction.create(() => {
      computedSignal.set(computeFn());
    });
    computedSignal._computedReaction = reaction;
    return computedSignal;
  }

  constructor(initialValue, options = {}) {
    const { context, safety, equalityFunction, cloneFunction, allowClone } = options;

    this.dependency = new Dependency({
      firstRun: true,
      value: initialValue,
    });

    this.safety = safety ?? (allowClone === false ? 'reference' : config.safety);

    this.equalityFunction = equalityFunction
      ? wrapFunction(equalityFunction)
      : (this.safety === 'none' ? Signal.noEquality : Signal.defaultEquality);

    this.cloneFunction = cloneFunction
      ? wrapFunction(cloneFunction)
      : Signal.defaultClone;

    this.currentValue = this.protect(initialValue);

    this.setContext(context);
  }

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

  // Stack trace capture is gated separately because Error.captureStackTrace
  // costs ~10-100× a context spread, paid per Signal.notify in tracing-on dev.
  setTrace() {
    captureStack(this, this.setTrace);
  }

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

  // Under 'freeze', fn receives a frozen value and must return a new value
  // (in-place mutation throws). Undefined return notifies unconditionally —
  // the freeze guarantee makes the snapshot/equality dance unnecessary.
  // Under 'reference'/'none', fn may mutate in place; we snapshot before
  // the call and dedupe via equalityFunction so no-op mutates don't fire
  // subscribers ('none' keeps event-stream semantics via NO_EQUALITY).
  mutate(fn) {
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

  /*-------------------------------------------------------------
    Runtime configuration — shared library-wide defaults.

    Direct assignment is the primary API:
      Signal.safety = 'freeze'
      Signal.tracing = true
      Signal.defaultEquality = myEq
    Bulk via Signal.configure({...}).
  -------------------------------------------------------------*/

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

  static configure({ safety, tracing, stackCapture, defaultEquality, defaultClone } = {}) {
    if (safety !== undefined) { Signal.safety = safety; }
    if (tracing !== undefined) { Signal.tracing = tracing; }
    if (stackCapture !== undefined) { Signal.stackCapture = stackCapture; }
    if (defaultEquality !== undefined) { Signal.defaultEquality = defaultEquality; }
    if (defaultClone !== undefined) { Signal.defaultClone = defaultClone; }
  }
}
