/**
 * Configuration options for creating a new ReactiveObject instance.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#options ReactiveObject Options}
 */
export interface ReactiveObjectOptions {
  /**
   * Value-protection preset controlling how the backing object is guarded against
   * outside mutation. `'reference'` (default) reads and stores by reference.
   * `'clone'` returns defensive copies on read and clones inbound objects on
   * `set` and `replace`. `'none'` treats every `set()` as a change (event-stream
   * semantics).
   * @default 'reference'
   */
  safety?: 'clone' | 'reference' | 'none';

  /**
   * Determines whether a candidate value differs from the value currently at a
   * path. A write notifies a path's readers only when this returns `false`.
   * @param oldValue - The current value at the path
   * @param newValue - The candidate value
   */
  equality?: (oldValue: any, newValue: any) => boolean;

  /**
   * Produces a copy of a value, used to insulate reads and inbound objects when
   * `safety` is `'clone'`.
   * @param value - The value to copy
   */
  clone?: <V>(value: V) => V;

  /**
   * Seeds the monotonic change counter, so it can start aligned with an
   * external store's revision.
   * @default 0
   */
  version?: number;
}

/**
 * Fine-grained reactivity over a plain object, at the granularity of a PATH. A
 * reader of one path is woken only when the value at that path changes, where a
 * single Signal holding an object would wake every reader on any change.
 *
 * Addressed by the `@semantic-ui/utils` path grammar: dotted keys, positional
 * `[i]` indices, and keyed `[#id]` array segments. Reactivity is keyed by the
 * literal path string, so an element must be addressed consistently: a reader of
 * `todos[#a].done` is not woken by a positional write to `todos[0].done` that
 * hits the same element.
 *
 * Create one with the `reactiveObject()` factory or `new ReactiveObject()`.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object ReactiveObject Documentation}
 */
export class ReactiveObject {
  /**
   * Default equality (deep) used by instances that don't supply their own. Set
   * this to change the default for instances created afterward.
   */
  static equality: (oldValue: any, newValue: any) => boolean;

  /**
   * Default clone used by instances that don't supply their own.
   */
  static clone: <V>(value: V) => V;

  /**
   * Default safety preset for new instances.
   * @default 'reference'
   */
  static safety: 'clone' | 'reference' | 'none';

  /**
   * Creates a new ReactiveObject backing a plain object.
   * @param initialValue - The initial backing object (defaults to `{}`)
   * @param options - Configuration for protection and equality
   */
  constructor(initialValue?: object, options?: ReactiveObjectOptions);

  /**
   * Tracked read. Subscribes the current reaction to this path alone, so a later
   * write to a disjoint path will not re-fire it.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#get get}
   * @param path - The path to read
   */
  get(path: string): any;

  /**
   * Untracked read. With a path the value there, without one the whole backing
   * object. Subscribes to nothing.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#peek peek}
   * @param path - Optional path to read
   */
  peek(path?: string): any;

  /**
   * Whether any live reaction subscribes to a path, or to the whole object when
   * no path is given.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#hasdependents hasDependents}
   * @param path - Optional path to check
   */
  hasDependents(path?: string): boolean;

  /**
   * Subscribes the current reaction to a path without reading its value, the
   * path-scoped twin of `Signal.depend()`. Use it when a reaction should re-run
   * on a change but reads the value from elsewhere.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#depend depend}
   * @param path - The path to subscribe to
   */
  depend(path: string): void;

  /**
   * Tracked existence check. Distinguishes a stored `undefined` from a missing
   * path, and wakes through the same cell as `get()` when the key is removed or
   * re-added.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#has has}
   * @param path - The path to test
   * @returns Whether the path is present
   */
  has(path: string): boolean;

  /**
   * Returns the live stored reference with no dependency and no clone
   * protection, even under `safety: 'clone'` where `peek()` still copies. With
   * no path, the whole backing object. Mutating the result bypasses change
   * detection.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#raw raw}
   * @param path - Optional path to read
   * @returns The live stored value
   */
  raw(path?: string): any;

  /**
   * Tracked, detached deep copy at a path: mutating the copy never touches the
   * stored value, and the reader still re-runs on a later write. Always copies,
   * even under `safety: 'reference'`. With no path, clones the whole object
   * untracked, mirroring `peek()`'s no-path form.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#clone clone}
   * @param path - Optional path to copy
   * @returns A detached copy of the value
   */
  clone(path?: string): any;

  /**
   * Monotonic change counter, the `Signal.version` twin. Bumps on every
   * wake-causing write: a changed `set()`, a successful `remove()`, and every
   * `replace()`, `clear()`, and `notify()`. An equality-gated no-op `set()`
   * leaves it unchanged. Reading it registers no dependency. Seed it with the
   * `version` option, or assign it to realign with an external store's revision.
   */
  version: number;

  /**
   * Single-path write, equality-gated. Wakes readers of this path, of its
   * ancestors, and of any descendant whose resolved value changed. A same-value
   * write, or one the backing object drops (a field under an absent keyed
   * element), wakes nobody and returns `false`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#set set}
   * @param path - The path to write
   * @param value - The value to set
   * @returns Whether the write changed anything
   */
  set(path: string, value: any): boolean;

  /**
   * Force-wakes a path after an in-place mutation, the `Signal.notify()` twin.
   * Wakes the exact path, its ancestors, and every descendant under it (with no
   * before image to diff, the whole subtree fires). Bumps `version`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#notify notify}
   * @param path - The path whose subtree changed in place
   */
  notify(path: string): void;

  /**
   * Removes a path so the key leaves the object. It reads back absent, not
   * undefined-valued. The guard keys on presence, so a key holding a stored
   * `undefined` is removable, and only an already-absent path is a no-op.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#remove remove}
   * @param path - The path to remove
   * @returns Whether the removal changed anything
   */
  remove(path: string): boolean;

  /**
   * Bulk inbound swap: replaces the whole backing object and reseeds every live
   * reader against the new object, waking only paths whose value changed,
   * including deep readers under a wholesale-replaced subtree. Dead cells are
   * evicted in the pass.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#replace replace}
   * @param nextObject - The replacement backing object
   */
  replace(nextObject: object): void;

  /**
   * Replaces the backing object with an empty one.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#clear clear}
   */
  clear(): void;

  /**
   * Sweeps cells nobody subscribes to. `replace` and subtree writes sweep as they
   * go. This is the explicit hook for an instance driven only by `set`/`remove`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#prune prune}
   */
  prune(): void;

  /**
   * Drops every cell. Live subscribers stop receiving wakes, future reads mint
   * fresh cells.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reactive-object#stop stop}
   */
  stop(): void;
}
