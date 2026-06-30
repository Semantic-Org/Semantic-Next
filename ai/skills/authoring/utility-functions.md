---
title: Utility Functions Reference
description: Complete reference for @semantic-ui/utils — a standalone utility library providing functions for arrays, objects, strings, type checking, colors, dates, and more. Use this before reimplementing common operations.
keywords: [utilities, arrays, objects, strings, type checking, functions, debounce, throttle, memoize, clone, equality, formatDate, each, range, sequence, remove, noop, isDate, isRegExp]
audience: authoring
skill: utility-functions
type: skill
---

# Utility Functions Reference

> **Skill:** `utility-functions`
> **Purpose:** Complete reference for `@semantic-ui/utils` — use this before reimplementing common operations

---

**Golden rule: Always check `@semantic-ui/utils` before writing your own utility function.** This package covers arrays, objects, strings, types, dates, CSS, functions, and more. If you're about to write a helper for debouncing, deep cloning, object searching, or array manipulation — it's probably already here.

All functions are named exports:
```javascript
import { functionName } from '@semantic-ui/utils';
```

---

## Array Utilities (arrays.js)

### Basic Operations
```javascript
import { unique, filterEmpty, first, last, flatten, inArray } from '@semantic-ui/utils';

unique([1, 2, 2, 3]);               // [1, 2, 3] — removes duplicates via Set
filterEmpty([1, 0, null, '', 'hi']); // [1, 'hi'] — removes all falsy values
first([1, 2, 3]);                    // 1
first([1, 2, 3], 2);                 // [1, 2] — first N elements
last([1, 2, 3]);                     // 3
last([1, 2, 3], 2);                  // [2, 3] — last N elements
flatten([[1, 2], [3, [4, 5]]]);      // [1, 2, 3, 4, 5] — deep flatten
inArray('b', ['a', 'b', 'c']);       // true
```

### Search and Filter
```javascript
import { firstMatch, findIndex, where, some, any } from '@semantic-ui/utils';

// Accept callback or value (uses deep equality for values)
firstMatch([1, 2, 3], val => val > 1);           // 2
firstMatch([{id: 1}, {id: 2}], {id: 2});         // {id: 2}

findIndex([1, 2, 3], val => val > 1);             // 1
findIndex([{id: 1}, {id: 2}], {id: 2});           // 1

// Filter by property match — second arg is an object
const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
];
where(users, { role: 'admin' });                   // [{ name: 'Alice', role: 'admin' }]

// Predicate check
some([1, 2, 3], x => x > 2);                      // true
any([1, 2, 3], x => x > 5);                       // false (alias for some)
```

### Mutation
```javascript
import { remove, moveItem, moveToFront, moveToBack } from '@semantic-ui/utils';

// In-place removal — returns count removed
const items = [1, 2, 3, 4, 5];
remove(items, val => val > 3);       // 2 (items is now [1, 2, 3])
remove(items, 2);                    // 1 (items is now [1, 3]) — uses deep equality

// Move by value or callback, not index
const letters = ['a', 'b', 'c', 'd'];
moveItem(letters, 'b', 3);          // ['a', 'c', 'd', 'b'] — move 'b' to position 3
moveItem(letters, el => el === 'd', 'first'); // accepts 'first', 'last', or numeric index
moveToFront(letters, 'c');          // move 'c' to front
moveToBack(letters, 'a');           // move 'a' to back
```

### Sorting and Grouping
```javascript
import { sortBy, groupBy } from '@semantic-ui/utils';

const users = [
  { name: 'Alice', age: 30, role: 'admin' },
  { name: 'Bob', age: 25, role: 'user' },
  { name: 'Carol', age: 35, role: 'admin' },
];

sortBy(users, 'age');                // sorted by age ascending
sortBy(users, ['role', 'age']);      // multi-key: role first, then age
sortBy(users, 'name', (a, b) => b.localeCompare(a)); // custom comparator

groupBy(users, 'role');              // { admin: [Alice, Carol], user: [Bob] }
```

### Set Operations
```javascript
import { intersection, difference, uniqueItems } from '@semantic-ui/utils';

// All take variadic arrays (spread args, not a single array)
intersection([1, 2, 3], [2, 3, 4]);          // [2, 3] — common elements
difference([1, 2, 3], [2, 3, 4]);            // [1] — in first but not others
uniqueItems([1, 2, 3], [2, 3, 4]);           // [1, 4] — items unique to ONE array only
```

### Generation
```javascript
import { range, sequence, sum } from '@semantic-ui/utils';

range(5);                            // [0, 1, 2, 3, 4] — stop is exclusive
range(2, 6);                         // [2, 3, 4, 5]
range(0, 10, 2);                     // [0, 2, 4, 6, 8]

// Generate multiples: sequence(count, interval = 1, start = 1)
sequence(5);                         // [1, 2, 3, 4, 5]
sequence(3, 3);                      // [3, 6, 9]
sequence(5, 3, 2);                   // [6, 9, 12, 15, 18]

sum([1, 2, 3, 4]);                   // 10
```

---

## Object Utilities (objects.js)

### Property Access
```javascript
import { get, set, unset, keys, values, hasProperty } from '@semantic-ui/utils';

const data = {
  user: {
    profile: { name: 'Alice' },
    posts: [{ title: 'First Post' }],
  },
};

// Nested dot-path access (supports array indices)
get(data, 'user.profile.name');              // 'Alice'
get(data, 'user.posts.0.title');             // 'First Post'
get(data, 'user.profile.bio');               // undefined (no default parameter)

// Nested dot-path writes, creating missing intermediates (arrays for indices)
set(data, 'user.profile.name', 'Bob');       // writes in place, returns data
set({}, 'items.0.name', 'first');            // { items: [{ name: 'first' }] }

// Nested dot-path removal, no-op when missing
unset(data, 'user.profile.bio');             // removes in place, returns data
// set/unset refuse prototype-climbing segments (__proto__, constructor, prototype)

// Keyed array addressing — [#id] selects an element by identity, [0] by position.
// set replaces a present key or appends an absent one, unset splices (no hole)
const cart = { items: [{ id: 'a', qty: 1 }, { id: 'b', qty: 2 }] };
get(cart, 'items[#b].qty');                  // 2 (by id, survives a reorder)
set(cart, 'items[#c]', { id: 'c', qty: 3 }); // appends, no element had id 'c'
unset(cart, 'items[#a]');                    // splices out the 'a' element
set(cart, 'items[#x].qty', 9, ['sku']);      // 4th arg overrides the id field list

// hasProperty checks own properties only (shallow, no dot paths)
hasProperty(data, 'user');                   // true
hasProperty(data, 'toString');               // false (inherited)

// Safe key/value extraction (returns undefined for non-objects)
keys({ a: 1, b: 2 });                       // ['a', 'b']
values({ a: 1, b: 2 });                     // [1, 2]
```

### Object Manipulation
```javascript
import { extend, assignInPlace, deepExtend, pick, onlyKeys, filterObject, mapObject } from '@semantic-ui/utils';

// Shallow merge (preserves getter/setter descriptors)
extend({ a: 1 }, { b: 2 }, { c: 3 });       // { a: 1, b: 2, c: 3 }

// Sync object in place — deletes keys not in source, assigns source properties
const obj = { a: 1, b: 2, stale: true };
assignInPlace(obj, { a: 10, b: 20 });        // obj is now { a: 10, b: 20 }

// Preserve existing keys — only adds and updates
assignInPlace(obj, { a: 99 }, { preserveExistingKeys: true }); // { a: 99, b: 20 }

// Detect changes without side effects
assignInPlace(obj, { a: 99 }, { returnChanged: true }); // false (no change)

// Deep merge
const config = { api: { url: 'localhost', timeout: 5000 } };
deepExtend(config, { api: { timeout: 3000 } });
// { api: { url: 'localhost', timeout: 3000 } }

// Deep merge with options (last arg if it has known option keys)
deepExtend(target, source, { preserveNonCloneable: true, preserveDOM: true });

// Select properties — spread args, not array
pick({ a: 1, b: 2, c: 3 }, 'a', 'c');       // { a: 1, c: 3 }

// Select properties — array arg
onlyKeys({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a: 1, c: 3 }

// Filter and transform
filterObject({ a: 1, b: 5, c: 3 }, (value, key) => value > 2); // { b: 5, c: 3 }
mapObject({ a: 1, b: 2 }, (value, key) => value * 2);           // { a: 2, b: 4 }
```

### Change Detection
```javascript
import { trackWrites, trackReads, detectChanges, elementKey, get } from '@semantic-ui/utils';

// Run a callback against a value, report whether and where it changed
const doc = { meta: { count: 0 } };
const { changed, paths, result } = trackWrites(doc, (value) => {
  value.meta.count++;
});
// changed === true, paths === ['meta.count'], writes apply to doc directly

// Paths resolve through get(), e.g. for state sync
paths.forEach((path) => sync(path, get(doc, path)));

// Writing a value that is already there is not a change
trackWrites(doc, (value) => { value.meta.count = 1; }); // { changed: false, paths: [] }

// Skip path collection on hot paths that only read changed
trackWrites(doc, mutator, { returnPaths: false }); // { changed, result }

// Paths id-address keyed arrays by default — a field edit across a collection
// reads back per record (todos[#id].complete), not by index, and survives a
// reorder. Zero config, the marquee component case
const db = { todos: [{ id: 'a', complete: false }, { id: 'b', complete: false }] };
trackWrites(db, (d) => { for (const t of d.todos) { t.complete = true; } });
// paths: ['todos[#a].complete', 'todos[#b].complete']

// Keyed paths come from the snapshot diff, so they force snapshot even for a
// large value (callback sees the real object). The proxy strategy is the
// positional opt-out — it only sees the index a write went through, no identity
trackWrites(db, mutator, { strategy: 'proxy' });   // paths like ['todos.0.complete']
trackWrites(db, mutator, { keyed: false });        // positional, snapshot path
trackWrites(bigList, (v) => { v[500].seen = true; }, { keyed: false }); // proxy, no clone

// onWrite streams each write with its key path, implies the proxy strategy (positional)
trackWrites(rows, (tracked) => {
  tracked[3].active = true;
}, { onWrite: (path, target, key) => console.log(path) }); // ['3', 'active']

// trackReads is the READ companion to trackWrites: it reports which paths a
// callback read, not what it changed. Proxy-only (reads can't be diffed), and
// the wrapper is read-only — a write through it throws, so the input is never
// mutated. For dependency collection, memo keys, access audits, prefetch
const state = { todos: [{ id: 'a', done: false }, { id: 'b', done: true }] };
const { reads, structure } = trackReads(state, (value) => value.todos.map((t) => t.done));
// reads === ['todos[#a].done', 'todos[#b].done']  (value deps, keyed by default)
// structure === ['todos']                          (shape dep: grew or shrank)

// The two buckets pair with detectChanges: reads ↔ changed, structure ↔
// added/removed. Surfacing structure apart is the array-growth case — reading
// .length / iterating leaves no value path, so a value-only set misses a push
reads.map((path) => get(state, path)); // [false, true] — paths survive a reorder

// onRead streams each read live (typed), returnPaths: false skips collection
trackReads(state, (value) => value.todos.length, {
  onRead: (path, type) => track(type, path), // 'value' todos, then 'structure' todos
});

// Two-value structural diff, directional from before to after
detectChanges({ name: 'a', temp: true }, { name: 'b', nickname: 'al' });
// { added: ['nickname'], removed: ['temp'], changed: ['name'] }

// elementKey — the identity of an array element, first present id field wins
elementKey({ id: 'a', _id: 'x' });           // 'a'
elementKey({ name: 'n' });                   // undefined (no id field)
elementKey({ sku: 's1' }, ['sku']);          // 's1' (custom key list)

// detectChanges diffs arrays of keyed objects by identity by DEFAULT, not by
// index, so a prepend is one add by key instead of a positional cascade. Emits
// field[#id] paths that apply back through get/set/unset and survive a reorder.
// Any array that isn't cleanly keyed (scalar, unkeyed, duplicate, or a key with
// . [ ] or #) falls back to positional. { keyed: false } forces the index walk
const before = { lineItems: [{ id: 'a', qty: 1 }, { id: 'b', qty: 1 }] };
const after = { lineItems: [{ id: 'z', qty: 9 }, { id: 'a', qty: 1 }, { id: 'b', qty: 5 }] };
detectChanges(before, after);
// { added: ['lineItems[#z]'], removed: [], changed: ['lineItems[#b].qty'] }

// equality swaps the leaf comparator (defaults to isEqual, like trackWrites)
detectChanges({ a: 1 }, { a: '1' }, { equality: (x, y) => x == y }); // no change

// ignoreKeys drops key names at any depth — keep volatile/local fields out of a changeset
detectChanges({ name: 'a', updatedAt: 1 }, { name: 'b', updatedAt: 2 }, { ignoreKeys: ['updatedAt'] });
// { added: [], removed: [], changed: ['name'] }

// collapseKeys diffs a key as one whole value, never descending — same leaf
// treatment a Map/Date gets, for a subtree whose own keys aren't wire paths
detectChanges(
  { _overrides: { 'contacts[#1].field': true } },
  { _overrides: { 'contacts[#1].field': false } },
  { collapseKeys: ['_overrides'] },
);
// { added: [], removed: [], changed: ['_overrides'] }
```

### Conversion
```javascript
import { arrayFromObject, reverseKeys } from '@semantic-ui/utils';

// Object to key/value array
arrayFromObject({ x: 10, y: 20 });
// [{ key: 'x', value: 10 }, { key: 'y', value: 20 }]

// Reverse lookup (handles array values and collisions)
reverseKeys({ a: 1, b: [1, 2] });           // { 1: ['a', 'b'], 2: 'b' }
reverseKeys({ active: 1, inactive: 0 });     // { 1: 'active', 0: 'inactive' }
```

### Search
```javascript
import { weightedObjectSearch } from '@semantic-ui/utils';

const items = [
  { name: 'Apple iPhone', category: 'phone', tags: ['mobile', 'apple'] },
  { name: 'Samsung Galaxy', category: 'phone', tags: ['mobile', 'android'] },
  { name: 'iPad Pro', category: 'tablet', tags: ['tablet', 'apple'] },
];

// First arg is query string, second is array, third is options
const results = weightedObjectSearch('apple', items, {
  propertiesToMatch: ['name', 'category', 'tags'],  // array of property names to search
  matchAllWords: true,                                // all query words must match (default)
  returnMatches: false,                               // set true to attach match details
});
// Returns items sorted by relevance: startsWith > wordStartsWith > anywhere > anyWord
```

### Proxy
```javascript
import { proxyObject } from '@semantic-ui/utils';

// Creates a read-through proxy: properties resolve from referenceObj first, then sourceObj()
// sourceObj is a FUNCTION that returns the current source object (avoids stale references)
const proxy = proxyObject(
  () => getLatestSettings(),  // getter function, called on each property access
  localOverrides              // checked first
);
proxy.theme; // returns localOverrides.theme if set, otherwise getLatestSettings().theme
```

---

## Type Checking (types.js)

### Basic Types
```javascript
import {
  isObject, isPlainObject, isArray, isString, isNumber,
  isBoolean, isFunction, isBinary
} from '@semantic-ui/utils';

isObject({});                    // true (any non-null object)
isObject([]);                    // true (arrays are objects)
isPlainObject({});               // true (Object literals and Object.create(null))
isPlainObject([]);               // false
isArray([]);                     // true
isString('hello');               // true
isNumber(42);                    // true
isBoolean(true);                 // true
isFunction(() => {});            // true
isBinary(new Uint8Array());      // true (TypedArrays and ArrayBuffer)
```

### Additional Types
```javascript
import { isDate, isRegExp } from '@semantic-ui/utils';

// Cross-realm safe via Object.prototype.toString tag dispatch
isDate(new Date());                 // true
isRegExp(/pattern/i);               // true
```

### Special Types
```javascript
import {
  isEmpty, isPromise, isDOM, isNode, isClassInstance,
  isIterable, isMap, isSet, isArguments
} from '@semantic-ui/utils';

isEmpty('');                     // true
isEmpty([]);                     // true
isEmpty({});                     // true
isEmpty(null);                   // true
isEmpty({ a: undefined });       // true (only checks nullish values in objects)

isPromise(fetch('/api'));        // true (checks for .then method)
isDOM(document.body);            // true (Element, Document, window, DocumentFragment)
isNode(document.createTextNode('text')); // true (checks nodeType)
isClassInstance(new MyClass());  // true (excludes built-in types like Date, Map, Array)

isIterable(new Set());           // true (checks Symbol.iterator)
isMap(new Map());                // true
isSet(new Set());                // true
isArguments(arguments);          // true
```

### Environment Detection (environment.js)

These are **boolean constants**, not functions — no parentheses needed:

```javascript
import { isServer, isClient, isDevelopment, isCI } from '@semantic-ui/utils';

// ❌ WRONG — these are not functions
if (isClient()) { ... }

// ✅ RIGHT — boolean constants, evaluated once at import time
if (isClient) { ... }
if (isServer) { ... }
if (isDevelopment) { ... }  // detects NODE_ENV, Vite DEV, Vercel preview, etc.
if (isCI) { ... }           // detects GitHub Actions, GitLab CI, Jenkins, etc.
```

---

## String Utilities (strings.js)

### Case Conversion
```javascript
import { kebabToCamel, camelToKebab, capitalize, capitalizeWords, toTitleCase, humanize } from '@semantic-ui/utils';

kebabToCamel('my-component-name');       // 'myComponentName'
kebabToCamel('grid-2x2');               // 'grid_2x2' (digit segments use _ for lossless round-trip)
kebabToCamel('heading-1');              // 'heading_1'
camelToKebab('myComponentName');         // 'my-component-name'
camelToKebab('grid_2x2');               // 'grid-2x2'
camelToKebab('arrowDownAZ');            // 'arrow-down-a-z'
capitalize('hello world');               // 'Hello world'
capitalizeWords('hello world');          // 'Hello World'
toTitleCase('the quick brown fox');      // 'The Quick Brown Fox' (respects stop words: the, a, of, etc.)

// Identifier -> label (inverse of tokenize). Keeps acronyms whole, drops a trailing id, sentence-cases
humanize('first_name');                  // 'First name'
humanize('getURLsFromPage');             // 'Get URLs from page' (acronyms, including plurals, stay intact)
humanize('user_id');                     // 'User' (dropId default; pass { dropId: false } to keep)
humanize('terms_of_service', { titleCase: true });   // 'Terms of Service'
humanize('IN_PROGRESS', { constantCase: true });     // 'In progress' (sentence-case a shouting enum)
```

### Text Processing
```javascript
import { joinWords, getArticle, escapeHTML, unescapeHTML, reverseString, tokenize } from '@semantic-ui/utils';

// Slug-style token (lowercase, hyphen-joined, special chars stripped)
tokenize('Hello World!');                           // 'hello-world'
tokenize('FormField_Input');                        // 'formfield-input'

// Smart word joining with Oxford comma
joinWords(['apple', 'banana', 'orange']);           // 'apple, banana, and orange'
joinWords(['apple', 'banana']);                     // 'apple and banana'
joinWords(['a', 'b'], { oxford: false });           // 'a and b'
joinWords(['a', 'b'], { quotes: true });            // '"a" and "b"'

// Grammar helpers
getArticle('apple');                                // 'an'
getArticle('banana');                               // 'a'
getArticle('apple', { includeWord: true });         // 'an apple'
getArticle('apple', { capitalize: true });          // 'An'

// HTML escaping (returns '' for falsy input)
escapeHTML('<script>alert("xss")</script>');        // '&lt;script&gt;...'
escapeHTML(null);                                   // ''
unescapeHTML('&lt;div&gt;Hello&lt;/div&gt;');       // '<div>Hello</div>'

// Unicode-aware string reversal
reverseString('hello');                             // 'olleh'
reverseString('Hello 👋');                          // '👋 olleH'
```

### Text Truncation
```javascript
import { truncate } from '@semantic-ui/utils';

truncate('This is a long text that needs truncating', 20);     // 'This is a long text…'
truncate('Short text', 20);                                    // 'Short text'
truncate('Hello world', 8, { suffix: '...' });                // 'Hello...'
truncate('Cut here exactly', 10, { wordBoundary: false });     // 'Cut here e…'
truncate('こんにちは世界です', 8, { locale: 'ja' });          // 'こんにちは…'
```

---

## Function Utilities (functions.js)

### Core
```javascript
import { noop, identity, wrapFunction } from '@semantic-ui/utils';

// noop — swallows arguments, returns undefined. Use as a reusable empty
// callback to avoid allocating fresh () => {} closures.
noop();                                // undefined
noop(42, 'ignored');                   // undefined

// identity — returns its first argument unchanged. Use as a pass-through
// default for transforms (e.g. `transform = mapFn ?? identity`).
identity(42);                          // 42
identity('hello');                     // 'hello'

// Wraps non-functions into a function that returns the value
const fn = wrapFunction('default');    // () => 'default'
const fn2 = wrapFunction(myFunc);     // myFunc (returned as-is if already a function)
```

### Async
```javascript
import { wait } from '@semantic-ui/utils';

await wait(300);                       // simple pause

// Cancellable — rejects with AbortError
const controller = new AbortController();
try {
  await wait(5000, { abortController: controller });
} catch(e) { /* e.name === 'AbortError' */ }

// Resolve instead of rejecting on abort
await wait(5000, { abortController: controller, rejectOnAbort: false });
```

### Memoization
```javascript
import { memoize } from '@semantic-ui/utils';

const expensive = memoize((a, b) => {
  return a * b;  // only computed once per unique args
});

// Custom hash function for complex args
const cached = memoize(fetchData, (args) => args[0].id);
```

### Bounded Cache
```javascript
import { createCache } from '@semantic-ui/utils';

// Map-like API with an upper bound. Reach for this instead of `new Map()`
// + manual size checks whenever you want memoization-style storage
// but need to guard against unbounded memory growth.

// LRU (default) — reads and re-sets refresh recency
const lru = createCache({ maxSize: 500 });
lru.set(key, value);
lru.get(key);
lru.has(key);

// FIFO — insertion order, reads do not matter
const fifo = createCache({ maxSize: 100, eviction: 'fifo' });

// Flush — clears the whole cache on overflow. Cheapest per-write;
// use when entries are quick to rebuild and bulk invalidation is fine.
const templates = createCache({
  maxSize: 5000,
  eviction: 'flush',
  onEvict: (key, value) => debug('evicted', key),
});

// Iteration mirrors Map
for (const [key, value] of lru) { ... }
lru.forEach((value, key, cache) => { ... });
```

### Debounce
```javascript
import { debounce } from '@semantic-ui/utils';

const debouncedSave = debounce(async (data) => {
  await saveToServer(data);
  return 'saved';
}, 300, {
  leading: false,         // default: don't execute on first call
  trailing: true,         // default: execute after wait
  maxWait: 1000,          // force execution after 1s max
  rejectSkipped: false,   // reject promises for skipped calls
  abortController: ctrl,  // cancel with AbortController
});

// All calls share the same promise
await debouncedSave('data');

// Control methods
debouncedSave.cancel();   // cancel pending, rejects promises with CANCELLED code
debouncedSave.flush();    // execute immediately
debouncedSave.pending();  // true if scheduled
```

### Throttle
```javascript
import { throttle } from '@semantic-ui/utils';

const throttled = throttle(handleScroll, 100, {
  leading: true,           // default: execute on first call
  trailing: true,          // default: execute after wait
  rejectSkipped: false,    // reject promises for skipped calls
  abortController: ctrl,
});

throttled.cancel();        // same control methods as debounce
throttled.flush();
throttled.pending();
```

---

## CSS Utilities (css.js)

```javascript
import { adoptStylesheet, extractCSS, scopeStyles } from '@semantic-ui/utils';

// Adopt CSS via constructable stylesheets with dedup caching
adoptStylesheet('.button { color: white; }');                // adopts to document
adoptStylesheet(css, shadowRoot);                            // adopts to shadow root
adoptStylesheet(css, element, { cacheStylesheet: false });   // skip cache

// Extract matching CSS rules from various sources
extractCSS('.button', cssString, { returnText: true });      // returns CSS text
extractCSS('.btn', stylesheet, { exactMatch: true });        // exact selector match
extractCSS('.widget', [sheet1, sheet2]);                     // from array of sheets

// Scope CSS rules under a selector
scopeStyles('.button { color: red; }', '.my-scope');
// '.my-scope .button { color: red; }'

// Replace :host for web component CSS porting
scopeStyles(':host(.active) { background: blue; }', '.widget', { replaceHost: true });
// '.widget.active { background: blue; }'
```

---

## HTML Utilities (html.js)

```javascript
import { indentLines, indentHTML } from '@semantic-ui/utils';

// Add uniform indentation to all lines
indentLines('line 1\nline 2', 4);    // '    line 1\n    line 2'

// Smart HTML indentation (handles void elements, self-closing, comments)
indentHTML('<div>\n<p>Content</p>\n</div>');
// <div>
//   <p>Content</p>
// </div>

indentHTML(html, { indent: '\t', startLevel: 1, trimEmptyLines: false });
```

---

## Browser Utilities (browser.js)

```javascript
import { copyText, openLink, getKeyFromEvent, idleCallback, getText, getJSON } from '@semantic-ui/utils';

// Clipboard
await copyText('Text to copy');

// Navigation — second arg is options object
openLink('https://example.com', { newWindow: true, target: '_blank' });

// Normalized keyboard event string with modifier prefixes
document.addEventListener('keydown', (event) => {
  const key = getKeyFromEvent(event);
  // Returns: 'esc', 'space', 'ctrl+s', 'shift+up', 'meta+alt+k', etc.
  // Normalizes: ArrowUp→'up', Escape→'esc', ' '→'space'
});

// Run when browser is idle (falls back to setTimeout on Safari)
idleCallback(() => performNonCriticalTask());

// Fetch helpers
const html = await getText('/api/content');
const data = await getJSON('/api/data');
```

### IP Address Detection
```javascript
import { getIPAddress } from '@semantic-ui/utils';

const publicIP = await getIPAddress();                    // '203.0.113.45' (string)
const localIPs = await getIPAddress({ type: 'local' });   // ['192.168.1.100'] (array)
const allIPs = await getIPAddress({ type: 'all' });        // [...local, ...public] (array)
```

---

## Date Formatting (dates.js)

```javascript
import { formatDate } from '@semantic-ui/utils';

const date = new Date('2023-12-25T15:30:00');

// Preset formats (moment.js-style shortcuts)
formatDate(date, 'LLL');              // 'December 25, 2023 3:30 PM' (default)
formatDate(date, 'L');                // '12/25/2023'
formatDate(date, 'LL');               // 'December 25, 2023'
formatDate(date, 'LT');              // '3:30 PM'

// Custom format tokens
formatDate(date, 'YYYY-MM-DD');       // '2023-12-25'
formatDate(date, 'MMM DD, YYYY');     // 'Dec 25, 2023'
formatDate(date, 'h:mm a');           // '3:30 pm'
formatDate(date, 'dddd, MMMM D');     // 'Monday, December 25'

// Locale and timezone (default timezone is 'UTC')
formatDate(date, 'MMMM DD, YYYY', { locale: 'fr-FR', timezone: 'Europe/Paris' });
formatDate(date, 'LT', { timezone: 'local' });   // use browser's local timezone
formatDate(date, 'LT', { timezone: 'PT' });       // shorthand timezone aliases supported
```

**Available tokens:** `YYYY`, `YY`, `MMMM`, `MMM`, `MM`, `M`, `DD`, `D`, `Do`, `dddd`, `ddd`, `HH`, `hh`, `h`, `mm`, `ss`, `a`

**Preset formats:** `LT`, `LTS`, `L`, `l`, `LL`, `ll`, `LLL`, `lll`, `LLLL`, `llll`

---

## Number Utilities (numbers.js)

```javascript
import { roundNumber, roundDecimal } from '@semantic-ui/utils';

// roundNumber — rounds to N significant digits
roundNumber(3.14159, 2);              // 3.1
roundNumber(0.001234, 3);             // 0.00123

// roundDecimal — rounds to N decimal places
roundDecimal(3.14159, 2);             // 3.14
roundDecimal(123.456, 1);             // 123.5
```

---

## Color Utilities (colors.js)

```javascript
import { oklchToRgb, oklchToHex } from '@semantic-ui/utils';

oklchToRgb('oklch(0.7 0.15 180)');    // { r: 0, g: 181, b: 155 }
oklchToHex('oklch(0.7 0.15 180)');    // '#00b59b'
oklchToHex('#ff5733');                 // '#ff5733' (hex passthrough)
```

---

## Crypto and Hashing (crypto.js)

```javascript
import {
  hashCode, prettifyHash, generateID, isValidID, parseID, getRandomSeed,
} from '@semantic-ui/utils';

// Deterministic 53-bit hash (cyrb53) — same input, same output. Cache/memo keys.
hashCode('input string');                          // numeric hash
hashCode('input', { prettify: true });             // base-36 string
hashCode('input', { seed: 0xABCD });               // seeded hash

// Numeric hash to alphanumeric string
prettifyHash(123456);                               // '002N9C'
prettifyHash(123, { minLength: 8, padChar: 'X' });  // 'XXXXXX3F'

// Unique ids — the usage preset carries the consensus length/shape per channel.
// db: sortable ULID (default) · page: 8-char letter-first CSS id · slug: URL ·
// token: 27-char + checksum. Plus length, prefix, checksum, format:'uuid', group.
generateID();                                       // '01KV61ZF26Z6BG7T04NVKSPJ7K'
generateID({ usage: 'page' });                      // 'dzadahv3'
generateID({ usage: 'token', prefix: 'sk_' });      // 'sk_…' with checksum
generateID.config = { usage: 'page' };              // app-wide default

// Validate offline before a lookup, parse the parts back out
isValidID(id, { usage: 'token', prefix: 'sk_' });   // checksum + shape, reads loose
parseID(dbId, { usage: 'db' });                     // { prefix, body, checksum, timestamp }

getRandomSeed();                                    // cryptographically random uint32
```

---

## Equality and Cloning (equality.js, cloning.js)

```javascript
import { isEqual, clone, deepFreeze } from '@semantic-ui/utils';

// Deep equality (handles arrays, objects, Maps, Sets, RegExp, Date, TypedArrays)
isEqual({ a: [1, 2] }, { a: [1, 2] });             // true
isEqual(new Set([1, 2]), new Set([1, 2]));          // true

// Options: { loose, ignoreKeys, partial }
isEqual('5', 5, { loose: true });                   // true — uses == instead of ===
isEqual(
  { a: 1, b: 2, c: 3 },
  { a: 1, b: 9, c: 3 },
  { ignoreKeys: ['b'] }
);                                                   // true — skips listed keys
isEqual(
  { a: 1 },
  { a: 1, b: 2 },
  { partial: true }
);                                                   // true — a is a subset of b

// Deep clone (handles Date, RegExp, Array, Map, Set, DOM nodes, plain objects)
const cloned = clone(obj);
clone(obj, { preserveDOM: true });                  // keep DOM node references
clone(obj, { preserveNonCloneable: true });         // keep class instance references

// Deep freeze in place — returns same reference, recursively frozen
// Only walks arrays and plain objects; Date/Map/Set/RegExp/DOM/class instances
// are skipped so their internal slots keep working. Cycle-safe via WeakSet.
const state = deepFreeze({ user: { name: 'Alice' }, createdAt: new Date() });
Object.isFrozen(state.user);        // true
Object.isFrozen(state.createdAt);   // false — Date is left alone
state.createdAt.setFullYear(2030);  // still works
state.user.name = 'Bob';            // TypeError in strict mode
```

---

## Iteration Utilities (loops.js)

### each — Universal Iterator
```javascript
import { each } from '@semantic-ui/utils';

// Works on arrays, objects, Maps, Sets, and iterables
each([1, 2, 3], (value, index) => { ... });
each({ a: 1 }, (value, key) => { ... });
each(new Map([['k', 'v']]), (value, key) => { ... });
each(new Set([1, 2]), (value, index) => { ... });

// Return false to break early
each([1, 2, 3, 4], (value) => {
  if (value === 3) return false;  // stops
});
```

### Async Iteration
```javascript
import { asyncEach, asyncMap } from '@semantic-ui/utils';

// Sequential async iteration (same collection support as each)
await asyncEach([1, 2, 3], async (value) => { ... });
await asyncEach(new Map([['a', 1]]), async (value, key) => { ... });

// Async mapping — return type matches input type
await asyncMap([1, 2, 3], async (x) => x * 2);                        // [2, 4, 6]
await asyncMap(new Map([['a', 1]]), async (v, k) => v * 10);          // Map([['a', 10]])
await asyncMap({ a: 1, b: 2 }, async (v, k) => v + 1);               // { a: 2, b: 3 }
```

---

## Debug Utilities (debug.js)

```javascript
import { log, fatal } from '@semantic-ui/utils';

// Styled console logging
log('App started');                                     // console.log
log('User action', 'debug', { namespace: 'UserService' });
log('Warning', 'warn', { timestamp: true, title: 'SYSTEM', titleColor: '#FF6B35' });

// JSON format for structured output
log('API response', 'info', { format: 'json', namespace: 'API', timestamp: true });

// Async fatal error (thrown via queueMicrotask)
fatal('Critical error', {
  errorType: TypeError,
  metadata: { code: 'SYS_ERROR' },
  removeStackLines: 1,
});
```

---

## RegExp Utilities (regexp.js)

```javascript
import { escapeRegExp } from '@semantic-ui/utils';

const pattern = new RegExp(escapeRegExp('price ($5.00)'), 'i');
```

---

## Quick Reference

### Arrays (arrays.js)
| Function | Signature | Returns |
|----------|-----------|---------|
| `unique` | `(arr)` | New array without duplicates |
| `filterEmpty` | `(arr)` | New array without falsy values |
| `first` | `(arr, n=1)` | First element, or first N as array |
| `last` | `(arr, n=1)` | Last element, or last N as array |
| `firstMatch` | `(arr, cbOrVal)` | First matching element |
| `findIndex` | `(arr, cbOrVal)` | Index of first match, or -1 |
| `remove` | `(arr, cbOrVal)` | Count removed (mutates array) |
| `inArray` | `(value, arr)` | Boolean |
| `range` | `(start, stop?, step=1)` | Numeric array (stop exclusive) |
| `sequence` | `(count, interval=1, start=1)` | Array of multiples |
| `sum` | `(arr)` | Number |
| `where` | `(arr, propsObj)` | Filtered array matching all props |
| `flatten` | `(arr)` | Deep-flattened array |
| `some` / `any` | `(collection, pred)` | Boolean |
| `sortBy` | `(arr, key\|keys, comparator?)` | New sorted array |
| `groupBy` | `(arr, prop)` | Object of grouped arrays |
| `moveItem` | `(arr, cbOrVal, index)` | Mutated array |
| `moveToFront` | `(arr, cbOrVal)` | Mutated array |
| `moveToBack` | `(arr, cbOrVal)` | Mutated array |
| `intersection` | `(...arrays)` | Common elements |
| `difference` | `(...arrays)` | In first, not in others |
| `uniqueItems` | `(...arrays)` | Elements unique to one array |

### Objects (objects.js)
| Function | Signature | Returns |
|----------|-----------|---------|
| `get` | `(obj, dotPath, keys?)` | Nested value or undefined (`[#id]` selects by identity) |
| `set` | `(obj, dotPath, value, keys?)` | Same object, intermediates created (`[#id]` replaces or appends) |
| `unset` | `(obj, dotPath, keys?)` | Same object, key removed (`[#id]` splices) |
| `keys` | `(obj)` | `Object.keys` or undefined |
| `values` | `(obj)` | `Object.values` or undefined |
| `hasProperty` | `(obj, prop)` | Own property check (shallow) |
| `extend` | `(obj, ...sources)` | Merged object (mutates target) |
| `assignInPlace` | `(target, source, opts?)` | Synced target or boolean |
| `deepExtend` | `(target, ...sources, opts?)` | Deep merged (mutates target) |
| `pick` | `(obj, ...keys)` | New object with selected keys |
| `onlyKeys` | `(obj, keysArray)` | New object with selected keys |
| `filterObject` | `(obj, fn(val,key))` | Filtered object |
| `mapObject` | `(obj, fn(val,key))` | Transformed object |
| `trackWrites` | `(value, callback, opts?)` | `{ changed, paths, result }` (keyed `field[#id]` paths by default) |
| `trackReads` | `(value, callback, opts?)` | `{ reads, structure, result }` — read companion to `trackWrites`, read-only proxy, keyed by default |
| `elementKey` | `(item, keys?)` | First present id field, or undefined |
| `detectChanges` | `(before, after, opts?)` | `{ added, removed, changed }` paths (keyed by identity by default, `{ keyed: false }` for positional; `equality`, `ignoreKeys`, `collapseKeys`) |
| `arrayFromObject` | `(obj)` | `[{key, value}, ...]` |
| `reverseKeys` | `(obj)` | Inverted lookup object |
| `proxyObject` | `(getterFn, refObj)` | Read-through Proxy |
| `weightedObjectSearch` | `(query, arr, opts)` | Relevance-sorted array |

### Types (types.js + environment.js)
| Function | Notes |
|----------|-------|
| `isObject` | Any non-null object (includes arrays) |
| `isPlainObject` | Object literals and `Object.create(null)` |
| `isArray`, `isString`, `isNumber`, `isBoolean`, `isFunction` | Standard checks |
| `isDate` | Tag dispatch, cross-realm safe |
| `isRegExp` | Tag dispatch, cross-realm safe |
| `isBinary` | TypedArrays and ArrayBuffer |
| `isEmpty` | null, undefined, empty string/array, object with only nullish values |
| `isPromise` | Has `.then` method |
| `isDOM` | Element, Document, window, DocumentFragment |
| `isNode` | Has `nodeType` |
| `isClassInstance` | Excludes built-in types |
| `isIterable` | Has `Symbol.iterator` |
| `isMap`, `isSet` | `instanceof` checks |
| `isArguments` | Arguments object |
| `isServer`, `isClient`, `isDevelopment`, `isCI` | **Boolean constants** (no parens) |

### Equality & Cloning (equality.js, cloning.js)
| Function | Signature | Returns |
|----------|-----------|---------|
| `isEqual` | `(a, b, opts?)` | Boolean — opts: `{ loose, ignoreKeys, partial }` |
| `clone` | `(obj, opts?)` | Deep clone — opts: `{ preserveDOM, preserveNonCloneable }` |
| `deepFreeze` | `(value)` | Same reference, recursively frozen — skips Date/Map/Set/RegExp/DOM/class instances |

### Functions (functions.js)
| Function | Signature | Returns |
|----------|-----------|---------|
| `noop` | `()` | `undefined` — swallows args, reusable empty callback |
| `identity` | `(v)` | `v` — returns first arg unchanged |
| `wrapFunction` | `(x)` | `x` if function, else `() => x` |
| `memoize` | `(fn, hashFn?)` | Memoized function |
| `wait` | `(ms, opts?)` | Promise |
| `debounce` | `(fn, ms, opts?)` | Debounced fn with `.cancel()/.flush()/.pending()` |
| `throttle` | `(fn, ms, opts?)` | Throttled fn with `.cancel()/.flush()/.pending()` |

### Cache (cache.js)
| Function | Signature | Returns |
|----------|-----------|---------|
| `createCache` | `({ maxSize, eviction='lru', onEvict? })` | Bounded Map-like cache. Eviction: `'lru'` \| `'fifo'` \| `'flush'` |

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Reactive State** | `reactive-state` | Using signals and reactions alongside utility functions |
| **Query & Behaviors** | `query-behaviors` | DOM queries and events that complement utility functions |
| **Mental Model** | `mental-model` | Understanding how utils fits into the SUI framework |
