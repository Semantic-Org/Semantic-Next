## Todo MVC

This implements [TodoMVC](https://todomvc.com/) using the underlying framework powering Semantic.

This should help showcase some of the key features of Semantic UI's templating, reactivity, and other underlying tools.

* [Templating](https://github.com/Semantic-Org/Semantic-Next/tree/main/packages/templating) provides a reactive templating language that can be used for constructing web components. It is currently designed to render with Lit underneath the hood, but compiles to an AST which could be parsed by other rendering engines.
* [Reactivity](https://github.com/Semantic-Org/Semantic-Next/tree/main/packages/reactivity) - Reactivity is an underlying reactivity framework. It can be used to set up reactive dependencies that run when a value changes.
* [Query](https://github.com/Semantic-Org/Semantic-Next/tree/main/packages/query) is a tiny library for querying the DOM and chaining updates helping reduce boilerplate.
* [Utils](https://github.com/Semantic-Org/Semantic-Next/tree/main/packages/utils) is a micro utility library for improving code legibility, reducing filesize (when tree shaking) and handling common gotchas when manipulating data in javascript.

### Code Examples

Here are some places in the Todo app which can be useful for understanding specific usage.

#### Templating
* Use of core templating constructs like [`{{>subTemplate}}`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/todo-list.html#L11) [`{{#each}}`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/todo-list.html#L10) [`{{#if}}`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/item/todo-item.html#L2)
* Using [`.child('templateName')`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/todo-list.js#L67) and [`parent('templateName')`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/item/todo-item.js#L11) to traverse templates
* Use of [`onDestroyed`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/todo-list.js#L58) and [`onCreated`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/todo-list.js#L53) to handle attaching events outside of template scope

#### Query
* Use of  with `$` function to [chain DOM updates](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/item/todo-item.js#L29)

#### Reactivity
* Use of `ReactiveVar` to track [`todos` and `filter`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/todo-list.js#L15)
* Helpers for `ReactiveVar` like [`removeItems`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/item/todo-item.js#L23), [`setProperty`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/item/todo-item.js#L16), [`toggle`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/todo-list.js#L69) [`push`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/header/todo-header.js#L24)
* Use of [`tpl.reaction`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/header/todo-header.js#L32) to create a `Reaction` bound to a template that reruns a computation
* Use of [`Reactive.afterFlush`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/item/todo-item.js#L45) to trigger callbacks after reactive updates

