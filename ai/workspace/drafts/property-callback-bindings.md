# Property Callback Bindings

## Problem

Property bindings (`.foo={expr}`) previously treated all properties the same as events — returning the literal (unevaluated) value. This meant `.extensions={getExtensions filename}` would fail because `literalValue()` can't evaluate multi-token Lisp expressions.

The real tension: most property bindings want the **evaluated result** (data, objects, computed values), but callback properties want the **function reference itself**.

## Solution

Three layers, each with minimum syntax for its frequency:

### 1. Properties default to evaluated (value path)

```html
<!-- getExtensions(filename) is called, result set as property -->
<editor .extensions="{getExtensions filename}">

<!-- getData() is called, result set as property -->
<child-el .config="{getData}">
```

### 2. `on[A-Z]` properties auto-detected as callbacks

```html
<!-- function reference passed as-is, zero ceremony -->
<some-element .onChange="{handleChange}">
<some-element .onComplete="{handleComplete}">
```

Detection is a regex `(/^on[A-Z]/)` compiled once at module level, tested once per directive instance in the constructor. Safe because `.prop` bindings are case-sensitive (JS property assignment, not HTML attribute parsing).

### 3. `callback` / `function` helpers for non-`on*` function props

```html
<some-element .filter="{function myFilter}">
<some-element .comparator="{callback compareItems}">
```

Identity helpers — they leverage the Lisp evaluation path where arguments are resolved without auto-invocation.

### Failsafe: prefix stripping in literalValue

If someone writes `{function handleChange}` on an `on[A-Z]` prop (redundant but natural), the `literalValue()` path strips the prefix before lookup. Computed once at AST-walk time, not per reactive tick.

## Files Changed

- `packages/renderer/src/lit/directives/reactive-data.js` — `needsLiteralValue` now only includes EVENT and `on[A-Z]` properties (not all PROPERTY). Detection hoisted to constructor with module-level regex.
- `packages/renderer/src/lit/renderer.js` — `literalValue()` closure strips `function `/`callback ` prefix (computed once at AST-walk).
- `packages/templating/src/template-helpers.js` — Added `callback` and `function` identity helpers.

## Performance Considerations

- Module-level: regex compiled once per page load
- Constructor: regex `.test()` once per directive instance, result stored as `this.isCallbackProp`
- Reactive tick: single property read + `===` check in `getReactiveValue()` — zero allocations
- AST-walk: `startsWith` + `slice` computed once, closure captures pre-computed string

## Porting to Vanilla Renderer

The vanilla renderer needs the same three behaviors:
1. Default property bindings evaluate expressions (call getter functions)
2. `on[A-Z]` property names pass function references
3. `callback`/`function` helpers are identity functions in the expression evaluator

The detection logic (`CALLBACK_PROP_RE`, prefix stripping) is renderer-agnostic. The template helpers are already shared via `@semantic-ui/templating`.
