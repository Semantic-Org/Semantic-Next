# Tooltip Overflow Escape: Portal → Top Layer Migration

## Problem

Tooltips inside web components are clipped by ancestor `overflow: hidden` containers. The current `portal` option — which moves the tooltip to `document.body` — breaks CSS anchor positioning because `anchor-name` is tree-scoped and invisible across shadow DOM boundaries.

This is not an edge case. It breaks immediately in common layouts like a collapsible sidebar with tooltips on menu items:

```html
<!-- Host page -->
<div class="sidebar" style="overflow: hidden; width: 48px;">
  <sidebar-menu>
    #shadow-root
      <menu-item>
        <icon />
        <span class="label">Dashboard</span>
        <!-- tooltip created here via .tooltip() -->
      </menu-item>
  </sidebar-menu>
</div>
```

```js
$$('sidebar-menu menu-item').each((el) => {
  $$(el).tooltip({
    text: label,
    position: 'right',
    portal: true,         // required to escape overflow: hidden
    containToScroll: false,
  });
});
```

## Why Portal + Anchor Positioning Is Fundamentally Broken Across Shadow DOM

### The Catch-22

There are two requirements that cannot be simultaneously satisfied with the current portal approach:

1. **Escape overflow clipping** — requires the tooltip to be rendered outside the clipping ancestor
2. **Maintain CSS anchor resolution** — requires the tooltip and anchor to share the same tree scope

Portal solves (1) by moving the tooltip DOM node to `document.body`. But this breaks (2) because `anchor-name` declared inside a shadow root is invisible to elements in the light DOM. The browser silently fails — no error, no positioning.

Without portal, the tooltip stays in the shadow root (anchor resolves correctly) but gets clipped by the outer `overflow: hidden`. Either way, it's visually broken.

### Secondary Bugs When Portal Is Active

Even ignoring the anchor resolution failure, portal creates additional issues:

**Stale scroll listeners.** `attach.bindScroll()` runs at creation time and walks `$el.scrollParent({ all: true })` from the tooltip's current DOM position. After portal moves the tooltip to `document.body`, the scroll ancestry changes entirely. The original listeners fire for irrelevant containers; the actual scroll containers near the trigger have no listeners.

**Portal and moveElement conflict.** `attach` has a `moveElement` option that moves the tooltip to the anchor's `positioningParent()`. If both `portal` and `moveElement` are active, they fight over where the element lives — whichever runs second wins and invalidates the other's assumptions.

**`clippingParent()` resolves against wrong ancestry.** After portal, `checkInView()` calls `$el.clippingParent()` which returns the clipping ancestor relative to `document.body`, not relative to the trigger's visual context.

## Solution: Replace Portal with Always-On Top Layer

### How It Works

The [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) promotes elements to the browser's **top layer** — a rendering layer that sits above all other content, escaping `overflow: hidden`, `z-index` stacking contexts, and `clip-path` without moving the element in the DOM.

This means:

- The tooltip stays in the shadow root → `anchor-name` resolves correctly
- The browser renders it above all clipping ancestors → no visual clipping
- No DOM movement → scroll listeners remain valid, no positioning context changes
- `checkInView` / `clippingParent` work against the correct ancestry

### Why This Should Not Be Opt-In

Top layer promotion via `popover="manual"` has zero cost:

- No DOM mutation
- No added event listeners (unlike `popover="auto"`)
- No change to containing block or positioning context
- No interference with CSS `position: absolute` or anchor positioning
- No behavioral side effects whatsoever

It is purely a rendering-layer promotion. Every tooltip benefits from it — even tooltips that aren't currently clipped, because they *could* be clipped if the page layout changes. Making this a setting just creates a footgun where users discover clipping and have to hunt for a flag.

Browser support confirms this: `popover` shipped in all browsers before CSS anchor positioning. If a user's browser supports `anchor-name`, it supports `popover`. No feature detection needed.

## Changes

### `tooltip.js`

**Remove the `portal` setting entirely.** Do not replace it with an `escape` setting. Top layer is always on.

**Keep `containToScroll`.** This setting is orthogonal to overflow escape. It controls whether the fallback position search constrains to the scroll container or the full viewport — a UX decision, not a clipping workaround. A tooltip in the top layer still needs to decide whether "in view" means "visible within the scrollable area" or "visible on screen." This remains a useful pass-through to attach.

**Remove the `Portal` import.** Tooltip no longer depends on the portal behavior.

**Add `popover="manual"` unconditionally in `createTooltip`:**

```js
// In createTooltip(), replace:
if (settings.portal) {
  self.$tooltip.portal('body');
}

// With (unconditional, no setting):
self.$tooltip.attr('popover', 'manual');
```

**Call `showPopover()` / `hidePopover()` in show/hide:**

```js
// In show(), before attach:
self.$tooltip.el().showPopover();

// In hide(), after animation completes:
self.$tooltip.el().hidePopover();
```

**Settings removed from `tooltip.js`:**

| Setting | Reason for removal |
|---|---|
| `portal` | Replaced by always-on top layer. No opt-in needed. |

**Imports removed:**

```diff
- import { Portal } from '../portal/portal.js';
```

### `attach.js`

**Remove `moveElement` setting and `maybeMoveElement()` method.** This relocated the positioned element to match the anchor's `positioningParent()`. With top layer, the element never needs to move — it stays inline next to its activating element, which is the preferred behavior for styling and maintainability. Keeping elements co-located in the DOM means they inherit the same custom properties, share the same tree scope for anchor resolution, and are easy to target with relative selectors.

**Keep `containToScroll`.** This controls whether the fallback position search constrains to `scrollParent()` or `clippingParent()`. This is a legitimate UX decision — sometimes you want a popup to stay within a scrolled container, sometimes you want it to use the full viewport. This is independent of overflow escape.

**Settings removed from `attach.js`:**

| Setting | Reason for removal |
|---|---|
| `moveElement` | Element should stay inline next to activating element. Easier to style, maintains tree scope, no positioning context mismatch. |

**Methods removed:**

| Method | Reason |
|---|---|
| `maybeMoveElement()` | Only existed to fix portal-induced positioning context mismatch. |

### `portal.js`

**No changes.** Portal continues to exist as a general-purpose behavior for cases where DOM relocation is genuinely needed (modals, drawers, overlays that need to escape stacking contexts without anchor positioning). It just stops being used by tooltip.

### `attach.css`

**No changes.** Arrow positioning via `data-position` is unaffected since the element's DOM position hasn't changed.

## Renaming: Portal References Across the Codebase

The `portal` setting on tooltip needs to be removed, not renamed. However, there may be references to it across docs, examples, and consuming code.

### Search and remove

Grep for these patterns and update accordingly:

```
# Tooltip-specific portal usage — remove the setting entirely
portal: true
portal: false
portal: 'body'
settings.portal

# Tooltip documentation references
"portal tooltip"
"escape overflow" (update to explain this is now automatic)
```

### Migration path for consumers

**Before:**
```js
$el.tooltip({
  text: 'Dashboard',
  position: 'right',
  portal: true,
  containToScroll: false,
});
```

**After:**
```js
$el.tooltip({
  text: 'Dashboard',
  position: 'right',
  containToScroll: false,
});
```

`portal` is gone. `containToScroll` remains — it controls fallback positioning behavior, not overflow escape. If a consumer passes `portal`, it should be silently ignored or emit a one-time deprecation warning during a transition period.

### Deprecation warnings (optional, for transition period)

```js
// In tooltip onCreated or initialize:
if ('portal' in settings) {
  warn('tooltip: "portal" setting is deprecated and ignored. Tooltips now automatically escape overflow clipping via the top layer.');
}
```

## Top Layer Considerations

### `popover="manual"` vs `popover="auto"`

Use `manual`. The `auto` variant adds light-dismiss behavior (clicking outside closes it) and auto-closes other auto popovers. Tooltips need none of that — show/hide is already controlled by the trigger events. `manual` gives full programmatic control with no side effects.

### Stacking Order

Top layer stacking is last-shown-on-top. This matches tooltip behavior naturally — the most recently shown tooltip is the one the user is interacting with and should be on top.

### Interaction with Existing Tooltip Logic

`popover="manual"` does not:

- Add any event listeners (no light dismiss, no keyboard handling)
- Interfere with CSS positioning (`position: absolute` still works)
- Change the element's containing block
- Affect `display` — you still control visibility via classes/transitions

It only does one thing: promotes the element to the top layer when `showPopover()` is called, and removes it when `hidePopover()` is called.

## Summary

| Concern | Portal (current) | Top Layer (proposed) |
|---|---|---|
| Escapes `overflow: hidden` | ✅ | ✅ (always, automatically) |
| Anchor resolution across shadow DOM | ❌ Broken | ✅ Same tree scope |
| Scroll listener accuracy | ❌ Stale after move | ✅ Unchanged |
| Positioning context | ❌ Changes to body | ✅ Unchanged |
| DOM mutation | Yes (detach + append) | None |
| Arrow positioning | ❌ No anchor = no position | ✅ Works normally |
| Settings required | `portal: true, containToScroll: false` | None (containToScroll still available for UX control) |
| Browser support | N/A | All browsers with anchor positioning |

**Net result:** One setting removed from tooltip (`portal`), one setting and one method removed from attach (`moveElement`, `maybeMoveElement`), one import dependency dropped. `containToScroll` remains as a legitimate UX control. The tooltip API surface shrinks and the default behavior is correct without configuration.
