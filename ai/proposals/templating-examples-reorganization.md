# Templating Examples Reorganization Proposal

**Author**: Claude  
**Date**: 2025-07-23  
**Status**: In Progress (16% complete - 3 examples created)  
**Purpose**: Comprehensive reorganization of templating examples to create focused, canonical examples for each syntax pattern

## Context

The current templating examples are large, comprehensive examples that show multiple features at once. This proposal outlines breaking them down into bite-sized, focused examples that demonstrate one specific syntax pattern each, making it easier for users to find and understand specific templating features.

## Current State

### Existing Examples
- **expressions**: Large table showing 20+ different expression types
- **loops**: Shows all loop variations in one example  
- **subtemplates**: Basic and advanced versions
- **snippets**: Basic and advanced versions
- **global-helpers**: Single example showing date formatting
- **async**: Basic and advanced async examples

### Issues with Current Approach
1. Hard to find specific syntax patterns
2. Examples try to demonstrate too many concepts at once
3. No examples for conditionals despite being a core feature
4. Missing canonical examples for common patterns

## Proposed Structure

### Core Principle
Each example should demonstrate ONE specific syntax pattern with minimal, focused code.

### Naming Convention
`[feature]-[specific-pattern]` (e.g., `expressions-basic`, `loops-each-index`)

### Categories and Examples

#### Syntax Category

**Expressions** (9 examples)
1. `expressions-basic` - Simple variable output: `{name}`, `{user.name}`, `{items.0}`
2. `expressions-data-context` - All data sources: state, settings, helpers, instance
3. `expressions-lisp` - Spaced arguments: `{concat firstName ' ' lastName}`
4. `expressions-javascript` - JS syntax: `{user.age + 1}`, `{items.length}`
5. `expressions-mixed` - Mixing Lisp + JS: `{formatDate (date + offset) 'h:mm'}`
6. `expressions-raw-html` - Unescaped: `{#html content}`
7. `expressions-nested` - Complex: `{formatDate (getDate now) 'h:mm'}`
8. `expressions-boolean-attributes` - `checked={isChecked}` vs `checked="{isChecked}"`
9. `expressions-kitchen-sink` - Comprehensive reference (current example)

**Loops** (8 examples)
1. `loops-each` - Basic: `{#each items}{this}{/each}`
2. `loops-each-in` - Named: `{#each item in items}{item.name}{/each}`
3. `loops-each-as` - Alternate: `{#each items as item}{item.name}{/each}`
4. `loops-each-index` - With index: `{#each item, idx in items}#{idx}: {item}{/each}`
5. `loops-each-object` - Objects: `{#each value, key in obj}{key}: {value}{/each}`
6. `loops-each-else` - Empty: `{#each items}...{else}No items{/each}`
7. `loops-nested` - Nested loops with multiple indices
8. `loops-expressions` - Dynamic: `{#each range(1, 10)}`

**Conditionals** (6 examples) - NEW
1. `conditionals-if` - Basic: `{#if condition}...{/if}`
2. `conditionals-if-else` - With else: `{#if condition}...{else}...{/if}`
3. `conditionals-if-elseif` - Multiple branches
4. `conditionals-expressions` - With helpers: `{#if not isEmpty items}`
5. `conditionals-nested` - Nested conditionals
6. `conditionals-in-attributes` - Conditional attributes/classes

#### Subtemplates Category (6 examples)
1. `subtemplates-basic` - Simple: `{> userCard}`
2. `subtemplates-with-data` - Data passing: `{> userCard user}`
3. `subtemplates-named-data` - Named params: `{> userCard name=user.name}`
4. `subtemplates-dynamic` - Dynamic selection: `{> template name=getTemplateName}`
5. `subtemplates-reactive` - Reactive data binding
6. `subtemplates-slots` - Using slots: `{> slot header}`

#### Snippets Category (5 examples)
1. `snippets-inline` - Basic inline snippets
2. `snippets-named` - Named snippet definitions
3. `snippets-with-data` - Passing data to snippets
4. `snippets-scope` - Understanding snippet scope
5. `snippets-nested` - Snippets within snippets

#### Helpers Category (11 examples)
**Logical** (3)
1. `helpers-logical-basic` - `exists`, `isEmpty`, `hasAny`
2. `helpers-logical-comparison` - `is`, `notEqual`, `greaterThan`
3. `helpers-logical-boolean` - `both`, `either`, `maybe`

**String** (3)
1. `helpers-string-concat` - String operations
2. `helpers-string-format` - `capitalize`, `titleCase`
3. `helpers-string-join` - Array joining

**CSS** (3)
1. `helpers-css-conditional` - `activeIf`, `selectedIf`
2. `helpers-css-classmap` - Multiple conditions
3. `helpers-css-classes` - Dynamic arrays

**Other** (2)
1. `helpers-date-format` - Date formatting
2. `helpers-utility` - `range`, `numberFromIndex`, debug helpers

#### Async Category (5 examples)
1. `async-basic` - Simple async loading
2. `async-loading-states` - Loading indicators
3. `async-error-handling` - Error states
4. `async-multiple` - Multiple operations
5. `async-reactive` - Reactive updates

## Implementation Details

### File Structure
```
/docs/src/examples/templates/[example-name]/
├── component.js    # Minimal data setup
├── component.html  # Focus on the syntax pattern
├── component.css   # Only if needed for demo
└── page.html       # Usually auto-generated

/docs/src/content/examples/[example-name].mdx
```

### Metadata Template
```yaml
---
title: '[Feature] - [Specific Pattern]'
exampleType: 'component'
category: 'Templates'
subcategory: '[Syntax|Subtemplates|Snippets|Helpers|Async|Conditionals]'
tags: ['templates', 'feature', 'specific-pattern']
description: 'Demonstrates [specific pattern description]'
selectedFile: 'component.html'
tip: '[Optional helpful tip]'
---
```

### Example Standards
1. **Minimal Data**: Use simple, meaningful data (users, items, etc.)
2. **Clear Output**: Show what the template produces
3. **Focus**: ONE syntax pattern per example
4. **Comments**: Use HTML comments to explain non-obvious parts
5. **Consistency**: Follow component development standards from guides

### component.js Template
```javascript
import { defineComponent } from '@semantic-ui/component';

export default defineComponent({
  tagName: 'template-[example-name]',
  
  // Minimal state/data for the example
  state: {
    // Only what's needed for the syntax demo
  },
  
  // Simple methods if needed
  methods() {
    return {
      // Only if required for the example
    };
  }
});
```

### component.html Focus
- Start with a clear heading: `<h3>[Pattern Name]</h3>`
- Show the template syntax clearly
- Include output/result section when helpful
- Use semantic HTML and first-party components

## Success Criteria

1. **Findability**: Users can quickly locate syntax they need
2. **Clarity**: Each example demonstrates one thing well
3. **Progression**: Examples build from simple to complex
4. **Completeness**: All major syntax patterns have examples
5. **Consistency**: All examples follow the same structure

## Implementation Status

### ✅ Completed Examples (3/44)
1. **expressions-basic** - Simple variable output and property access ✅
2. **expressions-mixed** - Mixing Lisp and JavaScript syntax ✅  
3. **expressions-lisp** - Pure Lisp-style spaced syntax ✅

### 🔄 Next Priority (Review Process Established)
4. **expressions-javascript** - Pure JavaScript syntax patterns
5. **expressions-data-context** - Understanding scope and data sources
6. **expressions-raw-html** - Unescaped HTML output
7. **expressions-nested** - Complex nested expressions
8. **expressions-boolean-attributes** - Conditional attributes

### 📋 Remaining Implementation Order
1. Complete expressions category (5 more examples)
2. Create conditionals category (6 new examples)
3. Break down loops category (8 examples)
4. Update subtemplates category (6 examples)  
5. Update snippets category (5 examples)
6. Reorganize helpers category (11 examples)
7. Update async category (5 examples)

## Critical Implementation Learnings (Session Notes)

### Component Structure Patterns (MANDATORY)

**Correct Component Definition:**
```javascript
import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {  // NOT 'state' - use 'defaultState'
  // Simple, meaningful data for examples
};

export default defineComponent({  // Must export default
  tagName: 'template-example-name',
  template,  // Must pass template
  css,       // Must pass css  
  defaultState,
  
  createComponent() {  // If needed for helper methods
    return {
      // Helper methods here
    };
  }
});
```

### ID and Folder Naming Rules (CRITICAL)

1. **Folder name MUST match the tokenized title**
   - "Expressions - Basic" → `expressions-basic` folder
   - "Expressions - Mixed Syntax" → `expressions-mixed` folder

2. **ID field in MDX:**
   - **INCLUDE** `id` field if title tokenization is NOT obvious
   - **OMIT** `id` field if folder name matches tokenized title exactly
   - When in doubt, include it to be safe

### Table Styling Patterns

**Standard table CSS (use this exact pattern):**
```css
table {
  width: 100%;
  background-color: var(--standard-5);
  border: var(--border);
  border-collapse: collapse;
  margin-bottom: 1rem;

  th {
    font-size: 10px;
    text-transform: uppercase;
    font-weight: bold;
    padding: 10px 12px;
    text-align: left;
    background-color: var(--primary-0);
    color: var(--primary-80);
    background-image: var(--subtle-gradient);
    border-bottom: var(--internal-border);
    border-left: var(--internal-border);

    &:nth-child(1) {
      text-align: right;  // For description column
    }
  }

  td {
    font-size: 13px;
    padding: 7px 12px;
    border: var(--internal-border);

    // ONLY use this if first column contains DESCRIPTION LABELS
    &:nth-child(1) {
      color: var(--standard-80);
      text-transform: uppercase;
      font-weight: bold;
      font-size: 10px;
      text-align: right;
      white-space: nowrap;
      width: 0px;
    }

    &:nth-child(2) {
      color: var(--standard-40);
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      max-width: 250px;
      line-height: 1.48;
    }

    &:nth-child(3) {
      white-space: nowrap;
    }
  }
}
```

**For tables WITHOUT description column (Expression | Result only):**
```css
/* Override first column to be code style, not label style */
table:last-child {
  td:nth-child(1) {
    color: var(--standard-40);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    text-transform: none;
    font-weight: normal;
    font-size: 13px;
    text-align: left;
  }
}
```

### Design Token Usage Rules

1. **ONLY use tokens you've seen in existing examples:**
   - `var(--standard-5)`, `var(--standard-15)`, `var(--standard-40)`, etc.
   - `var(--border)`, `var(--internal-border)`
   - `var(--primary-80)`, `var(--primary-0)`
   - `var(--subtle-gradient)`

2. **Use regular CSS if unsure about token existence**
   - Don't guess token names
   - Use hardcoded values like `1rem`, `16px` if needed
   - Use `--standard-N` colors for theme compatibility

### Template Parser Limitations (AVOID)

1. **Parentheses in string literals break mixed Lisp/JS syntax:**
   ```javascript
   // ❌ BROKEN - parser confuses ( in string with expression grouping
   {concat user.name ' (' (user.level === 'premium' ? 'Premium' : 'Standard') ')'}
   
   // ✅ WORKS - use different characters
   {concat user.name ': ' (user.level === 'premium' ? 'Premium' : 'Standard')}
   ```

### Example Content Guidelines

1. **Use intuitive helper functions:**
   ```javascript
   // ✅ GOOD - standard behavior
   formatName(first, last) { return `${first} ${last}`; }
   joinWith(array, separator) { return array.join(separator); }
   
   // ❌ CONFUSING - backwards or unusual behavior  
   formatName(first, last) { return `${last}, ${first}`; }
   joinWith(array, separator, prefix) { return prefix + array.join(separator); }
   ```

2. **Use meaningful, realistic data:**
   - Names: Alice, Bob, Charlie
   - Ages: 25, 28 (adult ages)
   - Arrays: ['Apple', 'Banana', 'Cherry'] for items
   - Objects: Simple user objects with name, role, active properties

3. **Ensure examples make sense:**
   - Don't format scores as prices (`$85` for a test score)
   - Add multiple items for array filtering ('Banana and Blueberry' not just 'Banana')
   - Use appropriate data types for calculations

### HTML Structure Guidelines

1. **Keep HTML simple:**
   - No wrapper divs unless necessary
   - No Semantic UI classic classes (`ui`, `celled`, `segment`)
   - Use plain HTML elements

2. **Expression display pattern:**
   ```html
   <td><code>{#html "{expression syntax}"}</code></td>
   <td>{expression syntax}</td>
   ```

### Example Organization Patterns

1. **Start simple, build complexity:**
   - Basic patterns first
   - Then nested/complex versions
   - Group related concepts together

2. **Use descriptive table sections:**
   - "Simple Spaced Functions"
   - "Nested Expressions" 
   - "Object and Array Literals"

3. **Clear, specific descriptions:**
   - "Nested function call" not "Function as argument"
   - "Multiple nesting levels" (and actually show multiple levels)
   - "Inlined ternary", "Array helper usage"

## Notes for Future AI Agents

### Process Requirements
- Review with user after EACH example initially until pattern is established
- Once you can "one shot" examples without feedback, update this proposal with final learnings
- Then proceed to complete all remaining examples

### Quality Checklist Before Creating Example
1. ✅ Folder name matches tokenized title exactly
2. ✅ ID field included only if needed
3. ✅ Used `getText()`, `template`, `css`, `defaultState` correctly
4. ✅ Table styling matches the established pattern
5. ✅ Only used known design tokens or regular CSS
6. ✅ Helper functions are intuitive and realistic
7. ✅ Examples use meaningful data that makes sense
8. ✅ Avoided parser limitations (parentheses in strings)
9. ✅ HTML is simple and semantic
10. ✅ Descriptions are clear and specific

### Reference Files
- **Existing examples**: `/docs/src/examples/templates/`
- **Component guide**: `/ai/guides/component-generation-instructions.md`  
- **Token guide**: `/ai/guides/css-token-guide.md`
- **Example metadata**: `/ai/docs/example-metadata-guide.md`

## Related Documentation

- `/ai/docs/example-creation-guide.md` - Example creation process
- `/ai/docs/example-metadata-guide.md` - Metadata requirements
- `/ai/packages/templating.md` - Templating system reference
- `/docs/src/pages/templates/` - Template documentation pages