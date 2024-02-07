## Todo MVC

This implements [TodoMVC](https://todomvc.com/) using the underlying framework powering Semantic.

This should help showcase some of the key features of Semantic UI's templating

### Notables

Todo uses a fair amount of core templating functionality and can be helpful for getting to know the templating API. Below you will find links in todo of various features you might be interested in.

#### Templating
* Use of core templating constructs like [`{{>subTemplate}}`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/todo-list.html#L11) [`{{#each}}`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/todo-list.html#L10) [`{{#if}}`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/item/todo-item.html#L2)
* Using [`.child('templateName')`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/todo-list.js#L67) and [`parent('templateName')`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/item/todo-item.js#L11) to traverse templates
* Use of [`onDestroyed`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/todo-list.js#L58) and [`onCreated`](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/todo-list.js#L53) to handle attaching events outside of template scope

#### Query
* Use of [Query](https://github.com/Semantic-Org/Semantic-Next/tree/main/packages/query) with `$` function to [chain DOM updates](https://github.com/Semantic-Org/Semantic-Next/blob/main/examples/todo-list/item/todo-item.js#L29)

#### Reactivity
* Use of [`ReactiveVar`]() to track [`todos`]() and [`filter`]()
* Helpers for `ReactiveVar` like [`removeItems`](), [`setProperty`](), [`toggle`]() [`push`]()
* Use of `Reaction.create` to set up a reactive context to rerun a computation
* Use of [`Reactive.afterFlush`]() to trigger callbacks after reactive updates

