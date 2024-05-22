import { clone, isObject, isEqual, wrapFunction, isClassInstance, isArray, findIndex, unique, isNumber } from '@semantic-ui/utils';
import { Reaction } from './reaction.js';
import { Dependency } from './dependency.js';

export class ReactiveVar {

  constructor(initialValue, { equalityFunction, allowClone = true, cloneFunction } = {}) {
    this.dependency = new Dependency();

    // allow user to opt out of value cloning
    this.allowClone = allowClone;

    // allow custom equality function
    this.equalityFunction = (equalityFunction)
      ? wrapFunction(equalityFunction)
      : ReactiveVar.equalityFunction
    ;

    // allow custom clone function
    this.clone = (cloneFunction)
      ? wrapFunction(cloneFunction)
      : ReactiveVar.cloneFunction
    ;
    this.currentValue = this.maybeClone(initialValue);
  }

  static equalityFunction = isEqual;
  static cloneFunction = clone;

  get value() {
    // Record this ReactiveVar as a dependency if inside a Reaction computation
    this.dependency.depend();
    const value = this.currentValue;

    // otherwise previous value would be modified if the returned value is mutated negating the equality
    return (Array.isArray(value) || typeof value == 'object')
      ? this.maybeClone(value)
      : value
    ;
  }

  canCloneValue(value) {
    return (this.allowClone === true && !isClassInstance(value));
  }

  maybeClone(value) {
    if (!this.canCloneValue(value)) {
      return value;
    }
    if(isArray(value)) {
      return value = value.map(value => this.maybeClone(value));
    }
    return this.clone(value);
  }

  set value(newValue) {
    if (!this.equalityFunction(this.currentValue, newValue)) {
      this.currentValue = this.maybeClone(newValue);
      this.dependency.changed({ value: newValue, trace: new Error().stack}); // Pass context
    }
  }

  get() {
    return this.value;
  }

  set(newValue) {
    if (!this.equalityFunction(this.currentValue, newValue)) {
      this.value = newValue;
      this.dependency.changed({ value: newValue, trace: new Error().stack}); // Pass context
    }
  }

  subscribe(callback) {
    return Reaction.create((comp) => {
      callback(this.value, comp);
    });
  }

  peek() {
    return this.maybeClone(this.currentValue);
  }

  clear() {
    return this.set(undefined);
  }

  // array helpers
  push(value) {
    const arr = this.value;
    arr.push(value);
    this.set(arr);
  }
  unshift(value) {
    const arr = this.value;
    arr.unshift(value);
    this.set(arr);
  }
  splice(...args) {
    const arr = this.value;
    arr.splice(...args);
    this.set(arr);
  }
  map(mapFunction) {
    const newValue = Array.prototype.map.call(this.currentValue, mapFunction);
    this.set(newValue);
  }
  filter(filterFunction) {
    const newValue = Array.prototype.filter.call(this.currentValue, filterFunction);
    this.set(newValue);
  }

  getIndex(index) {
    return this.get()[index];
  }
  setIndex(index, value) {
    let arr = this.value;
    arr[index] = value;
    this.set(arr);
  }
  removeIndex(index) {
    let arr = this.value;
    arr.splice(index, 1);
    this.set(arr);
  }

  // sets
  setArrayProperty(indexOrProperty, property, value) {
    let index;
    if(isNumber(indexOrProperty)) {
      index = indexOrProperty;
    }
    else {
      index = 'all';
      value = property;
      property = indexOrProperty;
    }
    const newValue = this.currentValue.map((object, currentIndex) => {
      if(index == 'all' || currentIndex == index) {
        object[property] = value;
      }
      return object;
    });
    this.set(newValue);
  }

  toggle() {
    return this.set(!this.value);
  }

  increment(amount = 1) {
    return this.set(this.value + amount);
  }
  decrement(amount = 1) {
    return this.set(this.value - amount);
  }

  now() {
    return this.set(new Date());
  }

  getIDs(item) {
    if(isObject(item)) {
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
  getIndexByID(id) {
    return findIndex(this.currentValue, item => this.hasID(item, id));
  }
  setProperty(idOrProperty, property, value) {
    if(arguments.length == 3) {
      const id = idOrProperty;
      const index = this.getIndexByID(id);
      return this.setArrayProperty(index, property, value);
    }
    else {
      value = property;
      property = idOrProperty;
      const obj = this.currentValue;
      obj[property] = value;
      this.set(obj);
    }
  }
  replaceItem(id, item) {
    return this.setIndex(this.getIndexByID(id), item);
  }
  removeItem(id) {
    return this.removeIndex(this.getIndexByID(id));
  }

}
