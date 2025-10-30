# AI Workflow: Adding a New Utility Function

**For AI agents working with the Semantic UI Utils package**

## Context Loading Requirements

Before starting this workflow, load:
- `/ai/packages/utils.md` - Utils package structure and patterns
- `/ai/docs/example-metadata-guide.md` - Example creation requirements
- `/ai/documentation/authoring/example-authoring.md` - Package example patterns

## Workflow Overview

When adding or modifying utility functions, complete these 7 mandatory steps in order:

1. **Implementation** - Write/modify the function in source
2. **Testing** - Add comprehensive tests
3. **Types** - Update TypeScript definitions
4. **Example** - Create a working example
5. **Documentation** - Update API documentation
6. **AI Guide** - Update the utils package guide
7. **Release Notes** - Document changes

## Step 1: Implementation

### Source Location
`/packages/utils/src/[module].js`

### Key Patterns
- Use existing utility functions from the same package (e.g., use `isNumber` instead of `typeof x === 'number'`)
- Follow existing code formatting in the file
- Export functions as named exports
- Place related functions together in the file

### Example Pattern
```javascript
export const prettifyHash = (numericHash, { minLength = 6, padChar = '0' } = {}) => {
  numericHash = parseInt(numericHash, 10);
  if (numericHash === 0) { 
    return minLength > 1 ? padChar.repeat(minLength - 1) + '0' : '0'; 
  }
  
  let result = '';
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  while (numericHash > 0) {
    result = chars[numericHash % chars.length] + result;
    numericHash = Math.floor(numericHash / chars.length);
  }
  
  // Pad if needed
  if (result.length < minLength) {
    result = padChar.repeat(minLength - result.length) + result;
  }
  
  return result;
};
```

## Step 2: Testing

> **See Also:** [Testing Guide](/ai/guides/testing.md) for comprehensive guidance on test types, organization, and patterns.

### Test Location
`/packages/utils/test/utils.test.js`

### Test Structure
1. Use `Read` tool to find the correct `describe` block for your module
2. Use `Grep` to search for similar function tests as reference
3. Import your function at the top with other imports
4. Write tests covering all functionality

### Required Test Cases
- Basic functionality with typical inputs
- Edge cases: `null`, `undefined`, empty values, `NaN`
- All option combinations
- Type coercion behavior
- Large/small number handling
- String input variations

### Test Pattern
```javascript
describe('prettifyHash', () => {
  it('should return padded "0" for input 0 with default settings', () => {
    expect(prettifyHash(0)).toBe('000000');
  });

  it('should respect custom minLength', () => {
    expect(prettifyHash(123, { minLength: 8 })).toBe('0000003F');
    expect(prettifyHash(123, { minLength: 3 })).toBe('03F');
  });

  it('should handle negative numbers by returning padded 0', () => {
    expect(prettifyHash(-123)).toBe('000000');
  });
});
```

### Verification
Run: `npm run test`

## Step 3: Types

### Type Definition Location
`/packages/utils/types/[module].d.ts`

### Type Definition Pattern
```typescript
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
 * ```
 */
export function prettifyHash(numericHash: number, options?: PrettifyHashOptions): string;
```

### Required Elements
- Full JSDoc with description
- `@see` link to API docs (use exact anchor format: `#functionname`)
- `@see` link to example page
- `@param` descriptions without type annotations (TypeScript provides types)
- `@returns` description
- `@example` with TypeScript code block showing usage

## Step 4: Example (MANDATORY)

### Example Structure
```
/docs/src/examples/utils/[category]/utils-[functionname]/
└── index.js
```

### MDX Metadata Location
`/docs/src/content/examples/utils-[functionname].mdx`

### MDX Metadata Pattern
```yaml
---
title: 'functionName'
id: 'utils-functionname'
exampleType: 'log'
category: 'Utils'
subcategory: 'Category'
description: 'Brief description of what the function does'
tags: ['utils', 'category', 'functionname', 'relevant-keywords']
selectedFile: 'index.js'
tip: 'Practical tip about usage or relationship to other functions'
---
```

### Example Code Pattern
```javascript
import { functionName } from '@semantic-ui/utils';

// Basic usage
console.log(functionName(basicInput));

// With options
console.log(functionName(input, { option1: value1 }));

// Edge cases
console.log(functionName(0));
console.log(functionName(null));
```

### Example Requirements (from example-authoring guide)
- Use console.log for output (no inline comments)
- Keep examples simple and focused
- Show both basic and advanced usage
- Demonstrate all major options
- For mutating functions, show before/after state
- Tips should provide non-obvious insights or link to related functions

## Step 5: API Documentation

### Documentation Location
`/docs/src/pages/api/utils/[module].mdx`

### Documentation Pattern
```markdown
### functionName

```javascript
function functionName(param1, { option1 = default1 } = {})
```

Brief description of what the function does.

#### Parameters

| Name    | Type   | Description |
|---------|--------|-------------|
| param1  | type   | Description of parameter |
| options | object | Optional configuration |

##### Options

| Name    | Type   | Default | Description |
|---------|--------|---------|-------------|
| option1 | type   | default | Description of option |

#### Returns

Description of return value.

#### Example

```javascript
import { functionName } from '@semantic-ui/utils';

console.log(functionName(input)); // output
console.log(functionName(input, { option1: value })); // output
```
```

## Step 6: AI Guide Update

### Guide Location
`/ai/packages/utils.md`

### Update Process
1. Use `Read` to find the appropriate section
2. Add your function to the import statement
3. Add practical usage examples
4. Group with related functions

### Pattern
```javascript
// Import statement
import { existingFunc, newFunc } from '@semantic-ui/utils';

// Usage examples
const result = newFunc(input);                     // 'output'
const customResult = newFunc(input, options);      // 'custom output'
```

## Step 7: Release Notes

### Release Notes Location
`/RELEASE-NOTES.md`

### Categories
- **Breaking** - Renamed or removed functions
- **Feature** - New functions or new options
- **Enhancement** - Improvements to existing functions
- **Bug** - Bug fixes

### Pattern
```markdown
### Utils
* **Feature** - Added `functionName()` for [purpose]
* **Feature** - `functionName` now supports `optionName` option for [purpose]
* **Breaking** - `oldName` has been renamed to `newName` to better reflect [reason]
```

## Verification Commands

After completing all steps, verify:

1. Tests pass: `npm run test`
2. Example loads: Check `/examples/utils-functionname`
3. Search for old function names if renaming: `Grep` tool with old name

## Common Patterns to Follow

### When Reading Source Files
Always use exact string matching from `Read` output, including whitespace and indentation.

### When Creating Examples
1. Read similar examples first with: `Read /docs/src/examples/utils/[category]/utils-similarfunction/index.js`
2. Match the import style and console.log patterns exactly
3. Follow the subcategory organization from existing examples

### When Updating Tests
1. The test file has sections like `describe('ID/Hashing Functions')` - find the right one
2. Tests should match actual behavior, not expected behavior
3. When functions parse invalid input to defaults, test for the actual default

## Function Naming Patterns

- Predicate functions: `isSomething` (returns boolean)
- Transformation functions: `somethingToOther` (converts types)
- Action functions: `doSomething` (performs action)
- Utility functions: `prettifyHash`, `generateID` (specific utilities)

## Error Prevention

### Import Management
When renaming functions:
1. Update imports in test file
2. Update imports in example
3. Update imports in AI guide
4. Search for any other imports with `Grep`

### Type Safety
- Return type should be `number | string` if function can return either
- Use union types for parameters that accept multiple types
- Define option interfaces for functions with options

### Documentation Consistency
- Function signature in docs must match actual implementation
- Examples in different locations should be consistent
- Use the exact function name, not variations
