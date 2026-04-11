# Query: Inline getBoundingClientRect in dimensions()

**Risk: Very Low** | **Type: Perf** | **Lines changed: 2** | **Status: Implemented**

## Problem

`dimensions()` is a hot path called by `intersects()`, `position()`, `isInView()`, and `pagePosition()`. Each call allocates a throwaway `Query` via `this.chain(el)` solely to call `$el.bounds()`, which internally just does `el.getBoundingClientRect()`. With `intersects()` calling `dimensions()` multiple times per source-target pair, this creates unnecessary object allocations during scroll/resize handlers.

## Location

`packages/query/src/query.js` — `dimensions()` method, around line 2150.

## Change

```javascript
// Before
const $el = this.chain(el);
const rect = $el.bounds();

// After
const rect = el.getBoundingClientRect();
```

Delete the `$el` variable, call `getBoundingClientRect()` directly. The `$el` is still needed later for `positioningParent()` — only the `bounds()` call is inlined.

## Risk Assessment

- No API change — `dimensions()` return value is identical
- No behavioral change — `getBoundingClientRect()` is exactly what `bounds()` calls
- Eliminates one `Query` construction + `Array.from` + `map` per element per call
