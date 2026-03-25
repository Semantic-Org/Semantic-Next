# Mantine — Component Documentation Structure
## Component Analyzed: Select
## URL: https://mantine.dev/core/select/

## Page Chrome

The page uses a three-column layout:
- **Left sidebar**: Category-grouped component navigation (Layout, Inputs, Combobox, Buttons, etc.). Select is nested under the "Combobox" category.
- **Center**: Main documentation content.
- **Right sidebar**: Scrollable table of contents listing all H2 sections on the current page.

At the very top of the content area:
- **H1**: "Select"
- **Subtitle**: "Custom searchable select" (one-line description)
- **Meta links row**: Source (GitHub), Docs (edit page), Package (@mantine/core npm link)
- **Prev/Next navigation** at the very bottom links to adjacent components (PillsInput, TagsInput).

## Section Taxonomy (in page order)

### 1. Made with Combobox
- **Purpose**: Immediately sets expectations — this is an opinionated wrapper, not the full-power primitive. Directs advanced users elsewhere.
- **Content type**: Short prose with inline link to the Combobox component page.
- **Notes**: Functions as a "relationship callout" — establishing the component's place in the hierarchy. Not styled as an alert box; rendered as regular prose. This is a Mantine-specific pattern: compound components explain their lineage up front.

### 2. Usage
- **Purpose**: "How do I use this component at the most basic level?"
- **Content type**: Prose sentence ("Select allows capturing user input based on suggestions from the list"), followed by a live interactive demo with collapsible code.
- **Notes**: The demo is preview-first: the interactive component renders at the top inside a bordered container, with a "Demo.tsx" label and an "Expand code" toggle below it. Import is embedded in the code block, not called out separately.

### 3. Controlled
- **Purpose**: "How do I manage the value with React state?"
- **Content type**: Prose note ("value must be a string") + code example with useState.
- **Notes**: Short section. Prose warns about a constraint before showing the pattern.

### 4. onChange handler
- **Purpose**: "What arguments does the callback receive?"
- **Content type**: Prose explaining the two arguments, followed by expandable code example.
- **Notes**: Documents the callback signature rather than showing a visual demo.

### 5. autoSelectOnBlur
- **Purpose**: "How do I auto-select the highlighted option on blur?"
- **Content type**: Prose + live demo.
- **Notes**: Single-prop feature section.

### 6. Clearable
- **Purpose**: "How do I add a clear button?"
- **Content type**: Prose with bullet-point conditions for when the clear button appears, followed by live demo.
- **Notes**: The conditions list is a notable pattern — enumerating the exact circumstances under which the feature activates.

### 7. Allow deselect
- **Purpose**: "Can the user click a selected option to deselect it?"
- **Content type**: Prose + two side-by-side live demos (with/without deselect).
- **Notes**: Comparative demo pattern — showing the prop enabled vs disabled to make behavior differences immediately visible.

### 8. Searchable
- **Purpose**: "How do I enable type-ahead filtering?"
- **Content type**: Prose + live demo.
- **Notes**: Single-prop feature section.

### 9. Controlled search value
- **Purpose**: "How do I manage the search input programmatically?"
- **Content type**: Prose + code block (no live demo).
- **Notes**: More advanced/niche — code-only, no visual demo needed.

### 10. Nothing found
- **Purpose**: "How do I show a message when no options match?"
- **Content type**: Prose + live demo.
- **Notes**: Single-prop feature section.

### 11. Checked option icon
- **Purpose**: "How do I control the check icon on selected items?"
- **Content type**: Prose + four demo variations (different icon positions/styles).
- **Notes**: Multiple demo variants in one section — showing the full range of a feature.

### 12. Data formats
- **Purpose**: "What shapes can I pass to the `data` prop?"
- **Content type**: Four separate expandable code examples showing string arrays, value/label objects, grouped data, and disabled items.
- **Notes**: Pure reference section — no live demos, just code patterns. Exhaustive enumeration of valid formats.

### 13. Options filtering
- **Purpose**: "How do I write a custom filter function?"
- **Content type**: Prose explaining the filter object shape + live demo with custom filter.
- **Notes**: Documents the internal API (filter function receives object with `options`, `search`, `limit`).

### 14. Sort options
- **Purpose**: "How do I change option ordering?"
- **Content type**: Prose + live demo with custom sort.
- **Notes**: Follows the pattern of explaining default behavior first, then showing how to override.

### 15. Large data sets
- **Purpose**: "How do I handle 100k+ options without performance issues?"
- **Content type**: Prose recommending a strategy (limit visible results + search) + live demo with 100,000 items.
- **Notes**: Performance-focused section. Practical recommendation before code.

### 16. renderOption
- **Purpose**: "How do I customize how each option renders?"
- **Content type**: Prose + detailed code example + live demo.
- **Notes**: Render-prop pattern documentation — shows the callback signature and a rich example.

### 17. Scrollable dropdown
- **Purpose**: "How does dropdown scrolling work, and can I use native scroll?"
- **Content type**: Prose + two comparative demos (ScrollArea.Autosize vs native scroll).
- **Notes**: Another comparative demo pair showing default vs alternative behavior.

### 18. Group options
- **Purpose**: "How do I group options under headings?"
- **Content type**: Prose + live demo with grouped data structure.
- **Notes**: Shows the data format required for grouping.

### 19. Disabled options
- **Purpose**: "How do I disable specific options?"
- **Content type**: Prose ("cannot be selected and is skipped on keyboard navigation") + live demo.
- **Notes**: Documents both visual and behavioral aspects of disabled state.

### 20. Combobox props
- **Purpose**: "How do I pass props through to the underlying Combobox?"
- **Content type**: Prose + two expandable code blocks.
- **Notes**: Escape hatch documentation — how to reach the underlying primitive.

### 21. Change dropdown z-index
- **Purpose**: "How do I fix z-index stacking issues?"
- **Content type**: Single code block, no prose.
- **Notes**: Minimal recipe section — just the solution code. No explanation needed.

### 22. Inside Popover
- **Purpose**: "How do I use Select inside a Popover without portal conflicts?"
- **Content type**: Prose (must set `withinPortal: false`) + live demo.
- **Notes**: Composition gotcha documentation.

### 23. Control dropdown opened state
- **Purpose**: "How do I programmatically open/close the dropdown?"
- **Content type**: Prose + live demo.
- **Notes**: Controlled state pattern.

### 24. Dropdown position
- **Purpose**: "How do I change where the dropdown appears?"
- **Content type**: Prose (defaults to bottom, flips if no space) + live demo.
- **Notes**: Documents default behavior and override.

### 25. Dropdown width
- **Purpose**: "How do I change dropdown width?"
- **Content type**: Prose + live demo.
- **Notes**: Single-prop tweak.

### 26. Dropdown offset
- **Purpose**: "How do I adjust spacing between input and dropdown?"
- **Content type**: Prose + code example.
- **Notes**: Code-only, no live demo.

### 27. Prevent horizontal infinite scrolling
- **Purpose**: "How do I fix a horizontal scroll bug with wide dropdowns?"
- **Content type**: Code solution with brief prose.
- **Notes**: Bug workaround / edge case fix.

### 28. Dropdown animation
- **Purpose**: "How do I enable/configure dropdown transitions?"
- **Content type**: Prose ("disabled by default") + live demo.
- **Notes**: Opt-in feature with link to Transition component docs.

### 29. Dropdown padding
- **Purpose**: "How do I adjust internal padding of the dropdown?"
- **Content type**: Two comparative demos showing different padding values.
- **Notes**: Visual comparison, minimal prose.

### 30. Dropdown shadow
- **Purpose**: "How do I add shadow to the dropdown?"
- **Content type**: Prose + live demo.
- **Notes**: Single-prop visual tweak.

### 31. Left and right sections
- **Purpose**: "How do I add icons or elements to the input's left/right sides?"
- **Content type**: Prose + two side-by-side demos.
- **Notes**: Shows the leftSection/rightSection props inherited from Input.

### 32. Input props
- **Purpose**: "What visual variants, sizes, and states does this input support?"
- **Content type**: Prose referencing Input component features + interactive configurator panel with variant/size/radius/label/description/error controls and a live preview that updates in real time.
- **Notes**: This is the "playground" or "configurator" section. The interactive control panel lets users toggle variants (Default, Filled, Unstyled), sizes (xs-xl), radius (xs-xl), and see label/description/error states. Links to Input documentation for full details.

### 33. Read only
- **Purpose**: "How does read-only state look and behave?"
- **Content type**: Prose + live demo.
- **Notes**: Single-prop state.

### 34. Disabled
- **Purpose**: "How does disabled state look and behave?"
- **Content type**: Prose + live demo.
- **Notes**: Single-prop state.

### 35. Error state
- **Purpose**: "How do I show validation errors?"
- **Content type**: Prose + two comparative demos (boolean error vs error message string).
- **Notes**: Two variants of the same feature shown side by side.

### 36. Styles API
- **Purpose**: "What CSS selectors can I target for custom styling?"
- **Content type**: Interactive selector table + expandable code example. Table columns list selector names (wrapper, input, section, root, label, required, description, error, dropdown, options, option, empty, group, groupLabel) with descriptions. Hovering a selector highlights the corresponding part of a rendered component preview.
- **Notes**: This is Mantine's signature pattern — an interactive "anatomy" view where hovering table rows highlights visual regions. Bridges the gap between CSS class names and their visual targets.

### 37. Get element ref
- **Purpose**: "How do I get a DOM ref to the underlying input?"
- **Content type**: Single code block.
- **Notes**: Minimal recipe — just the code pattern.

### 38. Accessibility
- **Purpose**: "How do I ensure this component is accessible?"
- **Content type**: Three code examples showing correct/incorrect patterns (with label, with aria-label, without label as anti-pattern).
- **Notes**: Shows the "do this / don't do this" pattern. Code-only, no live demos.

## Overall Pattern

Mantine's component documentation follows a **feature-complete single page** philosophy. Everything about the Select component lives on one long page, organized in a specific progression:

1. **Identity and lineage** — What is this? What is it built on? (Made with Combobox)
2. **Basic usage** — Minimal working example
3. **State management** — Controlled, onChange, search value
4. **Feature catalog** — Every boolean/enum prop gets its own H2 with a live demo (Clearable, Searchable, Allow deselect, etc.)
5. **Data handling** — Data formats, filtering, sorting, large datasets, custom rendering
6. **Dropdown behavior** — Positioning, width, offset, z-index, animation, padding, shadow, scroll
7. **Composition edge cases** — Inside Popover, portal conflicts
8. **Inherited features** — Input props (variant/size/radius configurator), left/right sections, states (readonly, disabled, error)
9. **Styling escape hatch** — Styles API with interactive selector table
10. **Plumbing** — Ref access
11. **Accessibility** — ARIA patterns

**Key patterns:**
- **Demo-first**: Live interactive preview appears above code. Code is collapsed by default ("Expand code").
- **One feature per section**: Almost every prop or feature gets its own H2. Sections are short (1-2 paragraphs + 1 demo).
- **Comparative demos**: When a prop has two meaningful states, two demos are shown side by side.
- **Progressive complexity**: Basic usage first, advanced customization (renderOption, filter functions) in the middle, edge cases and escape hatches at the end.
- **No standalone props table on page**: Props are documented implicitly through the feature sections. The Styles API table serves as the closest thing to a reference table.
- **Delegation pattern**: The page explicitly says "see Input documentation" for inherited features rather than duplicating them. The "Made with Combobox" callout at the top similarly delegates to the primitive.
- **Right-side TOC**: A floating table of contents on the right sidebar lists all H2 sections, enabling random access into the long page.
- **No installation section**: Mantine assumes you already have the package installed. No import/install instructions at the page level.
