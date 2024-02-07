## Todo MVC

This implements [TodoMVC](https://todomvc.com/) using the underlying framework powering Semantic.

This should help showcase some of the key features of Semantic UI's templating

### Notables

#### Templating
* Use of core templating constructs like {{>subTemplate}} {{#each}} {{#if}} 
* Using `.child('templateName')` and `parent('templateName')` to traverse templates
* Use of `onDestroyed` and `onCreated` to handle attaching events outside of template scope

#### Query
* Use of [Query]() with `$` function to chain DOM updates

#### Reactivity
* Helpers for `ReactiveVar` like `removeItems`, `setProperty`, `toggle` `push`
* Use of `Reactive.afterFlush` to trigger callbacks after reactive updates

