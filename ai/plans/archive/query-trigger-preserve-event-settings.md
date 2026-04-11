# Query: Preserve eventSettings in trigger() native shortcut

**Risk: Low** | **Type: Bug** | **Status: Rejected**

## Problem

When `trigger()` is called with `eventSettings` (e.g., `$el.trigger('click', { detail: { id: 5 } })`), the native-method shortcut `el[eventName]()` fires first for any event with a matching DOM method (`click`, `focus`, `blur`, `reset`, `select`), silently discarding the user's `eventSettings`.

## Rejection Reason

The current behavior is intentional by design. `trigger()` is the "native behavior" path — `el.click()` is trusted by the browser and triggers default actions (link navigation, checkbox toggle, form submit). A `CustomEvent('click')` dispatched via `dispatchEvent` is NOT trusted and would skip default behavior.

The library already provides `dispatchEvent(eventName, eventData, eventSettings)` as the explicit "custom data" path. The two methods serve different purposes:
- `trigger()` — native behavior, trusted events
- `dispatchEvent()` — custom data via CustomEvent detail

Skipping the native shortcut when eventSettings is provided would break `trigger('click', settings)` on `<a>` tags (no navigation), checkboxes (no toggle), and form submits.
