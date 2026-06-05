---
title: Writing and Running Tests
description: How to write, organize, and run tests in the Semantic UI monorepo. Covers the three test environments (node, jsdom, browser), Vitest configuration, and repo-specific patterns.
keywords: [testing, vitest, unit tests, DOM tests, browser tests, coverage, flush, shadow DOM, playwright]
audience: contributing
skill: testing
type: skill
---

# Writing and Running Tests

> **Skill:** `testing`
> **Purpose:** Repo-specific test conventions, environment selection, and patterns for writing tests in the Semantic UI monorepo

> **Before designing tests:** This skill is mechanics — environments, runners, file placement. For _what_ to assert and how to derive expectations from user-facing intent, load `grounded-testing` first. The two skills are designed to be loaded together.

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

### Wall-clock budget and stuck-process cleanup

The full repo suite (`npm test` from root, ~3600 tests across 82 files) finishes in **~28s**.
A **60-second timeout is plenty**; anything longer means something's stuck — almost always
a leftover Vitest watcher (or its Playwright/Chromium spawns) holding ports from a previous
session. A single package's browser suite should finish in well under 15s; if it doesn't,
the culprit is the same.

When you hit a timeout, don't just retry — kill the stragglers first:

```bash
# Find them
ps aux | grep -iE "vitest|chrome-headless" | grep -v grep

# Kill the parent vitest node processes (the chromium children die with them)
kill <pid> <pid> ...

# Confirm clear
ps aux | grep -iE "vitest|chrome-headless" | grep -v grep | wc -l   # should be 0
```

Common signs of a stuck watcher: tests hang past the 2-minute budget, "Failed to fetch
dynamically imported module" errors at random files (port collisions), or vitest output
just never appears.

### Flaky setup vs real test failures

Browser tests on WSL2 hosts sometimes fail at setup with `Failed to fetch dynamically imported module` or `Cannot connect to the iframe ... CORS`. These are infrastructure races during vitest's browser bootstrap, not test-body failures, and they appear non-deterministically — different files fail on each run.

**The dismissive trap:** when failing test names match the scope of what you just committed, that is a real bug, not the host flaking. The give-away: a setup flake fails at *import* before any test runs and the failed files shift each run; a real bug fails inside an `expect(...)` and the same named tests fail every time. Persistent failures whose names map to your diff are ground truth — CI is the gate, do not retry expecting silence.

Quick disambiguation:

| | flake | real failure |
|---|---|---|
| Which files fail | different files each run | same tests every run |
| Failure surface | module-fetch / iframe-CORS at setup | assertion failure inside test body |
| Scope match | unrelated to recent edits | tests cover what you just touched |
| Resolves on isolation re-run | usually yes | no |

When in doubt, re-run the suspect files in isolation. A setup flake clears, a real failure persists. If a CI run reports failures on tests whose names track the area of your change, trust CI even when local runs look noisy.

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
import { TemplateCompiler } from '@semantic-ui/compiler';
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

### flush() for synchronous reactivity assertions

Reactions are batched asynchronously by default. In unit tests, call `flush()` after mutating signals to synchronously process the queue:

```javascript
import { flush, signal, reaction } from '@semantic-ui/reactivity';

it('should track signal changes', () => {
  const count = signal(0);
  let tracked;
  reaction(() => { tracked = count.get(); });

  count.set(5);
  flush();  // Process pending reactions immediately

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

### Comments that earn their keep

A test comment earns its keep when it answers "what would a future reader miss if I removed this?" The shape: short, conversational, focused on the non-obvious WHY that the test body doesn't show. Real examples from the codebase:

**Test isolation rationale** — `packages/query/test/browser/behavior.test.js`:

```javascript
// Each test registers under a unique name so behaviors don't leak across
// tests (Query.behaviors is global static state and registerBehavior() is a
// silent no-op for duplicate names).
let counter = 0;
const uniqueName = (base) => `${base}_${++counter}`;
```

Without this, a reader wonders why every test invents a name. The "silent no-op" detail is a real gotcha — re-registration doesn't throw, it returns the prior behavior.

**Real consumer reference** — `packages/query/test/browser/behavior.test.js`:

```javascript
// pattern used by Tooltip's onHidden: $(this).tooltip('set text', 'Copy Code')
it('supports natural-language two-word setter invocation', () => { ... });
```

Anchors the test to actual production usage. The test name says *what*; the comment says *where*.

**User-facing contract pin** — `packages/query/test/browser/behavior.test.js`:

```javascript
// data-* with falsy values (0, false, '') must override settings
// common pattern: data-enabled="false" should disable a default of true
it('lets data-* attributes override settings with false values', () => { ... });
```

Names the user expectation in concrete terms, not the implementation detail.

**Structural invariant** — `packages/renderer/test/browser/template-conditional.test.js`:

```javascript
// cross-type swap is structurally impossible: a name can't be both registered and declared inline
it('subtemplate name expression resolving to a Template instance swaps correctly', async () => { ... });
```

Explains why the test scenario is bounded — answers "why doesn't this cover swap-from-X-to-Y?"

**Cross-engine setup rationale** — `packages/renderer/test/browser/async-expression.test.js`:

```javascript
// throw propagates when errorContent is empty
// native surfaces it synchronously via window.error, lit's microtask render surfaces via unhandledrejection
// listen for both since the contract is "error reaches the host" not via a specific event
```

Justifies a non-obvious test setup (listening to two different browser events) by naming the engine difference.

**Failure mode the test catches** — `packages/tailwind/test/tailwind-plugin.test.js`:

```javascript
// if two adjacent strings concatenated without a separator, "bg-red-500" + "p-4"
// would scan as "bg-red-500p-4", not a valid Tailwind class. newlines preserve boundaries
it('joins extracted sources with newlines so adjacent strings cannot merge into invalid candidates', () => { ... });
```

Names the regression the test guards against — the specific bad concatenation that would slip past if the separator regressed.

The common pattern: each comment either documents a user-facing expectation, names a real consumer, explains a non-obvious constraint, or names the failure mode the test catches. None of them narrate what the next line of code does — that's what the `it()` name and the assertions are for.

### Comments to avoid in tests

Test source is terse. The `it()` name and the assertions do the work. Add a comment only when explaining genuinely non-obvious WHY — a browser quirk, a perf constraint, a subtle invariant that's not visible from reading the test body.

Patterns that should not appear in shipped test code:

- Citation markers — `[source X]`, `[skill X]`, `[example X]`, `[doc:X]`, `[inference]`, `[synthesis]`. These belong in your `ai/workspace/` intent doc, not the test file.
- `Witness:` / `FINDING:` / `Documented user workaround:` prefixed prose. Same — design-doc scaffolding, not artifact.
- Inline narration that restates the assertion (`// initial only` next to `expect(callback).toHaveBeenCalledTimes(1)`). The assertion already does that.
- Generic section labels mid-test that aren't `describe()` blocks (`// Test conditional dependencies`).
- File-level header docblocks describing what the file tests. The filename + `describe()` names cover it.
- File-level `// Red-team coverage for X` framing. Red-team is the design discipline, not a test-file label.

When the comment doesn't have a clear answer to "what would a future reader miss if I removed this?", remove it. See [grounded-testing § Labels and intent prose leaking into test source](./grounded-testing.md#labels-and-intent-prose-leaking-into-test-source) for the rationale.

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
flush();
const result = el.shadowRoot.querySelector('.result');
await expect.element(page.elementLocator(result)).toHaveTextContent('1');
```

Available retriable matchers: `toHaveTextContent()`, `toBeVisible()`, `toBeDisabled()`, `toBeEnabled()`, `toBeInTheDocument()`.

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
flush();                    // Sync-flush reactions in unit tests
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
| **Grounded Testing** | `grounded-testing` | Deriving test expectations from user-facing intent before reading source — load alongside this skill when designing tests |
| **Red-Team Testing** | `red-team-testing` | Subagent methodology for post-PR gap analysis |
| **Test Infrastructure** | `testing-internals` | Modifying test runner config, adding test utilities, or changing the CI test pipeline |
| **Repo Guide** | `repo-guide` | Navigating the monorepo structure |
| **Component Authoring** | `component-authoring` | Understanding component architecture before testing |
| **Internals** | `internals` | Deep understanding of framework internals |
