# @semantic-ui/templating

Semantic UI provides a templating language for specifying structured html that is tightly coupled with the reactivity framework provided by the Reactive library.

<!-- TOC start  -->

- [Basic Features](#basic-features)
   * [If/else/elseif ](#ifelseelseif)
   * [Expressions](#expressions)
   * [Each](#each)
   * [Subtemplates](#subtemplates)
   * [Escaping HTML](#escaping-html)

<!-- TOC end -->

## Basic Features


### If/else/elseif 

You can specify conditions using `{{#if condition}}` blocks which can include arbitrary amount of ``{{elseif condition`` blocks as well as an `{{else}}`

```html
{{#if condition}}
  <div>If block content</div>
{{elseif anotherCondition}}
  <div>ElseIf block content</div>
{{else}}
  <div>Else block content</div>
{{/if}}
```

### Expressions

Expressions are evaluated in the data context of the template. Expressions are evaluated right to left passing values along. You can use `.' to access deeply nested values

```javascript
dataContext = {
  values: {
     first: false,
     second: true,
  },
  returnOpposite(value) => !value,
}
```

```html
{{#if values.first}}
  Not reached
{{elseif returnOpposite values.second}}
  Not Reached
{{elseif values.second
  Reached
{{/if}}
```

### Each

You can specify each blocks either to pass the iterated value as a variable or as the new data scope

```javascript
dataContext = {
  category: 'Icecream',
  items: [
    { name: 'One' },
    { name: 'Two' },
    { name: 'Three' },
  ],
}
```
Adds properties to data context
```html
<ul>
{{#each items}}
  <li>{{category}} {{name}}</li>
{{/each}}
</ul>
```

As new variable in context

```html
<ul>
{{#each item in  items}}
  <li>{{category}} {{item.name}}</li>
{{/each}}
</ul>
```

### Subtemplates

You can specify subtemplates using several syntax depending on your use case. Remember data values can either be literal values or references to expressions which are evaluated at run time.

Passing in new data context removing outer context
```html
{{> templateName fruit='apple' toy=getFavoriteToy}}
```
You can also use a more complex structure, which allows you to choose a template name dynamically and specify which data should be reactive or non-reactive. Remember pushing reactive data to subtemplates can be very expensive for performance.
```
{{>template
  name=getTemplateName
  reactiveData={
    name=getName
  }
  data={
    fruit: 'apple',
    toy: getFavoriteToy
  }
}}
```

### Escaping HTML

You can use `{{{` triple brackets to pass in raw html. 
```javascript
context = {
  name: 'Dwayne <b>The Rock</b> Johnson'
}
```

```html
{{{name}}
```

Keep in mind values here can cause XSS vulnerabilities. A common way to mitigate this is to create a global helper to sanitize your html input if it comes from a user. There are many [third party libraries](https://github.com/apostrophecms/sanitize-html) that can help with this, but they are typically fairly large and are not included with templating.
```javascript
import escapeHTML from 'some/npm/library';
context = {
  escapeHTML(html) {
    return escapeHTML(html);
  }
}
```

```html
{{{escapeHTML name}}
```
