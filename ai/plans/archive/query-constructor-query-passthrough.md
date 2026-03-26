# Query: Fix constructor Query-to-Query property leak

**Risk: Medium-High** | **Type: Bug** | **Lines changed: 2** | **Status: Implemented**

## Problem

When `selector` is a `Query` instance, the constructor used `if` (not `else if`), so execution fell through all branches. `Object.assign(this, elements)` copied every enumerable own property from the source Query — including `options`, `prevObject`, `isGlobal`, `isBrowser` — overwriting the freshly set values.

Most impactful case: wrapping a `$$` query with `$()` leaked `pierceShadow: true` into the new instance, silently changing query behavior.

## Change

```javascript
// Before
if (selector instanceof Query) {
  elements = selector;
}
if (...) {

// After
if (selector instanceof Query) {
  elements = Array.from(selector);
}
else if (...) {
```

`Array.from` extracts only indexed elements (0..length-1). The `else if` prevents fall-through.

## Tests

3 DOM tests added:
- Wrapping preserves elements
- `pierceShadow` does not leak from `$$` to `$` wrapper
- `prevObject` does not leak from chained queries
