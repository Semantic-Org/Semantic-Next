# Query Package - Missing Methods Proposal

> **For:** Framework review and implementation planning  
> **Status:** Draft for discussion  
> **Context:** Based on analysis of existing Query implementation vs jQuery-like expectations

---


## Medium Priority - Modern Visibility

### `show(options)`
Show elements with optional CSS animation integration.

- `options.animation` - String CSS animation name or transition
- `options.duration` - String CSS duration value  
- `options.timing` - String CSS timing function

**Returns:** Query instance for chaining

### `hide(options)`
Hide elements with optional CSS animation integration.

- `options.animation` - String CSS animation name or transition
- `options.duration` - String CSS duration value
- `options.timing` - String CSS timing function  

**Returns:** Query instance for chaining

### `toggle(force)`
Toggle element visibility.

- `force` - Boolean to force show (true) or hide (false), undefined for toggle

**Returns:** Query instance for chaining

### `visible()`
Check if elements are visible (not display:none, visibility:hidden, or 0 opacity).

**Returns:** Boolean true if any element is visible

---
