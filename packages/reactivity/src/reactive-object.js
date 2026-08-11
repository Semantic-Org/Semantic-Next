import {
  clone,
  eachAncestorPath,
  get,
  has,
  isEqual,
  isObject,
  keyedPath,
  returnsFalse,
  set,
  unset,
} from '@semantic-ui/utils';

import { Dependency } from './dependency.js';
import { IS_REACTIVE_OBJECT } from './helpers/identity.js';

/*
  Fine-grained reactivity over a plain object. Identical to signal but
  only reactive for each path

  Tracked dependencies [cells] are stored in a map by path and are created lazily on read

  Path strings support the syntax of get()/set() which permit '#id' and '[0]' array syntax
  i.e. obj.get('foo.baz[#myid]'); or obj.get('foo.0.baz');

*/

const CHAR_CODES = {
  'BRACKET': '['.charCodeAt(0),
  'DOT': '.'.charCodeAt(0),
};

export class ReactiveObject {
  // stamp so it works anywhere
  get [IS_REACTIVE_OBJECT]() {
    return true;
  }
  static [Symbol.hasInstance](instance) {
    return !!instance?.[IS_REACTIVE_OBJECT];
  }

  // permit user to adjust defaults globally
  static equality = isEqual;
  static clone = (value) => clone(value, { preserveNonCloneable: true });
  static safety = 'reference';

  constructor(initialValue = {}, {
    safety = ReactiveObject.safety,
    clone = ReactiveObject.clone,
    equality = (safety === 'none') ? returnsFalse : ReactiveObject.equality,
    version = 0,
  } = {}) {
    this.cells = new Map();
    this.hasKeyedCells = false;
    this.cloneFunction = clone;
    this.equality = equality;
    this.safety = safety;
    // monotonic change counter, bumps on every wake-causing write
    this.version = version;
    this.value = this.protect(initialValue);
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

  // a 'cell' is just a path that carries a dependency
  cell(path) {
    let dep = this.cells.get(path);
    if (dep === undefined) {
      dep = new Dependency();
      this.cells.set(path, dep);

      // track if cell is keyed to avoid unnecessary work on set
      if (!this.hasKeyedCells && path.includes('[#')) {
        this.hasKeyedCells = true;
      }
    }
    return dep;
  }

  /*******************************
              Reads
  *******************************/

  // tracked
  get(path) {
    this.cell(path).depend();
    return this.protect(get(this.value, path));
  }

  // untracked
  peek(path) {
    if (path === undefined) {
      return this.protect(this.value);
    }
    return this.protect(get(this.value, path));
  }

  hasDependents(path) {
    if (path === undefined) {
      for (const dep of this.cells.values()) {
        if (dep.subscribers.size > 0) {
          return true;
        }
      }
      return false;
    }
    return (this.cells.get(path)?.subscribers.size ?? 0) > 0;
  }

  // tracked subscription without a read
  depend(path) {
    this.cell(path).depend();
  }

  // tracked existence, distinguishes a stored undefined from a missing path
  has(path) {
    this.cell(path).depend();
    return has(this.value, path);
  }

  // live reference, no protect
  raw(path) {
    if (path === undefined) {
      return this.value;
    }
    return get(this.value, path);
  }

  // tracked detached copy at a path, the whole-object form is untracked like peek()
  clone(path) {
    if (path === undefined) {
      return this.cloneFunction(this.value);
    }
    this.cell(path).depend();
    return this.cloneFunction(get(this.value, path));
  }

  /*******************************
              Writes
  *******************************/

  set(path, value) {
    const previous = get(this.value, path);
    if (this.equality(previous, value)) {
      return false;
    }
    const keyed = this.hasKeyedCells ? keyedPath(this.value, path) : path;
    const stored = this.protect(value);
    set(this.value, path, stored);

    // for non-existent deep paths set() can silently no-op
    // if value doesnt exist then nothing happened
    if (!Object.is(get(this.value, path), stored)) {
      return false;
    }

    this.version++;
    this.wake(path, previous, stored);
    if (keyed !== path) {
      this.wake(keyed, previous, stored);
    }
    return true;
  }

  // force-wake a path after an in-place mutation, like Signal.notify. with no
  // before image every descendant under the path wakes too
  notify(path) {
    this.version++;
    const keyed = this.hasKeyedCells ? keyedPath(this.value, path) : path;
    this.wake(path, undefined, undefined, true);
    if (keyed !== path) {
      this.wake(keyed, undefined, undefined, true);
    }
  }

  remove(path) {
    // presence-guarded so a stored undefined is still removable
    if (!has(this.value, path)) {
      return false;
    }
    const previous = get(this.value, path);
    const keyed = this.hasKeyedCells ? keyedPath(this.value, path) : path;
    unset(this.value, path);
    this.version++;
    this.wake(path, previous, undefined);
    if (keyed !== path) {
      this.wake(keyed, previous, undefined);
    }
    return true;
  }

  replace(nextObject) {
    this.version++;
    const previous = this.value;
    const next = this.protect(nextObject);
    this.value = next;
    for (const [path, dep] of this.cells) {
      if (dep.subscribers.size === 0) {
        this.cells.delete(path);
        continue;
      }
      // permit FGR on the diff
      if (!this.equality(get(previous, path), get(next, path))) {
        dep.changed();
      }
    }
  }

  clear() {
    this.replace({});
  }

  wake(path, previous, next, force = false) {
    this.cells.get(path)?.changed();

    // ancestors are guaranteed to have changed
    eachAncestorPath(path, (ancestor) => {
      this.cells.get(ancestor)?.changed();
    });

    // if old/new value are not containers safe to stop here
    if (!force && !isObject(previous) && !isObject(next)) {
      return;
    }

    // special logic for cells to notify children
    for (const [cellPath, dep] of this.cells) {
      if (cellPath.length <= path.length || !cellPath.startsWith(path)) {
        continue;
      }
      const boundary = cellPath.charCodeAt(path.length);

      // if this path has '.' or '[' we arent there yet
      if (boundary !== CHAR_CODES.DOT && boundary !== CHAR_CODES.BRACKET) {
        continue;
      }
      if (dep.subscribers.size === 0) {
        this.cells.delete(cellPath);
        continue;
      }
      // a forced wake has no before image, every descendant fires
      if (force) {
        dep.changed();
        continue;
      }

      // get() cannot parse a leading '.'
      const suffix = cellPath.slice(boundary === CHAR_CODES.DOT ? path.length + 1 : path.length);

      if (!this.equality(get(previous, suffix), get(next, suffix))) {
        dep.changed();
      }
    }
  }

  /*******************************
            Teardown
  *******************************/

  // remove any keys that arent being watched
  prune() {
    for (const [path, dep] of this.cells) {
      if (dep.subscribers.size === 0) {
        this.cells.delete(path);
      }
    }
  }

  // drop every dependency to end wakes
  stop() {
    this.cells.clear();
  }
}
