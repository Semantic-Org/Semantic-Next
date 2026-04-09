---
title: Writing and Running Tests
description: How to write, organize, and run tests in the Semantic UI monorepo. Covers the three test environments (node, jsdom, browser), Vitest configuration, and repo-specific patterns.
keywords: [testing, vitest, unit tests, DOM tests, browser tests, coverage, Reaction.flush, shadow DOM, playwright]
audience: contributing
skill: testing
type: skill
---

# Writing and Running Tests

> **Skill:** `testing`
> **Purpose:** Repo-specific test conventions, environment selection, and patterns for writing tests in the Semantic UI monorepo

---

## Golden Rule

**Use the simplest test environment that produces reliable results.** Unit > DOM > Browser. Browser tests are slow and require Playwright — only use them when you need Custom Elements, Shadow DOM, or real browser APIs.

---

## Test Environments

Vitest is configured with three project environments. The directory a test file lives in determines which environment runs it:

| Directory pattern | Environment | Runner | Use when |
|---|---|---|---|
| `test/unit/**/*.test.js` or `test/*.test.js` | Node | Vitest threads | Pure functions, no DOM |
| `test/dom/**/*.test.js` | jsdom | Vitest threads | DOM APIs needed, but no Shadow DOM or Custom Elements |
| `test/browser/**/*.test.js` | Chromium | Playwright via `@vitest/browser-playwright` | Shadow DOM, Custom Elements, web component lifecycle |

```
❌ Putting a Shadow DOM test in test/dom/ — jsdom doesn't support it
✅ Putting a Shadow DOM test in test/browser/
```

---

## Directory Structure

Each package contains its own `test/` directory:

```
packages/
├── component/test/browser/         ← Browser (Custom Elements required)
├── query/test/dom/                 ← DOM (basic query logic)
├── query/test/browser/             ← Browser (shadow DOM traversal)
├── reactivity/test/unit/           ← Unit (pure signal/reaction logic)
├── renderer/test/browser/          ← Browser (Lit rendering)
├── templating/test/                ← Root-level unit tests (compiler)
├── templating/test/browser/        ← Browser (scanner in real DOM)
├── utils/test/                     ← Root-level unit tests (arrays, objects, etc.)
├── utils/test/dom/                 ← DOM (debug, cloning, types)
└── utils/test/browser/             ← Browser (CSS, browser-specific utils)
```

Other directories with their own test configs (not part of the global `packages/` test suite):

```
tools/cdn/
├── test/unit/worker.test.js        ← Node: parseRoute, worker fetch with mocked R2
├── test/browser/cdn.test.js        ← Browser: live smoke tests (combo, presets, sourcemaps)
├── test/browser/packages.test.js   ← Browser: live smoke tests (import map, individual packages)
├── vitest.config.js                ← Browser tests only
└── vitest.unit.config.js           ← Unit tests only
```

CDN test commands:

| Command | What it runs |
|---------|-------------|
| `cd tools/cdn && npm test` | Browser smoke tests (hits live cdn.semantic-ui.com) |
| `cd tools/cdn && npm run test:unit` | Worker unit tests (parseRoute, fetch handler) |
| `cd tools/cdn && npm run test:check` | Lint checks (bare imports + sourcemaps in build output) |

Global test infrastructure lives at the project root:

```
tests/
├── configs/vitest/                 ← Vitest config files
│   ├── vitest.config.js            ← Default (node + jsdom + browser)
│   ├── vitest-watch.config.js      ← Watch mode
│   ├── vitest-all.config.js        ← UI reporter + coverage
│   ├── ci-coverage.config.js       ← CI with Istanbul coverage
│   └── projects/{node,jsdom,browser}.js
├── setup/                          ← Setup files (currently empty stubs)
└── scripts/                        ← Badge generation, test-case server
```

---

## Running Tests

Every package has its own `vitest.config.js` with all three project environments (node, jsdom, browser) defined inline. **Always `cd` into the directory with the `vitest.config.js` first** — this is the fastest and most reliable way to run tests.

> **Not just `packages/`** — some directories outside `packages/` have their own test configs (e.g. `tools/cdn/`). The same pattern applies: `cd` into the directory and run `npm test`.

**Default command — run all tests in a package:**

```bash
cd packages/<name> && npm test
```

This runs `vitest` which executes all three environments (node, jsdom, browser) for that package and exits. Use this when told to "run tests", "run all tests", or "verify changes" for a package. The sections below show how to narrow scope when you only need a subset.

### Run only one environment (node, jsdom, or browser)

Use `--project` to select the environment. The project names are `node`, `jsdom`, and `browser`.

```bash
# Unit tests only (node environment)
cd packages/reactivity && npx vitest --run --project node

# DOM tests only (jsdom environment)
cd packages/query && npx vitest --run --project jsdom

# Browser tests only (Chromium via Playwright)
cd packages/component && npx vitest --run --project browser
```

```
❌ cd packages/query && npx vitest --run test/dom/     — path filter doesn't work like this
❌ npx vitest --run --environment jsdom                — not a valid flag for project selection
✅ cd packages/query && npx vitest --run --project jsdom
```

### Run a single test file

Pass the file path after `--run`:

```bash
cd packages/utils && npx vitest --run test/equality.test.js
cd packages/utils && npx vitest --run test/dom/cloning.test.js
cd packages/query && npx vitest --run test/browser/query.test.js
```

Vitest auto-selects the correct project (node/jsdom/browser) based on the file's directory.

### Run tests matching a name pattern

Use `-t` to filter by test name (matches against `describe` and `it` strings):

```bash
cd packages/reactivity && npx vitest --run -t "should track"
cd packages/reactivity && npx vitest --run --project node -t "should track"
```

### Run from the repo root (cross-package)

Use `--c` to point at the global config, then filter by filename keyword:

```bash
# All tests in files matching "equality" across all packages
npx vitest --c tests/configs/vitest/vitest.config.js --run equality

# Only node tests matching "equality"
npx vitest --c tests/configs/vitest/vitest.config.js --run --project node equality
```

### Watch mode

Package configs set `watch: false`, so `npx vitest` runs and exits. Use `--watch` to override:

```bash
cd packages/reactivity && npx vitest --watch
cd packages/reactivity && npx vitest --watch --project node
```

### Coverage

Every package has `test:coverage`:

```bash
cd packages/utils && npm run test:coverage
```

There is no root-level `test:coverage`. For full-project coverage, use:

```bash
npm run ci:coverage    # Istanbul, json-summary + json reporters
```

CI coverage thresholds (from `ci-coverage.config.js`):
- Lines: 30%
- Functions: 30%
- Branches: 30%
- Statements: 30%

### All root-level commands

| Command | What it does | When to use |
|---------|-------------|-------------|
| `npm test` | All environments, no watch | Final verification only |
| `npm run test:watch` | All environments, watch mode | Active development |
| `npm run test:all` | UI reporter + coverage | Interactive review |
| `npm run ci:coverage` | Istanbul coverage, json output | CI / checking coverage |
| `npm run ci:test` | All tests for CI | CI pipeline |
| `npm run ci:test:unit` | Non-browser tests for CI (node + jsdom) | CI pipeline |
| `npm run ci:test:browser` | Browser tests only for CI | CI pipeline |

### Quick command reference

| Goal | Command (from package dir) |
|------|---------------------------|
| All tests | `npx vitest --run` |
| Unit only | `npx vitest --run --project node` |
| DOM only | `npx vitest --run --project jsdom` |
| Browser only | `npx vitest --run --project browser` |
| One file | `npx vitest --run test/unit/signal.test.js` |
| By name | `npx vitest --run -t "test name"` |
| Combine | `npx vitest --run --project node -t "test name"` |

---

## Import Conventions

Most test files import from the published package name:

```javascript
import { unique, filterEmpty } from '@semantic-ui/utils';
import { $, $$ } from '@semantic-ui/query';
import { Reaction, Signal } from '@semantic-ui/reactivity';
import { TemplateCompiler } from '@semantic-ui/templating';
import { LitRenderer } from '@semantic-ui/renderer';
```

One exception: `packages/component/test/browser/component.test.js` uses a relative import:

```javascript
import { defineComponent } from '../../src/index.js';
```

When adding tests to an existing package, match the import style already used in that package.

---

## File Naming

**Utils package** mirrors source filenames 1:1:
- `src/arrays.js` → `test/arrays.test.js`
- `src/objects.js` → `test/objects.test.js`

**Other packages** use logical groupings:
- `packages/query/test/dom/query.test.js` — groups all query methods
- `packages/component/test/browser/component.test.js` — groups component features

Before creating a new test file, check if a file already exists that covers the same module. Add to existing files when the grouping makes sense.

---

## Repo-Specific Patterns

### Reaction.flush() for synchronous reactivity assertions

Reactions are batched asynchronously by default. In unit tests, call `Reaction.flush()` after mutating signals to synchronously process the queue:

```javascript
import { Reaction, Signal } from '@semantic-ui/reactivity';

it('should track signal changes', () => {
  const signal = new Signal(0);
  let tracked;
  signal.subscribe(() => { tracked = signal.get(); });

  signal.set(5);
  Reaction.flush();  // Process pending reactions immediately

  expect(tracked).toBe(5);
});
```

This is the dominant pattern in `packages/reactivity/test/unit/` — used extensively in both `signal.test.js` and `reaction.test.js`.

### await el.updateComplete for component rendering

In browser tests, after creating or mutating a component, await `updateComplete` before querying the DOM:

```javascript
const el = document.createElement('test-component');
document.body.appendChild(el);
await el.updateComplete;

const content = el.shadowRoot.querySelector('.content');
expect(content.textContent).toContain('Hello');
```

### DOM cleanup in beforeEach

```javascript
beforeEach(() => {
  document.body.innerHTML = '';
});
```

Used in DOM and browser tests to prevent test pollution.

### describe.concurrent for independent tests

`packages/reactivity/test/unit/signal.test.js` uses `describe.concurrent` to parallelize independent signal tests. Use this only when tests share no mutable state.

### Comment dividers for section grouping

The reactivity tests use decorative comment blocks to separate logical groups:

```javascript
/*******************************
            Creation
*******************************/
```

Match this style when adding tests to files that use it.

---

## Vitest Browser API Patterns (Shadow DOM)

For browser tests involving Shadow DOM components, Vitest's browser mode provides `page` locators and `userEvent`:

```javascript
import { page, userEvent } from 'vitest/browser';
import { Reaction } from '@semantic-ui/reactivity';

// Query shadow DOM natively, wrap with locator for retriable assertions
const el = document.createElement('my-component');
document.body.appendChild(el);
await el.updateComplete;

const button = el.shadowRoot.querySelector('.btn');
await expect.element(page.elementLocator(button)).toBeVisible();

// User events work with native shadow DOM elements
await userEvent.click(button);

// For reactive state changes: flush + re-query
el.component.increment();
Reaction.flush();
const result = el.shadowRoot.querySelector('.result');
await expect.element(page.elementLocator(result)).toHaveTextContent('1');
```

Available retriable matchers: `toHaveTextContent()`, `toBeVisible()`, `toBeDisabled()`, `toBeEnabled()`, `toBeInTheDocument()`.

Reference file: `packages/component/test/browser/vitest4-example.js` (example only, not an active test).

---

## Quick Reference

**Choosing environment:**

| Need | Environment | Directory |
|------|-------------|-----------|
| Pure functions | Node | `test/unit/` or `test/*.test.js` |
| `document.createElement` | jsdom | `test/dom/` |
| Custom Elements / Shadow DOM | Chromium | `test/browser/` |

**Running tests:**

```bash
cd packages/<name> && npm test          # Run package tests
cd packages/<name> && npm run test:coverage  # Package coverage
npm run ci:coverage                     # Full project coverage
```

**Key patterns:**

```javascript
Reaction.flush();           // Sync-flush reactions in unit tests
await el.updateComplete;    // Wait for component render in browser tests
document.body.innerHTML = '';  // Clean DOM between tests
```

**Imports:**

```javascript
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { Reaction, Signal } from '@semantic-ui/reactivity';
import { page, userEvent } from 'vitest/browser';  // browser tests only
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Repo Guide** | `repo-guide` | Navigating the monorepo structure |
| **Component Authoring** | `component-authoring` | Understanding component architecture before testing |
| **Internals** | `internals` | Deep understanding of framework internals |
