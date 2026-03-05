---
title: Test Infrastructure Internals
description: How the test infrastructure works in this monorepo — config architecture, CI pipeline, and procedures for modifying the test system.
keywords: [testing, vitest, CI, infrastructure, config, browser tests, coverage, projects]
audience: contributing
skill: testing-internals
type: doc
---

# Test Infrastructure Internals

> **Skill:** `sui:testing-internals`
> **Purpose:** Reference for modifying the test runner config, adding test utilities, or changing the CI test pipeline

---

## Two-Tier Config Architecture

The test system has two independent config layers. Changes to one do not affect the other.

| Layer | Location | Use | Command |
|-------|----------|-----|---------|
| **Global** | `tests/configs/vitest/` | All packages at once | `npm test` from root |
| **Package** | `packages/*/vitest.config.js` | Single package | `npm test` from package dir |

When changing test infrastructure (pool, reporters, timeouts), **both layers may need updates** — 7 global configs + 8 package configs.

---

## Global Config Structure

```
tests/configs/vitest/
├── projects/                    # Composable environment definitions
│   ├── node.js                  # test/unit/ + test/*.test — pure Node
│   ├── jsdom.js                 # test/dom/ — simulated DOM (no Shadow DOM)
│   └── browser.js               # test/browser/ — real Chromium via Playwright
├── vitest.config.js             # npm test (watch: false)
├── vitest-watch.config.js       # npm run test:watch
├── vitest-all.config.js         # npm run test:all (HTML reporter + coverage UI)
├── ci-test-all.config.js        # npm run ci:test
├── ci-test-unit.config.js       # npm run ci:test:unit (node + jsdom only)
├── ci-test-browser.config.js    # npm run ci:test:browser
└── ci-coverage.config.js        # npm run ci:coverage
```

### Project Composition

Each config imports and composes the project modules it needs:

```javascript
import node from './projects/node.js';
import jsdom from './projects/jsdom.js';
import browser from './projects/browser.js';

// Full suite
projects: [node, jsdom, browser]

// Unit only (CI splits for parallelism)
projects: [node, jsdom]

// Browser only
projects: [browser]
```

### Test Directory Convention

Tests are routed to environments by directory name:

| Directory | Environment | Use for |
|-----------|-------------|---------|
| `test/unit/` or `test/*.test.js` | `node` | Pure logic, no DOM |
| `test/dom/` | `jsdom` | DOM manipulation without Shadow DOM or Custom Elements |
| `test/browser/` | `browser` (Chromium) | Shadow DOM, Custom Elements, Web Components |

### Package Configs Use Inline Projects

Package-level configs define projects inline rather than importing shared modules. This makes each package self-contained and testable in isolation, but means infrastructure changes must be applied to both layers.

See `packages/utils/vitest.config.js` for a representative example.

---

## Config Conventions

All configs in this repo follow these patterns:

**Pool:** `threads` everywhere (not the default `forks`). About 20% faster for unit tests. Switch back to `forks` only if you hit segfaults or "Failed to terminate worker" with native modules.

**Lit warning suppression:** Every config includes:
```javascript
onConsoleLog(log) {
  if (log.includes('Lit is in dev mode.')) return false;
}
```
This must be in configs (not setup files) because it operates at the Vitest level, not inside test environments.

**Setup files:** `tests/setup/{node,dom,browser}-setup.js` exist as empty stubs referenced by project files. Add setup logic there when needed.

**Coverage provider:** Istanbul (not v8). Coverage includes only `packages/**/src/**/*.js`.

---

## CI Pipeline

Defined in `.github/workflows/ci.yml`. Three jobs run in parallel:

```
CI Pipeline
├── unit-test        # npm run ci:test:unit — node + jsdom
├── browser          # npm run ci:test:browser — Chromium (caches Playwright)
└── coverage         # npm run ci:coverage — only on main branch
```

### CI-Specific Details

- All CI configs include `github-actions` reporter (inline annotations on PR diffs)
- Unit and browser jobs use `dorny/test-reporter@v1` to render junit XML
- Coverage uses `davelosert/vitest-coverage-report-action@v2` for PR comments
- Coverage job only runs on `main` (`if: github.ref == 'refs/heads/main'`)
- A `changes` job (PR only) uses `dorny/paths-filter@v3` to detect `src/` vs `packages/` changes
- Both unit and browser jobs upload JSON artifacts for the badge Lambda

### CI Output Files

| Config | Output path |
|--------|-------------|
| ci-test-unit | `tests/results/test-results-unit-junit.xml` + `.json` |
| ci-test-browser | `tests/results/test-results-browser-junit.xml` + `.json` |
| ci-test-all | `tests/results/test-results-all-junit.xml` |
| ci-coverage | `tests/coverage/` |

### Coverage Thresholds

In `ci-coverage.config.js`:
```javascript
thresholds: {
  lines: 30,
  functions: 30,
  branches: 30,
  statements: 30
}
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

2. Import and add to relevant global configs
3. Add inline project definition to each package config that needs it
4. Create setup stub `tests/setup/newenv-setup.js`

### Badge Lambda

`tests/scripts/create-unit-test-badge.js` is a Lambda handler (not run in CI). CI uploads JSON artifacts; the Lambda fetches them from the GitHub API and returns badge JSON for shields.io.

### Test Case Sandbox

`tests/test-case/` is a standalone esbuild-based environment for manual debugging and bug reproduction. Run with `npm run test:case`.

---

## Debugging Infrastructure Issues

**`browser.provider` error** — Use `provider: playwright()` (factory call), not `provider: 'playwright'` (string). Requires `import { playwright } from '@vitest/browser-playwright'`.

**`Failed to load custom Reporter`** — Use `reporters:` (plural), not `reporter:`.

**`Executable doesn't exist` (Playwright)** — Run `npx playwright install chromium`. CI caches this at `~/.cache/ms-playwright`.

**`defineWorkspace is not exported`** — Removed in Vitest 4. Export plain objects and import into configs.

---

## Quick Reference

| What | Where |
|------|-------|
| Global configs | `tests/configs/vitest/` |
| Project definitions | `tests/configs/vitest/projects/{node,jsdom,browser}.js` |
| Package configs | `packages/*/vitest.config.js` (8 files) |
| Setup stubs | `tests/setup/{node,dom,browser}-setup.js` |
| CI workflow | `.github/workflows/ci.yml` |
| CI results | `tests/results/` |
| Coverage output | `tests/coverage/` |
| Badge Lambda | `tests/scripts/create-unit-test-badge.js` |
| Test sandbox | `tests/test-case/` |

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Build System** | `sui:build-system` | Understanding wireit, package builds, npm scripts |
| **Repo Guide** | `sui:repo-guide` | Navigating the monorepo structure |
