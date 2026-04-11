# Component Naming Conventions

## Goal

Lock the naming philosophy for all ~80 components before building them. Names are permanent — they become tag names, import paths, doc URLs, and mental models. Getting them wrong means either living with confusion or doing a breaking rename.

## Key Decisions

### Tooltip / Popup / Popover

Classic SUI used "popup" for everything — hover tooltips, click popovers, rich content popups. The industry has since fragmented:
- Radix: Tooltip + Popover + HoverCard (3 components)
- Headless UI: Popover only
- MUI: Tooltip + Popover + Popper (3 components)
- Mantine: Tooltip + Popover (2 components)
- Chakra: Tooltip + Popover (2 components)

SUI Next already has `tooltip` as a behavior. The question: what's the web component called, and is it one component or several?

Options:
- `<ui-popup>` — classic SUI name, covers all floating content
- `<ui-tooltip>` + `<ui-popover>` — split by interaction type
- `<ui-popup>` with `type="tooltip"` / `type="popover"` — one component, explicit modes

### General Philosophy

- Use common names people search for vs SUI-specific names?
- Compound names: `<ui-form-field>` vs `<ui-field>` vs `<ui-form-input>`?
- Layout primitives: `<ui-flex>` / `<ui-grid>` / `<ui-stack>` — are these components or just CSS tokens?
- Do components that are purely behavioral (no visual) deserve a tag name?

### Names That Differ From Research

Cross-reference with `ai/research/components/_list/ui-list.md` — the master list uses common industry names. Some may need SUI-specific alternatives.

## Dependencies

None — this can be decided anytime. But it blocks naming the tag for every new component.

## Status

Initial scope. Partially resolved (existing 14 primitives are named). Open for remaining ~66 components.
