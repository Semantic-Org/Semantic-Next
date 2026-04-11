# Query: Skip text/comment nodes in querySelectorAllDeep

**Risk: Low** | **Type: Perf** | **Lines changed: 3** | **Status: Implemented**

## Problem

`querySelectorAllDeep` (used by `$$()`) recursively walks `node.childNodes`, which includes text nodes and comment nodes. Each non-element node triggers a function call that checks 4 conditions before returning with no work done. On content-heavy pages, ~60% of nodes are text/comment, generating thousands of wasted recursive calls per `$$()` query.

## Location

`packages/query/src/query.js` — `findElements()` inner function inside `querySelectorAllDeep()`.

## Change

Add early return at the top of `findElements` using an allowlist of meaningful node types:

```javascript
const findElements = (node, selector, query) => {
  // Skip nodes that can't have shadow roots or meaningful children
  if (node.nodeType !== Node.ELEMENT_NODE
    && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
    && node.nodeType !== Node.DOCUMENT_NODE) { return; }

  // ... rest of function
};
```

## Risk Assessment

- **Not "very low" as initially assessed** — an allowlist approach must account for all valid node types that `findElements` is called on
- `DOCUMENT_NODE` (9) is required because the initial root is often `document`
- `DOCUMENT_FRAGMENT_NODE` (11) covers ShadowRoot
- A naive allowlist missing DOCUMENT_NODE broke 5 shadow DOM traversal tests
- Denylist approach (skip TEXT + COMMENT) is safer but less defensive against exotic node types
