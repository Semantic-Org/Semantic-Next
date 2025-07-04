# Query API Documentation Todo List

This file tracks methods that exist in the source code but are missing from the API documentation.

## Missing Methods from API Docs

### Dimensions Section (`/docs/src/pages/api/query/dimensions.mdx`)
- [ ] **`innerWidth`** - Get element width including padding
- [ ] **`innerHeight`** - Get element height including padding  
- [ ] **`outerWidth`** - Get element width including padding, border, and optionally margin
- [ ] **`outerHeight`** - Get element height including padding, border, and optionally margin
- [ ] **`scrollWidth`** - Get/set scroll width of elements
- [ ] **`scrollHeight`** - Get/set scroll height of elements

### DOM Manipulation Section (`/docs/src/pages/api/query/dom-manipulation.mdx`)
- [ ] **`reverse`** - Reverse order of elements in collection
- [ ] **`slice`** - Get portion of elements as new Query object (may already be documented - needs verification)

### Events Section (`/docs/src/pages/api/query/events.mdx`)
- [ ] **`ready`** - Attach handler for DOM ready event

### Utilities Section (`/docs/src/pages/api/query/utilities.mdx`)
- [ ] **`indexOf`** - Returns index of element in current collection that match filter (different from `index`)

## Already Documented as Aliases
These methods exist but are documented as aliases of their parent methods:
- **`val`** - Alias for `value` (documented in content.mdx)
- **`before`** - Alias for insertBefore (documented in dom-manipulation.mdx)
- **`after`** - Alias for insertAfter (documented in dom-manipulation.mdx)
- **`computedStyle`** - Alias for `css` with specific options (documented in css.mdx)
- **`closestAll`** - Alias for `closest(selector, { returnAll: true })` (documented in dom-traversal.mdx)
- **`count`** - Alias for `.length` (documented in utilities.mdx)

## Summary
- **Total methods needing documentation**: 10
- **Already documented as aliases**: 6
- **Sections needing updates**: 4

## Priority
1. **High Priority**: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight` - Common dimension methods
2. **Medium Priority**: `scrollWidth`, `scrollHeight`, `indexOf` - Less commonly used but important
3. **Low Priority**: `reverse`, `slice`, `ready` - Specialized use cases