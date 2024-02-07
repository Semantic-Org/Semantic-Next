# @semantic-ui/templating

Semantic UI provides a templating language for specifying structured html that is tightly coupled with the reactivity framework provided by the Reactive library.

This package specifically deals with compiling static html templates to an abstract syntax tree (AST) which can be parsed by a renderer like the one included for [Lit](https://lit.dev/) in the [component package](https://github.com/Semantic-Org/Semantic-Next/tree/main/packages/component).

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

Expressions are evaluated in the data context of the template from right to left passing values along. You can use `.' to access deeply nested values

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
{{{name}}}
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
{{{escapeHTML name}}}
```

## Helper Functions

Templating includes a small list of global helpers by default designed to perform basic utilities for manipulating data.

You can also register custom global helpers to run across any expression.  The syntax for registering a global helper is implemented by the renderer which is included in the `component` class.

>> Helpers are called only if there is not a matching expression in the current data context.


```html
{{#if not fruit}}
  <p class="{{activeIf user.isActive}}">{{capitalize user.name}}</p>
  <p>{{formatDate user.lastLogin 'YYYY-MM-DD'}}</p>
{{else if is fruit 'apple'}}
  You chose apple
{{/if}}
```

### Logical Helpers
- `is`: Checks equality (`==`) between two values.
- `not`: Returns the logical negation (`!`) of a value.
- `isEqual`: Checks strict equality (`===`) between two values.
- `isNotEqual`: Checks for inequality (`!=`) between two values.
- `isExactlyEqual`: Checks strict equality (`===`) between two values.
- `isNotExactlyEqual`: Checks strict inequality (`!==`) between two values.
- `greaterThan`: Checks if one value is greater than another (`>`).
- `lessThan`: Checks if one value is less than another (`<`).
- `greaterThanEquals`: Checks if a value is greater than or equal to another (`>=`).
- `lessThanEquals`: Checks if a value is less than or equal to another (`<=`).

### Format Helpers
- `formatDate`: Formats a date according to a given format string.
- `formatDateTime`: Formats a date and time according to a given format string.
- `formatDateTimeSeconds`: Formats a date and time with seconds according to a given format string.

### String Helpers
- `capitalize`: "this sentence" to "This sentence"
- `titleCase`: "this sentence" to "This Sencence"

### Conditional Class Helpers
- `maybe`: Returns one class if a condition is true, and another if false.
- `activeIf`: Returns the class 'active' if a condition is true.
- `selectedIf`: Returns the class 'selected' if a condition is true.
- `disabledIf`: Returns the class 'disabled' if a condition is true.
- `checkedIf`: Returns the class 'checked' if a condition is true.

### Miscellaneous Helpers
- `maybePlural`: Adds an 's' to make a word plural based on the given value.
- `numberFromIndex`: Returns the number that is one greater than the given index (for 1-based counting).
- `object`: Returns the given object.
- `log`: Logs arguments to the console.
- `debugger`: Triggers a breakpoint in the debugger.

These helpers can be used within expressions in the template to dynamically change content based on the data context. For example:
