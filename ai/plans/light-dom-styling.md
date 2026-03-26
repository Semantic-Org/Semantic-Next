# Light DOM Style Leaking

## Goal

Solve how components like table, header, and others that need styles to leak into light DOM (slotted content) work within Shadow DOM encapsulation. This is a framework-level pattern that must be solved once before building components that depend on it.

## Problem

Shadow DOM encapsulates styles — that's the point. But some components need their styles to reach into light DOM content:
- `<ui-table>` needs to style `<tr>`, `<td>`, `<th>` that are slotted in
- `<ui-header>` (if it exists) needs to style arbitrary heading content
- Any component that wraps user-provided HTML structure

`::slotted()` is limited — it only targets direct children of the slot, not nested elements. So `::slotted(tr td)` doesn't work.

## Options

- Constructable stylesheets adopted to the light DOM (already have `adoptStylesheet` util)
- CSS `@scope` (emerging spec, limited browser support)
- `part` and `::part()` for specific piercing
- Render in light DOM entirely (no shadow DOM for these components)
- Hybrid approach — shadow DOM for component chrome, light DOM for content area

## Dependencies

- Token finalization (styles need final token values)

## Status

Initial scope. Blocks: table, header, and any primitive with rich slotted content.
