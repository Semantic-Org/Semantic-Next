# @semantic-ui/templating

Semantic UI provides a templating language for specifying structured html that is tightly coupled with the reactivity framework provided by the Reactive library.


## Basic Features


### If/else/elseif 

You can specify conditions using `{{#if condition}}` blocks which can include arbitrary amount of ``{{elseif condition`` blocks as well as an `{{else}}`

```handlerbars
{{#if condition}}
  <div>If block content</div>
{{elseif anotherCondition}}
  <div>ElseIf block content</div>
{{else}}
  <div>Else block content</div>
{{/if}}
```
