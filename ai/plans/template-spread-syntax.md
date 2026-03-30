# Template Spread Syntax

## Goal

Support object spread in subtemplate and snippet data passing, reducing the verbosity of forwarding data objects.

## Motivation

The most common subtemplate pattern is manually mapping properties:

```html
{#each friend in friends}
  {>card
    name=friend.name
    location=friend.location
    role=friend.role
    joined=friend.joined
    image=friend.image
  }
{/each}
```

Five lines of `friend.x → x`. With spread:

```html
{#each friend in friends}
  {>card ...friend}
{/each}
```

Or with overrides:
```html
{>card ...friend name=(formatName friend.name)}
```

## Design Decisions

### Step 1: Verify verbose spread already works

The expression evaluator uses `new Function` with `with` for JS evaluation. `addParensToExpression` wraps `{...}` in parens. So `data={...friend}` in verbose syntax should evaluate as:

```js
with (ctx) { return ({...friend}); }
```

This is valid JS. **Needs a test** — if it works, verbose spread is already done.

### Step 2: Add shorthand spread

```html
{>card ...friend}
{>card ...friend name='Override'}
{>mySnippet ...someObject}
```

The `...expr` token in shorthand position needs template compiler changes. Currently shorthand data is `key=value` pairs only. The parser must recognize `...` prefix as a spread token and merge the object's properties into the data context.

### Merge order: explicit props win

```html
{>card ...friend name='Override'}
```

Equivalent to `{...friend, name: 'Override'}` in JS. Explicit key=value pairs override spread properties. Matches JS spread semantics.

### Multiple spreads: allowed

```html
{>card ...defaults ...friend}
```

Left-to-right merge, same as `{...defaults, ...friend}` in JS.

### Selective projection: defer

`pick(friend, ['name', 'role'])` works today via utils. A dedicated syntax like `...friend{name, role}` is elegant but not worth the parser complexity for v1.

### Works for both snippets and subtemplates

```html
{>mySnippet ...data}          <!-- snippet -->
{>mySubtemplate ...data}      <!-- subtemplate -->
```

Same syntax, same semantics. Consistent with how `{>}` already resolves both.

## Implementation

### Sessions (estimated)

1. **Test verbose spread** — verify `data={...obj}` works in verbose subtemplate syntax. If not, fix expression evaluator (1h)
2. **Shorthand parser** — add `...expr` token recognition to shorthand subtemplate/snippet parsing in template compiler. Evaluate the expression, merge result object into data context (2-3h)
3. **Tests** — verbose spread, shorthand spread, overrides, multiple spreads, spread in loops, spread with snippets (2-3h)

### Touch Points

- **Expression Evaluator** (`packages/renderer/src/expression-evaluator.js`) — verify spread works in inline objects (may need no changes)
- **Template Compiler** (`packages/templating/`) — shorthand `...expr` token parsing
- **Subtemplate/Snippet Data Resolution** — merge spread properties into data context

## Dependencies

None — independent of all other roadmap items. Smallest scope of the four template enhancements.

## Status

Scoped. First step is testing verbose spread — may reduce scope significantly.
