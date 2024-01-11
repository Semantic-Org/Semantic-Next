class ReactiveVar {
  constructor(initialValue, options = {}) {
    this._value = initialValue;
    this._listeners = new Set();
    this._equalityFunction = options.equalityFunction || ((a, b) => a === b);
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    if (!this._equalityFunction(this._value, newValue)) {
      this._value = newValue;
      this._notifyListeners();
    }
  }

  _notifyListeners() {
    for (const listener of this._listeners) {
      listener(this._value);
    }
  }

  addListener(listener) {
    this._listeners.add(listener);
  }

  removeListener(listener) {
    this._listeners.delete(listener);
  }

  createReaction(callback, options = {}) {
    const computation = () => {
      if (!options.equalityFunction || !options.equalityFunction(this._value, this._lastValue)) {
        this._lastValue = this._value;
        callback(this._value);
      }
    };
    this.addListener(computation);

    if (options.firstRun) {
      computation();
    }

    return () => this.stopReaction(computation);
  }

  stopReaction(computation) {
    this.removeListener(computation);
  }

  avoidReaction(callback) {
    const originalListeners = new Set(this._listeners);
    this._listeners.clear();
    try {
      return callback();
    } finally {
      this._listeners = originalListeners;
    }
  }
}
