# Rename Tooltip Behavior to Popover

## Goal

Rename the `tooltip` behavior to `popover` across the entire codebase. The current behavior is trigger-agnostic (hover, click, focus, manual), supports rich structured content (html, header, text), uses the Popover API internally via the `escape` behavior, and is the general-purpose floating overlay primitive. The name "tooltip" undersells the capability and conflicts with industry expectations that a tooltip is a simple text-only hover hint.

This is a partial resolution of the [Naming Conventions](naming-conventions.md) plan — it locks the behavior name and frees up "tooltip" for a potential future simplified component (text-only hover primitive).

## Design

**New name:** `popover`
- Trigger-agnostic, content-agnostic — matches the actual capability
- Aligned with the web platform (HTML `popover` attribute, Popover API)
- Frees "tooltip" for a narrower, hover-only text hint if ever needed
- Makes the component wrapping story cleaner: `<ui-popover>` wraps the `popover` behavior

**What changes:**
- Behavior name, namespace, export name (`Tooltip` → `Popover`)
- Directory: `src/behaviors/tooltip/` → `src/behaviors/popover/`
- CSS class: `.tooltip` → `.popover`, `.ui.tooltip` → `.ui.popover`
- All consumer call sites: `.tooltip()` → `.popover()`, `tooltip-settings` → `popover-settings`
- Docs examples, guide pages, AI skills/context

**What doesn't change:**
- Behavior implementation logic (zero functional changes)
- Composed behaviors (attach, escape, transition) — unchanged
- Files in `ai/research/` and `ai/trash/` — read-only reference, not worth touching

## Implementation

### 1. Rename behavior source
- `mv src/behaviors/tooltip/ src/behaviors/popover/`
- Rename `tooltip.js` → `popover.js`, `tooltip.css` → `popover.css`
- Update internal references: behavior name, namespace, export, classNames, templates, CSS selectors

### 2. Update behavior barrel export
- `src/behaviors/index.js` — change import/export from `Tooltip` to `Popover`

### 3. Update consumer components (4 files)
- `src/primitives/menu/menu.js` — `.tooltip()` → `.popover()`
- `src/primitives/menu/specs/menu.component.js` + `menu.spec.json` + `menu.spec.js` — `tooltip-settings` → `popover-settings`
- `src/components/copy-button/copy-button.js` — `.tooltip()` → `.popover()`, `tooltipSettings` → `popoverSettings`
- `src/components/sidebar-toggle/sidebar-toggle.js` + `.html` + `.css` — all tooltip references

### 4. Update docs examples
- Rename `docs/src/examples/query/plugins/query-tooltip-behavior/` → `query-popover-behavior/`
- Rename `docs/src/examples/query/plugins/query-behavior/query-tooltip.js` + `.css`
- Update `docs/src/content/examples/query-tooltip-behavior.mdx` + `query-behavior.mdx` + `query-clippingparent.mdx`

### 5. Update docs pages (~10 files)
- `docs/src/pages/docs/guides/query/plugins.mdx` + `index.mdx`
- `docs/src/pages/docs/api/query/visibility.mdx`
- `docs/src/pages/ui/roadmap/*.mdx`, `start/index.mdx`, `start/ui-comparison.mdx`
- `docs/src/content/behaviors/attach.mdx`

### 6. Update docs site components (~6 files)
- `docs/src/components/Sidebar.astro` + `.css`
- `docs/src/components/CodePlayground/CodePlaygroundPreview.js` + `lib/codemirror.css`
- `docs/src/components/CodeSample/CodeSample.js`
- `docs/src/css/code-formatting.css`

### 7. Update AI context (~6 files)
- `ai/skills/authoring/query-behaviors.md` + `component-behaviors.md`
- `ai/skills/essentials/overview.md` + `mental-model.md`
- `ai/skills/contributing/internals.md` + `repo-guide.md` + others

### 8. Update roadmap and related plans
- `ai/plans/ROADMAP.md` — behavior list, dependency graph references
- `ai/plans/naming-conventions.md` — mark tooltip/popup/popover as resolved for the behavior
- `ai/plans/component-wrapping-behavior.md` — update to reference `popover` behavior
- `CLAUDE.md` memory section about tooltip → escape migration
- `CHANGELOG.md`
- `package.json` if any tooltip references

## Dependencies

None — pre-1.0, no downstream consumers.

## Status

Scoped. Purely mechanical rename, no design decisions remaining.
