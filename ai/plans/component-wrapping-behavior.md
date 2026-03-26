# Component Wrapping Behavior Pattern

## Goal

Establish the canonical pattern for web components that wrap an existing Query behavior. Tooltip is already a behavior — `<ui-popup>` (or whatever it's called) would be a declarative web component that uses it internally. This pattern will recur for accordion, dropdown, tabs, and others.

## Problem

Behaviors and components serve different audiences:
- **Behavior**: imperative, JS-first — `$('.trigger').tooltip({ content: 'Hello' })`
- **Component**: declarative, HTML-first — `<ui-popup content="Hello"><button>Hover</button></ui-popup>`

Both need to coexist. The component shouldn't reimplement what the behavior already does — it should wrap it. But the wiring isn't obvious:
- How does the component invoke the behavior on itself or its trigger element?
- How do component settings map to behavior settings?
- How does the component lifecycle (connectedCallback/disconnectedCallback) interact with the behavior lifecycle (initialize/destroy)?
- Does the component own the behavior instance, or does the behavior attach independently?

## Components That Need This

- popup/tooltip/popover (wraps tooltip behavior)
- accordion (if built as behavior + component)
- dropdown (may need both imperative and declarative API)
- tabs (same)
- transition-wrapper? (wraps transition behavior)

## Dependencies

- Naming conventions (popup vs tooltip vs popover — see naming-conventions.md)

## Status

Initial scope. Framework architecture decision needed before building Tier 1 primitives.
