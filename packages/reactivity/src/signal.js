import {
  clone,
  isArray,
  isDevelopment,
  isEqual,
  isNumber,
  isObject,
  observeWrites,
  returnsFalse,
  unique,
  wrapFunction,
} from '@semantic-ui/utils';

import { Dependency } from './dependency.js';
import { IS_SIGNAL } from './helpers/identity.js';
import { captureStack, isTracing } from './helpers/tracing.js';

export class Signal {
  get [IS_SIGNAL]() {
    return true;
  }
  static [Symbol.hasInstance](instance) {
    return !!instance?.[IS_SIGNAL];
  }

  // default helpers, overridable on the class or per-instance via options
  static equality = isEqual;
  static clone = (value) => clone(value, { preserveNonCloneable: true });
  static id = (item) => item.id ?? item._id ?? item.hash ?? item.key;
  static safety = 'reference';

  constructor(initialValue, {
    safety = Signal.safety,
    clone = Signal.clone,
    equality = (safety === 'none') ? returnsFalse : Signal.equality,
    id = Signal.id,
    version = 0,
    context,
  } = {}) {
    // create dependency
    this.dependency = new Dependency({
      firstRun: true,
      value: initialValue,
    });

    // preserve v8 monomorphism for derived/computed signals with cleanup
    this.reaction = null;

    // configured helpers, defaulting to the class statics
    this.cloneFunction = clone;
    this.equality = equality;
    this.id = id;

    this.safety = safety;
    this.currentValue = this.protect(initialValue);
    // monotonic change counter for debugging / external-store
    this.version = version;

    // pass through debugging context
    this.setContext(context);
  }

  protect(value) {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    if (this.safety === 'clone') {
      return this.cloneFunction(value);
    }
    return value;
  }

  get value() {
    // Record this Signal as a dependency if inside a Reaction computation
    this.depend();
    return this.protect(this.currentValue);
  }

  set value(newValue) {
    if (!this.equality(this.currentValue, newValue)) {
      this.currentValue = this.protect(newValue);
      this.notify();
    }
  }

  get() {
    return this.value;
  }

  set(newValue) {
    // equality check in setter
    this.value = newValue;
  }

  notify() {
    this.version++;
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

  // detached deep copy that still tracks, so helpers can sort/mutate in place
  // without the reference-safety footgun of mutating the live value from get()
  clone() {
    this.depend();
    return this.cloneFunction(this.currentValue);
  }

  stop() {
    // cleanup for derived signals only
    this.reaction?.stop();
  }

  /* Dependencies */
  hasDependents() {
    return this.dependency.subscribers.size > 0;
  }

  depend() {
    this.dependency.depend();
  }

  /*******************************
          Mutation Helpers
  *******************************/

  // mutate the current value by a mutation function
  mutate(mutationFn) {
    let snapshots = null;
    const { proxy, didWrite, revoke, unwrap } = observeWrites(this.currentValue, {
      // exotic values (Map/Set/Date/class instances) can't be observed through the
      // proxy, so snapshot the ones the callback touches and compare them after
      onExotic: (exotic) => {
        if (!snapshots) {
          snapshots = new Map();
        }
        if (!snapshots.has(exotic)) {
          snapshots.set(exotic, this.cloneFunction(exotic));
        }
      },
    });
    // unwrap so a returned draft (the proxy, or a nested one) is stored as raw,
    // never as a revoked proxy
    const result = unwrap(mutationFn(proxy));
    revoke();

    let changed = didWrite();
    if (snapshots && !changed) {
      for (const [exotic, before] of snapshots) {
        if (!this.equality(before, exotic)) {
          changed = true;
          break;
        }
      }
    }

    // returning the value (or its proxy) can't be stored, that's the in-place
    // footgun, so fall through to change detection
    const returnedInPlace = result === proxy || result === this.currentValue;

    if (result !== undefined && !returnedInPlace) {
      this.value = result;
      return;
    }

    if (isDevelopment && result !== undefined) {
      console.warn(
        'Signal.mutate: returning the same reference that was mutated in place will bypass change detection. Either mutate without returning, or return a new value.',
      );
    }
    if (changed) {
      this.notify();
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
    const arr = this.currentValue;
    for (let i = 0; i < arr.length; i++) {
      arr[i] = mapFunction(arr[i], i, arr);
    }
    this.notify();
  }
  filter(filterFunction) {
    const arr = this.currentValue;
    let writeIndex = 0;
    for (let i = 0; i < arr.length; i++) {
      if (filterFunction(arr[i], i, arr)) {
        arr[writeIndex++] = arr[i];
      }
    }
    arr.length = writeIndex;
    this.notify();
  }

  getIndex(index) {
    return this.get()[index];
  }
  setIndex(index, value) {
    if (this.currentValue[index] === value) {
      return;
    }
    this.currentValue[index] = value;
    this.notify();
  }
  removeIndex(index) {
    this.currentValue.splice(index, 1);
    this.notify();
  }

  setIndexProperty(index, property, value) {
    if (index === -1) {
      return;
    }
    const arr = this.currentValue;
    if (arr[index][property] === value) {
      return;
    }
    arr[index][property] = value;
    this.notify();
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

  getIds(item) {
    if (!isObject(item)) {
      return [item];
    }
    return unique([item.id, item._id, item.hash, item.key].filter(value => value != null));
  }
  getId(item) {
    if (!isObject(item)) {
      return item;
    }
    return this.id(item);
  }
  hasId(item, id) {
    return this.getId(item) === id;
  }
  getItem(id) {
    const index = this.getItemIndex(id);
    if (index !== -1) {
      return this.getIndex(index);
    }
  }
  getItemIndex(id) {
    const arr = this.currentValue;
    for (let index = 0; index < arr.length; index++) {
      if (this.hasId(arr[index], id)) {
        return index;
      }
    }
    return -1;
  }
  setProperty(property, value) {
    const current = this.currentValue;
    // on an array signal, sets the field on every item
    if (isArray(current)) {
      let changed = false;
      for (let i = 0; i < current.length; i++) {
        if (current[i][property] !== value) {
          current[i][property] = value;
          changed = true;
        }
      }
      if (changed) {
        this.notify();
      }
      return;
    }
    if (current[property] === value) {
      return;
    }
    current[property] = value;
    this.notify();
  }

  setItemProperty(id, property, value) {
    return this.setIndexProperty(this.getItemIndex(id), property, value);
  }

  toggleItemProperty(id, property) {
    const index = this.getItemIndex(id);
    if (index === -1) {
      return;
    }
    const arr = this.currentValue;
    arr[index][property] = !arr[index][property];
    this.notify();
  }

  toggleProperty(property) {
    const current = this.currentValue;
    // on an array signal, flips the field on every item
    if (isArray(current)) {
      if (current.length === 0) {
        return;
      }
      for (let i = 0; i < current.length; i++) {
        current[i][property] = !current[i][property];
      }
      this.notify();
      return;
    }
    current[property] = !current[property];
    this.notify();
  }
  replaceItem(id, item) {
    const index = this.getItemIndex(id);
    if (index === -1) {
      return;
    }
    return this.setIndex(index, item);
  }
  removeItem(id) {
    const index = this.getItemIndex(id);
    if (index === -1) {
      return;
    }
    return this.removeIndex(index);
  }

  /*******************************
           Tracing Utils
  *******************************/

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
