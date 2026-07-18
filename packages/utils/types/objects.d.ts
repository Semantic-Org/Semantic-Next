/**
 * Object manipulation and traversal utilities
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects Object Utilities Documentation}
 */

/**
 * Utility type that converts a union type to an intersection type
 * Used by the extend function to properly type the result
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

/**
 * Returns the keys of an object
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#keys keys}
 *
 * @param obj - The object to get keys from
 * @returns Array of object keys
 *
 * @example
 * ```ts
 * keys({ a: 1, b: 2 }) // returns ['a', 'b']
 * ```
 */
export function keys<T extends object>(obj: T): Array<keyof T>;

/**
 * Returns the values of an object
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#values values}
 *
 * @param obj - The object to get values from
 * @returns Array of object values
 *
 * @example
 * ```ts
 * values({ a: 1, b: 2 }) // returns [1, 2]
 * ```
 */
export function values<T extends object>(obj: T): Array<T[keyof T]>;

/**
 * Creates a new object with transformed values
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#mapobject mapObject}
 *
 * @param obj - The source object
 * @param callback - Function to transform values
 * @returns New object with transformed values
 *
 * @example
 * ```ts
 * mapObject({ a: 1, b: 2 }, x => x * 2) // returns { a: 2, b: 4 }
 * ```
 */
export function mapObject<T extends object, U>(
  obj: T,
  callback: (value: T[keyof T], key: keyof T) => U,
): { [K in keyof T]: U; };

/**
 * Creates a new object with filtered key-value pairs
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#filterobject filterObject}
 *
 * @param obj - The source object
 * @param callback - Function to test each key-value pair
 * @returns New object with filtered pairs
 *
 * @example
 * ```ts
 * filterObject({ a: 1, b: 2, c: 3 }, v => v > 1) // returns { b: 2, c: 3 }
 * ```
 */
export function filterObject<T extends object>(
  obj: T,
  callback: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T>;

/**
 * Options for trackWrites
 */
export interface TrackWritesOptions {
  /**
   * How changes are detected (default 'auto').
   * 'snapshot' clones the value up front and diffs after — the callback
   * sees the real object, cost scales with value size.
   * 'proxy' hands the callback a tracked wrapper and records writes — cost
   * scales with writes, the console shows Proxy(Object) inside the callback.
   * 'auto' snapshots small values and proxies large ones, but yields to
   * snapshot even on a large value when keyed paths are requested (the default),
   * since those come from the snapshot diff.
   */
  strategy?: 'auto' | 'snapshot' | 'proxy';
  /**
   * Return the changed fields as dot paths (default true). Pass false to skip
   * path collection on hot paths where only `changed` is read.
   */
  returnPaths?: boolean;
  /**
   * Id-address paths for keyed arrays (default true), so `todos[#id].complete`
   * instead of `todos.0.complete` — the same convention as detectChanges, and
   * paths that survive a reorder. Keyed paths are produced by the snapshot diff,
   * so requesting them (the default, with `returnPaths` true) forces the
   * snapshot strategy even on a large value. The proxy strategy (explicit, or
   * implied by `onWrite`) only ever sees the index a write went through, so its
   * paths stay positional regardless. Set false to keep the proxy's no-clone
   * behaviour on a large value where it matters more than id-addressing.
   */
  keyed?: boolean;
  /** Identity fields for keyed paths, first present wins (default ['id', '_id', 'hash', 'key']) */
  keys?: string[];
  /** Fires per observed write with the key path from the root. Implies the proxy strategy under 'auto', so its paths are positional. */
  onWrite?: (path: string[], target: object, key: string) => void;
  /** Clone used for snapshots (defaults to clone) */
  clone?: (value: unknown) => unknown;
  /** Equality deciding what counts as a change across the snapshot path diff, the no-paths fast path, and exotic snapshots (defaults to isEqual). The same option detectChanges takes */
  equality?: (a: unknown, b: unknown) => boolean;
}

/**
 * Result of trackWrites
 */
export interface TrackWritesResult<R> {
  /** Whether the callback changed the value */
  changed: boolean;
  /** The callback's return value, with any tracked wrappers swapped for raw objects */
  result: R;
  /**
   * A covering set of changed fields as dot paths, resolvable via get().
   * The proxy strategy reports the paths written (pruned so a written parent
   * subsumes its children, always positional), the snapshot strategy reports
   * net leaf differences (id-addressed `field[#id]` for keyed arrays by default).
   * A wholesale change to a non-container value reports path ''.
   */
  paths?: string[];
}

/**
 * Runs a callback against a value and reports whether the callback changed it,
 * with the changed fields as dot paths.
 * Paths are id-addressed for keyed arrays by default (`todos[#id].complete`),
 * the same convention as detectChanges, so editing a field on every record of a
 * collection reads back as per-record writes rather than array indices. Keyed
 * paths come from the snapshot diff, so requesting them forces the snapshot
 * strategy even on a large value; an explicit `strategy: 'proxy'` (or `onWrite`)
 * keeps the no-clone proxy whose paths are positional by construction. Opt out
 * with `keyed: false`. Under the proxy strategy the tracked wrapper is only
 * valid inside the callback — using one after it returns throws. Writes that
 * never go through the callback's value (a closure reference) are only seen by
 * the snapshot strategy.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#trackwrites trackWrites}
 * @see {@link https://next.semantic-ui.com/examples/utils-trackwrites Example}
 *
 * @param value - The value the callback may change
 * @param callback - Receives the value (or its tracked wrapper) and may mutate it in place or return a replacement
 * @param options - Strategy, path reporting, keyed addressing, and snapshot configuration
 * @returns Whether the value changed, the changed paths, and the callback's return value
 *
 * @example
 * ```ts
 * const doc = { meta: { count: 0 } };
 * const { changed, paths } = trackWrites(doc, (value) => {
 *   value.meta.count++;
 * });
 * // changed === true, paths === ['meta.count']
 * paths.forEach((path) => sync(path, get(doc, path)));
 *
 * // keyed paths by default — a field edit across a collection reads back
 * // per record, not by index
 * const db = { todos: [{ id: 'a', complete: false }, { id: 'b', complete: false }] };
 * const { paths: keyedPaths } = trackWrites(db, (d) => {
 *   for (const todo of d.todos) todo.complete = true;
 * });
 * // keyedPaths === ['todos[#a].complete', 'todos[#b].complete']
 * ```
 */
export function trackWrites<T, R = unknown>(
  value: T,
  callback: (value: T) => R,
  options: TrackWritesOptions & { returnPaths: false; },
): { changed: boolean; result: R; };
export function trackWrites<T, R = unknown>(
  value: T,
  callback: (value: T) => R,
  options?: TrackWritesOptions,
): { changed: boolean; result: R; paths: string[]; };

/** The kind of read an onRead event reports */
export type ReadType = 'value' | 'has' | 'structure';

/**
 * Options for trackReads
 */
export interface TrackReadsOptions {
  /**
   * Return the read paths (default true). Pass false to skip collection and
   * rely on `onRead` for streaming consumers.
   */
  returnPaths?: boolean;
  /**
   * Id-address paths for keyed arrays (default true), so `todos[#id].complete`
   * instead of `todos.0.complete` — the same convention as trackWrites and
   * detectChanges, so a read dependency matches a write to the same record and
   * survives a reorder. Unlike trackWrites (whose proxy is positional and gets
   * keyed paths from its snapshot diff), trackReads resolves identity in the
   * proxy itself. Set false for positional paths.
   */
  keyed?: boolean;
  /** Identity fields for keyed paths, first present wins (default ['id', '_id', 'hash', 'key']) */
  keys?: string[];
  /**
   * Fires per observed read with the path from the root, the read type
   * (`'value'`, `'has'`, or `'structure'`), the raw target, and the key. The
   * unpruned live stream, for dependency collectors and access auditors.
   */
  onRead?: (path: string, type: ReadType, target: object, key: PropertyKey | undefined) => void;
}

/**
 * Result of trackReads
 */
export interface TrackReadsResult<R> {
  /**
   * Value paths the callback read (`todos[#id].complete`), resolvable through
   * get(). Pruned so a deeper read subsumes its ancestors. Re-run a dependent
   * computation when one of these values changes (pairs with detectChanges
   * `changed`).
   */
  reads: string[];
  /**
   * Container paths whose shape the callback read — an array's `.length`,
   * iteration, spread, or Object.keys. Re-run when the container grows, shrinks,
   * or re-keys (pairs with detectChanges `added`/`removed`). Separate from
   * `reads` because reading a length leaves no value path behind, so a
   * value-only dependency set silently misses array growth.
   */
  structure: string[];
  /** The callback's return value, with any tracked wrappers swapped for raw objects */
  result: R;
}

/**
 * Runs a callback against a value and reports which paths it READ — the read
 * companion to trackWrites. Where trackWrites answers "what did this change",
 * trackReads answers "what did this depend on": a reactive system collects a
 * computed's dependencies as it runs, a memoizer derives a cache key from the
 * values it touched, an auditor checks least-privilege access, a prefetcher
 * learns what to warm.
 *
 * Reads are observable only through a proxy, so unlike trackWrites there is no
 * snapshot strategy. The value is wrapped read-only: the callback may read any
 * depth, but a write through the wrapper throws, so the input is never mutated.
 * Reads are only valid inside the callback — a wrapper used after it returns
 * throws.
 *
 * Two dependency kinds come back, kept apart because they invalidate on
 * different writes: `reads` (value paths, pair with detectChanges `changed`) and
 * `structure` (container shape paths, pair with detectChanges `added`/`removed`).
 * Surfacing structure separately is the array-growth case: reading `.length`
 * leaves no value path, so a value-only set would miss a push. Reading a method
 * is not a dependency (the reads it then performs are); an exotic
 * (Date/Map/Set/RegExp) is a single read with no recursion. Keyed arrays
 * id-address by default.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#trackreads trackReads}
 * @see {@link https://next.semantic-ui.com/examples/utils-trackreads Example}
 *
 * @param value - The value the callback reads from
 * @param callback - Receives the value (or its read-only tracked wrapper) and returns anything
 * @param options - Path reporting, keyed addressing, and the onRead stream
 * @returns The value paths read, the container shapes read, and the callback's return value
 *
 * @example
 * ```ts
 * const state = { todos: [{ id: 'a', done: false }, { id: 'b', done: true }] };
 * const { reads, structure } = trackReads(state, (value) =>
 *   value.todos.map((todo) => todo.done));
 * // reads === ['todos[#a].done', 'todos[#b].done'] — re-run when a value changes
 * // structure === ['todos'] — re-run when the list grows or shrinks
 *
 * // existence and value reads both resolve through get()
 * reads.map((path) => get(state, path)); // [false, true]
 * ```
 */
export function trackReads<T, R = unknown>(
  value: T,
  callback: (value: T) => R,
  options: TrackReadsOptions & { returnPaths: false; },
): { result: R; };
export function trackReads<T, R = unknown>(
  value: T,
  callback: (value: T) => R,
  options?: TrackReadsOptions,
): TrackReadsResult<R>;

/** The identity vocabulary every keyed default resolves from. */
export interface ElementKeyConfig {
  /** Candidate identity fields, first present wins. Default `['id', '_id', 'hash', 'key']`. */
  keys: string[];
}

/**
 * Identity of an array element: the value of the first present field in `keys`,
 * or undefined for a scalar or an object carrying none of them. What the keyed
 * `detectChanges` mode and the keyed `get`/`set`/`unset` path grammar match on. The field vocabulary is the one
 * identity config for the whole keyed grammar, set once at app boot
 * (`elementKey.config.keys.unshift('sku')`) — every `keys` default reads it
 * live, per-call `keys` still wins.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#elementkey elementKey}
 * @see {@link https://next.semantic-ui.com/examples/utils-elementkey Example}
 *
 * @param item - The array element to read identity from
 * @param keys - Candidate identity fields, first present wins (default `elementKey.config.keys`)
 * @returns The identity value, or undefined when none of the fields are present
 *
 * @example
 * ```ts
 * elementKey({ id: 'a', _id: 'x' }) // returns 'a'
 * elementKey({ name: 'n' }) // returns undefined
 * elementKey({ sku: 's1' }, ['sku']) // returns 's1'
 * ```
 */
export function elementKey(item: unknown, keys?: string[]): unknown;
export namespace elementKey {
  let config: ElementKeyConfig;
}

/**
 * Changes reported by detectChanges, grouped by operation
 */
export interface DetectedChanges {
  /** Dot paths present in after but not before */
  added: string[];
  /** Dot paths present in before but not after */
  removed: string[];
  /** Dot paths present in both with different values */
  changed: string[];
}

/**
 * Options for detectChanges
 */
export interface DetectChangesOptions {
  /**
   * Diff cleanly-keyed arrays by element identity instead of by index (default
   * true). A keyed array emits `field[#identity]` paths — `field[#z]` for a
   * whole-element add/remove/replace, `field[#b].qty` for a field change — so a
   * prepend or reorder is one add by key, not a positional cascade of rewrites.
   * Any array that isn't cleanly keyed (an unkeyed element, a duplicate key, or
   * a key value carrying `.` `[` `]` or a leading `#`) falls back to the
   * positional walk, so an emitted keyed path always parses back through
   * get/set/unset. Pass `false` for the legacy positional output.
   */
  keyed?: boolean;
  /** Identity fields a keyed element is matched on, first present wins (default ['id', '_id', 'hash', 'key']) */
  keys?: string[];
  /**
   * Comparator that decides whether two leaf values count as changed (default
   * the package `isEqual`). The same option `trackWrites` takes — pass a looser
   * rule (`==`, an epsilon for floats) to diff loosely-typed data.
   */
  equality?: (a: unknown, b: unknown) => boolean;
  /**
   * Key names dropped from the result at any depth, so a volatile or local-only
   * field (`updatedAt`, a client annotation) never reaches the changeset.
   */
  ignoreKeys?: string[];
  /**
   * Key names diffed as one whole value, never descended into, at any depth. The
   * key reports as a single path when it changes — the same leaf treatment a
   * Map/Date already gets, for a subtree whose own keys aren't path-addressable
   * (a map keyed by dynamic `contacts[#id].field` strings).
   */
  collapseKeys?: string[];
}

/**
 * Structural diff between two values, reported as dot paths from before to
 * after. Objects recurse to leaf paths, values that can't be walked
 * (Map/Set/Date/class instances) compare by deep equality and report their own
 * path. Differing non-container roots report path ''.
 *
 * Arrays of uniquely-keyed objects diff by element identity by default,
 * emitting `field[#identity]` paths that survive a reorder. Pass
 * `{ keyed: false }` for the legacy positional walk, where arrays diff by index
 * and a shifted array reports every moved position.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#detectchanges detectChanges}
 * @see {@link https://next.semantic-ui.com/examples/utils-detectchanges Example}
 *
 * @param before - The value to diff from
 * @param after - The value to diff to
 * @param options - Keyed mode, identity fields, custom equality, and key filtering
 * @returns Added, removed, and changed paths
 *
 * @example
 * ```ts
 * detectChanges(
 *   { name: 'a', temp: true },
 *   { name: 'b', nickname: 'al' },
 * )
 * // { added: ['nickname'], removed: ['temp'], changed: ['name'] }
 *
 * // arrays of keyed objects diff by identity by default — a prepend is one add
 * detectChanges(
 *   { items: [{ id: 'a', qty: 1 }, { id: 'b', qty: 1 }] },
 *   { items: [{ id: 'z', qty: 9 }, { id: 'a', qty: 1 }, { id: 'b', qty: 5 }] },
 * )
 * // { added: ['items[#z]'], removed: [], changed: ['items[#b].qty'] }
 *
 * // ignoreKeys drops a field at any depth; collapseKeys reports a subtree whole
 * detectChanges(
 *   { name: 'a', _overrides: { 'contacts[#1].field': true }, updatedAt: 1 },
 *   { name: 'b', _overrides: { 'contacts[#1].field': false }, updatedAt: 2 },
 *   { ignoreKeys: ['updatedAt'], collapseKeys: ['_overrides'] },
 * )
 * // { added: [], removed: [], changed: ['name', '_overrides'] }
 * ```
 */
export function detectChanges(
  before: unknown,
  after: unknown,
  options?: DetectChangesOptions,
): DetectedChanges;

/**
 * Extends an object with properties from additional sources
 * Properly handles getters and setters
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#extend extend}
 *
 * @param obj - The target object
 * @param sources - Source objects to copy from
 * @returns The modified target object
 *
 * @example
 * ```ts
 * extend({ a: 1 }, { b: 2 }, { c: 3 }) // returns { a: 1, b: 2, c: 3 }
 * ```
 */
export function extend<T extends object, S extends object[]>(
  obj: T,
  ...sources: S
): T & UnionToIntersection<S[number]>;

/**
 * Options for deep extend operations
 */
export interface DeepExtendOptions {
  /** Preserve custom class instances instead of flattening them to plain objects */
  preserveNonCloneable?: boolean;
}

/**
 * Deep extends an object with properties from additional sources
 * Recursively merges nested plain objects and clones non-plain objects
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#deepextend deepExtend}
 * @see {@link https://next.semantic-ui.com/examples/utils-deepextend Example}
 *
 * @param obj - The target object to extend
 * @param sources - Source objects to deep merge from
 * @param options - Options controlling cloning behavior
 * @returns The modified target object
 *
 * @example
 * ```ts
 * deepExtend({ a: { x: 1 } }, { a: { y: 2 } }) // returns { a: { x: 1, y: 2 } }
 * deepExtend({}, { date: new Date() }) // clones the date object
 * deepExtend({}, { custom: new MyClass() }, { preserveNonCloneable: true }) // preserves instance
 * ```
 */
export function deepExtend<T extends object, S extends object[]>(
  obj: T,
  ...args: [...sources: S, options?: DeepExtendOptions] | S
): T & UnionToIntersection<S[number]>;

/**
 * Options for assignInPlace
 */
export interface AssignInPlaceOptions {
  /** Keep keys in target that are not in source (default false) */
  preserveExistingKeys?: boolean;
  /** Skip own getter descriptors when deleting keys not present in source (default false). Useful when target carries computed properties that shouldn't be torn down by syncs. */
  preserveGetters?: boolean;
  /** Return whether any properties changed instead of the target object (default false) */
  returnChanged?: boolean;
}

/**
 * Mutates the target object in place so its contents match the source,
 * without replacing the object reference.
 * Deletes keys not present in source (unless `preserveExistingKeys` is true),
 * then assigns all source properties.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#assigninplace assignInPlace}
 * @see {@link https://next.semantic-ui.com/examples/utils-assigninplace Example}
 *
 * @param target - The object to update in place
 * @param source - The object whose properties to apply
 * @param options - Options controlling key removal and return behavior
 * @returns The mutated target object, or a boolean if `returnChanged` is true
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2 };
 * assignInPlace(obj, { a: 10, c: 3 });
 * // obj is now { a: 10, c: 3 } — same reference, 'b' removed
 *
 * assignInPlace(obj, { a: 10, c: 3 }, { returnChanged: true });
 * // returns false — no changes needed
 * ```
 */
export function assignInPlace<T extends object, S extends object>(
  target: T,
  source: S,
  options?: AssignInPlaceOptions & { returnChanged: true; },
): boolean;
export function assignInPlace<T extends object, S extends object>(
  target: T,
  source: S,
  options?: AssignInPlaceOptions,
): T & S;

/**
 * Returns an object with only the specified properties
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#pick pick}
 *
 * @param obj - The source object
 * @param keys - Keys to include in the new object
 * @returns New object with only specified properties
 *
 * @example
 * ```ts
 * pick({ a: 1, b: 2, c: 3 }, 'a', 'c') // returns { a: 1, c: 3 }
 * ```
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K>;

/**
 * Access a nested object field with a string path. A bracket segment whose body
 * starts with `#` selects an array element by identity (`items[#id]`) rather
 * than position (`items[0]`); identity is matched String-coerced via
 * {@link elementKey}.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#get get}
 *
 * @param obj - The object to traverse
 * @param path - The path string (e.g., 'a.b.c', 'items[0].name', or 'items[#id].name')
 * @param keys - Identity fields for keyed `[#id]` segments (default ['id', '_id', 'hash', 'key'])
 * @returns The value at the path or undefined if not found
 *
 * @example
 * ```ts
 * const obj = { a: { b: { c: 1 } } };
 * get(obj, 'a.b.c') // returns 1
 * get(obj, 'a.b.d') // returns undefined
 * get(obj, 'items[0].name') // supports array indexing
 * get(obj, 'items[#b].qty') // selects the element whose id is 'b'
 * ```
 */
export function get<T extends object, V = any>(
  obj: T,
  path?: string,
  keys?: string[],
): V | undefined;

/**
 * Existence twin of get. Returns true when the path resolves to a real
 * location, even one holding undefined. get() reports a missing path and a
 * stored undefined the same way, so has() is how callers tell them apart.
 * Understands the same path grammar as get (dotted keys, [0] indices, [#id]
 * keyed segments, and literal dotted-key fallbacks).
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#has has}
 * @see {@link https://next.semantic-ui.com/examples/utils-has Example}
 *
 * @param obj - The object to traverse
 * @param path - The path string (e.g., 'a.b.c', 'items[0].name', or 'items[#id].name')
 * @param keys - Identity fields for keyed `[#id]` segments (default ['id', '_id', 'hash', 'key'])
 * @returns True when the path resolves to a stored location, false otherwise
 *
 * @example
 * ```ts
 * has({ a: undefined }, 'a') // returns true (key exists, value is undefined)
 * has({ a: undefined }, 'b') // returns false (no such path)
 * has({ items: [{ id: 'b' }] }, 'items[#b]') // selects by identity
 * ```
 */
export function has<T extends object>(
  obj: T,
  path?: string,
  keys?: string[],
): boolean;

/**
 * Set a nested object field from a string path, the write twin of get.
 * Creates missing intermediates — arrays when the next segment is a numeric
 * index, objects otherwise. Refuses prototype-climbing segments
 * (__proto__, constructor, prototype). Paths from trackWrites and
 * detectChanges apply back directly.
 *
 * A `[#id]` segment addresses an array element by identity: a present key
 * replaces in place (or writes the field through it), an absent key appends a
 * new element (a field write through an absent key is a no-op). The proto guard
 * is not extended to keyed bodies — a `[#__proto__]` value only ===-compares
 * against {@link elementKey} output, it is never used as a property name.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#set set}
 * @see {@link https://next.semantic-ui.com/examples/utils-set Example}
 *
 * @param obj - The object to write into
 * @param path - The path string (e.g., 'a.b.c', 'items.0.name', 'items[0].name', or 'items[#id]')
 * @param value - The value to set at the path
 * @param keys - Identity fields for keyed `[#id]` segments (default ['id', '_id', 'hash', 'key'])
 * @returns The same object reference
 *
 * @example
 * ```ts
 * set({}, 'a.b.c', 1) // returns { a: { b: { c: 1 } } }
 * set({}, 'items.0.name', 'first') // creates the array: { items: [{ name: 'first' }] }
 * set(doc, 'items[#b].qty', 5) // writes through the element whose id is 'b'
 * set(doc, 'items[#z]', { id: 'z' }) // appends, since no element has id 'z'
 * ```
 */
export function set<T extends object>(
  obj: T,
  path: string,
  value: unknown,
  keys?: string[],
): T;

/**
 * Remove a nested object field from a string path, the delete twin of get/set.
 * A missing path is a no-op. A removed array index leaves a hole rather than
 * splicing, so sibling index paths stay valid when applying several removals.
 * Refuses prototype-climbing segments (__proto__, constructor, prototype).
 *
 * A `[#id]` segment removes the matched array element, splicing it out (no
 * positional hole — there are no sibling index paths to keep valid).
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#unset unset}
 *
 * @param obj - The object to remove from
 * @param path - The path string (e.g., 'a.b.c', 'items.0', or 'items[#id]')
 * @param keys - Identity fields for keyed `[#id]` segments (default ['id', '_id', 'hash', 'key'])
 * @returns The same object reference
 *
 * @example
 * ```ts
 * unset({ a: { b: 1, c: 2 } }, 'a.b') // returns { a: { c: 2 } }
 * unset(doc, 'items[#b]') // splices out the element whose id is 'b'
 * ```
 */
export function unset<T extends object>(
  obj: T,
  path: string,
  keys?: string[],
): T;

/**
 * The keyed spelling of a positional path: rewrites each positional array segment to its `[#id]`
 * form where the addressed element carries a path-safe identity, resolving against the object at
 * call time (`items.0.qty` -> `items[#a].qty`). A positional address is only stable while the
 * array doesn't move; the keyed address survives reordering. Segments over keyless arrays,
 * unresolvable paths, and already-keyed spellings pass through. Returns the input string itself
 * when nothing rewrites, so callers can compare by reference.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#keyedpath keyedPath}
 *
 * @param obj - The object the path addresses
 * @param path - The path string (e.g., 'items.0.qty' or 'items[1]')
 * @param keys - Identity fields for keyed segments (default ['id', '_id', 'hash', 'key'])
 * @returns The keyed spelling, or the input path when nothing rewrites
 *
 * @example
 * ```ts
 * keyedPath({ items: [{ id: 'a', qty: 1 }] }, 'items.0.qty') // 'items[#a].qty'
 * ```
 */
export function keyedPath(
  obj: object,
  path: string,
  keys?: string[],
): string;

/**
 * Creates a proxy that combines source and reference objects
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#proxyobject proxyObject}
 *
 * @param sourceObj - Function that returns the source object
 * @param referenceObj - Reference object to combine with source
 * @returns Proxy combining both objects
 *
 * @example
 * ```ts
 * const source = { a: 1, b: 2 };
 * const reference = { c: 3 };
 * const proxy = proxyObject(() => source, reference);
 * proxy.a // returns 1
 * proxy.c // returns 3
 * ```
 */
export function proxyObject<T extends object, U extends object>(
  sourceObj: () => T,
  referenceObj?: U,
): T & U;

/**
 * Returns an object with only the specified keys
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#onlykeys onlyKeys}
 *
 * @param obj - The source object
 * @param keysToKeep - Array of keys to keep
 * @returns New object with only specified keys
 *
 * @example
 * ```ts
 * onlyKeys({ a: 1, b: 2, c: 3 }, ['a', 'c']) // returns { a: 1, c: 3 }
 * ```
 */
export function onlyKeys<T extends object, K extends keyof T>(
  obj: T,
  keysToKeep: K[],
): Pick<T, K>;

/**
 * Checks if an object has a specific property
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#hasproperty hasProperty}
 *
 * @param obj - The object to check
 * @param prop - The property to check for
 * @returns True if the property exists
 *
 * @example
 * ```ts
 * hasProperty({ a: 1 }, 'a') // returns true
 * hasProperty({ a: 1 }, 'b') // returns false
 * ```
 */
export function hasProperty<T extends object>(
  obj: T,
  prop: PropertyKey,
): boolean;

/**
 * Reverses a lookup object's keys and values
 * If multiple keys have the same value, creates an array
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#reversekeys reverseKeys}
 *
 * @param obj - The object to reverse
 * @returns New object with reversed keys and values
 *
 * @example
 * ```ts
 * reverseKeys({ a: 1, b: 2 }) // returns { '1': 'a', '2': 'b' }
 * reverseKeys({ a: 1, b: 1 }) // returns { '1': ['a', 'b'] }
 * ```
 */
export function reverseKeys<T extends object>(
  obj: T,
): { [K in T[keyof T] & PropertyKey]: string | string[]; };

/**
 * Converts an object to an array of key-value pairs
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#arrayfromobject arrayFromObject}
 *
 * @param obj - The object to convert
 * @returns Array of key-value pair objects
 *
 * @example
 * ```ts
 * arrayFromObject({ a: 1, b: 2 })
 * // returns [{ key: 'a', value: 1 }, { key: 'b', value: 2 }]
 * ```
 */
export function arrayFromObject<T>(
  obj: Record<string, T>,
): Array<{ key: string; value: T; }>;

/**
 * Match type indicating how a field matched the query
 */
type WeightedSearchMatchType = 'startsWith' | 'wordStartsWith' | 'anywhere' | 'anyWord';

/**
 * Details about a single field match returned when `returnMatches` is enabled
 */
export interface WeightedSearchMatchDetail {
  /** The property path that matched */
  field: string;
  /** How the field matched the query */
  type: WeightedSearchMatchType;
  /** Numeric score (lower is better): 1=startsWith, 2=wordStartsWith, 3=anywhere, 4+=anyWord */
  score: number;
  /** The raw (pre-lowercase) value that was matched against */
  value: string | string[] | unknown;
}

/**
 * Options for weighted object search
 */
export interface WeightedSearchOptions {
  /** Return details about how each result matched the query */
  returnMatches?: boolean;
  /** Require all query words to match (default true) */
  matchAllWords?: boolean;
  /** Property paths to search within (supports dot-path notation) */
  propertiesToMatch?: string[];
}

/**
 * Searches and ranks objects by query relevance using a weight hierarchy:
 * startsWith > wordStartsWith > anywhere > anyWord.
 *
 * Uses toLowerCase + string methods for common checks, stable sort via
 * original index, and returns spread copies (never mutates originals)
 * when `returnMatches` is enabled.
 *
 * @see {@link https://next.semantic-ui.com/docs/api/utils/objects#weightedobjectsearch weightedObjectSearch}
 *
 * @param query - The search query (case-insensitive, trimmed)
 * @param objectArray - Array of objects to search
 * @param options - Search configuration options
 * @returns Filtered and sorted array based on match quality. When `returnMatches`
 *   is true, each result is a shallow copy with an added `matches` array.
 *
 * @example
 * ```ts
 * const items = [
 *   { name: 'Apple Pie', tags: ['fruit', 'dessert'] },
 *   { name: 'Green Apple', tags: ['fruit'] },
 *   { name: 'Snapple Juice', tags: ['drink'] },
 * ];
 *
 * // Basic search — sorted by relevance
 * weightedObjectSearch('apple', items, {
 *   propertiesToMatch: ['name', 'tags']
 * });
 *
 * // With match details
 * weightedObjectSearch('apple', items, {
 *   propertiesToMatch: ['name'],
 *   returnMatches: true,
 * });
 * // [{ name: 'Apple Pie', matches: [{ field: 'name', type: 'startsWith', ... }] }, ...]
 * ```
 */
export function weightedObjectSearch<T extends object>(
  query: string,
  objectArray: T[],
  options: WeightedSearchOptions & { returnMatches: true; },
): (T & { matches: WeightedSearchMatchDetail[]; })[];

export function weightedObjectSearch<T extends object>(
  query: string,
  objectArray: T[],
  options?: WeightedSearchOptions,
): T[];
