import {
  clone,
  isArray,
  isDevelopment,
  isEqual,
  isNumber,
  isObject,
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
    this.clone = clone;
    this.equality = equality;
    this.id = id;

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
      if (!this.equality(beforeClone, this.currentValue)) {
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
    const arr = this.currentValue;
    let changed = false;
    if (index === 'all') {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][property] !== value) {
          arr[i][property] = value;
          changed = true;
        }
      }
    }
    else {
      if (arr[index][property] !== value) {
        arr[index][property] = value;
        changed = true;
      }
    }
    if (changed) {
      this.notify();
    }
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
  setProperty(idOrProperty, property, value) {
    if (isArray(this.currentValue)) {
      // a 2-arg call sets the field on every item
      if (arguments.length < 3) {
        return this.setArrayProperty(idOrProperty, property);
      }
      const id = idOrProperty;
      const index = this.getItemIndex(id);
      return this.setArrayProperty(index, property, value);
    }
    else {
      value = property;
      property = idOrProperty;
      if (this.currentValue[property] === value) {
        return;
      }
      this.currentValue[property] = value;
      this.notify();
    }
  }

  setItemProperty(id, property, value) {
    return this.setArrayProperty(this.getItemIndex(id), property, value);
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
