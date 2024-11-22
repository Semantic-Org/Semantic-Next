### Important Note

This is a pre-release version and APIs will change quickly. Before `1.0` release all breaking changes will be `minor` releases and features `patch` releases.

Please note after `1.0` Semver will be followed using normal protocols.

# Version 0.1.6

Features
* Added `ready` to Query and `on('ready')` as aliases for `domcontentloaded`.
* You can now specify full templates as settings, not just template names. i.e. `settings = { rowTemplate = new Template() };`

Fixes
* Renderer now probably gcs subtrees using weakref
* Components now support custom classes as settings
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

