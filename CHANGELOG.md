---
layout: '@layouts/Guide.astro'
icon: radio
title: "What's New?"
description: Latest updates and changes in Semantic UI
---

> **Important Note** - This is a pre-release version and APIs will change quickly. Before `1.0` release all breaking changes will be `minor` releases and features `patch` releases. `Minor` releases will occur approximately every 2 weeks. Please note after `1.0` Semver will be followed using normal protocols.

## 0.18.0

xx.xx.xxxx

### Component
* **Feature** - All callbacks now receive a `rerender()` function to fully rerender the DOM of the component.

### Testing
* **Feature** - Added `test:coverage` script to all packages for running tests with coverage reports. Coverage configuration is now centralized in each package's vitest.config.js file.

### Specs
* **Feature** - Shared `types`, `states` and `variations` across UI are now exports from specs
* **Feature** - Added node export path with tools for writing `componentSpec` to disk

### Query
* **Feature** - Added [`addAttr()`](https://next.semantic-ui.com/api/query/attributes#addattr) method for adding one or more attributes with empty string values. Useful shorthand for boolean attributes common in web components.

### Utils
* **Feature** - Added [`indentHTML()`](https://next.semantic-ui.com/docs/api/utils/html#indenthtml) for intelligently indenting HTML markup with proper nesting awareness. Handles void elements, self-closing tags, and comments correctly. Perfect for cleaning up HTML extracted from template literals.
* **Feature** - Added [`indentLines()`](https://next.semantic-ui.com/docs/api/utils/html#indentlines) for adding consistent indentation to every line of text. Useful for formatting code snippets and template processing.
* **Feature** - Added `reverseString()` for reversing strings with Unicode grapheme cluster handling using Intl.Segmenter. Preserves emojis, flag sequences, skin tone modifiers, and combined diacritics.
* **Bug** - Fixed `weightedObjectSearch()` regex pattern escaping where multi-word queries with `matchAllWords: false` returned no results. Template string was using `\W` (literal 'W') instead of `\\W` (non-word character class), breaking word boundary matching.
* **Enhancement** - `remove()` now removes all matching instances from an array instead of just the first. Uses an optimized two-pointer approach for O(n) performance. Returns the count of removed elements for backward compatibility.

### CSS Tokens
* **Feature** - Added full color grade structure (0-100) for semantic state colors: `--positive-*`, `--negative-*`, `--info-*`, and `--warning-*`. These now follow the same pattern as other colors (e.g., `--positive-0` through `--positive-100`).
* **Enhancement** - Renamed `messages.css` to `state-colors.css` to better reflect its purpose of providing semantic state color tokens.

### Build
* **Enhancement** - Added file watching for JSON spec files in `build:ui-deps`. The build now automatically regenerates component JS files when spec JSON files are modified, using esbuild's native watch mechanism.
* **Bug** - Fixed `isRebuild` flag in esbuild-callback plugin being inverted (was returning `true` for first build, `false` for rebuilds).

### UI
* **Image** - Add new component for images
* **Segment** - Add new component for creating groupings of related content
* **Button** - Fixed issues with `positive`, `negative` and `icon-after` not working as expected
* **Button** - Added `solid`, `outline` and `ghost` variations
* **Menu** - `menu-item` now uses `value` attr. Menu will now automatically select items when values are present.

## 0.17.0

Released 09.19.2025

### Author's Notes

One of the largest steps to writing all the missing UI components necessary to ship SUI is solidifying key libraries like `transition` and `attach` which are used to handle the internal guts of the library. This release ships `attach` which uses `css anchors` to handle element positioning and is a big step towards that goal.

This took a bit longer than expected as the original draft of `attach` used css anchors for positioning exclusively with `position-area`. This is faster than doing it in javascript but has the monumental downside that fallback positions are not reported in any meaningful way that can be observed with javascript. This means if a fallback position is used by the browser the only way to determine which one is used is by observing the element itself and calculating the position. This made things like automatic `arrow` nearly impossible. The plugin was then rewritten using a hybrid approach `anchor` for the actual `top/left/bottom/right` values, but javascript for positioning. This gives us the best of both worlds and more control of how fallback positions are used.

### Major Features
* **Attach** - Added new `attach` behavior that allows you to position elements relative to other elements using `css anchor` positioning.

### Breaking Changes
* **Utils** - `deepExtend` now preserves non clonables by default. This is to prevent very common scenarios where extend is used with custom classes or dom elements where the original reference should be maintained. Note this still can be overwritten using `deepExtend(obj1, obj2, { preserveNonCloneable: false });`
* **Query** - Renamed `containingParent` to `positioningParent` and added support for values that can cause `position: fixed` to be relative to different coordinate systems. `containingParent` is still available but will always return the `offsetParent` of an element. This is faster but MAY NOT always be the proper parent for positioning.

### CSS Tokens
* **Feature** - Added colored borders like `--red-border`, `--blue-border` etc.

### Query
* **Feature** - Added [`position()`](https://next.semantic-ui.com/api/query/dimensions#position) method that replaces `containerPosition()` with enhanced API supporting multiple coordinate systems (global, local, relative) and proper empty selection handling.
* **Feature** - Added [`pagePosition()`](https://next.semantic-ui.com/api/query/dimensions#pageposition) method for getting/setting element position relative to the document.
* **Feature** - Added [`dimensions()`](https://next.semantic-ui.com/api/query/dimensions#dimensions) method returning comprehensive dimension information including content, padding, border, margin, and scroll dimensions.
* **Feature** - Added [`intersects()`](https://next.semantic-ui.com/api/query/dimensions#intersects) method for checking element intersection with configurable threshold, side detection, and detailed intersection data.
* **Feature** - Added [`isInView()`](https://next.semantic-ui.com/api/query/visibility#isinview) method for detecting viewport intersection with optional threshold and fully visible options.
* **Feature** - Added [`positioningParent()`](https://next.semantic-ui.com/api/query/visibility#positioningparent) method that correctly identifies positioning contexts for both absolute and fixed elements, including modern CSS properties like transform, filter, perspective, contain, and will-change.
* **Feature** - Added [`show()`](https://next.semantic-ui.com/api/query/visibility#show) method for showing hidden elements with optional `calculate` parameter to determine natural display values.
* **Feature** - Added [`hide()`](https://next.semantic-ui.com/api/query/visibility#hide) method for hiding elements by setting display to 'none'.
* **Feature** - Added [`toggle()`](https://next.semantic-ui.com/api/query/visibility#toggle) method for toggling element visibility with optional `calculate` parameter.
* **Feature** - Added [`removeData()`](https://next.semantic-ui.com/api/query/attributes#removedata) method for removing data attributes from elements. Supports space-separated strings or arrays for removing multiple attributes at once.
* **Enhancement** - [`naturalDisplay()`](https://next.semantic-ui.com/api/query/dimensions#naturaldisplay) now accepts `calculate` parameter to control whether to analyze stylesheets (default: true) or use tag-based lookup only.
* **Enhancement** - [`isVisible()`](https://next.semantic-ui.com/api/query/logical-operators#isvisible) now checks for `visibility: hidden` and `content-visibility: hidden` by default, with new `includeVisibility` parameter for control.
* **Enhancement** - [`containingParent()`](https://next.semantic-ui.com/api/query/visibility#containingparent) now provides simple `offsetParent` wrapper functionality alongside the new `positioningParent()` method.
* **Enhancement** - [`closest()`](https://next.semantic-ui.com/api/query/dom-traversal#closest) now supports passing DOM elements directly as the selector parameter, checking containment using the element's `contains()` method.
* **Bug** - Fixed CSS nesting parsing in [`naturalDisplay()`](https://next.semantic-ui.com/api/query/dimensions#naturaldisplay) to properly resolve nested selectors with `&` parent references (e.g., `& .grid-container`).
* **Bug** - Fixed [`position()`](https://next.semantic-ui.com/api/query/dimensions#position) method to return `undefined` for empty selections instead of empty array when used as getter.
* **Bug** - Fixed issue where using non clonables as settings like query collections, or custom classes wouldn't work as expected. This was related to the default behavior of deepExtend and clone (see breaking changes).
* **Bug** - Fixed bug in `is` where it would return true for non-existent selectors

### Utils
* **Feature** - Clone now has a new setting `preserveDOM` which will not clone DOM nodes if present. This can be useful in scenarios where you want to clone an object with references to the live DOM you want to maintain
* **Feature** - Added `log()` function for flexible logging with formatting, namespacing, timestamps, and JSON output support
* **Feature** - Renamed `errors.js` module to `debug.js` to better reflect its logging and debugging capabilities

## 0.16.1-2

Released 08.21.2025

### Core

### Bugs
* **Build** - Reverted `@semantic-ui/core` to use dist version for ESM. This is because Rollup will not parse `?raw` CSS links (Rollup is used on jsDelivr to power the playground).

## 0.16.0

Released 08.20.2025

### UI Changes

`semantic-ui/core` is now organized into three groups: [`primitives`](https://github.com/Semantic-Org/Semantic-Next/tree/main/src/primitives), [`components`](https://github.com/Semantic-Org/Semantic-Next/tree/main/src/components), and [`behaviors`](https://github.com/Semantic-Org/Semantic-Next/tree/main/src/behaviors)
* **Primitives** include JSON specs and are essential building blocks like `modal` and `button`.
* **Components** are built with primitives and have more complex functionality, for example, `global-search` or `theme-switcher`.
* **Behaviors** do not export web components but provide behaviors like `transition` or `position`.

### Major Features
* **UI** - Added many new components: `global-search`, `inpage-menu`, `mobile-menu-toggle`, `mobile-menu`, `panels`, `theme-switcher`.
* **Behaviors** - Added new `transition` behavior that uses the Web Animations API to animate elements. See [example](https://next.semantic-ui.com/examples/query-transition-behavior).
* **Query** - Added generalized plugin architecture for Query along with examples in docs. See [Query plugins guide](https://next.semantic-ui.com/query/plugins).
* **Templates** - Added [rerender and guard blocks](https://next.semantic-ui.com/templates/reactivity#rerender-blocks) for controlling template reactivity: [`{#rerender expression}`](https://next.semantic-ui.com/templates/reactivity#rerender-blocks) forces complete re-evaluation, [`{#guard expression}`](https://next.semantic-ui.com/templates/reactivity#guard-blocks) only updates when computed values change.

### Specs
* **UI** - Refactored exports to use JSON imports. Added new internal build step of JSON → JS exports. ESM will now directly use `src` without translation!
* **UI** - Added JS object exports for UI specs.

### Query
* **Feature** - Added [`onNext()`](https://next.semantic-ui.com/api/query/events#onnext) method for promise-based event waiting, enabling modern async/await patterns with automatic cleanup and optional timeout support. See [example](https://next.semantic-ui.com/examples/query-onnext).
* **Feature** - Added [`add()`](https://next.semantic-ui.com/api/query/utilities#add) method for combining multiple element collections with automatic deduplication. See [example](https://next.semantic-ui.com/examples/query-add).
* **Feature** - Added [`appendTo()`](https://next.semantic-ui.com/api/query/dom-manipulation#appendto) method for appending elements as last child of target.
* **Feature** - Added [`prependTo()`](https://next.semantic-ui.com/api/query/dom-manipulation#prependto) method for prepending elements as first child of target.
* **Feature** - Added [`isVisible()`](https://next.semantic-ui.com/api/query/logical-operators#isvisible) method for checking if ALL elements have layout dimensions using modern `getBoundingClientRect()` API, with optional opacity checking.
* **Feature** - Added [`naturalDisplay()`](https://next.semantic-ui.com/api/query/dimensions#naturaldisplay) for getting the natural display value of elements (ignoring display: none rules).
* **Feature** - You can now use `documentFragment` with content manipulation like [`append()`](https://next.semantic-ui.com/api/query/dom-manipulation#append) and [`prepend()`](https://next.semantic-ui.com/api/query/dom-manipulation#prepend).
* **Improvement** - [`clippingParent()`](https://next.semantic-ui.com/api/query/dimensions#clippingparent) now correctly detects all CSS properties that create clipping contexts including `contain` (paint/layout/size/strict), `clip-path`, and `mask`/`mask-image` in addition to `overflow`.
* **Improvement** - [`trigger()`](https://next.semantic-ui.com/api/query/events#trigger) now triggers native event handlers. Use [`dispatchEvent`](https://next.semantic-ui.com/api/query/events#dispatchevent) to avoid this behavior.
* **Improvement** - [`.submit()`](https://next.semantic-ui.com/api/query/events#submit) now uses `requestSubmit` so that it can trigger native event handlers and be cancelable.
* **Bug** - [`dataContext()`](https://next.semantic-ui.com/api/query/components#datacontext) now returns the entire data context including state.
* **Bug** - Fixed `initialize` not properly chaining.
* **Bug** - Fixed [`addClass`](https://next.semantic-ui.com/api/query/css#addclass), [`toggleClass`](https://next.semantic-ui.com/api/query/css#toggleclass), and [`removeClass`](https://next.semantic-ui.com/api/query/css#removeclass) to not error on `undefined`.

### Templates
* **Bug** - Fixed issue where auto-self-closing custom elements in templates only worked with one `-` (i.e., `<foo-bar/>` but not `<foo-baz-bar/>`).

### Reaction
* **Perf** - Removed unnecessary `clone` in `guard`.

### Utils
* **Feature** - Added [`deepExtend()`](https://next.semantic-ui.com/api/utils/objects#deepextend) for deep merging objects with nested property combining, array/date cloning, and optional custom class preservation.
* **Feature** - Added [`adoptStylesheet()`](https://next.semantic-ui.com/api/utils/css#adoptstylesheet) for adopting CSS stylesheets to documents or shadow roots with intelligent caching.
* **Feature** - Added [`extractCSS()`](https://next.semantic-ui.com/api/utils/css#extractcss) for extracting CSS rules matching selectors from various stylesheet sources with optional text output.
* **Feature** - Added [`scopeStyles()`](https://next.semantic-ui.com/api/utils/css#scopestyles) for scoping CSS rules with configurable :host replacement and root element handling.
* **Feature** - Added Set and Map support to [`each()`](https://next.semantic-ui.com/api/utils/looping#each), [`asyncEach()`](https://next.semantic-ui.com/api/utils/looping#asynceach), and [`asyncMap()`](https://next.semantic-ui.com/api/utils/looping#asyncmap) functions for iterating over ES6 collections.
* **Feature** - Added [`isSet()`](https://next.semantic-ui.com/api/utils/types#isset) and [`isMap()`](https://next.semantic-ui.com/api/utils/types#ismap) type checking helpers for ES6 collection validation.
* **Feature** - Added [`isDevelopment`](https://next.semantic-ui.com/api/utils/environment#isdevelopment) constant for comprehensive development environment detection across Node.js, Vite, Vercel, Netlify, cloud dev environments (Codespaces, GitPod), Nuxt, and React Native.
* **Feature** - Added [`isCI`](https://next.semantic-ui.com/api/utils/environment#isci) constant for detecting CI/CD environments including GitHub Actions, GitLab CI, Jenkins, CircleCI, Travis, and many other platforms.
* **Enhancement** - Enhanced [`clone()`](https://next.semantic-ui.com/api/utils/cloning#clone) function with `preserveNonCloneable` option to preserve custom class instances instead of flattening them.
* **Enhancement** - Modified [`isEmpty`](https://next.semantic-ui.com/api/utils/types#isempty) to handle Set, Map, and other iterables. Assumes all nullish keys mean empty.
* **Chore** - Restructured tests for utils package to be organized by category. Renamed iterators to loops.
* **Breaking** - Renamed `ssr.js` module to `environment.js` to better reflect its expanded scope beyond just server-side rendering detection.

## 0.15.0

Released 07.24.2025

### Major Features
* **Feature** - Added support for binding events from inside templates using `@` handlers like `<div @click={doSomething}></div>`. See [component event guide](https://next.semantic-ui.com/components/events#inside-templates).
* **Feature** - Added support for binding element properties from inside templates like `<input type="checkbox" .checked={checked}>`. See [template expressions guide](https://next.semantic-ui.com/templates/expressions).
* **Feature** - Added [`registerHelper()`](https://next.semantic-ui.com/api/templating/template#registerhelper) and [`registerHelpers()`](https://next.semantic-ui.com/api/templating/template#registerhelpers) functions for registering custom template helpers.

### Templates
* **Feature** - Added template helpers: [`default`](https://next.semantic-ui.com/api/helpers/comparison#default), [`truncate`](https://next.semantic-ui.com/api/helpers/strings#truncate), [`first`](https://next.semantic-ui.com/api/helpers/arrays#first), [`last`](https://next.semantic-ui.com/api/helpers/arrays#last), [`roundNumber`](https://next.semantic-ui.com/api/helpers/numeric#roundnumber), [`roundDecimal`](https://next.semantic-ui.com/api/helpers/numeric#rounddecimal) with `round` alias, [`lowercase`](https://next.semantic-ui.com/api/helpers/strings#lowercase), [`uppercase`](https://next.semantic-ui.com/api/helpers/strings#uppercase).

### Utils
* **Feature** - Added [`truncate`](https://next.semantic-ui.com/api/utils/strings#truncate) utility function to utils package for word-boundary aware text truncation. See [example](https://next.semantic-ui.com/examples/utils-truncate).

### Reactivity
* **Bug** - Fixed bug in `Reaction.getSource()` when breakpointed in a template helper.
* **Change** - `Reaction.getSource()` no longer returns the stack; this makes it clearer when invoking it from Chrome console as the return will produce its own log.

### Components
* **Bug** - Fixed `ui-input` `debounce` setting not using the new object signature from `0.14.0`, causing it to fail.
* **Bug** - Fixed debounce/throttle parameter overload handling where `wait` parameter as object wasn't properly handled.

### Infrastructure
* **Chore** - Updated Vitest to v3.2.4 across all packages for consistency.
* **Chore** - Migrated from deprecated `workspace` configuration to modern `test.projects` in Vitest configs.

## 0.14.2

Released 07.23.2025
* **Feature** - Snippets can now be used before they are defined in templates.
* **Bug** - Fixed bug where snippet data could be overwritten incorrectly when parent data changed.
* **Feature** - Conditionals can now be used inline in HTML attributes like `<div class="{#if condition}value{/if}"></div>`.
* **Bug** - Fixed reactive data expressions in properties and events being incorrectly stringified.

## 0.14.1

Released 07.22.2025

* **Chore** - Updated all npm dependencies for project and docs.
* **Bug** - Fixed bug with `{#html}` blocks not rendering properly with SSR.

## 0.14.0

Released 07.22.2025

### Components
* **Enhancement** - Component navigation helpers ([`findChild`](https://next.semantic-ui.com/api/component/utilities#findchild), [`findChildren`](https://next.semantic-ui.com/api/component/utilities#findchildren), [`findParent`](https://next.semantic-ui.com/api/component/utilities#findparent), [`findTemplate`](https://next.semantic-ui.com/api/component/utilities#findtemplate)) now have comprehensive support for both web components and subtemplates using dual pattern traversal.
* **Enhancement** - [`findChild`](https://next.semantic-ui.com/api/component/utilities#findchild) and [`findChildren`](https://next.semantic-ui.com/api/component/utilities#findchildren) now properly find nested web components across [shadow DOM](https://next.semantic-ui.com/query/shadow-dom) boundaries using deep shadow DOM traversal.
* **Bug** - Fixed [`findTemplate`](https://next.semantic-ui.com/api/component/utilities#findtemplate) to return consistent merged component data format (containing both instance and data properties) matching other navigation helpers instead of raw Template object.

### Templates
* **Bug** - Fixed error causing async blocks to stop working.

#### Testing
* **Improvement** - Disabled screenshot capture on test failures across all packages to prevent unwanted screenshot directories.

#### Utils
* **Breaking Change** - [`debounce`](https://next.semantic-ui.com/api/utils/functions#debounce) function signature changed from `debounce(fn, options)` to `debounce(func, wait, options)`.
* **Feature** - Enhanced [`debounce`](https://next.semantic-ui.com/api/utils/functions#debounce) function with full async support, promise sharing, AbortController integration, and new options (`leading`, `trailing`, `maxWait`, `rejectSkipped`). See [example](https://next.semantic-ui.com/examples/utils-debounce).
* **Feature** - Added new [`throttle`](https://next.semantic-ui.com/api/utils/functions#throttle) function with async support, promise sharing, AbortController integration, and configurable leading/trailing execution. See [example](https://next.semantic-ui.com/examples/utils-throttle).
* **Feature** - Added [`getIPAddress()`](https://next.semantic-ui.com/api/utils/browser#getipaddress) to retrieve local, public, or all IP addresses using WebRTC ICE gathering. See [example](https://next.semantic-ui.com/examples/utils-getipaddress).
* **Bug** - Fixed [`fatal`](https://next.semantic-ui.com/api/utils/errors#fatal) to look for `onError` on `globalThis`.

#### Documentation
* **Examples** - Added missing examples for browser utilities: `copyText`, `openLink`, `getKeyFromEvent`, `idleCallback`, `getText`, and `getJSON`.

## 0.13.3

Released 07.17.2025
* **Improvement/Bug** - Fixed issue where some build tools could not parse raw text imports of dependencies. There is now a build step where ESM endpoints now inline text imports.


For instance, in `@semantic-ui/core`, templates are included like:
```javascript
import template from './button.html?raw' assert { type: 'txt' };
```
These imports may not be processed downstream properly in Vite when using ES modules unless `optimize.excludeDeps` included `@semantic-ui/core`.

* **Change** - Removed `with { type: 'css' }` and `with { type: 'html' }`. Currently only `json` is supported officially, and Vite is not happy with unknown types: https://github.com/vitejs/vite/discussions/18534
* **Bug** - Fixed issue with empty file `dist/.js` in npm package build.

We've now linked the ESM build to a build that inlines raw text imports to prevent issues with downstream builds.

## 0.13.2

Released 07.15.2025

* **Bug** - Removed unused dependency `@semantic-ui/esbuild-log`.

## 0.13.1

Released 07.14.2025

* **Bug** - Fixed a bug with SSR in reactive directives like conditional/data. If a reaction was long-lived (for example, an interval is set up in onCreated), the reaction would not properly get garbage collected and could rerun on the server causing an SSR error like: `TypeError: this._$Ct._$AI is not a function at ReactiveDataDirective.setValue`.

## 0.13.0

Released 07.14.2025

### CSS Tokens
* **Colors** - Color variables like `red-0` to `red-100` now automatically swap for dark mode (i.e., `red-0` = `red-100` in dark mode).
* **Colors** - Added new invariant colors that do not change for dark mode (i.e., `red-0-invariant` stays dark red).

#### Reactivity
* **Feature** - Added [`signal.derive()`](https://next.semantic-ui.com/api/reactivity/signal#derive) method for creating derived signals that transform a single signal's value. See [Dependent Signals guide](https://next.semantic-ui.com/reactivity/dependent-signals) and [example](https://next.semantic-ui.com/examples/reactive-derived).
* **Feature** - Added [`Signal.computed()`](https://next.semantic-ui.com/api/reactivity/signal#computed) static method for creating computed signals that combine multiple signals. See [Dependent Signals guide](https://next.semantic-ui.com/reactivity/dependent-signals) and [example](https://next.semantic-ui.com/examples/reactive-computed).
* **Feature** - Signals can now use [`addContext`](https://next.semantic-ui.com/api/reactivity/signal#addcontext) to add metadata when setting a value. This is very useful for determining what caused a reaction. See [example](https://next.semantic-ui.com/examples/context).
* **Feature** - Added new [`mutate`](https://next.semantic-ui.com/api/reactivity/helpers#mutate) helper for mutating a value by a function. See [example](https://next.semantic-ui.com/examples/reactive-mutate).
* **Feature** - Added [`getItem(id)`](https://next.semantic-ui.com/api/reactivity/collection-helpers#getitem) and [`getItemIndex(id)`](https://next.semantic-ui.com/api/reactivity/collection-helpers#getitemindex) as separate [mutation helpers](https://next.semantic-ui.com/reactivity/mutation-helpers).
* **Bug** - Fixed issue where [mutation helpers](https://next.semantic-ui.com/reactivity/mutation-helpers) were incompatible with `allowClone: false`. They can now be used together.

#### Component
* **Bug** - Fixed issue where `delegatesFocus` was not working as expected.
* **Bug** - [Component lifecycle](https://next.semantic-ui.com/components/lifecycle) events like `rendered` now do not `bubble`. This means components are no longer `composed: true`.

#### Query
* **Feature** - Added namespaced events to [`on`](https://next.semantic-ui.com/api/query/events#on) and [`off`](https://next.semantic-ui.com/api/query/events#off).
* **Feature** - Added [`clippingParent`](https://next.semantic-ui.com/api/query/dimensions#clippingparent) to find closest ancestor that will clip the current element. See [example](https://next.semantic-ui.com/examples/query-clippingparent).
* **Feature** - Added [`.data()`](https://next.semantic-ui.com/api/query/attributes#data) for getting and setting HTML data. See [example](https://next.semantic-ui.com/examples/query-data).
* **Feature** - Added [`.slice()`](https://next.semantic-ui.com/api/query/iterators#slice) for returning a portion of the element collection. See [example](https://next.semantic-ui.com/examples/query-slice).
* **Feature** - Added [`closestAll()`](https://next.semantic-ui.com/api/query/dom-traversal#closestall) for finding all ancestor elements matching a selector.
* **Feature** - Added [`before()`](https://next.semantic-ui.com/api/query/dom-manipulation#before) and [`after()`](https://next.semantic-ui.com/api/query/dom-manipulation#after) aliases for more intuitive content insertion.
* **Feature** - Added [`contains()`](https://next.semantic-ui.com/api/query/dom-traversal#contains) method for checking if elements contain a specific selector with [Shadow DOM](https://next.semantic-ui.com/query/shadow-dom) support. See [example](https://next.semantic-ui.com/examples/query-contains).
* **Enhancement** - Enhanced [`closest()`](https://next.semantic-ui.com/api/query/dom-traversal#closest) with `returnAll` option to optionally return all matching ancestors.
* **Improvement** - `offsetParent` has been renamed to [`containingParent`](https://next.semantic-ui.com/api/query/dimensions#containingparent) and now includes many other possible containing parent checks like `will-change` and `filter`.
* **Bug** - [`setting()`](https://next.semantic-ui.com/api/query/components#setting) can now be used as a getter.
* **Bug** - Fixed `offsetParent` to correctly return offset parent for `willChange`.
* **Bug** - Fixed bug where `useAlias()` was not working as intended to alias Query.

#### Docs
* **Examples** - Improved console log styling for examples.
* **Examples** - Added a large amount of Signal & Reactivity examples.

#### Testing
* **Improvement** - Vitest now runs without watch for `npm test`; Vitest configs have been added for each package.

#### Utils
* **Breaking** - `prettifyID` has been renamed to [`prettifyHash`](https://next.semantic-ui.com/api/utils/crypto#prettifyhash) to better reflect its purpose of converting numeric hash values to alphanumeric strings.
* **Feature** - [`prettifyHash`](https://next.semantic-ui.com/api/utils/crypto#prettifyhash) now supports `minLength` and `padChar` options for customizing output format. See [example](https://next.semantic-ui.com/examples/utils-prettifyhash).
* **Feature** - Added [`getRandomSeed()`](https://next.semantic-ui.com/api/utils/crypto#getrandomseed) function that uses `crypto.getRandomValues` when available for cryptographically secure random seeds. See [example](https://next.semantic-ui.com/examples/utils-getrandomseed).
* **Feature** - [`generateID`](https://next.semantic-ui.com/api/utils/crypto#generateid) now accepts an optional seed parameter for reproducible ID generation. See [example](https://next.semantic-ui.com/examples/utils-generateid).
* **Feature** - [`hashCode`](https://next.semantic-ui.com/api/utils/crypto#hashcode) now uses the renamed [`prettifyHash`](https://next.semantic-ui.com/api/utils/crypto#prettifyhash) internally when `prettify: true` option is set. See [example](https://next.semantic-ui.com/examples/utils-hashcode).
* **Feature** - [`sortBy`](https://next.semantic-ui.com/api/utils/arrays#sortby) now supports multi-key sorting by accepting an array of keys. See [example](https://next.semantic-ui.com/examples/utils-sortby).
* **Enhancement** - [`sortBy`](https://next.semantic-ui.com/api/utils/arrays#sortby) now uses `localeCompare` with `numeric: true` for proper string sorting (e.g., "item10" comes after "item2").
* **Enhancement** - [`sortBy`](https://next.semantic-ui.com/api/utils/arrays#sortby) comparator function now receives key index as fifth parameter for multi-key sorting.
* **Enhancement** - [`generateID`](https://next.semantic-ui.com/api/utils/crypto#generateid) now uses `crypto.getRandomValues` via [`getRandomSeed()`](https://next.semantic-ui.com/api/utils/crypto#getrandomseed) for better randomness.
* **Bug** - [`isBinary`](https://next.semantic-ui.com/api/utils/types#isbinary) now detects all types of typed arrays including Int8Array, Float32Array, BigInt64Array, etc.

## 0.12.4-1
* **Tailwind** - `@semantic-ui/tailwind` and `tailwindcss-iso` now have bundled CDN version to avoid issues importing CSS files in browser via ESM. Modified `tailwind` package to accommodate this change.
* **Tailwind** - Removed bundled `wasm` files; these are now part of the generic `tailwindcss-iso` package.

## 0.12.0
* **Template** - `onThemeChanged` now looks for either `themechange` event from `html` or the class `dark` being toggled on `html` using mutation observers.
* **Tailwind** - Added a plugin for using Tailwind inside Semantic UI components. This can be used alongside the CSS tokens provided by the CSS framework, or instead of it. This will scan your component JavaScript, HTML, and CSS and attach only the Tailwind styles used.

> Note: the tailwind plugin code may be modified if `defineComponent` gets a formal 'Plugin API'. For now you will need to pass in the component to the plugin before defining the component.

```javascript
import { TailwindPlugin } from '@semantic-ui/tailwind';

// Transform with Tailwind plugin
const definition = {
  // your component definition
  template: `<div class="p-4 bg-red-500"></div>`
}
defineComponent( await TailwindPlugin(definition) );

```

* **Template Compiler** - Fixed an issue with nested conditionals inside SVG.

## 0.11.3
* **Input** - Fixed placeholder focused color to be theme-aware.

## 0.11.2

* **Query** - Fixed `setting()` and `settings()` not returning DOM element for chaining.
* **Template Helpers** - `guard` and `nonreactive` can now be passed values and not just functions.

## 0.11.0-1

### Major Changes
* New [**AI**](https://github.com/Semantic-Org/Semantic-Next/tree/main/ai) folder with detailed instructions for AI models working with Semantic UI, including guides for each package and instruction sets for writing components.
* Theming has been reworked inside the UI framework. CSS variables are now attached to `:host` inside the shadow dom instead of globally to `:root`. This means you can no longer access globally component css variables.

#### Positive Trade Offs
- You no longer need to include a separate css theme file in your page for each component you use. You can just import the component and all css will be defined. Note: You still need to include the global theme in the page to define global variables.
- `dark` and `light` can now be added to ANY component to trigger that specific component to be rendered as light or dark mode

For instance this example:
```html
<html class="dark">
  <nav-menu light>
    <ui-input dark></ui-input>
  </nav-menu>
</html>
```

Will render the page as `dark` mode, the `nav-menu` as light mode and the `ui-input` as dark mode. This can be used for complex layouts that might use light or dark sections.

#### Trade Offs

- You can no longer reference variables like `button-primary-text-color` in your css. These will only be defined inside the component. This is because the theme is now scoped to the component.
- Component variables need to be scoped to the component and will not inherit

```css
/* works - value is defined in same scope as component
*/
ui-button {
  --primary-text-color: red;
}

/* works - value is computed for each component from primary-color
*/
.parent {
  --primary-color: red;
}

/*
  doesnt work - value will be redefined in the component
*/
.parent {
  --primary-text-color: red;
}
```

#### Additional Changes
Some paths have shifted
* Global theme variables are now included in `semantic-ui.css` instead of a separate `theme/base.css` file.
* Themes/Specs are now included in each component folder
* Component CSS variables are now included in the Shadow DOM scope and NOT global scope. This should vastly improve the global dev tools experience by reducing the number of defined variables in scope.

### New UI
- **Input** - Added `type` property for inputs
- **Buttton** - Added `type` property for buttons

### New
* Query - Added `$('form').submit()` shorthand for `$('form').trigger('submit');`
* Utils - Added color utils for oklch conversion to hex and rgb. These are essential to use oklch in javascript.
* Signals - `increment` and `decrement` now receive a max and min. This can be used to increment a value within a limit. This is particularly useful for keyboard controls that use a `selectedIndex`
* Signals - `debugReactivity` has been greatly improved. You can now pass debug context with signals and reactions and read them during flush.
* Component - Added reactivity debugging metadata for all reactive template features like each, if, expressions. This will now appear when using `{debugReactivity}` in a template.
* Binding to `checked` or `input` will automatically update the element property if the value changes. Note this is a one way binding, updating the element attribute will not update a signal/setting passed into `value`.
* Template Helpers - Added `isNot` helper

### Bug
* Fix [`value`](https://next.semantic-ui.com/api/query/content#value) / [`val`](https://next.semantic-ui.com/api/query/content#value) in Query would not set value of custom elements because of too strict html element type checking.

## 0.10.9

### Features
* **Utils** - `formatDate` now supports timezone abbreviations like `ET` and `PT`.
* **Query** - Added `getSlot()` and `setSlot()` methods for getting/setting slotted content for a web component.

### Improvements
* **Templates** - Expression evaluation has been improved to support additional cases with mixed Lisp and JS-style function callbacks.
* **Templates** - Improved the performance characteristics of reactive conditionals in templates.
For instance, you can now pass JS to Lisp-style arguments:
```javascript
{concat 'my' 'friend' (isDog ? 'simon dog' : 'pookie cat') }
```

### Bugs
* **Utils** - Fixed `pick` to work with proxy objects.

## 0.10.4-0.10.8

### Features
* **Build** - Added `cdn` links to package.json for jsDelivr and unpkg.
* **Build** - Updated `publish` script to handle updating dependencies better.
* **Build** - Added proper `browser` endpoint to resolve unpkg usage.


## 0.10.3

### Features
* **Query** - Added `end()` to return to previous selections when chaining.
* **Query** - `prepend` and `append` now can add multiple content like `$('div').prepend('<p>Hello</p>', '<p>World</p>');`.

### Bugs
* **Query** - Fixed issue when chaining using query collections made of other query collections.

## 0.10.2

### Features
* **Utils** - Added `idleCallback` for wrapping browser's `requestIdleCallback` (not fully supported in Safari).

### Improvements
* **Templates** - Added new keyword `bind` that will let you directly bind events without event delegation. This can be useful for attaching to events that do not bubble.
* **Templates** - Templates now have a `destroyed` flag to determine if they are destroyed.

### UI
* **Label** - Added basic definition of label including secondary, outline, and badge variations.

### Bugs
* **Templates** - Fixed bug where subtemplates did not properly remove themselves when destroyed from `findChildren`.
* **Card** - Fixed fluid variation and min width.
* **Menu** - Fixed fitted variation.
* **Icons** - Fixed issue with link and link icon from feather-icons (link icon now `linkify`).

### Docs
* **AST Display** - AST display is now reactive on template changes. Content changes are no longer lost when you change from mobile/tablet view to computer view.

## 0.10.1

### Improvements

#### Templates
* **Templates** - Data passed through to event handlers now automatically type converts. For instance, `data-index="1"` will be of type number when used in an event handler.

### Bugs

#### Each
* **Each** - Fixed issue with `key` missing from `each..in` with objects.

## 0.10.0

#### Project
* The project repo is now public.

#### Improvements

##### Each
* **Each** - Now supports iterating over objects with `key` instead of `index`.
* **Each** - Now supports else conditions.
* **Each** - Now supports custom index/key names: `{#each value, index in values}`.
* **Each** - Default index name is always `index` in data context instead of `@index`. `@foo` is not a valid variable name in JS, so it was breaking JS expressions.

### Expressions
* **Expressions** - You can now use signals like state in JS expressions without `get()` in templates (i.e., `{ someState == 'someValue' ? 'yes' : 'no' }` instead of `{ someState.get() == 'someValue' ? 'yes' : 'no' }`).
* **Input** - Fixed `change` event to only fire on blur for `ui-input`; fixed `input` event.

### UI Icon
* **Icon** - Added `href` property. Added hitbox to links by default for mobile/touch.

#### Bugs
* **Events** - Fixed bug where global events would ignore an event if it bubbled from a web component Shadow DOM (deep).

#### Docs
* **Each** - Updated docs and added new examples.

## 0.9.4

#### Bugs

* **Templating** - Improved typing for `CallParams`.
* **Components** - Improved JSDoc for callbacks like events, createComponent, and keys.
* **Documentation** - Added @links to JSDoc for reactivity, query, and utils libraries.
* **Documentation** - Added missing docs for some methods in query and reactivity.

## 0.9.3

#### Improvements

* **Events** - `value` in event handlers will now automatically pass through value from custom events.
* **Input** - Added `debounce`, `search`, and `debounceInterval` properties.
* **Input** - Added sizing and improvements to hitbox.
* **Templates** - Added performance improvements to expression lookup by short-circuiting for common lookups.
* **NavMenu** - Added search functionality.

#### Bugs
* **Templates** - Fixed issue when evaluating JS expressions passed through to subtemplates and snippets. Because data to subtemplates is wrapped to preserve reactivity, the JS context of ternaries like `subTemplateData ? 'yes' : 'no'` was expecting `subTemplateData() ? 'yes' : 'no'`.

## 0.9.2

#### Improvements

* `getJSON` can now be imported directly from `@semantic-ui/component`

#### Bugs
* Fix issue where state changes may not trigger reactive updates

## 0.9.1

#### Improvements

* Improvements to typing for `@semantic-ui/component`

## 0.9.0

#### Improvements

#### Docs
* After much experimenting with types (see ver 0.8.8.6-11) figured out stable way to get typescript autocomplete working in playground. This required pulling `type:module` from package.json for now.

#### Improvements
* Added links to docs for some utils in jsdocs (utils, signal, templating) working through more types and jsdocs currently.

## 0.8.9

#### Bugs
* Fix bugs from utils rearrangement

## 0.8.8

#### Improvements
* Improving utils docs with jsdoc links to API docs for corresponding utils

## 0.8.7

#### Bugs
* Fix use of type import in uncompiled javascript

## 0.8.6

#### Improvements
* Add type definitions to templating library

#### Bugs
* Fix typo in utils that may have caused types not to load

## 0.8.5

#### Bugs
* Fix typo in reactivity types

## 0.8.4

#### Improvements

* Adds type definitions to reactivity library
* Refactors and improves type definitions for utils

## 0.8.3

#### Improvements

* Adds type definitions to utils library

## 0.8.2

#### Improvements

Reactivity helpers now handle multiple args to `push`, `unshift`. Added `unshift` for consistency.

## 0.8.0

#### Breaking Changes
* `getComponent` and `getDataContext` in Query have been renamed to just `component` and `dataContext` this is to preserve consistency with other methods on Query which dont preface getters with 'get'

#### Bugs
* Fix `ui-menu` did not export `item` for parts
* Improve performance of signal's mutation helpers

## 0.7.0

#### Breaking Changes
* `defineComponent` arguments `settings` has been renamed to `defaultSettings`
* `defineComponent` argument `state` has been renamed to `defaultState`

Feedback from technical preview is that the use of `settings` in the outer scope and inside callbacks creates confusion because of the variable shadowing. The name `defaultSettings` / state accurately convey that this is the initial value for `settings` and `state` but not what is expected to return inside the callbacks.

If you need to perform a find and replace you can use the following regex

Settings
```
(?s)(defineComponent\s*\(\s*\{\s*[^}]*?)\bsettings\b(?=\s*(?::|[,}]))([^}]*?\})
$1defaultSettings$2
```

State
```
(?s)(defineComponent\s*\(\s*\{\s*[^}]*?)\state\b(?=\s*(?::|[,}]))([^}]*?\})
$defaultState$2
```

## 0.6.1

* **Build** - Fixed npm publication issue.

## 0.6.0

#### Breaking Changes
* **Templates** - Standard template syntax now defaults to reactiveData to avoid confusion when using subtemplates naively. You can still specify non-reactive data using verbose syntax.

#### Improvements
* **Templates** - Added cyclical detection to expression lookup to avoid recursion.

#### Bug Fixes
* **Components** - Fixed bug with class names "classic syntax" for components with specs like button, menu, etc.
* **Templates** - Fixed issue with JS expression passthrough to snippets and subtemplates.

## 0.5.0

#### Breaking Changes
* **Reactivity** - Renamed `ReactiveVar` to `Signal` and updated all libraries to reference new name. The change is purely cosmetic and does not adjust underlying behavior.
* **Reactivity** - `@semantic-ui/reactivity` now exports `Signal` and no longer `ReactiveVar`.

## 0.4.0

#### Improvements
* **Templates** - Now evaluates JavaScript expressions like `{index + 1}`, `{getThing(foo, bar)}`, and even nested objects like `{getValue({ foo: 'baz' })}`.

## 0.3.1

#### Bugs
* **Reactivity** - Fixed `Reaction.guard` not behaving as expected.

## 0.3.0

#### API Changes
* **Components** - All settings now permit attributes with either kebab or lowercased conversion (i.e., `settings = { showLink: false }` can be set either like `<my-component showlink>` or `<my-component show-link>` as an alias).

## 0.2.2
* **Card** - Added new card component with minimal feature set.
* **SSR** - Fixed issue with `<ui-button primary>` being rendered as `<ui-button primary="true">`.
* **Query** - Fixed `off` not allowing an array of events like `$('div').off('touchend mouseleave');`.
* **Query** - Fixed issue with `one` not properly removing events when attached together like `$('body').one('mouseup touchend');`.

## 0.2.1
* **Modal** - Added `glass` variation.
* **Input** - Added `fluid` variation.

## 0.2.0

#### Breaking Changes
* **Components** - Settings now convert from prop values `camelCase` to `<my-component kebab-case>`. Previously they followed the Lit convention of converting to `<my-component kebabcase>`. This seems more conventional since native attributes use dashes.

#### Fixes
* **Components** - Fixed several issues related to attribute updates when spec is used (i.e., button and other UI primitives), particularly with boolean attributes and multiple attribute changes at once.

## 0.1.7
#### Features
* **Query** - Added `ready` and `on('ready')` as aliases for `DOMContentLoaded`.
* **Templates** - You can now specify full templates as settings, not just template names (i.e., `settings = { rowTemplate: new Template() };`).

#### Fixes
* **Components** - Calling `defineComponent` multiple times on client will no longer produce error (useful when multiple components need to require another one to be defined).
* **Renderer** - Now properly garbage collects subtrees using WeakRef.
* **Components** - Now support custom classes as settings.

## 0.1.6
* **Templates** - Fixed some issues related to data staleness in AST subtrees like `{#each}`.

## 0.1.5
* **Utils** - Added `openLink`.
* **Components** - Refactored settings to trigger reactivity in any reactive context.
* **Components** - Fixed `getChild`, `getParent`, and other helpers.
* **Components** - Store data context in DOM.
* **Query** - Fixed DOM manipulation to work in some locations it was not working before (`shadowRoot`, etc.).

## 0.1.4
* **Utils** - Added `weightedObjectSearch` utility.
* **Templates** - Refactored snippet and subtemplate data context to support `data={getData}` type expressions.

## 0.1.1

* **Templates** - Now supports either single or double bracket syntax: `{{getName}}` or `{getName}`.

## 0.1.0

* **Components** - `createComponent` has been renamed to `defineComponent`.
* **Components** - `createInstance` has been renamed to `createComponent`.
* **Components** - `lightCSS` has been renamed to `pageCSS`.

