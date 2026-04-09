# Review: Plan 02 — Defer Marker Removal to Post-Paint

**Score: Agree**

The plan is mechanically sound with correct dependency ordering, but there is one important insight the plan should acknowledge more prominently.

---

## 1. Is the rAF deferral mechanically correct? Is `this.isConnected` reliable?

**Yes.** The proposed change wraps `removeMarkers()` in a `requestAnimationFrame` callback with an `isConnected` guard. This is correct:

- `hydrate()` is itself already called from a rAF (line 87 of `base.js`), so the deferred `removeMarkers()` would fire in the *next* rAF — one frame later.
- `this.isConnected` is a standard HTMLElement property reflecting live DOM attachment. It is the correct guard for "was this element removed between hydration and cleanup." The pattern matches how the renderer itself guards Reactions (e.g., `comment.isConnected` at line 1371, `region.anchor.isConnected` at line 1631).

One subtlety: since `hydrate()` already runs inside a rAF, the nested `requestAnimationFrame` pushes cleanup to the *second* animation frame after `connectedCallback`. This is fine — the plan acknowledges markers are invisible to users (comment nodes in shadow roots). But the plan says "one frame" — it is actually two frames from connection, one frame from hydration.

## 2. Do any framework internals assume markers are gone synchronously?

**No.** After `hydrateMarkers()` completes:

- `template._isHydrating` is set to `false` (line 146)
- `template.rendered` is set to `true` (line 147)
- `_hydrating` is set to `false` (line 148)

None of these depend on marker absence. The `requestUpdate` method (line 233) renders through `template.render()`, which operates on the AST and reactive bindings — not on comment nodes. The `attributeChangedCallback` checks `_hydrating` to suppress cascades during hydration but doesn't inspect DOM comments.

The only consumer of marker state is `canHydrate()` (line 97), which runs *before* hydration, not after.

**Verdict: No synchronous dependency on marker removal.**

## 3. Does `removeMarkers()` need changes, or is it used as-is?

**Used as-is, but this deserves scrutiny.** The plan correctly states `removeMarkers()` is unchanged. However, there is an important observation the plan's dependency section captures but understates:

**After Plan 01 lands, `removeMarkers()` may have zero work to do.** Here is why:

| Marker Type | Handler | Already Removed By Handler? |
|---|---|---|
| Regular text expression (`sui:v1:N`) | `hydrateTextExpression` | Yes — `comment.remove()` (line 1408) or `comment.replaceWith(textNode)` (line 1412) |
| unsafeHTML expression (`sui:v1:N`) | `hydrateTextExpression` | **No** — comment kept as anchor. **Plan 01 fixes this by replacing with text node.** |
| Block opening (`sui-block:v1:N`) | `hydrateBlockDirective` | Yes — `comment.replaceWith(region.anchor)` (line 1468) |
| Block closing (`/sui-block:v1:N`) | `hydrateBlockDirective` | Yes — `next.remove()` (line 1456) |
| Inner/nested markers | `hydrateInnerContent` → recursive `hydrateMarkers` | Yes — same handlers apply recursively |

After Plan 01, every marker type is removed by its own handler. The `removeMarkers()` TreeWalker would walk the entire shadow root and find nothing. This means:

- **The deferral saves ~6ms not because the work moves later, but because the work becomes a no-op TreeWalker scan.** The real savings came from Plan 01 (unsafeHTML anchors), not from deferral timing.
- The 6ms figure in the plan was measured *before* Plan 01. After Plan 01, the synchronous `removeMarkers()` cost should be re-measured. It may drop to <1ms (just the TreeWalker overhead with zero removals), making deferral unnecessary.

**Recommendation:** After Plan 01 lands, profile `removeMarkers()` again. If it is <1ms, consider removing it entirely instead of deferring it. A `removeMarkers()` that removes nothing is pure waste regardless of timing. If a safety net is desired (for edge cases like failed hydration entries), a `if (__DEV__)` development-only assertion that no markers remain would be cleaner than a production TreeWalker.

## 4. Test update for "no hydration comments remain" (line 658)

The plan says to "await the deferred callback (e.g., wait one rAF + tick before asserting)." This is correct in principle. The specific implementation:

```js
// Current test awaits `rendered` event, which fires via setTimeout
const rendered = $(el).onNext('rendered');
document.body.appendChild(el);
await rendered;
```

The `rendered` event fires from `setTimeout(() => this.template?.onRendered(), 0)` (line 153 of `base.js`). The deferred `removeMarkers()` fires from a rAF nested inside the hydration rAF. In browser scheduling:

- **setTimeout(0)** is a macrotask, typically 1-4ms
- **rAF** fires before the next paint, typically ~16ms

So `onRendered` (setTimeout) will almost always fire *before* the deferred `removeMarkers()` (rAF). The test currently works because `await rendered` completes before the check, and markers are already gone synchronously. After deferral, `await rendered` would complete *before* markers are cleaned up.

The fix should be:

```js
// Wait for the deferred rAF cleanup
await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
```

The `setTimeout` after `rAF` ensures the rAF callback has executed before the assertion runs. A bare `await new Promise(r => requestAnimationFrame(r))` might race if the test's rAF fires in the same frame as the cleanup rAF.

**However:** Per finding #3 above, if Plan 01 makes `removeMarkers()` a no-op, this test should pass immediately after `await rendered` anyway (all markers removed by handlers). The test update may not actually be needed. This should be verified empirically.

## 5. Could `onRendered` race with rAF cleanup problematically?

**No, but the plan's reasoning is incomplete.** The plan says:

> `onRendered` fires via `setTimeout(fn, 0)` — it may run before the deferred cleanup. User code in `onRendered` that inspects `shadowRoot.innerHTML` would see stale markers. Acceptable: `onRendered` is for component logic, not DOM cosmetics.

This is correct. Let me add precision to the timing:

1. `hydrate()` runs in rAF #1
2. `setTimeout(() => onRendered(), 0)` is queued — fires as a macrotask after rAF #1 completes
3. `requestAnimationFrame(() => removeMarkers())` is queued — fires in rAF #2 (next frame)
4. **Order: onRendered fires first, removeMarkers fires second**

So `onRendered` will *always* see stale markers (not "may" — it deterministically will). This is acceptable because:

- Comment nodes don't affect layout, selection, or event handling
- The `$()` query API filters by element/selector, not raw DOM nodes
- No first-party component's `onRendered` callback inspects comment nodes

The only theoretical risk: a downstream user doing `this.shadowRoot.innerHTML` in `onRendered` for snapshot/serialization purposes would capture comment noise. This is an edge case not worth blocking on.

---

## Summary

The plan is sound. The mechanical approach (rAF + isConnected guard) is correct and follows established patterns in the codebase. The dependency on Plan 01 is correctly identified and critical.

The main insight this review adds: **after Plan 01 lands, `removeMarkers()` becomes a no-op.** The deferral still has value as a safety net, but the real performance win comes from Plan 01, not from timing. The plan should be re-evaluated after Plan 01 to determine whether `removeMarkers()` should be deferred (as proposed), removed entirely, or converted to a dev-only assertion.
