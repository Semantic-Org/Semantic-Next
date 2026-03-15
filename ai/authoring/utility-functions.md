---
title: Utility Functions Reference
description: Complete reference for @semantic-ui/utils — a standalone utility library providing functions for arrays, objects, strings, type checking, colors, dates, and more. Use this before reimplementing common operations.
keywords: [utilities, arrays, objects, strings, type checking, functions, debounce, throttle, memoize, clone, equality, formatDate, each, range, remove, noop]
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
import { range, sum } from '@semantic-ui/utils';

range(5);                            // [0, 1, 2, 3, 4]
range(2, 6);                         // [2, 3, 4, 5]
range(0, 10, 2);                     // [0, 2, 4, 6, 8]

sum([1, 2, 3, 4]);                   // 10
```

---

## Object Utilities (objects.js)

### Property Access
```javascript
import { get, keys, values, hasProperty } from '@semantic-ui/utils';

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

// hasProperty checks own properties only (shallow, no dot paths)
hasProperty(data, 'user');                   // true
hasProperty(data, 'toString');               // false (inherited)

// Safe key/value extraction (returns undefined for non-objects)
keys({ a: 1, b: 2 });                       // ['a', 'b']
values({ a: 1, b: 2 });                     // [1, 2]
```

### Object Manipulation
```javascript
import { extend, deepExtend, pick, onlyKeys, filterObject, mapObject } from '@semantic-ui/utils';

// Shallow merge (preserves getter/setter descriptors)
extend({ a: 1 }, { b: 2 }, { c: 3 });       // { a: 1, b: 2, c: 3 }

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
isPlainObject({});               // true (only Object literals, excludes class instances)
isPlainObject([]);               // false
isArray([]);                     // true
isString('hello');               // true
isNumber(42);                    // true
isBoolean(true);                 // true
isFunction(() => {});            // true
isBinary(new Uint8Array());      // true (TypedArrays and ArrayBuffer)
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
import { kebabToCamel, camelToKebab, capitalize, capitalizeWords, toTitleCase } from '@semantic-ui/utils';

kebabToCamel('my-component-name');       // 'myComponentName'
camelToKebab('myComponentName');         // 'my-component-name'
capitalize('hello world');               // 'Hello world'
capitalizeWords('hello world');          // 'Hello World'
toTitleCase('the quick brown fox');      // 'The Quick Brown Fox' (respects stop words: the, a, of, etc.)
```

### Text Processing
```javascript
import { joinWords, getArticle, escapeHTML, unescapeHTML, reverseString } from '@semantic-ui/utils';

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

// HTML escaping
escapeHTML('<script>alert("xss")</script>');        // '&lt;script&gt;...'
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
import { noop, wrapFunction } from '@semantic-ui/utils';

// Identity function — returns its argument
noop(42);                              // 42
noop('hello');                         // 'hello'

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
import { hashCode, prettifyHash, generateID, getRandomSeed, tokenize } from '@semantic-ui/utils';

// UMASH-based string hashing
hashCode('input string');                          // 3421556088 (numeric)
hashCode('input', { prettify: true });             // 'XXXXXX' (alphanumeric)
hashCode('input', { seed: 0xABCD });               // seeded hash

// Numeric hash to alphanumeric string
prettifyHash(123456);                               // '002N9C'
prettifyHash(123, { minLength: 8, padChar: 'X' });  // 'XXXXXX3F'

// ID generation
generateID();                                       // 'A7B3X9' (random)
generateID(12345);                                  // '00009IX' (reproducible from seed)
getRandomSeed();                                    // cryptographically random uint32

// URL-friendly slug
tokenize('Hello World!');                           // 'hello-world'
```

---

## Equality and Cloning (equality.js, cloning.js)

```javascript
import { isEqual, clone } from '@semantic-ui/utils';

// Deep equality (handles arrays, objects, Maps, Sets, RegExp, Date, TypedArrays)
isEqual({ a: [1, 2] }, { a: [1, 2] });             // true
isEqual(new Set([1, 2]), new Set([1, 2]));          // true

// Deep clone (handles Date, RegExp, Array, Map, Set, DOM nodes, plain objects)
const cloned = clone(obj);
clone(obj, { preserveDOM: true });                  // keep DOM node references
clone(obj, { preserveNonCloneable: true });         // keep class instance references
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
| `range` | `(start, stop?, step=1)` | Numeric array |
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
| `get` | `(obj, dotPath)` | Nested value or undefined |
| `keys` | `(obj)` | `Object.keys` or undefined |
| `values` | `(obj)` | `Object.values` or undefined |
| `hasProperty` | `(obj, prop)` | Own property check (shallow) |
| `extend` | `(obj, ...sources)` | Merged object (mutates target) |
| `deepExtend` | `(target, ...sources, opts?)` | Deep merged (mutates target) |
| `pick` | `(obj, ...keys)` | New object with selected keys |
| `onlyKeys` | `(obj, keysArray)` | New object with selected keys |
| `filterObject` | `(obj, fn(val,key))` | Filtered object |
| `mapObject` | `(obj, fn(val,key))` | Transformed object |
| `arrayFromObject` | `(obj)` | `[{key, value}, ...]` |
| `reverseKeys` | `(obj)` | Inverted lookup object |
| `proxyObject` | `(getterFn, refObj)` | Read-through Proxy |
| `weightedObjectSearch` | `(query, arr, opts)` | Relevance-sorted array |

### Types (types.js + environment.js)
| Function | Notes |
|----------|-------|
| `isObject` | Any non-null object (includes arrays) |
| `isPlainObject` | Object literals only |
| `isArray`, `isString`, `isNumber`, `isBoolean`, `isFunction` | Standard checks |
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

### Functions (functions.js)
| Function | Signature | Returns |
|----------|-----------|---------|
| `noop` | `(v)` | `v` (identity function) |
| `wrapFunction` | `(x)` | `x` if function, else `() => x` |
| `memoize` | `(fn, hashFn?)` | Memoized function |
| `wait` | `(ms, opts?)` | Promise |
| `debounce` | `(fn, ms, opts?)` | Debounced fn with `.cancel()/.flush()/.pending()` |
| `throttle` | `(fn, ms, opts?)` | Throttled fn with `.cancel()/.flush()/.pending()` |

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Reactive State** | `reactive-state` | Using signals and reactions alongside utility functions |
| **Query & Behaviors** | `query-behaviors` | DOM queries and events that complement utility functions |
| **Mental Model** | `mental-model` | Understanding how utils fits into the SUI framework |
