# TypeScript Types Guide

> **For:** AI agents adding or modifying TypeScript type definitions
> **Prerequisites:** [Mental Model](/ai/foundations/mental-model.md) • [Codebase Navigation](/ai/foundations/codebase-navigation-guide.md)
> **Related:** [Testing Guide](/ai/guides/testing.md) • [Package APIs](/ai/packages/)
> **Back to:** [Documentation Hub](/ai/00-START-HERE.md)

---

## Table of Contents

- [Type File Organization](#type-file-organization)
- [JSDoc Requirements](#jsdoc-requirements)
- [JSDoc Tags Reference](#jsdoc-tags-reference)
- [Type Patterns](#type-patterns)
- [Common Scenarios](#common-scenarios)
- [Best Practices](#best-practices)

---

## Type File Organization

### Location

Type definitions are located in `types/` directory within each package:

```
packages/
├── utils/
│   └── types/
│       ├── index.d.ts        ← Exports from all type files
│       ├── arrays.d.ts       ← Mirror src/arrays.js
│       ├── objects.d.ts      ← Mirror src/objects.js
│       └── ...
├── query/
│   └── types/
│       ├── index.d.ts
│       └── query.d.ts        ← Main Query class and methods
└── reactivity/
    └── types/
        ├── index.d.ts
        ├── signal.d.ts
        └── reaction.d.ts
```

### File Naming

- **Utils package:** Mirror source file structure
  - `src/arrays.js` → `types/arrays.d.ts`
  - `src/objects.js` → `types/objects.d.ts`

- **Other packages:** Logical grouping by feature/class
  - Main class in dedicated file (e.g., `query.d.ts`, `signal.d.ts`)
  - Related types and interfaces together

### index.d.ts Pattern

Always export from all type files:

```typescript
export * from './arrays';
export * from './objects';
export * from './strings';
```

---

## JSDoc Requirements

### Best Exemplars

**Utils type files are the gold standard:**
- Correct length for tooltip scanning
- Include code examples
- Proper `@see` links to documentation

**Review these for reference:**
- `packages/utils/types/arrays.d.ts`
- `packages/utils/types/crypto.d.ts`
- `packages/utils/types/objects.d.ts`

### Critical Rules

**JSDoc is REQUIRED for ALL public APIs:**
- ✅ All exported functions
- ✅ All exported classes and methods
- ✅ All exported interfaces (module-level)
- ✅ All interface properties with options
- ❌ Internal/private APIs (mark with `@internal` instead)

**JSDoc provides DX (Developer Experience):**
- Shows in IDE hover tooltips
- Shows in autocomplete
- Links to documentation
- Shows examples inline

### Structure

Every public function/method must have:

```typescript
/**
 * Brief one-line description of what the function does
 * Optional: Extended description providing more context
 * @see {@link https://next.semantic-ui.com/api/package/category#functionname functionName}
 * @see {@link https://next.semantic-ui.com/examples/package-functionname Example}
 *
 * @param paramName - Description of parameter (NO TYPE - TypeScript provides that)
 * @param optionsParam - Description of options object
 * @returns Description of return value (NO TYPE - TypeScript provides that)
 *
 * @example
 * ```ts
 * functionName(input) // returns output
 * functionName(input, { option: true }) // returns different output
 * ```
 */
export function functionName(paramName: Type, optionsParam?: Options): ReturnType;
```

---

## JSDoc Tags Reference

### @see - Documentation Links

**Always provide links to:**
1. API documentation page (main reference)
2. Example page (if exists)

**Format:**
```typescript
/**
 * @see {@link https://next.semantic-ui.com/api/utils/arrays#unique unique}
 * @see {@link https://next.semantic-ui.com/examples/utils-unique Example}
 */
```

**Finding the Correct API Documentation URL:**

The link location corresponds to the documentation structure in `docs/src/pages/api/`:

```
docs/src/pages/api/
├── utils/
│   ├── arrays.mdx        → /api/utils/arrays
│   ├── objects.mdx       → /api/utils/objects
│   └── crypto.mdx        → /api/utils/crypto
├── query/
│   ├── attributes.mdx    → /api/query/attributes
│   ├── content.mdx       → /api/query/content
│   └── dimensions.mdx    → /api/query/dimensions
└── reactivity/
    ├── signal.mdx        → /api/reactivity/signal
    └── reaction.mdx      → /api/reactivity/reaction
```

**URL Pattern:** `https://next.semantic-ui.com/api/<package>/<category>#<functionname>`

**Examples:**
- Utils arrays function: `/api/utils/arrays#unique`
- Query attribute method: `/api/query/attributes#data`
- Reactivity signal method: `/api/reactivity/signal#subscribe`

**Anchor Format:**
- Use lowercase
- Remove parentheses
- Example: `getData()` → `#getdata`

**Example URL Construction:**
```
Function: unique() in arrays.js
File: docs/src/pages/api/utils/arrays.mdx
URL: https://next.semantic-ui.com/api/utils/arrays#unique
```

### @param - Parameter Descriptions

**Rules:**
- Describe WHAT the parameter is for (not the type)
- Use dash separator: `@param name - Description`
- NO type annotations (TypeScript provides the type)
- Be concise but clear

**Examples:**
```typescript
/**
 * @param array - The array to search
 * @param callback - Function to test each element
 * @param options - Configuration options for behavior
 * @param input - The input string or object. Objects are stringified using JSON.stringify. null and undefined become ""
 */
```

**For parameters with complex behavior, explain it:**
```typescript
/**
 * @param seed - Optional seed value. If not provided, uses getRandomSeed()
 */
```

### @returns - Return Value Description

**Rules:**
- Describe WHAT is returned (not the type)
- NO type annotation (TypeScript provides the type)
- Explain variations based on inputs when relevant

**Examples:**
```typescript
/**
 * @returns A new array with duplicate values removed
 */

/**
 * @returns The first element or array of first n elements
 */

/**
 * @returns The unsigned 32-bit integer hash code, or a prettified string if prettify option is true. Returns 0 on JSON serialization error
 */
```

### @example - Usage Examples

**Rules:**
- ALWAYS use TypeScript code blocks: ` ```ts`
- Show typical usage patterns
- Include multiple variations when relevant
- Use inline comments to show return values: `// returns value`
- Keep examples concise and clear

**Format:**
```typescript
/**
 * @example
 * ```ts
 * unique([1, 2, 2, 3]) // returns [1, 2, 3]
 * unique(['a', 'b', 'a']) // returns ['a', 'b']
 * ```
 */
```

**For functions with options:**
```typescript
/**
 * @example
 * ```ts
 * prettifyHash(123) // returns '00003F'
 * prettifyHash(123, { minLength: 8 }) // returns '0000003F'
 * prettifyHash(123, { minLength: 4, padChar: 'X' }) // returns 'XX3F'
 * ```
 */
```

**For complex objects:**
```typescript
/**
 * @example
 * ```ts
 * const users = [
 *   { role: 'admin', name: 'John' },
 *   { role: 'user', name: 'Jane' }
 * ];
 * groupBy(users, 'role')
 * // returns:
 * // {
 * //   admin: [{ role: 'admin', name: 'John' }],
 * //   user: [{ role: 'user', name: 'Jane' }]
 * // }
 * ```
 */
```

### @template - Generic Type Parameters

**Use for classes and functions with generics:**

```typescript
/**
 * Extended call parameters for event handlers
 *
 * @template TState - Type of the component's reactive state variables
 * @template TSettings - Type of the component's configuration settings
 * @template TComponentInstance - Type of the component instance
 * @template TProperties - Type of the properties for Lit components
 */
export interface EventCallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TComponentInstance extends Record<string, any> = Record<string, any>,
  TProperties extends Record<string, any> = Record<string, any>,
> {
  // ...
}
```

### @default - Default Values

**Use in interface properties to document defaults:**

```typescript
export interface SignalOptions<T> {
  /**
   * Custom equality function to determine if a value has changed
   * @param oldValue - The previous value
   * @param newValue - The new value to compare against
   */
  equalityFunction?: (oldValue: T, newValue: T) => boolean;

  /**
   * Whether to allow cloning of values. If false, values are stored by reference
   * @default true
   */
  allowClone?: boolean;

  /**
   * Character to use for padding
   * @default '0'
   */
  padChar?: string;
}
```

### @internal - Internal APIs

**Mark internal/private APIs not meant for public consumption:**

```typescript
/**
 * @internal This class is primarily used internally by the reactivity system.
 */
export class Scheduler {
  /**
   * @internal This method is called internally by the reactivity system.
   */
  schedule(): void;
}
```

---

## Type Patterns

### Module-Level Documentation

**Every type file should start with a module comment:**

```typescript
/**
 * Array manipulation utilities
 * @see {@link https://next.semantic-ui.com/api/utils/arrays Array Utilities Documentation}
 */
```

### Simple Function

```typescript
/**
 * Removes duplicates from an array
 * @see {@link https://next.semantic-ui.com/api/utils/arrays#unique unique}
 *
 * @param arr - The array to remove duplicates from
 * @returns A new array with duplicate values removed
 *
 * @example
 * ```ts
 * unique([1, 2, 2, 3, 3, 4]) // returns [1, 2, 3, 4]
 * unique(['a', 'b', 'a', 'c']) // returns ['a', 'b', 'c']
 * ```
 */
export function unique<T>(arr: T[]): T[];
```

### Function with Options

```typescript
/**
 * Options for the `prettifyHash` function
 */
interface PrettifyHashOptions {
  /**
   * Minimum length of the output string. Will pad with padChar if necessary
   * @default 6
   */
  minLength?: number;
  /**
   * Character to use for padding
   * @default '0'
   */
  padChar?: string;
}

/**
 * Converts a numeric hash value to a prettified alphanumeric string using base-36 encoding
 * @see {@link https://next.semantic-ui.com/api/utils/crypto#prettifyhash prettifyHash}
 * @see {@link https://next.semantic-ui.com/examples/utils-prettifyhash Example}
 *
 * @param numericHash - The numeric hash value to convert
 * @param options - Options for prettifying the hash
 * @returns The prettified hash string. Returns padded "0" if input parses to 0 or NaN
 *
 * @example
 * ```ts
 * prettifyHash(123) // returns '00003F'
 * prettifyHash(123, { minLength: 8 }) // returns '0000003F'
 * prettifyHash(123, { minLength: 4, padChar: 'X' }) // returns 'XX3F'
 * ```
 */
export function prettifyHash(numericHash: number, options?: PrettifyHashOptions): string;
```

### Function Overloads

**Pattern 1: Document each overload**
```typescript
/**
 * Gets the last element from an array
 * @see {@link https://next.semantic-ui.com/api/utils/arrays#last last}
 * @param array - The source array
 * @returns The last element
 */
export function last<T>(array: T[]): T | undefined;

/**
 * Gets the last N elements from an array
 * @see {@link https://next.semantic-ui.com/api/utils/arrays#last last}
 * @param array - The source array
 * @param number - Number of elements to return
 * @returns Array of last n elements
 */
export function last<T>(array: T[], number: number): T[];
```

**Pattern 2: Document final combined signature**
```typescript
/**
 * Gets the last element(s) from an array
 * @see {@link https://next.semantic-ui.com/api/utils/arrays#last last}
 *
 * @param array - The source array
 * @param number - Number of elements to return (default: 1)
 * @returns The last element or array of last n elements
 *
 * @example
 * ```ts
 * last([1, 2, 3]) // returns 3
 * last([1, 2, 3], 2) // returns [2, 3]
 * ```
 */
export function last<T>(array: T[]): T | undefined;
export function last<T>(array: T[], number: number): T[];
export function last<T>(array: T[], number?: number): T | T[] | undefined;
```

### Class with Methods

```typescript
/**
 * A Signal represents a reactive value that automatically triggers updates
 * when modified. It can store any type of value and provides methods for
 * safely mutating that value while maintaining reactivity.
 * @see {@link https://next.semantic-ui.com/api/reactivity/signal Signal Documentation}
 */
export class Signal<T> {
  /**
   * Creates a new Signal with an initial value
   * @see {@link https://next.semantic-ui.com/api/reactivity/signal#constructor constructor}
   * @param initialValue - The initial value to store in the signal
   * @param options - Configuration options for the signal's behavior
   */
  constructor(initialValue: T, options?: SignalOptions<T>);

  /**
   * Gets the current value, establishing a reactive dependency.
   * When accessed within a reactive context (like a Reaction),
   * any changes to this Signal will cause the reactive context to re-run.
   * @see {@link https://next.semantic-ui.com/api/reactivity/signal#value value}
   */
  get value(): T;

  /**
   * Sets a new value, triggering updates if the value has changed.
   * Notifies all reactive contexts that depend on this Signal to re-run.
   * @see {@link https://next.semantic-ui.com/api/reactivity/signal#value value}
   */
  set value(newValue: T);

  /**
   * Returns the current value without establishing a reactive dependency.
   * Accessing the value with `peek()` will not cause any reactive context to depend on this Signal.
   * @see {@link https://next.semantic-ui.com/api/reactivity/signal#peek peek}
   */
  peek(): T;
}
```

### Interfaces

```typescript
/**
 * Options for initializing a Query instance
 */
export interface QueryOptions {
  /**
   * The root element to search within. Defaults to `document`
   */
  root?: Document | Element;
  /**
   * Whether to pierce through shadow DOM boundaries. Defaults to `false`
   */
  pierceShadow?: boolean;
}
```

### Conditional Methods (Array-specific on Signals)

```typescript
/**
 * Adds elements to the end of the array.
 * This method is only available when `T` is or extends `any[]`.
 * @see {@link https://next.semantic-ui.com/api/reactivity/array-helpers#push push}
 * @param items - Elements to add
 */
push<U extends any[]>(this: Signal<U>, ...items: U[number][]): void;
```

---

## Common Scenarios

### Adding Types for New Utility Function

**When adding a util function to `packages/utils/src/arrays.js`:**

1. **Determine the type file:** `packages/utils/types/arrays.d.ts`
2. **Write the type definition with JSDoc:**

```typescript
/**
 * Brief description of what the function does
 * @see {@link https://next.semantic-ui.com/api/utils/arrays#functionname functionName}
 *
 * @param param1 - Description
 * @param param2 - Description
 * @returns Description of return
 *
 * @example
 * ```ts
 * functionName(input) // returns output
 * ```
 */
export function functionName(param1: Type1, param2: Type2): ReturnType;
```

3. **If using options, define interface first:**

```typescript
/**
 * Options for functionName
 */
interface FunctionNameOptions {
  /**
   * Description of option
   * @default defaultValue
   */
  optionName?: Type;
}
```

### Adding Types for Query Method

**When adding a method to Query:**

1. **Open:** `packages/query/types/query.d.ts`
2. **Add method to Query class:**

```typescript
/**
 * Brief description of what the method does
 * @see {@link https://next.semantic-ui.com/api/query/category#methodname methodName}
 *
 * @param selector - Description
 * @returns Description
 *
 * @example
 * ```ts
 * $('.element').methodName('value') // returns result
 * ```
 */
methodName(selector: string): ReturnType;
```

3. **For getter/setter patterns, use overloads:**

```typescript
/**
 * Sets a value (when parameter provided)
 */
methodName(key: string, value: string): this;
/**
 * Gets a value (when parameter provided)
 */
methodName(key: string): string | string[] | undefined;
/**
 * Gets all values (when no parameters)
 */
methodName(): Record<string, string> | undefined;
```

### Adding Types for Component Option

**When adding option to component definition:**

1. **Open:** `packages/component/types/define-component.d.ts`
2. **Add to appropriate interface with JSDoc:**

```typescript
export interface ComponentDefinition {
  /**
   * Description of what this option does.
   * Explain when and why to use it.
   * @see https://next.semantic-ui.com/components/section#optionname
   */
  optionName?: Type;
}
```

---

## Best Practices

### Do's

✅ **Include JSDoc for all public APIs**
```typescript
/**
 * Description
 * @see {@link URL functionName}
 * @param x - Description
 * @returns Description
 * @example
 * ```ts
 * example code
 * ```
 */
```

✅ **Link to both API docs and examples**
```typescript
/**
 * @see {@link https://next.semantic-ui.com/api/utils/arrays#unique unique}
 * @see {@link https://next.semantic-ui.com/examples/utils-unique Example}
 */
```

✅ **Show variations in examples**
```typescript
/**
 * @example
 * ```ts
 * func(basic) // basic usage
 * func(input, { option: true }) // with options
 * func(complex, { opt1: true, opt2: 'value' }) // multiple options
 * ```
 */
```

✅ **Document defaults in option interfaces**
```typescript
/**
 * Whether to enable feature
 * @default false
 */
enabled?: boolean;
```

✅ **Explain non-obvious return behaviors**
```typescript
/**
 * @returns Single element returns value directly, multiple elements return array of values
 */
```

✅ **Use `@internal` for private APIs**
```typescript
/**
 * @internal This is used internally by the framework
 */
```

### Don'ts

❌ **Don't include type annotations in JSDoc**
```typescript
// WRONG
/**
 * @param arr {Array<T>} - The array
 * @returns {T[]} - The result
 */

// CORRECT
/**
 * @param arr - The array
 * @returns The result
 */
export function func<T>(arr: T[]): T[];
```

❌ **Don't skip examples**
```typescript
// WRONG - no example
/**
 * Removes duplicates
 * @param arr - The array
 * @returns Unique array
 */

// CORRECT
/**
 * Removes duplicates
 * @param arr - The array
 * @returns Unique array
 * @example
 * ```ts
 * unique([1, 2, 2, 3]) // returns [1, 2, 3]
 * ```
 */
```

❌ **Don't use generic examples**
```typescript
// WRONG
/**
 * @example
 * ```ts
 * result = someFunction(input)
 * ```
 */

// CORRECT
/**
 * @example
 * ```ts
 * unique([1, 2, 2, 3]) // returns [1, 2, 3]
 * ```
 */
```

❌ **Don't forget @see links**
```typescript
// WRONG - no links
/**
 * Removes duplicates
 */

// CORRECT
/**
 * Removes duplicates
 * @see {@link https://next.semantic-ui.com/api/utils/arrays#unique unique}
 */
```

❌ **Don't use language other than TypeScript in examples**
```typescript
// WRONG
/**
 * @example
 * ```javascript  // or ```js
 * unique([1, 2, 3])
 * ```
 */

// CORRECT
/**
 * @example
 * ```ts
 * unique([1, 2, 3]) // returns [1, 2, 3]
 * ```
 */
```

---

## Quick Reference

**Minimum JSDoc for functions:**
```typescript
/**
 * Description
 * @see {@link URL name}
 * @param x - Description
 * @returns Description
 * @example
 * ```ts
 * code // returns result
 * ```
 */
```

**With options:**
```typescript
interface Options {
  /** Description @default value */
  prop?: Type;
}

/**
 * Description
 * @see {@link URL name}
 * @param x - Description
 * @param options - Options for behavior
 * @returns Description
 * @example
 * ```ts
 * func(x) // basic
 * func(x, { prop: val }) // with option
 * ```
 */
```

**URL Patterns:**
- API: `https://next.semantic-ui.com/api/<pkg>/<cat>#<func>`
- Example: `https://next.semantic-ui.com/examples/<pkg>-<func>`

**Required Tags:**
- `@see` - Link to docs (always include)
- `@param` - For each parameter
- `@returns` - What is returned
- `@example` - Usage example (always include)

**Optional Tags:**
- `@default` - Default values in interfaces
- `@template` - Generic type parameters
- `@internal` - Internal/private APIs

---

**Last Updated:** 2025-10-30
**Maintenance:** Update when JSDoc patterns or conventions change
