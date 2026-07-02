import { canonicalPath, clone, get, isEqual, isObject, returnsFalse, set, unset } from '@semantic-ui/utils';

import { Dependency } from './dependency.js';
import { IS_REACTIVE_OBJECT } from './helpers/identity.js';

// utils get() can't resolve a path that begins with a bracket segment, so a
// descendant suffix like `[#id].done` is read by rehoming the subtree under a
// wrapper key and resolving `relativeRoot + suffix` against it.
const relativeRoot = 'root';

const resolveRelative = (base, suffix) => {
  // suffix begins with the boundary that followed the written path. '.' for a
  // nested key, '[' for an index or keyed-element segment
  if (suffix.charCodeAt(0) === 46) { // '.'
    return get(base, suffix.slice(1));
  }
  return get({ [relativeRoot]: base }, relativeRoot + suffix);
};

/*
  Fine-grained reactivity over a plain object, at the granularity of a PATH. A
  reader of one path is woken only when the value at that path changes, where a
  single Signal holding an object would wake every reader on any change.

  Internally a Map of path -> Dependency, one cell minted lazily per read path.
  The match() helper's per-key-dependency pattern generalized to the utils path
  grammar (dotted keys, positional [i] indices, keyed [#id] array segments).

  Reactivity is keyed by the literal path string, so an element must be addressed
  consistently. A reader of `todos[#a].done` is woken by writes to that path, not
  by a positional write to `todos[0].done` that happens to hit the same element.
  Read and write through the same scheme.
*/
export class ReactiveObject {
  get [IS_REACTIVE_OBJECT]() {
    return true;
  }
  static [Symbol.hasInstance](instance) {
    return !!instance?.[IS_REACTIVE_OBJECT];
  }

  // default helpers, overridable on the class or per-instance via options,
  // mirroring Signal so the two primitives configure the same way
  static equality = isEqual;
  static clone = (value) => clone(value, { preserveNonCloneable: true });
  static safety = 'reference';

  constructor(initialValue = {}, {
    safety = ReactiveObject.safety,
    clone = ReactiveObject.clone,
    equality = (safety === 'none') ? returnsFalse : ReactiveObject.equality,
  } = {}) {
    this.cells = new Map();
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

  cell(path) {
    let dep = this.cells.get(path);
    if (dep === undefined) {
      dep = new Dependency();
      this.cells.set(path, dep);
    }
    return dep;
  }

  /*******************************
              Reads
  *******************************/

  // tracked read: subscribes the current reaction to this path alone
  get(path) {
    this.cell(path).depend();
    return this.protect(get(this.value, path));
  }

  // untracked read. with a path the value there, without one the whole object
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

  // single-path write, equality-gated. stores a protected copy under clone
  // safety, then confirms the write actually landed before waking. wakes readers
  // of this path, of its ancestors, and of any descendant whose resolved value
  // changed. returns whether anything changed.
  set(path, value) {
    const previous = get(this.value, path);
    if (this.equality(previous, value)) {
      return false;
    }
    // a positional spelling of an identity-bearing element (todos.0.done) never string-matches the
    // keyed cells readers hold (todos[#a].done), so the keyed twin is resolved before the write
    // moves anything and woken alongside the literal path
    const canonical = canonicalPath(this.value, path);
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
    if (canonical !== path) {
      this.wake(canonical, previous, stored);
    }
    return true;
  }

  // remove a path so the key LEAVES the object. it reads back absent, not
  // undefined-valued. a no-op when the path is already absent, which includes a
  // key whose value is explicitly undefined (it reads as absent, so it stays).
  remove(path) {
    const previous = get(this.value, path);
    if (previous === undefined) {
      return false;
    }
    const canonical = canonicalPath(this.value, path);
    unset(this.value, path);
    this.wake(path, previous, undefined);
    if (canonical !== path) {
      this.wake(canonical, previous, undefined);
    }
    return true;
  }

  // bulk inbound swap: replace the whole backing object and reseed every live
  // reader against the new object, waking only paths whose value changed. a
  // reader of a deep path under a wholesale-replaced subtree re-resolves
  // correctly because each cell is re-read by its full path, where a shallow
  // old-vs-new diff emitting only the top changed key would miss it. dead cells
  // are evicted in the same pass.
  replace(nextObject) {
    const previous = this.value;
    const next = this.protect(nextObject);
    this.value = next;
    for (const [path, dep] of this.cells) {
      if (dep.subscribers.size === 0) {
        this.cells.delete(path);
        continue;
      }
      if (!this.equality(get(previous, path), get(next, path))) {
        dep.changed();
      }
    }
  }

  clear() {
    this.replace({});
  }

  // wake readers affected by a write or removal at `path`. `previous` is the
  // value that was there before, `next` the value there now.
  wake(path, previous, next) {
    this.cells.get(path)?.changed();

    // ancestors: past the equality gate the value at `path` genuinely changed,
    // so every container holding it changed too. they can't be equality-gated,
    // because set() mutated them in place and old and new are the same
    // reference, so wake unconditionally. walk up the segment boundaries.
    let cut = path.length;
    while (cut > 0) {
      cut = Math.max(path.lastIndexOf('.', cut - 1), path.lastIndexOf('[', cut - 1));
      if (cut <= 0) {
        break;
      }
      this.cells.get(path.slice(0, cut))?.changed();
    }

    // descendants: only a subtree write or removal can move them, so when
    // neither the old nor the new value is a container there are none and leaf
    // writes stay O(depth). each candidate is equality-gated on its resolved
    // value.
    if (!isObject(previous) && !isObject(next)) {
      return;
    }
    for (const [cellPath, dep] of this.cells) {
      if (cellPath.length <= path.length || !cellPath.startsWith(path)) {
        continue;
      }
      const boundary = cellPath.charCodeAt(path.length);
      if (boundary !== 46 && boundary !== 91) { // '.' or '['
        continue;
      }
      if (dep.subscribers.size === 0) {
        this.cells.delete(cellPath);
        continue;
      }
      const suffix = cellPath.slice(path.length);
      if (!this.equality(resolveRelative(previous, suffix), resolveRelative(next, suffix))) {
        dep.changed();
      }
    }
  }

  /*******************************
            Teardown
  *******************************/

  // sweep cells nobody subscribes to. replace() and subtree writes sweep as
  // they go, this is the explicit hook for a long-lived instance driven only by
  // set/remove that wants to reclaim cells for vanished paths.
  prune() {
    for (const [path, dep] of this.cells) {
      if (dep.subscribers.size === 0) {
        this.cells.delete(path);
      }
    }
  }

  // drop every cell. live subscribers stop receiving wakes (their Dependency is
  // no longer reachable from this object), and future reads mint fresh cells.
  stop() {
    this.cells.clear();
  }
}
