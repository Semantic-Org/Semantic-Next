# @semantic-ui/utils

**Utils is a tiny 3kb library for simplifying common javascript boilerplate.**

Utils has three primary advantages over custom implementations.

- **Tree Shaking** - Many components will need to do similar things. When these components are bundled together its more efficient for them to reference a single code implementation than several unique ones. This means smaller bundled size when using more than one component together in a bundle.

- **Code Readability** - Utility libraries offer a level of familiarity and consistency that can be missing with native ECMAScript features. Removing rough edges reduces the learning curve when looking at unfamiliar code so you can focus on the intention not the implementation.

- **Gotcha Handling** - More Robust Implementations: When using utility libraries for common operations like object manipulation, you're not just avoiding gotchas (consider non-enumerated properties with object manipulation like extend/clone.); you're also leveraging a community-tested solution. These libraries often include safeguards against edge cases and peculiarities of JavaScript that a typical custom implementation might overlook. This results in more robust code, reducing the likelihood of bugs related to subtle language intricacies.

Utility includes the following helpers:

### Arrays
- `unique(arr)` - Removes duplicates from arrays
- `filterEmpty(arr)` - Removes falsey values from an array
- `last(array, number)` - Returns last (n) elements from array
- `first(array, number)` - Returns first (n) elements from array
- `firstMatch(array, callback)` - Returns the first value that matches the provided callback function
- `findIndex(array, callback)` - Finds the index of the first element in the array that satisfies the provided callback function
- `remove(array, callbackOrValue)` - Removes elements from an array that match the given callback function or value
- `inArray(value, array)` - Returns whether a value is present in an array
- `range(start, stop, step)` - Creates an array of numbers progressing from start up to, but not including, end
- `where(array, properties)` - Returns only objs with given properties in an array of objects
- `flatten(arr)` - Flattens an array of arrays
- `some/any(arr, truthFunc)` - Returns true if any/some values match truthFunc
- `sum(values)` - Sums an array of numbers
- `moveItem(array, callbackOrValue, index)` - Moves element to specified index (supports 'first'/'last')
- `moveToFront(array, callbackOrValue)` - Moves element to start of array
- `moveToBack(array, callbackOrValue)` - Moves element to end of array
- `sortBy(array, key, comparator)` - Sort array by object key with optional comparator
- `groupBy(array, property)` - Group array items by property value

### Numbers
- `roundNumber(number, digits)` - Rounds a number to given significant digits

### DOM
- `copyText(text)` - Copies text to clipboard
- `openLink(url, options)` - Opens a link with configurable options
- `getText(src)` - Fetches text content from a URL
- `getJSON(src)` - Fetches and parses JSON from a URL
- `getKeyFromEvent(event)` - Extracts standardized key from keyboard event

### Objects
- `keys(obj)` - Return the keys of an object
- `values(obj)` - Return the values of an object
- `mapObject(obj, callback)` - Creates an object with transformed values
- `filterObject(obj, callback)` - Creates object with filtered key-value pairs
- `extend(obj, ...sources)` - Extends an object with properties from additional sources
- `pick(obj, ...keys)` - Creates an object composed of the picked object properties
- `get(obj, string)` - Access a nested object field with a string, like 'a.b.c'
- `onlyKeys(obj, keysToKeep)` - Returns an object with only specified keys
- `hasProperty(obj, prop)` - Return true if the object has the specified property
- `reverseKeys(obj)` - Reverses a lookup object's keys and values
- `arrayFromObject(obj)` - Returns array with key value pairs from object
- `proxyObject(sourceObj, referenceObj)` - Creates a proxy combining source and reference objects
- `weightedObjectSearch(query, array, options)` - Performs weighted search across object array

### Types
- `isObject(x)` - Checks if the value is an object
- `isPlainObject(x)` - Checks if the value is a plain object
- `isString(x)` - Checks if the value is a string
- `isBoolean(x)` - Checks if the value is a boolean
- `isNumber(x)` - Checks if the value is a number
- `isArray(x)` - Checks if the value is an array
- `isBinary(x)` - Checks if the value is binary (Uint8Array)
- `isFunction(x)` - Checks if the value is a function
- `isPromise(x)` - Checks if the value is a promise
- `isArguments(obj)` - Checks if the value is an arguments object
- `isDOM(x)` - Checks if the value is a DOM element
- `isNode(x)` - Checks if the value is a DOM node
- `isEmpty(x)` - Checks if the value is empty like {}
- `isClassInstance(x)` - Checks if value is instance of custom class

### Date
- `formatDate(date, format)` - Formats a date object into a string based on the provided format

### Functions
- `noop()` - A no-operation function for use as a default callback
- `wrapFunction(x)` - Wraps a value in a function
- `memoize(fn, hashFunction)` - Memoizes a function with optional custom cache key generation
- `debounce(fn, options)` - Creates a debounced version of a function

### Strings
- `kebabToCamel(str)` - Converts kebab-case to camelCase
- `camelToKebab(str)` - Converts camelCase to kebab-case
- `capitalize(str)` - Capitalize only the first word
- `capitalizeWords(str)` - Capitalizes each word
- `toTitleCase(str)` - Converts string to title case
- `joinWords(words, options)` - Joins words with configurable formatting
- `getArticle(word, settings)` - Gets appropriate indefinite article (a/an)

### Regular Expressions
- `escapeRegExp(string)` - Escapes special characters for use in a regular expression
- `escapeHTML(string)` - Escapes string for html '&<>"' only

### Looping
- `each(iterable, func, context)` - Calls function for each element of an iterable
- `asyncEach(iterable, func, context)` - Calls iteratee awaiting each function
- `asyncMap(iterable, func, context)` - Calls each func awaiting the mapped result

### Equality
- `isEqual(a, b)` - Deep compares values for equivalence

### Cloning
- `clone(a)` - Performant clone of Array, Object, Date, RegExp, Map, Set or other data

### Identity
- `tokenize(str)` - Returns a tokenized version of a string
- `prettifyID(num)` - Converts numeric ID to human-readable string
- `hashCode(input, options)` - Creates a hash code from input
- `generateID()` - Generates a pseudo-random unique identifier

### Errors
- `fatal(message, options)` - Throws a custom error asynchronously

### Constants
- `isServer` - Boolean whether code is running on server
- `isClient` - Boolean whether code is running on client
