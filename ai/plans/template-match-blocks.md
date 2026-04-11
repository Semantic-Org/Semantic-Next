# Template Match Blocks

## Goal

Add a `{#match}` construct for value-based branching — rendering different content based on a single discriminant value. Replaces verbose `{#if is x 'a'}...{else if is x 'b'}...` chains that repeat the variable name in every branch.

## Motivation

The most common template branching pattern is testing a single value against multiple possibilities — status, mode, view type. Currently:

```html
{#if is status 'loading'}
  Loading...
{else if is status 'error'}
  Error: {message}
{else if is status 'success'}
  {data}
{else}
  Idle
{/if}
```

With `{#match}`:

```html
{#match status}
  {is 'loading'}
    Loading...
  {is 'error'}
    Error: {message}
  {is 'success'}
    {data}
  {else}
    Idle
{/match}
```

The discriminant is named once. Each branch declares what it matches. The construct communicates "these are exhaustive alternatives over a single value" — semantic information invisible in an if/else chain.

## Design Decisions

### Keywords: `match` / `is` / `else`

```html
{#match expression}
  {is 'value'}
    ...
  {else}
    ...
{/match}
```

`is` reads as English: "is it loading?" It's also the name of the existing equality helper (`is(a, b)` in template-helpers.js). This overloading is intentional — `is` inside `{#match}` is a keyword that shadows the helper, same pattern as `index`/`key` inside `{#each}`. Reserved names shadow parent data context within their block. Consistent with the NL philosophy — words mean different things in different contexts.

`switch/case` was considered but carries JS baggage (fall-through, `break` statements). `match/when` was considered but `is` is shorter and more natural.

### Multiple values per case

```html
{#match status}
  {is 'loading' 'pending'}
    Please wait...
  {is 'error' 'failed'}
    Something went wrong
  {is 'success'}
    Done
{/match}
```

Space-separated values in Lisp style. Matches if the discriminant equals *any* of the listed values. Natural extension of SUI expression syntax.

### No comparison operators (v1)

v1 is pure equality matching. No `{is > 90}`. Range checks are the job of `{#if}`:

```html
<!-- Use {#if} for ranges -->
{#if temperature > 90}Hot{else if temperature > 70}Warm{else}Cold{/if}

<!-- Use {#match} for discrete values -->
{#match status}
  {is 'hot'}...
  {is 'warm'}...
{/match}
```

### No fall-through

Each case is independent. No `break` needed. First matching case wins.

### Reactivity

The discriminant expression is reactive — re-matches when the signal changes, same as `{#if}`. Case values are static expressions evaluated against the data context.

### Expression support in cases

Cases accept any valid template expression, not just literals:

```html
{#match userRole}
  {is adminRole}
    Admin panel
  {is 'guest'}
    Guest view
  {else}
    Standard view
{/match}
```

## Implementation

### Sessions (estimated)

1. **AST + compiler** — new `match` node with discriminant expression + array of `is` case nodes + optional `else` node. Parsing `{#match expr}`, `{is expr...}`, `{else}`, `{/match}` (2-3h)
2. **Native renderer** — evaluate discriminant, compare against cases, render matching branch. Similar to if/else but simpler evaluation model (2-3h)
3. **Lit renderer** — same pattern as native (2h)
4. **Tests** — basic matching, multiple values, expression cases, reactive discriminant, else fallback, nested match (2-3h)

### Touch Points

- **Template Compiler** (`packages/templating/`) — new AST node: `match` block with `is` cases
- **Native Renderer** (`packages/renderer/src/native/`) — match evaluation + branch rendering
- **Lit Renderer** (`packages/renderer/src/lit/`) — same
- **Expression Evaluator** — case comparison logic (loose equality via `==`, matching the `is` helper)

## Dependencies

None — independent of all other roadmap items. Cleanest of the four template enhancements — no reactivity concerns beyond what `{#if}` already handles.

## Status

Scoped. Ready to implement.
