### Important Note

This is a pre-release version and APIs will change quickly. Before `1.0` release all breaking changes will be `minor` releases and features `patch` releases.

Please note after `1.0` Semver will be followed using normal protocols.

# Version 0.10.1

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

