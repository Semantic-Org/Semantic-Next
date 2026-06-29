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
   * Removes a path so the key leaves the object. It reads back absent, not
   * undefined-valued. A no-op when the path is already absent, which includes a
   * key whose value is explicitly `undefined`.
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
