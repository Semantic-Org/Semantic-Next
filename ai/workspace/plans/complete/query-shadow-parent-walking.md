# Query: Cross shadow DOM boundaries in parent-walking methods

**Risk: Medium** | **Type: Feature** | **Lines changed: ~15** | **Status: Implemented**

## Problem

`clippingParent()`, `positioningParent()`, and `scrollParent()` all walk ancestors via `current = current.parentNode`. A `ShadowRoot`'s `parentNode` is `null`, so the walk stops at shadow DOM boundaries.

## Decision

Made `pierceShadow` an opt-in per-method option rather than inheriting from the Query instance or defaulting to on. This lets users explicitly choose between local (within shadow root) and global (crossing boundaries) parent discovery:

```javascript
$el.scrollParent()                          // stays within shadow boundary
$el.scrollParent({ pierceShadow: true })    // crosses shadow boundaries
```

## Change

Added module-scoped `getParentNode(node, pierceShadow)` helper that crosses shadow boundaries via `getRootNode().host` when `pierceShadow` is true. All three methods accept `{ pierceShadow: false }` as a new option.

## Tests

5 browser tests added covering:
- `scrollParent` stops at shadow boundary by default
- `scrollParent` crosses with `pierceShadow: true`
- `clippingParent` stops at shadow boundary by default
- `clippingParent` crosses with `pierceShadow: true`
- `positioningParent` crosses with `pierceShadow: true`
