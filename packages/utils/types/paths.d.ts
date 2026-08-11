/**
 * Path utilities — one grammar for addressing, walking, building, relating, and
 * expanding the dot-joined paths the object helpers emit and consume
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths Path Utilities Documentation}
 */

/**
 * A named object field — the `lines` and `tax` of `lines[#a].tax`.
 */
export interface FieldSegment {
  type: 'field';
  /** The field name */
  name: string;
}

/**
 * An array element addressed by identity — the `[#a1]` of `lines[#a1].tax`. The
 * key is the raw text between `[#` and `]`, matched String-coerced against
 * {@link elementKey} output, so it carries any character except `]`: a dot
 * (`lines[#200.40.50]`) or an `@` (`users[#jack@semantic-ui.com]`) is identity,
 * never a boundary.
 */
export interface KeySegment {
  type: 'key';
  /** The identity text, without the leading `#` */
  key: string;
}

/**
 * An array element addressed by position. Both spellings parse to this segment,
 * so `items[2].qty` and `items.2.qty` are one address.
 */
export interface IndexSegment {
  type: 'index';
  /** The zero-based position */
  index: number;
}

/**
 * The `*` wildcard, in either spelling (`lines.*.cost` or `lines[*].cost`).
 * Matches any single segment under {@link pathCovers} and enumerates a level
 * under {@link expandPath}.
 */
export interface WildcardSegment {
  type: 'wildcard';
}

/**
 * The two ways a path addresses an array element: by identity or by position.
 * They are different address spaces, so `items[#7]` never means `items.7`.
 */
export type ElementSegment = KeySegment | IndexSegment;

/**
 * One parsed unit of a path, discriminated on `type` — what {@link parsePath}
 * returns and {@link pathFrom} consumes.
 */
export type PathSegment = FieldSegment | KeySegment | IndexSegment | WildcardSegment;

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
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#elementkey elementKey}
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
 * Whether a key can ride the path grammar: true unless it carries `]`, the one
 * character that closes a keyed selector. Dots, `@`, `[`, and a leading `#` all
 * round-trip, so an email or a compound id addresses an element as written. The
 * guard for a key that exists before any element does — a user-typed id at a
 * form boundary, checked before it reaches {@link elementPath}. The key is
 * String-coerced, so a numeric id answers true.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#ispathkey isPathKey}
 * @see {@link https://next.semantic-ui.com/examples/utils-ispathkey Example}
 *
 * @param key - The key to check
 * @returns True when the key can appear between `[#` and `]`
 *
 * @example
 * ```ts
 * isPathKey('jack@semantic-ui.com') // returns true
 * isPathKey('200.40.50') // returns true — a dot inside a key is identity
 * isPathKey(7) // returns true
 * isPathKey('a]b') // returns false
 * ```
 */
export function isPathKey(key: unknown): boolean;

/**
 * An element's key as it can appear in a path — the text between `[#` and `]` —
 * or null when the element is unkeyed or its key can't ride the grammar. The
 * item-to-path route: every keyed path the emitters produce goes through this
 * check, so an emitted path always parses back through {@link get}. Identity
 * comes from {@link elementKey} and spells String-coerced, so a numeric id
 * reads as text.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#pathkey pathKey}
 * @see {@link https://next.semantic-ui.com/examples/utils-pathkey Example}
 *
 * @param item - The array element to spell a key for
 * @param keys - Candidate identity fields, first present wins (default `elementKey.config.keys`)
 * @returns The key text, or null when the element is unkeyed or its key carries `]`
 *
 * @example
 * ```ts
 * pathKey({ id: 'jack@semantic-ui.com' }) // returns 'jack@semantic-ui.com'
 * pathKey({ id: 7 }) // returns '7'
 * pathKey({ name: 'n' }) // returns null — unkeyed
 * pathKey({ id: 'a]b' }) // returns null — a key can't carry ']'
 * pathKey({ sku: 'A1' }, ['sku']) // returns 'A1'
 * ```
 */
export function pathKey(item: unknown, keys?: string[]): string | null;

/**
 * Split a path into its dot-separated parts, the textual reading beside
 * {@link parsePath}'s semantic one. Only dots outside brackets separate: a dot
 * inside a bracket belongs to the key, so a keyed element and its field are two
 * parts however the key is spelled. Parts are contiguous substrings of the
 * input, so joining them back with dots returns the path unchanged. An unclosed
 * bracket ends the scan and the remainder rides as one part, which parsePath
 * then rejects.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#splitpath splitPath}
 * @see {@link https://next.semantic-ui.com/examples/utils-splitpath Example}
 *
 * @param path - The path string to split
 * @returns The parts, in order
 *
 * @example
 * ```ts
 * splitPath('a.b.c') // returns ['a', 'b', 'c']
 * splitPath('users[#jack@semantic-ui.com].role') // returns ['users[#jack@semantic-ui.com]', 'role']
 * splitPath('items[2].qty') // returns ['items[2]', 'qty']
 * splitPath('lines[#200.40.50].tax').join('.') // the source path, unchanged
 * ```
 */
export function splitPath(path: string): string[];

/**
 * Options for eachPath
 */
export interface EachPathOptions {
  /** Include the full path itself as the final visit (default true). Pass false to visit only the ancestors above the target */
  self?: boolean;
}

/**
 * Walk the paths a path passes through, shortest first — `'todos[#a].done'`
 * visits `'todos'`, `'todos[#a]'`, `'todos[#a].done'`. Every visited value is
 * itself a resolvable path: a bracket splits its segment into container and
 * element, and a dot inside a keyed id belongs to the id, never a boundary.
 * Pass `self: false` for only the ancestors above the target — the walk a
 * subsumption check or an invalidation pass over path-addressed state needs.
 * Return false from the callback to break the iteration early, like each.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#eachpath eachPath}
 * @see {@link https://next.semantic-ui.com/examples/utils-eachpath Example}
 *
 * @param path - The path string to walk
 * @param callback - Called per containing path, shortest first
 * @param options - Whether to include the path itself
 * @returns The path string
 *
 * @example
 * ```ts
 * eachPath('todos[#a].done', (path) => console.log(path));
 * // 'todos'
 * // 'todos[#a]'
 * // 'todos[#a].done'
 *
 * eachPath('todos[#a].done', (ancestor) => console.log(ancestor), { self: false });
 * // 'todos'
 * // 'todos[#a]'
 * ```
 */
export function eachPath(
  path: string,
  callback: (containingPath: string, index: number, path: string) => boolean | void,
  options?: EachPathOptions,
): string;

/**
 * Access a nested object field with a string path. A bracket segment whose body
 * starts with `#` selects an array element by identity (`items[#id]`) rather
 * than position (`items[0]`); identity is matched String-coerced via
 * {@link elementKey}. An id may contain any character except `]` —
 * `items[#jack@semantic-ui.com]` and `items[#200.40.50]` are valid selectors,
 * dots inside a bracket belong to the id.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#get get}
 * @see {@link https://next.semantic-ui.com/examples/utils-get Example}
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
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#has has}
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
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#set set}
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
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#unset unset}
 * @see {@link https://next.semantic-ui.com/examples/utils-unset Example}
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
 * form where the addressed element carries a path-safe identity (any id without `]`), resolving
 * against the object at call time (`items.0.qty` -> `items[#a].qty`). A positional address is only stable while the
 * array doesn't move; the keyed address survives reordering. Segments over keyless arrays,
 * unresolvable paths, and already-keyed spellings pass through. Returns the input string itself
 * when nothing rewrites, so callers can compare by reference.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#keyedpath keyedPath}
 * @see {@link https://next.semantic-ui.com/examples/utils-keyedpath Example}
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

/** How many parsed paths the shared segment cache holds. */
export interface ParsePathConfig {
  /** Maximum number of parsed paths kept before eviction. Default 4096. */
  cacheSize: number;
}

/**
 * Parse a path into its segments, the semantic reading beside {@link splitPath}'s
 * textual one. Fields, `[#key]` keyed elements, positional indexes in either
 * spelling (`items[2]` and `items.2` parse alike), and `*` wildcards each become
 * one segment. Brackets chain inside a part (`a[#x][#y]`), and a leading bracket
 * parses without a field, so an array root addresses as `[#a1].done`.
 *
 * A path that doesn't parse is null rather than a guess — an unclosed bracket, a
 * positional body that isn't a whole index, trailing text after a bracket, an
 * empty part, or a non-string — so a relation over garbage reads as no relation.
 * The empty path parses to no segments.
 *
 * Results are cached and shared: two parses of one path return the same array,
 * so treat segments as immutable (they are frozen in development, and the
 * returned array is typed readonly). `parsePath.config.cacheSize` bounds the
 * cache, sized once at app boot for a workload with many client-minted keys.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#parsepath parsePath}
 * @see {@link https://next.semantic-ui.com/examples/utils-parsepath Example}
 *
 * @param path - The path string to parse
 * @returns The segments in order, or null when the path doesn't parse
 *
 * @example
 * ```ts
 * parsePath('lines[#200.40.50].tax')
 * // [
 * //   { type: 'field', name: 'lines' },
 * //   { type: 'key', key: '200.40.50' },
 * //   { type: 'field', name: 'tax' },
 * // ]
 * parsePath('items.2') // [{ type: 'field', name: 'items' }, { type: 'index', index: 2 }]
 * parsePath('lines.*.cost') // [{ type: 'field', name: 'lines' }, { type: 'wildcard' }, { type: 'field', name: 'cost' }]
 * parsePath('items[#a') // returns null — unclosed bracket
 * parsePath('') // returns []
 * ```
 */
export function parsePath(path: string): readonly PathSegment[] | null;
export namespace parsePath {
  /** Bound on the shared segment cache. Set once at app boot */
  let config: ParsePathConfig;
}

/**
 * The path from segments — the inverse of {@link parsePath}, and of
 * {@link splitPath}: the array may mix parsed segments and plain part strings,
 * so a caller can splice a key into a split path without re-lexing it. Fields,
 * positional indexes, and wildcards join with dots, keys append as `[#key]`.
 * A positional index emits the dot form, so `pathFrom(parsePath(path))`
 * normalizes a bracket spelling (`items[2].qty` -> `items.2.qty`) rather than
 * preserving it; every other spelling round-trips unchanged.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#pathfrom pathFrom}
 * @see {@link https://next.semantic-ui.com/examples/utils-pathfrom Example}
 *
 * @param segments - Parsed segments, plain part strings, or a mix of the two
 * @returns The path string
 *
 * @example
 * ```ts
 * pathFrom(parsePath('users[#jack@semantic-ui.com].role')) // 'users[#jack@semantic-ui.com].role'
 * pathFrom(parsePath('items[2].qty')) // 'items.2.qty' — the bracket index normalizes
 * pathFrom(splitPath('lines[#200.40.50].tax')) // 'lines[#200.40.50].tax'
 * pathFrom(['order.lines', { type: 'key', key: 'a1' }, 'qty']) // 'order.lines[#a1].qty'
 * ```
 */
export function pathFrom(segments: readonly (string | PathSegment)[]): string;

/**
 * The path of one element under a list path — by key in the `[#key]` form, by
 * index in the dot form. The birth point of a path from raw data, so the key
 * contract is enforced here: a key carrying `]` throws instead of emitting a
 * path nothing can parse. Route elements through {@link pathKey} first, which
 * returns null for exactly the keys this rejects. An empty list path addresses
 * an array root.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#elementpath elementPath}
 * @see {@link https://next.semantic-ui.com/examples/utils-elementpath Example}
 *
 * @param listPath - The path of the array the element lives in
 * @param element - `{ key }` to address by identity, `{ index }` to address by position
 * @returns The element's path
 * @throws TypeError when the key carries `]`, or when neither `key` nor `index` is passed
 *
 * @example
 * ```ts
 * elementPath('order.lines', { key: 'a1' }) // 'order.lines[#a1]'
 * elementPath('order.lines', { index: 2 }) // 'order.lines.2'
 * elementPath('users', { key: 'jack@semantic-ui.com' }) // 'users[#jack@semantic-ui.com]'
 * elementPath('lines', { key: '200.40.50' }) // 'lines[#200.40.50]'
 * elementPath('', { key: 'a1' }) // '[#a1]' — an array root
 * elementPath('a', { key: 'x]y' }) // throws TypeError
 * ```
 */
export function elementPath(
  listPath: string,
  element: { key: string | number; } | { index: number; },
): string;

/**
 * Does path a cover path b — b at or under a, segment-aligned, so `contact`
 * covers `contact.taxId` but never `contacts`. The one covering relation a
 * projection, a write guard, and an invalidation check all read. A wildcard
 * matches any single segment, so `lines.*.cost` covers both `lines[#a1].cost`
 * and `lines.2.cost`. Keyed and positional elements are different address
 * spaces: `a[#7]` covers `a[#7].x` and never `a.7.x`. A path that doesn't parse
 * covers nothing and is covered by nothing, itself included.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#pathcovers pathCovers}
 * @see {@link https://next.semantic-ui.com/examples/utils-pathcovers Example}
 *
 * @param a - The covering path
 * @param b - The path tested for sitting at or under a
 * @returns True when b is at or under a
 *
 * @example
 * ```ts
 * pathCovers('items', 'items[#200.40.50].amount') // returns true
 * pathCovers('users[#jack@semantic-ui.com]', 'users[#jack@semantic-ui.com].role') // returns true
 * pathCovers('contact', 'contacts') // returns false
 * pathCovers('lines.*.cost', 'lines[#a1].cost') // returns true
 * pathCovers('a.b.c', 'a.b') // returns false — covering reads downward
 * ```
 */
export function pathCovers(a: string, b: string): boolean;

/**
 * Do two paths lie on one line — a at or under b, or b at or under a, with the
 * segment alignment {@link pathCovers} reads (`items` overlaps
 * `items[#r7].amount`, never `itemsLog`). The symmetric relation, for asking
 * whether a read and a write can touch each other without knowing which sits
 * deeper. A path that doesn't parse overlaps nothing.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#pathsoverlap pathsOverlap}
 * @see {@link https://next.semantic-ui.com/examples/utils-pathsoverlap Example}
 *
 * @param a - One path
 * @param b - The other path
 * @returns True when either path sits at or under the other
 *
 * @example
 * ```ts
 * pathsOverlap('items', 'items[#r7].amount') // returns true
 * pathsOverlap('items[#r7].amount', 'items') // returns true — either direction
 * pathsOverlap('users[#jack@semantic-ui.com].role', 'users') // returns true
 * pathsOverlap('items', 'itemsLog') // returns false
 * pathsOverlap('a.b', 'a.c') // returns false
 * ```
 */
export function pathsOverlap(a: string, b: string): boolean;

/**
 * The wildcard path of a concrete path: every element address becomes `*`, so
 * keyed and positional readings of the same field share one spelling — the
 * same address written at list grain. The wildcard path covers the path it
 * came from ({@link pathCovers}), so it is still a usable subscription. A
 * path that doesn't parse passes through unchanged.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#wildcardpath wildcardPath}
 * @see {@link https://next.semantic-ui.com/examples/utils-wildcardpath Example}
 *
 * @param path - The concrete path to collapse
 * @returns The wildcard path, or the input path when it doesn't parse
 *
 * @example
 * ```ts
 * wildcardPath('lines[#a1].tax') // 'lines.*.tax'
 * wildcardPath('lines.2.tax') // 'lines.*.tax'
 * wildcardPath('users[#jack@semantic-ui.com].role') // 'users.*.role'
 * wildcardPath('a.b.c') // 'a.b.c'
 * ```
 */
export function wildcardPath(path: string): string;

/**
 * Options for expandPath
 */
export interface ExpandPathOptions {
  /** The path a leading-dot spelling resolves against. Required when the path starts with a dot */
  from?: string;
  /** The document a `*` enumerates arrays from. Required when the path carries a wildcard */
  doc?: object;
  /** Identity fields for spelling enumerated elements (default `elementKey.config.keys`) */
  keys?: string[];
}

/**
 * Expand a path spelling into the concrete paths it addresses, always as an
 * array, so a caller handles one and many the same way.
 *
 * A leading dot resolves against `from`, one dot per trailing segment dropped:
 * from `lines[#a1].qty`, `.tax` is `lines[#a1].tax`, `..total` is `lines.total`,
 * `...total` is `total`. A keyed segment counts one level like any other,
 * whatever its key carries.
 *
 * A `*` enumerates the array at that level of `doc`: an element with a path key
 * takes the `[#key]` spelling so a derived write respects a keyed override, a
 * keyless element stays positional, and a level that isn't an array contributes
 * nothing — that branch drops rather than failing. Both spellings compose in one
 * call, and a path with neither returns itself as the only element.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/paths#expandpath expandPath}
 * @see {@link https://next.semantic-ui.com/examples/utils-expandpath Example}
 *
 * @param path - The path spelling to expand
 * @param options - The path relative dots resolve against, the document wildcards enumerate, and identity fields
 * @returns The concrete paths, in document order
 * @throws TypeError when the path isn't a string or doesn't parse, when a leading-dot spelling has no resolvable `from`, or when a wildcard has no `doc` to enumerate
 *
 * @example
 * ```ts
 * const doc = {
 *   lines: [{ id: 'a1', cost: 1 }, { id: '200.40.50', cost: 2 }],
 *   plain: [{ n: 1 }, { n: 2 }],
 * };
 *
 * expandPath('lines.*.cost', { doc }) // ['lines[#a1].cost', 'lines[#200.40.50].cost']
 * expandPath('plain.*.n', { doc }) // ['plain.0.n', 'plain.1.n'] — keyless stays positional
 * expandPath('.tax', { from: 'lines[#a1].qty' }) // ['lines[#a1].tax']
 * expandPath('..*.cost', { from: 'lines[#a1].qty', doc }) // every line's cost
 * expandPath('a.b.c') // ['a.b.c']
 * ```
 */
export function expandPath(path: string, options?: ExpandPathOptions): string[];
