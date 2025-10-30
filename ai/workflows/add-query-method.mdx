# Adding a New Query Method

This workflow outlines the complete process for implementing a new method on the Query class, based on lessons learned from adding the `data()` method.

## Overview

Adding a new Query method involves 6 main steps:
1. **Implementation** - Add the method to the Query class
2. **Testing** - Write comprehensive tests
3. **Types** - Update TypeScript definitions
4. **Documentation** - Add API documentation
5. **AI Guide** - Update the AI package guide
6. **Release Notes** - Update change log (if not already done)

## File Locations

```
packages/query/src/query.js             # Main implementation
packages/query/test/dom/query.test.js    # DOM-based unit tests
packages/query/test/browser/query.test.js # Browser-only tests (window, custom elements, etc.)
packages/query/types/query.d.ts         # TypeScript definitions
docs/src/pages/api/query/*.mdx          # API documentation
ai/packages/query.md                    # AI package guide
RELEASE-NOTES.md                        # Change log
```

## Step 1: Implementation

### Location
Add your method to `/packages/query/src/query.js`

### Key Conventions

#### Use Semantic UI Utils
Query uses utilities from `@semantic-ui/utils`. Use existing imported helpers from the import statement at the top of `query.js`, or import additional ones as needed. See the comprehensive [Utils Package Guide](../packages/utils.md) for all available utilities.

#### Method Placement
- Add new methods before the comment `// special helper for SUI components`
- Keep related methods grouped together

#### Return Value Patterns
Query follows consistent patterns for single vs multiple elements:

**Getters:**
```javascript
// Single element: return the value directly
// Multiple elements: return array of values
const values = this.map(el => /* get value */);
return this.length === 1 ? values[0] : values;
```

**Setters:**
```javascript
// Always return Query instance for chaining
return this.each(el => {
  // set value on each element
});
```

#### Use Existing Query Methods
- Use `this.el()` instead of `this[0]` for first element
- Use `this.each()` for iteration over elements  
- Use `this.map()` for transforming elements to values
- Use semantic-ui utils for safe operations (see imports at top of file)

#### Error Handling
```javascript
// Check for empty selections
if (this.length === 0) {
  return undefined;
}
```

### Example Structure
```javascript
methodName(param1, param2) {
  if (param2 !== undefined) {
    // Setter - return Query for chaining
    return this.each(el => {
      // modify each element
    });
  }
  
  if (param1 !== undefined) {
    // Getter with parameter
    if (this.length === 0) {
      return undefined;
    }
    const values = this.map(el => /* get value from element */);
    return this.length === 1 ? values[0] : values;
  }
  
  // Getter without parameters
  if (this.length === 0) {
    return undefined;
  }
  const allValues = this.map(el => {
    // collect all relevant data
  });
  return this.length === 1 ? allValues[0] : allValues;
}
```

## Step 2: Testing

> **See Also:** [Testing Guide](/ai/guides/testing.md) for help choosing between unit, DOM, and browser tests.

### Location
Add tests to `/packages/query/test/dom/query.test.js` for standard DOM operations.

For features requiring full browser support (window object, custom elements, shadow DOM, etc.) that cannot run as unit tests, add tests to `/packages/query/test/browser/query.test.js` instead.

### Test Structure
```javascript
describe('methodName', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should handle the basic functionality', () => {
    // test implementation
  });

  // ... more tests
});
```

### Essential Test Cases
1. **Basic getter/setter functionality**
2. **Single element behavior**
3. **Multiple element behavior**
4. **Empty selection handling**
5. **Edge cases** (missing properties, null values, etc.)
6. **Chaining** (setters return Query instance)
7. **Type consistency** (what gets returned vs what gets set)

### Coverage Verification
After writing tests, verify coverage:
```bash
cd packages/query
npm run test:coverage
```
Iterate on tests until all reasonable new lines are covered.

### Test Patterns
```javascript
// Setting values
$('div').methodName('key', 'value');
expect(/* verify DOM change */).toBe('value');

// Getting from single element  
const result = $('div').methodName('key');
expect(result).toBe('expectedValue');

// Getting from multiple elements
const results = $('div').methodName('key'); 
expect(results).toEqual(['value1', 'value2']);

// Chaining
const $result = $('div').methodName('key', 'value');
expect($result).toBeInstanceOf(Query);
expect($result[0]).toBe(/* original element */);
```

## Step 3: TypeScript Definitions

> **See Also:** [TypeScript Types Guide](/ai/guides/typescript-types.md) for comprehensive JSDoc patterns and type definition best practices.

### Location
Add type definitions to `/packages/query/types/query.d.ts`

### Method Overloads
Use method overloads to properly type different usage patterns:

```typescript
/**
 * Sets a value (when both parameters provided)
 */
methodName(param1: string, param2: string): this;
/**
 * Gets a specific value (when one parameter provided)
 */
methodName(param1: string): string | string[] | undefined;
/**
 * Gets all values (when no parameters provided)
 */
methodName(): SomeType | SomeType[] | undefined;
```

### JSDoc Comments
Include proper JSDoc with:
- Description of what the method does
- `@see` link to documentation (use pattern: `https://next.semantic-ui.com/api/query/category#methodname`)
- Parameter descriptions
- Return value descriptions

### Type Patterns
- Use `PlainObject<T>` for object types
- Use `string | string[] | undefined` for getter return types
- Use `this` for setter return types (enables chaining)

## Step 4: Documentation

### Location
Add documentation to the appropriate file in `/docs/src/pages/api/query/`

Choose the most relevant category:
- `attributes.mdx` - for attribute-related methods
- `content.mdx` - for content manipulation
- `css.mdx` - for styling methods
- `events.mdx` - for event handling
- etc.

### Documentation Structure
```markdown
## methodName

Brief description of what the method does.

### Syntax

#### Get All Values
```javascript
$('selector').methodName()
```

#### Get Specific Value  
```javascript
$('selector').methodName(key)
```

#### Set Value
```javascript
$('selector').methodName(key, value)
```

### Parameters
| Name  | Type   | Description                    |
|-------|--------|--------------------------------|
| key   | string | Description of key parameter   |
| value | string | Description of value parameter |

### Returns

#### Get All Values
- **Single Element** Description of single element return
- **Multiple Elements** Description of multiple element return

#### Get Specific Value
- **Single Element** Description of single element return  
- **Multiple Elements** Description of multiple element return

#### Set Value
[Query object](/query/basic#the-query-object) (for chaining).

### Usage

#### Basic Examples
```javascript
// Example usage with explanatory comments
```

#### Working with Multiple Elements
```javascript
// Show single vs multiple element behavior
```

### Notes
- Important behavioral notes
- Edge cases to be aware of
- Related methods or concepts
```

## Step 5: AI Guide

### Location
Update `/ai/packages/query.md` to include the new method

### Method Categories
Add your method to the appropriate section in the "Query Methods Overview":

- **Basic Operations** - Core Query functionality
- **DOM Traversal** - Navigation methods
- **Content Manipulation** - HTML/text content methods
- **Attribute/Property Management** - Attribute and property methods
- **CSS and Styling** - Styling and class methods
- **Event Handling** - Event-related methods
- **Dimensions and Positioning** - Size and position methods
- **Component Integration** - Semantic UI component methods

### Documentation Format
```markdown
- `methodName(params)` - Brief description of functionality
```

### Advanced Patterns Section
If your method introduces new patterns or has complex usage, add examples to the appropriate advanced sections:

- **Advanced DOM Querying** - For complex selector patterns
- **Event Handling Patterns** - For event-related methods
- **Integration Patterns** - For component integration methods

### Usage Examples
Include practical examples showing:
- Basic usage patterns
- Integration with existing Query methods
- Component-specific usage (if applicable)

## Step 6: Release Notes

### Location
`RELEASE-NOTES.md` (may already be updated)

### Format
Add entry following the existing pattern:
```markdown
# Version X.X.X

* **Query** - Added `methodName()` for [brief description of purpose]
```

## Key Learnings & Best Practices

### Code Style
1. **Use existing utils** - Don't reinvent iteration, object access, etc.
2. **Follow return patterns** - Single element returns value, multiple returns array
3. **Handle empty selections** - Always check `this.length === 0`
4. **Use semantic methods** - `this.el()`, `this.each()`, `this.map()`

### Testing
1. **Test all usage patterns** - getter without args, getter with args, setter
2. **Test edge cases** - empty selections, missing properties, null values
3. **Test both single and multiple elements** - behavior should be consistent
4. **Verify chaining works** - setters return Query instance

### Documentation
1. **Include practical examples** - show real-world usage
2. **Document return value differences** - single vs multiple elements
3. **Use existing patterns** - follow format of other method docs
4. **Add helpful notes** - edge cases, related concepts

### Common Pitfalls
1. **Don't use `this[0]`** - use `this.el()` 
2. **Don't use native iteration** - use `each()` utility
3. **Don't forget type overloads** - needed for proper TypeScript support
4. **Don't skip empty selection checks** - prevents runtime errors
5. **Remember array vs single returns** - follow established patterns

## Verification Checklist

- [ ] Method implemented in `query.js` using semantic-ui utils
- [ ] Comprehensive tests added covering all usage patterns
- [ ] Coverage verified with `npm run test:coverage` - all reasonable lines covered
- [ ] TypeScript definitions added with proper overloads
- [ ] Documentation added to appropriate category file
- [ ] AI guide updated with method reference and examples
- [ ] Release notes updated (if needed)
- [ ] Tests pass (`npm test` in packages/query)
- [ ] Method follows single/multiple element return patterns
- [ ] Setter returns Query instance for chaining
- [ ] Empty selection handling implemented