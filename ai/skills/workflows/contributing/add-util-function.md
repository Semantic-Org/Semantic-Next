---
title: Add Utility Function Workflow
description: Step-by-step workflow for adding or modifying utility functions in the Semantic UI Utils package.
keywords: [utils, utility functions, workflow, implementation, testing]
audience: contributing
type: workflow
workflow: add-util-function
---

# AI Workflow: Adding a New Utility Function

**For AI agents working with the Semantic UI Utils package**

## Context Loading Requirements

Before starting this workflow, see:
- `docs-examples-authoring` — example creation requirements and patterns

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
export const clamp = (value, { min = 0, max = 1 } = {}) => {
  // use the existing predicate, not typeof value === 'number'
  if (!isNumber(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
};
```

## Step 2: Testing

> **See Also:** See `testing` for guidance on test types, organization, and patterns.

### Test Location
`/packages/utils/test/[module].test.js`

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
describe('clamp', () => {
  it('clamps into the default 0..1 range', () => {
    expect(clamp(2)).toBe(1);
    expect(clamp(-2)).toBe(0);
    expect(clamp(0.5)).toBe(0.5);
  });

  it('respects a custom min and max', () => {
    expect(clamp(50, { min: 0, max: 10 })).toBe(10);
    expect(clamp(5, { min: 0, max: 10 })).toBe(5);
  });

  it('falls back to min for non-numbers', () => {
    expect(clamp(null, { min: 3 })).toBe(3);
    expect(clamp('x')).toBe(0);
  });
});
```

### Verification

1. Run tests: `npm test`
2. Check coverage: `npm run test:coverage`
3. Iterate on tests until all reasonable new lines are covered

## Step 3: Types

> **See Also:** See `types` for JSDoc patterns and type definition best practices.

### Type Definition Location
`/packages/utils/types/[module].d.ts`

### Type Definition Pattern
```typescript
/**
 * Clamps a number into a range, returning `min` for non-numeric input
 * @see {@link https://next.semantic-ui.com/api/utils/numbers#clamp clamp}
 * @see {@link https://next.semantic-ui.com/examples/utils-clamp Example}
 *
 * @param value - The number to clamp
 * @param options - The range to clamp into
 * @returns The value limited to [min, max], or min when value is not a number
 *
 * @example
 * ```ts
 * clamp(2)                       // returns 1
 * clamp(50, { min: 0, max: 10 }) // returns 10
 * ```
 */
export function clamp(value: number, options?: ClampOptions): number;
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
`/docs/src/pages/docs/api/utils/[module].mdx`

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

## Step 6: AI Context Update

### Location
Update the `utility-functions` skill to include the new function.

### Update Process
1. Add your function to the appropriate section
2. Add practical usage examples
3. Group with related functions

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
`/CHANGELOG.md`

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
1. Each module has its own test file (e.g. `crypto.test.js`) with `describe` sections like `describe('ID/Hashing Functions')` - find or add the right one
2. Tests should match actual behavior, not expected behavior
3. When functions parse invalid input to defaults, test for the actual default

## Function Naming Patterns

- Predicate functions: `isSomething` (returns boolean)
- Transformation functions: `somethingToOther` (converts types)
- Action functions: `doSomething` (performs action)
- Utility functions: `clamp`, `generateID` (specific utilities)

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
