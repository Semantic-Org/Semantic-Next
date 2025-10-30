# Adding New Template Syntax

This workflow outlines the complete process for implementing new template syntax features (like conditional blocks, loops, or reactive blocks) in Semantic UI.

## Overview

Adding new template syntax involves 6 main steps:
1. **Implementation** - Add parsing to template compiler and rendering logic
2. **Testing** - Write comprehensive tests for compiler and renderer
3. **Types** - Update TypeScript definitions for AST and directives
4. **Documentation** - Add syntax documentation and examples
5. **AI Guide** - Update AI documentation for the new syntax
6. **Release Notes** - Document the change

## File Locations

```
packages/templating/src/compiler/template-compiler.js    # Template parser
packages/renderer/src/lit/renderer.js                    # Render logic
packages/renderer/src/lit/directives/*.js                # Lit directives
packages/templating/test/compiler.test.js                # Compiler tests
packages/renderer/test/*.test.js                         # Renderer tests
docs/src/pages/templates/*.mdx                           # User guide documentation
docs/src/pages/api/templating/ast.mdx                    # API docs - AST reference
docs/src/examples/templates/*                            # Example components
docs/src/content/examples/*.mdx                          # Example metadata
ai/components/component-templates.md                     # AI template guide
ai/packages/templating.md                                # AI templating package guide
RELEASE-NOTES.md                                         # Change log
```

## Step 1: Implementation

### 1.1 Template Compiler
Add parsing logic to `/packages/templating/src/compiler/template-compiler.js`

#### Key Steps:
1. Add new token patterns to `basePatterns` or `createPatterns()`
2. Add parsing logic in `parseTag()` method
3. Create appropriate AST node structure
4. Handle nested content if applicable

#### Example Pattern:
```javascript
// Add to basePatterns
const basePatterns = {
  // ... existing patterns
  NEWSYNTAX: /\{#newsyntax\s+([^}]+)\}/,
  CLOSE_NEWSYNTAX: /\{\/newsyntax\}/,
};
```

#### AST Structure:
```javascript
{
  type: 'newsyntax',
  expression: 'someExpression',
  content: [], // nested AST nodes
  // other properties as needed
}
```

### 1.2 Renderer Implementation
Add evaluation logic to `/packages/renderer/src/lit/renderer.js`

#### Key Steps:
1. Add case in `readAST()` switch statement
2. Create `evaluateNewSyntax()` method
3. Map AST properties to directive arguments

#### Example:
```javascript
case 'newsyntax':
  this.addValue(this.evaluateNewSyntax(node, data));
  break;

// ... later in file
evaluateNewSyntax(node, data) {
  const directiveMap = (value, key) => {
    if (key == 'expression') {
      return () => this.lookupTokenValue(value, data);
    }
    if (key == 'content') {
      return () => this.renderContent({ ast: value, data });
    }
    return value;
  };
  
  let syntaxArguments = mapObject(node, directiveMap);
  return reactiveNewSyntax(syntaxArguments);
}
```

### 1.3 Directive Implementation
Create directive in `/packages/renderer/src/lit/directives/`

#### Key Components:
1. Extend `AsyncDirective` for reactive features
2. Implement `render()` method
3. Handle reactive updates if needed
4. Clean up in `disconnected()`

## Step 2: Testing

> **See Also:** [Testing Guide](/ai/guides/development/testing.md) for testing patterns and conventions.

### 2.1 Compiler Tests
Add tests to `/packages/templating/test/compiler.test.js`

#### Test Categories:
1. **Basic parsing** - Verify AST structure
2. **Expression parsing** - Test different expression formats
3. **Nested content** - Verify nested AST parsing
4. **Edge cases** - Invalid syntax, empty expressions

#### Example Test:
```javascript
describe('newsyntax block', () => {
  it('should parse basic newsyntax block', () => {
    const template = '{#newsyntax expression}content{/newsyntax}';
    const ast = compiler.compile(template);
    expect(ast).toEqual([{
      type: 'newsyntax',
      expression: 'expression',
      content: [{ type: 'html', html: 'content' }]
    }]);
  });
});
```

### 2.2 Renderer Tests
Add integration tests if needed in `/packages/renderer/test/`

## Step 3: TypeScript Definitions

### 3.1 AST Types
Update AST definitions if TypeScript types exist for the template compiler

### 3.2 Directive Types
Add types for any new directives in their respective files

## Step 4: Documentation

Documentation needs to be added in two places: User Guide and API Documentation.

### 4.1 User Guide Documentation
Add or update documentation in `/docs/src/pages/templates/`

**Important Decision Point**: Before creating documentation, determine:
1. Should this be added to an existing document or create a new one?
2. Which existing document is most appropriate if updating?

Choose appropriate file:
- `conditionals.mdx` - For conditional rendering
- `loops.mdx` - For iteration syntax  
- `async.mdx` - For async operations
- Create new file for novel concepts

#### User Guide Structure:
```markdown
## New Syntax Name

Brief, user-friendly description of what the syntax does and when to use it.

### Basic Syntax

\`\`\`html
{#newsyntax expression}
  Content here
{/newsyntax}
\`\`\`

### How It Works

Clear explanation in user-friendly terms...

### Examples

#### Basic Example
[Link to example with explanation]

#### Advanced Usage
[Link to example with explanation]

### When to Use

- Use case 1 with practical scenario
- Use case 2 with practical scenario

### Performance Considerations

User-friendly performance notes...
```

### 4.2 API Documentation
Update `/docs/src/pages/api/templating/ast.mdx` to include the new AST node structure.

#### Add AST Node Documentation:
```markdown
### newsyntax

Represents a newsyntax block that [technical description].

#### AST Structure
\`\`\`javascript
{
  type: 'newsyntax',
  expression: string,      // The expression to evaluate
  content: ASTNode[],      // Nested content nodes
  // other properties...
}
\`\`\`

#### Example Template
\`\`\`html
{#newsyntax someExpression}
  Content here
{/newsyntax}
\`\`\`

#### Produces
\`\`\`javascript
{
  type: 'newsyntax',
  expression: 'someExpression',
  content: [
    { type: 'html', html: '\n  Content here\n' }
  ]
}
\`\`\`
```

### 4.3 Create Examples
Create example components in `/docs/src/examples/templates/[example-name]/`

#### Required Files:
1. `component.html` - Template showing the syntax
2. `component.js` - Component logic
3. `component.css` - Styling (if needed)

### 4.4 Example Metadata
Create metadata in `/docs/src/content/examples/[example-name].mdx`

```yaml
---
title: "New Syntax Example"
slug: "template-newsyntax"
description: "Shows how to use the new syntax feature"
category: "templates"
tags: ["templates", "newsyntax"]
```

## Step 5: AI Guide

### 5.1 Template Guide
Update `/ai/components/component-templates.md`

Add to appropriate section:
- Template Syntax Overview
- Reactive Patterns
- Performance Patterns

### 5.2 Package Guide
Update `/ai/packages/templating.md` if adding new compiler features

## Step 6: Release Notes

Update `RELEASE-NOTES.md`:
```markdown
* **Templates** - Added `{#newsyntax}` blocks for [brief description]
```

## Verification Checklist

- [ ] Template compiler parses new syntax correctly
- [ ] Renderer evaluates syntax and produces correct output
- [ ] Directive handles all modes/options properly
- [ ] Compiler tests cover all syntax variations
- [ ] Coverage verified with `npm run test:coverage` - all reasonable lines covered
- [ ] TypeScript types updated (if applicable)
- [ ] User guide documentation added/updated in `/docs/src/pages/templates/`
  - [ ] Decision made: new document or update existing?
  - [ ] Clear user-friendly explanations provided
- [ ] API documentation updated in `/docs/src/pages/api/templating/ast.mdx`
  - [ ] AST node structure documented
  - [ ] Example template and output provided
- [ ] Working examples created and tested
- [ ] Example metadata files created
- [ ] AI guides updated with syntax reference
- [ ] Release notes updated
- [ ] All tests pass (`npm test` in relevant packages)

## Common Patterns

### Block Syntax
For syntax that wraps content:
```html
{#blockname expression}
  ...content...
{/blockname}
```

### Inline Syntax
For syntax without nested content:
```html
{@inline expression}
```

### Multi-Parameter Syntax
For syntax with multiple parameters:
```html
{#block main key=value option=setting}
  ...content...
{/block}
```

## Testing Workflow

1. Write failing compiler tests first
2. Implement compiler parsing
3. Write renderer tests
4. Implement renderer evaluation
5. Create directive implementation
6. Test with real examples
7. Add edge case tests

## Key Conventions

1. **AST Consistency** - Follow existing AST node patterns
2. **Expression Evaluation** - Use `lookupTokenValue` for reactive expressions
3. **Content Rendering** - Use `renderContent` for nested AST
4. **Directive Patterns** - Follow existing directive structures
5. **Test Coverage** - Test both single expressions and complex cases