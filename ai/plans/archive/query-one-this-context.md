# Query: Fix `this` context in one() wrapped handler

**Risk: Low-Medium** | **Type: Bug** | **Lines changed: 1** | **Status: Implemented**

## Problem

`one()` wraps the user's handler in an arrow function `wrappedHandler`. Arrow functions capture `this` lexically from the enclosing scope (the Query instance). When `on()`'s delegate handler calls `handler.call(target, event)`, the `.call(target)` has no effect on the arrow. The user's handler then receives `this === Query` instead of `this === matched element`.

This breaks: `$el.one('click', '.item', function() { this.classList.add('active') })`

## Change

Changed arrow function to regular function in `one()`:

```javascript
// Before
const wrappedHandler = (...args) => {

// After
const wrappedHandler = function(...args) {
```

## Verification

- `on()` already handles `this` correctly; `one()` now matches
- Framework internally uses arrow callbacks with destructured `self` — unaffected
- Full test suite passes (1414 tests)
