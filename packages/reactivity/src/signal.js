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

import { ComputedDependency, Dependency } from './dependency.js';
import { captureStack, isStackCapture, isTracing, setStackCapture, setTracing } from './helpers.js';
import { Reaction } from './reaction.js';
import { Scheduler } from './scheduler.js';

const IS_SIGNAL = Symbol.for('semantic-ui/Signal');

export class Signal {
  get [IS_SIGNAL]() {
    return true;
  }
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
    // guard before allocating the defaults object — notify() hits this every signal write
    if (!isTracing()) { return; }
    this.context = { value: this.currentValue, ...additionalContext };
  }

  // add context to signal
  addContext(additionalContext = {}) {
    if (!isTracing()) { return; }
    if (!this.context) { this.context = {}; }
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
  static setTracing = setTracing;
  static isTracing = isTracing;
  static setStackCapture = setStackCapture;
  static isStackCapture = isStackCapture;

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

  // derive a new signal from this signal's value. thin wrapper over computed:
  // this.get() inside the closure tracks the source via the internal reaction's
  // own subscription, so source retention follows the natural chain. when the
  // derived signal has no subscribers, the internal reaction stops and the
  // source's subscriber set releases — no WeakRef needed.
  derive(computeFn, options = {}) {
    return Signal.computed(() => computeFn(this.get()), options);
  }

  // Lazy reference-counted computed. Subscribes to upstream dependencies only
  // when at least one downstream subscriber observes; stops the internal
  // reaction (severing the strong root from upstream) when the last subscriber
  // detaches. Matches the Vue 3 / MobX / Solid pattern.
  //
  // Decision crib (per council fresh-take ref-fresh-take-strong.md):
  //  - first-subscribe trigger: ComputedDependency.depend() at 0→1, fires BEFORE
  //    adding the new subscriber so the internal reaction's initial set()
  //    doesn't invalidate the just-attaching reader.
  //  - last-detach: deferred to next afterFlush boundary, cancelled if any
  //    subscriber re-attaches first. Required for correctness given that every
  //    Reaction.run() transiently empties subscribers during dep-clear.
  //  - restart on re-subscribe: fresh reaction. Terminal-stop invariant stands.
  //  - parent-stop wins: forces synchronous teardown, cancels any pending defer.
  //  - bare reads in dormant state return cached currentValue (initial value
  //    populated at construction via Reaction.nonreactive — no upstream
  //    subscription happens during the initial run). After a subscription
  //    window has run and detached, bare reads may return a stale cached value;
  //    caller should re-observe to refresh.
  static computed(computeFn, options = {}) {
    const { parent = Reaction.current, ...signalOptions } = options;
    let internalReaction = null;
    let stopPending = false;
    const computedSignal = new Signal(undefined, signalOptions);

    const startTracking = () => {
      stopPending = false;
      if (internalReaction) { return; }
      internalReaction = Reaction.create(() => {
        computedSignal.set(computeFn());
      });
    };

    const stopTrackingNow = () => {
      if (!internalReaction) { return; }
      internalReaction.stop();
      internalReaction = null;
    };

    const queueStop = () => {
      if (stopPending) { return; }
      stopPending = true;
      Scheduler.afterFlush(() => {
        if (stopPending && computedSignal.dependency.subscribers.size === 0) {
          stopTrackingNow();
        }
        stopPending = false;
      });
    };

    computedSignal.dependency = new ComputedDependency(
      { firstRun: true, value: undefined },
      { onObserved: startTracking, onUnobserved: queueStop },
    );

    // Eager initial run via nonreactive scope. Populates currentValue so bare
    // reads return a sensible initial value, without subscribing to upstream
    // (no internal reaction exists yet; nonreactive ensures the caller's
    // tracking context, if any, doesn't pick up incidental source reads).
    computedSignal.set(Reaction.nonreactive(computeFn));

    if (parent) {
      parent.onCleanup(() => {
        stopPending = false;
        stopTrackingNow();
      });
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
