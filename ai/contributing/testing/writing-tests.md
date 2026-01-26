---
title: Testing Guide
description: Comprehensive guide for writing and running tests, covering test organization, test types (unit, DOM, browser), coverage requirements, and package-specific testing patterns.
keywords: [testing, vitest, unit tests, DOM tests, browser tests, coverage, test patterns]
audience: contributing
type: doc
---

# Testing Guide

> **For:** AI agents writing or modifying tests
> **Prerequisites:** [Mental Model](/ai/framework/mental-model.md) • [Codebase Navigation](/ai/contributing/codebase-navigation.md)
> **Related:** [Component Generation](/ai/framework/creating-components.md) • [Package APIs](/ai/framework/)
> **Back to:** [Documentation Hub](/ai/00-START-HERE.md)

---

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Organization](#test-organization)
- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Package-Specific Patterns](#package-specific-patterns)
- [Common Testing Scenarios](#common-testing-scenarios)

---

## Testing Philosophy

### Principle: Minimal Complexity

**Always use the simplest test type that will produce reliable results:**
1. **Unit tests** if no DOM needed
2. **DOM tests** if jsdom suffices
3. **Browser tests** only when real browser features required

### Pattern Matching

**Respect existing conventions:** When adding tests to a package, examine existing test files in that package and match their patterns for structure, naming, and assertions.

---

## Test Organization

### Directory Structure

Each package contains tests in `packages/<package>/test/`:

```
packages/
├── component/
│   └── test/
│       ├── browser/          ← Browser tests (Playwright/Chromium)
│       └── fixtures/         ← Test fixtures
├── query/
│   └── test/
│       ├── browser/          ← Browser tests
│       ├── dom/              ← DOM tests (jsdom)
│       └── fixtures/         ← Test fixtures
├── reactivity/
│   └── test/
│       └── unit/             ← Unit tests (Node)
├── templating/
│   └── test/
│       ├── browser/          ← Browser tests
│       └── compiler.test.js  ← Root-level tests
├── utils/
│   └── test/
│       ├── browser/          ← Browser tests
│       └── arrays.test.js    ← Root-level tests
│       └── objects.test.js
└── renderer/
    └── test/
        └── browser/          ← Browser tests
```

### Global Test Infrastructure

The `tests/` directory at project root contains:
- `configs/` - Vitest configuration files
- `setup/` - Test environment setup files
- `scripts/` - Test utilities (coverage badges, etc.)

---

## Test Types

### 1. Unit Tests (`test/unit/` or `test/*.test.js`)

**Environment:** Node
**Use when:** Testing pure functions with no DOM dependencies

**Characteristics:**
- Fastest execution
- No DOM APIs available
- Node environment only
- Suitable for utilities, pure logic, algorithms

**Example:** `packages/utils/test/arrays.test.js`
```javascript
import { unique, filterEmpty } from '@semantic-ui/utils';
import { describe, expect, it } from 'vitest';

describe('Array Utilities', () => {
  describe('unique', () => {
    it('should remove duplicates', () => {
      const arr = [1, 2, 2, 3, 4, 4, 5];
      const result = unique(arr);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
```

### 2. DOM Tests (`test/dom/`)

**Environment:** jsdom
**Use when:** Need DOM APIs but not real browser features

**Characteristics:**
- DOM APIs available (document, createElement, etc.)
- No Shadow DOM
- No Custom Elements registry
- Faster than browser tests
- Good for DOM manipulation, query logic

**Example:** `packages/query/test/dom/query.test.js`
```javascript
import { $, $$ } from '@semantic-ui/query';
import { beforeEach, describe, expect, it } from 'vitest';

describe('query', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('selector', () => {
    it('should find elements by selector', () => {
      document.body.innerHTML = '<div class="test">Content</div>';
      const result = $('.test');
      expect(result.length).toBe(1);
    });
  });
});
```

### 3. Browser Tests (`test/browser/`)

**Environment:** Headless Chromium via Playwright
**Use when:** Need real browser features

**Required for:**
- Shadow DOM
- Custom Elements
- Web Components lifecycle
- Browser-specific APIs
- Full component integration testing

**Example:** `packages/component/test/browser/component.test.js`
```javascript
import { defineComponent } from '@semantic-ui/component';
import { describe, expect, it } from 'vitest';

describe('Component', () => {
  describe('defineComponent', () => {
    it('should handle component with CSS', () => {
      const TestComponent = defineComponent({
        tagName: 'test-css-component',
        template: '<div>Content</div>',
        css: '.container { color: red; }',
      });

      expect(TestComponent).toBeDefined();
      expect(TestComponent.styles).toBeDefined();
    });
  });
});
```

---

## Running Tests

### ⚠️ Important: Scope Your Test Runs

**DO NOT run tests globally across the entire project when working on specific features.**

Running all tests is slow, produces excessive output, and is rarely necessary during development.

**When to run tests:**
- ✅ **Package-level:** When working on a specific package
- ✅ **Filtered:** When testing specific files or features
- ❌ **Global:** Only for final verification or when explicitly requested by user

### Package-Level Tests (PREFERRED)

To run tests for a specific package:

```bash
# Navigate to package directory
cd packages/reactivity

# Run tests for this package
npm test

# Or from root with filter
npm test -- reactivity
```

### Filtering Tests

```bash
# Filter by test file name
npm test -- arrays

# Filter by test description
npm test -- "should remove duplicates"
```

### Global Test Commands (Use Sparingly)

**Only use these commands when:**
- User explicitly requests running all tests
- Final verification before committing major changes
- CI/CD scenarios (handled automatically)

```bash
# Run default test suite (AVOID during feature work)
npm test

# Watch mode (scoped to current work)
npm run test:watch

# Run all tests with UI (AVOID during feature work)
npm run test:all

# CI commands (typically not run by agents)
npm run ci:coverage      # With coverage
npm run ci:test          # All tests
npm run ci:test:unit     # Unit tests only
npm run ci:test:browser  # Browser tests only
```

---

## Test Coverage

### Running Coverage

When writing tests, **always run coverage** to ensure new code is adequately tested:

```bash
# From package directory
npm run test:coverage

# Or run specific test file with coverage
npm run test:coverage -- arrays
```

### Coverage Requirements

**When adding or modifying code:**
1. Write initial tests for the feature
2. Run `npm run test:coverage` to check coverage
3. Iterate on tests until all **reasonable lines** are covered
4. Verify coverage report shows new lines are tested

### What to Cover

**✅ Should be tested:**
- Public API methods and functions
- Conditional logic (if/else branches)
- Error handling paths
- Edge cases and boundary conditions
- Return value variations based on input
- State changes and side effects

**❌ Don't need to test:**
- Simple getters/setters that just pass through values
- Trivial one-line utilities with no logic
- Auto-generated code
- Type definitions
- Import/export statements

### Interpreting Coverage Reports

Coverage reports show four metrics:
- **Statements** - Individual statements executed
- **Branches** - Conditional branches (if/else) taken
- **Functions** - Functions called
- **Lines** - Lines of code executed

**Focus on:**
- **Lines** - Aim for 100% of new lines (that are reasonable to test)
- **Branches** - Ensure both true/false paths tested for conditionals

**Example coverage output:**
```
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   92.5  |   88.2   |   95.0  |   92.8  |
 arrays.js            |  100.0  |  100.0   |  100.0  |  100.0  |  ← Good!
 objects.js           |   85.7  |   75.0   |   90.0  |   86.2  |  ← Check untested branches
----------------------|---------|----------|---------|---------|
```

### Coverage Workflow

**Step-by-step process:**

1. **Implement feature** in source file
2. **Write initial tests** covering main functionality
3. **Run coverage:**
   ```bash
   npm run test:coverage
   ```
4. **Review uncovered lines** in the output
5. **Add tests** for uncovered lines (if reasonable to test)
6. **Re-run coverage** to verify
7. **Repeat steps 4-6** until satisfied

### Example Iteration

```javascript
// Initial test - basic functionality
it('should remove duplicates', () => {
  expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3]);
});

// Run coverage → shows edge cases not covered
// Add test for empty array
it('should handle empty arrays', () => {
  expect(unique([])).toEqual([]);
});

// Add test for single element
it('should handle single element', () => {
  expect(unique([1])).toEqual([1]);
});

// Run coverage → now shows 100% coverage
```

### When Coverage Isn't 100%

**It's acceptable to have uncovered lines when:**
- Testing requires complex mocking that's not worth the effort
- Code handles environmental issues (file system, network)
- Defensive code for "should never happen" scenarios
- Browser-specific APIs not available in test environment

**If the reason isn't obvious, explain to the user in the chat why certain lines aren't covered.**

---

## Writing Tests

### File Naming Conventions

**Utils Package:** Mirror source filenames
- `src/arrays.js` → `test/arrays.test.js`
- `src/objects.js` → `test/objects.test.js`

**Other Packages:** Logical grouping
- `packages/query/test/dom/query.test.js` (groups all query methods)
- `packages/templating/test/compiler.test.js` (groups compiler features)
- `packages/component/test/browser/component.test.js` (groups component features)

**Decision Process:**
1. Check if a reasonable filename already exists
2. If yes, add tests to existing file
3. If no, copy the naming pattern from that package

### Test Structure

```javascript
import { functionToTest } from '@semantic-ui/package';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

describe('Feature or Module Name', () => {
  // Setup that runs before each test
  beforeEach(() => {
    // Clean state for each test
    document.body.innerHTML = '';
  });

  // Cleanup after each test
  afterEach(() => {
    // Remove event listeners, timers, etc.
  });

  describe('specific method or behavior', () => {
    it('should describe expected behavior', () => {
      // Arrange: Set up test data
      const input = [1, 2, 3];

      // Act: Execute the code being tested
      const result = functionToTest(input);

      // Assert: Verify the result
      expect(result).toEqual([3, 2, 1]);
    });

    it('should handle edge case', () => {
      expect(functionToTest([])).toEqual([]);
    });
  });

  describe('error conditions', () => {
    it('should throw meaningful error', () => {
      expect(() => functionToTest(null)).toThrow();
    });
  });
});
```

### Common Test Patterns

**DOM Cleanup:**
```javascript
beforeEach(() => {
  document.body.innerHTML = '';
});
```

**Testing Settings Reactivity:**
```javascript
it('should react to setting changes', () => {
  const el = document.createElement('test-component');
  document.body.appendChild(el);
  el.settings.theme = 'dark';
  expect(el.shadowRoot.querySelector('.theme')).toHaveClass('dark');
});
```

**Testing Event Handling:**
```javascript
it('should handle click events', () => {
  const el = document.createElement('test-button');
  document.body.appendChild(el);
  const button = el.shadowRoot.querySelector('button');
  button.click();
  expect(el.clicked).toBe(true);
});
```

**Testing Signal Reactivity:**
```javascript
it('should update when signal changes', () => {
  const signal = createSignal(0);
  let value;
  reaction(() => {
    value = signal.get();
  });
  signal.set(5);
  expect(value).toBe(5);
});
```

---

## Package-Specific Patterns

### Component Tests

**Location:** `packages/component/test/browser/`
**Type:** Browser tests (requires Custom Elements)

**Test Coverage:**
- [ ] Component registration
- [ ] Settings vs state behavior
- [ ] Lifecycle hooks (onCreated, onRendered, onDestroyed)
- [ ] Event handling
- [ ] Template reactivity
- [ ] Shadow DOM encapsulation

### Query Tests

**Location:** `packages/query/test/dom/` or `packages/query/test/browser/`
**Type:** DOM tests for basic queries, browser tests for shadow DOM

**Test Coverage:**
- [ ] Selector behavior ($ vs $$)
- [ ] Method chaining
- [ ] Empty selection handling
- [ ] Shadow DOM traversal
- [ ] Component configuration (.settings, .initialize)

### Reactivity Tests

**Location:** `packages/reactivity/test/unit/`
**Type:** Unit tests (no DOM needed)

**Test Coverage:**
- [ ] Signal creation and updates
- [ ] Reaction dependency tracking
- [ ] Disposal and cleanup
- [ ] Batch updates
- [ ] Performance characteristics

### Templating Tests

**Location:** `packages/templating/test/`
**Type:** Mix of unit tests and browser tests

**Test Coverage:**
- [ ] Template compilation
- [ ] Expression evaluation
- [ ] Conditionals (#if)
- [ ] Loops (#each)
- [ ] Helper functions
- [ ] Reactivity integration

### Utils Tests

**Location:** `packages/utils/test/`
**Type:** Primarily unit tests (mirrors src/ structure)

**Test Coverage:**
- [ ] Pure function behavior
- [ ] Edge cases (null, undefined, empty)
- [ ] Type validation
- [ ] Performance characteristics
- [ ] Browser compatibility (in browser tests)

---

## Common Testing Scenarios

### Testing Component Communication

**Parent-child via findParent/findChild:**
```javascript
it('should access parent component', () => {
  document.body.innerHTML = `
    <parent-component>
      <child-component></child-component>
    </parent-component>
  `;
  const child = document.querySelector('child-component');
  const parent = child.component.findParent('parent-component');
  expect(parent).toBeDefined();
});
```

**Event-based communication:**
```javascript
it('should dispatch and handle events', () => {
  const component = document.createElement('test-component');
  let eventData;
  component.addEventListener('custom-event', (e) => {
    eventData = e.detail;
  });
  component.component.dispatchEvent('custom-event', { value: 42 });
  expect(eventData.value).toBe(42);
});
```

### Testing Template Reactivity

```javascript
it('should update DOM when state changes', async () => {
  const el = document.createElement('test-counter');
  document.body.appendChild(el);

  expect(el.shadowRoot.textContent).toContain('0');

  el.component.state.count.set(5);
  await vi.waitFor(() => {
    expect(el.shadowRoot.textContent).toContain('5');
  });
});
```

### Testing Memory Cleanup

```javascript
it('should cleanup reactions on destroy', () => {
  const el = document.createElement('test-component');
  document.body.appendChild(el);

  const signal = el.component.state.value;
  expect(signal.reactions.size).toBeGreaterThan(0);

  el.remove();
  expect(signal.reactions.size).toBe(0);
});
```

### Testing Error Conditions

```javascript
describe('error handling', () => {
  it('should throw on invalid input', () => {
    expect(() => functionToTest(null)).toThrow('Expected valid input');
  });

  it('should handle empty collections gracefully', () => {
    expect(functionToTest([])).toEqual([]);
  });
});
```

---

## Vitest Configuration

The project uses Vitest with three test environments:

**Config Location:** `tests/configs/vitest/vitest.config.js`

**Test Projects:**
1. **node** - Runs `test/unit/` and root-level `test/*.test.js`
2. **jsdom** - Runs `test/dom/` tests
3. **browser** - Runs `test/browser/` tests with Playwright

**Setup Files:**
- `tests/setup/node-setup.js` - Node environment
- `tests/setup/dom-setup.js` - jsdom environment
- `tests/setup/browser-setup.js` - Browser environment

---

## Best Practices

### Do's

✅ **Match existing patterns** in the package you're testing
✅ **Use the simplest test type** that works reliably
✅ **Clean up after tests** (DOM, event listeners, timers)
✅ **Test edge cases** (null, undefined, empty collections)
✅ **Use descriptive test names** that explain the scenario
✅ **Test public APIs** not internal implementation details
✅ **Run tests** before considering work complete

### Don'ts

❌ **Don't use browser tests** when DOM tests suffice
❌ **Don't leave test pollution** (global state, DOM elements)
❌ **Don't test implementation details** (internal state/methods)
❌ **Don't write interdependent tests** (tests should be isolated)
❌ **Don't skip edge cases** (they catch real bugs)
❌ **Don't create new test files** without checking for existing logical groupings

---

## Quick Reference

**Choosing test type:**
- No DOM needed → **unit test**
- Need document.createElement → **DOM test**
- Need Custom Elements/Shadow DOM → **browser test**

**File naming:**
- Utils → mirror src/ filename
- Others → logical grouping

**Running tests (always scope to your work):**
- Package: `cd packages/<name> && npm test` ← PREFERRED
- Filter: `npm test -- <filter>` ← PREFERRED
- Coverage: `cd packages/<name> && npm run test:coverage` ← USE when writing tests
- Global: `npm test` ← AVOID unless explicitly requested

**Coverage workflow:**
1. Write tests
2. Run `npm run test:coverage`
3. Review uncovered lines
4. Add tests for uncovered reasonable lines
5. Repeat until satisfied

**Common imports:**
```javascript
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
```

---

**Last Updated:** 2026-01-26
**Maintenance:** Update when test infrastructure or conventions change
