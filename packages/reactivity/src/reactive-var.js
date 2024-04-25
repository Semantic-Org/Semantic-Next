import { clone, isObject, isEqual, wrapFunction, findIndex, unique, isNumber } from '@semantic-ui/utils';
import { Reaction } from './reaction.js';
import { Dependency } from './dependency.js';

export class ReactiveVar {

  constructor(initialValue, equalityFunction) {
    this.currentValue = clone(initialValue);
    this.dependency = new Dependency();
    this.equalityFunction = equalityFunction
      ? wrapFunction(equalityFunction)
      : ReactiveVar.equalityFunction;
  }

  static equalityFunction = isEqual;

  get value() {
    // Record this ReactiveVar as a dependency if inside a Reaction computation
    this.dependency.depend();
    const value = this.currentValue;

    // otherwise previous value would be modified if the returned value is mutated negating the equality
    return (Array.isArray(value) || typeof value == 'object')
      ? clone(value)
      : value
    ;
  }

  set value(newValue) {
    if (!this.equalityFunction(this.currentValue, newValue)) {
      this.currentValue = clone(newValue);
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
    return this.currentValue;
  }

  // array helpers
  push(value) {
    let arr = this.value;
    arr.push(value);
    this.set(arr);
  }
  unshift(value) {
    let arr = this.value;
    arr.unshift(value);
    this.set(arr);
  }
  splice(...args) {
    let arr = this.value;
    arr.splice(...args);
    this.set(arr);
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
    const newValue = clone(this.currentValue).map((object, currentIndex) => {
      if(index == 'all' || currentIndex == index) {
        object[property] = value;
      }
      return object;
    });
    this.set(newValue);
  }

  changeItems(mapFunction) {
    const newValue = clone(this.currentValue).map(mapFunction);
    this.set(newValue);
  }
  removeItems(filterFunction) {
    const newValue = clone(this.currentValue).filter((value) => !filterFunction(value));
    this.set(newValue);
  }

  toggle() {
    return this.set(!this.value);
  }

  increment(amount = 1) {
    this.set(this.value + amount);
  }
  decrement(amount = 1) {
    this.set(this.value - amount);
  }

  now() {
    this.set(new Date());
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
  getIndex(id) {
    return findIndex(this.currentValue, item => this.hasID(item, id));
  }
  setProperty(id, property, value) {
    const index = this.getIndex(id);
    return this.setArrayProperty(index, property, value);
  }
  replaceItem(id, item) {
    return this.setIndex(this.getIndex(id), item);
  }
  removeItem(id) {
    return this.removeIndex(this.getIndex(id));
  }

}
