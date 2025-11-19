# Semantic UI Utils Package Guide

**For AI agents working with Semantic UI's `@semantic-ui/utils` package**

## Overview

The `@semantic-ui/utils` package is a comprehensive standalone utility library providing functions for arrays, objects, strings, type checking, colors, dates, and more. It's designed to be framework-agnostic and serves as the foundation for other Semantic UI packages while being useful for any JavaScript application.

## Package Structure

The package is organized into **18 specialized modules**, each focused on a specific domain:

```
@semantic-ui/utils
├── arrays.js      ← Array manipulation and processing (27+ functions)
├── objects.js     ← Object operations and property access (15+ functions)
├── types.js       ← Type checking and validation (15+ functions)
├── strings.js     ← String formatting and transformation (8+ functions)
├── functions.js   ← Function utilities and higher-order functions
├── colors.js      ← OKLCH to RGB/Hex color conversion
├── css.js         ← CSS stylesheet adoption, extraction, and scoping
├── html.js        ← HTML indentation and text formatting
├── browser.js     ← Browser-specific operations and XHR
├── looping.js     ← Iteration utilities for objects and arrays
├── dates.js       ← Date formatting with internationalization
├── numbers.js     ← Number formatting and rounding
├── crypto.js      ← Hashing and ID generation
├── equality.js    ← Deep equality comparison
├── cloning.js     ← Deep cloning of objects and arrays
├── debug.js       ← Logging, debugging, and error handling
├── environment.js  ← Environment detection (server/client/dev/CI)
└── regexp.js      ← Regular expression and HTML escaping
```

**Main Import**:
```javascript
import { functionName } from '@semantic-ui/utils';
// All functions are available as named exports
```

## Array Utilities (arrays.js)

### Basic Operations
```javascript
import { unique, filterEmpty, first, last, flatten } from '@semantic-ui/utils';

const items = [1, 2, 2, 3, null, '', 4];

unique(items);                    // [1, 2, 3, null, '', 4] - removes duplicates
filterEmpty(items);               // [1, 2, 2, 3, 4] - removes null, undefined, ''
first(items);                     // 1 - first element
last(items);                      // 4 - last element
flatten([[1, 2], [3, [4, 5]]]);   // [1, 2, 3, 4, 5] - deep flatten
```

### Advanced Processing
```javascript
import { sortBy, groupBy, where } from '@semantic-ui/utils';

const users = [
  { name: 'Alice', age: 30, role: 'admin' },
  { name: 'Bob', age: 25, role: 'user' },
  { name: 'Carol', age: 35, role: 'admin' }
];

// Sort by property
sortBy(users, 'age');                    // Sorted by age ascending

// Group by property
groupBy(users, 'role');                  // { admin: [...], user: [...] }

// Filter by criteria
where(users, { role: 'admin' });         // All admin users
```

### Array Manipulation
```javascript
import { moveItem, moveToFront, moveToBack } from '@semantic-ui/utils';

const items = ['a', 'b', 'c', 'd'];

moveItem(items, 1, 3);           // ['a', 'c', 'd', 'b'] - move 'b' to position 3
moveToFront(items, 'c');         // ['c', 'a', 'b', 'd'] - move 'c' to front
moveToBack(items, 'a');          // ['c', 'b', 'd', 'a'] - move 'a' to back
```

### Set Operations
```javascript
import { intersection, difference, uniqueItems } from '@semantic-ui/utils';

const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];

intersection(arr1, arr2);        // [3, 4] - common elements
difference(arr1, arr2);          // [1, 2] - elements in arr1 but not arr2
uniqueItems([arr1, arr2]);       // [1, 2, 3, 4, 5, 6] - unique across all arrays
```

### Additional Operations
```javascript
import { findIndex, inArray } from '@semantic-ui/utils';

const items = [{ id: 1, name: 'Apple' }, { id: 2, name: 'Banana' }];

findIndex(items, item => item.id === 2);
inArray('search', ['apple', 'banana', 'search', 'orange']);
```

## Object Utilities (objects.js)

### Property Access
```javascript
import { get, hasProperty } from '@semantic-ui/utils';

const data = {
  user: {
    profile: {
      name: 'Alice',
      settings: { theme: 'dark' }
    },
    posts: [
      { title: 'First Post', tags: ['tech', 'web'] }
    ]
  }
};

// Nested property access
get(data, 'user.profile.name');              // 'Alice'
get(data, 'user.posts.0.title');             // 'First Post'
get(data, 'user.profile.bio', 'No bio');     // 'No bio' (default value)

// Check property existence
hasProperty(data, 'user.profile.name');      // true
```

### Object Manipulation
```javascript
import { extend, deepExtend, pick, filterObject, mapObject } from '@semantic-ui/utils';

const source = { a: 1, b: 2, c: 3, d: 4 };
const target = { b: 10, e: 5 };

// Shallow merge objects
extend(target, source);                      // { a: 1, b: 2, c: 3, d: 4, e: 5 }

// Deep merge objects with nested properties
const config = {
  api: { baseUrl: 'localhost', timeout: 5000 },
  features: { darkMode: false }
};
const overrides = {
  api: { timeout: 3000, retries: 3 },
  features: { notifications: true }
};

deepExtend(config, overrides);
// Result: {
//   api: { baseUrl: 'localhost', timeout: 3000, retries: 3 },
//   features: { darkMode: false, notifications: true }
// }

// Deep merge with custom class preservation
const settings = {
  template: new MyTemplate(),
  data: { items: [1, 2, 3] }
};
deepExtend(settings, { data: { items: [4, 5] } }, { preserveNonCloneable: true });
// Preserves MyTemplate instance, merges data.items array

// Select properties
pick(source, ['a', 'c']);                    // { a: 1, c: 3 }

// Filter and transform
filterObject(source, (value, key) => value > 2);  // { c: 3, d: 4 }
mapObject(source, (value, key) => value * 2);     // { a: 2, b: 4, c: 6, d: 8 }
```

### Advanced Object Operations
```javascript
import { weightedObjectSearch, reverseKeys, proxyObject } from '@semantic-ui/utils';

const items = [
  { name: 'Apple iPhone', category: 'phone', tags: ['mobile', 'apple'] },
  { name: 'Samsung Galaxy', category: 'phone', tags: ['mobile', 'android'] },
  { name: 'iPad Pro', category: 'tablet', tags: ['tablet', 'apple'] }
];

// Weighted search across object properties
const results = weightedObjectSearch(items, 'apple', {
  name: 3,           // Name matches weighted 3x
  category: 1,       // Category matches weighted 1x
  tags: 2           // Tag matches weighted 2x
});
// Returns items sorted by relevance score

// Reverse object key-value pairs
const statusMap = { active: 1, inactive: 0, pending: 2 };
reverseKeys(statusMap);          // { 1: 'active', 0: 'inactive', 2: 'pending' }

// Create reactive proxy
const reactive = proxyObject(source, {
  onChange: (key, value, oldValue) => {
    console.log(`${key} changed from ${oldValue} to ${value}`);
  }
});
```

## Type Checking (types.js)

### Basic Type Checks
```javascript
import { 
  isObject, isArray, isString, isNumber, isFunction, isBoolean,
  isEmpty, isPlainObject, isSet, isMap
} from '@semantic-ui/utils';

// Standard type checking
isObject({});                    // true
isArray([]);                     // true
isString('hello');               // true
isNumber(42);                    // true
isFunction(() => {});            // true
isBoolean(true);                 // true

// Collection type checking
isSet(new Set([1, 2, 3]));       // true
isSet([1, 2, 3]);                // false
isMap(new Map([['a', 1]]));      // true
isMap({ a: 1 });                 // false

// Special cases
isEmpty('');                     // true
isEmpty([]);                     // true
isEmpty({});                     // true
isPlainObject({});               // true (excludes class instances)

// Type-safe collection operations
function processCollection(data) {
  if (isSet(data)) {
    return `Set with ${data.size} unique items`;
  } else if (isMap(data)) {
    return `Map with ${data.size} key-value pairs`;
  } else if (isArray(data)) {
    return `Array with ${data.length} elements`;
  }
  return 'Unknown collection type';
}
```

### Advanced Type Checks
```javascript
import { isDOM, isNode, isClassInstance, isPromise, isClient, isServer, isDevelopment, isCI } from '@semantic-ui/utils';

// DOM-related checks
isDOM(document.body);            // true
isNode(document.createTextNode('text')); // true

// Class and promise detection
class MyClass {}
const instance = new MyClass();
isClassInstance(instance);       // true
isPromise(fetch('/api'));        // true

// Environment detection
isClient();                      // true in browser
isServer();                      // true in Node.js/server environment
isDevelopment();                 // true in development environments
isCI();                          // true in CI/CD pipelines
```

## String Utilities (strings.js)

### Case Conversion
```javascript
import { kebabToCamel, camelToKebab, capitalize, toTitleCase } from '@semantic-ui/utils';

// Case transformations
kebabToCamel('my-component-name');       // 'myComponentName'
camelToKebab('myComponentName');         // 'my-component-name'
capitalize('hello world');               // 'Hello world'
toTitleCase('hello world');              // 'Hello World'
```

### Text Processing
```javascript
import { joinWords, getArticle, escapeHTML, truncate, reverseString } from '@semantic-ui/utils';

// Smart word joining with Oxford comma
joinWords(['apple', 'banana', 'orange']);           // 'apple, banana, and orange'
joinWords(['apple', 'banana']);                     // 'apple and banana'

// Grammar helpers
getArticle('apple');                                // 'an'
getArticle('banana');                               // 'a'

// HTML escaping
escapeHTML('<script>alert("xss")</script>');        // Safe HTML output

// String reversal with Unicode support
reverseString('hello');                             // 'olleh'
reverseString('Hello 👋');                          // '👋 olleH'
reverseString('🇺🇸🇬🇧');                             // '🇬🇧🇺🇸' (preserves flag emojis)
```

### Text Truncation
```javascript
import { truncate } from '@semantic-ui/utils';

// Basic text truncation with Unicode support
truncate('This is a long text that needs truncating', 20);     // 'This is a long text…'
truncate('Short text', 20);                                    // 'Short text'

// Word boundary handling
truncate('This is a very long sentence', 15);                  // 'This is a very…'
truncate('verylongtextwithoutspaces', 12);                     // 'verylongtext…'

// Custom suffix and options
truncate('Hello world', 8, { suffix: '...' });                // 'Hello...'
truncate('Cut at exact length', 10, { wordBoundary: false });  // 'Cut at exa…'

// Unicode and emoji support
truncate('Hello 👋 World 🌍', 10);                           // 'Hello 👋…'

// Locale-aware segmentation for international text
truncate('こんにちは世界です', 8, { locale: 'ja' });          // 'こんにちは…'
```

## Color System (colors.js)

### OKLCH to RGB/Hex Conversion
```javascript
import { oklchToRgb, oklchToHex } from '@semantic-ui/utils';

// Modern color space conversion
const oklchColor = 'oklch(0.7 0.15 180)';          // Lightness, Chroma, Hue

// Convert to RGB
const rgb = oklchToRgb(oklchColor);                 // { r: 123, g: 156, b: 89 }

// Convert to Hex
const hex = oklchToHex(oklchColor);                 // '#7b9c59'

// Passthrough for existing hex colors
const existingHex = oklchToHex('#ff5733');          // '#ff5733' (unchanged)
```

## Function Utilities (functions.js)

### Higher-Order Functions
```javascript
import { memoize, debounce, throttle, wrapFunction } from '@semantic-ui/utils';

// Memoization with custom hash function
const expensiveFunction = memoize((a, b, c) => {
  // Expensive computation
  return a * b * c;
}, (a, b, c) => `${a}-${b}-${c}`);  // Custom hash function

// Debouncing with async support and options
const debouncedSave = debounce(async (data) => {
  await saveToServer(data);
  return 'saved';
}, 300, { 
  leading: true,      // Execute on first call
  maxWait: 1000,      // Force execution after 1s max
  abortController: controller
});

// All calls resolve to same result via promise sharing
Promise.all([
  debouncedSave('data1'),
  debouncedSave('data2'),  // Only this executes
  debouncedSave('data3')
]).then(results => {
  // All resolve to 'saved'
});

// Throttling for high-frequency events
const throttledScroll = throttle(handleScroll, 100);     // Leading + trailing
const throttledClick = throttle(handleClick, 1000, { 
  leading: true, 
  trailing: false 
});

// Rate limiting API calls
const rateLimitedAPI = throttle(apiCall, 2000);
rateLimitedAPI('/users');    // Executes immediately
rateLimitedAPI('/posts');    // Queued for trailing
rateLimitedAPI('/comments'); // Replaces previous trailing

// Method usage
debouncedSave.cancel();      // Cancel pending
debouncedSave.flush();       // Execute immediately
debouncedSave.pending();     // Check if scheduled

// Safe function wrapping
const safeFunction = wrapFunction(riskyFunction);
const result = safeFunction(args); // Won't throw errors
```

## CSS Utilities (css.js)

### Stylesheet Management
```javascript
import { adoptStylesheet, extractCSS, scopeStyles } from '@semantic-ui/utils';

// Adopt CSS to document or shadow root with caching
adoptStylesheet('.button { background: blue; color: white; }');

// Adopt to shadow root with custom options
const shadowRoot = element.attachShadow({ mode: 'open' });
adoptStylesheet(css, shadowRoot, { cacheStylesheet: false });

// Extract matching CSS rules
const buttonCSS = extractCSS('.button', cssString, { returnText: true });
const exactMatch = extractCSS('.btn', css, { exactMatch: true });

// Extract from multiple sources
const widgetRules = extractCSS('.widget', [sheet1, sheet2]);
```

### CSS Scoping and Web Components
```javascript
import { scopeStyles } from '@semantic-ui/utils';

// Basic scoping - prepends selector to all rules
const scoped = scopeStyles('.button { color: red; }', '.my-component');
// Result: .my-component .button { color: red; }

// Web component CSS porting with :host replacement
const hostCSS = ':host { display: block; } :host(.active) { background: blue; }';
const ported = scopeStyles(hostCSS, '.widget', { replaceHost: true });
// Result: .widget { display: block; } .widget.active { background: blue; }

// Root element handling
const rootCSS = 'html { font-size: 16px; } body { margin: 0; }';
const rootScoped = scopeStyles(rootCSS, '.app', { appendToRootElements: false });
// Result: .app html { font-size: 16px; } .app body { margin: 0; }
```

## HTML Utilities (html.js)

### Text Indentation
```javascript
import { indentLines } from '@semantic-ui/utils';

// Add consistent indentation to all lines
const code = 'line 1\nline 2\nline 3';
indentLines(code);              // '  line 1\n  line 2\n  line 3' (2 spaces)
indentLines(code, 4);           // '    line 1\n    line 2\n    line 3' (4 spaces)

// Useful for template processing
const template = `
function example() {
  return true;
}
`;
const indented = indentLines(template.trim(), 2);
```

### HTML Indentation
```javascript
import { indentHTML } from '@semantic-ui/utils';

// Basic HTML indentation
const html = '<div>\n<p>Content</p>\n</div>';
indentHTML(html);
// Result:
// <div>
//   <p>Content</p>
// </div>

// Handles nested structures
const nested = `
<div class="ui segment">
<div class="ui header">Title</div>
<p>Content here</p>
<div class="ui list">
<div class="item">
<img src="image.jpg" />
<div class="content">Item 1</div>
</div>
</div>
</div>
`;

indentHTML(nested);
// Result:
// <div class="ui segment">
//   <div class="ui header">Title</div>
//   <p>Content here</p>
//   <div class="ui list">
//     <div class="item">
//       <img src="image.jpg" />
//       <div class="content">Item 1</div>
//     </div>
//   </div>
// </div>

// Custom indentation
indentHTML(html, { indent: '    ' });    // 4 spaces
indentHTML(html, { indent: '\t' });      // Tabs

// Start at specific nesting level
indentHTML(html, { startLevel: 1 });     // Start with one level of indent

// Preserve empty lines
indentHTML(html, { trimEmptyLines: false });
```

**Common use cases:**
- Cleaning up HTML extracted from JavaScript template literals
- Formatting documentation examples
- Processing HTML snippets from various sources
- Preparing HTML for display in code editors

**Handles correctly:**
- Void elements (img, br, hr, input, etc.) - no closing tag needed
- Self-closing syntax (`<component />`)
- Comments (`<!-- comment -->`)
- Elements with opening/closing on same line
- Multiple nesting levels

**Limitations:**
- Works best with one tag per line (typical documentation format)
- Multiple tags on same line are not split
- Designed for well-formed HTML snippets, not error correction

## Browser Integration (browser.js)

### Clipboard and Navigation
```javascript
import { copyText, openLink, getKeyFromEvent, getIPAddress } from '@semantic-ui/utils';

// Clipboard operations
await copyText('Text to copy');     // Returns promise

// Navigation
openLink('https://example.com', '_blank');

// Keyboard handling
document.addEventListener('keydown', (event) => {
  const key = getKeyFromEvent(event);  // Normalized key handling
  if (key === 'Escape') {
    closeModal();
  }
});

// IP address detection
const publicIP = await getIPAddress();                   // '203.0.113.45' (default)
const localIPs = await getIPAddress({ type: 'local' });  // ['192.168.1.100', '10.0.0.5']
const allIPs = await getIPAddress({ type: 'all' });      // ['192.168.1.100', '10.0.0.5', '203.0.113.45']
```

### Async Operations
```javascript
import { idleCallback, getText, getJSON } from '@semantic-ui/utils';

// Run when browser is idle
idleCallback(() => {
  performNonCriticalTask();
});

// Fetch utilities
const htmlContent = await getText('/api/content');
const apiData = await getJSON('/api/data');
```

## Date Formatting (dates.js)

### Internationalized Date Formatting
```javascript
import { formatDate } from '@semantic-ui/utils';

const date = new Date('2023-12-25T15:30:00');

// Basic formatting
formatDate(date, 'YYYY-MM-DD');                    // '2023-12-25'
formatDate(date, 'MMM DD, YYYY');                  // 'Dec 25, 2023'
formatDate(date, 'HH:mm:ss');                      // '15:30:00'

// With locale and timezone
formatDate(date, 'MMMM DD, YYYY', {
  locale: 'fr-FR',                                  // French locale
  timezone: 'Europe/Paris'                          // Paris timezone
});
// 'décembre 25, 2023'

// Relative formatting
formatDate(date, 'relative');                      // 'in 2 days' or '2 days ago'
```

## Number Utilities (numbers.js)

### Number Processing
```javascript
import { roundNumber, roundDecimal } from '@semantic-ui/utils';

// Number rounding
roundNumber(3.14159, 2);                           // 3.14
roundDecimal(123.456, 1);                          // 123.5
```

## Crypto and Hashing (crypto.js)

### ID Generation and Hashing
```javascript
import { generateID, hashCode, prettifyHash, getRandomSeed, tokenize } from '@semantic-ui/utils';

// Generate unique IDs
const uniqueId = generateID();                      // 'A7B3X9'
const seededId = generateID(12345);                 // '00009IX' (reproducible)

// Get cryptographically secure random seed
const seed = getRandomSeed();                      // 2949673445

// String hashing using UMASH algorithm
const hash = hashCode('input string');              // 3421556088
const prettyHash = hashCode('input', { prettify: true }); // '2A8KG8'

// Convert numeric hash to alphanumeric
const pretty = prettifyHash(123456);                // '000U9C'
const customPretty = prettifyHash(123, { 
  minLength: 8, 
  padChar: 'X' 
});                                                 // 'XXXXXX3F'

// Create URL-friendly tokens
const token = tokenize('Hello World!');             // 'hello-world'
```

## Equality and Cloning (equality.js, cloning.js)

### Deep Comparison and Cloning
```javascript
import { isEqual, clone } from '@semantic-ui/utils';

const obj1 = { a: 1, b: { c: 2, d: [3, 4] } };
const obj2 = { a: 1, b: { c: 2, d: [3, 4] } };

// Deep equality
isEqual(obj1, obj2);                                // true

// Deep cloning
const cloned = clone(obj1);
cloned.b.c = 99;
console.log(obj1.b.c);                             // 2 (original unchanged)
```

## Debug Utilities (debug.js)

### Logging and Error Management
```javascript
import { log, fatal } from '@semantic-ui/utils';

// Flexible logging with levels and formatting
log('Application started', 'info');                     // Basic info log
log('User action', 'debug', {                           // Debug with namespace
  namespace: 'UserService',
  data: [{ action: 'login', userId: 123 }]
});

// JSON format for structured logging
log('API response', 'info', {                           // Structured output
  format: 'json',
  namespace: 'ApiClient',
  timestamp: true,
  data: [{ status: 200, endpoint: '/api/users' }]
});

// Custom styling and colors
log('Important notice', 'warn', {                       // Custom title styling
  title: 'SYSTEM',
  titleColor: '#FF6B35',
  timestamp: true
});

// Fatal error handling with metadata
fatal('Critical system error', {                        // Async error throwing
  errorType: TypeError,
  metadata: { code: 'SYS_ERROR' }
});
```

## Iteration Utilities (looping.js)

### Enhanced Iteration
```javascript
import { each, asyncEach, asyncMap } from '@semantic-ui/utils';

// Array iteration
each([1, 2, 3], (value, index) => {
  console.log(`Item ${index}: ${value}`);
});

// Object iteration
each({ a: 1, b: 2 }, (value, key) => {
  console.log(`${key}: ${value}`);
});

// Set iteration (index is 0-based counter)
each(new Set(['apple', 'banana']), (value, index) => {
  console.log(`Set item ${index}: ${value}`);
});

// Map iteration (preserves key types)
each(new Map([['key1', 'val1'], [2, 'val2']]), (value, key) => {
  console.log(`${key}: ${value}`);  // key1: val1, 2: val2
});

// Breaking iteration early
each([1, 2, 3, 4], (value) => {
  if (value === 3) return false;  // stops iteration
});

// Async iterations with Set/Map support
await asyncEach(new Set([1, 2, 3]), async (value) => {
  await processAsync(value);
});

await asyncEach(new Map([['a', 1], ['b', 2]]), async (value, key) => {
  await updateEntry(key, value);
});

// Async mapping - arrays return arrays
const results = await asyncMap([1, 2, 3], async (x) => x * 2);      // [2, 4, 6]

// Async Set mapping - returns array
const setResults = await asyncMap(new Set([1, 2, 3]), async (x) => x * 2); // [2, 4, 6]

// Async Map mapping - returns new Map with same keys
const mapResults = await asyncMap(
  new Map([['a', 1], ['b', 2]]), 
  async (value, key) => value * 10
);                                                                   // Map([['a', 10], ['b', 20]])
```

## RegExp Utilities (regexp.js)

### Text Escaping
```javascript
import { escapeRegExp } from '@semantic-ui/utils';

// RegExp escaping for safe pattern matching
const userInput = 'Hello (world)';
const pattern = new RegExp(escapeRegExp(userInput), 'i');
```

## Performance Considerations

### Size-Aware Algorithms
Many utility functions use different algorithms based on data size:

```javascript
// Array operations automatically choose optimal algorithms
const smallArray = [1, 2, 3];                     // Uses simple iteration
const largeArray = new Array(10000).fill(0);      // Uses optimized algorithms

// Functions adapt to input size
unique(smallArray);        // O(n) algorithm
unique(largeArray);        // O(n log n) or Set-based algorithm
```

### Memory Management
```javascript
// Efficient cloning based on data type
const shallowData = { a: 1, b: 2 };
const deepData = { a: { b: { c: [1, 2, 3] } } };

clone(shallowData);        // Optimized shallow clone
clone(deepData);           // Deep clone with cycle detection
```

## Integration Patterns

### With Other Semantic UI Packages
```javascript
// Utils with Reactivity
import { Signal } from '@semantic-ui/reactivity';
import { debounce, throttle, memoize } from '@semantic-ui/utils';

const searchQuery = new Signal('');
const debouncedSearch = debounce(async (query) => {
  const results = await performSearch(query);
  return results;
}, 300, { maxWait: 1000 });

// Throttled reactive updates
const scrollPosition = new Signal(0);
const throttledScroll = throttle((position) => {
  scrollPosition.value = position;
}, 16); // ~60fps

// Utils with Query
import { $ } from '@semantic-ui/query';
import { formatDate, copyText } from '@semantic-ui/utils';

$('.date').text(formatDate(new Date(), 'MMM DD, YYYY'));
$('.copy-btn').on('click', () => copyText($('.content').text()));
```

### Standalone Usage
```javascript
// Complete utility toolkit for any project
import { 
  sortBy, groupBy, where,           // Array processing
  get, set, extend,                 // Object manipulation
  isObject, isArray, isEmpty,       // Type checking
  formatDate, formatNumber,         // Formatting
  debounce, throttle, memoize,     // Function utilities
  oklchToHex                       // Color conversion
} from '@semantic-ui/utils';

// Build complex data processing pipelines
const processUserData = (users) => {
  return sortBy(
    where(users, 'active', true),   // Filter active users
    'lastLoginDate'                 // Sort by last login
  ).map(user => ({
    ...user,
    displayName: get(user, 'profile.displayName', user.email),
    lastLogin: formatDate(user.lastLoginDate, 'MMM DD, YYYY')
  }));
};
```

## Key Principles

1. **Framework Agnostic**: All utilities work in any JavaScript environment
2. **Performance Optimized**: Algorithms adapt to data size and type
3. **Type Safe**: Comprehensive type checking and validation
4. **Modern Standards**: Uses ES6+ features and modern APIs
5. **Tree Shakeable**: Import only what you need
6. **Error Resilient**: Graceful handling of edge cases
7. **Cross-Platform**: Works in browser, Node.js, and other environments

## Common Use Cases

- **Data Processing**: Array and object manipulation for complex data transformations
- **Type Validation**: Runtime type checking and validation
- **String Formatting**: Text processing and case conversion
- **Color Management**: Modern color space conversion for design systems
- **Performance**: Memoization and debouncing for optimization
- **Browser APIs**: Clipboard, navigation, and keyboard handling
- **Date/Time**: Internationalized date formatting
- **Error Handling**: Robust error management and async error throwing

This comprehensive utility library provides the building blocks for modern JavaScript applications while serving as the foundation for Semantic UI's component system.