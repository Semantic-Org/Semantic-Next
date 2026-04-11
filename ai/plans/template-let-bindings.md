# Template Let Bindings

## Goal

Add a `{#let}` block construct — `{#snippet}` for vars. Named derived values scoped to the template, without requiring a `createComponent` method.

## Motivation

The primary use case is **loop-local derivations** — values derived per-iteration that are used multiple times:

```html
<!-- Current: repeat the expression or create a one-liner method -->
{#each order in orders}
  {formatMoney getOrderTotal(order)} | Tax: {formatMoney getOrderTotal(order) * 0.08} | Grand: {formatMoney getOrderTotal(order) * 1.08}
{/each}

<!-- With {#let}: name the value where it's used -->
{#each order in orders}
  {#let total = order.price * order.qty}
    {formatMoney total} | Tax: {formatMoney total * 0.08} | Grand: {formatMoney total * 1.08}
  {/let}
{/each}
```

Secondary use case: ad-hoc top-level template vars for display-only derivations that don't belong in `createComponent`.

**Why this gap exists:** `createComponent` props/methods already cover most derived values. Static props are evaluated once; methods are reactive. For anything used across the template, a method is the right answer. `{#let}` is specifically for values that are **scoped to a block** (especially loops) and **used multiple times within that block** — the one place where `createComponent` can't help without passing the loop variable as an argument.

## Design Decisions

### Syntax: `{#let}...{/let}` (block form, closing tag)

```html
{#let total = price * quantity}
  <span>{formatMoney total}</span>
  <span>{formatMoney total * taxRate}</span>
{/let}
```

Block form with closing tags. No `{@let}` inline sigil — the scope boundary must be explicit. Without a closing tag, the scope is invisible (you'd have to trace upward to find the enclosing block to know where the binding ends). This is bad for humans and agents alike.

The mental model mirrors `{#snippet}`:
- `{#snippet name}...{/snippet}` — named template fragment, scoped to the tags
- `{#let name = expr}...{/let}` — named value, scoped to the tags

### Multiple bindings: separate blocks

```html
{#let total = order.price * order.qty}
  {#let tax = total * taxRate}
    ...
  {/let}
{/let}
```

Not comma-separated. Each binding is its own block. Later bindings can reference earlier ones (they're nested). Keeps the parser simple and scope explicit.

### Reactivity: computed signal per binding

Each `{#let}` creates an implicit `computed(() => expr)` injected into the data context as a signal. Fine-grained — only expressions that *reference* the binding re-render when it changes.

Implementation:
- Renderer creates `computed(() => evaluate(expr, dataContext))` for each `{#let}`
- The computed signal is added to the data context under the binding name
- Expressions like `{formatMoney total}` subscribe individually
- The computed is created as an independent reactive node, not inside any existing reactive scope
- In loops: computed signals are created per-iteration and disposed when the iteration is removed

**This must be fine-grained or the feature shouldn't ship.** Coarse-grained (re-render the whole `{#let}` block) would be a performance foot-gun.

### Top-level usage: allowed

`{#let}` at template root is valid. Scope extends to `{/let}`.

## Implementation

### Sessions (estimated)

1. **AST + compiler** — new `let` node type in template compiler, parsing `{#let name = expr}...{/let}`, handling nested `{#let}` blocks (2-3h)
2. **Native renderer** — computed signal creation, data context injection, lifecycle management in loops (3-4h)
3. **Lit renderer** — same as native renderer but using Lit's reactive update cycle (2-3h)
4. **Tests + edge cases** — nested lets, loop disposal, shadowing, signal dependencies (2-3h)

### Touch Points

- **Template Compiler** (`packages/templating/`) — new AST node type for `let` blocks
- **Native Renderer** (`packages/renderer/src/native/`) — computed signal creation + data context injection
- **Lit Renderer** (`packages/renderer/src/lit/`) — same
- **Expression Evaluator** — no changes needed (bindings are injected into data context, expressions already evaluate against it)

## Priority

Last in the template enhancement track. Build #35 (match), #36 (content projection), #37 (spread) first. If loop-local derivations keep coming up in real component authoring, `{#let}` earns its place. If they don't, the feature was correctly deprioritized.

## Dependencies

None — independent of all other roadmap items.

## Status

Scoped. Ready to implement when prioritized.
