import {
  clone,
  deepFreeze,
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
import {
  captureStack,
  getSafety,
  isStackCapture,
  isTracing,
  setSafety,
  setStackCapture,
  setTracing,
} from './helpers.js';
import { Reaction } from './reaction.js';

const noEquality = () => false;

const IS_SIGNAL = Symbol.for('semantic-ui/Signal');

export class Signal {
  get [IS_SIGNAL]() {
    return true;
  }
  static [Symbol.hasInstance](instance) {
    return !!instance?.[IS_SIGNAL];
  }

  constructor(initialValue, { context, equalityFunction, allowClone, cloneFunction, safety } = {}) {
    // pass in some metadata for debugging
    this.dependency = new Dependency({
      firstRun: true,
      value: initialValue,
    });

    // safety preset: explicit > allowClone backward-compat > Signal.safety static default
    this.safety = safety ?? (allowClone === false ? 'reference' : getSafety());
    // derived for the existing maybeClone path — only true under 'clone'
    this.allowClone = this.safety === 'clone';

    // allow custom equality function; 'none' skips dedupe entirely
    this.equalityFunction = (equalityFunction)
      ? wrapFunction(equalityFunction)
      : (this.safety === 'none' ? noEquality : Signal.equalityFunction);

    // allow custom clone function
    this.clone = (cloneFunction)
      ? wrapFunction(cloneFunction)
      : Signal.cloneFunction;

    this.currentValue = this.protect(initialValue);

    // allow debugging context to be set
    this.setContext(context);
  }

  // Apply the safety preset's storage protection on the way in.
  // 'clone' — deep-clone (mutation isolation, current default)
  // 'freeze' — deep-freeze in place (throws on mutation at the call site)
  // 'reference' / 'none' — store raw (caller owns mutation discipline)
  protect(value) {
    if (value === null || typeof value !== 'object') { return value; }
    if (this.safety === 'clone') { return this.maybeClone(value); }
    if (this.safety === 'freeze') { return deepFreeze(value); }
    return value;
  }

  // set debugging context for signal removing any present context
  setContext(additionalContext = {}) {
    if (!isTracing()) {
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

  // Stack trace capture is gated separately because Error.captureStackTrace
  // costs ~10-100× a context spread, paid per Signal.notify in tracing-on
  // dev. Default off; opt in via setStackCapture(true).
  setTrace() {
    captureStack(this, this.setTrace);
  }

  static equalityFunction = isEqual;
  static cloneFunction = clone;
  static noEquality = noEquality;
  static setTracing = setTracing;
  static isTracing = isTracing;
  static setStackCapture = setStackCapture;
  static isStackCapture = isStackCapture;

  // Accessor pairs over helpers state, so `Signal.safety = 'freeze'` and
  // `Object.assign(Signal, { safety: 'freeze', tracing: true })` both work.
  static get safety() {
    return getSafety();
  }
  static set safety(preset) {
    setSafety(preset);
  }
  static get tracing() {
    return isTracing();
  }
  static set tracing(enabled) {
    setTracing(enabled);
  }
  static get stackCapture() {
    return isStackCapture();
  }
  static set stackCapture(enabled) {
    setStackCapture(enabled);
  }

  static configure(config = {}) {
    Object.assign(Signal, config);
  }

  get value() {
    // Record this Signal as a dependency if inside a Reaction computation
    this.depend();
    const value = this.currentValue;

    // Only 'clone' mode pays the per-read clone — reference/freeze/none all
    // return the stored value directly.
    if (this.safety === 'clone' && value !== null && typeof value === 'object') {
      return this.maybeClone(value);
    }
    return value;
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
      this.currentValue = this.protect(newValue);
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
    // weak so the reaction's closure doesn't pin derived through source.dep.subscribers
    const derivedRef = new WeakRef(derivedSignal);
    const source = this;

    const reaction = Reaction.create(() => {
      const d = derivedRef.deref();
      if (!d) {
        reaction.stop();
        return;
      }
      d.set(computeFn(source.get()));
    });

    if (Reaction.current) {
      Reaction.current.onCleanup(() => reaction.stop());
    }

    return derivedSignal;
  }

  // static method for computing from multiple signals
  static computed(computeFn, options = {}) {
    const computedSignal = new Signal(undefined, options);
    const computedRef = new WeakRef(computedSignal);

    const reaction = Reaction.create(() => {
      const c = computedRef.deref();
      if (!c) {
        reaction.stop();
        return;
      }
      c.set(computeFn());
    });

    if (Reaction.current) {
      Reaction.current.onCleanup(() => reaction.stop());
    }

    return computedSignal;
  }

  depend() {
    this.dependency.depend();
  }

  notify() {
    // Each gate handles itself — setContext on isTracing, setTrace on
    // isStackCapture. Hot path: both early-return when their flag is off.
    this.setContext();
    this.setTrace();
    this.dependency.changed(this.context);
  }

  hasDependents() {
    return this.dependency.subscribers.size > 0;
  }

  peek() {
    // 'clone' returns a fresh copy (mutation isolation); other modes return raw.
    if (this.safety === 'clone') { return this.maybeClone(this.currentValue); }
    return this.currentValue;
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

  // array helpers — these always change the value, skip clone+compare.
  // Under 'freeze' the stored array is frozen, so each helper rebuilds and
  // re-freezes; other modes mutate in place.
  push(...args) {
    if (this.safety === 'freeze') {
      this.currentValue = deepFreeze([...this.currentValue, ...args]);
    }
    else {
      this.currentValue.push(...args);
    }
    this.notify();
  }
  unshift(...args) {
    if (this.safety === 'freeze') {
      this.currentValue = deepFreeze([...args, ...this.currentValue]);
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
      this.currentValue = deepFreeze(next);
    }
    else {
      this.currentValue.splice(...args);
    }
    this.notify();
  }
  map(mapFunction) {
    const next = Array.prototype.map.call(this.currentValue, mapFunction);
    this.currentValue = this.safety === 'freeze' ? deepFreeze(next) : next;
    this.notify();
  }
  filter(filterFunction) {
    const next = Array.prototype.filter.call(this.currentValue, filterFunction);
    this.currentValue = this.safety === 'freeze' ? deepFreeze(next) : next;
    this.notify();
  }

  getIndex(index) {
    return this.get()[index];
  }
  setIndex(index, value) {
    if (this.safety === 'freeze') {
      const next = [...this.currentValue];
      next[index] = value;
      this.currentValue = deepFreeze(next);
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
      this.currentValue = deepFreeze(next);
    }
    else {
      this.currentValue.splice(index, 1);
    }
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
    if (this.safety === 'freeze') {
      // rebuild every matching entry — direct mutation would throw on frozen
      const next = this.currentValue.map((object, currentIndex) => {
        if (index === 'all' || currentIndex === index) {
          return { ...object, [property]: value };
        }
        return object;
      });
      this.set(next);
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
        return;
      }
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
