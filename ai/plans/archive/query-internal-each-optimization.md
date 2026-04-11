# Query: Internal each() optimization

**Risk: High** | **Type: Perf** | **Status: Rejected**

## Problem

Every `each()` invocation calls `this.chain(el)` per element, constructing a full `Query` instance per iteration. Only 2 of 30 internal callers (`show()` and `toggle()`) use the `this`-as-Query binding. The other 28 use arrow functions where the wrapper is wasted.

## Rejection Reason

The `this` wrapper in `each()` is one of the most common conventions for end users:

```javascript
$('.items').each(function(el) {
  this.addClass('active');  // this = Query wrapper for el
});
```

The library principle is that internal code should use `each()` the same way end users would — dogfooding the public API. Adding a separate `_each()` fast path would:

1. Create divergence between internal and external usage patterns
2. Violate the no-underscore naming convention on the Query object
3. Risk silent breakage if a callback is migrated incorrectly
4. Require auditing ~28 call sites

The per-element Query allocation is the cost of the DX convention. Not worth a separate internal codepath.
