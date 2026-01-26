---
title: Testing Architecture
description: Technical guide to the test infrastructure - config structure, CI integration, and how to modify the testing system.
keywords: [testing, vitest, configuration, CI, infrastructure, architecture]
audience: contributing
type: doc
---

# Testing Architecture

> **For:** AI agents modifying test infrastructure, debugging CI, or extending the test system
> **Prerequisites:** [Writing Tests](/ai/contributing/testing/writing-tests.md)
> **Back to:** [Documentation Hub](/ai/00-START-HERE.md)

---

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Config Structure](#config-structure)
- [Project Files](#project-files)
- [Config Files](#config-files)
- [Package Configs](#package-configs)
- [Key Dependencies](#key-dependencies)
- [Common Modifications](#common-modifications)
- [CI Integration](#ci-integration)
- [Debugging](#debugging)

---

## Design Philosophy

### Separation of Concerns

The test infrastructure separates **what to test** from **how to test**:

- **Project files** define test environments (node, jsdom, browser)
- **Config files** define test behavior (reporters, output, coverage)

This allows multiple configs to share the same project definitions without duplication.

### Composability

Project definitions are individual modules that configs import and compose:

```javascript
// Config imports what it needs
import node from './projects/node.js';
import jsdom from './projects/jsdom.js';
import browser from './projects/browser.js';

// Compose for specific use case
projects: [node, jsdom, browser]  // all tests
projects: [node, jsdom]           // unit tests only
projects: [browser]               // browser tests only
```

---

## Full Directory Structure

```
tests/
├── configs/
│   └── vitest/
│       ├── projects/           ← Composable test environment definitions
│       │   ├── node.js
│       │   ├── jsdom.js
│       │   └── browser.js
│       ├── vitest.config.js    ← npm test
│       ├── vitest-watch.config.js ← npm run test:watch
│       ├── vitest-all.config.js   ← npm run test:all (UI)
│       ├── ci-test-all.config.js
│       ├── ci-test-unit.config.js
│       ├── ci-test-browser.config.js
│       └── ci-coverage.config.js
├── setup/                      ← Setup files (intentionally empty stubs)
│   ├── node-setup.js
│   ├── dom-setup.js
│   └── browser-setup.js
├── results/                    ← CI output (junit XML, JSON)
├── coverage/                   ← Coverage reports
├── scripts/
│   └── create-unit-test-badge.js  ← Lambda handler for dynamic badges
└── test-case/                  ← Manual testing sandbox
    └── README.md
```

---

## Config Structure

```
tests/configs/vitest/
├── projects/                    ← Test environment definitions
│   ├── node.js                  ← Node environment (unit tests)
│   ├── jsdom.js                 ← jsdom environment (DOM tests)
│   └── browser.js               ← Browser environment (Playwright)
├── vitest.config.js             ← Default local development
├── vitest-all.config.js         ← Full suite with HTML reporter
├── ci-test-all.config.js        ← CI: all tests with junit output
├── ci-test-unit.config.js       ← CI: unit tests only
├── ci-test-browser.config.js    ← CI: browser tests only
└── ci-coverage.config.js        ← CI: coverage reporting
```

---

## Project Files

Each project file exports a single configuration object defining one test environment.

### projects/node.js

```javascript
export default {
  test: {
    include: [
      '**/test/unit/**/*.test.{ts,js}',
      '**/test/*.test.{ts,js}'
    ],
    name: 'node',
    environment: 'node',
    setupFiles: ['tests/setup/node-setup.js'],
  }
};
```

**Runs:** `test/unit/` folders and root-level `test/*.test.js` files
**Environment:** Pure Node.js, no DOM

### projects/jsdom.js

```javascript
export default {
  test: {
    include: ['**/test/dom/**/*.test.{ts,js}'],
    name: 'jsdom',
    environment: 'jsdom',
    setupFiles: ['tests/setup/dom-setup.js'],
  }
};
```

**Runs:** `test/dom/` folders
**Environment:** jsdom (simulated DOM, no Shadow DOM or Custom Elements)

### projects/browser.js

```javascript
import { playwright } from '@vitest/browser-playwright';

export default {
  test: {
    include: ['**/test/browser/**/*.test.{ts,js}'],
    name: 'browser',
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      screenshotFailures: false,
      instances: [{ browser: 'chromium' }],
    },
    setupFiles: ['tests/setup/browser-setup.js'],
  }
};
```

**Runs:** `test/browser/` folders
**Environment:** Real Chromium via Playwright
**Required for:** Shadow DOM, Custom Elements, Web Components

---

## Config Files

### vitest.config.js (Default)

**Purpose:** Quick local development testing
**Command:** `npm test`

```javascript
import node from './projects/node.js';
import jsdom from './projects/jsdom.js';
import browser from './projects/browser.js';

export default defineConfig({
  test: {
    watch: false,
    projects: [node, jsdom, browser],
  },
});
```

### vitest-watch.config.js

**Purpose:** Watch mode for development
**Command:** `npm run test:watch`

- Re-runs tests on file changes
- Uses all three projects (node, jsdom, browser)
- Ideal for TDD workflow

### vitest-all.config.js

**Purpose:** Full test suite with HTML reporter and coverage
**Command:** `npm run test:all`

- HTML reporter for visual inspection
- Coverage enabled with HTML output
- Opens Vitest UI in browser

### ci-test-all.config.js

**Purpose:** CI pipeline - all tests
**Command:** `npm run ci:test`

- junit reporter for CI systems
- Output to `tests/results/test-results-all-junit.xml`

### ci-test-unit.config.js

**Purpose:** CI pipeline - unit tests only (faster)
**Command:** `npm run ci:test:unit`

- Only node and jsdom projects (no browser)
- json and junit reporters
- Allows parallelization with browser tests

### ci-test-browser.config.js

**Purpose:** CI pipeline - browser tests only
**Command:** `npm run ci:test:browser`

- Only browser project
- json and junit reporters
- Runs separately from unit tests

### ci-coverage.config.js

**Purpose:** CI pipeline - coverage reporting
**Command:** `npm run ci:coverage`

- Coverage thresholds enforced
- json-summary and json reporters
- Reports to `tests/coverage/`

---

## Package Configs

Each package in `packages/` has its own `vitest.config.js` for standalone testing:

```javascript
// packages/utils/vitest.config.js
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    watch: false,
    reporters: ['default'],
    projects: [
      // Inline projects - same structure as shared project files
      { test: { name: 'node', environment: 'node', ... } },
      { test: { name: 'jsdom', environment: 'jsdom', ... } },
      { test: { name: 'browser', browser: { provider: playwright(), ... } } },
    ],
  },
});
```

**Usage:** `cd packages/utils && npm test`

Package configs use inline projects rather than imports because they're self-contained and run independently from the monorepo config.

---

## Key Dependencies

### @vitest/browser-playwright

**Purpose:** Browser testing provider for Vitest 4+

```javascript
import { playwright } from '@vitest/browser-playwright';

browser: {
  provider: playwright(),  // Factory function, not string
}
```

**Installation:** `npm install -D @vitest/browser-playwright`

### Playwright

**Purpose:** Browser automation

After updating Playwright version, install new browsers:
```bash
npx playwright install chromium
```

---

## Common Modifications

### Adding a New Test Environment

1. Create `tests/configs/vitest/projects/newenv.js`:
```javascript
export default {
  test: {
    include: ['**/test/newenv/**/*.test.{ts,js}'],
    name: 'newenv',
    environment: 'your-environment',
    setupFiles: ['tests/setup/newenv-setup.js'],
  }
};
```

2. Import and add to relevant configs:
```javascript
import newenv from './projects/newenv.js';
projects: [node, jsdom, browser, newenv]
```

3. Create setup file `tests/setup/newenv-setup.js` if needed

### Changing Reporters

Vitest 4 uses `reporters` (plural):

```javascript
// Simple list
reporters: ['default', 'json', 'junit']

// With options
reporters: [
  ['default', { summary: false }],
  'junit'
]
```

**Available reporters:** default, verbose, dot, json, junit, html, hanging-process

### Adjusting Coverage Thresholds

Edit `ci-coverage.config.js`:

```javascript
coverage: {
  thresholds: {
    lines: 30,      // Minimum line coverage %
    functions: 30,  // Minimum function coverage %
    branches: 30,   // Minimum branch coverage %
    statements: 30  // Minimum statement coverage %
  }
}
```

### Adding Setup Files

Setup files in `tests/setup/` are **intentionally empty stubs**. They're referenced in project configs as placeholders for future use.

1. Create `tests/setup/your-setup.js`
2. Add to relevant project file:
```javascript
setupFiles: ['tests/setup/node-setup.js', 'tests/setup/your-setup.js']
```

### Console Log Filtering

Lit dev mode warnings are filtered via `onConsoleLog` in each config:

```javascript
onConsoleLog(log) {
  if (log.includes('Lit is in dev mode.')) return false;
}
```

This is done in configs rather than setup files because it needs to run at the Vitest level, not within test environments.

---

## Additional Components

### Test Case Sandbox (`tests/test-case/`)

A standalone environment for manual testing and bug reproduction:

- **Purpose:** Create minimal reproducible test cases for debugging or GitHub issues
- **Usage:** `npm run test:case` (requires wireit config)
- **Structure:** Self-contained component with HTML, CSS, JS and esbuild hot reload

See `tests/test-case/README.md` for details.

### Badge Script (`tests/scripts/create-unit-test-badge.js`)

A **Lambda handler** (not run in CI) that generates dynamic test badges:

1. CI uploads test result JSON as artifacts
2. Lambda fetches artifacts from GitHub API
3. Returns badge JSON for shields.io or similar services

This enables dynamic "X of Y tests passing" badges in the README.

---

## CI Integration

### Pipeline Structure

```
CI Pipeline
├── Unit Tests (ci-test-unit)     ← Fast, no browser
├── Browser Tests (ci-test-browser) ← Parallel with unit
└── Coverage (ci-coverage)        ← After tests pass
```

### Output Files

| Config | Output |
|--------|--------|
| ci-test-all | `tests/results/test-results-all-junit.xml` |
| ci-test-unit | `tests/results/test-results-unit-junit.xml` |
| ci-test-browser | `tests/results/test-results-browser-junit.xml` |
| ci-coverage | `tests/coverage/` |

### CI-Specific Considerations

- **junit format:** Required for most CI systems to display test results
- **json format:** Used for programmatic analysis
- **summary: false:** Reduces noise in CI logs

---

## Debugging

### Common Issues

**"browser.provider configuration was changed"**
```
Error: The `browser.provider` configuration was changed to accept a factory instead of a string
```
**Fix:** Change `provider: 'playwright'` to `provider: playwright()` with import from `@vitest/browser-playwright`

**"Failed to load custom Reporter"**
```
Error: Failed to load custom Reporter from default,[object Object]
```
**Fix:** Change `reporter:` to `reporters:` (plural)

**"Executable doesn't exist"**
```
Error: browserType.launch: Executable doesn't exist at ~/.cache/ms-playwright/...
```
**Fix:** Run `npx playwright install chromium`

**"defineWorkspace is not exported"**
```
SyntaxError: The requested module 'vitest/config' does not provide an export named 'defineWorkspace'
```
**Fix:** Vitest 4 removed `defineWorkspace`. Export plain objects and import them into configs.

### Debugging Test Failures

1. **Run specific test file:**
   ```bash
   npm test -- path/to/test.test.js
   ```

2. **Run with verbose output:**
   ```bash
   npm test -- --reporter=verbose
   ```

3. **Run single project:**
   ```bash
   npm test -- --project=browser
   ```

4. **Check which project runs a test:**
   Look at the badge in output: `[node]`, `[jsdom]`, or `[browser (chromium)]`

---

## Vitest 4 Migration Notes

Key changes from Vitest 3:

| Vitest 3 | Vitest 4 |
|----------|----------|
| `workspace: './file.js'` | `projects: ['./file.js']` or import |
| `defineWorkspace([...])` | Export plain objects |
| `provider: 'playwright'` | `provider: playwright()` with import |
| `reporter: [...]` | `reporters: [...]` (plural) |
| `'basic'` reporter | `['default', { summary: false }]` |

---

**Last Updated:** 2026-01-26
**Maintenance:** Update when test infrastructure changes
