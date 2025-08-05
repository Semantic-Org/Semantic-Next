### Important Note

This is a pre-release version and APIs will change quickly. Before `1.0` release all breaking changes will be `minor` releases and features `patch` releases.

`Minor` releases will occur approximately every 2 weeks.

Please note after `1.0` Semver will be followed using normal protocols.

# Version 0.16.0

## Major Features
* **Query** - Added generalized plugin architecture for Query.

## Query
* **Feature** - Added `add()` method for combining multiple element collections with automatic deduplication
* **Feature** - Added `appendTo()` method for appending elements as last child of target
* **Feature** - Added `prependTo()` method for prepending elements as first child of target
* **Feature** - You can now use `documentFragment` with content manipulation like `append()` `prepend()`
* **Improvement** - `trigger()` now triggers native event handler. Use `dispatchEvent` to avoid this behavior.
* **Improvement** - `.submit()` now uses `requestSubmit` so that it can trigger native event handlers and be cancelable.
* **Bug** - `dataContext()` now returns the entire data context including state.
* **Bug** - Fixed `initialize` did not properly chain

## Templates
* **Feature** - Added rerender and guard blocks for controlling template reactivity: `{#rerender expression}` forces complete re-evaluation, `{#guard expression}` only updates when computed values change
* **Bug** - Fix issue where auto-self closing custom elements in templates only worked with one `-` i.e. `<foo-bar/>` not `<foo-baz-bar/>`

## Utils
* **Feature** - Added `deepExtend()` for deep merging objects with nested property combining, array/date cloning, and optional custom class preservation
* **Feature** - Added `adoptStylesheet()` for adopting CSS stylesheets to documents or shadow roots with intelligent caching
* **Feature** - Added `extractCSS()` for extracting CSS rules matching selectors from various stylesheet sources with optional text output
* **Feature** - Added `scopeStyles()` for scoping CSS rules with configurable :host replacement and root element handling
* **Enhancement** - Enhanced `clone()` function with `preserveNonCloneable` option to preserve custom class instances instead of flattening them
* **Chore** - Restructured tests for utils package to be organized by category.

# Version 0.15.0 - 07.24.2025

## Major Features
* **Features* - Added support for binding events from inside templates using `@` handlers like `<div @click={doSomething}></div>`
* **Feature** - Added support for binding el properties from inside templates like `<input type="checkbox" .checked={checked}>`
* **Feature** - Added `registerHelper()` and `registerHelpers()` functions for registering custom template helpers

## Templates
* **Feature** - Added template helpers: `default`, `truncate`, `first`, `last`, `roundNumber`, `roundDecimal` with `round` alias, `lowercase`, `uppercase`

## Utils
* **Feature** - Added `truncate` utility function to utils package for word-boundary aware text truncation

## Reactivity
* **Bug** - Fixed bug in `Reaction.getSource()` when breakpointed in a template helper.
* **Change** - `Reaction.getSource()` no longer returns the stack, this makes it more clear when invoking it from chrome console as the return will produce its own log.

## Components
* **Bug** - Fixed `ui-input` `debounce` setting did not use the new obj signature from `0.14.0` causing it to fail.
* **Bug** - Fixed debounce/throttle parameter overload handling where `wait` parameter as object wasn't properly handled

## Infrastructure
* **Chore** - Updated Vitest to v3.2.4 across all packages for consistency
* **Chore** - Migrated from deprecated `workspace` configuration to modern `test.projects` in Vitest configs

# Version 0.14.2 - 07.23.2025
* **Feature** - Snippets can now be used before they are defined in templates.
* **Bug** - Fixed bug where snippet data could be overwritten incorrectly when parent data changed
* **Feature** - Conditionals can now be used inlined in html attributes like `<div class="{#if condition}value{/if}"></div>`
* **Bug** - Fix reactive data expressions in properties and events being incorrectly stringified.

# Version 0.14.1 - 7.22.2025
* **Chore*** - Update all npm deps for project and docs.
* **Bug** - Fix bug with {#html} blocks not rendering properly with ssr.

# Version 0.14.0 - 07.22.2025

## Components
* **Enhancement** - Component navigation helpers (`findChild`, `findChildren`, `findParent`, `findTemplate`) now have comprehensive support for both web components and subtemplates using dual pattern traversal
* **Enhancement** - `findChild` and `findChildren` now properly find nested web components across shadow DOM boundaries using deep shadow DOM traversal
* **Bug** - Fixed `findTemplate` to return consistent merged component data format (containing both instance and data properties) matching other navigation helpers instead of raw Template object

## Templates
* **Bug** - Fix error causing async blocks to stop working

### Testing
* **Improvement** - Disabled screenshot capture on test failures across all packages to prevent unwanted screenshot directories

### Utils
* **Breaking Change** - `debounce` function signature changed from `debounce(fn, options)` to `debounce(func, wait, options)`
* **Feature** - Enhanced `debounce` function with full async support, promise sharing, AbortController integration, and new options (`leading`, `trailing`, `maxWait`, `rejectSkipped`)
* **Feature** - Added new `throttle` function with async support, promise sharing, AbortController integration, and configurable leading/trailing execution
* **Feature** - Added `getIPAddress()` to retrieve local, public, or all IP addresses using WebRTC ICE gathering
* **Bug** - Fixed `fatal` to look for `onError` on `globalThis`

### Documentation
* **Examples** - Added missing examples for browser utilities: `copyText`, `openLink`, `getKeyFromEvent`, `idleCallback`, `getText`, and `getJSON`

# Version 0.13.3 - 07.17.2025
* **Improvement/Bug** - Fix issue where some build tools could not parse raw text imports of dependencies. There is now a build step where esm endpoints now inline txt imports.


For instance in `@semanti-ui/core` templates are included like
```javascript
import template from './button.html?raw' assert { type: 'txt' };
```
These imports may not be processed downstream properly in Vite when using esmodules unless `optimize.excludeDeps` included `@semantic-ui/core`.

* **Change** - Removed `with { type: 'css' }` and ` with { type: 'html' }. Currently only `json` is supported officially and vite is not happy with unknown types <https://github.com/vitejs/vite/discussions/18534>
* **Bug** - Fix issue with empty file `dist/.js` in npm package build.

We've now linked the ESM build to a build that inlines raw text imports to prevent issues with downstream builds.

# Version 0.13.2 - 07.15.2025

* **Bug** - Remove unused dependency `@semantic-ui/esbuild-log`

# Version 0.13.1 - 07.14.2025

* **Bug** - Fixed a bug with SSR in reactive directives like conditional/data. If a reaction was long-lived (for example an interval is set up in onCreated) the reaction would not properly get gced and could rerun on the server causing an ssr error like (TypeError: this._$Ct._$AI is not a function at ReactiveDataDirective.setValue)

# Version 0.13.0 - 07.14.2025

## CSS Tokens
* **Colors** - Color variables like `red-0` -> `red-0` now automatically swap for dark mode. i.e. `red-0` = `red-100` in dark mode.
* **Colors** - Added new invariant colors that do not change for dark mode, ie. `red-0-invariant` stays dark red.

### Reactivity
* **Feature** - Added `signal.derive()` method for creating derived signals that transform a single signal's value. See [Dependent Signals guide](https://next.semantic-ui.com/reactivity/dependent-signals).
* **Feature** - Added `Signal.computed()` static method for creating computed signals that combine multiple signals. See [Dependent Signals guide](https://next.semantic-ui.com/reactivity/dependent-signals).
* **Feature** - Signals can now use `addContext` to add metadata when setting a value. This is very useful for determining what caused a reaction. See [the new example](https://next.semantic-ui.com/examples/context).
* **Feature** - Added new `mutate` helper for mutating a value by a function
* **Feature** - There is now `getItem(id)` and `getItemIndex(id)` as separate mutation helpers.
* **Bug** - Fixed issue where mutation helpers were incompatible with `allowClone: false`. They can now be used together.

### Component
* **Bug** - Fix issue where `delegatesFocus` was not working as expected
* **Bug** - Component lifecycle events like `rendered` now do not `bubble`. This means each component are no longer `composed: true`

### Query
* **Feature** - Added namespaced events to `on` and `off`
* **Feature** - Added `clippingParent` to find closest ancestor which will clip the current element
* **Feature** - Added `.data()` for getting and setting html data
* **Feature** - Added `.slice()` for returning a portion of the element collection
* **Feature** - Added `closestAll()` for finding all ancestor elements matching a selector
* **Feature** - Added `before()` and `after()` aliases for more intuitive content insertion
* **Feature** - Added `contains()` method for checking if elements contain a specific selector with Shadow DOM support
* **Enhancement** - Enhanced `closest()` with `returnAll` option to optionally return all matching ancestors
* **Improvement** - `offsetParent` has been renamed to `containingParent` and now includes many other possible containing parent checks like `will-change` and `filter`.
* **Bug** - `setting()` can now be used as a getter.
* **Bug** - Fixed `offsetParent` to correctly return offset parent for willChange
* **Bug** - Fixed bug where `useAlias()` was not working as intended to alias Query.

### Docs
* **Examples** - Improved console log styling for examples
* **Examples** - Added a large amount of Signal & Reactivity examples

### Testing
* **Improvement** - Vitest now runs without watch for `npm test`, vitest configs have been added for each package.

### Utils
* **Breaking** - `prettifyID` has been renamed to `prettifyHash` to better reflect its purpose of converting numeric hash values to alphanumeric strings
* **Feature** - `prettifyHash` now supports `minLength` and `padChar` options for customizing output format
* **Feature** - Added `getRandomSeed()` function that uses `crypto.getRandomValues` when available for cryptographically secure random seeds
* **Feature** - `generateID` now accepts an optional seed parameter for reproducible ID generation
* **Feature** - `hashCode` now uses the renamed `prettifyHash` internally when `prettify: true` option is set
* **Feature** - `sortBy` now supports multi-key sorting by accepting an array of keys
* **Enhancement** - `sortBy` now uses `localeCompare` with `numeric: true` for proper string sorting (e.g., "item10" comes after "item2")
* **Enhancement** - `sortBy` comparator function now receives key index as fifth parameter for multi-key sorting
* **Enhancement** - `generateID` now uses `crypto.getRandomValues` via `getRandomSeed()` for better randomness
* **Bug** - `isBinary` now detects all types of typed arrays including Int8Array, Float32Array, BigInt64Array, etc.

# Version 0.12.4-1
* **Tailwind** - `@semantic-ui/tailwind` and `tailwindcss-iso` now have bundled CDN version to avoid issues importing css files in browser via esm. Modified `tailwind` package to accomodate this change.
* **Tailwind** - Removed bundled `wasm` files, these are now part of the generic `tailwindcss-iso` package.

# Version 0.12.0
* **Template** - `onThemeChanged` now looks for either `themechange` event from `html` or the class `dark` being toggled on `html` using mutation observers.
* **Tailwind** - Added a plugin for using Tailwind inside Semantic UI components. This can be used alongside the css tokens provided by the css framework, or instead of it. This will scan your component javascript, html and css and attach only the tailwind styles used.

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

* **Template Compiler** - Fixed an issue with nested conditionals inside svg.

# Version 0.11.3
* **Input** - Fix placeholder focused color to be theme aware

# Version 0.11.2

* **Query** - Fix `setting()` and `settings()` not returning dom element for chaining.
* **Template Helpers** - `guard` and `nonreactive` can now be passed in values and not just functions.

# Version 0.11.0-1

## Major Changes
* New [**AI**](https://github.com/Semantic-Org/Semantic-Next/tree/main/ai) folder with detailed instructions for AI models working with Semantic UI, including guides for each package and instruction sets for writing components.
* Theming has been reworked inside the UI framework. CSS variables are now attached to `:host` inside the shadow dom instead of globally to `:root`. This means you can no longer access globally component css variables.

### Positive Trade Offs
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

### Trade Offs

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

### Additional Changes
Some paths have shifted
* Global theme variables are now included in `semantic-ui.css` instead of a separate `theme/base.css` file.
* Themes/Specs are now included in each component folder
* Component CSS variables are now included in the Shadow DOM scope and NOT global scope. This should vastly improve the global dev tools experience by reducing the number of defined variables in scope.

## New UI
- **Input** - Added `type` property for inputs
- **Buttton** - Added `type` property for buttons

## New
* Query - Added `$('form').submit()` shorthand for `$('form').trigger('submit');`
* Utils - Added color utils for oklch conversion to hex and rgb. These are essential to use oklch in javascript.
* Signals - `increment` and `decrement` now receive a max and min. This can be used to increment a value within a limit. This is particularly useful for keyboard controls that use a `selectedIndex`
* Signals - `debugReactivity` has been greatly improved. You can now pass debug context with signals and reactions and read them during flush.
* Component - Added reactivity debugging metadata for all reactive template features like each, if, expressions. This will now appear when using `{debugReactivity}` in a template.
* Binding to `checked` or `input` will automatically update the element property if the value changes. Note this is a one way binding, updating the element attribute will not update a signal/setting passed into `value`.
* Template Helpers - Added `isNot` helper

## Bug
* Fix `value` / `val` in Query would not set value of custom elements because of too strict html element type checking.

# Version 0.10.9

## New
* `formatDate` now supports timezone abbreviations like `ET` and `PT`
* Query now includes `getSlot()` and `setSlot` methods for getting/setting slotted content for a web component

## Improvements
* Expression evaluation has been improved to support additional cases with mixed Lisp and JS style function callbacks
* Improved the performance characteristics of reactive conditionals in templates
For instance you can now pass js to Lisp style arguments
```javascript
{concat 'my' 'friend' (isDog ? 'simon dog' : 'pookie cat') }
```

## Bugs
* Fix `pick` in utils to work with proxy objects

# Version 0.10.4-0.10.8

## New
* Add `cdn` links to package.json for jsdelivr and unpkg
* Updating `publish` script to handle updating deps better
* Add proper `browser` endpoint to hopefully resolve unpkg usage


# Version 0.10.3

## New
* Added `end()` to query to return to previous selections when chaining
* `prepend` and `append` now can add multiple content like `$('div').prepend('<p>Hello</p>', '<p>World</p>');

## Bugs
* Fix issue when chaining using query collections made of other query collections

# Version 0.10.2

## New
* Added `idleCallback` to `@semantic-ui/utils` for wrapping browser's requestIdleCallback (not fully supported in Safari)

## Improvements
* Added new keyword `bind` that will let you directly bind events without event delegation. This can be useful for attaching to events that do not bubble.
* Templates now have a `destroyed` flag to determine if it is destroyed

## UI
* Add basic definition of label including secondary, outline, badge

## Bugs
* Fixed bug where subtemplates did not properly remove themselves when destroyed from `findChildren`
* Fixed card fluid variation, fix card min width
* Fixed fitted menu variation
* Fix issue with link and link icon from feather-icons (link icon now `linkify`)

## Docs
* AST display is now reactive on template changes. Content changes are no longer lost when you change from mobile/tablet view to computer view.

# Version 0.10.1

## Improvements

### Templates
* Data passed through to event handlers now automatically type converts, for instance data-index="1" will be of type number when used in an event handler.

## Bugs

### Each
* Fix issue with `key` missing from each..in with objects

# Version 0.10.0

### Project
* The project repo is now public.

### Improvements

#### Each
* Each now supports iterating over objects with `key` instead of `index`
* Each now supports else conditions
* Each now supports custom index / key names {#each value, index in values}
* Default index name is always `index` in data context instead of `@index`. `@foo` is not a valid variable name in js so it was breaking js expressions.

## Expressions
* You can now use signals like state in js expressions without get in templates i.e `{ someState == 'someValue' ? 'yes' : 'no' }` and not `{ someState.get() == 'someValue' ? 'yes' : 'no'}`
* Fix `change` event to only fire on blur for ui-input, fix `input` event.

## UI Icon
* Added `href` to `ui-icon`. Added hitbox to links by default for mobile/touch.

### Bugs
* Fix bug where global events would ignore an event if it bubbled from a web component shadow dom (deep)

### Docs
* Updated each docs, and added new examples

# Version 0.9.4

### Bugs

* Improved typing for `@semantic-ui/templating` for `CallParams`.
* Improved jsdocs for callbacks like events, createComponent, keys in `@semantic-ui/components`.
* Adds @links to jsdocs for reactivity query and utils library.
* Adds missing docs for some methods in query and reactivity

# Version 0.9.3

### Improvements

* `value` in event handlers will now automatically pass through value from custom events
* `input` component now includes `debounce`, `search`, `debounceInterval`
* `input` component now includes sizing and improvements to hitbox
* Adds performance improvements to expression lookup in templating shortcircuiting for common lookups.
* Adds search to `NavMenu` component

### Bugs
* Fixed issue when evaluating js expressions passed through to subtemplates and snippets. Because data to subtemplates is wrapped to preserve reactivity, the js context of ternarties like `subTemplateData ? 'yes' : 'no` was expecting `subTemplateData() ? 'yes' : 'no'`

# Version 0.9.2

### Improvements

* `getJSON` can now be imported directly from `@semantic-ui/component`

### Bugs
* Fix issue where state changes may not trigger reactive updates

# Version 0.9.1

### Improvements

* Improvements to typing for `@semantic-ui/component`

# Version 0.9.0

### Improvements

### Docs
* After much experimenting with types (see ver 0.8.8.6-11) figured out stable way to get typescript autocomplete working in playground. This required pulling `type:module` from package.json for now.

### Improvements
* Added links to docs for some utils in jsdocs (utils, signal, templating) working through more types and jsdocs currently.

# Version 0.8.9

### Bugs
* Fix bugs from utils rearrangement

# Version 0.8.8

### Improvements
* Improving utils docs with jsdoc links to API docs for corresponding utils

# Version 0.8.7

### Bugs
* Fix use of type import in uncompiled javascript

# Version 0.8.6

### Improvements
* Add type definitions to templating library

### Bugs
* Fix typo in utils that may have caused types not to load

# Version 0.8.5

### Bugs
* Fix typo in reactivity types

# Version 0.8.4

### Improvements

* Adds type definitions to reactivity library
* Refactors and improves type definitions for utils

# Version 0.8.3

### Improvements

* Adds type definitions to utils library

# Version 0.8.2

### Improvements

Reactivity helpers now handle multiple args to `push`, `unshift`. Added `unshift` for consistency.

# Version 0.8.0

### Breaking Changes
* `getComponent` and `getDataContext` in Query have been renamed to just `component` and `dataContext` this is to preserve consistency with other methods on Query which dont preface getters with 'get'

### Bugs
* Fix `ui-menu` did not export `item` for parts
* Improve performance of signal's mutation helpers

# Version 0.7.0

### Breaking Changes
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

# Version 0.6.1

* Fix npm publication issue.

# Version 0.6.0

### Breaking Changes
* Standard template syntax now defaults to reactiveData to avoid confusion when using subtemplates naively. You can still specify non reactive data using verbose syntax.

### Improvements
* Added cyclical detection to to expression lookup to avoid recursion

### Bug Fixes
* Fix bug with class names "classic syntax" for components with specs like button, menu etc
* Fix issue with js expression passthrough to snippets and subtemplates

# Version 0.5.0

### Breaking Changes
* Renamed `ReactiveVar` to `Signal` and updated all libraries to reference new name. The change is purely cosmetic and does not adjust underlying behavior.
* `@semantic-ui/reactivity` now exports `Signal` and no longer `ReactiveVar`.

# Version 0.4.0

### Improvements
* Templates now will evaluate javascript expressions like `{index + 1}`, {getThing(foo, bar)} and even nested objects like `{getValue { foo: 'baz'} }`

# Version 0.3.1

### Bugs
* Fix `Reaction.guard` not behaving as expected in `@semantic-ui/reactivity`

# Version 0.3.0

### API Changes
* All settings now permit attributes with either kebab or lowercased conversion. i.e. settings = { showLink: false } can be set either like `<my-component showlink>` or `<my-component show-link>` as an alias.

# Version 0.2.2
* UI: Adds new UI card component with minimal featureset
* Bugfix: Fixed issue with SSR `<ui-button primary>` being rendered as `<ui-button primary="true">`
* Bugfix: Fix `off` not allowing an array of events like `$('div').off('touchend mouseleave');`
* Bugfix: Fix issue with `one` not properly removing events when attached together like `$('body').one('mouseup touchend');`

# Version 0.2.1
* Added `glass` modal
* Added `fluid` input

# Version 0.2.0

### Breaking Changes
* Settings now convert from prop values `camelCase` to `<my-component kebab-case>`. Previously they followed the Lit convention of converting to `<my-component kebabcase>`. This seems more conventional since native attributes use dashes.

### Fixes
* Fix several issues related to attribute updates when spec is used (i.e. button and other ui primitives) particularly with boolean attributes and multiple attribute changes at once.

# Version 0.1.7
### Features
* Added `ready` to Query and `on('ready')` as aliases for `domcontentloaded`.
* You can now specify full templates as settings, not just template names. i.e. `settings = { rowTemplate = new Template() };`

### Fixes
* Calling `defineComponent` multiple times on client will no longer produce error (useful when multiple components need to req another one to be defined)
* Renderer now probably gcs subtrees using weakref
* Components now support custom classes as settings

# Version 0.1.6
* Fixed some issues related to data staleness in AST subtrees like {#each}

# Version 0.1.5
* Add `openLink` to utils
* Refactor settings to trigger reactivity in any reactive context
* Fixes for `getChild` `getParent` and other helpers
* Store data context in DOM
* Fix DOM manip in query to work in some locations it was not working before `shadowRoot` etc.

# Version 0.1.4
* Added `weightedObjectSearch* utility
* Refactors snippet and subtemplate data context to support `data={getData}` type expressions

# Version 0.1.1

* Templating now supports either single or double bracket syntax `{{getName}}` or `{getName}`

# Version 0.1.0

* `createComponent` has been renamed to `defineComponent`
* `createInstance` has been renamed to `createComponent`
* `lightCSS` has been renamed to `pageCSS`

