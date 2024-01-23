# @semantic-ui/utils

**Utils is a tiny 3kb library for simplifying common javascript boilerplate.**

Utils has three primary uses:
* Tree Shaking - Many components will need to do similar things like escaping regular expressions. Coding this independently in all locations means that we can't save on file size when multiple components are used.

* Code Readability - Although much of what people use utility libraries are for are baked into modern ECMAScript, and you can get a lot of the niceties by using babel. Many native ECMAScript features have weird names and unconventional function signatures. Anyone who has tried using `Object.entries` before to do a simple each loop will understand the pains here. It's not impossible to learn but its unconventional.

* Gotcha Handling - A lot of things that are now native to javascript still have plenty of gotchas. Consider non-enumerated properties with object manipulation like extend/clone

Utility includes the following helpers

### Identity
* `hashCode(input)` - Return a 32bit integer hash of an array, object or string.
* `isEqual(a, b)` - Returns whether most things are equal in a way reasonable to humans. This avoids most common gotchas of equality like two dates of same time not being equal.

### Arrays
* `uniq(arr)` - Removes duplicates from arrays
* `clone(arr)` - Recursively clone an array
* `filterEmpty(arr)` - Removes falsey values from array
* `last(arr)` - Returns last element from array
* `each(arr, eachFunction(value, index))` - Iterates over an array calling function with each value and index
* `firstMatch(arr, matchFunction(value, index))` - Returns the first value returning `true` from matchFunction
* `inArray(value, array)` - Returns whether a value is present in array

### Objects
* `keys(obj)` - Return the keys of an object
* `clone(obj)` - Recursively clone an object
* `each(arr, eachFunction(value, key))` - Iterates over an object calling function with each value and key
* `extend(obj, ...sources)` - Adds new values to an object. This avoids the common trap of nuking getter/setters.
* `get(obj, searchTerm)` - Allows you to query for deeply nested values with dot notation. i.e. `get(obj, 'deep.nested.value')`
* `hasProperty(obj)` - Object has a property that was not inherited. i.e. hasProperty('toString') will be false but `obj['toString']` will be true

### Regular Expressions
* `escapeRegExp` - Escapes special values for use inside regular expressions

### Strings
* `kebabToCamel` - Change 'one-two' to 'oneTwo'

### Functions
* `noop` - Returns an empty function to avoid overhead of creating new anonymous function
* `wrapFunction(unknown)` - Returns either the function or an empty function. Useful to avoid erroring when invoking something which may or may not be a function.

### Types
* `isObject(x)` - Is something that presents as an object. This has some gotchas like array, regular expression, and null are `typeof 'object'`.
* `isPlainObject(x)` - Is a regular object (not including gotchas)
* `isBinary(x)` - Is data binary
* `isArray(x)` - Is array
* `isPromise` - Is a promise
* `isString` - Is a string
* `isArguments*` - Is function arguments
