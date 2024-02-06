import { clone, isEqual, isNumber } from '@semantic-ui/utils';
import { Reaction } from './reaction.js';
import { Dependency } from './dependency.js';

export class ReactiveVar {

  constructor(initialValue, equalityFunction) {
    this.currentValue = clone(initialValue);
    this.dependency = new Dependency();
    this.equalityFunction = equalityFunction || ReactiveVar.equalityFunction;
  }

  static equalityFunction = (a, b) => {
    return isEqual(a, b);
  };

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
    const reaction = Reaction.create(() => {
      callback(this._value);
    });
    return () => reaction.stop();
  }

  peek() {
    return this.currentValue;
  }

  addListener(listener) {
    this._listeners.add(listener);
  }

  removeListener(listener) {
    this._listeners.delete(listener);
  }

  // array helpers
  push(value) {
    let arr = this.value;
    arr.push(value);
    console.log('new arr', arr);
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
  setItem(index, value) {
    let arr = this.value;
    arr[index] = value;
    this.set(arr);
  }
  removeIndex(index) {
    let arr = this.value;
    arr.splice(index, 1);
    this.set(arr);
  }
  removeItem(id) {
    let matchIndex;
    let arr = this.value;
    console.log(arr);
    arr.forEach((item, index) => {
      const ids = [item, item?._id, item?.id, item?.hash].filter(Boolean);
      console.log(ids, id);
      if(ids.indexOf(id) > -1) {
        matchIndex = index;
      }
    });
    if(matchIndex >= 0) {
      console.log('match index', matchIndex);
      arr.splice(matchIndex, 1);
      this.set(arr);
    }
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

}
