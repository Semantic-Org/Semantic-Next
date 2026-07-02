import { clone, get, isEqual, isObject, keyedPath, returnsFalse, set, unset } from '@semantic-ui/utils';

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

  static resolveRelative(base, suffix) {
    // suffix starts after the connector '.'
    if (suffix.charCodeAt(0) === CHAR_CODES.DOT) {
      return get(base, suffix.slice(1));
    }
    return get(base, suffix);
  }

  constructor(initialValue = {}, {
    safety = ReactiveObject.safety,
    clone = ReactiveObject.clone,
    equality = (safety === 'none') ? returnsFalse : ReactiveObject.equality,
  } = {}) {
    this.cells = new Map();
    this.hasKeyedCells = false;
    this.cloneFunction = clone;
    this.equality = equality;
    this.safety = safety;
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
    // utils set() silently no-ops on a path through an absent keyed element, a
    // guarded segment (__proto__ and friends), or an empty path. detect a write
    // that didn't land by identity, not equality, since equality is returnsFalse
    // under safety 'none'.
    if (!Object.is(get(this.value, path), stored)) {
      return false;
    }
    this.wake(path, previous, stored);
    if (keyed !== path) {
      this.wake(keyed, previous, stored);
    }
    return true;
  }

  remove(path) {
    const previous = get(this.value, path);
    if (previous === undefined) {
      return false;
    }
    const keyed = this.hasKeyedCells ? keyedPath(this.value, path) : path;
    unset(this.value, path);
    this.wake(path, previous, undefined);
    if (keyed !== path) {
      this.wake(keyed, previous, undefined);
    }
    return true;
  }

  replace(nextObject) {
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

  wake(path, previous, next) {
    this.cells.get(path)?.changed();

    // ancestors are guaranteed to have changed
    let cut = path.length;
    while (cut > 0) {
      cut = Math.max(path.lastIndexOf('.', cut - 1), path.lastIndexOf('[', cut - 1));
      if (cut <= 0) {
        break;
      }
      this.cells.get(path.slice(0, cut))?.changed();
    }

    // if old/new value are not containers safe to stop here
    if (!isObject(previous) && !isObject(next)) {
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
      const suffix = cellPath.slice(path.length);
      if (
        !this.equality(ReactiveObject.resolveRelative(previous, suffix), ReactiveObject.resolveRelative(next, suffix))
      ) {
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
