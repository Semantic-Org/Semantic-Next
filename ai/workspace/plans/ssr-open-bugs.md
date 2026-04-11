# SSR Open Bugs

## Bug 1: CodePlayground shows raw hydration markers on learn pages

**URL:** `https://dev.semantic-ui.com/learn/111-introduction`

**Symptom:** The code editor panel displays `<!--sui-block:v1:2-->` as the code content instead of the actual source code.

**Context:** `LearnExample` is `client:only` — no SSR involved. The `files` prop contains raw template source strings (e.g., `component.html` with `{#each wave in waves}`). These strings are passed as settings to the CodePlayground component, which renders them client-side.

**Root cause hypothesis:** The CodePlayground's template receives file content strings that contain SUI template syntax (`{#each}`, `{#if}`, etc.). The native renderer's template compiler processes these as live directives rather than displaying them as literal text, converting them into `<!--sui-block:v1:N-->` comment markers. This is a client-side rendering issue, not an SSR issue.

**Key question:** How did this work before? The content must have been escaped or handled differently in the Lit rendering path.

## Bug 2: Standalone Icon hydration — blank render with multi-word icon names

**URL:** `https://dev.semantic-ui.com/test-ssr/hydrated` (currently has `<Icon icon="left chevron" client:load>`)

**Symptom:** A standalone `<ui-icon icon="left chevron">` SSRs correctly (DSD with proper markup) but renders as a blank page after hydration. No console errors.

**Root cause:** The icon name translation (e.g., "left chevron" → spec-resolved name) goes through `adjustPropertyFromAttribute` in `packages/component/src/helpers/adjust-property-from-attribute.js`. This function's contract is broken with the native `WebComponentBase`. The function hasn't changed, but the native base class handles attribute callbacks differently than LitElement did — specifically, `attributeChangedCallback` during hydration skips `adjustPropertyFromAttribute` (the `_hydrating` guard at line 209 of `base.js`). The property value never gets resolved through the spec system, so the icon can't find its CSS custom property mapping.

**Visible artifact:** The sidebar toggle icons in `src/components/sidebar-toggle/` don't show in the docs — same root cause. Any component that SSRs an icon with a multi-word name and then hydrates will hit this.

**Key file:** `packages/component/src/helpers/adjust-property-from-attribute.js`

## Bug 3: Native renderer lifecycle events not firing for component tests

**Symptom:** 19 pre-existing test failures in `packages/component/test/browser/component.test.js`. All in the "Component Navigation Helpers" and "interval/timeout cleanup" test groups. Tests hang waiting for `onNext('rendered')`.

**Root cause:** The native `WebComponentBase.fullRender()` delegates lifecycle event dispatch to `Template.render()` → `setTimeout(onRendered, 0)`. The `rendered` event is dispatched via `Template.dispatchEvent` which fires on `this.element`. The event uses `composed: false` — it doesn't cross shadow DOM boundaries. For nested component tests, the parent's `rendered` fires but the inner child component's lifecycle may not complete before assertions run. The broader issue is that the native engine's lifecycle event contract isn't fully aligned with what the Lit engine provided (`updateComplete` promise, synchronous render in `willUpdate`).

**Scope:** This is a native renderer lifecycle issue, not SSR-specific. The tests are legitimate — they test real component behavior (findChild, findParent, findTemplate traversal across shadow DOM). The behavior works at runtime (the docs site navigation helpers work), but the test coordination mechanism needs updating for the native engine's async timing.
