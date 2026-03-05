---
title: Component Template Syntax Reference
description: Complete reference for Semantic UI template syntax — expressions, conditionals, loops, async, snippets, subtemplates, slots, reactivity control, built-in helpers, and attribute binding rules.
keywords: [template, expression, conditional, loop, each, if, async, snippet, subtemplate, slot, helper, classMap, rerender, guard, html, svg, reactivity, signal, data context]
audience: authoring
skill: component-templating
---

# Component Template Syntax Reference

> **Skill:** `sui:component-templating`
> **Purpose:** Complete syntax reference for writing templates in Semantic UI components — every block type, expression style, attribute binding rule, and built-in helper.

---

**Golden rule: This is a custom expression language.** Do not assume Handlebars, JSX, Mustache, or any known template syntax. Expressions support **both** Lisp-style (`{fn arg}`) and JS-style (`{fn(arg)}`) simultaneously. Signals auto-unwrap. Both `{}` and `{{}}` compile identically. Templates are reactive by default — expressions re-evaluate when signals change without manual subscriptions. Expressions themselves use signals under the hood to surgically update html when values change.

---

## Data Context

Every expression evaluates against a flat data context. Identifiers are resolved in this order (first defined value wins):

1. **Component instance** — methods and properties from `createComponent`
2. **Settings** — values from `defaultSettings`, HTML attributes, or `.settings()`
3. **State** — reactive signals from `defaultState`
4. **Subtemplate/snippet data** — data passed via `{>name key=value}` or `reactiveData`
5. **Global helpers** — built-in helpers and custom registered helpers

This flat structure means you can move a value between settings and state without changing the template.

---

## Bracket Syntax

A template file must use **one** bracket style consistently. Single `{name}` is preferred. Double `{{name}}` is supported for familiarity (Handlebars/Angular) but the entire file must use the same style. Both compile to the same AST.

---

## Expressions

### Three Calling Conventions

| Style | Syntax | Example |
|-------|--------|---------|
| **Lisp** | space-separated | `{formatDate date 'h:mm a'}` |
| **JavaScript** | parens + commas | `{formatDate(date, 'h:mm a')}` |
| **Mixed** | Lisp outer, JS inner | `{formatDate (date + offset) 'h:mm a'}` |

```html
<!-- Lisp: right-to-left, intermediary functions chain -->
{titleCase concat firstName ' ' lastName}
<!-- evaluates to: titleCase(concat(firstName, ' ', lastName)) -->

<!-- JS: standard call syntax -->
{users.filter(u => u.active).length}

<!-- Mixed: parentheses control evaluation order -->
{formatDate (getDate now) 'h:mm'}
```

### Automatic Behaviors

- **Signal unwrapping** — signals resolve to `.value` automatically, including at each level of a deep path (`user.address.city` unwraps signals at `user`, `address`, and `city`)
- **Zero-arg function invocation** — functions with no required args auto-invoke when they are the terminal token
- **Inline JS** — arithmetic (`{value + 2 * 5}`), ternaries (`{isTrue ? 'yes' : 'no'}`), object/array literals (`{join ['1','2','3'] ' and '}`) all work inside `{}`
- **Literal detection** — `'strings'`, `"strings"`, numbers, `true`/`false` are detected as literal values

---

## Attribute Binding

### Quoted vs Unquoted — Critical Distinction

| Syntax | Behavior | Use when |
|--------|----------|----------|
| `attr="{expr}"` | Always renders as string (even falsy) | String attributes: `value`, `href`, `class` |
| `attr={expr}` | Removes attribute when falsy | Boolean attributes: `disabled`, `checked` |

```html
<!-- ❌ WRONG: quoted boolean — renders disabled="false" (truthy in HTML!) -->
<button disabled="{isLoading}">

<!-- ✅ RIGHT: unquoted — removes attribute when false -->
<button disabled={isLoading}>

<!-- String attribute — quoted is correct -->
<input type="number" value="{count}">
```

Boolean attributes that auto-remove when falsy: `allowfullscreen`, `async`, `autofocus`, `autoplay`, `checked`, `controls`, `default`, `defer`, `disabled`, `formnovalidate`, `inert`, `ismap`, `itemscope`, `loop`, `multiple`, `muted`, `nomodule`, `novalidate`, `open`, `playsinline`, `readonly`, `required`, `reversed`, `selected`.

### The `{ui}` Prefix

In primitives, `{ui}` is a data-context value (not special syntax) that expands to CSS classes from active spec attributes: `<div class="{ui}button">` renders as `class="primary large button"`.

### Template Event Binding

Bind events directly in templates with `@event` syntax:

```html
<div @click={toggleMenu}>Toggle</div>
<input @input={handleSearch}>
```

The handler must be a method from `createComponent` available in the data context. For details on event delegation and the full event DSL, see `sui:component-events`.

---

## Conditionals

```html
{#if condition}
  ...
{else if otherCondition}
  ...
{else}
  ...
{/if}
```

Conditions accept any expression style:

```html
<!-- Lisp with helper -->
{#if is valueA valueB}...{/if}
{#if not isEven number}...{/if}
{#if hasAny items}...{/if}

<!-- JS style -->
{#if valueA == valueB}...{/if}
{#if !isEven(number)}...{/if}
{#if items.length > 0}...{/if}
```

### Production Pattern — Conditional Wrapper

```html
{#if href}
  <a class="{ui}card" href="{href}" part="card">{> content}</a>
{else}
  <div class="{ui}card" part="card">{> content}</div>
{/if}
```

---

## Loops

### Syntax Variants

| Syntax | Iterator | Index variable |
|--------|----------|----------------|
| `{#each items}` | Direct context (`{name}`, `{this}`) | `{index}` |
| `{#each item in items}` | Named `{item.name}` | `{index}` |
| `{#each item, i in items}` | Named `{item.name}` | Custom `{i}` |
| `{#each items as item}` | Named `{item.name}` | `{index}` |
| `{#each items as item, i}` | Named `{item.name}` | Custom `{i}` |
| `{#each value, key in obj}` | Object iteration | `{key}` |

```html
<!-- Direct context: properties and {this} available -->
{#each people}
  {name} - {age}
{/each}

<!-- {this} for primitive values -->
{#each numbers}
  {this}
{/each}

<!-- Named iterator -->
{#each user in users}
  {user.name} ({index})
{/each}

<!-- Custom index alias -->
{#each product, i in products}
  Item #{i + 1}: {product.name}
{/each}

<!-- Object iteration -->
{#each value, key in settings}
  {key}: {value}
{/each}

<!-- Expression-generated iterable -->
{#each number in range 0 4}
  {number}
{/each}
```

### Empty State with `{else}`

```html
{#each item in items}
  {item.name}
{else}
  No items available
{/each}
```

### Nested Loops — Custom Index Aliases Required

```html
<!-- ❌ WRONG: shadowed index -->
{#each team in teams}
  {#each member in team.members}
    Team {index}, Member {index}  <!-- both are the inner index! -->
  {/each}
{/each}

<!-- ✅ RIGHT: custom aliases -->
{#each team, teamIdx in teams}
  {#each member, memberIdx in team.members}
    Team #{teamIdx + 1}, Member #{memberIdx + 1}
  {/each}
{/each}
```

---

## Async Blocks

Handle promises directly in templates with automatic reactive re-execution.

```html
{#async fetchUsers as users}
  {#each users as user}
    <li>{user.name}</li>
  {/each}
{loading}
  Loading...
{error as e}
  Failed: {e.message}
{/async}
```

| Section | Aliases | Purpose |
|---------|---------|---------|
| Main body | — | Renders when promise resolves |
| `{loading}` | `{before}` | Renders while pending |
| `{error as e}` | `{catch as e}` | Renders on rejection |

### Without `as` — use `{this}`

```html
{#async getResults}
  Result: {this}
{error}
  Error: {this.message}
{/async}
```

### Destructuring

```html
{#async fetchUser as {name, email, ...rest}}
  <p>{name} — {email}</p>
{/async}
```

### Reactive Re-execution

When a signal used in the async expression changes, the block re-executes automatically:

```html
<!-- searchTerm is a signal — changing it triggers a new fetch -->
{#async getResults searchTerm as results}
  {#each result in results}
    <li>{result}</li>
  {/each}
{/async}
```

---

## Snippets

Inline reusable template fragments. Defined with `{#snippet}`, invoked with `{>name}`.

```html
{#snippet row}
  <tr><td>{name}</td><td>{role}</td></tr>
{/snippet}

{#each admins}{>row}{/each}
{#each members}{>row}{/each}
```

**Key rules:**
- **Order-independent** — define before or after use
- **Inherit parent data context** by default
- **Override data** by passing named values: `{>greeting name='Sally'}`

### Production Pattern — Conditional Wrapper with Snippet

```html
{#if href}
  <a href={href}>{>content}</a>
{else}
  {>content}
{/if}

{#snippet content}
  {beforeText} {text} {afterText}
{/snippet}
```

---

## Subtemplates

Render a separate `defineComponent` (without `tagName`) from inside another template. Must be registered via `subTemplates` in `defineComponent`.

### Syntax Forms

| Form | Syntax | Data reactivity |
|------|--------|-----------------|
| **Shorthand** | `{>templateName prop=value}` | Reactive by default |
| **Shorthand + data** | `{>templateName data=(getData user)}` | Reactive by default |
| **Verbose** | `{>template name='templateName' data={...}}` | Non-reactive by default |

```html
<!-- Shorthand: inline data, reactive by default -->
{>userProfile name=(getFullname user.id) age=user.age}

<!-- Verbose: explicit name + data object, non-reactive -->
{>template name='userProfile' data={name: user.name}}

<!-- Dynamic template name (verbose only) -->
{>template name=(getProfileTemplate user) data={name: user.name}}
```

### Verbose Reactive Data

Opt in to reactivity in verbose syntax with `reactiveData`:

```html
<!-- ❌ WRONG: expecting verbose data to be reactive -->
{>template name='profile' data={status: getStatus}}

<!-- ✅ RIGHT: use reactiveData for values that should re-render -->
{>template name='profile' reactiveData={status: getStatus} data={name: user.name}}
```

### Registering Subtemplates

```javascript
import { row } from './row.js';
defineComponent({ tagName: 'ui-table', template, subTemplates: { row } });
```

### Template-as-Settings Pattern

Expose a template setting so consumers can override rendering:

```javascript
const defaultSettings = { rowTemplate: null };
// Consumer: $('ui-table').settings({ rowTemplate: myCustomRowTemplate });
```

```html
{>template name=rowTemplate data=row}
```

---

## Slots

Content projection via web component slots. Space after `>` is optional.

```html
{>slot}               <!-- default slot -->
{>slot header}        <!-- named slot -->
{> slot content}      <!-- also valid -->
```

Consumer: `<ui-card><div slot="header">Title</div></ui-card>`

---

## Raw HTML

Render unescaped HTML. Only use with trusted/sanitized content:

```html
{#html sanitizedContent}
```

---

## SVG

Use standard `<svg>` tags directly — the compiler auto-detects them and creates an SVG rendering context. Expressions inside `<svg>` work normally. No special block syntax needed.

---

## Reactivity Control

### `{#rerender key}` — Force Full Re-evaluation

Re-renders the entire block (including non-reactive content) when the key changes:

```html
{#rerender userId}
  <p>User: {userName}</p>
  <p>Timestamp: {getTimestamp}</p>   <!-- non-reactive, updates anyway -->
{/rerender}
```

### `{#guard expression}` — Conditional Re-render

Only re-renders when the expression's return value actually changes:

```html
{#guard getUserStatus}
  <div class="status-{getUserStatus}">{expensiveComputation}</div>
{/guard}
```

---

## Built-in Template Helpers

All helpers are available in any template expression without import.

### Logic and Comparison

| Helper | Returns | Helper | Returns |
|--------|---------|--------|---------|
| `exists(a)` | `!isEmpty(a)` | `is(a, b)` | `a == b` (loose) |
| `isEmpty(a)` | `true` if empty | `isNot(a, b)` / `notEqual` | `a !== b` |
| `hasAny(a)` | `a.length > 0` | `isExactly(a, b)` | `a === b` (strict) |
| `both(a, b)` | `a && b` | `isNotExactly(a, b)` | `a !== b` |
| `either(a, b)` | `a \|\| b` | `greaterThan(a, b)` | `a > b` |
| `maybe(expr, t, f)` | ternary | `lessThan(a, b)` | `a < b` |
| `not(a)` | `!a` | `greaterThanEquals(a, b)` | `a >= b` |
| `default(val, fallback)` | `val ?? fallback` | `lessThanEquals(a, b)` | `a <= b` |

### String

`concat(...args)`, `capitalize(text)`, `titleCase(text)`, `stringify(a)`, `maybePlural(value, plural='s')`, `tokenize(string)`, `escapeHTML(string)`, `truncate(text, length, options)`, `lowercase(text)`, `uppercase(text)`

### CSS Class

| Helper | Returns | Example |
|--------|---------|---------|
| `classIf(expr, trueClass, falseClass='')` | class or `''` | `{classIf isSelected 'selected'}` |
| `classMap(obj)` | space-joined truthy keys | `{classMap {active: isActive, error: hasError}}` |
| `activeIf(expr)` | `'active '` or `''` | `{activeIf is index selectedIndex}` |
| `selectedIf(expr)` | `'selected '` or `''` | |
| `disabledIf(expr)` | `'disabled '` or `''` | |
| `checkedIf(expr)` | `'checked '` or `''` | |
| `classes(array)` | space-joined list | |

### Array, Object, Date, Number

`first(array)`, `last(array)`, `count(a)`, `join(array, delim=' ')`, `joinComma(array, oxford, quotes)`, `range(start, stop, step=1)`, `arrayFromObject(obj)`, `formatDate(date, format='L', options)`, `formatDateTime(date, format='LLL', options)`, `formatTime(date, format='LTS', options)`, `roundNumber(num, precision)` / `round(...)`, `roundDecimal(num, precision)`, `numberFromIndex(a)` (returns `a + 1`)

```html
{formatDate createdAt 'MMM DD, YYYY'}
{formatDate time 'h:mm a' {timezone: 'CET'}}
{count notifications} notification{maybePlural count notifications}
```

### Debug and Reactivity

`log(...args)`, `debugger()`, `debugReactivity()`, `guard(value)` (Reaction.guard), `nonreactive(value)` (Reaction.nonreactive)

### Custom Helpers

```javascript
import { registerHelper, registerHelpers } from '@semantic-ui/templating';

registerHelper('formatMoney', (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
);
```

Once registered, use like built-in: `{formatMoney price 'EUR'}`

---

## Quick Reference

```
EXPRESSIONS
  {value}                              output value
  {fn arg1 arg2}                       Lisp-style call
  {fn(arg1, arg2)}                     JS-style call
  {fn (nested arg) arg2}               mixed with grouping
  {value + 1}                          inline arithmetic
  {cond ? a : b}                       inline ternary

ATTRIBUTES
  attr="{expr}"                        always string
  attr={expr}                          removed when falsy
  @event={handler}                     template event binding

CONDITIONALS
  {#if expr}...{else if expr}...{else}...{/if}

LOOPS
  {#each items}...{/each}             direct context ({this}, {name})
  {#each item in items}...{/each}     named
  {#each item, i in items}            custom index
  {#each items as item, i}            alt syntax
  {#each val, key in obj}             object
  {#each ...}{else}no items{/each}    empty fallback

ASYNC
  {#async promise as data}...{loading}...{error as e}...{/async}
  {#async fn as {a, b, ...rest}}      destructuring

SNIPPETS
  {#snippet name}...{/snippet}        define
  {>name}                              invoke
  {>name key=value}                    invoke with data

SUBTEMPLATES
  {>templateName prop=val}             shorthand (reactive data)
  {>template name='x' data={...}}     verbose (non-reactive data)
  {>template name=expr reactiveData={...}}  dynamic + reactive

SLOTS
  {>slot}                              default slot
  {>slot name}                         named slot

RAW HTML
  {#html content}

REACTIVITY
  {#rerender key}...{/rerender}        force re-eval on key change
  {#guard expr}...{/guard}             re-render only when result changes

DATA CONTEXT LOOKUP ORDER
  1. Component instance (createComponent)
  2. Settings (defaultSettings / attributes)
  3. State (defaultState / signals)
  4. Subtemplate/snippet data
  5. Global helpers
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Component Authoring** | `sui:component-authoring` | `defineComponent` structure, `createComponent`, file layout |
| **Component State** | `sui:component-state` | Settings vs state, signal management |
| **Component HTML** | `sui:component-html` | Semantic class naming, accessibility, DOM structure |
| **Component Events** | `sui:component-events` | Event DSL, delegation, `dispatchEvent`, `@event` details |
| **Reactive State** | `sui:reactive-state` | Signal/Reaction primitives, `Reaction.guard`, `nonreactive` |
| **Component CSS** | `sui:component-css` | Shadow DOM styling, `:host`, `part`, CSS custom properties |
