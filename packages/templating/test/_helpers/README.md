# Template Test Helpers

Shared scaffolding for Template tests. Used during the Template coverage campaign (Stage 2 of `coverage-campaign` workflow). The leading underscore on the directory name signals "not a test file" — Vitest's include patterns target `**/test/{unit,dom,browser}/**/*.test.{ts,js}` and `**/test/*.test.{ts,js}`, neither of which match this directory.

## Contents

| File | Purpose |
|---|---|
| `stub-engine.js` | No-op rendering engine for tests that need `Template.initialize()` to succeed but don't care about renderer output. Bypasses engine registry via inline object. |
| `fresh-template.js` | `freshTemplate()` factory — `new Template({})` with sane defaults + cleanup. `subtemplateFixture()` for parent-child wired pairs. |
| `browser-fixture.js` | `mountTemplateInShadow()` — mounts a Template in a real shadow root attached to `document.body`. For events/DOM-scoping/lifecycle tests. Sidesteps WebComponentBase (which lives in the component package — circular dep). |
| `registry-cleanup.js` | `clearTemplateRegistry()` for `afterEach`. `assertRegistryEmpty()` for leak detection. |
| `dispatch.js` | Synthetic event/key dispatch helpers — `clickOn`, `fireEvent`, `fireCustomEvent`, `pressKey`, `pressKeys`, `pressKeyCombo`. |

## When to use the stub engine

The stub engine satisfies Template's engine contract (`setData`, `render`, `bumpDataVersion`, `buildHTMLString`, `notifyUpdate`) without actually rendering. Use it when you're testing:

- Data context construction (Surface 6) — what gets passed to the renderer
- Callback params (Surface 3) — what gets passed to user callbacks
- Subtemplate settings Proxy (Surface 7) — proxy semantics, not rendered output
- Lifecycle hook firing (Surface 2 unit-test portion) — order and gating, not DOM updates

Don't use the stub when you're testing:

- Real DOM event delegation (Surface 1) — needs real shadow DOM + native renderer
- Shadow-aware queries `$`/`$$` (Surface 5) — needs real shadow DOM
- Tree traversal via DOM cascade (Surface 8) — needs real `el.shadowRoot` + nested elements

For those, `mountTemplateInShadow` with the default stub engine works for SOME cases; for full DOM rendering, place tests in `packages/component/test/browser/` and use `defineComponent` directly so the native engine is registered.

## Cross-package boundary

This package can't import from `@semantic-ui/component` (circular dep). Tests requiring full WebComponentBase integration belong in `packages/component/test/browser/`. The lifecycle test set in that file's lines 461–608 (currently commented out) is the right place to revive Surface 2's full lifecycle integration tests.

## Cleanup discipline

Every Template that runs `onCreated` registers itself in `Template.renderedTemplates`. Tests that don't run `onDestroyed` leak entries. Either:

- Use the cleanup function returned from `freshTemplate` / `mountTemplateInShadow`, OR
- Add `afterEach(() => clearTemplateRegistry())` to your describe block

`assertRegistryEmpty()` at the end of a test is a useful diagnostic when chasing leaks.
